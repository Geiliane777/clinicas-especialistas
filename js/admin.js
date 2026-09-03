// ======================================
// ADMIN.JS
// ======================================

console.log("admin.js carregado");


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarPainel();

    }
);


// ======================================
// INICIAR PAINEL
// ======================================

function iniciarPainel() {

    configurarMenu();

    carregarDashboard();

    carregarRegioesAdmin();

    carregarEstadosAdmin();

    carregarCidadesAdmin();

    carregarBairrosAdmin();

    carregarEspecialidadesAdmin();

    listarClinicas();

    configurarFormularioClinica();

}


// ======================================
// MENU
// ======================================

function configurarMenu() {

    const botoes =
        document.querySelectorAll(
            ".menu-btn"
        );

    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const pagina =
                    botao.dataset.page;

                mostrarPagina(
                    pagina
                );

            }
        );

    });

}


// ======================================
// MOSTRAR PÁGINA
// ======================================

function mostrarPagina(nomePagina) {

    const paginas =
        document.querySelectorAll(
            ".page"
        );

    paginas.forEach(pagina => {

        pagina.classList.add(
            "hidden"
        );

    });


    const paginaSelecionada =
        document.getElementById(
            nomePagina
        );

    if (paginaSelecionada) {

        paginaSelecionada.classList.remove(
            "hidden"
        );

    }


    // ======================================
    // MENU ATIVO
    // ======================================

    const botoes =
        document.querySelectorAll(
            ".menu-btn"
        );

    botoes.forEach(botao => {

        botao.classList.remove(
            "active"
        );

        if (
            botao.dataset.page ===
            nomePagina
        ) {

            botao.classList.add(
                "active"
            );

        }

    });


    // ======================================
    // TÍTULOS
    // ======================================

    const titulos = {

        dashboard:
            "Dashboard",

        clinicas:
            "Gerenciar Clínicas",

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


    const titulo =
        document.getElementById(
            "tituloPagina"
        );

    if (titulo) {

        titulo.textContent =
            titulos[nomePagina];

    }


    // ======================================
    // CARREGAR DADOS
    // ======================================

    if (nomePagina === "dashboard") {

        carregarDashboard();

    }


    if (nomePagina === "clinicas") {

        listarClinicas();

    }


    if (nomePagina === "especialidades") {

        carregarEspecialidadesAdmin();

    }


    if (nomePagina === "regioes") {

        carregarRegioesAdmin();

    }


    if (nomePagina === "estados") {

        carregarEstadosAdmin();

    }


    if (nomePagina === "cidades") {

        carregarCidadesAdmin();

    }


    if (nomePagina === "bairros") {

        carregarBairrosAdmin();

    }

}
