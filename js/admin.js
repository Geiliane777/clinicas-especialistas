// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// REDE ESPECIALISTAS / SINDILEGIS
// ======================================

console.log("admin.js carregado");


// ======================================
// TÍTULOS DAS PÁGINAS
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
// VARIÁVEIS DE EDIÇÃO
// ======================================

let clinicaEditandoId = null;
let regiaoEditandoId = null;
let estadoEditandoId = null;
let cidadeEditandoId = null;
let bairroEditandoId = null;
let especialidadeEditandoId = null;


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log("Inicializando painel administrativo...");

        configurarMenu();

        configurarEventos();

        await carregarDashboard();

        await carregarClinicas();

        await carregarEspecialidades();

        await carregarRegioes();

        await carregarEstados();

        await carregarCidades();

        await carregarBairros();

        await popularSelectsClinica();

        await popularSelectsLocalizacao();

    }
);


// ======================================
// NAVEGAÇÃO
// ======================================

function configurarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");

    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            async () => {

                const pagina =
                    botao.dataset.page;

                mostrarPagina(pagina);

            }
        );

    });

}


async function mostrarPagina(pagina) {

    document
        .querySelectorAll(".page")
        .forEach(item => {

            item.classList.add("hidden");

        });


    const paginaSelecionada =
        document.getElementById(pagina);


    if (paginaSelecionada) {

        paginaSelecionada
            .classList
            .remove("hidden");

    }


    document
        .querySelectorAll(".menu-btn")
        .forEach(botao => {

            botao
                .classList
                .remove("active");

            if (
                botao.dataset.page === pagina
            ) {

                botao
                    .classList
                    .add("active");

            }

        });


    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[pagina]
            || "Painel Administrativo";

    }


    // ==================================
    // CARREGAR DADOS DA PÁGINA
    // ==================================

    if (pagina === "dashboard") {

        await carregarDashboard();

    }


    if (pagina === "clinicas") {

        await carregarClinicas();

        await popularSelectsClinica();

    }


    if (pagina === "especialidades") {

        await carregarEspecialidades();

    }


    if (pagina === "regioes") {

        await carregarRegioes();

    }


    if (pagina === "estados") {

        await carregarEstados();

        await popularRegioesEstado();

    }


    if (pagina === "cidades") {

        await carregarCidades();

        await popularEstadosCidade();

    }


    if (pagina === "bairros") {

        await carregarBairros();

        await popularCidadesBairro();

    }

}


// ======================================
// EVENTOS
// ======================================

function configurarEventos() {

    // ----------------------------------
    // CLÍNICA
    // ----------------------------------

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
        excluirClinica
    );


    adicionarEvento(
        "btnVoltarClinicas",
        () => mostrarPagina("clinicas")
    );


    adicionarEvento(
        "btnAdicionarEspRede",
        adicionarEspecialidadeClinica
    );


    adicionarEvento(
        "filtro_clinica_nome",
        carregarClinicas
    );


    // ----------------------------------
    // CASCATA NOVA CLÍNICA
    // ----------------------------------

    adicionarEvento(
        "clinica_regiao",
        async function () {

            await popularEstadosClinica();

        },
        "change"
    );


    adicionarEvento(
        "clinica_estado",
        async function () {

            await popularCidadesClinica();

        },
        "change"
    );


    adicionarEvento(
        "clinica_cidade",
        async function () {

            await popularBairrosClinica();

        },
        "change"
    );


    // ----------------------------------
    // CASCATA EDITAR CLÍNICA
    // ----------------------------------

    adicionarEvento(
        "edit_clinica_regiao",
        async function () {

            await popularEstadosEditar();

        },
        "change"
    );


    adicionarEvento(
        "edit_clinica_estado",
        async function () {

            await popularCidadesEditar();

        },
        "change"
    );


    adicionarEvento(
        "edit_clinica_cidade",
        async function () {

            await popularBairrosEditar();

        },
        "change"
    );


    // ----------------------------------
    // ESPECIALIDADES
    // ----------------------------------

    adicionarEvento(
        "btnSalvarEspecialidade",
        salvarEspecialidade
    );


    // ----------------------------------
    // REGIÕES
    // ----------------------------------

    adicionarEvento(
        "btnSalvarRegiao",
        salvarRegiao
    );


    // ----------------------------------
    // ESTADOS
    // ----------------------------------

    adicionarEvento(
        "btnSalvarEstado",
        salvarEstado
    );


    adicionarEvento(
        "filtro_estado_regiao",
        carregarEstados,
        "change"
    );


    // ----------------------------------
    // CIDADES
    // ----------------------------------

    adicionarEvento(
        "btnSalvarCidade",
        salvarCidade
    );


    adicionarEvento(
        "filtro_cidade_estado",
        carregarCidades,
        "change"
    );


    // ----------------------------------
    // BAIRROS
    // ----------------------------------

    adicionarEvento(
        "btnSalvarBairro",
        salvarBairro
    );


    adicionarEvento(
        "filtro_bairro_cidade",
        carregarBairros,
        "change"
    );


}


