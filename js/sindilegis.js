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
                buscarClinicas
            );

        }

    }
);


// ======================================
// BUSCAR CLÍNICAS
// ======================================

async function buscarClinicas() {

    const bairro =
        document.getElementById("bairro").value;

    const especialidadeId =
        document.getElementById(
            "especialidade"
        ).value;


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

    const resultado =
        document.getElementById("resultado");

    resultado.innerHTML = `
        <div class="semResultado">
            <h2>
                Buscando clínicas...
            </h2>
        </div>
    `;


    // ======================================
    // CONSULTA
    // ======================================

    let consulta =
        supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                endereco,
                telefone,
                ativo,

                bairros(
                    nome,

                    cidades(
                        nome,

                        estados(
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
                "sindilegis"
            )

            .eq(
                "clinica_especialidades.ativo",
                true
            );


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
    // EXECUTAR CONSULTA
    // ======================================

    const {
        data,
        error
    } = await consulta;


    if (error) {

        console.error(
            "Erro ao buscar clínicas:",
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

        return;

    }


    console.log(
        "Clínicas encontradas:",
        data
    );


    // ======================================
    // EXIBIR
    // ======================================

    mostrarClinicas(data);

}
