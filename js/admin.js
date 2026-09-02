// ======================================
// PAINEL ADMINISTRATIVO
// REDE ESPECIALISTAS
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
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Inicializando painel administrativo...");

    iniciarMenu();

    iniciarBotoes();

    await carregarDashboard();

    await carregarRegioes();

});


// ======================================
// NAVEGAÇÃO DO MENU
// ======================================

function iniciarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");


    botoes.forEach(botao => {

        botao.addEventListener("click", async () => {

            const pagina =
                botao.dataset.page;


            if (!pagina) return;


            document
                .querySelectorAll(".menu-btn")
                .forEach(btn => {

                    btn.classList.remove("active");

                });


            botao.classList.add("active");


            await mostrarPagina(pagina);

        });

    });

}


// ======================================
// MOSTRAR PÁGINA
// ======================================

async function mostrarPagina(nomePagina) {

    document
        .querySelectorAll(".page")
        .forEach(pagina => {

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


    // ==================================
    // CARREGADORES POR PÁGINA
    // ==================================

    if (nomePagina === "dashboard") {

        await carregarDashboard();

    }


    if (nomePagina === "clinicas") {

        await prepararPaginaClinicas();

    }


    if (nomePagina === "especialidades") {

        await listarEspecialidades();

    }


    if (nomePagina === "regioes") {

        await listarRegioes();

    }


    if (nomePagina === "estados") {

        await prepararPaginaEstados();

    }


    if (nomePagina === "cidades") {

        await prepararPaginaCidades();

    }


    if (nomePagina === "bairros") {

        await prepararPaginaBairros();

    }

}


// ======================================
// INICIAR BOTÕES
// ======================================

function iniciarBotoes() {


    // ==================================
    // CLÍNICAS
    // ==================================

    const btnSalvarClinica =
        document.getElementById("btnSalvarClinica");

    if (btnSalvarClinica) {

        btnSalvarClinica.addEventListener(
            "click",
            salvarClinica
        );

    }


    const btnAtualizarClinica =
        document.getElementById(
            "btnAtualizarClinica"
        );

    if (btnAtualizarClinica) {

        btnAtualizarClinica.addEventListener(
            "click",
            atualizarClinica
        );

    }


    const btnExcluirClinica =
        document.getElementById(
            "btnExcluirClinica"
        );

    if (btnExcluirClinica) {

        btnExcluirClinica.addEventListener(
            "click",
            excluirClinica
        );

    }


    const btnVoltarClinicas =
        document.getElementById(
            "btnVoltarClinicas"
        );

    if (btnVoltarClinicas) {

        btnVoltarClinicas.addEventListener(
            "click",
            async () => {

                await mostrarPagina(
                    "clinicas"
                );

            }
        );

    }


    // ==================================
    // ADICIONAR ESPECIALIDADE
    // ==================================

    const btnAdicionarEspRede =
        document.getElementById(
            "btnAdicionarEspRede"
        );

    if (btnAdicionarEspRede) {

        btnAdicionarEspRede.addEventListener(
            "click",
            adicionarEspecialidadeClinica
        );

    }


    // ==================================
    // ESPECIALIDADES
    // ==================================

    const btnSalvarEspecialidade =
        document.getElementById(
            "btnSalvarEspecialidade"
        );

    if (btnSalvarEspecialidade) {

        btnSalvarEspecialidade.addEventListener(
            "click",
            salvarEspecialidade
        );

    }


    // ==================================
    // REGIÕES
    // ==================================

    const btnSalvarRegiao =
        document.getElementById(
            "btnSalvarRegiao"
        );

    if (btnSalvarRegiao) {

        btnSalvarRegiao.addEventListener(
            "click",
            salvarRegiao
        );

    }


    // ==================================
    // ESTADOS
    // ==================================

    const btnSalvarEstado =
        document.getElementById(
            "btnSalvarEstado"
        );

    if (btnSalvarEstado) {

        btnSalvarEstado.addEventListener(
            "click",
            salvarEstado
        );

    }


    // ==================================
    // CIDADES
    // ==================================

    const btnSalvarCidade =
        document.getElementById(
            "btnSalvarCidade"
        );

    if (btnSalvarCidade) {

        btnSalvarCidade.addEventListener(
            "click",
            salvarCidade
        );

    }


    // ==================================
    // BAIRROS
    // ==================================

    const btnSalvarBairro =
        document.getElementById(
            "btnSalvarBairro"
        );

    if (btnSalvarBairro) {

        btnSalvarBairro.addEventListener(
            "click",
            salvarBairro
        );

    }


    // ==================================
    // FILTRO CLÍNICAS
    // ==================================

    const filtroClinica =
        document.getElementById(
            "filtro_clinica_nome"
        );

    if (filtroClinica) {

        filtroClinica.addEventListener(
            "input",
            listarClinicas
        );

    }


    // ==================================
    // FILTROS ENCADEADOS
    // NOVA CLÍNICA
    // ==================================

    const clinicaRegiao =
        document.getElementById(
            "clinica_regiao"
        );

    if (clinicaRegiao) {

        clinicaRegiao.addEventListener(
            "change",
            async function () {

                await popularEstadosClinica(
                    this.value
                );

            }
        );

    }


    const clinicaEstado =
        document.getElementById(
            "clinica_estado"
        );

    if (clinicaEstado) {

        clinicaEstado.addEventListener(
            "change",
            async function () {

                await popularCidadesClinica(
                    this.value
                );

            }
        );

    }


    const clinicaCidade =
        document.getElementById(
            "clinica_cidade"
        );

    if (clinicaCidade) {

        clinicaCidade.addEventListener(
            "change",
            async function () {

                await popularBairrosClinica(
                    this.value
                );

            }
        );

    }


    // ==================================
    // FILTROS ENCADEADOS
    // EDITAR CLÍNICA
    // ==================================

    const editRegiao =
        document.getElementById(
            "edit_clinica_regiao"
        );

    if (editRegiao) {

        editRegiao.addEventListener(
            "change",
            async function () {

                await popularEstadosEditar(
                    this.value
                );

            }
        );

    }


    const editEstado =
        document.getElementById(
            "edit_clinica_estado"
        );

    if (editEstado) {

        editEstado.addEventListener(
            "change",
            async function () {

                await popularCidadesEditar(
                    this.value
                );

            }
        );

    }


    const editCidade =
        document.getElementById(
            "edit_clinica_cidade"
        );

    if (editCidade) {

        editCidade.addEventListener(
            "change",
            async function () {

                await popularBairrosEditar(
                    this.value
                );

            }
        );

    }


    // ==================================
    // FILTRO ESTADOS
    // ==================================

    const filtroEstadoRegiao =
        document.getElementById(
            "filtro_estado_regiao"
        );

    if (filtroEstadoRegiao) {

        filtroEstadoRegiao.addEventListener(
            "change",
            listarEstados
        );

    }


    // ==================================
    // FILTRO CIDADES
    // ==================================

    const filtroCidadeEstado =
        document.getElementById(
            "filtro_cidade_estado"
        );

    if (filtroCidadeEstado) {

        filtroCidadeEstado.addEventListener(
            "change",
            listarCidades
        );

    }


    // ==================================
    // FILTRO BAIRROS
    // ==================================

    const filtroBairroCidade =
        document.getElementById(
            "filtro_bairro_cidade"
        );

    if (filtroBairroCidade) {

        filtroBairroCidade.addEventListener(
            "change",
            listarBairros
        );

    }


    // ==================================
    // VOLTAR AO SITE
    // ==================================

    const btnVoltarSite =
        document.getElementById(
            "btnVoltarSite"
        );

    if (btnVoltarSite) {

        btnVoltarSite.addEventListener(
            "click",
            () => {

                location.href = "index.html";

            }
        );

    }

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


    select.innerHTML =
        `<option value="">
            ${textoPadrao}
        </option>`;


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


        const elementos = {

            totalClinicas:
                clinicas.count || 0,

            totalEspecialidades:
                especialidades.count || 0,

            totalRegioes:
                regioes.count || 0,

            totalEstados:
                estados.count || 0,

            totalCidades:
                cidades.count || 0,

            totalBairros:
                bairros.count || 0

        };


        Object.entries(elementos)
            .forEach(([id, valor]) => {

                const elemento =
                    document.getElementById(id);

                if (elemento) {

                    elemento.textContent = valor;

                }

            });

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// ======================================
// REGIÕES
// ======================================

async function carregarRegioes() {

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
        "Selecione Região"
    );


    preencherSelect(
        "filtro_estado_regiao",
        data,
        "Todas as Regiões"
    );


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

}


// ======================================
// SALVAR REGIÃO
// ======================================

async function salvarRegiao() {

    const input =
        document.getElementById(
            "nova_regiao"
        );


    if (!input) return;


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
                nome: nome
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar região."
        );

        return;

    }


    alert(
        "Região cadastrada com sucesso!"
    );


    input.value = "";


    await listarRegioes();

    await carregarRegioes();

    await carregarDashboard();

}


