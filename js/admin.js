// ======================================
// PAINEL ADMINISTRATIVO
// REDE ESPECIALISTAS / SINDILEGIS
// ======================================

console.log("admin.js carregado");


// ======================================
// CONFIGURAÇÕES
// ======================================

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


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Inicializando painel administrativo...");

    configurarMenu();

    configurarBotoes();

    configurarFiltros();

    await carregarDashboard();

    await carregarClinicas();

    await carregarEspecialidades();

    await carregarRegioes();

    await carregarEstados();

    await carregarCidades();

    await carregarBairros();

    await popularSelectsIniciais();

});


// ======================================
// MENU
// ======================================

function configurarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");

    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            const pagina =
                botao.dataset.page;

            mostrarPagina(pagina);

        });

    });

}


function mostrarPagina(pagina) {

    document
        .querySelectorAll(".page")
        .forEach(item => {

            item.classList.add("hidden");

        });


    const paginaSelecionada =
        document.getElementById(pagina);

    if (paginaSelecionada) {

        paginaSelecionada.classList.remove("hidden");

    }


    document
        .querySelectorAll(".menu-btn")
        .forEach(item => {

            item.classList.remove("active");

        });


    const botaoAtivo =
        document.querySelector(
            `[data-page="${pagina}"]`
        );

    if (botaoAtivo) {

        botaoAtivo.classList.add("active");

    }


    const titulo =
        document.getElementById("tituloPagina");

    if (
        titulo &&
        TITULOS_PAGINA[pagina]
    ) {

        titulo.textContent =
            TITULOS_PAGINA[pagina];

    }


    atualizarPagina(pagina);

}


// ======================================
// ATUALIZAR PÁGINAS
// ======================================

async function atualizarPagina(pagina) {

    switch (pagina) {

        case "dashboard":

            await carregarDashboard();

            break;


        case "clinicas":

            await carregarClinicas();

            break;


        case "especialidades":

            await carregarEspecialidades();

            break;


        case "regioes":

            await carregarRegioes();

            break;


        case "estados":

            await carregarEstados();

            break;


        case "cidades":

            await carregarCidades();

            break;


        case "bairros":

            await carregarBairros();

            break;

    }

}


// ======================================
// BOTÕES
// ======================================

function configurarBotoes() {

    adicionarEvento(
        "btnSalvarClinica",
        salvarClinica
    );

    adicionarEvento(
        "btnAtualizarClinica",
        atualizarClinica
    );

    adicionarEvento(
        "btnExcluirClinica",
        excluirClinicaAtual
    );

    adicionarEvento(
        "btnVoltarClinicas",
        () => mostrarPagina("clinicas")
    );

    adicionarEvento(
        "btnAdicionarEspRede",
        adicionarEspecialidadeRede
    );


    adicionarEvento(
        "btnSalvarEspecialidade",
        salvarEspecialidade
    );


    adicionarEvento(
        "btnSalvarRegiao",
        salvarRegiao
    );


    adicionarEvento(
        "btnSalvarEstado",
        salvarEstado
    );


    adicionarEvento(
        "btnSalvarCidade",
        salvarCidade
    );


    adicionarEvento(
        "btnSalvarBairro",
        salvarBairro
    );


    adicionarEvento(
        "btnVoltarSite",
        () => {

            location.href = "index.html";

        }
    );

}


// ======================================
// FUNÇÃO AUXILIAR EVENTOS
// ======================================

function adicionarEvento(id, funcao) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.addEventListener(
            "click",
            funcao
        );

    }

}


// ======================================
// FILTROS
// ======================================

