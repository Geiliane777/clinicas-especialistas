// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO - REDE ESPECIALISTAS
// ============================================================

console.log("admin.js carregado");


// ============================================================
// VARIÁVEIS GLOBAIS
// ============================================================

let paginaAtual = "dashboard";


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function escapeHTML(valor) {
    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function definirValor(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.value = valor ?? "";
    }
}


function mostrarErro(mensagem) {
    console.error(mensagem);
    alert(mensagem);
}


function normalizarRede(valor) {
    const v = String(valor ?? "")
        .trim()
        .toLowerCase();

    if (v === "sindilegis") {
        return "Sindilegis";
    }

    if (
        v === "especialista" ||
        v === "especialistas"
    ) {
        return "Especialistas";
    }

    return String(valor ?? "").trim();
}


// ============================================================
// TÍTULOS DAS PÁGINAS
// ============================================================

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros",
    especialidades: "Especialidades",
    clinicas: "Clínicas"
};


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("DOM carregado");

    try {
        await carregarDashboard();

        await popularRegioes();
        await popularEstados();
        await popularCidades();
        await popularBairros();
        await popularEspecialidades();

        ligarCascataLocalizacao();

        console.log("Admin inicializado com sucesso");

    } catch (erro) {

        console.error(
            "Erro ao inicializar administrador:",
            erro
        );
    }
});


// ============================================================
// NAVEGAÇÃO
// ============================================================

function mostrarPagina(pagina) {

    paginaAtual = pagina;

    document
        .querySelectorAll(".pagina")
        .forEach(elemento => {

            elemento.style.display = "none";
        });


    const paginaElemento =
        document.getElementById(`pagina-${pagina}`);

    if (paginaElemento) {
        paginaElemento.style.display = "block";
    }


    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.classList.remove("ativo");
        });


    const menuAtivo =
        document.querySelector(
            `.menu-item[data-pagina="${pagina}"]`
        );

    if (menuAtivo) {
        menuAtivo.classList.add("ativo");
    }


    const titulo =
        document.getElementById("tituloPagina");

    if (titulo) {
        titulo.textContent =
            TITULOS_PAGINA[pagina] || pagina;
    }


    // Carregamentos específicos

    if (pagina === "dashboard") {
        carregarDashboard();
    }

    if (pagina === "regioes") {
        listarRegioes();
    }

    if (pagina === "estados") {
        listarEstados();
    }

    if (pagina === "cidades") {
        listarCidades();
    }

    if (pagina === "bairros") {
        listarBairros();
    }

    if (pagina === "especialidades") {
        listarEspecialidades();
    }

    if (pagina === "clinicas") {
        listarClinicas();
    }
}


// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        const [
            regioes,
            estados,
            cidades,
            bairros,
            especialidades,
            clinicas
        ] = await Promise.all([

            supabaseClient
                .from("regioes")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("estados")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("cidades")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("bairros")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("especialidades")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("clinicas")
                .select("id", { count: "exact", head: true })
        ]);


        definirContador(
            "totalRegioes",
            regioes.count
        );

        definirContador(
            "totalEstados",
            estados.count
        );

        definirContador(
            "totalCidades",
            cidades.count
        );

        definirContador(
            "totalBairros",
            bairros.count
        );

        definirContador(
            "totalEspecialidades",
            especialidades.count
        );

        definirContador(
            "totalClinicas",
            clinicas.count
        );


        await carregarUltimasClinicas();

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );
    }
}


function definirContador(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent =
            valor ?? 0;
    }
}


// ============================================================
// ÚLTIMAS CLÍNICAS
// ============================================================

