// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 1 DE 2
// ============================================================

console.log("admin.js - Parte 1 carregada");


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const NOME_REDE = "Rede Especialistas";

let clinicaEditandoId = null;
let especialidadesClinicaTemp = [];


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("Painel administrativo iniciado.");

    try {

        atualizarData();

        carregarTema();

        await carregarDashboard();

        await popularRegioes();

        await popularEstados();

        await popularCidades();

        await popularBairros();

        await popularEspecialidades();

        await listarClinicas();

        await listarEspecialidades();

        await listarRegioes();

        await listarEstados();

        await listarCidades();

        await listarBairros();

        configurarEventosGerais();

        configurarBotoesGerais();

        console.log(
            "Painel administrativo inicializado com sucesso."
        );

    } catch (erro) {

        console.error(
            "Erro ao inicializar o painel:",
            erro
        );

    }

});


// ============================================================
// TÍTULOS DAS PÁGINAS
// ============================================================

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


// ============================================================
// CARREGADORES DAS PÁGINAS
// ============================================================

const CARREGADORES_PAGINA = {

    dashboard: carregarDashboard,

    clinicas: carregarPaginaClinicas,

    especialidades: carregarPaginaEspecialidades,

    regioes: carregarPaginaRegioes,

    estados: carregarPaginaEstados,

    cidades: carregarPaginaCidades,

    bairros: carregarPaginaBairros

};


// ============================================================
// MOSTRAR PÁGINA
// ============================================================

async function mostrarPagina(nomePagina) {

    console.log(
        "Abrindo página:",
        nomePagina
    );


    // Remove a página ativa

    document
        .querySelectorAll(".pagina")
        .forEach(function (pagina) {

            pagina.classList.remove("ativa");

        });


    // Localiza a página

    const pagina =
        document.getElementById(
            "pagina-" + nomePagina
        );


    if (!pagina) {

        console.error(
            "Página não encontrada:",
            "pagina-" + nomePagina
        );

        return;

    }


    // Ativa a página

    pagina.classList.add("ativa");


    // Atualiza botão do menu

    document
        .querySelectorAll(".menu-btn")
        .forEach(function (botao) {

            botao.classList.remove("ativo");


            if (
                botao.dataset.pagina ===
                nomePagina
            ) {

                botao.classList.add("ativo");

            }

        });


    // Atualiza título

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina] ||
            nomePagina;

    }


    // Carrega conteúdo da página

    const carregador =
        CARREGADORES_PAGINA[nomePagina];


    if (carregador) {

        try {

            await carregador();

        } catch (erro) {

            console.error(
                "Erro ao carregar página:",
                nomePagina,
                erro
            );

        }

    }

}


// ============================================================
// NAVEGAÇÃO PELOS BOTÕES DO MENU
// ============================================================

function configurarEventosGerais() {

    document
        .querySelectorAll(".menu-btn[data-pagina]")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const pagina =
                        botao.dataset.pagina;


                    if (!pagina) {
                        return;
                    }


                    mostrarPagina(pagina);

                }
            );

        });

}


// ============================================================
// BOTÕES GERAIS
// ============================================================

function configurarBotoesGerais() {

    // --------------------------------------------------------
    // VOLTAR AO SITE
    // --------------------------------------------------------

    const botoesVoltar =
        document.querySelectorAll(
            ".menu-btn"
        );


    botoesVoltar.forEach(function (botao) {

        const texto =
            botao.textContent
                .trim()
                .toLowerCase();


        if (
            texto.includes("voltar") &&
            !botao.dataset.pagina
        ) {

            botao.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    voltarAoSite();

                }
            );

        }

    });


    // --------------------------------------------------------
    // SAIR
    // --------------------------------------------------------

    const botaoSair =
        document.querySelector(
            ".btn-sair"
        );


    if (botaoSair) {

        botaoSair.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                sair();

            }
        );

    }

}


// ============================================================
// VOLTAR AO SITE
// ============================================================

function voltarAoSite() {

    console.log(
        "Voltando para o site..."
    );


    window.location.href =
        "index.html";

}


// ============================================================
// SAIR DO PAINEL
// ============================================================

function sair() {

    const confirmar =
        window.confirm(
            "Deseja sair do painel administrativo?"
        );


    if (!confirmar) {

        return;

    }


    try {

        // Remove possíveis dados de sessão
        // utilizados pelo painel.

        localStorage.removeItem(
            "adminLogado"
        );

        localStorage.removeItem(
            "usuarioAdmin"
        );

        sessionStorage.removeItem(
            "adminLogado"
        );

        sessionStorage.removeItem(
            "usuarioAdmin"
        );

    } catch (erro) {

        console.warn(
            "Não foi possível limpar a sessão:",
            erro
        );

    }


    window.location.href =
        "login.html";

}


// ============================================================
// TEMA
// ============================================================

function alternarTema() {

    document.body.classList.toggle(
        "dark"
    );


    const escuro =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "temaAdmin",
        escuro
            ? "dark"
            : "light"
    );

}


// ============================================================
// CARREGAR TEMA
// ============================================================

function carregarTema() {

    const tema =
        localStorage.getItem(
            "temaAdmin"
        );


    if (tema === "dark") {

        document.body.classList.add(
            "dark"
        );

    } else {

        document.body.classList.remove(
            "dark"
        );

    }

}


// ============================================================
// ATUALIZAR DATA
// ============================================================

