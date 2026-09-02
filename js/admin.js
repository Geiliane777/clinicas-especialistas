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

function iniciarMenu(){

    const botoes = document.querySelectorAll(".menu-btn");

    botoes.forEach(botao => {

        botao.addEventListener("click", async () => {

            const pagina = botao.dataset.page;

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

function mostrarPagina(id){

    document
        .querySelectorAll(".page")
        .forEach(pagina => {

            pagina.classList.add("hidden");

        });

    const pagina = document.getElementById(id);

    if(pagina){

        pagina.classList.remove("hidden");

    }


    const titulos = {

        dashboard:"Dashboard",

        clinicas:"Clínicas",

        editarClinica:"Editar Clínica",

        especialidades:"Especialidades",

        regioes:"Regiões",

        estados:"Estados",

        cidades:"Cidades",

        bairros:"Bairros"

    };


    document.getElementById("tituloPagina").textContent =
        titulos[id] || "Painel Administrativo";

}


// ======================================
// BOTÕES
// ======================================

function iniciarBotoes(){

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
        ?.addEventListener("click", salvarEspecialidade);


    document
        .getElementById("btnSalvarClinica")
        ?.addEventListener("click", salvarClinica);


    document
        .getElementById("btnAtualizarClinica")
        ?.addEventListener("click", atualizarClinica);


    document
        .getElementById("btnExcluirClinica")
        ?.addEventListener("click", excluirClinica);


    document
        .getElementById("btnVoltarClinicas")
        ?.addEventListener("click", () => {

            mostrarPagina("clinicas");

        });


    document
        .getElementById("filtro_clinica_nome")
        ?.addEventListener("input", carregarClinicas);


    document
        .getElementById("filtro_estado_regiao")
        ?.addEventListener("change", carregarEstados);


    document
        .getElementById("filtro_cidade_estado")
        ?.addEventListener("change", carregarCidades);


    document
        .getElementById("filtro_bairro_cidade")
        ?.addEventListener("change", carregarBairros);


    // CASCATA CLÍNICA

    document
        .getElementById("clinica_regiao")
        ?.addEventListener("change", async () => {

            await popularEstadosClinica();

        });


    document
        .getElementById("clinica_estado")
        ?.addEventListener("change", async () => {

            await popularCidadesClinica();

        });


    document
        .getElementById("clinica_cidade")
        ?.addEventListener("change", async () => {

            await popularBairrosClinica();

        });


    // CASCATA EDIÇÃO

    document
        .getElementById("edit_clinica_regiao")
        ?.addEventListener("change", async () => {

            await popularEstadosEditar();

        });


    document
        .getElementById("edit_clinica_estado")
        ?.addEventListener("change", async () => {

            await popularCidadesEditar();

        });


    document
        .getElementById("edit_clinica_cidade")
        ?.addEventListener("change", async () => {

            await popularBairrosEditar();

        });

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard(){

    try{

        const clinicas = await supabaseClient
            .from("clinicas")
            .select("*", {
                count:"exact",
                head:true
            });


        const especialidades = await supabaseClient
            .from("especialidades")
            .select("*", {
                count:"exact",
                head:true
            });


        const regioes = await supabaseClient
            .from("regioes")
            .select("*", {
                count:"exact",
                head:true
            });


        const estados = await supabaseClient
            .from("estados")
            .select("*", {
                count:"exact",
                head:true
            });


        const cidades = await supabaseClient
            .from("cidades")
            .select("*", {
                count:"exact",
                head:true
            });


        const bairros = await supabaseClient
            .from("bairros")
            .select("*", {
                count:"exact",
                head:true
            });


        document.getElementById("totalClinicas").textContent =
            clinicas.count || 0;


        document.getElementById("totalEspecialidades").textContent =
            especialidades.count || 0;


        document.getElementById("totalRegioes").textContent =
            regioes.count || 0;


        document.getElementById("totalEstados").textContent =
            estados.count || 0;


        document.getElementById("totalCidades").textContent =
            cidades.count || 0;


        document.getElementById("totalBairros").textContent =
            bairros.count || 0;


    }catch(error){

        console.error(
            "Erro dashboard:",
            error
        );

    }

}


// ======================================
// REGIÕES
// ======================================

async function salvarRegiao(){

    const input =
        document.getElementById("nova_regiao");


    const nome =
        input.value.trim();


    if(!nome){

        alert("Digite o nome da região.");

        return;

    }


    const { error } =
        await supabaseClient
            .from("regioes")
            .insert({
                nome:nome
            });


    if(error){

        alert(error.message);

        return;

    }


    input.value = "";


    await carregarRegioes();

    await popularSelects();

    await carregarDashboard();

}


async function carregarRegioes(){

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("*")
            .order("nome");


    if(error){

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaRegioes");


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

async function salvarEstado(){

    const regiao =
        document.getElementById("estado_regiao").value;


    const nome =
        document
            .getElementById("novo_estado")
            .value
            .trim();


    if(!regiao || !nome){

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("estados")
            .insert({
                nome:nome,
                regiao_id:regiao
            });


    if(error){

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


async function carregarEstados(){

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


    if(filtro){

        query =
            query.eq(
                "regiao_id",
                filtro
            );

    }


    const { data, error } =
        await query;


    if(error){

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaEstados");


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

async function salvarCidade(){

    const estado =
        document
            .getElementById("cidade_estado")
            .value;


    const nome =
        document
            .getElementById("nova_cidade")
            .value
            .trim();


    if(!estado || !nome){

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("cidades")
            .insert({
                nome:nome,
                estado_id:estado
            });


    if(error){

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


async function carregarCidades(){

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


    if(filtro){

        query =
            query.eq(
                "estado_id",
                filtro
            );

    }


    const { data, error } =
        await query;


    if(error){

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaCidades");


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

async function salvarBairro(){

    const cidade =
        document
            .getElementById("bairro_cidade")
            .value;


    const nome =
        document
            .getElementById("novo_bairro")
            .value
            .trim();


    if(!cidade || !nome){

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("bairros")
            .insert({
                nome:nome,
                cidade_id:cidade
            });


    if(error){

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


async function carregarBairros(){

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


    if(filtro){

        query =
            query.eq(
                "cidade_id",
                filtro
            );

    }


    const { data, error } =
        await query;


    if(error){

        console.error(error);

        return;

    }


    const lista =
        document.getElementById("listaBairros");


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

async function salvarEspecialidade(){

    const nome =
        document
            .getElementById("nova_especialidade")
            .value
            .trim();


    const rede =
        document
            .getElementById("especialidade_rede")
            .value;


    if(!nome){

        alert(
            "Digite a especialidade."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("especialidades")
            .insert({
                nome:nome,
                rede:rede
            });


    if(error){

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


async function carregarEspecialidades(){

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("*")
            .order("nome");


    if(error){

        console.error(error);

        return;

    }


    const lista =
        document
            .getElementById("listaEspecialidades");


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
// CLÍNICAS
// ======================================

async function salvarClinica(){

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


    if(!nome){

        alert(
            "Digite o nome da clínica."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("clinicas")
            .insert({

                nome:nome,

                telefone:telefone,

                endereco:endereco,

                regiao_id:
                    regiao_id || null,

                estado_id:
                    estado_id || null,

                cidade_id:
                    cidade_id || null,

                bairro_id:
                    bairro_id || null,

                ativo:true

            });


    if(error){

        console.error(error);

        alert(
            "Erro: " +
            error.message
        );

        return;

    }


    alert(
        "Clínica cadastrada com sucesso!"
    );


    document
        .getElementById("clinica_nome")
        .value = "";


    document
        .getElementById("clinica_telefone")
        .value = "";


    document
        .getElementById("clinica_endereco")
        .value = "";


    await carregarClinicas();

    await carregarDashboard();

}


async function carregarClinicas(){

    const filtro =
        document
            .getElementById("filtro_clinica_nome")
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
                bairros(nome)
            `)
            .order("nome");


    if(error){

        console.error(error);

        return;

    }


    const lista =
        document
            .getElementById("listaClinicas");


    lista.innerHTML = "";


    const filtradas =
        data.filter(clinica => {

            if(!filtro){
                return true;
            }

            return clinica.nome
                .toLowerCase()
                .includes(filtro);

        });


    filtradas.forEach(clinica => {

        const status =
            clinica.ativo !== false
                ? "ativo"
                : "inativo";


        lista.innerHTML += `

            <div class="box">

                <h3>
                    🏥 ${clinica.nome}
                </h3>

                <small>
                    📞 ${clinica.telefone || "-"}
                </small>

                <small>
                    📍
                    ${clinica.cidades?.nome || ""}
                    ${clinica.bairros?.nome
                        ? " - " + clinica.bairros.nome
                        : ""
                    }
                </small>

                <br>

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

        `;

    });

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id){

    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select("*")
            .eq("id", id)
            .single();


    if(error){

        alert(error.message);

        return;

    }


    document
        .getElementById("edit_clinica_id")
        .value = data.id;


    document
        .getElementById("edit_clinica_nome")
        .value = data.nome || "";


    document
        .getElementById("edit_clinica_telefone")
        .value = data.telefone || "";


    document
        .getElementById("edit_clinica_endereco")
        .value = data.endereco || "";


    document
        .getElementById("edit_clinica_ativo")
        .checked = data.ativo !== false;


    await popularSelects();


    document
        .getElementById("edit_clinica_regiao")
        .value = data.regiao_id || "";


    await popularEstadosEditar();


    document
        .getElementById("edit_clinica_estado")
        .value = data.estado_id || "";


    await popularCidadesEditar();


    document
        .getElementById("edit_clinica_cidade")
        .value = data.cidade_id || "";


    await popularBairrosEditar();


    document
        .getElementById("edit_clinica_bairro")
        .value = data.bairro_id || "";


    mostrarPagina("editarClinica");

}


// ======================================
// ATUALIZAR CLÍNICA
// ======================================

async function atualizarClinica(){

    const id =
        document
            .getElementById("edit_clinica_id")
            .value;


    const dados = {

        nome:
            document
                .getElementById("edit_clinica_nome")
                .value
                .trim(),

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
            .eq("id", id);


    if(error){

        alert(error.message);

        return;

    }


    alert(
        "Clínica atualizada com sucesso!"
    );


    await carregarClinicas();

    await carregarDashboard();

    mostrarPagina("clinicas");

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica(){

    const id =
        document
            .getElementById("edit_clinica_id")
            .value;


    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?"
        );


    if(!confirmar){

        return;

    }


    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq("id", id);


    if(error){

        alert(error.message);

        return;

    }


    alert(
        "Clínica excluída com sucesso!"
    );


    await carregarClinicas();

    await carregarDashboard();

    mostrarPagina("clinicas");

}


// ======================================
// POPULAR TODOS OS SELECTS
// ======================================

async function popularSelects(){

    const { data:regioes } =
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


    const { data:estados } =
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


    const { data:cidades } =
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


    const { data:especialidades } =
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
){

    const select =
        document.getElementById(id);


    if(!select){

        return;

    }


    const valorAtual =
        select.value;


    select.innerHTML =
        `<option value="">
            ${placeholder}
        </option>`;


    if(dados){

        dados.forEach(item => {

            select.innerHTML += `

                <option value="${item.id}">
                    ${item.nome}
                </option>

            `;

        });

    }


    if(valorAtual){

        select.value =
            valorAtual;

    }

}


// ======================================
// CASCATA NOVA CLÍNICA
// ======================================

async function popularEstadosClinica(){

    const regiao =
        document
            .getElementById("clinica_regiao")
            .value;


    if(!regiao){

        return;

    }


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("regiao_id", regiao)
            .order("nome");


    preencherSelect(
        "clinica_estado",
        data,
        "Selecione Estado"
    );

}


async function popularCidadesClinica(){

    const estado =
        document
            .getElementById("clinica_estado")
            .value;


    if(!estado){

        return;

    }


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("estado_id", estado)
            .order("nome");


    preencherSelect(
        "clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


async function popularBairrosClinica(){

    const cidade =
        document
            .getElementById("clinica_cidade")
            .value;


    if(!cidade){

        return;

    }


    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("cidade_id", cidade)
            .order("nome");


    preencherSelect(
        "clinica_bairro",
        data,
        "Selecione Bairro"
    );

}


// ======================================
// CASCATA EDITAR CLÍNICA
// ======================================

async function popularEstadosEditar(){

    const regiao =
        document
            .getElementById("edit_clinica_regiao")
            .value;


    if(!regiao){

        return;

    }


    const { data } =
        await supabaseClient
            .from("estados")
            .select("*")
            .eq("regiao_id", regiao)
            .order("nome");


    preencherSelect(
        "edit_clinica_estado",
        data,
        "Selecione Estado"
    );

}


async function popularCidadesEditar(){

    const estado =
        document
            .getElementById("edit_clinica_estado")
            .value;


    if(!estado){

        return;

    }


    const { data } =
        await supabaseClient
            .from("cidades")
            .select("*")
            .eq("estado_id", estado)
            .order("nome");


    preencherSelect(
        "edit_clinica_cidade",
        data,
        "Selecione Cidade"
    );

}


async function popularBairrosEditar(){

    const cidade =
        document
            .getElementById("edit_clinica_cidade")
            .value;


    if(!cidade){

        return;

    }


    const { data } =
        await supabaseClient
            .from("bairros")
            .select("*")
            .eq("cidade_id", cidade)
            .order("nome");


    preencherSelect(
        "edit_clinica_bairro",
        data,
        "Selecione Bairro"
    );

}
