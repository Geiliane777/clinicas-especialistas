// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
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

    // Aguarda o login.js liberar o painel
    verificarPainel();

});


// ======================================
// VERIFICAR PAINEL
// ======================================

function verificarPainel() {

    const painel =
        document.getElementById("painel");

    if (!painel) {
        console.warn("Elemento #painel não encontrado.");
        return;
    }

    // Se o painel estiver visível,
    // carrega o dashboard
    setTimeout(() => {

        if (
            !painel.classList.contains("hidden")
        ) {
            carregarDashboard();
        }

    }, 300);

}


// ======================================
// EVENTOS
// ======================================

function iniciarEventos() {

    // ==================================
    // ESPECIALIDADES
    // ==================================

    document
        .getElementById("btnSalvarEspecialidade")
        ?.addEventListener(
            "click",
            salvarEspecialidade
        );


    // ==================================
    // REGIÕES
    // ==================================

    document
        .getElementById("btnSalvarRegiao")
        ?.addEventListener(
            "click",
            salvarRegiao
        );


    // ==================================
    // ESTADOS
    // ==================================

    document
        .getElementById("btnSalvarEstado")
        ?.addEventListener(
            "click",
            salvarEstado
        );


    // ==================================
    // CIDADES
    // ==================================

    document
        .getElementById("btnSalvarCidade")
        ?.addEventListener(
            "click",
            salvarCidade
        );


    // ==================================
    // BAIRROS
    // ==================================

    document
        .getElementById("btnSalvarBairro")
        ?.addEventListener(
            "click",
            salvarBairro
        );


    // ==================================
    // MODAL CLÍNICA
    // ==================================

    document
        .getElementById("btnNovaClinica")
        ?.addEventListener(
            "click",
            abrirModalClinica
        );


    document
        .getElementById("btnFecharModal")
        ?.addEventListener(
            "click",
            fecharModalClinica
        );


    document
        .getElementById("btnCancelarModal")
        ?.addEventListener(
            "click",
            fecharModalClinica
        );


    // ==================================
    // FORMULÁRIO CLÍNICA
    // ==================================

    document
        .getElementById("formClinica")
        ?.addEventListener(
            "submit",
            salvarClinica
        );


    // ==================================
    // ADICIONAR ESPECIALIDADE
    // ==================================

    document
        .getElementById("btnAdicionarEspecialidade")
        ?.addEventListener(
            "click",
            () => adicionarLinhaEspecialidade()
        );


    // ==================================
    // BUSCA CLÍNICAS
    // ==================================

    document
        .getElementById("buscarClinica")
        ?.addEventListener(
            "input",
            listarClinicas
        );


    document
        .getElementById("filtroStatusClinica")
        ?.addEventListener(
            "change",
            listarClinicas
        );


    // ==================================
    // LOCALIZAÇÃO CLÍNICA
    // ==================================

    document
        .getElementById("clinicaRegiao")
        ?.addEventListener(
            "change",
            carregarEstadosClinica
        );


    document
        .getElementById("clinicaEstado")
        ?.addEventListener(
            "change",
            carregarCidadesClinica
        );


    document
        .getElementById("clinicaCidade")
        ?.addEventListener(
            "change",
            carregarBairrosClinica
        );


}


// ======================================
// MENU
// ======================================

function iniciarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");


    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const pagina =
                    botao.dataset.page;

                if (!pagina) return;

                mostrarPagina(pagina);

            }
        );

    });

}


// ======================================
// MOSTRAR PÁGINA
// ======================================

function mostrarPagina(pagina) {

    const paginaSelecionada =
        document.getElementById(pagina);

    if (!paginaSelecionada) {

        console.error(
            `Página "${pagina}" não encontrada no HTML.`
        );

        return;

    }


    // Esconde todas

    document
        .querySelectorAll(".page")
        .forEach(item => {

            item.classList.add("hidden");

        });


    // Mostra selecionada

    paginaSelecionada
        .classList
        .remove("hidden");


    // Remove active

    document
        .querySelectorAll(".menu-btn")
        .forEach(item => {

            item.classList.remove("active");

        });


    // Ativa botão

    document
        .querySelector(
            `[data-page="${pagina}"]`
        )
        ?.classList.add("active");


    // Altera título

    const titulo =
        document.getElementById("tituloPagina");

    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[pagina] || "Painel";

    }


    // ==================================
    // CARREGADORES
    // ==================================

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


