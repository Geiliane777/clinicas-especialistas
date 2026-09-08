/* =====================================
   ADMIN.JS
   REDE ESPECIALISTAS
===================================== */


/* =====================================
   INICIALIZAÇÃO
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    carregarTema();

    mostrarData();

    await carregarDashboard();

    await listarClinicas();

    await listarEspecialidades();

    await listarRegioes();

    await listarEstados();

    await listarCidades();

    await listarBairros();

    await popularRegioes();

    await popularEstados();

    await popularCidades();

});


/* =====================================
   DATA ATUAL
===================================== */

function mostrarData() {

    const elemento =
        document.getElementById("dataAtual");

    if (!elemento) return;

    const hoje = new Date();

    const opcoes = {
        day: "2-digit",
        month: "long",
        year: "numeric"
    };

    elemento.textContent =
        hoje.toLocaleDateString(
            "pt-BR",
            opcoes
        );

}


/* =====================================
   NAVEGAÇÃO
===================================== */

async function mostrarPagina(nomePagina) {

    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("ativa");

        });


    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (pagina) {

        pagina.classList.add("ativa");

    }


    document
        .querySelectorAll(".menu-btn[data-pagina]")
        .forEach(botao => {

            botao.classList.remove("ativo");

        });


    const botaoAtivo =
        document.querySelector(
            `.menu-btn[data-pagina="${nomePagina}"]`
        );


    if (botaoAtivo) {

        botaoAtivo.classList.add("ativo");

    }


    if (nomePagina === "dashboard") {

        await carregarDashboard();

    }


    if (nomePagina === "clinicas") {

        await listarClinicas();

    }


    if (nomePagina === "especialidades") {

        await listarEspecialidades();

    }


    if (nomePagina === "regioes") {

        await listarRegioes();

    }


    if (nomePagina === "estados") {

        await listarEstados();

        await popularRegioes();

    }


    if (nomePagina === "cidades") {

        await listarCidades();

        await popularEstados();

    }


    if (nomePagina === "bairros") {

        await listarBairros();

        await popularCidades();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================
   TEMA
===================================== */

function alternarTema() {

    document.body.classList.toggle("dark");

    const temaEscuro =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "temaAdmin",
        temaEscuro ? "dark" : "light"
    );

}


function carregarTema() {

    const tema =
        localStorage.getItem("temaAdmin");

    if (tema === "dark") {

        document.body.classList.add("dark");

    }

}


/* =====================================
   VOLTAR AO SITE
===================================== */

function voltarAoSite() {

    window.location.href = "index.html";

}


/* =====================================
   SAIR
===================================== */

function sair() {

    const confirmar = confirm(
        "Deseja realmente sair do painel?"
    );

    if (!confirmar) return;

    window.location.href = "login.html";

}


/* =====================================
   DASHBOARD
===================================== */

async function carregarDashboard() {

    try {

        const clinicas =
            await supabase
                .from("clinicas")
                .select("*");


        const especialidades =
            await supabase
                .from("especialidades")
                .select("*");


        const regioes =
            await supabase
                .from("regioes")
                .select("*");


        const estados =
            await supabase
                .from("estados")
                .select("*");


        const cidades =
            await supabase
                .from("cidades")
                .select("*");


        const bairros =
            await supabase
                .from("bairros")
                .select("*");


        const listaClinicas =
            clinicas.data || [];


        const listaEspecialidades =
            especialidades.data || [];


        const listaRegioes =
            regioes.data || [];


        const listaEstados =
            estados.data || [];


        const listaCidades =
            cidades.data || [];


        const listaBairros =
            bairros.data || [];


        const total =
            listaClinicas.length;


        const ativas =
            listaClinicas.filter(
                clinica => clinica.ativo === true
            ).length;


        const inativas =
            total - ativas;


        atualizarTexto(
            "totalClinicas",
            total
        );


        atualizarTexto(
            "totalClinicasAtivas",
            ativas
        );


        atualizarTexto(
            "totalClinicasInativas",
            inativas
        );


        atualizarTexto(
            "totalEspecialidades",
            listaEspecialidades.length
        );


        atualizarTexto(
            "totalRegioes",
            listaRegioes.length
        );


        atualizarTexto(
            "totalEstados",
            listaEstados.length
        );


        atualizarTexto(
            "totalCidades",
            listaCidades.length
        );


        atualizarTexto(
            "totalBairros",
            listaBairros.length
        );


        atualizarStatusRede(
            total,
            ativas,
            inativas
        );


        await carregarUltimasClinicas();

    }
    catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


/* =====================================
   ATUALIZAR TEXTO
===================================== */

function atualizarTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent = valor;

    }

}


