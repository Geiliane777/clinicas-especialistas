// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 1 DE 2
// ============================================================

console.log("admin.js carregado");


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const REDE_ESPECIALISTAS = "especialistas";
const REDE_SINDILEGIS = "sindilegis";


// ============================================================
// VERIFICAR LOGIN
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("adminLogado") !== "true") {

        window.location.href = "login.html";

        return;
    }

    inicializarAdmin();
});


// ============================================================
// INICIALIZAÇÃO
// ============================================================

async function inicializarAdmin() {

    atualizarData();

    configurarTema();

    configurarEventosAdmin();

    await carregarDashboard();

    carregarPaginaAtual();

    console.log(
        "Painel administrativo inicializado."
    );
}


// ============================================================
// EVENTOS DO ADMIN
// ============================================================

function configurarEventosAdmin() {

    // ========================================================
    // BOTÃO DE BUSCA DE CLÍNICAS
    // ========================================================

    const campoBusca =
        document.getElementById(
            "buscarClinica"
        );

    const filtroStatus =
        document.getElementById(
            "filtroStatusClinica"
        );


    if (campoBusca) {

        campoBusca.addEventListener(
            "input",
            () => {

                const paginaClinicas =
                    document.getElementById(
                        "pagina-clinicas"
                    );

                if (
                    paginaClinicas &&
                    paginaClinicas.classList.contains("ativa")
                ) {

                    listarClinicas();

                }

            }
        );

    }


    if (filtroStatus) {

        filtroStatus.addEventListener(
            "change",
            () => {

                const paginaClinicas =
                    document.getElementById(
                        "pagina-clinicas"
                    );

                if (
                    paginaClinicas &&
                    paginaClinicas.classList.contains("ativa")
                ) {

                    listarClinicas();

                }

            }
        );

    }


    // ========================================================
    // FORMULÁRIO DA CLÍNICA
    // ========================================================

    const formClinica =
        document.getElementById(
            "formClinica"
        );


    if (formClinica) {

        formClinica.addEventListener(
            "submit",
            salvarClinica
        );

    }


    // ========================================================
    // REGIÃO DA CLÍNICA
    // ========================================================

    const clinicaRegiao =
        document.getElementById(
            "clinicaRegiao"
        );


    if (clinicaRegiao) {

        clinicaRegiao.addEventListener(
            "change",
            () => {

                carregarEstadosClinica(
                    clinicaRegiao.value
                );

            }
        );

    }


    // ========================================================
    // ESTADO DA CLÍNICA
    // ========================================================

    const clinicaEstado =
        document.getElementById(
            "clinicaEstado"
        );


    if (clinicaEstado) {

        clinicaEstado.addEventListener(
            "change",
            () => {

                carregarCidadesClinica(
                    clinicaEstado.value
                );

            }
        );

    }


    // ========================================================
    // CIDADE DA CLÍNICA
    // ========================================================

    const clinicaCidade =
        document.getElementById(
            "clinicaCidade"
        );


    if (clinicaCidade) {

        clinicaCidade.addEventListener(
            "change",
            () => {

                carregarBairrosClinica(
                    clinicaCidade.value
                );

            }
        );

    }


    // ========================================================
    // BOTÕES DO MENU
    // ========================================================

    const botaoVoltar =
        document.querySelector(
            'button[onclick="voltarAoSite()"]'
        );

    const botaoSair =
        document.querySelector(
            'button[onclick="sair()"]'
        );


    if (botaoVoltar) {

        // Remove o onclick do HTML para evitar execução duplicada.
        botaoVoltar.removeAttribute("onclick");

        botaoVoltar.addEventListener(
            "click",
            voltarAoSite
        );

    }


    if (botaoSair) {

        botaoSair.removeAttribute("onclick");

        botaoSair.addEventListener(
            "click",
            sair
        );

    }

}


// ============================================================
// DATA ATUAL
// ============================================================

function atualizarData() {

    const elemento =
        document.getElementById(
            "dataAtual"
        );


    if (!elemento) return;


    const agora =
        new Date();


    elemento.textContent =
        agora.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
}


// ============================================================
// NAVEGAÇÃO
// ============================================================

const TITULOS_PAGINA = {

    dashboard:
        "Dashboard",

    clinicas:
        "Clínicas",

    especialidades:
        "Especialidades",

    regioes:
        "Regiões",

    estados:
        "Estados",

    cidades:
        "Cidades",

    bairros:
        "Bairros"
};


const CARREGADORES_PAGINA = {

    dashboard:
        carregarDashboard,

    clinicas:
        listarClinicas,

    especialidades:
        carregarPaginaEspecialidades,

    regioes:
        carregarPaginaRegioes,

    estados:
        carregarPaginaEstados,

    cidades:
        carregarPaginaCidades,

    bairros:
        carregarPaginaBairros
};


// ============================================================
// MOSTRAR PÁGINA
// ============================================================

