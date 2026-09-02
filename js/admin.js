```javascript
// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO - REDE ESPECIALISTAS
// ======================================


// ======================================
// FUNÇÕES AUXILIARES
// ======================================

function escaparHTML(texto) {
    if (texto === null || texto === undefined) return "";

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================
// DROPDOWNS
// ======================================

async function popularRegioes(selectId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    el.innerHTML = `<option value="">Selecione Região</option>`;

    const { data, error } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");

    if (error) {
        console.error("Erro ao carregar regiões:", error);
        return;
    }

    data.forEach(regiao => {
        el.innerHTML += `
            <option value="${regiao.id}">
                ${escaparHTML(regiao.nome)}
            </option>
        `;
    });
}


async function popularRegioesComTodas(selectId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    const { data, error } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    el.innerHTML = `
        <option value="">Todas as Regiões</option>
    `;

    data.forEach(regiao => {
        el.innerHTML += `
            <option value="${regiao.id}">
                ${escaparHTML(regiao.nome)}
            </option>
        `;
    });
}


async function popularEstados(selectId, regiaoId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    el.innerHTML = `<option value="">Selecione Estado</option>`;

    if (!regiaoId) return;

    const { data, error } = await supabaseClient
        .from("estados")
        .select("*")
        .eq("regiao_id", regiaoId)
        .order("nome");

    if (error) {
        console.error("Erro ao carregar estados:", error);
        return;
    }

    data.forEach(estado => {
        el.innerHTML += `
            <option value="${estado.id}">
                ${escaparHTML(estado.nome)}
            </option>
        `;
    });
}


async function popularEstadosSemRegiao(selectId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    const { data, error } = await supabaseClient
        .from("estados")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    el.innerHTML = `<option value="">Selecione Estado</option>`;

    data.forEach(estado => {
        el.innerHTML += `
            <option value="${estado.id}">
                ${escaparHTML(estado.nome)}
            </option>
        `;
    });
}


async function popularEstadosComTodas(selectId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    const { data, error } = await supabaseClient
        .from("estados")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    el.innerHTML = `<option value="">Todos os Estados</option>`;

    data.forEach(estado => {
        el.innerHTML += `
            <option value="${estado.id}">
                ${escaparHTML(estado.nome)}
            </option>
        `;
    });
}


async function popularCidades(selectId, estadoId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    el.innerHTML = `<option value="">Selecione Cidade</option>`;

    if (!estadoId) return;

    const { data, error } = await supabaseClient
        .from("cidades")
        .select("*")
        .eq("estado_id", estadoId)
        .order("nome");

    if (error) {
        console.error("Erro ao carregar cidades:", error);
        return;
    }

    data.forEach(cidade => {
        el.innerHTML += `
            <option value="${cidade.id}">
                ${escaparHTML(cidade.nome)}
            </option>
        `;
    });
}


async function popularCidadesSemEstado(selectId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    const { data, error } = await supabaseClient
        .from("cidades")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    el.innerHTML = `<option value="">Selecione Cidade</option>`;

    data.forEach(cidade => {
        el.innerHTML += `
            <option value="${cidade.id}">
                ${escaparHTML(cidade.nome)}
            </option>
        `;
    });
}


async function popularCidadesComTodas(selectId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    const { data, error } = await supabaseClient
        .from("cidades")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    el.innerHTML = `<option value="">Todas as Cidades</option>`;

    data.forEach(cidade => {
        el.innerHTML += `
            <option value="${cidade.id}">
                ${escaparHTML(cidade.nome)}
            </option>
        `;
    });
}


async function popularBairros(selectId, cidadeId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    el.innerHTML = `<option value="">Selecione Bairro</option>`;

    if (!cidadeId) return;

    const { data, error } = await supabaseClient
        .from("bairros")
        .select("*")
        .eq("cidade_id", cidadeId)
        .order("nome");

    if (error) {
        console.error("Erro ao carregar bairros:", error);
        return;
    }

    data.forEach(bairro => {
        el.innerHTML += `
            <option value="${bairro.id}">
                ${escaparHTML(bairro.nome)}
            </option>
        `;
    });
}


async function popularEspecialidades(selectId) {
    const el = document.getElementById(selectId);

    if (!el) return;

    const { data, error } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    el.innerHTML = `<option value="">Selecione Especialidade</option>`;

    data.forEach(especialidade => {
        el.innerHTML += `
            <option value="${especialidade.id}">
                ${escaparHTML(especialidade.nome)}
            </option>
        `;
    });
}


// ======================================
// CASCATA DE LOCALIZAÇÃO
// REGIÃO > ESTADO > CIDADE > BAIRRO
// ======================================

function ligarCascataLocalizacao(
    idRegiao,
    idEstado,
    idCidade,
    idBairro
) {
    const regiaoEl = document.getElementById(idRegiao);
    const estadoEl = document.getElementById(idEstado);
    const cidadeEl = document.getElementById(idCidade);
    const bairroEl = document.getElementById(idBairro);

    if (regiaoEl) {
        regiaoEl.addEventListener("change", async function () {

            await popularEstados(idEstado, this.value);

            if (cidadeEl) {
                cidadeEl.innerHTML =
                    `<option value="">Selecione Cidade</option>`;
            }

            if (bairroEl) {
                bairroEl.innerHTML =
                    `<option value="">Selecione Bairro</option>`;
            }

        });
    }

    if (estadoEl) {
        estadoEl.addEventListener("change", async function () {

            await popularCidades(idCidade, this.value);

            if (bairroEl) {
                bairroEl.innerHTML =
                    `<option value="">Selecione Bairro</option>`;
            }

        });
    }

    if (cidadeEl) {
        cidadeEl.addEventListener("change", async function () {
            await popularBairros(idBairro, this.value);
        });
    }
}


// ======================================
// NAVEGAÇÃO
// ======================================

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


const CARREGADORES_PAGINA = {
    dashboard: () => carregarDashboard(),
    clinicas: () => carregarPaginaClinicas(),
    especialidades: () => carregarPaginaEspecialidades(),
    regioes: () => carregarPaginaRegioes(),
    estados: () => carregarPaginaEstados(),
    cidades: () => carregarPaginaCidades(),
    bairros: () => carregarPaginaBairros()
};


function mostrarPagina(nomePagina) {

    document.querySelectorAll(".page").forEach(pagina => {
        pagina.classList.add("hidden");
    });

    const pagina = document.getElementById(nomePagina);

    if (pagina) {
        pagina.classList.remove("hidden");
    }

    const titulo = document.getElementById("tituloPagina");

    if (titulo && TITULOS_PAGINA[nomePagina]) {
        titulo.textContent = TITULOS_PAGINA[nomePagina];
    }

    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.page === nomePagina
        );
    });

    if (CARREGADORES_PAGINA[nomePagina]) {
        CARREGADORES_PAGINA[nomePagina]();
    }
}


// ======================================
// REGIÕES
// ======================================

async function carregarPaginaRegioes() {
    await listarRegioes();
}


async function addRegiao() {

    const input = document.getElementById("nova_regiao");
    const nome = input.value.trim();

    if (!nome) {
        alert("Digite o nome da região.");
        return;
    }

    const { data: existente, error: erroBusca } = await supabaseClient
        .from("regioes")
        .select("id")
        .ilike("nome", nome);

    if (erroBusca) {
        console.error(erroBusca);
        return;
    }

    if (existente && existente.length > 0) {
        alert("Esta região já existe!");
        return;
    }

    const { error } = await supabaseClient
        .from("regioes")
        .insert([{ nome }]);

    if (error) {
        console.error(error);
        alert("Erro ao salvar região: " + error.message);
        return;
    }

    alert("Região salva com sucesso!");

    input.value = "";

    await listarRegioes();
}


async function listarRegioes() {

    const container = document.getElementById("listaRegioes");

    if (!container) return;

    container.innerHTML = "<p>Carregando...</p>";

    const { data, error } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar regiões.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Nenhuma região cadastrada.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(regiao => {

        container.innerHTML += `
            <div class="box" style="display:flex;justify-content:space-between;align-items:center;">
                
                <h3>${escaparHTML(regiao.nome)}</h3>

                <button
                    class="red"
                    style="width:auto;margin:0;"
                    onclick="excluirRegiao(${regiao.id})"
                >
                    Excluir
                </button>

            </div>
        `;

    });

}


async function excluirRegiao(id) {

    const confirmar = confirm(
        "Atenção: excluir esta região poderá afetar estados, cidades, bairros e clínicas vinculados. Deseja continuar?"
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("regioes")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }

    await listarRegioes();
}


// ======================================
// ESTADOS
// ======================================

async function carregarPaginaEstados() {

    await popularRegioes("estado_regiao");
    await popularRegioesComTodas("filtro_estado_regiao");

    await listarEstados();

}


async function addEstado() {

    const nome = document
        .getElementById("novo_estado")
        .value
        .trim();

    const regiao_id = document
        .getElementById("estado_regiao")
        .value;

    if (!nome || !regiao_id) {
        alert("Preencha o nome e selecione a região.");
        return;
    }

    const { data: existente } = await supabaseClient
        .from("estados")
        .select("id")
        .ilike("nome", nome)
        .eq("regiao_id", regiao_id);

    if (existente && existente.length > 0) {
        alert("Este estado já existe nesta região!");
        return;
    }

    const { error } = await supabaseClient
        .from("estados")
        .insert([{
            nome,
            regiao_id
        }]);

    if (error) {
        console.error(error);
        alert("Erro ao salvar estado: " + error.message);
        return;
    }

    alert("Estado salvo com sucesso!");

    document.getElementById("novo_estado").value = "";

    await listarEstados();

}


async function listarEstados(regiaoId = "") {

    const container = document.getElementById("listaEstados");

    if (!container) return;

    container.innerHTML = "<p>Carregando...</p>";

    let consulta = supabaseClient
        .from("estados")
        .select(`
            id,
            nome,
            regioes(nome)
        `)
        .order("nome");

    if (regiaoId) {
        consulta = consulta.eq("regiao_id", regiaoId);
    }

    const { data, error } = await consulta;

    if (error) {
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar estados.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Nenhum estado cadastrado.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(estado => {

        container.innerHTML += `
            <div class="box" style="display:flex;justify-content:space-between;align-items:center;">

                <div>
                    <h3>${escaparHTML(estado.nome)}</h3>
                    <small>
                        Região: ${escaparHTML(estado.regioes?.nome || "-")}
                    </small>
                </div>

                <button
                    class="red"
                    style="width:auto;margin:0;"
                    onclick="excluirEstado(${estado.id})"
                >
                    Excluir
                </button>

            </div>
        `;

    });

}


async function excluirEstado(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este estado?"
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("estados")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }

    await listarEstados();
}


// ======================================
// CIDADES
// ======================================

async function carregarPaginaCidades() {

    await popularEstadosSemRegiao("cidade_estado");
    await popularEstadosComTodas("filtro_cidade_estado");

    await listarCidades();

}


async function addCidade() {

    const nome = document
        .getElementById("nova_cidade")
        .value
        .trim();

    const estado_id = document
        .getElementById("cidade_estado")
        .value;

    if (!nome || !estado_id) {
        alert("Preencha o nome e selecione o estado.");
        return;
    }

    const { data: existente } = await supabaseClient
        .from("cidades")
        .select("id")
        .ilike("nome", nome)
        .eq("estado_id", estado_id);

    if (existente && existente.length > 0) {
        alert("Esta cidade já existe neste estado!");
        return;
    }

    const { error } = await supabaseClient
        .from("cidades")
        .insert([{
            nome,
            estado_id
        }]);

    if (error) {
        console.error(error);
        alert("Erro ao salvar cidade: " + error.message);
        return;
    }

    alert("Cidade salva com sucesso!");

    document.getElementById("nova_cidade").value = "";

    await listarCidades();

}


async function listarCidades(estadoId = "") {

    const container = document.getElementById("listaCidades");

    if (!container) return;

    container.innerHTML = "<p>Carregando...</p>";

    let consulta = supabaseClient
        .from("cidades")
        .select(`
            id,
            nome,
            estados(nome)
        `)
        .order("nome");

    if (estadoId) {
        consulta = consulta.eq("estado_id", estadoId);
    }

    const { data, error } = await consulta;

    if (error) {
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar cidades.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Nenhuma cidade cadastrada.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(cidade => {

        container.innerHTML += `
            <div class="box" style="display:flex;justify-content:space-between;align-items:center;">

                <div>
                    <h3>${escaparHTML(cidade.nome)}</h3>
                    <small>
                        Estado: ${escaparHTML(cidade.estados?.nome || "-")}
                    </small>
                </div>

                <button
                    class="red"
                    style="width:auto;margin:0;"
                    onclick="excluirCidade(${cidade.id})"
                >
                    Excluir
                </button>

            </div>
        `;

    });

}


async function excluirCidade(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir esta cidade?"
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("cidades")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }

    await listarCidades();
}


// ======================================
// BAIRROS
// ======================================

async function carregarPaginaBairros() {

    await popularCidadesSemEstado("bairro_cidade");
    await popularCidadesComTodas("filtro_bairro_cidade");

    await listarBairros();

}


async function addBairro() {

    const nome = document
        .getElementById("novo_bairro")
        .value
        .trim();

    const cidade_id = document
        .getElementById("bairro_cidade")
        .value;

    if (!nome || !cidade_id) {
        alert("Preencha o nome e selecione a cidade.");
        return;
    }

    const { data: existente } = await supabaseClient
        .from("bairros")
        .select("id")
        .ilike("nome", nome)
        .eq("cidade_id", cidade_id);

    if (existente && existente.length > 0) {
        alert("Este bairro já existe nesta cidade!");
        return;
    }

    const { error } = await supabaseClient
        .from("bairros")
        .insert([{
            nome,
            cidade_id
        }]);

    if (error) {
        console.error(error);
        alert("Erro ao salvar bairro: " + error.message);
        return;
    }

    alert("Bairro salvo com sucesso!");

    document.getElementById("novo_bairro").value = "";

    await listarBairros();

}


async function listarBairros(cidadeId = "") {

    const container = document.getElementById("listaBairros");

    if (!container) return;

    container.innerHTML = "<p>Carregando...</p>";

    let consulta = supabaseClient
        .from("bairros")
        .select(`
            id,
            nome,
            cidades(nome)
        `)
        .order("nome");

    if (cidadeId) {
        consulta = consulta.eq("cidade_id", cidadeId);
    }

    const { data, error } = await consulta;

    if (error) {
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar bairros.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Nenhum bairro cadastrado.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(bairro => {

        container.innerHTML += `
            <div class="box" style="display:flex;justify-content:space-between;align-items:center;">

                <div>
                    <h3>${escaparHTML(bairro.nome)}</h3>
                    <small>
                        Cidade: ${escaparHTML(bairro.cidades?.nome || "-")}
                    </small>
                </div>

                <button
                    class="red"
                    style="width:auto;margin:0;"
                    onclick="excluirBairro(${bairro.id})"
                >
                    Excluir
                </button>

            </div>
        `;

    });

}


async function excluirBairro(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este bairro?"
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("bairros")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }

    await listarBairros();
}


// ======================================
// ESPECIALIDADES
// ======================================

async function carregarPaginaEspecialidades() {
    await listarEspecialidades();
}


async function addNovaEspecialidade() {

    const input = document.getElementById("nova_especialidade");

    const nome = input.value.trim();

    const rede = document
        .getElementById("especialidade_rede")
        .value;

    if (!nome) {
        alert("Digite o nome da especialidade.");
        return;
    }

    const { data: existente } = await supabaseClient
        .from("especialidades")
        .select("id")
        .ilike("nome", nome)
        .eq("rede", rede);

    if (existente && existente.length > 0) {
        alert("Esta especialidade já está cadastrada nesta rede!");
        return;
    }

    const { error } = await supabaseClient
        .from("especialidades")
        .insert([{
            nome,
            rede
        }]);

    if (error) {
        console.error(error);
        alert("Erro ao salvar especialidade: " + error.message);
        return;
    }

    alert("Especialidade cadastrada com sucesso!");

    input.value = "";

    document.getElementById("especialidade_rede").value =
        "especialistas";

    await listarEspecialidades();

}


async function listarEspecialidades() {

    const container =
        document.getElementById("listaEspecialidades");

    if (!container) return;

    container.innerHTML = "<p>Carregando...</p>";

    const { data, error } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        container.innerHTML =
            "<p>Erro ao carregar especialidades.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>Nenhuma especialidade cadastrada.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(especialidade => {

        const nomeRede =
            especialidade.rede === "sindilegis"
                ? "Rede Sindilegis"
                : "Rede Especialistas";

        container.innerHTML += `
            <div class="box" style="display:flex;justify-content:space-between;align-items:center;">

                <div>
                    <h3>${escaparHTML(especialidade.nome)}</h3>
                    <small>${nomeRede}</small>
                </div>

                <button
                    class="red"
                    style="width:auto;margin:0;"
                    onclick="excluirEspecialidade(${especialidade.id})"
                >
                    Excluir
                </button>

            </div>
        `;

    });

}


async function excluirEspecialidade(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir esta especialidade?"
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("especialidades")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }

    await listarEspecialidades();
}


// ======================================
// CLÍNICAS
// ======================================

let clinicaEmEdicaoId = null;


async function carregarPaginaClinicas() {

    await popularRegioes("clinica_regiao");
    await popularEspecialidades("clinica_especialidade");

    await listarClinicas();

}


// ======================================
// ADICIONAR CLÍNICA
// ======================================

async function addClinica() {

    const nome = document
        .getElementById("clinica_nome")
        .value
        .trim();

    const endereco = document
        .getElementById("clinica_endereco")
        .value
        .trim();

    const telefone = document
        .getElementById("clinica_telefone")
        .value
        .trim();

    const bairro_id = document
        .getElementById("clinica_bairro")
        .value;

    const especialidade_id = document
        .getElementById("clinica_especialidade")
        .value;

    const rede = document
        .getElementById("clinica_rede")
        .value;

    if (
        !nome ||
        !endereco ||
        !bairro_id ||
        !especialidade_id ||
        !rede
    ) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const { data: existente } = await supabaseClient
        .from("clinicas")
        .select("id")
        .ilike("nome", nome)
        .eq("bairro_id", bairro_id);

    if (existente && existente.length > 0) {
        alert("Já existe uma clínica com este nome neste bairro!");
        return;
    }

    const { data: novaClinica, error } =
        await supabaseClient
            .from("clinicas")
            .insert([{
                nome,
                endereco,
                telefone,
                bairro_id,
                ativo: true
            }])
            .select();

    if (error || !novaClinica || !novaClinica.length) {
        console.error(error);
        alert("Erro ao cadastrar clínica.");
        return;
    }

    const { error: erroVinculo } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert([{
                clinica_id: novaClinica[0].id,
                especialidade_id,
                rede,
                ativo: true
            }]);

    if (erroVinculo) {

        console.error(erroVinculo);

        alert(
            "Clínica criada, mas houve erro ao vincular a especialidade."
        );

        return;
    }

    alert("Clínica cadastrada com sucesso!");

    limparFormularioClinica();

    await listarClinicas();
}


// ======================================
// LIMPAR FORMULÁRIO CLÍNICA
// ======================================

function limparFormularioClinica() {

    document.getElementById("clinica_nome").value = "";

    document.getElementById("clinica_endereco").value = "";

    document.getElementById("clinica_telefone").value = "";

    document.getElementById("clinica_regiao").value = "";

    document.getElementById("clinica_estado").innerHTML =
        `<option value="">Selecione Estado</option>`;

    document.getElementById("clinica_cidade").innerHTML =
        `<option value="">Selecione Cidade</option>`;

    document.getElementById("clinica_bairro").innerHTML =
        `<option value="">Selecione Bairro</option>`;

    document.getElementById("clinica_especialidade").value = "";

    document.getElementById("clinica_rede").value =
        "especialistas";

}


// ======================================
// LISTAR CLÍNICAS
// ======================================

async function listarClinicas(filtroNome = "") {

    const container =
        document.getElementById("listaClinicas");

    if (!container) return;

    container.innerHTML = "<p>Carregando...</p>";

    let consulta = supabaseClient
        .from("clinicas")
        .select(`
            id,
            nome,
            endereco,
            telefone,
            ativo,
            bairros(
                nome,
                cidades(
                    nome,
                    estados(
                        nome
                    )
                )
            )
        `)
        .order("nome");

    if (filtroNome) {
        consulta = consulta.ilike(
            "nome",
            `%${filtroNome}%`
        );
    }

    const { data, error } = await consulta;

    if (error) {
        console.error(error);
        container.innerHTML =
            "<p>Erro ao carregar clínicas.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>Nenhuma clínica encontrada.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(clinica => {

        const bairro =
            clinica.bairros?.nome || "-";

        const cidade =
            clinica.bairros?.cidades?.nome || "-";

        const estado =
            clinica.bairros?.cidades?.estados?.nome || "-";

        const status =
            clinica.ativo
                ? `<span class="status ativo">Ativa</span>`
                : `<span class="status inativo">Inativa</span>`;

        container.innerHTML += `
            <div class="box" style="display:flex;justify-content:space-between;align-items:center;gap:20px;">

                <div>
                    <h3>
                        ${escaparHTML(clinica.nome)}
                    </h3>

                    <small>
                        ${escaparHTML(bairro)} —
                        ${escaparHTML(cidade)}/${escaparHTML(estado)}
                    </small>

                    <div style="margin-top:8px;">
                        ${status}
                    </div>
                </div>

                <button
                    class="blue"
                    style="width:auto;margin:0;"
                    onclick="abrirEditarClinica(${clinica.id})"
                >
                    Editar
                </button>

            </div>
        `;

    });

}


// ======================================
// ABRIR EDIÇÃO DA CLÍNICA
// ======================================

async function abrirEditarClinica(id) {

    clinicaEmEdicaoId = id;

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

                bairros(
                    cidade_id,

                    cidades(
                        estado_id,

                        estados(
                            regiao_id
                        )
                    )
                )
            `)
            .eq("id", id)
            .single();

    if (error || !clinica) {
        console.error(error);
        alert("Erro ao carregar dados da clínica.");
        return;
    }

    document.getElementById("edit_clinica_id").value =
        clinica.id;

    document.getElementById("edit_clinica_nome").value =
        clinica.nome || "";

    document.getElementById("edit_clinica_endereco").value =
        clinica.endereco || "";

    document.getElementById("edit_clinica_telefone").value =
        clinica.telefone || "";

    document.getElementById("edit_clinica_ativo").checked =
        clinica.ativo;


    const regiaoId =
        clinica.bairros?.cidades?.estados?.regiao_id;

    const estadoId =
        clinica.bairros?.cidades?.estado_id;

    const cidadeId =
        clinica.bairros?.cidade_id;


    await popularRegioes("edit_clinica_regiao");

    document.getElementById(
        "edit_clinica_regiao"
    ).value = regiaoId || "";


    await popularEstados(
        "edit_clinica_estado",
        regiaoId
    );

    document.getElementById(
        "edit_clinica_estado"
    ).value = estadoId || "";


    await popularCidades(
        "edit_clinica_cidade",
        estadoId
    );

    document.getElementById(
        "edit_clinica_cidade"
    ).value = cidadeId || "";


    await popularBairros(
        "edit_clinica_bairro",
        cidadeId
    );

    document.getElementById(
        "edit_clinica_bairro"
    ).value = clinica.bairro_id || "";


    await popularEspecialidades(
        "edit_especialidade"
    );

    await carregarEspecialidadesRedeDaClinica(id);

    mostrarPagina("editarClinica");
}


