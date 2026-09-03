// ======================================
// EXIBIR CLÍNICAS
// ======================================

function mostrarClinicas(clinicas) {

    const resultado =
        document.getElementById("resultado");

    resultado.innerHTML = "";


    // ======================================
    // REMOVER DUPLICIDADES
    // ======================================

    const clinicasUnicas = [
        ...new Map(

            clinicas.map(item => [
                item.id,
                item
            ])

        ).values()
    ];


    // ======================================
    // NENHUMA CLÍNICA
    // ======================================

    if (
        !clinicasUnicas ||
        clinicasUnicas.length === 0
    ) {

        resultado.innerHTML = `
            <div class="semResultado">

                <h2>
                    Nenhuma clínica encontrada.
                </h2>

                <p>
                    Tente selecionar outro bairro
                    ou especialidade.
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
    // MONTAR CARDS
    // ======================================

    clinicasUnicas.forEach(clinica => {


        // ======================================
        // LOCALIZAÇÃO
        // ======================================

        const bairro =
            clinica.bairros?.nome ||
            "Não informado";

        const cidade =
            clinica.bairros?.cidades?.nome ||
            "Não informado";

        const estado =
            clinica.bairros?.cidades?.estados?.nome ||
            "Não informado";


        // ======================================
        // INFORMAÇÕES
        // ======================================

        const endereco =
            clinica.endereco ||
            "Não informado";

        const telefone =
            clinica.telefone ||
            "Não informado";


        // ======================================
        // ESPECIALIDADES
        // ======================================

        const especialidades =
            clinica.clinica_especialidades
                ?.map(
                    item =>
                        item.especialidades?.nome
                )
                .filter(nome => nome)
            || [];


        // Remover especialidades duplicadas

        const especialidadesUnicas =
            [...new Set(especialidades)];


        let tags = "";


        especialidadesUnicas.forEach(nome => {

            tags += `
                <span class="tag">
                    ${nome}
                </span>
            `;

        });


        if (!tags) {

            tags = `
                <span class="tag">
                    Não informado
                </span>
            `;

        }


        // ======================================
        // GOOGLE MAPS
        // ======================================

        const buscaMaps =
            encodeURIComponent(
                `${clinica.nome}, ${endereco}, ${bairro}, ${cidade}, ${estado}`
            );


        // ======================================
        // TELEFONE
        // ======================================

        const telefoneLink =
            telefone.replace(/\D/g, "");


        // ======================================
        // CARD
        // ======================================

        resultado.innerHTML += `

            <div class="card">

                <div class="cardHeader">

                    <h2>
                        ${clinica.nome}
                    </h2>

                </div>


                <div class="info">


                    <!-- ENDEREÇO -->

                    <p>

                        <strong>
                            Endereço
                        </strong>

                        <br>

                        ${endereco}

                    </p>


                    <!-- LOCALIZAÇÃO -->

                    <p>

                        <strong>
                            Localização
                        </strong>

                        <br>

                        ${bairro}

                        <br>

                        ${cidade} - ${estado}

                    </p>


                    <!-- TELEFONE -->

                    <p>

                        <strong>
                            Telefone
                        </strong>

                        <br>

                        ${
                            telefone !== "Não informado" &&
                            telefoneLink

                            ?

                            `
                            <a href="tel:${telefoneLink}">
                                ${telefone}
                            </a>
                            `

                            :

                            telefone
                        }

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