// ======================================
// FUNÇÃO AUXILIAR CONTAGEM
// ======================================

async function contarRegistros(tabela, filtro = null) {

    let consulta =
        supabaseClient
            .from(tabela)
            .select("*", {
                count: "exact",
                head: true
            });


    if (filtro) {

        consulta =
            consulta.eq(
                filtro.coluna,
                filtro.valor
            );

    }


    const { count, error } =
        await consulta;


    if (error) {

        console.error(
            `Erro ao contar ${tabela}:`,
            error
        );

        return 0;

    }


    return count || 0;

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        const [
            totalClinicas,
            clinicasAtivas,
            totalEspecialidades,
            totalRegioes,
            totalEstados,
            totalCidades,
            totalBairros
        ] = await Promise.all([

            contarRegistros("clinicas"),

            contarRegistros(
                "clinicas",
                {
                    coluna: "ativo",
                    valor: true
                }
            ),

            contarRegistros("especialidades"),

            contarRegistros("regioes"),

            contarRegistros("estados"),

            contarRegistros("cidades"),

            contarRegistros("bairros")

        ]);


        atualizarNumero(
            "totalClinicas",
            totalClinicas
        );

        atualizarNumero(
            "totalClinicasAtivas",
            clinicasAtivas
        );

        atualizarNumero(
            "totalEspecialidades",
            totalEspecialidades
        );

        atualizarNumero(
            "totalRegioes",
            totalRegioes
        );

        atualizarNumero(
            "totalEstados",
            totalEstados
        );

        atualizarNumero(
            "totalCidades",
            totalCidades
        );

        atualizarNumero(
            "totalBairros",
            totalBairros
        );


    } catch (error) {

        console.error(
            "Erro ao carregar dashboard:",
            error
        );

    }

}


// ======================================
// ATUALIZAR NÚMERO
// ======================================

