/* =====================================
   ADMIN.JS
===================================== */

console.log("admin.js carregado");


/* =====================================
   CONFIGURAÇÃO
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAdmin
);


async function iniciarAdmin() {

    console.log(
        "Iniciando painel administrativo..."
    );


    await carregarDashboard();

    await listarEspecialidades();

    await listarRegioes();

    await listarEstados();

    await listarCidades();

    await listarBairros();


    await popularRegioes();

    await popularEstados();

    await popularCidades();


    console.log(
        "Painel carregado!"
    );

}


/* =====================================
   NAVEGAÇÃO
===================================== */

const TITULOS_PAGINA = {

    dashboard: "Dashboard",

    clinicas: "Clínicas",

    especialidades: "Especialidades",

    regioes: "Regiões",

    estados: "Estados",

    cidades: "Cidades",

    bairros: "Bairros"

};


async function mostrarPagina(nomePagina) {


    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("ativa");

        });


    const pagina = document.getElementById(
        `pagina-${nomePagina}`
    );


    if (pagina) {

        pagina.classList.add("ativa");

    }


    document
        .querySelectorAll(".menu-item")
        .forEach(botao => {

            botao.classList.remove("ativo");

        });


    const botaoAtivo =
        document.querySelector(
            `[data-pagina="${nomePagina}"]`
        );


    if (botaoAtivo) {

        botaoAtivo.classList.add("ativo");

    }


    const titulo =
        document.getElementById(
            "tituloPaginaTopo"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina]
            || "Painel";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    /* CARREGADORES */

    if (nomePagina === "dashboard") {

        await carregarDashboard();

    }


    if (nomePagina === "clinicas") {

        await listarClinicas();

    }


    if (nomePagina === "especialidades") {

        await listarEspecialidades();

    }


    if (nomePagina === "regioes") {

        await listarRegioes();

    }


    if (nomePagina === "estados") {

        await listarEstados();

        await popularRegioes();

    }


    if (nomePagina === "cidades") {

        await listarCidades();

        await popularEstados();

    }


    if (nomePagina === "bairros") {

        await listarBairros();

        await popularCidades();

    }

}


/* =====================================
   VOLTAR PARA SITE
===================================== */

function voltarParaInicio() {

    window.location.href = "/index.html";

}


/* =====================================
   SAIR
===================================== */

function sair() {

    const confirmar = confirm(
        "Deseja realmente sair do painel?"
    );


    if (!confirmar) {

        return;

    }


    window.location.href = "/login.html";

}


/* =====================================
   DASHBOARD
===================================== */

async function carregarDashboard() {

    try {


        const clinicas =
            await supabaseClient
                .from("clinicas")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const clinicasAtivas =
            await supabaseClient
                .from("clinicas")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("ativo", true);


        const especialidades =
            await supabaseClient
                .from("especialidades")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const regioes =
            await supabaseClient
                .from("regioes")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const estados =
            await supabaseClient
                .from("estados")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const cidades =
            await supabaseClient
                .from("cidades")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const bairros =
            await supabaseClient
                .from("bairros")
                .select("*", {
                    count: "exact",
                    head: true
                });


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


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


function atualizarNumero(id, valor) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            valor || 0;

    }

}


/* =====================================
   REGIÕES
===================================== */

