/* =========================================================
   ADMIN.JS
   PAINEL ADMINISTRATIVO
========================================================= */


/* =========================================================
   CONFIGURAÇÕES E VARIÁVEIS
========================================================= */

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    configurarMenu();

    configurarFormularioClinica();

    await carregarDashboard();

    await carregarDadosIniciais();

});


/* =========================================================
   MENU E NAVEGAÇÃO
========================================================= */

function configurarMenu() {

    const botoes = document.querySelectorAll(".menu-btn");

    botoes.forEach(botao => {

        botao.addEventListener("click", async () => {

            const pagina = botao.dataset.page;

            mostrarPagina(pagina);

            botoes.forEach(btn => {
                btn.classList.remove("active");
            });

            botao.classList.add("active");

        });

    });

}


async function mostrarPagina(pagina) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    const paginaSelecionada = document.getElementById(pagina);

    if (paginaSelecionada) {
        paginaSelecionada.classList.remove("hidden");
    }

    const titulo = document.getElementById("tituloPagina");

    if (titulo && TITULOS_PAGINA[pagina]) {
        titulo.textContent = TITULOS_PAGINA[pagina];
    }


    /* CARREGAMENTO DE CADA PÁGINA */

    if (pagina === "dashboard") {
        await carregarDashboard();
    }

    if (pagina === "clinicas") {
        await listarClinicas();
    }

    if (pagina === "especialidades") {
        await listarEspecialidades();
    }

    if (pagina === "regioes") {
        await listarRegioes();
    }

    if (pagina === "estados") {
        await popularSelectRegioes("estadoRegiao");
        await listarEstados();
    }

    if (pagina === "cidades") {
        await popularSelectEstados("cidadeEstado");
        await listarCidades();
    }

    if (pagina === "bairros") {
        await popularSelectCidades("bairroCidade");
        await listarBairros();
    }

}


/* =========================================================
   CARREGAR DADOS INICIAIS
========================================================= */

async function carregarDadosIniciais() {

    await listarClinicas();

    await listarEspecialidades();

    await listarRegioes();

    await listarEstados();

    await listarCidades();

    await listarBairros();

}


/* =========================================================
   DASHBOARD
========================================================= */

async function carregarDashboard() {

    try {

        const { count: totalClinicas } = await supabase
            .from("clinicas")
            .select("*", { count: "exact", head: true });


        const { count: totalAtivas } = await supabase
            .from("clinicas")
            .select("*", { count: "exact", head: true })
            .eq("ativo", true);


        const { count: totalEspecialidades } = await supabase
            .from("especialidades")
            .select("*", { count: "exact", head: true });


        const { count: totalEstados } = await supabase
            .from("estados")
            .select("*", { count: "exact", head: true });


        document.getElementById("totalClinicas").textContent =
            totalClinicas || 0;

        document.getElementById("totalClinicasAtivas").textContent =
            totalAtivas || 0;

        document.getElementById("totalEspecialidades").textContent =
            totalEspecialidades || 0;

        document.getElementById("totalEstados").textContent =
            totalEstados || 0;

    } catch (erro) {

        console.error("Erro dashboard:", erro);

    }

}


/* =========================================================
   CLÍNICAS - LISTAR
========================================================= */