function mostrarPagina(nomePagina) {

    const paginas =
        document.querySelectorAll(
            ".pagina"
        );


    paginas.forEach(
        pagina => {

            pagina.classList.remove(
                "ativa"
            );

        }
    );


    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (!pagina) {

        console.error(
            "Página não encontrada:",
            nomePagina
        );

        return;
    }


    pagina.classList.add(
        "ativa"
    );


    // ========================================================
    // TÍTULO
    // ========================================================

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina] ||
            "Painel Administrativo";

    }


    // ========================================================
    // MENU ATIVO
    // ========================================================

    const botoesMenu =
        document.querySelectorAll(
            ".menu-btn"
        );


    botoesMenu.forEach(
        botao => {

            botao.classList.remove(
                "ativo"
            );


            if (
                botao.dataset.page ===
                nomePagina
            ) {

                botao.classList.add(
                    "ativo"
                );

            }

        }
    );


    // ========================================================
    // CARREGAR DADOS
    // ========================================================

    const carregador =
        CARREGADORES_PAGINA[
            nomePagina
        ];


    if (
        typeof carregador ===
        "function"
    ) {

        carregador();

    }

}


// ============================================================
// CARREGAR PÁGINA ATUAL
// ============================================================

function carregarPaginaAtual() {

    const paginaAtiva =
        document.querySelector(
            ".pagina.ativa"
        );


    if (!paginaAtiva) {

        mostrarPagina(
            "dashboard"
        );

        return;
    }


    const id =
        paginaAtiva.id.replace(
            "pagina-",
            ""
        );


    mostrarPagina(id);
}


// ============================================================
// TEMA
// ============================================================

function configurarTema() {

    const temaSalvo =
        localStorage.getItem(
            "temaAdmin"
        );


    if (
        temaSalvo === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }

}


function alternarTema() {

    const escuro =
        document.body.classList.toggle(
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
// VOLTAR AO SITE
// ============================================================

function voltarAoSite(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    const destino =
        new URL(
            "index.html",
            window.location.href
        );


    window.location.assign(
        destino.href
    );
}


// ============================================================
// SAIR
// ============================================================

function sair(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    const confirmar =
        confirm(
            "Deseja realmente sair do painel administrativo?"
        );


    if (!confirmar) return;


    localStorage.removeItem(
        "adminLogado"
    );


    const destino =
        new URL(
            "login.html",
            window.location.href
        );


    window.location.assign(
        destino.href
    );
}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(valor) {

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
        valor;


    return textarea.value;
}


// ============================================================
// DEFINIR TEXTO
// ============================================================

// IMPORTANTE:
// Esta função fica ANTES do Dashboard para não existir
// mais o erro "definirTexto is not defined".
// ============================================================

function definirTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        console.warn(
            `Elemento #${id} não encontrado no HTML.`
        );

        return;
    }


    elemento.textContent =
        texto;
}


// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        const [

            regioes,

            estados,

            cidades,

            bairros,

            especialidades,

            clinicas

        ] = await Promise.all([

            // ==================================================
            // REGIÕES
            // ==================================================

            supabaseClient
                .from("regioes")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // ESTADOS
            // ==================================================

            supabaseClient
                .from("estados")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // CIDADES
            // ==================================================

            supabaseClient
                .from("cidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // BAIRROS
            // ==================================================

            supabaseClient
                .from("bairros")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // ESPECIALIDADES
            // ==================================================

            supabaseClient
                .from("especialidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // CLÍNICAS
            // ==================================================
            // NÃO usamos:
            // created_at
            // numero
            // complemento
            // cep
            //
            // Assim evitamos o erro 400 caso essas colunas
            // não existam na tabela clinicas.
            // ==================================================

            supabaseClient
                .from("clinicas")
                .select(
                    "id, nome, ativo",
                    {
                        count: "exact"
                    }
                )

        ]);


        // ====================================================
        // VERIFICAR ERROS
        // ====================================================

        if (regioes.error) {

            throw regioes.error;

        }


        if (estados.error) {

            throw estados.error;

        }


        if (cidades.error) {

            throw cidades.error;

        }


        if (bairros.error) {

            throw bairros.error;

        }


        if (especialidades.error) {

            throw especialidades.error;

        }


        if (clinicas.error) {

            throw clinicas.error;

        }


        // ====================================================
        // TOTAIS
        // ====================================================

        definirTexto(
            "totalRegioes",
            regioes.count || 0
        );


        definirTexto(
            "totalEstados",
            estados.count || 0
        );


        definirTexto(
            "totalCidades",
            cidades.count || 0
        );


        definirTexto(
            "totalBairros",
            bairros.count || 0
        );


        definirTexto(
            "totalEspecialidades",
            especialidades.count || 0
        );


        // ====================================================
        // CLÍNICAS
        // ====================================================

        const listaClinicas =
            clinicas.data || [];


        const totalClinicas =
            clinicas.count ??
            listaClinicas.length;


        const ativas =
            listaClinicas.filter(
                clinica =>
                    clinica.ativo === true
            ).length;


        const inativas =
            listaClinicas.filter(
                clinica =>
                    clinica.ativo !== true
            ).length;


        definirTexto(
            "totalClinicas",
            totalClinicas
        );


        definirTexto(
            "totalClinicasAtivas",
            ativas
        );


        definirTexto(
            "totalClinicasInativas",
            inativas
        );


        // ====================================================
        // PORCENTAGEM
        // ====================================================

        const porcentagem =
            totalClinicas > 0
                ? Math.round(
                    (
                        ativas /
                        totalClinicas
                    ) * 100
                )
                : 0;


        definirTexto(
            "porcentagemAtivas",
            `${porcentagem}%`
        );


        // ====================================================
        // BARRA
        // ====================================================

        const barra =
            document.getElementById(
                "barraAtivas"
            );


        if (barra) {

            barra.style.width =
                `${porcentagem}%`;

        }


        // ====================================================
        // LEGENDAS
        // ====================================================

        definirTexto(
            "legendaAtivas",
            `Ativas: ${ativas}`
        );


        definirTexto(
            "legendaInativas",
            `Inativas: ${inativas}`
        );


        // ====================================================
        // ÚLTIMAS CLÍNICAS
        // ====================================================

        carregarUltimasClinicas(
            listaClinicas.slice(
                0,
                5
            )
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }
    // ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 1 DE 2
// ============================================================

console.log("admin.js carregado");


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const REDE_ESPECIALISTAS = "especialistas";
const REDE_SINDILEGIS = "sindilegis";


// ============================================================
// VERIFICAR LOGIN
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("adminLogado") !== "true") {

        window.location.href = "login.html";

        return;
    }

    inicializarAdmin();
});


