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
    iniciarLogin
);


function iniciarLogin() {

    // Se já estiver logado,
    // não faz reload, apenas permite
    // que a pessoa permaneça na página.

    const form =
        document.getElementById(
            "formLogin"
        );


    if (!form) {

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


    mensagem.textContent = "";

    mensagem.className =
        "mensagem-login";


    // ======================================
    // VALIDAÇÃO
    // ======================================

    if (
        usuario !== USUARIO_ADMIN ||
        senha !== SENHA_ADMIN
    ) {

        mensagem.textContent =
            "Usuário ou senha incorretos.";

        mensagem.classList.add(
            "erro"
        );


        document.getElementById(
            "senhaLogin"
        ).value = "";


        return;

    }


    // ======================================
    // SALVAR SESSÃO
    // ======================================

    localStorage.setItem(
        "adminLogado",
        "true"
    );


    mensagem.textContent =
        "Login realizado com sucesso!";


    mensagem.classList.add(
        "sucesso"
    );


    // ======================================
    // REDIRECIONAMENTO
    // ======================================

    setTimeout(
        () => {

            window.location.href =
                "admin.html";

        },
        500
    );

}


// ======================================
// VOLTAR PARA SITE
// ======================================

function voltarParaSite() {

    window.location.href =
        "index.html";

}
