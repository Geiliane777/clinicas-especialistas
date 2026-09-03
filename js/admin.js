// ======================================
// ADMIN.JS
// ======================================

console.log("admin.js carregado");


// ======================================
// ELEMENTOS
// ======================================

const $ = (id) => document.getElementById(id);


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        configurarMenu();

        configurarBotoes();

        await carregarDashboard();

        await carregarClinicas();

        await popularRegioes();

        await popularEspecialidades();

        await popularEstados();

        await popularCidades();

    }
);


// ======================================
// MENU
// ======================================

function configurarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");

    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            async () => {

                const pagina =
                    botao.dataset.page;

                mostrarPagina(pagina);

                botoes.forEach(btn =>
                    btn.classList.remove("active")
                );

                botao.classList.add("active");

            }
        );

    });

}


// ======================================
// MOSTRAR PÁGINA
// ======================================

async function mostrarPagina(pagina) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add("hidden");

        });


    const paginaSelecionada =
        $(pagina);

    if (paginaSelecionada) {

        paginaSelecionada
            .classList
            .remove("hidden");

    }


    const titulos = {

        dashboard: "Dashboard",
        clinicas: "Clínicas",
        especialidades: "Especialidades",
        regioes: "Regiões",
        estados: "Estados",
        cidades: "Cidades",
        bairros: "Bairros",
        editarClinica: "Editar Clínica"

    };


    if ($("tituloPagina")) {

        $("tituloPagina").textContent =
            titulos[pagina] || "";

    }


    // CARREGADORES

    if (pagina === "dashboard") {
        await carregarDashboard();
    }

    if (pagina === "clinicas") {
        await carregarClinicas();
    }

    if (pagina === "especialidades") {
        await carregarEspecialidades();
    }

    if (pagina === "regioes") {
        await carregarRegioes();
    }

    if (pagina === "estados") {
        await carregarEstados();
        await popularRegioes();
    }

    if (pagina === "cidades") {
        await carregarCidades();
        await popularEstados();
    }

    if (pagina === "bairros") {
        await carregarBairros();
        await popularCidades();
    }

}


// ======================================
// CONFIGURAR BOTÕES
// ======================================

function configurarBotoes() {

    // CLÍNICA

    $("btnSalvarClinica")
        ?.addEventListener(
            "click",
            salvarClinica
        );


    $("btnAtualizarClinica")
        ?.addEventListener(
            "click",
            atualizarClinica
        );


    $("btnVoltarClinicas")
        ?.addEventListener(
            "click",
            () => mostrarPagina("clinicas")
        );


    $("btnAdicionarEspRede")
        ?.addEventListener(
            "click",
            adicionarEspecialidadeClinica
        );


    // ESPECIALIDADE

    $("btnSalvarEspecialidade")
        ?.addEventListener(
            "click",
            salvarEspecialidade
        );


    // REGIÃO

    $("btnSalvarRegiao")
        ?.addEventListener(
            "click",
            salvarRegiao
        );


    // ESTADO

    $("btnSalvarEstado")
        ?.addEventListener(
            "click",
            salvarEstado
        );


    // CIDADE

    $("btnSalvarCidade")
        ?.addEventListener(
            "click",
            salvarCidade
        );


    // BAIRRO

    $("btnSalvarBairro")
        ?.addEventListener(
            "click",
            salvarBairro
        );


    // FILTRO CLÍNICA

    $("filtro_clinica_nome")
        ?.addEventListener(
            "input",
            carregarClinicas
        );


    // CASCATA CLÍNICA

    $("clinica_regiao")
        ?.addEventListener(
            "change",
            popularEstadosClinica
        );


    $("clinica_estado")
        ?.addEventListener(
            "change",
            popularCidadesClinica
        );


    $("clinica_cidade")
        ?.addEventListener(
            "change",
            popularBairrosClinica
        );


    // EDITAR CLÍNICA

    $("edit_clinica_regiao")
        ?.addEventListener(
            "change",
            popularEstadosEditar
        );


    $("edit_clinica_estado")
        ?.addEventListener(
            "change",
            popularCidadesEditar
        );


    $("edit_clinica_cidade")
        ?.addEventListener(
            "change",
            popularBairrosEditar
        );


    // VOLTAR SITE

    $("btnVoltarSite")
        ?.addEventListener(
            "click",
            () => {
                location.href = "index.html";
            }
        );

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    const tabelas = {

        clinicas: "totalClinicas",
        especialidades: "totalEspecialidades",
        regioes: "totalRegioes",
        estados: "totalEstados",
        cidades: "totalCidades",
        bairros: "totalBairros"

    };


    for (
        const tabela in tabelas
    ) {

        const {
            count,
            error
        } = await supabaseClient
            .from(tabela)
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );


        if (!error) {

            const elemento =
                $(tabelas[tabela]);

            if (elemento) {

                elemento.textContent =
                    count || 0;

            }

        }

    }

}


