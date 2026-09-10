console.log("filtros.js carregado");


// ============================================================
// UTILITÁRIOS
// ============================================================

function escaparTexto(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function limparSelect(select, texto) {

    if (!select) {
        return;
    }

    select.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = texto;

    select.appendChild(option);
}


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
// REGIÕES
// ============================================================

async function carregarRegioes() {

    const select = document.getElementById("regiao");

    if (!select) {
        return;
    }

    limparSelect(
        select,
        "Carregando regiões..."
    );

    try {

        const { data, error } = await supabaseClient
            .from("regioes")
            .select("id, nome")
            .order("nome", { ascending: true });

        if (error) {
            throw error;
        }

        limparSelect(
            select,
            "Selecione a Região"
        );

        if (!data || data.length === 0) {

            console.warn(
                "Nenhuma região encontrada."
            );

            return;
        }

        data.forEach(regiao => {

            adicionarOpcao(
                select,
                regiao.id,
                regiao.nome
            );

        });

    } catch (erro) {

        console.error(
            "Erro ao carregar regiões:",
            erro
        );

        limparSelect(
            select,
            "Erro ao carregar regiões"
        );
    }
}


// ============================================================
// ESTADOS
// ============================================================

async function carregarEstados(regiaoId = "") {

    const select = document.getElementById("estado");

    if (!select) {
        return;
    }

    limparSelect(
        select,
        "Carregando estados..."
    );

    try {

        let consulta = supabaseClient
            .from("estados")
            .select("id, nome, regiao_id")
            .order("nome", { ascending: true });


        if (regiaoId) {

            consulta = consulta.eq(
                "regiao_id",
                regiaoId
            );

        }


        const { data, error } = await consulta;

        if (error) {
            throw error;
        }


        limparSelect(
            select,
            "Selecione o Estado"
        );


        if (!data || data.length === 0) {
            return;
        }


        data.forEach(estado => {

            adicionarOpcao(
                select,
                estado.id,
                estado.nome
            );

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar estados:",
            erro
        );

        limparSelect(
            select,
            "Erro ao carregar estados"
        );
    }
}


// ============================================================
// CIDADES
// ============================================================

async function carregarCidades(estadoId = "") {

    const select = document.getElementById("cidade");

    if (!select) {
        return;
    }

    limparSelect(
        select,
        "Carregando cidades..."
    );


    try {

        let consulta = supabaseClient
            .from("cidades")
            .select("id, nome, estado_id")
            .order("nome", { ascending: true });


        if (estadoId) {

            consulta = consulta.eq(
                "estado_id",
                estadoId
            );

        }


        const { data, error } = await consulta;


        if (error) {
            throw error;
        }


        limparSelect(
            select,
            "Selecione a Cidade"
        );


        if (!data || data.length === 0) {
            return;
        }


        data.forEach(cidade => {

            adicionarOpcao(
                select,
                cidade.id,
                cidade.nome
            );

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
            erro
        );

        limparSelect(
            select,
            "Erro ao carregar cidades"
        );
    }
}


// ============================================================
// BAIRROS
// ============================================================

async function carregarBairros(cidadeId = "") {

    const select = document.getElementById("bairro");

    if (!select) {
        return;
    }

    limparSelect(
        select,
        "Carregando bairros..."
    );


    try {

        let consulta = supabaseClient
            .from("bairros")
            .select("id, nome, cidade_id")
            .order("nome", { ascending: true });


        if (cidadeId) {

            consulta = consulta.eq(
                "cidade_id",
                cidadeId
            );

        }


        const { data, error } = await consulta;


        if (error) {
            throw error;
        }


        limparSelect(
            select,
            "Selecione o Bairro"
        );


        if (!data || data.length === 0) {
            return;
        }


        data.forEach(bairro => {

            adicionarOpcao(
                select,
                bairro.id,
                bairro.nome
            );

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar bairros:",
            erro
        );

        limparSelect(
            select,
            "Erro ao carregar bairros"
        );
    }
}


// ============================================================
// ESPECIALIDADES
// ============================================================

async function carregarEspecialidades() {

    const select = document.getElementById(
        "especialidade"
    );

    if (!select) {
        return;
    }


    const corpo = document.body;

    const rede = corpo.classList.contains("sindilegis")
        ? "sindilegis"
        : "especialistas";


    limparSelect(
        select,
        "Carregando especialidades..."
    );


    try {

        /*
         * IMPORTANTE:
         * Não usamos mais clinicas!inner aqui.
         * Buscamos somente os vínculos.
         */

        const { data, error } = await supabaseClient
            .from("clinica_especialidades")
            .select(`
                especialidade_id,
                rede,
                ativo,
                especialidades (
                    id,
                    nome
                )
            `)
            .eq("rede", rede)
            .eq("ativo", true);


        if (error) {
            throw error;
        }


        limparSelect(
            select,
            "Todas as Especialidades"
        );


        if (!data || data.length === 0) {

            console.warn(
                "Nenhuma especialidade encontrada para a rede:",
                rede
            );

            return;
        }


        const especialidades = new Map();


        data.forEach(item => {

            if (
                !item.especialidades ||
                !item.especialidades.id
            ) {
                return;
            }


            especialidades.set(
                item.especialidades.id,
                item.especialidades.nome
            );

        });


        Array.from(especialidades.entries())
            .sort((a, b) =>
                a[1].localeCompare(
                    b[1],
                    "pt-BR"
                )
            )
            .forEach(([id, nome]) => {

                adicionarOpcao(
                    select,
                    id,
                    nome
                );

            });


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades:",
            erro
        );

        limparSelect(
            select,
            "Erro ao carregar especialidades"
        );
    }
}


// ============================================================
// OBTER FILTROS
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
// LIMPAR FILTROS
// ============================================================

function limparFiltros() {

    const estado =
        document.getElementById("estado");

    const cidade =
        document.getElementById("cidade");

    const bairro =
        document.getElementById("bairro");


    limparSelect(
        estado,
        "Selecione o Estado"
    );

    limparSelect(
        cidade,
        "Selecione a Cidade"
    );

    limparSelect(
        bairro,
        "Selecione o Bairro"
    );
}


// ============================================================
// INICIALIZAÇÃO
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


        if (regiao) {

            regiao.addEventListener(
                "change",
                async () => {

                    const regiaoId =
                        regiao.value;

                    await carregarEstados(
                        regiaoId
                    );

                    limparSelect(
                        cidade,
                        "Selecione a Cidade"
                    );

                    limparSelect(
                        document.getElementById("bairro"),
                        "Selecione o Bairro"
                    );

                }
            );

        }


        if (estado) {

            estado.addEventListener(
                "change",
                async () => {

                    const estadoId =
                        estado.value;

                    await carregarCidades(
                        estadoId
                    );

                    limparSelect(
                        document.getElementById("bairro"),
                        "Selecione o Bairro"
                    );

                }
            );

        }


        if (cidade) {

            cidade.addEventListener(
                "change",
                async () => {

                    const cidadeId =
                        cidade.value;

                    await carregarBairros(
                        cidadeId
                    );

                }
            );

        }


        carregarRegioes();

        carregarEspecialidades();

    }
);


// ============================================================
// EXPORTAÇÕES
// ============================================================

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