// ============================================================
// INICIALIZAÇÃO
// ============================================================

async function inicializarAdmin() {

    atualizarData();

    configurarTema();

    configurarEventosAdmin();

    await carregarDashboard();

    carregarPaginaAtual();

    console.log(
        "Painel administrativo inicializado."
    );
}


// ============================================================
// EVENTOS DO ADMIN
// ============================================================

function configurarEventosAdmin() {

    // ========================================================
    // BOTÃO DE BUSCA DE CLÍNICAS
    // ========================================================

    const campoBusca =
        document.getElementById(
            "buscarClinica"
        );

    const filtroStatus =
        document.getElementById(
            "filtroStatusClinica"
        );


    if (campoBusca) {

        campoBusca.addEventListener(
            "input",
            () => {

                const paginaClinicas =
                    document.getElementById(
                        "pagina-clinicas"
                    );

                if (
                    paginaClinicas &&
                    paginaClinicas.classList.contains("ativa")
                ) {

                    listarClinicas();

                }

            }
        );

    }


    if (filtroStatus) {

        filtroStatus.addEventListener(
            "change",
            () => {

                const paginaClinicas =
                    document.getElementById(
                        "pagina-clinicas"
                    );

                if (
                    paginaClinicas &&
                    paginaClinicas.classList.contains("ativa")
                ) {

                    listarClinicas();

                }

            }
        );

    }


    // ========================================================
    // FORMULÁRIO DA CLÍNICA
    // ========================================================

    const formClinica =
        document.getElementById(
            "formClinica"
        );


    if (formClinica) {

        formClinica.addEventListener(
            "submit",
            salvarClinica
        );

    }


    // ========================================================
    // REGIÃO DA CLÍNICA
    // ========================================================

    const clinicaRegiao =
        document.getElementById(
            "clinicaRegiao"
        );


    if (clinicaRegiao) {

        clinicaRegiao.addEventListener(
            "change",
            () => {

                carregarEstadosClinica(
                    clinicaRegiao.value
                );

            }
        );

    }


    // ========================================================
    // ESTADO DA CLÍNICA
    // ========================================================

    const clinicaEstado =
        document.getElementById(
            "clinicaEstado"
        );


    if (clinicaEstado) {

        clinicaEstado.addEventListener(
            "change",
            () => {

                carregarCidadesClinica(
                    clinicaEstado.value
                );

            }
        );

    }


    // ========================================================
    // CIDADE DA CLÍNICA
    // ========================================================

    const clinicaCidade =
        document.getElementById(
            "clinicaCidade"
        );


    if (clinicaCidade) {

        clinicaCidade.addEventListener(
            "change",
            () => {

                carregarBairrosClinica(
                    clinicaCidade.value
                );

            }
        );

    }


    // ========================================================
    // BOTÕES DO MENU
    // ========================================================

    const botaoVoltar =
        document.querySelector(
            'button[onclick="voltarAoSite()"]'
        );

    const botaoSair =
        document.querySelector(
            'button[onclick="sair()"]'
        );


    if (botaoVoltar) {

        // Remove o onclick do HTML para evitar execução duplicada.
        botaoVoltar.removeAttribute("onclick");

        botaoVoltar.addEventListener(
            "click",
            voltarAoSite
        );

    }


    if (botaoSair) {

        botaoSair.removeAttribute("onclick");

        botaoSair.addEventListener(
            "click",
            sair
        );

    }

}


