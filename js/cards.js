// ============================================================
// CARDS DAS CLÍNICAS
// ============================================================

console.log("cards.js carregado");


// ============================================================
// ESCAPAR TEXTO
// ============================================================

function escaparTextoCard(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    const div = document.createElement("div");

    div.textContent = String(texto);

    return div.innerHTML;
}


// ============================================================
// NORMALIZAR REDE
// ============================================================

function normalizarRedeCard(valor) {

    const rede =
        String(valor ?? "")
            .trim()
            .toLowerCase();


    if (
        rede === "especialistas" ||
        rede === "especialista" ||
        rede === "rede especialistas"
    ) {

        return "especialistas";

    }


    if (
        rede === "sindilegis" ||
        rede === "rede sindilegis"
    ) {

        return "sindilegis";

    }


    return "";

}


// ============================================================
// OBTER REDE DA PÁGINA
// ============================================================

function obterRedeCard() {

    if (
        document.body.classList.contains(
            "sindilegis"
        )
    ) {

        return "sindilegis";

    }


    return "especialistas";

}


// ============================================================
// FORMATAR TELEFONE
// ============================================================

function formatarTelefone(telefone) {

    if (!telefone) {
        return "";
    }


    return String(telefone).trim();

}


// ============================================================
// CRIAR LINK DO TELEFONE
// ============================================================

function criarLinkTelefone(telefone) {

    const telefoneFormatado =
        formatarTelefone(telefone);


    if (!telefoneFormatado) {

        return "Não informado";

    }


    const telefoneLimpo =
        String(telefoneFormatado)
            .replace(/\D/g, "");


    if (!telefoneLimpo) {

        return escaparTextoCard(
            telefoneFormatado
        );

    }


    return `
        <a
            href="tel:${telefoneLimpo}"
        >
            ${escaparTextoCard(
                telefoneFormatado
            )}
        </a>
    `;

}


// ============================================================
// CRIAR LINK DO WHATSAPP
// ============================================================

function criarLinkWhatsApp(whatsapp) {

    if (!whatsapp) {
        return "";
    }


    const numero =
        String(whatsapp)
            .replace(/\D/g, "");


    if (!numero) {
        return "";
    }


    return `
        <a
            class="btnAcao"
            href="https://wa.me/${numero}"
            target="_blank"
            rel="noopener noreferrer"
        >
            💬 WhatsApp
        </a>
    `;

}


// ============================================================
// CRIAR LINK DO GOOGLE MAPS
// ============================================================

function criarLinkMaps(clinica) {

    const partes = [

        clinica.nome,

        clinica.endereco,

        clinica.numero,

        clinica.bairro?.nome,

        clinica.bairro?.cidades?.nome,

        clinica.bairro?.cidades?.estados?.nome

    ];


    const enderecoBusca =
        partes
            .filter(
                item =>
                    item !== null &&
                    item !== undefined &&
                    String(item).trim() !== ""
            )
            .join(", ");


    if (!enderecoBusca) {
        return "";
    }


    const query =
        encodeURIComponent(
            enderecoBusca
        );


    return `
        <a
            class="btnAcao"
            href="https://www.google.com/maps/search/?api=1&query=${query}"
            target="_blank"
            rel="noopener noreferrer"
        >
            📍 Ver no Google Maps
        </a>
    `;

}


// ============================================================
// MONTAR ENDEREÇO
// ============================================================

