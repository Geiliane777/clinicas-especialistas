console.log("cards.js carregado");


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function escaparTexto(texto) {
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


// =====================================================
// FORMATA TELEFONE
// =====================================================

function formatarTelefone(telefone) {

    if (!telefone) {
        return "Telefone não informado";
    }

    const numero = String(telefone).replace(/\D/g, "");

    if (numero.length === 11) {
        return numero.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );
    }

    if (numero.length === 10) {
        return numero.replace(
            /(\d{2})(\d{4})(\d{4})/,
            "($1) $2-$3"
        );
    }

    return telefone;
}


// =====================================================
// TELEFONE PARA WHATSAPP
// =====================================================

function obterWhatsApp(telefone) {

    if (!telefone) {
        return "";
    }

    let numero = String(telefone).replace(/\D/g, "");

    if (!numero) {
        return "";
    }

    // Se não tiver código do Brasil, adiciona 55
    if (!numero.startsWith("55")) {
        numero = "55" + numero;
    }

    return numero;
}


// =====================================================
// LINK GOOGLE MAPS
// =====================================================

function obterLinkMapa(clinica) {

    const partes = [];

    if (clinica.endereco) {
        partes.push(clinica.endereco);
    }

    const bairro = clinica.bairros;
    const cidade = bairro?.cidades;
    const estado = cidade?.estados;

    if (bairro?.nome) {
        partes.push(bairro.nome);
    }

    if (cidade?.nome) {
        partes.push(cidade.nome);
    }

    if (estado?.nome) {
        partes.push(estado.nome);
    }

    if (partes.length === 0) {
        return "#";
    }

    const endereco = partes.join(", ");

    return (
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(endereco)
    );
}


// =====================================================
// OBTÉM DADOS DA LOCALIZAÇÃO
// =====================================================

function obterLocalizacao(clinica) {

    const bairro = clinica?.bairros;
    const cidade = bairro?.cidades;
    const estado = cidade?.estados;
    const regiao = estado?.regioes;

    return {
        bairro: bairro?.nome || "Bairro não informado",

        cidade: cidade?.nome || "Cidade não informada",

        estado: estado?.nome || "Estado não informado",

        regiao: regiao?.nome || "Região não informada"
    };
}


// =====================================================
// IDENTIFICA A REDE ATUAL
// =====================================================

function obterRedeAtual() {

    if (
        document.body &&
        document.body.classList.contains("sindilegis")
    ) {
        return "sindilegis";
    }

    return "especialistas";
}


// =====================================================
// NOME DA REDE
// =====================================================

function obterNomeRede() {

    const rede = obterRedeAtual();

    if (rede === "sindilegis") {
        return "Rede Sindilegis";
    }

    return "Rede Especialistas";
}


// =====================================================
// ÍCONE DA REDE
// =====================================================

function obterIconeRede() {

    const rede = obterRedeAtual();

    if (rede === "sindilegis") {
        return "🏥";
    }

    return "🦷";
}


// =====================================================
// CRIA UM CARD
// =====================================================

