// ======================================
// ADMIN.JS
// ======================================

console.log("admin.js carregado");


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarPainel();

    }
);


// ======================================
// INICIAR PAINEL
// ======================================

function iniciarPainel() {

    configurarMenu();

    carregarDashboard();

    carregarRegioesAdmin();

    carregarEstadosAdmin();

    carregarCidadesAdmin();

    carregarBairrosAdmin();

    carregarEspecialidadesAdmin();

    listarClinicas();

    configurarFormularioClinica();

}


// ======================================
// MENU
// ======================================

function configurarMenu() {

    const botoes =
        document.querySelectorAll(
            ".menu-btn"
        );

    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const pagina =
                    botao.dataset.page;

                mostrarPagina(
                    pagina
                );

            }
        );

    });

}


// ======================================
// MOSTRAR PÁGINA
// ======================================

function mostrarPagina(nomePagina) {

    const paginas =
        document.querySelectorAll(
            ".page"
        );

    paginas.forEach(pagina => {

        pagina.classList.add(
            "hidden"
        );

    });


    const paginaSelecionada =
        document.getElementById(
            nomePagina
        );

    if (paginaSelecionada) {

        paginaSelecionada.classList.remove(
            "hidden"
        );

    }


    // ======================================
    // MENU ATIVO
    // ======================================

    const botoes =
        document.querySelectorAll(
            ".menu-btn"
        );

    botoes.forEach(botao => {

        botao.classList.remove(
            "active"
        );

        if (
            botao.dataset.page ===
            nomePagina
        ) {

            botao.classList.add(
                "active"
            );

        }

    });


    // ======================================
    // TÍTULOS
    // ======================================

    const titulos = {

        dashboard:
            "Dashboard",

        clinicas:
            "Gerenciar Clínicas",

        especialidades:
            "Especialidades",

        regioes:
            "Regiões",

        estados:
            "Estados",

        cidades:
            "Cidades",

        bairros:
            "Bairros"

    };


    const titulo =
        document.getElementById(
            "tituloPagina"
        );

    if (titulo) {

        titulo.textContent =
            titulos[nomePagina];

    }


    // ======================================
    // CARREGAR DADOS
    // ======================================

    if (nomePagina === "dashboard") {

        carregarDashboard();

    }


    if (nomePagina === "clinicas") {

        listarClinicas();

    }


    if (nomePagina === "especialidades") {

        carregarEspecialidadesAdmin();

    }


    if (nomePagina === "regioes") {

        carregarRegioesAdmin();

    }


    if (nomePagina === "estados") {

        carregarEstadosAdmin();

    }


    if (nomePagina === "cidades") {

        carregarCidadesAdmin();

    }


    if (nomePagina === "bairros") {

        carregarBairrosAdmin();

    }

}// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    // ======================================
    // TOTAL CLÍNICAS
    // ======================================

    const {
        count: totalClinicas,
        error: erroClinicas
    } = await supabaseClient
        .from("clinicas")
        .select(
            "*",
            {
                count: "exact",
                head: true
            }
        );


    // ======================================
    // CLÍNICAS ATIVAS
    // ======================================

    const {
        count: clinicasAtivas,
        error: erroAtivas
    } = await supabaseClient
        .from("clinicas")
        .select(
            "*",
            {
                count: "exact",
                head: true
            }
        )
        .eq(
            "ativo",
            true
        );


    // ======================================
    // ESPECIALIDADES
    // ======================================

    const {
        count: totalEspecialidades,
        error: erroEspecialidades
    } = await supabaseClient
        .from("especialidades")
        .select(
            "*",
            {
                count: "exact",
                head: true
            }
        );


    // ======================================
    // ESTADOS
    // ======================================

    const {
        count: totalEstados,
        error: erroEstados
    } = await supabaseClient
        .from("estados")
        .select(
            "*",
            {
                count: "exact",
                head: true
            }
        );


    if (
        erroClinicas ||
        erroAtivas ||
        erroEspecialidades ||
        erroEstados
    ) {

        console.error(
            "Erro ao carregar dashboard"
        );

        return;

    }


    document.getElementById(
        "totalClinicas"
    ).textContent =
        totalClinicas || 0;


    document.getElementById(
        "totalClinicasAtivas"
    ).textContent =
        clinicasAtivas || 0;


    document.getElementById(
        "totalEspecialidades"
    ).textContent =
        totalEspecialidades || 0;


    document.getElementById(
        "totalEstados"
    ).textContent =
        totalEstados || 0;

}// ======================================
// REGIÕES
// ======================================

