// ==========================================
// ADMIN.JS
// Utiliza o supabaseClient já criado
// no arquivo supabase.js
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

let dadosEdicao = null;


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    configurarMenu();

    configurarEventos();

    await carregarDashboard();

    await carregarRegioesSelect();

    await carregarEstadosSelect();

    await carregarCidadesSelect();

    await carregarEspecialidadesChecklist();

});


// ==========================================
// MENU
// ==========================================

function configurarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");


    botoes.forEach(botao => {

        botao.addEventListener("click", async () => {

            const pagina =
                botao.dataset.page;


            document
                .querySelectorAll(".menu-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            botao.classList.add("active");


            document
                .querySelectorAll(".page")
                .forEach(page =>
                    page.classList.add("hidden")
                );


            const paginaElemento =
                document.getElementById(pagina);


            if (paginaElemento) {

                paginaElemento
                    .classList
                    .remove("hidden");

            }


            atualizarTitulo(pagina);


            await carregarPagina(pagina);

        });

    });

}


// ==========================================
// TÍTULO
// ==========================================

function atualizarTitulo(pagina) {

    const titulos = {

        dashboard: "Dashboard",

        clinicas: "Clínicas",

        especialidades: "Especialidades",

        regioes: "Regiões",

        estados: "Estados",

        cidades: "Cidades",

        bairros: "Bairros"

    };


    document
        .getElementById("tituloPagina")
        .textContent =
        titulos[pagina];

}


// ==========================================
// CARREGAR PÁGINAS
// ==========================================

async function carregarPagina(pagina) {

    if (pagina === "dashboard") {

        await carregarDashboard();

    }


    if (pagina === "clinicas") {

        await carregarClinicas();

        await carregarRegioesSelect();

        await carregarEspecialidadesChecklist();

    }


    if (pagina === "especialidades") {

        await carregarEspecialidades();

    }


    if (pagina === "regioes") {

        await carregarRegioes();

    }


    if (pagina === "estados") {

        await carregarEstados();

        await carregarRegioesSelect();

    }


    if (pagina === "cidades") {

        await carregarCidades();

        await carregarEstadosSelect();

    }


    if (pagina === "bairros") {

        await carregarBairros();

        await carregarCidadesSelect();

    }

}


// ==========================================
// EVENTOS
// ==========================================

function configurarEventos() {


    // CLÍNICA

    document
        .getElementById("btnSalvarClinica")
        ?.addEventListener(
            "click",
            salvarClinica
        );


    // ESPECIALIDADE

    document
        .getElementById("btnSalvarEspecialidade")
        ?.addEventListener(
            "click",
            salvarEspecialidade
        );


    // REGIÃO

    document
        .getElementById("btnSalvarRegiao")
        ?.addEventListener(
            "click",
            salvarRegiao
        );


    // ESTADO

    document
        .getElementById("btnSalvarEstado")
        ?.addEventListener(
            "click",
            salvarEstado
        );


    // CIDADE

    document
        .getElementById("btnSalvarCidade")
        ?.addEventListener(
            "click",
            salvarCidade
        );


    // BAIRRO

    document
        .getElementById("btnSalvarBairro")
        ?.addEventListener(
            "click",
            salvarBairro
        );


    // BUSCAR CLÍNICA

    document
        .getElementById("buscarClinica")
        ?.addEventListener(
            "input",
            filtrarClinicas
        );


    // CASCATA CLÍNICA

    document
        .getElementById("clinica_regiao")
        ?.addEventListener(
            "change",
            carregarEstadosClinica
        );


    document
        .getElementById("clinica_estado")
        ?.addEventListener(
            "change",
            carregarCidadesClinica
        );


    document
        .getElementById("clinica_cidade")
        ?.addEventListener(
            "change",
            carregarBairrosClinica
        );

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
                .select("*", {
                    count: "exact",
                    head: true
                }),

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


        document
            .getElementById("totalClinicas")
            .textContent =
            clinicas.count || 0;


        document
            .getElementById("totalEspecialidades")
            .textContent =
            especialidades.count || 0;


        document
            .getElementById("totalRegioes")
            .textContent =
            regioes.count || 0;


        document
            .getElementById("totalEstados")
            .textContent =
            estados.count || 0;


        document
            .getElementById("totalCidades")
            .textContent =
            cidades.count || 0;


        document
            .getElementById("totalBairros")
            .textContent =
            bairros.count || 0;

    }

    catch (erro) {

        console.error(
            "Erro dashboard:",
            erro
        );

    }

}


