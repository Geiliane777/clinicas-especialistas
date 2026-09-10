console.log("tema.js carregado");


const CHAVE_TEMA = "tema";


// ============================================================
// APLICAR TEMA
// ============================================================

function aplicarTema(tema) {

    const body =
        document.body;

    const botao =
        document.getElementById("btnTema");


    if (!body) {
        return;
    }


    if (tema === "dark") {

        body.classList.add("dark");

    } else {

        body.classList.remove("dark");

    }


    if (botao) {

        if (tema === "dark") {

            botao.textContent = "☀️";

            botao.title =
                "Ativar tema claro";

            botao.setAttribute(
                "aria-label",
                "Ativar tema claro"
            );

        } else {

            botao.textContent = "🌙";

            botao.title =
                "Ativar tema escuro";

            botao.setAttribute(
                "aria-label",
                "Ativar tema escuro"
            );

        }

    }

}


// ============================================================
// TEMA SALVO
// ============================================================

function obterTemaSalvo() {

    const tema =
        localStorage.getItem(
            CHAVE_TEMA
        );


    if (
        tema === "dark" ||
        tema === "light"
    ) {

        return tema;

    }


    return "light";
}


// ============================================================
// ALTERNAR
// ============================================================

function alternarTema() {

    const atual =
        obterTemaSalvo();


    const novoTema =
        atual === "dark"
            ? "light"
            : "dark";


    localStorage.setItem(
        CHAVE_TEMA,
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

        const tema =
            obterTemaSalvo();


        aplicarTema(
            tema
        );


        const botao =
            document.getElementById(
                "btnTema"
            );


        if (botao) {

            botao.addEventListener(
                "click",
                alternarTema
            );

        }


        console.log(
            "Sistema de tema configurado."
        );

    }
);


// ============================================================
// EXPORTAR
// ============================================================

window.aplicarTema =
    aplicarTema;

window.alternarTema =
    alternarTema;
