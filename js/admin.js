// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// ======================================


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    iniciarMenu();

    iniciarBotoes();

    await carregarDashboard();

    await carregarRegioes();

    await carregarEstados();

    await carregarCidades();

    await carregarBairros();

    await carregarEspecialidades();

    await carregarClinicas();

    await popularSelects();

});


// ======================================
// MENU
// ======================================

function iniciarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");


    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const pagina =
                    botao.dataset.page;


                document
                    .querySelectorAll(".menu-btn")
                    .forEach(btn => {

                        btn.classList.remove("active");

                    });


                botao.classList.add("active");


                mostrarPagina(pagina);

            }
        );

    });

}


// ======================================
// MOSTRAR PÁGINA
// ======================================

function mostrarPagina(id) {

    document
        .querySelectorAll(".page")
        .forEach(pagina => {

            pagina.classList.add("hidden");

        });


    const pagina =
        document.getElementById(id);


    if (pagina) {

        pagina.classList.remove("hidden");

    }


    const titulos = {

        dashboard:
            "Dashboard",

        clinicas:
            "Clínicas",

        editarClinica:
            "Editar Clínica",

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
        document.getElementById("tituloPagina");


    if (titulo) {

        titulo.textContent =
            titulos[id] ||
            "Painel Administrativo";

    }

}


// ======================================
// BOTÕES
// ======================================

function iniciarBotoes() {


    // REGIÃO

    document
        .getElementById("btnSalvarRegiao")
        ?.addEventListener(
            "click",
            salvarRegiao
        );


    // ESTADO

    document
        .getElementById("btnSalvarEstado")
        ?.addEventListener(
            "click",
            salvarEstado
        );


    // CIDADE

    document
        .getElementById("btnSalvarCidade")
        ?.addEventListener(
            "click",
            salvarCidade
        );


    // BAIRRO

    document
        .getElementById("btnSalvarBairro")
        ?.addEventListener(
            "click",
            salvarBairro
        );


    // ESPECIALIDADE

    document
        .getElementById("btnSalvarEspecialidade")
        ?.addEventListener(
            "click",
            salvarEspecialidade
        );


    // CLÍNICA

    document
        .getElementById("btnSalvarClinica")
        ?.addEventListener(
            "click",
            salvarClinica
        );


    // ATUALIZAR CLÍNICA

    document
        .getElementById("btnAtualizarClinica")
        ?.addEventListener(
            "click",
            atualizarClinica
        );


    // EXCLUIR CLÍNICA

    document
        .getElementById("btnExcluirClinica")
        ?.addEventListener(
            "click",
            excluirClinica
        );


    // ADICIONAR ESPECIALIDADE

    document
        .getElementById("btnAdicionarEspRede")
        ?.addEventListener(
            "click",
            adicionarEspecialidadeClinica
        );


    // VOLTAR

    document
        .getElementById("btnVoltarClinicas")
        ?.addEventListener(
            "click",
            () => {

                mostrarPagina("clinicas");

            }
        );


    // FILTRO CLÍNICA

    document
        .getElementById("filtro_clinica_nome")
        ?.addEventListener(
            "input",
            carregarClinicas
        );


    // FILTRO ESTADO

    document
        .getElementById("filtro_estado_regiao")
        ?.addEventListener(
            "change",
            carregarEstados
        );


    // FILTRO CIDADE

    document
        .getElementById("filtro_cidade_estado")
        ?.addEventListener(
            "change",
            carregarCidades
        );


    // FILTRO BAIRRO

    document
        .getElementById("filtro_bairro_cidade")
        ?.addEventListener(
            "change",
            carregarBairros
        );


    // ======================================
    // CASCATA NOVA CLÍNICA
    // ======================================

    document
        .getElementById("clinica_regiao")
        ?.addEventListener(
            "change",
            async () => {

                limparSelect(
                    "clinica_estado",
                    "Selecione Estado"
                );

                limparSelect(
                    "clinica_cidade",
                    "Selecione Cidade"
                );

                limparSelect(
                    "clinica_bairro",
                    "Selecione Bairro"
                );

                await popularEstadosClinica();

            }
        );


    document
        .getElementById("clinica_estado")
        ?.addEventListener(
            "change",
            async () => {

                limparSelect(
                    "clinica_cidade",
                    "Selecione Cidade"
                );

                limparSelect(
                    "clinica_bairro",
                    "Selecione Bairro"
                );

                await popularCidadesClinica();

            }
        );


    document
        .getElementById("clinica_cidade")
        ?.addEventListener(
            "change",
            async () => {

                limparSelect(
                    "clinica_bairro",
                    "Selecione Bairro"
                );

                await popularBairrosClinica();

            }
        );


    // ======================================
    // CASCATA EDITAR CLÍNICA
    // ======================================

    document
        .getElementById("edit_clinica_regiao")
        ?.addEventListener(
            "change",
            async () => {

                limparSelect(
                    "edit_clinica_estado",
                    "Selecione Estado"
                );

                limparSelect(
                    "edit_clinica_cidade",
                    "Selecione Cidade"
                );

                limparSelect(
                    "edit_clinica_bairro",
                    "Selecione Bairro"
                );

                await popularEstadosEditar();

            }
        );


    document
        .getElementById("edit_clinica_estado")
        ?.addEventListener(
            "change",
            async () => {

                limparSelect(
                    "edit_clinica_cidade",
                    "Selecione Cidade"
                );

                limparSelect(
                    "edit_clinica_bairro",
                    "Selecione Bairro"
                );

                await popularCidadesEditar();

            }
        );


    document
        .getElementById("edit_clinica_cidade")
        ?.addEventListener(
            "change",
            async () => {

                limparSelect(
                    "edit_clinica_bairro",
                    "Selecione Bairro"
                );

                await popularBairrosEditar();

            }
        );

}


// ======================================
// LIMPAR SELECT
// ======================================

function limparSelect(id, placeholder) {

    const select =
        document.getElementById(id);


    if (!select) return;


    select.innerHTML = `
        <option value="">
            ${placeholder}
        </option>
    `;

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        const clinicas =
            await supabaseClient
                .from("clinicas")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const especialidades =
            await supabaseClient
                .from("especialidades")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const regioes =
            await supabaseClient
                .from("regioes")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const estados =
            await supabaseClient
                .from("estados")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const cidades =
            await supabaseClient
                .from("cidades")
                .select("*", {
                    count: "exact",
                    head: true
                });


        const bairros =
            await supabaseClient
                .from("bairros")
                .select("*", {
                    count: "exact",
                    head: true
                });


        document
            .getElementById("totalClinicas")
            .textContent =
                clinicas.count || 0;


        document
            .getElementById("totalEspecialidades")
            .textContent =
                especialidades.count || 0;


        document
            .getElementById("totalRegioes")
            .textContent =
                regioes.count || 0;


        document
            .getElementById("totalEstados")
            .textContent =
                estados.count || 0;


        document
            .getElementById("totalCidades")
            .textContent =
                cidades.count || 0;


        document
            .getElementById("totalBairros")
            .textContent =
                bairros.count || 0;


    } catch (error) {

        console.error(
            "Erro dashboard:",
            error
        );

    }

}