// ============================================================
// DATA ATUAL
// ============================================================

function atualizarData() {

    const elemento =
        document.getElementById(
            "dataAtual"
        );


    if (!elemento) return;


    const agora =
        new Date();


    elemento.textContent =
        agora.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
}


// ============================================================
// NAVEGAÇÃO
// ============================================================

const TITULOS_PAGINA = {

    dashboard:
        "Dashboard",

    clinicas:
        "Clínicas",

    especialidades:
        "Especialidades",

    regioes:
        "Regiões",

    estados:
        "Estados",

    cidades:
        "Cidades",

    bairros:
        "Bairros"
};


const CARREGADORES_PAGINA = {

    dashboard:
        carregarDashboard,

    clinicas:
        listarClinicas,

    especialidades:
        carregarPaginaEspecialidades,

    regioes:
        carregarPaginaRegioes,

    estados:
        carregarPaginaEstados,

    cidades:
        carregarPaginaCidades,

    bairros:
        carregarPaginaBairros
};


// ============================================================
// MOSTRAR PÁGINA
// ============================================================

function mostrarPagina(nomePagina) {

    const paginas =
        document.querySelectorAll(
            ".pagina"
        );


    paginas.forEach(
        pagina => {

            pagina.classList.remove(
                "ativa"
            );

        }
    );


    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (!pagina) {

        console.error(
            "Página não encontrada:",
            nomePagina
        );

        return;
    }


    pagina.classList.add(
        "ativa"
    );


    // ========================================================
    // TÍTULO
    // ========================================================

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina] ||
            "Painel Administrativo";

    }


    // ========================================================
    // MENU ATIVO
    // ========================================================

    const botoesMenu =
        document.querySelectorAll(
            ".menu-btn"
        );


    botoesMenu.forEach(
        botao => {

            botao.classList.remove(
                "ativo"
            );


            if (
                botao.dataset.page ===
                nomePagina
            ) {

                botao.classList.add(
                    "ativo"
                );

            }

        }
    );


    // ========================================================
    // CARREGAR DADOS
    // ========================================================

    const carregador =
        CARREGADORES_PAGINA[
            nomePagina
        ];


    if (
        typeof carregador ===
        "function"
    ) {

        carregador();

    }

}


// ============================================================
// CARREGAR PÁGINA ATUAL
// ============================================================

function carregarPaginaAtual() {

    const paginaAtiva =
        document.querySelector(
            ".pagina.ativa"
        );


    if (!paginaAtiva) {

        mostrarPagina(
            "dashboard"
        );

        return;
    }


    const id =
        paginaAtiva.id.replace(
            "pagina-",
            ""
        );


    mostrarPagina(id);
}


// ============================================================
// TEMA
// ============================================================

function configurarTema() {

    const temaSalvo =
        localStorage.getItem(
            "temaAdmin"
        );


    if (
        temaSalvo === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }

}


function alternarTema() {

    const escuro =
        document.body.classList.toggle(
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
// VOLTAR AO SITE
// ============================================================

function voltarAoSite(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    const destino =
        new URL(
            "index.html",
            window.location.href
        );


    window.location.assign(
        destino.href
    );
}


// ============================================================
// SAIR
// ============================================================

function sair(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    const confirmar =
        confirm(
            "Deseja realmente sair do painel administrativo?"
        );


    if (!confirmar) return;


    localStorage.removeItem(
        "adminLogado"
    );


    const destino =
        new URL(
            "login.html",
            window.location.href
        );


    window.location.assign(
        destino.href
    );
}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(valor) {

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
        valor;


    return textarea.value;
}


// ============================================================
// DEFINIR TEXTO
// ============================================================

// IMPORTANTE:
// Esta função fica ANTES do Dashboard para não existir
// mais o erro "definirTexto is not defined".
// ============================================================

function definirTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        console.warn(
            `Elemento #${id} não encontrado no HTML.`
        );

        return;
    }


    elemento.textContent =
        texto;
}


// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        const [

            regioes,

            estados,

            cidades,

            bairros,

            especialidades,

            clinicas

        ] = await Promise.all([

            // ==================================================
            // REGIÕES
            // ==================================================

            supabaseClient
                .from("regioes")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // ESTADOS
            // ==================================================

            supabaseClient
                .from("estados")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // CIDADES
            // ==================================================

            supabaseClient
                .from("cidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // BAIRROS
            // ==================================================

            supabaseClient
                .from("bairros")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // ESPECIALIDADES
            // ==================================================

            supabaseClient
                .from("especialidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // CLÍNICAS
            // ==================================================
            // NÃO usamos:
            // created_at
            // numero
            // complemento
            // cep
            //
            // Assim evitamos o erro 400 caso essas colunas
            // não existam na tabela clinicas.
            // ==================================================

            supabaseClient
                .from("clinicas")
                .select(
                    "id, nome, ativo",
                    {
                        count: "exact"
                    }
                )

        ]);


        // ====================================================
        // VERIFICAR ERROS
        // ====================================================

        if (regioes.error) {

            throw regioes.error;

        }


        if (estados.error) {

            throw estados.error;

        }


        if (cidades.error) {

            throw cidades.error;

        }


        if (bairros.error) {

            throw bairros.error;

        }


        if (especialidades.error) {

            throw especialidades.error;

        }


        if (clinicas.error) {

            throw clinicas.error;

        }


        // ====================================================
        // TOTAIS
        // ====================================================

        definirTexto(
            "totalRegioes",
            regioes.count || 0
        );


        definirTexto(
            "totalEstados",
            estados.count || 0
        );


        definirTexto(
            "totalCidades",
            cidades.count || 0
        );


        definirTexto(
            "totalBairros",
            bairros.count || 0
        );


        definirTexto(
            "totalEspecialidades",
            especialidades.count || 0
        );


        // ====================================================
        // CLÍNICAS
        // ====================================================

        const listaClinicas =
            clinicas.data || [];


        const totalClinicas =
            clinicas.count ??
            listaClinicas.length;


        const ativas =
            listaClinicas.filter(
                clinica =>
                    clinica.ativo === true
            ).length;


        const inativas =
            listaClinicas.filter(
                clinica =>
                    clinica.ativo !== true
            ).length;


        definirTexto(
            "totalClinicas",
            totalClinicas
        );


        definirTexto(
            "totalClinicasAtivas",
            ativas
        );


        definirTexto(
            "totalClinicasInativas",
            inativas
        );


        // ====================================================
        // PORCENTAGEM
        // ====================================================

        const porcentagem =
            totalClinicas > 0
                ? Math.round(
                    (
                        ativas /
                        totalClinicas
                    ) * 100
                )
                : 0;


        definirTexto(
            "porcentagemAtivas",
            `${porcentagem}%`
        );


        // ====================================================
        // BARRA
        // ====================================================

        const barra =
            document.getElementById(
                "barraAtivas"
            );


        if (barra) {

            barra.style.width =
                `${porcentagem}%`;

        }


        // ====================================================
        // LEGENDAS
        // ====================================================

        definirTexto(
            "legendaAtivas",
            `Ativas: ${ativas}`
        );


        definirTexto(
            "legendaInativas",
            `Inativas: ${inativas}`
        );


        // ====================================================
        // ÚLTIMAS CLÍNICAS
        // ====================================================

        carregarUltimasClinicas(
            listaClinicas.slice(
                0,
                5
            )
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}    try {

        // ====================================================
        // EDITAR ESTADO
        // ====================================================

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("estados")
                .update({
                    nome: nome,
                    regiao_id: regiaoId
                })
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }


            alert(
                "Estado atualizado com sucesso."
            );


        } else {

            // =================================================
            // VERIFICAR DUPLICIDADE
            // =================================================

            const {
                data: existente,
                error: erroBusca
            } = await supabaseClient
                .from("estados")
                .select(
                    "id"
                )
                .ilike(
                    "nome",
                    nome
                )
                .limit(1);


            if (erroBusca) {
                throw erroBusca;
            }


            if (
                existente &&
                existente.length
            ) {

                alert(
                    "Esse estado já está cadastrado."
                );

                return;
            }


            // =================================================
            // INSERIR ESTADO
            // =================================================

            const {
                error
            } = await supabaseClient
                .from("estados")
                .insert({
                    nome: nome,
                    regiao_id: regiaoId
                });


            if (error) {
                throw error;
            }


            alert(
                "Estado cadastrado com sucesso."
            );
        }


        limparFormularioEstado();


        await carregarPaginaEstados();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar estado:",
            erro
        );


        alert(
            "Erro ao salvar estado."
        );
    }
}


// ============================================================
// EDITAR ESTADO
// ============================================================

async function editarEstado(
    id,
    nome,
    regiaoId
) {

    const campoId =
        document.getElementById(
            "estadoEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeEstado"
        );


    const campoRegiao =
        document.getElementById(
            "estadoRegiao"
        );


    if (
        !campoId ||
        !campoNome ||
        !campoRegiao
    ) {

        return;
    }


    // ========================================================
    // GARANTIR QUE AS REGIÕES ESTÃO CARREGADAS
    // ========================================================

    await popularSelectRegioes(
        "estadoRegiao"
    );


    campoId.value =
        id;


    campoNome.value =
        decodeHTML(nome);


    campoRegiao.value =
        regiaoId || "";


    campoNome.focus();
}


// ============================================================
// LIMPAR ESTADO
// ============================================================

function limparFormularioEstado() {

    const campoId =
        document.getElementById(
            "estadoEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeEstado"
        );


    const campoRegiao =
        document.getElementById(
            "estadoRegiao"
        );


    if (campoId) {

        campoId.value =
            "";

    }


    if (campoNome) {

        campoNome.value =
            "";

    }


    if (campoRegiao) {

        campoRegiao.value =
            "";

    }
}


