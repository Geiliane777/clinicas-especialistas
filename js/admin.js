// =====================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO - REDE DE ESPECIALISTAS
// =====================================================


// =====================================================
// CLIENTE SUPABASE
// =====================================================

function getSupabaseClient() {

    if (window.supabaseClient) {
        return window.supabaseClient;
    }

    if (window.supabase && typeof window.supabase.from === "function") {
        return window.supabase;
    }

    console.error("Cliente Supabase não encontrado.");
    return null;
}


const db = getSupabaseClient();


// =====================================================
// CONFIGURAÇÕES
// =====================================================

const paginas = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

    if (!db) {
        alert("Erro ao conectar com o Supabase.");
        return;
    }

    configurarMenu();

    configurarFormularioClinica();

    await carregarDashboard();

    await carregarSelectRegioes();

    await carregarSelectEstados();

    await carregarSelectCidades();

});


// =====================================================
// MENU / NAVEGAÇÃO
// =====================================================

function configurarMenu() {

    const botoes = document.querySelectorAll(".menu-btn");

    botoes.forEach(botao => {

        botao.addEventListener("click", async () => {

            const pagina = botao.dataset.page;

            document
                .querySelectorAll(".menu-btn")
                .forEach(btn => btn.classList.remove("active"));

            botao.classList.add("active");

            abrirPagina(pagina);

        });

    });

}


async function abrirPagina(pagina) {

    document
        .querySelectorAll(".page")
        .forEach(secao => secao.classList.add("hidden"));


    const paginaSelecionada = document.getElementById(pagina);

    if (paginaSelecionada) {
        paginaSelecionada.classList.remove("hidden");
    }


    const titulo = document.getElementById("tituloPagina");

    if (titulo && paginas[pagina]) {
        titulo.textContent = paginas[pagina];
    }


    // Carregamentos específicos

    if (pagina === "dashboard") {
        await carregarDashboard();
    }


    if (pagina === "clinicas") {
        await listarClinicas();
    }


    if (pagina === "especialidades") {
        await listarEspecialidades();
    }


    if (pagina === "regioes") {
        await listarRegioes();
    }


    if (pagina === "estados") {

        await carregarSelectRegioes();

        await listarEstados();

    }


    if (pagina === "cidades") {

        await carregarSelectEstados();

        await listarCidades();

    }


    if (pagina === "bairros") {

        await carregarSelectCidades();

        await listarBairros();

    }

}


// =====================================================
// DASHBOARD
// =====================================================

