// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// ======================================

console.log("admin.js carregado");


// ======================================
// CONFIGURAÇÕES
// ======================================

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Painel administrativo iniciado");

    atualizarData();

    carregarTema();

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


// ======================================
// DATA ATUAL
// ======================================

function atualizarData() {

    const elemento =
        document.getElementById("dataAtual");

    if (!elemento) return;

    const data = new Date();

    elemento.textContent =
        data.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}


// ======================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ======================================

function mostrarPagina(pagina) {

    const paginas =
        document.querySelectorAll(".pagina");

    paginas.forEach((item) => {

        item.classList.remove("ativa");

    });


    const paginaSelecionada =
        document.getElementById(
            `pagina-${pagina}`
        );

    if (paginaSelecionada) {

        paginaSelecionada.classList.add("ativa");

    }


    const botoes =
        document.querySelectorAll(".menu-btn");

    botoes.forEach((botao) => {

        botao.classList.remove("ativo");

    });


    const botaoAtivo =
        document.querySelector(
            `[data-pagina="${pagina}"]`
        );

    if (botaoAtivo) {

        botaoAtivo.classList.add("ativo");

    }


    // Carregadores específicos

    if (pagina === "dashboard") {

        carregarDashboard();

    }


    if (pagina === "clinicas") {

        listarClinicas();

    }


    if (pagina === "especialidades") {

        listarEspecialidades();

    }


    if (pagina === "regioes") {

        listarRegioes();

    }


    if (pagina === "estados") {

        listarEstados();

        popularRegioes();

    }


    if (pagina === "cidades") {

        listarCidades();

        popularEstados();

    }


    if (pagina === "bairros") {

        listarBairros();

        popularCidades();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ======================================
// TEMA ESCURO
// ======================================

function carregarTema() {

    const tema =
        localStorage.getItem("tema");

    if (tema === "dark") {

        document.body.classList.add("dark");

    }

}


function alternarTema() {

    document.body.classList.toggle("dark");

    if (
        document.body.classList.contains("dark")
    ) {

        localStorage.setItem(
            "tema",
            "dark"
        );

    } else {

        localStorage.setItem(
            "tema",
            "light"
        );

    }

}


// ======================================
// VOLTAR AO SITE
// ======================================

function voltarAoSite() {

    window.location.href = "index.html";

}


// ======================================
// SAIR
// ======================================

function sair() {

    const confirmar =
        confirm(
            "Deseja realmente sair do painel?"
        );

    if (!confirmar) return;

    window.location.href =
        "login.html";

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        // ==================================
        // CLÍNICAS
        // ==================================

        const {
            data: clinicas,
            error: erroClinicas
        } = await supabaseClient
            .from("clinicas")
            .select("*");


        if (erroClinicas) {

            console.error(
                "Erro clínicas:",
                erroClinicas
            );

        }


        const totalClinicas =
            clinicas
                ? clinicas.length
                : 0;


        const clinicasAtivas =
            clinicas
                ? clinicas.filter(
                    clinica =>
                        clinica.ativo === true
                ).length
                : 0;


        const clinicasInativas =
            totalClinicas -
            clinicasAtivas;


        atualizarElemento(
            "totalClinicas",
            totalClinicas
        );


        atualizarElemento(
            "totalClinicasAtivas",
            clinicasAtivas
        );


        atualizarElemento(
            "totalClinicasInativas",
            clinicasInativas
        );


        atualizarElemento(
            "legendaAtivas",
            clinicasAtivas
        );


        atualizarElemento(
            "legendaInativas",
            clinicasInativas
        );


        // ==================================
        // PORCENTAGEM
        // ==================================

        let porcentagem = 0;


        if (totalClinicas > 0) {

            porcentagem =
                Math.round(
                    (
                        clinicasAtivas /
                        totalClinicas
                    ) * 100
                );

        }


        atualizarElemento(
            "porcentagemAtivas",
            `${porcentagem}%`
        );


        const barra =
            document.getElementById(
                "barraAtivas"
            );


        if (barra) {

            barra.style.width =
                `${porcentagem}%`;

        }


        // ==================================
        // ESPECIALIDADES
        // ==================================

        const {
            data: especialidades,
            error: erroEspecialidades
        } = await supabaseClient
            .from("especialidades")
            .select("*");


        if (erroEspecialidades) {

            console.error(
                erroEspecialidades
            );

        }


        atualizarElemento(
            "totalEspecialidades",
            especialidades
                ? especialidades.length
                : 0
        );


        // ==================================
        // REGIÕES
        // ==================================

        const {
            data: regioes
        } = await supabaseClient
            .from("regioes")
            .select("*");


        atualizarElemento(
            "totalRegioes",
            regioes
                ? regioes.length
                : 0
        );


        // ==================================
        // ESTADOS
        // ==================================

        const {
            data: estados
        } = await supabaseClient
            .from("estados")
            .select("*");


        atualizarElemento(
            "totalEstados",
            estados
                ? estados.length
                : 0
        );


        // ==================================
        // CIDADES
        // ==================================

        const {
            data: cidades
        } = await supabaseClient
            .from("cidades")
            .select("*");


        atualizarElemento(
            "totalCidades",
            cidades
                ? cidades.length
                : 0
        );


        // ==================================
        // BAIRROS
        // ==================================

        const {
            data: bairros
        } = await supabaseClient
            .from("bairros")
            .select("*");


        atualizarElemento(
            "totalBairros",
            bairros
                ? bairros.length
                : 0
        );


        // ==================================
        // ÚLTIMAS CLÍNICAS
        // ==================================

        mostrarUltimasClinicas(clinicas);

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// ======================================
// ATUALIZAR ELEMENTO
// ======================================

function atualizarElemento(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent = valor;

    }

}


// ======================================
// ÚLTIMAS CLÍNICAS
// ======================================

function mostrarUltimasClinicas(clinicas) {

    const container =
        document.getElementById(
            "ultimasClinicas"
        );


    if (!container) return;


    if (
        !clinicas ||
        clinicas.length === 0
    ) {

        container.innerHTML = `
            <p class="carregando">
                Nenhuma clínica cadastrada.
            </p>
        `;

        return;

    }


    const ultimas =
        clinicas
            .slice(-5)
            .reverse();


    container.innerHTML =
        ultimas.map((clinica) => `

            <div class="ultima-clinica">

                <div class="ultima-clinica-info">

                    <div class="ultima-clinica-icone">
                        🏥
                    </div>

                    <div>

                        <strong>
                            ${clinica.nome || "Sem nome"}
                        </strong>

                        <span>
                            ${clinica.endereco || "Endereço não informado"}
                        </span>

                    </div>

                </div>


                <span class="
                    status-clinica
                    ${clinica.ativo ? "status-ativo" : "status-inativo"}
                ">

                    ${clinica.ativo ? "Ativa" : "Inativa"}

                </span>

            </div>

        `).join("");

}


// ======================================
// CLÍNICAS
// ======================================

async function listarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="6">
                Carregando clínicas...
            </td>
        </tr>
    `;


    try {

        let consulta =
            supabaseClient
                .from("clinicas")
                .select(`
                    *,
                    bairros (
                        nome,
                        cidades (
                            nome,
                            estados (
                                nome,
                                regioes (
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


        const busca =
            document.getElementById(
                "buscarClinica"
            );


        const status =
            document.getElementById(
                "filtroStatusClinica"
            );


        if (
            busca &&
            busca.value.trim() !== ""
        ) {

            consulta =
                consulta.ilike(
                    "nome",
                    `%${busca.value.trim()}%`
                );

        }


        if (
            status &&
            status.value !== ""
        ) {

            consulta =
                consulta.eq(
                    "ativo",
                    status.value === "true"
                );

        }


        const {
            data,
            error
        } = await consulta;


        if (error) {

            console.error(error);

            lista.innerHTML = `
                <tr>
                    <td colspan="6">
                        Erro ao carregar clínicas.
                    </td>
                </tr>
            `;

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            lista.innerHTML = `
                <tr>
                    <td colspan="6">
                        Nenhuma clínica encontrada.
                    </td>
                </tr>
            `;

            return;

        }


        lista.innerHTML =
            data.map((clinica) => {

                const bairro =
                    clinica.bairros;


                const cidade =
                    bairro?.cidades;


                const estado =
                    cidade?.estados;


                const localizacao = [
                    bairro?.nome,
                    cidade?.nome,
                    estado?.nome
                ]
                    .filter(Boolean)
                    .join(" - ");


                return `

                    <tr>

                        <td>
                            <strong>
                                ${clinica.nome || "-"}
                            </strong>
                        </td>


                        <td>
                            ${localizacao || "-"}
                        </td>


                        <td>
                            ${clinica.telefone || "-"}
                        </td>


                        <td>
                            ${clinica.especialidades || "-"}
                        </td>


                        <td>

                            <span class="
                                status-clinica
                                ${clinica.ativo
                                    ? "status-ativo"
                                    : "status-inativo"
                                }
                            ">

                                ${clinica.ativo
                                    ? "Ativa"
                                    : "Inativa"
                                }

                            </span>

                        </td>


                        <td>

                            <div class="acoes-tabela">

                                <button
                                    class="btn-acao btn-editar"
                                    onclick="editarClinica('${clinica.id}')"
                                    title="Editar clínica"
                                >
                                    ✏️
                                </button>


                                <button
                                    class="btn-acao btn-excluir"
                                    onclick="excluirClinica('${clinica.id}')"
                                    title="Excluir clínica"
                                >
                                    🗑️
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }).join("");

    } catch (erro) {

        console.error(
            "Erro:",
            erro
        );

    }

}


// ======================================
// ABRIR MODAL CLÍNICA
// ======================================

async function abrirModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    const formulario =
        document.getElementById(
            "formClinica"
        );


    if (formulario) {

        formulario.reset();

    }


    const id =
        document.getElementById(
            "clinicaId"
        );


    if (id) {

        id.value = "";

    }


    const titulo =
        document.getElementById(
            "tituloModalClinica"
        );


    if (titulo) {

        titulo.textContent =
            "Nova Clínica";

    }


    const status =
        document.getElementById(
            "areaStatusClinica"
        );


    if (status) {

        status.classList.add("hidden");

    }


    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (container) {

        container.innerHTML = "";

    }


    await popularRegioesClinica();


    if (modal) {

        modal.classList.remove("hidden");

    }

}


// ======================================
// FECHAR MODAL
// ======================================

function fecharModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (modal) {

        modal.classList.add("hidden");

    }

}


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "clinicaId"
        ).value;


    const nome =
        document.getElementById(
            "clinicaNome"
        ).value.trim();


    const endereco =
        document.getElementById(
            "clinicaEndereco"
        ).value.trim();


    const telefone =
        document.getElementById(
            "clinicaTelefone"
        ).value.trim();


    const bairroId =
        document.getElementById(
            "clinicaBairro"
        ).value;


    const ativoElemento =
        document.getElementById(
            "clinicaAtivo"
        );


    const ativo =
        ativoElemento
            ? ativoElemento.checked
            : true;


    if (
        !nome ||
        !endereco ||
        !bairroId
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }


    const dados = {

        nome,
        endereco,
        telefone,
        bairro_id: bairroId

    };


    try {

        if (id) {

            dados.ativo = ativo;


            const {
                error
            } = await supabaseClient
                .from("clinicas")
                .update(dados)
                .eq("id", id);


            if (error) throw error;


            alert(
                "Clínica atualizada com sucesso!"
            );

        } else {

            dados.ativo = true;


            const {
                error
            } = await supabaseClient
                .from("clinicas")
                .insert([dados]);


            if (error) throw error;


            alert(
                "Clínica cadastrada com sucesso!"
            );

        }


        fecharModalClinica();

        listarClinicas();

        carregarDashboard();

    } catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao salvar clínica."
        );

    }

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id) {

    try {

        const {
            data: clinica,
            error
        } = await supabaseClient
            .from("clinicas")
            .select("*")
            .eq("id", id)
            .single();


        if (error) throw error;


        document.getElementById(
            "clinicaId"
        ).value = clinica.id;


        document.getElementById(
            "clinicaNome"
        ).value = clinica.nome || "";


        document.getElementById(
            "clinicaEndereco"
        ).value = clinica.endereco || "";


        document.getElementById(
            "clinicaTelefone"
        ).value = clinica.telefone || "";


        const titulo =
            document.getElementById(
                "tituloModalClinica"
            );


        if (titulo) {

            titulo.textContent =
                "Editar Clínica";

        }


        const areaStatus =
            document.getElementById(
                "areaStatusClinica"
            );


        if (areaStatus) {

            areaStatus.classList.remove(
                "hidden"
            );

        }


        const checkbox =
            document.getElementById(
                "clinicaAtivo"
            );


        if (checkbox) {

            checkbox.checked =
                clinica.ativo;

        }


        await popularRegioesClinica();


        await selecionarLocalizacaoClinica(
            clinica.bairro_id
        );


        document.getElementById(
            "modalClinica"
        ).classList.remove(
            "hidden"
        );

    } catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao carregar clínica."
        );

    }

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


    try {

        const {
            error
        } = await supabaseClient
            .from("clinicas")
            .delete()
            .eq("id", id);


        if (error) throw error;


        alert(
            "Clínica excluída com sucesso!"
        );


        listarClinicas();

        carregarDashboard();

    } catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao excluir clínica."
        );

    }

}


// ======================================
// POPULAR REGIÕES CLÍNICA
// ======================================

async function popularRegioesClinica() {

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


    select.innerHTML = `
        <option value="">
            Selecione uma região
        </option>
    `;


    data.forEach((regiao) => {

        select.innerHTML += `
            <option value="${regiao.id}">
                ${regiao.nome}
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
        ).value;


    const select =
        document.getElementById(
            "clinicaEstado"
        );


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


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


    data.forEach((estado) => {

        select.innerHTML += `
            <option value="${estado.id}">
                ${estado.nome}
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
        ).value;


    const select =
        document.getElementById(
            "clinicaCidade"
        );


    select.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


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


    data.forEach((cidade) => {

        select.innerHTML += `
            <option value="${cidade.id}">
                ${cidade.nome}
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
        ).value;


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


    data.forEach((bairro) => {

        select.innerHTML += `
            <option value="${bairro.id}">
                ${bairro.nome}
            </option>
        `;

    });

}


// ======================================
// SELECIONAR LOCALIZAÇÃO NA EDIÇÃO
// ======================================

async function selecionarLocalizacaoClinica(
    bairroId
) {

    if (!bairroId) return;


    const {
        data: bairro,
        error
    } = await supabaseClient
        .from("bairros")
        .select(`
            *,
            cidades (
                *,
                estados (
                    *
                )
            )
        `)
        .eq("id", bairroId)
        .single();


    if (error) {

        console.error(error);

        return;

    }


    const cidade =
        bairro.cidades;


    const estado =
        cidade.estados;


    document.getElementById(
        "clinicaRegiao"
    ).value =
        estado.regiao_id;


    await carregarEstadosClinica();


    document.getElementById(
        "clinicaEstado"
    ).value =
        estado.id;


    await carregarCidadesClinica();


    document.getElementById(
        "clinicaCidade"
    ).value =
        cidade.id;


    await carregarBairrosClinica();


    document.getElementById(
        "clinicaBairro"
    ).value =
        bairro.id;

}


// ======================================
// ESPECIALIDADES
// ======================================

async function listarEspecialidades() {

    const lista =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) return;


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


    if (
        !data ||
        data.length === 0
    ) {

        lista.innerHTML =
            "<p>Nenhuma especialidade cadastrada.</p>";

        return;

    }


    lista.innerHTML =
        data.map((item) => `

            <div class="item-gerenciamento">

                <span>
                    🦷 ${item.nome}
                </span>


                <div class="acoes-tabela">

                    <button
                        class="btn-acao btn-editar"
                        onclick="editarEspecialidade('${item.id}', '${item.nome.replace(/'/g, "\\'")}')"
                        title="Editar"
                    >
                        ✏️
                    </button>


                    <button
                        class="btn-acao btn-excluir"
                        onclick="excluirEspecialidade('${item.id}')"
                        title="Excluir"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `).join("");

}


// ======================================
// SALVAR ESPECIALIDADE
// ======================================

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


    try {

        if (id.value) {

            const {
                error
            } = await supabaseClient
                .from("especialidades")
                .update({ nome })
                .eq(
                    "id",
                    id.value
                );


            if (error) throw error;


            alert(
                "Especialidade atualizada!"
            );

        } else {

            const {
                error
            } = await supabaseClient
                .from("especialidades")
                .insert([{ nome }]);


            if (error) throw error;


            alert(
                "Especialidade cadastrada!"
            );

        }


        input.value = "";

        id.value = "";


        listarEspecialidades();

        carregarDashboard();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao salvar especialidade."
        );

    }

}


// ======================================
// EDITAR ESPECIALIDADE
// ======================================

function editarEspecialidade(
    id,
    nome
) {

    document.getElementById(
        "especialidadeEditId"
    ).value = id;


    document.getElementById(
        "nomeEspecialidade"
    ).value = nome;


    document.getElementById(
        "nomeEspecialidade"
    ).focus();

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


    const {
        error
    } = await supabaseClient
        .from("especialidades")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir."
        );

        return;

    }


    listarEspecialidades();

    carregarDashboard();

}


// ======================================
// REGIÕES
// ======================================

async function listarRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );


    if (!lista) return;


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


    lista.innerHTML =
        data.map((item) => `

            <div class="item-gerenciamento">

                <span>
                    🌎 ${item.nome}
                </span>


                <div class="acoes-tabela">

                    <button
                        class="btn-acao btn-editar"
                        onclick="editarRegiao('${item.id}', '${item.nome.replace(/'/g, "\\'")}')"
                        title="Editar"
                    >
                        ✏️
                    </button>


                    <button
                        class="btn-acao btn-excluir"
                        onclick="excluirRegiao('${item.id}')"
                        title="Excluir"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `).join("");

}


