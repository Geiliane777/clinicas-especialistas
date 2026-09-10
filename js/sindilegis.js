// ============================================================
// SINDILEGIS.JS
// REDE SINDILEGIS
// ============================================================

console.log("sindilegis.js carregado");


// ============================================================
// CARREGAR REGIÕES
// ============================================================

async function carregarRegioes() {

    const select =
        document.getElementById("regiao");

    if (!select) return;

    select.innerHTML = `
        <option value="">
            Selecione a Região
        </option>
    `;

    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("id, nome")
        .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar regiões:",
            error
        );

        return;
    }

    (data || []).forEach(regiao => {

        select.innerHTML += `
            <option value="${regiao.id}">
                ${escaparTexto(regiao.nome)}
            </option>
        `;

    });
}


// ============================================================
// CARREGAR ESTADOS
// ============================================================

async function carregarEstados() {

    const regiaoId =
        document.getElementById("regiao")?.value;

    const estado =
        document.getElementById("estado");

    const cidade =
        document.getElementById("cidade");

    if (!estado) return;

    estado.innerHTML = `
        <option value="">
            Selecione o Estado
        </option>
    `;

    if (cidade) {

        cidade.innerHTML = `
            <option value="">
                Selecione a Cidade
            </option>
        `;

    }

    if (!regiaoId) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("estados")
        .select("id, nome")
        .eq("regiao_id", regiaoId)
        .order("nome");


    if (error) {

        console.error(
            "Erro ao carregar estados:",
            error
        );

        return;
    }


    (data || []).forEach(item => {

        estado.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });
}


// ============================================================
// CARREGAR CIDADES
// ============================================================

async function carregarCidades() {

    const estadoId =
        document.getElementById("estado")?.value;

    const cidade =
        document.getElementById("cidade");

    if (!cidade) return;

    cidade.innerHTML = `
        <option value="">
            Selecione a Cidade
        </option>
    `;

    if (!estadoId) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select("id, nome")
        .eq("estado_id", estadoId)
        .order("nome");


    if (error) {

        console.error(
            "Erro ao carregar cidades:",
            error
        );

        return;
    }


    (data || []).forEach(item => {

        cidade.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });
}


// ============================================================
// BUSCAR CLÍNICAS
// ============================================================