async function listarClinicas() {

    const lista = document.getElementById("listaClinicas");

    if (!lista) return;

    lista.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                Carregando clínicas...
            </td>
        </tr>
    `;


    try {

        const busca =
            document.getElementById("buscarClinica")?.value
                ?.trim()
                .toLowerCase() || "";


        const status =
            document.getElementById("filtroStatusClinica")?.value || "";


        let query = supabase
            .from("clinicas")
            .select(`
                *,
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
                clinica_especialidades (
                    id,
                    rede,
                    ativo,
                    especialidades (
                        id,
                        nome
                    )
                )
            `)
            .order("nome");


        if (busca) {
            query = query.ilike("nome", `%${busca}%`);
        }


        if (status !== "") {
            query = query.eq(
                "ativo",
                status === "true"
            );
        }


        const { data: clinicas, error } = await query;

        if (error) throw error;


        lista.innerHTML = "";


        if (!clinicas || clinicas.length === 0) {

            lista.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:30px;">
                        Nenhuma clínica cadastrada.
                    </td>
                </tr>
            `;

            return;
        }


        clinicas.forEach(clinica => {

            const bairro =
                clinica.bairros?.nome || "-";

            const cidade =
                clinica.bairros?.cidades?.nome || "-";

            const estado =
                clinica.bairros?.cidades?.estados?.nome || "-";


            let especialidadesHTML = "";


            if (
                clinica.clinica_especialidades &&
                clinica.clinica_especialidades.length > 0
            ) {

                especialidadesHTML =
                    clinica.clinica_especialidades
                        .filter(item => item.ativo !== false)
                        .map(item => {

                            const nome =
                                item.especialidades?.nome ||
                                "Especialidade";

                            const classeRede =
                                item.rede === "Sindilegis"
                                    ? "badge-sindilegis"
                                    : "badge-especialista";

                            return `
                                <div class="especialidade-tabela">

                                    <strong>
                                        ${nome}
                                    </strong>

                                    <span class="badge ${classeRede}">
                                        ${item.rede}
                                    </span>

                                </div>
                            `;

                        })
                        .join("");

            } else {

                especialidadesHTML =
                    `<span style="color:#94a3b8">
                        Nenhuma
                    </span>`;
            }


            lista.innerHTML += `

                <tr>

                    <td>

                        <div class="clinica-nome">

                            <strong>
                                ${clinica.nome}
                            </strong>

                            <small>
                                ${clinica.endereco || "-"}
                            </small>

                        </div>

                    </td>


                    <td>

                        ${bairro}

                        <small style="display:block;color:#94a3b8;margin-top:3px;">
                            ${cidade} - ${estado}
                        </small>

                    </td>


                    <td>
                        ${clinica.telefone || "-"}
                    </td>


                    <td>

                        <div class="lista-especialidades-clinica">
                            ${especialidadesHTML}
                        </div>

                    </td>


                    <td>

                        <button
                            class="btn-status ${clinica.ativo ? "ativo" : "inativo"}"
                            onclick="alterarStatusClinica(${clinica.id}, ${clinica.ativo})"
                        >

                            ${clinica.ativo
                                ? "✓ Ativa"
                                : "○ Inativa"
                            }

                        </button>

                    </td>


                    <td>

                        <div class="acoes">

                            <button
                                class="btn-icon btn-edit"
                                onclick="editarClinica(${clinica.id})"
                                title="Editar clínica"
                            >
                                ✏️
                            </button>


                            <button
                                class="btn-icon btn-delete"
                                onclick="excluirClinica(${clinica.id})"
                                title="Excluir clínica"
                            >
                                🗑️
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        });


    } catch (erro) {

        console.error("Erro ao listar clínicas:", erro);

        lista.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   MODAL CLÍNICA
========================================================= */

async function abrirModalClinica() {

    document.getElementById("modalClinica")
        .classList.remove("hidden");


    document.getElementById("tituloModalClinica")
        .textContent = "Nova Clínica";


    document.getElementById("formClinica").reset();


    document.getElementById("clinicaId").value = "";


    document.getElementById("areaStatusClinica")
        .classList.add("hidden");


    document.getElementById("containerEspecialidades")
        .innerHTML = "";


    await popularSelectRegioes("clinicaRegiao");


    limparSelect("clinicaEstado", "Selecione o estado");

    limparSelect("clinicaCidade", "Selecione a cidade");

    limparSelect("clinicaBairro", "Selecione o bairro");


    await adicionarLinhaEspecialidade();

}


function fecharModalClinica() {

    document.getElementById("modalClinica")
        .classList.add("hidden");

}


/* =========================================================
   FORMULÁRIO CLÍNICA
========================================================= */

function configurarFormularioClinica() {

    const form = document.getElementById("formClinica");

    if (!form) return;


    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        await salvarClinica();

    });

}


/* =========================================================
   ADICIONAR LINHA DE ESPECIALIDADE
========================================================= */

async function adicionarLinhaEspecialidade(
    especialidadeId = "",
    rede = "Especialistas"
) {

    const container =
        document.getElementById("containerEspecialidades");


    const { data: especialidades, error } = await supabase
        .from("especialidades")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        alert("Erro ao carregar especialidades.");

        return;
    }


    let options =
        `<option value="">
            Selecione a especialidade
        </option>`;


    especialidades.forEach(especialidade => {

        options += `
            <option
                value="${especialidade.id}"
                ${Number(especialidadeId) === Number(especialidade.id)
                    ? "selected"
                    : ""
                }
            >
                ${especialidade.nome}
            </option>
        `;

    });


    const linha = document.createElement("div");

    linha.className = "linha-especialidade";


    linha.innerHTML = `

        <select class="select-especialidade">

            ${options}

        </select>


        <select class="select-rede">

            <option
                value="Especialistas"
                ${rede === "Especialistas" ? "selected" : ""}
            >
                Rede Especialistas
            </option>


            <option
                value="Sindilegis"
                ${rede === "Sindilegis" ? "selected" : ""}
            >
                Rede Sindilegis
            </option>

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
            title="Remover especialidade"
        >
            🗑️
        </button>

    `;


    linha
        .querySelector(".btn-remover-especialidade")
        .addEventListener("click", () => {

            linha.remove();

        });


    container.appendChild(linha);

}


/* =========================================================
   PEGAR ESPECIALIDADES DO FORMULÁRIO
========================================================= */

function obterEspecialidadesFormulario() {

    const linhas =
        document.querySelectorAll(".linha-especialidade");


    const especialidades = [];


    linhas.forEach(linha => {

        const especialidadeId =
            linha.querySelector(".select-especialidade").value;


        const rede =
            linha.querySelector(".select-rede").value;


        if (especialidadeId) {

            especialidades.push({
                especialidade_id:
                    Number(especialidadeId),

                rede: rede
            });

        }

    });


    return especialidades;

}


/* =========================================================
   SALVAR CLÍNICA
========================================================= */

async function salvarClinica() {

    try {

        const id =
            document.getElementById("clinicaId").value;


        const nome =
            document.getElementById("clinicaNome").value.trim();


        const endereco =
            document.getElementById("clinicaEndereco").value.trim();


        const telefone =
            document.getElementById("clinicaTelefone").value.trim();


        const bairroId =
            document.getElementById("clinicaBairro").value;


        const especialidades =
            obterEspecialidadesFormulario();


        if (!nome || !endereco) {

            alert(
                "Preencha o nome e o endereço da clínica."
            );

            return;
        }


        if (!bairroId) {

            alert(
                "Selecione a localização completa da clínica."
            );

            return;
        }


        if (especialidades.length === 0) {

            alert(
                "Adicione pelo menos uma especialidade."
            );

            return;
        }


        const dadosClinica = {

            nome: nome,

            endereco: endereco,

            telefone: telefone || null,

            bairro_id: Number(bairroId)

        };


        /* ===============================
           EDITAR
        =============================== */

        if (id) {

            dadosClinica.ativo =
                document.getElementById("clinicaAtivo").checked;


            const { error } = await supabase
                .from("clinicas")
                .update(dadosClinica)
                .eq("id", id);


            if (error) throw error;


            /* Remove vínculos antigos */

            const { error: erroDelete } = await supabase
                .from("clinica_especialidades")
                .delete()
                .eq("clinica_id", id);


            if (erroDelete) throw erroDelete;


            /* Insere novos vínculos */

            const dadosEspecialidades =
                especialidades.map(item => ({

                    clinica_id:
                        Number(id),

                    especialidade_id:
                        item.especialidade_id,

                    rede:
                        item.rede,

                    ativo: true

                }));


            const { error: erroEspecialidades } =
                await supabase
                    .from("clinica_especialidades")
                    .insert(dadosEspecialidades);


            if (erroEspecialidades) throw erroEspecialidades;


            alert(
                "Clínica atualizada com sucesso!"
            );


        } else {


            /* ===============================
               CADASTRAR
            =============================== */

            dadosClinica.ativo = true;


            const {
                data: novaClinica,
                error
            } = await supabase
                .from("clinicas")
                .insert(dadosClinica)
                .select()
                .single();


            if (error) throw error;


            const dadosEspecialidades =
                especialidades.map(item => ({

                    clinica_id:
                        novaClinica.id,

                    especialidade_id:
                        item.especialidade_id,

                    rede:
                        item.rede,

                    ativo: true

                }));


            const { error: erroEspecialidades } =
                await supabase
                    .from("clinica_especialidades")
                    .insert(dadosEspecialidades);


            if (erroEspecialidades) throw erroEspecialidades;


            alert(
                "Clínica cadastrada com sucesso!"
            );

        }


        fecharModalClinica();

        await listarClinicas();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar clínica:",
            erro
        );

        alert(
            "Erro ao salvar clínica: " +
            erro.message
        );

    }

}


/* =========================================================
   EDITAR CLÍNICA
========================================================= */

async function editarClinica(id) {

    try {

        const { data: clinica, error } = await supabase
            .from("clinicas")
            .select(`
                *,
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
                clinica_especialidades (
                    id,
                    especialidade_id,
                    rede,
                    ativo
                )
            `)
            .eq("id", id)
            .single();


        if (error) throw error;


        document.getElementById("modalClinica")
            .classList.remove("hidden");


        document.getElementById("tituloModalClinica")
            .textContent = "Editar Clínica";


        document.getElementById("clinicaId").value =
            clinica.id;


        document.getElementById("clinicaNome").value =
            clinica.nome || "";


        document.getElementById("clinicaEndereco").value =
            clinica.endereco || "";


        document.getElementById("clinicaTelefone").value =
            clinica.telefone || "";


        document.getElementById("areaStatusClinica")
            .classList.remove("hidden");


        document.getElementById("clinicaAtivo").checked =
            clinica.ativo;


        /* ===============================
           LOCALIZAÇÃO
        =============================== */

        const bairro =
            clinica.bairros;


        const cidade =
            bairro?.cidades;


        const estado =
            cidade?.estados;


        const regiao =
            estado?.regioes;


        await popularSelectRegioes(
            "clinicaRegiao",
            regiao?.id
        );


        if (regiao?.id) {

            await carregarEstadosClinica(
                estado?.id
            );

        }


        if (estado?.id) {

            await carregarCidadesClinica(
                cidade?.id
            );

        }


        if (cidade?.id) {

            await carregarBairrosClinica(
                bairro?.id
            );

        }


        /* ===============================
           ESPECIALIDADES
        =============================== */

        const container =
            document.getElementById(
                "containerEspecialidades"
            );


        container.innerHTML = "";


        if (
            clinica.clinica_especialidades &&
            clinica.clinica_especialidades.length > 0
        ) {

            for (
                const item of
                clinica.clinica_especialidades
            ) {

                await adicionarLinhaEspecialidade(
                    item.especialidade_id,
                    item.rede
                );

            }

        } else {

            await adicionarLinhaEspecialidade();

        }


    } catch (erro) {

        console.error(
            "Erro ao editar clínica:",
            erro
        );

        alert(
            "Erro ao carregar dados da clínica."
        );

    }

}


/* =========================================================
   EXCLUIR CLÍNICA
========================================================= */

async function excluirClinica(id) {

    const confirmar = confirm(
        "Deseja realmente excluir esta clínica?"
    );


    if (!confirmar) return;


    try {

        const { error } = await supabase
            .from("clinicas")
            .delete()
            .eq("id", id);


        if (error) throw error;


        alert("Clínica excluída com sucesso!");

        await listarClinicas();

        await carregarDashboard();


    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao excluir clínica: " +
            erro.message
        );

    }

}


/* =========================================================
   ALTERAR STATUS CLÍNICA
========================================================= */

async function alterarStatusClinica(id, statusAtual) {

    try {

        const novoStatus = !statusAtual;


        const { error } = await supabase
            .from("clinicas")
            .update({
                ativo: novoStatus
            })
            .eq("id", id);


        if (error) throw error;


        await listarClinicas();

        await carregarDashboard();


    } catch (erro) {

        console.error(erro);

        alert("Erro ao alterar status.");

    }

}


/* =========================================================
   LOCALIZAÇÃO - SELECTS GENÉRICOS
========================================================= */

function limparSelect(id, texto = "Selecione") {

    const select = document.getElementById(id);

    if (!select) return;

    select.innerHTML = `
        <option value="">
            ${texto}
        </option>
    `;

}


async function popularSelectRegioes(
    selectId,
    selecionado = ""
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;


    const { data, error } = await supabase
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


    data.forEach(item => {

        select.innerHTML += `
            <option
                value="${item.id}"
                ${Number(selecionado) === Number(item.id)
                    ? "selected"
                    : ""
                }
            >
                ${item.nome}
            </option>
        `;

    });

}


async function popularSelectEstados(
    selectId,
    selecionado = ""
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;


    const { data, error } = await supabase
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


    data.forEach(item => {

        select.innerHTML += `
            <option
                value="${item.id}"
                ${Number(selecionado) === Number(item.id)
                    ? "selected"
                    : ""
                }
            >
                ${item.nome}
            </option>
        `;

    });

}


async function popularSelectCidades(
    selectId,
    selecionado = ""
) {

    const select =
        document.getElementById(selectId);

    if (!select) return;


    const { data, error } = await supabase
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


    data.forEach(item => {

        select.innerHTML += `
            <option
                value="${item.id}"
                ${Number(selecionado) === Number(item.id)
                    ? "selected"
                    : ""
                }
            >
                ${item.nome}
            </option>
        `;

    });

}


/* =========================================================
   CASCATA CLÍNICA
========================================================= */

async function carregarEstadosClinica(
    selecionado = ""
) {

    const regiaoId =
        document.getElementById("clinicaRegiao").value;


    limparSelect(
        "clinicaEstado",
        "Selecione o estado"
    );

    limparSelect(
        "clinicaCidade",
        "Selecione a cidade"
    );

    limparSelect(
        "clinicaBairro",
        "Selecione o bairro"
    );


    if (!regiaoId) return;


    const { data, error } = await supabase
        .from("estados")
        .select("*")
        .eq("regiao_id", regiaoId)
        .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    const select =
        document.getElementById("clinicaEstado");


    data.forEach(estado => {

        select.innerHTML += `
            <option
                value="${estado.id}"
                ${Number(selecionado) === Number(estado.id)
                    ? "selected"
                    : ""
                }
            >
                ${estado.nome}
            </option>
        `;

    });

}


async function carregarCidadesClinica(
    selecionado = ""
) {

    const estadoId =
        document.getElementById("clinicaEstado").value;


    limparSelect(
        "clinicaCidade",
        "Selecione a cidade"
    );

    limparSelect(
        "clinicaBairro",
        "Selecione o bairro"
    );


    if (!estadoId) return;


    const { data, error } = await supabase
        .from("cidades")
        .select("*")
        .eq("estado_id", estadoId)
        .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    const select =
        document.getElementById("clinicaCidade");


    data.forEach(cidade => {

        select.innerHTML += `
            <option
                value="${cidade.id}"
                ${Number(selecionado) === Number(cidade.id)
                    ? "selected"
                    : ""
                }
            >
                ${cidade.nome}
            </option>
        `;

    });

}


async function carregarBairrosClinica(
    selecionado = ""
) {

    const cidadeId =
        document.getElementById("clinicaCidade").value;


    limparSelect(
        "clinicaBairro",
        "Selecione o bairro"
    );


    if (!cidadeId) return;


    const { data, error } = await supabase
        .from("bairros")
        .select("*")
        .eq("cidade_id", cidadeId)
        .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    const select =
        document.getElementById("clinicaBairro");


    data.forEach(bairro => {

        select.innerHTML += `
            <option
                value="${bairro.id}"
                ${Number(selecionado) === Number(bairro.id)
                    ? "selected"
                    : ""
                }
            >
                ${bairro.nome}
            </option>
        `;

    });

}


/* =========================================================
   ESPECIALIDADES - LISTAR
========================================================= */

async function listarEspecialidades() {

    const lista =
        document.getElementById("listaEspecialidades");

    if (!lista) return;


    const { data, error } = await supabase
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
            `<p style="padding:20px;color:#64748b;">
                Nenhuma especialidade cadastrada.
            </p>`;

        return;
    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>
                        ${item.nome}
                    </strong>

                </div>


                <div class="item-lista-acoes">

                    <button
                        class="btn-small edit"
                        onclick="editarEspecialidade(${item.id}, '${escapeHtml(item.nome)}')"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-small delete"
                        onclick="excluirEspecialidade(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarEspecialidade() {

    const id =
        document.getElementById("especialidadeEditId").value;

    const nome =
        document.getElementById("nomeEspecialidade")
            .value
            .trim();


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

        return;
    }


    try {

        if (id) {

            const { error } = await supabase
                .from("especialidades")
                .update({ nome })
                .eq("id", id);

            if (error) throw error;


        } else {

            const { error } = await supabase
                .from("especialidades")
                .insert({ nome });

            if (error) throw error;

        }


        cancelarEdicaoEspecialidade();

        await listarEspecialidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao salvar especialidade: " +
            erro.message
        );

    }

}


function editarEspecialidade(id, nome) {

    document.getElementById("especialidadeEditId").value =
        id;

    document.getElementById("nomeEspecialidade").value =
        nome;

    document.getElementById(
        "btnSalvarEspecialidade"
    ).textContent = "Salvar";

}


function cancelarEdicaoEspecialidade() {

    document.getElementById("especialidadeEditId").value =
        "";

    document.getElementById("nomeEspecialidade").value =
        "";

    document.getElementById(
        "btnSalvarEspecialidade"
    ).textContent = "Adicionar";

}


async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) return;


    try {

        const { error } = await supabase
            .from("especialidades")
            .delete()
            .eq("id", id);


        if (error) throw error;


        await listarEspecialidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível excluir esta especialidade. " +
            "Ela pode estar vinculada a clínicas."
        );

    }

}


/* =========================================================
   REGIÕES
========================================================= */

async function listarRegioes() {

    const lista =
        document.getElementById("listaRegioes");

    if (!lista) return;


    const { data, error } = await supabase
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += criarItemGerenciamento(
            item.id,
            item.nome,
            "Região",
            "editarRegiao",
            "excluirRegiao"
        );

    });

}


async function salvarRegiao() {

    const id =
        document.getElementById("regiaoEditId").value;

    const nome =
        document.getElementById("nomeRegiao")
            .value
            .trim();


    if (!nome) {

        alert("Digite o nome da região.");

        return;
    }


    try {

        if (id) {

            const { error } = await supabase
                .from("regioes")
                .update({ nome })
                .eq("id", id);

            if (error) throw error;

        } else {

            const { error } = await supabase
                .from("regioes")
                .insert({ nome });

            if (error) throw error;

        }


        cancelarEdicaoRegiao();

        await listarRegioes();


    } catch (erro) {

        alert(
            "Erro ao salvar região: " +
            erro.message
        );

    }

}


function editarRegiao(id, nome) {

    document.getElementById("regiaoEditId").value =
        id;

    document.getElementById("nomeRegiao").value =
        nome;

    document.getElementById("btnSalvarRegiao")
        .textContent = "Salvar";

}


function cancelarEdicaoRegiao() {

    document.getElementById("regiaoEditId").value =
        "";

    document.getElementById("nomeRegiao").value =
        "";

    document.getElementById("btnSalvarRegiao")
        .textContent = "Adicionar";

}


async function excluirRegiao(id) {

    if (!confirm("Deseja excluir esta região?")) return;


    const { error } = await supabase
        .from("regioes")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;
    }


    await listarRegioes();

}


/* =========================================================
   ESTADOS
========================================================= */

async function listarEstados() {

    const lista =
        document.getElementById("listaEstados");

    if (!lista) return;


    const { data, error } = await supabase
        .from("estados")
        .select(`
            *,
            regioes (
                nome
            )
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>${item.nome}</strong>

                    <small>
                        Região:
                        ${item.regioes?.nome || "-"}
                    </small>

                </div>


                <div class="item-lista-acoes">

                    <button
                        class="btn-small edit"
                        onclick="editarEstado(
                            ${item.id},
                            '${escapeHtml(item.nome)}',
                            ${item.regiao_id}
                        )"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-small delete"
                        onclick="excluirEstado(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarEstado() {

    const id =
        document.getElementById("estadoEditId").value;

    const nome =
        document.getElementById("nomeEstado")
            .value
            .trim();

    const regiao_id =
        document.getElementById("estadoRegiao").value;


    if (!nome || !regiao_id) {

        alert(
            "Preencha todos os campos."
        );

        return;
    }


    const dados = {
        nome,
        regiao_id: Number(regiao_id)
    };


    try {

        let error;


        if (id) {

            ({ error } = await supabase
                .from("estados")
                .update(dados)
                .eq("id", id));

        } else {

            ({ error } = await supabase
                .from("estados")
                .insert(dados));

        }


        if (error) throw error;


        cancelarEdicaoEstado();

        await listarEstados();

        await carregarDashboard();


    } catch (erro) {

        alert(erro.message);

    }

}