function atualizarData() {

    const elemento =
        document.getElementById(
            "dataAtual"
        );


    if (!elemento) {

        return;

    }


    const agora =
        new Date();


    const data =
        agora.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    elemento.textContent =
        data.charAt(0).toUpperCase() +
        data.slice(1);

}


// ============================================================
// PREENCHER SELECT
// ============================================================

function preencherSelect(
    id,
    dados,
    textoPadrao
) {

    const select =
        document.getElementById(id);


    if (!select) {

        return;

    }


    preencherSelectElement(
        select,
        dados,
        textoPadrao
    );

}


// ============================================================
// PREENCHER SELECT ELEMENT
// ============================================================

function preencherSelectElement(
    select,
    dados,
    textoPadrao
) {

    if (!select) {

        return;

    }


    select.innerHTML = "";


    const primeira =
        document.createElement(
            "option"
        );


    primeira.value = "";

    primeira.textContent =
        textoPadrao;


    select.appendChild(
        primeira
    );


    if (!dados) {

        return;

    }


    dados.forEach(function (item) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.id;


        option.textContent =
            item.nome;


        select.appendChild(
            option
        );

    });

}


// ============================================================
// DEFINIR VALOR
// ============================================================

function definirValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.value =
            valor ?? "";

    }

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escapeHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// DECODIFICAR HTML
// ============================================================

function decodeHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.innerHTML =
        String(valor);


    return textarea.value;

}


// ============================================================
// FECHAR MODAL AO CLICAR FORA
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "modalClinica"
            );


        if (!modal) {

            return;

        }


        if (
            event.target === modal
        ) {

            fecharModalClinica();

        }

    }
);


// ============================================================
// FECHAR MODAL COM ESC
// ============================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        const modal =
            document.getElementById(
                "modalClinica"
            );


        if (
            modal &&
            !modal.classList.contains(
                "hidden"
            )
        ) {

            fecharModalClinica();

        }

    }
);


// ============================================================
// DASHBOARD
// ============================================================

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

            obterTotal(
                "clinicas"
            ),

            obterTotal(
                "especialidades"
            ),

            obterTotal(
                "regioes"
            ),

            obterTotal(
                "estados"
            ),

            obterTotal(
                "cidades"
            ),

            obterTotal(
                "bairros"
            )

        ]);


        definirTexto(
            "totalClinicas",
            clinicas
        );


        definirTexto(
            "totalEspecialidades",
            especialidades
        );


        definirTexto(
            "totalRegioes",
            regioes
        );


        definirTexto(
            "totalEstados",
            estados
        );


        definirTexto(
            "totalCidades",
            cidades
        );


        definirTexto(
            "totalBairros",
            bairros
        );


        await carregarTotaisClinicasAtivas();


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// ============================================================
// DEFINIR TEXTO
// ============================================================

function definirTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            valor ?? 0;

    }

}


// ============================================================
// OBTER TOTAL
// ============================================================

async function obterTotal(
    tabela
) {

    const {
        count,
        error
    } =
        await supabaseClient

            .from(tabela)

            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            );


    if (error) {

        throw error;

    }


    return count || 0;

}


// ============================================================
// CLÍNICAS ATIVAS
// ============================================================

async function carregarTotaisClinicasAtivas() {

    const {
        count,
        error
    } =
        await supabaseClient

            .from("clinicas")

            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )

            .eq(
                "ativo",
                true
            );


    if (error) {

        console.error(
            "Erro ao contar clínicas ativas:",
            error
        );

        return;

    }


    definirTexto(
        "totalClinicasAtivas",
        count || 0
    );

}


// ============================================================
// EXPORTAÇÕES
// ============================================================

window.mostrarPagina =
    mostrarPagina;

window.alternarTema =
    alternarTema;

window.voltarAoSite =
    voltarAoSite;

window.sair =
    sair;

window.carregarDashboard =
    carregarDashboard;

window.escapeHTML =
    escapeHTML;

window.decodeHTML =
    decodeHTML;

console.log(
    "Parte 1 do admin.js carregada."
);
// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 2 DE 2
// ============================================================


// ============================================================
// CARREGAR PÁGINA DE CLÍNICAS
// ============================================================

async function carregarPaginaClinicas() {

    await listarClinicas();

}


// ============================================================
// CARREGAR PÁGINA DE ESPECIALIDADES
// ============================================================

async function carregarPaginaEspecialidades() {

    await listarEspecialidades();

}


// ============================================================
// CARREGAR PÁGINA DE REGIÕES
// ============================================================

async function carregarPaginaRegioes() {

    await listarRegioes();

}


// ============================================================
// CARREGAR PÁGINA DE ESTADOS
// ============================================================

async function carregarPaginaEstados() {

    await listarEstados();

}


// ============================================================
// CARREGAR PÁGINA DE CIDADES
// ============================================================

async function carregarPaginaCidades() {

    await listarCidades();

}


// ============================================================
// CARREGAR PÁGINA DE BAIRROS
// ============================================================

async function carregarPaginaBairros() {

    await listarBairros();

}


// ============================================================
// REGIÕES
// ============================================================

async function popularRegioes() {

    const {
        data,
        error
    } = await supabaseClient

        .from("regioes")

        .select(`
            id,
            nome
        `)

        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Erro ao carregar regiões:",
            error
        );

        return [];

    }


    preencherSelect(
        "clinicaRegiao",
        data || [],
        "Selecione a região"
    );


    return data || [];

}


