// ==========================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// REDE ESPECIALISTAS
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

const USUARIO = "admin";
const SENHA = "123456";


// ==========================================
// TÍTULOS DAS PÁGINAS
// ==========================================

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


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    configurarLogin();
    configurarMenu();
    configurarBotoes();
    configurarFiltros();

    const logado = localStorage.getItem("adminLogado");

    if (logado === "true") {

        mostrarPainel();

        await carregarDashboard();
        await carregarDadosIniciais();

    }

});


// ==========================================
// LOGIN
// ==========================================

function configurarLogin() {

    const btnLogin = document.getElementById("btnLogin");
    const senhaInput = document.getElementById("senha");

    if (btnLogin) {
        btnLogin.addEventListener("click", fazerLogin);
    }

    if (senhaInput) {

        senhaInput.addEventListener("keypress", (event) => {

            if (event.key === "Enter") {
                fazerLogin();
            }

        });

    }

}


// ==========================================
// FAZER LOGIN
// ==========================================

function fazerLogin() {

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const mensagem = document.getElementById("loginMensagem");


    if (usuario === USUARIO && senha === SENHA) {

        localStorage.setItem("adminLogado", "true");

        mostrarPainel();

        carregarDashboard();
        carregarDadosIniciais();

        return;

    }


    mensagem.textContent = "Usuário ou senha inválidos.";
    mensagem.style.color = "#dc2626";

}


// ==========================================
// MOSTRAR PAINEL
// ==========================================

function mostrarPainel() {

    const loginScreen = document.getElementById("loginScreen");
    const painel = document.getElementById("painel");

    loginScreen.classList.add("hidden");
    painel.classList.remove("hidden");

}


// ==========================================
// LOGOUT
// ==========================================

function configurarBotoes() {

    const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) {

        btnLogout.addEventListener("click", () => {

            localStorage.removeItem("adminLogado");

            location.reload();

        });

    }


    // VOLTAR PARA CLÍNICAS

    const btnVoltarClinicas =
        document.getElementById("btnVoltarClinicas");

    if (btnVoltarClinicas) {

        btnVoltarClinicas.addEventListener("click", () => {

            mostrarPagina("clinicas");

        });

    }


    // SALVAR REGIÃO

    const btnSalvarRegiao =
        document.getElementById("btnSalvarRegiao");

    if (btnSalvarRegiao) {

        btnSalvarRegiao.addEventListener(
            "click",
            salvarRegiao
        );

    }


    // SALVAR ESTADO

    const btnSalvarEstado =
        document.getElementById("btnSalvarEstado");

    if (btnSalvarEstado) {

        btnSalvarEstado.addEventListener(
            "click",
            salvarEstado
        );

    }


    // SALVAR CIDADE

    const btnSalvarCidade =
        document.getElementById("btnSalvarCidade");

    if (btnSalvarCidade) {

        btnSalvarCidade.addEventListener(
            "click",
            salvarCidade
        );

    }


    // SALVAR BAIRRO

    const btnSalvarBairro =
        document.getElementById("btnSalvarBairro");

    if (btnSalvarBairro) {

        btnSalvarBairro.addEventListener(
            "click",
            salvarBairro
        );

    }


    // SALVAR ESPECIALIDADE

    const btnSalvarEspecialidade =
        document.getElementById("btnSalvarEspecialidade");

    if (btnSalvarEspecialidade) {

        btnSalvarEspecialidade.addEventListener(
            "click",
            salvarEspecialidade
        );

    }


    // SALVAR CLÍNICA

    const btnSalvarClinica =
        document.getElementById("btnSalvarClinica");

    if (btnSalvarClinica) {

        btnSalvarClinica.addEventListener(
            "click",
            salvarClinica
        );

    }


    // ATUALIZAR CLÍNICA

    const btnAtualizarClinica =
        document.getElementById("btnAtualizarClinica");

    if (btnAtualizarClinica) {

        btnAtualizarClinica.addEventListener(
            "click",
            atualizarClinica
        );

    }


    // EXCLUIR CLÍNICA

    const btnExcluirClinica =
        document.getElementById("btnExcluirClinica");

    if (btnExcluirClinica) {

        btnExcluirClinica.addEventListener(
            "click",
            excluirClinica
        );

    }


    // ADICIONAR ESPECIALIDADE À CLÍNICA

    const btnAdicionarEspRede =
        document.getElementById("btnAdicionarEspRede");

    if (btnAdicionarEspRede) {

        btnAdicionarEspRede.addEventListener(
            "click",
            adicionarEspecialidadeClinica
        );

    }

}