// ======================================
// ATUALIZAR CLÍNICA
// ======================================

async function atualizarClinica() {

    const id =
        document.getElementById("edit_clinica_id").value;

    if (!id) {
        alert("Nenhuma clínica selecionada.");
        return;
    }

    const dados = {

        nome:
            document
                .getElementById("edit_clinica_nome")
                .value
                .trim(),

        endereco:
            document
                .getElementById("edit_clinica_endereco")
                .value
                .trim(),

        telefone:
            document
                .getElementById("edit_clinica_telefone")
                .value
                .trim(),

        bairro_id:
            document
                .getElementById("edit_clinica_bairro")
                .value,

        ativo:
            document
                .getElementById("edit_clinica_ativo")
                .checked

    };


    if (
        !dados.nome ||
        !dados.endereco ||
        !dados.bairro_id
    ) {
        alert("Preencha nome, endereço e bairro.");
        return;
    }


    const { error } =
        await supabaseClient
            .from("clinicas")
            .update(dados)
            .eq("id", id);


    if (error) {
        console.error(error);
        alert("Erro ao atualizar: " + error.message);
        return;
    }


    alert("Dados atualizados com sucesso!");

    await listarClinicas();

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica() {

    const id =
        document.getElementById("edit_clinica_id").value;

    if (!id) {
        alert("Nenhuma clínica selecionada.");
        return;
    }

    const confirmar = confirm(
        "Tem certeza que deseja excluir esta clínica? Esta ação não pode ser desfeita."
    );

    if (!confirmar) return;


    const { error: erroVinculos } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq("clinica_id", id);


    if (erroVinculos) {
        console.error(erroVinculos);

        alert(
            "Erro ao remover vínculos da clínica: " +
            erroVinculos.message
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq("id", id);


    if (error) {
        console.error(error);
        alert("Erro ao excluir clínica: " + error.message);
        return;
    }


    alert("Clínica excluída com sucesso!");

    clinicaEmEdicaoId = null;

    mostrarPagina("clinicas");

}


// ======================================
// ESPECIALIDADES DA CLÍNICA
// ======================================

async function carregarEspecialidadesRedeDaClinica(clinicaId) {

    const container =
        document.getElementById("listaEspRede");

    if (!container) return;

    container.innerHTML = "<p>Carregando...</p>";


    const { data, error } =
        await supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
                ativo,
                rede,
                especialidades(nome)
            `)
            .eq("clinica_id", clinicaId);


    if (error) {
        console.error(error);

        container.innerHTML =
            "<p>Erro ao carregar vínculos.</p>";

        return;
    }


    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>Nenhuma especialidade vinculada ainda.</p>";

        return;
    }


    container.innerHTML = "";


    data.forEach(item => {

        const nomeRede =
            item.rede === "sindilegis"
                ? "Rede Sindilegis"
                : "Rede Especialistas";


        const status =
            item.ativo
                ? `<span class="status ativo">Ativa</span>`
                : `<span class="status inativo">Inativa</span>`;


        container.innerHTML += `
            <div class="box" style="display:flex;justify-content:space-between;align-items:center;gap:20px;">

                <div>
                    <h3>
                        ${escaparHTML(
                            item.especialidades?.nome || "-"
                        )}
                    </h3>

                    <small>${nomeRede}</small>

                    <div style="margin-top:8px;">
                        ${status}
                    </div>
                </div>

                <button
                    class="${item.ativo ? "red" : "green"}"
                    style="width:auto;margin:0;"
                    onclick="toggleEspecialidadeRede(${item.id}, ${item.ativo})"
                >
                    ${item.ativo ? "Desativar" : "Ativar"}
                </button>

            </div>
        `;

    });

}


// ======================================
// ADICIONAR ESPECIALIDADE À CLÍNICA
// ======================================

async function adicionarEspecialidadeRede() {

    if (!clinicaEmEdicaoId) {
        alert("Nenhuma clínica selecionada.");
        return;
    }

    const especialidade_id =
        document.getElementById("edit_especialidade").value;

    const rede =
        document.getElementById("edit_rede").value;


    if (!especialidade_id || !rede) {
        alert("Selecione a especialidade e a rede.");
        return;
    }


    const { data: existente } =
        await supabaseClient
            .from("clinica_especialidades")
            .select("id")
            .eq("clinica_id", clinicaEmEdicaoId)
            .eq("especialidade_id", especialidade_id)
            .eq("rede", rede);


    if (existente && existente.length > 0) {
        alert(
            "Esta especialidade já está vinculada a esta rede nesta clínica!"
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert([{
                clinica_id: clinicaEmEdicaoId,
                especialidade_id,
                rede,
                ativo: true
            }]);


    if (error) {
        console.error(error);
        alert("Erro ao vincular: " + error.message);
        return;
    }


    document.getElementById("edit_especialidade").value = "";

    await carregarEspecialidadesRedeDaClinica(
        clinicaEmEdicaoId
    );

}


// ======================================
// ATIVAR / DESATIVAR ESPECIALIDADE
// ======================================

async function toggleEspecialidadeRede(id, statusAtual) {

    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .update({
                ativo: !statusAtual
            })
            .eq("id", id);


    if (error) {
        console.error(error);
        alert("Erro ao atualizar: " + error.message);
        return;
    }


    await carregarEspecialidadesRedeDaClinica(
        clinicaEmEdicaoId
    );

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    await Promise.all([
        carregarTotalClinicas(),
        carregarTotalEspecialidades(),
        carregarTotalRegioes(),
        carregarTotalEstados(),
        carregarTotalCidades(),
        carregarTotalBairros()
    ]);

}


async function carregarTotalClinicas() {

    const { count, error } =
        await supabaseClient
            .from("clinicas")
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {
        console.error(error);
        return;
    }

    const el = document.getElementById("totalClinicas");

    if (el) el.textContent = count || 0;

}


async function carregarTotalEspecialidades() {

    const { count, error } =
        await supabaseClient
            .from("especialidades")
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {
        console.error(error);
        return;
    }

    const el =
        document.getElementById("totalEspecialidades");

    if (el) el.textContent = count || 0;

}


async function carregarTotalRegioes() {

    const { count, error } =
        await supabaseClient
            .from("regioes")
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {
        console.error(error);
        return;
    }

    const el =
        document.getElementById("totalRegioes");

    if (el) el.textContent = count || 0;

}


async function carregarTotalEstados() {

    const { count, error } =
        await supabaseClient
            .from("estados")
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {
        console.error(error);
        return;
    }

    const el =
        document.getElementById("totalEstados");

    if (el) el.textContent = count || 0;

}


async function carregarTotalCidades() {

    const { count, error } =
        await supabaseClient
            .from("cidades")
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {
        console.error(error);
        return;
    }

    const el =
        document.getElementById("totalCidades");

    if (el) el.textContent = count || 0;

}


async function carregarTotalBairros() {

    const { count, error } =
        await supabaseClient
            .from("bairros")
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {
        console.error(error);
        return;
    }

    const el =
        document.getElementById("totalBairros");

    if (el) el.textContent = count || 0;

}


// ======================================
// EVENTOS
// ======================================

document.addEventListener("DOMContentLoaded", async () => {


    // ==============================
    // MENU
    // ==============================

    document.querySelectorAll(".menu-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            mostrarPagina(btn.dataset.page);

        });

    });


    // ==============================
    // REGIÕES
    // ==============================

    const btnSalvarRegiao =
        document.getElementById("btnSalvarRegiao");

    if (btnSalvarRegiao) {
        btnSalvarRegiao.addEventListener(
            "click",
            addRegiao
        );
    }


    // ==============================
    // ESTADOS
    // ==============================

    const btnSalvarEstado =
        document.getElementById("btnSalvarEstado");

    if (btnSalvarEstado) {
        btnSalvarEstado.addEventListener(
            "click",
            addEstado
        );
    }

    const filtroEstado =
        document.getElementById("filtro_estado_regiao");

    if (filtroEstado) {
        filtroEstado.addEventListener(
            "change",
            () => listarEstados(filtroEstado.value)
        );
    }


    // ==============================
    // CIDADES
    // ==============================

    const btnSalvarCidade =
        document.getElementById("btnSalvarCidade");

    if (btnSalvarCidade) {
        btnSalvarCidade.addEventListener(
            "click",
            addCidade
        );
    }

    const filtroCidade =
        document.getElementById("filtro_cidade_estado");

    if (filtroCidade) {
        filtroCidade.addEventListener(
            "change",
            () => listarCidades(filtroCidade.value)
        );
    }


    // ==============================
    // BAIRROS
    // ==============================

    const btnSalvarBairro =
        document.getElementById("btnSalvarBairro");

    if (btnSalvarBairro) {
        btnSalvarBairro.addEventListener(
            "click",
            addBairro
        );
    }

    const filtroBairro =
        document.getElementById("filtro_bairro_cidade");

    if (filtroBairro) {
        filtroBairro.addEventListener(
            "change",
            () => listarBairros(filtroBairro.value)
        );
    }


    // ==============================
    // ESPECIALIDADES
    // ==============================

    const btnSalvarEspecialidade =
        document.getElementById("btnSalvarEspecialidade");

    if (btnSalvarEspecialidade) {
        btnSalvarEspecialidade.addEventListener(
            "click",
            addNovaEspecialidade
        );
    }


    // ==============================
    // CLÍNICAS
    // ==============================

    ligarCascataLocalizacao(
        "clinica_regiao",
        "clinica_estado",
        "clinica_cidade",
        "clinica_bairro"
    );

    ligarCascataLocalizacao(
        "edit_clinica_regiao",
        "edit_clinica_estado",
        "edit_clinica_cidade",
        "edit_clinica_bairro"
    );


    const btnSalvarClinica =
        document.getElementById("btnSalvarClinica");

    if (btnSalvarClinica) {
        btnSalvarClinica.addEventListener(
            "click",
            addClinica
        );
    }


    const filtroClinica =
        document.getElementById("filtro_clinica_nome");

    if (filtroClinica) {

        filtroClinica.addEventListener(
            "input",
            () => listarClinicas(filtroClinica.value)
        );

    }


    const btnAtualizarClinica =
        document.getElementById("btnAtualizarClinica");

    if (btnAtualizarClinica) {
        btnAtualizarClinica.addEventListener(
            "click",
            atualizarClinica
        );
    }


    const btnExcluirClinica =
        document.getElementById("btnExcluirClinica");

    if (btnExcluirClinica) {
        btnExcluirClinica.addEventListener(
            "click",
            excluirClinica
        );
    }


    const btnVoltarClinicas =
        document.getElementById("btnVoltarClinicas");

    if (btnVoltarClinicas) {

        btnVoltarClinicas.addEventListener(
            "click",
            () => mostrarPagina("clinicas")
        );

    }


    const btnAdicionarEspRede =
        document.getElementById("btnAdicionarEspRede");

    if (btnAdicionarEspRede) {

        btnAdicionarEspRede.addEventListener(
            "click",
            adicionarEspecialidadeRede
        );

    }


    // ==============================
    // VOLTAR PARA O SITE
    // ==============================

    const btnVoltarSite =
        document.getElementById("btnVoltarSite");

    if (btnVoltarSite) {

        btnVoltarSite.addEventListener(
            "click",
            () => {
                window.location.href = "index.html";
            }
        );

    }


    // ==============================
    // DASHBOARD INICIAL
    // ==============================

    await carregarDashboard();

});
```
