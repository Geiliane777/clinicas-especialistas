// ======================================
// FUNÇÕES COMPARTILHADAS - DROPDOWNS
// Usadas em várias telas do admin
// ======================================
async function popularRegioes(selectId){
    const { data, error } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");
    const el = document.getElementById(selectId);
    if(!el) return;
    if(error){
        console.error(error);
        return;
    }
    el.innerHTML = `<option value="">Selecione Região</option>`;
    data.forEach(r => {
        el.innerHTML += `<option value="${r.id}">${r.nome}</option>`;
    });
}
async function popularEstados(selectId, regiaoId){
    const el = document.getElementById(selectId);
    if(!el) return;
    el.innerHTML = `<option value="">Selecione Estado</option>`;
    if(!regiaoId) return;
    const { data, error } = await supabaseClient
        .from("estados")
        .select("*")
        .eq("regiao_id", regiaoId)
        .order("nome");
    if(error){
        console.error(error);
        return;
    }
    data.forEach(e => {
        el.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
    });
}
async function popularCidades(selectId, estadoId){
    const el = document.getElementById(selectId);
    if(!el) return;
    el.innerHTML = `<option value="">Selecione Cidade</option>`;
    if(!estadoId) return;
    const { data, error } = await supabaseClient
        .from("cidades")
        .select("*")
        .eq("estado_id", estadoId)
        .order("nome");
    if(error){
        console.error(error);
        return;
    }
    data.forEach(c => {
        el.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
    });
}
async function popularBairros(selectId, cidadeId){
    const el = document.getElementById(selectId);
    if(!el) return;
    el.innerHTML = `<option value="">Selecione Bairro</option>`;
    if(!cidadeId) return;
    const { data, error } = await supabaseClient
        .from("bairros")
        .select("*")
        .eq("cidade_id", cidadeId)
        .order("nome");
    if(error){
        console.error(error);
        return;
    }
    data.forEach(b => {
        el.innerHTML += `<option value="${b.id}">${b.nome}</option>`;
    });
}
async function popularEspecialidades(selectId){
    const el = document.getElementById(selectId);
    if(!el) return;
    const { data, error } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");
    if(error){
        console.error(error);
        return;
    }
    el.innerHTML = `<option value="">Selecione Especialidade</option>`;
    data.forEach(e => {
        el.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
    });
}
// ======================================
// LIGAR CASCATA REGIÃO > ESTADO > CIDADE > BAIRRO
// Usado tanto no form de Adicionar Clínica quanto no de Editar
// ======================================
function ligarCascataLocalizacao(idRegiao, idEstado, idCidade, idBairro){
    const regiaoEl = document.getElementById(idRegiao);
    const estadoEl = document.getElementById(idEstado);
    const cidadeEl = document.getElementById(idCidade);
    if(regiaoEl){
        regiaoEl.addEventListener("change", function(){
            popularEstados(idEstado, this.value);
            document.getElementById(idCidade).innerHTML = `<option value="">Selecione Cidade</option>`;
            document.getElementById(idBairro).innerHTML = `<option value="">Selecione Bairro</option>`;
        });
    }
    if(estadoEl){
        estadoEl.addEventListener("change", function(){
            popularCidades(idCidade, this.value);
            document.getElementById(idBairro).innerHTML = `<option value="">Selecione Bairro</option>`;
        });
    }
    if(cidadeEl){
        cidadeEl.addEventListener("change", function(){
            popularBairros(idBairro, this.value);
        });
    }
}
// ======================================
// NAVEGAÇÃO ENTRE PÁGINAS DO PAINEL
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
// Funções de carregamento de cada página (definidas nos outros arquivos js)
// A navegação chama a função automaticamente ao trocar de página, se ela existir
const CARREGADORES_PAGINA = {
    dashboard: () => typeof carregarDashboard === "function" && carregarDashboard(),
    clinicas: () => typeof carregarPaginaClinicas === "function" && carregarPaginaClinicas(),
    especialidades: () => typeof carregarPaginaEspecialidades === "function" && carregarPaginaEspecialidades(),
    regioes: () => typeof carregarPaginaRegioes === "function" && carregarPaginaRegioes(),
    estados: () => typeof carregarPaginaEstados === "function" && carregarPaginaEstados(),
    cidades: () => typeof carregarPaginaCidades === "function" && carregarPaginaCidades(),
    bairros: () => typeof carregarPaginaBairros === "function" && carregarPaginaBairros()
};
function mostrarPagina(nomePagina){
    // Esconde todas as seções .page
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    // Mostra a página pedida
    const pagina = document.getElementById(nomePagina);
    if(pagina) pagina.classList.remove("hidden");
    // Atualiza título do topo
    const titulo = document.getElementById("tituloPagina");
    if(titulo && TITULOS_PAGINA[nomePagina]){
        titulo.textContent = TITULOS_PAGINA[nomePagina];
    }
    // Atualiza botão ativo no menu (só existe botão pra páginas principais, não pra editarClinica)
    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.page === nomePagina);
    });
    // Chama o carregador de dados daquela página, se existir
    if(CARREGADORES_PAGINA[nomePagina]){
        CARREGADORES_PAGINA[nomePagina]();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            mostrarPagina(btn.dataset.page);
        });
    });
});
// ======================================
// REGIÕES - ADICIONAR / LISTAR / EXCLUIR
// ======================================
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnSalvarRegiao");
    if(btn) btn.addEventListener("click", addRegiao);
});
async function carregarPaginaRegioes(){
    await listarRegioes();
}
async function addRegiao(){
    const input = document.getElementById("nova_regiao");
    const nome = input.value.trim();
    if(!nome){
        alert("Digite o nome da região.");
        return;
    }
    const { data: existente } = await supabaseClient
        .from("regioes")
        .select("id")
        .ilike("nome", nome);
    if(existente && existente.length > 0){
        alert("Esta região já existe!");
        return;
    }
    const { error } = await supabaseClient.from("regioes").insert([{ nome }]);
    if(error){
        console.error(error);
        alert("Erro ao salvar região: " + error.message);
        return;
    }
    alert("Região salva com sucesso!");
    input.value = "";
    listarRegioes();
}
async function listarRegioes(){
    const container = document.getElementById("listaRegioes");
    if(!container) return;
    container.innerHTML = "<p>Carregando...</p>";
    const { data, error } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");
    if(error){
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar regiões.</p>";
        return;
    }
    if(!data || data.length === 0){
        container.innerHTML = "<p>Nenhuma região cadastrada.</p>";
        return;
    }
    container.innerHTML = "";
    data.forEach(r => {
        container.innerHTML += `
            <div class="box" style="display:flex; justify-content:space-between; align-items:center;">
                <h3>${r.nome}</h3>
                <button class="red" style="width:auto; margin:0;" onclick="excluirRegiao(${r.id})">Excluir</button>
            </div>
        `;
    });
}
async function excluirRegiao(id){
    const confirmar = confirm(
        "Atenção: excluir esta região também apaga TODOS os estados, cidades, bairros e clínicas vinculados a ela. Deseja continuar?"
    );
    if(!confirmar) return;
    const { error } = await supabaseClient.from("regioes").delete().eq("id", id);
    if(error){
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }
    listarRegioes();
}
// ======================================
// ESTADOS - ADICIONAR / LISTAR / FILTRAR / EXCLUIR
// ======================================
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnSalvarEstado");
    if(btn) btn.addEventListener("click", addEstado);
    const filtro = document.getElementById("filtro_estado_regiao");
    if(filtro) filtro.addEventListener("change", () => listarEstados(filtro.value));
});
async function carregarPaginaEstados(){
    await popularRegioes("estado_regiao");
    await popularRegioesComTodas("filtro_estado_regiao");
    await listarEstados();
}
// Variante do popularRegioes que inclui opção "Todas"
async function popularRegioesComTodas(selectId){
    const { data, error } = await supabaseClient.from("regioes").select("*").order("nome");
    const el = document.getElementById(selectId);
    if(!el || error) return;
    el.innerHTML = `<option value="">Todas as Regiões</option>`;
    data.forEach(r => {
        el.innerHTML += `<option value="${r.id}">${r.nome}</option>`;
    });
}
async function addEstado(){
    const nome = document.getElementById("novo_estado").value.trim();
    const regiao_id = document.getElementById("estado_regiao").value;
    if(!nome || !regiao_id){
        alert("Preencha o nome e selecione a região.");
        return;
    }
    const { data: existente } = await supabaseClient
        .from("estados")
        .select("id")
        .ilike("nome", nome)
        .eq("regiao_id", regiao_id);
    if(existente && existente.length > 0){
        alert("Este estado já existe nesta região!");
        return;
    }
    const { error } = await supabaseClient.from("estados").insert([{ nome, regiao_id }]);
    if(error){
        console.error(error);
        alert("Erro ao salvar estado: " + error.message);
        return;
    }
    alert("Estado salvo com sucesso!");
    document.getElementById("novo_estado").value = "";
    listarEstados();
}
async function listarEstados(regiaoId){
    const container = document.getElementById("listaEstados");
    if(!container) return;
    container.innerHTML = "<p>Carregando...</p>";
    let consulta = supabaseClient
        .from("estados")
        .select("id, nome, regioes(nome)")
        .order("nome");
    if(regiaoId){
        consulta = consulta.eq("regiao_id", regiaoId);
    }
    const { data, error } = await consulta;
    if(error){
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar estados.</p>";
        return;
    }
    if(!data || data.length === 0){
        container.innerHTML = "<p>Nenhum estado cadastrado.</p>";
        return;
    }
    container.innerHTML = "";
    data.forEach(e => {
        container.innerHTML += `
            <div class="box" style="display:flex; justify-content:space-between; align-items:center;">
                <div><h3>${e.nome}</h3><small>Região: ${e.regioes?.nome || "-"}</small></div>
                <button class="red" style="width:auto; margin:0;" onclick="excluirEstado(${e.id})">Excluir</button>
            </div>
        `;
    });
}
async function excluirEstado(id){
    const confirmar = confirm(
        "Atenção: excluir este estado também apaga todas as cidades, bairros e clínicas vinculados a ele. Deseja continuar?"
    );
    if(!confirmar) return;
    const { error } = await supabaseClient.from("estados").delete().eq("id", id);
    if(error){
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }
    listarEstados();
}
// ======================================
// CIDADES - ADICIONAR / LISTAR / FILTRAR / EXCLUIR
// ======================================
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnSalvarCidade");
    if(btn) btn.addEventListener("click", addCidade);
    const filtro = document.getElementById("filtro_cidade_estado");
    if(filtro) filtro.addEventListener("change", () => listarCidades(filtro.value));
});
async function carregarPaginaCidades(){
    await popularEstadosSemRegiao("cidade_estado");
    await popularEstadosComTodas("filtro_cidade_estado");
    await listarCidades();
}
// Estados sem depender de região selecionada (usado no formulário de cidade)
async function popularEstadosSemRegiao(selectId){
    const { data, error } = await supabaseClient.from("estados").select("*").order("nome");
    const el = document.getElementById(selectId);
    if(!el || error) return;
    el.innerHTML = `<option value="">Selecione Estado</option>`;
    data.forEach(e => {
        el.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
    });
}
async function popularEstadosComTodas(selectId){
    const { data, error } = await supabaseClient.from("estados").select("*").order("nome");
    const el = document.getElementById(selectId);
    if(!el || error) return;
    el.innerHTML = `<option value="">Todos os Estados</option>`;
    data.forEach(e => {
        el.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
    });
}
async function addCidade(){
    const nome = document.getElementById("nova_cidade").value.trim();
    const estado_id = document.getElementById("cidade_estado").value;
    if(!nome || !estado_id){
        alert("Preencha o nome e selecione o estado.");
        return;
    }
    const { data: existente } = await supabaseClient
        .from("cidades")
        .select("id")
        .ilike("nome", nome)
        .eq("estado_id", estado_id);
    if(existente && existente.length > 0){
        alert("Esta cidade já existe neste estado!");
        return;
    }
    const { error } = await supabaseClient.from("cidades").insert([{ nome, estado_id }]);
    if(error){
        console.error(error);
        alert("Erro ao salvar cidade: " + error.message);
        return;
    }
    alert("Cidade salva com sucesso!");
    document.getElementById("nova_cidade").value = "";
    listarCidades();
}
async function listarCidades(estadoId){
    const container = document.getElementById("listaCidades");
    if(!container) return;
    container.innerHTML = "<p>Carregando...</p>";
    let consulta = supabaseClient
        .from("cidades")
        .select("id, nome, estados(nome)")
        .order("nome");
    if(estadoId){
        consulta = consulta.eq("estado_id", estadoId);
    }
    const { data, error } = await consulta;
    if(error){
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar cidades.</p>";
        return;
    }
    if(!data || data.length === 0){
        container.innerHTML = "<p>Nenhuma cidade cadastrada.</p>";
        return;
    }
    container.innerHTML = "";
    data.forEach(c => {
        container.innerHTML += `
            <div class="box" style="display:flex; justify-content:space-between; align-items:center;">
                <div><h3>${c.nome}</h3><small>Estado: ${c.estados?.nome || "-"}</small></div>
                <button class="red" style="width:auto; margin:0;" onclick="excluirCidade(${c.id})">Excluir</button>
            </div>
        `;
    });
}
async function excluirCidade(id){
    const confirmar = confirm(
        "Atenção: excluir esta cidade também apaga todos os bairros e clínicas vinculados a ela. Deseja continuar?"
    );
    if(!confirmar) return;
    const { error } = await supabaseClient.from("cidades").delete().eq("id", id);
    if(error){
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }
    listarCidades();
}
// ======================================
// BAIRROS - ADICIONAR / LISTAR / FILTRAR / EXCLUIR
// ======================================
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnSalvarBairro");
    if(btn) btn.addEventListener("click", addBairro);
    const filtro = document.getElementById("filtro_bairro_cidade");
    if(filtro) filtro.addEventListener("change", () => listarBairros(filtro.value));
});
async function carregarPaginaBairros(){
    await popularCidadesSemEstado("bairro_cidade");
    await popularCidadesComTodas("filtro_bairro_cidade");
    await listarBairros();
}
async function popularCidadesSemEstado(selectId){
    const { data, error } = await supabaseClient.from("cidades").select("*").order("nome");
    const el = document.getElementById(selectId);
    if(!el || error) return;
    el.innerHTML = `<option value="">Selecione Cidade</option>`;
    data.forEach(c => {
        el.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
    });
}
async function popularCidadesComTodas(selectId){
    const { data, error } = await supabaseClient.from("cidades").select("*").order("nome");
    const el = document.getElementById(selectId);
    if(!el || error) return;
    el.innerHTML = `<option value="">Todas as Cidades</option>`;
    data.forEach(c => {
        el.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
    });
}
async function addBairro(){
    const nome = document.getElementById("novo_bairro").value.trim();
    const cidade_id = document.getElementById("bairro_cidade").value;
    if(!nome || !cidade_id){
        alert("Preencha o nome e selecione a cidade.");
        return;
    }
    const { data: existente } = await supabaseClient
        .from("bairros")
        .select("id")
        .ilike("nome", nome)
        .eq("cidade_id", cidade_id);
    if(existente && existente.length > 0){
        alert("Este bairro já existe nesta cidade!");
        return;
    }
    const { error } = await supabaseClient.from("bairros").insert([{ nome, cidade_id }]);
    if(error){
        console.error(error);
        alert("Erro ao salvar bairro: " + error.message);
        return;
    }
    alert("Bairro salvo com sucesso!");
    document.getElementById("novo_bairro").value = "";
    listarBairros();
}
async function listarBairros(cidadeId){
    const container = document.getElementById("listaBairros");
    if(!container) return;
    container.innerHTML = "<p>Carregando...</p>";
    let consulta = supabaseClient
        .from("bairros")
        .select("id, nome, cidades(nome)")
        .order("nome");
    if(cidadeId){
        consulta = consulta.eq("cidade_id", cidadeId);
    }
    const { data, error } = await consulta;
    if(error){
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar bairros.</p>";
        return;
    }
    if(!data || data.length === 0){
        container.innerHTML = "<p>Nenhum bairro cadastrado.</p>";
        return;
    }
    container.innerHTML = "";
    data.forEach(b => {
        container.innerHTML += `
            <div class="box" style="display:flex; justify-content:space-between; align-items:center;">
                <div><h3>${b.nome}</h3><small>Cidade: ${b.cidades?.nome || "-"}</small></div>
                <button class="red" style="width:auto; margin:0;" onclick="excluirBairro(${b.id})">Excluir</button>
            </div>
        `;
    });
}
async function excluirBairro(id){
    const confirmar = confirm(
        "Atenção: excluir este bairro também apaga todas as clínicas vinculadas a ele. Deseja continuar?"
    );
    if(!confirmar) return;
    const { error } = await supabaseClient.from("bairros").delete().eq("id", id);
    if(error){
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }
    listarBairros();
}
// ======================================
// ESPECIALIDADES BASE - ADICIONAR / LISTAR / EXCLUIR
// ======================================
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnSalvarEspecialidade");
    if(btn) btn.addEventListener("click", addNovaEspecialidade);
});
async function carregarPaginaEspecialidades(){
    await listarEspecialidades();
}
async function addNovaEspecialidade(){
    const input = document.getElementById("nova_especialidade");
const nome = input.value.trim();
    const rede = document.getElementById("especialidade_rede").value;
    if(!nome){
        alert("Digite o nome da especialidade.");
        return;
    }
    const { data: existente } = await supabaseClient
        .from("especialidades")
        .select("id")
        .ilike("nome", nome);
    if(existente && existente.length > 0){
        alert("Esta especialidade já está cadastrada!");
        return;
    }
    const { error } = await supabaseClient.from("especialidades").insert([{
    nome,
    rede
}]);
    if(error){
        console.error(error);
        alert("Erro ao salvar especialidade: " + error.message);
        return;
    }
    alert("Especialidade cadastrada com sucesso!");
    input.value = "";
    document.getElementById("especialidade_rede").value = "especialistas";
    listarEspecialidades();
}
async function listarEspecialidades(){

    const container = document.getElementById("listaEspecialidades");

    const { data, error } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");

    if(error){
        console.error(error);
        return;
    }

    container.innerHTML = "";

    data.forEach(e=>{

        container.innerHTML += `
        <div class="box" style="display:flex; justify-content:space-between; align-items:center;">

            <div>
                <h3>${e.nome}</h3>
                <small>
                    ${e.rede === "especialistas"
                        ? "Rede Especialistas"
                        : "Rede Sindilegis"}
                </small>
            </div>

            <button
                class="red"
                style="width:auto; margin:0;"
                onclick="excluirEspecialidade(${e.id})">
                Excluir
            </button>

        </div>
        `;

    });

}
async function excluirEspecialidade(id){
    const confirmar = confirm(
        "Atenção: excluir esta especialidade também remove seu vínculo com todas as clínicas. Deseja continuar?"
    );
    if(!confirmar) return;
    const { error } = await supabaseClient.from("especialidades").delete().eq("id", id);
    if(error){
        console.error(error);
        alert("Erro ao excluir: " + error.message);
        return;
    }
    listarEspecialidades();
}
// ======================================
// CLÍNICAS - ADICIONAR / LISTAR / EDITAR / VINCULAR REDE
// ======================================
let clinicaEmEdicaoId = null;
document.addEventListener("DOMContentLoaded", () => {
    ligarCascataLocalizacao("clinica_regiao", "clinica_estado", "clinica_cidade", "clinica_bairro");
    ligarCascataLocalizacao("edit_clinica_regiao", "edit_clinica_estado", "edit_clinica_cidade", "edit_clinica_bairro");
    const btnSalvar = document.getElementById("btnSalvarClinica");
    if(btnSalvar) btnSalvar.addEventListener("click", addClinica);
    const filtroNome = document.getElementById("filtro_clinica_nome");
    if(filtroNome) filtroNome.addEventListener("input", () => listarClinicas(filtroNome.value));
    const btnAtualizar = document.getElementById("btnAtualizarClinica");
    if(btnAtualizar) btnAtualizar.addEventListener("click", atualizarClinica);
    // NOVO
    const btnExcluir = document.getElementById("btnExcluirClinica");
    if(btnExcluir) btnExcluir.addEventListener("click", excluirClinica);
    const btnVoltar = document.getElementById("btnVoltarClinicas");
    if(btnVoltar) btnVoltar.addEventListener("click", () => mostrarPagina("clinicas"));
    const btnAddEspRede = document.getElementById("btnAdicionarEspRede");
    if(btnAddEspRede) btnAddEspRede.addEventListener("click", adicionarEspecialidadeRede);
});
async function carregarPaginaClinicas(){
    await popularRegioes("clinica_regiao");
    await popularEspecialidades("clinica_especialidade");
    await listarClinicas();
}
// ======================================
// ADICIONAR CLÍNICA
// ======================================
async function addClinica(){
    const nome = document.getElementById("clinica_nome").value.trim();
    const endereco = document.getElementById("clinica_endereco").value.trim();
    const telefone = document.getElementById("clinica_telefone").value.trim();
    const bairro_id = document.getElementById("clinica_bairro").value;
    const especialidade_id = document.getElementById("clinica_especialidade").value;
    const rede = document.getElementById("clinica_rede").value;
    if(!nome || !endereco || !bairro_id || !especialidade_id || !rede){
        alert("Preencha todos os campos obrigatórios!");
        return;
    }
    const { data: existente } = await supabaseClient
        .from("clinicas")
        .select("id")
        .ilike("nome", nome)
        .eq("bairro_id", bairro_id);
    if(existente && existente.length > 0){
        alert("Já existe uma clínica com este nome neste bairro!");
        return;
    }
    const { data: novaClinica, error } = await supabaseClient
        .from("clinicas")
        .insert([{ nome, endereco, telefone, bairro_id, ativo: true }])
        .select();
    if(error || !novaClinica || !novaClinica.length){
        console.error(error);
        alert("Erro ao cadastrar clínica.");
        return;
    }
    const { error: erroVinculo } = await supabaseClient
        .from("clinica_especialidades")
        .insert([{
            clinica_id: novaClinica[0].id,
            especialidade_id,
            rede,
            ativo: true
        }]);
    if(erroVinculo){
        console.error(erroVinculo);
        alert("Clínica criada, mas houve erro ao vincular a especialidade.");
        return;
    }
    alert("Clínica cadastrada com sucesso!");
    limparFormularioClinica();
    listarClinicas();
}
function limparFormularioClinica(){
    ["clinica_nome", "clinica_endereco", "clinica_telefone"].forEach(id => {
        document.getElementById(id).value = "";
    });
    document.getElementById("clinica_regiao").value = "";
    document.getElementById("clinica_estado").innerHTML = `<option value="">Selecione Estado</option>`;
    document.getElementById("clinica_cidade").innerHTML = `<option value="">Selecione Cidade</option>`;
    document.getElementById("clinica_bairro").innerHTML = `<option value="">Selecione Bairro</option>`;
}
// ======================================
// LISTAR CLÍNICAS
// ======================================
async function listarClinicas(filtroNome){
    const container = document.getElementById("listaClinicas");
    if(!container) return;
    container.innerHTML = "<p>Carregando...</p>";
    let consulta = supabaseClient
        .from("clinicas")
        .select(`
            id, nome, endereco, telefone, ativo,
            bairros( nome, cidades( nome, estados( nome ) ) )
        `)
        .order("nome");
    if(filtroNome){
        consulta = consulta.ilike("nome", `%${filtroNome}%`);
    }
    const { data, error } = await consulta;
    if(error){
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar clínicas.</p>";
        return;
    }
    if(!data || data.length === 0){
        container.innerHTML = "<p>Nenhuma clínica encontrada.</p>";
        return;
    }
    container.innerHTML = "";
    data.forEach(c => {
        const cidade = c.bairros?.cidades?.nome || "-";
        const estado = c.bairros?.cidades?.estados?.nome || "-";
        container.innerHTML += `
            <div class="box" style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3>${c.nome} ${c.ativo ? "" : "<small style='color:var(--red);'>(inativa)</small>"}</h3>
                    <small>${c.bairros?.nome || "-"} — ${cidade}/${estado}</small>
                </div>
                <button class="blue" style="width:auto; margin:0;" onclick="abrirEditarClinica(${c.id})">Editar</button>
            </div>
        `;
    });
}
// ======================================
// ABRIR EDIÇÃO DE UMA CLÍNICA
// ======================================
async function abrirEditarClinica(id){
    clinicaEmEdicaoId = id;
    const { data: clinica, error } = await supabaseClient
        .from("clinicas")
        .select(`
            id, nome, endereco, telefone, ativo, bairro_id,
            bairros( cidade_id, cidades( estado_id, estados( regiao_id ) ) )
        `)
        .eq("id", id)
        .single();
    if(error || !clinica){
        console.error(error);
        alert("Erro ao carregar dados da clínica.");
        return;
    }
    document.getElementById("edit_clinica_id").value = clinica.id;
    document.getElementById("edit_clinica_nome").value = clinica.nome;
    document.getElementById("edit_clinica_endereco").value = clinica.endereco;
    document.getElementById("edit_clinica_telefone").value = clinica.telefone || "";
    document.getElementById("edit_clinica_ativo").checked = clinica.ativo;
    // Popula e pré-seleciona a cascata de localização
    const regiaoId = clinica.bairros?.cidades?.estados?.regiao_id;
    const estadoId = clinica.bairros?.cidades?.estado_id;
    const cidadeId = clinica.bairros?.cidade_id;
    await popularRegioes("edit_clinica_regiao");
    document.getElementById("edit_clinica_regiao").value = regiaoId || "";
    await popularEstados("edit_clinica_estado", regiaoId);
    document.getElementById("edit_clinica_estado").value = estadoId || "";
    await popularCidades("edit_clinica_cidade", estadoId);
    document.getElementById("edit_clinica_cidade").value = cidadeId || "";
    await popularBairros("edit_clinica_bairro", cidadeId);
    document.getElementById("edit_clinica_bairro").value = clinica.bairro_id || "";
    await popularEspecialidades("edit_especialidade");
    await carregarEspecialidadesRedeDaClinica(id);
    mostrarPagina("editarClinica");
}
// ======================================
// ATUALIZAR DADOS DA CLÍNICA
// ======================================
async function atualizarClinica(){
    const id = document.getElementById("edit_clinica_id").value;
    const dados = {
        nome: document.getElementById("edit_clinica_nome").value.trim(),
        endereco: document.getElementById("edit_clinica_endereco").value.trim(),
        telefone: document.getElementById("edit_clinica_telefone").value.trim(),
        bairro_id: document.getElementById("edit_clinica_bairro").value,
        ativo: document.getElementById("edit_clinica_ativo").checked
    };
    if(!dados.nome || !dados.endereco || !dados.bairro_id){
        alert("Preencha nome, endereço e bairro.");
        return;
    }
    const { error } = await supabaseClient.from("clinicas").update(dados).eq("id", id);
    if(error){
        console.error(error);
        alert("Erro ao atualizar: " + error.message);
        return;
    }
    alert("Dados atualizados com sucesso!");
}
// ======================================
// EXCLUIR CLÍNICA
// ======================================
async function excluirClinica(){
    const id = document.getElementById("edit_clinica_id").value;
    if(!id){
        alert("Nenhuma clínica selecionada.");
        return;
    }
    const confirmar = confirm(
        "Tem certeza que deseja excluir esta clínica? Esta ação não pode ser desfeita."
    );
    if(!confirmar) return;
    // Primeiro remove os vínculos com especialidades
    const { error: erroVinculo } = await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq("clinica_id", id);
    if(erroVinculo){
        console.error(erroVinculo);
        alert("Erro ao remover vínculos da clínica: " + erroVinculo.message);
        return;
    }
    // Depois remove a clínica
    const { error } = await supabaseClient
        .from("clinicas")
        .delete()
        .eq("id", id);
    if(error){
        console.error(error);
        alert("Erro ao excluir clínica: " + error.message);
        return;
    }
    alert("Clínica excluída com sucesso!");
    clinicaEmEdicaoId = null;
    mostrarPagina("clinicas");
    listarClinicas();
}
// ======================================
// ESPECIALIDADES / REDES DA CLÍNICA EM EDIÇÃO
// ======================================
async function carregarEspecialidadesRedeDaClinica(clinicaId){
    const container = document.getElementById("listaEspRede");
    if(!container) return;
    container.innerHTML = "<p>Carregando...</p>";
    const { data, error } = await supabaseClient
        .from("clinica_especialidades")
        .select("id, ativo, rede, especialidades(nome)")
        .eq("clinica_id", clinicaId);
    if(error){
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar vínculos.</p>";
        return;
    }
    if(!data || data.length === 0){
        container.innerHTML = "<p>Nenhuma especialidade vinculada ainda.</p>";
        return;
    }
    container.innerHTML = "";
    data.forEach(item => {
        if(!item.especialidades) return;
        const nomeRede = item.rede === "sindilegis" ? "Rede Sindilegis" : "Rede Especialistas";
        container.innerHTML += `
            <div class="box" style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3>${item.especialidades.nome}</h3>
                    <small>${nomeRede}</small>
                </div>
                <button
                    class="${item.ativo ? "red" : "green"}"
                    style="width:auto; margin:0;"
                    onclick="toggleEspecialidadeRede(${item.id}, ${item.ativo})"
                >
                    ${item.ativo ? "Desativar" : "Ativar"}
                </button>
            </div>
        `;
    });
}
async function adicionarEspecialidadeRede(){
    const especialidade_id = document.getElementById("edit_especialidade").value;
    const rede = document.getElementById("edit_rede").value;
    if(!especialidade_id || !rede){
        alert("Selecione a especialidade e a rede.");
        return;
    }
    const { data: existente } = await supabaseClient
        .from("clinica_especialidades")
        .select("id")
        .eq("clinica_id", clinicaEmEdicaoId)
        .eq("especialidade_id", especialidade_id)
        .eq("rede", rede);
    if(existente && existente.length > 0){
        alert("Esta especialidade já está vinculada a esta rede nesta clínica!");
        return;
    }
    const { error } = await supabaseClient
        .from("clinica_especialidades")
        .insert([{ clinica_id: clinicaEmEdicaoId, especialidade_id, rede, ativo: true }]);
    if(error){
        console.error(error);
        alert("Erro ao vincular: " + error.message);
        return;
    }
    carregarEspecialidadesRedeDaClinica(clinicaEmEdicaoId);
}
async function toggleEspecialidadeRede(id, statusAtual){
    const { error } = await supabaseClient
        .from("clinica_especialidades")
        .update({ ativo: !statusAtual })
        .eq("id", id);
    if(error){
        console.error(error);
        alert("Erro ao atualizar: " + error.message);
        return;
    }
    carregarEspecialidadesRedeDaClinica(clinicaEmEdicaoId);
}
// =========================================
// DASHBOARD
// Rede Especialistas
// =========================================
window.addEventListener("load", () => {
    carregarDashboard();
});
async function carregarDashboard(){
    await carregarTotalClinicas();
    await carregarTotalEspecialidades();
    await carregarTotalEstados();
    await carregarTotalCidades();
    await carregarTotalBairros();
    await carregarTotalRegioes();
}
async function carregarTotalClinicas(){
    const { count, error } = await supabaseClient
        .from("clinicas")
        .select("*", { count: "exact", head: true });
    if(error){
        console.error(error);
        return;
    }
    document.getElementById("totalClinicas").textContent = count;
}
async function carregarTotalEspecialidades(){
    const { count } = await supabaseClient
        .from("especialidades")
        .select("*", { count: "exact", head: true });
    document.getElementById("totalEspecialidades").textContent = count;
}
async function carregarTotalEstados(){
    const { count } = await supabaseClient
        .from("estados")
        .select("*", { count: "exact", head: true });
    document.getElementById("totalEstados").textContent = count;
}
async function carregarTotalCidades(){
    const { count } = await supabaseClient
        .from("cidades")
        .select("*", { count: "exact", head: true });
    document.getElementById("totalCidades").textContent = count;
}
async function carregarTotalBairros(){
    const { count } = await supabaseClient
        .from("bairros")
        .select("*", { count: "exact", head: true });
    document.getElementById("totalBairros").textContent = count;
}
async function carregarTotalRegioes(){
    const { count } = await supabaseClient
        .from("regioes")
        .select("*", { count: "exact", head: true });
    document.getElementById("totalRegioes").textContent = count;
}
document.addEventListener("DOMContentLoaded", () => {

    const btnVoltarSite = document.getElementById("btnVoltarSite");

    if(btnVoltarSite){

        btnVoltarSite.addEventListener("click", () => {

            window.location.href = "index.html";

        });

    }

});