// ======================================
// FUNÇÃO AUXILIAR PARA EVENTOS
// ======================================

function adicionarEvento(
    id,
    funcao,
    evento = "click"
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.addEventListener(
            evento,
            funcao
        );

    }

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    const [
        clinicas,
        especialidades,
        regioes,
        estados,
        cidades,
        bairros
    ] =
        await Promise.all([

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


function atualizarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent = valor;

    }

}


// ======================================
// CLÍNICAS
// ======================================

async function carregarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    lista.innerHTML = `
        <div class="carregando">
            Carregando clínicas...
        </div>
    `;


    const filtro =
        document.getElementById(
            "filtro_clinica_nome"
        )?.value
        || "";


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


    if (filtro) {

        consulta =
            consulta.ilike(
                "nome",
                `%${filtro}%`
            );

    }


    const {
        data,
        error
    } =
        await consulta;


    if (error) {

        console.error(
            "Erro ao carregar clínicas:",
            error
        );

        lista.innerHTML = `
            <div class="lista-vazia">
                Erro ao carregar clínicas.
            </div>
        `;

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="lista-vazia">
                Nenhuma clínica cadastrada.
            </div>
        `;

        return;

    }


    lista.innerHTML = `
        <div class="tabela-container">

            <table class="tabela-admin">

                <thead>

                    <tr>

                        <th>
                            Clínica
                        </th>

                        <th>
                            Localização
                        </th>

                        <th>
                            Telefone
                        </th>

                        <th>
                            Especialidades
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Ações
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${data.map(clinica => {

                        const bairro =
                            clinica.bairros?.nome
                            || "-";


                        const cidade =
                            clinica
                            .bairros
                            ?.cidades
                            ?.nome
                            || "-";


                        const estado =
                            clinica
                            .bairros
                            ?.cidades
                            ?.estados
                            ?.nome
                            || "-";


                        const especialidades =
                            clinica
                            .clinica_especialidades
                            ?.filter(
                                item =>
                                    item.ativo
                            )
                            .map(
                                item =>
                                    item
                                    .especialidades
                                    ?.nome
                            )
                            .filter(Boolean)
                            .join(", ")
                            || "-";


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
                                    ${especialidades}
                                </td>


                                <td>

                                    <span
                                        class="
                                            badge
                                            ${
                                                clinica.ativo
                                                ? "badge-ativo"
                                                : "badge-inativo"
                                            }
                                        "
                                    >

                                        ${
                                            clinica.ativo
                                            ? "Ativa"
                                            : "Inativa"
                                        }

                                    </span>

                                </td>


                                <td>

                                    <div
                                        class="acoes-lista"
                                    >

                                        <button
                                            class="btn-editar"
                                            onclick="
                                                editarClinica(
                                                    ${clinica.id}
                                                )
                                            "
                                        >
                                            ✏️ Editar
                                        </button>


                                        <button
                                            class="
                                                ${
                                                    clinica.ativo
                                                    ? "orange"
                                                    : "green"
                                                }
                                            "
                                            onclick="
                                                toggleStatusClinica(
                                                    ${clinica.id},
                                                    ${clinica.ativo}
                                                )
                                            "
                                        >

                                            ${
                                                clinica.ativo
                                                ? "Desativar"
                                                : "Ativar"
                                            }

                                        </button>


                                        <button
                                            class="btn-excluir"
                                            onclick="
                                                excluirClinicaDireto(
                                                    ${clinica.id}
                                                )
                                            "
                                        >
                                            🗑
                                        </button>

                                    </div>

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
// SALVAR CLÍNICA
// ======================================

async function salvarClinica() {

    const nome =
        document
            .getElementById(
                "clinica_nome"
            )
            .value
            .trim();


    const telefone =
        document
            .getElementById(
                "clinica_telefone"
            )
            .value
            .trim();


    const endereco =
        document
            .getElementById(
                "clinica_endereco"
            )
            .value
            .trim();


    const bairroId =
        document
            .getElementById(
                "clinica_bairro"
            )
            .value;


    const especialidadeId =
        document
            .getElementById(
                "clinica_especialidade"
            )
            .value;


    const rede =
        document
            .getElementById(
                "clinica_rede"
            )
            .value;


    if (
        !nome ||
        !endereco ||
        !bairroId ||
        !especialidadeId
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }


    const {
        data: clinica,
        error
    } =
        await supabaseClient
            .from("clinicas")
            .insert({

                nome,
                telefone,
                endereco,

                bairro_id:
                    Number(bairroId),

                ativo: true

            })
            .select()
            .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar clínica."
        );

        return;

    }


    const {
        error: erroEspecialidade
    } =
        await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .insert({

                clinica_id:
                    clinica.id,

                especialidade_id:
                    Number(
                        especialidadeId
                    ),

                rede,

                ativo: true

            });


    if (erroEspecialidade) {

        console.error(
            erroEspecialidade
        );

        alert(
            "Clínica cadastrada, mas ocorreu erro ao vincular especialidade."
        );

    } else {

        alert(
            "Clínica cadastrada com sucesso!"
        );

    }


    limparFormularioClinica();

    await carregarClinicas();

    await carregarDashboard();

}


// ======================================
// LIMPAR FORMULÁRIO CLÍNICA
// ======================================

function limparFormularioClinica() {

    const campos = [

        "clinica_nome",
        "clinica_telefone",
        "clinica_endereco"

    ];


    campos.forEach(id => {

        const campo =
            document.getElementById(id);

        if (campo) {

            campo.value = "";

        }

    });


    [
        "clinica_regiao",
        "clinica_estado",
        "clinica_cidade",
        "clinica_bairro",
        "clinica_especialidade"
    ]
    .forEach(id => {

        const select =
            document.getElementById(id);

        if (select) {

            select.value = "";

        }

    });

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id) {

    clinicaEditandoId = id;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("clinicas")
            .select(`
                *,
                bairros(
                    *,
                    cidades(
                        *,
                        estados(
                            *,
                            regioes(*)
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


    document
        .getElementById(
            "edit_clinica_id"
        )
        .value = data.id;


    document
        .getElementById(
            "edit_clinica_nome"
        )
        .value = data.nome || "";


    document
        .getElementById(
            "edit_clinica_telefone"
        )
        .value = data.telefone || "";


    document
        .getElementById(
            "edit_clinica_endereco"
        )
        .value = data.endereco || "";


    const bairro =
        data.bairros;


    const cidade =
        bairro?.cidades;


    const estado =
        cidade?.estados;


    const regiao =
        estado?.regioes;


    await popularRegioesEditar();


    if (regiao) {

        document
            .getElementById(
                "edit_clinica_regiao"
            )
            .value = regiao.id;

    }


    await popularEstadosEditar();


    if (estado) {

        document
            .getElementById(
                "edit_clinica_estado"
            )
            .value = estado.id;

    }


    await popularCidadesEditar();


    if (cidade) {

        document
            .getElementById(
                "edit_clinica_cidade"
            )
            .value = cidade.id;

    }


    await popularBairrosEditar();


    if (bairro) {

        document
            .getElementById(
                "edit_clinica_bairro"
            )
            .value = bairro.id;

    }


    atualizarStatusVisualClinica(
        data.ativo
    );


    await carregarEspecialidadesClinica(
        id
    );


    await popularEspecialidadesEditar();


    mostrarPagina("editarClinica");

}


// ======================================
// ATUALIZAR CLÍNICA
// ======================================

async function atualizarClinica() {

    const id =
        document
            .getElementById(
                "edit_clinica_id"
            )
            .value;


    const nome =
        document
            .getElementById(
                "edit_clinica_nome"
            )
            .value
            .trim();


    const telefone =
        document
            .getElementById(
                "edit_clinica_telefone"
            )
            .value
            .trim();


    const endereco =
        document
            .getElementById(
                "edit_clinica_endereco"
            )
            .value
            .trim();


    const bairroId =
        document
            .getElementById(
                "edit_clinica_bairro"
            )
            .value;


    if (
        !id ||
        !nome ||
        !endereco ||
        !bairroId
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("clinicas")
            .update({

                nome,
                telefone,
                endereco,

                bairro_id:
                    Number(bairroId)

            })
            .eq(
                "id",
                id
            );


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


// ======================================
// ATIVAR / DESATIVAR CLÍNICA
// ======================================

async function toggleStatusClinica(
    id,
    statusAtual
) {

    const novoStatus =
        !statusAtual;


    const mensagem =
        novoStatus
        ? "Deseja ativar esta clínica?"
        : "Deseja desativar esta clínica?";


    if (!confirm(mensagem)) {

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("clinicas")
            .update({

                ativo:
                    novoStatus

            })
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "Erro ao alterar status."
        );

        return;

    }


    await carregarClinicas();


    if (
        Number(clinicaEditandoId)
        === Number(id)
    ) {

        atualizarStatusVisualClinica(
            novoStatus
        );

    }

}


// ======================================
// STATUS VISUAL
// ======================================

function atualizarStatusVisualClinica(
    ativo
) {

    const status =
        document.getElementById(
            "statusClinica"
        );


    const botao =
        document.getElementById(
            "btnToggleStatusClinica"
        );


    if (status) {

        status.textContent =
            ativo
            ? "Clínica Ativa"
            : "Clínica Inativa";


        status.className =
            ativo
            ? "status ativo"
            : "status inativo";

    }


    if (botao) {

        botao.textContent =
            ativo
            ? "⏸ Desativar Clínica"
            : "▶ Ativar Clínica";


        botao.onclick =
            () =>
                toggleStatusClinica(
                    clinicaEditandoId,
                    ativo
                );

    }

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinicaDireto(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta clínica?"
        )
    ) {

        return;

    }


    const {
        error
    } =
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


async function excluirClinica() {

    const id =
        document
            .getElementById(
                "edit_clinica_id"
            )
            .value;


    if (!id) return;


    await excluirClinicaDireto(id);


    mostrarPagina("clinicas");

}


// ======================================
// ESPECIALIDADES DA CLÍNICA
// ======================================

async function carregarEspecialidadesClinica(
    clinicaId
) {

    const lista =
        document.getElementById(
            "listaEspRede"
        );


    if (!lista) return;


    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "clinica_especialidades"
            )
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
            );


    if (error) {

        console.error(error);

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="lista-vazia">
                Nenhuma especialidade vinculada.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(item => `

            <div class="item-vinculo">

                <div class="item-vinculo-info">

                    <strong>
                        ${
                            item.especialidades
                            ?.nome
                            || "-"
                        }
                    </strong>

                    <span>
                        Rede:
                        ${item.rede}
                    </span>

                </div>


                <button
                    class="btn-remover"
                    onclick="
                        removerEspecialidadeClinica(
                            ${item.id}
                        )
                    "
                >
                    Remover
                </button>

            </div>

        `)
        .join("");

}


// ======================================
// ADICIONAR ESPECIALIDADE À CLÍNICA
// ======================================

async function adicionarEspecialidadeClinica() {

    const especialidadeId =
        document
            .getElementById(
                "edit_especialidade"
            )
            .value;


    const rede =
        document
            .getElementById(
                "edit_rede"
            )
            .value;


    if (
        !clinicaEditandoId ||
        !especialidadeId ||
        !rede
    ) {

        alert(
            "Selecione uma especialidade e rede."
        );

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .insert({

                clinica_id:
                    Number(
                        clinicaEditandoId
                    ),

                especialidade_id:
                    Number(
                        especialidadeId
                    ),

                rede,

                ativo: true

            });


    if (error) {

        console.error(error);

        alert(
            "Esta especialidade já está vinculada a esta rede."
        );

        return;

    }


    document
        .getElementById(
            "edit_especialidade"
        )
        .value = "";


    await carregarEspecialidadesClinica(
        clinicaEditandoId
    );


    await carregarClinicas();

}


// ======================================
// REMOVER ESPECIALIDADE DA CLÍNICA
// ======================================

async function removerEspecialidadeClinica(
    id
) {

    if (
        !confirm(
            "Deseja remover esta especialidade?"
        )
    ) {

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from(
                "clinica_especialidades"
            )
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
        clinicaEditandoId
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


    const {
        data,
        error
    } =
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
            <div class="lista-vazia">
                Nenhuma especialidade cadastrada.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(item => `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>
                        ${item.nome}
                    </strong>

                </div>


                <div class="acoes-lista">

                    <button
                        class="btn-editar"
                        onclick="
                            editarEspecialidade(
                                ${item.id}
                            )
                        "
                    >
                        ✏️ Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="
                            excluirEspecialidade(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");

}


// ======================================
// SALVAR ESPECIALIDADE
// ======================================

async function salvarEspecialidade() {

    const campo =
        document.getElementById(
            "nova_especialidade"
        );


    const nome =
        campo.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

        return;

    }


    // ==================================
    // EDITANDO
    // ==================================

    if (especialidadeEditandoId) {

        const {
            error
        } =
            await supabaseClient
                .from("especialidades")
                .update({

                    nome

                })
                .eq(
                    "id",
                    especialidadeEditandoId
                );


        if (error) {

            console.error(error);

            alert(
                "Erro ao atualizar especialidade."
            );

            return;

        }


        alert(
            "Especialidade atualizada!"
        );


        especialidadeEditandoId = null;

        campo.value = "";


        const botao =
            document.getElementById(
                "btnSalvarEspecialidade"
            );


        if (botao) {

            botao.innerHTML =
                "💾 Salvar Especialidade";

        }


        await carregarEspecialidades();

        await popularSelectsClinica();

        return;

    }


    // ==================================
    // NOVA
    // ==================================

    const {
        error
    } =
        await supabaseClient
            .from("especialidades")
            .insert({

                nome

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar especialidade."
        );

        return;

    }


    campo.value = "";


    alert(
        "Especialidade cadastrada!"
    );


    await carregarEspecialidades();

    await popularSelectsClinica();

    await carregarDashboard();

}


// ======================================
// EDITAR ESPECIALIDADE
// ======================================

async function editarEspecialidade(id) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;

    }


    especialidadeEditandoId = id;


    document
        .getElementById(
            "nova_especialidade"
        )
        .value = data.nome;


    const botao =
        document.getElementById(
            "btnSalvarEspecialidade"
        );


    if (botao) {

        botao.innerHTML =
            "💾 Atualizar Especialidade";

    }


    document
        .getElementById(
            "nova_especialidade"
        )
        .focus();

}


// ======================================
// EXCLUIR ESPECIALIDADE
// ======================================

async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) {

        return;

    }


    const {
        error
    } =
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


    await carregarEspecialidades();

    await popularSelectsClinica();

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


    const {
        data,
        error
    } =
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
            <div class="lista-vazia">
                Nenhuma região cadastrada.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(item => `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>
                        ${item.nome}
                    </strong>

                </div>


                <div class="acoes-lista">

                    <button
                        class="btn-editar"
                        onclick="
                            editarRegiao(
                                ${item.id}
                            )
                        "
                    >
                        ✏️ Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="
                            excluirRegiao(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");

}


// ======================================
// SALVAR REGIÃO
// ======================================

async function salvarRegiao() {

    const campo =
        document.getElementById(
            "nova_regiao"
        );


    const nome =
        campo.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da região."
        );

        return;

    }


    if (regiaoEditandoId) {

        const {
            error
        } =
            await supabaseClient
                .from("regioes")
                .update({

                    nome

                })
                .eq(
                    "id",
                    regiaoEditandoId
                );


        if (error) {

            alert(
                "Erro ao atualizar região."
            );

            return;

        }


        regiaoEditandoId = null;

        campo.value = "";


        document
            .getElementById(
                "btnSalvarRegiao"
            )
            .innerHTML =
            "💾 Salvar Região";


        await carregarRegioes();

        return;

    }


    const {
        error
    } =
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


    campo.value = "";


    await carregarRegioes();

    await carregarDashboard();

}


// ======================================
// EDITAR REGIÃO
// ======================================

async function editarRegiao(id) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .eq("id", id)
            .single();


    if (error) return;


    regiaoEditandoId = id;


    document
        .getElementById(
            "nova_regiao"
        )
        .value = data.nome;


    document
        .getElementById(
            "btnSalvarRegiao"
        )
        .innerHTML =
        "💾 Atualizar Região";


    document
        .getElementById(
            "nova_regiao"
        )
        .focus();

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

    if (
        !confirm(
            "Excluir esta região? Estados, cidades e bairros vinculados também poderão ser excluídos."
        )
    ) return;


    const {
        error
    } =
        await supabaseClient
            .from("regioes")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Erro ao excluir região."
        );

        return;

    }


    await carregarRegioes();

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
        )?.value;


    let consulta =
        supabaseClient
            .from("estados")
            .select(`
                *,
                regioes(nome)
            `)
            .order("nome");


    if (filtro) {

        consulta =
            consulta.eq(
                "regiao_id",
                filtro
            );

    }


    const {
        data,
        error
    } =
        await consulta;


    if (error) {

        console.error(error);

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="lista-vazia">
                Nenhum estado cadastrado.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(item => `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>
                        ${item.nome}
                    </strong>

                    <span>
                        Região:
                        ${item.regioes?.nome || "-"}
                    </span>

                </div>


                <div class="acoes-lista">

                    <button
                        class="btn-editar"
                        onclick="
                            editarEstado(
                                ${item.id}
                            )
                        "
                    >
                        ✏️ Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="
                            excluirEstado(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");

}


// ======================================
// SALVAR ESTADO
// ======================================

async function salvarEstado() {

    const nome =
        document
            .getElementById(
                "novo_estado"
            )
            .value
            .trim();


    const regiaoId =
        document
            .getElementById(
                "estado_regiao"
            )
            .value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    if (estadoEditandoId) {

        const {
            error
        } =
            await supabaseClient
                .from("estados")
                .update({

                    nome,

                    regiao_id:
                        Number(regiaoId)

                })
                .eq(
                    "id",
                    estadoEditandoId
                );


        if (error) {

            alert(
                "Erro ao atualizar estado."
            );

            return;

        }


        estadoEditandoId = null;


        document
            .getElementById(
                "novo_estado"
            )
            .value = "";


        document
            .getElementById(
                "btnSalvarEstado"
            )
            .innerHTML =
            "💾 Salvar Estado";


        await carregarEstados();

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("estados")
            .insert({

                nome,

                regiao_id:
                    Number(regiaoId)

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar estado."
        );

        return;

    }


    document
        .getElementById(
            "novo_estado"
        )
        .value = "";


    await carregarEstados();

    await carregarDashboard();

}


// ======================================
// EDITAR ESTADO
// ======================================

async function editarEstado(id) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("id", id)
            .single();


    if (error) return;


    estadoEditandoId = id;


    await popularRegioesEstado();


    document
        .getElementById(
            "novo_estado"
        )
        .value = data.nome;


    document
        .getElementById(
            "estado_regiao"
        )
        .value = data.regiao_id;


    document
        .getElementById(
            "btnSalvarEstado"
        )
        .innerHTML =
        "💾 Atualizar Estado";


}


// ======================================
// EXCLUIR ESTADO
// ======================================

async function excluirEstado(id) {

    if (
        !confirm(
            "Deseja excluir este estado?"
        )
    ) return;


    const {
        error
    } =
        await supabaseClient
            .from("estados")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Erro ao excluir estado."
        );

        return;

    }


    await carregarEstados();

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
        )?.value;


    let consulta =
        supabaseClient
            .from("cidades")
            .select(`
                *,
                estados(
                    nome
                )
            `)
            .order("nome");


    if (filtro) {

        consulta =
            consulta.eq(
                "estado_id",
                filtro
            );

    }


    const {
        data,
        error
    } =
        await consulta;


    if (error) {

        console.error(error);

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="lista-vazia">
                Nenhuma cidade cadastrada.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(item => `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>
                        ${item.nome}
                    </strong>

                    <span>
                        Estado:
                        ${item.estados?.nome || "-"}
                    </span>

                </div>


                <div class="acoes-lista">

                    <button
                        class="btn-editar"
                        onclick="
                            editarCidade(
                                ${item.id}
                            )
                        "
                    >
                        ✏️ Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="
                            excluirCidade(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");

}


// ======================================
// SALVAR CIDADE
// ======================================

async function salvarCidade() {

    const nome =
        document
            .getElementById(
                "nova_cidade"
            )
            .value
            .trim();


    const estadoId =
        document
            .getElementById(
                "cidade_estado"
            )
            .value;


    if (!nome || !estadoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    if (cidadeEditandoId) {

        const {
            error
        } =
            await supabaseClient
                .from("cidades")
                .update({

                    nome,

                    estado_id:
                        Number(estadoId)

                })
                .eq(
                    "id",
                    cidadeEditandoId
                );


        if (error) {

            alert(
                "Erro ao atualizar cidade."
            );

            return;

        }


        cidadeEditandoId = null;


        document
            .getElementById(
                "nova_cidade"
            )
            .value = "";


        document
            .getElementById(
                "btnSalvarCidade"
            )
            .innerHTML =
            "💾 Salvar Cidade";


        await carregarCidades();

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("cidades")
            .insert({

                nome,

                estado_id:
                    Number(estadoId)

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar cidade."
        );

        return;

    }


    document
        .getElementById(
            "nova_cidade"
        )
        .value = "";


    await carregarCidades();

    await carregarDashboard();

}


// ======================================
// EDITAR CIDADE
// ======================================

async function editarCidade(id) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("id", id)
            .single();


    if (error) return;


    cidadeEditandoId = id;


    await popularEstadosCidade();


    document
        .getElementById(
            "nova_cidade"
        )
        .value = data.nome;


    document
        .getElementById(
            "cidade_estado"
        )
        .value = data.estado_id;


    document
        .getElementById(
            "btnSalvarCidade"
        )
        .innerHTML =
        "💾 Atualizar Cidade";

}


// ======================================
// EXCLUIR CIDADE
// ======================================

async function excluirCidade(id) {

    if (
        !confirm(
            "Deseja excluir esta cidade?"
        )
    ) return;


    const {
        error
    } =
        await supabaseClient
            .from("cidades")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Erro ao excluir cidade."
        );

        return;

    }


    await carregarCidades();

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
        )?.value;


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


    if (filtro) {

        consulta =
            consulta.eq(
                "cidade_id",
                filtro
            );

    }


    const {
        data,
        error
    } =
        await consulta;


    if (error) {

        console.error(error);

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="lista-vazia">
                Nenhum bairro cadastrado.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        data.map(item => `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>
                        ${item.nome}
                    </strong>

                    <span>
                        ${item.cidades?.nome || "-"}

                        -
                        
                        ${
                            item
                            .cidades
                            ?.estados
                            ?.nome
                            || "-"
                        }

                    </span>

                </div>


                <div class="acoes-lista">

                    <button
                        class="btn-editar"
                        onclick="
                            editarBairro(
                                ${item.id}
                            )
                        "
                    >
                        ✏️ Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="
                            excluirBairro(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");

}


// ======================================
// SALVAR BAIRRO
// ======================================

async function salvarBairro() {

    const nome =
        document
            .getElementById(
                "novo_bairro"
            )
            .value
            .trim();


    const cidadeId =
        document
            .getElementById(
                "bairro_cidade"
            )
            .value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    if (bairroEditandoId) {

        const {
            error
        } =
            await supabaseClient
                .from("bairros")
                .update({

                    nome,

                    cidade_id:
                        Number(cidadeId)

                })
                .eq(
                    "id",
                    bairroEditandoId
                );


        if (error) {

            alert(
                "Erro ao atualizar bairro."
            );

            return;

        }


        bairroEditandoId = null;


        document
            .getElementById(
                "novo_bairro"
            )
            .value = "";


        document
            .getElementById(
                "btnSalvarBairro"
            )
            .innerHTML =
            "💾 Salvar Bairro";


        await carregarBairros();

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("bairros")
            .insert({

                nome,

                cidade_id:
                    Number(cidadeId)

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar bairro."
        );

        return;

    }


    document
        .getElementById(
            "novo_bairro"
        )
        .value = "";


    await carregarBairros();

    await carregarDashboard();

}


// ======================================
// EDITAR BAIRRO
// ======================================

async function editarBairro(id) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("id", id)
            .single();


    if (error) return;


    bairroEditandoId = id;


    await popularCidadesBairro();


    document
        .getElementById(
            "novo_bairro"
        )
        .value = data.nome;


    document
        .getElementById(
            "bairro_cidade"
        )
        .value = data.cidade_id;


    document
        .getElementById(
            "btnSalvarBairro"
        )
        .innerHTML =
        "💾 Atualizar Bairro";

}


// ======================================
// EXCLUIR BAIRRO
// ======================================

async function excluirBairro(id) {

    if (
        !confirm(
            "Deseja excluir este bairro?"
        )
    ) return;


    const {
        error
    } =
        await supabaseClient
            .from("bairros")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Não foi possível excluir este bairro. Verifique se existem clínicas vinculadas."
        );

        return;

    }


    await carregarBairros();

    await carregarDashboard();

}


