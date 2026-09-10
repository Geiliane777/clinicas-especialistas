console.log("especialistas.js carregado");


const REDE_ESPECIALISTAS = "especialistas";


// ============================================================
// BUSCAR BAIRROS CONFORME LOCALIZAÇÃO
// ============================================================

async function obterBairrosPorLocalizacao(filtros) {

    if (filtros.bairroId) {

        return [filtros.bairroId];

    }


    if (filtros.cidadeId) {

        const { data, error } = await supabaseClient
            .from("bairros")
            .select("id")
            .eq(
                "cidade_id",
                filtros.cidadeId
            );


        if (error) {
            throw error;
        }


        return (data || []).map(
            bairro => bairro.id
        );
    }


    if (filtros.estadoId) {

        const { data: cidades, error: erroCidades } =
            await supabaseClient
                .from("cidades")
                .select("id")
                .eq(
                    "estado_id",
                    filtros.estadoId
                );


        if (erroCidades) {
            throw erroCidades;
        }


        const cidadeIds =
            (cidades || []).map(
                cidade => cidade.id
            );


        if (cidadeIds.length === 0) {
            return [];
        }


        const { data: bairros, error: erroBairros } =
            await supabaseClient
                .from("bairros")
                .select("id")
                .in(
                    "cidade_id",
                    cidadeIds
                );


        if (erroBairros) {
            throw erroBairros;
        }


        return (bairros || []).map(
            bairro => bairro.id
        );
    }


    if (filtros.regiaoId) {

        const { data: estados, error: erroEstados } =
            await supabaseClient
                .from("estados")
                .select("id")
                .eq(
                    "regiao_id",
                    filtros.regiaoId
                );


        if (erroEstados) {
            throw erroEstados;
        }


        const estadoIds =
            (estados || []).map(
                estado => estado.id
            );


        if (estadoIds.length === 0) {
            return [];
        }


        const { data: cidades, error: erroCidades } =
            await supabaseClient
                .from("cidades")
                .select("id")
                .in(
                    "estado_id",
                    estadoIds
                );


        if (erroCidades) {
            throw erroCidades;
        }


        const cidadeIds =
            (cidades || []).map(
                cidade => cidade.id
            );


        if (cidadeIds.length === 0) {
            return [];
        }


        const { data: bairros, error: erroBairros } =
            await supabaseClient
                .from("bairros")
                .select("id")
                .in(
                    "cidade_id",
                    cidadeIds
                );


        if (erroBairros) {
            throw erroBairros;
        }


        return (bairros || []).map(
            bairro => bairro.id
        );
    }


    return null;
}


// ============================================================
// BUSCAR CLÍNICAS
// ============================================================