// ==========================================
// MENU
// ==========================================

function configurarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");


    botoes.forEach((botao) => {

        botao.addEventListener("click", () => {

            const pagina =
                botao.dataset.page;

            mostrarPagina(pagina);

        });

    });

}


// ==========================================
// MOSTRAR PÁGINA
// ==========================================

async function mostrarPagina(nomePagina) {

    document
        .querySelectorAll(".page")
        .forEach((pagina) => {

            pagina.classList.add("hidden");

        });


    const pagina =
        document.getElementById(nomePagina);


    if (pagina) {

        pagina.classList.remove("hidden");

    }


    const titulo =
        document.getElementById("tituloPagina");


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina]
            || nomePagina;

    }


    // ATUALIZAR MENU

    document
        .querySelectorAll(".menu-btn")
        .forEach((botao) => {

            botao.classList.remove("active");

            if (
                botao.dataset.page === nomePagina
            ) {

                botao.classList.add("active");

            }

        });


    // CARREGAR DADOS DA PÁGINA

    if (nomePagina === "dashboard") {

        await carregarDashboard();

    }


    if (nomePagina === "clinicas") {

        await carregarClinicas();
        await popularSelectsClinica();

    }


    if (nomePagina === "especialidades") {

        await carregarEspecialidades();

    }


    if (nomePagina === "regioes") {

        await carregarRegioes();

    }


    if (nomePagina === "estados") {

        await carregarEstados();
        await popularSelectRegioes();

    }


    if (nomePagina === "cidades") {

        await carregarCidades();
        await popularSelectEstados();

    }


    if (nomePagina === "bairros") {

        await carregarBairros();
        await popularSelectCidades();

    }

}


// ==========================================
// CARREGAR DADOS INICIAIS
// ==========================================

async function carregarDadosIniciais() {

    await carregarClinicas();
    await carregarEspecialidades();
    await carregarRegioes();
    await carregarEstados();
    await carregarCidades();
    await carregarBairros();

    await popularSelectsClinica();

    await popularSelectRegioes();
    await popularSelectEstados();
    await popularSelectCidades();

}


// ==========================================
// DASHBOARD
// ==========================================

