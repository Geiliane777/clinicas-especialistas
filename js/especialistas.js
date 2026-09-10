// ============================================================
// BUSCA - REDE ESPECIALISTAS
// ============================================================

console.log("especialistas.js carregado");


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const REDE_ESPECIALISTAS = "especialistas";


// ============================================================
// BUSCAR IDs DOS BAIRROS
// A partir da localização escolhida.
// ============================================================

async function obterBairrosPorLocalizacao(filtros) {

    // --------------------------------------------------------
    // Se o usuário escolheu um bairro diretamente
    // --------------------------------------------------------

    if (filtros.bairroId) {

        return [filtros.bairroId];

    }


    // --------------------------------------------------------
    // Se escolheu uma cidade
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // Se escolheu um estado
    // --------------------------------------------------------

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


        const cidadeIds = (cidades || []).map(
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


    // --------------------------------------------------------
    // Se escolheu uma região
    // --------------------------------------------------------

    if (filtros.regiaoId) {

        // Primeiro buscamos os estados da região.

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


        const estadoIds = (estados || []).map(
            estado => estado.id
        );


        if (estadoIds.length === 0) {
            return [];
        }


        // Depois buscamos as cidades desses estados.

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


        const cidadeIds = (cidades || []).map(
            cidade => cidade.id
        );


        if (cidadeIds.length === 0) {
            return [];
        }


        // Finalmente buscamos os bairros.

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


    // --------------------------------------------------------
    // Nenhum filtro de localização
    //
    // Retornamos null para informar que não devemos aplicar
    // filtro por bairro na consulta.
    // --------------------------------------------------------

    return null;
}


// ============================================================
// BUSCAR CLÍNICAS
// ============================================================

async function buscarClinicas() {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {
        console.error(
            "Elemento #resultado não encontrado."
        );

        return;
    }


    // --------------------------------------------------------
    // Mostra mensagem enquanto pesquisa
    // --------------------------------------------------------

    resultado.innerHTML = `
        <div class="semResultado">

            <h2>Buscando clínicas...</h2>

            <p>
                Aguarde enquanto consultamos nossa rede.
            </p>

        </div>
    `;


    try {

        // ====================================================
        // OBTÉM OS FILTROS
        // ====================================================

        const filtros =
            obterFiltros();


        console.log(
            "Filtros selecionados:",
            filtros
        );


        // ====================================================
        // OBTÉM BAIRROS DE ACORDO COM A LOCALIZAÇÃO
        // ====================================================

        const bairroIds =
            await obterBairrosPorLocalizacao(
                filtros
            );


        // ----------------------------------------------------
        // Se foi escolhido algum local, mas não existem
        // bairros correspondentes, não haverá resultados.
        // ----------------------------------------------------

        if (
            bairroIds !== null &&
            bairroIds.length === 0
        ) {

            mostrarNenhumResultado();

            return;

        }


        // ====================================================
        // CONSULTA PRINCIPAL
        // ====================================================

        let consulta =
            supabaseClient

                .from("clinicas")

                .select(`
                    id,
                    nome,
                    telefone,
                    whatsapp,
                    email,
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
                    ),

                    clinica_especialidades!inner (
                        id,
                        clinica_id,
                        especialidade_id,
                        rede,
                        ativo,

                        especialidades (
                            id,
                            nome
                        )
                    )
                `)

                .eq(
                    "ativo",
                    true
                )

                .eq(
                    "clinica_especialidades.rede",
                    REDE_ESPECIALISTAS
                )

                .eq(
                    "clinica_especialidades.ativo",
                    true
                );


        // ====================================================
        // FILTRO DE BAIRRO
        // ====================================================

        if (bairroIds !== null) {

            consulta = consulta.in(
                "bairro_id",
                bairroIds
            );

        }


        // ====================================================
        // EXECUTA CONSULTA
        // ====================================================

        const {
            data: clinicas,
            error
        } = await consulta;


        if (error) {
            throw error;
        }


        console.log(
            "Clínicas encontradas:",
            clinicas
        );


        // ====================================================
        // FILTRO DE ESPECIALIDADE
        //
        // Fazemos também no JavaScript para garantir que a
        // clínica exibida realmente tenha a especialidade
        // selecionada.
        // ====================================================

        let clinicasFiltradas =
            clinicas || [];


        if (filtros.especialidadeId) {

            clinicasFiltradas =
                clinicasFiltradas.filter(
                    clinica => {

                        const especialidades =
                            Array.isArray(
                                clinica.clinica_especialidades
                            )
                                ? clinica.clinica_especialidades
                                : [];


                        return especialidades.some(
                            item => {

                                return (
                                    item.ativo === true &&
                                    item.rede ===
                                        REDE_ESPECIALISTAS &&
                                    String(
                                        item.especialidade_id
                                    ) === String(
                                        filtros.especialidadeId
                                    )
                                );

                            }
                        );

                    }
                );

        }


        // ====================================================
        // GARANTE QUE CADA CLÍNICA APAREÇA APENAS UMA VEZ
        // ====================================================

        const mapaClinicas =
            new Map();


        clinicasFiltradas.forEach(
            clinica => {

                if (!mapaClinicas.has(clinica.id)) {

                    mapaClinicas.set(
                        clinica.id,
                        clinica
                    );

                }

            }
        );


        const resultadoFinal =
            Array.from(
                mapaClinicas.values()
            );


        // ====================================================
        // MOSTRA OS RESULTADOS
        // ====================================================

        if (resultadoFinal.length === 0) {

            mostrarNenhumResultado();

            return;

        }


        mostrarClinicas(
            resultadoFinal
        );


    } catch (error) {

        console.error(
            "Erro ao buscar clínicas:",
            error
        );


        resultado.innerHTML = `
            <div class="semResultado">

                <h2>Não foi possível realizar a busca.</h2>

                <p>
                    Ocorreu um erro ao consultar as clínicas.
                </p>

                <p>
                    Tente novamente em alguns instantes.
                </p>

            </div>
        `;

    }

}


// ============================================================
// NENHUM RESULTADO
// ============================================================

function mostrarNenhumResultado() {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {
        return;
    }


    resultado.innerHTML = `

        <div class="semResultado">

            <h2>
                Nenhuma clínica encontrada.
            </h2>

            <p>
                Não encontramos clínicas da
                <strong>Rede Especialistas</strong>
                para os filtros selecionados.
            </p>

        </div>

    `;

}


// ============================================================
// EVENTOS DA PÁGINA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botaoBuscar =
            document.getElementById("buscar");


        if (!botaoBuscar) {
            console.error(
                "Botão #buscar não encontrado."
            );

            return;
        }


        // ====================================================
        // BOTÃO BUSCAR
        // ====================================================

        botaoBuscar.addEventListener(
            "click",
            buscarClinicas
        );


        console.log(
            "Botão de busca da Rede Especialistas configurado."
        );

    }
);


// ============================================================
// DISPONIBILIZAR FUNÇÕES
// ============================================================

window.buscarClinicas =
    buscarClinicas;

window.obterBairrosPorLocalizacao =
    obterBairrosPorLocalizacao;