function atualizarNumero(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent = valor;

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


    if (!data || !data.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma especialidade cadastrada.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        const nomeSeguro =
            escaparTexto(item.nome);


        lista.innerHTML += `

            <div class="item-gerenciamento">

                <strong>
                    ${nomeSeguro}
                </strong>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEspecialidade(${item.id})"
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


// ======================================
// SALVAR ESPECIALIDADE
// ======================================

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


    const nome =
        input.value.trim();

    const id =
        editId.value;


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

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


// ======================================
// EDITAR ESPECIALIDADE
// ======================================

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


    document.getElementById(
        "especialidadeEditId"
    ).value = data.id;


    document.getElementById(
        "nomeEspecialidade"
    ).value = data.nome;

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
            "Não foi possível excluir esta especialidade."
        );

        return;

    }


    await listarEspecialidades();
    await carregarDashboard();

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
        document.getElementById(
            "listaRegioes"
        );

    if (!lista) return;


    lista.innerHTML = "";


    if (!data || !data.length) {

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

                <strong>
                    ${escaparTexto(item.nome)}
                </strong>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarRegiao(${item.id})"
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


// ======================================
// SALVAR REGIÃO
// ======================================

async function salvarRegiao() {

    const input =
        document.getElementById("nomeRegiao");

    const editId =
        document.getElementById("regiaoEditId");


    if (!input || !editId) return;


    const nome =
        input.value.trim();

    const id =
        editId.value;


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


    await listarRegioes();
    await carregarDashboard();

}


// ======================================
// EDITAR REGIÃO
// ======================================

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


    document.getElementById(
        "regiaoEditId"
    ).value = data.id;


    document.getElementById(
        "nomeRegiao"
    ).value = data.nome;

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

    if (
        !confirm(
            "Deseja excluir esta região? Isso poderá excluir estados, cidades e bairros relacionados."
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("regioes")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir região."
        );

        return;

    }


    await listarRegioes();
    await carregarDashboard();

}


// ======================================
// SELECT REGIÕES
// ======================================

async function carregarRegioesSelect() {

    const select =
        document.getElementById(
            "estadoRegiao"
        );

    if (!select) return;


    const valorAtual =
        select.value;


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
        `<option value="">Selecione uma região</option>`;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });


    if (valorAtual) {

        select.value = valorAtual;

    }

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
        document.getElementById(
            "listaEstados"
        );

    if (!lista) return;


    lista.innerHTML = "";


    if (!data || !data.length) {

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

                    <strong>
                        ${escaparTexto(item.nome)}
                    </strong>

                    <div class="item-subtitulo">
                        Região: ${escaparTexto(item.regioes?.nome || "-")}
                    </div>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEstado(${item.id})"
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


// ======================================
// SALVAR ESTADO
// ======================================

async function salvarEstado() {

    const nome =
        document
            .getElementById("nomeEstado")
            ?.value
            .trim();

    const regiaoId =
        document.getElementById(
            "estadoRegiao"
        )?.value;

    const id =
        document.getElementById(
            "estadoEditId"
        )?.value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha todos os campos."
        );

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


    await listarEstados();
    await carregarDashboard();

}


// ======================================
// EDITAR ESTADO
// ======================================

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


    await carregarRegioesSelect();


    document.getElementById(
        "estadoEditId"
    ).value = data.id;

    document.getElementById(
        "nomeEstado"
    ).value = data.nome;

    document.getElementById(
        "estadoRegiao"
    ).value = data.regiao_id;

}


// ======================================
// EXCLUIR ESTADO
// ======================================

async function excluirEstado(id) {

    if (
        !confirm(
            "Deseja excluir este estado? As cidades e bairros relacionados também poderão ser excluídos."
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("estados")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir estado."
        );

        return;

    }


    await listarEstados();
    await carregarDashboard();

}


// ======================================
// SELECT ESTADOS
// ======================================

async function carregarEstadosSelect() {

    const select =
        document.getElementById(
            "cidadeEstado"
        );

    if (!select) return;


    const valorAtual =
        select.value;


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


    select.innerHTML =
        `<option value="">Selecione um estado</option>`;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });


    if (valorAtual) {

        select.value = valorAtual;

    }

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


    const lista =
        document.getElementById(
            "listaCidades"
        );

    if (!lista) return;


    lista.innerHTML = "";


    if (!data || !data.length) {

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

                    <strong>
                        ${escaparTexto(item.nome)}
                    </strong>

                    <div class="item-subtitulo">

                        ${escaparTexto(item.estados?.nome || "-")}

                        - Região:

                        ${escaparTexto(
                            item.estados?.regioes?.nome || "-"
                        )}

                    </div>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarCidade(${item.id})"
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


// ======================================
// SALVAR CIDADE
// ======================================

async function salvarCidade() {

    const nome =
        document
            .getElementById("nomeCidade")
            ?.value
            .trim();

    const estadoId =
        document.getElementById(
            "cidadeEstado"
        )?.value;

    const id =
        document.getElementById(
            "cidadeEditId"
        )?.value;


    if (!nome || !estadoId) {

        alert(
            "Preencha todos os campos."
        );

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


    await listarCidades();
    await carregarDashboard();

}


// ======================================
// EDITAR CIDADE
// ======================================

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


    await carregarEstadosSelect();


    document.getElementById(
        "cidadeEditId"
    ).value = data.id;

    document.getElementById(
        "nomeCidade"
    ).value = data.nome;

    document.getElementById(
        "cidadeEstado"
    ).value = data.estado_id;

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


    const { error } =
        await supabaseClient
            .from("cidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir cidade."
        );

        return;

    }


    await listarCidades();
    await carregarDashboard();

}


// ======================================
// SELECT CIDADES
// ======================================

async function carregarCidadesSelect() {

    const select =
        document.getElementById(
            "bairroCidade"
        );

    if (!select) return;


    const valorAtual =
        select.value;


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


    select.innerHTML =
        `<option value="">Selecione uma cidade</option>`;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
                - ${escaparTexto(item.estados?.nome || "")}
            </option>
        `;

    });


    if (valorAtual) {

        select.value = valorAtual;

    }

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
                    estados(
                        nome,
                        regioes(nome)
                    )
                )
            `)
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    const lista =
        document.getElementById(
            "listaBairros"
        );

    if (!lista) return;


    lista.innerHTML = "";


    if (!data || !data.length) {

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

                    <strong>
                        ${escaparTexto(item.nome)}
                    </strong>

                    <div class="item-subtitulo">

                        ${escaparTexto(item.cidades?.nome || "-")}
                        -
                        ${escaparTexto(
                            item.cidades?.estados?.nome || "-"
                        )}

                    </div>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarBairro(${item.id})"
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


// ======================================
// SALVAR BAIRRO
// ======================================

async function salvarBairro() {

    const nome =
        document
            .getElementById("nomeBairro")
            ?.value
            .trim();

    const cidadeId =
        document.getElementById(
            "bairroCidade"
        )?.value;

    const id =
        document.getElementById(
            "bairroEditId"
        )?.value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha todos os campos."
        );

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


    await listarBairros();
    await carregarDashboard();

}


// ======================================
// EDITAR BAIRRO
// ======================================

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


    await carregarCidadesSelect();


    document.getElementById(
        "bairroEditId"
    ).value = data.id;

    document.getElementById(
        "nomeBairro"
    ).value = data.nome;

    document.getElementById(
        "bairroCidade"
    ).value = data.cidade_id;

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


    const { error } =
        await supabaseClient
            .from("bairros")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir bairro."
        );

        return;

    }


    await listarBairros();
    await carregarDashboard();

}


// ======================================
// LISTAR CLÍNICAS
// ======================================

async function listarClinicas() {

    const busca =
        document
            .getElementById("buscarClinica")
            ?.value
            .trim() || "";


    const status =
        document
            .getElementById("filtroStatusClinica")
            ?.value ?? "";


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

        console.error(
            "Erro ao listar clínicas:",
            error
        );

        return;

    }


    const lista =
        document.getElementById(
            "listaClinicas"
        );

    if (!lista) return;


    lista.innerHTML = "";


    if (!data || !data.length) {

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
                .map(item => {

                    const nome =
                        item.especialidades?.nome || "";

                    const rede =
                        formatarRede(item.rede);

                    return `
                        <span class="especialidade-tag">
                            ${escaparTexto(nome)}
                            (${rede})
                        </span>
                    `;

                })
                .join("") || "";


        lista.innerHTML += `

            <tr>

                <td>
                    <strong>
                        ${escaparTexto(clinica.nome)}
                    </strong>
                </td>

                <td>
                    ${escaparTexto(bairro)}
                    <br>
                    ${escaparTexto(cidade)}
                    -
                    ${escaparTexto(estado)}
                </td>

                <td>
                    ${escaparTexto(
                        clinica.telefone || "-"
                    )}
                </td>

                <td>
                    ${especialidades || "-"}
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
// ABRIR MODAL CLÍNICA
// ======================================