// ============================================================
// ESTADOS
// ============================================================

async function popularEstados(
    regiaoId = ""
) {

    let query =
        supabaseClient

            .from("estados")

            .select(`
                id,
                nome,
                regiao_id
            `)

            .order(
                "nome",
                {
                    ascending: true
                }
            );


    if (regiaoId) {

        query =
            query.eq(
                "regiao_id",
                regiaoId
            );

    }


    const {
        data,
        error
    } = await query;


    if (error) {

        console.error(
            "Erro ao carregar estados:",
            error
        );

        return [];

    }


    preencherSelect(
        "clinicaEstado",
        data || [],
        "Selecione o estado"
    );


    return data || [];

}


// ============================================================
// CIDADES
// ============================================================

async function popularCidades(
    estadoId = ""
) {

    let query =
        supabaseClient

            .from("cidades")

            .select(`
                id,
                nome,
                estado_id
            `)

            .order(
                "nome",
                {
                    ascending: true
                }
            );


    if (estadoId) {

        query =
            query.eq(
                "estado_id",
                estadoId
            );

    }


    const {
        data,
        error
    } = await query;


    if (error) {

        console.error(
            "Erro ao carregar cidades:",
            error
        );

        return [];

    }


    preencherSelect(
        "clinicaCidade",
        data || [],
        "Selecione a cidade"
    );


    return data || [];

}


// ============================================================
// BAIRROS
// ============================================================

async function popularBairros(
    cidadeId = ""
) {

    let query =
        supabaseClient

            .from("bairros")

            .select(`
                id,
                nome,
                cidade_id
            `)

            .order(
                "nome",
                {
                    ascending: true
                }
            );


    if (cidadeId) {

        query =
            query.eq(
                "cidade_id",
                cidadeId
            );

    }


    const {
        data,
        error
    } = await query;


    if (error) {

        console.error(
            "Erro ao carregar bairros:",
            error
        );

        return [];

    }


    preencherSelect(
        "clinicaBairro",
        data || [],
        "Selecione o bairro"
    );


    return data || [];

}


// ============================================================
// ESPECIALIDADES
// ============================================================

async function popularEspecialidades() {

    const {
        data,
        error
    } = await supabaseClient

        .from("especialidades")

        .select(`
            id,
            nome
        `)

        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

        return [];

    }


    return data || [];

}


// ============================================================
// LISTAR CLÍNICAS
// ============================================================

