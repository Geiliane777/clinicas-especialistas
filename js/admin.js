// ======================================
// ADMIN.JS
// ======================================

console.log("admin.js carregado");


// ======================================
// TÍTULOS DAS PÁGINAS
// ======================================

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    iniciarMenu();

    iniciarEventos();

    carregarDashboard();

});


// ======================================
// EVENTOS
// ======================================

function iniciarEventos() {

    document
        .getElementById("btnSalvarEspecialidade")
        ?.addEventListener("click", salvarEspecialidade);


    document
        .getElementById("btnSalvarRegiao")
        ?.addEventListener("click", salvarRegiao);


    document
        .getElementById("btnSalvarEstado")
        ?.addEventListener("click", salvarEstado);


    document
        .getElementById("btnSalvarCidade")
        ?.addEventListener("click", salvarCidade);


    document
        .getElementById("btnSalvarBairro")
        ?.addEventListener("click", salvarBairro);


    document
        .getElementById("btnFecharModal")
        ?.addEventListener("click", fecharModalClinica);


    document
        .getElementById("btnCancelarModal")
        ?.addEventListener("click", fecharModalClinica);


    document
        .getElementById("formClinica")
        ?.addEventListener("submit", salvarClinica);


    document
        .getElementById("btnAdicionarEspecialidade")
        ?.addEventListener("click", adicionarLinhaEspecialidade);


    document
        .getElementById("buscarClinica")
        ?.addEventListener("input", listarClinicas);


    document
        .getElementById("filtroStatusClinica")
        ?.addEventListener("change", listarClinicas);


    document
        .getElementById("clinicaRegiao")
        ?.addEventListener("change", carregarEstadosClinica);


    document
        .getElementById("clinicaEstado")
        ?.addEventListener("change", carregarCidadesClinica);


    document
        .getElementById("clinicaCidade")
        ?.addEventListener("change", carregarBairrosClinica);

}


// ======================================
// MENU
// ======================================

function iniciarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");


    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            const pagina = botao.dataset.page;

            mostrarPagina(pagina);

        });

    });

}


// ======================================
// MOSTRAR PÁGINA
// ======================================

function mostrarPagina(pagina) {

    document
        .querySelectorAll(".page")
        .forEach(item => {

            item.classList.add("hidden");

        });


    document
        .getElementById(pagina)
        ?.classList.remove("hidden");


    document
        .querySelectorAll(".menu-btn")
        .forEach(item => {

            item.classList.remove("active");

        });


    document
        .querySelector(`[data-page="${pagina}"]`)
        ?.classList.add("active");


    const titulo =
        document.getElementById("tituloPagina");

    if (titulo) {
        titulo.textContent = TITULOS_PAGINA[pagina];
    }


    if (pagina === "dashboard") {
        carregarDashboard();
    }

    if (pagina === "clinicas") {
        listarClinicas();
    }

    if (pagina === "especialidades") {
        listarEspecialidades();
    }

    if (pagina === "regioes") {
        listarRegioes();
    }

    if (pagina === "estados") {
        carregarRegioesSelect();
        listarEstados();
    }

    if (pagina === "cidades") {
        carregarEstadosSelect();
        listarCidades();
    }

    if (pagina === "bairros") {
        carregarCidadesSelect();
        listarBairros();
    }

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        const [
            clinicas,
            clinicasAtivas,
            especialidades,
            regioes,
            estados,
            cidades,
            bairros
        ] = await Promise.all([

            supabaseClient
                .from("clinicas")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("clinicas")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("ativo", true),

            supabaseClient
                .from("especialidades")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("regioes")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("estados")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("cidades")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("bairros")
                .select("*", {
                    count: "exact",
                    head: true
                })

        ]);


        const atualizarNumero = (id, valor) => {

            const elemento =
                document.getElementById(id);

            if (elemento) {
                elemento.textContent = valor || 0;
            }

        };


        atualizarNumero(
            "totalClinicas",
            clinicas.count
        );

        atualizarNumero(
            "totalClinicasAtivas",
            clinicasAtivas.count
        );

        atualizarNumero(
            "totalEspecialidades",
            especialidades.count
        );

        atualizarNumero(
            "totalRegioes",
            regioes.count
        );

        atualizarNumero(
            "totalEstados",
            estados.count
        );

        atualizarNumero(
            "totalCidades",
            cidades.count
        );

        atualizarNumero(
            "totalBairros",
            bairros.count
        );

    } catch (error) {

        console.error(
            "Erro ao carregar dashboard:",
            error
        );

    }

}


// ======================================
// ESPECIALIDADES
// ======================================