async function carregarRegioesAdmin() {

    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order(
            "nome"
        );


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaRegioes"
        );


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(regiao => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <span>
                    ${regiao.nome}
                </span>

                <div>

                    <button
                        onclick="editarRegiao(
                            ${regiao.id},
                            '${regiao.nome.replace(/'/g, "\\'")}'
                        )"
                    >
                        ✏️
                    </button>

                    <button
                        onclick="excluirRegiao(
                            ${regiao.id}
                        )"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });


    // SELECT DE REGIÕES
    preencherSelectRegioes();

}async function salvarRegiao() {

    const input =
        document.getElementById(
            "nomeRegiao"
        );

    const id =
        document.getElementById(
            "regiaoEditId"
        ).value;


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da região."
        );

        return;

    }


    let erro;


    if (id) {

        const resultado =
            await supabaseClient
                .from("regioes")
                .update({
                    nome
                })
                .eq(
                    "id",
                    id
                );

        erro =
            resultado.error;

    } else {

        const resultado =
            await supabaseClient
                .from("regioes")
                .insert({
                    nome
                });

        erro =
            resultado.error;

    }


    if (erro) {

        console.error(erro);

        alert(
            "Erro ao salvar região."
        );

        return;

    }


    input.value = "";

    document.getElementById(
        "regiaoEditId"
    ).value = "";


    document.getElementById(
        "btnSalvarRegiao"
    ).textContent =
        "Adicionar";


    carregarRegioesAdmin();

}function editarRegiao(
    id,
    nome
) {

    document.getElementById(
        "regiaoEditId"
    ).value =
        id;


    document.getElementById(
        "nomeRegiao"
    ).value =
        nome;


    document.getElementById(
        "btnSalvarRegiao"
    ).textContent =
        "Salvar";

}async function excluirRegiao(id) {

    const confirmar =
        confirm(
            "Deseja excluir esta região?"
        );


    if (!confirmar) return;


    const {
        error
    } = await supabaseClient
        .from("regioes")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir região."
        );

        return;

    }


    carregarRegioesAdmin();

}async function preencherSelectRegioes() {

    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order(
            "nome"
        );


    if (error) {

        console.error(error);

        return;

    }


    const select =
        document.getElementById(
            "estadoRegiao"
        );


    if (!select) return;


    select.innerHTML = `
        <option value="">
            Selecione uma região
        </option>
    `;


    data.forEach(regiao => {

        select.innerHTML += `
            <option value="${regiao.id}">
                ${regiao.nome}
            </option>
        `;

    });

}// ======================================
// ESTADOS
// ======================================

