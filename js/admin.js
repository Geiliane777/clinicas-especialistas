/* =========================================
   ADMIN.JS
   PAINEL ADMINISTRATIVO
========================================= */

console.log("admin.js carregado");


/* =========================================
   ELEMENTOS
========================================= */

const $ = (id) => document.getElementById(id);


/* =========================================
   NAVEGAÇÃO ENTRE PÁGINAS
========================================= */

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


const CARREGADORES_PAGINA = {
    dashboard: carregarDashboard,
    clinicas: listarClinicas,
    especialidades: listarEspecialidades,
    regioes: listarRegioes,
    estados: listarEstados,
    cidades: listarCidades,
    bairros: listarBairros
};


function mostrarPagina(nomePagina) {

    console.log("Abrindo página:", nomePagina);


    /* REMOVE TODAS AS PÁGINAS */

    document.querySelectorAll(".pagina").forEach((pagina) => {

        pagina.classList.remove("ativa");

    });


    /* REMOVE BOTÃO ATIVO */

    document.querySelectorAll(".menu button[data-pagina]")
        .forEach((botao) => {

            botao.classList.remove("ativo");

        });


    /* MOSTRA PÁGINA */

    const pagina = $(`pagina-${nomePagina}`);

    if (pagina) {

        pagina.classList.add("ativa");

    }


    /* ATIVA BOTÃO */

    const botao = document.querySelector(
        `.menu button[data-pagina="${nomePagina}"]`
    );

    if (botao) {

        botao.classList.add("ativo");

    }


    /* CARREGA DADOS */

    if (CARREGADORES_PAGINA[nomePagina]) {

        CARREGADORES_PAGINA[nomePagina]();

    }


    /* FECHA MENU MOBILE */

    const menu = $(".menu");

    if (menu) {

        menu.classList.remove("aberto");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   MENU MOBILE
========================================= */

function toggleMenu() {

    const menu = $(".menu");

    if (menu) {

        menu.classList.toggle("aberto");

    }

}


/* =========================================
   LOGOUT
========================================= */

function sair() {

    const confirmar = confirm(
        "Deseja realmente sair do painel administrativo?"
    );


    if (!confirmar) return;


    console.log("Usuário saiu do painel");


    window.location.href = "/index.html";

}


/* =========================================
   DASHBOARD
========================================= */

async function carregarDashboard() {

    try {

        console.log("Carregando dashboard...");


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


        if ($("totalClinicas")) {

            $("totalClinicas").textContent =
                clinicas.count || 0;

        }


        if ($("totalEspecialidades")) {

            $("totalEspecialidades").textContent =
                especialidades.count || 0;

        }


        if ($("totalRegioes")) {

            $("totalRegioes").textContent =
                regioes.count || 0;

        }


        if ($("totalEstados")) {

            $("totalEstados").textContent =
                estados.count || 0;

        }


        if ($("totalCidades")) {

            $("totalCidades").textContent =
                cidades.count || 0;

        }


        if ($("totalBairros")) {

            $("totalBairros").textContent =
                bairros.count || 0;

        }


        /* CLÍNICAS ATIVAS */

        const { count: clinicasAtivas } =
            await supabaseClient
                .from("clinicas")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("ativo", true);


        if ($("totalClinicasAtivas")) {

            $("totalClinicasAtivas").textContent =
                clinicasAtivas || 0;

        }


        /* RESUMOS */

        if ($("resumoClinicas")) {

            $("resumoClinicas").textContent =
                clinicas.count || 0;

        }


        if ($("resumoEspecialidades")) {

            $("resumoEspecialidades").textContent =
                especialidades.count || 0;

        }


        if ($("resumoLocalidades")) {

            const totalLocalidades =
                (regioes.count || 0) +
                (estados.count || 0) +
                (cidades.count || 0) +
                (bairros.count || 0);


            $("resumoLocalidades").textContent =
                totalLocalidades;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


/* =========================================
   REGIÕES
========================================= */

async function listarRegioes() {

    const lista = $("listaRegioes");

    if (!lista) return;


    lista.innerHTML = `
        <div class="sem-dados">
            Carregando regiões...
        </div>
    `;


    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        lista.innerHTML = `
            <div class="sem-dados">
                Erro ao carregar regiões.
            </div>
        `;

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


    lista.innerHTML = data.map((regiao) => `

        <div class="item-gerenciamento">

            <div>

                <strong>
                    ${escapeHTML(regiao.nome)}
                </strong>

            </div>


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


/* SALVAR REGIÃO */

async function salvarRegiao() {

    const input = $("nomeRegiao");

    const editId = $("regiaoEditId");


    const nome = input.value.trim();


    if (!nome) {

        alert("Digite o nome da região.");

        return;

    }


    let resultado;


    if (editId.value) {

        resultado =
            await supabaseClient
                .from("regioes")
                .update({ nome })
                .eq("id", editId.value);

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

    popularRegioes();

    carregarDashboard();

}


/* EDITAR REGIÃO */

async function editarRegiao(id) {

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;

    }


    $("nomeRegiao").value =
        data.nome;

    $("regiaoEditId").value =
        data.id;


    $("nomeRegiao").focus();

}


/* EXCLUIR REGIÃO */

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

        console.error(error);

        alert(
            "Não foi possível excluir esta região."
        );

        return;

    }


    listarRegioes();

    popularRegioes();

    carregarDashboard();

}


/* =========================================
   ESTADOS
========================================= */

async function listarEstados() {

    const lista = $("listaEstados");

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


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhum estado cadastrado.
            </div>
        `;

        return;

    }


    lista.innerHTML = data.map((estado) => `

        <div class="item-gerenciamento">

            <div>

                <strong>
                    ${escapeHTML(estado.nome)}
                </strong>


                <div class="item-subtitulo">

                    Região:
                    ${estado.regioes?.nome || "-"}

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

    `).join("");

}


/* SALVAR ESTADO */

async function salvarEstado() {

    const nome =
        $("nomeEstado").value.trim();

    const regiaoId =
        $("estadoRegiao").value;

    const editId =
        $("estadoEditId").value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha o nome e selecione uma região."
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


    $("nomeEstado").value = "";

    $("estadoRegiao").value = "";

    $("estadoEditId").value = "";


    listarEstados();

    popularEstados();

    carregarDashboard();

}


/* EDITAR ESTADO */

async function editarEstado(id) {

    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;

    }


    $("nomeEstado").value =
        data.nome;

    $("estadoRegiao").value =
        data.regiao_id;

    $("estadoEditId").value =
        data.id;


    $("nomeEstado").focus();

}


/* EXCLUIR ESTADO */

async function excluirEstado(id) {

    if (!confirm(
        "Deseja excluir este estado?"
    )) return;


    const { error } =
        await supabaseClient
            .from("estados")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir este estado."
        );

        return;

    }


    listarEstados();

    popularEstados();

    carregarDashboard();

}


/* =========================================
   CIDADES
========================================= */

async function listarCidades() {

    const lista = $("listaCidades");

    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select(`
                *,
                estados(
                    nome,
                    regioes(nome)
                )
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


    lista.innerHTML = data.map((cidade) => `

        <div class="item-gerenciamento">

            <div>

                <strong>
                    ${escapeHTML(cidade.nome)}
                </strong>


                <div class="item-subtitulo">

                    ${cidade.estados?.nome || "-"}

                    •

                    ${cidade.estados?.regioes?.nome || "-"}

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


/* SALVAR CIDADE */

async function salvarCidade() {

    const nome =
        $("nomeCidade").value.trim();

    const estadoId =
        $("cidadeEstado").value;

    const editId =
        $("cidadeEditId").value;


    if (!nome || !estadoId) {

        alert(
            "Preencha o nome e selecione um estado."
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


    $("nomeCidade").value = "";

    $("cidadeEstado").value = "";

    $("cidadeEditId").value = "";


    listarCidades();

    popularCidades();

    carregarDashboard();

}


/* EDITAR CIDADE */

async function editarCidade(id) {

    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;

    }


    $("nomeCidade").value =
        data.nome;

    $("cidadeEstado").value =
        data.estado_id;

    $("cidadeEditId").value =
        data.id;


    $("nomeCidade").focus();

}


/* EXCLUIR CIDADE */

async function excluirCidade(id) {

    if (!confirm(
        "Deseja excluir esta cidade?"
    )) return;


    const { error } =
        await supabaseClient
            .from("cidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir esta cidade."
        );

        return;

    }


    listarCidades();

    popularCidades();

    carregarDashboard();

}


/* =========================================
   BAIRROS
========================================= */

async function listarBairros() {

    const lista = $("listaBairros");

    if (!lista) return;


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


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhum bairro cadastrado.
            </div>
        `;

        return;

    }


    lista.innerHTML = data.map((bairro) => `

        <div class="item-gerenciamento">

            <div>

                <strong>
                    ${escapeHTML(bairro.nome)}
                </strong>


                <div class="item-subtitulo">

                    ${bairro.cidades?.nome || "-"}

                    •

                    ${bairro.cidades?.estados?.nome || "-"}

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


/* SALVAR BAIRRO */

async function salvarBairro() {

    const nome =
        $("nomeBairro").value.trim();

    const cidadeId =
        $("bairroCidade").value;

    const editId =
        $("bairroEditId").value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha o nome e selecione uma cidade."
        );

        return;

    }


    let resultado;


    if (editId) {

        resultado =
            await supabaseClient
                .from("bairros")
                .update({
                    nome,
                    cidade_id: cidadeId
                })
                .eq("id", editId);

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


    $("nomeBairro").value = "";

    $("bairroCidade").value = "";

    $("bairroEditId").value = "";


    listarBairros();

    popularBairros();

    carregarDashboard();

}


/* EDITAR BAIRRO */

async function editarBairro(id) {

    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;

    }


    $("nomeBairro").value =
        data.nome;

    $("bairroCidade").value =
        data.cidade_id;

    $("bairroEditId").value =
        data.id;


    $("nomeBairro").focus();

}


/* EXCLUIR BAIRRO */

async function excluirBairro(id) {

    if (!confirm(
        "Deseja excluir este bairro?"
    )) return;


    const { error } =
        await supabaseClient
            .from("bairros")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir este bairro."
        );

        return;

    }


    listarBairros();

    popularBairros();

    carregarDashboard();

}


/* =========================================
   ESPECIALIDADES
========================================= */

async function listarEspecialidades() {

    const lista =
        $("listaEspecialidades");

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


    lista.innerHTML = data.map((especialidade) => `

        <div class="item-gerenciamento">

            <div>

                <strong>
                    ${escapeHTML(especialidade.nome)}
                </strong>

            </div>


            <div class="item-acoes">

                <button
                    class="btn-editar"
                    onclick="editarEspecialidade('${especialidade.id}')"
                >
                    Editar
                </button>


                <button
                    class="btn-excluir"
                    onclick="excluirEspecialidade('${especialidade.id}')"
                >
                    Excluir
                </button>

            </div>

        </div>

    `).join("");

}


/* SALVAR ESPECIALIDADE */

async function salvarEspecialidade() {

    const nome =
        $("nomeEspecialidade").value.trim();

    const editId =
        $("especialidadeEditId").value;


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

        return;

    }


    let resultado;


    if (editId) {

        resultado =
            await supabaseClient
                .from("especialidades")
                .update({ nome })
                .eq("id", editId);

    } else {

        resultado =
            await supabaseClient
                .from("especialidades")
                .insert({ nome });

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert(
            "Erro ao salvar especialidade."
        );

        return;

    }


    $("nomeEspecialidade").value = "";

    $("especialidadeEditId").value = "";


    listarEspecialidades();

    carregarDashboard();

}


