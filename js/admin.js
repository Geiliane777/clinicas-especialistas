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

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Painel administrativo iniciado"
        );

        await carregarDashboard();

        await listarRegioes();
        await listarEstados();
        await listarCidades();
        await listarBairros();
        await listarEspecialidades();

    }
);


// ======================================
// NAVEGAÇÃO
// ======================================

async function mostrarPagina(nomePagina) {

    // ESCONDER TODAS

    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("ativa");

        });


    // MOSTRAR PÁGINA

    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );

    if (pagina) {

        pagina.classList.add("ativa");

    }


    // MENU ATIVO

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


    // TÍTULO

    const titulo =
        document.getElementById("tituloPagina");

    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina];

    }


    // CARREGADORES

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


// ======================================
// VOLTAR AO SITE
// ======================================

function voltarParaInicio() {

    window.location.href = "/index.html";

}


// ======================================
// SAIR
// ======================================

function sair() {

    window.location.href = "/login.html";

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


        atualizarNumero(
            "resumoClinicas",
            clinicas.count
        );

        atualizarNumero(
            "resumoEspecialidades",
            especialidades.count
        );


        const totalLocalidades =
            (regioes.count || 0) +
            (estados.count || 0) +
            (cidades.count || 0) +
            (bairros.count || 0);


        atualizarNumero(
            "resumoLocalidades",
            totalLocalidades
        );

    } catch (erro) {

        console.error(
            "Erro dashboard:",
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


// ======================================
// REGIÕES
// ======================================

async function listarRegioes() {

    const container =
        document.getElementById(
            "listaRegioes"
        );

    if (!container) return;


    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            `<div class="sem-dados">
                Nenhuma região cadastrada.
            </div>`;

        return;

    }


    data.forEach(regiao => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${regiao.nome}
                    </strong>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarRegiao('${regiao.id}', '${regiao.nome}')"
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

        `;

    });

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

        alert(resultado.error.message);
        return;

    }


    input.value = "";
    editId.value = "";


    await listarRegioes();
    await popularRegioes();
    await carregarDashboard();

}


function editarRegiao(id, nome) {

    document
        .getElementById("regiaoEditId")
        .value = id;

    document
        .getElementById("nomeRegiao")
        .value = nome;

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

        alert(error.message);
        return;

    }


    await listarRegioes();
    await carregarDashboard();

}


// ======================================
// ESTADOS
// ======================================

async function popularRegioes() {

    const select =
        document.getElementById(
            "estadoRegiao"
        );

    if (!select) return;


    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    select.innerHTML =
        `<option value="">
            Selecione uma região
        </option>`;


    data?.forEach(regiao => {

        select.innerHTML += `
            <option value="${regiao.id}">
                ${regiao.nome}
            </option>
        `;

    });

}


async function listarEstados() {

    const container =
        document.getElementById(
            "listaEstados"
        );

    if (!container) return;


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


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            `<div class="sem-dados">
                Nenhum estado cadastrado.
            </div>`;

        return;

    }


    data.forEach(estado => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${estado.nome}
                    </strong>

                    <div class="item-subtitulo">
                        Região:
                        ${estado.regioes?.nome || "-"}
                    </div>

                </div>


                <div class="item-acoes">

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

    const regiao_id =
        document
            .getElementById("estadoRegiao")
            .value;


    if (!nome || !regiao_id) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("estados")
            .insert({
                nome,
                regiao_id
            });


    if (error) {

        alert(error.message);
        return;

    }


    document
        .getElementById("nomeEstado")
        .value = "";


    await listarEstados();
    await popularEstados();
    await carregarDashboard();

}


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

        alert(error.message);
        return;

    }


    await listarEstados();
    await carregarDashboard();

}


// ======================================
// CIDADES
// ======================================

async function popularEstados() {

    const select =
        document.getElementById(
            "cidadeEstado"
        );

    if (!select) return;


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    select.innerHTML =
        `<option value="">
            Selecione um estado
        </option>`;


    data?.forEach(estado => {

        select.innerHTML += `
            <option value="${estado.id}">
                ${estado.nome}
            </option>
        `;

    });

}


async function listarCidades() {

    const container =
        document.getElementById(
            "listaCidades"
        );

    if (!container) return;


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


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            `<div class="sem-dados">
                Nenhuma cidade cadastrada.
            </div>`;

        return;

    }


    data.forEach(cidade => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${cidade.nome}
                    </strong>

                    <div class="item-subtitulo">
                        Estado:
                        ${cidade.estados?.nome || "-"}
                    </div>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-excluir"
                        onclick="excluirCidade('${cidade.id}')"
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
        document
            .getElementById("nomeCidade")
            .value
            .trim();

    const estado_id =
        document
            .getElementById("cidadeEstado")
            .value;


    if (!nome || !estado_id) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("cidades")
            .insert({
                nome,
                estado_id
            });


    if (error) {

        alert(error.message);
        return;

    }


    document
        .getElementById("nomeCidade")
        .value = "";


    await listarCidades();
    await popularCidades();
    await carregarDashboard();

}


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

        alert(error.message);
        return;

    }


    await listarCidades();
    await carregarDashboard();

}


// ======================================
// BAIRROS
// ======================================

async function popularCidades() {

    const select =
        document.getElementById(
            "bairroCidade"
        );

    if (!select) return;


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    select.innerHTML =
        `<option value="">
            Selecione uma cidade
        </option>`;


    data?.forEach(cidade => {

        select.innerHTML += `
            <option value="${cidade.id}">
                ${cidade.nome}
            </option>
        `;

    });

}


async function listarBairros() {

    const container =
        document.getElementById(
            "listaBairros"
        );

    if (!container) return;


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


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            `<div class="sem-dados">
                Nenhum bairro cadastrado.
            </div>`;

        return;

    }


    data.forEach(bairro => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${bairro.nome}
                    </strong>

                    <div class="item-subtitulo">
                        Cidade:
                        ${bairro.cidades?.nome || "-"}
                    </div>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-excluir"
                        onclick="excluirBairro('${bairro.id}')"
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
        document
            .getElementById("nomeBairro")
            .value
            .trim();

    const cidade_id =
        document
            .getElementById("bairroCidade")
            .value;


    if (!nome || !cidade_id) {

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
                cidade_id
            });


    if (error) {

        alert(error.message);
        return;

    }


    document
        .getElementById("nomeBairro")
        .value = "";


    await listarBairros();
    await carregarDashboard();

}


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

        alert(error.message);
        return;

    }


    await listarBairros();
    await carregarDashboard();

}


// ======================================
// ESPECIALIDADES
// ======================================

async function listarEspecialidades() {

    const container =
        document.getElementById(
            "listaEspecialidades"
        );

    if (!container) return;


    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            `<div class="sem-dados">
                Nenhuma especialidade cadastrada.
            </div>`;

        return;

    }


    data.forEach(especialidade => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <strong>
                    ${especialidade.nome}
                </strong>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEspecialidade(
                            '${especialidade.id}',
                            '${especialidade.nome}'
                        )"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirEspecialidade(
                            '${especialidade.id}'
                        )"
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


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite uma especialidade."
        );

        return;

    }


    let resultado;


    if (editId.value) {

        resultado =
            await supabaseClient
                .from("especialidades")
                .update({ nome })
                .eq("id", editId.value);

    } else {

        resultado =
            await supabaseClient
                .from("especialidades")
                .insert({ nome });

    }


    if (resultado.error) {

        alert(resultado.error.message);
        return;

    }


    input.value = "";
    editId.value = "";


    await listarEspecialidades();
    await carregarDashboard();

}


function editarEspecialidade(id, nome) {

    document
        .getElementById(
            "especialidadeEditId"
        )
        .value = id;


    document
        .getElementById(
            "nomeEspecialidade"
        )
        .value = nome;

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

        alert(error.message);
        return;

    }


    await listarEspecialidades();
    await carregarDashboard();

}


// ======================================
// CLÍNICAS
// ======================================

async function listarClinicas() {

    const container =
        document.getElementById(
            "listaClinicas"
        );

    if (!container) return;


    const busca =
        document
            .getElementById("buscarClinica")
            ?.value
            .trim();

    const status =
        document
            .getElementById(
                "filtroStatusClinica"
            )
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
                        estados(
                            nome
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

        container.innerHTML = `
            <tr>
                <td colspan="6">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

        return;

    }


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML = `
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


    data.forEach(clinica => {

        const bairro =
            clinica.bairros?.nome || "-";

        const cidade =
            clinica.bairros?.cidades?.nome || "-";

        const estado =
            clinica.bairros
                ?.cidades
                ?.estados
                ?.nome || "-";


        container.innerHTML += `

            <tr>

                <td>
                    <strong>
                        ${clinica.nome}
                    </strong>
                </td>


                <td>
                    ${bairro} -
                    ${cidade}/${estado}
                </td>


                <td>
                    ${clinica.telefone || "-"}
                </td>


                <td>
                    -
                </td>


                <td>

                    ${
                        clinica.ativo
                            ?
                            `<span class="status-ativa">
                                Ativa
                            </span>`
                            :
                            `<span class="status-inativa">
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


                        <button
                            class="
                                ${
                                    clinica.ativo
                                        ?
                                        "btn-desativar"
                                        :
                                        "btn-ativar"
                                }
                            "
                            onclick="
                                alterarStatusClinica(
                                    '${clinica.id}',
                                    ${clinica.ativo}
                                )
                            "
                        >
                            ${
                                clinica.ativo
                                    ?
                                    "Desativar"
                                    :
                                    "Ativar"
                            }
                        </button>


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

    });

}


// ======================================
// MODAL CLÍNICA
// ======================================

async function abrirModalClinica() {

    document
        .getElementById("modalClinica")
        .classList
        .remove("hidden");


    document
        .getElementById("formClinica")
        .reset();


    document
        .getElementById("clinicaId")
        .value = "";


    document
        .getElementById(
            "tituloModalClinica"
        )
        .textContent =
        "Nova Clínica";


    document
        .getElementById(
            "areaStatusClinica"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "containerEspecialidades"
        )
        .innerHTML = "";


    await carregarRegioesClinica();

}


function fecharModalClinica() {

    document
        .getElementById("modalClinica")
        .classList
        .add("hidden");

}


// ======================================
// SELECTS DA CLÍNICA
// ======================================

async function carregarRegioesClinica() {

    const select =
        document.getElementById(
            "clinicaRegiao"
        );


    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    select.innerHTML =
        `<option value="">
            Selecione uma região
        </option>`;


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
        document
            .getElementById(
                "clinicaRegiao"
            )
            .value;


    const select =
        document.getElementById(
            "clinicaEstado"
        );


    select.innerHTML =
        `<option value="">
            Selecione um estado
        </option>`;


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
        document
            .getElementById(
                "clinicaEstado"
            )
            .value;


    const select =
        document.getElementById(
            "clinicaCidade"
        );


    select.innerHTML =
        `<option value="">
            Selecione uma cidade
        </option>`;


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
        document
            .getElementById(
                "clinicaCidade"
            )
            .value;


    const select =
        document.getElementById(
            "clinicaBairro"
        );


    select.innerHTML =
        `<option value="">
            Selecione um bairro
        </option>`;


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


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// ESPECIALIDADES NO FORMULÁRIO
// ======================================

async function adicionarLinhaEspecialidade() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


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

            ${
                data.map(item => `
                    <option value="${item.id}">
                        ${item.nome}
                    </option>
                `).join("")
            }

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


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document
            .getElementById("clinicaId")
            .value;


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


    if (!bairro_id) {

        alert(
            "Selecione a localização da clínica."
        );

        return;

    }


    const dados = {
        nome,
        endereco,
        telefone,
        bairro_id
    };


    let resultado;


    if (id) {

        dados.ativo =
            document
                .getElementById("clinicaAtivo")
                .checked;


        resultado =
            await supabaseClient
                .from("clinicas")
                .update(dados)
                .eq("id", id);

    } else {

        dados.ativo = true;


        resultado =
            await supabaseClient
                .from("clinicas")
                .insert(dados)
                .select()
                .single();

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert(
            resultado.error.message
        );

        return;

    }


    const clinicaId =
        id || resultado.data.id;


    // SALVAR ESPECIALIDADES

    const selects =
        document.querySelectorAll(
            ".select-especialidade"
        );


    if (selects.length) {

        // APAGA RELAÇÕES ANTIGAS

        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "clinica_id",
                clinicaId
            );


        const especialidades = [];


        selects.forEach(select => {

            if (select.value) {

                especialidades.push({
                    clinica_id: clinicaId,
                    especialidade_id:
                        select.value
                });

            }

        });


        if (especialidades.length) {

            await supabaseClient
                .from("clinica_especialidades")
                .insert(especialidades);

        }

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

        alert(error.message);
        return;

    }


    document
        .getElementById("modalClinica")
        .classList
        .remove("hidden");


    document
        .getElementById(
            "tituloModalClinica"
        )
        .textContent =
        "Editar Clínica";


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


    document
        .getElementById(
            "areaStatusClinica"
        )
        .classList
        .remove("hidden");


    document
        .getElementById("clinicaAtivo")
        .checked = data.ativo;


    const estado =
        data.bairros
            ?.cidades
            ?.estados;


    const cidade =
        data.bairros
            ?.cidades;


    const bairro =
        data.bairros;


    if (estado) {

        await carregarRegioesClinica();


        document
            .getElementById(
                "clinicaRegiao"
            )
            .value =
            estado.regiao_id;


        await carregarEstadosClinica();


        document
            .getElementById(
                "clinicaEstado"
            )
            .value =
            estado.id;


        await carregarCidadesClinica();


        document
            .getElementById(
                "clinicaCidade"
            )
            .value =
            cidade.id;


        await carregarBairrosClinica();


        document
            .getElementById(
                "clinicaBairro"
            )
            .value =
            bairro.id;

    }


    // CARREGAR ESPECIALIDADES

    const { data: especialidades } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                especialidade_id
            `)
            .eq(
                "clinica_id",
                id
            );


    document
        .getElementById(
            "containerEspecialidades"
        )
        .innerHTML = "";


    if (especialidades?.length) {

        for (
            const item
            of especialidades
        ) {

            await adicionarLinhaEspecialidade();


            const linhas =
                document.querySelectorAll(
                    ".select-especialidade"
                );


            const ultimo =
                linhas[
                    linhas.length - 1
                ];


            ultimo.value =
                item.especialidade_id;

        }

    }

}


// ======================================
// STATUS CLÍNICA
// ======================================

async function alterarStatusClinica(
    id,
    statusAtual
) {

    const { error } =
        await supabaseClient
            .from("clinicas")
            .update({
                ativo: !statusAtual
            })
            .eq("id", id);


    if (error) {

        alert(error.message);
        return;

    }


    await listarClinicas();

    await carregarDashboard();

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica(id) {

    if (!confirm(
        "Deseja realmente excluir esta clínica?"
    )) return;


    await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            id
        );


    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq("id", id);


    if (error) {

        alert(error.message);
        return;

    }


    await listarClinicas();

    await carregarDashboard();

}
