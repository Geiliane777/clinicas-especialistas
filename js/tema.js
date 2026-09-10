// ============================================================
// TEMA CLARO / ESCURO
// ============================================================

console.log("tema.js carregado");


// ============================================================
// APLICAR TEMA
// ============================================================

function aplicarTema(tema) {

    const botaoTema =
        document.getElementById("btnTema");


    // --------------------------------------------------------
    // TEMA ESCURO
    // --------------------------------------------------------

    if (tema === "dark") {

        document.body.classList.add("dark");


        if (botaoTema) {

            botaoTema.textContent = "☀️";

            botaoTema.title =
                "Ativar tema claro";

            botaoTema.setAttribute(
                "aria-label",
                "Ativar tema claro"
            );

        }

        return;
    }


    // --------------------------------------------------------
    // TEMA CLARO
    // --------------------------------------------------------

    document.body.classList.remove("dark");


    if (botaoTema) {

        botaoTema.textContent = "🌙";

        botaoTema.title =
            "Ativar tema escuro";

        botaoTema.setAttribute(
            "aria-label",
            "Ativar tema escuro"
        );

    }

}


// ============================================================
// OBTER TEMA SALVO
// ============================================================

function obterTemaSalvo() {

    const tema =
        localStorage.getItem("tema");


    if (
        tema === "dark" ||
        tema === "light"
    ) {

        return tema;

    }


    return "light";

}


// ============================================================
// ALTERAR TEMA
// ============================================================

function alternarTema() {

    const estaEscuro =
        document.body.classList.contains(
            "dark"
        );


    const novoTema =
        estaEscuro
            ? "light"
            : "dark";


    localStorage.setItem(
        "tema",
        novoTema
    );


    aplicarTema(
        novoTema
    );

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const temaInicial =
            obterTemaSalvo();


        aplicarTema(
            temaInicial
        );


        const botaoTema =
            document.getElementById(
                "btnTema"
            );


        if (!botaoTema) {

            console.warn(
                "Botão #btnTema não encontrado."
            );

            return;

        }


        botaoTema.addEventListener(
            "click",
            alternarTema
        );


        console.log(
            "Sistema de tema configurado."
        );

    }
);


// ============================================================
// DISPONIBILIZAR FUNÇÕES
// ============================================================

window.aplicarTema =
    aplicarTema;

window.alternarTema =
    alternarTema;
