console.log("admin.js carregado");


// ======================================
// CONFIGURAÇÕES
// ======================================

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Painel administrativo iniciado");

    await carregarDashboard();

    await listarEspecialidades();
    await listarRegioes();
    await listarEstados();
    await listarCidades();
    await listarBairros();
    await listarClinicas();

    await popularRegioes();
    await popularEstados();
    await popularCidades();

});


// ======================================
// NAVEGAÇÃO
// ======================================

function mostrarPagina(nomePagina) {

    document.querySelectorAll(".pagina")
        .forEach((pagina) => {

            pagina.classList.remove("ativa");

        });


    const paginaSelecionada =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (paginaSelecionada) {

        paginaSelecionada.classList.add("ativa");

    }


    document.querySelectorAll(".menu-item")
        .forEach((botao) => {

            botao.classList.remove("ativo");

        });


    const botaoSelecionado =
        document.querySelector(
            `[data-pagina="${nomePagina}"]`
        );


    if (botaoSelecionado) {

        botaoSelecionado.classList.add("ativo");

    }


    const titulo =
        document.getElementById("tituloPagina");


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina]
            || "Painel Administrativo";

    }


    // CARREGAR DADOS DA PÁGINA

    if (nomePagina === "clinicas") {

        listarClinicas();

    }


    if (nomePagina === "especialidades") {

        listarEspecialidades();

    }


    if (nomePagina === "regioes") {

        listarRegioes();

    }


    if (nomePagina === "estados") {

        listarEstados();
        popularRegioes();

    }


    if (nomePagina === "cidades") {

        listarCidades();
        popularEstados();

    }


    if (nomePagina === "bairros") {

        listarBairros();
        popularCidades();

    }


    if (nomePagina === "dashboard") {

        carregarDashboard();

    }

}


// ======================================
// VOLTAR PARA O SITE
// ======================================

function voltarParaSite() {

    window.location.href = "index.html";

}


// ======================================
// SAIR
// ======================================

function sair() {

    const confirmar =
        confirm("Deseja realmente sair do painel?");


    if (!confirmar) return;


    window.location.href = "login.html";

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        const [
            clinicas,
            especialidades,
            regioes,
            estados,
            cidades,
            bairros
        ] = await Promise.all([

            supabaseClient
                .from("clinicas")
                .select("id, ativo"),

            supabaseClient
                .from("especialidades")
                .select("id"),

            supabaseClient
                .from("regioes")
                .select("id"),

            supabaseClient
                .from("estados")
                .select("id"),

            supabaseClient
                .from("cidades")
                .select("id"),

            supabaseClient
                .from("bairros")
                .select("id")

        ]);


        const totalClinicas =
            clinicas.data?.length || 0;


        const totalAtivas =
            clinicas.data?.filter(
                clinica =>
                    clinica.ativo === true
            ).length || 0;


        const totalEspecialidades =
            especialidades.data?.length || 0;


        const totalRegioes =
            regioes.data?.length || 0;


        const totalEstados =
            estados.data?.length || 0;


        const totalCidades =
            cidades.data?.length || 0;


        const totalBairros =
            bairros.data?.length || 0;


        atualizarTexto(
            "totalClinicas",
            totalClinicas
        );

        atualizarTexto(
            "totalClinicasAtivas",
            totalAtivas
        );

        atualizarTexto(
            "totalEspecialidades",
            totalEspecialidades
        );

        atualizarTexto(
            "totalRegioes",
            totalRegioes
        );

        atualizarTexto(
            "totalEstados",
            totalEstados
        );

        atualizarTexto(
            "totalCidades",
            totalCidades
        );

        atualizarTexto(
            "totalBairros",
            totalBairros
        );


        atualizarTexto(
            "resumoClinicas",
            totalClinicas
        );

        atualizarTexto(
            "resumoEspecialidades",
            totalEspecialidades
        );


        const localidades =
            totalRegioes +
            totalEstados +
            totalCidades +
            totalBairros;


        atualizarTexto(
            "resumoLocalidades",
            localidades
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// ======================================
// ATUALIZAR TEXTO
// ======================================

function atualizarTexto(id, valor) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent = valor;

    }

}