/* EDITAR ESPECIALIDADE */

async function editarEspecialidade(id) {

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;

    }


    $("nomeEspecialidade").value =
        data.nome;

    $("especialidadeEditId").value =
        data.id;


    $("nomeEspecialidade").focus();

}


/* EXCLUIR ESPECIALIDADE */

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
            "Não foi possível excluir esta especialidade."
        );

        return;

    }


    listarEspecialidades();

    carregarDashboard();

}


/* =========================================
   POPULAR SELECTS
========================================= */

async function popularRegioes() {

    const selects = [

        $("estadoRegiao"),

        $("clinicaRegiao")

    ];


    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    selects.forEach((select) => {

        if (!select) return;


        const valorAtual =
            select.value;


        select.innerHTML = `
            <option value="">
                Selecione uma região
            </option>
        `;


        data.forEach((regiao) => {

            select.innerHTML += `

                <option value="${regiao.id}">
                    ${escapeHTML(regiao.nome)}
                </option>

            `;

        });


        select.value =
            valorAtual;

    });

}


async function popularEstados() {

    const selects = [

        $("cidadeEstado")

    ];


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    selects.forEach((select) => {

        if (!select) return;


        const valorAtual =
            select.value;


        select.innerHTML = `
            <option value="">
                Selecione um estado
            </option>
        `;


        data.forEach((estado) => {

            select.innerHTML += `

                <option value="${estado.id}">
                    ${escapeHTML(estado.nome)}
                </option>

            `;

        });


        select.value =
            valorAtual;

    });

}


