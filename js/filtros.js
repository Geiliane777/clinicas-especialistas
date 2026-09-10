// ============================================================
// FILTROS - REDE ESPECIALISTAS / SINDILEGIS
// ============================================================

console.log("filtros.js carregado");


// ============================================================
// ESCAPAR TEXTO
// Evita problemas ao colocar nomes vindos do banco no HTML.
// ============================================================

function escaparTexto(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    const div = document.createElement("div");

    div.textContent = String(texto);

    return div.innerHTML;
}


// ============================================================
// LIMPAR SELECT
// ============================================================

function limparSelect(id, mensagem) {

    const select = document.getElementById(id);

    if (!select) {
        return;
    }

    select.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = mensagem;

    select.appendChild(option);
}


// ============================================================
// ADICIONAR OPÇÃO AO SELECT
// ============================================================

function adicionarOpcao(select, id, nome) {

    if (!select) {
        return;
    }

    const option = document.createElement("option");

    option.value = id;
    option.textContent = nome;

    select.appendChild(option);
}


// ============================================================
// CARREGAR REGIÕES
// ============================================================

async function carregarRegioes() {

    const selectRegiao = document.getElementById("regiao");

    if (!selectRegiao) {
        return;
    }

    try {

        limparSelect(
            "regiao",
            "Selecione a Região"
        );

        const { data, error } = await supabaseClient
            .from("regioes")
            .select("id, nome")
            .order("nome", {
                ascending: true
            });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return;
        }

        data.forEach(regiao => {

            adicionarOpcao(
                selectRegiao,
                regiao.id,
                regiao.nome
            );

        });

    } catch (error) {

        console.error(
            "Erro ao carregar regiões:",
            error
        );

    }
}


// ============================================================
// CARREGAR ESTADOS
// ============================================================

async function carregarEstados(regiaoId) {

    const selectEstado = document.getElementById("estado");

    if (!selectEstado) {
        return;
    }

    // Sempre limpa os campos dependentes
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


    // Se nenhuma região foi selecionada,
    // não precisamos buscar estados.
    if (!regiaoId) {
        return;
    }


    try {

        const { data, error } = await supabaseClient
            .from("estados")
            .select("id, nome")
            .eq("regiao_id", regiaoId)
            .order("nome", {
                ascending: true
            });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return;
        }

        data.forEach(estado => {

            adicionarOpcao(
                selectEstado,
                estado.id,
                estado.nome
            );

        });

    } catch (error) {

        console.error(
            "Erro ao carregar estados:",
            error
        );

    }
}


// ============================================================
// CARREGAR CIDADES
// ============================================================

async function carregarCidades(estadoId) {

    const selectCidade = document.getElementById("cidade");

    if (!selectCidade) {
        return;
    }

    // Limpa cidade e bairro
    limparSelect(
        "cidade",
        "Selecione a Cidade"
    );

    limparSelect(
        "bairro",
        "Selecione o Bairro"
    );


    if (!estadoId) {
        return;
    }


    try {

        const { data, error } = await supabaseClient
            .from("cidades")
            .select("id, nome")
            .eq("estado_id", estadoId)
            .order("nome", {
                ascending: true
            });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return;
        }

        data.forEach(cidade => {

            adicionarOpcao(
                selectCidade,
                cidade.id,
                cidade.nome
            );

        });

    } catch (error) {

        console.error(
            "Erro ao carregar cidades:",
            error
        );

    }
}


// ============================================================
// CARREGAR BAIRROS
// ============================================================

async function carregarBairros(cidadeId) {

    const selectBairro = document.getElementById("bairro");

    if (!selectBairro) {
        return;
    }


    limparSelect(
        "bairro",
        "Selecione o Bairro"
    );


    if (!cidadeId) {
        return;
    }


    try {

        const { data, error } = await supabaseClient
            .from("bairros")
            .select("id, nome")
            .eq("cidade_id", cidadeId)
            .order("nome", {
                ascending: true
            });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return;
        }

        data.forEach(bairro => {

            adicionarOpcao(
                selectBairro,
                bairro.id,
                bairro.nome
            );

        });

    } catch (error) {

        console.error(
            "Erro ao carregar bairros:",
            error
        );

    }
}


// ============================================================
// CARREGAR ESPECIALIDADES
//
// A lista será formada apenas pelas especialidades que possuem
// clínicas ativas na rede correspondente à página.
//
// index.html  -> especialistas
// sindilegis  -> sindilegis
// ============================================================