// ======================================
// POPULAR REGIÕES
// ======================================

async function popularRegioes() {

    const selects =
        document.querySelectorAll(
            "#estadoRegiao, #clinicaRegiao"
        );


    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    selects.forEach(select => {

        const valorAtual =
            select.value;


        select.innerHTML =
            '<option value="">Selecione uma região</option>';


        data.forEach(regiao => {

            const option =
                document.createElement("option");


            option.value =
                regiao.id;


            option.textContent =
                regiao.nome;


            select.appendChild(option);

        });


        if (valorAtual) {

            select.value =
                valorAtual;

        }

    });

}


// ======================================
// POPULAR ESTADOS
// ======================================

async function popularEstados() {

    const selects =
        document.querySelectorAll(
            "#cidadeEstado"
        );


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    selects.forEach(select => {

        const valorAtual =
            select.value;


        select.innerHTML =
            '<option value="">Selecione um estado</option>';


        data.forEach(estado => {

            const option =
                document.createElement("option");


            option.value =
                estado.id;


            option.textContent =
                estado.nome;


            select.appendChild(option);

        });


        if (valorAtual) {

            select.value =
                valorAtual;

        }

    });

}


// ======================================
// POPULAR CIDADES
// ======================================

async function popularCidades() {

    const selects =
        document.querySelectorAll(
            "#bairroCidade"
        );


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    selects.forEach(select => {

        const valorAtual =
            select.value;


        select.innerHTML =
            '<option value="">Selecione uma cidade</option>';


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

            select.value =
                valorAtual;

        }

    });

}


// ======================================
// REGIÕES
// ======================================

async function listarRegioes() {

    const container =
        document.getElementById(
            "listaRegioes"
        );


    if (!container) return;


    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            '<div class="sem-dados">Nenhuma região cadastrada.</div>';

        return;

    }


    data.forEach(regiao => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <strong>
                    ${regiao.nome}
                </strong>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarRegiao('${regiao.id}', '${regiao.nome}')"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirRegiao('${regiao.id}')"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


// ======================================
// SALVAR REGIÃO
// ======================================

async function salvarRegiao() {

    const input =
        document.getElementById(
            "nomeRegiao"
        );


    const editId =
        document.getElementById(
            "regiaoEditId"
        );


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da região."
        );

        return;

    }


    let resultado;


    if (editId.value) {

        resultado =
            await supabaseClient
                .from("regioes")
                .update({ nome })
                .eq(
                    "id",
                    editId.value
                );

    } else {

        resultado =
            await supabaseClient
                .from("regioes")
                .insert({ nome });

    }


    if (resultado.error) {

        alert(
            "Erro ao salvar região."
        );

        console.error(
            resultado.error
        );

        return;

    }


    input.value = "";
    editId.value = "";


    await listarRegioes();
    await popularRegioes();
    await carregarDashboard();

}


// ======================================
// EDITAR REGIÃO
// ======================================

function editarRegiao(id, nome) {

    document.getElementById(
        "regiaoEditId"
    ).value = id;


    document.getElementById(
        "nomeRegiao"
    ).value = nome;

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

    if (
        !confirm(
            "Deseja excluir esta região?"
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("regioes")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Não foi possível excluir a região."
        );

        console.error(error);

        return;

    }


    await listarRegioes();
    await popularRegioes();
    await carregarDashboard();

}


// ======================================
// ESTADOS
// ======================================

