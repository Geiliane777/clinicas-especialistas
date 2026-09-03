// ======================================
// TEMA CLARO / ESCURO
// ======================================

console.log("tema.js carregado");

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const btnTema =
            document.getElementById("btnTema");

        if (!btnTema) return;


        // ======================================
        // APLICAR TEMA
        // ======================================

        function aplicarTema(tema) {

            if (tema === "dark") {

                document.body.classList.add(
                    "dark"
                );

                btnTema.innerHTML = "☀️";

                btnTema.title =
                    "Ativar tema claro";

            } else {

                document.body.classList.remove(
                    "dark"
                );

                btnTema.innerHTML = "🌙";

                btnTema.title =
                    "Ativar tema escuro";

            }

        }


        // ======================================
        // CARREGAR TEMA SALVO
        // ======================================

        const temaSalvo =
            localStorage.getItem("tema");

        if (temaSalvo === "dark") {

            aplicarTema("dark");

        } else {

            aplicarTema("light");

        }


        // ======================================
        // ALTERAR TEMA
        // ======================================

        btnTema.addEventListener(
            "click",
            () => {

                const estaEscuro =
                    document.body.classList.toggle(
                        "dark"
                    );


                const novoTema =
                    estaEscuro
                        ? "dark"
                        : "light";


                localStorage.setItem(
                    "tema",
                    novoTema
                );


                aplicarTema(
                    novoTema
                );

            }
        );

    }
);