// ======================================
// LISTAR REGIÕES
// ======================================

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


    lista.innerHTML = "";


    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma região cadastrada.</p>";

        return;

    }


    data.forEach(regiao => {

        lista.innerHTML += `

            <div class="item-lista">

                <span>
                    🌎 ${regiao.nome}
                </span>

                <button
                    class="btn-excluir"
                    onclick="excluirRegiao('${regiao.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta região?"
        );


    if (!confirmar) return;


    const { error } =
        await supabaseClient
            .from("regioes")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir esta região. Verifique se existem estados vinculados."
        );

        return;

    }


    await listarRegioes();

    await carregarRegioes();

    await carregarDashboard();

}


// ======================================
// ESTADOS
// ======================================

async function prepararPaginaEstados() {

    await carregarRegioes();

    await listarEstados();

}


// ======================================
// SALVAR ESTADO
// ======================================

async function salvarEstado() {

    const regiao =
        document.getElementById(
            "estado_regiao"
        ).value;


    const nome =
        document.getElementById(
            "novo_estado"
        ).value.trim();


    if (!regiao || !nome) {

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
                regiao_id: regiao
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar estado."
        );

        return;

    }


    alert(
        "Estado cadastrado com sucesso!"
    );


    document.getElementById(
        "novo_estado"
    ).value = "";


    await listarEstados();

    await carregarDashboard();

}


// ======================================
// LISTAR ESTADOS
// ======================================

async function listarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


    const filtro =
        document.getElementById(
            "filtro_estado_regiao"
        );


    const regiaoId =
        filtro
            ? filtro.value
            : "";


    let consulta =
        supabaseClient
            .from("estados")
            .select(`
                id,
                nome,
                regioes(
                    nome
                )
            `)
            .order("nome");


    if (regiaoId) {

        consulta =
            consulta.eq(
                "regiao_id",
                regiaoId
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);
        return;

    }


    lista.innerHTML = "";


    data.forEach(estado => {

        lista.innerHTML += `

            <div class="item-lista">

                <div>

                    <strong>
                        📍 ${estado.nome}
                    </strong>

                    <small>
                        Região:
                        ${estado.regioes?.nome || "-"}
                    </small>

                </div>

                <button
                    class="btn-excluir"
                    onclick="excluirEstado('${estado.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ======================================
// EXCLUIR ESTADO
// ======================================

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
            "Não foi possível excluir. Existem cidades vinculadas."
        );

        return;

    }


    await listarEstados();

    await carregarDashboard();

}