async function listarEstados() {

    const container =
        document.getElementById(
            "listaEstados"
        );


    if (!container) return;


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select(`
                *,
                regioes(nome)
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            '<div class="sem-dados">Nenhum estado cadastrado.</div>';

        return;

    }


    data.forEach(estado => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${estado.nome}
                    </strong>

                    <p class="item-subtitulo">

                        Região:
                        ${estado.regioes?.nome || "-"}

                    </p>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEstado('${estado.id}', '${estado.nome}', '${estado.regiao_id}')"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirEstado('${estado.id}')"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


// ======================================
// SALVAR ESTADO
// ======================================

async function salvarEstado() {

    const nome =
        document
            .getElementById("nomeEstado")
            .value
            .trim();


    const regiaoId =
        document
            .getElementById("estadoRegiao")
            .value;


    const editId =
        document
            .getElementById("estadoEditId")
            .value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,
        regiao_id: regiaoId

    };


    let resultado;


    if (editId) {

        resultado =
            await supabaseClient
                .from("estados")
                .update(dados)
                .eq("id", editId);

    } else {

        resultado =
            await supabaseClient
                .from("estados")
                .insert(dados);

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar estado."
        );

        return;

    }


    document.getElementById(
        "nomeEstado"
    ).value = "";


    document.getElementById(
        "estadoRegiao"
    ).value = "";


    document.getElementById(
        "estadoEditId"
    ).value = "";


    await listarEstados();
    await popularEstados();
    await carregarDashboard();

}


// ======================================
// EDITAR ESTADO
// ======================================

function editarEstado(
    id,
    nome,
    regiaoId
) {

    document.getElementById(
        "estadoEditId"
    ).value = id;


    document.getElementById(
        "nomeEstado"
    ).value = nome;


    document.getElementById(
        "estadoRegiao"
    ).value = regiaoId;

}


// ======================================
// EXCLUIR ESTADO
// ======================================

async function excluirEstado(id) {

    if (
        !confirm(
            "Deseja excluir este estado?"
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("estados")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir estado."
        );

        return;

    }


    await listarEstados();
    await popularEstados();
    await carregarDashboard();

}


// ======================================
// CIDADES
// ======================================

async function listarCidades() {

    const container =
        document.getElementById(
            "listaCidades"
        );


    if (!container) return;


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


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            '<div class="sem-dados">Nenhuma cidade cadastrada.</div>';

        return;

    }


    data.forEach(cidade => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${cidade.nome}
                    </strong>

                    <p class="item-subtitulo">

                        Estado:
                        ${cidade.estados?.nome || "-"}

                    </p>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarCidade('${cidade.id}', '${cidade.nome}', '${cidade.estado_id}')"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirCidade('${cidade.id}')"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


// ======================================
// SALVAR CIDADE
// ======================================

async function salvarCidade() {

    const nome =
        document
            .getElementById("nomeCidade")
            .value
            .trim();


    const estadoId =
        document
            .getElementById("cidadeEstado")
            .value;


    const editId =
        document
            .getElementById("cidadeEditId")
            .value;


    if (!nome || !estadoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,
        estado_id: estadoId

    };


    let resultado;


    if (editId) {

        resultado =
            await supabaseClient
                .from("cidades")
                .update(dados)
                .eq("id", editId);

    } else {

        resultado =
            await supabaseClient
                .from("cidades")
                .insert(dados);

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar cidade."
        );

        return;

    }


    document.getElementById(
        "nomeCidade"
    ).value = "";


    document.getElementById(
        "cidadeEstado"
    ).value = "";


    document.getElementById(
        "cidadeEditId"
    ).value = "";


    await listarCidades();
    await popularCidades();
    await carregarDashboard();

}


// ======================================
// EDITAR CIDADE
// ======================================

function editarCidade(
    id,
    nome,
    estadoId
) {

    document.getElementById(
        "cidadeEditId"
    ).value = id;


    document.getElementById(
        "nomeCidade"
    ).value = nome;


    document.getElementById(
        "cidadeEstado"
    ).value = estadoId;

}


// ======================================
// EXCLUIR CIDADE
// ======================================

async function excluirCidade(id) {

    if (
        !confirm(
            "Deseja excluir esta cidade?"
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("cidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir cidade."
        );

        return;

    }


    await listarCidades();
    await popularCidades();
    await carregarDashboard();

}


// ======================================
// BAIRROS
// ======================================

async function listarBairros() {

    const container =
        document.getElementById(
            "listaBairros"
        );


    if (!container) return;


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


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            '<div class="sem-dados">Nenhum bairro cadastrado.</div>';

        return;

    }


    data.forEach(bairro => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${bairro.nome}
                    </strong>

                    <p class="item-subtitulo">

                        Cidade:
                        ${bairro.cidades?.nome || "-"}

                    </p>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarBairro('${bairro.id}', '${bairro.nome}', '${bairro.cidade_id}')"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirBairro('${bairro.id}')"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


// ======================================
// SALVAR BAIRRO
// ======================================

async function salvarBairro() {

    const nome =
        document
            .getElementById("nomeBairro")
            .value
            .trim();


    const cidadeId =
        document
            .getElementById("bairroCidade")
            .value;


    const editId =
        document
            .getElementById("bairroEditId")
            .value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,
        cidade_id: cidadeId

    };


    let resultado;


    if (editId) {

        resultado =
            await supabaseClient
                .from("bairros")
                .update(dados)
                .eq("id", editId);

    } else {

        resultado =
            await supabaseClient
                .from("bairros")
                .insert(dados);

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar bairro."
        );

        return;

    }


    document.getElementById(
        "nomeBairro"
    ).value = "";


    document.getElementById(
        "bairroCidade"
    ).value = "";


    document.getElementById(
        "bairroEditId"
    ).value = "";


    await listarBairros();
    await carregarDashboard();

}


// ======================================
// EDITAR BAIRRO
// ======================================

function editarBairro(
    id,
    nome,
    cidadeId
) {

    document.getElementById(
        "bairroEditId"
    ).value = id;


    document.getElementById(
        "nomeBairro"
    ).value = nome;


    document.getElementById(
        "bairroCidade"
    ).value = cidadeId;

}


// ======================================
// EXCLUIR BAIRRO
// ======================================

async function excluirBairro(id) {

    if (
        !confirm(
            "Deseja excluir este bairro?"
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("bairros")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir bairro."
        );

        return;

    }


    await listarBairros();
    await carregarDashboard();

}


// ======================================
// ESPECIALIDADES
// ======================================

async function listarEspecialidades() {

    const container =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!container) return;


    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            '<div class="sem-dados">Nenhuma especialidade cadastrada.</div>';

        return;

    }


    data.forEach(especialidade => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <strong>
                    ${especialidade.nome}
                </strong>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEspecialidade('${especialidade.id}', '${especialidade.nome}')"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirEspecialidade('${especialidade.id}')"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


// ======================================
// SALVAR ESPECIALIDADE
// ======================================

async function salvarEspecialidade() {

    const input =
        document.getElementById(
            "nomeEspecialidade"
        );


    const editId =
        document.getElementById(
            "especialidadeEditId"
        );


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

        return;

    }


    let resultado;


    if (editId.value) {

        resultado =
            await supabaseClient
                .from("especialidades")
                .update({ nome })
                .eq(
                    "id",
                    editId.value
                );

    } else {

        resultado =
            await supabaseClient
                .from("especialidades")
                .insert({ nome });

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar especialidade."
        );

        return;

    }


    input.value = "";
    editId.value = "";


    await listarEspecialidades();
    await carregarDashboard();

}


// ======================================
// EDITAR ESPECIALIDADE
// ======================================

function editarEspecialidade(id, nome) {

    document.getElementById(
        "especialidadeEditId"
    ).value = id;


    document.getElementById(
        "nomeEspecialidade"
    ).value = nome;

}


// ======================================
// EXCLUIR ESPECIALIDADE
// ======================================

async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) return;


    const { error } =
        await supabaseClient
            .from("especialidades")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir especialidade."
        );

        return;

    }


    await listarEspecialidades();
    await carregarDashboard();

}


// ======================================
// CLÍNICAS
// ======================================

async function listarClinicas() {

    const container =
        document.getElementById(
            "listaClinicas"
        );


    if (!container) return;


    const busca =
        document
            .getElementById("buscarClinica")
            ?.value
            .trim();


    const status =
        document
            .getElementById("filtroStatusClinica")
            ?.value;


    let consulta =
        supabaseClient
            .from("clinicas")
            .select(`
                *,
                bairros(
                    nome,
                    cidades(
                        nome,
                        estados(
                            nome,
                            regioes(nome)
                        )
                    )
                )
            `)
            .order("nome");


    if (busca) {

        consulta =
            consulta.ilike(
                "nome",
                `%${busca}%`
            );

    }


    if (status !== "") {

        consulta =
            consulta.eq(
                "ativo",
                status === "true"
            );

    }


    const { data, error } =
        await consulta;


    if (error) {

        console.error(error);

        container.innerHTML = `

            <tr>

                <td colspan="6">

                    Erro ao carregar clínicas.

                </td>

            </tr>

        `;

        return;

    }


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="sem-dados"
                >

                    Nenhuma clínica encontrada.

                </td>

            </tr>

        `;

        return;

    }


    for (const clinica of data) {

        const especialidades =
            await buscarEspecialidadesClinica(
                clinica.id
            );


        const bairro =
            clinica.bairros?.nome || "-";


        const cidade =
            clinica.bairros?.cidades?.nome || "";


        const estado =
            clinica.bairros
                ?.cidades
                ?.estados
                ?.nome || "";


        const localizacao =
            [bairro, cidade, estado]
                .filter(Boolean)
                .join(" - ");


        const tags =
            especialidades.length
                ? especialidades
                    .map(item => `
                        <span class="especialidade-tag">
                            ${item.nome}
                        </span>
                    `)
                    .join("")
                : "-";


        container.innerHTML += `

            <tr>

                <td>

                    <strong>
                        ${clinica.nome}
                    </strong>

                    <br>

                    <small>
                        ${clinica.endereco || ""}
                    </small>

                </td>


                <td>
                    ${localizacao}
                </td>


                <td>
                    ${clinica.telefone || "-"}
                </td>


                <td>
                    ${tags}
                </td>


                <td>

                    ${
                        clinica.ativo

                        ? `
                            <span class="status-ativa">
                                Ativa
                            </span>
                        `

                        : `
                            <span class="status-inativa">
                                Inativa
                            </span>
                        `
                    }

                </td>


                <td>

                    <div class="acoes">

                        <button
                            class="btn-editar"
                            onclick="editarClinica('${clinica.id}')"
                        >
                            Editar
                        </button>


                        <button
                            class="${
                                clinica.ativo
                                    ? "btn-desativar"
                                    : "btn-ativar"
                            }"
                            onclick="alterarStatusClinica(
                                '${clinica.id}',
                                ${!clinica.ativo}
                            )"
                        >

                            ${
                                clinica.ativo
                                    ? "Desativar"
                                    : "Ativar"
                            }

                        </button>

                    </div>

                </td>

            </tr>

        `;

    }

}


