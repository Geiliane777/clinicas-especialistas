// ======================================
// REDE SINDILEGIS
// ======================================

console.log("sindilegis.js carregado");


// ======================================
// EVENTO BOTÃO BUSCAR
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botao =
            document.getElementById("buscar");

        if (botao) {

            botao.addEventListener(
                "click",
                buscarClinicasSindilegis
            );

        }

    }
);


// ======================================
// BUSCAR CLÍNICAS
// ======================================

async function buscarClinicasSindilegis() {

    const bairro =
        document.getElementById("bairro")?.value;

    const especialidadeId =
        document.getElementById("especialidade")?.value;

    const resultado =
        document.getElementById("resultado");

    if (!resultado) return;


    // ======================================
    // VALIDAR BAIRRO
    // ======================================

    if (!bairro) {

        alert(
            "Selecione um bairro."
        );

        return;

    }


    // ======================================
    // CARREGAMENTO
    // ======================================

    resultado.innerHTML = `
        <div class="semResultado">
            <h2>🔍 Buscando clínicas...</h2>
            <p>Aguarde um momento.</p>
        </div>
    `;


    try {

        let consulta =
            supabaseClient
                .from("clinicas")
                .select(`
                    id,
                    nome,
                    endereco,
                    telefone,
                    ativo,

                    bairros!inner(
                        id,
                        nome,

                        cidades(
                            id,
                            nome,

                            estados(
                                id,
                                nome
                            )
                        )
                    ),

                    clinica_especialidades!inner(
                        ativo,
                        rede,
                        especialidade_id,

                        especialidades(
                            id,
                            nome
                        )
                    )
                `)
                .eq("ativo", true)
                .eq("bairro_id", bairro)
                .eq(
                    "clinica_especialidades.rede",
                    "Sindilegis"
                )
                .eq(
                    "clinica_especialidades.ativo",
                    true
                )
                .order("nome");


        // ======================================
        // FILTRO ESPECIALIDADE
        // ======================================

        if (especialidadeId) {

            consulta =
                consulta.eq(
                    "clinica_especialidades.especialidade_id",
                    especialidadeId
                );

        }


        // ======================================
        // EXECUTAR
        // ======================================

        const {
            data,
            error
        } = await consulta;

        if (error) {
            throw error;
        }

        console.log(
            "Clínicas Sindilegis encontradas:",
            data
        );

        mostrarClinicas(
            data || []
        );

    } catch (error) {

        console.error(
            "Erro ao buscar clínicas Sindilegis:",
            error
        );

        resultado.innerHTML = `
            <div class="semResultado">

                <h2>
                    Erro ao buscar clínicas.
                </h2>

                <p>
                    Tente novamente mais tarde.
                </p>

            </div>
        `;

    }

}
