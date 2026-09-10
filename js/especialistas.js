// ============================================================
// REDE ESPECIALISTAS
// ============================================================

console.log("especialistas.js carregado");

const REDE_ESPECIALISTAS = "especialistas";


// ============================================================
// OBTER BAIRROS DE ACORDO COM OS FILTROS
// ============================================================

async function obterBairrosPorLocalizacao(filtros) {

    // Bairro selecionado
    if (filtros.bairroId) {

        return [filtros.bairroId];

    }


    // Cidade selecionada
    if (filtros.cidadeId) {

        const { data, error } = await supabaseClient
            .from("bairros")
            .select("id")
            .eq("cidade_id", filtros.cidadeId);

        if (error) {
            console.error("Erro ao buscar bairros:", error);
            throw error;
        }

        return data.map(item => item.id);
    }


    // Estado selecionado
    if (filtros.estadoId) {

        const { data: cidades, error } =
            await supabaseClient
                .from("cidades")
                .select("id")
                .eq("estado_id", filtros.estadoId);

        if (error) {
            console.error("Erro ao buscar cidades:", error);
            throw error;
        }

        if (!cidades.length) return [];

        const cidadeIds =
            cidades.map(item => item.id);

        const { data: bairros, error: erroBairros } =
            await supabaseClient
                .from("bairros")
                .select("id")
                .in("cidade_id", cidadeIds);

        if (erroBairros) {
            console.error("Erro ao buscar bairros:", erroBairros);
            throw erroBairros;
        }

        return bairros.map(item => item.id);
    }


    // Região selecionada
    if (filtros.regiaoId) {

        const { data: estados, error: erroEstados } =
            await supabaseClient
                .from("estados")
                .select("id")
                .eq("regiao_id", filtros.regiaoId);

        if (erroEstados) {
            console.error("Erro ao buscar estados:", erroEstados);
            throw erroEstados;
        }

        if (!estados.length) return [];

        const estadoIds =
            estados.map(item => item.id);


        const { data: cidades, error: erroCidades } =
            await supabaseClient
                .from("cidades")
                .select("id")
                .in("estado_id", estadoIds);

        if (erroCidades) {
            console.error("Erro ao buscar cidades:", erroCidades);
            throw erroCidades;
        }

        if (!cidades.length) return [];

        const cidadeIds =
            cidades.map(item => item.id);


        const { data: bairros, error: erroBairros } =
            await supabaseClient
                .from("bairros")
                .select("id")
                .in("cidade_id", cidadeIds);

        if (erroBairros) {
            console.error("Erro ao buscar bairros:", erroBairros);
            throw erroBairros;
        }

        return bairros.map(item => item.id);
    }


    // Nenhum filtro de localização
    return null;
}


// ============================================================
// BUSCAR CLÍNICAS
// ============================================================

async function buscarClinicas() {

    console.log("Iniciando busca de clínicas...");

    const resultado = document.getElementById("resultado");

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

        console.log("Filtros selecionados:", filtros);


        // ----------------------------------------------------
        // 1. BUSCAR VÍNCULOS DA REDE
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
            .eq("rede", REDE_ESPECIALISTAS)
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
                "Erro ao buscar vínculos:",
                erroVinculos
            );

            throw erroVinculos;

        }


        if (!vinculos || vinculos.length === 0) {

            mostrarClinicas([]);

            return;

        }


        // ----------------------------------------------------
        // 2. PEGAR IDS DAS CLÍNICAS
        // ----------------------------------------------------

        const clinicaIds = [
            ...new Set(
                vinculos
                    .map(item => item.clinica_id)
                    .filter(Boolean)
            )
        ];


        if (clinicaIds.length === 0) {

            mostrarClinicas([]);

            return;

        }


        // ----------------------------------------------------
        // 3. FILTRO DE LOCALIZAÇÃO
        // ----------------------------------------------------

        const bairroIds =
            await obterBairrosPorLocalizacao(filtros);


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

            if (bairroIds.length === 0) {

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
                "Erro ao buscar clínicas:",
                erroClinicas
            );

            throw erroClinicas;

        }


        // ----------------------------------------------------
        // 5. JUNTAR ESPECIALIDADES ÀS CLÍNICAS
        // ----------------------------------------------------

        const resultadoFinal = clinicas.map(clinica => {

            const especialidades =
                vinculos
                    .filter(
                        item =>
                            item.clinica_id === clinica.id
                    )
                    .map(item => ({
                        id: item.especialidade_id,
                        nome:
                            item.especialidades
                                ? item.especialidades.nome
                                : ""
                    }));


            return {
                ...clinica,
                clinica_especialidades:
                    especialidades.map(item => ({
                        especialidade_id: item.id,
                        rede: REDE_ESPECIALISTAS,
                        ativo: true,
                        especialidades: {
                            id: item.id,
                            nome: item.nome
                        }
                    }))
            };

        });


        console.log(
            "Clínicas encontradas:",
            resultadoFinal.length
        );


        mostrarClinicas(resultadoFinal);


    } catch (erro) {

        console.error(
            "Erro ao buscar clínicas:",
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
// BOTÃO BUSCAR
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("buscar");

    if (!botao) return;

    botao.addEventListener(
        "click",
        buscarClinicas
    );

    console.log(
        "Botão da Rede Especialistas configurado."
    );

});


// ============================================================
// EXPORTAR
// ============================================================

window.buscarClinicas = buscarClinicas;
window.obterBairrosPorLocalizacao =
    obterBairrosPorLocalizacao;