// ======================================
// FUNÇÃO AUXILIAR
// PREENCHER SELECT
// ======================================

function preencherSelect(
    id,
    dados,
    textoPadrao
) {

    const select =
        document.getElementById(id);


    if (!select) return;


    select.innerHTML = `
        <option value="">
            ${textoPadrao}
        </option>
    `;


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
// SELECTS CLÍNICA
// ======================================

async function popularSelectsClinica() {

    await popularRegioesClinica();

    await popularEspecialidadesClinica();

}


// ======================================
// REGIÕES - NOVA CLÍNICA
// ======================================

async function popularRegioesClinica() {

    const {
        data
    } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    preencherSelect(
        "clinica_regiao",
        data,
        "Selecione Região"
    );

}


// ======================================
// ESTADOS - NOVA CLÍNICA
// ======================================

async function popularEstadosClinica() {

    const regiao =
        document
            .getElementById(
                "clinica_regiao"
            )
            .value;


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


    const {
        data
    } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiao
            )
            .order("nome");


    preencherSelect(
        "clinica_estado",
        data,
        "Selecione Estado"
    );

}


// ======================================
// CIDADES - NOVA CLÍNICA
// ======================================

async function popularCidadesClinica() {

    const estado =
        document
            .getElementById(
                "clinica_estado"
            )
            .value;


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


    const {
        data
    } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estado
            )
            .order("nome");


    preencherSelect(
        "clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


// ======================================
// BAIRROS - NOVA CLÍNICA
// ======================================

async function popularBairrosClinica() {

    const cidade =
        document
            .getElementById(
                "clinica_cidade"
            )
            .value;


    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!cidade) return;


    const {
        data
    } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidade
            )
            .order("nome");


    preencherSelect(
        "clinica_bairro",
        data,
        "Selecione Bairro"
    );

}