async function carregarEstadosAdmin() {

    const {
        data,
        error
    } = await supabaseClient
        .from("estados")
        .select(`
            id,
            nome,
            regiao_id,
            regioes(
                nome
            )
        `)
        .order(
            "nome"
        );


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(estado => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${estado.nome}
                    </strong>

                    <small>
                        ${estado.regioes?.nome || ""}
                    </small>

                </div>


                <div>

                    <button
                        onclick="editarEstado(
                            ${estado.id},
                            ${estado.regiao_id},
                            '${estado.nome.replace(/'/g, "\\'")}'
                        )"
                    >
                        ✏️
                    </button>


                    <button
                        onclick="excluirEstado(
                            ${estado.id}
                        )"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });


    preencherSelectEstados();

}
async function salvarEstado() {

    const id =
        document.getElementById(
            "estadoEditId"
        ).value;


    const regiao_id =
        document.getElementById(
            "estadoRegiao"
        ).value;


    const nome =
        document.getElementById(
            "nomeEstado"
        ).value
        .trim();


    if (!regiao_id || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    let error;


    if (id) {

        const resultado =
            await supabaseClient
                .from("estados")
                .update({
                    nome,
                    regiao_id
                })
                .eq(
                    "id",
                    id
                );

        error =
            resultado.error;

    } else {

        const resultado =
            await supabaseClient
                .from("estados")
                .insert({
                    nome,
                    regiao_id
                });

        error =
            resultado.error;

    }


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar estado."
        );

        return;

    }


    document.getElementById(
        "estadoEditId"
    ).value = "";

    document.getElementById(
        "estadoRegiao"
    ).value = "";

    document.getElementById(
        "nomeEstado"
    ).value = "";

    document.getElementById(
        "btnSalvarEstado"
    ).textContent =
        "Adicionar Estado";


    carregarEstadosAdmin();

}function editarEstado(
    id,
    regiaoId,
    nome
) {

    document.getElementById(
        "estadoEditId"
    ).value =
        id;


    document.getElementById(
        "estadoRegiao"
    ).value =
        regiaoId;


    document.getElementById(
        "nomeEstado"
    ).value =
        nome;


    document.getElementById(
        "btnSalvarEstado"
    ).textContent =
        "Salvar Estado";

}async function excluirEstado(id) {

    if (
        !confirm(
            "Deseja excluir este estado?"
        )
    ) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("estados")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir estado."
        );

        return;

    }


    carregarEstadosAdmin();

}async function preencherSelectEstados() {

    const {
        data,
        error
    } = await supabaseClient
        .from("estados")
        .select("*")
        .order(
            "nome"
        );


    if (error) return;


    const cidadeEstado =
        document.getElementById(
            "cidadeEstado"
        );


    if (!cidadeEstado) return;


    cidadeEstado.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    data.forEach(estado => {

        cidadeEstado.innerHTML += `
            <option value="${estado.id}">
                ${estado.nome}
            </option>
        `;

    });

}// ======================================
// CIDADES
// ======================================

async function carregarCidadesAdmin() {

    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select(`
            id,
            nome,
            estado_id,
            estados(
                nome
            )
        `)
        .order(
            "nome"
        );


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(cidade => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${cidade.nome}
                    </strong>

                    <small>
                        ${cidade.estados?.nome || ""}
                    </small>

                </div>


                <div>

                    <button
                        onclick="editarCidade(
                            ${cidade.id},
                            ${cidade.estado_id},
                            '${cidade.nome.replace(/'/g, "\\'")}'
                        )"
                    >
                        ✏️
                    </button>


                    <button
                        onclick="excluirCidade(
                            ${cidade.id}
                        )"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });


    preencherSelectCidades();

}async function salvarCidade() {

    const id =
        document.getElementById(
            "cidadeEditId"
        ).value;


    const estado_id =
        document.getElementById(
            "cidadeEstado"
        ).value;


    const nome =
        document.getElementById(
            "nomeCidade"
        ).value
        .trim();


    if (!estado_id || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    let error;


    if (id) {

        const resultado =
            await supabaseClient
                .from("cidades")
                .update({
                    nome,
                    estado_id
                })
                .eq(
                    "id",
                    id
                );

        error =
            resultado.error;

    } else {

        const resultado =
            await supabaseClient
                .from("cidades")
                .insert({
                    nome,
                    estado_id
                });

        error =
            resultado.error;

    }


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar cidade."
        );

        return;

    }


    document.getElementById(
        "cidadeEditId"
    ).value = "";

    document.getElementById(
        "cidadeEstado"
    ).value = "";

    document.getElementById(
        "nomeCidade"
    ).value = "";


    document.getElementById(
        "btnSalvarCidade"
    ).textContent =
        "Adicionar Cidade";


    carregarCidadesAdmin();

}function editarCidade(
    id,
    estadoId,
    nome
) {

    document.getElementById(
        "cidadeEditId"
    ).value =
        id;


    document.getElementById(
        "cidadeEstado"
    ).value =
        estadoId;


    document.getElementById(
        "nomeCidade"
    ).value =
        nome;


    document.getElementById(
        "btnSalvarCidade"
    ).textContent =
        "Salvar Cidade";

}async function excluirCidade(id) {

    if (
        !confirm(
            "Deseja excluir esta cidade?"
        )
    ) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("cidades")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir cidade."
        );

        return;

    }


    carregarCidadesAdmin();

}async function preencherSelectCidades() {

    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select("*")
        .order(
            "nome"
        );


    if (error) return;


    const bairroCidade =
        document.getElementById(
            "bairroCidade"
        );


    if (!bairroCidade) return;


    bairroCidade.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


    data.forEach(cidade => {

        bairroCidade.innerHTML += `
            <option value="${cidade.id}">
                ${cidade.nome}
            </option>
        `;

    });

}// ======================================
// BAIRROS
// ======================================