// ======================================
// CIDADES
// ======================================

async function prepararPaginaCidades() {

    await carregarEstadosSelect();

    await listarCidades();

}


// ======================================
// CARREGAR ESTADOS NOS SELECTS
// ======================================

async function carregarEstadosSelect() {

    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


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
// SALVAR CIDADE
// ======================================

async function salvarCidade() {

    const estado =
        document.getElementById(
            "cidade_estado"
        ).value;


    const nome =
        document.getElementById(
            "nova_cidade"
        ).value.trim();


    if (!estado || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("cidades")
            .insert({
                nome: nome,
                estado_id: estado
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar cidade."
        );

        return;

    }


    alert(
        "Cidade cadastrada com sucesso!"
    );


    document.getElementById(
        "nova_cidade"
    ).value = "";


    await listarCidades();

    await carregarDashboard();

}


// ======================================
// LISTAR CIDADES
// ======================================

async function listarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


    const estadoId =
        document.getElementById(
            "filtro_cidade_estado"
        )?.value;


    let consulta =
        supabaseClient
            .from("cidades")
            .select(`
                id,
                nome,
                estados(
                    nome
                )
            `)
            .order("nome");


    if (estadoId) {

        consulta =
            consulta.eq(
                "estado_id",
                estadoId
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);
        return;

    }


    lista.innerHTML = "";


    data.forEach(cidade => {

        lista.innerHTML += `

            <div class="item-lista">

                <div>

                    <strong>
                        🏙️ ${cidade.nome}
                    </strong>

                    <small>
                        Estado:
                        ${cidade.estados?.nome || "-"}
                    </small>

                </div>

                <button
                    class="btn-excluir"
                    onclick="excluirCidade('${cidade.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ======================================
// EXCLUIR CIDADE
// ======================================

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
            "Não foi possível excluir. Existem bairros vinculados."
        );

        return;

    }


    await listarCidades();

    await carregarDashboard();

}


// ======================================
// BAIRROS
// ======================================

async function prepararPaginaBairros() {

    await carregarCidadesSelect();

    await listarBairros();

}


// ======================================
// CARREGAR CIDADES SELECT
// ======================================

async function carregarCidadesSelect() {

    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


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


// ======================================
// SALVAR BAIRRO
// ======================================

async function salvarBairro() {

    const cidade =
        document.getElementById(
            "bairro_cidade"
        ).value;


    const nome =
        document.getElementById(
            "novo_bairro"
        ).value.trim();


    if (!cidade || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("bairros")
            .insert({
                nome: nome,
                cidade_id: cidade
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar bairro."
        );

        return;

    }


    alert(
        "Bairro cadastrado com sucesso!"
    );


    document.getElementById(
        "novo_bairro"
    ).value = "";


    await listarBairros();

    await carregarDashboard();

}


// ======================================
// LISTAR BAIRROS
// ======================================

async function listarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    const cidadeId =
        document.getElementById(
            "filtro_bairro_cidade"
        )?.value;


    let consulta =
        supabaseClient
            .from("bairros")
            .select(`
                id,
                nome,
                cidades(
                    nome
                )
            `)
            .order("nome");


    if (cidadeId) {

        consulta =
            consulta.eq(
                "cidade_id",
                cidadeId
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);
        return;

    }


    lista.innerHTML = "";


    data.forEach(bairro => {

        lista.innerHTML += `

            <div class="item-lista">

                <div>

                    <strong>
                        📌 ${bairro.nome}
                    </strong>

                    <small>
                        Cidade:
                        ${bairro.cidades?.nome || "-"}
                    </small>

                </div>

                <button
                    class="btn-excluir"
                    onclick="excluirBairro('${bairro.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ======================================
// EXCLUIR BAIRRO
// ======================================

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
            "Não foi possível excluir. Existem clínicas vinculadas."
        );

        return;

    }


    await listarBairros();

    await carregarDashboard();

}


// ======================================
// ESPECIALIDADES
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
                nome: nome
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar especialidade."
        );

        return;

    }


    alert(
        "Especialidade cadastrada!"
    );


    input.value = "";


    await listarEspecialidades();

    await carregarDashboard();

}


