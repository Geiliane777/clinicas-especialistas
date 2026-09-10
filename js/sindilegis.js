// ============================================================
// BUSCA - REDE SINDILEGIS
// ============================================================

console.log("sindilegis.js carregado");


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const REDE_SINDILEGIS = "sindilegis";


// ============================================================
// OBTER BAIRROS PELA LOCALIZAÇÃO
// ============================================================

async function obterBairrosPorLocalizacaoSindilegis(filtros) {

    // --------------------------------------------------------
    // BAIRRO SELECIONADO
    // --------------------------------------------------------

    if (filtros.bairroId) {

        return [filtros.bairroId];

    }


    // --------------------------------------------------------
    // CIDADE SELECIONADA
    // --------------------------------------------------------

    if (filtros.cidadeId) {

        const {
            data,
            error
        } = await supabaseClient

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
    // ESTADO SELECIONADO
    // --------------------------------------------------------

    if (filtros.estadoId) {

        const {
            data: cidades,
            error: erroCidades
        } = await supabaseClient

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


        const {
            data: bairros,
            error: erroBairros
        } = await supabaseClient

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
    // REGIÃO SELECIONADA
    // --------------------------------------------------------

    if (filtros.regiaoId) {

        // Buscar estados da região

        const {
            data: estados,
            error: erroEstados
        } = await supabaseClient

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


        // Buscar cidades dos estados

        const {
            data: cidades,
            error: erroCidades
        } = await supabaseClient

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


        // Buscar bairros das cidades

        const {
            data: bairros,
            error: erroBairros
        } = await supabaseClient

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
    // NENHUM FILTRO DE LOCALIZAÇÃO
    // --------------------------------------------------------

    return null;

}


// ============================================================
// BUSCAR CLÍNICAS SINDILEGIS
// ============================================================

async function buscarClinicasSindilegis() {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {

        console.error(
            "Elemento #resultado não encontrado."
        );

        return;

    }


    // ========================================================
    // MENSAGEM DE CARREGAMENTO
    // ========================================================

    resultado.innerHTML = `

        <div class="semResultado">

            <h2>
                Buscando clínicas...
            </h2>

            <p>
                Aguarde enquanto consultamos a rede Sindilegis.
            </p>

        </div>

    `;


    try {

        // ====================================================
        // OBTER FILTROS
        // ====================================================

        const filtros =
            obterFiltros();


        console.log(
            "Filtros Sindilegis:",
            filtros
        );


        // ====================================================
        // OBTER BAIRROS
        // ====================================================

        const bairroIds =
            await obterBairrosPorLocalizacaoSindilegis(
                filtros
            );


        // ====================================================
        // NENHUM BAIRRO ENCONTRADO
        // ====================================================

        if (
            bairroIds !== null &&
            bairroIds.length === 0
        ) {

            mostrarNenhumResultadoSindilegis();

            return;

        }


        // ====================================================
        // CONSULTA DAS CLÍNICAS
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
                    REDE_SINDILEGIS
                )

                .eq(
                    "clinica_especialidades.ativo",
                    true
                );


        // ====================================================
        // FILTRO POR BAIRRO
        // ====================================================

        if (bairroIds !== null) {

            consulta =
                consulta.in(
                    "bairro_id",
                    bairroIds
                );

        }


        // ====================================================
        // EXECUTAR CONSULTA
        // ====================================================

        const {
            data: clinicas,
            error
        } = await consulta;


        if (error) {
            throw error;
        }


        console.log(
            "Clínicas Sindilegis encontradas:",
            clinicas
        );


        // ====================================================
        // FILTRO POR ESPECIALIDADE
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
                                        REDE_SINDILEGIS &&
                                    String(
                                        item.especialidade_id
                                    ) ===
                                        String(
                                            filtros.especialidadeId
                                        )
                                );

                            }
                        );

                    }
                );

        }


        // ====================================================
        // REMOVER CLÍNICAS DUPLICADAS
        // ====================================================

        const mapaClinicas =
            new Map();


        clinicasFiltradas.forEach(
            clinica => {

                if (
                    !mapaClinicas.has(
                        clinica.id
                    )
                ) {

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
        // NENHUM RESULTADO
        // ====================================================

        if (
            resultadoFinal.length === 0
        ) {

            mostrarNenhumResultadoSindilegis();

            return;

        }


        // ====================================================
        // MOSTRAR CARDS
        // ====================================================

        mostrarClinicas(
            resultadoFinal
        );


    } catch (error) {

        console.error(
            "Erro ao buscar clínicas Sindilegis:",
            error
        );


        resultado.innerHTML = `

            <div class="semResultado">

                <h2>
                    Não foi possível realizar a busca.
                </h2>

                <p>
                    Ocorreu um erro ao consultar as clínicas
                    da rede Sindilegis.
                </p>

                <p>
                    Tente novamente em alguns instantes.
                </p>

            </div>

        `;

    }

}


// ============================================================
// MENSAGEM DE NENHUM RESULTADO
// ============================================================

function mostrarNenhumResultadoSindilegis() {

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
                <strong>rede Sindilegis</strong>
                para os filtros selecionados.
            </p>

        </div>

    `;

}


// ============================================================
// CONFIGURAR BOTÃO DE BUSCA
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


        botaoBuscar.addEventListener(
            "click",
            buscarClinicasSindilegis
        );


        console.log(
            "Botão de busca Sindilegis configurado."
        );

    }
);


// ============================================================
// DISPONIBILIZAR FUNÇÕES
// ============================================================

window.buscarClinicasSindilegis =
    buscarClinicasSindilegis;

window.obterBairrosPorLocalizacaoSindilegis =
    obterBairrosPorLocalizacaoSindilegis;