// ============================================================
// EXCLUIR ESTADO
// ============================================================

async function excluirEstado(
    id
) {

    const confirmar =
        confirm(
            "ATENÇÃO!\n\n" +
            "Excluir este estado poderá afetar " +
            "cidades, bairros e clínicas vinculados a ele.\n\n" +
            "Deseja continuar?"
        );


    if (!confirmar) return;


    try {

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
            throw error;
        }


        alert(
            "Estado excluído com sucesso."
        );


        await carregarPaginaEstados();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir estado:",
            erro
        );


        alert(
            "Não foi possível excluir o estado. " +
            "Verifique se existem cidades ou outros " +
            "registros vinculados."
        );
    }
}


// ============================================================
// CIDADES
// ============================================================

async function carregarPaginaCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


    lista.innerHTML = `
        <div class="item-gerenciamento item-carregando">
            <span>Carregando...</span>
        </div>
    `;


    await popularSelectEstados(
        "cidadeEstado"
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select(`
                id,
                nome,
                estado_id,
                estados (
                    id,
                    nome
                )
            `)
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        if (!data?.length) {

            lista.innerHTML = `
                <div class="item-gerenciamento item-vazio">
                    <span>
                        Nenhuma cidade cadastrada.
                    </span>
                </div>
            `;

            return;
        }


        lista.innerHTML =
            data.map(
                cidade => `

            <div class="item-gerenciamento">

                <div class="item-gerenciamento-info">

                    <span class="item-gerenciamento-icone">
                        🏙️
                    </span>

                    <div>

                        <strong>
                            ${escaparHTML(
                                cidade.nome
                            )}
                        </strong>

                        <small>
                            Estado:
                            ${escaparHTML(
                                cidade.estados?.nome ||
                                "Não informado"
                            )}
                        </small>

                    </div>

                </div>


                <div
                    class="item-acoes"
                    style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        justify-content:flex-end;
                        gap:8px;
                        flex-wrap:nowrap;
                        width:auto;
                        min-width:max-content;
                        margin-left:auto;
                        flex-shrink:0;
                    "
                >

                    <button
                        type="button"
                        class="btn-editar"
                        style="
                            display:inline-flex;
                            flex:0 0 auto;
                            width:82px;
                            min-width:82px;
                            height:36px;
                            align-items:center;
                            justify-content:center;
                            white-space:nowrap;
                        "
                        onclick="editarCidade(
                            '${cidade.id}',
                            '${escaparHTML(cidade.nome)}',
                            '${cidade.estado_id || ""}'
                        )"
                    >
                        ✏️ Editar
                    </button>


                    <button
                        type="button"
                        class="btn-excluir"
                        style="
                            display:inline-flex;
                            flex:0 0 auto;
                            width:82px;
                            min-width:82px;
                            height:36px;
                            align-items:center;
                            justify-content:center;
                            white-space:nowrap;
                        "
                        onclick="excluirCidade(
                            '${cidade.id}'
                        )"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            </div>

        `
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
            erro
        );


        lista.innerHTML = `
            <div class="item-gerenciamento item-erro">
                <span>
                    Erro ao carregar cidades.
                </span>
            </div>
        `;
    }
}

}
// ============================================================
// POPULAR ESTADOS
// ============================================================

async function popularSelectEstados(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) return;


    const valorAtual =
        select.value;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select(
                "id, nome"
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        select.innerHTML = `
            <option value="">
                Selecione o Estado
            </option>
        `;


        (data || []).forEach(
            estado => {

                select.innerHTML += `
                    <option
                        value="${estado.id}"
                    >
                        ${escaparHTML(
                            estado.nome
                        )}
                    </option>
                `;

            }
        );


        if (valorAtual) {

            select.value =
                valorAtual;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar estados:",
            erro
        );

    }
}


// ============================================================
// SALVAR CIDADE
// ============================================================

async function salvarCidade() {

    const id =
        document.getElementById(
            "cidadeEditId"
        )?.value || "";


    const nome =
        document.getElementById(
            "nomeCidade"
        )?.value.trim() || "";


    const estadoId =
        document.getElementById(
            "cidadeEstado"
        )?.value || "";


    if (!nome) {

        alert(
            "Digite o nome da cidade."
        );

        return;
    }


    if (!estadoId) {

        alert(
            "Selecione o estado."
        );

        return;
    }


    try {

        // ====================================================
        // EDITAR
        // ====================================================

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("cidades")
                .update({
                    nome: nome,
                    estado_id: estadoId
                })
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }


            alert(
                "Cidade atualizada com sucesso."
            );


        } else {

            // =================================================
            // VERIFICAR DUPLICIDADE
            // =================================================

            const {
                data: existente,
                error: erroBusca
            } = await supabaseClient
                .from("cidades")
                .select(
                    "id"
                )
                .ilike(
                    "nome",
                    nome
                )
                .eq(
                    "estado_id",
                    estadoId
                )
                .limit(1);


            if (erroBusca) {
                throw erroBusca;
            }


            if (
                existente &&
                existente.length
            ) {

                alert(
                    "Essa cidade já está cadastrada neste estado."
                );

                return;
            }


            // =================================================
            // INSERIR
            // =================================================

            const {
                error
            } = await supabaseClient
                .from("cidades")
                .insert({
                    nome: nome,
                    estado_id: estadoId
                });


            if (error) {
                throw error;
            }


            alert(
                "Cidade cadastrada com sucesso."
            );
        }


        limparFormularioCidade();


        await carregarPaginaCidades();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar cidade:",
            erro
        );


        alert(
            "Erro ao salvar cidade."
        );
    }
}


