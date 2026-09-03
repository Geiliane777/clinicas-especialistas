// ======================================
// LOGIN.JS
// Login integrado ao admin.html
// ======================================


console.log("login.js carregado");


// ======================================
// CONFIGURAÇÃO DO LOGIN
// ======================================

// ALTERE ESTES DADOS
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


    const telaLogin =
        document.getElementById(
            "telaLogin"
        );


    const painelAdmin =
        document.getElementById(
            "painelAdmin"
        );


    if (logado === "true") {

        // Esconde login
        telaLogin.classList.add(
            "hidden"
        );


        // Mostra painel
        painelAdmin.classList.remove(
            "hidden"
        );

    } else {

        // Mostra login
        telaLogin.classList.remove(
            "hidden"
        );


        // Esconde painel
        painelAdmin.classList.add(
            "hidden"
        );

    }

}


// ======================================
// FORMULÁRIO DE LOGIN
// ======================================

function iniciarFormularioLogin() {

    const form =
        document.getElementById(
            "formLogin"
        );


    if (!form) return;


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


    const usuario =
        document
            .getElementById(
                "usuarioLogin"
            )
            .value
            .trim();


    const senha =
        document
            .getElementById(
                "senhaLogin"
            )
            .value;


    const mensagem =
        document.getElementById(
            "mensagemLogin"
        );


    // Limpa classes anteriores

    mensagem.classList.remove(
        "erro",
        "sucesso"
    );


    // ======================================
    // VALIDAÇÃO
    // ======================================

    if (
        usuario === USUARIO_ADMIN &&
        senha === SENHA_ADMIN
    ) {

        // Salva login

        localStorage.setItem(
            "adminLogado",
            "true"
        );


        mensagem.textContent =
            "Login realizado com sucesso!";


        mensagem.classList.add(
            "sucesso"
        );


        // Aguarda um pouco antes de abrir painel

        setTimeout(
            () => {

                mostrarPainel();

            },
            500
        );

    } else {

        mensagem.textContent =
            "Usuário ou senha incorretos.";


        mensagem.classList.add(
            "erro"
        );


        // Limpa senha

        document.getElementById(
            "senhaLogin"
        ).value = "";

    }

}


// ======================================
// MOSTRAR PAINEL
// ======================================

function mostrarPainel() {

    const telaLogin =
        document.getElementById(
            "telaLogin"
        );


    const painelAdmin =
        document.getElementById(
            "painelAdmin"
        );


    telaLogin.classList.add(
        "hidden"
    );


    painelAdmin.classList.remove(
        "hidden"
    );


    // Carrega dashboard caso a função exista

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

    // Remove sessão

    localStorage.removeItem(
        "adminLogado"
    );


    const telaLogin =
        document.getElementById(
            "telaLogin"
        );


    const painelAdmin =
        document.getElementById(
            "painelAdmin"
        );


    // Esconde painel

    painelAdmin.classList.add(
        "hidden"
    );


    // Mostra login

    telaLogin.classList.remove(
        "hidden"
    );


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