// ======================================
// LISTAR ESPECIALIDADES
// ======================================

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


    lista.innerHTML = "";


    data.forEach(especialidade => {

        lista.innerHTML += `

            <div class="item-lista">

                <strong>
                    🦷 ${especialidade.nome}
                </strong>

                <button
                    class="btn-excluir"
                    onclick="excluirEspecialidade('${especialidade.id}')"
                >
                    🗑 Excluir
                </button>

            </div>

        `;

    });

}


// ======================================
// EXCLUIR ESPECIALIDADE
// ======================================

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
            "Não foi possível excluir. Existem clínicas vinculadas."
        );

        return;

    }


    await listarEspecialidades();

    await carregarDashboard();

}


// ======================================
// PREPARAR PÁGINA CLÍNICAS
// ======================================

async function prepararPaginaClinicas() {

    await popularRegioesClinica();

    await popularEspecialidadesClinica();

    await listarClinicas();

}


// ======================================
// REGIÕES NOVA CLÍNICA
// ======================================

async function popularRegioesClinica() {

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

}


// ======================================
// ESTADOS NOVA CLÍNICA
// ======================================

async function popularEstadosClinica(regiaoId) {

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


    if (!regiaoId) return;


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiaoId
            )
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


// ======================================
// CIDADES NOVA CLÍNICA
// ======================================