function configurarFiltros() {

    const filtroClinica =
        document.getElementById(
            "filtro_clinica_nome"
        );

    if (filtroClinica) {

        filtroClinica.addEventListener(
            "input",
            carregarClinicas
        );

    }


    const filtroEstado =
        document.getElementById(
            "filtro_estado_regiao"
        );

    if (filtroEstado) {

        filtroEstado.addEventListener(
            "change",
            carregarEstados
        );

    }


    const filtroCidade =
        document.getElementById(
            "filtro_cidade_estado"
        );

    if (filtroCidade) {

        filtroCidade.addEventListener(
            "change",
            carregarCidades
        );

    }


    const filtroBairro =
        document.getElementById(
            "filtro_bairro_cidade"
        );

    if (filtroBairro) {

        filtroBairro.addEventListener(
            "change",
            carregarBairros
        );

    }


    // CASCATA CADASTRO CLÍNICA

    adicionarEventoChange(
        "clinica_regiao",
        popularEstadosClinica
    );

    adicionarEventoChange(
        "clinica_estado",
        popularCidadesClinica
    );

    adicionarEventoChange(
        "clinica_cidade",
        popularBairrosClinica
    );


    // CASCATA EDIÇÃO CLÍNICA

    adicionarEventoChange(
        "edit_clinica_regiao",
        popularEstadosEditar
    );

    adicionarEventoChange(
        "edit_clinica_estado",
        popularCidadesEditar
    );

    adicionarEventoChange(
        "edit_clinica_cidade",
        popularBairrosEditar
    );

}


// ======================================
// EVENTO CHANGE
// ======================================

function adicionarEventoChange(id, funcao) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.addEventListener(
            "change",
            funcao
        );

    }

}


// ======================================
// DASHBOARD
// ======================================

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


        atualizarTexto(
            "totalClinicas",
            clinicas.count || 0
        );

        atualizarTexto(
            "totalEspecialidades",
            especialidades.count || 0
        );

        atualizarTexto(
            "totalRegioes",
            regioes.count || 0
        );

        atualizarTexto(
            "totalEstados",
            estados.count || 0
        );

        atualizarTexto(
            "totalCidades",
            cidades.count || 0
        );

        atualizarTexto(
            "totalBairros",
            bairros.count || 0
        );

    }

    catch (erro) {

        console.error(
            "Erro dashboard:",
            erro
        );

    }

}


function atualizarTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent = valor;

    }

}


// ======================================
// SELECT AUXILIAR
// ======================================

function preencherSelect(
    id,
    dados,
    textoPadrao
) {

    const select =
        document.getElementById(id);

    if (!select) return;


    select.innerHTML =
        `<option value="">${textoPadrao}</option>`;


    if (!dados) return;


    dados.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// POPULAR SELECTS INICIAIS
// ======================================

async function popularSelectsIniciais() {

    await popularRegioesSelect();

    await popularEspecialidadesSelect();

    await popularRegioesFiltros();

    await popularEstadosFiltros();

    await popularCidadesFiltros();

}


// ======================================
// REGIÕES SELECT
// ======================================

async function popularRegioesSelect() {

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
        "clinica_regiao",
        data,
        "Selecione Região"
    );


    preencherSelect(
        "edit_clinica_regiao",
        data,
        "Selecione Região"
    );


    preencherSelect(
        "estado_regiao",
        data,
        "Selecione Região"
    );

}


// ======================================
// ESPECIALIDADES SELECT
// ======================================

async function popularEspecialidadesSelect() {

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    preencherSelect(
        "clinica_especialidade",
        data,
        "Selecione Especialidade"
    );


    preencherSelect(
        "edit_especialidade",
        data,
        "Selecione Especialidade"
    );

}


// ======================================
// FILTROS LOCALIZAÇÃO
// ======================================

async function popularRegioesFiltros() {

    const { data } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    preencherSelect(
        "filtro_estado_regiao",
        data,
        "Todas as Regiões"
    );

}


async function popularEstadosFiltros() {

    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    preencherSelect(
        "filtro_cidade_estado",
        data,
        "Todos os Estados"
    );

}


async function popularCidadesFiltros() {

    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    preencherSelect(
        "filtro_bairro_cidade",
        data,
        "Todas as Cidades"
    );

}


// ======================================
// CASCATA - NOVA CLÍNICA
// ======================================