// ======================================
// REGIÕES
// ======================================

async function salvarRegiao() {

    const input =
        document.getElementById("nova_regiao");


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
            .insert({
                nome: nome
            });


    if (error) {

        alert(error.message);

        return;

    }


    input.value = "";


    await carregarRegioes();

    await popularSelects();

    await carregarDashboard();

}


// ======================================
// LISTAR REGIÕES
// ======================================

async function carregarRegioes() {

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaRegioes");


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(regiao => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    🌎 ${regiao.nome}
                </h3>

            </div>

        `;

    });

}


// ======================================
// ESTADOS
// ======================================

async function salvarEstado() {

    const regiao =
        document
            .getElementById("estado_regiao")
            .value;


    const nome =
        document
            .getElementById("novo_estado")
            .value
            .trim();


    if (!regiao || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("estados")
            .insert({

                nome: nome,

                regiao_id: regiao

            });


    if (error) {

        alert(error.message);

        return;

    }


    document
        .getElementById("novo_estado")
        .value = "";


    await carregarEstados();

    await popularSelects();

    await carregarDashboard();

}


// ======================================
// LISTAR ESTADOS
// ======================================

async function carregarEstados() {

    const filtro =
        document
            .getElementById("filtro_estado_regiao")
            ?.value;


    let query =
        supabaseClient
            .from("estados")
            .select(`
                *,
                regioes(nome)
            `)
            .order("nome");


    if (filtro) {

        query =
            query.eq(
                "regiao_id",
                filtro
            );

    }


    const { data, error } =
        await query;


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaEstados");


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(estado => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    📍 ${estado.nome}
                </h3>

                <small>
                    Região:
                    ${estado.regioes?.nome || "-"}
                </small>

            </div>

        `;

    });

}


