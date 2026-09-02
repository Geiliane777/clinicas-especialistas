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

        botao.addEventListener("click", () => {

            const pagina =
                botao.dataset.page;


            document
                .querySelectorAll(".menu-btn")
                .forEach(btn => {

                    btn.classList.remove("active");

                });


            botao.classList.add("active");

            mostrarPagina(pagina);

        });

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

        dashboard: "Dashboard",

        clinicas: "Clínicas",

        editarClinica: "Editar Clínica",

        especialidades: "Especialidades",

        regioes: "Regiões",

        estados: "Estados",

        cidades: "Cidades",

        bairros: "Bairros"

    };


    const titulo =
        document.getElementById("tituloPagina");


    if (titulo) {

        titulo.textContent =
            titulos[id] || "Painel Administrativo";

    }

}


// ======================================
// BOTÕES
// ======================================

function iniciarBotoes() {

    document
        .getElementById("btnSalvarRegiao")
        ?.addEventListener("click", salvarRegiao);


    document
        .getElementById("btnSalvarEstado")
        ?.addEventListener("click", salvarEstado);


    document
        .getElementById("btnSalvarCidade")
        ?.addEventListener("click", salvarCidade);


    document
        .getElementById("btnSalvarBairro")
        ?.addEventListener("click", salvarBairro);


    document
        .getElementById("btnSalvarEspecialidade")
        ?.addEventListener(
            "click",
            salvarEspecialidade
        );


    document
        .getElementById("btnSalvarClinica")
        ?.addEventListener(
            "click",
            salvarClinica
        );


    document
        .getElementById("btnAtualizarClinica")
        ?.addEventListener(
            "click",
            atualizarClinica
        );


    document
        .getElementById("btnExcluirClinica")
        ?.addEventListener(
            "click",
            excluirClinica
        );


    document
        .getElementById("btnVoltarClinicas")
        ?.addEventListener("click", () => {

            mostrarPagina("clinicas");

        });


    // ======================================
    // ADICIONAR ESPECIALIDADE
    // ======================================

    document
        .getElementById("btnAdicionarEspRede")
        ?.addEventListener(
            "click",
            adicionarEspecialidadeRede
        );


    // ======================================
    // FILTROS
    // ======================================

    document
        .getElementById("filtro_clinica_nome")
        ?.addEventListener(
            "input",
            carregarClinicas
        );


    document
        .getElementById("filtro_estado_regiao")
        ?.addEventListener(
            "change",
            carregarEstados
        );


    document
        .getElementById("filtro_cidade_estado")
        ?.addEventListener(
            "change",
            carregarCidades
        );


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
        ?.addEventListener("change", async () => {

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

        });


    document
        .getElementById("clinica_estado")
        ?.addEventListener("change", async () => {

            limparSelect(
                "clinica_cidade",
                "Selecione Cidade"
            );

            limparSelect(
                "clinica_bairro",
                "Selecione Bairro"
            );

            await popularCidadesClinica();

        });


    document
        .getElementById("clinica_cidade")
        ?.addEventListener("change", async () => {

            limparSelect(
                "clinica_bairro",
                "Selecione Bairro"
            );

            await popularBairrosClinica();

        });


    // ======================================
    // CASCATA EDITAR CLÍNICA
    // ======================================

    document
        .getElementById("edit_clinica_regiao")
        ?.addEventListener("change", async () => {

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

        });


    document
        .getElementById("edit_clinica_estado")
        ?.addEventListener("change", async () => {

            limparSelect(
                "edit_clinica_cidade",
                "Selecione Cidade"
            );

            limparSelect(
                "edit_clinica_bairro",
                "Selecione Bairro"
            );

            await popularCidadesEditar();

        });


    document
        .getElementById("edit_clinica_cidade")
        ?.addEventListener("change", async () => {

            limparSelect(
                "edit_clinica_bairro",
                "Selecione Bairro"
            );

            await popularBairrosEditar();

        });

}


// ======================================
// LIMPAR SELECT
// ======================================

