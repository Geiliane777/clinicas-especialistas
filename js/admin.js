/* ==========================================
REDE ESPECIALISTAS
PAINEL ADMINISTRATIVO
admin.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {


/* ==========================================
   TÍTULOS DAS PÁGINAS
========================================== */

const tituloPagina = document.getElementById("tituloPagina");

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    editarClinica: "Editar Clínica",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


/* ==========================================
   LIMPAR SELECT
========================================== */

function limparSelect(select, texto = "Selecione") {

    if (!select) return;

    select.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = texto;

    select.appendChild(option);
}


/* ==========================================
   NAVEGAÇÃO
========================================== */

async function mostrarPagina(nomePagina) {

    document.querySelectorAll(".page").forEach(pagina => {
        pagina.classList.add("hidden");
    });

    const pagina = document.getElementById(nomePagina);

    if (pagina) {
        pagina.classList.remove("hidden");
    }

    if (tituloPagina && TITULOS_PAGINA[nomePagina]) {
        tituloPagina.textContent = TITULOS_PAGINA[nomePagina];
    }

    document.querySelectorAll(".menu-btn").forEach(botao => {

        botao.classList.remove("active");

        if (botao.dataset.page === nomePagina) {
            botao.classList.add("active");
        }

    });


    if (nomePagina === "dashboard") {
        await carregarDashboard();
    }

    if (nomePagina === "clinicas") {
        await prepararPaginaClinicas();
    }

    if (nomePagina === "especialidades") {
        await carregarEspecialidades();
    }

    if (nomePagina === "regioes") {
        await carregarRegioes();
    }

    if (nomePagina === "estados") {
        await prepararPaginaEstados();
    }

    if (nomePagina === "cidades") {
        await prepararPaginaCidades();
    }

    if (nomePagina === "bairros") {
        await prepararPaginaBairros();
    }

}


/* ==========================================
   MENU
========================================== */

document.querySelectorAll(".menu-btn").forEach(botao => {

    botao.addEventListener("click", () => {

        mostrarPagina(botao.dataset.page);

    });

});


/* ==========================================
   VOLTAR PARA SITE
========================================== */

const btnVoltarSite = document.getElementById("btnVoltarSite");

if (btnVoltarSite) {

    btnVoltarSite.addEventListener("click", () => {

        window.location.href = "index.html";

    });

}


/* ==========================================
   LOGOUT
========================================== */

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener("click", () => {

        localStorage.removeItem("adminLogado");

        window.location.reload();

    });

}


/* ==========================================
   POPULAR REGIÕES
========================================== */

async function popularRegioes(selectId, texto = "Selecione Região") {

    const select = document.getElementById(selectId);

    if (!select) return;

    const valorAtual = select.value;

    limparSelect(select, texto);

    const { data, error } = await supabase
        .from("regioes")
        .select("*")
        .order("nome");

    if (error) {
        console.error("Erro regiões:", error);
        return;
    }

    data.forEach(regiao => {

        const option = document.createElement("option");

        option.value = regiao.id;
        option.textContent = regiao.nome;

        select.appendChild(option);

    });

    if (valorAtual) {
        select.value = valorAtual;
    }

}


/* ==========================================
   POPULAR ESTADOS
========================================== */