async function popularCidades() {

    const selects = [

        $("bairroCidade")

    ];


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    selects.forEach((select) => {

        if (!select) return;


        const valorAtual =
            select.value;


        select.innerHTML = `
            <option value="">
                Selecione uma cidade
            </option>
        `;


        data.forEach((cidade) => {

            select.innerHTML += `

                <option value="${cidade.id}">
                    ${escapeHTML(cidade.nome)}
                </option>

            `;

        });


        select.value =
            valorAtual;

    });

}


async function popularBairros() {

    const select =
        $("clinicaBairro");

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


    select.innerHTML = `
        <option value="">
            Selecione um bairro
        </option>
    `;


    data.forEach((bairro) => {

        select.innerHTML += `

            <option value="${bairro.id}">
                ${escapeHTML(bairro.nome)}
            </option>

        `;

    });

}


/* =========================================
   CASCATA CLÍNICA
========================================= */

async function carregarEstadosClinica() {

    const regiaoId =
        $("clinicaRegiao").value;


    const selectEstado =
        $("clinicaEstado");


    const selectCidade =
        $("clinicaCidade");


    const selectBairro =
        $("clinicaBairro");


    selectEstado.innerHTML =
        `<option value="">Selecione um estado</option>`;

    selectCidade.innerHTML =
        `<option value="">Selecione uma cidade</option>`;

    selectBairro.innerHTML =
        `<option value="">Selecione um bairro</option>`;


    if (!regiaoId) return;


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("regiao_id", regiaoId)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    data.forEach((estado) => {

        selectEstado.innerHTML += `

            <option value="${estado.id}">
                ${escapeHTML(estado.nome)}
            </option>

        `;

    });

}


