// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// ======================================

console.log("admin.js carregado");


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "DOM carregado. Iniciando painel..."
        );


        await carregarDashboard();


        // Carrega os dados das páginas
        await Promise.all([

            carregarRegioesSelect(),

            carregarEstadosSelect(),

            carregarCidadesSelect()

        ]);

    }
);


// ======================================
// CONFIGURAÇÃO DAS PÁGINAS
// ======================================

const CARREGADORES_PAGINA = {

    dashboard: carregarDashboard,

    clinicas: listarClinicas,

    especialidades: listarEspecialidades,

    regioes: listarRegioes,

    estados: async () => {

        await carregarRegioesSelect();

        await listarEstados();

    },

    cidades: async () => {

        await carregarEstadosSelect();

        await listarCidades();

    },

    bairros: async () => {

        await carregarCidadesSelect();

        await listarBairros();

    }

};


// ======================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ======================================

async function mostrarPagina(nomePagina) {

    // Remove página ativa
    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("ativa");

        });


    // Ativa página selecionada
    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (pagina) {

        pagina.classList.add("ativa");

    }


    // Remove botão ativo
    document
        .querySelectorAll(
            ".menu button[data-pagina]"
        )
        .forEach(botao => {

            botao.classList.remove("ativo");

        });


    // Ativa botão correto
    const botao =
        document.querySelector(
            `.menu button[data-pagina="${nomePagina}"]`
        );


    if (botao) {

        botao.classList.add("ativo");

    }


    // Executa carregador da página
    const carregador =
        CARREGADORES_PAGINA[nomePagina];


    if (carregador) {

        await carregador();

    }

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        const [

            clinicas,

            clinicasAtivas,

            especialidades,

            regioes,

            estados,

            cidades,

            bairros

        ] = await Promise.all([

            supabaseClient
                .from("clinicas")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("clinicas")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("ativo", true),

            supabaseClient
                .from("especialidades")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("regioes")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("estados")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("cidades")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("bairros")
                .select("*", {
                    count: "exact",
                    head: true
                })

        ]);


        const erros = [

            clinicas.error,

            clinicasAtivas.error,

            especialidades.error,

            regioes.error,

            estados.error,

            cidades.error,

            bairros.error

        ];


        const existeErro =
            erros.some(
                erro => erro
            );


        if (existeErro) {

            console.error(
                "Erro ao carregar dashboard:",
                erros
            );

            return;

        }


        // ======================================
        // VALORES
        // ======================================

        const totalClinicas =
            clinicas.count || 0;


        const totalClinicasAtivas =
            clinicasAtivas.count || 0;


        const totalEspecialidades =
            especialidades.count || 0;


        const totalRegioes =
            regioes.count || 0;


        const totalEstados =
            estados.count || 0;


        const totalCidades =
            cidades.count || 0;


        const totalBairros =
            bairros.count || 0;


        // ======================================
        // CARDS
        // ======================================

        atualizarTexto(

            "totalClinicas",

            totalClinicas

        );


        atualizarTexto(

            "totalClinicasAtivas",

            totalClinicasAtivas

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


        // ======================================
        // RESUMOS
        // ======================================

        atualizarTexto(

            "resumoClinicas",

            totalClinicas

        );


        atualizarTexto(

            "resumoEspecialidades",

            totalEspecialidades

        );


        atualizarTexto(

            "resumoLocalidades",

            totalRegioes +
            totalEstados +
            totalCidades +
            totalBairros

        );

    }

    catch (erro) {

        console.error(
            "Erro inesperado no dashboard:",
            erro
        );

    }

}


// ======================================
// FUNÇÃO AUXILIAR
// ======================================

function atualizarTexto(id, valor) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            valor;

    }

}


// ======================================
// CARREGAR REGIÕES SELECT
// ======================================

async function carregarRegioesSelect() {

    const select =
        document.getElementById(
            "estadoRegiao"
        );


    if (!select) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        `<option value="">
            Selecione uma região
        </option>`;


    data?.forEach(regiao => {

        select.innerHTML += `

            <option value="${regiao.id}">
                ${escaparTexto(regiao.nome)}
            </option>

        `;

    });

}


// ======================================
// CARREGAR ESTADOS SELECT
// ======================================

async function carregarEstadosSelect() {

    const select =
        document.getElementById(
            "cidadeEstado"
        );


    if (!select) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("estados")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        `<option value="">
            Selecione um estado
        </option>`;


    data?.forEach(estado => {

        select.innerHTML += `

            <option value="${estado.id}">
                ${escaparTexto(estado.nome)}
            </option>

        `;

    });

}