function montarEnderecoCard(clinica) {

    const partes = [];


    if (clinica.endereco) {

        partes.push(
            clinica.endereco
        );

    }


    if (clinica.numero) {

        partes.push(
            clinica.numero
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


    if (partes.length === 0) {

        return "Não informado";

    }


    return partes
        .map(
            parte =>
                escaparTextoCard(
                    parte
                )
        )
        .join(", ");

}


// ============================================================
// MONTAR LOCALIZAÇÃO
// ============================================================

function montarLocalizacaoCard(clinica) {

    const bairro =
        clinica.bairros?.nome ||
        "Não informado";


    const cidade =
        clinica.bairros?.cidades?.nome ||
        "Não informado";


    const estado =
        clinica.bairros?.cidades?.estados?.nome ||
        "Não informado";


    return `
        ${escaparTextoCard(bairro)}
        <br>
        ${escaparTextoCard(cidade)}
        -
        ${escaparTextoCard(estado)}
    `;

}


// ============================================================
// OBTER ESPECIALIDADES DA REDE ATUAL
// ============================================================

function obterEspecialidadesDaRede(clinica) {

    const redeAtual =
        obterRedeCard();


    const mapa =
        new Map();


    const relacionamentos =
        Array.isArray(
            clinica.clinica_especialidades
        )
            ? clinica.clinica_especialidades
            : [];


    relacionamentos.forEach(item => {

        if (!item) {
            return;
        }


        if (item.ativo !== true) {
            return;
        }


        const rede =
            normalizarRedeCard(
                item.rede
            );


        if (rede !== redeAtual) {
            return;
        }


        const especialidade =
            item.especialidades;


        if (
            !especialidade ||
            !especialidade.id
        ) {

            return;

        }


        if (
            !mapa.has(
                especialidade.id
            )
        ) {

            mapa.set(
                especialidade.id,
                especialidade.nome
            );

        }

    });


    return Array.from(
        mapa.values()
    ).sort(
        (a, b) =>
            String(a).localeCompare(
                String(b),
                "pt-BR",
                {
                    sensitivity: "base"
                }
            )
    );

}


// ============================================================
// MONTAR TAGS DE ESPECIALIDADES
// ============================================================

function montarTagsEspecialidades(
    especialidades
) {

    if (
        !especialidades ||
        especialidades.length === 0
    ) {

        return `
            <span class="tag">
                Nenhuma especialidade informada
            </span>
        `;

    }


    return especialidades
        .map(
            nome => `
                <span class="tag">
                    ${escaparTextoCard(nome)}
                </span>
            `
        )
        .join("");

}


// ============================================================
// MOSTRAR CLÍNICAS
// ============================================================

function mostrarClinicas(clinicas) {

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


    resultado.innerHTML = "";


    // ========================================================
    // GARANTIR ARRAY
    // ========================================================

    if (!Array.isArray(clinicas)) {

        clinicas = [];

    }


    // ========================================================
    // REMOVER DUPLICADAS
    // ========================================================

    const mapaClinicas =
        new Map();


    clinicas.forEach(clinica => {

        if (
            clinica &&
            clinica.id &&
            !mapaClinicas.has(
                clinica.id
            )
        ) {

            mapaClinicas.set(
                clinica.id,
                clinica
            );

        }

    });


    const clinicasUnicas =
        Array.from(
            mapaClinicas.values()
        );


    // ========================================================
    // NENHUM RESULTADO
    // ========================================================

    if (
        clinicasUnicas.length === 0
    ) {

        resultado.innerHTML = `

            <div class="semResultado">

                <h2>
                    Nenhuma clínica encontrada.
                </h2>

                <p>
                    Não encontramos clínicas
                    para os filtros selecionados.
                </p>

            </div>

        `;

        return;

    }


    // ========================================================
    // TÍTULO DOS RESULTADOS
    // ========================================================

    resultado.innerHTML = `

        <h2 class="tituloResultado">

            Clínicas Encontradas
            (${clinicasUnicas.length})

        </h2>

    `;


    // ========================================================
    // CRIAR CARDS
    // ========================================================

    clinicasUnicas.forEach(clinica => {

        const endereco =
            montarEnderecoCard(
                clinica
            );


        const localizacao =
            montarLocalizacaoCard(
                clinica
            );


        const telefone =
            criarLinkTelefone(
                clinica.telefone
            );


        const whatsapp =
            criarLinkWhatsApp(
                clinica.whatsapp
            );


        const maps =
            criarLinkMaps(
                clinica
            );


        const especialidades =
            obterEspecialidadesDaRede(
                clinica
            );


        const tags =
            montarTagsEspecialidades(
                especialidades
            );


        // ====================================================
        // BOTÕES DE AÇÃO
        // ====================================================

        let botoes = "";


        if (maps) {

            botoes += maps;

        }


        if (whatsapp) {

            botoes += whatsapp;

        }


        // ====================================================
        // HTML DO CARD
        // ====================================================

        resultado.innerHTML += `

            <div class="card">

                <div class="cardHeader">

                    <h2>
                        ${escaparTextoCard(
                            clinica.nome ||
                            "Clínica sem nome"
                        )}
                    </h2>

                </div>


                <div class="info">

                    <!-- ======================================
                         ENDEREÇO
                    ======================================= -->

                    <p>

                        <strong>
                            Endereço
                        </strong>

                        <br>

                        ${endereco}

                    </p>


                    <!-- ======================================
                         LOCALIZAÇÃO
                    ======================================= -->

                    <p>

                        <strong>
                            Localização
                        </strong>

                        <br>

                        ${localizacao}

                    </p>


                    <!-- ======================================
                         TELEFONE
                    ======================================= -->

                    <p>

                        <strong>
                            Telefone
                        </strong>

                        <br>

                        ${telefone}

                    </p>


                    <!-- ======================================
                         EMAIL
                    ======================================= -->

                    ${
                        clinica.email
                            ? `
                                <p>

                                    <strong>
                                        E-mail
                                    </strong>

                                    <br>

                                    <a
                                        href="mailto:${escaparTextoCard(
                                            clinica.email
                                        )}"
                                    >
                                        ${escaparTextoCard(
                                            clinica.email
                                        )}
                                    </a>

                                </p>
                              `
                            : ""
                    }


                    <!-- ======================================
                         ESPECIALIDADES
                    ======================================= -->

                    <div class="especialidades">

                        <strong>
                            Procedimentos disponíveis
                        </strong>


                        <div class="tags">

                            ${tags}

                        </div>

                    </div>


                    <!-- ======================================
                         AÇÕES
                    ======================================= -->

                    ${
                        botoes
                            ? `
                                <div class="acoes">

                                    ${botoes}

                                </div>
                              `
                            : ""
                    }

                </div>

            </div>

        `;

    });

}


// ============================================================
// DISPONIBILIZAR FUNÇÃO
// ============================================================

window.mostrarClinicas =
    mostrarClinicas;

window.escaparTextoCard =
    escaparTextoCard;