async function popularEstadosClinica() {

    const regiao =
        document.getElementById(
            "clinica_regiao"
        ).value;


    preencherSelect(
        "clinica_estado",
        [],
        "Selecione Estado"
    );

    preencherSelect(
        "clinica_cidade",
        [],
        "Selecione Cidade"
    );

    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!regiao) return;


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("regiao_id", regiao)
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    preencherSelect(
        "clinica_estado",
        data,
        "Selecione Estado"
    );

}


async function popularCidadesClinica() {

    const estado =
        document.getElementById(
            "clinica_estado"
        ).value;


    preencherSelect(
        "clinica_cidade",
        [],
        "Selecione Cidade"
    );

    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!estado) return;


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("estado_id", estado)
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    preencherSelect(
        "clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


async function popularBairrosClinica() {

    const cidade =
        document.getElementById(
            "clinica_cidade"
        ).value;


    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!cidade) return;


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("cidade_id", cidade)
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    preencherSelect(
        "clinica_bairro",
        data,
        "Selecione Bairro"
    );

}


// ======================================
// SALVAR CLÍNICA
// ======================================

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

    const bairro =
        document.getElementById(
            "clinica_bairro"
        ).value;

    const especialidade =
        document.getElementById(
            "clinica_especialidade"
        ).value;

    const rede =
        document.getElementById(
            "clinica_rede"
        ).value;


    if (
        !nome ||
        !endereco ||
        !bairro ||
        !especialidade ||
        !rede
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }


    // CRIA CLÍNICA

    const {
        data: clinica,
        error: erroClinica
    } =
    await supabaseClient
        .from("clinicas")
        .insert({

            nome,
            telefone,
            endereco,
            bairro_id: bairro

        })
        .select()
        .single();


    if (erroClinica) {

        console.error(erroClinica);

        alert(
            "Erro ao cadastrar clínica."
        );

        return;

    }


    // VINCULA ESPECIALIDADE

    const {
        error: erroVinculo
    } =
    await supabaseClient
        .from("clinica_especialidades")
        .insert({

            clinica_id: clinica.id,

            especialidade_id:
                especialidade,

            rede,

            ativo: true

        });


    if (erroVinculo) {

        console.error(erroVinculo);

        alert(
            "Clínica cadastrada, mas ocorreu erro ao vincular especialidade."
        );

        return;

    }


    alert(
        "Clínica cadastrada com sucesso!"
    );


    limparFormularioClinica();

    await carregarClinicas();

    await carregarDashboard();

}


// ======================================
// LIMPAR FORMULÁRIO CLÍNICA
// ======================================

function limparFormularioClinica() {

    const ids = [

        "clinica_nome",
        "clinica_telefone",
        "clinica_endereco"

    ];


    ids.forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {

            elemento.value = "";

        }

    });


    [
        "clinica_regiao",
        "clinica_estado",
        "clinica_cidade",
        "clinica_bairro",
        "clinica_especialidade",
        "clinica_rede"
    ].forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {

            elemento.selectedIndex = 0;

        }

    });

}


// ======================================
// CARREGAR CLÍNICAS
// ======================================

