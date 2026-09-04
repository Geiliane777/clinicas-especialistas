// ======================================
// EXIBIR CLÍNICAS
// ======================================

console.log("cards.js carregado");


// ======================================
// ESCAPAR HTML
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
// EXIBIR CLÍNICAS
// ======================================

function mostrarClinicas(clinicas) {

    const resultado =
        document.getElementById(
            "resultado"
        );


    if (!resultado) return;


    resultado.innerHTML = "";


    // ==================================
    // REMOVER CLÍNICAS DUPLICADAS
    // ==================================

    const clinicasMap =
        new Map();


    clinicas.forEach(clinica => {

        if (
            !clinicasMap.has(
                clinica.id
            )
        ) {

            clinicasMap.set(
                clinica.id,
                clinica
            );

        } else {

            // Se a clínica aparecer mais de uma vez,
            // junta as especialidades.

            const clinicaExistente =
                clinicasMap.get(
                    clinica.id
                );


            const especialidadesExistentes =
                clinicaExistente
                    .clinica_especialidades ||
                [];


            const novasEspecialidades =
                clinica
                    .clinica_especialidades ||
                [];


            clinicaExistente.clinica_especialidades =
                [
                    ...especialidadesExistentes,
                    ...novasEspecialidades
                ];

        }

    });


    const clinicasUnicas =
        Array.from(
            clinicasMap.values()
        );


    // ==================================
    // NENHUM RESULTADO
    // ==================================

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


    // ==================================
    // TÍTULO
    // ==================================

    resultado.innerHTML = `

        <h2 class="tituloResultado">

            Clínicas Encontradas
            (${clinicasUnicas.length})

        </h2>

    `;


    // ==================================
    // CRIAR CARDS
    // ==================================

    clinicasUnicas.forEach(clinica => {


        // ==================================
        // LOCALIZAÇÃO
        // ==================================

        const bairro =
            clinica.bairros?.nome ||
            "Não informado";


        const cidade =
            clinica.bairros?.cidades?.nome ||
            "Não informado";


        const estado =
            clinica.bairros
                ?.cidades
                ?.estados
                ?.nome ||
            "Não informado";


        // ==================================
        // INFORMAÇÕES
        // ==================================

        const endereco =
            clinica.endereco ||
            "Não informado";


        const telefone =
            clinica.telefone ||
            "";


        // ==================================
        // ESPECIALIDADES
        // ==================================

        const especialidadesMap =
            new Map();


        clinica
            .clinica_especialidades
            ?.forEach(item => {


                // Apenas especialidades ativas

                if (
                    !item.ativo
                ) return;


                // Apenas Rede Especialistas

                if (
                    item.rede !==
                    "especialistas"
                ) return;


                const especialidade =
                    item.especialidades;


                if (
                    especialidade &&
                    especialidade.id
                ) {

                    especialidadesMap.set(
                        especialidade.id,
                        especialidade.nome
                    );

                }

            });


        const especialidades =
            Array.from(
                especialidadesMap.values()
            );


        // ==================================
        // TAGS
        // ==================================

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


        // ==================================
        // GOOGLE MAPS
        // ==================================

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


        // ==================================
        // TELEFONE
        // ==================================

        const telefoneLimpo =
            telefone.replace(
                /\D/g,
                ""
            );


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


        // ==================================
        // CARD
        // ==================================

        resultado.innerHTML += `

            <div class="card">


                <!-- CABEÇALHO -->

                <div class="cardHeader">

                    <h2>
                        ${escaparTextoCard(
                            clinica.nome
                        )}
                    </h2>

                </div>


                <!-- INFORMAÇÕES -->

                <div class="info">


                    <!-- ENDEREÇO -->

                    <p>

                        <strong>
                            Endereço
                        </strong>

                        <br>

                        ${escaparTextoCard(
                            endereco
                        )}

                    </p>


                    <!-- LOCALIZAÇÃO -->

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


                    <!-- TELEFONE -->

                    <p>

                        <strong>
                            Telefone
                        </strong>

                        <br>

                        ${telefoneHTML}

                    </p>


                    <!-- ESPECIALIDADES -->

                    <div class="especialidades">

                        <strong>
                            Procedimentos disponíveis
                        </strong>


                        <div class="tags">

                            ${tags}

                        </div>

                    </div>


                    <!-- AÇÕES -->

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
