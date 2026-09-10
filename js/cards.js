console.log("cards.js carregado");


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparTextoCard(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {
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
// REDE ATUAL
// ============================================================

function obterRedeAtual() {

    return document.body.classList.contains(
        "sindilegis"
    )
        ? "sindilegis"
        : "especialistas";
}


// ============================================================
// FORMATAR TELEFONE
// ============================================================

function formatarTelefone(telefone) {

    if (!telefone) {
        return "";
    }

    const numeros =
        String(telefone)
            .replace(/\D/g, "");


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


// ============================================================
// ENDEREÇO
// ============================================================

function montarEndereco(clinica) {

    const partes = [];


    if (clinica.endereco) {
        partes.push(
            clinica.endereco
        );
    }


    if (clinica.numero) {

        partes.push(
            `nº ${clinica.numero}`
        );

    }


    if (clinica.complemento) {

        partes.push(
            clinica.complemento
        );

    }


    if (clinica.cep) {

        partes.push(
            `CEP: ${clinica.cep}`
        );

    }


    return partes.join(", ");
}


// ============================================================
// LOCALIZAÇÃO
// ============================================================

function obterLocalizacao(clinica) {

    const bairro =
        clinica.bairros;


    if (!bairro) {
        return "";
    }


    const cidade =
        bairro.cidades;


    const estado =
        cidade?.estados;


    const partes = [];


    if (bairro.nome) {
        partes.push(
            bairro.nome
        );
    }


    if (cidade?.nome) {
        partes.push(
            cidade.nome
        );
    }


    if (estado?.nome) {
        partes.push(
            estado.nome
        );
    }


    return partes.join(" - ");
}


// ============================================================
// GOOGLE MAPS
// ============================================================

function criarLinkMapa(clinica) {

    const endereco =
        montarEndereco(clinica);


    const localizacao =
        obterLocalizacao(clinica);


    const busca = [
        clinica.nome,
        endereco,
        localizacao
    ]
        .filter(Boolean)
        .join(", ");


    return (
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(busca)
    );
}


// ============================================================
// ESPECIALIDADES
// ============================================================

function obterEspecialidadesDaClinica(clinica) {

    const rede =
        obterRedeAtual();


    const vinculos =
        clinica.clinica_especialidades || [];


    const nomes =
        vinculos
            .filter(
                vinculo =>
                    vinculo &&
                    vinculo.rede === rede &&
                    vinculo.ativo === true &&
                    vinculo.especialidades
            )
            .map(
                vinculo =>
                    vinculo.especialidades.nome
            );


    return [
        ...new Set(nomes)
    ];
}


// ============================================================
// MOSTRAR CLÍNICAS
// ============================================================

function mostrarClinicas(clinicas) {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {
        return;
    }


    if (
        !clinicas ||
        clinicas.length === 0
    ) {

        resultado.innerHTML = `

            <div class="semResultado">

                <div class="icone-vazio">
                    🔍
                </div>

                <h2>
                    Nenhuma clínica encontrada
                </h2>

                <p>
                    Tente alterar os filtros
                    e realizar uma nova busca.
                </p>

            </div>

        `;

        return;
    }


    // --------------------------------------------------------
    // REMOVER DUPLICADOS
    // --------------------------------------------------------

    const mapa =
        new Map();


    clinicas.forEach(
        clinica => {

            mapa.set(
                clinica.id,
                clinica
            );

        }
    );


    const lista =
        Array.from(
            mapa.values()
        );


    const rede =
        obterRedeAtual();


    const nomeRede =
        rede === "sindilegis"
            ? "Sindilegis"
            : "Rede Especialistas";


    let html = `

        <div class="tituloResultado">

            <div>

                <span class="contadorResultado">
                    ${lista.length}
                </span>

                <span>
                    clínica${lista.length !== 1 ? "s" : ""}
                    encontrada${lista.length !== 1 ? "s" : ""}
                </span>

            </div>

            <small>
                ${nomeRede}
            </small>

        </div>

        <div class="lista-cards">

    `;


    lista.forEach(
        clinica => {

            const endereco =
                montarEndereco(clinica);


            const localizacao =
                obterLocalizacao(clinica);


            const telefone =
                formatarTelefone(
                    clinica.telefone
                );


            const especialidades =
                obterEspecialidadesDaClinica(
                    clinica
                );


            const mapa =
                criarLinkMapa(
                    clinica
                );


            html += `

                <article class="card">

                    <div class="cardHeader">

                        <div class="icone-clinica">
                            🦷
                        </div>

                        <div>

                            <h3>
                                ${escaparTextoCard(
                                    clinica.nome ||
                                    "Clínica"
                                )}
                            </h3>

                            <span class="rede-badge">
                                ${nomeRede}
                            </span>

                        </div>

                    </div>


                    <div class="card-body">


                        ${
                            endereco
                                ? `
                                    <div class="info">

                                        <span class="info-icone">
                                            📍
                                        </span>

                                        <div>

                                            <strong>
                                                Endereço
                                            </strong>

                                            <p>
                                                ${escaparTextoCard(
                                                    endereco
                                                )}
                                            </p>

                                        </div>

                                    </div>
                                `
                                : ""
                        }


                        ${
                            localizacao
                                ? `
                                    <div class="info">

                                        <span class="info-icone">
                                            🗺️
                                        </span>

                                        <div>

                                            <strong>
                                                Localização
                                            </strong>

                                            <p>
                                                ${escaparTextoCard(
                                                    localizacao
                                                )}
                                            </p>

                                        </div>

                                    </div>
                                `
                                : ""
                        }


                        ${
                            telefone
                                ? `
                                    <div class="info">

                                        <span class="info-icone">
                                            📞
                                        </span>

                                        <div>

                                            <strong>
                                                Telefone
                                            </strong>

                                            <p>
                                                ${escaparTextoCard(
                                                    telefone
                                                )}
                                            </p>

                                        </div>

                                    </div>
                                `
                                : ""
                        }


                        ${
                            especialidades.length
                                ? `

                                    <div class="especialidades">

                                        <strong>
                                            Especialidades
                                        </strong>

                                        <div class="tags">

                                            ${especialidades
                                                .map(
                                                    nome =>
                                                        `
                                                        <span class="tag">
                                                            ${escaparTextoCard(
                                                                nome
                                                            )}
                                                        </span>
                                                        `
                                                )
                                                .join("")
                                            }

                                        </div>

                                    </div>

                                `
                                : ""
                        }


                    </div>


                    <div class="acoes">

                        ${
                            clinica.telefone
                                ? `
                                    <a
                                        href="tel:${String(
                                            clinica.telefone
                                        ).replace(
                                            /\D/g,
                                            ""
                                        )}"
                                        class="btnAcao btnTelefone"
                                    >
                                        📞 Ligar
                                    </a>
                                `
                                : ""
                        }


                        <a
                            href="${mapa}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btnAcao btnMapa"
                        >
                            📍 Ver no mapa
                        </a>

                    </div>

                </article>

            `;

        }
    );


    html += `
        </div>
    `;


    resultado.innerHTML =
        html;
}


// ============================================================
// EXPORTAR
// ============================================================

window.mostrarClinicas =
    mostrarClinicas;