async function popularEstados(
    selectId,
    regiaoId = null,
    texto = "Selecione Estado"
) {

    const select = document.getElementById(selectId);

    if (!select) return;

    const valorAtual = select.value;

    limparSelect(select, texto);

    let query = supabase
        .from("estados")
        .select("*")
        .order("nome");

    if (regiaoId) {
        query = query.eq("regiao_id", regiaoId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro estados:", error);
        return;
    }

    data.forEach(estado => {

        const option = document.createElement("option");

        option.value = estado.id;
        option.textContent = estado.nome;

        select.appendChild(option);

    });

    if (valorAtual) {
        select.value = valorAtual;
    }

}


/* ==========================================
   POPULAR CIDADES
========================================== */

async function popularCidades(
    selectId,
    estadoId = null,
    texto = "Selecione Cidade"
) {

    const select = document.getElementById(selectId);

    if (!select) return;

    const valorAtual = select.value;

    limparSelect(select, texto);

    let query = supabase
        .from("cidades")
        .select("*")
        .order("nome");

    if (estadoId) {
        query = query.eq("estado_id", estadoId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro cidades:", error);
        return;
    }

    data.forEach(cidade => {

        const option = document.createElement("option");

        option.value = cidade.id;
        option.textContent = cidade.nome;

        select.appendChild(option);

    });

    if (valorAtual) {
        select.value = valorAtual;
    }

}


/* ==========================================
   POPULAR BAIRROS
========================================== */

async function popularBairros(
    selectId,
    cidadeId = null,
    texto = "Selecione Bairro"
) {

    const select = document.getElementById(selectId);

    if (!select) return;

    const valorAtual = select.value;

    limparSelect(select, texto);

    let query = supabase
        .from("bairros")
        .select("*")
        .order("nome");

    if (cidadeId) {
        query = query.eq("cidade_id", cidadeId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro bairros:", error);
        return;
    }

    data.forEach(bairro => {

        const option = document.createElement("option");

        option.value = bairro.id;
        option.textContent = bairro.nome;

        select.appendChild(option);

    });

    if (valorAtual) {
        select.value = valorAtual;
    }

}


/* ==========================================
   POPULAR ESPECIALIDADES
========================================== */

async function popularEspecialidades(selectId) {

    const select = document.getElementById(selectId);

    if (!select) return;

    limparSelect(select, "Selecione Especialidade");

    const { data, error } = await supabase
        .from("especialidades")
        .select("*")
        .order("nome");

    if (error) {
        console.error("Erro especialidades:", error);
        return;
    }

    data.forEach(especialidade => {

        const option = document.createElement("option");

        option.value = especialidade.id;
        option.textContent = especialidade.nome;

        select.appendChild(option);

    });

}


/* ==========================================
   CASCATA LOCALIZAÇÃO
========================================== */

function ligarCascataLocalizacao(prefixo) {

    const regiao = document.getElementById(`${prefixo}_regiao`);
    const estado = document.getElementById(`${prefixo}_estado`);
    const cidade = document.getElementById(`${prefixo}_cidade`);
    const bairro = document.getElementById(`${prefixo}_bairro`);


    if (regiao) {

        regiao.addEventListener("change", async () => {

            limparSelect(estado, "Selecione Estado");
            limparSelect(cidade, "Selecione Cidade");
            limparSelect(bairro, "Selecione Bairro");

            if (regiao.value) {
                await popularEstados(
                    `${prefixo}_estado`,
                    regiao.value
                );
            }

        });

    }


    if (estado) {

        estado.addEventListener("change", async () => {

            limparSelect(cidade, "Selecione Cidade");
            limparSelect(bairro, "Selecione Bairro");

            if (estado.value) {
                await popularCidades(
                    `${prefixo}_cidade`,
                    estado.value
                );
            }

        });

    }


    if (cidade) {

        cidade.addEventListener("change", async () => {

            limparSelect(bairro, "Selecione Bairro");

            if (cidade.value) {
                await popularBairros(
                    `${prefixo}_bairro`,
                    cidade.value
                );
            }

        });

    }

}


/* ==========================================
   DASHBOARD
========================================== */

async function contarRegistros(tabela) {

    const { count, error } = await supabase
        .from(tabela)
        .select("*", {
            count: "exact",
            head: true
        });

    if (error) {
        console.error(`Erro ao contar ${tabela}:`, error);
        return 0;
    }

    return count || 0;

}


async function carregarDashboard() {

    const resultados = await Promise.all([

        contarRegistros("clinicas"),
        contarRegistros("especialidades"),
        contarRegistros("regioes"),
        contarRegistros("estados"),
        contarRegistros("cidades"),
        contarRegistros("bairros")

    ]);

    document.getElementById("totalClinicas").textContent =
        resultados[0];

    document.getElementById("totalEspecialidades").textContent =
        resultados[1];

    document.getElementById("totalRegioes").textContent =
        resultados[2];

    document.getElementById("totalEstados").textContent =
        resultados[3];

    document.getElementById("totalCidades").textContent =
        resultados[4];

    document.getElementById("totalBairros").textContent =
        resultados[5];

}


/* ==========================================
   REGIÕES
========================================== */

async function carregarRegioes() {

    const lista = document.getElementById("listaRegioes");

    if (!lista) return;

    const { data, error } = await supabase
        .from("regioes")
        .select("*")
        .order("nome");

    if (error) {
        console.error("Erro regiões:", error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma região cadastrada.</p>";

        return;
    }

    data.forEach(regiao => {

        const box = document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${regiao.nome}</h3>

            <button
                class="red btnExcluirRegiao"
                data-id="${regiao.id}"
            >
                🗑 Excluir
            </button>
        `;

        lista.appendChild(box);

    });


    document.querySelectorAll(".btnExcluirRegiao")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                if (!confirm("Deseja excluir esta região?")) {
                    return;
                }

                const { error } = await supabase
                    .from("regioes")
                    .delete()
                    .eq("id", botao.dataset.id);

                if (error) {
                    alert("Erro ao excluir região.");
                    console.error(error);
                    return;
                }

                await carregarRegioes();
                await carregarDashboard();

            });

        });

}


const btnSalvarRegiao =
    document.getElementById("btnSalvarRegiao");

if (btnSalvarRegiao) {

    btnSalvarRegiao.addEventListener("click", async () => {

        const input = document.getElementById("nova_regiao");
        const nome = input.value.trim();

        if (!nome) {
            alert("Digite o nome da região.");
            return;
        }

        const { error } = await supabase
            .from("regioes")
            .insert({ nome });

        if (error) {
            console.error(error);
            alert("Erro ao salvar região.");
            return;
        }

        input.value = "";

        await carregarRegioes();
        await carregarDashboard();

        alert("Região cadastrada com sucesso!");

    });

}


/* ==========================================
   ESTADOS
========================================== */

async function prepararPaginaEstados() {

    await popularRegioes("estado_regiao");
    await popularRegioes(
        "filtro_estado_regiao",
        "Todas as Regiões"
    );

    await carregarEstados();

}


async function carregarEstados() {

    const lista = document.getElementById("listaEstados");

    if (!lista) return;

    const filtro =
        document.getElementById("filtro_estado_regiao");

    let query = supabase
        .from("estados")
        .select(`
            *,
            regioes(nome)
        `)
        .order("nome");

    if (filtro && filtro.value) {
        query = query.eq("regiao_id", filtro.value);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro estados:", error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhum estado cadastrado.</p>";

        return;
    }

    data.forEach(estado => {

        const box = document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${estado.nome}</h3>

            <small>
                Região: ${estado.regioes?.nome || "-"}
            </small>

            <button
                class="red btnExcluirEstado"
                data-id="${estado.id}"
            >
                🗑 Excluir
            </button>
        `;

        lista.appendChild(box);

    });


    document.querySelectorAll(".btnExcluirEstado")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                if (!confirm("Deseja excluir este estado?")) {
                    return;
                }

                const { error } = await supabase
                    .from("estados")
                    .delete()
                    .eq("id", botao.dataset.id);

                if (error) {
                    console.error(error);
                    alert("Erro ao excluir estado.");
                    return;
                }

                await carregarEstados();
                await carregarDashboard();

            });

        });

}


