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
            "admin.html";

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


    const usuario =
        usuarioInput.value.trim();


    const senha =
        senhaInput.value;


    // Limpar mensagem anterior

    mensagem.textContent = "";

    mensagem.classList.remove(
        "erro",
        "sucesso"
    );


    // ======================================
    // VALIDAR CAMPOS
    // ======================================

    if (!usuario || !senha) {

        mostrarMensagem(
            "Preencha usuário e senha.",
            "erro"
        );

        return;

    }


    // ======================================
    // VALIDAR LOGIN
    // ======================================

    if (
        usuario === USUARIO_ADMIN &&
        senha === SENHA_ADMIN
    ) {

        // Salvar sessão

        localStorage.setItem(
            "adminLogado",
            "true"
        );


        // Mostrar mensagem

        mostrarMensagem(
            "Login realizado com sucesso!",
            "sucesso"
        );


        // Desabilitar botão temporariamente

        const botao =
            document.querySelector(
                ".btn-login"
            );


        if (botao) {

            botao.disabled = true;

            botao.innerHTML = `
                Entrando...
            `;

        }


        // Redirecionar

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


        // Limpar senha

        senhaInput.value = "";


        // Focar senha

        senhaInput.focus();

    }

}


// ======================================
// MOSTRAR MENSAGEM
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


    mensagem.classList.remove(
        "erro",
        "sucesso"
    );


    mensagem.classList.add(
        tipo
    );

}


// ======================================
// VOLTAR PARA O SITE
// ======================================

function voltarParaSite() {

    window.location.href =
        "index.html";

}