async function carregarCidadesClinica() {

    const estadoId =
        $("clinicaEstado").value;


    const selectCidade =
        $("clinicaCidade");


    const selectBairro =
        $("clinicaBairro");


    selectCidade.innerHTML =
        `<option value="">Selecione uma cidade</option>`;

    selectBairro.innerHTML =
        `<option value="">Selecione um bairro</option>`;


    if (!estadoId) return;


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("estado_id", estadoId)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    data.forEach((cidade) => {

        selectCidade.innerHTML += `

            <option value="${cidade.id}">
                ${escapeHTML(cidade.nome)}
            </option>

        `;

    });

}


async function carregarBairrosClinica() {

    const cidadeId =
        $("clinicaCidade").value;


    const selectBairro =
        $("clinicaBairro");


    selectBairro.innerHTML =
        `<option value="">Selecione um bairro</option>`;


    if (!cidadeId) return;


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("cidade_id", cidadeId)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    data.forEach((bairro) => {

        selectBairro.innerHTML += `

            <option value="${bairro.id}">
                ${escapeHTML(bairro.nome)}
            </option>

        `;

    });

}


/* =========================================
   CLÍNICAS
========================================= */

async function listarClinicas() {

    const lista =
        $("listaClinicas");

    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="6" class="sem-dados">
                Carregando clínicas...
            </td>
        </tr>
    `;


    const busca =
        $("buscarClinica")?.value.trim() || "";

    const status =
        $("filtroStatusClinica")?.value || "";


    let consulta =
        supabaseClient
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

        lista.innerHTML = `
            <tr>
                <td colspan="6" class="sem-dados">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <tr>
                <td colspan="6" class="sem-dados">
                    Nenhuma clínica encontrada.
                </td>
            </tr>
        `;

        return;

    }


    lista.innerHTML =
        data.map((clinica) => {

            const bairro =
                clinica.bairros?.nome || "";

            const cidade =
                clinica.bairros?.cidades?.nome || "";

            const estado =
                clinica.bairros?.cidades?.estados?.nome || "";


            return `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(clinica.nome)}
                        </strong>

                        <br>

                        <small>
                            ${escapeHTML(
                                clinica.endereco || ""
                            )}
                        </small>
                    </td>


                    <td>

                        ${bairro}

                        ${cidade ? ` - ${cidade}` : ""}

                        ${estado ? `/${estado}` : ""}

                    </td>


                    <td>

                        ${escapeHTML(
                            clinica.telefone || "-"
                        )}

                    </td>


                    <td>

                        <span class="especialidade-tag">
                            Ver especialidades
                        </span>

                    </td>


                    <td>

                        ${clinica.ativo

                            ? `<span class="status-ativa">
                                Ativa
                               </span>`

                            : `<span class="status-inativa">
                                Inativa
                               </span>`
                        }

                    </td>


                    <td>

                        <div class="acoes">

                            <button
                                class="btn-editar"
                                onclick="editarClinica('${clinica.id}')"
                            >
                                Editar
                            </button>


                            ${clinica.ativo

                                ? `
                                <button
                                    class="btn-desativar"
                                    onclick="alterarStatusClinica(
                                        '${clinica.id}',
                                        false
                                    )"
                                >
                                    Desativar
                                </button>
                                `

                                : `
                                <button
                                    class="btn-ativar"
                                    onclick="alterarStatusClinica(
                                        '${clinica.id}',
                                        true
                                    )"
                                >
                                    Ativar
                                </button>
                                `
                            }


                            <button
                                class="btn-excluir"
                                onclick="excluirClinica('${clinica.id}')"
                            >
                                Excluir
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }).join("");

}