async function carregarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );

    if (!lista) return;


    lista.innerHTML =
        "<p>Carregando clínicas...</p>";


    let consulta =
        supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                endereco,
                telefone,
                ativo,
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
                    ativo,
                    especialidades(
                        id,
                        nome
                    )
                )
            `)
            .order("nome");


    const filtro =
        document.getElementById(
            "filtro_clinica_nome"
        );


    if (
        filtro &&
        filtro.value.trim()
    ) {

        consulta =
            consulta.ilike(
                "nome",
                `%${filtro.value.trim()}%`
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(
            "Erro clínicas:",
            error
        );

        lista.innerHTML =
            "<p>Erro ao carregar clínicas.</p>";

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <p>
                Nenhuma clínica cadastrada.
            </p>
        `;

        return;

    }


    lista.innerHTML = `
        <div class="tabela-container">

            <table class="tabela-admin">

                <thead>

                    <tr>

                        <th>Clínica</th>

                        <th>Localização</th>

                        <th>Telefone</th>

                        <th>Especialidades / Redes</th>

                        <th>Status</th>

                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    ${data.map(clinica => {

                        const bairro =
                            clinica.bairros?.nome ||
                            "-";

                        const cidade =
                            clinica.bairros
                            ?.cidades
                            ?.nome ||
                            "-";

                        const estado =
                            clinica.bairros
                            ?.cidades
                            ?.estados
                            ?.nome ||
                            "-";


                        const vinculos =
                            clinica.clinica_especialidades
                            ?.map(item => {

                                const especialidade =
                                    item.especialidades
                                    ?.nome ||
                                    "Sem especialidade";

                                const nomeRede =
                                    item.rede === "especialistas"
                                    ? "Especialistas"
                                    : "Sindilegis";

                                return `
                                    <div class="vinculo-item">

                                        🦷 ${especialidade}

                                        <span class="badge-rede">

                                            ${nomeRede}

                                        </span>

                                    </div>
                                `;

                            })
                            .join("")
                            ||
                            "-";


                        const status =
                            clinica.ativo
                            ? `
                                <span class="status ativo">
                                    Ativa
                                </span>
                            `
                            : `
                                <span class="status inativo">
                                    Inativa
                                </span>
                            `;


                        const textoBotao =
                            clinica.ativo
                            ? "Desativar"
                            : "Ativar";


                        return `

                            <tr>

                                <td>

                                    <strong>
                                        ${clinica.nome}
                                    </strong>

                                    <br>

                                    <small>
                                        ${clinica.endereco}
                                    </small>

                                </td>


                                <td>

                                    ${bairro}

                                    <br>

                                    <small>
                                        ${cidade} - ${estado}
                                    </small>

                                </td>


                                <td>

                                    ${clinica.telefone || "-"}

                                </td>


                                <td>

                                    ${vinculos}

                                </td>


                                <td>

                                    ${status}

                                </td>


                                <td class="acoes-tabela">

                                    <button
                                        class="btn-editar"
                                        onclick="abrirEditarClinica(${clinica.id})"
                                    >
                                        ✏️ Editar
                                    </button>


                                    <button
                                        class="btn-status"
                                        onclick="alternarStatusClinica(${clinica.id}, ${clinica.ativo})"
                                    >
                                        ${textoBotao}
                                    </button>


                                    <button
                                        class="btn-excluir"
                                        onclick="excluirClinica(${clinica.id})"
                                    >
                                        🗑 Excluir
                                    </button>

                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>

        </div>
    `;

}


// ======================================
// ABRIR EDITAR CLÍNICA
// ======================================

async function abrirEditarClinica(id) {

    const {
        data: clinica,
        error
    } =
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


    document.getElementById(
        "edit_clinica_id"
    ).value = clinica.id;


    document.getElementById(
        "edit_clinica_nome"
    ).value = clinica.nome || "";


    document.getElementById(
        "edit_clinica_telefone"
    ).value = clinica.telefone || "";


    document.getElementById(
        "edit_clinica_endereco"
    ).value = clinica.endereco || "";


    const bairro =
        clinica.bairros;

    const cidade =
        bairro?.cidades;

    const estado =
        cidade?.estados;

    const regiao =
        estado?.regioes;


    if (regiao) {

        document.getElementById(
            "edit_clinica_regiao"
        ).value = regiao.id;

        await popularEstadosEditar();

    }


    if (estado) {

        document.getElementById(
            "edit_clinica_estado"
        ).value = estado.id;

        await popularCidadesEditar();

    }


    if (cidade) {

        document.getElementById(
            "edit_clinica_cidade"
        ).value = cidade.id;

        await popularBairrosEditar();

    }


    if (bairro) {

        document.getElementById(
            "edit_clinica_bairro"
        ).value = bairro.id;

    }


    const checkbox =
        document.getElementById(
            "edit_clinica_ativo"
        );

    if (checkbox) {

        checkbox.checked =
            clinica.ativo;

    }


    await carregarVinculosClinica(id);

    await popularEspecialidadesSelect();

    mostrarPagina("editarClinica");

}


// ======================================
// CASCATA EDITAR
// ======================================

async function popularEstadosEditar() {

    const regiao =
        document
            .getElementById(
                "edit_clinica_regiao"
            )
            .value;


    preencherSelect(
        "edit_clinica_estado",
        [],
        "Selecione Estado"
    );

    preencherSelect(
        "edit_clinica_cidade",
        [],
        "Selecione Cidade"
    );

    preencherSelect(
        "edit_clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!regiao) return;


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiao
            )
            .order("nome");


    preencherSelect(
        "edit_clinica_estado",
        data,
        "Selecione Estado"
    );

}


async function popularCidadesEditar() {

    const estado =
        document
            .getElementById(
                "edit_clinica_estado"
            )
            .value;


    preencherSelect(
        "edit_clinica_cidade",
        [],
        "Selecione Cidade"
    );

    preencherSelect(
        "edit_clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!estado) return;


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estado
            )
            .order("nome");


    preencherSelect(
        "edit_clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


async function popularBairrosEditar() {

    const cidade =
        document
            .getElementById(
                "edit_clinica_cidade"
            )
            .value;


    preencherSelect(
        "edit_clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!cidade) return;


    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidade
            )
            .order("nome");


    preencherSelect(
        "edit_clinica_bairro",
        data,
        "Selecione Bairro"
    );

}


// ======================================
// ATUALIZAR CLÍNICA
// ======================================

async function atualizarClinica() {

    const id =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    const nome =
        document.getElementById(
            "edit_clinica_nome"
        ).value.trim();


    const telefone =
        document.getElementById(
            "edit_clinica_telefone"
        ).value.trim();


    const endereco =
        document.getElementById(
            "edit_clinica_endereco"
        ).value.trim();


    const bairro =
        document.getElementById(
            "edit_clinica_bairro"
        ).value;


    const ativo =
        document.getElementById(
            "edit_clinica_ativo"
        ).checked;


    if (
        !id ||
        !nome ||
        !endereco ||
        !bairro
    ) {

        alert(
            "Preencha os campos obrigatórios."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update({

                nome,
                telefone,
                endereco,

                bairro_id:
                    bairro,

                ativo

            })
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

    mostrarPagina("clinicas");

}


// ======================================
// ALTERNAR STATUS
// ======================================

async function alternarStatusClinica(
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


    await carregarClinicas();

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?"
        );


    if (!confirmar) return;


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

}


// ======================================
// EXCLUIR CLÍNICA ATUAL
// ======================================

async function excluirClinicaAtual() {

    const id =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    if (!id) return;


    await excluirClinica(id);

    mostrarPagina("clinicas");

}


// ======================================
// VÍNCULOS DA CLÍNICA
// ======================================

async function carregarVinculosClinica(
    clinicaId
) {

    const lista =
        document.getElementById(
            "listaEspRede"
        );


    if (!lista) return;


    const { data, error } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
                rede,
                ativo,
                especialidades(
                    id,
                    nome
                )
            `)
            .eq(
                "clinica_id",
                clinicaId
            )
            .order("id");


    if (error) {

        console.error(error);

        lista.innerHTML =
            "<p>Erro ao carregar vínculos.</p>";

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <p>
                Nenhuma especialidade vinculada.
            </p>
        `;

        return;

    }


    lista.innerHTML =
        data.map(item => {

            const nomeRede =
                item.rede === "especialistas"
                ? "Rede Especialistas"
                : "Rede Sindilegis";


            return `

                <div class="item-vinculo">

                    <div>

                        <strong>
                            ${item.especialidades?.nome}
                        </strong>

                        <br>

                        <span>
                            ${nomeRede}
                        </span>

                    </div>


                    <div>

                        <button
                            class="btn-status"
                            onclick="alternarStatusVinculo(${item.id}, ${item.ativo})"
                        >
                            ${item.ativo
                                ? "Desativar"
                                : "Ativar"
                            }
                        </button>


                        <button
                            class="btn-excluir"
                            onclick="excluirVinculo(${item.id})"
                        >
                            🗑
                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


// ======================================
// ADICIONAR ESPECIALIDADE + REDE
// ======================================

async function adicionarEspecialidadeRede() {

    const clinicaId =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    const especialidadeId =
        document.getElementById(
            "edit_especialidade"
        ).value;


    const rede =
        document.getElementById(
            "edit_rede"
        ).value;


    if (
        !clinicaId ||
        !especialidadeId ||
        !rede
    ) {

        alert(
            "Selecione especialidade e rede."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert({

                clinica_id:
                    clinicaId,

                especialidade_id:
                    especialidadeId,

                rede,

                ativo: true

            });


    if (error) {

        console.error(error);

        if (
            error.code === "23505"
        ) {

            alert(
                "Este vínculo já existe."
            );

        }

        else {

            alert(
                "Erro ao adicionar vínculo."
            );

        }

        return;

    }


    document.getElementById(
        "edit_especialidade"
    ).value = "";


    await carregarVinculosClinica(
        clinicaId
    );

    await carregarClinicas();

}


// ======================================
// STATUS VÍNCULO
// ======================================

async function alternarStatusVinculo(
    id,
    statusAtual
) {

    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .update({

                ativo:
                    !statusAtual

            })
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao alterar vínculo."
        );

        return;

    }


    const clinicaId =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    await carregarVinculosClinica(
        clinicaId
    );

}


// ======================================
// EXCLUIR VÍNCULO
// ======================================

async function excluirVinculo(id) {

    if (
        !confirm(
            "Remover esta especialidade da clínica?"
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao remover vínculo."
        );

        return;

    }


    const clinicaId =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    await carregarVinculosClinica(
        clinicaId
    );

    await carregarClinicas();

}


// ======================================
// ESPECIALIDADES
// ======================================

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

        lista.innerHTML =
            "<p>Erro ao carregar especialidades.</p>";

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma especialidade cadastrada.</p>";

        return;

    }


    lista.innerHTML = `
        <div class="tabela-container">

            <table class="tabela-admin">

                <thead>

                    <tr>

                        <th>Especialidade</th>

                        <th>Utilização nas Redes</th>

                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    ${await Promise.all(
                        data.map(
                            montarLinhaEspecialidade
                        )
                    ).then(
                        linhas => linhas.join("")
                    )}

                </tbody>

            </table>

        </div>
    `;

}


