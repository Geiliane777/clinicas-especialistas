/* =========================================================
   REDE ESPECIALISTAS
========================================================= */

const REDE_ESPECIALISTAS = "especialistas";


/* =========================================================
   LOCALIZAÇÃO
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
   BUSCAR CLÍNICAS DA REDE ESPECIALISTAS
========================================================= */

async function buscarClinicasEspecialistas(filtros = {}) {

    console.log(
        "Buscando clínicas da rede:",
        REDE_ESPECIALISTAS
    );

    /* -----------------------------------------------------
       1. PRIMEIRO PEGAMOS SOMENTE AS CLÍNICAS DA REDE
    ----------------------------------------------------- */

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
        .eq("rede", REDE_ESPECIALISTAS)
        .eq("ativo", true);

    /* -----------------------------------------------------
       FILTRO POR ESPECIALIDADE
    ----------------------------------------------------- */

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
            "Erro ao buscar vínculos da Rede Especialistas:",
            erroVinculos
        );

        mostrarClinicasEspecialistas([]);

        return;
    }

    /* -----------------------------------------------------
       SE NÃO EXISTIR NENHUMA CLÍNICA NESSA REDE
    ----------------------------------------------------- */

    if (!vinculos || vinculos.length === 0) {

        console.log(
            "Nenhuma clínica encontrada na rede Especialistas."
        );

        mostrarClinicasEspecialistas([]);

        return;
    }

    /* -----------------------------------------------------
       2. PEGAMOS OS IDS ÚNICOS DAS CLÍNICAS
    ----------------------------------------------------- */

    const idsClinicas = [
        ...new Set(
            vinculos
                .map(item => item.clinica_id)
                .filter(Boolean)
        )
    ];

    if (idsClinicas.length === 0) {

        mostrarClinicasEspecialistas([]);

        return;
    }


    /* -----------------------------------------------------
       3. AGORA BUSCAMOS SOMENTE ESSAS CLÍNICAS
    ----------------------------------------------------- */

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
            "Erro ao buscar clínicas Especialistas:",
            erroClinicas
        );

        mostrarClinicasEspecialistas([]);

        return;
    }


    /* -----------------------------------------------------
       4. MONTA AS ESPECIALIDADES DE CADA CLÍNICA
    ----------------------------------------------------- */

    const mapaEspecialidades = {};

    vinculos.forEach(vinculo => {

        const idClinica = vinculo.clinica_id;

        if (!mapaEspecialidades[idClinica]) {
            mapaEspecialidades[idClinica] = [];
        }

        if (vinculo.especialidades) {

            const existe =
                mapaEspecialidades[idClinica]
                    .some(
                        especialidade =>
                            especialidade.id ===
                            vinculo.especialidades.id
                    );

            if (!existe) {

                mapaEspecialidades[idClinica].push(
                    vinculo.especialidades
                );
            }
        }
    });


    /* -----------------------------------------------------
       5. JUNTA CLÍNICAS + ESPECIALIDADES
    ----------------------------------------------------- */

    let resultado = clinicas.map(clinica => {

        return {
            ...clinica,

            especialidades:
                mapaEspecialidades[clinica.id] || []
        };
    });


    /* -----------------------------------------------------
       6. FILTRO DE LOCALIZAÇÃO
    ----------------------------------------------------- */

    resultado = resultado.filter(clinica =>
        clinicaPertenceAoLocal(
            clinica,
            filtros
        )
    );


    /* -----------------------------------------------------
       7. MOSTRAR
    ----------------------------------------------------- */

    console.log(
        "Clínicas Especialistas encontradas:",
        resultado.length
    );

    mostrarClinicasEspecialistas(resultado);
}


/* =========================================================
   MOSTRAR RESULTADO
========================================================= */

function mostrarClinicasEspecialistas(clinicas) {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) return;


    /* -----------------------------------------------------
       EVITA DUPLICADOS
    ----------------------------------------------------- */

    const mapa = new Map();

    (clinicas || []).forEach(clinica => {

        if (!mapa.has(clinica.id)) {
            mapa.set(clinica.id, clinica);
        }
    });

    const lista = [...mapa.values()];


    /* -----------------------------------------------------
       RENDERIZAÇÃO
    ----------------------------------------------------- */

    if (
        typeof window.renderizarCardsClinicas ===
        "function"
    ) {

        window.renderizarCardsClinicas(lista);

        return;
    }


    /* -----------------------------------------------------
       FALLBACK
    ----------------------------------------------------- */

    if (lista.length === 0) {

        resultado.innerHTML = `
            <div class="semResultado">
                <h2>Nenhuma clínica encontrada</h2>
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
            document.getElementById("buscar");

        if (!botao) return;

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
   EXPORTAR
========================================================= */

window.buscarClinicasEspecialistas =
    buscarClinicasEspecialistas;

window.mostrarClinicasEspecialistas =
    mostrarClinicasEspecialistas;