// ======================================
// CLÍNICAS
// ======================================

async function carregarClinicas() {

    const filtro =
        $("filtro_clinica_nome")
            ?.value
            ?.trim();


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
                            regioes(
                                nome
                            )
                        )
                    )
                )
            `)
            .order(
                "nome",
                {
                    ascending: true
                }
            );


    if (filtro) {

        consulta =
            consulta.ilike(
                "nome",
                `%${filtro}%`
            );

    }


    const {
        data,
        error
    } = await consulta;


    if (error) {

        console.error(error);
        return;

    }


    const lista =
        $("listaClinicas");


    if (!lista) return;


    lista.innerHTML = "";


    if (!data.length) {

        lista.innerHTML = `
            <tr>
                <td colspan="5">
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
            clinica.bairros?.cidades?.nome || "-";


        lista.innerHTML += `

            <tr>

                <td>
                    <strong>
                        ${clinica.nome}
                    </strong>
                </td>


                <td>
                    ${clinica.telefone || "-"}
                </td>


                <td>
                    ${bairro} - ${cidade}
                </td>


                <td>

                    <button
                        class="
                            btn-status
                            ${clinica.ativo
                                ? "ativo"
                                : "inativo"
                            }
                        "

                        onclick="
                            alterarStatusClinica(
                                ${clinica.id},
                                ${clinica.ativo}
                            )
                        "
                    >

                        <span class="status-icon">
                            ${clinica.ativo
                                ? "●"
                                : "○"
                            }
                        </span>

                        ${clinica.ativo
                            ? "Ativa"
                            : "Inativa"
                        }

                    </button>

                </td>


                <td>

                    <div class="acoes">

                        <button
                            class="btn-editar"

                            onclick="
                                editarClinica(
                                    ${clinica.id}
                                )
                            "
                        >
                            ✏ Editar
                        </button>


                        <button
                            class="btn-excluir"

                            onclick="
                                excluirClinica(
                                    ${clinica.id}
                                )
                            "
                        >
                            🗑 Excluir
                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica() {

    const nome =
        $("clinica_nome").value.trim();

    const telefone =
        $("clinica_telefone").value.trim();

    const endereco =
        $("clinica_endereco").value.trim();

    const bairro =
        $("clinica_bairro").value;

    const especialidade =
        $("clinica_especialidade").value;

    const rede =
        $("clinica_rede").value;


    if (
        !nome ||
        !endereco ||
        !bairro
    ) {

        alert(
            "Preencha os campos obrigatórios."
        );

        return;

    }


    const {
        data,
        error
    } = await supabaseClient
        .from("clinicas")
        .insert({

            nome,
            telefone,
            endereco,

            bairro_id:
                Number(bairro)

        })
        .select()
        .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao salvar clínica."
        );

        return;

    }


    // VINCULAR ESPECIALIDADE

    if (especialidade) {

        await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .insert({

                clinica_id:
                    data.id,

                especialidade_id:
                    Number(especialidade),

                rede

            });

    }


    alert(
        "Clínica cadastrada com sucesso!"
    );


    limparFormularioClinica();

    await carregarClinicas();

    await carregarDashboard();

}


// ======================================
// LIMPAR FORMULÁRIO
// ======================================

function limparFormularioClinica() {

    [
        "clinica_nome",
        "clinica_telefone",
        "clinica_endereco",
        "clinica_bairro",
        "clinica_especialidade"
    ]
    .forEach(id => {

        if ($(id)) {
            $(id).value = "";
        }

    });

}


// ======================================
// ALTERAR STATUS
// ======================================

async function alterarStatusClinica(
    id,
    statusAtual
) {

    const novoStatus =
        !statusAtual;


    const {
        error
    } = await supabaseClient
        .from("clinicas")
        .update({
            ativo: novoStatus
        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Erro ao alterar status."
        );

        return;

    }


    await carregarClinicas();

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?"
        );


    if (!confirmar) return;


    const {
        error
    } = await supabaseClient
        .from("clinicas")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir clínica."
        );

        return;

    }


    alert(
        "Clínica excluída com sucesso!"
    );


    await carregarClinicas();

    await carregarDashboard();

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
                nome,
                cidades(
                    id,
                    nome,
                    estados(
                        id,
                        nome,
                        regioes(
                            id,
                            nome
                        )
                    )
                )
            )
        `)
        .eq(
            "id",
            id
        )
        .single();


    if (error) {

        console.error(error);

        return;

    }


    mostrarPagina("editarClinica");


    $("edit_clinica_id").value =
        data.id;

    $("edit_clinica_nome").value =
        data.nome;

    $("edit_clinica_telefone").value =
        data.telefone || "";

    $("edit_clinica_endereco").value =
        data.endereco;


    const bairro =
        data.bairros;

    const cidade =
        bairro?.cidades;

    const estado =
        cidade?.estados;

    const regiao =
        estado?.regioes;


    await popularRegioesEditar();


    if (regiao) {

        $("edit_clinica_regiao").value =
            regiao.id;

        await popularEstadosEditar();

    }


    if (estado) {

        $("edit_clinica_estado").value =
            estado.id;

        await popularCidadesEditar();

    }


    if (cidade) {

        $("edit_clinica_cidade").value =
            cidade.id;

        await popularBairrosEditar();

    }


    if (bairro) {

        $("edit_clinica_bairro").value =
            bairro.id;

    }


    await popularEspecialidadesEditar();

    await carregarEspecialidadesClinica(
        id
    );

}


