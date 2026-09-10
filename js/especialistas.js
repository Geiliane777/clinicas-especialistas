console.log("especialistas.js carregado");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const REDE_ESPECIALISTAS = "especialistas";


// ======================================================
// BUSCA DE CLÍNICAS - REDE ESPECIALISTAS
// ======================================================

async function buscarClinicasEspecialistas() {

    try {

        console.log("Iniciando busca da Rede Especialistas...");

        const filtros =
            typeof obterFiltros === "function"
                ? obterFiltros()
                : {
                    regiaoId: "",
                    estadoId: "",
                    cidadeId: "",
                    bairroId: "",
                    especialidadeId: ""
                };


        // ==================================================
        // 1. BUSCA AS CLÍNICAS
        // ==================================================

        let query = supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                telefone,
                endereco,
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
            .eq("ativo", true);


        // --------------------------------------------------
        // Filtro de bairro
        // --------------------------------------------------

        if (filtros.bairroId) {

            query = query.eq(
                "bairro_id",
                filtros.bairroId
            );

        }


        const { data: clinicas, error } = await query;


        if (error) {

            console.error(
                "Erro ao buscar clínicas:",
                error
            );

            mostrarErroBusca(
                "Não foi possível carregar as clínicas."
            );

            return;

        }


        let resultado = clinicas || [];


        // ==================================================
        // 2. FILTROS DE LOCALIZAÇÃO
        // ==================================================

        resultado = resultado.filter(clinica => {

            const bairro = clinica.bairros;
            const cidade = bairro?.cidades;
            const estado = cidade?.estados;
            const regiao = estado?.regioes;


            // Região
            if (
                filtros.regiaoId &&
                String(regiao?.id) !== String(filtros.regiaoId)
            ) {
                return false;
            }


            // Estado
            if (
                filtros.estadoId &&
                String(estado?.id) !== String(filtros.estadoId)
            ) {
                return false;
            }


            // Cidade
            if (
                filtros.cidadeId &&
                String(cidade?.id) !== String(filtros.cidadeId)
            ) {
                return false;
            }


            // Bairro
            if (
                filtros.bairroId &&
                String(bairro?.id) !== String(filtros.bairroId)
            ) {
                return false;
            }


            return true;

        });


        // ==================================================
        // 3. BUSCA ESPECIALIDADES
        // ==================================================

        const idsClinicas = resultado
            .map(clinica => clinica.id)
            .filter(Boolean);


        let especialidadesPorClinica = {};


        if (idsClinicas.length > 0) {

            const {
                data: relacionamentos,
                error: erroEspecialidades
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
                .eq("rede", REDE_ESPECIALISTAS)
                .eq("ativo", true)
                .in("clinica_id", idsClinicas);


            if (erroEspecialidades) {

                console.error(
                    "Erro ao buscar especialidades:",
                    erroEspecialidades
                );

            } else {

                (relacionamentos || []).forEach(item => {

                    if (!item.clinica_id) {
                        return;
                    }

                    if (!especialidadesPorClinica[item.clinica_id]) {
                        especialidadesPorClinica[item.clinica_id] = [];
                    }


                    const especialidade =
                        item.especialidades;


                    if (
                        especialidade &&
                        especialidade.nome
                    ) {

                        const jaExiste =
                            especialidadesPorClinica[item.clinica_id]
                                .some(
                                    item =>
                                        item.id === especialidade.id
                                );


                        if (!jaExiste) {

                            especialidadesPorClinica[
                                item.clinica_id
                            ].push(especialidade);

                        }

                    }

                });

            }

        }


        // ==================================================
        // 4. JUNTA AS ESPECIALIDADES ÀS CLÍNICAS
        // ==================================================

        resultado = resultado.map(clinica => {

            return {
                ...clinica,
                especialidades:
                    especialidadesPorClinica[clinica.id] || []
            };

        });


        // ==================================================
        // 5. FILTRO POR ESPECIALIDADE
        // ==================================================

        if (filtros.especialidadeId) {

            resultado = resultado.filter(clinica => {

                return clinica.especialidades.some(
                    especialidade =>
                        String(especialidade.id) ===
                        String(filtros.especialidadeId)
                );

            });

        }


        // ==================================================
        // 6. ORDENAÇÃO
        // ==================================================

        resultado.sort((a, b) => {

            const nomeA =
                String(a.nome || "").toLowerCase();

            const nomeB =
                String(b.nome || "").toLowerCase();

            return nomeA.localeCompare(
                nomeB,
                "pt-BR"
            );

        });


        // ==================================================
        // 7. MOSTRA OS CARDS
        // ==================================================

        if (typeof mostrarClinicas === "function") {

            mostrarClinicas(resultado);

        } else {

            console.error(
                "A função mostrarClinicas não foi encontrada."
            );

        }


    } catch (erro) {

        console.error(
            "Erro inesperado na busca:",
            erro
        );

        mostrarErroBusca(
            "Ocorreu um erro ao realizar a busca."
        );

    }

}


// ======================================================
// MENSAGEM DE ERRO
// ======================================================

function mostrarErroBusca(mensagem) {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) {
        return;
    }


    resultado.innerHTML = `
        <div class="semResultado">

            <div class="semResultado-icone">
                ⚠️
            </div>

            <h2>
                Não foi possível realizar a busca
            </h2>

            <p>
                ${escaparTexto(mensagem)}
            </p>

        </div>
    `;

}


// ======================================================
// EVENTO DO BOTÃO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botao =
            document.getElementById("buscar");

        if (!botao) {
            console.warn(
                "Botão #buscar não encontrado."
            );
            return;
        }


        botao.addEventListener(
            "click",
            async () => {

                botao.disabled = true;

                const textoOriginal =
                    botao.innerHTML;

                botao.innerHTML =
                    "⏳ Buscando...";


                try {

                    await buscarClinicasEspecialistas();

                } finally {

                    botao.disabled = false;

                    botao.innerHTML =
                        textoOriginal;

                }

            }
        );

    }
);


// ======================================================
// EXPOSIÇÃO GLOBAL
// ======================================================

window.buscarClinicasEspecialistas =
    buscarClinicasEspecialistas;

console.log(
    "Rede Especialistas pronta."
);
