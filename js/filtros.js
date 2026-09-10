// ============================================================
// FILTROS - REGIÃO / ESTADO / CIDADE / BAIRRO / ESPECIALIDADE
// ============================================================

console.log("filtros.js carregado");

function escaparTexto(texto) {
    if (texto === null || texto === undefined) return "";

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// LIMPAR SELECT
// ============================================================

function limparSelect(id, texto) {
    const select = document.getElementById(id);

    if (!select) return;

    select.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.textContent = texto;

    select.appendChild(option);
}


// ============================================================
// ADICIONAR OPÇÃO
// ============================================================

function adicionarOpcao(select, valor, texto) {

    if (!select) return;

    const option = document.createElement("option");

    option.value = valor;
    option.textContent = texto;

    select.appendChild(option);
}


// ============================================================
// CARREGAR REGIÕES
// ============================================================

async function carregarRegioes() {

    const select = document.getElementById("regiao");

    if (!select) return;

    limparSelect("regiao", "Selecione a Região");

    const { data, error } = await supabaseClient
        .from("regioes")
        .select("id, nome")
        .order("nome");

    if (error) {
        console.error("Erro ao carregar regiões:", error);
        return;
    }

    data.forEach(regiao => {
        adicionarOpcao(
            select,
            regiao.id,
            regiao.nome
        );
    });
}


// ============================================================
// CARREGAR ESTADOS
// ============================================================

async function carregarEstados(regiaoId = "") {

    const select = document.getElementById("estado");

    if (!select) return;

    limparSelect("estado", "Selecione o Estado");
    limparSelect("cidade", "Selecione a Cidade");
    limparSelect("bairro", "Selecione o Bairro");

    if (!regiaoId) return;

    const { data, error } = await supabaseClient
        .from("estados")
        .select("id, nome, regiao_id")
        .eq("regiao_id", regiaoId)
        .order("nome");

    if (error) {
        console.error("Erro ao carregar estados:", error);
        return;
    }

    data.forEach(estado => {

        adicionarOpcao(
            select,
            estado.id,
            estado.nome
        );

    });
}


// ============================================================
// CARREGAR CIDADES
// ============================================================

async function carregarCidades(estadoId = "") {

    const select = document.getElementById("cidade");

    if (!select) return;

    limparSelect("cidade", "Selecione a Cidade");
    limparSelect("bairro", "Selecione o Bairro");

    if (!estadoId) return;

    const { data, error } = await supabaseClient
        .from("cidades")
        .select("id, nome, estado_id")
        .eq("estado_id", estadoId)
        .order("nome");

    if (error) {
        console.error("Erro ao carregar cidades:", error);
        return;
    }

    data.forEach(cidade => {

        adicionarOpcao(
            select,
            cidade.id,
            cidade.nome
        );

    });
}


// ============================================================
// CARREGAR BAIRROS
// ============================================================

async function carregarBairros(cidadeId = "") {

    const select = document.getElementById("bairro");

    if (!select) return;

    limparSelect("bairro", "Selecione o Bairro");

    if (!cidadeId) return;

    const { data, error } = await supabaseClient
        .from("bairros")
        .select("id, nome, cidade_id")
        .eq("cidade_id", cidadeId)
        .order("nome");

    if (error) {
        console.error("Erro ao carregar bairros:", error);
        return;
    }

    data.forEach(bairro => {

        adicionarOpcao(
            select,
            bairro.id,
            bairro.nome
        );

    });
}


// ============================================================
// CARREGAR ESPECIALIDADES
// ============================================================

async function carregarEspecialidades() {

    const select = document.getElementById("especialidade");

    if (!select) return;

    limparSelect(
        "especialidade",
        "Todas as Especialidades"
    );

    const rede = document.body.classList.contains("sindilegis")
        ? "sindilegis"
        : "especialistas";

    console.log("Carregando especialidades da rede:", rede);

    // Primeiro buscamos os vínculos
    const { data: vinculos, error: erroVinculos } =
        await supabaseClient
            .from("clinica_especialidades")
            .select("especialidade_id")
            .eq("rede", rede)
            .eq("ativo", true);

    if (erroVinculos) {

        console.error(
            "Erro ao carregar vínculos de especialidades:",
            erroVinculos
        );

        return;
    }

    if (!vinculos || vinculos.length === 0) {

        console.log(
            "Nenhuma especialidade encontrada para a rede:",
            rede
        );

        return;
    }

    const ids = [
        ...new Set(
            vinculos
                .map(item => item.especialidade_id)
                .filter(Boolean)
        )
    ];

    if (ids.length === 0) return;

    // Depois buscamos as especialidades
    const { data: especialidades, error: erroEspecialidades } =
        await supabaseClient
            .from("especialidades")
            .select("id, nome")
            .in("id", ids)
            .order("nome");

    if (erroEspecialidades) {

        console.error(
            "Erro ao carregar especialidades:",
            erroEspecialidades
        );

        return;
    }

    especialidades.forEach(especialidade => {

        adicionarOpcao(
            select,
            especialidade.id,
            especialidade.nome
        );

    });

    console.log(
        "Especialidades carregadas:",
        especialidades.length
    );
}


// ============================================================
// OBTER FILTROS
// ============================================================

function obterFiltros() {

    const regiao = document.getElementById("regiao");
    const estado = document.getElementById("estado");
    const cidade = document.getElementById("cidade");
    const bairro = document.getElementById("bairro");
    const especialidade = document.getElementById("especialidade");

    return {

        regiaoId: regiao ? regiao.value : "",

        estadoId: estado ? estado.value : "",

        cidadeId: cidade ? cidade.value : "",

        bairroId: bairro ? bairro.value : "",

        especialidadeId: especialidade
            ? especialidade.value
            : ""
    };
}


// ============================================================
// LIMPAR FILTROS
// ============================================================

function limparFiltros() {

    const regiao = document.getElementById("regiao");

    if (regiao) {
        regiao.value = "";
    }

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

    const especialidade =
        document.getElementById("especialidade");

    if (especialidade) {
        especialidade.value = "";
    }
}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Inicializando filtros...");

    const regiao = document.getElementById("regiao");
    const estado = document.getElementById("estado");
    const cidade = document.getElementById("cidade");

    if (regiao) {

        regiao.addEventListener("change", async () => {

            await carregarEstados(regiao.value);

        });

    }

    if (estado) {

        estado.addEventListener("change", async () => {

            await carregarCidades(estado.value);

        });

    }

    if (cidade) {

        cidade.addEventListener("change", async () => {

            await carregarBairros(cidade.value);

        });

    }

    await carregarRegioes();

    await carregarEspecialidades();

    console.log("Filtros inicializados.");
});


// ============================================================
// EXPORTAR
// ============================================================

window.carregarRegioes = carregarRegioes;
window.carregarEstados = carregarEstados;
window.carregarCidades = carregarCidades;
window.carregarBairros = carregarBairros;
window.carregarEspecialidades = carregarEspecialidades;
window.obterFiltros = obterFiltros;
window.limparFiltros = limparFiltros;