const btnSalvarEstado =
    document.getElementById("btnSalvarEstado");

if (btnSalvarEstado) {

    btnSalvarEstado.addEventListener("click", async () => {

        const regiaoId =
            document.getElementById("estado_regiao").value;

        const nome =
            document.getElementById("novo_estado")
                .value
                .trim();

        if (!regiaoId || !nome) {
            alert("Preencha todos os campos.");
            return;
        }

        const { error } = await supabase
            .from("estados")
            .insert({
                nome,
                regiao_id: regiaoId
            });

        if (error) {
            console.error(error);
            alert("Erro ao salvar estado.");
            return;
        }

        document.getElementById("novo_estado").value = "";

        await carregarEstados();
        await carregarDashboard();

        alert("Estado cadastrado com sucesso!");

    });

}


const filtroEstadoRegiao =
    document.getElementById("filtro_estado_regiao");

if (filtroEstadoRegiao) {

    filtroEstadoRegiao.addEventListener(
        "change",
        carregarEstados
    );

}


/* ==========================================
   CIDADES
========================================== */

async function prepararPaginaCidades() {

    await popularEstados("cidade_estado");
    await popularEstados(
        "filtro_cidade_estado",
        null,
        "Todos os Estados"
    );

    await carregarCidades();

}


async function carregarCidades() {

    const lista = document.getElementById("listaCidades");

    if (!lista) return;

    const filtro =
        document.getElementById("filtro_cidade_estado");

    let query = supabase
        .from("cidades")
        .select(`
            *,
            estados(nome)
        `)
        .order("nome");

    if (filtro && filtro.value) {
        query = query.eq("estado_id", filtro.value);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro cidades:", error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma cidade cadastrada.</p>";

        return;
    }

    data.forEach(cidade => {

        const box = document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${cidade.nome}</h3>

            <small>
                Estado: ${cidade.estados?.nome || "-"}
            </small>

            <button
                class="red btnExcluirCidade"
                data-id="${cidade.id}"
            >
                🗑 Excluir
            </button>
        `;

        lista.appendChild(box);

    });


    document.querySelectorAll(".btnExcluirCidade")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                if (!confirm("Deseja excluir esta cidade?")) {
                    return;
                }

                const { error } = await supabase
                    .from("cidades")
                    .delete()
                    .eq("id", botao.dataset.id);

                if (error) {
                    console.error(error);
                    alert("Erro ao excluir cidade.");
                    return;
                }

                await carregarCidades();
                await carregarDashboard();

            });

        });

}


const btnSalvarCidade =
    document.getElementById("btnSalvarCidade");

if (btnSalvarCidade) {

    btnSalvarCidade.addEventListener("click", async () => {

        const estadoId =
            document.getElementById("cidade_estado").value;

        const nome =
            document.getElementById("nova_cidade")
                .value
                .trim();

        if (!estadoId || !nome) {
            alert("Preencha todos os campos.");
            return;
        }

        const { error } = await supabase
            .from("cidades")
            .insert({
                nome,
                estado_id: estadoId
            });

        if (error) {
            console.error(error);
            alert("Erro ao salvar cidade.");
            return;
        }

        document.getElementById("nova_cidade").value = "";

        await carregarCidades();
        await carregarDashboard();

        alert("Cidade cadastrada com sucesso!");

    });

}


const filtroCidadeEstado =
    document.getElementById("filtro_cidade_estado");

if (filtroCidadeEstado) {

    filtroCidadeEstado.addEventListener(
        "change",
        carregarCidades
    );

}


/* ==========================================
   BAIRROS
========================================== */

async function prepararPaginaBairros() {

    await popularCidades("bairro_cidade");

    await popularCidades(
        "filtro_bairro_cidade",
        null,
        "Todas as Cidades"
    );

    await carregarBairros();

}


async function carregarBairros() {

    const lista = document.getElementById("listaBairros");

    if (!lista) return;

    const filtro =
        document.getElementById("filtro_bairro_cidade");

    let query = supabase
        .from("bairros")
        .select(`
            *,
            cidades(nome)
        `)
        .order("nome");

    if (filtro && filtro.value) {
        query = query.eq("cidade_id", filtro.value);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro bairros:", error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhum bairro cadastrado.</p>";

        return;
    }

    data.forEach(bairro => {

        const box = document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${bairro.nome}</h3>

            <small>
                Cidade: ${bairro.cidades?.nome || "-"}
            </small>

            <button
                class="red btnExcluirBairro"
                data-id="${bairro.id}"
            >
                🗑 Excluir
            </button>
        `;

        lista.appendChild(box);

    });


    document.querySelectorAll(".btnExcluirBairro")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                if (!confirm("Deseja excluir este bairro?")) {
                    return;
                }

                const { error } = await supabase
                    .from("bairros")
                    .delete()
                    .eq("id", botao.dataset.id);

                if (error) {
                    console.error(error);
                    alert("Erro ao excluir bairro.");
                    return;
                }

                await carregarBairros();
                await carregarDashboard();

            });

        });

}