// ==========================================
// SELECT GENÉRICO
// ==========================================

function preencherSelect(
    elemento,
    dados,
    placeholder
) {

    const select =
        document.getElementById(elemento);


    if (!select) return;


    select.innerHTML =
        `<option value="">
            ${placeholder}
        </option>`;


    dados.forEach(item => {

        const option =
            document.createElement("option");


        option.value =
            item.id;


        option.textContent =
            item.nome;


        select.appendChild(option);

    });

}


// ==========================================
// REGIÕES SELECT
// ==========================================

async function carregarRegioesSelect() {

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    preencherSelect(
        "estado_regiao",
        data,
        "Selecione a região"
    );


    preencherSelect(
        "clinica_regiao",
        data,
        "Selecione a região"
    );

}


// ==========================================
// ESTADOS SELECT
// ==========================================

async function carregarEstadosSelect() {

    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    preencherSelect(
        "cidade_estado",
        data || [],
        "Selecione o estado"
    );

}


// ==========================================
// CIDADES SELECT
// ==========================================

async function carregarCidadesSelect() {

    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    preencherSelect(
        "bairro_cidade",
        data || [],
        "Selecione a cidade"
    );

}


// ==========================================
// CASCATA CLÍNICA
// ==========================================

async function carregarEstadosClinica() {

    const regiao =
        document
            .getElementById("clinica_regiao")
            .value;


    preencherSelect(
        "clinica_estado",
        [],
        "Selecione o estado"
    );


    preencherSelect(
        "clinica_cidade",
        [],
        "Selecione a cidade"
    );


    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione o bairro"
    );


    if (!regiao) return;


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("regiao_id", regiao)
            .order("nome");


    preencherSelect(
        "clinica_estado",
        data || [],
        "Selecione o estado"
    );

}


// ==========================================
// CIDADES CLÍNICA
// ==========================================

async function carregarCidadesClinica() {

    const estado =
        document
            .getElementById("clinica_estado")
            .value;


    preencherSelect(
        "clinica_cidade",
        [],
        "Selecione a cidade"
    );


    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione o bairro"
    );


    if (!estado) return;


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("estado_id", estado)
            .order("nome");


    preencherSelect(
        "clinica_cidade",
        data || [],
        "Selecione a cidade"
    );

}


// ==========================================
// BAIRROS CLÍNICA
// ==========================================

async function carregarBairrosClinica() {

    const cidade =
        document
            .getElementById("clinica_cidade")
            .value;


    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione o bairro"
    );


    if (!cidade) return;


    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("cidade_id", cidade)
            .order("nome");


    preencherSelect(
        "clinica_bairro",
        data || [],
        "Selecione o bairro"
    );

}


// ==========================================
// ESPECIALIDADES CHECKLIST
// ==========================================

