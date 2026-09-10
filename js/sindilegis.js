// ============================================================
// REDE SINDILEGIS
// ============================================================

console.log("sindilegis.js carregado");

const REDE_SINDILEGIS = "sindilegis";


// ============================================================
// OBTER BAIRROS DE ACORDO COM OS FILTROS
// ============================================================

async function obterBairrosPorLocalizacaoSindilegis(filtros) {

    if (filtros.bairroId) {

        return [filtros.bairroId];

    }


    if (filtros.cidadeId) {

        const { data, error } = await supabaseClient
            .from("bairros")
            .select("id")
            .eq("cidade_id", filtros.cidadeId);

        if (error) throw error;

        return data.map(item => item.id);
    }


    if (filtros.estadoId) {

        const { data: cidades, error } =
            await supabaseClient
                .from("cidades")
                .select("id")
                .eq("estado_id", filtros.estadoId);

        if (error) throw error;

        if (!cidades.length) return [];

        const cidadeIds =
            cidades.map(item => item.id);


        const { data: bairros, error: erroBairros } =
            await supabaseClient
                .from("bairros")
                .select("id")
                .in("cidade_id", cidadeIds);

        if (erroBairros) throw erroBairros;

        return bairros.map(item => item.id);
    }


    if (filtros.regiaoId) {

        const { data: estados, error } =
            await supabaseClient
                .from("estados")
                .select("id")
                .eq("regiao_id", filtros.regiaoId);

        if (error) throw error;

        if (!estados.length) return [];

        const estadoIds =
            estados.map(item => item.id);


        const { data: cidades, error: erroCidades } =
            await supabaseClient
                .from("cidades")
                .select("id")
                .in("estado_id", estadoIds);

        if (erroCidades) throw erroCidades;

        if (!cidades.length) return [];

        const cidadeIds =
            cidades.map(item => item.id);


        const { data: bairros, error: erroBairros } =
            await supabaseClient
                .from("bairros")
                .select("id")
                .in("cidade_id", cidadeIds);

        if (erroBairros) throw erroBairros;

        return bairros.map(item => item.id);
    }


    return null;
}


// ============================================================
// BUSCAR CLÍNICAS SINDILEGIS
// ============================================================

async function buscarClinicasSindilegis() {

    console.log("Buscando clínicas Sindilegis...");

    const resultado =
        document.getElementById("resultado");


    if (resultado) {

        resultado.innerHTML = `
            <div class="semResultado">
                <h2>🔎 Buscando clínicas...</h2>
                <p>Aguarde enquanto carregamos os dados.</p>
            </div>
        `;

    }


    try {

        const filtros = obterFiltros();

        console.log(
            "Filtros Sindilegis:",
            filtros
        );


        // ----------------------------------------------------
        // 1. BUSCAR VÍNCULOS SINDILEGIS
        // ----------------------------------------------------

        let queryVinculos = supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
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


        if (filtros.especialidadeId) {

            queryVinculos =
                queryVinculos.eq(
                    "especialidade_id",
                    filtros.especialidadeId
                );

        }


        const {
            data: vinculos,
            error: erroVinculos
        } = await queryVinculos;


        if (erroVinculos) {

            console.error(
                "Erro ao buscar vínculos Sindilegis:",
                erroVinculos
            );

            throw erroVinculos;

        }


        if (!vinculos || vinculos.length === 0) {

            mostrarClinicas([]);

            return;

        }


        // ----------------------------------------------------
        // 2. IDS DAS CLÍNICAS
        // ----------------------------------------------------

        const clinicaIds = [
            ...new Set(
                vinculos
                    .map(item => item.clinica_id)
                    .filter(Boolean)
            )
        ];


        if (!clinicaIds.length) {

            mostrarClinicas([]);

            return;

        }


        // ----------------------------------------------------
        // 3. LOCALIZAÇÃO
        // ----------------------------------------------------

        const bairroIds =
            await obterBairrosPorLocalizacaoSindilegis(
                filtros
            );


        // ----------------------------------------------------
        // 4. BUSCAR CLÍNICAS
        // ----------------------------------------------------

        let queryClinicas = supabaseClient
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
            .in("id", clinicaIds);


        if (bairroIds !== null) {

            if (!bairroIds.length) {

                mostrarClinicas([]);

                return;

            }

            queryClinicas =
                queryClinicas.in(
                    "bairro_id",
                    bairroIds
                );

        }


        const {
            data: clinicas,
            error: erroClinicas
        } = await queryClinicas;


        if (erroClinicas) {

            console.error(
                "Erro ao buscar clínicas Sindilegis:",
                erroClinicas
            );

            throw erroClinicas;

        }


        // ----------------------------------------------------
        // 5. ASSOCIAR ESPECIALIDADES
        // ----------------------------------------------------

        const resultadoFinal =
            clinicas.map(clinica => {

                const especialidades =
                    vinculos
                        .filter(
                            item =>
                                item.clinica_id ===
                                clinica.id
                        );


                return {

                    ...clinica,

                    clinica_especialidades:
                        especialidades.map(item => ({

                            especialidade_id:
                                item.especialidade_id,

                            rede: REDE_SINDILEGIS,

                            ativo: true,

                            especialidades:
                                item.especialidades

                        }))

                };

            });


        console.log(
            "Clínicas Sindilegis encontradas:",
            resultadoFinal.length
        );


        mostrarClinicas(resultadoFinal);


    } catch (erro) {

        console.error(
            "Erro ao buscar clínicas Sindilegis:",
            erro
        );


        if (resultado) {

            resultado.innerHTML = `
                <div class="semResultado">
                    <h2>⚠️ Não foi possível carregar as clínicas</h2>
                    <p>
                        Ocorreu um erro ao consultar os dados.
                    </p>
                </div>
            `;

        }

    }

}


// ============================================================
// BOTÃO
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const botao =
        document.getElementById("buscar");

    if (!botao) return;

    botao.addEventListener(
        "click",
        buscarClinicasSindilegis
    );

    console.log(
        "Botão da Rede Sindilegis configurado."
    );

});


// ============================================================
// EXPORTAR
// ============================================================

window.buscarClinicasSindilegis =
    buscarClinicasSindilegis;

window.obterBairrosPorLocalizacaoSindilegis =
    obterBairrosPorLocalizacaoSindilegis;