async function carregarDashboard() {

    try {

        const [
            clinicas,
            clinicasAtivas,
            especialidades,
            estados
        ] = await Promise.all([

            db
                .from("clinicas")
                .select("*", { count: "exact", head: true }),

            db
                .from("clinicas")
                .select("*", { count: "exact", head: true })
                .eq("ativo", true),

            db
                .from("especialidades")
                .select("*", { count: "exact", head: true }),

            db
                .from("estados")
                .select("*", { count: "exact", head: true })

        ]);


        const totalClinicas =
            document.getElementById("totalClinicas");

        const totalClinicasAtivas =
            document.getElementById("totalClinicasAtivas");

        const totalEspecialidades =
            document.getElementById("totalEspecialidades");

        const totalEstados =
            document.getElementById("totalEstados");


        if (totalClinicas) {
            totalClinicas.textContent =
                clinicas.count || 0;
        }


        if (totalClinicasAtivas) {
            totalClinicasAtivas.textContent =
                clinicasAtivas.count || 0;
        }


        if (totalEspecialidades) {
            totalEspecialidades.textContent =
                especialidades.count || 0;
        }


        if (totalEstados) {
            totalEstados.textContent =
                estados.count || 0;
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function limparFormulario(ids) {

    ids.forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {
            elemento.value = "";
        }

    });

}


function escapeHtml(texto) {

    if (!texto) return "";

    const div = document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


function mensagemErro(erro) {

    console.error(erro);

    alert(
        erro?.message ||
        "Ocorreu um erro. Tente novamente."
    );

}


// =====================================================
// ESPECIALIDADES
// =====================================================

async function listarEspecialidades() {

    const container =
        document.getElementById("listaEspecialidades");

    if (!container) return;


    container.innerHTML = `
        <div class="loading">
            Carregando especialidades...
        </div>
    `;


    const { data, error } = await db
        .from("especialidades")
        .select(`
            *,
            clinica_especialidades (
                rede
            )
        `)
        .order("nome");


    if (error) {

        mensagemErro(error);

        container.innerHTML = "";

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                Nenhuma especialidade cadastrada.
            </div>
        `;

        return;

    }


    container.innerHTML = data.map(especialidade => {

        let redes = [];

        if (especialidade.clinica_especialidades) {

            redes =
                especialidade.clinica_especialidades
                    .map(item => item.rede)
                    .filter(rede => rede);

        }


        redes = [...new Set(redes)];


        const redesTexto =
            redes.length > 0
                ? redes.join(" • ")
                : "Ainda não utilizada";


        return `

            <div class="management-item">

                <div class="management-info">

                    <strong>
                        🦷 ${escapeHtml(especialidade.nome)}
                    </strong>

                    <span>
                        ${escapeHtml(redesTexto)}
                    </span>

                </div>


                <div class="management-actions">

                    <button
                        class="btn-edit"
                        onclick="editarEspecialidade(
                            ${especialidade.id},
                            '${escapeHtml(especialidade.nome).replace(/'/g, "\\'")}'
                        )"
                    >
                        ✏️ Editar
                    </button>


                    <button
                        class="btn-delete"
                        onclick="excluirEspecialidade(${especialidade.id})"
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `;

    }).join("");

}


async function salvarEspecialidade() {

    const id =
        document.getElementById("especialidadeEditId").value;

    const nome =
        document
            .getElementById("nomeEspecialidade")
            .value
            .trim();


    if (!nome) {

        alert("Informe o nome da especialidade.");

        return;

    }


    let resultado;


    if (id) {

        resultado = await db
            .from("especialidades")
            .update({
                nome: nome
            })
            .eq("id", id);

    } else {

        resultado = await db
            .from("especialidades")
            .insert({
                nome: nome
            });

    }


    if (resultado.error) {

        mensagemErro(resultado.error);

        return;

    }


    limparFormulario([
        "especialidadeEditId",
        "nomeEspecialidade"
    ]);


    document
        .getElementById("btnSalvarEspecialidade")
        .textContent = "Adicionar";


    await listarEspecialidades();

}


function editarEspecialidade(id, nome) {

    document
        .getElementById("especialidadeEditId")
        .value = id;


    document
        .getElementById("nomeEspecialidade")
        .value = nome;


    document
        .getElementById("btnSalvarEspecialidade")
        .textContent = "Salvar Alteração";


    document
        .getElementById("nomeEspecialidade")
        .focus();

}


async function excluirEspecialidade(id) {

    const confirmar = confirm(
        "Deseja realmente excluir esta especialidade?"
    );


    if (!confirmar) return;


    const { error } = await db
        .from("especialidades")
        .delete()
        .eq("id", id);


    if (error) {

        mensagemErro(error);

        return;

    }


    await listarEspecialidades();

}


// =====================================================
// REGIÕES
// =====================================================

async function listarRegioes() {

    const container =
        document.getElementById("listaRegioes");

    if (!container) return;


    const { data, error } = await db
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        mensagemErro(error);

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                Nenhuma região cadastrada.
            </div>
        `;

        return;

    }


    container.innerHTML = data.map(regiao => `

        <div class="management-item">

            <div class="management-info">

                <strong>
                    🌎 ${escapeHtml(regiao.nome)}
                </strong>

            </div>


            <div class="management-actions">

                <button
                    class="btn-edit"
                    onclick="editarRegiao(
                        ${regiao.id},
                        '${escapeHtml(regiao.nome).replace(/'/g, "\\'")}'
                    )"
                >
                    ✏️ Editar
                </button>


                <button
                    class="btn-delete"
                    onclick="excluirRegiao(${regiao.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarRegiao() {

    const id =
        document.getElementById("regiaoEditId").value;

    const nome =
        document
            .getElementById("nomeRegiao")
            .value
            .trim();


    if (!nome) {

        alert("Informe o nome da região.");

        return;

    }


    let resultado;


    if (id) {

        resultado = await db
            .from("regioes")
            .update({
                nome: nome
            })
            .eq("id", id);

    } else {

        resultado = await db
            .from("regioes")
            .insert({
                nome: nome
            });

    }


    if (resultado.error) {

        mensagemErro(resultado.error);

        return;

    }


    limparFormulario([
        "regiaoEditId",
        "nomeRegiao"
    ]);


    document
        .getElementById("btnSalvarRegiao")
        .textContent = "Adicionar";


    await listarRegioes();

    await carregarSelectRegioes();

}


function editarRegiao(id, nome) {

    document
        .getElementById("regiaoEditId")
        .value = id;


    document
        .getElementById("nomeRegiao")
        .value = nome;


    document
        .getElementById("btnSalvarRegiao")
        .textContent = "Salvar Alteração";


    document
        .getElementById("nomeRegiao")
        .focus();

}


async function excluirRegiao(id) {

    if (!confirm("Deseja excluir esta região?")) {
        return;
    }


    const { error } = await db
        .from("regioes")
        .delete()
        .eq("id", id);


    if (error) {

        mensagemErro(error);

        return;

    }


    await listarRegioes();

    await carregarSelectRegioes();

}


// =====================================================
// ESTADOS
// =====================================================

async function carregarSelectRegioes() {

    const selects = [

        document.getElementById("estadoRegiao"),

        document.getElementById("clinicaRegiao")

    ].filter(Boolean);


    if (selects.length === 0) return;


    const { data, error } = await db
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    selects.forEach(select => {

        const valorAtual = select.value;

        select.innerHTML = `
            <option value="">
                Selecione uma região
            </option>
        `;


        data.forEach(regiao => {

            const option =
                document.createElement("option");

            option.value = regiao.id;

            option.textContent = regiao.nome;

            select.appendChild(option);

        });


        if (valorAtual) {
            select.value = valorAtual;
        }

    });

}


async function listarEstados() {

    const container =
        document.getElementById("listaEstados");

    if (!container) return;


    const { data, error } = await db
        .from("estados")
        .select(`
            *,
            regioes (
                nome
            )
        `)
        .order("nome");


    if (error) {

        mensagemErro(error);

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                Nenhum estado cadastrado.
            </div>
        `;

        return;

    }


    container.innerHTML = data.map(estado => `

        <div class="management-item">

            <div class="management-info">

                <strong>
                    📍 ${escapeHtml(estado.nome)}
                </strong>

                <span>
                    Região:
                    ${escapeHtml(
                        estado.regioes?.nome || "Não informada"
                    )}
                </span>

            </div>


            <div class="management-actions">

                <button
                    class="btn-edit"
                    onclick="editarEstado(
                        ${estado.id},
                        ${estado.regiao_id},
                        '${escapeHtml(estado.nome).replace(/'/g, "\\'")}'
                    )"
                >
                    ✏️ Editar
                </button>


                <button
                    class="btn-delete"
                    onclick="excluirEstado(${estado.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarEstado() {

    const id =
        document.getElementById("estadoEditId").value;

    const regiao_id =
        document.getElementById("estadoRegiao").value;

    const nome =
        document
            .getElementById("nomeEstado")
            .value
            .trim();


    if (!regiao_id || !nome) {

        alert(
            "Preencha a região e o nome do estado."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado = await db
            .from("estados")
            .update({
                nome,
                regiao_id
            })
            .eq("id", id);

    } else {

        resultado = await db
            .from("estados")
            .insert({
                nome,
                regiao_id
            });

    }


    if (resultado.error) {

        mensagemErro(resultado.error);

        return;

    }


    limparFormulario([
        "estadoEditId",
        "nomeEstado"
    ]);


    document
        .getElementById("estadoRegiao")
        .value = "";


    document
        .getElementById("btnSalvarEstado")
        .textContent = "Adicionar Estado";


    await listarEstados();

    await carregarSelectEstados();

}


function editarEstado(id, regiaoId, nome) {

    document
        .getElementById("estadoEditId")
        .value = id;


    document
        .getElementById("estadoRegiao")
        .value = regiaoId;


    document
        .getElementById("nomeEstado")
        .value = nome;


    document
        .getElementById("btnSalvarEstado")
        .textContent = "Salvar Alteração";


    document
        .getElementById("nomeEstado")
        .focus();

}


async function excluirEstado(id) {

    if (!confirm("Deseja excluir este estado?")) {
        return;
    }


    const { error } = await db
        .from("estados")
        .delete()
        .eq("id", id);


    if (error) {

        mensagemErro(error);

        return;

    }


    await listarEstados();

    await carregarSelectEstados();

}


// =====================================================
// CIDADES
// =====================================================

async function carregarSelectEstados() {

    const select =
        document.getElementById("cidadeEstado");

    if (!select) return;


    const { data, error } = await db
        .from("estados")
        .select(`
            *,
            regioes(nome)
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    data.forEach(estado => {

        const option =
            document.createElement("option");

        option.value = estado.id;

        option.textContent =
            `${estado.nome} - ${estado.regioes?.nome || ""}`;

        select.appendChild(option);

    });

}