// ======================================
// CARREGAR CIDADES SELECT
// ======================================

async function carregarCidadesSelect() {

    const select =
        document.getElementById(
            "bairroCidade"
        );


    if (!select) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        `<option value="">
            Selecione uma cidade
        </option>`;


    data?.forEach(cidade => {

        select.innerHTML += `

            <option value="${cidade.id}">
                ${escaparTexto(cidade.nome)}
            </option>

        `;

    });

}


// ======================================
// REGIÕES
// ======================================

async function listarRegioes() {

    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


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


    if (!data?.length) {

        lista.innerHTML = `

            <div class="sem-dados">
                Nenhuma região cadastrada.
            </div>

        `;

        return;

    }


    data.forEach(regiao => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <strong>
                    ${escaparTexto(regiao.nome)}
                </strong>


                <div class="item-acoes">

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
        input?.value.trim();


    const id =
        editId?.value;


    if (!nome) {

        alert(
            "Informe o nome da região."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("regioes")
                .update({ nome })
                .eq("id", id);

    }

    else {

        resultado =
            await supabaseClient
                .from("regioes")
                .insert({ nome });

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar região."
        );

        return;

    }


    input.value = "";


    if (editId) {

        editId.value = "";

    }


    await Promise.all([

        listarRegioes(),

        carregarRegioesSelect(),

        carregarDashboard()

    ]);

}


// ======================================
// EDITAR REGIÃO
// ======================================

async function editarRegiao(id) {

    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        return;

    }


    document.getElementById(
        "regiaoEditId"
    ).value =
        data.id;


    document.getElementById(
        "nomeRegiao"
    ).value =
        data.nome;

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

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
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir a região. Verifique se existem estados vinculados."
        );

        return;

    }


    await Promise.all([

        listarRegioes(),

        carregarRegioesSelect(),

        carregarDashboard()

    ]);

}


// ======================================
// ESTADOS
// ======================================

async function listarEstados() {

    const {
        data,
        error
    } = await supabaseClient
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


    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data?.length) {

        lista.innerHTML = `

            <div class="sem-dados">
                Nenhum estado cadastrado.
            </div>

        `;

        return;

    }


    data.forEach(estado => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${escaparTexto(estado.nome)}
                    </strong>

                    <div class="item-subtitulo">

                        Região:
                        ${escaparTexto(
                            estado.regioes?.nome || "-"
                        )}

                    </div>

                </div>


                <div class="item-acoes">

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
            ?.value
            .trim();


    const regiaoId =
        document
            .getElementById("estadoRegiao")
            ?.value;


    const id =
        document
            .getElementById("estadoEditId")
            ?.value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,

        regiao_id:
            Number(regiaoId)

    };


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("estados")
                .update(dados)
                .eq("id", id);

    }

    else {

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


    await Promise.all([

        listarEstados(),

        carregarEstadosSelect(),

        carregarDashboard()

    ]);

}


// ======================================
// EDITAR ESTADO
// ======================================

async function editarEstado(id) {

    const {
        data,
        error
    } = await supabaseClient
        .from("estados")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        return;

    }


    await carregarRegioesSelect();


    document.getElementById(
        "estadoEditId"
    ).value =
        data.id;


    document.getElementById(
        "nomeEstado"
    ).value =
        data.nome;


    document.getElementById(
        "estadoRegiao"
    ).value =
        data.regiao_id;

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
            "Não foi possível excluir o estado. Verifique se existem cidades vinculadas."
        );

        return;

    }


    await Promise.all([

        listarEstados(),

        carregarEstadosSelect(),

        carregarDashboard()

    ]);

}


// ======================================
// CIDADES
// ======================================

