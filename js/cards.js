// ======================================================
// CARDS DAS CLÍNICAS
// ======================================================


// ======================================================
// ESCAPAR TEXTO
// ======================================================

function escaparTextoCards(valor) {

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
// FORMATAR TELEFONE
// ======================================================

function formatarTelefone(telefone) {

    if (!telefone) {
        return "";
    }

    const numeros =
        String(telefone).replace(/\D/g, "");

    if (numeros.length === 11) {

        return numeros.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );
    }

    if (numeros.length === 10) {

        return numeros.replace(
            /(\d{2})(\d{4})(\d{4})/,
            "($1) $2-$3"
        );
    }

    return telefone;
}


// ======================================================
// FORMATAR WHATSAPP
// ======================================================

function formatarWhatsApp(telefone) {

    if (!telefone) {
        return "";
    }

    let numeros =
        String(telefone).replace(/\D/g, "");

    // Se não tiver código do Brasil,
    // adiciona 55.

    if (
        numeros.length === 10 ||
        numeros.length === 11
    ) {

        numeros = "55" + numeros;
    }

    return numeros;
}


// ======================================================
// LINK DO WHATSAPP
// ======================================================

function gerarLinkWhatsApp(telefone) {

    const numero =
        formatarWhatsApp(telefone);

    if (!numero) {
        return "";
    }

    return `https://wa.me/${numero}`;
}


// ======================================================
// LINK DO GOOGLE MAPS
// ======================================================

function gerarLinkMapa(clinica) {

    const partes = [];

    if (clinica.endereco) {
        partes.push(clinica.endereco);
    }

    const bairro =
        clinica.bairros;

    const cidade =
        bairro?.cidades;

    const estado =
        cidade?.estados;


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
        return "";
    }


    const endereco =
        encodeURIComponent(
            partes.join(", ")
        );


    return `https://www.google.com/maps/search/?api=1&query=${endereco}`;
}


// ======================================================
// MONTA ENDEREÇO
// ======================================================

function montarEndereco(clinica) {

    const partes = [];

    const bairro =
        clinica.bairros;

    const cidade =
        bairro?.cidades;

    const estado =
        cidade?.estados;


    if (clinica.endereco) {

        partes.push(
            escaparTexto(
                clinica.endereco
            )
        );
    }


    if (bairro?.nome) {

        partes.push(
            escaparTexto(
                bairro.nome
            )
        );
    }


    if (cidade?.nome) {

        partes.push(
            escaparTexto(
                cidade.nome
            )
        );
    }


    if (estado?.nome) {

        partes.push(
            escaparTexto(
                estado.nome
            )
        );
    }


    if (partes.length === 0) {

        return "Endereço não informado";
    }


    return partes.join(", ");
}


// ======================================================
// NOME DA REDE
// ======================================================

function obterNomeRede() {

    const ehSindilegis =
        document.body.classList.contains(
            "sindilegis"
        );


    if (ehSindilegis) {
        return "Rede Sindilegis";
    }


    return "Rede Especialistas";
}


// ======================================================
// CLASSE DA REDE
// ======================================================

function obterClasseRede() {

    const ehSindilegis =
        document.body.classList.contains(
            "sindilegis"
        );


    if (ehSindilegis) {
        return "sindilegis";
    }


    return "especialistas";
}


// ======================================================
// RENDERIZAR CARDS
// ======================================================