// ======================================
// ATUALIZAR CLÍNICA
// ======================================

async function atualizarClinica() {

    const id =
        $("edit_clinica_id").value;


    const nome =
        $("edit_clinica_nome").value.trim();

    const telefone =
        $("edit_clinica_telefone").value.trim();

    const endereco =
        $("edit_clinica_endereco").value.trim();

    const bairro =
        $("edit_clinica_bairro").value;


    if (
        !id ||
        !nome ||
        !endereco ||
        !bairro
    ) {

        alert(
            "Preencha os campos obrigatórios."
        );

        return;

    }


    const {
        error
    } = await supabaseClient
        .from("clinicas")
        .update({

            nome,

            telefone,

            endereco,

            bairro_id:
                Number(bairro)

        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Erro ao atualizar clínica."
        );

        return;

    }


    alert(
        "Clínica atualizada com sucesso!"
    );


    await carregarClinicas();

}


// ======================================
// ESPECIALIDADES DA CLÍNICA
// ======================================

async function carregarEspecialidadesClinica(
    clinicaId
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            "clinica_especialidades"
        )
        .select(`
            *,
            especialidades(
                nome
            )
        `)
        .eq(
            "clinica_id",
            clinicaId
        );


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        $("listaEspRede");


    lista.innerHTML = "";


    data.forEach(item => {

        const redeNome =
            item.rede === "especialistas"
                ? "Rede Especialistas"
                : "Rede Sindilegis";


        lista.innerHTML += `

            <div class="vinculo-item">

                <div>

                    <strong>
                        ${item.especialidades?.nome}
                    </strong>

                    <div class="rede-badge">
                        ${redeNome}
                    </div>

                </div>


                <button
                    class="btn-excluir"

                    onclick="
                        excluirEspecialidadeClinica(
                            ${item.id}
                        )
                    "
                >
                    🗑 Remover
                </button>

            </div>

        `;

    });

}


// ======================================
// ADICIONAR ESPECIALIDADE CLÍNICA
// ======================================

async function adicionarEspecialidadeClinica() {

    const clinicaId =
        $("edit_clinica_id").value;

    const especialidadeId =
        $("edit_especialidade").value;

    const rede =
        $("edit_rede").value;


    if (
        !clinicaId ||
        !especialidadeId
    ) {

        alert(
            "Selecione uma especialidade."
        );

        return;

    }


    const {
        error
    } = await supabaseClient
        .from(
            "clinica_especialidades"
        )
        .insert({

            clinica_id:
                Number(clinicaId),

            especialidade_id:
                Number(especialidadeId),

            rede

        });


    if (error) {

        alert(
            "Esta especialidade já está vinculada a esta rede."
        );

        return;

    }


    await carregarEspecialidadesClinica(
        clinicaId
    );

}