async function listarRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );


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


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma região cadastrada.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(regiao => `

        <div class="item-gerenciamento">

            <strong>
                ${regiao.nome}
            </strong>


            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarRegiao('${regiao.id}')"
                >
                    Editar
                </button>


                <button
                    class="btn-excluir"
                    onclick="excluirRegiao('${regiao.id}')"
                >
                    Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function salvarRegiao() {

    const input =
        document.getElementById(
            "nomeRegiao"
        );


    const editId =
        document.getElementById(
            "regiaoEditId"
        );


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da região."
        );

        return;

    }


    let erro;


    if (editId.value) {

        const resultado =
            await supabaseClient
                .from("regioes")
                .update({ nome })
                .eq("id", editId.value);


        erro = resultado.error;

    } else {

        const resultado =
            await supabaseClient
                .from("regioes")
                .insert({ nome });


        erro = resultado.error;

    }


    if (erro) {

        alert(
            "Erro ao salvar região."
        );

        console.error(erro);

        return;

    }


    input.value = "";

    editId.value = "";


    await listarRegioes();

    await popularRegioes();

    await carregarDashboard();

}


async function editarRegiao(id) {

    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .eq("id", id)
            .single();


    document.getElementById(
        "nomeRegiao"
    ).value = data.nome;


    document.getElementById(
        "regiaoEditId"
    ).value = data.id;

}


async function excluirRegiao(id) {

    if (!confirm(
        "Deseja excluir esta região?"
    )) return;


    const { error } =
        await supabaseClient
            .from("regioes")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Não foi possível excluir."
        );

        return;

    }


    await listarRegioes();

    await popularRegioes();

    await carregarDashboard();

}


/* =====================================
   ESPECIALIDADES
===================================== */

async function listarEspecialidades() {

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


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma especialidade cadastrada.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(item => `

        <div class="item-gerenciamento">

            <strong>
                ${item.nome}
            </strong>


            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarEspecialidade('${item.id}')"
                >
                    Editar
                </button>


                <button
                    class="btn-excluir"
                    onclick="excluirEspecialidade('${item.id}')"
                >
                    Excluir
                </button>

            </div>

        </div>

    `).join("");

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


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

        return;

    }


    let error;


    if (editId.value) {

        const resultado =
            await supabaseClient
                .from("especialidades")
                .update({ nome })
                .eq("id", editId.value);


        error = resultado.error;

    } else {

        const resultado =
            await supabaseClient
                .from("especialidades")
                .insert({ nome });


        error = resultado.error;

    }


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar especialidade."
        );

        return;

    }


    input.value = "";

    editId.value = "";


    await listarEspecialidades();

    await carregarDashboard();

}


async function editarEspecialidade(id) {

    const { data } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .eq("id", id)
            .single();


    document.getElementById(
        "nomeEspecialidade"
    ).value = data.nome;


    document.getElementById(
        "especialidadeEditId"
    ).value = data.id;

}


async function excluirEspecialidade(id) {

    if (!confirm(
        "Deseja excluir esta especialidade?"
    )) return;


    const { error } =
        await supabaseClient
            .from("especialidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir especialidade."
        );

        return;

    }


    await listarEspecialidades();

    await carregarDashboard();

}


/* =====================================
   ESTADOS
===================================== */

async function listarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


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


    lista.innerHTML = "";


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhum estado cadastrado.
            </div>
        `;

        return;

    }


    data.forEach(estado => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${estado.nome}
                    </strong>

                    <div class="item-subtitulo">

                        ${estado.regioes?.nome || "Sem região"}

                    </div>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEstado('${estado.id}')"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirEstado('${estado.id}')"
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
        document
            .getElementById("nomeEstado")
            .value
            .trim();


    const regiaoId =
        document.getElementById(
            "estadoRegiao"
        ).value;


    const editId =
        document.getElementById(
            "estadoEditId"
        ).value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    let resultado;


    if (editId) {

        resultado =
            await supabaseClient
                .from("estados")
                .update({
                    nome,
                    regiao_id: regiaoId
                })
                .eq("id", editId);

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


    document.getElementById(
        "nomeEstado"
    ).value = "";


    document.getElementById(
        "estadoRegiao"
    ).value = "";


    document.getElementById(
        "estadoEditId"
    ).value = "";


    await listarEstados();

    await popularEstados();

    await carregarDashboard();

}


/* =====================================
   POPULAR SELECT REGIÕES
===================================== */

async function popularRegioes() {

    const selects = [

        document.getElementById("estadoRegiao"),

        document.getElementById("clinicaRegiao")

    ];


    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    selects.forEach(select => {

        if (!select) return;


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

    });

}


/* =====================================
   CIDADES
===================================== */

async function listarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


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


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma cidade cadastrada.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(cidade => `

        <div class="item-gerenciamento">

            <div>

                <strong>
                    ${cidade.nome}
                </strong>

                <div class="item-subtitulo">

                    ${cidade.estados?.nome || ""}

                </div>

            </div>


            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarCidade('${cidade.id}')"
                >
                    Editar
                </button>


                <button
                    class="btn-excluir"
                    onclick="excluirCidade('${cidade.id}')"
                >
                    Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function popularEstados() {

    const selects = [

        document.getElementById("cidadeEstado"),

        document.getElementById("clinicaEstado")

    ];


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    selects.forEach(select => {

        if (!select) return;


        if (select.id === "clinicaEstado") {

            return;

        }


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

    });

}


async function salvarCidade() {

    const nome =
        document
            .getElementById("nomeCidade")
            .value
            .trim();


    const estadoId =
        document.getElementById(
            "cidadeEstado"
        ).value;


    const editId =
        document.getElementById(
            "cidadeEditId"
        ).value;


    if (!nome || !estadoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    let resultado;


    if (editId) {

        resultado =
            await supabaseClient
                .from("cidades")
                .update({
                    nome,
                    estado_id: estadoId
                })
                .eq("id", editId);

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


    document.getElementById(
        "nomeCidade"
    ).value = "";


    document.getElementById(
        "cidadeEstado"
    ).value = "";


    document.getElementById(
        "cidadeEditId"
    ).value = "";


    await listarCidades();

    await popularCidades();

    await carregarDashboard();

}


/* =====================================
   BAIRROS
===================================== */

async function listarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select(`
                *,
                cidades(nome)
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhum bairro cadastrado.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(bairro => `

        <div class="item-gerenciamento">

            <div>

                <strong>
                    ${bairro.nome}
                </strong>

                <div class="item-subtitulo">

                    ${bairro.cidades?.nome || ""}

                </div>

            </div>


            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarBairro('${bairro.id}')"
                >
                    Editar
                </button>


                <button
                    class="btn-excluir"
                    onclick="excluirBairro('${bairro.id}')"
                >
                    Excluir
                </button>

            </div>

        </div>

    `).join("");

}


async function popularCidades() {

    const selects = [

        document.getElementById("bairroCidade"),

        document.getElementById("clinicaCidade")

    ];


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    selects.forEach(select => {

        if (!select) return;


        if (select.id === "clinicaCidade") {

            return;

        }


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

    });

}


async function salvarBairro() {

    const nome =
        document
            .getElementById("nomeBairro")
            .value
            .trim();


    const cidadeId =
        document.getElementById(
            "bairroCidade"
        ).value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("bairros")
            .insert({

                nome,

                cidade_id: cidadeId

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar bairro."
        );

        return;

    }


    document.getElementById(
        "nomeBairro"
    ).value = "";


    await listarBairros();

    await carregarDashboard();

}


/* =====================================
   CLÍNICAS
===================================== */

async function listarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    const busca =
        document
            .getElementById("buscarClinica")
            ?.value
            .trim();


    const status =
        document.getElementById(
            "filtroStatusClinica"
        )?.value;


    let query =
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
                )
            `)
            .order("nome");


    if (busca) {

        query =
            query.ilike(
                "nome",
                `%${busca}%`
            );

    }


    if (status !== "") {

        query =
            query.eq(
                "ativo",
                status === "true"
            );

    }


    const { data, error } =
        await query;


    if (error) {

        console.error(error);

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="sem-dados"
                >
                    Nenhuma clínica encontrada.
                </td>

            </tr>

        `;

        return;

    }


    lista.innerHTML =
        data.map(clinica => `

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

                ${clinica.bairros?.nome || "-"}

                <br>

                <small>

                    ${clinica.bairros?.cidades?.nome || ""}

                </small>

            </td>


            <td>

                ${clinica.telefone || "-"}

            </td>


            <td>

                -
                
            </td>


            <td>

                <span
                    class="${
                        clinica.ativo
                            ? "status-ativa"
                            : "status-inativa"
                    }"
                >

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
                        onclick="editarClinica('${clinica.id}')"
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
                            '${clinica.id}',
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

    `).join("");

}


