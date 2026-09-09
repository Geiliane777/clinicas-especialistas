// ======================================
// EXIBIR CLÍNICAS
// ======================================

console.log("cards.js carregado");


// ======================================
// ESCAPAR TEXTO
// ======================================

function escaparTextoCard(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {
        return "";
    }

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;
}


// ======================================
// NORMALIZAR REDE
// ======================================

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
        return "Especialistas";
    }

    if (
        rede === "sindilegis" ||
        rede === "rede sindilegis"
    ) {
        return "Sindilegis";
    }

    return "";
}


// ======================================
// MOSTRAR CLÍNICAS
// ======================================

function mostrarClinicas(clinicas) {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) return;

    resultado.innerHTML = "";


    // ======================================
    // REMOVER DUPLICADAS
    // ======================================

    const clinicasMap =
        new Map();


    clinicas.forEach(clinica => {

        if (!clinicasMap.has(clinica.id)) {

            clinicasMap.set(
                clinica.id,
                {
                    ...clinica,
                    clinica_especialidades:
                        Array.isArray(
                            clinica.clinica_especialidades
                        )
                            ? [
                                ...clinica.clinica_especialidades
                            ]
                            : []
                }
            );

        } else {

            const existente =
                clinicasMap.get(clinica.id);

            existente.clinica_especialidades.push(
                ...(clinica.clinica_especialidades || [])
            );

        }

    });


    const clinicasUnicas =
        Array.from(
            clinicasMap.values()
        );


    // ======================================
    // NENHUM RESULTADO
    // ======================================

    if (clinicasUnicas.length === 0) {

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


    // ======================================
    // TÍTULO
    // ======================================

    resultado.innerHTML = `
        <h2 class="tituloResultado">
            Clínicas Encontradas
            (${clinicasUnicas.length})
        </h2>
    `;


    // ======================================
    // CARDS
    // ======================================

    clinicasUnicas.forEach(clinica => {

        const bairro =
            clinica.bairros?.nome ||
            "Não informado";

        const cidade =
            clinica.bairros?.cidades?.nome ||
            "Não informado";

        const estado =
            clinica.bairros?.cidades?.estados?.nome ||
            "Não informado";

        const endereco =
            clinica.endereco ||
            "Não informado";

        const telefone =
            clinica.telefone ||
            "";


        // ======================================
        // ESPECIALIDADES
        // ======================================

        const especialidadesMap =
            new Map();


        clinica.clinica_especialidades
            ?.forEach(item => {

                if (!item.ativo) return;


                const rede =
                    normalizarRedeCard(
                        item.rede
                    );


                // A consulta já filtra a rede.
                // Aqui aceitamos apenas redes válidas.

                if (!rede) return;


                const especialidade =
                    item.especialidades;


                if (
                    especialidade &&
                    especialidade.id
                ) {

                    especialidadesMap.set(
                        `${rede}-${especialidade.id}`,
                        especialidade.nome
                    );

                }

            });


        const especialidades =
            Array.from(
                especialidadesMap.values()
            );


        // ======================================
        // TAGS
        // ======================================

        let tags = "";


        if (
            especialidades.length > 0
        ) {

            especialidades.forEach(nome => {

                tags += `
                    <span class="tag">
                        ${escaparTextoCard(nome)}
                    </span>
                `;

            });

        } else {

            tags = `
                <span class="tag">
                    Nenhuma especialidade informada
                </span>
            `;

        }


        // ======================================
        // GOOGLE MAPS
        // ======================================

        const buscaMaps =
            encodeURIComponent(
                [
                    clinica.nome,
                    endereco,
                    bairro,
                    cidade,
                    estado
                ]
                    .filter(Boolean)
                    .join(", ")
            );


        // ======================================
        // TELEFONE
        // ======================================

        const telefoneLimpo =
            String(telefone)
                .replace(/\D/g, "");


        let telefoneHTML;


        if (
            telefone &&
            telefoneLimpo
        ) {

            telefoneHTML = `
                <a href="tel:${telefoneLimpo}">
                    ${escaparTextoCard(telefone)}
                </a>
            `;

        } else {

            telefoneHTML =
                "Não informado";

        }


        // ======================================
        // HTML
        // ======================================

        resultado.innerHTML += `

            <div class="card">

                <div class="cardHeader">

                    <h2>
                        ${escaparTextoCard(
                            clinica.nome
                        )}
                    </h2>

                </div>


                <div class="info">

                    <p>

                        <strong>
                            Endereço
                        </strong>

                        <br>

                        ${escaparTextoCard(
                            endereco
                        )}

                    </p>


                    <p>

                        <strong>
                            Localização
                        </strong>

                        <br>

                        ${escaparTextoCard(
                            bairro
                        )}

                        <br>

                        ${escaparTextoCard(
                            cidade
                        )}
                        -
                        ${escaparTextoCard(
                            estado
                        )}

                    </p>


                    <p>

                        <strong>
                            Telefone
                        </strong>

                        <br>

                        ${telefoneHTML}

                    </p>


                    <div class="especialidades">

                        <strong>
                            Procedimentos disponíveis
                        </strong>

                        <div class="tags">

                            ${tags}

                        </div>

                    </div>


                    <div class="acoes">

                        <a
                            class="btnAcao"
                            href="https://www.google.com/maps/search/?api=1&query=${buscaMaps}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            📍 Ver no Google Maps
                        </a>

                    </div>

                </div>

            </div>

        `;

    });

}
