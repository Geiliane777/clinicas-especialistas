const REDE_SINDILEGIS = "sindilegis";


// =====================================================
// VERIFICA LOCALIZAÇÃO
// =====================================================

function clinicaPertenceAoLocalSindilegis(
    clinica,
    filtros
) {

    const bairro = clinica.bairros;
    const cidade = bairro?.cidades;
    const estado = cidade?.estados;
    const regiao = estado?.regioes;


    if (
        filtros.regiaoId &&
        String(regiao?.id) !== String(filtros.regiaoId)
    ) {
        return false;
    }


    if (
        filtros.estadoId &&
        String(estado?.id) !== String(filtros.estadoId)
    ) {
        return false;
    }


    if (
        filtros.cidadeId &&
        String(cidade?.id) !== String(filtros.cidadeId)
    ) {
        return false;
    }


    if (
        filtros.bairroId &&
        String(bairro?.id) !== String(filtros.bairroId)
    ) {
        return false;
    }


    return true;
}


// =====================================================
// BUSCAR CLÍNICAS DA REDE SINDILEGIS
// =====================================================

async function buscarClinicasSindilegis(
    filtros = {}
) {

    console.log("==============================");
    console.log("BUSCANDO REDE SINDILEGIS");
    console.log("==============================");


    // -------------------------------------------------
    // BUSCA SOMENTE VÍNCULOS SINDILEGIS
    // -------------------------------------------------

    const {
        data: vinculos,
        error: erroVinculos
    } = await supabaseClient
        .from("clinica_especialidades")
        .select(`
            clinica_id,
            especialidade_id,
            rede,
            ativo,
            especialidades (
                id,
                nome
            )
        `)
        .eq("rede", REDE_SINDILEGIS)
        .eq("ativo", true);


    if (erroVinculos) {

        console.error(
            "Erro ao buscar vínculos Sindilegis:",
            erroVinculos
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    if (!vinculos || vinculos.length === 0) {

        console.log(
            "Nenhum vínculo encontrado para Sindilegis."
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    // -------------------------------------------------
    // FILTRO POR ESPECIALIDADE
    // -------------------------------------------------

    let vinculosFiltrados =
        vinculos;


    if (filtros.especialidadeId) {

        vinculosFiltrados =
            vinculos.filter(vinculo => {

                return (
                    String(
                        vinculo.especialidade_id
                    ) ===
                    String(
                        filtros.especialidadeId
                    )
                );

            });
    }


    if (vinculosFiltrados.length === 0) {

        console.log(
            "Nenhuma clínica possui a especialidade selecionada na rede Sindilegis."
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    // -------------------------------------------------
    // OBTÉM IDS DAS CLÍNICAS
    // -------------------------------------------------

    const idsClinicas = [
        ...new Set(
            vinculosFiltrados
                .map(vinculo => vinculo.clinica_id)
                .filter(Boolean)
        )
    ];


    console.log(
        "IDs das clínicas Sindilegis:",
        idsClinicas
    );


    // -------------------------------------------------
    // BUSCA AS CLÍNICAS
    // -------------------------------------------------

    const {
        data: clinicas,
        error: erroClinicas
    } = await supabaseClient
        .from("clinicas")
        .select(`
            id,
            nome,
            telefone,
            endereco,
            bairro_id,
            ativo,
            bairros (
                id,
                nome,
                cidades (
                    id,
                    nome,
                    estados (
                        id,
                        nome,
                        regioes (
                            id,
                            nome
                        )
                    )
                )
            )
        `)
        .eq("ativo", true)
        .in("id", idsClinicas);


    if (erroClinicas) {

        console.error(
            "Erro ao buscar clínicas Sindilegis:",
            erroClinicas
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    if (!clinicas || clinicas.length === 0) {

        console.log(
            "Nenhuma clínica encontrada na tabela clinicas."
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    // -------------------------------------------------
    // MONTA ESPECIALIDADES DA REDE SINDILEGIS
    // -------------------------------------------------

    const mapaEspecialidades = {};


    vinculosFiltrados.forEach(vinculo => {

        const idClinica =
            vinculo.clinica_id;


        if (!mapaEspecialidades[idClinica]) {

            mapaEspecialidades[idClinica] = [];
        }


        if (vinculo.especialidades) {

            const existe =
                mapaEspecialidades[idClinica].some(
                    especialidade =>
                        String(
                            especialidade.id
                        ) ===
                        String(
                            vinculo.especialidades.id
                        )
                );


            if (!existe) {

                mapaEspecialidades[idClinica].push(
                    vinculo.especialidades
                );
            }
        }

    });


    // -------------------------------------------------
    // JUNTA CLÍNICA + ESPECIALIDADES
    // -------------------------------------------------

    let resultado =
        clinicas.map(clinica => {

            return {

                ...clinica,

                especialidades:
                    mapaEspecialidades[clinica.id] || []

            };

        });


    // -------------------------------------------------
    // FILTRO DE LOCALIZAÇÃO
    // -------------------------------------------------

    resultado =
        resultado.filter(clinica =>
            clinicaPertenceAoLocalSindilegis(
                clinica,
                filtros
            )
        );


    console.log(
        "Clínicas Sindilegis encontradas:",
        resultado.length
    );


    console.log(
        "Resultado Sindilegis:",
        resultado
    );


    mostrarClinicasSindilegis(resultado);
}


// =====================================================
// MOSTRAR CLÍNICAS
// =====================================================

function mostrarClinicasSindilegis(clinicas) {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {
        return;
    }


    // -------------------------------------------------
    // REMOVE DUPLICIDADES
    // -------------------------------------------------

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


    // -------------------------------------------------
    // RENDERIZA
    // -------------------------------------------------

    if (
        typeof window.renderizarCardsClinicas ===
        "function"
    ) {

        window.renderizarCardsClinicas(lista);

        return;
    }


    // -------------------------------------------------
    // SEM RESULTADO
    // -------------------------------------------------

    resultado.innerHTML = `

        <div class="semResultado">

            <div class="semResultado-icone">
                🏥
            </div>

            <h2>
                Nenhuma clínica encontrada
            </h2>

            <p>
                Não encontramos clínicas da
                <strong>
                    Rede Sindilegis
                </strong>
                com os filtros selecionados.
            </p>

        </div>

    `;
}


// =====================================================
// BOTÃO BUSCAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botao =
            document.getElementById("buscar");


        if (!botao) {
            return;
        }


        botao.addEventListener(
            "click",
            () => {

                const filtros =
                    typeof obterFiltros ===
                    "function"
                        ? obterFiltros()
                        : {};


                buscarClinicasSindilegis(
                    filtros
                );

            }
        );

    }
);


// =====================================================
// DISPONIBILIZA GLOBALMENTE
// =====================================================

window.buscarClinicasSindilegis =
    buscarClinicasSindilegis;


window.mostrarClinicasSindilegis =
    mostrarClinicasSindilegis;
