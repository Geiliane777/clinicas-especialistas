console.log("cards.js carregado");

// ======================================================
// UTILITÁRIOS
// ======================================================

function escaparTexto(valor) {
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


// ======================================================
// REDE ATUAL
// ======================================================

function obterRedeAtual() {
    return document.body.classList.contains("sindilegis")
        ? "sindilegis"
        : "especialistas";
}

function obterNomeRede() {
    return obterRedeAtual() === "sindilegis"
        ? "Rede Sindilegis"
        : "Rede Especialistas";
}


// ======================================================
// TELEFONE
// ======================================================

function formatarTelefone(telefone) {
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


// ======================================================
// WHATSAPP
// ======================================================

function obterLinkWhatsApp(telefone) {
    if (!telefone) {
        return null;
    }

    let numero = String(telefone).replace(/\D/g, "");

    if (!numero) {
        return null;
    }

    // Adiciona Brasil quando o número ainda não possui DDI
    if (!numero.startsWith("55")) {
        numero = "55" + numero;
    }

    return `https://wa.me/${numero}`;
}


// ======================================================
// GOOGLE MAPS
// ======================================================

function obterLinkMapa(endereco) {
    if (!endereco) {
        return null;
    }

    const texto = encodeURIComponent(endereco);

    return `https://www.google.com/maps/search/?api=1&query=${texto}`;
}


// ======================================================
// ENDEREÇO
// ======================================================

function montarEndereco(clinica) {
    const partes = [];

    if (clinica.endereco) {
        partes.push(clinica.endereco);
    }

    if (clinica.bairro?.nome) {
        partes.push(clinica.bairro.nome);
    }

    return partes.join(" - ");
}


// ======================================================
// LOCALIZAÇÃO COMPLETA
// ======================================================

function montarLocalizacao(clinica) {
    const localizacao = [];

    const bairro = clinica.bairro;
    const cidade = bairro?.cidades;
    const estado = cidade?.estados;
    const regiao = estado?.regioes;

    if (bairro?.nome) {
        localizacao.push(bairro.nome);
    }

    if (cidade?.nome) {
        localizacao.push(cidade.nome);
    }

    if (estado?.nome) {
        localizacao.push(estado.nome);
    }

    return localizacao.join(" • ");
}


// ======================================================
// ESPECIALIDADES
// ======================================================

function obterEspecialidadesClinica(clinica) {
    if (!Array.isArray(clinica.especialidades)) {
        return [];
    }

    const nomes = clinica.especialidades
        .map(item => {
            if (typeof item === "string") {
                return item;
            }

            return item?.nome || "";
        })
        .filter(Boolean);

    // Remove duplicadas
    return [...new Set(nomes)];
}


// ======================================================
// CARD DA CLÍNICA
// ======================================================

function criarCardClinica(clinica) {

    const nome = escaparTexto(
        clinica.nome || "Clínica sem nome"
    );

    const telefone = clinica.telefone
        ? formatarTelefone(clinica.telefone)
        : "";

    const telefoneSeguro = escaparTexto(telefone);

    const endereco = montarEndereco(clinica);
    const enderecoSeguro = escaparTexto(endereco);

    const localizacao = montarLocalizacao(clinica);
    const localizacaoSegura = escaparTexto(localizacao);

    const especialidades = obterEspecialidadesClinica(clinica);

    const redeAtual = obterRedeAtual();
    const nomeRede = obterNomeRede();

    const linkMapa = obterLinkMapa(endereco);
    const linkWhatsApp = obterLinkWhatsApp(clinica.telefone);


    // ==================================================
    // ESPECIALIDADES
    // ==================================================

    let especialidadesHTML = "";

    if (especialidades.length > 0) {

        especialidadesHTML = `
            <div class="card-secao especialidades-card">
                <div class="card-secao-titulo">
                    <span class="card-secao-icone">🦷</span>
                    <span>Especialidades</span>
                </div>

                <div class="tags">
                    ${especialidades.map(especialidade => `
                        <span class="tag">
                            ${escaparTexto(especialidade)}
                        </span>
                    `).join("")}
                </div>
            </div>
        `;

    } else {

        especialidadesHTML = `
            <div class="card-secao especialidades-card">
                <div class="card-secao-titulo">
                    <span class="card-secao-icone">🦷</span>
                    <span>Especialidades</span>
                </div>

                <p class="sem-especialidades">
                    Especialidades não informadas.
                </p>
            </div>
        `;
    }


    // ==================================================
    // LOCALIZAÇÃO
    // ==================================================

    let localizacaoHTML = "";

    if (localizacao) {
        localizacaoHTML = `
            <div class="card-info-item">
                <span class="card-info-icone">📍</span>

                <div class="card-info-conteudo">
                    <span class="card-info-label">Localização</span>
                    <strong>${localizacaoSegura}</strong>
                </div>
            </div>
        `;
    }


    // ==================================================
    // ENDEREÇO
    // ==================================================

    let enderecoHTML = "";

    if (endereco) {
        enderecoHTML = `
            <div class="card-info-item">
                <span class="card-info-icone">🏠</span>

                <div class="card-info-conteudo">
                    <span class="card-info-label">Endereço</span>
                    <strong>${enderecoSeguro}</strong>
                </div>
            </div>
        `;
    }


    // ==================================================
    // TELEFONE
    // ==================================================

    let telefoneHTML = "";

    if (telefone) {
        telefoneHTML = `
            <div class="card-info-item">
                <span class="card-info-icone">📞</span>

                <div class="card-info-conteudo">
                    <span class="card-info-label">Telefone</span>
                    <strong>${telefoneSeguro}</strong>
                </div>
            </div>
        `;
    }


    // ==================================================
    // BOTÕES
    // ==================================================

    let botoesHTML = "";

    if (linkMapa) {
        botoesHTML += `
            <a
                href="${linkMapa}"
                target="_blank"
                rel="noopener noreferrer"
                class="btnAcao btn-mapa"
            >
                <span>📍</span>
                <span>Ver no mapa</span>
            </a>
        `;
    }

    if (linkWhatsApp) {
        botoesHTML += `
            <a
                href="${linkWhatsApp}"
                target="_blank"
                rel="noopener noreferrer"
                class="btnAcao btn-whatsapp"
            >
                <span>💬</span>
                <span>WhatsApp</span>
            </a>
        `;
    }


    // ==================================================
    // CARD COMPLETO
    // ==================================================

    return `
        <article class="card">

            <div class="cardHeader">

                <div class="cardHeader-principal">

                    <div class="card-icone-clinica">
                        🏥
                    </div>

                    <div class="card-titulo">

                        <span class="card-rede">
                            ${escaparTexto(nomeRede)}
                        </span>

                        <h3>
                            ${nome}
                        </h3>

                    </div>

                </div>

                <div class="card-status">
                    <span class="status-ponto"></span>
                    Credenciada
                </div>

            </div>


            <div class="card-corpo">

                <div class="card-informacoes">

                    ${localizacaoHTML}

                    ${enderecoHTML}

                    ${telefoneHTML}

                </div>


                ${especialidadesHTML}


                ${
                    botoesHTML
                        ? `
                            <div class="acoes">
                                ${botoesHTML}
                            </div>
                        `
                        : ""
                }

            </div>

        </article>
    `;
}


// ======================================================
// MOSTRAR CLÍNICAS
// ======================================================

function mostrarClinicas(clinicas) {

    const resultado = document.getElementById("resultado");

    if (!resultado) {
        console.error("Elemento #resultado não encontrado.");
        return;
    }


    // --------------------------------------------------
    // Verifica resultados
    // --------------------------------------------------

    if (!Array.isArray(clinicas) || clinicas.length === 0) {

        resultado.innerHTML = `
            <div class="semResultado">

                <div class="semResultado-icone">
                    🔎
                </div>

                <h2>
                    Nenhuma clínica encontrada
                </h2>

                <p>
                    Não encontramos clínicas para os filtros selecionados.
                    Tente alterar os filtros e realizar uma nova busca.
                </p>

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // Remove clínicas duplicadas
    // --------------------------------------------------

    const mapaClinicas = new Map();

    clinicas.forEach(clinica => {

        if (!clinica || !clinica.id) {
            return;
        }

        if (!mapaClinicas.has(clinica.id)) {
            mapaClinicas.set(clinica.id, clinica);
        }

    });

    const listaFinal = [...mapaClinicas.values()];


    // --------------------------------------------------
    // Cabeçalho dos resultados
    // --------------------------------------------------

    const redeAtual = obterRedeAtual();

    const nomeRede =
        redeAtual === "sindilegis"
            ? "Rede Sindilegis"
            : "Rede Especialistas";


    resultado.innerHTML = `

        <div class="resultado-topo">

            <div>
                <span class="section-label">
                    ${escaparTexto(nomeRede)}
                </span>

                <h2>
                    Clínicas encontradas
                </h2>

                <p>
                    Encontramos
                    <strong>${listaFinal.length}</strong>
                    ${
                        listaFinal.length === 1
                            ? "clínica disponível"
                            : "clínicas disponíveis"
                    }.
                </p>
            </div>

            <div class="resultado-contador">
                <strong>${listaFinal.length}</strong>
                <span>${
                    listaFinal.length === 1
                        ? "clínica"
                        : "clínicas"
                }</span>
            </div>

        </div>

        <div class="cards">

            ${listaFinal
                .map(clinica => criarCardClinica(clinica))
                .join("")}

        </div>
    `;
}


// ======================================================
// EXPOSIÇÃO GLOBAL
// ======================================================

window.escaparTexto = escaparTexto;
window.formatarTelefone = formatarTelefone;
window.obterLinkWhatsApp = obterLinkWhatsApp;
window.obterLinkMapa = obterLinkMapa;
window.montarEndereco = montarEndereco;
window.montarLocalizacao = montarLocalizacao;
window.criarCardClinica = criarCardClinica;
window.mostrarClinicas = mostrarClinicas;
window.obterRedeAtual = obterRedeAtual;

console.log("Funções dos cards disponíveis.");