async function buscarClinicas() {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {
        return;
    }


    try {

        resultado.innerHTML = `
            <div class="carregando">
                <div class="spinner"></div>
                <p>Buscando clínicas...</p>
            </div>
        `;


        const filtros =
            obterFiltros();


        console.log(
            "Filtros selecionados:",
            filtros
        );


        // ----------------------------------------------------
        // LOCALIZAÇÃO
        // ----------------------------------------------------

        const bairroIds =
            await obterBairrosPorLocalizacao(
                filtros
            );


        if (
            bairroIds !== null &&
            bairroIds.length === 0
        ) {

            mostrarClinicas([]);

            return;
        }


        // ----------------------------------------------------
        // BUSCAR CLÍNICAS
        // ----------------------------------------------------

        let consulta =
            supabaseClient
                .from("clinicas")
                .select(`
                    id,
                    nome,
                    telefone,
                    endereco,
                    numero,
                    complemento,
                    cep,
                    bairro_id,
                    ativo,
                    bairros (
                        id,
                        nome,
                        cidades (
                            id,
                            nome,
                            estados (
                                id,
                                nome,
                                regioes (
                                    id,
                                    nome
                                )
                            )
                        )
                    )
                `)
                .eq(
                    "ativo",
                    true
                );


        if (
            bairroIds !== null &&
            bairroIds.length > 0
        ) {

            consulta = consulta.in(
                "bairro_id",
                bairroIds
            );

        }


        const {
            data: clinicas,
            error: erroClinicas
        } = await consulta;


        if (erroClinicas) {
            throw erroClinicas;
        }


        console.log(
            "Clínicas encontradas:",
            clinicas
        );


        if (
            !clinicas ||
            clinicas.length === 0
        ) {

            mostrarClinicas([]);

            return;
        }


        // ----------------------------------------------------
        // BUSCAR ESPECIALIDADES
        // ----------------------------------------------------

        const clinicaIds =
            clinicas.map(
                clinica => clinica.id
            );


        const {
            data: vinculos,
            error: erroVinculos
        } = await supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
                clinica_id,
                especialidade_id,
                rede,
                ativo,
                especialidades (
                    id,
                    nome
                )
            `)
            .in(
                "clinica_id",
                clinicaIds
            )
            .eq(
                "rede",
                REDE_ESPECIALISTAS
            )
            .eq(
                "ativo",
                true
            );


        if (erroVinculos) {
            throw erroVinculos;
        }


        console.log(
            "Vínculos de especialidades:",
            vinculos
        );


        // ----------------------------------------------------
        // ADICIONAR ESPECIALIDADES ÀS CLÍNICAS
        // ----------------------------------------------------

        const mapaEspecialidades =
            new Map();


        (vinculos || []).forEach(
            vinculo => {

                if (
                    !mapaEspecialidades.has(
                        vinculo.clinica_id
                    )
                ) {

                    mapaEspecialidades.set(
                        vinculo.clinica_id,
                        []
                    );

                }


                if (
                    vinculo.especialidades
                ) {

                    mapaEspecialidades
                        .get(vinculo.clinica_id)
                        .push(
                            vinculo.especialidades
                        );

                }

            }
        );


        const resultadoFinal =
            clinicas.map(
                clinica => ({

                    ...clinica,

                    clinica_especialidades:
                        (vinculos || [])
                            .filter(
                                item =>
                                    item.clinica_id ===
                                    clinica.id
                            )

                })
            );


        // ----------------------------------------------------
        // FILTRO POR ESPECIALIDADE
        // ----------------------------------------------------

        let clinicasFiltradas =
            resultadoFinal;


        if (filtros.especialidadeId) {

            clinicasFiltradas =
                resultadoFinal.filter(
                    clinica => {

                        return (
                            clinica
                                .clinica_especialidades
                                ?.some(
                                    vinculo =>
                                        String(
                                            vinculo.especialidade_id
                                        ) ===
                                        String(
                                            filtros.especialidadeId
                                        ) &&
                                        vinculo.rede ===
                                            REDE_ESPECIALISTAS &&
                                        vinculo.ativo === true
                                )
                        );

                    }
                );

        }


        // ----------------------------------------------------
        // REMOVER DUPLICADOS
        // ----------------------------------------------------

        const mapaClinicas =
            new Map();


        clinicasFiltradas.forEach(
            clinica => {

                mapaClinicas.set(
                    clinica.id,
                    clinica
                );

            }
        );


        const listaFinal =
            Array.from(
                mapaClinicas.values()
            );


        console.log(
            "Resultado final:",
            listaFinal
        );


        mostrarClinicas(
            listaFinal
        );


    } catch (erro) {

        console.error(
            "Erro ao buscar clínicas:",
            erro
        );


        resultado.innerHTML = `

            <div class="erroResultado">

                <div class="icone-erro">
                    ⚠️
                </div>

                <h2>
                    Não foi possível carregar as clínicas
                </h2>

                <p>
                    Ocorreu um erro ao consultar os dados.
                </p>

                <button
                    type="button"
                    class="btn-tentar"
                    onclick="buscarClinicas()"
                >
                    🔄 Tentar novamente
                </button>

            </div>

        `;

    }

}


// ============================================================
// BOTÃO BUSCAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botao =
            document.getElementById("buscar");


        if (!botao) {
            return;
        }


        botao.addEventListener(
            "click",
            buscarClinicas
        );


        console.log(
            "Botão da Rede Especialistas configurado."
        );

    }
);


// ============================================================
// EXPORTAR
// ============================================================

window.buscarClinicas =
    buscarClinicas;

window.obterBairrosPorLocalizacao =
    obterBairrosPorLocalizacao;
