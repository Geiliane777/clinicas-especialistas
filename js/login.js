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


    if (logado === "true") {

        window.location.href =
            "admin.html";

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


    if (
        usuario === USUARIO_ADMIN &&
        senha === SENHA_ADMIN
    ) {

        localStorage.setItem(
            "adminLogado",
            "true"
        );


        mostrarMensagem(
            "Login realizado com sucesso!",
            "sucesso"
        );


        setTimeout(
            () => {

                window.location.href =
                    "admin.html";

            },
            700
        );

    } else {

        mostrarMensagem(
            "Usuário ou senha incorretos.",
            "erro"
        );


        document.getElementById(
            "senhaLogin"
        ).value = "";

    }

}


// ======================================
// MENSAGEM
// ======================================

function mostrarMensagem(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagemLogin"
        );


    if (!mensagem) return;


    mensagem.textContent =
        texto;


    mensagem.className =
        "mensagem-login";


    mensagem.classList.add(tipo);

}
