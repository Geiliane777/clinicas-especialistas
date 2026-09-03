// ==========================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// ==========================================


// ==========================================
// VARIÁVEIS
// ==========================================

let paginaAtual = "dashboard";


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    configurarMenu();

    configurarEventos();

    carregarDashboard();

});


// ==========================================
// CONFIGURAR MENU
// ==========================================

function configurarMenu() {

    const botoes = document.querySelectorAll(".menu-btn");

    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            const pagina = botao.dataset.page;

            abrirPagina(pagina);

        });

    });

}


// ==========================================
// ABRIR PÁGINA
// ==========================================

function abrirPagina(pagina) {

    paginaAtual = pagina;


    document.querySelectorAll(".page").forEach(item => {

        item.classList.add("hidden");

    });


    const paginaSelecionada = document.getElementById(pagina);

    if (paginaSelecionada) {

        paginaSelecionada.classList.remove("hidden");

    }


    document.querySelectorAll(".menu-btn").forEach(botao => {

        botao.classList.remove("active");

    });


    const botaoAtivo = document.querySelector(
        `.menu-btn[data-page="${pagina}"]`
    );

    if (botaoAtivo) {

        botaoAtivo.classList.add("active");

    }


    const titulos = {

        dashboard: "Dashboard",
        clinicas: "Clínicas",
        especialidades: "Especialidades",
        regioes: "Regiões",
        estados: "Estados",
        cidades: "Cidades",
        bairros: "Bairros"

    };


    document.getElementById("tituloPagina").textContent =
        titulos[pagina] || "Dashboard";


    carregarDadosPagina(pagina);

}


// ==========================================
// CARREGAR DADOS DA PÁGINA
// ==========================================

function carregarDadosPagina(pagina) {

    switch (pagina) {

        case "dashboard":
            carregarDashboard();
            break;

        case "clinicas":
            listarClinicas();
            break;

        case "especialidades":
            listarEspecialidades();
            break;

        case "regioes":
            listarRegioes();
            break;

        case "estados":
            carregarRegioesSelect();
            listarEstados();
            break;

        case "cidades":
            carregarEstadosSelect();
            listarCidades();
            break;

        case "bairros":
            carregarCidadesSelect();
            listarBairros();
            break;

    }

}


// ==========================================
// EVENTOS
// ==========================================

function configurarEventos() {

    const busca = document.getElementById("buscarClinica");

    if (busca) {

        busca.addEventListener("input", listarClinicas);

    }


    const filtro = document.getElementById(
        "filtroStatusClinica"
    );

    if (filtro) {

        filtro.addEventListener("change", listarClinicas);

    }


    const formClinica = document.getElementById(
        "formClinica"
    );

    if (formClinica) {

        formClinica.addEventListener(
            "submit",
            salvarClinica
        );

    }

}


// ==========================================
// DASHBOARD
// ==========================================