function renderizarCardsClinicas(
    clinicas
) {

    const resultado =
        document.getElementById(
            "resultado"
        );


    if (!resultado) {

        console.error(
            "Elemento #resultado não encontrado."
        );

        return;
    }


    // --------------------------------------------------
    // GARANTE ARRAY
    // --------------------------------------------------

    if (!Array.isArray(clinicas)) {

        clinicas = [];
    }


    // --------------------------------------------------
    // REMOVE DUPLICIDADES
    // --------------------------------------------------

    const mapa =
        new Map();


    clinicas.forEach(clinica => {

        if (
            clinica &&
            clinica.id !== undefined &&
            clinica.id !== null
        ) {

            if (
                !mapa.has(clinica.id)
            ) {

                mapa.set(
                    clinica.id,
                    clinica
                );
            }
        }
    });


    const lista =
        [...mapa.values()];


    // --------------------------------------------------
    // NENHUM RESULTADO
    // --------------------------------------------------

    if (lista.length === 0) {

        resultado.innerHTML = `
            <div class="semResultado">

                <div class="semResultado-icone">
                    🔎
                </div>

                <h2>Nenhuma clínica encontrada</h2>

                <p>
                    Não encontramos clínicas
                    com os filtros selecionados.
                </p>

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // INFORMAÇÕES DA REDE
    // --------------------------------------------------

    const nomeRede =
        obterNomeRede();

    const classeRede =
        obterClasseRede();


    // --------------------------------------------------
    // MONTA OS CARDS
    // --------------------------------------------------

    const cards =
        lista.map(clinica => {


            // ==========================================
            // NOME
            // ==========================================

            const nome =
                escaparTexto(
                    clinica.nome ||
                    "Clínica sem nome"
                );


            // ==========================================
            // TELEFONE
            // ==========================================

            const telefone =
                clinica.telefone
                    ? formatarTelefone(
                        clinica.telefone
                    )
                    : "";


            // ==========================================
            // ENDEREÇO
            // ==========================================

            const endereco =
                montarEndereco(
                    clinica
                );


            // ==========================================
            // MAPA
            // ==========================================

            const linkMapa =
                gerarLinkMapa(
                    clinica
                );


            // ==========================================
            // WHATSAPP
            // ==========================================

            const telefoneWhatsApp =
                clinica.whatsapp ||
                clinica.telefone ||
                "";


            const linkWhatsApp =
                gerarLinkWhatsApp(
                    telefoneWhatsApp
                );


            // ==========================================
            // ESPECIALIDADES
            // ==========================================

            const especialidades =
                Array.isArray(
                    clinica.especialidades
                )
                    ? clinica.especialidades
                    : [];


            // Remove duplicidades

            const mapaEspecialidades =
                new Map();


            especialidades.forEach(
                especialidade => {

                    if (
                        especialidade &&
                        especialidade.id !==
                            undefined &&
                        especialidade.id !==
                            null
                    ) {

                        if (
                            !mapaEspecialidades.has(
                                especialidade.id
                            )
                        ) {

                            mapaEspecialidades.set(
                                especialidade.id,
                                especialidade
                            );
                        }
                    }
                }
            );


            const listaEspecialidades =
                [
                    ...mapaEspecialidades.values()
                ];


            // ==========================================
            // TAGS DAS ESPECIALIDADES
            // ==========================================

            let tagsEspecialidades = "";


            if (
                listaEspecialidades.length > 0
            ) {

                tagsEspecialidades =
                    listaEspecialidades
                        .map(
                            especialidade => {

                                return `
                                    <span class="tag">
                                        ${escaparTexto(
                                            especialidade.nome
                                        )}
                                    </span>
                                `;
                            }
                        )
                        .join("");

            } else {

                tagsEspecialidades = `
                    <span class="tag">
                        Especialidade não informada
                    </span>
                `;
            }


            // ==========================================
            // TELEFONE HTML
            // ==========================================

            let telefoneHTML = "";


            if (telefone) {

                telefoneHTML = `
                    <div class="card-info-item">

                        <div class="card-info-icone">
                            📞
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
                `;
            }


            // ==========================================
            // ENDEREÇO HTML
            // ==========================================

            const enderecoHTML = `
                <div class="card-info-item">

                    <div class="card-info-icone">
                        📍
                    </div>

                    <div class="card-info-conteudo">

                        <span class="card-info-label">
                            Endereço
                        </span>

                        <strong>
                            ${endereco}
                        </strong>

                    </div>

                </div>
            `;


            // ==========================================
            // BOTÃO MAPA
            // ==========================================

            let mapaHTML = "";


            if (linkMapa) {

                mapaHTML = `
                    <a
                        href="${linkMapa}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btnAcao btn-mapa"
                    >
                        📍 Ver no mapa
                    </a>
                `;
            }


            // ==========================================
            // BOTÃO WHATSAPP
            // ==========================================

            let whatsappHTML = "";


            if (linkWhatsApp) {

                whatsappHTML = `
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


            // ==========================================
            // CARD
            // ==========================================

            return `
                <article
                    class="card"
                    data-clinica-id="${clinica.id}"
                    data-rede="${classeRede}"
                >

                    <!-- CABEÇALHO -->

                    <div class="cardHeader">

                        <div class="cardHeader-principal">

                            <div class="card-icone-clinica">
                                🏥
                            </div>

                            <div class="card-titulo">

                                <h3>
                                    ${nome}
                                </h3>

                                <span class="card-rede ${classeRede}">
                                    ${nomeRede}
                                </span>

                            </div>

                        </div>


                        <span class="card-status ativo">
                            ● Ativa
                        </span>

                    </div>


                    <!-- CORPO -->

                    <div class="card-corpo">

                        <div class="card-informacoes">

                            ${enderecoHTML}

                            ${telefoneHTML}

                        </div>


                        <!-- ESPECIALIDADES -->

                        <div class="card-secao">

                            <div class="card-secao-titulo">

                                <span>
                                    🦷
                                </span>

                                <strong>
                                    Especialidades
                                </strong>

                            </div>


                            <div class="tags">

                                ${tagsEspecialidades}

                            </div>

                        </div>


                        <!-- AÇÕES -->

                        <div class="acoes">

                            ${mapaHTML}

                            ${whatsappHTML}

                        </div>

                    </div>

                </article>
            `;
        })
        .join("");


    // --------------------------------------------------
    // COLOCA OS CARDS NA TELA
    // --------------------------------------------------

    resultado.innerHTML = `
        <div class="resultado-cabecalho">

            <div>

                <span class="section-label">
                    ${nomeRede.toUpperCase()}
                </span>

                <h2>
                    Clínicas encontradas
                </h2>

                <p>
                    Encontramos
                    <strong>${lista.length}</strong>
                    clínica(s) para sua busca.
                </p>

            </div>

        </div>


        <div class="cards">
            ${cards}
        </div>
    `;
}


// ======================================================
// EXPORTA PARA OS OUTROS ARQUIVOS
// ======================================================

window.renderizarCardsClinicas =
    renderizarCardsClinicas;


// ======================================================
// LOG
// ======================================================

console.log(
    "cards.js carregado com sucesso."
);