// ======================================
// LINHA ESPECIALIDADE
// ======================================

async function montarLinhaEspecialidade(
    especialidade
) {

    const { data } =
        await supabaseClient
            .from("clinica_especialidades")
            .select("rede")
            .eq(
                "especialidade_id",
                especialidade.id
            );


    const redes =
        [...new Set(
            data?.map(
                item => item.rede
            ) || []
        )];


    const redesTexto =
        redes.length
        ? redes.map(rede => {

            if (
                rede === "especialistas"
            ) {

                return `
                    <span class="badge-rede">
                        Rede Especialistas
                    </span>
                `;

            }


            if (
                rede === "sindilegis"
            ) {

                return `
                    <span class="badge-rede">
                        Rede Sindilegis
                    </span>
                `;

            }


            return rede;

        }).join(" ")
        : `
            <span class="sem-rede">
                Ainda não vinculada
            </span>
        `;


    return `

        <tr>

            <td>

                <strong>
                    ${especialidade.nome}
                </strong>

            </td>


            <td>

                ${redesTexto}

            </td>


            <td>

                <button
                    class="btn-excluir"
                    onclick="excluirEspecialidade(${especialidade.id})"
                >
                    🗑 Excluir
                </button>

            </td>

        </tr>

    `;

}


// ======================================
// SALVAR ESPECIALIDADE
// ======================================