async function listarEspecialidades() {

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {
        console.error(error);
        return;
    }


    const lista =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma especialidade cadastrada.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <strong>${item.nome}</strong>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEspecialidade(${item.id}, '${item.nome}')"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirEspecialidade(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarEspecialidade() {

    const input =
        document.getElementById(
            "nomeEspecialidade"
        );

    const editId =
        document.getElementById(
            "especialidadeEditId"
        );

    if (!input || !editId) return;


    const nome = input.value.trim();
    const id = editId.value;


    if (!nome) {

        alert("Digite o nome da especialidade.");

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("especialidades")
                .update({ nome })
                .eq("id", id);

    } else {

        resultado =
            await supabaseClient
                .from("especialidades")
                .insert({ nome });

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert("Erro ao salvar especialidade.");

        return;

    }


    input.value = "";
    editId.value = "";


    listarEspecialidades();
    carregarDashboard();

}


function editarEspecialidade(id, nome) {

    document.getElementById(
        "especialidadeEditId"
    ).value = id;

    document.getElementById(
        "nomeEspecialidade"
    ).value = nome;

}


async function excluirEspecialidade(id) {

    if (!confirm("Deseja excluir esta especialidade?")) {
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


    listarEspecialidades();
    carregarDashboard();

}


// ======================================
// REGIÕES
// ======================================

async function listarRegioes() {

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {
        console.error(error);
        return;
    }


    const lista =
        document.getElementById("listaRegioes");

    if (!lista) return;


    lista.innerHTML = "";


    if (!data.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma região cadastrada.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <strong>${item.nome}</strong>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarRegiao(${item.id}, '${item.nome}')"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirRegiao(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarRegiao() {

    const input =
        document.getElementById("nomeRegiao");

    const editId =
        document.getElementById("regiaoEditId");

    if (!input || !editId) return;


    const nome = input.value.trim();
    const id = editId.value;


    if (!nome) {

        alert("Digite o nome da região.");

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("regioes")
                .update({ nome })
                .eq("id", id);

    } else {

        resultado =
            await supabaseClient
                .from("regioes")
                .insert({ nome });

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert("Erro ao salvar região.");

        return;

    }


    input.value = "";
    editId.value = "";


    listarRegioes();
    carregarDashboard();

}


function editarRegiao(id, nome) {

    document.getElementById(
        "regiaoEditId"
    ).value = id;

    document.getElementById(
        "nomeRegiao"
    ).value = nome;

}


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

        console.error(error);

        alert("Erro ao excluir região.");

        return;

    }


    listarRegioes();
    carregarDashboard();

}


// ======================================
// SELECT REGIÕES
// ======================================