async function buscarClinicas() {

    const cidadeId =
        document.getElementById("cidade")?.value;

    const resultados =
        document.getElementById("resultados");


    if (!resultados) return;


    if (!cidadeId) {

        alert(
            "Selecione uma cidade."
        );

        return;
    }


    resultados.innerHTML = `
        <h2 class="results-title">
            Carregando clínicas...
        </h2>
    `;


    // --------------------------------------------------------
    // BAIRROS
    // --------------------------------------------------------

    const {
        data: bairros,
        error: erroBairros
    } = await supabaseClient
        .from("bairros")
        .select("id, nome")
        .eq("cidade_id", cidadeId);


    if (erroBairros) {

        console.error(
            "Erro ao carregar bairros:",
            erroBairros
        );

        resultados.innerHTML = `
            <div class="no-result">
                Erro ao carregar bairros.
            </div>
        `;

        return;
    }


    if (!bairros ||
        bairros.length === 0) {

        resultados.innerHTML = `
            <div class="no-result">
                Nenhum bairro cadastrado nesta cidade.
            </div>
        `;

        return;
    }


    const bairrosIds =
        bairros.map(
            bairro => bairro.id
        );


    // --------------------------------------------------------
    // CLÍNICAS SINDILEGIS
    // --------------------------------------------------------

    const {
        data: clinicas,
        error
    } = await supabaseClient
        .from("clinicas")
        .select(`
            id,
            nome,
            telefone,
            whatsapp,
            email,
            endereco,
            numero,
            complemento,
            cep,
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
            ),

            clinica_especialidades!inner (
                id,
                especialidade_id,
                rede,
                ativo,

                especialidades (
                    id,
                    nome
                )
            )
        `)
        .in(
            "bairro_id",
            bairrosIds
        )
        .eq(
            "ativo",
            true
        )
        .eq(
            "clinica_especialidades.rede",
            "sindilegis"
        )
        .eq(
            "clinica_especialidades.ativo",
            true
        );


    if (error) {

        console.error(
            "Erro ao buscar clínicas Sindilegis:",
            error
        );

        resultados.innerHTML = `
            <div class="no-result">
                Erro ao carregar clínicas.
            </div>
        `;

        return;
    }


    resultados.innerHTML = "";


    if (!clinicas ||
        clinicas.length === 0) {

        resultados.innerHTML = `
            <div class="no-result">
                Nenhuma clínica da Rede Sindilegis
                encontrada nesta cidade.
            </div>
        `;

        return;
    }


    resultados.innerHTML = `
        <h2 class="results-title">
            Clínicas Encontradas
        </h2>
    `;


    clinicas.forEach(clinica => {

        const bairro =
            clinica.bairros;

        const cidade =
            bairro?.cidades;

        const estado =
            cidade?.estados;


        const especialidades =
            (clinica.clinica_especialidades || [])
                .filter(item =>
                    item.ativo === true &&
                    item.rede === "sindilegis" &&
                    item.especialidades
                )
                .map(item =>
                    item.especialidades.nome
                )
                .filter(Boolean);


        const especialidadesTexto =
            [...new Set(especialidades)]
                .join(", ");


        const enderecoCompleto = [
            clinica.endereco,
            clinica.numero,
            clinica.complemento
        ]
            .filter(Boolean)
            .join(", ");


        resultados.innerHTML += `

            <div class="card">

                <h3>
                    ${escaparTexto(
                        clinica.nome ||
                        "Clínica sem nome"
                    )}
                </h3>

                <p>
                    <strong>📍 Endereço:</strong>
                    ${escaparTexto(
                        enderecoCompleto ||
                        "Não informado"
                    )}
                </p>

                <p>
                    <strong>📞 Telefone:</strong>
                    ${escaparTexto(
                        clinica.telefone ||
                        clinica.whatsapp ||
                        "Não informado"
                    )}
                </p>

                <p>
                    <strong>🏙 Bairro:</strong>
                    ${escaparTexto(
                        bairro?.nome ||
                        "Não informado"
                    )}
                </p>

                <p>
                    <strong>🏙 Cidade:</strong>
                    ${escaparTexto(
                        cidade?.nome ||
                        "Não informado"
                    )}
                </p>

                <p>
                    <strong>🗺 Estado:</strong>
                    ${escaparTexto(
                        estado?.nome ||
                        "Não informado"
                    )}
                </p>

                <p>
                    <strong>🦷 Especialidades:</strong>
                    ${escaparTexto(
                        especialidadesTexto ||
                        "Não informado"
                    )}
                </p>

            </div>

        `;

    });
}


// ============================================================
// ESCAPAR TEXTO
// ============================================================

function escaparTexto(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// REDIRECIONAR PARA ADMIN
// ============================================================

function irParaAdmin() {

    window.location.href =
        "admin.html";

}


// ============================================================
// REDIRECIONAR PARA ESPECIALISTAS
// ============================================================

function irParaEspecialistas() {

    window.location.href =
        "index.html";

}


// ============================================================
// TEMA
// ============================================================

function setTheme(mode) {

    document.body.classList.toggle(
        "dark",
        mode === "dark"
    );

    localStorage.setItem(
        "theme",
        mode
    );
}


function toggleTheme() {

    const dark =
        document.body.classList.contains(
            "dark"
        );

    setTheme(
        dark
            ? "light"
            : "dark"
    );
}


setTheme(
    localStorage.getItem("theme") ||
    "light"
);


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarRegioes();

        const regiao =
            document.getElementById(
                "regiao"
            );

        const estado =
            document.getElementById(
                "estado"
            );


        if (regiao) {

            regiao.addEventListener(
                "change",
                carregarEstados
            );

        }


        if (estado) {

            estado.addEventListener(
                "change",
                carregarCidades
            );

        }

    }
);


// ============================================================
// EXPORTAR
// ============================================================

window.buscarClinicas =
    buscarClinicas;

window.carregarRegioes =
    carregarRegioes;

window.carregarEstados =
    carregarEstados;

window.carregarCidades =
    carregarCidades;

window.irParaAdmin =
    irParaAdmin;

window.irParaEspecialistas =
    irParaEspecialistas;

window.toggleTheme =
    toggleTheme;

console.log(
    "Rede Sindilegis inicializada."
);