async function salvarEspecialidade() {

    const input =
        document.getElementById(
            "nova_especialidade"
        );


    if (!input) return;


    const nome =
        input.value.trim();


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

                nome

            });


    if (error) {

        console.error(error);

        if (
            error.code === "23505"
        ) {

            alert(
                "Esta especialidade já existe."
            );

        }

        else {

            alert(
                "Erro ao cadastrar especialidade."
            );

        }

        return;

    }


    input.value = "";


    await carregarEspecialidades();

    await popularEspecialidadesSelect();

    await carregarDashboard();

}


// ======================================
// EXCLUIR ESPECIALIDADE
// ======================================

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

        console.error(error);

        alert(
            "Não foi possível excluir a especialidade."
        );

        return;

    }


    await carregarEspecialidades();

    await popularEspecialidadesSelect();

    await carregarDashboard();

}


// ======================================
// REGIÕES
// ======================================

async function carregarRegioes() {

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

        lista.innerHTML =
            "<p>Erro ao carregar regiões.</p>";

        return;

    }


    lista.innerHTML =
        criarListaLocalizacao(
            data,
            "regiao"
        );

}


// ======================================
// SALVAR REGIÃO
// ======================================

async function salvarRegiao() {

    const input =
        document.getElementById(
            "nova_regiao"
        );


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da região."
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

        console.error(error);

        alert(
            "Erro ao cadastrar região."
        );

        return;

    }


    input.value = "";


    await carregarRegioes();

    await popularRegioesSelect();

    await popularRegioesFiltros();

    await carregarDashboard();

}