// ======================================
// CIDADES
// ======================================

async function salvarCidade() {

    const estado =
        document
            .getElementById("cidade_estado")
            .value;


    const nome =
        document
            .getElementById("nova_cidade")
            .value
            .trim();


    if (!estado || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("cidades")
            .insert({

                nome: nome,

                estado_id: estado

            });


    if (error) {

        alert(error.message);

        return;

    }


    document
        .getElementById("nova_cidade")
        .value = "";


    await carregarCidades();

    await popularSelects();

    await carregarDashboard();

}


// ======================================
// LISTAR CIDADES
// ======================================

async function carregarCidades() {

    const filtro =
        document
            .getElementById("filtro_cidade_estado")
            ?.value;


    let query =
        supabaseClient
            .from("cidades")
            .select(`
                *,
                estados(nome)
            `)
            .order("nome");


    if (filtro) {

        query =
            query.eq(
                "estado_id",
                filtro
            );

    }


    const { data, error } =
        await query;


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaCidades");


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(cidade => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    🏙️ ${cidade.nome}
                </h3>

                <small>
                    Estado:
                    ${cidade.estados?.nome || "-"}
                </small>

            </div>

        `;

    });

}


// ======================================
// BAIRROS
// ======================================

async function salvarBairro() {

    const cidade =
        document
            .getElementById("bairro_cidade")
            .value;


    const nome =
        document
            .getElementById("novo_bairro")
            .value
            .trim();


    if (!cidade || !nome) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("bairros")
            .insert({

                nome: nome,

                cidade_id: cidade

            });


    if (error) {

        alert(error.message);

        return;

    }


    document
        .getElementById("novo_bairro")
        .value = "";


    await carregarBairros();

    await popularSelects();

    await carregarDashboard();

}


// ======================================
// LISTAR BAIRROS
// ======================================

async function carregarBairros() {

    const filtro =
        document
            .getElementById("filtro_bairro_cidade")
            ?.value;


    let query =
        supabaseClient
            .from("bairros")
            .select(`
                *,
                cidades(nome)
            `)
            .order("nome");


    if (filtro) {

        query =
            query.eq(
                "cidade_id",
                filtro
            );

    }


    const { data, error } =
        await query;


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaBairros");


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(bairro => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    📌 ${bairro.nome}
                </h3>

                <small>
                    Cidade:
                    ${bairro.cidades?.nome || "-"}
                </small>

            </div>

        `;

    });

}


// ======================================
// ESPECIALIDADES
// ======================================

async function salvarEspecialidade() {

    const nome =
        document
            .getElementById("nova_especialidade")
            .value
            .trim();


    const rede =
        document
            .getElementById("especialidade_rede")
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

                nome: nome,

                rede: rede

            });


    if (error) {

        alert(error.message);

        return;

    }


    document
        .getElementById("nova_especialidade")
        .value = "";


    await carregarEspecialidades();

    await popularSelects();

    await carregarDashboard();

}


// ======================================
// LISTAR ESPECIALIDADES
// ======================================

