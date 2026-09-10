console.log("sindilegis.js carregado");


const REDE_SINDILEGIS = "sindilegis";


// ============================================================
// BUSCAR BAIRROS CONFORME LOCALIZAÇÃO
// ============================================================

async function obterBairrosPorLocalizacaoSindilegis(filtros) {

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
// BUSCAR CLÍNICAS SINDILEGIS
// ============================================================

async function buscarClinicasSindilegis() {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {
        return;
    }


    try {

        resultado.innerHTML = `
            <div class="carregando">
                <div class="spinner"></div>
                <p>Buscando clínicas Sindilegis...</p>
            </div>
        `;


        const filtros =
            obterFiltros();


        console.log(
            "Filtros Sindilegis:",
            filtros
        );


        const bairroIds =
            await obterBairrosPorLocalizacaoSindilegis(
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
        // CLÍNICAS
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


        if (
            !clinicas ||
            clinicas.length === 0
        ) {

            mostrarClinicas([]);

            return;
        }


        // ----------------------------------------------------
        // ESPECIALIDADES DA REDE SINDILEGIS
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
                REDE_SINDILEGIS
            )
            .eq(
                "ativo",
                true
            );


        if (erroVinculos) {
            throw erroVinculos;
        }


        // ----------------------------------------------------
        // SOMENTE CLÍNICAS QUE POSSUEM VÍNCULO SINDILEGIS
        // ----------------------------------------------------

        const clinicasDaRede =
            clinicas.filter(
                clinica =>
                    (vinculos || []).some(
                        vinculo =>
                            vinculo.clinica_id ===
                            clinica.id
                    )
            );


        // ----------------------------------------------------
        // ADICIONAR VÍNCULOS
        // ----------------------------------------------------

        const resultadoFinal =
            clinicasDaRede.map(
                clinica => ({

                    ...clinica,

                    clinica_especialidades:
                        (vinculos || [])
                            .filter(
                                vinculo =>
                                    vinculo.clinica_id ===
                                    clinica.id
                            )

                })
            );


        // ----------------------------------------------------
        // FILTRO ESPECIALIDADE
        // ----------------------------------------------------

        let clinicasFiltradas =
            resultadoFinal;


        if (filtros.especialidadeId) {

            clinicasFiltradas =
                resultadoFinal.filter(
                    clinica =>
                        clinica
                            .clinica_especialidades
                            ?.some(
                                vinculo =>
                                    String(
                                        vinculo.especialidade_id
                                    ) ===
                                    String(
                                        filtros.especialidadeId
                                    )
                            )
                );

        }


        // ----------------------------------------------------
        // REMOVER DUPLICADOS
        // ----------------------------------------------------

        const mapa =
            new Map();


        clinicasFiltradas.forEach(
            clinica => {

                mapa.set(
                    clinica.id,
                    clinica
                );

            }
        );


        mostrarClinicas(
            Array.from(
                mapa.values()
            )
        );


    } catch (erro) {

        console.error(
            "Erro ao buscar clínicas Sindilegis:",
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
                    onclick="buscarClinicasSindilegis()"
                >
                    🔄 Tentar novamente
                </button>

            </div>

        `;

    }

}


// ============================================================
// BOTÃO
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
            buscarClinicasSindilegis
        );


        console.log(
            "Botão da Rede Sindilegis configurado."
        );

    }
);


// ============================================================
// EXPORTAR
// ============================================================

window.buscarClinicasSindilegis =
    buscarClinicasSindilegis;

window.obterBairrosPorLocalizacaoSindilegis =
    obterBairrosPorLocalizacaoSindilegis;
