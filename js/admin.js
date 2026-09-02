document.addEventListener("DOMContentLoaded", () => {

console.log("Admin.js carregado com sucesso!");

if (typeof supabaseClient === "undefined") {
    console.error("supabaseClient não foi carregado.");
    return;
}


/* ==========================================
   ELEMENTOS
========================================== */

const tituloPagina =
    document.getElementById("tituloPagina");


/* ==========================================
   TÍTULOS
========================================== */

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    editarClinica: "Editar Clínica",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


/* ==========================================
   NAVEGAÇÃO
========================================== */

async function mostrarPagina(nomePagina) {

    document
        .querySelectorAll(".page")
        .forEach(pagina => {
            pagina.classList.add("hidden");
        });

    const pagina =
        document.getElementById(nomePagina);

    if (pagina) {
        pagina.classList.remove("hidden");
    }

    if (
        tituloPagina &&
        TITULOS_PAGINA[nomePagina]
    ) {
        tituloPagina.textContent =
            TITULOS_PAGINA[nomePagina];
    }

    document
        .querySelectorAll(".menu-btn")
        .forEach(botao => {

            botao.classList.remove("active");

            if (
                botao.dataset.page === nomePagina
            ) {
                botao.classList.add("active");
            }

        });


    const carregadores = {
        dashboard: carregarDashboard,
        clinicas: carregarClinicas,
        especialidades: carregarEspecialidades,
        regioes: carregarRegioes,
        estados: carregarEstados,
        cidades: carregarCidades,
        bairros: carregarBairros
    };


    if (carregadores[nomePagina]) {
        await carregadores[nomePagina]();
    }

}


window.mostrarPagina = mostrarPagina;


/* ==========================================
   MENU
========================================== */

document
    .querySelectorAll(".menu-btn")
    .forEach(botao => {

        botao.addEventListener(
            "click",
            async () => {

                await mostrarPagina(
                    botao.dataset.page
                );

            }
        );

    });


/* ==========================================
   LIMPAR SELECT
========================================== */

function limparSelect(select, texto) {

    if (!select) return;

    select.innerHTML =
        `<option value="">${texto}</option>`;

}


/* ==========================================
   POPULAR REGIÕES
========================================== */

async function popularRegioes(selectId) {

    const select =
        document.getElementById(selectId);

    if (!select) return;

    const valorAtual = select.value;

    const { data, error } =
        await supabaseClient
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

    limparSelect(
        select,
        "Selecione Região"
    );

    data.forEach(regiao => {

        const option =
            document.createElement("option");

        option.value = regiao.id;
        option.textContent = regiao.nome;

        select.appendChild(option);

    });

    if (valorAtual) {
        select.value = valorAtual;
    }

}


/* ==========================================
   POPULAR ESTADOS
========================================== */

async function popularEstados(
    selectId,
    regiaoId = null
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;

    limparSelect(
        select,
        "Selecione Estado"
    );

    let query = supabaseClient
        .from("estados")
        .select("*")
        .order("nome");

    if (regiaoId) {
        query =
            query.eq(
                "regiao_id",
                regiaoId
            );
    }

    const { data, error } =
        await query;

    if (error) {
        console.error(
            "Erro ao carregar estados:",
            error
        );
        return;
    }

    data.forEach(estado => {

        const option =
            document.createElement("option");

        option.value = estado.id;
        option.textContent = estado.nome;

        select.appendChild(option);

    });

}


/* ==========================================
   POPULAR CIDADES
========================================== */

async function popularCidades(
    selectId,
    estadoId = null
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;

    limparSelect(
        select,
        "Selecione Cidade"
    );

    let query = supabaseClient
        .from("cidades")
        .select("*")
        .order("nome");

    if (estadoId) {
        query =
            query.eq(
                "estado_id",
                estadoId
            );
    }

    const { data, error } =
        await query;

    if (error) {
        console.error(
            "Erro ao carregar cidades:",
            error
        );
        return;
    }

    data.forEach(cidade => {

        const option =
            document.createElement("option");

        option.value = cidade.id;
        option.textContent = cidade.nome;

        select.appendChild(option);

    });

}


/* ==========================================
   POPULAR BAIRROS
========================================== */

async function popularBairros(
    selectId,
    cidadeId = null
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;

    limparSelect(
        select,
        "Selecione Bairro"
    );

    let query = supabaseClient
        .from("bairros")
        .select("*")
        .order("nome");

    if (cidadeId) {
        query =
            query.eq(
                "cidade_id",
                cidadeId
            );
    }

    const { data, error } =
        await query;

    if (error) {
        console.error(
            "Erro ao carregar bairros:",
            error
        );
        return;
    }

    data.forEach(bairro => {

        const option =
            document.createElement("option");

        option.value = bairro.id;
        option.textContent = bairro.nome;

        select.appendChild(option);

    });

}


/* ==========================================
   POPULAR ESPECIALIDADES
========================================== */

async function popularEspecialidades(selectId) {

    const select =
        document.getElementById(selectId);

    if (!select) return;

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");

    if (error) {
        console.error(
            "Erro ao carregar especialidades:",
            error
        );
        return;
    }

    limparSelect(
        select,
        "Selecione Especialidade"
    );

    data.forEach(especialidade => {

        const option =
            document.createElement("option");

        option.value = especialidade.id;
        option.textContent =
            especialidade.nome;

        select.appendChild(option);

    });

}


/* ==========================================
   CASCATA LOCALIZAÇÃO
========================================== */

function ligarCascataLocalizacao(prefixo) {

    const regiao =
        document.getElementById(
            `${prefixo}_regiao`
        );

    const estado =
        document.getElementById(
            `${prefixo}_estado`
        );

    const cidade =
        document.getElementById(
            `${prefixo}_cidade`
        );

    const bairro =
        document.getElementById(
            `${prefixo}_bairro`
        );


    if (regiao) {

        regiao.addEventListener(
            "change",
            async () => {

                limparSelect(
                    estado,
                    "Selecione Estado"
                );

                limparSelect(
                    cidade,
                    "Selecione Cidade"
                );

                limparSelect(
                    bairro,
                    "Selecione Bairro"
                );

                if (regiao.value) {

                    await popularEstados(
                        `${prefixo}_estado`,
                        regiao.value
                    );

                }

            }
        );

    }


    if (estado) {

        estado.addEventListener(
            "change",
            async () => {

                limparSelect(
                    cidade,
                    "Selecione Cidade"
                );

                limparSelect(
                    bairro,
                    "Selecione Bairro"
                );

                if (estado.value) {

                    await popularCidades(
                        `${prefixo}_cidade`,
                        estado.value
                    );

                }

            }
        );

    }


    if (cidade) {

        cidade.addEventListener(
            "change",
            async () => {

                limparSelect(
                    bairro,
                    "Selecione Bairro"
                );

                if (cidade.value) {

                    await popularBairros(
                        `${prefixo}_bairro`,
                        cidade.value
                    );

                }

            }
        );

    }

}


/* ==========================================
   DASHBOARD
========================================== */

async function contarRegistros(tabela) {

    const { count, error } =
        await supabaseClient
            .from(tabela)
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {
        console.error(
            `Erro ao contar ${tabela}:`,
            error
        );
        return 0;
    }

    return count || 0;

}


async function carregarDashboard() {

    const resultados =
        await Promise.all([

            contarRegistros("clinicas"),
            contarRegistros("especialidades"),
            contarRegistros("regioes"),
            contarRegistros("estados"),
            contarRegistros("cidades"),
            contarRegistros("bairros")

        ]);

    const ids = [
        "totalClinicas",
        "totalEspecialidades",
        "totalRegioes",
        "totalEstados",
        "totalCidades",
        "totalBairros"
    ];

    resultados.forEach((total, index) => {

        const elemento =
            document.getElementById(ids[index]);

        if (elemento) {
            elemento.textContent = total;
        }

    });

}


/* ==========================================
   REGIÕES
========================================== */

const btnSalvarRegiao =
    document.getElementById(
        "btnSalvarRegiao"
    );

if (btnSalvarRegiao) {

    btnSalvarRegiao.addEventListener(
        "click",
        async () => {

            const input =
                document.getElementById(
                    "nova_regiao"
                );

            const nome =
                input.value.trim();

            if (!nome) {
                alert(
                    "Digite o nome da região."
                );
                return;
            }

            const { error } =
                await supabaseClient
                    .from("regioes")
                    .insert({ nome });

            if (error) {
                console.error(error);
                alert(
                    "Erro ao salvar região."
                );
                return;
            }

            input.value = "";

            alert(
                "Região cadastrada com sucesso!"
            );

            await carregarRegioes();
            await carregarDashboard();

        }
    );

}


async function carregarRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );

    if (!lista) return;

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma região cadastrada.</p>";

        return;

    }

    data.forEach(regiao => {

        const box =
            document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${regiao.nome}</h3>

            <button
                class="red btnExcluirRegiao"
                data-id="${regiao.id}"
            >
                🗑 Excluir
            </button>
        `;

        lista.appendChild(box);

    });


    document
        .querySelectorAll(
            ".btnExcluirRegiao"
        )
        .forEach(botao => {

            botao.addEventListener(
                "click",
                async () => {

                    if (
                        !confirm(
                            "Deseja excluir esta região?"
                        )
                    ) {
                        return;
                    }

                    const { error } =
                        await supabaseClient
                            .from("regioes")
                            .delete()
                            .eq(
                                "id",
                                botao.dataset.id
                            );

                    if (error) {
                        console.error(error);
                        alert(
                            "Não foi possível excluir."
                        );
                        return;
                    }

                    await carregarRegioes();
                    await carregarDashboard();

                }
            );

        });


    await popularRegioes("estado_regiao");
    await popularRegioes("filtro_estado_regiao");
    await popularRegioes("clinica_regiao");

}


/* ==========================================
   ESPECIALIDADES
========================================== */

const btnSalvarEspecialidade =
    document.getElementById(
        "btnSalvarEspecialidade"
    );

if (btnSalvarEspecialidade) {

    btnSalvarEspecialidade.addEventListener(
        "click",
        async () => {

            const nome =
                document
                    .getElementById(
                        "nova_especialidade"
                    )
                    .value
                    .trim();

            const rede =
                document
                    .getElementById(
                        "especialidade_rede"
                    )
                    .value;

            if (!nome) {
                alert(
                    "Digite o nome da especialidade."
                );
                return;
            }

            const { error } =
                await supabaseClient
                    .from("especialidades")
                    .insert({
                        nome,
                        rede
                    });

            if (error) {
                console.error(error);
                alert(
                    "Erro ao salvar especialidade."
                );
                return;
            }

            document
                .getElementById(
                    "nova_especialidade"
                )
                .value = "";

            await carregarEspecialidades();
            await carregarDashboard();

            alert(
                "Especialidade cadastrada!"
            );

        }
    );

}


async function carregarEspecialidades() {

    const lista =
        document.getElementById(
            "listaEspecialidades"
        );

    if (!lista) return;

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma especialidade cadastrada.</p>";

        return;

    }

    data.forEach(especialidade => {

        const box =
            document.createElement("div");

        box.className = "box";

        const nomeRede =
            especialidade.rede ===
            "especialistas"
                ? "Rede Especialistas"
                : "Rede Sindilegis";

        box.innerHTML = `
            <h3>${especialidade.nome}</h3>

            <small>${nomeRede}</small>

            <button
                class="red btnExcluirEspecialidade"
                data-id="${especialidade.id}"
            >
                🗑 Excluir
            </button>
        `;

        lista.appendChild(box);

    });


    document
        .querySelectorAll(
            ".btnExcluirEspecialidade"
        )
        .forEach(botao => {

            botao.addEventListener(
                "click",
                async () => {

                    if (
                        !confirm(
                            "Deseja excluir esta especialidade?"
                        )
                    ) {
                        return;
                    }

                    const { error } =
                        await supabaseClient
                            .from("especialidades")
                            .delete()
                            .eq(
                                "id",
                                botao.dataset.id
                            );

                    if (error) {
                        console.error(error);
                        alert(
                            "Erro ao excluir."
                        );
                        return;
                    }

                    await carregarEspecialidades();
                    await carregarDashboard();

                }
            );

        });


    await popularEspecialidades(
        "clinica_especialidade"
    );

    await popularEspecialidades(
        "edit_especialidade"
    );

}


/* ==========================================
   CARREGAR ESTADOS
========================================== */

async function carregarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );

    if (!lista) return;

    const filtro =
        document.getElementById(
            "filtro_estado_regiao"
        );

    let query =
        supabaseClient
            .from("estados")
            .select(`
                *,
                regioes(nome)
            `)
            .order("nome");

    if (filtro && filtro.value) {
        query =
            query.eq(
                "regiao_id",
                filtro.value
            );
    }

    const { data, error } =
        await query;

    if (error) {
        console.error(error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhum estado cadastrado.</p>";

        return;

    }

    data.forEach(estado => {

        const box =
            document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${estado.nome}</h3>

            <small>
                Região:
                ${estado.regioes?.nome || "-"}
            </small>
        `;

        lista.appendChild(box);

    });

}