// ======================================
// ESTADOS
// ======================================

async function carregarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );

    if (!lista) return;


    const filtro =
        document.getElementById(
            "filtro_estado_regiao"
        );


    let consulta =
        supabaseClient
            .from("estados")
            .select(`
                *,
                regioes(nome)
            `)
            .order("nome");


    if (
        filtro &&
        filtro.value
    ) {

        consulta =
            consulta.eq(
                "regiao_id",
                filtro.value
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);

        lista.innerHTML =
            "<p>Erro ao carregar estados.</p>";

        return;

    }


    lista.innerHTML = `
        <div class="tabela-container">

            <table class="tabela-admin">

                <thead>

                    <tr>

                        <th>Estado</th>

                        <th>Região</th>

                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    ${data.map(item => `

                        <tr>

                            <td>
                                ${item.nome}
                            </td>

                            <td>
                                ${item.regioes?.nome || "-"}
                            </td>

                            <td>

                                <button
                                    class="btn-excluir"
                                    onclick="excluirLocalizacao('estados', ${item.id})"
                                >
                                    🗑 Excluir
                                </button>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;

}


// ======================================
// SALVAR ESTADO
// ======================================

async function salvarEstado() {

    const nome =
        document.getElementById(
            "novo_estado"
        ).value.trim();


    const regiao =
        document.getElementById(
            "estado_regiao"
        ).value;


    if (
        !nome ||
        !regiao
    ) {

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

                regiao_id:
                    regiao

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar estado."
        );

        return;

    }


    document.getElementById(
        "novo_estado"
    ).value = "";


    await carregarEstados();

    await popularEstadosFiltros();

    await carregarDashboard();

}


// ======================================
// CIDADES
// ======================================

async function carregarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );

    if (!lista) return;


    const filtro =
        document.getElementById(
            "filtro_cidade_estado"
        );


    let consulta =
        supabaseClient
            .from("cidades")
            .select(`
                *,
                estados(
                    nome,
                    regioes(nome)
                )
            `)
            .order("nome");


    if (
        filtro &&
        filtro.value
    ) {

        consulta =
            consulta.eq(
                "estado_id",
                filtro.value
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);

        lista.innerHTML =
            "<p>Erro ao carregar cidades.</p>";

        return;

    }


    lista.innerHTML = `
        <div class="tabela-container">

            <table class="tabela-admin">

                <thead>

                    <tr>

                        <th>Cidade</th>

                        <th>Estado</th>

                        <th>Região</th>

                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    ${data.map(item => `

                        <tr>

                            <td>
                                ${item.nome}
                            </td>

                            <td>
                                ${item.estados?.nome || "-"}
                            </td>

                            <td>
                                ${item.estados?.regioes?.nome || "-"}
                            </td>

                            <td>

                                <button
                                    class="btn-excluir"
                                    onclick="excluirLocalizacao('cidades', ${item.id})"
                                >
                                    🗑 Excluir
                                </button>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;

}