async function popularCidadesClinica(estadoId) {

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


    if (!estadoId) return;


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estadoId
            )
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


// ======================================
// BAIRROS NOVA CLÍNICA
// ======================================

async function popularBairrosClinica(cidadeId) {

    preencherSelect(
        "clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!cidadeId) return;


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidadeId
            )
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
// ESPECIALIDADES SELECT CLÍNICA
// ======================================

async function popularEspecialidadesClinica() {

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
        !bairro
    ) {

        alert(
            "Preencha Nome, Endereço e Bairro."
        );

        return;

    }


    // ==================================
    // CADASTRAR CLÍNICA
    // ==================================

    const {
        data: clinica,
        error
    } = await supabaseClient
        .from("clinicas")
        .insert({
            nome: nome,
            telefone: telefone,
            endereco: endereco,
            bairro_id: bairro,
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


    // ==================================
    // VINCULAR ESPECIALIDADE
    // ==================================

    if (especialidade) {

        const {
            error: erroEspecialidade
        } = await supabaseClient
            .from("clinica_especialidades")
            .insert({

                clinica_id:
                    clinica.id,

                especialidade_id:
                    especialidade,

                rede:
                    rede,

                ativo:
                    true

            });


        if (erroEspecialidade) {

            console.error(
                erroEspecialidade
            );

        }

    }


    alert(
        "Clínica cadastrada com sucesso!"
    );


    limparFormularioClinica();

    await listarClinicas();

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


    document.getElementById(
        "clinica_regiao"
    ).value = "";


    document.getElementById(
        "clinica_especialidade"
    ).value = "";

}


// ======================================
// LISTAR CLÍNICAS
// ======================================

async function listarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    const filtro =
        document.getElementById(
            "filtro_clinica_nome"
        );


    const busca =
        filtro
            ? filtro.value.trim()
            : "";


    let consulta =
        supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                telefone,
                endereco,
                ativo,

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


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);

        lista.innerHTML =
            "<p>Erro ao carregar clínicas.</p>";

        return;

    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma clínica encontrada.
            </div>
        `;

        return;

    }


    lista.innerHTML = `

        <div class="tabela-container">

            <table class="tabela-clinicas">

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
                            Status
                        </th>

                        <th>
                            Ações
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${data.map(clinica => `

                        <tr>

                            <td>

                                <strong>
                                    ${clinica.nome}
                                </strong>

                                <br>

                                <small>
                                    ${clinica.endereco || "-"}
                                </small>

                            </td>


                            <td>

                                ${clinica.bairros?.nome || "-"}

                                <br>

                                <small>

                                    ${clinica.bairros?.cidades?.nome || "-"}

                                    -

                                    ${clinica.bairros?.cidades?.estados?.nome || "-"}

                                </small>

                            </td>


                            <td>

                                ${clinica.telefone || "-"}

                            </td>


                            <td>

                                ${clinica.ativo
                                    ? `<span class="status ativo">
                                        Ativa
                                       </span>`
                                    : `<span class="status inativo">
                                        Inativa
                                       </span>`
                                }

                            </td>


                            <td>

                                <div class="acoes-tabela">

                                    <button
                                        class="btn-editar"
                                        onclick="abrirEditarClinica('${clinica.id}')"
                                    >
                                        ✏️ Editar
                                    </button>


                                    <button
                                        class="btn-excluir"
                                        onclick="excluirClinicaTabela('${clinica.id}')"
                                    >
                                        🗑 Excluir
                                    </button>

                                </div>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

    `;

}


// ======================================
// ABRIR EDITAR CLÍNICA
// ======================================

async function abrirEditarClinica(id) {

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


    // ==================================
    // ABRIR PÁGINA
    // ==================================

    await mostrarPagina(
        "editarClinica"
    );


    // ==================================
    // CARREGAR REGIÕES
    // ==================================

    await popularRegioesEditar();


    // ==================================
    // PREENCHER DADOS
    // ==================================

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
        "edit_clinica_ativo"
    ).checked = data.ativo;


    // ==================================
    // LOCALIZAÇÃO
    // ==================================

    const bairro =
        data.bairros;


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


        await popularEstadosEditar(
            regiao.id
        );

    }


    if (estado) {

        document.getElementById(
            "edit_clinica_estado"
        ).value = estado.id;


        await popularCidadesEditar(
            estado.id
        );

    }


    if (cidade) {

        document.getElementById(
            "edit_clinica_cidade"
        ).value = cidade.id;


        await popularBairrosEditar(
            cidade.id
        );

    }


    if (bairro) {

        document.getElementById(
            "edit_clinica_bairro"
        ).value = bairro.id;

    }


    // ==================================
    // ESPECIALIDADES
    // ==================================

    await popularEspecialidadesClinica();

    await listarEspecialidadesClinica(id);

}


