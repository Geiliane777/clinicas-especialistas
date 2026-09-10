const REDE_SINDILEGIS = "sindilegis";


// ======================================================
// VERIFICA SE A CLÍNICA PERTENCE AO FILTRO DE LOCALIZAÇÃO
// ======================================================

function clinicaPertenceAoLocalSindilegis(clinica, filtros) {

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


// ======================================================
// BUSCAR CLÍNICAS EXCLUSIVAMENTE DA REDE SINDILEGIS
// ======================================================

async function buscarClinicasSindilegis(filtros = {}) {

    console.log("=================================");
    console.log("BUSCANDO REDE SINDILEGIS");
    console.log("=================================");

    // --------------------------------------------------
    // 1. PRIMEIRO BUSCA OS VÍNCULOS DA REDE
    // --------------------------------------------------

    let queryRede = supabaseClient
        .from("clinica_especialidades")
        .select(`
            clinica_id,
            especialidade_id,
            especialidades (
                id,
                nome
            )
        `)
        .eq("rede", REDE_SINDILEGIS)
        .eq("ativo", true);


    // Se foi escolhida uma especialidade,
    // filtra também pelo ID dela.

    if (filtros.especialidadeId) {

        queryRede = queryRede.eq(
            "especialidade_id",
            filtros.especialidadeId
        );
    }


    const {
        data: vinculos,
        error: erroVinculos
    } = await queryRede;


    if (erroVinculos) {

        console.error(
            "Erro ao buscar vínculos Sindilegis:",
            erroVinculos
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    // --------------------------------------------------
    // 2. SE NÃO EXISTIREM VÍNCULOS, NÃO MOSTRA NADA
    // --------------------------------------------------

    if (!vinculos || vinculos.length === 0) {

        console.log(
            "Nenhuma clínica possui vínculo com a rede Sindilegis."
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    // --------------------------------------------------
    // 3. PEGA SOMENTE OS IDs DAS CLÍNICAS SINDILEGIS
    // --------------------------------------------------

    const idsClinicas = [
        ...new Set(
            vinculos
                .map(vinculo => vinculo.clinica_id)
                .filter(Boolean)
        )
    ];


    console.log(
        "IDs das clínicas Sindilegis:",
        idsClinicas
    );


    if (idsClinicas.length === 0) {

        mostrarClinicasSindilegis([]);

        return;
    }


    // --------------------------------------------------
    // 4. BUSCA AS CLÍNICAS PELOS IDs ENCONTRADOS
    // --------------------------------------------------

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


    // --------------------------------------------------
    // 5. MONTA AS ESPECIALIDADES DA REDE SINDILEGIS
    // --------------------------------------------------

    const mapaEspecialidades = {};


    vinculos.forEach(vinculo => {

        const idClinica = vinculo.clinica_id;


        if (!mapaEspecialidades[idClinica]) {

            mapaEspecialidades[idClinica] = [];
        }


        if (vinculo.especialidades) {

            const especialidadeExiste =
                mapaEspecialidades[idClinica].some(
                    especialidade =>
                        String(especialidade.id) ===
                        String(vinculo.especialidades.id)
                );


            if (!especialidadeExiste) {

                mapaEspecialidades[idClinica].push(
                    vinculo.especialidades
                );
            }
        }
    });


    // --------------------------------------------------
    // 6. JUNTA CLÍNICA + ESPECIALIDADES DA REDE
    // --------------------------------------------------

    let resultado = clinicas.map(clinica => {

        return {
            ...clinica,

            especialidades:
                mapaEspecialidades[clinica.id] || []
        };
    });


    // --------------------------------------------------
    // 7. APLICA OS FILTROS DE LOCALIZAÇÃO
    // --------------------------------------------------

    resultado = resultado.filter(clinica =>
        clinicaPertenceAoLocalSindilegis(
            clinica,
            filtros
        )
    );


    // --------------------------------------------------
    // 8. REMOVE DUPLICIDADES
    // --------------------------------------------------

    const mapaClinicas = new Map();


    resultado.forEach(clinica => {

        if (!mapaClinicas.has(clinica.id)) {

            mapaClinicas.set(
                clinica.id,
                clinica
            );
        }
    });


    resultado = [...mapaClinicas.values()];


    console.log(
        "Clínicas Sindilegis encontradas:",
        resultado.length
    );


    console.log(
        "Resultado Sindilegis:",
        resultado
    );


    // --------------------------------------------------
    // 9. MOSTRA OS CARDS
    // --------------------------------------------------

    mostrarClinicasSindilegis(resultado);
}


// ======================================================
// MOSTRAR RESULTADOS
// ======================================================

function mostrarClinicasSindilegis(clinicas) {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {
        return;
    }


    // Remove qualquer duplicidade por segurança

    const mapa = new Map();


    (clinicas || []).forEach(clinica => {

        if (!mapa.has(clinica.id)) {

            mapa.set(
                clinica.id,
                clinica
            );
        }
    });


    const lista = [...mapa.values()];


    // --------------------------------------------------
    // NENHUM RESULTADO
    // --------------------------------------------------

    if (lista.length === 0) {

        resultado.innerHTML = `
            <div class="semResultado">

                <h2>Nenhuma clínica encontrada</h2>

                <p>
                    Não encontramos clínicas da
                    <strong>Rede Sindilegis</strong>
                    com os filtros selecionados.
                </p>

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // RENDERIZA OS CARDS
    // --------------------------------------------------

    if (
        typeof window.renderizarCardsClinicas ===
        "function"
    ) {

        window.renderizarCardsClinicas(lista);

        return;
    }
}


// ======================================================
// BOTÃO BUSCAR
// ======================================================

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
                    typeof obterFiltros === "function"
                        ? obterFiltros()
                        : {};


                buscarClinicasSindilegis(
                    filtros
                );
            }
        );
    }
);


// ======================================================
// DISPONIBILIZA AS FUNÇÕES
// ======================================================

window.buscarClinicasSindilegis =
    buscarClinicasSindilegis;

window.mostrarClinicasSindilegis =
    mostrarClinicasSindilegis;