// ======================================
// ESPECIALIDADES - CLÍNICA
// ======================================

async function popularEspecialidadesClinica() {

    const {
        data
    } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    preencherSelect(
        "clinica_especialidade",
        data,
        "Selecione Especialidade"
    );

}


// ======================================
// SELECTS EDITAR CLÍNICA
// ======================================

async function popularRegioesEditar() {

    const {
        data
    } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    preencherSelect(
        "edit_clinica_regiao",
        data,
        "Selecione Região"
    );

}


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


    const {
        data
    } =
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


    const {
        data
    } =
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


// ======================================
// BAIRROS EDITAR
// ======================================

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


    const {
        data
    } =
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
// ESPECIALIDADES EDITAR
// ======================================

async function popularEspecialidadesEditar() {

    const {
        data
    } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    preencherSelect(
        "edit_especialidade",
        data,
        "Selecione Especialidade"
    );

}


// ======================================
// SELECTS ADMINISTRATIVOS
// ======================================

async function popularSelectsLocalizacao() {

    await popularRegioesEstado();

    await popularEstadosCidade();

    await popularCidadesBairro();

}


// ======================================
// REGIÕES PARA ESTADO
// ======================================

async function popularRegioesEstado() {

    const {
        data
    } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    preencherSelect(
        "estado_regiao",
        data,
        "Selecione Região"
    );


    preencherSelect(
        "filtro_estado_regiao",
        data,
        "Todas as Regiões"
    );

}


// ======================================
// ESTADOS PARA CIDADE
// ======================================

async function popularEstadosCidade() {

    const {
        data
    } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    preencherSelect(
        "cidade_estado",
        data,
        "Selecione Estado"
    );


    preencherSelect(
        "filtro_cidade_estado",
        data,
        "Todos os Estados"
    );

}


// ======================================
// CIDADES PARA BAIRRO
// ======================================

async function popularCidadesBairro() {

    const {
        data
    } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    preencherSelect(
        "bairro_cidade",
        data,
        "Selecione Cidade"
    );


    preencherSelect(
        "filtro_bairro_cidade",
        data,
        "Todas as Cidades"
    );

}