// ======================================
// REMOVER ESPECIALIDADE CLÍNICA
// ======================================

async function excluirEspecialidadeClinica(id) {

    const confirmar =
        confirm(
            "Deseja remover esta especialidade?"
        );

    if (!confirmar) return;


    await supabaseClient
        .from(
            "clinica_especialidades"
        )
        .delete()
        .eq(
            "id",
            id
        );


    const clinicaId =
        $("edit_clinica_id").value;


    await carregarEspecialidadesClinica(
        clinicaId
    );

}


// ======================================
// ESPECIALIDADES
// ======================================

async function carregarEspecialidades() {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");


    if (error) return;


    const lista =
        $("listaEspecialidades");


    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <strong>
                    🦷 ${item.nome}
                </strong>


                <div class="item-acoes">

                    <button
                        class="btn-editar"

                        onclick="
                            editarEspecialidade(
                                ${item.id},
                                '${item.nome.replace(/'/g, "\\'")}'
                            )
                        "
                    >
                        ✏ Editar
                    </button>


                    <button
                        class="btn-excluir"

                        onclick="
                            excluirEspecialidade(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarEspecialidade() {

    const nome =
        $("nova_especialidade")
            .value
            .trim();


    if (!nome) {

        alert(
            "Digite uma especialidade."
        );

        return;

    }


    const {
        error
    } = await supabaseClient
        .from("especialidades")
        .insert({ nome });


    if (error) {

        alert(
            "Erro ao cadastrar especialidade."
        );

        return;

    }


    $("nova_especialidade").value = "";


    await carregarEspecialidades();

    await popularEspecialidades();

    await carregarDashboard();

}


async function editarEspecialidade(
    id,
    nomeAtual
) {

    const novoNome =
        prompt(
            "Editar especialidade:",
            nomeAtual
        );


    if (!novoNome) return;


    await supabaseClient
        .from("especialidades")
        .update({
            nome:
                novoNome.trim()
        })
        .eq(
            "id",
            id
        );


    await carregarEspecialidades();

    await popularEspecialidades();

}


async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) return;


    await supabaseClient
        .from("especialidades")
        .delete()
        .eq(
            "id",
            id
        );


    await carregarEspecialidades();

    await carregarDashboard();

}


// ======================================
// REGIÕES
// ======================================