async function carregarEspecialidadesChecklist() {

    const container =
        document.getElementById(
            "clinica_especialidades"
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


    if (!data.length) {

        container.innerHTML =
            "Nenhuma especialidade cadastrada.";

        return;

    }


    container.innerHTML = "";


    data.forEach(especialidade => {

        const label =
            document.createElement("label");


        label.className =
            "check-especialidade";


        label.innerHTML = `

            <input
                type="checkbox"
                value="${especialidade.id}"
                data-rede="${especialidade.rede || "Rede Especialistas"}"
            >

            <div>

                <strong>
                    ${especialidade.nome}
                </strong>

                <small>
                    ${especialidade.rede || "Rede Especialistas"}
                </small>

            </div>

        `;


        container.appendChild(label);

    });

}


// ==========================================
// SALVAR CLÍNICA
// ==========================================

async function salvarClinica() {

    const nome =
        document
            .getElementById("clinica_nome")
            .value
            .trim();


    const telefone =
        document
            .getElementById("clinica_telefone")
            .value
            .trim();


    const endereco =
        document
            .getElementById("clinica_endereco")
            .value
            .trim();


    const bairro =
        document
            .getElementById("clinica_bairro")
            .value;


    if (
        !nome ||
        !endereco ||
        !bairro
    ) {

        alert(
            "Preencha nome, endereço e bairro."
        );

        return;

    }


    const { data: clinica, error } =
        await supabaseClient
            .from("clinicas")
            .insert({

                nome,
                telefone,
                endereco,

                bairro_id:
                    bairro,

                ativo:
                    true

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


    const selecionadas =
        document.querySelectorAll(
            "#clinica_especialidades input:checked"
        );


    if (selecionadas.length > 0) {

        const especialidades =
            Array.from(selecionadas)
                .map(item => ({

                    clinica_id:
                        clinica.id,

                    especialidade_id:
                        Number(item.value),

                    rede:
                        item.dataset.rede,

                    ativo:
                        true

                }));


        await supabaseClient
            .from("clinica_especialidades")
            .insert(especialidades);

    }


    alert(
        "Clínica cadastrada com sucesso!"
    );


    limparFormularioClinica();

    await carregarClinicas();

    await carregarDashboard();

}


// ==========================================
// LIMPAR FORMULÁRIO CLÍNICA
// ==========================================

function limparFormularioClinica() {

    document
        .getElementById("clinica_nome")
        .value = "";


    document
        .getElementById("clinica_telefone")
        .value = "";


    document
        .getElementById("clinica_endereco")
        .value = "";


    document
        .getElementById("clinica_regiao")
        .value = "";


    preencherSelect(
        "clinica_estado",
        [],
        "Selecione o estado"
    );


    preencherSelect(
        "clinica_cidade",
        [],
        "Selecione a cidade"
    );


    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione o bairro"
    );


    document
        .querySelectorAll(
            "#clinica_especialidades input"
        )
        .forEach(input =>
            input.checked = false
        );

}


// ==========================================
// CARREGAR CLÍNICAS
// ==========================================

async function carregarClinicas() {

    const tbody =
        document.getElementById(
            "listaClinicas"
        );


    if (!tbody) return;


    tbody.innerHTML = `

        <tr>

            <td colspan="6">
                Carregando clínicas...
            </td>

        </tr>

    `;


    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select(`

                *,
                
                bairros(
                    id,
                    nome,

                    cidades(
                        id,
                        nome,

                        estados(
                            id,
                            nome,

                            regioes(
                                id,
                                nome
                            )
                        )
                    )
                ),

                clinica_especialidades(

                    id,

                    rede,

                    especialidades(
                        id,
                        nome
                    )

                )

            `)
            .order("nome");


    if (error) {

        console.error(error);

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    Erro ao carregar clínicas.

                </td>

            </tr>

        `;

        return;

    }


    if (!data.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    Nenhuma clínica cadastrada.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML = "";


    data.forEach(clinica => {

        const bairro =
            clinica.bairros;


        const cidade =
            bairro?.cidades;


        const estado =
            cidade?.estados;


        let especialidadesHtml = "";


        if (
            clinica.clinica_especialidades &&
            clinica.clinica_especialidades.length
        ) {

            clinica
                .clinica_especialidades
                .forEach(item => {

                    especialidadesHtml += `

                        <div class="badge badge-especialidade">

                            🦷
                            ${item.especialidades?.nome || ""}

                            <small>
                                ${item.rede}
                            </small>

                        </div>

                    `;

                });

        }

        else {

            especialidadesHtml =
                "Sem especialidades";

        }


        const status =
            clinica.ativo
                ? `
                    <span class="status status-ativo">
                        ● Ativa
                    </span>
                `
                : `
                    <span class="status status-inativo">
                        ● Inativa
                    </span>
                `;


        const botaoStatus =
            clinica.ativo
                ? `
                    <button
                        class="btn-status btn-desativar"
                        onclick="alterarStatusClinica(
                            ${clinica.id},
                            false
                        )">

                        Desativar

                    </button>
                `
                : `
                    <button
                        class="btn-status btn-ativar"
                        onclick="alterarStatusClinica(
                            ${clinica.id},
                            true
                        )">

                        Ativar

                    </button>
                `;


        tbody.innerHTML += `

            <tr>

                <td>

                    <span class="clinica-nome">

                        ${clinica.nome}

                    </span>

                    <span class="clinica-endereco">

                        ${clinica.endereco || ""}

                    </span>

                </td>


                <td class="localizacao">

                    <strong>
                        ${bairro?.nome || ""}
                    </strong>

                    ${cidade?.nome || ""}

                    -

                    ${estado?.nome || ""}

                </td>


                <td>

                    ${clinica.telefone || "-"}

                </td>


                <td>

                    ${especialidadesHtml}

                </td>


                <td>

                    ${status}

                </td>


                <td>

                    <div class="acoes">

                        <button
                            class="btn-edit"
                            onclick="editarClinica(
                                ${clinica.id}
                            )">

                            ✏️ Editar

                        </button>


                        ${botaoStatus}


                        <button
                            class="btn-delete"
                            onclick="excluirClinica(
                                ${clinica.id}
                            )">

                            🗑 Excluir

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ==========================================
// FILTRAR CLÍNICAS
// ==========================================