// ======================================
// SALVAR REGIÃO
// ======================================

async function salvarRegiao() {

    const input =
        document.getElementById(
            "nomeRegiao"
        );


    const id =
        document.getElementById(
            "regiaoEditId"
        );


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da região."
        );

        return;

    }


    try {

        if (id.value) {

            await supabaseClient
                .from("regioes")
                .update({ nome })
                .eq(
                    "id",
                    id.value
                );

        } else {

            await supabaseClient
                .from("regioes")
                .insert([{ nome }]);

        }


        input.value = "";

        id.value = "";


        listarRegioes();

        popularRegioes();

        carregarDashboard();

    } catch (erro) {

        console.error(erro);

    }

}


// ======================================
// EDITAR REGIÃO
// ======================================

function editarRegiao(
    id,
    nome
) {

    document.getElementById(
        "regiaoEditId"
    ).value = id;


    document.getElementById(
        "nomeRegiao"
    ).value = nome;

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

    if (
        !confirm(
            "Deseja excluir esta região?"
        )
    ) return;


    const {
        error
    } = await supabaseClient
        .from("regioes")
        .delete()
        .eq("id", id);


    if (error) {

        alert(
            "Não foi possível excluir esta região."
        );

        console.error(error);

        return;

    }


    listarRegioes();

    popularRegioes();

    carregarDashboard();

}