/* =====================================
   MODAL CLÍNICA
===================================== */

async function abrirModalClinica() {

    document.getElementById(
        "modalClinica"
    ).classList.remove("hidden");


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Nova Clínica";


    document.getElementById(
        "formClinica"
    ).reset();


    document.getElementById(
        "clinicaId"
    ).value = "";


    document.getElementById(
        "containerEspecialidades"
    ).innerHTML = "";


    document.getElementById(
        "areaStatusClinica"
    ).classList.add("hidden");


    await popularRegioes();

}


function fecharModalClinica() {

    document.getElementById(
        "modalClinica"
    ).classList.add("hidden");

}


/* =====================================
   CASCATA CLÍNICA
===================================== */

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
            Selecione um estado
        </option>
    `;


    if (!regiaoId) return;


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiaoId
            )
            .order("nome");


    data?.forEach(estado => {

        select.innerHTML += `

            <option value="${estado.id}">
                ${estado.nome}
            </option>

        `;

    });

}


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
            Selecione uma cidade
        </option>
    `;


    if (!estadoId) return;


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estadoId
            )
            .order("nome");


    data?.forEach(cidade => {

        select.innerHTML += `

            <option value="${cidade.id}">
                ${cidade.nome}
            </option>

        `;

    });

}


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
            Selecione um bairro
        </option>
    `;


    if (!cidadeId) return;


    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidadeId
            )
            .order("nome");


    data?.forEach(bairro => {

        select.innerHTML += `

            <option value="${bairro.id}">
                ${bairro.nome}
            </option>

        `;

    });

}


/* =====================================
   LINHA ESPECIALIDADE
===================================== */

async function adicionarLinhaEspecialidade() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    const { data } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    linha.innerHTML = `

        <select
            class="select-especialidade"
        >

            <option value="">
                Selecione uma especialidade
            </option>

            ${
                data?.map(item => `

                    <option value="${item.id}">
                        ${item.nome}
                    </option>

                `).join("")
            }

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
            onclick="this.parentElement.remove()"
        >
            ×
        </button>

    `;


    container.appendChild(linha);

}


/* =====================================
   SALVAR CLÍNICA
===================================== */

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "clinicaId"
        ).value;


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


    const bairroId =
        document.getElementById(
            "clinicaBairro"
        ).value;


    if (!nome || !endereco || !bairroId) {

        alert(
            "Preencha os campos obrigatórios."
        );

        return;

    }


    const dados = {

        nome,

        endereco,

        telefone,

        bairro_id: bairroId

    };


    if (id) {

        dados.ativo =
            document.getElementById(
                "clinicaAtivo"
            ).checked;


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

    } else {

        dados.ativo = true;


        const { data, error } =
            await supabaseClient
                .from("clinicas")
                .insert(dados)
                .select()
                .single();


        if (error) {

            console.error(error);

            alert(
                "Erro ao salvar clínica."
            );

            return;

        }


        await salvarEspecialidadesClinica(
            data.id
        );

    }


    fecharModalClinica();

    await listarClinicas();

    await carregarDashboard();


    alert(
        "Clínica salva com sucesso!"
    );

}


/* =====================================
   SALVAR ESPECIALIDADES CLÍNICA
===================================== */

async function salvarEspecialidadesClinica(
    clinicaId
) {

    const selects =
        document.querySelectorAll(
            ".select-especialidade"
        );


    const especialidades =
        Array.from(selects)
            .map(select => select.value)
            .filter(valor => valor);


    if (especialidades.length === 0) {

        return;

    }


    const dados =
        especialidades.map(especialidadeId => ({

            clinica_id: clinicaId,

            especialidade_id: especialidadeId

        }));


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert(dados);


    if (error) {

        console.error(
            "Erro especialidades:",
            error
        );

    }

}


/* =====================================
   ALTERAR STATUS
===================================== */

async function alterarStatusClinica(
    id,
    statusAtual
) {

    const novoStatus =
        !statusAtual;


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update({

                ativo:
                    novoStatus

            })
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao alterar status."
        );

        return;

    }


    await listarClinicas();

    await carregarDashboard();

}


/* =====================================
   EDITAR CLÍNICA
===================================== */

async function editarClinica(id) {

    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;

    }


    document.getElementById(
        "modalClinica"
    ).classList.remove("hidden");


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Editar Clínica";


    document.getElementById(
        "clinicaId"
    ).value = data.id;


    document.getElementById(
        "clinicaNome"
    ).value = data.nome || "";


    document.getElementById(
        "clinicaEndereco"
    ).value = data.endereco || "";


    document.getElementById(
        "clinicaTelefone"
    ).value = data.telefone || "";


    document.getElementById(
        "clinicaAtivo"
    ).checked = data.ativo;


    document.getElementById(
        "areaStatusClinica"
    ).classList.remove("hidden");


    await popularRegioes();

}


/* =====================================
   EDITAR CIDADE
===================================== */

async function editarCidade(id) {

    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("id", id)
            .single();


    document.getElementById(
        "nomeCidade"
    ).value = data.nome;


    document.getElementById(
        "cidadeEstado"
    ).value = data.estado_id;


    document.getElementById(
        "cidadeEditId"
    ).value = data.id;

}


/* =====================================
   EDITAR BAIRRO
===================================== */

async function editarBairro(id) {

    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("id", id)
            .single();


    document.getElementById(
        "nomeBairro"
    ).value = data.nome;


    document.getElementById(
        "bairroCidade"
    ).value = data.cidade_id;


    document.getElementById(
        "bairroEditId"
    ).value = data.id;

}


/* =====================================
   EDITAR ESTADO
===================================== */

async function editarEstado(id) {

    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("id", id)
            .single();


    document.getElementById(
        "nomeEstado"
    ).value = data.nome;


    document.getElementById(
        "estadoRegiao"
    ).value = data.regiao_id;


    document.getElementById(
        "estadoEditId"
    ).value = data.id;

}


/* =====================================
   EXCLUIR ESTADO
===================================== */

async function excluirEstado(id) {

    if (!confirm(
        "Deseja excluir este estado?"
    )) return;


    await supabaseClient
        .from("estados")
        .delete()
        .eq("id", id);


    await listarEstados();

    await carregarDashboard();

}


/* =====================================
   EXCLUIR CIDADE
===================================== */

async function excluirCidade(id) {

    if (!confirm(
        "Deseja excluir esta cidade?"
    )) return;


    await supabaseClient
        .from("cidades")
        .delete()
        .eq("id", id);


    await listarCidades();

    await carregarDashboard();

}


/* =====================================
   EXCLUIR BAIRRO
===================================== */

async function excluirBairro(id) {

    if (!confirm(
        "Deseja excluir este bairro?"
    )) return;


    await supabaseClient
        .from("bairros")
        .delete()
        .eq("id", id);


    await listarBairros();

    await carregarDashboard();

}
