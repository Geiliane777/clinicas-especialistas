// ============================================================
// CARDS.JS
// Exibição das clínicas
// ============================================================

console.log("cards.js carregado");


// ============================================================
// ESCAPAR TEXTO
// Evita problemas ao colocar dados do banco dentro do HTML
// ============================================================

function escaparTextoCard(valor) {
    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// NORMALIZAR REDE
// ============================================================

function normalizarRedeCard(rede) {

    if (!rede) {
        return "";
    }

    const valor = String(rede)
        .trim()
        .toLowerCase();

    if (
        valor === "especialistas" ||
        valor === "rede especialistas"
    ) {
        return "especialistas";
    }

    if (
        valor === "sindilegis" ||
        valor === "sindilegis"
    ) {
        return "sindilegis";
    }

    return valor;
}


// ============================================================
// DESCOBRIR QUAL REDE ESTÁ SENDO EXIBIDA
// ============================================================

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

    let numero = String(telefone)
        .replace(/\D/g, "");

    if (numero.length === 11) {

        return numero.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    if (numero.length === 10) {

        return numero.replace(
            /^(\d{2})(\d{4})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    return telefone;
}


// ============================================================
// TELEFONE PARA LINK
// ============================================================

function telefoneParaLinkCard(telefone) {

    if (!telefone) {
        return "";
    }

    const numero = String(telefone)
        .replace(/\D/g, "");

    if (!numero) {
        return "";
    }

    return `tel:${numero}`;
}


// ============================================================
// WHATSAPP
// ============================================================

function criarLinkWhatsAppCard(whatsapp) {

    if (!whatsapp) {
        return "";
    }

    let numero = String(whatsapp)
        .replace(/\D/g, "");

    if (!numero) {
        return "";
    }

    // Se não tiver código do Brasil, adiciona 55
    if (!numero.startsWith("55")) {
        numero = "55" + numero;
    }

    return `https://wa.me/${numero}`;
}


// ============================================================
// ENDEREÇO
// ============================================================

function obterEnderecoCard(clinica) {

    const partes = [];

    if (clinica.endereco) {
        partes.push(String(clinica.endereco).trim());
    }

    if (clinica.numero) {
        partes.push(`nº ${String(clinica.numero).trim()}`);
    }

    if (clinica.complemento) {
        partes.push(String(clinica.complemento).trim());
    }

    if (clinica.cep) {
        partes.push(`CEP: ${String(clinica.cep).trim()}`);
    }

    if (partes.length === 0) {
        return "Endereço não informado";
    }

    return partes.join(", ");
}


// ============================================================
// LOCALIZAÇÃO COMPLETA
// ============================================================

function obterLocalizacaoCard(clinica) {

    const bairro = clinica.bairros;

    if (!bairro) {
        return "Localização não informada";
    }

    const cidade = bairro.cidades;

    const partes = [];

    if (bairro.nome) {
        partes.push(bairro.nome);
    }

    if (cidade && cidade.nome) {
        partes.push(cidade.nome);
    }

    if (
        cidade &&
        cidade.estados &&
        cidade.estados.nome
    ) {
        partes.push(cidade.estados.nome);
    }

    if (partes.length === 0) {
        return "Localização não informada";
    }

    return partes.join(" • ");
}


// ============================================================
// OBTER DADOS PARA GOOGLE MAPS
// ============================================================

function obterEnderecoGoogleMaps(clinica) {

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

    if (clinica.bairros && clinica.bairros.nome) {
        partes.push(clinica.bairros.nome);
    }

    if (
        clinica.bairros &&
        clinica.bairros.cidades &&
        clinica.bairros.cidades.nome
    ) {
        partes.push(clinica.bairros.cidades.nome);
    }

    if (
        clinica.bairros &&
        clinica.bairros.cidades &&
        clinica.bairros.cidades.estados &&
        clinica.bairros.cidades.estados.nome
    ) {
        partes.push(
            clinica.bairros.cidades.estados.nome
        );
    }

    return partes
        .filter(Boolean)
        .join(", ");
}


// ============================================================
// ESPECIALIDADES DA CLÍNICA
// SOMENTE DA REDE ATUAL
// ============================================================

function obterEspecialidadesDaRede(clinica) {

    const redeAtual = obterRedeCard();

    if (
        !clinica ||
        !Array.isArray(clinica.clinica_especialidades)
    ) {
        return [];
    }

    const especialidades = [];

    clinica.clinica_especialidades.forEach(item => {

        if (!item) {
            return;
        }

        const redeItem = normalizarRedeCard(item.rede);

        if (redeItem !== redeAtual) {
            return;
        }

        if (item.ativo !== true) {
            return;
        }

        if (
            !item.especialidades ||
            !item.especialidades.nome
        ) {
            return;
        }

        especialidades.push({
            id: item.especialidade_id,
            nome: item.especialidades.nome
        });
    });


    // Remove duplicadas
    const mapa = new Map();

    especialidades.forEach(especialidade => {

        const chave = especialidade.id ||
            especialidade.nome
                .trim()
                .toLowerCase();

        if (!mapa.has(chave)) {
            mapa.set(chave, especialidade);
        }
    });


    return Array.from(mapa.values())
        .sort((a, b) =>
            a.nome.localeCompare(
                b.nome,
                "pt-BR",
                {
                    sensitivity: "base"
                }
            )
        );
}


// ============================================================
// CRIAR TAGS DE ESPECIALIDADES
// ============================================================

function criarTagsEspecialidadesCard(clinica) {

    const especialidades =
        obterEspecialidadesDaRede(clinica);

    if (especialidades.length === 0) {

        return `
            <div class="semEspecialidades">
                Especialidades não informadas
            </div>
        `;
    }


    return especialidades
        .map(especialidade => `
            <span class="tag">
                ${escaparTextoCard(especialidade.nome)}
            </span>
        `)
        .join("");
}


// ============================================================
// CRIAR CARD DE UMA CLÍNICA
// ============================================================

function criarCardClinica(clinica) {

    const redeAtual = obterRedeCard();

    const nome =
        clinica.nome ||
        "Clínica sem nome";

    const telefoneFormatado =
        formatarTelefoneCard(clinica.telefone);

    const telefoneLink =
        telefoneParaLinkCard(clinica.telefone);

    const whatsappLink =
        criarLinkWhatsAppCard(clinica.whatsapp);

    const endereco =
        obterEnderecoCard(clinica);

    const localizacao =
        obterLocalizacaoCard(clinica);

    const enderecoMaps =
        obterEnderecoGoogleMaps(clinica);

    const mapaLink =
        enderecoMaps
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoMaps)}`
            : "";

    const especialidades =
        criarTagsEspecialidadesCard(clinica);


    // ========================================================
    // CLASSE DA REDE
    // ========================================================

    const classeRede =
        redeAtual === "sindilegis"
            ? "card-sindilegis"
            : "card-especialistas";


    // ========================================================
    // HTML DO CARD
    // ========================================================

    return `
        <article
            class="card ${classeRede}"
            data-clinica-id="${escaparTextoCard(clinica.id)}"
        >

            <!-- CABEÇALHO -->
            <div class="cardHeader">

                <div class="cardLogo">

                    <div class="cardLogoIcon">
                        🦷
                    </div>

                </div>


                <div class="cardTitulo">

                    <h3>
                        ${escaparTextoCard(nome)}
                    </h3>

                    <span class="cardRede">
                        ${
                            redeAtual === "sindilegis"
                                ? "🏥 Sindilegis"
                                : "🦷 Rede Especialistas"
                        }
                    </span>

                </div>

            </div>


            <!-- CONTEÚDO -->
            <div class="cardBody">


                <!-- LOCALIZAÇÃO -->
                <div class="cardInfo">

                    <div class="cardInfoIcon">
                        📍
                    </div>

                    <div class="cardInfoTexto">

                        <strong>
                            Endereço
                        </strong>

                        <span>
                            ${escaparTextoCard(endereco)}
                        </span>

                    </div>

                </div>


                <!-- LOCALIZAÇÃO GEOGRÁFICA -->
                <div class="cardInfo">

                    <div class="cardInfoIcon">
                        📌
                    </div>

                    <div class="cardInfoTexto">

                        <strong>
                            Localização
                        </strong>

                        <span>
                            ${escaparTextoCard(localizacao)}
                        </span>

                    </div>

                </div>


                <!-- TELEFONE -->
                ${
                    telefoneFormatado
                        ? `
                            <div class="cardInfo">

                                <div class="cardInfoIcon">
                                    📞
                                </div>

                                <div class="cardInfoTexto">

                                    <strong>
                                        Telefone
                                    </strong>

                                    ${
                                        telefoneLink
                                            ? `
                                                <a
                                                    href="${telefoneLink}"
                                                    class="cardLink"
                                                >
                                                    ${escaparTextoCard(
                                                        telefoneFormatado
                                                    )}
                                                </a>
                                            `
                                            : `
                                                <span>
                                                    ${escaparTextoCard(
                                                        telefoneFormatado
                                                    )}
                                                </span>
                                            `
                                    }

                                </div>

                            </div>
                        `
                        : ""
                }


                <!-- E-MAIL -->
                ${
                    clinica.email
                        ? `
                            <div class="cardInfo">

                                <div class="cardInfoIcon">
                                    ✉️
                                </div>

                                <div class="cardInfoTexto">

                                    <strong>
                                        E-mail
                                    </strong>

                                    <a
                                        href="mailto:${escaparTextoCard(
                                            clinica.email
                                        )}"
                                        class="cardLink"
                                    >
                                        ${escaparTextoCard(
                                            clinica.email
                                        )}
                                    </a>

                                </div>

                            </div>
                        `
                        : ""
                }


                <!-- ESPECIALIDADES -->
                <div class="cardEspecialidades">

                    <div class="cardSecaoTitulo">
                        <span>🩺</span>
                        <strong>
                            Especialidades
                        </strong>
                    </div>

                    <div class="tags">
                        ${especialidades}
                    </div>

                </div>

            </div>


            <!-- AÇÕES -->
            <div class="acoes">


                ${
                    mapaLink
                        ? `
                            <a
                                href="${mapaLink}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btnAcao btnMapa"
                            >
                                📍
                                <span>
                                    Ver no mapa
                                </span>
                            </a>
                        `
                        : ""
                }


                ${
                    telefoneLink
                        ? `
                            <a
                                href="${telefoneLink}"
                                class="btnAcao btnTelefone"
                            >
                                📞
                                <span>
                                    Ligar
                                </span>
                            </a>
                        `
                        : ""
                }


                ${
                    whatsappLink
                        ? `
                            <a
                                href="${whatsappLink}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btnAcao btnWhatsApp"
                            >
                                💬
                                <span>
                                    WhatsApp
                                </span>
                            </a>
                        `
                        : ""
                }

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
            "Elemento #resultado não foi encontrado."
        );

        return;
    }


    // ========================================================
    // GARANTIR ARRAY
    // ========================================================

    if (!Array.isArray(clinicas)) {
        clinicas = [];
    }


    // ========================================================
    // REDE ATUAL
    // ========================================================

    const redeAtual = obterRedeCard();

    const nomeRede =
        redeAtual === "sindilegis"
            ? "Sindilegis"
            : "Rede Especialistas";


    // ========================================================
    // REMOVER CLÍNICAS DUPLICADAS
    // ========================================================

    const mapaClinicas = new Map();

    clinicas.forEach(clinica => {

        if (!clinica) {
            return;
        }

        const id =
            clinica.id ||
            `${clinica.nome}-${clinica.endereco}`;

        if (!mapaClinicas.has(id)) {

            mapaClinicas.set(
                id,
                clinica
            );
        }
    });


    const listaClinicas =
        Array.from(mapaClinicas.values());


    // ========================================================
    // NENHUMA CLÍNICA
    // ========================================================

    if (listaClinicas.length === 0) {

        resultado.innerHTML = `

            <div class="semResultado">

                <div class="semResultadoIcon">
                    🔍
                </div>

                <h2>
                    Nenhuma clínica encontrada
                </h2>

                <p>
                    Não encontramos clínicas para os
                    filtros selecionados na
                    <strong>${nomeRede}</strong>.
                </p>

                <small>
                    Tente alterar os filtros e realizar
                    uma nova busca.
                </small>

            </div>

        `;

        return;
    }


    // ========================================================
    // TÍTULO DOS RESULTADOS
    // ========================================================

    const quantidade =
        listaClinicas.length;

    const textoQuantidade =
        quantidade === 1
            ? "1 clínica encontrada"
            : `${quantidade} clínicas encontradas`;


    // ========================================================
    // MONTAR CARDS
    // ========================================================

    const cards =
        listaClinicas
            .map(criarCardClinica)
            .join("");


    // ========================================================
    // HTML FINAL
    // ========================================================

    resultado.innerHTML = `

        <div class="tituloResultado">

            <div class="resultadoTituloPrincipal">
                ${textoQuantidade}
            </div>

            <div class="resultadoTituloRede">
                ${nomeRede}
            </div>

        </div>


        <div class="listaClinicas">

            ${cards}

        </div>

    `;
}


// ============================================================
// EXPORTAR
// ============================================================

window.mostrarClinicas =
    mostrarClinicas;

window.criarCardClinica =
    criarCardClinica;

window.obterEspecialidadesDaRede =
    obterEspecialidadesDaRede;