async function carregarEspecialidades() {

    const selectEspecialidade =
        document.getElementById("especialidade");

    if (!selectEspecialidade) {
        return;
    }


    try {

        limparSelect(
            "especialidade",
            "Todas as Especialidades"
        );


        // Descobre qual página está sendo utilizada.
        const corpo = document.body;

        const rede = corpo.classList.contains("sindilegis")
            ? "sindilegis"
            : "especialistas";


        const { data, error } = await supabaseClient

            .from("clinica_especialidades")

            .select(`
                especialidade_id,
                rede,
                ativo,
                especialidades (
                    id,
                    nome
                ),
                clinicas!inner (
                    id,
                    ativo
                )
            `)

            .eq("rede", rede)

            .eq("ativo", true)

            .eq("clinicas.ativo", true);


        if (error) {
            throw error;
        }


        if (!data || data.length === 0) {
            return;
        }


        // ====================================================
        // REMOVE ESPECIALIDADES DUPLICADAS
        // ====================================================

        const mapaEspecialidades = new Map();


        data.forEach(item => {

            const especialidade =
                item.especialidades;


            if (
                especialidade &&
                especialidade.id &&
                !mapaEspecialidades.has(
                    especialidade.id
                )
            ) {

                mapaEspecialidades.set(
                    especialidade.id,
                    especialidade
                );

            }

        });


        // ====================================================
        // TRANSFORMA EM ARRAY
        // ====================================================

        const especialidades =
            Array.from(
                mapaEspecialidades.values()
            );


        // ====================================================
        // ORDENA POR NOME
        // ====================================================

        especialidades.sort(
            (a, b) =>
                String(a.nome).localeCompare(
                    String(b.nome),
                    "pt-BR",
                    {
                        sensitivity: "base"
                    }
                )
        );


        // ====================================================
        // ADICIONA AO SELECT
        // ====================================================

        especialidades.forEach(especialidade => {

            adicionarOpcao(
                selectEspecialidade,
                especialidade.id,
                especialidade.nome
            );

        });


    } catch (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

    }
}


// ============================================================
// OBTER FILTROS SELECIONADOS
//
// Essa função será utilizada pelos arquivos:
// especialistas.js
// sindilegis.js
// ============================================================

function obterFiltros() {

    const regiao =
        document.getElementById("regiao");

    const estado =
        document.getElementById("estado");

    const cidade =
        document.getElementById("cidade");

    const bairro =
        document.getElementById("bairro");

    const especialidade =
        document.getElementById("especialidade");


    return {

        regiaoId:
            regiao?.value || "",

        estadoId:
            estado?.value || "",

        cidadeId:
            cidade?.value || "",

        bairroId:
            bairro?.value || "",

        especialidadeId:
            especialidade?.value || ""

    };

}


// ============================================================
// LIMPAR TODOS OS FILTROS
// ============================================================

function limparFiltros() {

    limparSelect(
        "regiao",
        "Selecione a Região"
    );

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

    limparSelect(
        "especialidade",
        "Todas as Especialidades"
    );


    carregarRegioes();

    carregarEspecialidades();

}


// ============================================================
// EVENTOS DOS FILTROS
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const regiao =
            document.getElementById("regiao");

        const estado =
            document.getElementById("estado");

        const cidade =
            document.getElementById("cidade");


        // ====================================================
        // REGIÃO → ESTADOS
        // ====================================================

        if (regiao) {

            regiao.addEventListener(
                "change",
                () => {

                    carregarEstados(
                        regiao.value
                    );

                }
            );

        }


        // ====================================================
        // ESTADO → CIDADES
        // ====================================================

        if (estado) {

            estado.addEventListener(
                "change",
                () => {

                    carregarCidades(
                        estado.value
                    );

                }
            );

        }


        // ====================================================
        // CIDADE → BAIRROS
        // ====================================================

        if (cidade) {

            cidade.addEventListener(
                "change",
                () => {

                    carregarBairros(
                        cidade.value
                    );

                }
            );

        }


        // ====================================================
        // CARREGAMENTO INICIAL
        // ====================================================

        carregarRegioes();

        carregarEspecialidades();

    }
);


// ============================================================
// DISPONIBILIZAR FUNÇÕES PARA OS OUTROS ARQUIVOS
// ============================================================

window.escaparTexto =
    escaparTexto;

window.carregarRegioes =
    carregarRegioes;

window.carregarEstados =
    carregarEstados;

window.carregarCidades =
    carregarCidades;

window.carregarBairros =
    carregarBairros;

window.carregarEspecialidades =
    carregarEspecialidades;

window.obterFiltros =
    obterFiltros;

window.limparFiltros =
    limparFiltros;