async function listarCidades() {

    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select(`

            *,

            estados(
                nome
            )

        `)
        .order("nome");


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


    if (!data?.length) {

        lista.innerHTML = `

            <div class="sem-dados">
                Nenhuma cidade cadastrada.
            </div>

        `;

        return;

    }


    data.forEach(cidade => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${escaparTexto(cidade.nome)}
                    </strong>

                    <div class="item-subtitulo">

                        Estado:
                        ${escaparTexto(
                            cidade.estados?.nome || "-"
                        )}

                    </div>

                </div>


                <div class="item-acoes">

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
            ?.value
            .trim();


    const estadoId =
        document
            .getElementById("cidadeEstado")
            ?.value;


    const id =
        document
            .getElementById("cidadeEditId")
            ?.value;


    if (!nome || !estadoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,

        estado_id:
            Number(estadoId)

    };


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("cidades")
                .update(dados)
                .eq("id", id);

    }

    else {

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


    await Promise.all([

        listarCidades(),

        carregarCidadesSelect(),

        carregarDashboard()

    ]);

}


// ======================================
// EDITAR CIDADE
// ======================================

async function editarCidade(id) {

    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        return;

    }


    await carregarEstadosSelect();


    document.getElementById(
        "cidadeEditId"
    ).value =
        data.id;


    document.getElementById(
        "nomeCidade"
    ).value =
        data.nome;


    document.getElementById(
        "cidadeEstado"
    ).value =
        data.estado_id;

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
            "Não foi possível excluir a cidade. Verifique se existem bairros vinculados."
        );

        return;

    }


    await Promise.all([

        listarCidades(),

        carregarCidadesSelect(),

        carregarDashboard()

    ]);

}


// ======================================
// BAIRROS
// ======================================

async function listarBairros() {

    const {
        data,
        error
    } = await supabaseClient
        .from("bairros")
        .select(`

            *,

            cidades(
                nome,

                estados(
                    nome
                )

            )

        `)
        .order("nome");


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


    if (!data?.length) {

        lista.innerHTML = `

            <div class="sem-dados">
                Nenhum bairro cadastrado.
            </div>

        `;

        return;

    }


    data.forEach(bairro => {

        const cidade =
            bairro.cidades?.nome || "-";


        const estado =
            bairro.cidades
                ?.estados?.nome || "-";


        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${escaparTexto(bairro.nome)}
                    </strong>

                    <div class="item-subtitulo">

                        ${escaparTexto(cidade)}
                        -
                        ${escaparTexto(estado)}

                    </div>

                </div>


                <div class="item-acoes">

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
            ?.value
            .trim();


    const cidadeId =
        document
            .getElementById("bairroCidade")
            ?.value;


    const id =
        document
            .getElementById("bairroEditId")
            ?.value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,

        cidade_id:
            Number(cidadeId)

    };


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("bairros")
                .update(dados)
                .eq("id", id);

    }

    else {

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


    await Promise.all([

        listarBairros(),

        carregarDashboard()

    ]);

}


// ======================================
// EDITAR BAIRRO
// ======================================

async function editarBairro(id) {

    const {
        data,
        error
    } = await supabaseClient
        .from("bairros")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        return;

    }


    await carregarCidadesSelect();


    document.getElementById(
        "bairroEditId"
    ).value =
        data.id;


    document.getElementById(
        "nomeBairro"
    ).value =
        data.nome;


    document.getElementById(
        "bairroCidade"
    ).value =
        data.cidade_id;

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


    await Promise.all([

        listarBairros(),

        carregarDashboard()

    ]);

}


// ======================================
// ESPECIALIDADES
// ======================================