async function carregarBairrosAdmin() {

    const {
        data,
        error
    } = await supabaseClient
        .from("bairros")
        .select(`
            id,
            nome,
            cidade_id,
            cidades(
                nome
            )
        `)
        .order(
            "nome"
        );


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(bairro => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${bairro.nome}
                    </strong>

                    <small>
                        ${bairro.cidades?.nome || ""}
                    </small>

                </div>


                <div>

                    <button
                        onclick="editarBairro(
                            ${bairro.id},
                            ${bairro.cidade_id},
                            '${bairro.nome.replace(/'/g, "\\'")}'
                        )"
                    >
                        ✏️
                    </button>


                    <button
                        onclick="excluirBairro(
                            ${bairro.id}
                        )"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}async function salvarBairro() {

    const id =
        document.getElementById(
            "bairroEditId"
        ).value;


    const cidade_id =
        document.getElementById(
            "bairroCidade"
        ).value;


    const nome =
        document.getElementById(
            "nomeBairro"
        ).value
        .trim();


    if (!cidade_id || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    let error;


    if (id) {

        const resultado =
            await supabaseClient
                .from("bairros")
                .update({
                    nome,
                    cidade_id
                })
                .eq(
                    "id",
                    id
                );

        error =
            resultado.error;

    } else {

        const resultado =
            await supabaseClient
                .from("bairros")
                .insert({
                    nome,
                    cidade_id
                });

        error =
            resultado.error;

    }


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar bairro."
        );

        return;

    }


    document.getElementById(
        "bairroEditId"
    ).value = "";

    document.getElementById(
        "bairroCidade"
    ).value = "";

    document.getElementById(
        "nomeBairro"
    ).value = "";


    document.getElementById(
        "btnSalvarBairro"
    ).textContent =
        "Adicionar Bairro";


    carregarBairrosAdmin();

}function editarBairro(
    id,
    cidadeId,
    nome
) {

    document.getElementById(
        "bairroEditId"
    ).value =
        id;


    document.getElementById(
        "bairroCidade"
    ).value =
        cidadeId;


    document.getElementById(
        "nomeBairro"
    ).value =
        nome;


    document.getElementById(
        "btnSalvarBairro"
    ).textContent =
        "Salvar Bairro";

}// ======================================
// ESPECIALIDADES
// ======================================

async function carregarEspecialidadesAdmin() {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order(
            "nome"
        );


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(especialidade => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <span>
                    ${especialidade.nome}
                </span>


                <div>

                    <button
                        onclick="editarEspecialidade(
                            ${especialidade.id},
                            '${especialidade.nome.replace(/'/g, "\\'")}'
                        )"
                    >
                        ✏️
                    </button>


                    <button
                        onclick="excluirEspecialidade(
                            ${especialidade.id}
                        )"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}async function salvarEspecialidade() {

    const input =
        document.getElementById(
            "nomeEspecialidade"
        );


    const id =
        document.getElementById(
            "especialidadeEditId"
        ).value;


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite uma especialidade."
        );

        return;

    }


    let error;


    if (id) {

        const resultado =
            await supabaseClient
                .from("especialidades")
                .update({
                    nome
                })
                .eq(
                    "id",
                    id
                );

        error =
            resultado.error;

    } else {

        const resultado =
            await supabaseClient
                .from("especialidades")
                .insert({
                    nome
                });

        error =
            resultado.error;

    }


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar especialidade."
        );

        return;

    }


    input.value = "";


    document.getElementById(
        "especialidadeEditId"
    ).value = "";


    document.getElementById(
        "btnSalvarEspecialidade"
    ).textContent =
        "Adicionar";


    carregarEspecialidadesAdmin();

}
function editarEspecialidade(
    id,
    nome
) {

    document.getElementById(
        "especialidadeEditId"
    ).value =
        id;


    document.getElementById(
        "nomeEspecialidade"
    ).value =
        nome;


    document.getElementById(
        "btnSalvarEspecialidade"
    ).textContent =
        "Salvar";

}
async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("especialidades")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir especialidade."
        );

        return;

    }


    carregarEspecialidadesAdmin();

}