async function carregarRegioes() {

    const {
        data
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


    const lista =
        $("listaRegioes");

    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <strong>
                    🌎 ${item.nome}
                </strong>


                <div class="item-acoes">

                    <button
                        class="btn-editar"

                        onclick="
                            editarRegiao(
                                ${item.id},
                                '${item.nome.replace(/'/g, "\\'")}'
                            )
                        "
                    >
                        ✏ Editar
                    </button>


                    <button
                        class="btn-excluir"

                        onclick="
                            excluirRegiao(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarRegiao() {

    const nome =
        $("nova_regiao")
            .value
            .trim();


    if (!nome) return;


    const {
        error
    } = await supabaseClient
        .from("regioes")
        .insert({ nome });


    if (error) {

        alert(
            "Erro ao cadastrar região."
        );

        return;

    }


    $("nova_regiao").value = "";


    await carregarRegioes();

    await popularRegioes();

    await carregarDashboard();

}


async function editarRegiao(
    id,
    nomeAtual
) {

    const nome =
        prompt(
            "Editar região:",
            nomeAtual
        );


    if (!nome) return;


    await supabaseClient
        .from("regioes")
        .update({
            nome:
                nome.trim()
        })
        .eq("id", id);


    await carregarRegioes();

    await popularRegioes();

}


async function excluirRegiao(id) {

    if (
        !confirm(
            "Excluir região?"
        )
    ) return;


    await supabaseClient
        .from("regioes")
        .delete()
        .eq("id", id);


    await carregarRegioes();

    await carregarDashboard();

}


// ======================================
// ESTADOS
// ======================================

async function carregarEstados() {

    const {
        data
    } = await supabaseClient
        .from("estados")
        .select(`
            *,
            regioes(nome)
        `)
        .order("nome");


    const lista =
        $("listaEstados");

    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <div>

                    <strong>
                        📍 ${item.nome}
                    </strong>

                    <small>
                        ${item.regioes?.nome || ""}
                    </small>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"

                        onclick="
                            editarEstado(
                                ${item.id},
                                '${item.nome.replace(/'/g, "\\'")}'
                            )
                        "
                    >
                        ✏ Editar
                    </button>


                    <button
                        class="btn-excluir"

                        onclick="
                            excluirEstado(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarEstado() {

    const nome =
        $("novo_estado")
            .value
            .trim();

    const regiao =
        $("estado_regiao")
            .value;


    if (
        !nome ||
        !regiao
    ) {

        alert(
            "Preencha os campos."
        );

        return;

    }


    await supabaseClient
        .from("estados")
        .insert({

            nome,

            regiao_id:
                Number(regiao)

        });


    $("novo_estado").value = "";


    await carregarEstados();

    await popularEstados();

    await carregarDashboard();

}


async function editarEstado(
    id,
    nomeAtual
) {

    const nome =
        prompt(
            "Editar estado:",
            nomeAtual
        );


    if (!nome) return;


    await supabaseClient
        .from("estados")
        .update({
            nome:
                nome.trim()
        })
        .eq("id", id);


    await carregarEstados();

    await popularEstados();

}


async function excluirEstado(id) {

    if (
        !confirm(
            "Excluir estado?"
        )
    ) return;


    await supabaseClient
        .from("estados")
        .delete()
        .eq("id", id);


    await carregarEstados();

    await carregarDashboard();

}


// ======================================
// CIDADES
// ======================================

async function carregarCidades() {

    const {
        data
    } = await supabaseClient
        .from("cidades")
        .select(`
            *,
            estados(nome)
        `)
        .order("nome");


    const lista =
        $("listaCidades");

    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <div>

                    <strong>
                        🏙️ ${item.nome}
                    </strong>

                    <small>
                        ${item.estados?.nome || ""}
                    </small>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"

                        onclick="
                            editarCidade(
                                ${item.id},
                                '${item.nome.replace(/'/g, "\\'")}'
                            )
                        "
                    >
                        ✏ Editar
                    </button>


                    <button
                        class="btn-excluir"

                        onclick="
                            excluirCidade(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarCidade() {

    const nome =
        $("nova_cidade")
            .value
            .trim();

    const estado =
        $("cidade_estado")
            .value;


    if (
        !nome ||
        !estado
    ) {

        alert(
            "Preencha os campos."
        );

        return;

    }


    await supabaseClient
        .from("cidades")
        .insert({

            nome,

            estado_id:
                Number(estado)

        });


    $("nova_cidade").value = "";


    await carregarCidades();

    await popularCidades();

    await carregarDashboard();

}


async function editarCidade(
    id,
    nomeAtual
) {

    const nome =
        prompt(
            "Editar cidade:",
            nomeAtual
        );


    if (!nome) return;


    await supabaseClient
        .from("cidades")
        .update({
            nome:
                nome.trim()
        })
        .eq("id", id);


    await carregarCidades();

    await popularCidades();

}


async function excluirCidade(id) {

    if (
        !confirm(
            "Excluir cidade?"
        )
    ) return;


    await supabaseClient
        .from("cidades")
        .delete()
        .eq("id", id);


    await carregarCidades();

    await carregarDashboard();

}


// ======================================
// BAIRROS
// ======================================

async function carregarBairros() {

    const {
        data
    } = await supabaseClient
        .from("bairros")
        .select(`
            *,
            cidades(nome)
        `)
        .order("nome");


    const lista =
        $("listaBairros");

    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <div>

                    <strong>
                        📌 ${item.nome}
                    </strong>

                    <small>
                        ${item.cidades?.nome || ""}
                    </small>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"

                        onclick="
                            editarBairro(
                                ${item.id},
                                '${item.nome.replace(/'/g, "\\'")}'
                            )
                        "
                    >
                        ✏ Editar
                    </button>


                    <button
                        class="btn-excluir"

                        onclick="
                            excluirBairro(
                                ${item.id}
                            )
                        "
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarBairro() {

    const nome =
        $("novo_bairro")
            .value
            .trim();

    const cidade =
        $("bairro_cidade")
            .value;


    if (
        !nome ||
        !cidade
    ) {

        alert(
            "Preencha os campos."
        );

        return;

    }


    await supabaseClient
        .from("bairros")
        .insert({

            nome,

            cidade_id:
                Number(cidade)

        });


    $("novo_bairro").value = "";


    await carregarBairros();

    await carregarDashboard();

}