async function carregarEspecialidades() {

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document
            .getElementById("listaEspecialidades");


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(especialidade => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    🦷 ${especialidade.nome}
                </h3>

                <small>
                    Rede:
                    ${especialidade.rede || "-"}
                </small>

            </div>

        `;

    });

}


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica() {

    const nome =
        document
            .getElementById("clinica_nome")
            .value
            .trim();


    const telefone =
        document
            .getElementById("clinica_telefone")
            .value
            .trim();


    const endereco =
        document
            .getElementById("clinica_endereco")
            .value
            .trim();


    const regiao_id =
        document
            .getElementById("clinica_regiao")
            .value;


    const estado_id =
        document
            .getElementById("clinica_estado")
            .value;


    const cidade_id =
        document
            .getElementById("clinica_cidade")
            .value;


    const bairro_id =
        document
            .getElementById("clinica_bairro")
            .value;


    const especialidade_id =
        document
            .getElementById("clinica_especialidade")
            .value;


    const rede =
        document
            .getElementById("clinica_rede")
            .value;


    // VALIDAÇÕES

    if (!nome) {

        alert(
            "Digite o nome da clínica."
        );

        return;

    }


    if (!bairro_id) {

        alert(
            "Selecione o bairro."
        );

        return;

    }


    if (!especialidade_id) {

        alert(
            "Selecione uma especialidade."
        );

        return;

    }


    // ======================================
    // SALVAR CLÍNICA
    // ======================================

    const {
        data: clinica,
        error
    } =
        await supabaseClient
            .from("clinicas")
            .insert({

                nome: nome,

                telefone: telefone,

                endereco: endereco,

                regiao_id:
                    regiao_id || null,

                estado_id:
                    estado_id || null,

                cidade_id:
                    cidade_id || null,

                bairro_id:
                    bairro_id,

                ativo:
                    true

            })
            .select()
            .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao cadastrar clínica: " +
            error.message
        );

        return;

    }


    // ======================================
    // VINCULAR ESPECIALIDADE
    // ======================================

    const {
        error: erroVinculo
    } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert({

                clinica_id:
                    clinica.id,

                especialidade_id:
                    especialidade_id,

                rede:
                    rede,

                ativo:
                    true

            });


    if (erroVinculo) {

        console.error(erroVinculo);

        alert(
            "Clínica cadastrada, mas ocorreu erro ao vincular especialidade: " +
            erroVinculo.message
        );

        return;

    }


    alert(
        "Clínica cadastrada com sucesso!"
    );


    // LIMPAR FORMULÁRIO

    document
        .getElementById("clinica_nome")
        .value = "";


    document
        .getElementById("clinica_telefone")
        .value = "";


    document
        .getElementById("clinica_endereco")
        .value = "";


    document
        .getElementById("clinica_regiao")
        .value = "";


    limparSelect(
        "clinica_estado",
        "Selecione Estado"
    );


    limparSelect(
        "clinica_cidade",
        "Selecione Cidade"
    );


    limparSelect(
        "clinica_bairro",
        "Selecione Bairro"
    );


    document
        .getElementById("clinica_especialidade")
        .value = "";


    await carregarClinicas();

    await carregarDashboard();

}


// ======================================
// LISTAR CLÍNICAS
// ======================================

async function carregarClinicas() {

    const filtro =
        document
            .getElementById("filtro_clinica_nome")
            ?.value
            .toLowerCase() || "";


    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select(`
                *,
                regioes(nome),
                estados(nome),
                cidades(nome),
                bairros(nome),
                clinica_especialidades(
                    id,
                    rede,
                    ativo,
                    especialidades(
                        nome
                    )
                )
            `)
            .order("nome");


    if (error) {

        console.error(
            "Erro ao carregar clínicas:",
            error
        );

        return;

    }


    const lista =
        document.getElementById("listaClinicas");


    if (!lista) return;


    lista.innerHTML = "";


    const filtradas =
        data.filter(clinica => {

            if (!filtro) {

                return true;

            }


            return clinica.nome
                .toLowerCase()
                .includes(filtro);

        });


    if (filtradas.length === 0) {

        lista.innerHTML = `
            <p class="sem-vinculos">
                Nenhuma clínica encontrada.
            </p>
        `;

        return;

    }


    filtradas.forEach(clinica => {


        const status =
            clinica.ativo
                ? "ativo"
                : "inativo";


        const especialidades =
            clinica.clinica_especialidades
                ?.filter(item => item.ativo)
                .map(item => {

                    const nome =
                        item.especialidades?.nome || "";

                    return `
                        <span class="tag-especialidade">
                            ${nome}
                            (${item.rede})
                        </span>
                    `;

                })
                .join("")
            || "";


        lista.innerHTML += `

            <div class="box clinica-box">

                <div>

                    <h3>
                        🏥 ${clinica.nome}
                    </h3>


                    <small>
                        📞 ${clinica.telefone || "-"}
                    </small>

                    <br>


                    <small>
                        📍
                        ${clinica.bairros?.nome || ""}
                        ${clinica.cidades?.nome
                            ? " - " + clinica.cidades.nome
                            : ""
                        }
                        ${clinica.estados?.nome
                            ? " / " + clinica.estados.nome
                            : ""
                        }
                    </small>


                    <div class="especialidades-admin">

                        ${especialidades}

                    </div>

                </div>


                <div class="clinica-acoes">

                    <span class="status ${status}">
                        ${status}
                    </span>


                    <button
                        class="blue"
                        onclick="editarClinica('${clinica.id}')"
                    >
                        ✏️ Editar
                    </button>

                </div>

            </div>

        `;

    });

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id) {

    console.log(
        "Editando clínica:",
        id
    );


    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao carregar clínica: " +
            error.message
        );

        return;

    }


    // ID

    document
        .getElementById("edit_clinica_id")
        .value = data.id;


    // NOME

    document
        .getElementById("edit_clinica_nome")
        .value = data.nome || "";


    // TELEFONE

    document
        .getElementById("edit_clinica_telefone")
        .value = data.telefone || "";


    // ENDEREÇO

    document
        .getElementById("edit_clinica_endereco")
        .value = data.endereco || "";


    // STATUS

    document
        .getElementById("edit_clinica_ativo")
        .checked = data.ativo === true;


    // ======================================
    // CARREGAR SELECTS
    // ======================================

    await popularSelects();


    // REGIÃO

    document
        .getElementById("edit_clinica_regiao")
        .value = data.regiao_id || "";


    // ESTADO

    if (data.regiao_id) {

        await popularEstadosEditar();

        document
            .getElementById("edit_clinica_estado")
            .value = data.estado_id || "";

    }


    // CIDADE

    if (data.estado_id) {

        await popularCidadesEditar();

        document
            .getElementById("edit_clinica_cidade")
            .value = data.cidade_id || "";

    }


    // BAIRRO

    if (data.cidade_id) {

        await popularBairrosEditar();

        document
            .getElementById("edit_clinica_bairro")
            .value = data.bairro_id || "";

    }


    // ESPECIALIDADES

    await carregarEspecialidadesClinica();


    // MOSTRAR PÁGINA

    mostrarPagina(
        "editarClinica"
    );

}


// ======================================
// ATUALIZAR CLÍNICA
// ======================================

async function atualizarClinica() {

    const id =
        document
            .getElementById("edit_clinica_id")
            .value;


    if (!id) {

        alert(
            "Nenhuma clínica selecionada."
        );

        return;

    }


    const nome =
        document
            .getElementById("edit_clinica_nome")
            .value
            .trim();


    if (!nome) {

        alert(
            "Digite o nome da clínica."
        );

        return;

    }


    const dados = {

        nome:
            nome,

        telefone:
            document
                .getElementById("edit_clinica_telefone")
                .value
                .trim(),

        endereco:
            document
                .getElementById("edit_clinica_endereco")
                .value
                .trim(),

        regiao_id:
            document
                .getElementById("edit_clinica_regiao")
                .value || null,

        estado_id:
            document
                .getElementById("edit_clinica_estado")
                .value || null,

        cidade_id:
            document
                .getElementById("edit_clinica_cidade")
                .value || null,

        bairro_id:
            document
                .getElementById("edit_clinica_bairro")
                .value || null,

        ativo:
            document
                .getElementById("edit_clinica_ativo")
                .checked

    };


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update(dados)
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "Erro ao atualizar clínica: " +
            error.message
        );

        return;

    }


    alert(
        "Clínica atualizada com sucesso!"
    );


    await carregarClinicas();

    await carregarDashboard();


    mostrarPagina(
        "clinicas"
    );

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica() {

    const id =
        document
            .getElementById("edit_clinica_id")
            .value;


    if (!id) {

        alert(
            "Nenhuma clínica selecionada."
        );

        return;

    }


    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?\n\n" +
            "As especialidades vinculadas também serão removidas."
        );


    if (!confirmar) {

        return;

    }


    // ======================================
    // EXCLUIR VÍNCULOS
    // ======================================

    const {
        error: erroVinculos
    } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "clinica_id",
                id
            );


    if (erroVinculos) {

        console.error(
            erroVinculos
        );

        alert(
            "Erro ao excluir vínculos: " +
            erroVinculos.message
        );

        return;

    }


    // ======================================
    // EXCLUIR CLÍNICA
    // ======================================

    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir clínica: " +
            error.message
        );

        return;

    }


    alert(
        "Clínica excluída com sucesso!"
    );


    await carregarClinicas();

    await carregarDashboard();


    mostrarPagina(
        "clinicas"
    );

}


// ======================================
// ADICIONAR ESPECIALIDADE À CLÍNICA
// ======================================

async function adicionarEspecialidadeClinica() {

    const clinicaId =
        document
            .getElementById("edit_clinica_id")
            .value;


    const especialidadeId =
        document
            .getElementById("edit_especialidade")
            .value;


    const rede =
        document
            .getElementById("edit_rede")
            .value;


    if (!clinicaId) {

        alert(
            "Nenhuma clínica selecionada."
        );

        return;

    }


    if (!especialidadeId) {

        alert(
            "Selecione uma especialidade."
        );

        return;

    }


    // VERIFICAR DUPLICIDADE

    const {
        data: existente,
        error: erroConsulta
    } =
        await supabaseClient
            .from("clinica_especialidades")
            .select("id")
            .eq(
                "clinica_id",
                clinicaId
            )
            .eq(
                "especialidade_id",
                especialidadeId
            )
            .eq(
                "rede",
                rede
            )
            .maybeSingle();


    if (erroConsulta) {

        console.error(
            erroConsulta
        );

    }


    if (existente) {

        alert(
            "Esta especialidade já está vinculada a esta clínica nesta rede."
        );

        return;

    }


    // INSERIR

    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert({

                clinica_id:
                    clinicaId,

                especialidade_id:
                    especialidadeId,

                rede:
                    rede,

                ativo:
                    true

            });


    if (error) {

        console.error(error);

        alert(
            "Erro ao adicionar especialidade: " +
            error.message
        );

        return;

    }


    alert(
        "Especialidade adicionada com sucesso!"
    );


    document
        .getElementById("edit_especialidade")
        .value = "";


    await carregarEspecialidadesClinica();

}


// ======================================
// CARREGAR ESPECIALIDADES DA CLÍNICA
// ======================================

async function carregarEspecialidadesClinica() {

    const clinicaId =
        document
            .getElementById("edit_clinica_id")
            .value;


    const lista =
        document
            .getElementById("listaEspRede");


    if (!lista) return;


    if (!clinicaId) {

        lista.innerHTML = "";

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
                rede,
                ativo,
                especialidades(
                    id,
                    nome
                )
            `)
            .eq(
                "clinica_id",
                clinicaId
            )
            .order("id");


    if (error) {

        console.error(error);

        lista.innerHTML = `
            <p>
                Erro ao carregar especialidades.
            </p>
        `;

        return;

    }


    lista.innerHTML = "";


    if (!data || data.length === 0) {

        lista.innerHTML = `

            <p class="sem-vinculos">

                Nenhuma especialidade vinculada.

            </p>

        `;

        return;

    }


    data.forEach(item => {


        const nome =
            item.especialidades?.nome ||
            "Especialidade não encontrada";


        const status =
            item.ativo
                ? "Ativa"
                : "Inativa";


        lista.innerHTML += `

            <div class="vinculo-item">

                <div>

                    <strong>
                        🦷 ${nome}
                    </strong>

                    <br>

                    <small>
                        Rede: ${item.rede}
                    </small>

                    <br>

                    <small>
                        Status: ${status}
                    </small>

                </div>


                <button
                    class="red btn-remover"
                    onclick="removerEspecialidadeClinica('${item.id}')"
                >
                    🗑 Remover
                </button>

            </div>

        `;

    });

}