const btnSalvarBairro =
    document.getElementById("btnSalvarBairro");

if (btnSalvarBairro) {

    btnSalvarBairro.addEventListener("click", async () => {

        const cidadeId =
            document.getElementById("bairro_cidade").value;

        const nome =
            document.getElementById("novo_bairro")
                .value
                .trim();

        if (!cidadeId || !nome) {
            alert("Preencha todos os campos.");
            return;
        }

        const { error } = await supabase
            .from("bairros")
            .insert({
                nome,
                cidade_id: cidadeId
            });

        if (error) {
            console.error(error);
            alert("Erro ao salvar bairro.");
            return;
        }

        document.getElementById("novo_bairro").value = "";

        await carregarBairros();
        await carregarDashboard();

        alert("Bairro cadastrado com sucesso!");

    });

}


const filtroBairroCidade =
    document.getElementById("filtro_bairro_cidade");

if (filtroBairroCidade) {

    filtroBairroCidade.addEventListener(
        "change",
        carregarBairros
    );

}


/* ==========================================
   ESPECIALIDADES
========================================== */

async function carregarEspecialidades() {

    const lista =
        document.getElementById("listaEspecialidades");

    if (!lista) return;

    const { data, error } = await supabase
        .from("especialidades")
        .select("*")
        .order("nome");

    if (error) {
        console.error("Erro especialidades:", error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma especialidade cadastrada.</p>";

        return;
    }

    data.forEach(especialidade => {

        const box = document.createElement("div");

        box.className = "box";

        const nomeRede =
            especialidade.rede === "especialistas"
                ? "Rede Especialistas"
                : "Rede Sindilegis";

        box.innerHTML = `
            <h3>${especialidade.nome}</h3>

            <small>${nomeRede}</small>

            <button
                class="red btnExcluirEspecialidade"
                data-id="${especialidade.id}"
            >
                🗑 Excluir
            </button>
        `;

        lista.appendChild(box);

    });


    document.querySelectorAll(".btnExcluirEspecialidade")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                if (!confirm("Deseja excluir esta especialidade?")) {
                    return;
                }

                const { error } = await supabase
                    .from("especialidades")
                    .delete()
                    .eq("id", botao.dataset.id);

                if (error) {
                    console.error(error);
                    alert("Erro ao excluir especialidade.");
                    return;
                }

                await carregarEspecialidades();
                await carregarDashboard();

            });

        });

}


