// ======================================
// LOGIN.JS
// CONTROLE DE LOGIN DO PAINEL
// ======================================

console.log("login.js carregado");


// ======================================
// CONFIGURAÇÃO DO LOGIN
// ======================================

const USUARIO_ADMIN = "admin";
const SENHA_ADMIN = "123456";


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        verificarLogin();

        iniciarFormularioLogin();

    }
);


// ======================================
// VERIFICAR SESSÃO
// ======================================

function verificarLogin() {

    const logado =
        localStorage.getItem(
            "adminLogado"
        );


    const loginContainer =
        document.getElementById(
            "loginContainer"
        );


    const painel =
        document.getElementById(
            "painel"
        );


    // Evita erro caso a página não tenha
    // os elementos de login

    if (!loginContainer || !painel) {

        console.warn(
            "Elementos de login ou painel não encontrados."
        );

        return;

    }


    // ==================================
    // USUÁRIO LOGADO
    // ==================================

    if (logado === "true") {

        // Esconde login

        loginContainer
            .classList
            .add("hidden");


        // Mostra painel

        painel
            .classList
            .remove("hidden");


        // Carrega dashboard

        if (
            typeof carregarDashboard ===
            "function"
        ) {

            carregarDashboard();

        }

    }


    // ==================================
    // USUÁRIO NÃO LOGADO
    // ==================================

    else {

        // Mostra login

        loginContainer
            .classList
            .remove("hidden");


        // Esconde painel

        painel
            .classList
            .add("hidden");

    }

}


// ======================================
// INICIAR FORMULÁRIO
// ======================================

function iniciarFormularioLogin() {

    const form =
        document.getElementById(
            "formLogin"
        );


    if (!form) {

        console.warn(
            "Formulário de login não encontrado."
        );

        return;

    }


    form.addEventListener(
        "submit",
        fazerLogin
    );

}


// ======================================
// FAZER LOGIN
// ======================================

function fazerLogin(event) {

    event.preventDefault();


    const usuarioInput =
        document.getElementById(
            "usuarioLogin"
        );


    const senhaInput =
        document.getElementById(
            "senhaLogin"
        );


    const mensagem =
        document.getElementById(
            "mensagemLogin"
        );


    // Verifica se os campos existem

    if (!usuarioInput || !senhaInput) {

        console.error(
            "Campos de login não encontrados."
        );

        return;

    }


    const usuario =
        usuarioInput.value.trim();


    const senha =
        senhaInput.value;


    // Limpa mensagem anterior

    if (mensagem) {

        mensagem.textContent = "";

        mensagem.classList.remove(
            "erro",
            "sucesso"
        );

    }


    // ==================================
    // LOGIN CORRETO
    // ==================================

    if (
        usuario === USUARIO_ADMIN &&
        senha === SENHA_ADMIN
    ) {

        // Salva sessão

        localStorage.setItem(
            "adminLogado",
            "true"
        );


        // Mensagem

        if (mensagem) {

            mensagem.textContent =
                "Login realizado com sucesso!";

            mensagem.classList.add(
                "sucesso"
            );

        }


        // Abre painel

        setTimeout(
            () => {

                mostrarPainel();

            },
            500
        );

    }


    // ==================================
    // LOGIN INCORRETO
    // ==================================

    else {

        if (mensagem) {

            mensagem.textContent =
                "Usuário ou senha incorretos.";

            mensagem.classList.add(
                "erro"
            );

        }


        // Limpa senha

        senhaInput.value = "";

    }

}


// ======================================
// MOSTRAR PAINEL
// ======================================

function mostrarPainel() {

    const loginContainer =
        document.getElementById(
            "loginContainer"
        );


    const painel =
        document.getElementById(
            "painel"
        );


    if (!loginContainer || !painel) {

        console.error(
            "Login ou painel não encontrado."
        );

        return;

    }


    // Esconde login

    loginContainer
        .classList
        .add("hidden");


    // Mostra painel

    painel
        .classList
        .remove("hidden");


    // Carrega dashboard

    if (
        typeof carregarDashboard ===
        "function"
    ) {

        carregarDashboard();

    }

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


    // Remove sessão

    localStorage.removeItem(
        "adminLogado"
    );


    const loginContainer =
        document.getElementById(
            "loginContainer"
        );


    const painel =
        document.getElementById(
            "painel"
        );


    // Esconde painel

    if (painel) {

        painel
            .classList
            .add("hidden");

    }


    // Mostra login

    if (loginContainer) {

        loginContainer
            .classList
            .remove("hidden");

    }


    // Limpa formulário

    document
        .getElementById(
            "formLogin"
        )
        ?.reset();


    // Limpa mensagem

    const mensagem =
        document.getElementById(
            "mensagemLogin"
        );


    if (mensagem) {

        mensagem.textContent = "";

        mensagem.classList.remove(
            "erro",
            "sucesso"
        );

    }

}