// ======================================
// SALVAR CIDADE
// ======================================

async function salvarCidade() {

    const nome =
        document.getElementById(
            "nova_cidade"
        ).value.trim();


    const estado =
        document.getElementById(
            "cidade_estado"
        ).value;


    if (
        !nome ||
        !estado
    ) {

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

                estado_id:
                    estado

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar cidade."
        );

        return;

    }


    document.getElementById(
        "nova_cidade"
    ).value = "";


    await carregarCidades();

    await popularCidadesFiltros();

    await carregarDashboard();

}


// ======================================
// BAIRROS
// ======================================

async function carregarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );

    if (!lista) return;


    const filtro =
        document.getElementById(
            "filtro_bairro_cidade"
        );


    let consulta =
        supabaseClient
            .from("bairros")
            .select(`
                *,
                cidades(
                    nome,
                    estados(
                        nome
                    )
                )
            `)
            .order("nome");


    if (
        filtro &&
        filtro.value
    ) {

        consulta =
            consulta.eq(
                "cidade_id",
                filtro.value
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);

        lista.innerHTML =
            "<p>Erro ao carregar bairros.</p>";

        return;

    }


    lista.innerHTML = `
        <div class="tabela-container">

            <table class="tabela-admin">

                <thead>

                    <tr>

                        <th>Bairro</th>

                        <th>Cidade</th>

                        <th>Estado</th>

                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    ${data.map(item => `

                        <tr>

                            <td>
                                ${item.nome}
                            </td>

                            <td>
                                ${item.cidades?.nome || "-"}
                            </td>

                            <td>
                                ${item.cidades?.estados?.nome || "-"}
                            </td>

                            <td>

                                <button
                                    class="btn-excluir"
                                    onclick="excluirLocalizacao('bairros', ${item.id})"
                                >
                                    🗑 Excluir
                                </button>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;

}


// ======================================
// SALVAR BAIRRO
// ======================================

async function salvarBairro() {

    const nome =
        document.getElementById(
            "novo_bairro"
        ).value.trim();


    const cidade =
        document.getElementById(
            "bairro_cidade"
        ).value;


    if (
        !nome ||
        !cidade
    ) {

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

                cidade_id:
                    cidade

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar bairro."
        );

        return;

    }


    document.getElementById(
        "novo_bairro"
    ).value = "";


    await carregarBairros();

    await carregarDashboard();

}


// ======================================
// EXCLUIR LOCALIZAÇÃO
// ======================================

async function excluirLocalizacao(
    tabela,
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir este registro?"
        )
    ) return;


    const { error } =
        await supabaseClient
            .from(tabela)
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir o registro."
        );

        return;

    }


    if (
        tabela === "regioes"
    ) {

        await carregarRegioes();

    }


    if (
        tabela === "estados"
    ) {

        await carregarEstados();

    }


    if (
        tabela === "cidades"
    ) {

        await carregarCidades();

    }


    if (
        tabela === "bairros"
    ) {

        await carregarBairros();

    }


    await carregarDashboard();

}


// ======================================
// CRIAR LISTA LOCALIZAÇÃO
// ======================================

function criarListaLocalizacao(
    dados,
    tabela
) {

    if (!dados || dados.length === 0) {

        return `
            <p>
                Nenhum registro encontrado.
            </p>
        `;

    }


    return `

        <div class="tabela-container">

            <table class="tabela-admin">

                <thead>

                    <tr>

                        <th>Nome</th>

                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    ${dados.map(item => `

                        <tr>

                            <td>

                                ${item.nome}

                            </td>

                            <td>

                                <button
                                    class="btn-excluir"
                                    onclick="excluirLocalizacao('${tabela}s', ${item.id})"
                                >
                                    🗑 Excluir
                                </button>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

    `;

}
