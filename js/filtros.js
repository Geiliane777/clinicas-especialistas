// ======================================
// FILTROS
// REGIÃO / ESTADO / CIDADE / BAIRRO
// ESPECIALIDADE
// ======================================

console.log("filtros.js carregado");


// ======================================
// ESCAPAR TEXTO HTML
// ======================================

function escaparTexto(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {
        return "";
    }

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


// ======================================
// DESCOBRIR REDE ATUAL
// ======================================

function obterRedeAtual() {

    if (
        document.body.classList.contains(
            "sindilegis"
        )
    ) {
        return "sindilegis";
    }

    return "especialistas";

}


// ======================================
// LIMPAR SELECT
// ======================================

function limparSelect(
    id,
    mensagem
) {

    const select =
        document.getElementById(id);

    if (!select) return;

    select.innerHTML = `
        <option value="">
            ${mensagem}
        </option>
    `;

}


// ======================================
// CARREGAR REGIÕES
// ======================================

async function carregarRegioes() {

    const regiao =
        document.getElementById("regiao");

    if (!regiao) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select("id, nome")
            .order("nome");


        if (error) {

            throw error;

        }


        limparSelect(
            "regiao",
            "Selecione a Região"
        );


        data?.forEach(item => {

            regiao.innerHTML += `

                <option value="${item.id}">
                    ${escaparTexto(item.nome)}
                </option>

            `;

        });


        console.log(
            "Regiões carregadas:",
            data
        );


    } catch (error) {

        console.error(
            "Erro ao carregar regiões:",
            error
        );

    }

}


// ======================================
// CARREGAR ESTADOS
// ======================================

async function carregarEstados(regiaoId) {

    const estado =
        document.getElementById("estado");

    if (!estado) return;


    limparSelect(
        "estado",
        "Selecione o Estado"
    );

    limparSelect(
        "cidade",
        "Selecione a Cidade"
    );

    limparSelect(
        "bairro",
        "Selecione o Bairro"
    );


    if (!regiaoId) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select("id, nome")
            .eq(
                "regiao_id",
                regiaoId
            )
            .order("nome");


        if (error) {

            throw error;

        }


        data?.forEach(item => {

            estado.innerHTML += `

                <option value="${item.id}">
                    ${escaparTexto(item.nome)}
                </option>

            `;

        });


    } catch (error) {

        console.error(
            "Erro ao carregar estados:",
            error
        );

    }

}


// ======================================
// CARREGAR CIDADES
// ======================================

async function carregarCidades(estadoId) {

    const cidade =
        document.getElementById("cidade");

    if (!cidade) return;


    limparSelect(
        "cidade",
        "Selecione a Cidade"
    );

    limparSelect(
        "bairro",
        "Selecione o Bairro"
    );


    if (!estadoId) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select("id, nome")
            .eq(
                "estado_id",
                estadoId
            )
            .order("nome");


        if (error) {

            throw error;

        }


        data?.forEach(item => {

            cidade.innerHTML += `

                <option value="${item.id}">
                    ${escaparTexto(item.nome)}
                </option>

            `;

        });


    } catch (error) {

        console.error(
            "Erro ao carregar cidades:",
            error
        );

    }

}


// ======================================
// CARREGAR BAIRROS
// ======================================

async function carregarBairros(cidadeId) {

    const bairro =
        document.getElementById("bairro");

    if (!bairro) return;


    limparSelect(
        "bairro",
        "Selecione o Bairro"
    );


    if (!cidadeId) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select("id, nome")
            .eq(
                "cidade_id",
                cidadeId
            )
            .order("nome");


        if (error) {

            throw error;

        }


        data?.forEach(item => {

            bairro.innerHTML += `

                <option value="${item.id}">
                    ${escaparTexto(item.nome)}
                </option>

            `;

        });


    } catch (error) {

        console.error(
            "Erro ao carregar bairros:",
            error
        );

    }

}


// ======================================
// CARREGAR ESPECIALIDADES
//
// Busca apenas especialidades vinculadas
// a clínicas ATIVAS da rede atual.
// ======================================

async function carregarEspecialidades() {

    const especialidade =
        document.getElementById(
            "especialidade"
        );

    if (!especialidade) return;


    const rede =
        obterRedeAtual();


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinica_especialidades")
            .select(`
                especialidade_id,

                especialidades(
                    id,
                    nome
                ),

                clinicas!inner(
                    ativo
                )
            `)
            .eq(
                "rede",
                rede
            )
            .eq(
                "ativo",
                true
            )
            .eq(
                "clinicas.ativo",
                true
            );


        if (error) {

            throw error;

        }


        limparSelect(
            "especialidade",
            "Todas as Especialidades"
        );


        // Remove especialidades repetidas

        const especialidadesMap =
            new Map();


        data?.forEach(item => {

            const especialidadeData =
                item.especialidades;


            if (
                especialidadeData &&
                !especialidadesMap.has(
                    especialidadeData.id
                )
            ) {

                especialidadesMap.set(
                    especialidadeData.id,
                    especialidadeData
                );

            }

        });


        const especialidades =
            Array.from(
                especialidadesMap.values()
            );


        especialidades.sort(
            (a, b) =>
                a.nome.localeCompare(
                    b.nome,
                    "pt-BR"
                )
        );


        especialidades.forEach(item => {

            especialidade.innerHTML += `

                <option value="${item.id}">
                    ${escaparTexto(item.nome)}
                </option>

            `;

        });


        console.log(
            "Especialidades carregadas:",
            especialidades
        );


    } catch (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

    }

}


// ======================================
// INICIALIZAÇÃO DOS FILTROS
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const regiao =
            document.getElementById("regiao");

        const estado =
            document.getElementById("estado");

        const cidade =
            document.getElementById("cidade");


        // ==================================
        // REGIÃO → ESTADO
        // ==================================

        regiao?.addEventListener(
            "change",
            function() {

                carregarEstados(
                    this.value
                );

            }
        );


        // ==================================
        // ESTADO → CIDADE
        // ==================================

        estado?.addEventListener(
            "change",
            function() {

                carregarCidades(
                    this.value
                );

            }
        );


        // ==================================
        // CIDADE → BAIRRO
        // ==================================

        cidade?.addEventListener(
            "change",
            function() {

                carregarBairros(
                    this.value
                );

            }
        );


        // ==================================
        // CARREGAMENTO INICIAL
        // ==================================

        carregarRegioes();

        carregarEspecialidades();

    }
);