async function listarEspecialidades() {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");


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


    if (!data?.length) {

        lista.innerHTML = `

            <div class="sem-dados">
                Nenhuma especialidade cadastrada.
            </div>

        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <strong>

                    ${escaparTexto(item.nome)}

                </strong>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEspecialidade(${item.id})"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirEspecialidade(${item.id})"
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


    const nome =
        input?.value.trim();


    const editId =
        document.getElementById(
            "especialidadeEditId"
        );


    const id =
        editId?.value;


    if (!nome) {

        alert(
            "Informe a especialidade."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("especialidades")
                .update({
                    nome
                })
                .eq("id", id);

    }

    else {

        resultado =
            await supabaseClient
                .from("especialidades")
                .insert({
                    nome
                });

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


    if (editId) {

        editId.value = "";

    }


    await Promise.all([

        listarEspecialidades(),

        carregarDashboard()

    ]);

}


// ======================================
// EDITAR ESPECIALIDADE
// ======================================

async function editarEspecialidade(id) {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        return;

    }


    document.getElementById(
        "especialidadeEditId"
    ).value =
        data.id;


    document.getElementById(
        "nomeEspecialidade"
    ).value =
        data.nome;

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
            "Erro ao excluir especialidade. Verifique se existem clínicas vinculadas."
        );

        return;

    }


    await Promise.all([

        listarEspecialidades(),

        carregarDashboard()

    ]);

}


// ======================================
// LISTAR CLÍNICAS
// ======================================

async function listarClinicas() {

    const busca =
        document
            .getElementById("buscarClinica")
            ?.value
            .trim() || "";


    const status =
        document
            .getElementById(
                "filtroStatusClinica"
            )
            ?.value || "";


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
                            nome
                        )
                    )
                ),

                clinica_especialidades(

                    rede,

                    ativo,

                    especialidades(
                        nome
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


    const {
        data,
        error
    } = await consulta;


    if (error) {

        console.error(
            "Erro ao listar clínicas:",
            error
        );

        return;

    }


    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data?.length) {

        lista.innerHTML = `

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


    data.forEach(clinica => {

        const bairro =
            clinica.bairros?.nome || "-";


        const cidade =
            clinica.bairros
                ?.cidades?.nome || "-";


        const estado =
            clinica.bairros
                ?.cidades
                ?.estados?.nome || "-";


        const especialidades =
            clinica.clinica_especialidades
                ?.filter(item => item.ativo)
                .map(item => {

                    const nome =
                        item.especialidades?.nome || "";


                    const rede =
                        formatarRede(item.rede);


                    return `

                        <span class="especialidade-tag">

                            ${escaparTexto(nome)}

                            (${escaparTexto(rede)})

                        </span>

                    `;

                })
                .join("")
            || "";


        lista.innerHTML += `

            <tr>


                <td>

                    <strong>

                        ${escaparTexto(
                            clinica.nome
                        )}

                    </strong>

                </td>



                <td>

                    ${escaparTexto(bairro)}

                    <br>

                    ${escaparTexto(cidade)}

                    -

                    ${escaparTexto(estado)}

                </td>



                <td>

                    ${escaparTexto(
                        clinica.telefone || "-"
                    )}

                </td>



                <td>

                    ${especialidades || "-"}

                </td>



                <td>

                    ${
                        clinica.ativo

                            ?

                            `
                            <span class="status-ativa">
                                Ativa
                            </span>
                            `

                            :

                            `
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
                            onclick="editarClinica(${clinica.id})"
                        >
                            Editar
                        </button>


                        <button
                            class="${
                                clinica.ativo
                                    ? "btn-desativar"
                                    : "btn-ativar"
                            }"

                            onclick="
                                alterarStatusClinica(
                                    ${clinica.id},
                                    ${clinica.ativo}
                                )
                            "
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

    });

}


// ======================================
// ABRIR MODAL CLÍNICA
// ======================================

async function abrirModalClinica() {

    const form =
        document.getElementById(
            "formClinica"
        );


    if (!form) return;


    form.reset();


    document.getElementById(
        "clinicaId"
    ).value = "";


    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (container) {

        container.innerHTML = "";

    }


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Nova Clínica";


    document.getElementById(
        "areaStatusClinica"
    )?.classList.add("hidden");


    document.getElementById(
        "modalClinica"
    )?.classList.remove("hidden");


    await carregarRegioesClinica();

}


// ======================================
// FECHAR MODAL
// ======================================

function fecharModalClinica() {

    document
        .getElementById("modalClinica")
        ?.classList.add("hidden");

}


// ======================================
// CARREGAR REGIÕES CLÍNICA
// ======================================