const btnSalvarEspecialidade =
    document.getElementById("btnSalvarEspecialidade");

if (btnSalvarEspecialidade) {

    btnSalvarEspecialidade.addEventListener("click", async () => {

        const nome =
            document.getElementById("nova_especialidade")
                .value
                .trim();

        const rede =
            document.getElementById("especialidade_rede")
                .value;

        if (!nome) {
            alert("Digite o nome da especialidade.");
            return;
        }

        const { error } = await supabase
            .from("especialidades")
            .insert({
                nome,
                rede
            });

        if (error) {
            console.error(error);
            alert("Erro ao salvar especialidade.");
            return;
        }

        document.getElementById("nova_especialidade").value = "";

        await carregarEspecialidades();
        await carregarDashboard();

        alert("Especialidade cadastrada!");

    });

}


/* ==========================================
   CLÍNICAS
========================================== */

async function prepararPaginaClinicas() {

    await popularRegioes("clinica_regiao");
    await popularEspecialidades("clinica_especialidade");

    await carregarClinicas();

}


async function carregarClinicas() {

    const lista =
        document.getElementById("listaClinicas");

    if (!lista) return;

    const filtro =
        document.getElementById("filtro_clinica_nome")
            ?.value
            .trim();

    let query = supabase
        .from("clinicas")
        .select(`
            *,
            regioes(nome),
            estados(nome),
            cidades(nome),
            bairros(nome)
        `)
        .order("nome");

    if (filtro) {
        query = query.ilike("nome", `%${filtro}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro clínicas:", error);
        lista.innerHTML =
            "<p>Erro ao carregar clínicas.</p>";
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma clínica encontrada.</p>";

        return;
    }

    data.forEach(clinica => {

        const box = document.createElement("div");

        box.className = "box";

        const status =
            clinica.ativo ? "ativo" : "inativo";

        const textoStatus =
            clinica.ativo ? "Ativa" : "Inativa";

        box.innerHTML = `
            <h3>${clinica.nome}</h3>

            <small>
                📞 ${clinica.telefone || "Não informado"}
            </small>

            <br>

            <small>
                📍
                ${clinica.bairros?.nome || ""}
                ${clinica.cidades?.nome ? "- " + clinica.cidades.nome : ""}
                ${clinica.estados?.nome ? "/ " + clinica.estados.nome : ""}
            </small>

            <div style="margin-top:10px">

                <span class="status ${status}">
                    ${textoStatus}
                </span>

            </div>

            <button
                class="blue btnEditarClinica"
                data-id="${clinica.id}"
                style="margin-top:12px"
            >
                ✏️ Editar
            </button>
        `;

        lista.appendChild(box);

    });


    document.querySelectorAll(".btnEditarClinica")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                await abrirEditarClinica(botao.dataset.id);

            });

        });

}


/* ==========================================
   FILTRO CLÍNICAS
========================================== */

const filtroClinica =
    document.getElementById("filtro_clinica_nome");

if (filtroClinica) {

    filtroClinica.addEventListener(
        "input",
        carregarClinicas
    );

}


/* ==========================================
   SALVAR CLÍNICA
========================================== */

const btnSalvarClinica =
    document.getElementById("btnSalvarClinica");

if (btnSalvarClinica) {

    btnSalvarClinica.addEventListener("click", async () => {

        const nome =
            document.getElementById("clinica_nome")
                .value
                .trim();

        const telefone =
            document.getElementById("clinica_telefone")
                .value
                .trim();

        const endereco =
            document.getElementById("clinica_endereco")
                .value
                .trim();

        const regiaoId =
            document.getElementById("clinica_regiao").value;

        const estadoId =
            document.getElementById("clinica_estado").value;

        const cidadeId =
            document.getElementById("clinica_cidade").value;

        const bairroId =
            document.getElementById("clinica_bairro").value;

        const especialidadeId =
            document.getElementById("clinica_especialidade").value;

        const rede =
            document.getElementById("clinica_rede").value;

        if (!nome) {
            alert("Digite o nome da clínica.");
            return;
        }

        const { data, error } = await supabase
            .from("clinicas")
            .insert({
                nome,
                telefone,
                endereco,
                regiao_id: regiaoId || null,
                estado_id: estadoId || null,
                cidade_id: cidadeId || null,
                bairro_id: bairroId || null,
                ativo: true
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            alert("Erro ao cadastrar clínica.");
            return;
        }


        if (especialidadeId) {

            const { error: erroVinculo } =
                await supabase
                    .from("clinica_especialidades")
                    .insert({
                        clinica_id: data.id,
                        especialidade_id: especialidadeId,
                        rede
                    });

            if (erroVinculo) {
                console.error(erroVinculo);
            }

        }


        document.getElementById("clinica_nome").value = "";
        document.getElementById("clinica_telefone").value = "";
        document.getElementById("clinica_endereco").value = "";
        document.getElementById("clinica_regiao").value = "";
        document.getElementById("clinica_especialidade").value = "";

        limparSelect(
            document.getElementById("clinica_estado"),
            "Selecione Estado"
        );

        limparSelect(
            document.getElementById("clinica_cidade"),
            "Selecione Cidade"
        );

        limparSelect(
            document.getElementById("clinica_bairro"),
            "Selecione Bairro"
        );

        await carregarClinicas();
        await carregarDashboard();

        alert("Clínica cadastrada com sucesso!");

    });

}


/* ==========================================
   EDITAR CLÍNICA
========================================== */

async function abrirEditarClinica(id) {

    const { data: clinica, error } = await supabase
        .from("clinicas")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        alert("Erro ao carregar clínica.");
        return;
    }

    document.getElementById("edit_clinica_id").value =
        clinica.id;

    document.getElementById("edit_clinica_nome").value =
        clinica.nome || "";

    document.getElementById("edit_clinica_telefone").value =
        clinica.telefone || "";

    document.getElementById("edit_clinica_endereco").value =
        clinica.endereco || "";

    document.getElementById("edit_clinica_ativo").checked =
        clinica.ativo;


    await popularRegioes("edit_clinica_regiao");

    document.getElementById("edit_clinica_regiao").value =
        clinica.regiao_id || "";


    if (clinica.regiao_id) {

        await popularEstados(
            "edit_clinica_estado",
            clinica.regiao_id
        );

        document.getElementById("edit_clinica_estado").value =
            clinica.estado_id || "";

    }


    if (clinica.estado_id) {

        await popularCidades(
            "edit_clinica_cidade",
            clinica.estado_id
        );

        document.getElementById("edit_clinica_cidade").value =
            clinica.cidade_id || "";

    }


    if (clinica.cidade_id) {

        await popularBairros(
            "edit_clinica_bairro",
            clinica.cidade_id
        );

        document.getElementById("edit_clinica_bairro").value =
            clinica.bairro_id || "";

    }


    await popularEspecialidades("edit_especialidade");

    await carregarEspecialidadesDaClinica(id);

    await mostrarPagina("editarClinica");

}


/* ==========================================
   ATUALIZAR CLÍNICA
========================================== */

const btnAtualizarClinica =
    document.getElementById("btnAtualizarClinica");

if (btnAtualizarClinica) {

    btnAtualizarClinica.addEventListener("click", async () => {

        const id =
            document.getElementById("edit_clinica_id").value;

        const dados = {

            nome:
                document.getElementById("edit_clinica_nome")
                    .value.trim(),

            telefone:
                document.getElementById("edit_clinica_telefone")
                    .value.trim(),

            endereco:
                document.getElementById("edit_clinica_endereco")
                    .value.trim(),

            regiao_id:
                document.getElementById("edit_clinica_regiao")
                    .value || null,

            estado_id:
                document.getElementById("edit_clinica_estado")
                    .value || null,

            cidade_id:
                document.getElementById("edit_clinica_cidade")
                    .value || null,

            bairro_id:
                document.getElementById("edit_clinica_bairro")
                    .value || null,

            ativo:
                document.getElementById("edit_clinica_ativo")
                    .checked

        };

        const { error } = await supabase
            .from("clinicas")
            .update(dados)
            .eq("id", id);

        if (error) {
            console.error(error);
            alert("Erro ao atualizar clínica.");
            return;
        }

        await carregarDashboard();

        alert("Clínica atualizada com sucesso!");

    });

}


/* ==========================================
   EXCLUIR CLÍNICA
========================================== */

const btnExcluirClinica =
    document.getElementById("btnExcluirClinica");

if (btnExcluirClinica) {

    btnExcluirClinica.addEventListener("click", async () => {

        const id =
            document.getElementById("edit_clinica_id").value;

        if (!confirm("Deseja realmente excluir esta clínica?")) {
            return;
        }

        await supabase
            .from("clinica_especialidades")
            .delete()
            .eq("clinica_id", id);

        const { error } = await supabase
            .from("clinicas")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            alert("Erro ao excluir clínica.");
            return;
        }

        await carregarDashboard();

        alert("Clínica excluída!");

        await mostrarPagina("clinicas");

    });

}


/* ==========================================
   VOLTAR CLÍNICAS
========================================== */

const btnVoltarClinicas =
    document.getElementById("btnVoltarClinicas");

if (btnVoltarClinicas) {

    btnVoltarClinicas.addEventListener("click", () => {

        mostrarPagina("clinicas");

    });

}


/* ==========================================
   ADICIONAR ESPECIALIDADE À CLÍNICA
========================================== */

const btnAdicionarEspRede =
    document.getElementById("btnAdicionarEspRede");

if (btnAdicionarEspRede) {

    btnAdicionarEspRede.addEventListener("click", async () => {

        const clinicaId =
            document.getElementById("edit_clinica_id").value;

        const especialidadeId =
            document.getElementById("edit_especialidade").value;

        const rede =
            document.getElementById("edit_rede").value;

        if (!especialidadeId) {
            alert("Selecione uma especialidade.");
            return;
        }

        const { error } = await supabase
            .from("clinica_especialidades")
            .insert({
                clinica_id: clinicaId,
                especialidade_id: especialidadeId,
                rede
            });

        if (error) {
            console.error(error);
            alert("Erro ao adicionar especialidade.");
            return;
        }

        document.getElementById("edit_especialidade").value = "";

        await carregarEspecialidadesDaClinica(clinicaId);

    });

}


/* ==========================================
   LISTAR ESPECIALIDADES DA CLÍNICA
========================================== */

async function carregarEspecialidadesDaClinica(clinicaId) {

    const lista =
        document.getElementById("listaEspRede");

    if (!lista) return;

    const { data, error } = await supabase
        .from("clinica_especialidades")
        .select(`
            *,
            especialidades(nome)
        `)
        .eq("clinica_id", clinicaId);

    if (error) {
        console.error(error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma especialidade vinculada.</p>";

        return;
    }

    data.forEach(vinculo => {

        const box = document.createElement("div");

        box.className = "box";

        const rede =
            vinculo.rede === "especialistas"
                ? "Rede Especialistas"
                : "Rede Sindilegis";

        box.innerHTML = `
            <h3>
                ${vinculo.especialidades?.nome || ""}
            </h3>

            <small>${rede}</small>

            <button
                class="red btnRemoverVinculo"
                data-id="${vinculo.id}"
                data-clinica="${clinicaId}"
            >
                🗑 Remover
            </button>
        `;

        lista.appendChild(box);

    });


    document.querySelectorAll(".btnRemoverVinculo")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                if (!confirm("Remover esta especialidade?")) {
                    return;
                }

                const { error } = await supabase
                    .from("clinica_especialidades")
                    .delete()
                    .eq("id", botao.dataset.id);

                if (error) {
                    console.error(error);
                    alert("Erro ao remover vínculo.");
                    return;
                }

                await carregarEspecialidadesDaClinica(
                    botao.dataset.clinica
                );

            });

        });

}


/* ==========================================
   LIGAR CASCATAS
========================================== */

ligarCascataLocalizacao("clinica");
ligarCascataLocalizacao("edit_clinica");


/* ==========================================
   INICIALIZAÇÃO
========================================== */

async function inicializar() {

    console.log("Iniciando painel administrativo...");

    await carregarDashboard();

    await popularRegioes("estado_regiao");
    await popularRegioes(
        "filtro_estado_regiao",
        "Todas as Regiões"
    );

    await popularEstados("cidade_estado");
    await popularEstados(
        "filtro_cidade_estado",
        null,
        "Todos os Estados"
    );

    await popularCidades("bairro_cidade");
    await popularCidades(
        "filtro_bairro_cidade",
        null,
        "Todas as Cidades"
    );

    await popularRegioes("clinica_regiao");

    await popularEspecialidades(
        "clinica_especialidade"
    );

    console.log("Painel carregado!");

}


inicializar();


});
