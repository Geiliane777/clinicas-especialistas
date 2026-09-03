// ======================================
// LOGIN DO PAINEL ADMINISTRATIVO
// ======================================

const USUARIO = "admin";
const SENHA = "123456";


document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // VERIFICAR SESSÃO
    // ======================================

    const logado =
        localStorage.getItem("adminLogado");

    if (logado === "true") {
        mostrarPainel();
    }


    // ======================================
    // BOTÃO LOGIN
    // ======================================

    const btnLogin =
        document.getElementById("btnLogin");

    if (btnLogin) {

        btnLogin.addEventListener(
            "click",
            fazerLogin
        );

    }


    // ======================================
    // ENTER NA SENHA
    // ======================================

    const campoSenha =
        document.getElementById("senha");

    if (campoSenha) {

        campoSenha.addEventListener(
            "keypress",
            function (e) {

                if (e.key === "Enter") {
                    fazerLogin();
                }

            }
        );

    }

});


// ======================================
// FAZER LOGIN
// ======================================

function fazerLogin() {

    const usuario =
        document
            .getElementById("usuario")
            .value
            .trim();

    const senha =
        document
            .getElementById("senha")
            .value
            .trim();

    const mensagem =
        document.getElementById(
            "loginMensagem"
        );


    if (
        usuario === USUARIO &&
        senha === SENHA
    ) {

        localStorage.setItem(
            "adminLogado",
            "true"
        );

        mostrarPainel();

        return;

    }


    mensagem.textContent =
        "Usuário ou senha inválidos.";

}


// ======================================
// MOSTRAR PAINEL
// ======================================

function mostrarPainel() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const painel =
        document.getElementById(
            "painel"
        );


    if (loginScreen) {
        loginScreen.classList.add(
            "hidden"
        );
    }


    if (painel) {
        painel.classList.remove(
            "hidden"
        );
    }

}


// ======================================
// LOGOUT
// ======================================

function logout() {

    localStorage.removeItem(
        "adminLogado"
    );

    location.reload();

}
