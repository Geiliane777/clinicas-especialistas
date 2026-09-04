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

    regioes: "Regiões",

    estados: "Estados",

    cidades: "Cidades",

    bairros: "Bairros",

    especialidades: "Especialidades",

    clinicas: "Clínicas Credenciadas"

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


        await mostrarPagina(
            "dashboard"
        );

    }
);


// ======================================
// NAVEGAÇÃO
// ======================================

async function mostrarPagina(nomePagina) {

    // Remove página ativa

    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove(
                "ativa"
            );

        });


    // Ativa página selecionada

    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (pagina) {

        pagina.classList.add(
            "ativa"
        );

    }


    // Atualiza título

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina]
            || "Painel";

    }


    // Atualiza menu

    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    const botaoAtivo =
        document.querySelector(
            `[data-pagina="${nomePagina}"]`
        );


    if (botaoAtivo) {

        botaoAtivo.classList.add(
            "active"
        );

    }


    // Scroll para o topo

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    // Carregadores

    if (
        nomePagina === "dashboard"
    ) {

        await carregarDashboard();

    }


    if (
        nomePagina === "regioes"
    ) {

        await listarRegioes();

    }


    if (
        nomePagina === "estados"
    ) {

        await carregarRegioesSelect();

        await listarEstados();

    }


    if (
        nomePagina === "cidades"
    ) {

        await carregarEstadosSelect();

        await listarCidades();

    }


    if (
        nomePagina === "bairros"
    ) {

        await carregarCidadesSelect();

        await listarBairros();

    }


    if (
        nomePagina === "especialidades"
    ) {

        await listarEspecialidades();

    }


    if (
        nomePagina === "clinicas"
    ) {

        await listarClinicas();

    }

}


// ======================================
// VOLTAR PARA O SITE
// ======================================

function voltarParaSite() {

    window.location.href =
        "index.html";

}


// ======================================
// LOGOUT
// ======================================

function logout() {

    const confirmar =
        confirm(
            "Deseja sair do painel administrativo?"
        );


    if (!confirmar) return;


    localStorage.removeItem(
        "adminLogado"
    );


    window.location.href =
        "login.html";

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        const [

            clinicas,
            especialidades,
            cidades,
            bairros

        ] = await Promise.all([

            supabaseClient
                .from("clinicas")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),

            supabaseClient
                .from("especialidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),

            supabaseClient
                .from("cidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),

            supabaseClient
                .from("bairros")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )

        ]);


        const totalClinicas =
            document.getElementById(
                "totalClinicas"
            );


        const totalEspecialidades =
            document.getElementById(
                "totalEspecialidades"
            );


        const totalCidades =
            document.getElementById(
                "totalCidades"
            );


        const totalBairros =
            document.getElementById(
                "totalBairros"
            );


        if (totalClinicas) {

            totalClinicas.textContent =
                clinicas.count || 0;

        }


        if (totalEspecialidades) {

            totalEspecialidades.textContent =
                especialidades.count || 0;

        }


        if (totalCidades) {

            totalCidades.textContent =
                cidades.count || 0;

        }


        if (totalBairros) {

            totalBairros.textContent =
                bairros.count || 0;

        }

    } catch (error) {

        console.error(
            "Erro dashboard:",
            error
        );

    }

}


// ======================================
// REGIÕES
// ======================================

async function listarRegioes() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("regioes")