function limparSelect(id, texto) {

    const select =
        document.getElementById(id);


    if (!select) return;


    select.innerHTML =
        `<option value="">
            ${texto}
        </option>`;

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        const tabelas = [
            "clinicas",
            "especialidades",
            "regioes",
            "estados",
            "cidades",
            "bairros"
        ];


        const resultados =
            await Promise.all(

                tabelas.map(tabela =>

                    supabaseClient
                        .from(tabela)
                        .select("*", {
                            count: "exact",
                            head: true
                        })

                )

            );


        document
            .getElementById("totalClinicas")
            .textContent =
            resultados[0].count || 0;


        document
            .getElementById("totalEspecialidades")
            .textContent =
            resultados[1].count || 0;


        document
            .getElementById("totalRegioes")
            .textContent =
            resultados[2].count || 0;


        document
            .getElementById("totalEstados")
            .textContent =
            resultados[3].count || 0;


        document
            .getElementById("totalCidades")
            .textContent =
            resultados[4].count || 0;


        document
            .getElementById("totalBairros")
            .textContent =
            resultados[5].count || 0;

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

        alert("Digite o nome da região.");

        return;

    }


    const { error } =
        await supabaseClient
            .from("regioes")
            .insert({ nome });


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
                nome,
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
            .getElementById(
                "filtro_estado_regiao"
            )
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
                nome,
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
            .getElementById(
                "filtro_cidade_estado"
            )
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
                nome,
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
            .getElementById(
                "filtro_bairro_cidade"
            )
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
            .getElementById(
                "nova_especialidade"
            )
            .value
            .trim();


    if (!nome) {

        alert(
            "Digite a especialidade."
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

        alert(error.message);

        return;

    }


    document
        .getElementById(
            "nova_especialidade"
        )
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
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) return;


    lista.innerHTML = "";


    data.forEach(especialidade => {

        lista.innerHTML += `

            <div class="box">

                <h3>
                    🦷 ${especialidade.nome}
                </h3>

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


    if (
        !nome ||
        !bairro_id ||
        !especialidade_id ||
        !rede
    ) {

        alert(
            "Preencha nome, localização, especialidade e rede."
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

                nome,

                telefone,

                endereco,

                regiao_id,

                estado_id,

                cidade_id,

                bairro_id,

                ativo: true

            })
            .select()
            .single();


    if (error) {

        console.error(error);

        alert(error.message);

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

                especialidade_id,

                rede,

                ativo: true

            });


    if (erroVinculo) {

        console.error(erroVinculo);

        alert(
            "Clínica cadastrada, mas ocorreu erro ao vincular especialidade."
        );

        return;

    }


    alert(
        "Clínica cadastrada com sucesso!"
    );


    limparFormularioClinica();


    await carregarClinicas();

    await carregarDashboard();

}


// ======================================
// LIMPAR FORMULÁRIO CLÍNICA
// ======================================

function limparFormularioClinica() {

    document
        .getElementById("clinica_nome")
        .value = "";


    document
        .getElementById("clinica_telefone")
        .value = "";


    document
        .getElementById("clinica_endereco")
        .value = "";


    limparSelect(
        "clinica_regiao",
        "Selecione Região"
    );


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
        .getElementById(
            "clinica_especialidade"
        )
        .value = "";

}


// ======================================
// LISTAR CLÍNICAS
// ======================================

async function carregarClinicas() {

    const filtro =
        document
            .getElementById(
                "filtro_clinica_nome"
            )
            ?.value
            .toLowerCase();


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
                    especialidades(nome)
                )
            `)
            .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    lista.innerHTML = "";


    const filtradas =
        data.filter(clinica => {

            if (!filtro) return true;

            return clinica.nome
                .toLowerCase()
                .includes(filtro);

        });


    filtradas.forEach(clinica => {

        const status =
            clinica.ativo !== false
                ? "ativo"
                : "inativo";


        const especialidades =
            clinica.clinica_especialidades
                ?.filter(item => item.ativo)
                .map(item => {

                    return `
                        <span class="tag-admin">
                            ${item.especialidades?.nome || "-"}
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

                    <small>
                        📍
                        ${clinica.bairros?.nome || ""}
                        -
                        ${clinica.cidades?.nome || ""}
                    </small>

                    <div class="tags-admin">
                        ${especialidades}
                    </div>

                </div>


                <div>

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

    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        alert(error.message);

        return;

    }


    document
        .getElementById(
            "edit_clinica_id"
        )
        .value = data.id;


    document
        .getElementById(
            "edit_clinica_nome"
        )
        .value = data.nome || "";


    document
        .getElementById(
            "edit_clinica_telefone"
        )
        .value = data.telefone || "";


    document
        .getElementById(
            "edit_clinica_endereco"
        )
        .value = data.endereco || "";


    document
        .getElementById(
            "edit_clinica_ativo"
        )
        .checked =
        data.ativo !== false;


    await popularSelects();


    document
        .getElementById(
            "edit_clinica_regiao"
        )
        .value =
        data.regiao_id || "";


    await popularEstadosEditar();


    document
        .getElementById(
            "edit_clinica_estado"
        )
        .value =
        data.estado_id || "";


    await popularCidadesEditar();


    document
        .getElementById(
            "edit_clinica_cidade"
        )
        .value =
        data.cidade_id || "";


    await popularBairrosEditar();


    document
        .getElementById(
            "edit_clinica_bairro"
        )
        .value =
        data.bairro_id || "";


    await carregarEspecialidadesVinculadas(
        data.id
    );


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
            .getElementById(
                "edit_clinica_id"
            )
            .value;


    const dados = {

        nome:
            document
                .getElementById(
                    "edit_clinica_nome"
                )
                .value
                .trim(),

        telefone:
            document
                .getElementById(
                    "edit_clinica_telefone"
                )
                .value
                .trim(),

        endereco:
            document
                .getElementById(
                    "edit_clinica_endereco"
                )
                .value
                .trim(),

        regiao_id:
            document
                .getElementById(
                    "edit_clinica_regiao"
                )
                .value || null,

        estado_id:
            document
                .getElementById(
                    "edit_clinica_estado"
                )
                .value || null,

        cidade_id:
            document
                .getElementById(
                    "edit_clinica_cidade"
                )
                .value || null,

        bairro_id:
            document
                .getElementById(
                    "edit_clinica_bairro"
                )
                .value || null,

        ativo:
            document
                .getElementById(
                    "edit_clinica_ativo"
                )
                .checked

    };


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update(dados)
            .eq("id", id);


    if (error) {

        alert(error.message);

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
            .getElementById(
                "edit_clinica_id"
            )
            .value;


    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?"
        );


    if (!confirmar) return;


    // EXCLUIR VÍNCULOS

    await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            id
        );


    // EXCLUIR CLÍNICA

    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        alert(error.message);

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
// ADICIONAR ESPECIALIDADE / REDE
// ======================================

async function adicionarEspecialidadeRede() {

    const clinica_id =
        document
            .getElementById(
                "edit_clinica_id"
            )
            .value;


    const especialidade_id =
        document
            .getElementById(
                "edit_especialidade"
            )
            .value;


    const rede =
        document
            .getElementById(
                "edit_rede"
            )
            .value;


    if (
        !clinica_id ||
        !especialidade_id ||
        !rede
    ) {

        alert(
            "Selecione uma especialidade e uma rede."
        );

        return;

    }


    const {
        data: existente
    } =
        await supabaseClient
            .from("clinica_especialidades")
            .select("id")
            .eq(
                "clinica_id",
                clinica_id
            )
            .eq(
                "especialidade_id",
                especialidade_id
            )
            .eq(
                "rede",
                rede
            )
            .maybeSingle();


    if (existente) {

        alert(
            "Esta especialidade já está vinculada a esta rede."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert({

                clinica_id,

                especialidade_id,

                rede,

                ativo: true

            });


    if (error) {

        alert(error.message);

        return;

    }


    document
        .getElementById(
            "edit_especialidade"
        )
        .value = "";


    await carregarEspecialidadesVinculadas(
        clinica_id
    );


    await carregarClinicas();


    alert(
        "Especialidade adicionada com sucesso!"
    );

}


// ======================================
// CARREGAR ESPECIALIDADES DA CLÍNICA
// ======================================

async function carregarEspecialidadesVinculadas(
    clinicaId
) {

    const { data, error } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
                rede,
                ativo,
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
        document.getElementById(
            "listaEspRede"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data.length) {

        lista.innerHTML = `

            <p class="vazio">
                Nenhuma especialidade vinculada.
            </p>

        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="vinculo-item">

                <div>

                    <strong>
                        🦷
                        ${item.especialidades?.nome || "-"}
                    </strong>

                    <span class="rede-badge">
                        ${item.rede}
                    </span>

                </div>


                <button
                    class="red small-btn"
                    onclick="removerEspecialidadeRede('${item.id}')"
                >
                    🗑 Remover
                </button>

            </div>

        `;

    });

}


// ======================================
// REMOVER ESPECIALIDADE
// ======================================

async function removerEspecialidadeRede(id) {

    const confirmar =
        confirm(
            "Deseja remover esta especialidade?"
        );


    if (!confirmar) return;


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        alert(error.message);

        return;

    }


    const clinicaId =
        document
            .getElementById(
                "edit_clinica_id"
            )
            .value;


    await carregarEspecialidadesVinculadas(
        clinicaId
    );


    await carregarClinicas();

}


// ======================================
// POPULAR SELECTS
// ======================================

async function popularSelects() {

    const { data: regioes } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


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


    const { data: estados } =
        await supabaseClient
            .from("estados")
            .select("*")
            .order("nome");


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


    const { data: cidades } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .order("nome");


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


    const { data: especialidades } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


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


    if (!select) return;


    const valorAtual =
        select.value;


    select.innerHTML =
        `<option value="">
            ${placeholder}
        </option>`;


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
// ======================================

async function popularEstadosClinica() {

    const regiao =
        document
            .getElementById(
                "clinica_regiao"
            )
            .value;


    if (!regiao) return;


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiao
            )
            .order("nome");


    preencherSelect(
        "clinica_estado",
        data,
        "Selecione Estado"
    );

}


// ======================================
// CIDADES NOVA CLÍNICA
// ======================================

async function popularCidadesClinica() {

    const estado =
        document
            .getElementById(
                "clinica_estado"
            )
            .value;


    if (!estado) return;


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estado
            )
            .order("nome");


    preencherSelect(
        "clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


// ======================================
// BAIRROS NOVA CLÍNICA
// ======================================

async function popularBairrosClinica() {

    const cidade =
        document
            .getElementById(
                "clinica_cidade"
            )
            .value;


    if (!cidade) return;


    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidade
            )
            .order("nome");


    preencherSelect(
        "clinica_bairro",
        data,
        "Selecione Bairro"
    );

}


// ======================================
// CASCATA EDITAR
// ======================================

async function popularEstadosEditar() {

    const regiao =
        document
            .getElementById(
                "edit_clinica_regiao"
            )
            .value;


    if (!regiao) return;


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq(
                "regiao_id",
                regiao
            )
            .order("nome");


    preencherSelect(
        "edit_clinica_estado",
        data,
        "Selecione Estado"
    );

}


// ======================================
// CIDADES EDITAR
// ======================================

async function popularCidadesEditar() {

    const estado =
        document
            .getElementById(
                "edit_clinica_estado"
            )
            .value;


    if (!estado) return;


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq(
                "estado_id",
                estado
            )
            .order("nome");


    preencherSelect(
        "edit_clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


// ======================================
// BAIRROS EDITAR
// ======================================

async function popularBairrosEditar() {

    const cidade =
        document
            .getElementById(
                "edit_clinica_cidade"
            )
            .value;


    if (!cidade) return;


    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "cidade_id",
                cidade
            )
            .order("nome");


    preencherSelect(
        "edit_clinica_bairro",
        data,
        "Selecione Bairro"
    );

}