/* =====================================
   STATUS DA REDE
===================================== */

function atualizarStatusRede(
    total,
    ativas,
    inativas
) {

    let porcentagem = 0;

    if (total > 0) {

        porcentagem =
            Math.round(
                (ativas / total) * 100
            );

    }


    atualizarTexto(
        "porcentagemAtivas",
        `${porcentagem}%`
    );


    atualizarTexto(
        "legendaAtivas",
        ativas
    );


    atualizarTexto(
        "legendaInativas",
        inativas
    );


    const barra =
        document.getElementById("barraAtivas");


    if (barra) {

        barra.style.width =
            `${porcentagem}%`;

    }

}


/* =====================================
   ÚLTIMAS CLÍNICAS
===================================== */

async function carregarUltimasClinicas() {

    const container =
        document.getElementById(
            "ultimasClinicas"
        );


    if (!container) return;


    const { data, error } =
        await supabase
            .from("clinicas")
            .select(`
                *,
                bairros(
                    nome,
                    cidades(
                        nome,
                        estados(nome)
                    )
                )
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(5);


    if (error) {

        console.error(error);

        container.innerHTML = `
            <p class="carregando">
                Não foi possível carregar as clínicas.
            </p>
        `;

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <p class="carregando">
                Nenhuma clínica cadastrada ainda.
            </p>
        `;

        return;

    }


    container.innerHTML = "";


    data.forEach(clinica => {

        const bairro =
            clinica.bairros?.nome || "";


        const cidade =
            clinica.bairros?.cidades?.nome || "";


        const estado =
            clinica.bairros?.cidades?.estados?.nome || "";


        container.innerHTML += `

            <div class="ultima-clinica">

                <div class="ultima-clinica-info">

                    <div class="ultima-clinica-icone">
                        🏥
                    </div>

                    <div>

                        <h4>
                            ${clinica.nome}
                        </h4>

                        <p>
                            ${cidade}
                            ${estado ? "- " + estado : ""}
                            ${bairro ? "• " + bairro : ""}
                        </p>

                    </div>

                </div>

                <span class="
                    status
                    ${clinica.ativo ? "ativo" : "inativo"}
                ">

                    ${
                        clinica.ativo
                            ? "Ativa"
                            : "Inativa"
                    }

                </span>

            </div>

        `;

    });

}


/* =====================================
   CLÍNICAS
===================================== */

