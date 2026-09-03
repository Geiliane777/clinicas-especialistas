// ======================================
// FILTROS
// REGIÃO / ESTADO / CIDADE / BAIRRO
// ESPECIALIDADE
// ======================================

console.log("filtros.js carregado");

// ======================================
// REGIÕES
// ======================================

async function carregarRegioes() {

    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");

    if (error) {
        console.error(
            "Erro ao carregar regiões:",
            error
        );
        return;
    }

    const regiao =
        document.getElementById("regiao");

    regiao.innerHTML = `
        <option value="">
            Selecione a Região
        </option>
    `;

    data.forEach(item => {

        regiao.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// ESTADOS
// ======================================

async function carregarEstados(regiaoId) {

    const estado =
        document.getElementById("estado");

    const cidade =
        document.getElementById("cidade");

    const bairro =
        document.getElementById("bairro");

    estado.innerHTML = `
        <option value="">
            Selecione o Estado
        </option>
    `;

    cidade.innerHTML = `
        <option value="">
            Selecione a Cidade
        </option>
    `;

    bairro.innerHTML = `
        <option value="">
            Selecione o Bairro
        </option>
    `;

    if (!regiaoId) return;

    const {
        data,
        error
    } = await supabaseClient
        .from("estados")
        .select("*")
        .eq("regiao_id", regiaoId)
        .order("nome");

    if (error) {
        console.error(
            "Erro ao carregar estados:",
            error
        );
        return;
    }

    data.forEach(item => {

        estado.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// CIDADES
// ======================================

async function carregarCidades(estadoId) {

    const cidade =
        document.getElementById("cidade");

    const bairro =
        document.getElementById("bairro");

    cidade.innerHTML = `
        <option value="">
            Selecione a Cidade
        </option>
    `;

    bairro.innerHTML = `
        <option value="">
            Selecione o Bairro
        </option>
    `;

    if (!estadoId) return;

    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select("*")
        .eq("estado_id", estadoId)
        .order("nome");

    if (error) {
        console.error(
            "Erro ao carregar cidades:",
            error
        );
        return;
    }

    data.forEach(item => {

        cidade.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// BAIRROS
// ======================================

async function carregarBairros(cidadeId) {

    const bairro =
        document.getElementById("bairro");

    bairro.innerHTML = `
        <option value="">
            Selecione o Bairro
        </option>
    `;

    if (!cidadeId) return;

    const {
        data,
        error
    } = await supabaseClient
        .from("bairros")
        .select("*")
        .eq("cidade_id", cidadeId)
        .order("nome");

    if (error) {
        console.error(
            "Erro ao carregar bairros:",
            error
        );
        return;
    }

    data.forEach(item => {

        bairro.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// DESCOBRIR REDE DA PÁGINA
// ======================================

function obterRedeAtual() {

    if (
        document.body.classList.contains("sindilegis")
    ) {
        return "sindilegis";
    }

    return "especialistas";

}


// ======================================
// ESPECIALIDADES
// APENAS DA REDE ATUAL
// ======================================

async function carregarEspecialidades() {

    const rede = obterRedeAtual();

    console.log(
        "Carregando especialidades da rede:",
        rede
    );

    const {
        data,
        error
    } = await supabaseClient
        .from("clinica_especialidades")
        .select(`
            especialidades (
                id,
                nome
            )
        `)
        .eq("rede", rede)
        .eq("ativo", true);

    if (error) {
        console.error(
            "Erro ao carregar especialidades:",
            error
        );
        return;
    }

    const especialidadesUnicas = [
        ...new Map(
            data
                .filter(
                    item =>
                        item.especialidades
                )
                .map(item => [
                    item.especialidades.id,
                    item.especialidades
                ])
        ).values()
    ];

    especialidadesUnicas.sort(
        (a, b) =>
            a.nome.localeCompare(b.nome)
    );

    const especialidade =
        document.getElementById(
            "especialidade"
        );

    especialidade.innerHTML = `
        <option value="">
            Todas as Especialidades
        </option>
    `;

    especialidadesUnicas.forEach(item => {

        especialidade.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// EVENTOS
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const regiao =
            document.getElementById("regiao");

        const estado =
            document.getElementById("estado");

        const cidade =
            document.getElementById("cidade");


        if (regiao) {

            regiao.addEventListener(
                "change",
                function() {

                    carregarEstados(
                        this.value
                    );

                }
            );

        }


        if (estado) {

            estado.addEventListener(
                "change",
                function() {

                    carregarCidades(
                        this.value
                    );

                }
            );

        }


        if (cidade) {

            cidade.addEventListener(
                "change",
                function() {

                    carregarBairros(
                        this.value
                    );

                }
            );

        }


        // ======================================
        // INICIALIZAÇÃO
        // ======================================

        carregarRegioes();

        carregarEspecialidades();

    }
);