function filtrarClinicas() {

    const texto =
        document
            .getElementById("buscarClinica")
            .value
            .toLowerCase();


    const linhas =
        document
            .querySelectorAll(
                "#listaClinicas tr"
            );


    linhas.forEach(linha => {

        linha.style.display =
            linha.innerText
                .toLowerCase()
                .includes(texto)
                ? ""
                : "none";

    });

}


// ==========================================
// ALTERAR STATUS CLÍNICA
// ==========================================

async function alterarStatusClinica(
    id,
    ativo
) {

    const mensagem =
        ativo
            ? "Deseja ativar esta clínica?"
            : "Deseja desativar esta clínica?";


    if (!confirm(mensagem)) return;


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update({
                ativo
            })
            .eq("id", id);


    if (error) {

        alert(
            "Erro ao alterar status."
        );

        return;

    }


    await carregarClinicas();

}


// ==========================================
// EXCLUIR CLÍNICA
// ==========================================

async function excluirClinica(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta clínica?"
        )
    ) return;


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


    await carregarClinicas();

    await carregarDashboard();

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


    if (error) return;


    dadosEdicao = {
        tipo: "clinica",
        id
    };


    abrirModal(
        "Editar Clínica",

        `

        <div class="form-grid">

            <div>

                <label>
                    Nome da Clínica
                </label>

                <input
                    id="edit_nome"
                    value="${data.nome}">

            </div>


            <div>

                <label>
                    Telefone
                </label>

                <input
                    id="edit_telefone"
                    value="${data.telefone || ""}">

            </div>


            <div class="full">

                <label>
                    Endereço
                </label>

                <input
                    id="edit_endereco"
                    value="${data.endereco}">

            </div>

        </div>

        `
    );

}


// ==========================================
// SALVAR ESPECIALIDADE
// ==========================================