/* ==========================================
   CARREGAR CIDADES
========================================== */

async function carregarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );

    if (!lista) return;

    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select(`
                *,
                estados(nome)
            `)
            .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma cidade cadastrada.</p>";

        return;

    }

    data.forEach(cidade => {

        const box =
            document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${cidade.nome}</h3>

            <small>
                Estado:
                ${cidade.estados?.nome || "-"}
            </small>
        `;

        lista.appendChild(box);

    });

}


/* ==========================================
   CARREGAR BAIRROS
========================================== */

async function carregarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );

    if (!lista) return;

    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select(`
                *,
                cidades(nome)
            `)
            .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhum bairro cadastrado.</p>";

        return;

    }

    data.forEach(bairro => {

        const box =
            document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${bairro.nome}</h3>

            <small>
                Cidade:
                ${bairro.cidades?.nome || "-"}
            </small>
        `;

        lista.appendChild(box);

    });

}


/* ==========================================
   CARREGAR CLÍNICAS
========================================== */

async function carregarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );

    if (!lista) return;

    const filtro =
        document
            .getElementById(
                "filtro_clinica_nome"
            )
            ?.value
            .trim();

    let query =
        supabaseClient
            .from("clinicas")
            .select(`
                *,
                regioes(nome),
                estados(nome),
                cidades(nome),
                bairros(nome)
            `)
            .order("nome");

    if (filtro) {

        query =
            query.ilike(
                "nome",
                `%${filtro}%`
            );

    }

    const { data, error } =
        await query;

    if (error) {
        console.error(
            "Erro ao carregar clínicas:",
            error
        );
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma clínica encontrada.</p>";

        return;

    }

    data.forEach(clinica => {

        const box =
            document.createElement("div");

        box.className = "box";

        box.innerHTML = `
            <h3>${clinica.nome}</h3>

            <small>
                📞
                ${clinica.telefone || "Não informado"}
            </small>

            <br>

            <small>
                📍
                ${clinica.bairros?.nome || ""}
                -
                ${clinica.cidades?.nome || ""}
                /
                ${clinica.estados?.nome || ""}
            </small>

            <br><br>

            <span>
                ${clinica.ativo
                    ? "🟢 Ativa"
                    : "🔴 Inativa"
                }
            </span>
        `;

        lista.appendChild(box);

    });

}


/* ==========================================
   CASCATAS
========================================== */

ligarCascataLocalizacao("clinica");
ligarCascataLocalizacao("edit_clinica");


/* ==========================================
   FILTRO CLÍNICAS
========================================== */

const filtroClinica =
    document.getElementById(
        "filtro_clinica_nome"
    );

if (filtroClinica) {

    filtroClinica.addEventListener(
        "input",
        carregarClinicas
    );

}


/* ==========================================
   INICIALIZAÇÃO
========================================== */

async function inicializar() {

    console.log(
        "Iniciando painel administrativo..."
    );

    await carregarDashboard();

    await popularRegioes(
        "estado_regiao"
    );

    await popularRegioes(
        "filtro_estado_regiao"
    );

    await popularRegioes(
        "clinica_regiao"
    );

    await popularEspecialidades(
        "clinica_especialidade"
    );

    console.log(
        "Painel carregado!"
    );

}


inicializar();

});