// ======================================
// ESTADOS
// ======================================

async function listarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


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


    lista.innerHTML =
        data.map((item) => `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        📍 ${item.nome}
                    </strong>

                    <small>
                        ${item.regioes?.nome || ""}
                    </small>

                </div>


                <div class="acoes-tabela">

                    <button
                        class="btn-acao btn-editar"
                        onclick="editarEstado('${item.id}', '${item.nome.replace(/'/g, "\\'")}', '${item.regiao_id}')"
                        title="Editar"
                    >
                        ✏️
                    </button>


                    <button
                        class="btn-acao btn-excluir"
                        onclick="excluirEstado('${item.id}')"
                        title="Excluir"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `).join("");

}


// ======================================
// POPULAR REGIÕES
// ======================================

async function popularRegioes() {

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


    if (error) return;


    select.innerHTML = `
        <option value="">
            Selecione uma região
        </option>
    `;


    data.forEach((item) => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// SALVAR ESTADO
// ======================================

async function salvarEstado() {

    const nome =
        document.getElementById(
            "nomeEstado"
        ).value.trim();


    const regiaoId =
        document.getElementById(
            "estadoRegiao"
        ).value;


    const id =
        document.getElementById(
            "estadoEditId"
        ).value;


    if (
        !nome ||
        !regiaoId
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,

        regiao_id: regiaoId

    };


    try {

        if (id) {

            await supabaseClient
                .from("estados")
                .update(dados)
                .eq("id", id);

        } else {

            await supabaseClient
                .from("estados")
                .insert([dados]);

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


        listarEstados();

        popularEstados();

        carregarDashboard();

    } catch (erro) {

        console.error(erro);

    }

}


// ======================================
// EDITAR ESTADO
// ======================================

function editarEstado(
    id,
    nome,
    regiaoId
) {

    document.getElementById(
        "estadoEditId"
    ).value = id;


    document.getElementById(
        "nomeEstado"
    ).value = nome;


    document.getElementById(
        "estadoRegiao"
    ).value = regiaoId;

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


    const {
        error
    } = await supabaseClient
        .from("estados")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir."
        );

        return;

    }


    listarEstados();

    popularEstados();

    carregarDashboard();

}


// ======================================
// CIDADES
// ======================================

async function listarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select(`
            *,
            estados(nome)
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML =
        data.map((item) => `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        🏙 ${item.nome}
                    </strong>

                    <small>
                        ${item.estados?.nome || ""}
                    </small>

                </div>


                <div class="acoes-tabela">

                    <button
                        class="btn-acao btn-editar"
                        onclick="editarCidade('${item.id}', '${item.nome.replace(/'/g, "\\'")}', '${item.estado_id}')"
                        title="Editar"
                    >
                        ✏️
                    </button>


                    <button
                        class="btn-acao btn-excluir"
                        onclick="excluirCidade('${item.id}')"
                        title="Excluir"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `).join("");

}


// ======================================
// POPULAR ESTADOS
// ======================================

async function popularEstados() {

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


    if (error) return;


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    data.forEach((item) => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// SALVAR CIDADE
// ======================================

async function salvarCidade() {

    const nome =
        document.getElementById(
            "nomeCidade"
        ).value.trim();


    const estadoId =
        document.getElementById(
            "cidadeEstado"
        ).value;


    const id =
        document.getElementById(
            "cidadeEditId"
        ).value;


    if (
        !nome ||
        !estadoId
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,

        estado_id: estadoId

    };


    try {

        if (id) {

            await supabaseClient
                .from("cidades")
                .update(dados)
                .eq("id", id);

        } else {

            await supabaseClient
                .from("cidades")
                .insert([dados]);

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


        listarCidades();

        popularCidades();

        carregarDashboard();

    } catch (erro) {

        console.error(erro);

    }

}


// ======================================
// EDITAR CIDADE
// ======================================

function editarCidade(
    id,
    nome,
    estadoId
) {

    document.getElementById(
        "cidadeEditId"
    ).value = id;


    document.getElementById(
        "nomeCidade"
    ).value = nome;


    document.getElementById(
        "cidadeEstado"
    ).value = estadoId;

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


    const {
        error
    } = await supabaseClient
        .from("cidades")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir."
        );

        return;

    }


    listarCidades();

    popularCidades();

    carregarDashboard();

}


// ======================================
// BAIRROS
// ======================================

async function listarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("bairros")
        .select(`
            *,
            cidades(nome)
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    lista.innerHTML =
        data.map((item) => `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        🏘 ${item.nome}
                    </strong>

                    <small>
                        ${item.cidades?.nome || ""}
                    </small>

                </div>


                <div class="acoes-tabela">

                    <button
                        class="btn-acao btn-editar"
                        onclick="editarBairro('${item.id}', '${item.nome.replace(/'/g, "\\'")}', '${item.cidade_id}')"
                        title="Editar"
                    >
                        ✏️
                    </button>


                    <button
                        class="btn-acao btn-excluir"
                        onclick="excluirBairro('${item.id}')"
                        title="Excluir"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `).join("");

}