async function carregarRegioesClinica() {

    const select =
        document.getElementById(
            "clinicaRegiao"
        );


    if (!select) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML =
        `<option value="">
            Selecione uma região
        </option>`;


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>

        `;

    });

}


// ======================================
// CARREGAR ESTADOS CLÍNICA
// ======================================

async function carregarEstadosClinica() {

    const regiaoId =
        document.getElementById(
            "clinicaRegiao"
        )?.value;


    const select =
        document.getElementById(
            "clinicaEstado"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">
            Selecione um estado
        </option>`;


    const cidadeSelect =
        document.getElementById(
            "clinicaCidade"
        );


    const bairroSelect =
        document.getElementById(
            "clinicaBairro"
        );


    if (cidadeSelect) {

        cidadeSelect.innerHTML =
            `<option value="">
                Selecione uma cidade
            </option>`;

    }


    if (bairroSelect) {

        bairroSelect.innerHTML =
            `<option value="">
                Selecione um bairro
            </option>`;

    }


    if (!regiaoId) return;


    const {
        data,
        error
    } = await supabaseClient
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


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>

        `;

    });

}


// ======================================
// CARREGAR CIDADES CLÍNICA
// ======================================

async function carregarCidadesClinica() {

    const estadoId =
        document.getElementById(
            "clinicaEstado"
        )?.value;


    const select =
        document.getElementById(
            "clinicaCidade"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">
            Selecione uma cidade
        </option>`;


    const bairroSelect =
        document.getElementById(
            "clinicaBairro"
        );


    if (bairroSelect) {

        bairroSelect.innerHTML =
            `<option value="">
                Selecione um bairro
            </option>`;

    }


    if (!estadoId) return;


    const {
        data,
        error
    } = await supabaseClient
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


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>

        `;

    });

}


// ======================================
// CARREGAR BAIRROS CLÍNICA
// ======================================

async function carregarBairrosClinica() {

    const cidadeId =
        document.getElementById(
            "clinicaCidade"
        )?.value;


    const select =
        document.getElementById(
            "clinicaBairro"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">
            Selecione um bairro
        </option>`;


    if (!cidadeId) return;


    const {
        data,
        error
    } = await supabaseClient
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


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>

        `;

    });

}


// ======================================
// ADICIONAR ESPECIALIDADE
// ======================================

async function adicionarLinhaEspecialidade(
    especialidadeSelecionada = "",
    redeSelecionada = "especialistas"
) {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    let options =
        `<option value="">
            Selecione uma especialidade
        </option>`;


    data?.forEach(item => {

        const selected =
            String(item.id) ===
            String(especialidadeSelecionada)
                ? "selected"
                : "";


        options += `

            <option
                value="${item.id}"
                ${selected}
            >
                ${escaparTexto(item.nome)}
            </option>

        `;

    });


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    linha.innerHTML = `

        <select class="select-especialidade">

            ${options}

        </select>


        <select class="select-rede">


            <option
                value="especialistas"

                ${
                    redeSelecionada === "especialistas"
                        ? "selected"
                        : ""
                }
            >
                Rede Especialistas
            </option>


            <option
                value="sindilegis"

                ${
                    redeSelecionada === "sindilegis"
                        ? "selected"
                        : ""
                }
            >
                Rede Sindilegis
            </option>

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
        >
            Remover
        </button>

    `;


    linha
        .querySelector(
            ".btn-remover-especialidade"
        )
        .addEventListener(
            "click",
            () => {

                linha.remove();

            }
        );


    document
        .getElementById(
            "containerEspecialidades"
        )
        ?.appendChild(linha);

}


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "clinicaId"
        )?.value;


    const nome =
        document.getElementById(
            "clinicaNome"
        )?.value.trim();


    const endereco =
        document.getElementById(
            "clinicaEndereco"
        )?.value.trim();


    const telefone =
        document.getElementById(
            "clinicaTelefone"
        )?.value.trim();


    const bairroId =
        document.getElementById(
            "clinicaBairro"
        )?.value;


    if (!nome || !endereco || !bairroId) {

        alert(
            "Preencha os campos obrigatórios."
        );

        return;

    }


    const dadosClinica = {

        nome,

        endereco,

        telefone:
            telefone || null,

        bairro_id:
            Number(bairroId)

    };


    let clinicaId;


    // ======================================
    // EDITAR CLÍNICA
    // ======================================

    if (id) {

        const ativo =
            document.getElementById(
                "clinicaAtivo"
            )?.checked ?? true;


        dadosClinica.ativo =
            ativo;


        const { error } =
            await supabaseClient
                .from("clinicas")
                .update(dadosClinica)
                .eq("id", id);


        if (error) {

            console.error(error);

            alert(
                "Erro ao atualizar clínica."
            );

            return;

        }


        clinicaId =
            Number(id);

    }


    // ======================================
    // NOVA CLÍNICA
    // ======================================

    else {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinicas")
            .insert({

                ...dadosClinica,

                ativo: true

            })
            .select()
            .single();


        if (error) {

            console.error(error);

            alert(
                "Erro ao cadastrar clínica."
            );

            return;

        }


        clinicaId =
            data.id;

    }


    // ======================================
    // REMOVER ESPECIALIDADES ANTIGAS
    // ======================================

    const {
        error: erroDelete
    } = await supabaseClient
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
            erroDelete
        );

        alert(
            "Erro ao atualizar especialidades."
        );

        return;

    }


    // ======================================
    // PEGAR ESPECIALIDADES
    // ======================================

    const linhas =
        document.querySelectorAll(
            ".linha-especialidade"
        );


    const especialidades = [];


    linhas.forEach(linha => {

        const especialidadeId =
            linha
                .querySelector(
                    ".select-especialidade"
                )
                ?.value;


        const rede =
            linha
                .querySelector(
                    ".select-rede"
                )
                ?.value;


        if (
            especialidadeId &&
            rede
        ) {

            especialidades.push({

                clinica_id:
                    Number(clinicaId),

                especialidade_id:
                    Number(especialidadeId),

                rede,

                ativo: true

            });

        }

    });


    // ======================================
    // REMOVER DUPLICADOS
    // ======================================

    const especialidadesUnicas =
        especialidades.filter(
            (item, index, array) => {

                return (

                    index ===

                    array.findIndex(
                        outro =>

                            outro.especialidade_id ===
                            item.especialidade_id

                            &&

                            outro.rede ===
                            item.rede
                    )

                );

            }
        );


    // ======================================
    // SALVAR ESPECIALIDADES
    // ======================================

    if (
        especialidadesUnicas.length > 0
    ) {

        const { error } =
            await supabaseClient
                .from(
                    "clinica_especialidades"
                )
                .insert(
                    especialidadesUnicas
                );


        if (error) {

            console.error(error);

            alert(
                "Erro ao salvar especialidades."
            );

            return;

        }

    }


    alert(
        "Clínica salva com sucesso!"
    );


    fecharModalClinica();


    await Promise.all([

        listarClinicas(),

        carregarDashboard()

    ]);

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id) {

    const {
        data,
        error
    } = await supabaseClient
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

            ),

            clinica_especialidades(

                especialidade_id,

                rede,

                ativo

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


    // ======================================
    // ABRIR MODAL
    // ======================================

    await abrirModalClinica();


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Editar Clínica";


    document.getElementById(
        "clinicaId"
    ).value =
        data.id;


    document.getElementById(
        "clinicaNome"
    ).value =
        data.nome || "";


    document.getElementById(
        "clinicaEndereco"
    ).value =
        data.endereco || "";


    document.getElementById(
        "clinicaTelefone"
    ).value =
        data.telefone || "";


    document.getElementById(
        "areaStatusClinica"
    )?.classList.remove("hidden");


    const checkbox =
        document.getElementById(
            "clinicaAtivo"
        );


    if (checkbox) {

        checkbox.checked =
            data.ativo ?? true;

    }


    // ======================================
    // LOCALIZAÇÃO
    // ======================================

    const bairro =
        data.bairros;


    const cidade =
        bairro?.cidades;


    const estado =
        cidade?.estados;


    if (
        bairro &&
        cidade &&
        estado
    ) {

        // REGIÃO

        document.getElementById(
            "clinicaRegiao"
        ).value =
            estado.regiao_id;


        // ESTADOS

        await carregarEstadosClinica();


        document.getElementById(
            "clinicaEstado"
        ).value =
            cidade.estado_id;


        // CIDADES

        await carregarCidadesClinica();


        document.getElementById(
            "clinicaCidade"
        ).value =
            bairro.cidade_id;


        // BAIRROS

        await carregarBairrosClinica();


        document.getElementById(
            "clinicaBairro"
        ).value =
            bairro.id;

    }


    // ======================================
    // ESPECIALIDADES
    // ======================================

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (container) {

        container.innerHTML = "";

    }


    if (
        data.clinica_especialidades?.length
    ) {

        for (
            const item of
            data.clinica_especialidades
        ) {

            await adicionarLinhaEspecialidade(

                item.especialidade_id,

                item.rede

            );

        }

    }

}


// ======================================
// ALTERAR STATUS CLÍNICA
// ======================================

async function alterarStatusClinica(
    id,
    statusAtual
) {

    const novoStatus =
        !statusAtual;


    const mensagem =
        novoStatus
            ? "Deseja ativar esta clínica?"
            : "Deseja desativar esta clínica?";


    if (!confirm(mensagem)) {

        return;

    }


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


    await Promise.all([

        listarClinicas(),

        carregarDashboard()

    ]);

}


// ======================================
// FORMATAR REDE
// ======================================

function formatarRede(rede) {

    const redes = {

        especialistas:
            "Especialistas",

        sindilegis:
            "Sindilegis"

    };


    return redes[rede] || rede || "";

}


// ======================================
// ESCAPAR TEXTO HTML
// SEGURANÇA CONTRA HTML INJETADO
// ======================================

function escaparTexto(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    const div =
        document.createElement("div");


    div.textContent =
        String(texto);


    return div.innerHTML;

}