// ======================================
// REMOVER ESPECIALIDADE DA CLÍNICA
// ======================================

async function removerEspecialidadeClinica(id) {

    const confirmar =
        confirm(
            "Deseja remover esta especialidade?"
        );


    if (!confirmar) {

        return;

    }


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "Erro ao remover especialidade: " +
            error.message
        );

        return;

    }


    alert(
        "Especialidade removida com sucesso!"
    );


    await carregarEspecialidadesClinica();

}


// ======================================
// POPULAR TODOS OS SELECTS
// ======================================

async function popularSelects() {


    // ======================================
    // REGIÕES
    // ======================================

    const {
        data: regioes,
        error: erroRegioes
    } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if (erroRegioes) {

        console.error(erroRegioes);

    }


    preencherSelect(
        "estado_regiao",
        regioes,
        "Selecione Região"
    );


    preencherSelect(
        "filtro_estado_regiao",
        regioes,
        "Todas as Regiões"
    );


    preencherSelect(
        "clinica_regiao",
        regioes,
        "Selecione Região"
    );


    preencherSelect(
        "edit_clinica_regiao",
        regioes,
        "Selecione Região"
    );


    // ======================================
    // ESTADOS
    // ======================================

    const {
        data: estados,
        error: erroEstados
    } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


    if (erroEstados) {

        console.error(erroEstados);

    }


    preencherSelect(
        "cidade_estado",
        estados,
        "Selecione Estado"
    );


    preencherSelect(
        "filtro_cidade_estado",
        estados,
        "Todos os Estados"
    );


    // ======================================
    // CIDADES
    // ======================================

    const {
        data: cidades,
        error: erroCidades
    } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


    if (erroCidades) {

        console.error(erroCidades);

    }


    preencherSelect(
        "bairro_cidade",
        cidades,
        "Selecione Cidade"
    );


    preencherSelect(
        "filtro_bairro_cidade",
        cidades,
        "Todas as Cidades"
    );


    // ======================================
    // ESPECIALIDADES
    // ======================================

    const {
        data: especialidades,
        error: erroEspecialidades
    } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if (erroEspecialidades) {

        console.error(
            erroEspecialidades
        );

    }


    preencherSelect(
        "clinica_especialidade",
        especialidades,
        "Selecione Especialidade"
    );


    preencherSelect(
        "edit_especialidade",
        especialidades,
        "Selecione Especialidade"
    );

}