async function editarEstado(
    id,
    nome,
    regiaoId
) {

    document.getElementById("estadoEditId").value =
        id;

    document.getElementById("nomeEstado").value =
        nome;

    await popularSelectRegioes(
        "estadoRegiao",
        regiaoId
    );

    document.getElementById("btnSalvarEstado")
        .textContent = "Salvar Alterações";

}


function cancelarEdicaoEstado() {

    document.getElementById("estadoEditId").value =
        "";

    document.getElementById("nomeEstado").value =
        "";

    document.getElementById("btnSalvarEstado")
        .textContent = "Adicionar Estado";

}


async function excluirEstado(id) {

    if (!confirm("Deseja excluir este estado?")) return;


    const { error } = await supabase
        .from("estados")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;
    }


    await listarEstados();

    await carregarDashboard();

}


/* =========================================================
   CIDADES
========================================================= */

async function listarCidades() {

    const lista =
        document.getElementById("listaCidades");

    if (!lista) return;


    const { data, error } = await supabase
        .from("cidades")
        .select(`
            *,
            estados (
                nome
            )
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>${item.nome}</strong>

                    <small>
                        Estado:
                        ${item.estados?.nome || "-"}
                    </small>

                </div>


                <div class="item-lista-acoes">

                    <button
                        class="btn-small edit"
                        onclick="editarCidade(
                            ${item.id},
                            '${escapeHtml(item.nome)}',
                            ${item.estado_id}
                        )"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-small delete"
                        onclick="excluirCidade(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarCidade() {

    const id =
        document.getElementById("cidadeEditId").value;

    const nome =
        document.getElementById("nomeCidade")
            .value
            .trim();

    const estado_id =
        document.getElementById("cidadeEstado").value;


    if (!nome || !estado_id) {

        alert("Preencha todos os campos.");

        return;
    }


    const dados = {
        nome,
        estado_id: Number(estado_id)
    };


    try {

        let error;


        if (id) {

            ({ error } = await supabase
                .from("cidades")
                .update(dados)
                .eq("id", id));

        } else {

            ({ error } = await supabase
                .from("cidades")
                .insert(dados));

        }


        if (error) throw error;


        cancelarEdicaoCidade();

        await listarCidades();


    } catch (erro) {

        alert(erro.message);

    }

}


async function editarCidade(
    id,
    nome,
    estadoId
) {

    document.getElementById("cidadeEditId").value =
        id;

    document.getElementById("nomeCidade").value =
        nome;

    await popularSelectEstados(
        "cidadeEstado",
        estadoId
    );

    document.getElementById("btnSalvarCidade")
        .textContent = "Salvar Alterações";

}


function cancelarEdicaoCidade() {

    document.getElementById("cidadeEditId").value =
        "";

    document.getElementById("nomeCidade").value =
        "";

    document.getElementById("btnSalvarCidade")
        .textContent = "Adicionar Cidade";

}


async function excluirCidade(id) {

    if (!confirm("Deseja excluir esta cidade?")) return;


    const { error } = await supabase
        .from("cidades")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;
    }


    await listarCidades();

}


/* =========================================================
   BAIRROS
========================================================= */

async function listarBairros() {

    const lista =
        document.getElementById("listaBairros");

    if (!lista) return;


    const { data, error } = await supabase
        .from("bairros")
        .select(`
            *,
            cidades (
                nome
            )
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;
    }


    lista.innerHTML = "";


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-lista">

                <div class="item-lista-info">

                    <strong>${item.nome}</strong>

                    <small>
                        Cidade:
                        ${item.cidades?.nome || "-"}
                    </small>

                </div>


                <div class="item-lista-acoes">

                    <button
                        class="btn-small edit"
                        onclick="editarBairro(
                            ${item.id},
                            '${escapeHtml(item.nome)}',
                            ${item.cidade_id}
                        )"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-small delete"
                        onclick="excluirBairro(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