async function listarCidades() {

    const container =
        document.getElementById("listaCidades");

    if (!container) return;


    const { data, error } = await db
        .from("cidades")
        .select(`
            *,
            estados (
                nome,
                regioes (
                    nome
                )
            )
        `)
        .order("nome");


    if (error) {

        mensagemErro(error);

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                Nenhuma cidade cadastrada.
            </div>
        `;

        return;

    }


    container.innerHTML = data.map(cidade => `

        <div class="management-item">

            <div class="management-info">

                <strong>
                    🏙️ ${escapeHtml(cidade.nome)}
                </strong>

                <span>
                    ${escapeHtml(
                        cidade.estados?.nome || ""
                    )}
                    •
                    ${escapeHtml(
                        cidade.estados?.regioes?.nome || ""
                    )}
                </span>

            </div>


            <div class="management-actions">

                <button
                    class="btn-edit"
                    onclick="editarCidade(
                        ${cidade.id},
                        ${cidade.estado_id},
                        '${escapeHtml(cidade.nome).replace(/'/g, "\\'")}'
                    )"
                >
                    ✏️ Editar
                </button>


                <button
                    class="btn-delete"
                    onclick="excluirCidade(${cidade.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarCidade() {

    const id =
        document.getElementById("cidadeEditId").value;

    const estado_id =
        document.getElementById("cidadeEstado").value;

    const nome =
        document
            .getElementById("nomeCidade")
            .value
            .trim();


    if (!estado_id || !nome) {

        alert(
            "Preencha o estado e o nome da cidade."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado = await db
            .from("cidades")
            .update({
                nome,
                estado_id
            })
            .eq("id", id);

    } else {

        resultado = await db
            .from("cidades")
            .insert({
                nome,
                estado_id
            });

    }


    if (resultado.error) {

        mensagemErro(resultado.error);

        return;

    }


    limparFormulario([
        "cidadeEditId",
        "nomeCidade"
    ]);


    document
        .getElementById("cidadeEstado")
        .value = "";


    document
        .getElementById("btnSalvarCidade")
        .textContent = "Adicionar Cidade";


    await listarCidades();

    await carregarSelectCidades();

}