// ======================================
// BUSCAR ESPECIALIDADES DA CLÍNICA
// ======================================

async function buscarEspecialidadesClinica(
    clinicaId
) {

    const { data, error } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                especialidades(
                    id,
                    nome
                )
            `)
            .eq(
                "clinica_id",
                clinicaId
            );


    if (error) {

        console.error(error);

        return [];

    }


    return data
        .map(
            item =>
                item.especialidades
        )
        .filter(Boolean);

}


// ======================================
// ABRIR MODAL
// ======================================

async function abrirModalClinica() {

    document.getElementById(
        "formClinica"
    ).reset();


    document.getElementById(
        "clinicaId"
    ).value = "";


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Nova Clínica";


    document.getElementById(
        "areaStatusClinica"
    ).classList.add("hidden");


    document.getElementById(
        "containerEspecialidades"
    ).innerHTML = "";


    await popularRegioes();


    document.getElementById(
        "modalClinica"
    ).classList.remove("hidden");


    adicionarLinhaEspecialidade();

}


// ======================================
// FECHAR MODAL
// ======================================

function fecharModalClinica() {

    document.getElementById(
        "modalClinica"
    ).classList.add("hidden");

}


// ======================================
// CARREGAR ESTADOS DA CLÍNICA
// ======================================

async function carregarEstadosClinica(
    estadoSelecionado = null
) {

    const regiaoId =
        document.getElementById(
            "clinicaRegiao"
        ).value;


    const select =
        document.getElementById(
            "clinicaEstado"
        );


    select.innerHTML =
        '<option value="">Selecione</option>';


    if (!regiaoId) return;


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiaoId
            )
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
            estado.nome;


        select.appendChild(option);

    });


    if (estadoSelecionado) {

        select.value =
            estadoSelecionado;

    }

}


// ======================================
// CARREGAR CIDADES DA CLÍNICA
// ======================================

async function carregarCidadesClinica(
    cidadeSelecionada = null
) {

    const estadoId =
        document.getElementById(
            "clinicaEstado"
        ).value;


    const select =
        document.getElementById(
            "clinicaCidade"
        );


    select.innerHTML =
        '<option value="">Selecione</option>';


    if (!estadoId) return;


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estadoId
            )
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
            cidadeSelecionada;

    }

}


// ======================================
// CARREGAR BAIRROS DA CLÍNICA
// ======================================

async function carregarBairrosClinica(
    bairroSelecionado = null
) {

    const cidadeId =
        document.getElementById(
            "clinicaCidade"
        ).value;


    const select =
        document.getElementById(
            "clinicaBairro"
        );


    select.innerHTML =
        '<option value="">Selecione</option>';


    if (!cidadeId) return;


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidadeId
            )
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
            bairroSelecionado;

    }

}


// ======================================
// ADICIONAR ESPECIALIDADE
// ======================================

async function adicionarLinhaEspecialidade(
    especialidadeSelecionada = null
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    const select =
        document.createElement("select");


    select.className =
        "select-especialidade";


    select.innerHTML =
        '<option value="">Selecione uma especialidade</option>';


    data.forEach(especialidade => {

        const option =
            document.createElement("option");


        option.value =
            especialidade.id;


        option.textContent =
            especialidade.nome;


        select.appendChild(option);

    });


    if (especialidadeSelecionada) {

        select.value =
            especialidadeSelecionada;

    }


    const botaoRemover =
        document.createElement("button");


    botaoRemover.type =
        "button";


    botaoRemover.className =
        "btn-remover-especialidade";


    botaoRemover.textContent =
        "Remover";


    botaoRemover.onclick =
        () => {

            linha.remove();

        };


    linha.appendChild(select);
    linha.appendChild(botaoRemover);


    container.appendChild(linha);

}


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "clinicaId"
        ).value;


    const nome =
        document.getElementById(
            "clinicaNome"
        ).value
        .trim();


    const endereco =
        document.getElementById(
            "clinicaEndereco"
        ).value
        .trim();


    const telefone =
        document.getElementById(
            "clinicaTelefone"
        ).value
        .trim();


    const bairroId =
        document.getElementById(
            "clinicaBairro"
        ).value;


    const ativo =
        id
            ? document.getElementById(
                "clinicaAtivo"
            ).checked
            : true;


    if (!bairroId) {

        alert(
            "Selecione um bairro."
        );

        return;

    }


    const dados = {

        nome,
        endereco,
        telefone,
        bairro_id: bairroId,
        ativo

    };


    let clinica;


    if (id) {

        const resultado =
            await supabaseClient
                .from("clinicas")
                .update(dados)
                .eq("id", id)
                .select()
                .single();


        if (resultado.error) {

            console.error(
                resultado.error
            );

            alert(
                "Erro ao atualizar clínica."
            );

            return;

        }


        clinica =
            resultado.data;

    } else {

        const resultado =
            await supabaseClient
                .from("clinicas")
                .insert(dados)
                .select()
                .single();


        if (resultado.error) {

            console.error(
                resultado.error
            );

            alert(
                "Erro ao cadastrar clínica."
            );

            return;

        }


        clinica =
            resultado.data;

    }


    // REMOVER ESPECIALIDADES ANTIGAS

    await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            clinica.id
        );


    // PEGAR ESPECIALIDADES

    const selects =
        document.querySelectorAll(
            ".select-especialidade"
        );


    const especialidades = [];


    selects.forEach(select => {

        if (select.value) {

            especialidades.push({

                clinica_id:
                    clinica.id,

                especialidade_id:
                    select.value

            });

        }

    });


    // SALVAR ESPECIALIDADES

    if (especialidades.length) {

        const { error } =
            await supabaseClient
                .from("clinica_especialidades")
                .insert(
                    especialidades
                );


        if (error) {

            console.error(error);

        }

    }


    alert(
        id
            ? "Clínica atualizada com sucesso!"
            : "Clínica cadastrada com sucesso!"
    );


    fecharModalClinica();


    await listarClinicas();
    await carregarDashboard();

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id) {

    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select(`
                *,
                bairros(
                    id,
                    cidade_id,
                    cidades(
                        id,
                        estado_id,
                        estados(
                            id,
                            regiao_id
                        )
                    )
                )
            `)
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao carregar clínica."
        );

        return;

    }


    const clinica =
        data;


    document.getElementById(
        "formClinica"
    ).reset();


    document.getElementById(
        "clinicaId"
    ).value =
        clinica.id;


    document.getElementById(
        "clinicaNome"
    ).value =
        clinica.nome || "";


    document.getElementById(
        "clinicaEndereco"
    ).value =
        clinica.endereco || "";


    document.getElementById(
        "clinicaTelefone"
    ).value =
        clinica.telefone || "";


    document.getElementById(
        "clinicaAtivo"
    ).checked =
        clinica.ativo;


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Editar Clínica";


    document.getElementById(
        "areaStatusClinica"
    ).classList.remove("hidden");


    const bairro =
        clinica.bairros;


    const cidade =
        bairro?.cidades;


    const estado =
        cidade?.estados;


    const regiaoId =
        estado?.regiao_id;


    const estadoId =
        cidade?.estado_id;


    const cidadeId =
        bairro?.cidade_id;


    const bairroId =
        bairro?.id;


    await popularRegioes();


    document.getElementById(
        "clinicaRegiao"
    ).value =
        regiaoId;


    await carregarEstadosClinica(
        estadoId
    );


    await carregarCidadesClinica(
        cidadeId
    );


    await carregarBairrosClinica(
        bairroId
    );


    // ESPECIALIDADES

    const especialidades =
        await buscarEspecialidadesClinica(
            clinica.id
        );


    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    container.innerHTML = "";


    if (especialidades.length) {

        for (
            const especialidade
            of especialidades
        ) {

            await adicionarLinhaEspecialidade(
                especialidade.id
            );

        }

    } else {

        await adicionarLinhaEspecialidade();

    }


    document.getElementById(
        "modalClinica"
    ).classList.remove("hidden");

}


// ======================================
// ALTERAR STATUS
// ======================================

async function alterarStatusClinica(
    id,
    novoStatus
) {

    const mensagem =
        novoStatus
            ? "Deseja ativar esta clínica?"
            : "Deseja desativar esta clínica?";


    if (!confirm(mensagem)) return;


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update({

                ativo:
                    novoStatus

            })
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao alterar status."
        );

        return;

    }


    await listarClinicas();
    await carregarDashboard();

}