async function carregarDashboard() {

    try {

        const [
            clinicas,
            especialidades,
            regioes,
            estados,
            cidades,
            bairros
        ] = await Promise.all([

            supabaseClient
                .from("clinicas")
                .select("*", { count: "exact", head: true }),

            supabaseClient
                .from("especialidades")
                .select("*", { count: "exact", head: true }),

            supabaseClient
                .from("regioes")
                .select("*", { count: "exact", head: true }),

            supabaseClient
                .from("estados")
                .select("*", { count: "exact", head: true }),

            supabaseClient
                .from("cidades")
                .select("*", { count: "exact", head: true }),

            supabaseClient
                .from("bairros")
                .select("*", { count: "exact", head: true })

        ]);


        document.getElementById("totalClinicas").textContent =
            clinicas.count || 0;

        document.getElementById("totalEspecialidades").textContent =
            especialidades.count || 0;

        document.getElementById("totalRegioes").textContent =
            regioes.count || 0;

        document.getElementById("totalEstados").textContent =
            estados.count || 0;

        document.getElementById("totalCidades").textContent =
            cidades.count || 0;

        document.getElementById("totalBairros").textContent =
            bairros.count || 0;

    }
    catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// ==========================================
// REGIÕES
// ==========================================

async function salvarRegiao() {

    const input =
        document.getElementById("nova_regiao");

    const nome =
        input.value.trim();


    if (!nome) {

        alert("Digite o nome da região.");

        return;

    }


    const { error } =
        await supabaseClient
            .from("regioes")
            .insert({
                nome: nome
            });


    if (error) {

        console.error(error);

        alert("Erro ao salvar região.");

        return;

    }


    input.value = "";

    await carregarRegioes();
    await popularSelectRegioes();
    await carregarDashboard();

}


// ==========================================
// LISTAR REGIÕES
// ==========================================

async function carregarRegioes() {

    const lista =
        document.getElementById("listaRegioes");


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML = "";


    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma região cadastrada.</p>";

        return;

    }


    data.forEach((regiao) => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    🌎 ${regiao.nome}
                </h3>

                <button
                    class="red"
                    onclick="excluirRegiao('${regiao.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ==========================================
// EXCLUIR REGIÃO
// ==========================================

async function excluirRegiao(id) {

    if (!confirm("Deseja excluir esta região?")) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("regioes")
            .delete()
            .eq("id", id);


    if (error) {

        alert("Erro ao excluir região.");

        console.error(error);

        return;

    }


    await carregarRegioes();
    await carregarDashboard();

}


// ==========================================
// ESTADOS
// ==========================================

async function salvarEstado() {

    const regiao_id =
        document.getElementById("estado_regiao").value;

    const nome =
        document
            .getElementById("novo_estado")
            .value
            .trim();


    if (!regiao_id || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("estados")
            .insert({
                nome: nome,
                regiao_id: regiao_id
            });


    if (error) {

        console.error(error);

        alert("Erro ao salvar estado.");

        return;

    }


    document.getElementById(
        "novo_estado"
    ).value = "";


    await carregarEstados();
    await popularSelectEstados();
    await carregarDashboard();

}


// ==========================================
// LISTAR ESTADOS
// ==========================================

async function carregarEstados() {

    const lista =
        document.getElementById("listaEstados");


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select(`
                *,
                regioes (
                    nome
                )
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML = "";


    data.forEach((estado) => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    📍 ${estado.nome}
                </h3>

                <small>
                    Região:
                    ${estado.regioes?.nome || "-"}
                </small>

                <button
                    class="red"
                    onclick="excluirEstado('${estado.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ==========================================
// EXCLUIR ESTADO
// ==========================================

async function excluirEstado(id) {

    if (!confirm("Deseja excluir este estado?")) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("estados")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert("Erro ao excluir estado.");

        return;

    }


    await carregarEstados();
    await carregarDashboard();

}


// ==========================================
// CIDADES
// ==========================================

async function salvarCidade() {

    const estado_id =
        document.getElementById(
            "cidade_estado"
        ).value;

    const nome =
        document
            .getElementById("nova_cidade")
            .value
            .trim();


    if (!estado_id || !nome) {

        alert("Preencha todos os campos.");

        return;

    }


    const { error } =
        await supabaseClient
            .from("cidades")
            .insert({
                nome: nome,
                estado_id: estado_id
            });


    if (error) {

        console.error(error);

        alert("Erro ao salvar cidade.");

        return;

    }


    document.getElementById(
        "nova_cidade"
    ).value = "";


    await carregarCidades();
    await popularSelectCidades();
    await carregarDashboard();

}


// ==========================================
// LISTAR CIDADES
// ==========================================

async function carregarCidades() {

    const lista =
        document.getElementById("listaCidades");


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select(`
                *,
                estados (
                    nome
                )
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML = "";


    data.forEach((cidade) => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    🏙️ ${cidade.nome}
                </h3>

                <small>
                    Estado:
                    ${cidade.estados?.nome || "-"}
                </small>

                <button
                    class="red"
                    onclick="excluirCidade('${cidade.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ==========================================
// EXCLUIR CIDADE
// ==========================================

async function excluirCidade(id) {

    if (!confirm("Deseja excluir esta cidade?")) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("cidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert("Erro ao excluir cidade.");

        return;

    }


    await carregarCidades();
    await carregarDashboard();

}


// ==========================================
// BAIRROS
// ==========================================

async function salvarBairro() {

    const cidade_id =
        document.getElementById(
            "bairro_cidade"
        ).value;

    const nome =
        document
            .getElementById("novo_bairro")
            .value
            .trim();


    if (!cidade_id || !nome) {

        alert("Preencha todos os campos.");

        return;

    }


    const { error } =
        await supabaseClient
            .from("bairros")
            .insert({
                nome: nome,
                cidade_id: cidade_id
            });


    if (error) {

        console.error(error);

        alert("Erro ao salvar bairro.");

        return;

    }


    document.getElementById(
        "novo_bairro"
    ).value = "";


    await carregarBairros();
    await carregarDashboard();

}


// ==========================================
// LISTAR BAIRROS
// ==========================================

async function carregarBairros() {

    const lista =
        document.getElementById("listaBairros");


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select(`
                *,
                cidades (
                    nome
                )
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML = "";


    data.forEach((bairro) => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    📌 ${bairro.nome}
                </h3>

                <small>
                    Cidade:
                    ${bairro.cidades?.nome || "-"}
                </small>

                <button
                    class="red"
                    onclick="excluirBairro('${bairro.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ==========================================
// EXCLUIR BAIRRO
// ==========================================

async function excluirBairro(id) {

    if (!confirm("Deseja excluir este bairro?")) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("bairros")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert("Erro ao excluir bairro.");

        return;

    }


    await carregarBairros();
    await carregarDashboard();

}


// ==========================================
// ESPECIALIDADES
// ==========================================

async function salvarEspecialidade() {

    const nome =
        document
            .getElementById("nova_especialidade")
            .value
            .trim();

    const rede =
        document.getElementById(
            "especialidade_rede"
        ).value;


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("especialidades")
            .insert({
                nome: nome,
                rede: rede
            });


    if (error) {

        console.error(error);

        alert("Erro ao salvar especialidade.");

        return;

    }


    document.getElementById(
        "nova_especialidade"
    ).value = "";


    await carregarEspecialidades();
    await popularSelectEspecialidades();
    await carregarDashboard();

}


// ==========================================
// LISTAR ESPECIALIDADES
// ==========================================

async function carregarEspecialidades() {

    const lista =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML = "";


    data.forEach((especialidade) => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    🦷 ${especialidade.nome}
                </h3>

                <small>
                    Rede:
                    ${especialidade.rede || "-"}
                </small>

                <button
                    class="red"
                    onclick="excluirEspecialidade('${especialidade.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ==========================================
// EXCLUIR ESPECIALIDADE
// ==========================================

async function excluirEspecialidade(id) {

    if (!confirm(
        "Deseja excluir esta especialidade?"
    )) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("especialidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert("Erro ao excluir especialidade.");

        return;

    }


    await carregarEspecialidades();
    await carregarDashboard();

}


// ==========================================
// CLÍNICAS
// ==========================================

async function salvarClinica() {

    const nome =
        document.getElementById(
            "clinica_nome"
        ).value.trim();

    const telefone =
        document.getElementById(
            "clinica_telefone"
        ).value.trim();

    const endereco =
        document.getElementById(
            "clinica_endereco"
        ).value.trim();

    const regiao_id =
        document.getElementById(
            "clinica_regiao"
        ).value;

    const estado_id =
        document.getElementById(
            "clinica_estado"
        ).value;

    const cidade_id =
        document.getElementById(
            "clinica_cidade"
        ).value;

    const bairro_id =
        document.getElementById(
            "clinica_bairro"
        ).value;

    const especialidade_id =
        document.getElementById(
            "clinica_especialidade"
        ).value;

    const rede =
        document.getElementById(
            "clinica_rede"
        ).value;


    if (!nome) {

        alert(
            "Digite pelo menos o nome da clínica."
        );

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .insert({
                nome,
                telefone,
                endereco,
                regiao_id: regiao_id || null,
                estado_id: estado_id || null,
                cidade_id: cidade_id || null,
                bairro_id: bairro_id || null,
                ativo: true
            })
            .select()
            .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar clínica."
        );

        return;

    }


    // ADICIONAR ESPECIALIDADE

    if (especialidade_id && data) {

        await supabaseClient
            .from("clinica_especialidades")
            .insert({
                clinica_id: data.id,
                especialidade_id,
                rede
            });

    }


    limparFormularioClinica();

    await carregarClinicas();
    await carregarDashboard();

    alert("Clínica cadastrada com sucesso!");

}


// ==========================================
// LISTAR CLÍNICAS
// ==========================================

async function carregarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select(`
                *,
                regioes(nome),
                estados(nome),
                cidades(nome),
                bairros(nome)
            `)
            .order("nome");


    if (error) {

        console.error(
            "Erro ao carregar clínicas:",
            error
        );

        lista.innerHTML =
            "<p>Erro ao carregar clínicas.</p>";

        return;

    }


    lista.innerHTML = "";


    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma clínica cadastrada.</p>";

        return;

    }


    data.forEach((clinica) => {

        const status =
            clinica.ativo !== false
                ? "ativo"
                : "inativo";


        lista.innerHTML += `

            <div class="box clinica-item">

                <h3>
                    🏥 ${clinica.nome}
                </h3>

                <small>
                    📞 ${clinica.telefone || "-"}
                </small>

                <small>
                    📍
                    ${clinica.cidades?.nome || "-"}
                    -
                    ${clinica.estados?.nome || "-"}
                </small>

                <span class="status ${status}">
                    ${status === "ativo"
                        ? "Ativa"
                        : "Inativa"}
                </span>

                <br><br>

                <button
                    class="blue"
                    onclick="editarClinica('${clinica.id}')"
                >
                    ✏️ Editar
                </button>

            </div>

        `;

    });

}


// ==========================================
// EDITAR CLÍNICA
// ==========================================

async function editarClinica(id) {

    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao carregar dados da clínica."
        );

        return;

    }


    // MOSTRAR PÁGINA

    await mostrarPagina("editarClinica");


    // POPULAR SELECTS

    await popularSelectRegioes(
        "edit_clinica_regiao"
    );

    await popularSelectEstados(
        "edit_clinica_estado"
    );

    await popularSelectCidades(
        "edit_clinica_cidade"
    );

    await popularSelectBairros(
        "edit_clinica_bairro"
    );

    await popularSelectEspecialidades(
        "edit_especialidade"
    );


    // PREENCHER DADOS

    document.getElementById(
        "edit_clinica_id"
    ).value = data.id;

    document.getElementById(
        "edit_clinica_nome"
    ).value = data.nome || "";

    document.getElementById(
        "edit_clinica_telefone"
    ).value = data.telefone || "";

    document.getElementById(
        "edit_clinica_endereco"
    ).value = data.endereco || "";

    document.getElementById(
        "edit_clinica_regiao"
    ).value = data.regiao_id || "";

    document.getElementById(
        "edit_clinica_estado"
    ).value = data.estado_id || "";

    document.getElementById(
        "edit_clinica_cidade"
    ).value = data.cidade_id || "";

    document.getElementById(
        "edit_clinica_bairro"
    ).value = data.bairro_id || "";

    document.getElementById(
        "edit_clinica_ativo"
    ).checked = data.ativo !== false;


    // CARREGAR ESPECIALIDADES

    await carregarEspecialidadesClinica(id);

}


// ==========================================
// ATUALIZAR CLÍNICA
// ==========================================

async function atualizarClinica() {

    const id =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    if (!id) {

        alert(
            "Nenhuma clínica selecionada."
        );

        return;

    }


    const dados = {

        nome:
            document.getElementById(
                "edit_clinica_nome"
            ).value.trim(),

        telefone:
            document.getElementById(
                "edit_clinica_telefone"
            ).value.trim(),

        endereco:
            document.getElementById(
                "edit_clinica_endereco"
            ).value.trim(),

        regiao_id:
            document.getElementById(
                "edit_clinica_regiao"
            ).value || null,

        estado_id:
            document.getElementById(
                "edit_clinica_estado"
            ).value || null,

        cidade_id:
            document.getElementById(
                "edit_clinica_cidade"
            ).value || null,

        bairro_id:
            document.getElementById(
                "edit_clinica_bairro"
            ).value || null,

        ativo:
            document.getElementById(
                "edit_clinica_ativo"
            ).checked

    };


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update(dados)
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao atualizar clínica."
        );

        return;

    }


    alert(
        "Clínica atualizada com sucesso!"
    );


    await carregarClinicas();
    await carregarDashboard();

}


// ==========================================
// EXCLUIR CLÍNICA
// ==========================================

async function excluirClinica() {

    const id =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    if (!id) return;


    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta clínica?"
        );


    if (!confirmar) return;


    // EXCLUIR VÍNCULOS

    await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq("clinica_id", id);


    // EXCLUIR CLÍNICA

    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir clínica."
        );

        return;

    }


    alert(
        "Clínica excluída com sucesso!"
    );


    await carregarClinicas();
    await carregarDashboard();

    mostrarPagina("clinicas");

}


// ==========================================
// ESPECIALIDADES DA CLÍNICA
// ==========================================

async function adicionarEspecialidadeClinica() {

    const clinica_id =
        document.getElementById(
            "edit_clinica_id"
        ).value;

    const especialidade_id =
        document.getElementById(
            "edit_especialidade"
        ).value;

    const rede =
        document.getElementById(
            "edit_rede"
        ).value;


    if (!clinica_id) {

        alert(
            "Selecione uma clínica."
        );

        return;

    }


    if (!especialidade_id) {

        alert(
            "Selecione uma especialidade."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert({
                clinica_id,
                especialidade_id,
                rede
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao adicionar especialidade."
        );

        return;

    }


    document.getElementById(
        "edit_especialidade"
    ).value = "";


    await carregarEspecialidadesClinica(
        clinica_id
    );

}


// ==========================================
// LISTAR ESPECIALIDADES DA CLÍNICA
// ==========================================

async function carregarEspecialidadesClinica(clinica_id) {

    const lista =
        document.getElementById(
            "listaEspRede"
        );


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                *,
                especialidades (
                    nome
                )
            `)
            .eq("clinica_id", clinica_id);


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


    data.forEach((item) => {

        lista.innerHTML += `

            <div class="box">

                <strong>
                    🦷
                    ${item.especialidades?.nome || "-"}
                </strong>

                <small>
                    Rede: ${item.rede}
                </small>

                <button
                    class="red"
                    onclick="removerEspecialidadeClinica('${item.id}')"
                >
                    Remover
                </button>

            </div>

        `;

    });

}


// ==========================================
// REMOVER ESPECIALIDADE DA CLÍNICA
// ==========================================

async function removerEspecialidadeClinica(id) {

    if (!confirm(
        "Deseja remover esta especialidade?"
    )) {
        return;
    }


    const clinica_id =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao remover especialidade."
        );

        return;

    }


    await carregarEspecialidadesClinica(
        clinica_id
    );

}


// ==========================================
// POPULAR SELECT DE REGIÕES
// ==========================================

async function popularSelectRegioes(
    selectId = "estado_regiao"
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;


    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        '<option value="">Selecione Região</option>';


    data.forEach((item) => {

        select.innerHTML += `

            <option value="${item.id}">
                ${item.nome}
            </option>

        `;

    });

}


// ==========================================
// POPULAR SELECT DE ESTADOS
// ==========================================

async function popularSelectEstados(
    selectId = "cidade_estado"
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        '<option value="">Selecione Estado</option>';


    data.forEach((item) => {

        select.innerHTML += `

            <option value="${item.id}">
                ${item.nome}
            </option>

        `;

    });

}


// ==========================================
// POPULAR SELECT DE CIDADES
// ==========================================

async function popularSelectCidades(
    selectId = "bairro_cidade"
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        '<option value="">Selecione Cidade</option>';


    data.forEach((item) => {

        select.innerHTML += `

            <option value="${item.id}">
                ${item.nome}
            </option>

        `;

    });

}


// ==========================================
// POPULAR SELECT DE BAIRROS
// ==========================================

async function popularSelectBairros(
    selectId = "clinica_bairro"
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        '<option value="">Selecione Bairro</option>';


    data.forEach((item) => {

        select.innerHTML += `

            <option value="${item.id}">
                ${item.nome}
            </option>

        `;

    });

}


// ==========================================
// POPULAR SELECT DE ESPECIALIDADES
// ==========================================

async function popularSelectEspecialidades(
    selectId = "clinica_especialidade"
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;


    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        '<option value="">Selecione Especialidade</option>';


    data.forEach((item) => {

        select.innerHTML += `

            <option value="${item.id}">
                ${item.nome}
            </option>

        `;

    });

}


// ==========================================
// POPULAR TODOS OS SELECTS DA CLÍNICA
// ==========================================

async function popularSelectsClinica() {

    await popularSelectRegioes(
        "clinica_regiao"
    );

    await popularSelectEstados(
        "clinica_estado"
    );

    await popularSelectCidades(
        "clinica_cidade"
    );

    await popularSelectBairros(
        "clinica_bairro"
    );

    await popularSelectEspecialidades(
        "clinica_especialidade"
    );

}


// ==========================================
// FILTROS
// ==========================================

function configurarFiltros() {

    const filtroClinica =
        document.getElementById(
            "filtro_clinica_nome"
        );


    if (filtroClinica) {

        filtroClinica.addEventListener(
            "input",
            filtrarClinicas
        );

    }

}


// ==========================================
// FILTRAR CLÍNICAS
// ==========================================

function filtrarClinicas() {

    const busca =
        document
            .getElementById(
                "filtro_clinica_nome"
            )
            .value
            .toLowerCase();


    const clinicas =
        document.querySelectorAll(
            ".clinica-item"
        );


    clinicas.forEach((clinica) => {

        const texto =
            clinica.textContent.toLowerCase();


        if (texto.includes(busca)) {

            clinica.style.display = "";

        }
        else {

            clinica.style.display = "none";

        }

    });

}


// ==========================================
// LIMPAR FORMULÁRIO DA CLÍNICA
// ==========================================

function limparFormularioClinica() {

    const campos = [

        "clinica_nome",
        "clinica_telefone",
        "clinica_endereco"

    ];


    campos.forEach((id) => {

        const campo =
            document.getElementById(id);

        if (campo) {
            campo.value = "";
        }

    });


    const selects = [

        "clinica_regiao",
        "clinica_estado",
        "clinica_cidade",
        "clinica_bairro",
        "clinica_especialidade"

    ];


    selects.forEach((id) => {

        const select =
            document.getElementById(id);

        if (select) {
            select.value = "";
        }

    });

}


// ==========================================
// FUNÇÕES GLOBAIS
// NECESSÁRIO PARA ONCLICK
// ==========================================

window.editarClinica = editarClinica;

window.excluirRegiao = excluirRegiao;
window.excluirEstado = excluirEstado;
window.excluirCidade = excluirCidade;
window.excluirBairro = excluirBairro;
window.excluirEspecialidade = excluirEspecialidade;

window.removerEspecialidadeClinica =
    removerEspecialidadeClinica;