// ======================================
// REGIÕES EDITAR
// ======================================

async function popularRegioesEditar() {

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
        "edit_clinica_regiao",
        data,
        "Selecione Região"
    );

}


// ======================================
// ESTADOS EDITAR
// ======================================

async function popularEstadosEditar(regiaoId) {

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


    if (!regiaoId) return;


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiaoId
            )
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    preencherSelect(
        "edit_clinica_estado",
        data,
        "Selecione Estado"
    );

}


// ======================================
// CIDADES EDITAR
// ======================================

async function popularCidadesEditar(estadoId) {

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


    if (!estadoId) return;


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estadoId
            )
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


    preencherSelect(
        "edit_clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


// ======================================
// BAIRROS EDITAR
// ======================================

async function popularBairrosEditar(cidadeId) {

    preencherSelect(
        "edit_clinica_bairro",
        [],
        "Selecione Bairro"
    );


    if (!cidadeId) return;


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidadeId
            )
            .order("nome");


    if (error) {

        console.error(error);
        return;

    }


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

                nome: nome,

                telefone: telefone,

                endereco: endereco,

                bairro_id: bairro,

                ativo: ativo

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


    await carregarDashboard();

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica() {

    const id =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    if (!id) return;


    const confirmar =
        confirm(
            "ATENÇÃO!\n\nDeseja realmente excluir esta clínica?\n\nEssa ação não poderá ser desfeita."
        );


    if (!confirmar) return;


    // ==================================
    // EXCLUIR ESPECIALIDADES VINCULADAS
    // ==================================

    await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            id
        );


    // ==================================
    // EXCLUIR CLÍNICA
    // ==================================

    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq(
                "id",
                id
            );


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


    await carregarDashboard();

    await mostrarPagina(
        "clinicas"
    );

}


