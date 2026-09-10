const REDE_SINDILEGIS = "sindilegis";
const REDE_ESPECIALISTAS = "especialistas";


/* =========================================================
   VERIFICA LOCALIZAÇÃO
========================================================= */

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


/* =========================================================
   BUSCAR CLÍNICAS SINDILEGIS
========================================================= */

async function buscarClinicasSindilegis(filtros = {}) {

    console.log("==============================");
    console.log("BUSCANDO REDE SINDILEGIS");
    console.log("==============================");


    /* =====================================================
       1. BUSCA TODOS OS VÍNCULOS ATIVOS
       PARA SABER A QUAL REDE CADA CLÍNICA PERTENCE
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

        mostrarClinicasSindilegis([]);

        return;
    }


    if (
        !todosVinculos ||
        todosVinculos.length === 0
    ) {

        console.log(
            "Nenhum vínculo encontrado."
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    /* =====================================================
       2. SEPARA AS CLÍNICAS POR REDE
    ===================================================== */

    const redesPorClinica = {};


    todosVinculos.forEach(vinculo => {

        const idClinica = vinculo.clinica_id;

        if (!idClinica) {
            return;
        }

        if (!redesPorClinica[idClinica]) {
            redesPorClinica[idClinica] = new Set();
        }

        redesPorClinica[idClinica].add(
            String(vinculo.rede || "").toLowerCase()
        );
    });


    /* =====================================================
       3. PEGA SOMENTE CLÍNICAS QUE SÃO SINDILEGIS
       
       IMPORTANTE:
       SE A CLÍNICA TAMBÉM ESTIVER COMO ESPECIALISTAS,
       ELA NÃO ENTRA AQUI.
    ===================================================== */

    let vinculosSindilegis = todosVinculos.filter(vinculo => {

        const idClinica = vinculo.clinica_id;

        const redes =
            redesPorClinica[idClinica];

        if (!redes) {
            return false;
        }

        const pertenceSindilegis =
            redes.has(REDE_SINDILEGIS);

        const pertenceEspecialistas =
            redes.has(REDE_ESPECIALISTAS);


        /*
         * A clínica só entra no Sindilegis
         * se NÃO estiver vinculada à Especialistas.
         */

        if (
            pertenceSindilegis &&
            !pertenceEspecialistas
        ) {
            return true;
        }

        return false;
    });


    /* =====================================================
       4. FILTRA POR ESPECIALIDADE
    ===================================================== */

    if (filtros.especialidadeId) {

        vinculosSindilegis =
            vinculosSindilegis.filter(vinculo =>
                String(vinculo.especialidade_id) ===
                String(filtros.especialidadeId)
            );
    }


    /* =====================================================
       5. SE NÃO HOUVER CLÍNICAS
    ===================================================== */

    if (
        !vinculosSindilegis ||
        vinculosSindilegis.length === 0
    ) {

        console.log(
            "Nenhuma clínica exclusiva da rede Sindilegis encontrada."
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    /* =====================================================
       6. IDS DAS CLÍNICAS SINDILEGIS
    ===================================================== */

    const idsClinicas = [
        ...new Set(
            vinculosSindilegis
                .map(item => item.clinica_id)
                .filter(Boolean)
        )
    ];


    console.log(
        "IDs das clínicas Sindilegis:",
        idsClinicas
    );


    /* =====================================================
       7. BUSCA OS DADOS DAS CLÍNICAS
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
        .in("id", idsClinicas);


    if (erroClinicas) {

        console.error(
            "Erro ao buscar clínicas Sindilegis:",
            erroClinicas
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    if (
        !clinicas ||
        clinicas.length === 0
    ) {

        console.log(
            "Nenhuma clínica encontrada na tabela clinicas."
        );

        mostrarClinicasSindilegis([]);

        return;
    }


    /* =====================================================
       8. MONTA AS ESPECIALIDADES
    ===================================================== */

    const mapaEspecialidades = {};


    vinculosSindilegis.forEach(vinculo => {

        const idClinica =
            vinculo.clinica_id;

        if (!mapaEspecialidades[idClinica]) {
            mapaEspecialidades[idClinica] = [];
        }


        if (vinculo.especialidades) {

            const jaExiste =
                mapaEspecialidades[idClinica].some(
                    especialidade =>
                        String(especialidade.id) ===
                        String(vinculo.especialidades.id)
                );


            if (!jaExiste) {

                mapaEspecialidades[idClinica].push(
                    vinculo.especialidades
                );
            }
        }
    });


    /* =====================================================
       9. JUNTA CLÍNICAS + ESPECIALIDADES
    ===================================================== */

    let resultado = clinicas.map(clinica => {

        return {
            ...clinica,

            especialidades:
                mapaEspecialidades[clinica.id] || []
        };
    });


    /* =====================================================
       10. FILTRA LOCALIZAÇÃO
    ===================================================== */

    resultado = resultado.filter(clinica =>
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


    /* =====================================================
       11. MOSTRA OS CARDS
    ===================================================== */

    mostrarClinicasSindilegis(resultado);
}


/* =========================================================
   MOSTRAR CLÍNICAS
========================================================= */

function mostrarClinicasSindilegis(clinicas) {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) {
        return;
    }


    /* =====================================================
       REMOVE DUPLICADOS
    ===================================================== */

    const mapa = new Map();


    (clinicas || []).forEach(clinica => {

        if (!mapa.has(clinica.id)) {

            mapa.set(
                clinica.id,
                clinica
            );
        }
    });


    const lista = [
        ...mapa.values()
    ];


    /* =====================================================
       RENDERIZA OS CARDS
    ===================================================== */

    if (
        typeof window.renderizarCardsClinicas ===
        "function"
    ) {

        window.renderizarCardsClinicas(lista);

        return;
    }


    /* =====================================================
       SEM RESULTADOS
    ===================================================== */

    if (lista.length === 0) {

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
                    <strong>Rede Sindilegis</strong>
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


/* =========================================================
   DISPONIBILIZA GLOBALMENTE
========================================================= */

window.buscarClinicasSindilegis =
    buscarClinicasSindilegis;

window.mostrarClinicasSindilegis =
    mostrarClinicasSindilegis;