async function carregarUltimasClinicas() {

    const tabela =
        document.getElementById("ultimasClinicas");

    if (!tabela) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                telefone,
                ativo
            `)
            .order("id", {
                ascending: false
            })
            .limit(5);


    if (error) {

        console.error(
            "Erro ao carregar últimas clínicas:",
            error
        );

        tabela.innerHTML = `
            <tr>
                <td colspan="5">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

        return;
    }


    if (!data || data.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhuma clínica cadastrada.
                </td>
            </tr>
        `;

        return;
    }


    tabela.innerHTML =
        data.map(clinica => `

            <tr>

                <td>
                    ${escapeHTML(clinica.nome)}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.telefone || "-"
                    )}
                </td>

                <td>

                    <span class="
                        ${clinica.ativo
                            ? "status-ativo"
                            : "status-inativo"
                        }
                    ">

                        ${clinica.ativo
                            ? "Ativa"
                            : "Inativa"
                        }

                    </span>

                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarClinica(${clinica.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirClinica(${clinica.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `).join("");
}


// ============================================================
// REGIÕES
// ============================================================

async function popularRegioes() {

    const selects =
        document.querySelectorAll(
            "#regiaoId, #filtroRegiao, #clinicaRegiao"
        );


    const { data, error } =
        await supabaseClient
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


    selects.forEach(select => {

        const valorAtual = select.value;

        select.innerHTML = `
            <option value="">
                Selecione a região
            </option>
        `;


        data.forEach(regiao => {

            const option =
                document.createElement("option");

            option.value = regiao.id;

            option.textContent =
                regiao.nome;

            select.appendChild(option);
        });


        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}


async function listarRegioes() {

    const tabela =
        document.getElementById("listaRegioes");

    if (!tabela) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    tabela.innerHTML =
        data.map(regiao => `

            <tr>

                <td>
                    ${regiao.id}
                </td>

                <td>
                    ${escapeHTML(regiao.nome)}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarRegiao(${regiao.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirRegiao(${regiao.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `).join("");
}


async function adicionarRegiao() {

    const input =
        document.getElementById("nomeRegiao");

    if (!input) {
        return;
    }


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Informe o nome da região."
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("regioes")
            .insert({
                nome
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar região."
        );

        return;
    }


    input.value = "";

    await popularRegioes();

    await listarRegioes();

    await carregarDashboard();
}


async function editarRegiao(id) {

    const nome =
        prompt(
            "Digite o novo nome da região:"
        );

    if (!nome) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("regioes")
            .update({
                nome: nome.trim()
            })
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao editar região."
        );

        return;
    }


    await popularRegioes();

    await listarRegioes();

    await carregarDashboard();
}


async function excluirRegiao(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta região?"
        )
    ) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("regioes")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir a região."
        );

        return;
    }


    await popularRegioes();

    await listarRegioes();

    await carregarDashboard();
}


// ============================================================
// ESTADOS
// ============================================================

async function popularEstados() {

    const selects =
        document.querySelectorAll(
            "#estadoId, #filtroEstado, #clinicaEstado"
        );


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("id, nome, sigla")
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    selects.forEach(select => {

        const valorAtual =
            select.value;

        select.innerHTML = `
            <option value="">
                Selecione o estado
            </option>
        `;


        data.forEach(estado => {

            const option =
                document.createElement("option");

            option.value =
                estado.id;

            option.textContent =
                estado.sigla
                    ? `${estado.nome} (${estado.sigla})`
                    : estado.nome;

            select.appendChild(option);
        });


        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}


async function listarEstados() {

    const tabela =
        document.getElementById("listaEstados");

    if (!tabela) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select(`
                id,
                nome,
                sigla,
                regioes (
                    nome
                )
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    tabela.innerHTML =
        data.map(estado => `

            <tr>

                <td>
                    ${estado.id}
                </td>

                <td>
                    ${escapeHTML(estado.nome)}
                </td>

                <td>
                    ${escapeHTML(
                        estado.sigla || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        estado.regioes?.nome || "-"
                    )}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarEstado(${estado.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirEstado(${estado.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `).join("");
}


async function adicionarEstado() {

    const nome =
        document
            .getElementById("nomeEstado")
            ?.value
            .trim();

    const sigla =
        document
            .getElementById("siglaEstado")
            ?.value
            .trim();

    const regiaoId =
        document
            .getElementById("regiaoId")
            ?.value;


    if (!nome || !regiaoId) {

        alert(
            "Informe o nome e a região."
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("estados")
            .insert({
                nome,
                sigla,
                regiao_id: regiaoId
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar estado."
        );

        return;
    }


    document.getElementById(
        "nomeEstado"
    ).value = "";

    document.getElementById(
        "siglaEstado"
    ).value = "";

    await popularEstados();

    await listarEstados();

    await carregarDashboard();
}


async function editarEstado(id) {

    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;
    }


    const nome =
        prompt(
            "Nome do estado:",
            data.nome
        );

    if (!nome) {
        return;
    }


    const sigla =
        prompt(
            "Sigla:",
            data.sigla || ""
        );


    const { error: erroUpdate } =
        await supabaseClient
            .from("estados")
            .update({
                nome: nome.trim(),
                sigla: sigla
                    ? sigla.trim()
                    : null
            })
            .eq("id", id);


    if (erroUpdate) {

        console.error(erroUpdate);

        alert(
            "Erro ao editar estado."
        );

        return;
    }


    await popularEstados();

    await listarEstados();

    await carregarDashboard();
}


async function excluirEstado(id) {

    if (
        !confirm(
            "Deseja realmente excluir este estado?"
        )
    ) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("estados")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir o estado."
        );

        return;
    }


    await popularEstados();

    await listarEstados();

    await carregarDashboard();
}


// ============================================================
// CIDADES
// ============================================================

async function popularCidades() {

    const selects =
        document.querySelectorAll(
            "#cidadeId, #filtroCidade, #clinicaCidade"
        );


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("id, nome")
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    selects.forEach(select => {

        const valorAtual =
            select.value;

        select.innerHTML = `
            <option value="">
                Selecione a cidade
            </option>
        `;


        data.forEach(cidade => {

            const option =
                document.createElement("option");

            option.value =
                cidade.id;

            option.textContent =
                cidade.nome;

            select.appendChild(option);
        });


        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}


async function listarCidades() {

    const tabela =
        document.getElementById("listaCidades");

    if (!tabela) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select(`
                id,
                nome,
                estados (
                    nome,
                    sigla
                )
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    tabela.innerHTML =
        data.map(cidade => `

            <tr>

                <td>
                    ${cidade.id}
                </td>

                <td>
                    ${escapeHTML(cidade.nome)}
                </td>

                <td>
                    ${escapeHTML(
                        cidade.estados?.nome || "-"
                    )}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarCidade(${cidade.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirCidade(${cidade.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `).join("");
}


async function adicionarCidade() {

    const nome =
        document
            .getElementById("nomeCidade")
            ?.value
            .trim();

    const estadoId =
        document
            .getElementById("estadoId")
            ?.value;


    if (!nome || !estadoId) {

        alert(
            "Informe o nome e o estado."
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("cidades")
            .insert({
                nome,
                estado_id: estadoId
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar cidade."
        );

        return;
    }


    document.getElementById(
        "nomeCidade"
    ).value = "";


    await popularCidades();

    await listarCidades();

    await carregarDashboard();
}


async function editarCidade(id) {

    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;
    }


    const nome =
        prompt(
            "Nome da cidade:",
            data.nome
        );

    if (!nome) {
        return;
    }


    const { error: erroUpdate } =
        await supabaseClient
            .from("cidades")
            .update({
                nome: nome.trim()
            })
            .eq("id", id);


    if (erroUpdate) {

        console.error(erroUpdate);

        alert(
            "Erro ao editar cidade."
        );

        return;
    }


    await popularCidades();

    await listarCidades();

    await carregarDashboard();
}


async function excluirCidade(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta cidade?"
        )
    ) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("cidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir a cidade."
        );

        return;
    }


    await popularCidades();

    await listarCidades();

    await carregarDashboard();
}


// ============================================================
// BAIRROS
// ============================================================

async function popularBairros() {

    const selects =
        document.querySelectorAll(
            "#bairroId, #filtroBairro, #clinicaBairro"
        );


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("id, nome")
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    selects.forEach(select => {

        const valorAtual =
            select.value;

        select.innerHTML = `
            <option value="">
                Selecione o bairro
            </option>
        `;


        data.forEach(bairro => {

            const option =
                document.createElement("option");

            option.value =
                bairro.id;

            option.textContent =
                bairro.nome;

            select.appendChild(option);
        });


        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}


async function listarBairros() {

    const tabela =
        document.getElementById("listaBairros");

    if (!tabela) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select(`
                id,
                nome,
                cidades (
                    nome,
                    estados (
                        nome,
                        sigla
                    )
                )
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    tabela.innerHTML =
        data.map(bairro => `

            <tr>

                <td>
                    ${bairro.id}
                </td>

                <td>
                    ${escapeHTML(bairro.nome)}
                </td>

                <td>
                    ${escapeHTML(
                        bairro.cidades?.nome || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        bairro.cidades?.estados?.sigla || "-"
                    )}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarBairro(${bairro.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirBairro(${bairro.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `).join("");
}


async function adicionarBairro() {

    const nome =
        document
            .getElementById("nomeBairro")
            ?.value
            .trim();

    const cidadeId =
        document
            .getElementById("cidadeId")
            ?.value;


    if (!nome || !cidadeId) {

        alert(
            "Informe o nome e a cidade."
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("bairros")
            .insert({
                nome,
                cidade_id: cidadeId
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar bairro."
        );

        return;
    }


    document.getElementById(
        "nomeBairro"
    ).value = "";


    await popularBairros();

    await listarBairros();

    await carregarDashboard();
}


async function editarBairro(id) {

    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;
    }


    const nome =
        prompt(
            "Nome do bairro:",
            data.nome
        );

    if (!nome) {
        return;
    }


    const { error: erroUpdate } =
        await supabaseClient
            .from("bairros")
            .update({
                nome: nome.trim()
            })
            .eq("id", id);


    if (erroUpdate) {

        console.error(erroUpdate);

        alert(
            "Erro ao editar bairro."
        );

        return;
    }


    await popularBairros();

    await listarBairros();

    await carregarDashboard();
}


async function excluirBairro(id) {

    if (
        !confirm(
            "Deseja realmente excluir este bairro?"
        )
    ) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("bairros")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir o bairro."
        );

        return;
    }


    await popularBairros();

    await listarBairros();

    await carregarDashboard();
}


// ============================================================
// ESPECIALIDADES
// ============================================================

async function popularEspecialidades() {

    const selects =
        document.querySelectorAll(
            "#especialidadeId, #filtroEspecialidade"
        );


    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("id, nome")
            .order("nome");


    if (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

        return;
    }


    selects.forEach(select => {

        const valorAtual =
            select.value;

        select.innerHTML = `
            <option value="">
                Selecione a especialidade
            </option>
        `;


        data.forEach(especialidade => {

            const option =
                document.createElement("option");

            option.value =
                especialidade.id;

            option.textContent =
                especialidade.nome;

            select.appendChild(option);
        });


        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}


async function listarEspecialidades() {

    const tabela =
        document.getElementById(
            "listaEspecialidades"
        );

    if (!tabela) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    tabela.innerHTML =
        data.map(especialidade => `

            <tr>

                <td>
                    ${especialidade.id}
                </td>

                <td>
                    ${escapeHTML(
                        especialidade.nome
                    )}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarEspecialidade(${especialidade.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirEspecialidade(${especialidade.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `).join("");
}


async function adicionarEspecialidade() {

    const input =
        document.getElementById(
            "nomeEspecialidade"
        );

    if (!input) {
        return;
    }


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Informe o nome da especialidade."
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("especialidades")
            .insert({
                nome
            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar especialidade."
        );

        return;
    }


    input.value = "";

    await popularEspecialidades();

    await listarEspecialidades();

    await carregarDashboard();
}


async function editarEspecialidade(id) {

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;
    }


    const nome =
        prompt(
            "Nome da especialidade:",
            data.nome
        );

    if (!nome) {
        return;
    }


    const { error: erroUpdate } =
        await supabaseClient
            .from("especialidades")
            .update({
                nome: nome.trim()
            })
            .eq("id", id);


    if (erroUpdate) {

        console.error(erroUpdate);

        alert(
            "Erro ao editar especialidade."
        );

        return;
    }


    await popularEspecialidades();

    await listarEspecialidades();

    await carregarDashboard();
}


async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta especialidade?"
        )
    ) {
        return;
    }


    const { error: erroVinculo } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq("especialidade_id", id);


    if (erroVinculo) {

        console.error(
            "Erro ao excluir vínculos:",
            erroVinculo
        );

        alert(
            "Não foi possível excluir os vínculos da especialidade."
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("especialidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir a especialidade."
        );

        return;
    }


    await popularEspecialidades();

    await listarEspecialidades();

    await carregarDashboard();
}


// ============================================================
// CASCATA DE LOCALIZAÇÃO
// REGIÃO → ESTADO → CIDADE → BAIRRO
// ============================================================

function ligarCascataLocalizacao() {

    const regiao =
        document.getElementById(
            "clinicaRegiao"
        );

    const estado =
        document.getElementById(
            "clinicaEstado"
        );

    const cidade =
        document.getElementById(
            "clinicaCidade"
        );


    if (regiao) {

        regiao.addEventListener(
            "change",
            async () => {

                await carregarEstadosClinica(
                    regiao.value
                );

            }
        );
    }


    if (estado) {

        estado.addEventListener(
            "change",
            async () => {

                await carregarCidadesClinica(
                    estado.value
                );

            }
        );
    }


    if (cidade) {

        cidade.addEventListener(
            "change",
            async () => {

                await carregarBairrosClinica(
                    cidade.value
                );

            }
        );
    }
}


// ============================================================
// CARREGAR ESTADOS DA CLÍNICA
// ============================================================

async function carregarEstadosClinica(
    regiaoId,
    estadoSelecionado = ""
) {

    const select =
        document.getElementById(
            "clinicaEstado"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Selecione o estado
        </option>
    `;


    if (!regiaoId) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("id, nome, sigla")
            .eq("regiao_id", regiaoId)
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    data.forEach(estado => {

        const option =
            document.createElement("option");

        option.value =
            estado.id;

        option.textContent =
            estado.sigla
                ? `${estado.nome} (${estado.sigla})`
                : estado.nome;

        select.appendChild(option);
    });


    if (estadoSelecionado) {
        select.value =
            String(estadoSelecionado);
    }
}


// ============================================================
// CARREGAR CIDADES DA CLÍNICA
// ============================================================

async function carregarCidadesClinica(
    estadoId,
    cidadeSelecionada = ""
) {

    const select =
        document.getElementById(
            "clinicaCidade"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Selecione a cidade
        </option>
    `;


    const bairro =
        document.getElementById(
            "clinicaBairro"
        );

    if (bairro) {

        bairro.innerHTML = `
            <option value="">
                Selecione o bairro
            </option>
        `;
    }


    if (!estadoId) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("id, nome")
            .eq("estado_id", estadoId)
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    data.forEach(cidade => {

        const option =
            document.createElement("option");

        option.value =
            cidade.id;

        option.textContent =
            cidade.nome;

        select.appendChild(option);
    });


    if (cidadeSelecionada) {

        select.value =
            String(cidadeSelecionada);
    }
}


// ============================================================
// CARREGAR BAIRROS DA CLÍNICA
// ============================================================

async function carregarBairrosClinica(
    cidadeId,
    bairroSelecionado = ""
) {

    const select =
        document.getElementById(
            "clinicaBairro"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Selecione o bairro
        </option>
    `;


    if (!cidadeId) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("id, nome")
            .eq("cidade_id", cidadeId)
            .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    data.forEach(bairro => {

        const option =
            document.createElement("option");

        option.value =
            bairro.id;

        option.textContent =
            bairro.nome;

        select.appendChild(option);
    });


    if (bairroSelecionado) {

        select.value =
            String(bairroSelecionado);
    }
}


// ============================================================
// CLÍNICAS
// ============================================================

async function listarClinicas() {

    const tabela =
        document.getElementById(
            "listaClinicas"
        );


    if (!tabela) {
        return;
    }


    const busca =
        document
            .getElementById(
                "filtroClinica"
            )
            ?.value
            ?.trim();


    const filtroAtivo =
        document
            .getElementById(
                "filtroStatusClinica"
            )
            ?.value;


    let query =
        supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                endereco,
                telefone,
                ativo,
                bairro_id,
                bairros (
                    id,
                    nome,
                    cidades (
                        id,
                        nome,
                        estados (
                            id,
                            nome,
                            sigla,
                            regioes (
                                id,
                                nome
                            )
                        )
                    )
                )
            `)
            .order("id", {
                ascending: false
            });


    if (busca) {

        query =
            query.ilike(
                "nome",
                `%${busca}%`
            );
    }


    if (
        filtroAtivo === "ativo"
    ) {

        query =
            query.eq(
                "ativo",
                true
            );
    }


    if (
        filtroAtivo === "inativo"
    ) {

        query =
            query.eq(
                "ativo",
                false
            );
    }


    const { data, error } =
        await query;


    if (error) {

        console.error(
            "Erro ao listar clínicas:",
            error
        );

        tabela.innerHTML = `
            <tr>
                <td colspan="8">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

        return;
    }


    if (!data || data.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="8">
                    Nenhuma clínica encontrada.
                </td>
            </tr>
        `;

        return;
    }


    // ========================================================
    // IMPORTANTE:
    // A consulta é feita SOMENTE na tabela clinicas.
    // Isso evita duplicação causada pela tabela
    // clinica_especialidades.
    // ========================================================

    const clinicasUnicas =
        Array.from(
            new Map(
                data.map(
                    clinica =>
                        [clinica.id, clinica]
                )
            ).values()
        );


    tabela.innerHTML = "";


    for (const clinica of clinicasUnicas) {

        const bairro =
            clinica.bairros;

        const cidade =
            bairro?.cidades;

        const estado =
            cidade?.estados;


        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${escapeHTML(
                    clinica.nome
                )}
            </td>

            <td>
                ${escapeHTML(
                    bairro?.nome || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    cidade?.nome || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    estado?.sigla ||
                    estado?.nome ||
                    "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    clinica.telefone || "-"
                )}
            </td>

            <td>

                <span class="
                    ${clinica.ativo
                        ? "status-ativo"
                        : "status-inativo"
                    }
                ">

                    ${clinica.ativo
                        ? "Ativa"
                        : "Inativa"
                    }

                </span>

            </td>

            <td>

                <div
                    id="especialidades-${clinica.id}"
                    class="tags-especialidades"
                >
                    Carregando...
                </div>

            </td>

            <td>

                <div class="acoes-tabela">

                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarClinica(${clinica.id})"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirClinica(${clinica.id})"
                    >
                        Excluir
                    </button>

                </div>

            </td>
        `;


        tabela.appendChild(tr);


        await carregarEspecialidadesDaClinica(
            clinica.id
        );
    }
}


// ============================================================
// CARREGAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function carregarEspecialidadesDaClinica(
    clinicaId
) {

    const container =
        document.getElementById(
            `especialidades-${clinicaId}`
        );


    if (!container) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                especialidade_id,
                rede,
                ativo,
                especialidades (
                    id,
                    nome
                )
            `)
            .eq(
                "clinica_id",
                clinicaId
            );


    if (error) {

        console.error(
            "Erro ao carregar especialidades da clínica:",
            error
        );

        container.innerHTML =
            "Erro";

        return;
    }


    if (!data || data.length === 0) {

        container.innerHTML =
            `<span class="sem-especialidade">
                Nenhuma
            </span>`;

        return;
    }


    // Evita duplicações
    const unicos =
        Array.from(
            new Map(
                data.map(item => {

                    const rede =
                        normalizarRede(
                            item.rede
                        );

                    return [
                        `${item.especialidade_id}-${rede}`,
                        {
                            ...item,
                            rede
                        }
                    ];
                })
            ).values()
        );


    container.innerHTML =
        unicos.map(item => `

            <span class="tag-especialidade">

                ${escapeHTML(
                    item.especialidades?.nome ||
                    "Especialidade"
                )}

                <small>
                    ${escapeHTML(
                        item.rede || ""
                    )}
                </small>

            </span>

        `).join("");
}


// ============================================================
// ABRIR MODAL DE CLÍNICA
// ============================================================

async function abrirModalClinica(
    id = null
) {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) {

        console.error(
            "Modal da clínica não encontrado."
        );

        return;
    }


    limparFormularioClinica();


    modal.classList.add("ativo");


    if (id) {

        await carregarDadosEdicaoClinica(
            id
        );

    } else {

        adicionarLinhaEspecialidade();

    }
}


// ============================================================
// EDITAR CLÍNICA
// ============================================================

async function editarClinica(id) {

    await abrirModalClinica(id);
}


// ============================================================
// CARREGAR DADOS PARA EDIÇÃO
// ============================================================

async function carregarDadosEdicaoClinica(
    id
) {

    console.log(
        "Carregando clínica para edição:",
        id
    );


    const { data: clinica, error } =
        await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                endereco,
                telefone,
                ativo,
                bairro_id,
                bairros (
                    id,
                    nome,
                    cidades (
                        id,
                        nome,
                        estados (
                            id,
                            nome,
                            sigla,
                            regiao_id,
                            regioes (
                                id,
                                nome
                            )
                        )
                    )
                )
            `)
            .eq("id", id)
            .single();


    if (error) {

        console.error(
            "Erro ao buscar clínica:",
            error
        );

        alert(
            "Erro ao carregar os dados da clínica."
        );

        return;
    }


    // ========================================================
    // PREENCHER CAMPOS
    // ========================================================

    definirValor(
        "clinicaId",
        clinica.id
    );

    definirValor(
        "clinicaNome",
        clinica.nome
    );

    definirValor(
        "clinicaEndereco",
        clinica.endereco
    );

    definirValor(
        "clinicaTelefone",
        clinica.telefone
    );


    const ativo =
        document.getElementById(
            "clinicaAtivo"
        );

    if (ativo) {

        if (
            ativo.type === "checkbox"
        ) {

            ativo.checked =
                clinica.ativo !== false;

        } else {

            ativo.value =
                clinica.ativo
                    ? "true"
                    : "false";
        }
    }


    // ========================================================
    // LOCALIZAÇÃO
    // ========================================================

    const bairro =
        clinica.bairros;

    const cidade =
        bairro?.cidades;

    const estado =
        cidade?.estados;

    const regiao =
        estado?.regioes;


    if (regiao) {

        definirValor(
            "clinicaRegiao",
            regiao.id
        );
    }


    if (regiao?.id) {

        await carregarEstadosClinica(
            regiao.id,
            estado?.id
        );
    }


    if (estado?.id) {

        await carregarCidadesClinica(
            estado.id,
            cidade?.id
        );
    }


    if (cidade?.id) {

        await carregarBairrosClinica(
            cidade.id,
            bairro?.id
        );
    }


    // ========================================================
    // ESPECIALIDADES
    // ========================================================

    const container =
        document.getElementById(
            "especialidadesClinica"
        );


    if (!container) {

        console.error(
            "Container de especialidades não encontrado."
        );

        return;
    }


    container.innerHTML = "";


    const {
        data: vinculos,
        error: erroVinculos
    } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                especialidade_id,
                rede,
                ativo,
                especialidades (
                    id,
                    nome
                )
            `)
            .eq(
                "clinica_id",
                id
            );


    if (erroVinculos) {

        console.error(
            "Erro ao carregar especialidades da clínica:",
            erroVinculos
        );

        return;
    }


    console.log(
        "Vínculos encontrados:",
        vinculos
    );


    if (
        !vinculos ||
        vinculos.length === 0
    ) {

        adicionarLinhaEspecialidade();

        return;
    }


    // ========================================================
    // REMOVE DUPLICAÇÕES
    // ========================================================

    const vinculosUnicos =
        Array.from(
            new Map(
                vinculos.map(item => {

                    const rede =
                        normalizarRede(
                            item.rede
                        );

                    return [
                        `${item.especialidade_id}-${rede}`,
                        {
                            ...item,
                            rede
                        }
                    ];

                })
            ).values()
        );


    // ========================================================
    // CRIAR UMA LINHA PARA CADA ESPECIALIDADE
    // ========================================================

    vinculosUnicos.forEach(item => {

        adicionarLinhaEspecialidade(
            item.especialidade_id,
            item.rede
        );

    });
}


// ============================================================
// ADICIONAR LINHA DE ESPECIALIDADE
// ============================================================

function adicionarLinhaEspecialidade(
    especialidadeSelecionada = "",
    redeSelecionada = ""
) {

    const container =
        document.getElementById(
            "especialidadesClinica"
        );


    if (!container) {

        console.error(
            "Container especialidadesClinica não encontrado."
        );

        return;
    }


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    // ========================================================
    // SELECT DE ESPECIALIDADE
    // ========================================================

    const selectEspecialidade =
        document.createElement("select");


    selectEspecialidade.className =
        "select-especialidade";


    selectEspecialidade.innerHTML = `
        <option value="">
            Selecione a especialidade
        </option>
    `;


    // Buscar especialidades diretamente do banco
    supabaseClient
        .from("especialidades")
        .select("id, nome")
        .order("nome")
        .then(({ data, error }) => {

            if (error) {

                console.error(
                    "Erro ao carregar especialidades:",
                    error
                );

                return;
            }


            data.forEach(
                especialidade => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        especialidade.id;

                    option.textContent =
                        especialidade.nome;

                    selectEspecialidade
                        .appendChild(
                            option
                        );
                }
            );


            if (
                especialidadeSelecionada
            ) {

                selectEspecialidade.value =
                    String(
                        especialidadeSelecionada
                    );
            }
        });


    // ========================================================
    // SELECT DE REDE
    // ========================================================

    const selectRede =
        document.createElement("select");


    selectRede.className =
        "select-rede";


    selectRede.innerHTML = `

        <option value="">
            Selecione a rede
        </option>

        <option value="Sindilegis">
            Sindilegis
        </option>

        <option value="Especialistas">
            Especialistas
        </option>

    `;


    // ========================================================
    // CORREÇÃO IMPORTANTE
    // ========================================================
    // Normaliza valores antigos do banco.
    //
    // Exemplos:
    //
    // sindilegis
    // SINDILEGIS
    // Sindilegis
    // Sindilegis
    //
    // Todos passam a aparecer como Sindilegis.
    //
    // especialista
    // especialistas
    // Especialistas
    //
    // Todos passam a aparecer como Especialistas.
    // ========================================================

    const redeNormalizada =
        normalizarRede(
            redeSelecionada
        );


    if (redeNormalizada) {

        selectRede.value =
            redeNormalizada;
    }


    // ========================================================
    // BOTÃO REMOVER
    // ========================================================

    const botaoRemover =
        document.createElement("button");


    botaoRemover.type =
        "button";


    botaoRemover.className =
        "btn-remover-especialidade";


    botaoRemover.textContent =
        "Remover";


    botaoRemover.addEventListener(
        "click",
        () => {

            linha.remove();

        }
    );


    // ========================================================
    // MONTAR LINHA
    // ========================================================

    linha.appendChild(
        selectEspecialidade
    );

    linha.appendChild(
        selectRede
    );

    linha.appendChild(
        botaoRemover
    );


    container.appendChild(
        linha
    );
}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(
    event
) {

    if (event) {
        event.preventDefault();
    }


    console.log(
        "Salvando clínica..."
    );


    // ========================================================
    // CAMPOS
    // ========================================================

    const id =
        document
            .getElementById(
                "clinicaId"
            )
            ?.value;


    const nome =
        document
            .getElementById(
                "clinicaNome"
            )
            ?.value
            ?.trim();


    const endereco =
        document
            .getElementById(
                "clinicaEndereco"
            )
            ?.value
            ?.trim();


    const telefone =
        document
            .getElementById(
                "clinicaTelefone"
            )
            ?.value
            ?.trim();


    const bairroId =
        document
            .getElementById(
                "clinicaBairro"
            )
            ?.value;


    const ativoElemento =
        document.getElementById(
            "clinicaAtivo"
        );


    let ativo = true;


    if (ativoElemento) {

        if (
            ativoElemento.type ===
            "checkbox"
        ) {

            ativo =
                ativoElemento.checked;

        } else {

            ativo =
                ativoElemento.value !==
                "false";
        }
    }


    // ========================================================
    // VALIDAÇÕES
    // ========================================================

    if (!nome) {

        alert(
            "Informe o nome da clínica."
        );

        return;
    }


    if (!endereco) {

        alert(
            "Informe o endereço da clínica."
        );

        return;
    }


    if (!bairroId) {

        alert(
            "Selecione o bairro da clínica."
        );

        return;
    }


    // ========================================================
    // OBJETO DA CLÍNICA
    // ========================================================

    const dadosClinica = {

        nome,

        endereco,

        telefone: telefone || null,

        bairro_id: bairroId,

        ativo
    };


    let clinicaId =
        id || null;


    // ========================================================
    // INSERIR
    // ========================================================

    if (!clinicaId) {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("clinicas")
                .insert(
                    dadosClinica
                )
                .select("id")
                .single();


        if (error) {

            console.error(
                "Erro ao cadastrar clínica:",
                error
            );

            alert(
                "Erro ao cadastrar clínica."
            );

            return;
        }


        clinicaId =
            data.id;


    } else {

        // ====================================================
        // ATUALIZAR
        // ====================================================

        const { error } =
            await supabaseClient
                .from("clinicas")
                .update(
                    dadosClinica
                )
                .eq(
                    "id",
                    clinicaId
                );


        if (error) {

            console.error(
                "Erro ao atualizar clínica:",
                error
            );

            alert(
                "Erro ao atualizar clínica."
            );

            return;
        }


        // ====================================================
        // REMOVER VÍNCULOS ANTIGOS
        // ====================================================

        const {
            error: erroDelete
        } =
            await supabaseClient
                .from(
                    "clinica_especialidades"
                )
                .delete()
                .eq(
                    "clinica_id",
                    clinicaId
                );


        if (erroDelete) {

            console.error(
                "Erro ao limpar especialidades antigas:",
                erroDelete
            );

            alert(
                "A clínica foi atualizada, mas houve erro ao atualizar as especialidades."
            );

            return;
        }
    }


    // ========================================================
    // PEGAR ESPECIALIDADES DA TELA
    // ========================================================

    const container =
        document.getElementById(
            "especialidadesClinica"
        );


    const linhas =
        container
            ? container.querySelectorAll(
                ".linha-especialidade"
            )
            : [];


    const especialidadesParaSalvar =
        [];


    linhas.forEach(linha => {

        const selectEspecialidade =
            linha.querySelector(
                ".select-especialidade"
            );


        const selectRede =
            linha.querySelector(
                ".select-rede"
            );


        if (
            !selectEspecialidade ||
            !selectRede
        ) {
            return;
        }


        const especialidadeId =
            selectEspecialidade.value;


        const rede =
            normalizarRede(
                selectRede.value
            );


        if (
            especialidadeId &&
            rede
        ) {

            especialidadesParaSalvar.push({

                clinica_id:
                    clinicaId,

                especialidade_id:
                    Number(
                        especialidadeId
                    ),

                rede,

                ativo: true
            });
        }
    });


    // ========================================================
    // REMOVE DUPLICAÇÕES
    // ========================================================

    const especialidadesUnicas =
        Array.from(
            new Map(
                especialidadesParaSalvar.map(
                    item => [

                        `${item.especialidade_id}-${item.rede}`,

                        item

                    ]
                )
            ).values()
        );


    // ========================================================
    // SALVAR VÍNCULOS
    // ========================================================

    if (
        especialidadesUnicas.length > 0
    ) {

        const {
            error
        } =
            await supabaseClient
                .from(
                    "clinica_especialidades"
                )
                .insert(
                    especialidadesUnicas
                );


        if (error) {

            console.error(
                "Erro ao salvar especialidades:",
                error
            );

            alert(
                "A clínica foi salva, mas houve erro ao salvar as especialidades."
            );

            return;
        }
    }


    // ========================================================
    // FINALIZAÇÃO
    // ========================================================

    alert(
        id
            ? "Clínica atualizada com sucesso!"
            : "Clínica cadastrada com sucesso!"
    );


    fecharModalClinica();


    await listarClinicas();

    await carregarDashboard();

    await popularEspecialidades();
}


// ============================================================
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta clínica?"
        )
    ) {
        return;
    }


    // Primeiro remove os vínculos

    const {
        error: erroVinculos
    } =
        await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .delete()
            .eq(
                "clinica_id",
                id
            );


    if (erroVinculos) {

        console.error(
            "Erro ao excluir vínculos:",
            erroVinculos
        );

        alert(
            "Não foi possível excluir as especialidades da clínica."
        );

        return;
    }


    // Depois remove a clínica

    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "Erro ao excluir clínica:",
            error
        );

        alert(
            "Não foi possível excluir a clínica."
        );

        return;
    }


    alert(
        "Clínica excluída com sucesso!"
    );


    await listarClinicas();

    await carregarDashboard();
}


// ============================================================
// FECHAR MODAL
// ============================================================

function fecharModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (modal) {

        modal.classList.remove(
            "ativo"
        );
    }
}


// ============================================================
// LIMPAR FORMULÁRIO DA CLÍNICA
// ============================================================

function limparFormularioClinica() {

    definirValor(
        "clinicaId",
        ""
    );

    definirValor(
        "clinicaNome",
        ""
    );

    definirValor(
        "clinicaEndereco",
        ""
    );

    definirValor(
        "clinicaTelefone",
        ""
    );


    definirValor(
        "clinicaRegiao",
        ""
    );


    const estado =
        document.getElementById(
            "clinicaEstado"
        );

    if (estado) {

        estado.innerHTML = `
            <option value="">
                Selecione o estado
            </option>
        `;
    }


    const cidade =
        document.getElementById(
            "clinicaCidade"
        );

    if (cidade) {

        cidade.innerHTML = `
            <option value="">
                Selecione a cidade
            </option>
        `;
    }


    const bairro =
        document.getElementById(
            "clinicaBairro"
        );

    if (bairro) {

        bairro.innerHTML = `
            <option value="">
                Selecione o bairro
            </option>
        `;
    }


    const ativo =
        document.getElementById(
            "clinicaAtivo"
        );

    if (ativo) {

        if (
            ativo.type === "checkbox"
        ) {

            ativo.checked = true;

        } else {

            ativo.value = "true";
        }
    }


    const especialidades =
        document.getElementById(
            "especialidadesClinica"
        );


    if (especialidades) {

        especialidades.innerHTML =
            "";
    }
}


// ============================================================
// FILTRO DE CLÍNICAS
// ============================================================

function configurarFiltroClinicas() {

    const input =
        document.getElementById(
            "filtroClinica"
        );


    const status =
        document.getElementById(
            "filtroStatusClinica"
        );


    if (input) {

        input.addEventListener(
            "input",
            listarClinicas
        );
    }


    if (status) {

        status.addEventListener(
            "change",
            listarClinicas
        );
    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarFiltroClinicas();

    }
);


// ============================================================
// EXPOR FUNÇÕES PARA O HTML
// ============================================================

window.mostrarPagina =
    mostrarPagina;

window.abrirModalClinica =
    abrirModalClinica;

window.editarClinica =
    editarClinica;

window.salvarClinica =
    salvarClinica;

window.excluirClinica =
    excluirClinica;

window.fecharModalClinica =
    fecharModalClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.adicionarRegiao =
    adicionarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.adicionarEstado =
    adicionarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;

window.adicionarCidade =
    adicionarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;

window.adicionarBairro =
    adicionarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;

window.adicionarEspecialidade =
    adicionarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.listarClinicas =
    listarClinicas;

window.listarRegioes =
    listarRegioes;

window.listarEstados =
    listarEstados;

window.listarCidades =
    listarCidades;

window.listarBairros =
    listarBairros;

window.listarEspecialidades =
    listarEspecialidades;

console.log(
    "Todas as funções do admin.js foram carregadas."
);