async function carregarRegioesSelect() {

    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    const select =
        document.getElementById("estadoRegiao");

    if (!select) return;


    select.innerHTML =
        `<option value="">Selecione uma região</option>`;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// ESTADOS
// ======================================

async function listarEstados() {

    const { data, error } =
        await supabaseClient
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


    const lista =
        document.getElementById("listaEstados");

    if (!lista) return;


    lista.innerHTML = "";


    if (!data.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhum estado cadastrado.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>${item.nome}</strong>

                    <div>
                        ${item.regioes?.nome || ""}
                    </div>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEstado(${item.id}, '${item.nome}', ${item.regiao_id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirEstado(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarEstado() {

    const nome =
        document.getElementById("nomeEstado").value.trim();

    const regiaoId =
        document.getElementById("estadoRegiao").value;

    const id =
        document.getElementById("estadoEditId").value;


    if (!nome || !regiaoId) {

        alert("Preencha todos os campos.");

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("estados")
                .update({
                    nome,
                    regiao_id: regiaoId
                })
                .eq("id", id);

    } else {

        resultado =
            await supabaseClient
                .from("estados")
                .insert({
                    nome,
                    regiao_id: regiaoId
                });

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert("Erro ao salvar estado.");

        return;

    }


    document.getElementById("nomeEstado").value = "";
    document.getElementById("estadoRegiao").value = "";
    document.getElementById("estadoEditId").value = "";


    listarEstados();
    carregarDashboard();

}


function editarEstado(id, nome, regiaoId) {

    document.getElementById(
        "estadoEditId"
    ).value = id;

    document.getElementById(
        "nomeEstado"
    ).value = nome;

    document.getElementById(
        "estadoRegiao"
    ).value = regiaoId;

}


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


    listarEstados();
    carregarDashboard();

}


// ======================================
// SELECT ESTADOS
// ======================================

async function carregarEstadosSelect() {

    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    const select =
        document.getElementById("cidadeEstado");

    if (!select) return;


    select.innerHTML =
        `<option value="">Selecione um estado</option>`;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// CIDADES
// ======================================

async function listarCidades() {

    const { data, error } =
        await supabaseClient
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


    const lista =
        document.getElementById("listaCidades");

    if (!lista) return;


    lista.innerHTML = "";


    if (!data.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma cidade cadastrada.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>${item.nome}</strong>

                    <div>
                        ${item.estados?.nome || ""}
                    </div>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarCidade(${item.id}, '${item.nome}', ${item.estado_id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirCidade(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarCidade() {

    const nome =
        document.getElementById("nomeCidade").value.trim();

    const estadoId =
        document.getElementById("cidadeEstado").value;

    const id =
        document.getElementById("cidadeEditId").value;


    if (!nome || !estadoId) {

        alert("Preencha todos os campos.");

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("cidades")
                .update({
                    nome,
                    estado_id: estadoId
                })
                .eq("id", id);

    } else {

        resultado =
            await supabaseClient
                .from("cidades")
                .insert({
                    nome,
                    estado_id: estadoId
                });

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert("Erro ao salvar cidade.");

        return;

    }


    document.getElementById("nomeCidade").value = "";
    document.getElementById("cidadeEstado").value = "";
    document.getElementById("cidadeEditId").value = "";


    listarCidades();
    carregarDashboard();

}


function editarCidade(id, nome, estadoId) {

    document.getElementById(
        "cidadeEditId"
    ).value = id;

    document.getElementById(
        "nomeCidade"
    ).value = nome;

    document.getElementById(
        "cidadeEstado"
    ).value = estadoId;

}


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


    listarCidades();
    carregarDashboard();

}


// ======================================
// SELECT CIDADES
// ======================================

async function carregarCidadesSelect() {

    const { data } =
        await supabaseClient
            .from("cidades")
            .select(`
                *,
                estados(nome)
            `)
            .order("nome");


    const select =
        document.getElementById("bairroCidade");

    if (!select) return;


    select.innerHTML =
        `<option value="">Selecione uma cidade</option>`;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome} - ${item.estados?.nome || ""}
            </option>
        `;

    });

}


// ======================================
// BAIRROS
// ======================================

async function listarBairros() {

    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select(`
                *,
                cidades(
                    nome,
                    estados(nome)
                )
            `)
            .order("nome");


    if (error) {
        console.error(error);
        return;
    }


    const lista =
        document.getElementById("listaBairros");

    if (!lista) return;


    lista.innerHTML = "";


    if (!data.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhum bairro cadastrado.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>${item.nome}</strong>

                    <div>
                        ${item.cidades?.nome || ""}
                        -
                        ${item.cidades?.estados?.nome || ""}
                    </div>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarBairro(${item.id}, '${item.nome}', ${item.cidade_id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirBairro(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarBairro() {

    const nome =
        document.getElementById("nomeBairro").value.trim();

    const cidadeId =
        document.getElementById("bairroCidade").value;

    const id =
        document.getElementById("bairroEditId").value;


    if (!nome || !cidadeId) {

        alert("Preencha todos os campos.");

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("bairros")
                .update({
                    nome,
                    cidade_id: cidadeId
                })
                .eq("id", id);

    } else {

        resultado =
            await supabaseClient
                .from("bairros")
                .insert({
                    nome,
                    cidade_id: cidadeId
                });

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert("Erro ao salvar bairro.");

        return;

    }


    document.getElementById("nomeBairro").value = "";
    document.getElementById("bairroCidade").value = "";
    document.getElementById("bairroEditId").value = "";


    listarBairros();
    carregarDashboard();

}


function editarBairro(id, nome, cidadeId) {

    document.getElementById(
        "bairroEditId"
    ).value = id;

    document.getElementById(
        "nomeBairro"
    ).value = nome;

    document.getElementById(
        "bairroCidade"
    ).value = cidadeId;

}


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


    listarBairros();
    carregarDashboard();

}


// ======================================
// CLÍNICAS
// ======================================

async function listarClinicas() {

    const busca =
        document
            .getElementById("buscarClinica")
            ?.value
            .trim();


    const status =
        document
            .getElementById("filtroStatusClinica")
            ?.value;


    let consulta =
        supabaseClient
            .from("clinicas")
            .select(`
                *,
                bairros(
                    nome,
                    cidades(
                        nome,
                        estados(nome)
                    )
                ),
                clinica_especialidades(
                    rede,
                    ativo,
                    especialidades(nome)
                )
            `)
            .order("nome");


    if (busca) {

        consulta =
            consulta.ilike(
                "nome",
                `%${busca}%`
            );

    }


    if (status !== "") {

        consulta =
            consulta.eq(
                "ativo",
                status === "true"
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaClinicas");

    if (!lista) return;


    lista.innerHTML = "";


    if (!data.length) {

        lista.innerHTML = `
            <tr>
                <td colspan="6" class="sem-dados">
                    Nenhuma clínica encontrada.
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(clinica => {

        const bairro =
            clinica.bairros?.nome || "-";

        const cidade =
            clinica.bairros?.cidades?.nome || "-";

        const estado =
            clinica.bairros?.cidades
                ?.estados?.nome || "-";


        const especialidades =
            clinica.clinica_especialidades
                ?.filter(item => item.ativo)
                .map(item => `
                    <span class="especialidade-tag">
                        ${item.especialidades?.nome || ""}
                        (${item.rede})
                    </span>
                `)
                .join("");


        lista.innerHTML += `

            <tr>

                <td>
                    <strong>${clinica.nome}</strong>
                </td>

                <td>
                    ${bairro}
                    <br>
                    ${cidade} - ${estado}
                </td>

                <td>
                    ${clinica.telefone || "-"}
                </td>

                <td>
                    ${especialidades || "-"}
                </td>

                <td>

                    ${
                        clinica.ativo
                            ? `<span class="status-ativa">Ativa</span>`
                            : `<span class="status-inativa">Inativa</span>`
                    }

                </td>

                <td>

                    <div class="acoes">

                        <button
                            class="btn-editar"
                            onclick="editarClinica(${clinica.id})"
                        >
                            Editar
                        </button>

                        <button
                            class="${
                                clinica.ativo
                                    ? "btn-desativar"
                                    : "btn-ativar"
                            }"
                            onclick="alterarStatusClinica(
                                ${clinica.id},
                                ${clinica.ativo}
                            )"
                        >
                            ${
                                clinica.ativo
                                    ? "Desativar"
                                    : "Ativar"
                            }
                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ======================================
// MODAL CLÍNICA
// ======================================

async function abrirModalClinica() {

    document
        .getElementById("formClinica")
        .reset();


    document.getElementById(
        "clinicaId"
    ).value = "";


    document.getElementById(
        "containerEspecialidades"
    ).innerHTML = "";


    document.getElementById(
        "tituloModalClinica"
    ).textContent = "Nova Clínica";


    document.getElementById(
        "areaStatusClinica"
    ).classList.add("hidden");


    document.getElementById(
        "modalClinica"
    ).classList.remove("hidden");


    await carregarRegioesClinica();

}


function fecharModalClinica() {

    document
        .getElementById("modalClinica")
        .classList.add("hidden");

}


// ======================================
// LOCALIZAÇÃO CLÍNICA
// ======================================

async function carregarRegioesClinica() {

    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    const select =
        document.getElementById("clinicaRegiao");


    select.innerHTML =
        `<option value="">Selecione</option>`;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


async function carregarEstadosClinica() {

    const regiaoId =
        document.getElementById("clinicaRegiao").value;

    const select =
        document.getElementById("clinicaEstado");


    select.innerHTML =
        `<option value="">Selecione</option>`;


    document.getElementById(
        "clinicaCidade"
    ).innerHTML =
        `<option value="">Selecione</option>`;


    document.getElementById(
        "clinicaBairro"
    ).innerHTML =
        `<option value="">Selecione</option>`;


    if (!regiaoId) return;


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("regiao_id", regiaoId)
            .order("nome");


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


async function carregarCidadesClinica() {

    const estadoId =
        document.getElementById("clinicaEstado").value;

    const select =
        document.getElementById("clinicaCidade");


    select.innerHTML =
        `<option value="">Selecione</option>`;


    document.getElementById(
        "clinicaBairro"
    ).innerHTML =
        `<option value="">Selecione</option>`;


    if (!estadoId) return;


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("estado_id", estadoId)
            .order("nome");


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


async function carregarBairrosClinica() {

    const cidadeId =
        document.getElementById("clinicaCidade").value;

    const select =
        document.getElementById("clinicaBairro");


    select.innerHTML =
        `<option value="">Selecione</option>`;


    if (!cidadeId) return;


    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("cidade_id", cidadeId)
            .order("nome");


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// ESPECIALIDADES DA CLÍNICA
// ======================================

async function adicionarLinhaEspecialidade(
    especialidadeSelecionada = "",
    redeSelecionada = ""
) {

    const { data } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    let options =
        `<option value="">Selecione</option>`;


    data?.forEach(item => {

        options += `
            <option
                value="${item.id}"
                ${
                    String(item.id) ===
                    String(especialidadeSelecionada)
                        ? "selected"
                        : ""
                }
            >
                ${item.nome}
            </option>
        `;

    });


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    linha.innerHTML = `

        <select class="select-especialidade">

            ${options}

        </select>


        <select class="select-rede">

            <option
                value="especialistas"
                ${
                    redeSelecionada === "especialistas"
                        ? "selected"
                        : ""
                }
            >
                Rede Especialistas
            </option>


            <option
                value="sindilegis"
                ${
                    redeSelecionada === "sindilegis"
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
            Remover
        </button>

    `;


    linha
        .querySelector(".btn-remover-especialidade")
        .addEventListener(
            "click",
            () => linha.remove()
        );


    document
        .getElementById("containerEspecialidades")
        .appendChild(linha);

}


// ======================================
// SALVAR CLÍNICA
// ======================================

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

    const bairroId =
        document.getElementById("clinicaBairro").value;


    if (!nome || !endereco || !bairroId) {

        alert("Preencha os campos obrigatórios.");

        return;

    }


    const dadosClinica = {

        nome,
        endereco,
        telefone,
        bairro_id: bairroId

    };


    let clinicaId;


    if (id) {

        dadosClinica.ativo =
            document.getElementById(
                "clinicaAtivo"
            ).checked;


        const { error } =
            await supabaseClient
                .from("clinicas")
                .update(dadosClinica)
                .eq("id", id);


        if (error) {

            console.error(error);

            alert("Erro ao atualizar clínica.");

            return;

        }


        clinicaId = id;

    } else {

        const { data, error } =
            await supabaseClient
                .from("clinicas")
                .insert(dadosClinica)
                .select()
                .single();


        if (error) {

            console.error(error);

            alert("Erro ao cadastrar clínica.");

            return;

        }


        clinicaId = data.id;

    }


    await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq("clinica_id", clinicaId);


    const linhas =
        document.querySelectorAll(
            ".linha-especialidade"
        );


    const especialidades = [];


    linhas.forEach(linha => {

        const especialidadeId =
            linha
                .querySelector(".select-especialidade")
                .value;

        const rede =
            linha
                .querySelector(".select-rede")
                .value;


        if (especialidadeId) {

            especialidades.push({

                clinica_id: clinicaId,

                especialidade_id:
                    especialidadeId,

                rede,

                ativo: true

            });

        }

    });


    if (especialidades.length) {

        const { error } =
            await supabaseClient
                .from("clinica_especialidades")
                .insert(especialidades);


        if (error) {

            console.error(error);

            alert("Erro ao salvar especialidades.");

            return;

        }

    }


    alert("Clínica salva com sucesso!");


    fecharModalClinica();

    listarClinicas();

    carregarDashboard();

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id) {

    const { data, error } =
        await supabaseClient
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

        return;

    }


    await abrirModalClinica();


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Editar Clínica";


    document.getElementById(
        "clinicaId"
    ).value = data.id;


    document.getElementById(
        "clinicaNome"
    ).value = data.nome;


    document.getElementById(
        "clinicaEndereco"
    ).value = data.endereco;


    document.getElementById(
        "clinicaTelefone"
    ).value = data.telefone || "";


    document.getElementById(
        "areaStatusClinica"
    ).classList.remove("hidden");


    document.getElementById(
        "clinicaAtivo"
    ).checked = data.ativo;


    const bairro = data.bairros;
    const cidade = bairro?.cidades;
    const estado = cidade?.estados;


    if (estado?.regiao_id) {

        document.getElementById(
            "clinicaRegiao"
        ).value = estado.regiao_id;


        await carregarEstadosClinica();


        document.getElementById(
            "clinicaEstado"
        ).value = cidade.estado_id;


        await carregarCidadesClinica();


        document.getElementById(
            "clinicaCidade"
        ).value = bairro.cidade_id;


        await carregarBairrosClinica();


        document.getElementById(
            "clinicaBairro"
        ).value = bairro.id;

    }


    document.getElementById(
        "containerEspecialidades"
    ).innerHTML = "";


    for (
        const item of
        data.clinica_especialidades
    ) {

        await adicionarLinhaEspecialidade(
            item.especialidade_id,
            item.rede
        );

    }

}


// ======================================
// ALTERAR STATUS
// ======================================

async function alterarStatusClinica(
    id,
    statusAtual
) {

    const novoStatus = !statusAtual;


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update({
                ativo: novoStatus
            })
            .eq("id", id);


    if (error) {

        console.error(error);

        alert("Erro ao alterar status.");

        return;

    }


    listarClinicas();

    carregarDashboard();

}


// ======================================
// LOGOUT
// ======================================

function logout() {

    localStorage.removeItem("adminLogado");

    location.reload();

}
