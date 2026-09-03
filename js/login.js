// ======================================
// LOGIN DO PAINEL ADMINISTRATIVO
// ======================================

const USUARIO = "admin";
const SENHA = "123456";


// ======================================
// VERIFICAR SESSÃO
// ======================================

window.addEventListener("load", () => {

    const logado = localStorage.getItem("adminLogado");

    if (logado === "true") {
        mostrarPainel();
    }

});

// ======================================
// EVENTOS
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const btnLogin =
        document.getElementById("btnLogin");

    const campoSenha =
        document.getElementById("senha");

    if (btnLogin) {
        btnLogin.addEventListener(
            "click",
            fazerLogin
        );
    }

    if (campoSenha) {
        campoSenha.addEventListener(
            "keypress",
            function(e) {

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
        document.getElementById("usuario").value.trim();

    const senha =
        document.getElementById("senha").value.trim();

    const mensagem =
        document.getElementById("loginMensagem");

    if (
        usuario === USUARIO &&
        senha === SENHA
    ) {

        localStorage.setItem(
            "adminLogado",
            "true"
        );

        mensagem.innerHTML = "";

        mostrarPainel();

        return;
    }

    mensagem.innerHTML =
        "Usuário ou senha inválidos.";

    mensagem.style.color = "#dc2626";

}

// ======================================
// MOSTRAR PAINEL
// ======================================

function mostrarPainel() {

    const loginScreen =
        document.getElementById("loginScreen");

    const painel =
        document.getElementById("painel");

    if (loginScreen) {
        loginScreen.classList.add("hidden");
    }

    if (painel) {
        painel.classList.remove("hidden");
    }

}

// ======================================
// LOGOUT
// ======================================

function logout() {

    localStorage.removeItem("adminLogado");

    location.reload();

}