async function listarClinicas() {

    const corpoTabela =
        document.getElementById(
            "listaClinicas"
        );


    if (!corpoTabela) return;


    const busca =
        document
            .getElementById("buscarClinica")
            ?.value
            .trim();


    const status =
        document
            .getElementById(
                "filtroStatusClinica"
            )
            ?.value;


    let consulta =
        supabase
            .from("clinicas")
            .select(`
                *,
                bairros(
                    nome,
                    cidades(
                        nome,
                        estados(nome)
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

        corpoTabela.innerHTML = `
            <tr>
                <td colspan="6">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

        return;

    }


    if (!data || data.length === 0) {

        corpoTabela.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhuma clínica encontrada.
                </td>
            </tr>
        `;

        return;

    }


    corpoTabela.innerHTML = "";


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
            clinica.bairros?.cidades?.estados?.nome || "";


        corpoTabela.innerHTML += `

            <tr>

                <td>
                    <strong>
                        ${clinica.nome}
                    </strong>
                </td>

                <td>
                    ${cidade}
                    ${estado ? "- " + estado : ""}
                    <br>
                    <small>
                        ${bairro}
                    </small>
                </td>

                <td>
                    ${clinica.telefone || "-"}
                </td>

                <td>
                    ${especialidades || "-"}
                </td>

                <td>

                    <span class="
                        status
                        ${clinica.ativo ? "ativo" : "inativo"}
                    ">

                        ${
                            clinica.ativo
                                ? "Ativa"
                                : "Inativa"
                        }

                    </span>

                </td>

                <td>

                    <div class="acoes-tabela">

                        <button
                            class="btn-editar"
                            onclick="editarClinica('${clinica.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirClinica('${clinica.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            </tr>

        `;

    }

}


/* =====================================
   ESPECIALIDADES DA CLÍNICA
===================================== */

async function buscarEspecialidadesClinica(
    clinicaId
) {

    const { data, error } =
        await supabase
            .from("clinica_especialidades")
            .select(`
                especialidades(nome)
            `)
            .eq(
                "clinica_id",
                clinicaId
            );


    if (error || !data) {

        return "";

    }


    return data
        .map(item =>
            item.especialidades?.nome
        )
        .filter(Boolean)
        .join(", ");

}


/* =====================================
   ABRIR MODAL
===================================== */

async function abrirModalClinica() {

    document
        .getElementById("modalClinica")
        .classList.remove("hidden");


    document
        .getElementById("tituloModalClinica")
        .textContent =
        "Nova Clínica";


    document
        .getElementById("formClinica")
        .reset();


    document
        .getElementById("clinicaId")
        .value = "";


    document
        .getElementById("areaStatusClinica")
        .classList.add("hidden");


    document
        .getElementById(
            "containerEspecialidades"
        )
        .innerHTML = "";


    await popularRegioesClinica();

    await adicionarLinhaEspecialidade();

}


/* =====================================
   FECHAR MODAL
===================================== */

function fecharModalClinica() {

    document
        .getElementById("modalClinica")
        .classList.add("hidden");

}


/* =====================================
   SALVAR CLÍNICA
===================================== */

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document
            .getElementById("clinicaId")
            .value;


    const nome =
        document
            .getElementById("clinicaNome")
            .value
            .trim();


    const endereco =
        document
            .getElementById("clinicaEndereco")
            .value
            .trim();


    const telefone =
        document
            .getElementById("clinicaTelefone")
            .value
            .trim();


    const bairroId =
        document
            .getElementById("clinicaBairro")
            .value;


    const ativo =
        document
            .getElementById("clinicaAtivo")
            .checked;


    if (!bairroId) {

        alert(
            "Selecione um bairro."
        );

        return;

    }


    const dadosClinica = {

        nome,
        endereco,
        telefone,
        bairro_id: bairroId

    };


    let resultado;


    if (id) {

        dadosClinica.ativo = ativo;


        resultado =
            await supabase
                .from("clinicas")
                .update(dadosClinica)
                .eq("id", id)
                .select()
                .single();

    }
    else {

        dadosClinica.ativo = true;


        resultado =
            await supabase
                .from("clinicas")
                .insert(dadosClinica)
                .select()
                .single();

    }


    if (resultado.error) {

        console.error(resultado.error);

        alert(
            "Erro ao salvar clínica."
        );

        return;

    }


    const clinicaSalva =
        resultado.data;


    await salvarEspecialidadesClinica(
        clinicaSalva.id
    );


    alert(
        "Clínica salva com sucesso!"
    );


    fecharModalClinica();

    await listarClinicas();

    await carregarDashboard();

}


/* =====================================
   SALVAR ESPECIALIDADES CLÍNICA
===================================== */

async function salvarEspecialidadesClinica(
    clinicaId
) {

    await supabase
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            clinicaId
        );


    const selects =
        document.querySelectorAll(
            ".select-especialidade"
        );


    const dados = [];


    selects.forEach(select => {

        if (select.value) {

            dados.push({

                clinica_id: clinicaId,

                especialidade_id:
                    select.value

            });

        }

    });


    if (dados.length > 0) {

        await supabase
            .from("clinica_especialidades")
            .insert(dados);

    }

}


/* =====================================
   EDITAR CLÍNICA
===================================== */

async function editarClinica(id) {

    const { data, error } =
        await supabase
            .from("clinicas")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        alert(
            "Erro ao carregar clínica."
        );

        return;

    }


    document
        .getElementById("modalClinica")
        .classList.remove("hidden");


    document
        .getElementById("tituloModalClinica")
        .textContent =
        "Editar Clínica";


    document
        .getElementById("clinicaId")
        .value = data.id;


    document
        .getElementById("clinicaNome")
        .value = data.nome || "";


    document
        .getElementById("clinicaEndereco")
        .value = data.endereco || "";


    document
        .getElementById("clinicaTelefone")
        .value = data.telefone || "";


    document
        .getElementById("clinicaAtivo")
        .checked = data.ativo;


    document
        .getElementById("areaStatusClinica")
        .classList.remove("hidden");


    await popularRegioesClinica();


    const { data: bairro } =
        await supabase
            .from("bairros")
            .select(`
                *,
                cidades(
                    *,
                    estados(*)
                )
            `)
            .eq(
                "id",
                data.bairro_id
            )
            .single();


    if (bairro) {

        const estado =
            bairro.cidades.estados;


        const cidade =
            bairro.cidades;


        const regiaoId =
            estado.regiao_id;


        document
            .getElementById("clinicaRegiao")
            .value = regiaoId;


        await carregarEstadosClinica();


        document
            .getElementById("clinicaEstado")
            .value = estado.id;


        await carregarCidadesClinica();


        document
            .getElementById("clinicaCidade")
            .value = cidade.id;


        await carregarBairrosClinica();


        document
            .getElementById("clinicaBairro")
            .value = bairro.id;

    }


    await carregarEspecialidadesEdicao(id);

}


/* =====================================
   EXCLUIR CLÍNICA
===================================== */

async function excluirClinica(id) {

    const confirmar = confirm(
        "Deseja realmente excluir esta clínica?"
    );


    if (!confirmar) return;


    await supabase
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            id
        );


    const { error } =
        await supabase
            .from("clinicas")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Erro ao excluir clínica."
        );

        return;

    }


    await listarClinicas();

    await carregarDashboard();

}


/* =====================================
   POPULAR REGIÕES CLÍNICA
===================================== */

async function popularRegioesClinica() {

    const select =
        document.getElementById(
            "clinicaRegiao"
        );


    const { data } =
        await supabase
            .from("regioes")
            .select("*")
            .order("nome");


    select.innerHTML = `
        <option value="">
            Selecione uma região
        </option>
    `;


    data?.forEach(regiao => {

        select.innerHTML += `
            <option value="${regiao.id}">
                ${regiao.nome}
            </option>
        `;

    });

}


/* =====================================
   CASCATA CLÍNICA
===================================== */

async function carregarEstadosClinica() {

    const regiaoId =
        document
            .getElementById("clinicaRegiao")
            .value;


    const select =
        document.getElementById(
            "clinicaEstado"
        );


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    document
        .getElementById("clinicaCidade")
        .innerHTML = `
            <option value="">
                Selecione uma cidade
            </option>
        `;


    document
        .getElementById("clinicaBairro")
        .innerHTML = `
            <option value="">
                Selecione um bairro
            </option>
        `;


    if (!regiaoId) return;


    const { data } =
        await supabase
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiaoId
            )
            .order("nome");


    data?.forEach(estado => {

        select.innerHTML += `
            <option value="${estado.id}">
                ${estado.nome}
            </option>
        `;

    });

}


async function carregarCidadesClinica() {

    const estadoId =
        document
            .getElementById("clinicaEstado")
            .value;


    const select =
        document.getElementById(
            "clinicaCidade"
        );


    select.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


    document
        .getElementById("clinicaBairro")
        .innerHTML = `
            <option value="">
                Selecione um bairro
            </option>
        `;


    if (!estadoId) return;


    const { data } =
        await supabase
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estadoId
            )
            .order("nome");


    data?.forEach(cidade => {

        select.innerHTML += `
            <option value="${cidade.id}">
                ${cidade.nome}
            </option>
        `;

    });

}


async function carregarBairrosClinica() {

    const cidadeId =
        document
            .getElementById("clinicaCidade")
            .value;


    const select =
        document.getElementById(
            "clinicaBairro"
        );


    select.innerHTML = `
        <option value="">
            Selecione um bairro
        </option>
    `;


    if (!cidadeId) return;


    const { data } =
        await supabase
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidadeId
            )
            .order("nome");


    data?.forEach(bairro => {

        select.innerHTML += `
            <option value="${bairro.id}">
                ${bairro.nome}
            </option>
        `;

    });

}


/* =====================================
   ADICIONAR ESPECIALIDADE
===================================== */

async function adicionarLinhaEspecialidade(
    valorSelecionado = ""
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    const { data } =
        await supabase
            .from("especialidades")
            .select("*")
            .order("nome");


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    let opcoes = `
        <option value="">
            Selecione uma especialidade
        </option>
    `;


    data?.forEach(especialidade => {

        opcoes += `
            <option
                value="${especialidade.id}"
                ${
                    especialidade.id ==
                    valorSelecionado
                        ? "selected"
                        : ""
                }
            >
                ${especialidade.nome}
            </option>
        `;

    });


    linha.innerHTML = `

        <select class="select-especialidade">

            ${opcoes}

        </select>

        <button
            type="button"
            class="btn-remover-especialidade"
            onclick="this.parentElement.remove()"
        >
            ✕
        </button>

    `;


    container.appendChild(linha);

}


/* =====================================
   ESPECIALIDADES EDIÇÃO
===================================== */

async function carregarEspecialidadesEdicao(
    clinicaId
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    container.innerHTML = "";


    const { data } =
        await supabase
            .from("clinica_especialidades")
            .select("*")
            .eq(
                "clinica_id",
                clinicaId
            );


    if (!data || data.length === 0) {

        await adicionarLinhaEspecialidade();

        return;

    }


    for (const item of data) {

        await adicionarLinhaEspecialidade(
            item.especialidade_id
        );

    }

}


/* =====================================
   ESPECIALIDADES
===================================== */

async function listarEspecialidades() {

    const container =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!container) return;


    const { data, error } =
        await supabase
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    container.innerHTML = "";


    if (!data || data.length === 0) {

        container.innerHTML = `
            <p class="carregando">
                Nenhuma especialidade cadastrada.
            </p>
        `;

        return;

    }


    data.forEach(item => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <strong>
                    ${item.nome}
                </strong>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEspecialidade(
                            '${item.id}',
                            '${item.nome.replace(/'/g, "\\'")}'
                        )"
                    >
                        ✏️
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirEspecialidade('${item.id}')"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarEspecialidade() {

    const input =
        document.getElementById(
            "nomeEspecialidade"
        );


    const id =
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


    if (id.value) {

        resultado =
            await supabase
                .from("especialidades")
                .update({ nome })
                .eq("id", id.value);

    }
    else {

        resultado =
            await supabase
                .from("especialidades")
                .insert({ nome });

    }


    if (resultado.error) {

        alert(
            "Erro ao salvar especialidade."
        );

        return;

    }


    input.value = "";

    id.value = "";

    await listarEspecialidades();

    await carregarDashboard();

}


function editarEspecialidade(
    id,
    nome
) {

    document
        .getElementById(
            "especialidadeEditId"
        )
        .value = id;


    document
        .getElementById(
            "nomeEspecialidade"
        )
        .value = nome;

}


async function excluirEspecialidade(id) {

    if (!confirm(
        "Excluir esta especialidade?"
    )) return;


    const { error } =
        await supabase
            .from("especialidades")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Não foi possível excluir."
        );

        return;

    }


    await listarEspecialidades();

    await carregarDashboard();

}


/* =====================================
   REGIÕES
===================================== */

async function listarRegioes() {

    const container =
        document.getElementById(
            "listaRegioes"
        );


    if (!container) return;


    const { data } =
        await supabase
            .from("regioes")
            .select("*")
            .order("nome");


    container.innerHTML = "";


    data?.forEach(item => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <strong>
                    ${item.nome}
                </strong>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarRegiao(
                            '${item.id}',
                            '${item.nome.replace(/'/g, "\\'")}'
                        )"
                    >
                        ✏️
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirRegiao('${item.id}')"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarRegiao() {

    const nome =
        document
            .getElementById("nomeRegiao")
            .value
            .trim();


    const id =
        document
            .getElementById("regiaoEditId")
            .value;


    if (!nome) return;


    if (id) {

        await supabase
            .from("regioes")
            .update({ nome })
            .eq("id", id);

    }
    else {

        await supabase
            .from("regioes")
            .insert({ nome });

    }


    document
        .getElementById("nomeRegiao")
        .value = "";


    document
        .getElementById("regiaoEditId")
        .value = "";


    await listarRegioes();

    await popularRegioes();

    await carregarDashboard();

}


function editarRegiao(id, nome) {

    document
        .getElementById("regiaoEditId")
        .value = id;


    document
        .getElementById("nomeRegiao")
        .value = nome;

}


async function excluirRegiao(id) {

    if (!confirm(
        "Excluir esta região?"
    )) return;


    await supabase
        .from("regioes")
        .delete()
        .eq("id", id);


    await listarRegioes();

    await carregarDashboard();

}


/* =====================================
   POPULAR REGIÕES
===================================== */

async function popularRegioes() {

    const select =
        document.getElementById(
            "estadoRegiao"
        );


    if (!select) return;


    const { data } =
        await supabase
            .from("regioes")
            .select("*")
            .order("nome");


    select.innerHTML = `
        <option value="">
            Selecione uma região
        </option>
    `;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


/* =====================================
   ESTADOS
===================================== */

async function listarEstados() {

    const container =
        document.getElementById(
            "listaEstados"
        );


    if (!container) return;


    const { data } =
        await supabase
            .from("estados")
            .select(`
                *,
                regioes(nome)
            `)
            .order("nome");


    container.innerHTML = "";


    data?.forEach(item => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${item.nome}
                    </strong>

                    <small>
                        ${item.regioes?.nome || ""}
                    </small>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEstado(
                            '${item.id}',
                            '${item.nome.replace(/'/g, "\\'")}',
                            '${item.regiao_id}'
                        )"
                    >
                        ✏️
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirEstado('${item.id}')"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}


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


    const id =
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


    if (id) {

        await supabase
            .from("estados")
            .update(dados)
            .eq("id", id);

    }
    else {

        await supabase
            .from("estados")
            .insert(dados);

    }


    document
        .getElementById("nomeEstado")
        .value = "";


    document
        .getElementById("estadoRegiao")
        .value = "";


    document
        .getElementById("estadoEditId")
        .value = "";


    await listarEstados();

    await popularEstados();

    await carregarDashboard();

}


function editarEstado(
    id,
    nome,
    regiaoId
) {

    document
        .getElementById("estadoEditId")
        .value = id;


    document
        .getElementById("nomeEstado")
        .value = nome;


    document
        .getElementById("estadoRegiao")
        .value = regiaoId;

}


async function excluirEstado(id) {

    if (!confirm(
        "Excluir este estado?"
    )) return;


    await supabase
        .from("estados")
        .delete()
        .eq("id", id);


    await listarEstados();

    await carregarDashboard();

}


/* =====================================
   POPULAR ESTADOS
===================================== */

async function popularEstados() {

    const select =
        document.getElementById(
            "cidadeEstado"
        );


    if (!select) return;


    const { data } =
        await supabase
            .from("estados")
            .select("*")
            .order("nome");


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


/* =====================================
   CIDADES
===================================== */

async function listarCidades() {

    const container =
        document.getElementById(
            "listaCidades"
        );


    if (!container) return;


    const { data } =
        await supabase
            .from("cidades")
            .select(`
                *,
                estados(nome)
            `)
            .order("nome");


    container.innerHTML = "";


    data?.forEach(item => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${item.nome}
                    </strong>

                    <small>
                        ${item.estados?.nome || ""}
                    </small>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarCidade(
                            '${item.id}',
                            '${item.nome.replace(/'/g, "\\'")}',
                            '${item.estado_id}'
                        )"
                    >
                        ✏️
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirCidade('${item.id}')"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}


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


    const id =
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


    if (id) {

        await supabase
            .from("cidades")
            .update(dados)
            .eq("id", id);

    }
    else {

        await supabase
            .from("cidades")
            .insert(dados);

    }


    document
        .getElementById("nomeCidade")
        .value = "";


    document
        .getElementById("cidadeEstado")
        .value = "";


    document
        .getElementById("cidadeEditId")
        .value = "";


    await listarCidades();

    await popularCidades();

    await carregarDashboard();

}


function editarCidade(
    id,
    nome,
    estadoId
) {

    document
        .getElementById("cidadeEditId")
        .value = id;


    document
        .getElementById("nomeCidade")
        .value = nome;


    document
        .getElementById("cidadeEstado")
        .value = estadoId;

}


async function excluirCidade(id) {

    if (!confirm(
        "Excluir esta cidade?"
    )) return;


    await supabase
        .from("cidades")
        .delete()
        .eq("id", id);


    await listarCidades();

    await carregarDashboard();

}


/* =====================================
   POPULAR CIDADES
===================================== */

async function popularCidades() {

    const select =
        document.getElementById(
            "bairroCidade"
        );


    if (!select) return;


    const { data } =
        await supabase
            .from("cidades")
            .select("*")
            .order("nome");


    select.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


/* =====================================
   BAIRROS
===================================== */

async function listarBairros() {

    const container =
        document.getElementById(
            "listaBairros"
        );


    if (!container) return;


    const { data } =
        await supabase
            .from("bairros")
            .select(`
                *,
                cidades(nome)
            `)
            .order("nome");


    container.innerHTML = "";


    data?.forEach(item => {

        container.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${item.nome}
                    </strong>

                    <small>
                        ${item.cidades?.nome || ""}
                    </small>

                </div>

                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarBairro(
                            '${item.id}',
                            '${item.nome.replace(/'/g, "\\'")}',
                            '${item.cidade_id}'
                        )"
                    >
                        ✏️
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirBairro('${item.id}')"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}


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


    const id =
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


    if (id) {

        await supabase
            .from("bairros")
            .update(dados)
            .eq("id", id);

    }
    else {

        await supabase
            .from("bairros")
            .insert(dados);

    }


    document
        .getElementById("nomeBairro")
        .value = "";


    document
        .getElementById("bairroCidade")
        .value = "";


    document
        .getElementById("bairroEditId")
        .value = "";


    await listarBairros();

    await carregarDashboard();

}


function editarBairro(
    id,
    nome,
    cidadeId
) {

    document
        .getElementById("bairroEditId")
        .value = id;


    document
        .getElementById("nomeBairro")
        .value = nome;


    document
        .getElementById("bairroCidade")
        .value = cidadeId;

}


async function excluirBairro(id) {

    if (!confirm(
        "Excluir este bairro?"
    )) return;


    await supabase
        .from("bairros")
        .delete()
        .eq("id", id);


    await listarBairros();

    await carregarDashboard();

}