function editarCidade(id, estadoId, nome) {

    document
        .getElementById("cidadeEditId")
        .value = id;


    document
        .getElementById("cidadeEstado")
        .value = estadoId;


    document
        .getElementById("nomeCidade")
        .value = nome;


    document
        .getElementById("btnSalvarCidade")
        .textContent = "Salvar Alteração";


    document
        .getElementById("nomeCidade")
        .focus();

}


async function excluirCidade(id) {

    if (!confirm("Deseja excluir esta cidade?")) {
        return;
    }


    const { error } = await db
        .from("cidades")
        .delete()
        .eq("id", id);


    if (error) {

        mensagemErro(error);

        return;

    }


    await listarCidades();

    await carregarSelectCidades();

}


// =====================================================
// BAIRROS
// =====================================================

async function carregarSelectCidades() {

    const select =
        document.getElementById("bairroCidade");

    if (!select) return;


    const { data, error } = await db
        .from("cidades")
        .select(`
            *,
            estados(nome)
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


    data.forEach(cidade => {

        const option =
            document.createElement("option");

        option.value = cidade.id;

        option.textContent =
            `${cidade.nome} - ${cidade.estados?.nome || ""}`;

        select.appendChild(option);

    });

}


async function listarBairros() {

    const container =
        document.getElementById("listaBairros");

    if (!container) return;


    const { data, error } = await db
        .from("bairros")
        .select(`
            *,
            cidades (
                nome,
                estados (
                    nome
                )
            )
        `)
        .order("nome");


    if (error) {

        mensagemErro(error);

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                Nenhum bairro cadastrado.
            </div>
        `;

        return;

    }


    container.innerHTML = data.map(bairro => `

        <div class="management-item">

            <div class="management-info">

                <strong>
                    📌 ${escapeHtml(bairro.nome)}
                </strong>

                <span>
                    ${escapeHtml(
                        bairro.cidades?.nome || ""
                    )}
                    -
                    ${escapeHtml(
                        bairro.cidades?.estados?.nome || ""
                    )}
                </span>

            </div>


            <div class="management-actions">

                <button
                    class="btn-edit"
                    onclick="editarBairro(
                        ${bairro.id},
                        ${bairro.cidade_id},
                        '${escapeHtml(bairro.nome).replace(/'/g, "\\'")}'
                    )"
                >
                    ✏️ Editar
                </button>


                <button
                    class="btn-delete"
                    onclick="excluirBairro(${bairro.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarBairro() {

    const id =
        document.getElementById("bairroEditId").value;

    const cidade_id =
        document.getElementById("bairroCidade").value;

    const nome =
        document
            .getElementById("nomeBairro")
            .value
            .trim();


    if (!cidade_id || !nome) {

        alert(
            "Preencha a cidade e o nome do bairro."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado = await db
            .from("bairros")
            .update({
                nome,
                cidade_id
            })
            .eq("id", id);

    } else {

        resultado = await db
            .from("bairros")
            .insert({
                nome,
                cidade_id
            });

    }


    if (resultado.error) {

        mensagemErro(resultado.error);

        return;

    }


    limparFormulario([
        "bairroEditId",
        "nomeBairro"
    ]);


    document
        .getElementById("bairroCidade")
        .value = "";


    document
        .getElementById("btnSalvarBairro")
        .textContent = "Adicionar Bairro";


    await listarBairros();

}


function editarBairro(id, cidadeId, nome) {

    document
        .getElementById("bairroEditId")
        .value = id;


    document
        .getElementById("bairroCidade")
        .value = cidadeId;


    document
        .getElementById("nomeBairro")
        .value = nome;


    document
        .getElementById("btnSalvarBairro")
        .textContent = "Salvar Alteração";


    document
        .getElementById("nomeBairro")
        .focus();

}


async function excluirBairro(id) {

    if (!confirm("Deseja excluir este bairro?")) {
        return;
    }


    const { error } = await db
        .from("bairros")
        .delete()
        .eq("id", id);


    if (error) {

        mensagemErro(error);

        return;

    }


    await listarBairros();

}


// =====================================================
// CLÍNICAS
// =====================================================

async function listarClinicas() {

    const container =
        document.getElementById("listaClinicas");

    if (!container) return;


    container.innerHTML = `
        <tr>
            <td colspan="6">
                Carregando clínicas...
            </td>
        </tr>
    `;


    const busca =
        document
            .getElementById("buscarClinica")
            ?.value
            .trim() || "";


    const status =
        document
            .getElementById("filtroStatusClinica")
            ?.value || "";


    let query = db
        .from("clinicas")
        .select(`
            *,
            bairros (
                nome,
                cidades (
                    nome,
                    estados (
                        nome,
                        regioes (
                            nome
                        )
                    )
                )
            ),
            clinica_especialidades (
                id,
                rede,
                ativo,
                especialidades (
                    id,
                    nome
                )
            )
        `)
        .order("nome");


    if (busca) {

        query = query.ilike(
            "nome",
            `%${busca}%`
        );

    }


    if (status !== "") {

        query = query.eq(
            "ativo",
            status === "true"
        );

    }


    const { data, error } = await query;


    if (error) {

        mensagemErro(error);

        container.innerHTML = `
            <tr>
                <td colspan="6">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhuma clínica encontrada.
                </td>
            </tr>
        `;

        return;

    }


    container.innerHTML = data.map(clinica => {

        const bairro =
            clinica.bairros;


        const cidade =
            bairro?.cidades;


        const estado =
            cidade?.estados;


        const especialidades =
            clinica.clinica_especialidades || [];


        const especialidadesHtml =
            especialidades.length > 0

                ? especialidades.map(item => `

                    <div class="especialidade-tag">

                        <strong>
                            🦷 ${escapeHtml(
                                item.especialidades?.nome ||
                                "Especialidade"
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                item.rede || ""
                            )}
                        </span>

                    </div>

                `).join("")

                : `<span class="sem-especialidade">
                    Nenhuma especialidade
                   </span>`;


        const statusTexto =
            clinica.ativo
                ? "Ativa"
                : "Inativa";


        const statusClasse =
            clinica.ativo
                ? "status-active"
                : "status-inactive";


        const botaoStatus =
            clinica.ativo

                ? `
                    <button
                        class="btn-toggle deactivate"
                        onclick="alterarStatusClinica(
                            ${clinica.id},
                            false
                        )"
                    >
                        Desativar
                    </button>
                `

                : `
                    <button
                        class="btn-toggle activate"
                        onclick="alterarStatusClinica(
                            ${clinica.id},
                            true
                        )"
                    >
                        Ativar
                    </button>
                `;


        return `

            <tr>

                <td>

                    <strong>
                        ${escapeHtml(clinica.nome)}
                    </strong>

                    <small>
                        ${escapeHtml(
                            clinica.endereco || ""
                        )}
                    </small>

                </td>


                <td>

                    ${escapeHtml(
                        bairro?.nome || "Não informado"
                    )}

                    <small>

                        ${escapeHtml(
                            cidade?.nome || ""
                        )}

                        ${cidade && estado ? " - " : ""}

                        ${escapeHtml(
                            estado?.nome || ""
                        )}

                    </small>

                </td>


                <td>

                    ${escapeHtml(
                        clinica.telefone ||
                        "Não informado"
                    )}

                </td>


                <td class="especialidades-cell">

                    ${especialidadesHtml}

                </td>


                <td>

                    <span class="${statusClasse}">

                        ${statusTexto}

                    </span>

                </td>


                <td>

                    <div class="table-actions">

                        <button
                            class="btn-edit"
                            onclick="editarClinica(
                                ${clinica.id}
                            )"
                        >
                            ✏️ Editar
                        </button>

                        ${botaoStatus}

                        <button
                            class="btn-delete"
                            onclick="excluirClinica(
                                ${clinica.id}
                            )"
                        >
                            🗑 Excluir
                        </button>

                    </div>

                </td>

            </tr>

        `;

    }).join("");

}


// =====================================================
// MODAL CLÍNICA
// =====================================================

async function abrirModalClinica() {

    const modal =
        document.getElementById("modalClinica");

    const form =
        document.getElementById("formClinica");


    form.reset();


    document
        .getElementById("clinicaId")
        .value = "";


    document
        .getElementById("tituloModalClinica")
        .textContent = "Nova Clínica";


    document
        .getElementById("areaStatusClinica")
        .classList.add("hidden");


    document
        .getElementById("containerEspecialidades")
        .innerHTML = "";


    await carregarSelectRegioesModal();


    adicionarLinhaEspecialidade();


    modal.classList.remove("hidden");

}


function fecharModalClinica() {

    document
        .getElementById("modalClinica")
        .classList.add("hidden");

}


// =====================================================
// SELECTS DA CLÍNICA
// =====================================================

async function carregarSelectRegioesModal() {

    const select =
        document.getElementById("clinicaRegiao");


    const { data, error } = await db
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;


    data.forEach(regiao => {

        const option =
            document.createElement("option");

        option.value = regiao.id;

        option.textContent = regiao.nome;

        select.appendChild(option);

    });

}


async function carregarEstadosClinica() {

    const regiaoId =
        document.getElementById("clinicaRegiao").value;

    const select =
        document.getElementById("clinicaEstado");


    document
        .getElementById("clinicaCidade")
        .innerHTML = `
            <option value="">
                Selecione
            </option>
        `;


    document
        .getElementById("clinicaBairro")
        .innerHTML = `
            <option value="">
                Selecione
            </option>
        `;


    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;


    if (!regiaoId) return;


    const { data, error } = await db
        .from("estados")
        .select("*")
        .eq("regiao_id", regiaoId)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    data.forEach(estado => {

        const option =
            document.createElement("option");

        option.value = estado.id;

        option.textContent = estado.nome;

        select.appendChild(option);

    });

}


async function carregarCidadesClinica() {

    const estadoId =
        document.getElementById("clinicaEstado").value;

    const select =
        document.getElementById("clinicaCidade");


    document
        .getElementById("clinicaBairro")
        .innerHTML = `
            <option value="">
                Selecione
            </option>
        `;


    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;


    if (!estadoId) return;


    const { data, error } = await db
        .from("cidades")
        .select("*")
        .eq("estado_id", estadoId)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    data.forEach(cidade => {

        const option =
            document.createElement("option");

        option.value = cidade.id;

        option.textContent = cidade.nome;

        select.appendChild(option);

    });

}


async function carregarBairrosClinica() {

    const cidadeId =
        document.getElementById("clinicaCidade").value;

    const select =
        document.getElementById("clinicaBairro");


    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;


    if (!cidadeId) return;


    const { data, error } = await db
        .from("bairros")
        .select("*")
        .eq("cidade_id", cidadeId)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    data.forEach(bairro => {

        const option =
            document.createElement("option");

        option.value = bairro.id;

        option.textContent = bairro.nome;

        select.appendChild(option);

    });

}


// =====================================================
// ESPECIALIDADES DA CLÍNICA
// =====================================================

async function adicionarLinhaEspecialidade(
    especialidadeId = "",
    redeSelecionada = ""
) {

    const container =
        document.getElementById("containerEspecialidades");


    const { data, error } = await db
        .from("especialidades")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    linha.innerHTML = `

        <select class="select-especialidade">

            <option value="">
                Selecione a especialidade
            </option>

            ${data.map(especialidade => `

                <option
                    value="${especialidade.id}"
                    ${
                        String(especialidade.id) ===
                        String(especialidadeId)
                            ? "selected"
                            : ""
                    }
                >
                    ${escapeHtml(especialidade.nome)}
                </option>

            `).join("")}

        </select>


        <select class="select-rede">

            <option value="">
                Selecione a rede
            </option>

            <option
                value="Rede Especialistas"
                ${
                    redeSelecionada ===
                    "Rede Especialistas"
                        ? "selected"
                        : ""
                }
            >
                Rede Especialistas
            </option>

            <option
                value="Rede Sindilegis"
                ${
                    redeSelecionada ===
                    "Rede Sindilegis"
                        ? "selected"
                        : ""
                }
            >
                Rede Sindilegis
            </option>

        </select>


        <button
            type="button"
            class="btn-remove-specialty"
            onclick="removerLinhaEspecialidade(this)"
        >
            ✕
        </button>

    `;


    container.appendChild(linha);

}


function removerLinhaEspecialidade(botao) {

    const linha =
        botao.closest(".linha-especialidade");


    if (linha) {
        linha.remove();
    }

}


// =====================================================
// FORM CLÍNICA
// =====================================================

function configurarFormularioClinica() {

    const form =
        document.getElementById("formClinica");

    if (!form) return;


    form.addEventListener(
        "submit",
        salvarClinica
    );

}


async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document.getElementById("clinicaId").value;


    const nome =
        document
            .getElementById("clinicaNome")
            .value
            .trim();


    const endereco =
        document
            .getElementById("clinicaEndereco")
            .value
            .trim();


    const telefone =
        document
            .getElementById("clinicaTelefone")
            .value
            .trim();


    const bairro_id =
        document
            .getElementById("clinicaBairro")
            .value;


    if (!nome || !endereco) {

        alert(
            "Preencha o nome e endereço da clínica."
        );

        return;

    }


    if (!bairro_id) {

        alert(
            "Selecione a localização completa da clínica."
        );

        return;

    }


    // ==========================================
    // COLETAR ESPECIALIDADES
    // ==========================================

    const linhas =
        document.querySelectorAll(
            ".linha-especialidade"
        );


    const especialidades = [];


    for (const linha of linhas) {

        const especialidade_id =
            linha
                .querySelector(".select-especialidade")
                .value;


        const rede =
            linha
                .querySelector(".select-rede")
                .value;


        if (
            especialidade_id &&
            rede
        ) {

            especialidades.push({
                especialidade_id:
                    Number(especialidade_id),

                rede: rede
            });

        }

    }


    if (especialidades.length === 0) {

        alert(
            "Adicione pelo menos uma especialidade e rede."
        );

        return;

    }


    // ==========================================
    // DADOS DA CLÍNICA
    // ==========================================

    const dadosClinica = {

        nome,
        endereco,
        telefone: telefone || null,
        bairro_id: Number(bairro_id)

    };


    let clinicaId = id;


    // ==========================================
    // EDITAR CLÍNICA
    // ==========================================

    if (id) {

        const { error } = await db
            .from("clinicas")
            .update(dadosClinica)
            .eq("id", id);


        if (error) {

            mensagemErro(error);

            return;

        }

    }


    // ==========================================
    // NOVA CLÍNICA
    // ==========================================

    else {

        const { data, error } = await db
            .from("clinicas")
            .insert({
                ...dadosClinica,
                ativo: true
            })
            .select()
            .single();


        if (error) {

            mensagemErro(error);

            return;

        }


        clinicaId = data.id;

    }


    // ==========================================
    // ATUALIZAR ESPECIALIDADES
    // ==========================================

    if (id) {

        const { error } = await db
            .from("clinica_especialidades")
            .delete()
            .eq("clinica_id", clinicaId);


        if (error) {

            mensagemErro(error);

            return;

        }

    }


    const dadosEspecialidades =
        especialidades.map(item => ({

            clinica_id:
                Number(clinicaId),

            especialidade_id:
                item.especialidade_id,

            rede:
                item.rede,

            ativo: true

        }));


    const { error: erroEspecialidades } =
        await db
            .from("clinica_especialidades")
            .insert(dadosEspecialidades);


    if (erroEspecialidades) {

        mensagemErro(erroEspecialidades);

        return;

    }


    alert(
        id
            ? "Clínica atualizada com sucesso!"
            : "Clínica cadastrada com sucesso!"
    );


    fecharModalClinica();

    await listarClinicas();

    await carregarDashboard();

}


// =====================================================
// EDITAR CLÍNICA
// =====================================================

async function editarClinica(id) {

    const { data, error } = await db
        .from("clinicas")
        .select(`
            *,
            bairros (
                id,
                cidade_id,
                cidades (
                    id,
                    estado_id,
                    estados (
                        id,
                        regiao_id
                    )
                )
            ),
            clinica_especialidades (
                especialidade_id,
                rede
            )
        `)
        .eq("id", id)
        .single();


    if (error) {

        mensagemErro(error);

        return;

    }


    // Limpa modal

    document
        .getElementById("containerEspecialidades")
        .innerHTML = "";


    // Título

    document
        .getElementById("tituloModalClinica")
        .textContent = "Editar Clínica";


    // Dados

    document
        .getElementById("clinicaId")
        .value = data.id;


    document
        .getElementById("clinicaNome")
        .value = data.nome || "";


    document
        .getElementById("clinicaEndereco")
        .value = data.endereco || "";


    document
        .getElementById("clinicaTelefone")
        .value = data.telefone || "";


    // Status aparece somente na edição

    document
        .getElementById("areaStatusClinica")
        .classList.remove("hidden");


    document
        .getElementById("clinicaAtivo")
        .checked = data.ativo;


    // Carrega região

    await carregarSelectRegioesModal();


    const bairro = data.bairros;

    const cidade = bairro?.cidades;

    const estado = cidade?.estados;


    if (estado?.regiao_id) {

        document
            .getElementById("clinicaRegiao")
            .value = estado.regiao_id;


        await carregarEstadosClinica();

    }


    if (cidade?.estado_id) {

        document
            .getElementById("clinicaEstado")
            .value = cidade.estado_id;


        await carregarCidadesClinica();

    }


    if (bairro?.cidade_id) {

        document
            .getElementById("clinicaCidade")
            .value = bairro.cidade_id;


        await carregarBairrosClinica();

    }


    document
        .getElementById("clinicaBairro")
        .value = data.bairro_id || "";


    // Especialidades

    if (
        data.clinica_especialidades &&
        data.clinica_especialidades.length > 0
    ) {

        for (
            const item
            of data.clinica_especialidades
        ) {

            await adicionarLinhaEspecialidade(
                item.especialidade_id,
                item.rede
            );

        }

    } else {

        await adicionarLinhaEspecialidade();

    }


    document
        .getElementById("modalClinica")
        .classList.remove("hidden");

}


// =====================================================
// ATIVAR / DESATIVAR CLÍNICA
// =====================================================

async function alterarStatusClinica(
    id,
    novoStatus
) {

    const texto =
        novoStatus
            ? "ativar"
            : "desativar";


    const confirmar = confirm(
        `Deseja realmente ${texto} esta clínica?`
    );


    if (!confirmar) return;


    const { error } = await db
        .from("clinicas")
        .update({
            ativo: novoStatus
        })
        .eq("id", id);


    if (error) {

        mensagemErro(error);

        return;

    }


    await listarClinicas();

    await carregarDashboard();

}


// =====================================================
// EXCLUIR CLÍNICA
// =====================================================

async function excluirClinica(id) {

    const confirmar = confirm(
        "Deseja realmente excluir esta clínica?\n\nEsta ação também removerá as especialidades vinculadas."
    );


    if (!confirmar) return;


    const { error } = await db
        .from("clinicas")
        .delete()
        .eq("id", id);


    if (error) {

        mensagemErro(error);

        return;

    }


    alert("Clínica excluída com sucesso.");

    await listarClinicas();

    await carregarDashboard();

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    const confirmar = confirm(
        "Deseja realmente sair do painel?"
    );


    if (!confirmar) return;


    window.location.href = "index.html";

}


// =====================================================
// FECHAR MODAL AO CLICAR FORA
// =====================================================

window.addEventListener("click", event => {

    const modal =
        document.getElementById("modalClinica");


    if (
        modal &&
        event.target === modal
    ) {

        fecharModalClinica();

    }

});
