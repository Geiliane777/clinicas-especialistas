const REDE_ESPECIALISTAS = "especialistas";
const REDE_SINDILEGIS = "sindilegis";


/* =========================================================
   VERIFICA LOCALIZAÇÃO
========================================================= */

function clinicaPertenceAoLocal(clinica, filtros) {

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


/* =========================================================
   BUSCAR CLÍNICAS ESPECIALISTAS
========================================================= */

async function buscarClinicasEspecialistas(filtros = {}) {

    console.log("==============================");
    console.log("BUSCANDO REDE ESPECIALISTAS");
    console.log("==============================");


    /* =====================================================
       1. BUSCA TODOS OS VÍNCULOS ATIVOS
    ===================================================== */

    const {
        data: todosVinculos,
        error: erroTodosVinculos
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
        .eq("ativo", true);


    if (erroTodosVinculos) {

        console.error(
            "Erro ao buscar vínculos das clínicas:",
            erroTodosVinculos
        );

        mostrarClinicasEspecialistas([]);

        return;
    }


    if (
        !todosVinculos ||
        todosVinculos.length === 0
    ) {

        console.log(
            "Nenhum vínculo encontrado."
        );

        mostrarClinicasEspecialistas([]);

        return;
    }


    /* =====================================================
       2. IDENTIFICA TODAS AS REDES DE CADA CLÍNICA
    ===================================================== */

    const redesPorClinica = {};


    todosVinculos.forEach(vinculo => {

        const idClinica =
            vinculo.clinica_id;


        if (!idClinica) {
            return;
        }


        if (!redesPorClinica[idClinica]) {

            redesPorClinica[idClinica] =
                new Set();
        }


        redesPorClinica[idClinica].add(
            String(vinculo.rede || "")
                .trim()
                .toLowerCase()
        );
    });


    /* =====================================================
       3. PEGA SOMENTE CLÍNICAS EXCLUSIVAS
          DA REDE ESPECIALISTAS
       
       Se a clínica também estiver no Sindilegis,
       ela NÃO aparece aqui.
    ===================================================== */

    let vinculosEspecialistas =
        todosVinculos.filter(vinculo => {

            const idClinica =
                vinculo.clinica_id;


            const redes =
                redesPorClinica[idClinica];


            if (!redes) {
                return false;
            }


            const pertenceEspecialistas =
                redes.has(
                    REDE_ESPECIALISTAS
                );


            const pertenceSindilegis =
                redes.has(
                    REDE_SINDILEGIS
                );


            /*
             * Só permite clínica que:
             *
             * 1. Está em Especialistas
             * 2. NÃO está em Sindilegis
             */

            if (
                pertenceEspecialistas &&
                !pertenceSindilegis
            ) {

                return true;
            }


            return false;
        });


    /* =====================================================
       4. FILTRA PELA ESPECIALIDADE
    ===================================================== */

    if (filtros.especialidadeId) {

        vinculosEspecialistas =
            vinculosEspecialistas.filter(
                vinculo =>
                    String(
                        vinculo.especialidade_id
                    ) ===
                    String(
                        filtros.especialidadeId
                    )
            );
    }


    /* =====================================================
       5. VERIFICA SE EXISTEM RESULTADOS
    ===================================================== */

    if (
        !vinculosEspecialistas ||
        vinculosEspecialistas.length === 0
    ) {

        console.log(
            "Nenhuma clínica exclusiva da rede Especialistas encontrada."
        );

        mostrarClinicasEspecialistas([]);

        return;
    }


    /* =====================================================
       6. PEGA OS IDS DAS CLÍNICAS
    ===================================================== */

    const idsClinicas = [
        ...new Set(
            vinculosEspecialistas
                .map(
                    item =>
                        item.clinica_id
                )
                .filter(Boolean)
        )
    ];


    console.log(
        "IDs das clínicas Especialistas:",
        idsClinicas
    );


    /* =====================================================
       7. BUSCA AS CLÍNICAS
    ===================================================== */

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
        .in(
            "id",
            idsClinicas
        );


    if (erroClinicas) {

        console.error(
            "Erro ao buscar clínicas Especialistas:",
            erroClinicas
        );

        mostrarClinicasEspecialistas([]);

        return;
    }


    if (
        !clinicas ||
        clinicas.length === 0
    ) {

        console.log(
            "Nenhuma clínica encontrada na tabela clinicas."
        );

        mostrarClinicasEspecialistas([]);

        return;
    }


    /* =====================================================
       8. MONTA AS ESPECIALIDADES
    ===================================================== */

    const mapaEspecialidades = {};


    vinculosEspecialistas.forEach(
        vinculo => {

            const idClinica =
                vinculo.clinica_id;


            if (
                !mapaEspecialidades[
                    idClinica
                ]
            ) {

                mapaEspecialidades[
                    idClinica
                ] = [];
            }


            if (
                vinculo.especialidades
            ) {

                const jaExiste =
                    mapaEspecialidades[
                        idClinica
                    ].some(
                        especialidade =>
                            String(
                                especialidade.id
                            ) ===
                            String(
                                vinculo
                                    .especialidades
                                    .id
                            )
                    );


                if (!jaExiste) {

                    mapaEspecialidades[
                        idClinica
                    ].push(
                        vinculo.especialidades
                    );
                }
            }
        }
    );


    /* =====================================================
       9. JUNTA CLÍNICAS + ESPECIALIDADES
    ===================================================== */

    let resultado =
        clinicas.map(clinica => {

            return {

                ...clinica,

                especialidades:
                    mapaEspecialidades[
                        clinica.id
                    ] || []
            };
        });


    /* =====================================================
       10. FILTRA POR LOCALIZAÇÃO
    ===================================================== */

    resultado =
        resultado.filter(
            clinica =>
                clinicaPertenceAoLocal(
                    clinica,
                    filtros
                )
        );


    /* =====================================================
       11. MOSTRA NO CONSOLE
    ===================================================== */

    console.log(
        "Clínicas Especialistas encontradas:",
        resultado.length
    );


    console.log(
        "Resultado Especialistas:",
        resultado
    );


    /* =====================================================
       12. RENDERIZA
    ===================================================== */

    mostrarClinicasEspecialistas(
        resultado
    );
}


/* =========================================================
   MOSTRAR CLÍNICAS
========================================================= */

function mostrarClinicasEspecialistas(
    clinicas
) {

    const resultado =
        document.getElementById(
            "resultado"
        );


    if (!resultado) {
        return;
    }


    /* =====================================================
       REMOVE DUPLICADOS
    ===================================================== */

    const mapa =
        new Map();


    (clinicas || [])
        .forEach(clinica => {

            if (
                !mapa.has(
                    clinica.id
                )
            ) {

                mapa.set(
                    clinica.id,
                    clinica
                );
            }
        });


    const lista =
        [...mapa.values()];


    /* =====================================================
       RENDERIZA OS CARDS
    ===================================================== */

    if (
        typeof window
            .renderizarCardsClinicas ===
        "function"
    ) {

        window.renderizarCardsClinicas(
            lista
        );

        return;
    }


    /* =====================================================
       SEM RESULTADOS
    ===================================================== */

    if (
        lista.length === 0
    ) {

        resultado.innerHTML = `
            <div class="semResultado">

                <div class="semResultado-icone">
                    🦷
                </div>

                <h2>
                    Nenhuma clínica encontrada
                </h2>

                <p>
                    Não encontramos clínicas da
                    <strong>Rede Especialistas</strong>
                    com os filtros selecionados.
                </p>

            </div>
        `;

        return;
    }
}


/* =========================================================
   BOTÃO BUSCAR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botao =
            document.getElementById(
                "buscar"
            );


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


                buscarClinicasEspecialistas(
                    filtros
                );
            }
        );
    }
);


/* =========================================================
   DISPONIBILIZA GLOBALMENTE
========================================================= */

window.buscarClinicasEspecialistas =
    buscarClinicasEspecialistas;

window.mostrarClinicasEspecialistas =
    mostrarClinicasEspecialistas;