async function listarClinicas() {

    const container =
        document.getElementById(
            "listaClinicas"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<div class="carregando">
            Carregando clínicas...
        </div>`;


    const {
        data,
        error
    } = await supabaseClient

        .from("clinicas")

        .select(`
            id,
            nome,
            telefone,
            endereco,
            bairro_id,
            ativo,

            bairros (
                id,
                nome,

                cidades (
                    id,
                    nome,

                    estados (
                        id,
                        nome,

                        regioes (
                            id,
                            nome
                        )
                    )
                )
            ),

            clinica_especialidades (
                id,
                especialidade_id,
                rede,
                ativo,

                especialidades (
                    id,
                    nome
                )
            )
        `)

        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Erro ao listar clínicas:",
            error
        );


        container.innerHTML =
            `<div class="erro">
                Erro ao carregar clínicas.
            </div>`;


        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML =
            `<div class="vazio">
                Nenhuma clínica cadastrada.
            </div>`;


        return;

    }


    container.innerHTML = "";


    data.forEach(function (clinica) {

        const bairro =
            clinica.bairros;


        const cidade =
            bairro?.cidades;


        const estado =
            cidade?.estados;


        const regiao =
            estado?.regioes;


        const redes =
            [
                ...new Set(
                    (clinica.clinica_especialidades || [])
                        .filter(
                            item => item.ativo !== false
                        )
                        .map(
                            item => item.rede
                        )
                        .filter(Boolean)
                )
            ];


        let textoRedes =
            "-";


        if (redes.length > 0) {

            textoRedes =
                redes
                    .map(function (rede) {

                        if (
                            rede ===
                            "especialistas"
                        ) {

                            return "Especialistas";

                        }


                        if (
                            rede ===
                            "sindilegis"
                        ) {

                            return "Sindilegis";

                        }


                        return rede;

                    })
                    .join(", ");

        }


        const div =
            document.createElement(
                "div"
            );


        div.className =
            "item-clinica";


        div.innerHTML = `

            <div class="item-clinica-info">

                <strong>
                    ${escapeHTML(
                        clinica.nome
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        clinica.telefone || "-"
                    )}
                </span>

            </div>

            <div>
                ${escapeHTML(
                    regiao?.nome || "-"
                )}
            </div>

            <div>
                ${escapeHTML(
                    estado?.nome || "-"
                )}
            </div>

            <div>
                ${escapeHTML(
                    cidade?.nome || "-"
                )}
            </div>

            <div>
                ${escapeHTML(
                    bairro?.nome || "-"
                )}
            </div>

            <div>
                ${escapeHTML(
                    textoRedes
                )}
            </div>

            <div>
                <span class="status ${
                    clinica.ativo
                        ? "ativo"
                        : "inativo"
                }">
                    ${
                        clinica.ativo
                            ? "Ativa"
                            : "Inativa"
                    }
                </span>
            </div>

            <div class="item-acoes">

                <button
                    type="button"
                    class="btn-editar"
                    onclick="editarClinica('${clinica.id}')"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    class="btn-excluir"
                    onclick="excluirClinica('${clinica.id}')"
                >
                    🗑️ Excluir
                </button>

            </div>
        `;


        container.appendChild(div);

    });

}


// ============================================================
// ABRIR MODAL DA CLÍNICA
// ============================================================

async function abrirModalClinica(
    id = null
) {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    const form =
        document.getElementById(
            "formClinica"
        );


    if (!modal || !form) {

        return;

    }


    form.reset();


    clinicaEditandoId =
        id || null;


    especialidadesClinicaTemp =
        [];


    if (id) {

        await carregarClinicaParaEdicao(
            id
        );

    } else {

        const campoId =
            document.getElementById(
                "clinicaId"
            );


        if (campoId) {

            campoId.value = "";

        }


        await popularRegioes();

        await popularEspecialidades();


        renderizarEspecialidadesClinica();

    }


    modal.classList.remove(
        "hidden"
    );

}


// ============================================================
// EDITAR CLÍNICA
// ============================================================

async function editarClinica(id) {

    await abrirModalClinica(
        id
    );

}


// ============================================================
// CARREGAR CLÍNICA PARA EDIÇÃO
// ============================================================

async function carregarClinicaParaEdicao(
    id
) {

    const {
        data,
        error
    } = await supabaseClient

        .from("clinicas")

        .select(`
            id,
            nome,
            telefone,
            endereco,
            bairro_id,
            ativo,

            bairros (
                id,
                nome,

                cidades (
                    id,
                    nome,

                    estados (
                        id,
                        nome,

                        regioes (
                            id,
                            nome
                        )
                    )
                )
            ),

            clinica_especialidades (
                id,
                especialidade_id,
                rede,
                ativo,

                especialidades (
                    id,
                    nome
                )
            )
        `)

        .eq(
            "id",
            id
        )

        .single();


    if (error) {

        console.error(
            "Erro ao carregar clínica:",
            error
        );

        alert(
            "Não foi possível carregar a clínica."
        );

        return;

    }


    definirValor(
        "clinicaId",
        data.id
    );


    definirValor(
        "clinicaNome",
        data.nome
    );


    definirValor(
        "clinicaEndereco",
        data.endereco
    );


    definirValor(
        "clinicaTelefone",
        data.telefone
    );


    const campoAtivo =
        document.getElementById(
            "clinicaAtivo"
        );


    if (campoAtivo) {

        campoAtivo.checked =
            data.ativo !== false;

    }


    await popularRegioes();


    const regiaoId =
        data.bairros
            ?.cidades
            ?.estados
            ?.regioes
            ?.id;


    const estadoId =
        data.bairros
            ?.cidades
            ?.estados
            ?.id;


    const cidadeId =
        data.bairros
            ?.cidades
            ?.id;


    if (regiaoId) {

        definirValor(
            "clinicaRegiao",
            regiaoId
        );

    }


    await popularEstados(
        regiaoId || ""
    );


    if (estadoId) {

        definirValor(
            "clinicaEstado",
            estadoId
        );

    }


    await popularCidades(
        estadoId || ""
    );


    if (cidadeId) {

        definirValor(
            "clinicaCidade",
            cidadeId
        );

    }


    await popularBairros(
        cidadeId || ""
    );


    if (data.bairro_id) {

        definirValor(
            "clinicaBairro",
            data.bairro_id
        );

    }


    especialidadesClinicaTemp =
        (
            data.clinica_especialidades ||
            []
        ).map(function (item) {

            return {

                especialidade_id:
                    item.especialidade_id,

                nome:
                    item.especialidades
                        ?.nome || "",

                rede:
                    item.rede,

                ativo:
                    item.ativo !== false

            };

        });


    await popularEspecialidades();


    renderizarEspecialidadesClinica();

}


// ============================================================
// FECHAR MODAL
// ============================================================

function fecharModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "hidden"
    );


    clinicaEditandoId =
        null;


    especialidadesClinicaTemp =
        [];

}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(
    event
) {

    if (event) {

        event.preventDefault();

    }


    const nome =
        document.getElementById(
            "clinicaNome"
        )?.value.trim();


    const endereco =
        document.getElementById(
            "clinicaEndereco"
        )?.value.trim();


    const telefone =
        document.getElementById(
            "clinicaTelefone"
        )?.value.trim();


    const bairroId =
        document.getElementById(
            "clinicaBairro"
        )?.value;


    const ativo =
        document.getElementById(
            "clinicaAtivo"
        )?.checked !== false;


    if (!nome) {

        alert(
            "Informe o nome da clínica."
        );

        return;

    }


    if (!bairroId) {

        alert(
            "Selecione o bairro."
        );

        return;

    }


    const dadosClinica = {

        nome,

        endereco,

        telefone,

        bairro_id:
            Number(bairroId),

        ativo

    };


    let clinicaId =
        clinicaEditandoId;


    try {

        if (clinicaId) {

            const {
                error
            } = await supabaseClient

                .from("clinicas")

                .update(
                    dadosClinica
                )

                .eq(
                    "id",
                    clinicaId
                );


            if (error) {

                throw error;

            }

        } else {

            const {
                data,
                error
            } = await supabaseClient

                .from("clinicas")

                .insert(
                    dadosClinica
                )

                .select(
                    "id"
                )

                .single();


            if (error) {

                throw error;

            }


            clinicaId =
                data.id;

        }


        await salvarEspecialidadesClinica(
            clinicaId
        );


        alert(
            "Clínica salva com sucesso!"
        );


        fecharModalClinica();


        await listarClinicas();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar clínica:",
            erro
        );


        alert(
            "Não foi possível salvar a clínica."
        );

    }

}


// ============================================================
// SALVAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function salvarEspecialidadesClinica(
    clinicaId
) {

    const {
        error: erroDelete
    } = await supabaseClient

        .from(
            "clinica_especialidades"
        )

        .delete()

        .eq(
            "clinica_id",
            clinicaId
        );


    if (erroDelete) {

        throw erroDelete;

    }


    if (
        !especialidadesClinicaTemp.length
    ) {

        return;

    }


    const registros = [];


    const combinacoes =
        new Set();


    for (
        const item
        of especialidadesClinicaTemp
    ) {

        if (!item.especialidade_id) {

            continue;

        }


        const rede =
            item.rede ||
            "especialistas";


        const chave =
            `${item.especialidade_id}_${rede}`;


        if (
            combinacoes.has(chave)
        ) {

            continue;

        }


        combinacoes.add(
            chave
        );


        registros.push({

            clinica_id:
                clinicaId,

            especialidade_id:
                item.especialidade_id,

            rede,

            ativo:
                item.ativo !== false

        });

    }


    if (!registros.length) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from(
            "clinica_especialidades"
        )

        .insert(
            registros
        );


    if (error) {

        throw error;

    }

}


// ============================================================
// RENDERIZAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function renderizarEspecialidadesClinica() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !especialidadesClinicaTemp.length
    ) {

        container.innerHTML =
            `<div class="especialidades-vazio">
                Nenhuma especialidade adicionada.
            </div>`;

        return;

    }


    especialidadesClinicaTemp.forEach(
        function (item, index) {

            const linha =
                document.createElement(
                    "div"
                );


            linha.className =
                "especialidade-row";


            linha.innerHTML = `

                <div class="especialidade-nome">
                    ${escapeHTML(
                        item.nome || ""
                    )}
                </div>

                <select
                    class="rede-especialidade"
                    data-index="${index}"
                >

                    <option
                        value="especialistas"
                        ${
                            item.rede ===
                            "especialistas"
                                ? "selected"
                                : ""
                        }
                    >
                        Especialistas
                    </option>

                    <option
                        value="sindilegis"
                        ${
                            item.rede ===
                            "sindilegis"
                                ? "selected"
                                : ""
                        }
                    >
                        Sindilegis
                    </option>

                </select>

                <button
                    type="button"
                    class="btn-remover-especialidade"
                    data-index="${index}"
                >
                    🗑️
                </button>

            `;


            container.appendChild(
                linha
            );

        }
    );


    container
        .querySelectorAll(
            ".rede-especialidade"
        )
        .forEach(function (select) {

            select.addEventListener(
                "change",
                function () {

                    const index =
                        Number(
                            select.dataset.index
                        );


                    if (
                        especialidadesClinicaTemp[
                            index
                        ]
                    ) {

                        especialidadesClinicaTemp[
                            index
                        ].rede =
                            select.value;

                    }

                }
            );

        });


    container
        .querySelectorAll(
            ".btn-remover-especialidade"
        )
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            botao.dataset.index
                        );


                    especialidadesClinicaTemp
                        .splice(
                            index,
                            1
                        );


                    renderizarEspecialidadesClinica();

                }
            );

        });

}


// ============================================================
// ADICIONAR ESPECIALIDADE À CLÍNICA
// ============================================================

async function adicionarEspecialidadeClinica() {

    const especialidades =
        await popularEspecialidades();


    if (
        !especialidades ||
        especialidades.length === 0
    ) {

        alert(
            "Nenhuma especialidade cadastrada."
        );

        return;

    }


    const idsExistentes =
        especialidadesClinicaTemp
            .map(
                item =>
                    String(
                        item.especialidade_id
                    )
            );


    const disponiveis =
        especialidades.filter(
            item =>
                !idsExistentes.includes(
                    String(item.id)
                )
        );


    if (!disponiveis.length) {

        alert(
            "Todas as especialidades já foram adicionadas."
        );

        return;

    }


    const nome =
        prompt(
            "Digite o nome da especialidade:"
        );


    if (!nome) {

        return;

    }


    const especialidade =
        disponiveis.find(
            item =>
                item.nome
                    .toLowerCase()
                    ===
                nome
                    .trim()
                    .toLowerCase()
        );


    if (!especialidade) {

        alert(
            "Especialidade não encontrada."
        );

        return;

    }


    especialidadesClinicaTemp.push({

        especialidade_id:
            especialidade.id,

        nome:
            especialidade.nome,

        rede:
            "especialistas",

        ativo:
            true

    });


    renderizarEspecialidadesClinica();

}


// ============================================================
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(
    id
) {

    const confirmar =
        window.confirm(
            "Deseja realmente excluir esta clínica?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const {
            error
        } = await supabaseClient

            .from(
                "clinica_especialidades"
            )

            .delete()

            .eq(
                "clinica_id",
                id
            );


        if (error) {

            throw error;

        }


        const {
            error: erroClinica
        } = await supabaseClient

            .from("clinicas")

            .delete()

            .eq(
                "id",
                id
            );


        if (erroClinica) {

            throw erroClinica;

        }


        alert(
            "Clínica excluída com sucesso!"
        );


        await listarClinicas();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir clínica:",
            erro
        );


        alert(
            "Não foi possível excluir a clínica."
        );

    }

}


// ============================================================
// ESPECIALIDADES
// ============================================================

async function listarEspecialidades() {

    const lista =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("especialidades")

        .select(
            "id,nome"
        )

        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Erro ao listar especialidades:",
            error
        );

        return;

    }


    lista.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        lista.innerHTML =
            `<div class="vazio">
                Nenhuma especialidade cadastrada.
            </div>`;

        return;

    }


    data.forEach(function (item) {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "item-gerenciamento";


        div.innerHTML = `

            <div class="item-gerenciamento-info">
                <strong>
                    ${escapeHTML(
                        item.nome
                    )}
                </strong>
            </div>

            <div
                class="item-acoes"
                style="
                    display:flex;
                    flex-direction:row;
                    flex-wrap:nowrap;
                    align-items:center;
                    gap:8px;
                    margin-left:auto;
                "
            >

                <button
                    type="button"
                    class="btn-editar"
                    onclick="editarEspecialidade('${item.id}')"
                    style="
                        flex:0 0 auto;
                        white-space:nowrap;
                    "
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    class="btn-excluir"
                    onclick="excluirEspecialidade('${item.id}')"
                    style="
                        flex:0 0 auto;
                        white-space:nowrap;
                    "
                >
                    🗑️ Excluir
                </button>

            </div>

        `;


        lista.appendChild(div);

    });

}


// ============================================================
// ADICIONAR ESPECIALIDADE
// ============================================================

async function adicionarEspecialidade() {

    const nome =
        prompt(
            "Digite o nome da especialidade:"
        );


    if (!nome || !nome.trim()) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("especialidades")

        .insert({

            nome:
                nome.trim()

        });


    if (error) {

        console.error(
            "Erro ao adicionar especialidade:",
            error
        );


        alert(
            "Não foi possível adicionar a especialidade."
        );

        return;

    }


    alert(
        "Especialidade adicionada com sucesso!"
    );


    await listarEspecialidades();

}


// ============================================================
// EDITAR ESPECIALIDADE
// ============================================================

async function editarEspecialidade(
    id
) {

    const {
        data,
        error
    } = await supabaseClient

        .from("especialidades")

        .select(
            "id,nome"
        )

        .eq(
            "id",
            id
        )

        .single();


    if (error) {

        console.error(error);

        return;

    }


    const novoNome =
        prompt(
            "Digite o novo nome:",
            data.nome
        );


    if (
        novoNome === null ||
        !novoNome.trim()
    ) {

        return;

    }


    const {
        error: erroUpdate
    } = await supabaseClient

        .from("especialidades")

        .update({

            nome:
                novoNome.trim()

        })

        .eq(
            "id",
            id
        );


    if (erroUpdate) {

        console.error(
            erroUpdate
        );


        alert(
            "Não foi possível editar."
        );

        return;

    }


    await listarEspecialidades();

}


// ============================================================
// EXCLUIR ESPECIALIDADE
// ============================================================

async function excluirEspecialidade(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta especialidade?"
        )
    ) {

        return;

    }


    try {

        await supabaseClient

            .from(
                "clinica_especialidades"
            )

            .delete()

            .eq(
                "especialidade_id",
                id
            );


        const {
            error
        } = await supabaseClient

            .from("especialidades")

            .delete()

            .eq(
                "id",
                id
            );


        if (error) {

            throw error;

        }


        await listarEspecialidades();


    } catch (erro) {

        console.error(
            "Erro ao excluir especialidade:",
            erro
        );


        alert(
            "Não foi possível excluir a especialidade."
        );

    }

}


// ============================================================
// REGIÕES
// ============================================================

async function listarRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );


    if (!lista) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("regioes")

        .select(
            "id,nome"
        )

        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            error
        );

        return;

    }


    lista.innerHTML = "";


    (data || []).forEach(
        function (item) {

            lista.innerHTML += `

                <div class="item-gerenciamento">

                    <div class="item-gerenciamento-info">
                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>
                    </div>

                    <div
                        class="item-acoes"
                        style="
                            display:flex;
                            flex-direction:row;
                            flex-wrap:nowrap;
                            gap:8px;
                            margin-left:auto;
                        "
                    >

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarRegiao('${item.id}')"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirRegiao('${item.id}')"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `;

        }
    );

}


// ============================================================
// ADICIONAR REGIÃO
// ============================================================

async function adicionarRegiao() {

    const nome =
        prompt(
            "Digite o nome da região:"
        );


    if (!nome || !nome.trim()) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("regioes")

        .insert({

            nome:
                nome.trim()

        });


    if (error) {

        console.error(error);

        alert(
            "Não foi possível adicionar a região."
        );

        return;

    }


    await listarRegioes();

}


// ============================================================
// EDITAR REGIÃO
// ============================================================

async function editarRegiao(
    id
) {

    const {
        data,
        error
    } = await supabaseClient

        .from("regioes")

        .select(
            "id,nome"
        )

        .eq(
            "id",
            id
        )

        .single();


    if (error) {

        console.error(error);

        return;

    }


    const novoNome =
        prompt(
            "Digite o novo nome:",
            data.nome
        );


    if (
        novoNome === null ||
        !novoNome.trim()
    ) {

        return;

    }


    const {
        error: erroUpdate
    } = await supabaseClient

        .from("regioes")

        .update({

            nome:
                novoNome.trim()

        })

        .eq(
            "id",
            id
        );


    if (erroUpdate) {

        console.error(
            erroUpdate
        );

        alert(
            "Não foi possível editar."
        );

        return;

    }


    await listarRegioes();

}


// ============================================================
// EXCLUIR REGIÃO
// ============================================================

async function excluirRegiao(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta região?"
        )
    ) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("regioes")

        .delete()

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir a região."
        );

        return;

    }


    await listarRegioes();

}


// ============================================================
// ESTADOS
// ============================================================

async function listarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("estados")

        .select(`
            id,
            nome,
            regioes (
                nome
            )
        `)

        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML = "";


    (data || []).forEach(
        function (item) {

            lista.innerHTML += `

                <div class="item-gerenciamento">

                    <div class="item-gerenciamento-info">

                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.regioes?.nome || "-"
                            )}
                        </span>

                    </div>

                    <div
                        class="item-acoes"
                        style="
                            display:flex;
                            flex-direction:row;
                            flex-wrap:nowrap;
                            gap:8px;
                            margin-left:auto;
                        "
                    >

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarEstado('${item.id}')"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirEstado('${item.id}')"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `;

        }
    );

}


// ============================================================
// ADICIONAR ESTADO
// ============================================================

async function adicionarEstado() {

    const nome =
        prompt(
            "Digite o nome do estado:"
        );


    if (!nome || !nome.trim()) {

        return;

    }


    const regiaoId =
        prompt(
            "Digite o ID da região:"
        );


    if (!regiaoId) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("estados")

        .insert({

            nome:
                nome.trim(),

            regiao_id:
                regiaoId

        });


    if (error) {

        console.error(error);

        alert(
            "Não foi possível adicionar o estado."
        );

        return;

    }


    await listarEstados();

}


// ============================================================
// EDITAR ESTADO
// ============================================================

async function editarEstado(
    id
) {

    const {
        data,
        error
    } = await supabaseClient

        .from("estados")

        .select(
            "id,nome,regiao_id"
        )

        .eq(
            "id",
            id
        )

        .single();


    if (error) {

        console.error(error);

        return;

    }


    const novoNome =
        prompt(
            "Digite o novo nome:",
            data.nome
        );


    if (
        novoNome === null ||
        !novoNome.trim()
    ) {

        return;

    }


    const {
        error: erroUpdate
    } = await supabaseClient

        .from("estados")

        .update({

            nome:
                novoNome.trim()

        })

        .eq(
            "id",
            id
        );


    if (erroUpdate) {

        console.error(
            erroUpdate
        );

        alert(
            "Não foi possível editar."
        );

        return;

    }


    await listarEstados();

}


// ============================================================
// EXCLUIR ESTADO
// ============================================================

async function excluirEstado(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir este estado?"
        )
    ) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("estados")

        .delete()

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir o estado."
        );

        return;

    }


    await listarEstados();

}


// ============================================================
// CIDADES
// ============================================================

async function listarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("cidades")

        .select(`
            id,
            nome,

            estados (
                nome
            )
        `)

        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML = "";


    (data || []).forEach(
        function (item) {

            lista.innerHTML += `

                <div class="item-gerenciamento">

                    <div class="item-gerenciamento-info">

                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.estados?.nome || "-"
                            )}
                        </span>

                    </div>

                    <div
                        class="item-acoes"
                        style="
                            display:flex;
                            flex-direction:row;
                            flex-wrap:nowrap;
                            gap:8px;
                            margin-left:auto;
                        "
                    >

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarCidade('${item.id}')"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirCidade('${item.id}')"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `;

        }
    );

}


// ============================================================
// ADICIONAR CIDADE
// ============================================================

async function adicionarCidade() {

    const nome =
        prompt(
            "Digite o nome da cidade:"
        );


    if (!nome || !nome.trim()) {

        return;

    }


    const estadoId =
        prompt(
            "Digite o ID do estado:"
        );


    if (!estadoId) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("cidades")

        .insert({

            nome:
                nome.trim(),

            estado_id:
                estadoId

        });


    if (error) {

        console.error(error);

        alert(
            "Não foi possível adicionar a cidade."
        );

        return;

    }


    await listarCidades();

}


// ============================================================
// EDITAR CIDADE
// ============================================================

async function editarCidade(
    id
) {

    const {
        data,
        error
    } = await supabaseClient

        .from("cidades")

        .select(
            "id,nome,estado_id"
        )

        .eq(
            "id",
            id
        )

        .single();


    if (error) {

        console.error(error);

        return;

    }


    const novoNome =
        prompt(
            "Digite o novo nome:",
            data.nome
        );


    if (
        novoNome === null ||
        !novoNome.trim()
    ) {

        return;

    }


    const {
        error: erroUpdate
    } = await supabaseClient

        .from("cidades")

        .update({

            nome:
                novoNome.trim()

        })

        .eq(
            "id",
            id
        );


    if (erroUpdate) {

        console.error(
            erroUpdate
        );

        alert(
            "Não foi possível editar."
        );

        return;

    }


    await listarCidades();

}


// ============================================================
// EXCLUIR CIDADE
// ============================================================

async function excluirCidade(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta cidade?"
        )
    ) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("cidades")

        .delete()

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir a cidade."
        );

        return;

    }


    await listarCidades();

}


// ============================================================
// BAIRROS
// ============================================================

async function listarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("bairros")

        .select(`
            id,
            nome,

            cidades (
                nome,

                estados (
                    nome
                )
            )
        `)

        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML = "";


    (data || []).forEach(
        function (item) {

            lista.innerHTML += `

                <div class="item-gerenciamento">

                    <div class="item-gerenciamento-info">

                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.cidades?.nome || "-"
                            )}
                        </span>

                    </div>

                    <div
                        class="item-acoes"
                        style="
                            display:flex;
                            flex-direction:row;
                            flex-wrap:nowrap;
                            gap:8px;
                            margin-left:auto;
                        "
                    >

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarBairro('${item.id}')"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirBairro('${item.id}')"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `;

        }
    );

}


// ============================================================
// ADICIONAR BAIRRO
// ============================================================

async function adicionarBairro() {

    const nome =
        prompt(
            "Digite o nome do bairro:"
        );


    if (!nome || !nome.trim()) {

        return;

    }


    const cidadeId =
        prompt(
            "Digite o ID da cidade:"
        );


    if (!cidadeId) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("bairros")

        .insert({

            nome:
                nome.trim(),

            cidade_id:
                cidadeId

        });


    if (error) {

        console.error(error);

        alert(
            "Não foi possível adicionar o bairro."
        );

        return;

    }


    await listarBairros();

}


// ============================================================
// EDITAR BAIRRO
// ============================================================

async function editarBairro(
    id
) {

    const {
        data,
        error
    } = await supabaseClient

        .from("bairros")

        .select(
            "id,nome,cidade_id"
        )

        .eq(
            "id",
            id
        )

        .single();


    if (error) {

        console.error(error);

        return;

    }


    const novoNome =
        prompt(
            "Digite o novo nome:",
            data.nome
        );


    if (
        novoNome === null ||
        !novoNome.trim()
    ) {

        return;

    }


    const {
        error: erroUpdate
    } = await supabaseClient

        .from("bairros")

        .update({

            nome:
                novoNome.trim()

        })

        .eq(
            "id",
            id
        );


    if (erroUpdate) {

        console.error(
            erroUpdate
        );

        alert(
            "Não foi possível editar."
        );

        return;

    }


    await listarBairros();

}


// ============================================================
// EXCLUIR BAIRRO
// ============================================================

async function excluirBairro(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir este bairro?"
        )
    ) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("bairros")

        .delete()

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir o bairro."
        );

        return;

    }


    await listarBairros();

}


// ============================================================
// EVENTOS DOS SELECTS DA CLÍNICA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const regiao =
            document.getElementById(
                "clinicaRegiao"
            );


        const estado =
            document.getElementById(
                "clinicaEstado"
            );


        const cidade =
            document.getElementById(
                "clinicaCidade"
            );


        if (regiao) {

            regiao.addEventListener(
                "change",
                async function () {

                    await popularEstados(
                        regiao.value
                    );


                    if (estado) {
                        estado.value = "";
                    }


                    if (cidade) {
                        cidade.innerHTML =
                            `<option value="">
                                Selecione a cidade
                            </option>`;
                    }


                    const bairro =
                        document.getElementById(
                            "clinicaBairro"
                        );


                    if (bairro) {

                        bairro.innerHTML =
                            `<option value="">
                                Selecione o bairro
                            </option>`;

                    }

                }
            );

        }


        if (estado) {

            estado.addEventListener(
                "change",
                async function () {

                    await popularCidades(
                        estado.value
                    );


                    const bairro =
                        document.getElementById(
                            "clinicaBairro"
                        );


                    if (bairro) {

                        bairro.innerHTML =
                            `<option value="">
                                Selecione o bairro
                            </option>`;

                    }

                }
            );

        }


        if (cidade) {

            cidade.addEventListener(
                "change",
                async function () {

                    await popularBairros(
                        cidade.value
                    );

                }
            );

        }

    }
);


// ============================================================
// EXPORTAÇÕES GLOBAIS
// ============================================================

window.mostrarPagina =
    mostrarPagina;

window.abrirModalClinica =
    abrirModalClinica;

window.editarClinica =
    editarClinica;

window.excluirClinica =
    excluirClinica;

window.fecharModalClinica =
    fecharModalClinica;

window.salvarClinica =
    salvarClinica;

window.adicionarEspecialidadeClinica =
    adicionarEspecialidadeClinica;

window.listarClinicas =
    listarClinicas;

window.listarEspecialidades =
    listarEspecialidades;

window.adicionarEspecialidade =
    adicionarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.listarRegioes =
    listarRegioes;

window.adicionarRegiao =
    adicionarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.listarEstados =
    listarEstados;

window.adicionarEstado =
    adicionarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;

window.listarCidades =
    listarCidades;

window.adicionarCidade =
    adicionarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;

window.listarBairros =
    listarBairros;

window.adicionarBairro =
    adicionarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;

window.voltarAoSite =
    voltarAoSite;

window.sair =
    sair;


console.log(
    "admin.js - Parte 2 carregada com sucesso."
);