// ======================================
// POPULAR CIDADES
// ======================================

async function popularCidades() {

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


    if (error) return;


    select.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


    data.forEach((item) => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nome}
            </option>
        `;

    });

}


// ======================================
// SALVAR BAIRRO
// ======================================

async function salvarBairro() {

    const nome =
        document.getElementById(
            "nomeBairro"
        ).value.trim();


    const cidadeId =
        document.getElementById(
            "bairroCidade"
        ).value;


    const id =
        document.getElementById(
            "bairroEditId"
        ).value;


    if (
        !nome ||
        !cidadeId
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const dados = {

        nome,

        cidade_id: cidadeId

    };


    try {

        if (id) {

            await supabaseClient
                .from("bairros")
                .update(dados)
                .eq("id", id);

        } else {

            await supabaseClient
                .from("bairros")
                .insert([dados]);

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


        listarBairros();

        carregarDashboard();

    } catch (erro) {

        console.error(erro);

    }

}


// ======================================
// EDITAR BAIRRO
// ======================================

function editarBairro(
    id,
    nome,
    cidadeId
) {

    document.getElementById(
        "bairroEditId"
    ).value = id;


    document.getElementById(
        "nomeBairro"
    ).value = nome;


    document.getElementById(
        "bairroCidade"
    ).value = cidadeId;

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


    const {
        error
    } = await supabaseClient
        .from("bairros")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Não foi possível excluir."
        );

        return;

    }


    listarBairros();

    carregarDashboard();

}


// ======================================
// ADICIONAR LINHA ESPECIALIDADE
// ======================================

async function adicionarLinhaEspecialidade() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


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


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    linha.innerHTML = `

        <select class="select-especialidade">

            <option value="">
                Selecione uma especialidade
            </option>

            ${data.map((item) => `
                <option value="${item.id}">
                    ${item.nome}
                </option>
            `).join("")}

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
            title="Remover"
        >
            ×
        </button>

    `;


    const botaoRemover =
        linha.querySelector(
            ".btn-remover-especialidade"
        );


    botaoRemover.addEventListener(
        "click",
        () => {

            linha.remove();

        }
    );


    container.appendChild(linha);

}


// ======================================
// FECHAR MODAL AO CLICAR FORA
// ======================================

window.addEventListener(
    "click",
    (event) => {

        const modal =
            document.getElementById(
                "modalClinica"
            );


        if (
            modal &&
            event.target === modal
        ) {

            fecharModalClinica();

        }

    }
);


console.log(
    "admin.js carregado completamente!"
);