/* =========================================
   MODAL CLÍNICA
========================================= */

function abrirModalClinica() {

    $("modalClinica")
        .classList.remove("hidden");


    $("tituloModalClinica").textContent =
        "Nova Clínica";


    $("formClinica").reset();


    $("clinicaId").value = "";


    $("areaStatusClinica")
        ?.classList.add("hidden");


    $("containerEspecialidades").innerHTML = "";


    adicionarLinhaEspecialidade();


    popularRegioes();

}


function fecharModalClinica() {

    $("modalClinica")
        .classList.add("hidden");


    $("formClinica").reset();


    $("clinicaId").value = "";


    $("containerEspecialidades").innerHTML = "";

}


/* =========================================
   LINHAS DE ESPECIALIDADE
========================================= */

async function adicionarLinhaEspecialidade(
    especialidadeSelecionada = ""
) {

    const container =
        $("containerEspecialidades");


    const { data, error } =
        await supabaseClient
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
                Selecione uma especialidade
            </option>


            ${data.map((especialidade) => `

                <option
                    value="${especialidade.id}"
                    ${especialidade.id == especialidadeSelecionada
                        ? "selected"
                        : ""
                    }
                >
                    ${escapeHTML(especialidade.nome)}
                </option>

            `).join("")}

        </select>


        <input
            type="text"
            class="input-observacao"
            placeholder="Observação (opcional)"
        >


        <button
            type="button"
            class="btn-remover-especialidade"
            onclick="this.parentElement.remove()"
        >
            Remover
        </button>

    `;


    container.appendChild(linha);

}


/* =========================================
   SALVAR CLÍNICA
========================================= */

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        $("clinicaId").value;


    const nome =
        $("clinicaNome").value.trim();

    const endereco =
        $("clinicaEndereco").value.trim();

    const telefone =
        $("clinicaTelefone").value.trim();

    const bairroId =
        $("clinicaBairro").value;


    if (!nome || !endereco || !bairroId) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }


    const clinica = {

        nome,
        endereco,
        telefone,
        bairro_id: bairroId

    };


    if (id) {

        clinica.ativo =
            $("clinicaAtivo").checked;

    } else {

        clinica.ativo = true;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("clinicas")
                .update(clinica)
                .eq("id", id);

    } else {

        resultado =
            await supabaseClient
                .from("clinicas")
                .insert(clinica)
                .select()
                .single();

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert(
            "Erro ao salvar clínica."
        );

        return;

    }


    const clinicaId =
        id || resultado.data.id;


    /* SALVAR ESPECIALIDADES */

    const selects =
        document.querySelectorAll(
            ".select-especialidade"
        );


    if (id) {

        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq("clinica_id", clinicaId);

    }


    const especialidades = [];


    selects.forEach((select) => {

        if (select.value) {

            especialidades.push({

                clinica_id: clinicaId,

                especialidade_id:
                    select.value

            });

        }

    });


    if (especialidades.length > 0) {

        const { error } =
            await supabaseClient
                .from("clinica_especialidades")
                .insert(especialidades);


        if (error) {

            console.error(
                "Erro ao salvar especialidades:",
                error
            );

        }

    }


    alert(
        "Clínica salva com sucesso!"
    );


    fecharModalClinica();

    listarClinicas();

    carregarDashboard();

}


/* =========================================
   EDITAR CLÍNICA
========================================= */

async function editarClinica(id) {

    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select(`
                *,
                bairros(
                    *,
                    cidades(
                        *,
                        estados(*)
                    )
                )
            `)
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao carregar clínica."
        );

        return;

    }


    $("modalClinica")
        .classList.remove("hidden");


    $("tituloModalClinica").textContent =
        "Editar Clínica";


    $("clinicaId").value =
        data.id;

    $("clinicaNome").value =
        data.nome || "";

    $("clinicaEndereco").value =
        data.endereco || "";

    $("clinicaTelefone").value =
        data.telefone || "";

    $("clinicaAtivo").checked =
        data.ativo;


    $("areaStatusClinica")
        .classList.remove("hidden");


    const bairro =
        data.bairros;

    const cidade =
        bairro?.cidades;

    const estado =
        cidade?.estados;


    await popularRegioes();


    if (estado) {

        $("clinicaRegiao").value =
            estado.regiao_id;

        await carregarEstadosClinica();


        $("clinicaEstado").value =
            estado.id;

        await carregarCidadesClinica();


        $("clinicaCidade").value =
            cidade.id;

        await carregarBairrosClinica();


        $("clinicaBairro").value =
            bairro.id;

    }


    $("containerEspecialidades").innerHTML = "";


    const {
        data: especialidadesClinica
    } =
        await supabaseClient
            .from("clinica_especialidades")
            .select("*")
            .eq("clinica_id", id);


    if (
        especialidadesClinica &&
        especialidadesClinica.length > 0
    ) {

        for (
            const item of especialidadesClinica
        ) {

            await adicionarLinhaEspecialidade(
                item.especialidade_id
            );

        }

    } else {

        adicionarLinhaEspecialidade();

    }

}


/* =========================================
   STATUS CLÍNICA
========================================= */

async function alterarStatusClinica(
    id,
    ativo
) {

    const { error } =
        await supabaseClient
            .from("clinicas")
            .update({ ativo })
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao alterar status."
        );

        return;

    }


    listarClinicas();

    carregarDashboard();

}


/* =========================================
   EXCLUIR CLÍNICA
========================================= */

async function excluirClinica(id) {

    if (!confirm(
        "Deseja realmente excluir esta clínica?"
    )) return;


    await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq("clinica_id", id);


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


    listarClinicas();

    carregarDashboard();

}


/* =========================================
   BUSCA AUTOMÁTICA
========================================= */

function configurarBuscaClinicas() {

    const input =
        $("buscarClinica");


    if (!input) return;


    let tempo;


    input.addEventListener(
        "input",
        () => {

            clearTimeout(tempo);


            tempo =
                setTimeout(() => {

                    listarClinicas();

                }, 400);

        }
    );

}


/* =========================================
   ESCAPE HTML
   Protege contra HTML inserido nos campos
========================================= */

function escapeHTML(texto) {

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


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Inicializando painel administrativo..."
        );


        /* VERIFICA SUPABASE */

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "supabaseClient não foi encontrado!"
            );

            alert(
                "Erro ao conectar com o banco de dados."
            );

            return;

        }


        /* CONFIGURA BUSCA */

        configurarBuscaClinicas();


        /* CARREGA SELECTS */

        await popularRegioes();

        await popularEstados();

        await popularCidades();


        /* CARREGA DASHBOARD */

        await carregarDashboard();


        console.log(
            "Painel administrativo inicializado!"
        );

    }
);


/* =========================================
   DISPONIBILIZAR FUNÇÕES GLOBALMENTE
   Necessário para onclick do HTML
========================================= */

window.mostrarPagina =
    mostrarPagina;

window.toggleMenu =
    toggleMenu;

window.sair =
    sair;


/* DASHBOARD */

window.carregarDashboard =
    carregarDashboard;


/* REGIÕES */

window.listarRegioes =
    listarRegioes;

window.salvarRegiao =
    salvarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;


/* ESTADOS */

window.listarEstados =
    listarEstados;

window.salvarEstado =
    salvarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;


/* CIDADES */

window.listarCidades =
    listarCidades;

window.salvarCidade =
    salvarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;


/* BAIRROS */

window.listarBairros =
    listarBairros;

window.salvarBairro =
    salvarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;


/* ESPECIALIDADES */

window.listarEspecialidades =
    listarEspecialidades;

window.salvarEspecialidade =
    salvarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;


/* CLÍNICAS */

window.listarClinicas =
    listarClinicas;

window.abrirModalClinica =
    abrirModalClinica;

window.fecharModalClinica =
    fecharModalClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.salvarClinica =
    salvarClinica;

window.editarClinica =
    editarClinica;

window.alterarStatusClinica =
    alterarStatusClinica;

window.excluirClinica =
    excluirClinica;


/* CASCATAS */

window.carregarEstadosClinica =
    carregarEstadosClinica;

window.carregarCidadesClinica =
    carregarCidadesClinica;

window.carregarBairrosClinica =
    carregarBairrosClinica;