// ======================================
// PREENCHER SELECT
// ======================================

function preencherSelect(
    id,
    dados,
    placeholder
) {

    const select =
        document.getElementById(id);


    if (!select) {

        return;

    }


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            ${placeholder}
        </option>
    `;


    if (dados) {

        dados.forEach(item => {

            select.innerHTML += `

                <option value="${item.id}">
                    ${item.nome}
                </option>

            `;

        });

    }


    if (valorAtual) {

        select.value =
            valorAtual;

    }

}


// ======================================
// CASCATA NOVA CLÍNICA
// ESTADOS
// ======================================

async function popularEstadosClinica() {

    const regiao =
        document
            .getElementById("clinica_regiao")
            .value;


    if (!regiao) {

        limparSelect(
            "clinica_estado",
            "Selecione Estado"
        );

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiao
            )
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    preencherSelect(
        "clinica_estado",
        data,
        "Selecione Estado"
    );

}


// ======================================
// CASCATA NOVA CLÍNICA
// CIDADES
// ======================================

async function popularCidadesClinica() {

    const estado =
        document
            .getElementById("clinica_estado")
            .value;


    if (!estado) {

        limparSelect(
            "clinica_cidade",
            "Selecione Cidade"
        );

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estado
            )
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    preencherSelect(
        "clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


// ======================================
// CASCATA NOVA CLÍNICA
// BAIRROS
// ======================================

async function popularBairrosClinica() {

    const cidade =
        document
            .getElementById("clinica_cidade")
            .value;


    if (!cidade) {

        limparSelect(
            "clinica_bairro",
            "Selecione Bairro"
        );

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidade
            )
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    preencherSelect(
        "clinica_bairro",
        data,
        "Selecione Bairro"
    );

}


// ======================================
// CASCATA EDITAR CLÍNICA
// ESTADOS
// ======================================

async function popularEstadosEditar() {

    const regiao =
        document
            .getElementById("edit_clinica_regiao")
            .value;


    if (!regiao) {

        limparSelect(
            "edit_clinica_estado",
            "Selecione Estado"
        );

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiao
            )
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    preencherSelect(
        "edit_clinica_estado",
        data,
        "Selecione Estado"
    );

}


// ======================================
// CASCATA EDITAR CLÍNICA
// CIDADES
// ======================================

async function popularCidadesEditar() {

    const estado =
        document
            .getElementById("edit_clinica_estado")
            .value;


    if (!estado) {

        limparSelect(
            "edit_clinica_cidade",
            "Selecione Cidade"
        );

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estado
            )
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    preencherSelect(
        "edit_clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


// ======================================
// CASCATA EDITAR CLÍNICA
// BAIRROS
// ======================================

async function popularBairrosEditar() {

    const cidade =
        document
            .getElementById("edit_clinica_cidade")
            .value;


    if (!cidade) {

        limparSelect(
            "edit_clinica_bairro",
            "Selecione Bairro"
        );

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidade
            )
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    preencherSelect(
        "edit_clinica_bairro",
        data,
        "Selecione Bairro"
    );

}
