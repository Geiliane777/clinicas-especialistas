// ============================================================
// CARDS.JS
// Cards das clínicas - Rede Especialistas / Sindilegis
// ============================================================

console.log("cards.js carregado");


// ============================================================
// SEGURANÇA - ESCAPAR TEXTO
// ============================================================

function escaparTextoCard(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// IDENTIFICAR A REDE
// ============================================================

function normalizarRedeCard(rede) {

    if (!rede) {
        return "";
    }

    const valor = String(rede)
        .trim()
        .toLowerCase();

    if (valor === "especialistas") {
        return "especialistas";
    }

    if (valor === "sindilegis") {
        return "sindilegis";
    }

    return valor;
}


function obterRedeCard() {

    if (
        document.body &&
        document.body.classList.contains("sindilegis")
    ) {
        return "sindilegis";
    }

    return "especialistas";
}


// ============================================================
// FORMATAR TELEFONE
// ============================================================

function formatarTelefoneCard(telefone) {

    if (!telefone) {
        return "";
    }

    const numeros = String(telefone).replace(/\D/g, "");

    if (numeros.length === 11) {

        return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;

    }

    if (numeros.length === 10) {

        return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;

    }

    return telefone;
}


// ============================================================
// LINK TELEFONE
// ============================================================

function criarLinkTelefoneCard(telefone) {

    if (!telefone) {
        return "";
    }

    const numeros = String(telefone).replace(/\D/g, "");

    if (!numeros) {
        return "";
    }

    return `tel:${numeros}`;
}


// ============================================================
// LINK WHATSAPP
// ============================================================

function criarLinkWhatsAppCard(whatsapp) {

    if (!whatsapp) {
        return "";
    }

    let numeros = String(whatsapp).replace(/\D/g, "");

    if (!numeros) {
        return "";
    }

    // Se tiver 10 ou 11 números e não tiver código do Brasil
    if (
        numeros.length === 10 ||
        numeros.length === 11
    ) {
        numeros = "55" + numeros;
    }

    return `https://wa.me/${numeros}`;
}


// ============================================================
// OBTÉM LOCALIZAÇÃO
// ============================================================

function obterLocalizacaoCard(clinica) {

    const bairro = clinica?.bairros;

    if (!bairro) {
        return "";
    }

    const cidade = bairro.cidades;

    if (!cidade) {
        return bairro.nome || "";
    }

    const estado = cidade.estados;

    if (!estado) {
        return `${bairro.nome || ""} • ${cidade.nome || ""}`;
    }

    return [
        bairro.nome,
        cidade.nome,
        estado.nome
    ]
        .filter(Boolean)
        .join(" • ");
}


// ============================================================
// OBTÉM ENDEREÇO
// ============================================================

function obterEnderecoCard(clinica) {

    const partes = [];

    if (clinica.endereco) {
        partes.push(clinica.endereco);
    }

    if (clinica.numero) {
        partes.push(`nº ${clinica.numero}`);
    }

    if (clinica.complemento) {
        partes.push(clinica.complemento);
    }

    if (clinica.cep) {
        partes.push(`CEP ${clinica.cep}`);
    }

    return partes.join(" • ");
}


// ============================================================
// LINK GOOGLE MAPS
// ============================================================

function criarLinkMapaCard(clinica) {

    const partes = [];

    if (clinica.nome) {
        partes.push(clinica.nome);
    }

    if (clinica.endereco) {
        partes.push(clinica.endereco);
    }

    if (clinica.numero) {
        partes.push(clinica.numero);
    }

    if (clinica.bairros?.nome) {
        partes.push(clinica.bairros.nome);
    }

    if (clinica.bairros?.cidades?.nome) {
        partes.push(clinica.bairros.cidades.nome);
    }

    if (clinica.bairros?.cidades?.estados?.nome) {
        partes.push(clinica.bairros.cidades.estados.nome);
    }

    const endereco = partes
        .filter(Boolean)
        .join(", ");

    if (!endereco) {
        return "";
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}


// ============================================================
// ESPECIALIDADES DA REDE
// ============================================================

function obterEspecialidadesDaRede(clinica) {

    const redeAtual = obterRedeCard();

    if (!Array.isArray(clinica?.clinica_especialidades)) {
        return [];
    }

    const especialidades = clinica.clinica_especialidades
        .filter(item => {

            const rede = normalizarRedeCard(item.rede);

            return (
                item.ativo === true &&
                rede === redeAtual &&
                item.especialidades
            );
        })
        .map(item => {

            return {
                id: item.especialidades.id,
                nome: item.especialidades.nome
            };

        })
        .filter(item => item.nome);

    // Remove duplicadas
    const mapa = new Map();

    especialidades.forEach(item => {
        mapa.set(item.id, item);
    });

    return Array.from(mapa.values())
        .sort((a, b) =>
            a.nome.localeCompare(
                b.nome,
                "pt-BR"
            )
        );
}


// ============================================================
// RENDERIZAR ESPECIALIDADES
// ============================================================

function renderizarEspecialidadesCard(clinica) {

    const especialidades =
        obterEspecialidadesDaRede(clinica);

    if (!especialidades.length) {

        return `
            <div class="especialidades-box">
                <div class="especialidades-titulo">
                    <span>🦷</span>
                    <strong>Especialidades</strong>
                </div>

                <span class="sem-especialidades">
                    Não informado
                </span>
            </div>
        `;
    }

    return `
        <div class="especialidades-box">

            <div class="especialidades-titulo">
                <span>🦷</span>
                <strong>Especialidades</strong>
            </div>

            <div class="tags">

                ${especialidades
                    .map(especialidade => `
                        <span class="tag">
                            ${escaparTextoCard(especialidade.nome)}
                        </span>
                    `)
                    .join("")}

            </div>

        </div>
    `;
}


// ============================================================
// RENDERIZAR UMA CLÍNICA
// ============================================================

function renderizarCardClinica(clinica) {

    const redeAtual = obterRedeCard();

    const nome =
        escaparTextoCard(
            clinica.nome || "Clínica sem nome"
        );

    const endereco =
        escaparTextoCard(
            obterEnderecoCard(clinica)
        );

    const localizacao =
        escaparTextoCard(
            obterLocalizacaoCard(clinica)
        );

    const telefoneFormatado =
        formatarTelefoneCard(
            clinica.telefone
        );

    const telefone =
        escaparTextoCard(
            telefoneFormatado
        );

    const email =
        escaparTextoCard(
            clinica.email
        );

    const linkTelefone =
        criarLinkTelefoneCard(
            clinica.telefone
        );

    const linkWhatsApp =
        criarLinkWhatsAppCard(
            clinica.whatsapp
        );

    const linkMapa =
        criarLinkMapaCard(
            clinica
        );


    // --------------------------------------------------------
    // REDE
    // --------------------------------------------------------

    const nomeRede =
        redeAtual === "sindilegis"
            ? "Sindilegis"
            : "Rede Especialistas";


    // --------------------------------------------------------
    // CLASSE DO CARD
    // --------------------------------------------------------

    const classeRede =
        redeAtual === "sindilegis"
            ? "card-rede-sindilegis"
            : "card-rede-especialistas";


    // --------------------------------------------------------
    // ENDEREÇO
    // --------------------------------------------------------

    const blocoEndereco = endereco
        ? `
            <div class="card-info-item">

                <div class="card-info-icone">
                    📍
                </div>

                <div class="card-info-conteudo">

                    <span class="card-info-label">
                        Endereço
                    </span>

                    <span class="card-info-valor">
                        ${endereco}
                    </span>

                </div>

            </div>
        `
        : "";


    // --------------------------------------------------------
    // LOCALIZAÇÃO
    // --------------------------------------------------------

    const blocoLocalizacao = localizacao
        ? `
            <div class="card-info-item">

                <div class="card-info-icone">
                    📌
                </div>

                <div class="card-info-conteudo">

                    <span class="card-info-label">
                        Localização
                    </span>

                    <span class="card-info-valor">
                        ${localizacao}
                    </span>

                </div>

            </div>
        `
        : "";


    // --------------------------------------------------------
    // TELEFONE
    // --------------------------------------------------------

    const blocoTelefone = telefone
        ? `
            <div class="card-info-item">

                <div class="card-info-icone">
                    📞
                </div>

                <div class="card-info-conteudo">

                    <span class="card-info-label">
                        Telefone
                    </span>

                    <span class="card-info-valor">

                        <a
                            href="${linkTelefone}"
                            class="card-link-telefone"
                        >
                            ${telefone}
                        </a>

                    </span>

                </div>

            </div>
        `
        : "";


    // --------------------------------------------------------
    // EMAIL
    // --------------------------------------------------------

    const blocoEmail = email
        ? `
            <div class="card-info-item">

                <div class="card-info-icone">
                    ✉️
                </div>

                <div class="card-info-conteudo">

                    <span class="card-info-label">
                        E-mail
                    </span>

                    <span class="card-info-valor">

                        <a
                            href="mailto:${email}"
                            class="card-link-email"
                        >
                            ${email}
                        </a>

                    </span>

                </div>

            </div>
        `
        : "";


    // --------------------------------------------------------
    // WHATSAPP
    // --------------------------------------------------------

    const botaoWhatsApp = linkWhatsApp
        ? `
            <a
                href="${linkWhatsApp}"
                target="_blank"
                rel="noopener noreferrer"
                class="btnAcao btn-whatsapp"
            >
                <span>💬</span>
                WhatsApp
            </a>
        `
        : "";


    // --------------------------------------------------------
    // MAPA
    // --------------------------------------------------------

    const botaoMapa = linkMapa
        ? `
            <a
                href="${linkMapa}"
                target="_blank"
                rel="noopener noreferrer"
                class="btnAcao btn-mapa"
            >
                <span>📍</span>
                Ver no mapa
            </a>
        `
        : "";


    // --------------------------------------------------------
    // BOTÃO LIGAR
    // --------------------------------------------------------

    const botaoLigar = linkTelefone
        ? `
            <a
                href="${linkTelefone}"
                class="btnAcao btn-ligar"
            >
                <span>📞</span>
                Ligar
            </a>
        `
        : "";


    // --------------------------------------------------------
    // CARD COMPLETO
    // --------------------------------------------------------

    return `

        <article class="card ${classeRede}">

            <!-- CABEÇALHO -->

            <div class="cardHeader">

                <div class="cardHeader-esquerda">

                    <div class="card-icone-clinica">
                        🦷
                    </div>

                    <div class="card-identificacao">

                        <h3 class="card-nome">
                            ${nome}
                        </h3>

                        <div class="card-rede">

                            <span class="card-rede-icone">
                                ${redeAtual === "sindilegis" ? "🏥" : "🦷"}
                            </span>

                            <span>
                                ${nomeRede}
                            </span>

                        </div>

                    </div>

                </div>

                <div class="card-status">
                    <span class="status-ponto"></span>
                    Credenciada
                </div>

            </div>


            <!-- CORPO -->

            <div class="card-corpo">

                <div class="card-informacoes">

                    ${blocoEndereco}

                    ${blocoLocalizacao}

                    ${blocoTelefone}

                    ${blocoEmail}

                </div>


                <!-- ESPECIALIDADES -->

                ${renderizarEspecialidadesCard(clinica)}

            </div>


            <!-- RODAPÉ -->

            <div class="card-footer">

                <div class="card-acoes">

                    ${botaoMapa}

                    ${botaoLigar}

                    ${botaoWhatsApp}

                </div>

            </div>

        </article>

    `;
}


// ============================================================
// MOSTRAR CLÍNICAS
// ============================================================

function mostrarClinicas(clinicas) {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) {

        console.error(
            "Elemento #resultado não encontrado."
        );

        return;
    }


    // --------------------------------------------------------
    // GARANTIR ARRAY
    // --------------------------------------------------------

    if (!Array.isArray(clinicas)) {
        clinicas = [];
    }


    // --------------------------------------------------------
    // REMOVER DUPLICADAS
    // --------------------------------------------------------

    const mapaClinicas = new Map();

    clinicas.forEach(clinica => {

        if (
            clinica &&
            clinica.id !== undefined &&
            clinica.id !== null
        ) {

            mapaClinicas.set(
                clinica.id,
                clinica
            );

        }

    });

    const listaClinicas =
        Array.from(mapaClinicas.values());


    // --------------------------------------------------------
    // NOME DA REDE
    // --------------------------------------------------------

    const redeAtual =
        obterRedeCard();

    const nomeRede =
        redeAtual === "sindilegis"
            ? "Sindilegis"
            : "Rede Especialistas";


    // --------------------------------------------------------
    // NENHUMA CLÍNICA
    // --------------------------------------------------------

    if (!listaClinicas.length) {

        resultado.innerHTML = `

            <div class="semResultado">

                <div class="semResultado-icone">
                    🔍
                </div>

                <h2>
                    Nenhuma clínica encontrada
                </h2>

                <p>
                    Não encontramos clínicas
                    para os filtros selecionados.
                </p>

                <span>
                    Tente alterar os filtros
                    e realizar uma nova busca.
                </span>

            </div>

        `;

        return;
    }


    // --------------------------------------------------------
    // TÍTULO DOS RESULTADOS
    // --------------------------------------------------------

    const quantidade =
        listaClinicas.length;


    resultado.innerHTML = `

        <div class="resultado-topo">

            <div class="resultado-titulo">

                <span class="resultado-quantidade">
                    ${quantidade}
                </span>

                <div>

                    <h2>
                        ${quantidade === 1
                            ? "clínica encontrada"
                            : "clínicas encontradas"}
                    </h2>

                    <p>
                        Confira as clínicas disponíveis
                    </p>

                </div>

            </div>


            <div class="resultado-rede">

                <span>
                    ${redeAtual === "sindilegis"
                        ? "🏥"
                        : "🦷"}
                </span>

                ${nomeRede}

            </div>

        </div>


        <div class="lista-clinicas">

            ${listaClinicas
                .map(renderizarCardClinica)
                .join("")}

        </div>

    `;
}


// ============================================================
// EXPORTAR FUNÇÃO
// ============================================================

window.mostrarClinicas =
    mostrarClinicas;

window.renderizarCardClinica =
    renderizarCardClinica;

window.obterEspecialidadesDaRede =
    obterEspecialidadesDaRede;

console.log(
    "Sistema de cards das clínicas configurado."
);
