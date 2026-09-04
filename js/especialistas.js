// ======================================
// REDE ESPECIALISTAS
// BUSCA DE CLÍNICAS
// ======================================

console.log("especialistas.js carregado");


// ======================================
// EVENTO BOTÃO BUSCAR
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botao =
            document.getElementById(
                "buscar"
            );


        if (!botao) return;


        botao.addEventListener(
            "click",
            buscarClinicas
        );

    }
);


// ======================================
// BUSCAR CLÍNICAS
// ======================================

async function buscarClinicas() {

    const regiao =
        document.getElementById(
            "regiao"
        )?.value;


    const estado =
        document.getElementById(
            "estado"
        )?.value;


    const cidade =
        document.getElementById(
            "cidade"
        )?.value;


    const bairro =
        document.getElementById(
            "bairro"
        )?.value;


    const especialidadeId =
        document.getElementById(
            "especialidade"
        )?.value;


    const resultado =
        document.getElementById(
            "resultado"
        );


    if (!resultado) return;


    // ==================================
    // VALIDAÇÃO
    // ==================================

    if (!bairro) {

        alert(
            "Selecione um bairro para buscar as clínicas."
        );

        return;

    }


    // ==================================
    // CARREGAMENTO
    // ==================================

    resultado.innerHTML = `

        <div class="semResultado">

            <h2>
                🔍 Buscando clínicas...
            </h2>

            <p>
                Aguarde um momento.
            </p>

        </div>

    `;


    try {

        // ==================================
        // CONSULTA
        // ==================================

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
                                nome,

                                regioes(
                                    id,
                                    nome
                                )
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
                .eq(
                    "ativo",
                    true
                )
                .eq(
                    "bairro_id",
                    bairro
                )
                .eq(
                    "clinica_especialidades.rede",
                    "especialistas"
                )
                .eq(
                    "clinica_especialidades.ativo",
                    true
                )
                .order(
                    "nome"
                );


        // ==================================
        // FILTRO ESPECIALIDADE
        // ==================================

        if (especialidadeId) {

            consulta =
                consulta.eq(
                    "clinica_especialidades.especialidade_id",
                    especialidadeId
                );

        }


        // ==================================
        // EXECUTAR
        // ==================================

        const {
            data,
            error
        } = await consulta;


        if (error) {

            throw error;

        }


        console.log(
            "Clínicas encontradas:",
            data
        );


        // ==================================
        // EXIBIR
        // ==================================

        mostrarClinicas(
            data || []
        );


    } catch (error) {

        console.error(
            "Erro ao buscar clínicas:",
            error
        );


        resultado.innerHTML = `

            <div class="semResultado">

                <h2>
                    Erro ao buscar clínicas
                </h2>

                <p>
                    Não foi possível carregar
                    as clínicas no momento.
                </p>

            </div>

        `;

    }

}