async function salvarEspecialidade() {

    const nome =
        document
            .getElementById(
                "especialidade_nome"
            )
            .value
            .trim();


    const rede =
        document
            .getElementById(
                "especialidade_rede"
            )
            .value;


    if (!nome || !rede) {

        alert(
            "Informe o nome e a rede."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("especialidades")
            .insert({
                nome,
                rede
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar especialidade."
        );

        return;

    }


    alert(
        "Especialidade cadastrada!"
    );


    document
        .getElementById("especialidade_nome")
        .value = "";


    document
        .getElementById("especialidade_rede")
        .value = "";


    await carregarEspecialidades();

    await carregarEspecialidadesChecklist();

    await carregarDashboard();

}


// ==========================================
// CARREGAR ESPECIALIDADES
// ==========================================

async function carregarEspecialidades() {

    const tbody =
        document.getElementById(
            "listaEspecialidades"
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


    tbody.innerHTML = "";


    if (!data.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="3">

                    Nenhuma especialidade cadastrada.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(item => {

        let badgeRede = "";


        if (
            item.rede === "Rede Sindilegis"
        ) {

            badgeRede = `

                <span
                    class="badge badge-rede-sindilegis">

                    ${item.rede}

                </span>

            `;

        }

        else {

            badgeRede = `

                <span
                    class="badge badge-rede-especialistas">

                    ${item.rede || "Rede Especialistas"}

                </span>

            `;

        }


        tbody.innerHTML += `

            <tr>

                <td>

                    <strong>
                        ${item.nome}
                    </strong>

                </td>


                <td>

                    ${badgeRede}

                </td>


                <td>

                    <div class="acoes">

                        <button
                            class="btn-edit"
                            onclick="editarEspecialidade(
                                ${item.id}
                            )">

                            ✏️ Editar

                        </button>


                        <button
                            class="btn-delete"
                            onclick="excluirEspecialidade(
                                ${item.id}
                            )">

                            🗑 Excluir

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ==========================================
// EDITAR ESPECIALIDADE
// ==========================================

async function editarEspecialidade(id) {

    const { data } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .eq("id", id)
            .single();


    dadosEdicao = {
        tipo: "especialidade",
        id
    };


    abrirModal(

        "Editar Especialidade",

        `

        <div class="form-grid">

            <div>

                <label>
                    Nome
                </label>

                <input
                    id="edit_nome"
                    value="${data.nome}">

            </div>


            <div>

                <label>
                    Rede
                </label>

                <select id="edit_rede">

                    <option
                        value="Rede Especialistas"
                        ${data.rede === "Rede Especialistas" ? "selected" : ""}>

                        Rede Especialistas

                    </option>


                    <option
                        value="Rede Sindilegis"
                        ${data.rede === "Rede Sindilegis" ? "selected" : ""}>

                        Rede Sindilegis

                    </option>

                </select>

            </div>

        </div>

        `

    );

}


// ==========================================
// EXCLUIR ESPECIALIDADE
// ==========================================

async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("especialidades")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Não foi possível excluir."
        );

        return;

    }


    await carregarEspecialidades();

    await carregarEspecialidadesChecklist();

    await carregarDashboard();

}


// ==========================================
// REGIÕES
// ==========================================

async function salvarRegiao() {

    const nome =
        document
            .getElementById("regiao_nome")
            .value
            .trim();


    if (!nome) {

        alert(
            "Informe o nome da região."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("regioes")
            .insert({
                nome
            });


    if (error) {

        alert(
            "Erro ao salvar região."
        );

        return;

    }


    document
        .getElementById("regiao_nome")
        .value = "";


    await carregarRegioes();

    await carregarRegioesSelect();

    await carregarDashboard();

}


async function carregarRegioes() {

    const tbody =
        document.getElementById(
            "listaRegioes"
        );


    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    tbody.innerHTML = "";


    data.forEach(item => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${item.nome}
                </td>

                <td>

                    <div class="acoes">

                        <button
                            class="btn-edit"
                            onclick="editarRegiao(${item.id})">

                            ✏️ Editar

                        </button>

                        <button
                            class="btn-delete"
                            onclick="excluirRegiao(${item.id})">

                            🗑 Excluir

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


async function editarRegiao(id) {

    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .eq("id", id)
            .single();


    dadosEdicao = {
        tipo: "regiao",
        id
    };


    abrirModal(

        "Editar Região",

        `

        <label>
            Nome da Região
        </label>

        <input
            id="edit_nome"
            value="${data.nome}">

        `

    );

}


async function excluirRegiao(id) {

    if (!confirm("Excluir região?")) return;


    await supabaseClient
        .from("regioes")
        .delete()
        .eq("id", id);


    await carregarRegioes();

    await carregarDashboard();

}


// ==========================================
// ESTADOS
// ==========================================

async function salvarEstado() {

    const nome =
        document
            .getElementById("estado_nome")
            .value
            .trim();


    const regiao_id =
        document
            .getElementById("estado_regiao")
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

        alert(
            "Erro ao salvar estado."
        );

        return;

    }


    document
        .getElementById("estado_nome")
        .value = "";


    await carregarEstados();

    await carregarEstadosSelect();

    await carregarDashboard();

}


async function carregarEstados() {

    const tbody =
        document.getElementById(
            "listaEstados"
        );


    const { data } =
        await supabaseClient
            .from("estados")
            .select(`
                *,
                regioes(nome)
            `)
            .order("nome");


    tbody.innerHTML = "";


    data.forEach(item => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${item.nome}
                </td>

                <td>
                    ${item.regioes?.nome || ""}
                </td>

                <td>

                    <div class="acoes">

                        <button
                            class="btn-edit"
                            onclick="editarEstado(${item.id})">

                            ✏️ Editar

                        </button>

                        <button
                            class="btn-delete"
                            onclick="excluirEstado(${item.id})">

                            🗑 Excluir

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


async function editarEstado(id) {

    const { data: estado } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("id", id)
            .single();


    const { data: regioes } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    dadosEdicao = {
        tipo: "estado",
        id
    };


    let options = "";


    regioes.forEach(regiao => {

        options += `

            <option
                value="${regiao.id}"
                ${estado.regiao_id === regiao.id ? "selected" : ""}>

                ${regiao.nome}

            </option>

        `;

    });


    abrirModal(

        "Editar Estado",

        `

        <div class="form-grid">

            <div>

                <label>
                    Estado
                </label>

                <input
                    id="edit_nome"
                    value="${estado.nome}">

            </div>


            <div>

                <label>
                    Região
                </label>

                <select id="edit_regiao">

                    ${options}

                </select>

            </div>

        </div>

        `

    );

}


async function excluirEstado(id) {

    if (!confirm("Excluir estado?")) return;


    await supabaseClient
        .from("estados")
        .delete()
        .eq("id", id);


    await carregarEstados();

    await carregarDashboard();

}


// ==========================================
// CIDADES
// ==========================================

async function salvarCidade() {

    const nome =
        document
            .getElementById("cidade_nome")
            .value
            .trim();


    const estado_id =
        document
            .getElementById("cidade_estado")
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

        alert(
            "Erro ao salvar cidade."
        );

        return;

    }


    document
        .getElementById("cidade_nome")
        .value = "";


    await carregarCidades();

    await carregarCidadesSelect();

    await carregarDashboard();

}


async function carregarCidades() {

    const tbody =
        document.getElementById(
            "listaCidades"
        );


    const { data } =
        await supabaseClient
            .from("cidades")
            .select(`
                *,
                estados(nome)
            `)
            .order("nome");


    tbody.innerHTML = "";


    data.forEach(item => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${item.nome}
                </td>

                <td>
                    ${item.estados?.nome || ""}
                </td>

                <td>

                    <div class="acoes">

                        <button
                            class="btn-edit"
                            onclick="editarCidade(${item.id})">

                            ✏️ Editar

                        </button>

                        <button
                            class="btn-delete"
                            onclick="excluirCidade(${item.id})">

                            🗑 Excluir

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


async function editarCidade(id) {

    const { data: cidade } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("id", id)
            .single();


    const { data: estados } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    dadosEdicao = {
        tipo: "cidade",
        id
    };


    let options = "";


    estados.forEach(estado => {

        options += `

            <option
                value="${estado.id}"
                ${cidade.estado_id === estado.id ? "selected" : ""}>

                ${estado.nome}

            </option>

        `;

    });


    abrirModal(

        "Editar Cidade",

        `

        <div class="form-grid">

            <div>

                <label>
                    Cidade
                </label>

                <input
                    id="edit_nome"
                    value="${cidade.nome}">

            </div>


            <div>

                <label>
                    Estado
                </label>

                <select id="edit_estado">

                    ${options}

                </select>

            </div>

        </div>

        `

    );

}


async function excluirCidade(id) {

    if (!confirm("Excluir cidade?")) return;


    await supabaseClient
        .from("cidades")
        .delete()
        .eq("id", id);


    await carregarCidades();

    await carregarDashboard();

}


// ==========================================
// BAIRROS
// ==========================================

async function salvarBairro() {

    const nome =
        document
            .getElementById("bairro_nome")
            .value
            .trim();


    const cidade_id =
        document
            .getElementById("bairro_cidade")
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

        alert(
            "Erro ao salvar bairro."
        );

        return;

    }


    document
        .getElementById("bairro_nome")
        .value = "";


    await carregarBairros();

    await carregarDashboard();

}


async function carregarBairros() {

    const tbody =
        document.getElementById(
            "listaBairros"
        );


    const { data } =
        await supabaseClient
            .from("bairros")
            .select(`
                *,
                cidades(nome)
            `)
            .order("nome");


    tbody.innerHTML = "";


    data.forEach(item => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${item.nome}
                </td>

                <td>
                    ${item.cidades?.nome || ""}
                </td>

                <td>

                    <div class="acoes">

                        <button
                            class="btn-edit"
                            onclick="editarBairro(${item.id})">

                            ✏️ Editar

                        </button>

                        <button
                            class="btn-delete"
                            onclick="excluirBairro(${item.id})">

                            🗑 Excluir

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


async function editarBairro(id) {

    const { data: bairro } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("id", id)
            .single();


    const { data: cidades } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    dadosEdicao = {
        tipo: "bairro",
        id
    };


    let options = "";


    cidades.forEach(cidade => {

        options += `

            <option
                value="${cidade.id}"
                ${bairro.cidade_id === cidade.id ? "selected" : ""}>

                ${cidade.nome}

            </option>

        `;

    });


    abrirModal(

        "Editar Bairro",

        `

        <div class="form-grid">

            <div>

                <label>
                    Bairro
                </label>

                <input
                    id="edit_nome"
                    value="${bairro.nome}">

            </div>


            <div>

                <label>
                    Cidade
                </label>

                <select id="edit_cidade">

                    ${options}

                </select>

            </div>

        </div>

        `

    );

}


async function excluirBairro(id) {

    if (!confirm("Excluir bairro?")) return;


    await supabaseClient
        .from("bairros")
        .delete()
        .eq("id", id);


    await carregarBairros();

    await carregarDashboard();

}


// ==========================================
// MODAL
// ==========================================

function abrirModal(
    titulo,
    conteudo
) {

    document
        .getElementById("modalTitulo")
        .textContent =
        titulo;


    document
        .getElementById("modalConteudo")
        .innerHTML =
        conteudo;


    document
        .getElementById("modalEditar")
        .classList
        .remove("hidden");


    document
        .getElementById("btnConfirmarEdicao")
        .onclick =
        salvarEdicao;

}


function fecharModal() {

    document
        .getElementById("modalEditar")
        .classList
        .add("hidden");


    dadosEdicao = null;

}


// ==========================================
// SALVAR EDIÇÃO
// ==========================================

async function salvarEdicao() {

    if (!dadosEdicao) return;


    const tipo =
        dadosEdicao.tipo;


    const id =
        dadosEdicao.id;


    const nome =
        document
            .getElementById("edit_nome")
            ?.value
            .trim();


    let error = null;


    // CLÍNICA

    if (tipo === "clinica") {

        const telefone =
            document
                .getElementById("edit_telefone")
                .value;


        const endereco =
            document
                .getElementById("edit_endereco")
                .value;


        ({ error } =
            await supabaseClient
                .from("clinicas")
                .update({

                    nome,

                    telefone,

                    endereco

                })
                .eq("id", id)
        );

    }


    // ESPECIALIDADE

    if (tipo === "especialidade") {

        const rede =
            document
                .getElementById("edit_rede")
                .value;


        ({ error } =
            await supabaseClient
                .from("especialidades")
                .update({

                    nome,

                    rede

                })
                .eq("id", id)
        );

    }


    // REGIÃO

    if (tipo === "regiao") {

        ({ error } =
            await supabaseClient
                .from("regioes")
                .update({
                    nome
                })
                .eq("id", id)
        );

    }


    // ESTADO

    if (tipo === "estado") {

        const regiao_id =
            document
                .getElementById("edit_regiao")
                .value;


        ({ error } =
            await supabaseClient
                .from("estados")
                .update({

                    nome,

                    regiao_id

                })
                .eq("id", id)
        );

    }


    // CIDADE

    if (tipo === "cidade") {

        const estado_id =
            document
                .getElementById("edit_estado")
                .value;


        ({ error } =
            await supabaseClient
                .from("cidades")
                .update({

                    nome,

                    estado_id

                })
                .eq("id", id)
        );

    }


    // BAIRRO

    if (tipo === "bairro") {

        const cidade_id =
            document
                .getElementById("edit_cidade")
                .value;


        ({ error } =
            await supabaseClient
                .from("bairros")
                .update({

                    nome,

                    cidade_id

                })
                .eq("id", id)
        );

    }


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar alterações."
        );

        return;

    }


    alert(
        "Alterações salvas com sucesso!"
    );


    fecharModal();


    await carregarDashboard();


    await carregarPagina(
        tipo === "clinica"
            ? "clinicas"
            : tipo === "especialidade"
                ? "especialidades"
                : tipo === "regiao"
                    ? "regioes"
                    : tipo === "estado"
                        ? "estados"
                        : tipo === "cidade"
                            ? "cidades"
                            : "bairros"
    );

}