function criarCardClinica(clinica) {

    const localizacao = obterLocalizacao(clinica);

    const nomeClinica =
        clinica.nome || "Clínica sem nome";

    const telefone =
        formatarTelefone(clinica.telefone);

    const whatsapp =
        obterWhatsApp(clinica.telefone);

    const linkMapa =
        obterLinkMapa(clinica);

    const nomeRede =
        obterNomeRede();

    const iconeRede =
        obterIconeRede();

    // -------------------------------------------------
    // ESPECIALIDADES
    // -------------------------------------------------

    const especialidades =
        Array.isArray(clinica.especialidades)
            ? clinica.especialidades
            : [];

    const especialidadesUnicas = [];

    especialidades.forEach(especialidade => {

        if (!especialidade) {
            return;
        }

        const nome =
            especialidade.nome;

        if (!nome) {
            return;
        }

        const existe =
            especialidadesUnicas.some(
                item =>
                    String(item.id) ===
                    String(especialidade.id)
            );

        if (!existe) {
            especialidadesUnicas.push(
                especialidade
            );
        }
    });


    // -------------------------------------------------
    // TAGS DAS ESPECIALIDADES
    // -------------------------------------------------

    let htmlEspecialidades = "";

    if (especialidadesUnicas.length > 0) {

        htmlEspecialidades =
            especialidadesUnicas
                .map(especialidade => {

                    return `
                        <span class="tag">
                            ${escaparTexto(
                                especialidade.nome
                            )}
                        </span>
                    `;
                })
                .join("");

    } else {

        htmlEspecialidades = `
            <span class="tag">
                Especialidades não informadas
            </span>
        `;
    }


    // -------------------------------------------------
    // WHATSAPP
    // -------------------------------------------------

    let botaoWhatsApp = "";

    if (whatsapp) {

        const linkWhatsApp =
            "https://wa.me/" + whatsapp;

        botaoWhatsApp = `
            <a
                href="${linkWhatsApp}"
                target="_blank"
                rel="noopener noreferrer"
                class="btnAcao btn-whatsapp"
            >
                💬 WhatsApp
            </a>
        `;
    }


    // -------------------------------------------------
    // CARD
    // -------------------------------------------------

    const card = document.createElement("article");

    card.className = "card";


    card.innerHTML = `

        <!-- =========================================
             CABEÇALHO
        ========================================== -->

        <div class="cardHeader">

            <div class="cardHeader-principal">

                <div class="card-icone-clinica">
                    🏥
                </div>

                <div class="card-titulo">

                    <h3>
                        ${escaparTexto(nomeClinica)}
                    </h3>

                    <span class="card-rede">
                        ${iconeRede}
                        ${escaparTexto(nomeRede)}
                    </span>

                </div>

            </div>


            <div class="card-status">
                <span>
                    ●
                </span>

                Ativa
            </div>

        </div>


        <!-- =========================================
             CORPO
        ========================================== -->

        <div class="card-corpo">

            <div class="card-informacoes">


                <!-- =================================
                     LOCALIZAÇÃO
                ================================== -->

                <div class="card-info-item">

                    <div class="card-info-icone">
                        📍
                    </div>

                    <div class="card-info-conteudo">

                        <span class="card-info-label">
                            Localização
                        </span>

                        <strong>
                            ${escaparTexto(
                                localizacao.bairro
                            )}
                            —
                            ${escaparTexto(
                                localizacao.cidade
                            )}
                            /
                            ${escaparTexto(
                                localizacao.estado
                            )}
                        </strong>

                        <span>
                            Região:
                            ${escaparTexto(
                                localizacao.regiao
                            )}
                        </span>

                    </div>

                </div>


                <!-- =================================
                     ENDEREÇO
                ================================== -->

                ${
                    clinica.endereco
                        ? `
                            <div class="card-info-item">

                                <div class="card-info-icone">
                                    🏠
                                </div>

                                <div class="card-info-conteudo">

                                    <span class="card-info-label">
                                        Endereço
                                    </span>

                                    <strong>
                                        ${escaparTexto(
                                            clinica.endereco
                                        )}
                                    </strong>

                                </div>

                            </div>
                        `
                        : ""
                }


                <!-- =================================
                     TELEFONE
                ================================== -->

                <div class="card-info-item">

                    <div class="card-info-icone">
                        ☎️
                    </div>

                    <div class="card-info-conteudo">

                        <span class="card-info-label">
                            Telefone
                        </span>

                        <strong>
                            ${escaparTexto(
                                telefone
                            )}
                        </strong>

                    </div>

                </div>


            </div>


            <!-- =====================================
                 ESPECIALIDADES
            ====================================== -->

            <div class="card-secao">

                <div class="card-secao-titulo">
                    🦷 Especialidades
                </div>

                <div class="tags">
                    ${htmlEspecialidades}
                </div>

            </div>


            <!-- =====================================
                 BOTÕES
            ====================================== -->

            <div class="acoes">

                ${
                    linkMapa !== "#"
                        ? `
                            <a
                                href="${linkMapa}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btnAcao btn-mapa"
                            >
                                📍 Ver no mapa
                            </a>
                        `
                        : ""
                }

                ${botaoWhatsApp}

            </div>

        </div>

    `;

    return card;
}


// =====================================================
// RENDERIZA OS CARDS
// =====================================================

function renderizarCardsClinicas(clinicas) {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) {
        console.error(
            "Elemento #resultado não encontrado."
        );

        return;
    }


    // -----------------------------------------------
    // Remove duplicidades pelo ID
    // -----------------------------------------------

    const mapa =
        new Map();

    (clinicas || []).forEach(clinica => {

        if (!clinica || !clinica.id) {
            return;
        }

        if (!mapa.has(clinica.id)) {
            mapa.set(
                clinica.id,
                clinica
            );
        }
    });


    const lista =
        [...mapa.values()];


    // -----------------------------------------------
    // Nenhuma clínica
    // -----------------------------------------------

    if (lista.length === 0) {

        const rede =
            obterRedeAtual();

        const nomeRede =
            rede === "sindilegis"
                ? "Rede Sindilegis"
                : "Rede Especialistas";

        const icone =
            rede === "sindilegis"
                ? "🏥"
                : "🦷";


        resultado.innerHTML = `

            <div class="semResultado">

                <div class="semResultado-icone">
                    ${icone}
                </div>

                <h2>
                    Nenhuma clínica encontrada
                </h2>

                <p>
                    Não encontramos clínicas da
                    <strong>
                        ${nomeRede}
                    </strong>
                    com os filtros selecionados.
                </p>

            </div>

        `;

        return;
    }


    // -----------------------------------------------
    // Cria container dos cards
    // -----------------------------------------------

    const container =
        document.createElement("div");

    container.className = "cards";


    // -----------------------------------------------
    // Adiciona os cards
    // -----------------------------------------------

    lista.forEach(clinica => {

        const card =
            criarCardClinica(clinica);

        container.appendChild(card);

    });


    // -----------------------------------------------
    // Limpa resultado e adiciona cards
    // -----------------------------------------------

    resultado.innerHTML = "";

    resultado.appendChild(container);


    console.log(
        `Cards renderizados: ${lista.length}`
    );

}


// =====================================================
// DISPONIBILIZA GLOBALMENTE
// =====================================================

window.renderizarCardsClinicas =
    renderizarCardsClinicas;

window.criarCardClinica =
    criarCardClinica;

window.obterLocalizacao =
    obterLocalizacao;

console.log(
    "Funções dos cards disponíveis."
);