async function editarBairro(
    id,
    nomeAtual
) {

    const nome =
        prompt(
            "Editar bairro:",
            nomeAtual
        );


    if (!nome) return;


    await supabaseClient
        .from("bairros")
        .update({
            nome:
                nome.trim()
        })
        .eq("id", id);


    await carregarBairros();

}


async function excluirBairro(id) {

    if (
        !confirm(
            "Excluir bairro?"
        )
    ) return;


    await supabaseClient
        .from("bairros")
        .delete()
        .eq("id", id);


    await carregarBairros();

    await carregarDashboard();

}


// ======================================
// POPULAR SELECT
// ======================================

function preencherSelect(
    id,
    dados,
    texto = "Selecione"
) {

    const select =
        $(id);

    if (!select) return;


    select.innerHTML =
        `<option value="">
            ${texto}
        </option>`;


    dados?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">
                ${item.nome}
            </option>

        `;

    });

}


// ======================================
// REGIÕES
// ======================================

async function popularRegioes() {

    const {
        data
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


    preencherSelect(
        "clinica_regiao",
        data
    );

    preencherSelect(
        "estado_regiao",
        data
    );

}


async function popularRegioesEditar() {

    const {
        data
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


    preencherSelect(
        "edit_clinica_regiao",
        data
    );

}


// ======================================
// ESTADOS
// ======================================

async function popularEstados() {

    const {
        data
    } = await supabaseClient
        .from("estados")
        .select("*")
        .order("nome");


    preencherSelect(
        "cidade_estado",
        data
    );

}


async function popularEstadosClinica() {

    const regiao =
        $("clinica_regiao").value;


    if (!regiao) return;


    const {
        data
    } = await supabaseClient
        .from("estados")
        .select("*")
        .eq(
            "regiao_id",
            regiao
        )
        .order("nome");


    preencherSelect(
        "clinica_estado",
        data
    );

}


async function popularEstadosEditar() {

    const regiao =
        $("edit_clinica_regiao").value;


    if (!regiao) return;


    const {
        data
    } = await supabaseClient
        .from("estados")
        .select("*")
        .eq(
            "regiao_id",
            regiao
        )
        .order("nome");


    preencherSelect(
        "edit_clinica_estado",
        data
    );

}


// ======================================
// CIDADES
// ======================================

async function popularCidades() {

    const {
        data
    } = await supabaseClient
        .from("cidades")
        .select("*")
        .order("nome");


    preencherSelect(
        "bairro_cidade",
        data
    );

}


async function popularCidadesClinica() {

    const estado =
        $("clinica_estado").value;


    if (!estado) return;


    const {
        data
    } = await supabaseClient
        .from("cidades")
        .select("*")
        .eq(
            "estado_id",
            estado
        )
        .order("nome");


    preencherSelect(
        "clinica_cidade",
        data
    );

}


async function popularCidadesEditar() {

    const estado =
        $("edit_clinica_estado").value;


    if (!estado) return;


    const {
        data
    } = await supabaseClient
        .from("cidades")
        .select("*")
        .eq(
            "estado_id",
            estado
        )
        .order("nome");


    preencherSelect(
        "edit_clinica_cidade",
        data
    );

}


// ======================================
// BAIRROS
// ======================================

async function popularBairrosClinica() {

    const cidade =
        $("clinica_cidade").value;


    if (!cidade) return;


    const {
        data
    } = await supabaseClient
        .from("bairros")
        .select("*")
        .eq(
            "cidade_id",
            cidade
        )
        .order("nome");


    preencherSelect(
        "clinica_bairro",
        data
    );

}


async function popularBairrosEditar() {

    const cidade =
        $("edit_clinica_cidade").value;


    if (!cidade) return;


    const {
        data
    } = await supabaseClient
        .from("bairros")
        .select("*")
        .eq(
            "cidade_id",
            cidade
        )
        .order("nome");


    preencherSelect(
        "edit_clinica_bairro",
        data
    );

}


// ======================================
// ESPECIALIDADES
// ======================================

async function popularEspecialidades() {

    const {
        data
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");


    preencherSelect(
        "clinica_especialidade",
        data
    );

}


async function popularEspecialidadesEditar() {

    const {
        data
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");


    preencherSelect(
        "edit_especialidade",
        data
    );

}