async function salvarBairro() {

    const id =
        document.getElementById("bairroEditId").value;

    const nome =
        document.getElementById("nomeBairro")
            .value
            .trim();

    const cidade_id =
        document.getElementById("bairroCidade").value;


    if (!nome || !cidade_id) {

        alert("Preencha todos os campos.");

        return;
    }


    const dados = {
        nome,
        cidade_id: Number(cidade_id)
    };


    try {

        let error;


        if (id) {

            ({ error } = await supabase
                .from("bairros")
                .update(dados)
                .eq("id", id));

        } else {

            ({ error } = await supabase
                .from("bairros")
                .insert(dados));

        }


        if (error) throw error;


        cancelarEdicaoBairro();

        await listarBairros();


    } catch (erro) {

        alert(erro.message);

    }

}


async function editarBairro(
    id,
    nome,
    cidadeId
) {

    document.getElementById("bairroEditId").value =
        id;

    document.getElementById("nomeBairro").value =
        nome;

    await popularSelectCidades(
        "bairroCidade",
        cidadeId
    );

    document.getElementById("btnSalvarBairro")
        .textContent = "Salvar Alterações";

}


function cancelarEdicaoBairro() {

    document.getElementById("bairroEditId").value =
        "";

    document.getElementById("nomeBairro").value =
        "";

    document.getElementById("btnSalvarBairro")
        .textContent = "Adicionar Bairro";

}


async function excluirBairro(id) {

    if (!confirm("Deseja excluir este bairro?")) return;


    const { error } = await supabase
        .from("bairros")
        .delete()
        .eq("id", id);


    if (error) {

        alert(error.message);

        return;
    }


    await listarBairros();

}


/* =========================================================
   FUNÇÃO AUXILIAR - ITEM GERENCIAMENTO
========================================================= */

function criarItemGerenciamento(
    id,
    nome,
    tipo,
    funcaoEditar,
    funcaoExcluir
) {

    return `

        <div class="item-lista">

            <div class="item-lista-info">

                <strong>
                    ${nome}
                </strong>

                <small>
                    ${tipo}
                </small>

            </div>


            <div class="item-lista-acoes">

                <button
                    class="btn-small edit"
                    onclick="${funcaoEditar}(
                        ${id},
                        '${escapeHtml(nome)}'
                    )"
                >
                    Editar
                </button>


                <button
                    class="btn-small delete"
                    onclick="${funcaoExcluir}(${id})"
                >
                    Excluir
                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHtml(texto) {

    if (!texto) return "";

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    const confirmar = confirm(
        "Deseja realmente sair do painel?"
    );

    if (!confirmar) return;


    window.location.href = "login.html";

}