// ============================================================
// EDITAR CIDADE
// ============================================================

async function editarCidade(
    id,
    nome,
    estadoId
) {

    const campoId =
        document.getElementById(
            "cidadeEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeCidade"
        );


    const campoEstado =
        document.getElementById(
            "cidadeEstado"
        );


    if (
        !campoId ||
        !campoNome ||
        !campoEstado
    ) {

        return;
    }


    await popularSelectEstados(
        "cidadeEstado"
    );


    campoId.value =
        id;


    campoNome.value =
        decodeHTML(nome);


    campoEstado.value =
        estadoId || "";


    campoNome.focus();
}


// ============================================================
// LIMPAR CIDADE
// ============================================================

function limparFormularioCidade() {

    const campoId =
        document.getElementById(
            "cidadeEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeCidade"
        );


    const campoEstado =
        document.getElementById(
            "cidadeEstado"
        );


    if (campoId) {

        campoId.value =
            "";

    }


    if (campoNome) {

        campoNome.value =
            "";

    }


    if (campoEstado) {

        campoEstado.value =
            "";

    }
}


// ============================================================
// EXCLUIR CIDADE
// ============================================================

async function excluirCidade(
    id
) {

    const confirmar =
        confirm(
            "ATENÇÃO!\n\n" +
            "Excluir esta cidade poderá afetar " +
            "bairros e clínicas vinculados a ela.\n\n" +
            "Deseja continuar?"
        );


    if (!confirmar) return;


    try {

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
            throw error;
        }


        alert(
            "Cidade excluída com sucesso."
        );


        await carregarPaginaCidades();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir cidade:",
            erro
        );


        alert(
            "Não foi possível excluir a cidade. " +
            "Verifique se existem bairros ou outros " +
            "registros vinculados."
        );
    }
}


// ============================================================
// BAIRROS
// ============================================================

async function carregarPaginaBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    lista.innerHTML = `
        <div class="item-gerenciamento item-carregando">
            <span>Carregando...</span>
        </div>
    `;


    await popularSelectCidades(
        "bairroCidade"
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select(`
                id,
                nome,
                cidade_id,
                cidades (
                    id,
                    nome,
                    estados (
                        id,
                        nome
                    )
                )
            `)
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        if (!data?.length) {

            lista.innerHTML = `
                <div class="item-gerenciamento item-vazio">
                    <span>
                        Nenhum bairro cadastrado.
                    </span>
                </div>
            `;

            return;
        }


        lista.innerHTML =
            data.map(
                bairro => `

            <div class="item-gerenciamento">

                <div class="item-gerenciamento-info">

                    <span class="item-gerenciamento-icone">
                        🏘️
                    </span>

                    <div>

                        <strong>
                            ${escaparHTML(
                                bairro.nome
                            )}
                        </strong>

                        <small>
                            Cidade:
                            ${escaparHTML(
                                bairro.cidades?.nome ||
                                "Não informado"
                            )}

                            ${
                                bairro.cidades?.estados?.nome
                                    ? ` - ${escaparHTML(
                                        bairro.cidades.estados.nome
                                    )}`
                                    : ""
                            }
                        </small>

                    </div>

                </div>


                <div
                    class="item-acoes"
                    style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        justify-content:flex-end;
                        gap:8px;
                        flex-wrap:nowrap;
                        width:auto;
                        min-width:max-content;
                        margin-left:auto;
                        flex-shrink:0;
                    "
                >

                    <button
                        type="button"
                        class="btn-editar"
                        style="
                            display:inline-flex;
                            flex:0 0 auto;
                            width:82px;
                            min-width:82px;
                            height:36px;
                            align-items:center;
                            justify-content:center;
                            white-space:nowrap;
                        "
                        onclick="editarBairro(
                            '${bairro.id}',
                            '${escaparHTML(bairro.nome)}',
                            '${bairro.cidade_id || ""}'
                        )"
                    >
                        ✏️ Editar
                    </button>


                    <button
                        type="button"
                        class="btn-excluir"
                        style="
                            display:inline-flex;
                            flex:0 0 auto;
                            width:82px;
                            min-width:82px;
                            height:36px;
                            align-items:center;
                            justify-content:center;
                            white-space:nowrap;
                        "
                        onclick="excluirBairro(
                            '${bairro.id}'
                        )"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            </div>

        `
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar bairros:",
            erro
        );


        lista.innerHTML = `
            <div class="item-gerenciamento item-erro">
                <span>
                    Erro ao carregar bairros.
                </span>
            </div>
        `;
    }
}
// ============================================================
// POPULAR CIDADES
// ============================================================

