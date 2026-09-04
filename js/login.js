// ======================================
// LOGIN.JS
// ======================================

console.log("login.js carregado");


// ======================================
// CONFIGURAÇÃO
// ======================================


const USUARIO_ADMIN = "admin";
const SENHA_ADMIN = "123456";


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        verificarSessao();

        iniciarFormularioLogin();

    }
);


// ======================================
// VERIFICAR SESSÃO
// ======================================

function verificarSessao() {

    const logado =
        localStorage.getItem(
            "adminLogado"
        );


    // Se já estiver logado,
    // vai direto para o painel

    if (logado === "true") {

        window.location.href =
            "./admin.html";

    }

}


// ======================================
// FORMULÁRIO
// ======================================

function iniciarFormularioLogin() {

    const form =
        document.getElementById(
            "formLogin"
        );


    if (!form) {

        console.error(
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


    // Limpa mensagem anterior

    mensagem.textContent = "";

    mensagem.classList.remove(
        "erro",
        "sucesso"
    );


    // ==================================
    // VALIDA LOGIN
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


        mensagem.textContent =
            "Login realizado com sucesso!";


        mensagem.classList.add(
            "sucesso"
        );


        // Redireciona

        setTimeout(
            () => {

                window.location.href =
                    "./admin.html";

            },
            500
        );

    }

    else {

        mensagem.textContent =
            "Usuário ou senha incorretos.";


        mensagem.classList.add(
            "erro"
        );


        document
            .getElementById(
                "senhaLogin"
            )
            .value = "";

    }

}