async function abrirModalClinica() {

    const form =
        document.getElementById("formClinica");

    if (!form) return;


    form.reset();


    document.getElementById(
        "clinicaId"
    ).value = "";


    document.getElementById(
        "containerEspecialidades"
    ).innerHTML = "";


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Nova Clínica";


    document.getElementById(
        "areaStatusClinica"
    )?.classList.add("hidden");


    document.getElementById(
        "modalClinica"
    ).classList.remove("hidden");


    await carregarRegioesClinica();

}


// ======================================
// FECHAR MODAL
// ======================================

function fecharModalClinica() {

    document
        .getElementById("modalClinica")
        ?.classList.add("hidden");

}


// ======================================
// REGIÕES CLÍNICA
// ======================================

async function carregarRegioesClinica() {

    const select =
        document.getElementById(
            "clinicaRegiao"
        );

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
        `<option value="">Selecione uma região</option>`;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });

}


// ======================================
// ESTADOS CLÍNICA
// ======================================

async function carregarEstadosClinica() {

    const regiaoId =
        document.getElementById(
            "clinicaRegiao"
        )?.value;


    const select =
        document.getElementById(
            "clinicaEstado"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">Selecione um estado</option>`;


    document.getElementById(
        "clinicaCidade"
    ).innerHTML =
        `<option value="">Selecione uma cidade</option>`;


    document.getElementById(
        "clinicaBairro"
    ).innerHTML =
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


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });

}