async function popularSelectCidades(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );

    if (!select) return;

    const valorAtual =
        select.value;

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select(`
                id,
                nome
            `)
            .order(
                "nome"
            );

        if (error) {
            throw error;
        }

        select.innerHTML = `
            <option value="">
                Selecione a Cidade
            </option>
        `;

        (data || []).forEach(
            cidade => {

                select.innerHTML += `
                    <option
                        value="${cidade.id}"
                    >
                        ${escaparHTML(
                            cidade.nome
                        )}
                    </option>
                `;

            }
        );

        if (valorAtual) {

            select.value =
                valorAtual;

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
            erro
        );

    }
}


// ============================================================
// SALVAR BAIRRO
// ============================================================

async function salvarBairro() {

    const id =
        document.getElementById(
            "bairroEditId"
        )?.value || "";

    const nome =
        document.getElementById(
            "nomeBairro"
        )?.value.trim() || "";

    const cidadeId =
        document.getElementById(
            "bairroCidade"
        )?.value || "";

    if (!nome) {

        alert(
            "Digite o nome do bairro."
        );

        return;
    }

    if (!cidadeId) {

        alert(
            "Selecione a cidade."
        );

        return;
    }

    try {

        // ====================================================
        // EDITAR
        // ====================================================

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("bairros")
                .update({
                    nome: nome,
                    cidade_id: cidadeId
                })
                .eq(
                    "id",
                    id
                );

            if (error) {
                throw error;
            }

            alert(
                "Bairro atualizado com sucesso."
            );

        } else {

            // =================================================
            // VERIFICAR DUPLICIDADE
            // =================================================

            const {
                data: existente,
                error: erroBusca
            } = await supabaseClient
                .from("bairros")
                .select(
                    "id"
                )
                .ilike(
                    "nome",
                    nome
                )
                .eq(
                    "cidade_id",
                    cidadeId
                )
                .limit(1);

            if (erroBusca) {
                throw erroBusca;
            }

            if (
                existente &&
                existente.length
            ) {

                alert(
                    "Esse bairro já está cadastrado nesta cidade."
                );

                return;
            }

            // =================================================
            // INSERIR
            // =================================================

            const {
                error
            } = await supabaseClient
                .from("bairros")
                .insert({
                    nome: nome,
                    cidade_id: cidadeId
                });

            if (error) {
                throw error;
            }

            alert(
                "Bairro cadastrado com sucesso."
            );
        }

        limparFormularioBairro();

        await carregarPaginaBairros();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar bairro:",
            erro
        );

        alert(
            "Erro ao salvar bairro."
        );
    }
}


// ============================================================
// EDITAR BAIRRO
// ============================================================

async function editarBairro(
    id,
    nome,
    cidadeId
) {

    const campoId =
        document.getElementById(
            "bairroEditId"
        );

    const campoNome =
        document.getElementById(
            "nomeBairro"
        );

    const campoCidade =
        document.getElementById(
            "bairroCidade"
        );

    if (
        !campoId ||
        !campoNome ||
        !campoCidade
    ) {

        return;
    }

    await popularSelectCidades(
        "bairroCidade"
    );

    campoId.value =
        id;

    campoNome.value =
        decodeHTML(nome);

    campoCidade.value =
        cidadeId || "";

    campoNome.focus();
}


// ============================================================
// LIMPAR BAIRRO
// ============================================================

function limparFormularioBairro() {

    const campoId =
        document.getElementById(
            "bairroEditId"
        );

    const campoNome =
        document.getElementById(
            "nomeBairro"
        );

    const campoCidade =
        document.getElementById(
            "bairroCidade"
        );

    if (campoId) {

        campoId.value =
            "";

    }

    if (campoNome) {

        campoNome.value =
            "";

    }

    if (campoCidade) {

        campoCidade.value =
            "";

    }
}


// ============================================================
// EXCLUIR BAIRRO
// ============================================================

async function excluirBairro(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este bairro?"
        );

    if (!confirmar) return;

    try {

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
            throw error;
        }

        alert(
            "Bairro excluído com sucesso."
        );

        await carregarPaginaBairros();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir bairro:",
            erro
        );

        alert(
            "Não foi possível excluir o bairro. " +
            "Verifique se existem clínicas ou outros " +
            "registros vinculados."
        );
    }
}


// ============================================================
// EXPORTAR FUNÇÕES DA PARTE 1
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

window.salvarEspecialidade =
    salvarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.salvarRegiao =
    salvarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.salvarEstado =
    salvarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;

window.salvarCidade =
    salvarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;

window.salvarBairro =
    salvarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;