async function carregarDashboard() {

    try {

        const {
            count: totalClinicas,
            error: erroClinicas
        } = await supabase
            .from("clinicas")
            .select("*", {
                count: "exact",
                head: true
            });


        const {
            count: totalAtivas,
            error: erroAtivas
        } = await supabase
            .from("clinicas")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("ativo", true);


        const {
            count: totalEspecialidades,
            error: erroEspecialidades
        } = await supabase
            .from("especialidades")
            .select("*", {
                count: "exact",
                head: true
            });


        const {
            count: totalEstados,
            error: erroEstados
        } = await supabase
            .from("estados")
            .select("*", {
                count: "exact",
                head: true
            });


        document.getElementById(
            "totalClinicas"
        ).textContent = totalClinicas || 0;


        document.getElementById(
            "totalClinicasAtivas"
        ).textContent = totalAtivas || 0;


        document.getElementById(
            "totalEspecialidades"
        ).textContent = totalEspecialidades || 0;


        document.getElementById(
            "totalEstados"
        ).textContent = totalEstados || 0;


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// ==========================================
// REGIÕES
// ==========================================

async function listarRegioes() {

    const lista = document.getElementById(
        "listaRegioes"
    );

    lista.innerHTML = "Carregando...";


    const { data, error } = await supabase
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        lista.innerHTML =
            "Erro ao carregar regiões.";

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma região cadastrada.</p>";

        return;

    }


    lista.innerHTML = data.map(regiao => `

        <div class="item-gerenciamento">

            <strong>
                ${regiao.nome}
            </strong>

            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarRegiao(${regiao.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirRegiao(${regiao.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarRegiao() {

    const id = document
        .getElementById("regiaoEditId")
        .value;

    const nome = document
        .getElementById("nomeRegiao")
        .value
        .trim();


    if (!nome) {

        alert("Digite o nome da região.");

        return;

    }


    let resultado;


    if (id) {

        resultado = await supabase
            .from("regioes")
            .update({ nome })
            .eq("id", id);

    } else {

        resultado = await supabase
            .from("regioes")
            .insert([{ nome }]);

    }


    if (resultado.error) {

        alert(
            "Erro: " +
            resultado.error.message
        );

        return;

    }


    cancelarEdicaoRegiao();

    listarRegioes();

    carregarRegioesSelect();

}


async function editarRegiao(id) {

    const { data, error } = await supabase
        .from("regioes")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        alert("Erro ao carregar região.");

        return;

    }


    document.getElementById(
        "regiaoEditId"
    ).value = data.id;


    document.getElementById(
        "nomeRegiao"
    ).value = data.nome;


    document.getElementById(
        "btnSalvarRegiao"
    ).textContent = "💾 Atualizar Região";


    document.getElementById(
        "nomeRegiao"
    ).focus();

}


function cancelarEdicaoRegiao() {

    document.getElementById(
        "regiaoEditId"
    ).value = "";

    document.getElementById(
        "nomeRegiao"
    ).value = "";

    document.getElementById(
        "btnSalvarRegiao"
    ).textContent = "💾 Salvar Região";

}


async function excluirRegiao(id) {

    if (!confirm("Deseja excluir esta região?")) {
        return;
    }


    const { error } = await supabase
        .from("regioes")
        .delete()
        .eq("id", id);


    if (error) {

        alert(
            "Erro ao excluir: " +
            error.message
        );

        return;

    }


    listarRegioes();

}


// ==========================================
// ESTADOS
// ==========================================

async function carregarRegioesSelect() {

    const select = document.getElementById(
        "estadoRegiao"
    );

    if (!select) return;


    const { data } = await supabase
        .from("regioes")
        .select("*")
        .order("nome");


    select.innerHTML = `
        <option value="">
            Selecione uma região
        </option>
    `;


    data?.forEach(regiao => {

        select.innerHTML += `
            <option value="${regiao.id}">
                ${regiao.nome}
            </option>
        `;

    });

}


async function listarEstados() {

    const lista = document.getElementById(
        "listaEstados"
    );

    lista.innerHTML = "Carregando...";


    const { data, error } = await supabase
        .from("estados")
        .select(`
            *,
            regioes(nome)
        `)
        .order("nome");


    if (error) {

        lista.innerHTML =
            "Erro ao carregar estados.";

        return;

    }


    lista.innerHTML = data.map(estado => `

        <div class="item-gerenciamento">

            <div>

                <strong>${estado.nome}</strong>

                <small>
                    ${estado.regioes?.nome || ""}
                </small>

            </div>

            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarEstado(${estado.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirEstado(${estado.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarEstado() {

    const id = document
        .getElementById("estadoEditId")
        .value;

    const nome = document
        .getElementById("nomeEstado")
        .value
        .trim();

    const regiao_id = document
        .getElementById("estadoRegiao")
        .value;


    if (!nome || !regiao_id) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {
        nome,
        regiao_id
    };


    let resultado;


    if (id) {

        resultado = await supabase
            .from("estados")
            .update(dados)
            .eq("id", id);

    } else {

        resultado = await supabase
            .from("estados")
            .insert([dados]);

    }


    if (resultado.error) {

        alert(resultado.error.message);

        return;

    }


    document.getElementById(
        "estadoEditId"
    ).value = "";

    document.getElementById(
        "nomeEstado"
    ).value = "";

    document.getElementById(
        "estadoRegiao"
    ).value = "";


    document.getElementById(
        "btnSalvarEstado"
    ).textContent =
        "💾 Salvar Estado";


    listarEstados();

    carregarEstadosSelect();

}


async function editarEstado(id) {

    const { data, error } = await supabase
        .from("estados")
        .select("*")
        .eq("id", id)
        .single();


    if (error) return;


    document.getElementById(
        "estadoEditId"
    ).value = data.id;

    document.getElementById(
        "nomeEstado"
    ).value = data.nome;

    document.getElementById(
        "estadoRegiao"
    ).value = data.regiao_id;


    document.getElementById(
        "btnSalvarEstado"
    ).textContent =
        "💾 Atualizar Estado";

}


async function excluirEstado(id) {

    if (!confirm("Deseja excluir este estado?")) {
        return;
    }


    const { error } = await supabase
        .from("estados")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;

    }


    listarEstados();

}


// ==========================================
// CIDADES
// ==========================================

async function carregarEstadosSelect() {

    const select = document.getElementById(
        "cidadeEstado"
    );

    if (!select) return;


    const { data } = await supabase
        .from("estados")
        .select("*")
        .order("nome");


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    data?.forEach(estado => {

        select.innerHTML += `
            <option value="${estado.id}">
                ${estado.nome}
            </option>
        `;

    });

}


async function listarCidades() {

    const lista = document.getElementById(
        "listaCidades"
    );

    lista.innerHTML = "Carregando...";


    const { data, error } = await supabase
        .from("cidades")
        .select(`
            *,
            estados(nome)
        `)
        .order("nome");


    if (error) {

        lista.innerHTML =
            "Erro ao carregar cidades.";

        return;

    }


    lista.innerHTML = data.map(cidade => `

        <div class="item-gerenciamento">

            <div>

                <strong>${cidade.nome}</strong>

                <small>
                    ${cidade.estados?.nome || ""}
                </small>

            </div>

            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarCidade(${cidade.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirCidade(${cidade.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarCidade() {

    const id = document
        .getElementById("cidadeEditId")
        .value;

    const nome = document
        .getElementById("nomeCidade")
        .value
        .trim();

    const estado_id = document
        .getElementById("cidadeEstado")
        .value;


    if (!nome || !estado_id) {

        alert("Preencha todos os campos.");

        return;

    }


    const dados = {
        nome,
        estado_id
    };


    let resultado;


    if (id) {

        resultado = await supabase
            .from("cidades")
            .update(dados)
            .eq("id", id);

    } else {

        resultado = await supabase
            .from("cidades")
            .insert([dados]);

    }


    if (resultado.error) {

        alert(resultado.error.message);

        return;

    }


    document.getElementById(
        "cidadeEditId"
    ).value = "";

    document.getElementById(
        "nomeCidade"
    ).value = "";

    document.getElementById(
        "cidadeEstado"
    ).value = "";


    document.getElementById(
        "btnSalvarCidade"
    ).textContent =
        "💾 Salvar Cidade";


    listarCidades();

    carregarCidadesSelect();

}


async function editarCidade(id) {

    const { data, error } = await supabase
        .from("cidades")
        .select("*")
        .eq("id", id)
        .single();


    if (error) return;


    document.getElementById(
        "cidadeEditId"
    ).value = data.id;

    document.getElementById(
        "nomeCidade"
    ).value = data.nome;

    document.getElementById(
        "cidadeEstado"
    ).value = data.estado_id;


    document.getElementById(
        "btnSalvarCidade"
    ).textContent =
        "💾 Atualizar Cidade";

}


async function excluirCidade(id) {

    if (!confirm("Deseja excluir esta cidade?")) {
        return;
    }


    const { error } = await supabase
        .from("cidades")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;

    }


    listarCidades();

}


// ==========================================
// BAIRROS
// ==========================================

async function carregarCidadesSelect() {

    const select = document.getElementById(
        "bairroCidade"
    );

    if (!select) return;


    const { data } = await supabase
        .from("cidades")
        .select("*")
        .order("nome");


    select.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


    data?.forEach(cidade => {

        select.innerHTML += `
            <option value="${cidade.id}">
                ${cidade.nome}
            </option>
        `;

    });

}


async function listarBairros() {

    const lista = document.getElementById(
        "listaBairros"
    );

    lista.innerHTML = "Carregando...";


    const { data, error } = await supabase
        .from("bairros")
        .select(`
            *,
            cidades(nome)
        `)
        .order("nome");


    if (error) {

        lista.innerHTML =
            "Erro ao carregar bairros.";

        return;

    }


    lista.innerHTML = data.map(bairro => `

        <div class="item-gerenciamento">

            <div>

                <strong>${bairro.nome}</strong>

                <small>
                    ${bairro.cidades?.nome || ""}
                </small>

            </div>

            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarBairro(${bairro.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirBairro(${bairro.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarBairro() {

    const id = document
        .getElementById("bairroEditId")
        .value;

    const nome = document
        .getElementById("nomeBairro")
        .value
        .trim();

    const cidade_id = document
        .getElementById("bairroCidade")
        .value;


    if (!nome || !cidade_id) {

        alert("Preencha todos os campos.");

        return;

    }


    const dados = {
        nome,
        cidade_id
    };


    let resultado;


    if (id) {

        resultado = await supabase
            .from("bairros")
            .update(dados)
            .eq("id", id);

    } else {

        resultado = await supabase
            .from("bairros")
            .insert([dados]);

    }


    if (resultado.error) {

        alert(resultado.error.message);

        return;

    }


    document.getElementById(
        "bairroEditId"
    ).value = "";

    document.getElementById(
        "nomeBairro"
    ).value = "";

    document.getElementById(
        "bairroCidade"
    ).value = "";


    document.getElementById(
        "btnSalvarBairro"
    ).textContent =
        "💾 Salvar Bairro";


    listarBairros();

}


async function editarBairro(id) {

    const { data, error } = await supabase
        .from("bairros")
        .select("*")
        .eq("id", id)
        .single();


    if (error) return;


    document.getElementById(
        "bairroEditId"
    ).value = data.id;

    document.getElementById(
        "nomeBairro"
    ).value = data.nome;

    document.getElementById(
        "bairroCidade"
    ).value = data.cidade_id;


    document.getElementById(
        "btnSalvarBairro"
    ).textContent =
        "💾 Atualizar Bairro";

}


async function excluirBairro(id) {

    if (!confirm("Deseja excluir este bairro?")) {
        return;
    }


    const { error } = await supabase
        .from("bairros")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;

    }


    listarBairros();

}


// ==========================================
// ESPECIALIDADES
// ==========================================

async function listarEspecialidades() {

    const lista = document.getElementById(
        "listaEspecialidades"
    );

    lista.innerHTML = "Carregando...";


    const { data, error } = await supabase
        .from("especialidades")
        .select("*")
        .order("nome");


    if (error) {

        lista.innerHTML =
            "Erro ao carregar especialidades.";

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma especialidade cadastrada.</p>";

        return;

    }


    lista.innerHTML = data.map(especialidade => `

        <div class="item-gerenciamento">

            <strong>
                🦷 ${especialidade.nome}
            </strong>

            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarEspecialidade(${especialidade.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirEspecialidade(${especialidade.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarEspecialidade() {

    const id = document
        .getElementById("especialidadeEditId")
        .value;

    const nome = document
        .getElementById("nomeEspecialidade")
        .value
        .trim();


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado = await supabase
            .from("especialidades")
            .update({ nome })
            .eq("id", id);

    } else {

        resultado = await supabase
            .from("especialidades")
            .insert([{ nome }]);

    }


    if (resultado.error) {

        alert(resultado.error.message);

        return;

    }


    document.getElementById(
        "especialidadeEditId"
    ).value = "";

    document.getElementById(
        "nomeEspecialidade"
    ).value = "";


    document.getElementById(
        "btnSalvarEspecialidade"
    ).textContent =
        "💾 Salvar Especialidade";


    listarEspecialidades();

}


async function editarEspecialidade(id) {

    const { data, error } = await supabase
        .from("especialidades")
        .select("*")
        .eq("id", id)
        .single();


    if (error) return;


    document.getElementById(
        "especialidadeEditId"
    ).value = data.id;

    document.getElementById(
        "nomeEspecialidade"
    ).value = data.nome;


    document.getElementById(
        "btnSalvarEspecialidade"
    ).textContent =
        "💾 Atualizar Especialidade";

}


async function excluirEspecialidade(id) {

    if (!confirm(
        "Deseja excluir esta especialidade?"
    )) {
        return;
    }


    const { error } = await supabase
        .from("especialidades")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;

    }


    listarEspecialidades();

}


// ==========================================
// CLÍNICAS
// ==========================================

async function listarClinicas() {

    const lista = document.getElementById(
        "listaClinicas"
    );

    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="6">
                Carregando clínicas...
            </td>
        </tr>
    `;


    const busca = document
        .getElementById("buscarClinica")
        ?.value
        .trim()
        .toLowerCase() || "";


    const status = document
        .getElementById("filtroStatusClinica")
        ?.value || "";


    let query = supabase
        .from("clinicas")
        .select(`
            *,
            bairros(
                nome,
                cidades(
                    nome,
                    estados(
                        nome,
                        regioes(nome)
                    )
                )
            ),
            clinica_especialidades(
                id,
                rede,
                especialidades(
                    nome
                )
            )
        `)
        .order("nome");


    if (status !== "") {

        query = query.eq(
            "ativo",
            status === "true"
        );

    }


    const { data, error } = await query;


    if (error) {

        console.error(error);

        lista.innerHTML = `
            <tr>
                <td colspan="6">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

        return;

    }


    let clinicas = data || [];


    if (busca) {

        clinicas = clinicas.filter(clinica =>
            clinica.nome
                .toLowerCase()
                .includes(busca)
        );

    }


    if (clinicas.length === 0) {

        lista.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhuma clínica encontrada.
                </td>
            </tr>
        `;

        return;

    }


    lista.innerHTML = clinicas.map(clinica => {

        const bairro =
            clinica.bairros?.nome || "";

        const cidade =
            clinica.bairros?.cidades?.nome || "";

        const estado =
            clinica.bairros?.cidades?.estados?.nome || "";


        const localizacao =
            `${bairro}${cidade ? " - " + cidade : ""}${estado ? " - " + estado : ""}`;


        const especialidades =
            clinica.clinica_especialidades?.map(item => `

                <span class="especialidade-tag">
                    🦷 ${item.especialidades?.nome || ""}
                    - ${item.rede}
                </span>

            `).join("") || "Nenhuma";


        return `

            <tr>

                <td>

                    <strong>
                        ${clinica.nome}
                    </strong>

                    <br>

                    <small>
                        ${clinica.endereco || ""}
                    </small>

                </td>


                <td>
                    ${localizacao || "-"}
                </td>


                <td>
                    ${clinica.telefone || "-"}
                </td>


                <td>
                    ${especialidades}
                </td>


                <td>

                    <span class="${
                        clinica.ativo
                            ? "status-ativa"
                            : "status-inativa"
                    }">

                        ${
                            clinica.ativo
                                ? "Ativa"
                                : "Inativa"
                        }

                    </span>

                </td>


                <td>

                    <div class="acoes">

                        <button
                            class="btn-editar"
                            onclick="editarClinica(${clinica.id})"
                        >
                            ✏️ Editar
                        </button>


                        <button
                            class="${
                                clinica.ativo
                                    ? "btn-desativar"
                                    : "btn-ativar"
                            }"

                            onclick="alterarStatusClinica(
                                ${clinica.id},
                                ${!clinica.ativo}
                            )"
                        >

                            ${
                                clinica.ativo
                                    ? "Desativar"
                                    : "Ativar"
                            }

                        </button>


                        <button
                            class="btn-excluir"
                            onclick="excluirClinica(${clinica.id})"
                        >
                            🗑 Excluir
                        </button>

                    </div>

                </td>

            </tr>

        `;

    }).join("");

}


// ==========================================
// ABRIR MODAL
// ==========================================

async function abrirModalClinica() {

    document
        .getElementById("modalClinica")
        .classList
        .remove("hidden");


    document
        .getElementById("tituloModalClinica")
        .textContent =
        "Nova Clínica";


    document
        .getElementById("formClinica")
        .reset();


    document
        .getElementById("clinicaId")
        .value = "";


    document
        .getElementById("areaStatusClinica")
        .classList
        .add("hidden");


    document
        .getElementById("containerEspecialidades")
        .innerHTML = "";


    await carregarRegioesClinica();

    await adicionarLinhaEspecialidade();

}


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModalClinica() {

    document
        .getElementById("modalClinica")
        .classList
        .add("hidden");

}


// ==========================================
// REGIÕES DA CLÍNICA
// ==========================================

async function carregarRegioesClinica() {

    const select =
        document.getElementById("clinicaRegiao");


    const { data } = await supabase
        .from("regioes")
        .select("*")
        .order("nome");


    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;


    data?.forEach(regiao => {

        select.innerHTML += `
            <option value="${regiao.id}">
                ${regiao.nome}
            </option>
        `;

    });

}


// ==========================================
// ESTADOS CLÍNICA
// ==========================================

async function carregarEstadosClinica() {

    const regiaoId =
        document.getElementById(
            "clinicaRegiao"
        ).value;


    const select =
        document.getElementById(
            "clinicaEstado"
        );


    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;


    if (!regiaoId) return;


    const { data } = await supabase
        .from("estados")
        .select("*")
        .eq("regiao_id", regiaoId)
        .order("nome");


    data?.forEach(estado => {

        select.innerHTML += `
            <option value="${estado.id}">
                ${estado.nome}
            </option>
        `;

    });

}


// ==========================================
// CIDADES CLÍNICA
// ==========================================

async function carregarCidadesClinica() {

    const estadoId =
        document.getElementById(
            "clinicaEstado"
        ).value;


    const select =
        document.getElementById(
            "clinicaCidade"
        );


    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;


    if (!estadoId) return;


    const { data } = await supabase
        .from("cidades")
        .select("*")
        .eq("estado_id", estadoId)
        .order("nome");


    data?.forEach(cidade => {

        select.innerHTML += `
            <option value="${cidade.id}">
                ${cidade.nome}
            </option>
        `;

    });

}


// ==========================================
// BAIRROS CLÍNICA
// ==========================================

async function carregarBairrosClinica() {

    const cidadeId =
        document.getElementById(
            "clinicaCidade"
        ).value;


    const select =
        document.getElementById(
            "clinicaBairro"
        );


    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;


    if (!cidadeId) return;


    const { data } = await supabase
        .from("bairros")
        .select("*")
        .eq("cidade_id", cidadeId)
        .order("nome");


    data?.forEach(bairro => {

        select.innerHTML += `
            <option value="${bairro.id}">
                ${bairro.nome}
            </option>
        `;

    });

}


// ==========================================
// ADICIONAR LINHA ESPECIALIDADE
// ==========================================

async function adicionarLinhaEspecialidade(
    especialidadeId = "",
    rede = ""
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    const { data } = await supabase
        .from("especialidades")
        .select("*")
        .order("nome");


    const opcoes =
        data?.map(especialidade => `

            <option
                value="${especialidade.id}"
                ${
                    String(especialidade.id) === String(especialidadeId)
                        ? "selected"
                        : ""
                }
            >
                ${especialidade.nome}
            </option>

        `).join("") || "";


    const linha = document.createElement("div");

    linha.className =
        "linha-especialidade";


    linha.innerHTML = `

        <select class="especialidade-select">

            <option value="">
                Selecione a especialidade
            </option>

            ${opcoes}

        </select>


        <select class="rede-select">

            <option value="">
                Selecione a rede
            </option>

            <option
                value="Rede Especialistas"
                ${
                    rede === "Rede Especialistas"
                        ? "selected"
                        : ""
                }
            >
                Rede Especialistas
            </option>

            <option
                value="Rede Sindilegis"
                ${
                    rede === "Rede Sindilegis"
                        ? "selected"
                        : ""
                }
            >
                Rede Sindilegis
            </option>

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
        >
            🗑 Remover
        </button>

    `;


    linha
        .querySelector(".btn-remover-especialidade")
        .addEventListener("click", () => {

            linha.remove();

        });


    container.appendChild(linha);

}


// ==========================================
// SALVAR CLÍNICA
// ==========================================

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document.getElementById("clinicaId").value;


    const nome =
        document.getElementById(
            "clinicaNome"
        ).value.trim();


    const endereco =
        document.getElementById(
            "clinicaEndereco"
        ).value.trim();


    const telefone =
        document.getElementById(
            "clinicaTelefone"
        ).value.trim();


    const bairro_id =
        document.getElementById(
            "clinicaBairro"
        ).value;


    if (!nome || !endereco) {

        alert(
            "Preencha nome e endereço."
        );

        return;

    }


    const dadosClinica = {

        nome,
        endereco,
        telefone: telefone || null,
        bairro_id: bairro_id || null

    };


    let clinicaId = id;


    if (id) {

        dadosClinica.ativo =
            document.getElementById(
                "clinicaAtivo"
            ).checked;


        const { error } = await supabase
            .from("clinicas")
            .update(dadosClinica)
            .eq("id", id);


        if (error) {

            alert(error.message);

            return;

        }

    } else {

        dadosClinica.ativo = true;


        const { data, error } = await supabase
            .from("clinicas")
            .insert([dadosClinica])
            .select()
            .single();


        if (error) {

            alert(error.message);

            return;

        }


        clinicaId = data.id;

    }


    // Remove especialidades antigas

    await supabase
        .from("clinica_especialidades")
        .delete()
        .eq("clinica_id", clinicaId);


    // Pega especialidades

    const linhas = document.querySelectorAll(
        ".linha-especialidade"
    );


    const especialidades = [];


    linhas.forEach(linha => {

        const especialidade_id =
            linha.querySelector(
                ".especialidade-select"
            ).value;


        const rede =
            linha.querySelector(
                ".rede-select"
            ).value;


        if (especialidade_id && rede) {

            especialidades.push({

                clinica_id: Number(clinicaId),

                especialidade_id:
                    Number(especialidade_id),

                rede,

                ativo: true

            });

        }

    });


    if (especialidades.length > 0) {

        const { error } = await supabase
            .from("clinica_especialidades")
            .insert(especialidades);


        if (error) {

            alert(
                "Clínica salva, mas ocorreu erro nas especialidades: " +
                error.message
            );

        }

    }


    fecharModalClinica();

    listarClinicas();

    carregarDashboard();

}


// ==========================================
// EDITAR CLÍNICA
// ==========================================

async function editarClinica(id) {

    const { data: clinica, error } = await supabase
        .from("clinicas")
        .select(`
            *,
            bairros(
                id,
                cidade_id,
                cidades(
                    id,
                    estado_id,
                    estados(
                        id,
                        regiao_id
                    )
                )
            ),
            clinica_especialidades(
                especialidade_id,
                rede
            )
        `)
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        alert("Erro ao carregar clínica.");

        return;

    }


    document
        .getElementById("modalClinica")
        .classList
        .remove("hidden");


    document
        .getElementById("tituloModalClinica")
        .textContent =
        "Editar Clínica";


    document.getElementById(
        "clinicaId"
    ).value = clinica.id;


    document.getElementById(
        "clinicaNome"
    ).value = clinica.nome;


    document.getElementById(
        "clinicaEndereco"
    ).value = clinica.endereco;


    document.getElementById(
        "clinicaTelefone"
    ).value = clinica.telefone || "";


    document
        .getElementById("areaStatusClinica")
        .classList
        .remove("hidden");


    document.getElementById(
        "clinicaAtivo"
    ).checked = clinica.ativo;


    await carregarRegioesClinica();


    const bairro =
        clinica.bairros;


    const cidade =
        bairro?.cidades;


    const estado =
        cidade?.estados;


    const regiaoId =
        estado?.regiao_id;


    if (regiaoId) {

        document.getElementById(
            "clinicaRegiao"
        ).value = regiaoId;


        await carregarEstadosClinica();

    }


    if (cidade?.estado_id) {

        document.getElementById(
            "clinicaEstado"
        ).value = cidade.estado_id;


        await carregarCidadesClinica();

    }


    if (bairro?.cidade_id) {

        document.getElementById(
            "clinicaCidade"
        ).value = bairro.cidade_id;


        await carregarBairrosClinica();

    }


    if (bairro?.id) {

        document.getElementById(
            "clinicaBairro"
        ).value = bairro.id;

    }


    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    container.innerHTML = "";


    if (
        clinica.clinica_especialidades &&
        clinica.clinica_especialidades.length > 0
    ) {

        for (
            const item of clinica.clinica_especialidades
        ) {

            await adicionarLinhaEspecialidade(
                item.especialidade_id,
                item.rede
            );

        }

    } else {

        await adicionarLinhaEspecialidade();

    }

}


// ==========================================
// ALTERAR STATUS
// ==========================================

async function alterarStatusClinica(
    id,
    novoStatus
) {

    const texto = novoStatus
        ? "ativar"
        : "desativar";


    if (
        !confirm(
            `Deseja ${texto} esta clínica?`
        )
    ) {
        return;
    }


    const { error } = await supabase
        .from("clinicas")
        .update({
            ativo: novoStatus
        })
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;

    }


    listarClinicas();

    carregarDashboard();

}


// ==========================================
// EXCLUIR CLÍNICA
// ==========================================

async function excluirClinica(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta clínica?"
        )
    ) {
        return;
    }


    const { error } = await supabase
        .from("clinicas")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;

    }


    listarClinicas();

    carregarDashboard();

}