// ======================================
// EXCLUIR CLÍNICA PELA TABELA
// ======================================

async function excluirClinicaTabela(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?"
        );


    if (!confirmar) return;


    // Remove vínculos primeiro

    await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            id
        );


    // Remove clínica

    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq(
                "id",
                id
            );


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


    await listarClinicas();

    await carregarDashboard();

}


// ======================================
// LISTAR ESPECIALIDADES DA CLÍNICA
// ======================================

async function listarEspecialidadesClinica(clinicaId) {

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


    lista.innerHTML = "";


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <p class="sem-dados">
                Nenhuma especialidade vinculada.
            </p>
        `;

        return;

    }


    data.forEach(item => {

        const nomeRede =
            item.rede === "especialistas"
                ? "Rede Especialistas"
                : "Rede Sindilegis";


        lista.innerHTML += `

            <div class="item-lista">

                <div>

                    <strong>
                        🦷
                        ${item.especialidades?.nome || "-"}
                    </strong>

                    <small>
                        ${nomeRede}
                    </small>

                </div>


                <button
                    class="btn-excluir"
                    onclick="removerEspecialidadeClinica('${item.id}')"
                >
                    🗑 Remover
                </button>

            </div>

        `;

    });

}


// ======================================
// ADICIONAR ESPECIALIDADE À CLÍNICA
// ======================================

async function adicionarEspecialidadeClinica() {

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
        !especialidadeId
    ) {

        alert(
            "Selecione uma especialidade."
        );

        return;

    }


    // ==================================
    // VERIFICAR SE JÁ EXISTE
    // ==================================

    const { data: existente } =
        await supabaseClient
            .from("clinica_especialidades")
            .select("id")
            .eq(
                "clinica_id",
                clinicaId
            )
            .eq(
                "especialidade_id",
                especialidadeId
            )
            .eq(
                "rede",
                rede
            )
            .maybeSingle();


    if (existente) {

        alert(
            "Esta especialidade já está vinculada a esta rede."
        );

        return;

    }


    // ==================================
    // ADICIONAR
    // ==================================

    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert({

                clinica_id:
                    clinicaId,

                especialidade_id:
                    especialidadeId,

                rede:
                    rede,

                ativo:
                    true

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao adicionar especialidade."
        );

        return;

    }


    alert(
        "Especialidade adicionada!"
    );


    document.getElementById(
        "edit_especialidade"
    ).value = "";


    await listarEspecialidadesClinica(
        clinicaId
    );

}


// ======================================
// REMOVER ESPECIALIDADE DA CLÍNICA
// ======================================

async function removerEspecialidadeClinica(id) {

    const confirmar =
        confirm(
            "Deseja remover esta especialidade da clínica?"
        );


    if (!confirmar) return;


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "Erro ao remover especialidade."
        );

        return;

    }


    const clinicaId =
        document.getElementById(
            "edit_clinica_id"
        ).value;


    await listarEspecialidadesClinica(
        clinicaId
    );

}


// ======================================
// FUNÇÕES GLOBAIS
// NECESSÁRIAS PARA ONCLICK DO HTML
// ======================================

window.excluirRegiao =
    excluirRegiao;

window.excluirEstado =
    excluirEstado;

window.excluirCidade =
    excluirCidade;

window.excluirBairro =
    excluirBairro;

window.excluirEspecialidade =
    excluirEspecialidade;

window.abrirEditarClinica =
    abrirEditarClinica;

window.excluirClinicaTabela =
    excluirClinicaTabela;

window.removerEspecialidadeClinica =
    removerEspecialidadeClinica;


// ======================================
// FIM DO ADMIN.JS
// ======================================