// ======================================
// CIDADES CLÍNICA
// ======================================

async function carregarCidadesClinica() {

    const estadoId =
        document.getElementById(
            "clinicaEstado"
        )?.value;


    const select =
        document.getElementById(
            "clinicaCidade"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">Selecione uma cidade</option>`;


    document.getElementById(
        "clinicaBairro"
    ).innerHTML =
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


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });

}


// ======================================
// BAIRROS CLÍNICA
// ======================================

async function carregarBairrosClinica() {

    const cidadeId =
        document.getElementById(
            "clinicaCidade"
        )?.value;


    const select =
        document.getElementById(
            "clinicaBairro"
        );


    if (!select) return;


    select.innerHTML =
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


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });

}


// ======================================
// ADICIONAR ESPECIALIDADE
// ======================================

async function adicionarLinhaEspecialidade(
    especialidadeSelecionada = "",
    redeSelecionada = "especialistas"
) {

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    let options =
        `<option value="">Selecione uma especialidade</option>`;


    data?.forEach(item => {

        const selected =
            String(item.id) ===
            String(especialidadeSelecionada)
                ? "selected"
                : "";


        options += `
            <option
                value="${item.id}"
                ${selected}
            >
                ${escaparTexto(item.nome)}
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
        .querySelector(
            ".btn-remover-especialidade"
        )
        .addEventListener(
            "click",
            () => linha.remove()
        );


    document
        .getElementById(
            "containerEspecialidades"
        )
        ?.appendChild(linha);

}


// ======================================
// SALVAR CLÍNICA
// ======================================

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


    const dadosClinica = {

        nome,
        endereco,
        telefone: telefone || null,
        bairro_id: bairroId

    };


    let clinicaId;


    // ==================================
    // EDITAR
    // ==================================

    if (id) {

        const ativo =
            document.getElementById(
                "clinicaAtivo"
            )?.checked;


        dadosClinica.ativo = ativo;


        const { error } =
            await supabaseClient
                .from("clinicas")
                .update(dadosClinica)
                .eq("id", id);


        if (error) {

            console.error(error);

            alert(
                "Erro ao atualizar clínica."
            );

            return;

        }


        clinicaId = id;

    }

    // ==================================
    // NOVA CLÍNICA
    // ==================================

    else {

        const { data, error } =
            await supabaseClient
                .from("clinicas")
                .insert(dadosClinica)
                .select()
                .single();


        if (error) {

            console.error(error);

            alert(
                "Erro ao cadastrar clínica."
            );

            return;

        }


        clinicaId = data.id;

    }


    // ==================================
    // REMOVE ESPECIALIDADES ANTIGAS
    // ==================================

    const { error: erroDelete } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "clinica_id",
                clinicaId
            );


    if (erroDelete) {

        console.error(erroDelete);

        alert(
            "Erro ao atualizar especialidades."
        );

        return;

    }


    // ==================================
    // PEGA ESPECIALIDADES
    // ==================================

    const linhas =
        document.querySelectorAll(
            ".linha-especialidade"
        );


    const especialidades = [];


    linhas.forEach(linha => {

        const especialidadeId =
            linha
                .querySelector(
                    ".select-especialidade"
                )
                ?.value;


        const rede =
            linha
                .querySelector(
                    ".select-rede"
                )
                ?.value;


        if (especialidadeId && rede) {

            especialidades.push({

                clinica_id: Number(clinicaId),

                especialidade_id:
                    Number(especialidadeId),

                rede,

                ativo: true

            });

        }

    });


    // ==================================
    // REMOVE DUPLICADOS
    // ==================================

    const especialidadesUnicas =
        especialidades.filter(
            (item, index, array) =>
                index ===
                array.findIndex(
                    outro =>
                        outro.especialidade_id ===
                        item.especialidade_id &&
                        outro.rede ===
                        item.rede
                )
        );


    // ==================================
    // SALVA ESPECIALIDADES
    // ==================================

    if (especialidadesUnicas.length > 0) {

        const { error } =
            await supabaseClient
                .from(
                    "clinica_especialidades"
                )
                .insert(
                    especialidadesUnicas
                );


        if (error) {

            console.error(error);

            alert(
                "Erro ao salvar especialidades."
            );

            return;

        }

    }


    alert(
        "Clínica salva com sucesso!"
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
                    rede,
                    ativo
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


    await abrirModalClinica();


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Editar Clínica";


    document.getElementById(
        "clinicaId"
    ).value =
        data.id;


    document.getElementById(
        "clinicaNome"
    ).value =
        data.nome || "";


    document.getElementById(
        "clinicaEndereco"
    ).value =
        data.endereco || "";


    document.getElementById(
        "clinicaTelefone"
    ).value =
        data.telefone || "";


    document.getElementById(
        "areaStatusClinica"
    )?.classList.remove("hidden");


    document.getElementById(
        "clinicaAtivo"
    ).checked =
        data.ativo;


    // ==================================
    // LOCALIZAÇÃO
    // ==================================

    const bairro =
        data.bairros;

    const cidade =
        bairro?.cidades;

    const estado =
        cidade?.estados;


    if (
        bairro &&
        cidade &&
        estado
    ) {

        document.getElementById(
            "clinicaRegiao"
        ).value =
            estado.regiao_id;


        await carregarEstadosClinica();


        document.getElementById(
            "clinicaEstado"
        ).value =
            cidade.estado_id;


        await carregarCidadesClinica();


        document.getElementById(
            "clinicaCidade"
        ).value =
            bairro.cidade_id;


        await carregarBairrosClinica();


        document.getElementById(
            "clinicaBairro"
        ).value =
            bairro.id;

    }


    // ==================================
    // ESPECIALIDADES
    // ==================================

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    container.innerHTML = "";


    if (
        data.clinica_especialidades &&
        data.clinica_especialidades.length
    ) {

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

}


// ======================================
// ALTERAR STATUS CLÍNICA
// ======================================

async function alterarStatusClinica(
    id,
    statusAtual
) {

    const novoStatus =
        !statusAtual;


    const mensagem =
        novoStatus
            ? "Deseja ativar esta clínica?"
            : "Deseja desativar esta clínica?";


    if (!confirm(mensagem)) return;


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update({
                ativo: novoStatus
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


// ======================================
// FORMATAR REDE
// ======================================

function formatarRede(rede) {

    if (rede === "especialistas") {

        return "Especialistas";

    }

    if (rede === "sindilegis") {

        return "Sindilegis";

    }

    return rede || "";

}


// ======================================
// ESCAPAR TEXTO HTML
// ======================================

function escaparTexto(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {
        return "";
    }


    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


// ======================================
// LOGOUT
// ======================================

function logout() {

    if (
        !confirm(
            "Deseja sair do painel administrativo?"
        )
    ) return;


    localStorage.removeItem(
        "adminLogado"
    );


    // Esconde painel

    document
        .getElementById("painel")
        ?.classList.add("hidden");


    // Mostra login

    document
        .getElementById("loginContainer")
        ?.classList.remove("hidden");


    // Limpa senha

    const senha =
        document.getElementById("senhaLogin");

    if (senha) {

        senha.value = "";

    }

}
