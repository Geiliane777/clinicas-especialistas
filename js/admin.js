// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 1 DE 2
// ============================================================

console.log("admin.js carregado");


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const REDE_ESPECIALISTAS = "especialistas";
const REDE_SINDILEGIS = "sindilegis";


// ============================================================
// VERIFICAR LOGIN
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("adminLogado") !== "true") {

        window.location.href = "login.html";

        return;
    }

    inicializarAdmin();
});


// ============================================================
// INICIALIZAÇÃO
// ============================================================

async function inicializarAdmin() {

    atualizarData();

    configurarTema();

    configurarEventosAdmin();

    await carregarDashboard();

    carregarPaginaAtual();

    console.log(
        "Painel administrativo inicializado."
    );
}


// ============================================================
// EVENTOS DO ADMIN
// ============================================================

function configurarEventosAdmin() {

    // ========================================================
    // BOTÃO DE BUSCA DE CLÍNICAS
    // ========================================================

    const campoBusca =
        document.getElementById(
            "buscarClinica"
        );

    const filtroStatus =
        document.getElementById(
            "filtroStatusClinica"
        );


    if (campoBusca) {

        campoBusca.addEventListener(
            "input",
            () => {

                const paginaClinicas =
                    document.getElementById(
                        "pagina-clinicas"
                    );

                if (
                    paginaClinicas &&
                    paginaClinicas.classList.contains("ativa")
                ) {
                    listarClinicas();
                }

            }
        );
    }


    if (filtroStatus) {

        filtroStatus.addEventListener(
            "change",
            () => {

                const paginaClinicas =
                    document.getElementById(
                        "pagina-clinicas"
                    );

                if (
                    paginaClinicas &&
                    paginaClinicas.classList.contains("ativa")
                ) {
                    listarClinicas();
                }

            }
        );
    }


    // ========================================================
    // FORMULÁRIO DA CLÍNICA
    // ========================================================

    const formClinica =
        document.getElementById(
            "formClinica"
        );


    if (formClinica) {

        formClinica.addEventListener(
            "submit",
            salvarClinica
        );
    }


    // ========================================================
    // REGIÃO DA CLÍNICA
    // ========================================================

    const clinicaRegiao =
        document.getElementById(
            "clinicaRegiao"
        );


    if (clinicaRegiao) {

        clinicaRegiao.addEventListener(
            "change",
            () => {

                carregarEstadosClinica(
                    clinicaRegiao.value
                );

            }
        );
    }


    // ========================================================
    // ESTADO DA CLÍNICA
    // ========================================================

    const clinicaEstado =
        document.getElementById(
            "clinicaEstado"
        );


    if (clinicaEstado) {

        clinicaEstado.addEventListener(
            "change",
            () => {

                carregarCidadesClinica(
                    clinicaEstado.value
                );

            }
        );
    }


    // ========================================================
    // CIDADE DA CLÍNICA
    // ========================================================

    const clinicaCidade =
        document.getElementById(
            "clinicaCidade"
        );


    if (clinicaCidade) {

        clinicaCidade.addEventListener(
            "change",
            () => {

                carregarBairrosClinica(
                    clinicaCidade.value
                );

            }
        );
    }
}


// ============================================================
// DATA ATUAL
// ============================================================

function atualizarData() {

    const elemento =
        document.getElementById(
            "dataAtual"
        );


    if (!elemento) return;


    const agora =
        new Date();


    elemento.textContent =
        agora.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
}


// ============================================================
// NAVEGAÇÃO
// ============================================================

const TITULOS_PAGINA = {

    dashboard:
        "Dashboard",

    clinicas:
        "Clínicas",

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


const CARREGADORES_PAGINA = {

    dashboard:
        carregarDashboard,

    clinicas:
        listarClinicas,

    especialidades:
        carregarPaginaEspecialidades,

    regioes:
        carregarPaginaRegioes,

    estados:
        carregarPaginaEstados,

    cidades:
        carregarPaginaCidades,

    bairros:
        carregarPaginaBairros
};


// ============================================================
// MOSTRAR PÁGINA
// ============================================================

function mostrarPagina(nomePagina) {

    const paginas =
        document.querySelectorAll(
            ".pagina"
        );


    paginas.forEach(
        pagina => {

            pagina.classList.remove(
                "ativa"
            );

        }
    );


    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (!pagina) {

        console.error(
            "Página não encontrada:",
            nomePagina
        );

        return;
    }


    pagina.classList.add(
        "ativa"
    );


    // ========================================================
    // TÍTULO
    // ========================================================

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina] ||
            "Painel Administrativo";
    }


    // ========================================================
    // MENU ATIVO
    // ========================================================

    const botoesMenu =
        document.querySelectorAll(
            ".menu-btn"
        );


    botoesMenu.forEach(
        botao => {

            botao.classList.remove(
                "ativo"
            );


            if (
                botao.dataset.page ===
                nomePagina
            ) {

                botao.classList.add(
                    "ativo"
                );
            }

        }
    );


    // ========================================================
    // CARREGAR DADOS
    // ========================================================

    const carregador =
        CARREGADORES_PAGINA[
            nomePagina
        ];


    if (
        typeof carregador ===
        "function"
    ) {

        carregador();
    }
}


// ============================================================
// CARREGAR PÁGINA ATUAL
// ============================================================

function carregarPaginaAtual() {

    const paginaAtiva =
        document.querySelector(
            ".pagina.ativa"
        );


    if (!paginaAtiva) {

        mostrarPagina(
            "dashboard"
        );

        return;
    }


    const id =
        paginaAtiva.id.replace(
            "pagina-",
            ""
        );


    mostrarPagina(id);
}


// ============================================================
// TEMA
// ============================================================

function configurarTema() {

    const temaSalvo =
        localStorage.getItem(
            "temaAdmin"
        );


    if (
        temaSalvo === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );
    }
}


function alternarTema() {

    const escuro =
        document.body.classList.toggle(
            "dark"
        );


    localStorage.setItem(
        "temaAdmin",
        escuro
            ? "dark"
            : "light"
    );
}


// ============================================================
// VOLTAR AO SITE
// ============================================================

function voltarAoSite() {

    window.location.href =
        "index.html";
}


// ============================================================
// SAIR
// ============================================================

function sair() {

    const confirmar =
        confirm(
            "Deseja realmente sair do painel administrativo?"
        );


    if (!confirmar) return;


    localStorage.removeItem(
        "adminLogado"
    );


    window.location.href =
        "login.html";
}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";
    }


    return String(valor)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ============================================================
// DECODIFICAR HTML
// ============================================================

function decodeHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";
    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.innerHTML =
        valor;


    return textarea.value;
}


// ============================================================
// DEFINIR TEXTO
// ============================================================
// IMPORTANTE:
// Esta função fica ANTES do Dashboard para não existir
// mais o erro "definirTexto is not defined".
// ============================================================

function definirTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        console.warn(
            `Elemento #${id} não encontrado no HTML.`
        );

        return;
    }


    elemento.textContent =
        texto;
}


// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        const [

            regioes,

            estados,

            cidades,

            bairros,

            especialidades,

            clinicas

        ] = await Promise.all([

            // ==================================================
            // REGIÕES
            // ==================================================

            supabaseClient
                .from("regioes")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // ESTADOS
            // ==================================================

            supabaseClient
                .from("estados")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // CIDADES
            // ==================================================

            supabaseClient
                .from("cidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // BAIRROS
            // ==================================================

            supabaseClient
                .from("bairros")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // ESPECIALIDADES
            // ==================================================

            supabaseClient
                .from("especialidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),


            // ==================================================
            // CLÍNICAS
            // ==================================================
            // NÃO usamos:
            // created_at
            // numero
            // complemento
            // cep
            //
            // Assim evitamos o erro 400 caso essas colunas
            // não existam na tabela clinicas.
            // ==================================================

            supabaseClient
                .from("clinicas")
                .select(
                    "id, nome, ativo",
                    {
                        count: "exact"
                    }
                )
        ]);


        // ====================================================
        // VERIFICAR ERROS
        // ====================================================

        if (regioes.error) {
            throw regioes.error;
        }


        if (estados.error) {
            throw estados.error;
        }


        if (cidades.error) {
            throw cidades.error;
        }


        if (bairros.error) {
            throw bairros.error;
        }


        if (especialidades.error) {
            throw especialidades.error;
        }


        if (clinicas.error) {
            throw clinicas.error;
        }


        // ====================================================
        // TOTAIS
        // ====================================================

        definirTexto(
            "totalRegioes",
            regioes.count || 0
        );


        definirTexto(
            "totalEstados",
            estados.count || 0
        );


        definirTexto(
            "totalCidades",
            cidades.count || 0
        );


        definirTexto(
            "totalBairros",
            bairros.count || 0
        );


        definirTexto(
            "totalEspecialidades",
            especialidades.count || 0
        );


        // ====================================================
        // CLÍNICAS
        // ====================================================

        const listaClinicas =
            clinicas.data || [];


        const totalClinicas =
            clinicas.count ??
            listaClinicas.length;


        const ativas =
            listaClinicas.filter(
                clinica =>
                    clinica.ativo === true
            ).length;


        const inativas =
            listaClinicas.filter(
                clinica =>
                    clinica.ativo !== true
            ).length;


        definirTexto(
            "totalClinicas",
            totalClinicas
        );


        definirTexto(
            "totalClinicasAtivas",
            ativas
        );


        definirTexto(
            "totalClinicasInativas",
            inativas
        );


        // ====================================================
        // PORCENTAGEM
        // ====================================================

        const porcentagem =
            totalClinicas > 0
                ? Math.round(
                    (
                        ativas /
                        totalClinicas
                    ) * 100
                )
                : 0;


        definirTexto(
            "porcentagemAtivas",
            `${porcentagem}%`
        );


        // ====================================================
        // BARRA
        // ====================================================

        const barra =
            document.getElementById(
                "barraAtivas"
            );


        if (barra) {

            barra.style.width =
                `${porcentagem}%`;
        }


        // ====================================================
        // LEGENDAS
        // ====================================================

        definirTexto(
            "legendaAtivas",
            `Ativas: ${ativas}`
        );


        definirTexto(
            "legendaInativas",
            `Inativas: ${inativas}`
        );


        // ====================================================
        // ÚLTIMAS CLÍNICAS
        // ====================================================

        carregarUltimasClinicas(
            listaClinicas.slice(
                0,
                5
            )
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );


        definirTexto(
            "totalRegioes",
            "0"
        );

        definirTexto(
            "totalEstados",
            "0"
        );

        definirTexto(
            "totalCidades",
            "0"
        );

        definirTexto(
            "totalBairros",
            "0"
        );

        definirTexto(
            "totalEspecialidades",
            "0"
        );

        definirTexto(
            "totalClinicas",
            "0"
        );

        definirTexto(
            "totalClinicasAtivas",
            "0"
        );

        definirTexto(
            "totalClinicasInativas",
            "0"
        );

        definirTexto(
            "porcentagemAtivas",
            "0%"
        );
    }
}


// ============================================================
// ÚLTIMAS CLÍNICAS
// ============================================================

function carregarUltimasClinicas(
    clinicas
) {

    const container =
        document.getElementById(
            "ultimasClinicas"
        );


    if (!container) return;


    if (
        !clinicas ||
        !clinicas.length
    ) {

        container.innerHTML = `
            <p class="sem-dados">
                Nenhuma clínica cadastrada.
            </p>
        `;

        return;
    }


    container.innerHTML =
        clinicas.map(
            clinica => {

                const ativa =
                    clinica.ativo === true;


                const status =
                    ativa
                        ? "Ativa"
                        : "Inativa";


                const classe =
                    ativa
                        ? "ativo"
                        : "inativo";


                return `
                    <div class="clinica-recente">

                        <div>
                            <strong>
                                ${escaparHTML(
                                    clinica.nome ||
                                    "Sem nome"
                                )}
                            </strong>
                        </div>

                        <span class="status ${classe}">
                            ${status}
                        </span>

                    </div>
                `;

            }
        ).join("");
}


// ============================================================
// ESPECIALIDADES
// ============================================================

async function carregarPaginaEspecialidades() {

    const lista =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="3">
                Carregando...
            </td>
        </tr>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("especialidades")
            .select(
                "id, nome"
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        if (
            !data ||
            !data.length
        ) {

            lista.innerHTML = `
                <tr>
                    <td colspan="3">
                        Nenhuma especialidade cadastrada.
                    </td>
                </tr>
            `;

            return;
        }


        lista.innerHTML =
            data.map(
                especialidade => {

                    return `
                        <tr>

                            <td>
                                ${escaparHTML(
                                    especialidade.nome
                                )}
                            </td>

                            <td class="acoes-tabela">

                                <button
                                    type="button"
                                    class="btn-editar"
                                    onclick="editarEspecialidade(
                                        '${especialidade.id}',
                                        '${escaparHTML(
                                            especialidade.nome
                                        )}'
                                    )"
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn-excluir"
                                    onclick="excluirEspecialidade(
                                        '${especialidade.id}'
                                    )"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades:",
            erro
        );


        lista.innerHTML = `
            <tr>
                <td colspan="3">
                    Erro ao carregar especialidades.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// SALVAR ESPECIALIDADE
// ============================================================

async function salvarEspecialidade() {

    const id =
        document.getElementById(
            "especialidadeEditId"
        )?.value || "";


    const input =
        document.getElementById(
            "nomeEspecialidade"
        );


    if (!input) return;


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da especialidade."
        );

        return;
    }


    try {

        // ====================================================
        // EDITAR
        // ====================================================

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("especialidades")
                .update({
                    nome: nome
                })
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }


            alert(
                "Especialidade atualizada com sucesso."
            );


        } else {

            // =================================================
            // VERIFICAR DUPLICIDADE
            // =================================================

            const {
                data: existente,
                error: erroBusca
            } = await supabaseClient
                .from("especialidades")
                .select(
                    "id"
                )
                .ilike(
                    "nome",
                    nome
                )
                .limit(1);


            if (erroBusca) {
                throw erroBusca;
            }


            if (
                existente &&
                existente.length
            ) {

                alert(
                    "Essa especialidade já está cadastrada."
                );

                return;
            }


            // =================================================
            // INSERIR
            // =================================================

            const {
                error
            } = await supabaseClient
                .from("especialidades")
                .insert({
                    nome: nome
                });


            if (error) {
                throw error;
            }


            alert(
                "Especialidade cadastrada com sucesso."
            );
        }


        limparFormularioEspecialidade();


        await carregarPaginaEspecialidades();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar especialidade:",
            erro
        );


        alert(
            "Erro ao salvar especialidade."
        );
    }
}


// ============================================================
// EDITAR ESPECIALIDADE
// ============================================================

function editarEspecialidade(
    id,
    nome
) {

    const campoId =
        document.getElementById(
            "especialidadeEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeEspecialidade"
        );


    if (
        !campoId ||
        !campoNome
    ) {
        return;
    }


    campoId.value =
        id;


    campoNome.value =
        decodeHTML(nome);


    campoNome.focus();
}


// ============================================================
// LIMPAR ESPECIALIDADE
// ============================================================

function limparFormularioEspecialidade() {

    const id =
        document.getElementById(
            "especialidadeEditId"
        );


    const nome =
        document.getElementById(
            "nomeEspecialidade"
        );


    if (id) {
        id.value = "";
    }


    if (nome) {
        nome.value = "";
    }
}


// ============================================================
// EXCLUIR ESPECIALIDADE
// ============================================================

async function excluirEspecialidade(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta especialidade?"
        );


    if (!confirmar) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("especialidades")
            .delete()
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        alert(
            "Especialidade excluída com sucesso."
        );


        await carregarPaginaEspecialidades();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir especialidade:",
            erro
        );


        alert(
            "Não foi possível excluir a especialidade. " +
            "Verifique se ela está vinculada a alguma clínica."
        );
    }
}


// ============================================================
// REGIÕES
// ============================================================

async function carregarPaginaRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );


    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="3">
                Carregando...
            </td>
        </tr>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select(
                "id, nome"
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        if (!data?.length) {

            lista.innerHTML = `
                <tr>
                    <td colspan="3">
                        Nenhuma região cadastrada.
                    </td>
                </tr>
            `;

            return;
        }


        lista.innerHTML =
            data.map(
                regiao => {

                    return `
                        <tr>

                            <td>
                                ${escaparHTML(
                                    regiao.nome
                                )}
                            </td>

                            <td class="acoes-tabela">

                                <button
                                    type="button"
                                    class="btn-editar"
                                    onclick="editarRegiao(
                                        '${regiao.id}',
                                        '${escaparHTML(
                                            regiao.nome
                                        )}'
                                    )"
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn-excluir"
                                    onclick="excluirRegiao(
                                        '${regiao.id}'
                                    )"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar regiões:",
            erro
        );


        lista.innerHTML = `
            <tr>
                <td colspan="3">
                    Erro ao carregar regiões.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// SALVAR REGIÃO
// ============================================================

async function salvarRegiao() {

    const id =
        document.getElementById(
            "regiaoEditId"
        )?.value || "";


    const nome =
        document.getElementById(
            "nomeRegiao"
        )?.value.trim() || "";


    if (!nome) {

        alert(
            "Digite o nome da região."
        );

        return;
    }


    try {

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("regioes")
                .update({
                    nome: nome
                })
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }


            alert(
                "Região atualizada com sucesso."
            );


        } else {

            const {
                data: existente,
                error: erroBusca
            } = await supabaseClient
                .from("regioes")
                .select(
                    "id"
                )
                .ilike(
                    "nome",
                    nome
                )
                .limit(1);


            if (erroBusca) {
                throw erroBusca;
            }


            if (
                existente &&
                existente.length
            ) {

                alert(
                    "Essa região já está cadastrada."
                );

                return;
            }


            const {
                error
            } = await supabaseClient
                .from("regioes")
                .insert({
                    nome: nome
                });


            if (error) {
                throw error;
            }


            alert(
                "Região cadastrada com sucesso."
            );
        }


        limparFormularioRegiao();


        await carregarPaginaRegioes();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar região:",
            erro
        );


        alert(
            "Erro ao salvar região."
        );
    }
}


// ============================================================
// EDITAR REGIÃO
// ============================================================

function editarRegiao(
    id,
    nome
) {

    const campoId =
        document.getElementById(
            "regiaoEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeRegiao"
        );


    if (
        !campoId ||
        !campoNome
    ) {
        return;
    }


    campoId.value =
        id;


    campoNome.value =
        decodeHTML(nome);


    campoNome.focus();
}


// ============================================================
// LIMPAR REGIÃO
// ============================================================

function limparFormularioRegiao() {

    const id =
        document.getElementById(
            "regiaoEditId"
        );


    const nome =
        document.getElementById(
            "nomeRegiao"
        );


    if (id) {
        id.value = "";
    }


    if (nome) {
        nome.value = "";
    }
}


// ============================================================
// EXCLUIR REGIÃO
// ============================================================

async function excluirRegiao(
    id
) {

    const confirmar =
        confirm(
            "ATENÇÃO!\n\n" +
            "Excluir esta região poderá afetar " +
            "estados, cidades, bairros e clínicas " +
            "vinculados a ela.\n\n" +
            "Deseja continuar?"
        );


    if (!confirmar) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("regioes")
            .delete()
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        alert(
            "Região excluída com sucesso."
        );


        await carregarPaginaRegioes();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir região:",
            erro
        );


        alert(
            "Não foi possível excluir a região. " +
            "Verifique se existem registros vinculados."
        );
    }
}


// ============================================================
// ESTADOS
// ============================================================

async function carregarPaginaEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="4">
                Carregando...
            </td>
        </tr>
    `;


    await popularSelectRegioes(
        "estadoRegiao"
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select(`
                id,
                nome,
                regiao_id,

                regioes (
                    id,
                    nome
                )
            `)
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        if (!data?.length) {

            lista.innerHTML = `
                <tr>
                    <td colspan="4">
                        Nenhum estado cadastrado.
                    </td>
                </tr>
            `;

            return;
        }


        lista.innerHTML =
            data.map(
                estado => {

                    return `
                        <tr>

                            <td>
                                ${escaparHTML(
                                    estado.nome
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    estado.regioes?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td class="acoes-tabela">

                                <button
                                    type="button"
                                    class="btn-editar"
                                    onclick="editarEstado(
                                        '${estado.id}',
                                        '${escaparHTML(
                                            estado.nome
                                        )}',
                                        '${estado.regiao_id || ""}'
                                    )"
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn-excluir"
                                    onclick="excluirEstado(
                                        '${estado.id}'
                                    )"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar estados:",
            erro
        );


        lista.innerHTML = `
            <tr>
                <td colspan="4">
                    Erro ao carregar estados.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// POPULAR REGIÕES
// ============================================================

async function popularSelectRegioes(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) return;


    const valorAtual =
        select.value;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select(
                "id, nome"
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        select.innerHTML = `
            <option value="">
                Selecione a Região
            </option>
        `;


        (data || []).forEach(
            regiao => {

                select.innerHTML += `
                    <option
                        value="${regiao.id}"
                    >
                        ${escaparHTML(
                            regiao.nome
                        )}
                    </option>
                `;

            }
        );


        if (valorAtual) {
            select.value =
                valorAtual;
        }


    } catch (erro) {

        console.error(
            "Erro ao carregar regiões:",
            erro
        );
    }
}


// ============================================================
// SALVAR ESTADO
// ============================================================

async function salvarEstado() {

    const id =
        document.getElementById(
            "estadoEditId"
        )?.value || "";


    const nome =
        document.getElementById(
            "nomeEstado"
        )?.value.trim() || "";


    const regiaoId =
        document.getElementById(
            "estadoRegiao"
        )?.value || "";


    if (!nome) {

        alert(
            "Digite o nome do estado."
        );

        return;
    }


    if (!regiaoId) {

        alert(
            "Selecione a região."
        );

        return;
    }


    try {

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("estados")
                .update({
                    nome: nome,
                    regiao_id: regiaoId
                })
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }


            alert(
                "Estado atualizado com sucesso."
            );


        } else {

            const {
                data: existente,
                error: erroBusca
            } = await supabaseClient
                .from("estados")
                .select(
                    "id"
                )
                .eq(
                    "regiao_id",
                    regiaoId
                )
                .ilike(
                    "nome",
                    nome
                )
                .limit(1);


            if (erroBusca) {
                throw erroBusca;
            }


            if (
                existente &&
                existente.length
            ) {

                alert(
                    "Esse estado já está cadastrado nesta região."
                );

                return;
            }


            const {
                error
            } = await supabaseClient
                .from("estados")
                .insert({
                    nome: nome,
                    regiao_id: regiaoId
                });


            if (error) {
                throw error;
            }


            alert(
                "Estado cadastrado com sucesso."
            );
        }


        limparFormularioEstado();


        await carregarPaginaEstados();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar estado:",
            erro
        );


        alert(
            "Erro ao salvar estado."
        );
    }
}


// ============================================================
// EDITAR ESTADO
// ============================================================

async function editarEstado(
    id,
    nome,
    regiaoId
) {

    await popularSelectRegioes(
        "estadoRegiao"
    );


    const campoId =
        document.getElementById(
            "estadoEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeEstado"
        );


    const campoRegiao =
        document.getElementById(
            "estadoRegiao"
        );


    if (
        !campoId ||
        !campoNome ||
        !campoRegiao
    ) {
        return;
    }


    campoId.value =
        id;


    campoNome.value =
        decodeHTML(nome);


    campoRegiao.value =
        regiaoId || "";


    campoNome.focus();
}


// ============================================================
// LIMPAR ESTADO
// ============================================================

function limparFormularioEstado() {

    const id =
        document.getElementById(
            "estadoEditId"
        );


    const nome =
        document.getElementById(
            "nomeEstado"
        );


    const regiao =
        document.getElementById(
            "estadoRegiao"
        );


    if (id) {
        id.value = "";
    }


    if (nome) {
        nome.value = "";
    }


    if (regiao) {
        regiao.value = "";
    }
}


// ============================================================
// EXCLUIR ESTADO
// ============================================================

async function excluirEstado(
    id
) {

    const confirmar =
        confirm(
            "ATENÇÃO!\n\n" +
            "Excluir este estado poderá afetar " +
            "cidades, bairros e clínicas vinculados.\n\n" +
            "Deseja continuar?"
        );


    if (!confirmar) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("estados")
            .delete()
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        alert(
            "Estado excluído com sucesso."
        );


        await carregarPaginaEstados();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir estado:",
            erro
        );


        alert(
            "Não foi possível excluir o estado. " +
            "Verifique se existem cidades vinculadas."
        );
    }
}


// ============================================================
// CIDADES
// ============================================================

async function carregarPaginaCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="4">
                Carregando...
            </td>
        </tr>
    `;


    await popularSelectEstados(
        "cidadeEstado"
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select(`
                id,
                nome,
                estado_id,

                estados (
                    id,
                    nome,

                    regioes (
                        id,
                        nome
                    )
                )
            `)
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        if (!data?.length) {

            lista.innerHTML = `
                <tr>
                    <td colspan="4">
                        Nenhuma cidade cadastrada.
                    </td>
                </tr>
            `;

            return;
        }


        lista.innerHTML =
            data.map(
                cidade => {

                    return `
                        <tr>

                            <td>
                                ${escaparHTML(
                                    cidade.nome
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    cidade.estados?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    cidade.estados?.regioes?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td class="acoes-tabela">

                                <button
                                    type="button"
                                    class="btn-editar"
                                    onclick="editarCidade(
                                        '${cidade.id}',
                                        '${escaparHTML(
                                            cidade.nome
                                        )}',
                                        '${cidade.estado_id || ""}'
                                    )"
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn-excluir"
                                    onclick="excluirCidade(
                                        '${cidade.id}'
                                    )"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
            erro
        );


        lista.innerHTML = `
            <tr>
                <td colspan="4">
                    Erro ao carregar cidades.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// POPULAR ESTADOS
// ============================================================

async function popularSelectEstados(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) return;


    const valorAtual =
        select.value;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select(
                "id, nome, regiao_id"
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        select.innerHTML = `
            <option value="">
                Selecione o Estado
            </option>
        `;


        (data || []).forEach(
            estado => {

                select.innerHTML += `
                    <option
                        value="${estado.id}"
                    >
                        ${escaparHTML(
                            estado.nome
                        )}
                    </option>
                `;

            }
        );


        if (valorAtual) {
            select.value =
                valorAtual;
        }


    } catch (erro) {

        console.error(
            "Erro ao carregar estados:",
            erro
        );
    }
}


// ============================================================
// SALVAR CIDADE
// ============================================================

async function salvarCidade() {

    const id =
        document.getElementById(
            "cidadeEditId"
        )?.value || "";


    const nome =
        document.getElementById(
            "nomeCidade"
        )?.value.trim() || "";


    const estadoId =
        document.getElementById(
            "cidadeEstado"
        )?.value || "";


    if (!nome) {

        alert(
            "Digite o nome da cidade."
        );

        return;
    }


    if (!estadoId) {

        alert(
            "Selecione o estado."
        );

        return;
    }


    try {

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("cidades")
                .update({
                    nome: nome,
                    estado_id: estadoId
                })
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }


            alert(
                "Cidade atualizada com sucesso."
            );


        } else {

            const {
                data: existente,
                error: erroBusca
            } = await supabaseClient
                .from("cidades")
                .select(
                    "id"
                )
                .eq(
                    "estado_id",
                    estadoId
                )
                .ilike(
                    "nome",
                    nome
                )
                .limit(1);


            if (erroBusca) {
                throw erroBusca;
            }


            if (
                existente &&
                existente.length
            ) {

                alert(
                    "Essa cidade já está cadastrada neste estado."
                );

                return;
            }


            const {
                error
            } = await supabaseClient
                .from("cidades")
                .insert({
                    nome: nome,
                    estado_id: estadoId
                });


            if (error) {
                throw error;
            }


            alert(
                "Cidade cadastrada com sucesso."
            );
        }


        limparFormularioCidade();


        await carregarPaginaCidades();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar cidade:",
            erro
        );


        alert(
            "Erro ao salvar cidade."
        );
    }
}


// ============================================================
// EDITAR CIDADE
// ============================================================

async function editarCidade(
    id,
    nome,
    estadoId
) {

    await popularSelectEstados(
        "cidadeEstado"
    );


    const campoId =
        document.getElementById(
            "cidadeEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeCidade"
        );


    const campoEstado =
        document.getElementById(
            "cidadeEstado"
        );


    if (
        !campoId ||
        !campoNome ||
        !campoEstado
    ) {
        return;
    }


    campoId.value =
        id;


    campoNome.value =
        decodeHTML(nome);


    campoEstado.value =
        estadoId || "";


    campoNome.focus();
}


// ============================================================
// LIMPAR CIDADE
// ============================================================

function limparFormularioCidade() {

    const id =
        document.getElementById(
            "cidadeEditId"
        );


    const nome =
        document.getElementById(
            "nomeCidade"
        );


    const estado =
        document.getElementById(
            "cidadeEstado"
        );


    if (id) {
        id.value = "";
    }


    if (nome) {
        nome.value = "";
    }


    if (estado) {
        estado.value = "";
    }
}


// ============================================================
// EXCLUIR CIDADE
// ============================================================

async function excluirCidade(
    id
) {

    const confirmar =
        confirm(
            "ATENÇÃO!\n\n" +
            "Excluir esta cidade poderá afetar " +
            "bairros e clínicas vinculados.\n\n" +
            "Deseja continuar?"
        );


    if (!confirmar) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("cidades")
            .delete()
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        alert(
            "Cidade excluída com sucesso."
        );


        await carregarPaginaCidades();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir cidade:",
            erro
        );


        alert(
            "Não foi possível excluir a cidade. " +
            "Verifique se existem bairros vinculados."
        );
    }
}


// ============================================================
// BAIRROS
// ============================================================

async function carregarPaginaBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="5">
                Carregando...
            </td>
        </tr>
    `;


    await popularSelectCidades(
        "bairroCidade"
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select(`
                id,
                nome,
                cidade_id,

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
            `)
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        if (!data?.length) {

            lista.innerHTML = `
                <tr>
                    <td colspan="5">
                        Nenhum bairro cadastrado.
                    </td>
                </tr>
            `;

            return;
        }


        lista.innerHTML =
            data.map(
                bairro => {

                    const cidade =
                        bairro.cidades;


                    const estado =
                        cidade?.estados;


                    const regiao =
                        estado?.regioes;


                    return `
                        <tr>

                            <td>
                                ${escaparHTML(
                                    bairro.nome
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    cidade?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    estado?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    regiao?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td class="acoes-tabela">

                                <button
                                    type="button"
                                    class="btn-editar"
                                    onclick="editarBairro(
                                        '${bairro.id}',
                                        '${escaparHTML(
                                            bairro.nome
                                        )}',
                                        '${bairro.cidade_id || ""}'
                                    )"
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn-excluir"
                                    onclick="excluirBairro(
                                        '${bairro.id}'
                                    )"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar bairros:",
            erro
        );


        lista.innerHTML = `
            <tr>
                <td colspan="5">
                    Erro ao carregar bairros.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// POPULAR CIDADES
// ============================================================

async function popularSelectCidades(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) return;


    const valorAtual =
        select.value;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select(
                "id, nome, estado_id"
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        select.innerHTML = `
            <option value="">
                Selecione a Cidade
            </option>
        `;


        (data || []).forEach(
            cidade => {

                select.innerHTML += `
                    <option
                        value="${cidade.id}"
                    >
                        ${escaparHTML(
                            cidade.nome
                        )}
                    </option>
                `;

            }
        );


        if (valorAtual) {
            select.value =
                valorAtual;
        }


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
            erro
        );
    }
}


// ============================================================
// SALVAR BAIRRO
// ============================================================

async function salvarBairro() {

    const id =
        document.getElementById(
            "bairroEditId"
        )?.value || "";


    const nome =
        document.getElementById(
            "nomeBairro"
        )?.value.trim() || "";


    const cidadeId =
        document.getElementById(
            "bairroCidade"
        )?.value || "";


    if (!nome) {

        alert(
            "Digite o nome do bairro."
        );

        return;
    }


    if (!cidadeId) {

        alert(
            "Selecione a cidade."
        );

        return;
    }


    try {

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("bairros")
                .update({
                    nome: nome,
                    cidade_id: cidadeId
                })
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }


            alert(
                "Bairro atualizado com sucesso."
            );


        } else {

            const {
                data: existente,
                error: erroBusca
            } = await supabaseClient
                .from("bairros")
                .select(
                    "id"
                )
                .eq(
                    "cidade_id",
                    cidadeId
                )
                .ilike(
                    "nome",
                    nome
                )
                .limit(1);


            if (erroBusca) {
                throw erroBusca;
            }


            if (
                existente &&
                existente.length
            ) {

                alert(
                    "Esse bairro já está cadastrado nesta cidade."
                );

                return;
            }


            const {
                error
            } = await supabaseClient
                .from("bairros")
                .insert({
                    nome: nome,
                    cidade_id: cidadeId
                });


            if (error) {
                throw error;
            }


            alert(
                "Bairro cadastrado com sucesso."
            );
        }


        limparFormularioBairro();


        await carregarPaginaBairros();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar bairro:",
            erro
        );


        alert(
            "Erro ao salvar bairro."
        );
    }
}


// ============================================================
// EDITAR BAIRRO
// ============================================================

async function editarBairro(
    id,
    nome,
    cidadeId
) {

    await popularSelectCidades(
        "bairroCidade"
    );


    const campoId =
        document.getElementById(
            "bairroEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeBairro"
        );


    const campoCidade =
        document.getElementById(
            "bairroCidade"
        );


    if (
        !campoId ||
        !campoNome ||
        !campoCidade
    ) {
        return;
    }


    campoId.value =
        id;


    campoNome.value =
        decodeHTML(nome);


    campoCidade.value =
        cidadeId || "";


    campoNome.focus();
}


// ============================================================
// LIMPAR BAIRRO
// ============================================================

function limparFormularioBairro() {

    const id =
        document.getElementById(
            "bairroEditId"
        );


    const nome =
        document.getElementById(
            "nomeBairro"
        );


    const cidade =
        document.getElementById(
            "bairroCidade"
        );


    if (id) {
        id.value = "";
    }


    if (nome) {
        nome.value = "";
    }


    if (cidade) {
        cidade.value = "";
    }
}


// ============================================================
// EXCLUIR BAIRRO
// ============================================================

async function excluirBairro(
    id
) {

    const confirmar =
        confirm(
            "ATENÇÃO!\n\n" +
            "Excluir este bairro poderá afetar " +
            "clínicas vinculadas.\n\n" +
            "Deseja continuar?"
        );


    if (!confirmar) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("bairros")
            .delete()
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        alert(
            "Bairro excluído com sucesso."
        );


        await carregarPaginaBairros();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir bairro:",
            erro
        );


        alert(
            "Não foi possível excluir o bairro. " +
            "Verifique se existem clínicas vinculadas."
        );
    }
}


// ============================================================
// EXPORTAÇÕES DA PARTE 1
// ============================================================

window.mostrarPagina =
    mostrarPagina;

window.alternarTema =
    alternarTema;

window.voltarAoSite =
    voltarAoSite;

window.sair =
    sair;

window.carregarDashboard =
    carregarDashboard;

window.salvarEspecialidade =
    salvarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.salvarRegiao =
    salvarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.salvarEstado =
    salvarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;

window.salvarCidade =
    salvarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;

window.salvarBairro =
    salvarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;

console.log(
    "Parte 1 do admin.js carregada."
);
// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 2 DE 2
// ============================================================


// ============================================================
// CLÍNICAS
// ============================================================

async function listarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="8">
                Carregando clínicas...
            </td>
        </tr>
    `;


    try {

        const busca =
            document.getElementById(
                "buscarClinica"
            )?.value
            ?.trim()
            ?.toLowerCase() || "";


        const statusFiltro =
            document.getElementById(
                "filtroStatusClinica"
            )?.value || "";


        // ====================================================
        // CONSULTA DAS CLÍNICAS
        // ====================================================
        //
        // IMPORTANTE:
        // Foram mantidos somente campos conhecidos:
        //
        // id
        // nome
        // telefone
        // endereco
        // bairro_id
        // ativo
        //
        // Isso evita o erro 400 causado por coluna
        // inexistente.
        // ====================================================

        const {
            data,
            error
        } = await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                telefone,
                endereco,
                bairro_id,
                ativo,

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
                    ativo,

                    especialidades (
                        id,
                        nome
                    )
                )
            `)
            .order(
                "nome",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        let clinicas =
            data || [];


        // ====================================================
        // FILTRO POR TEXTO
        // ====================================================

        if (busca) {

            clinicas =
                clinicas.filter(
                    clinica => {

                        const nome =
                            String(
                                clinica.nome ||
                                ""
                            ).toLowerCase();


                        const telefone =
                            String(
                                clinica.telefone ||
                                ""
                            ).toLowerCase();


                        const endereco =
                            String(
                                clinica.endereco ||
                                ""
                            ).toLowerCase();


                        const bairro =
                            String(
                                clinica.bairros?.nome ||
                                ""
                            ).toLowerCase();


                        const cidade =
                            String(
                                clinica.bairros?.cidades?.nome ||
                                ""
                            ).toLowerCase();


                        const estado =
                            String(
                                clinica.bairros?.cidades?.estados?.nome ||
                                ""
                            ).toLowerCase();


                        return (

                            nome.includes(busca) ||

                            telefone.includes(busca) ||

                            endereco.includes(busca) ||

                            bairro.includes(busca) ||

                            cidade.includes(busca) ||

                            estado.includes(busca)

                        );
                    }
                );
        }


        // ====================================================
        // FILTRO POR STATUS
        // ====================================================

        if (
            statusFiltro ===
            "ativa"
        ) {

            clinicas =
                clinicas.filter(
                    clinica =>
                        clinica.ativo === true
                );


        } else if (
            statusFiltro ===
            "inativa"
        ) {

            clinicas =
                clinicas.filter(
                    clinica =>
                        clinica.ativo !== true
                );
        }


        // ====================================================
        // SEM RESULTADOS
        // ====================================================

        if (!clinicas.length) {

            lista.innerHTML = `
                <tr>
                    <td colspan="8">
                        Nenhuma clínica encontrada.
                    </td>
                </tr>
            `;

            return;
        }


        // ====================================================
        // MONTAR TABELA
        // ====================================================

        lista.innerHTML =
            clinicas.map(
                clinica => {

                    const bairro =
                        clinica.bairros;


                    const cidade =
                        bairro?.cidades;


                    const estado =
                        cidade?.estados;


                    const regiao =
                        estado?.regioes;


                    const redes =
                        obterRedesClinica(
                            clinica
                        );


                    const ativa =
                        clinica.ativo === true;


                    const status =
                        ativa
                            ? "Ativa"
                            : "Inativa";


                    const classeStatus =
                        ativa
                            ? "ativo"
                            : "inativo";


                    return `
                        <tr>

                            <!-- CLÍNICA -->

                            <td>
                                <strong>
                                    ${escaparHTML(
                                        clinica.nome ||
                                        "Sem nome"
                                    )}
                                </strong>
                            </td>


                            <!-- REGIÃO -->

                            <td>
                                ${escaparHTML(
                                    regiao?.nome ||
                                    "Não informado"
                                )}
                            </td>


                            <!-- ESTADO -->

                            <td>
                                ${escaparHTML(
                                    estado?.nome ||
                                    "Não informado"
                                )}
                            </td>


                            <!-- CIDADE -->

                            <td>
                                ${escaparHTML(
                                    cidade?.nome ||
                                    "Não informado"
                                )}
                            </td>


                            <!-- BAIRRO -->

                            <td>
                                ${escaparHTML(
                                    bairro?.nome ||
                                    "Não informado"
                                )}
                            </td>


                            <!-- REDES -->

                            <td>

                                <div class="redes-clinica">

                                    ${
                                        redes.especialistas
                                            ? `
                                                <span class="tag-rede especialistas">
                                                    Especialistas
                                                </span>
                                            `
                                            : ""
                                    }


                                    ${
                                        redes.sindilegis
                                            ? `
                                                <span class="tag-rede sindilegis">
                                                    Sindilegis
                                                </span>
                                            `
                                            : ""
                                    }


                                    ${
                                        !redes.especialistas &&
                                        !redes.sindilegis
                                            ? `
                                                <span>
                                                    Nenhuma
                                                </span>
                                            `
                                            : ""
                                    }

                                </div>

                            </td>


                            <!-- STATUS -->

                            <td>

                                <span
                                    class="status ${classeStatus}"
                                >
                                    ${status}
                                </span>

                            </td>


                            <!-- AÇÕES -->

                            <td class="acoes-tabela">

                                <button
                                    type="button"
                                    class="btn-editar"
                                    onclick="editarClinica(
                                        '${clinica.id}'
                                    )"
                                >
                                    Editar
                                </button>


                                <button
                                    type="button"
                                    class="btn-excluir"
                                    onclick="excluirClinica(
                                        '${clinica.id}'
                                    )"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar clínicas:",
            erro
        );


        lista.innerHTML = `
            <tr>
                <td colspan="8">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// REDES DA CLÍNICA
// ============================================================

function obterRedesClinica(
    clinica
) {

    const resultado = {

        especialistas:
            false,

        sindilegis:
            false
    };


    (
        clinica.clinica_especialidades ||
        []
    ).forEach(
        item => {

            if (
                item.ativo !== true
            ) {
                return;
            }


            const rede =
                normalizarRedeAdmin(
                    item.rede
                );


            if (
                rede ===
                REDE_ESPECIALISTAS
            ) {

                resultado.especialistas =
                    true;
            }


            if (
                rede ===
                REDE_SINDILEGIS
            ) {

                resultado.sindilegis =
                    true;
            }

        }
    );


    return resultado;
}


// ============================================================
// NORMALIZAR REDE
// ============================================================

function normalizarRedeAdmin(
    valor
) {

    const rede =
        String(
            valor ?? ""
        )
        .trim()
        .toLowerCase();


    if (

        rede ===
        "especialistas" ||

        rede ===
        "especialista" ||

        rede ===
        "rede especialistas"

    ) {

        return REDE_ESPECIALISTAS;
    }


    if (

        rede ===
        "sindilegis" ||

        rede ===
        "rede sindilegis"

    ) {

        return REDE_SINDILEGIS;
    }


    return "";
}


// ============================================================
// ABRIR MODAL
// ============================================================

async function abrirModalClinica(
    id = ""
) {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) return;


    const titulo =
        document.getElementById(
            "tituloModalClinica"
        );


    const campoId =
        document.getElementById(
            "clinicaId"
        );


    const campoNome =
        document.getElementById(
            "clinicaNome"
        );


    const campoEndereco =
        document.getElementById(
            "clinicaEndereco"
        );


    const campoTelefone =
        document.getElementById(
            "clinicaTelefone"
        );


    const campoAtivo =
        document.getElementById(
            "clinicaAtivo"
        );


    const campoRegiao =
        document.getElementById(
            "clinicaRegiao"
        );


    const campoEstado =
        document.getElementById(
            "clinicaEstado"
        );


    const campoCidade =
        document.getElementById(
            "clinicaCidade"
        );


    const campoBairro =
        document.getElementById(
            "clinicaBairro"
        );


    // ========================================================
    // LIMPAR CAMPOS
    // ========================================================

    if (campoId) {
        campoId.value =
            id || "";
    }


    if (campoNome) {
        campoNome.value =
            "";
    }


    if (campoEndereco) {
        campoEndereco.value =
            "";
    }


    if (campoTelefone) {
        campoTelefone.value =
            "";
    }


    if (campoAtivo) {
        campoAtivo.checked =
            true;
    }


    // ========================================================
    // CARREGAR REGIÕES
    // ========================================================

    await popularSelectRegioes(
        "clinicaRegiao"
    );


    limparSelectAdmin(
        "clinicaEstado",
        "Selecione o Estado"
    );


    limparSelectAdmin(
        "clinicaCidade",
        "Selecione a Cidade"
    );


    limparSelectAdmin(
        "clinicaBairro",
        "Selecione o Bairro"
    );


    // ========================================================
    // NOVA CLÍNICA
    // ========================================================

    if (!id) {

        if (titulo) {

            titulo.textContent =
                "Nova Clínica";
        }


        limparEspecialidadesClinica();


        mostrarModalClinica();


        return;
    }


    // ========================================================
    // EDITAR
    // ========================================================

    if (titulo) {

        titulo.textContent =
            "Editar Clínica";
    }


    try {

        // ====================================================
        // BUSCAR CLÍNICA
        // ====================================================

        const {
            data: clinica,
            error
        } = await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                telefone,
                endereco,
                bairro_id,
                ativo
            `)
            .eq(
                "id",
                id
            )
            .single();


        if (error) {
            throw error;
        }


        // ====================================================
        // CAMPOS
        // ====================================================

        if (campoNome) {

            campoNome.value =
                clinica.nome ||
                "";
        }


        if (campoEndereco) {

            campoEndereco.value =
                clinica.endereco ||
                "";
        }


        if (campoTelefone) {

            campoTelefone.value =
                clinica.telefone ||
                "";
        }


        if (campoAtivo) {

            campoAtivo.checked =
                clinica.ativo !== false;
        }


        // ====================================================
        // LOCALIZAÇÃO
        // ====================================================

        if (
            clinica.bairro_id
        ) {

            const {
                data: bairro,
                error: erroBairro
            } = await supabaseClient
                .from("bairros")
                .select(`
                    id,
                    nome,
                    cidade_id,

                    cidades (
                        id,
                        nome,
                        estado_id,

                        estados (
                            id,
                            nome,
                            regiao_id,

                            regioes (
                                id,
                                nome
                            )
                        )
                    )
                `)
                .eq(
                    "id",
                    clinica.bairro_id
                )
                .single();


            if (erroBairro) {
                throw erroBairro;
            }


            const cidade =
                bairro?.cidades;


            const estado =
                cidade?.estados;


            const regiao =
                estado?.regioes;


            // ================================================
            // REGIÃO
            // ================================================

            if (regiao) {

                if (campoRegiao) {

                    campoRegiao.value =
                        regiao.id;
                }


                await carregarEstadosClinica(
                    regiao.id
                );
            }


            // ================================================
            // ESTADO
            // ================================================

            if (estado) {

                if (campoEstado) {

                    campoEstado.value =
                        estado.id;
                }


                await carregarCidadesClinica(
                    estado.id
                );
            }


            // ================================================
            // CIDADE
            // ================================================

            if (cidade) {

                if (campoCidade) {

                    campoCidade.value =
                        cidade.id;
                }


                await carregarBairrosClinica(
                    cidade.id
                );
            }


            // ================================================
            // BAIRRO
            // ================================================

            if (campoBairro) {

                campoBairro.value =
                    bairro.id;
            }
        }


        // ====================================================
        // ESPECIALIDADES
        // ====================================================

        await carregarEspecialidadesClinica(
            id
        );


        mostrarModalClinica();


    } catch (erro) {

        console.error(
            "Erro ao abrir clínica:",
            erro
        );


        alert(
            "Erro ao carregar os dados da clínica."
        );
    }
}


// ============================================================
// MOSTRAR MODAL
// ============================================================

function mostrarModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) return;


    modal.classList.remove(
        "hidden"
    );
}


// ============================================================
// FECHAR MODAL
// ============================================================

function fecharModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) return;


    modal.classList.add(
        "hidden"
    );
}


// ============================================================
// EDITAR CLÍNICA
// ============================================================

async function editarClinica(
    id
) {

    await abrirModalClinica(
        id
    );
}


// ============================================================
// CARREGAR ESTADOS DA CLÍNICA
// ============================================================

async function carregarEstadosClinica(
    regiaoId
) {

    const select =
        document.getElementById(
            "clinicaEstado"
        );


    if (!select) return;


    limparSelectAdmin(
        "clinicaEstado",
        "Selecione o Estado"
    );


    limparSelectAdmin(
        "clinicaCidade",
        "Selecione a Cidade"
    );


    limparSelectAdmin(
        "clinicaBairro",
        "Selecione o Bairro"
    );


    if (!regiaoId) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select(
                "id, nome"
            )
            .eq(
                "regiao_id",
                regiaoId
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        (data || []).forEach(
            estado => {

                select.innerHTML += `
                    <option
                        value="${estado.id}"
                    >
                        ${escaparHTML(
                            estado.nome
                        )}
                    </option>
                `;

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar estados da clínica:",
            erro
        );
    }
}


// ============================================================
// CARREGAR CIDADES DA CLÍNICA
// ============================================================

async function carregarCidadesClinica(
    estadoId
) {

    const select =
        document.getElementById(
            "clinicaCidade"
        );


    if (!select) return;


    limparSelectAdmin(
        "clinicaCidade",
        "Selecione a Cidade"
    );


    limparSelectAdmin(
        "clinicaBairro",
        "Selecione o Bairro"
    );


    if (!estadoId) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select(
                "id, nome"
            )
            .eq(
                "estado_id",
                estadoId
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        (data || []).forEach(
            cidade => {

                select.innerHTML += `
                    <option
                        value="${cidade.id}"
                    >
                        ${escaparHTML(
                            cidade.nome
                        )}
                    </option>
                `;

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades da clínica:",
            erro
        );
    }
}


// ============================================================
// CARREGAR BAIRROS DA CLÍNICA
// ============================================================

async function carregarBairrosClinica(
    cidadeId
) {

    const select =
        document.getElementById(
            "clinicaBairro"
        );


    if (!select) return;


    limparSelectAdmin(
        "clinicaBairro",
        "Selecione o Bairro"
    );


    if (!cidadeId) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select(
                "id, nome"
            )
            .eq(
                "cidade_id",
                cidadeId
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        (data || []).forEach(
            bairro => {

                select.innerHTML += `
                    <option
                        value="${bairro.id}"
                    >
                        ${escaparHTML(
                            bairro.nome
                        )}
                    </option>
                `;

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar bairros da clínica:",
            erro
        );
    }
}


// ============================================================
// LIMPAR SELECT
// ============================================================

function limparSelectAdmin(
    id,
    mensagem
) {

    const select =
        document.getElementById(
            id
        );


    if (!select) return;


    select.innerHTML = `
        <option value="">
            ${escaparHTML(
                mensagem
            )}
        </option>
    `;
}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(
    event
) {

    if (event) {
        event.preventDefault();
    }


    const id =
        document.getElementById(
            "clinicaId"
        )?.value || "";


    const nome =
        document.getElementById(
            "clinicaNome"
        )?.value.trim() || "";


    const endereco =
        document.getElementById(
            "clinicaEndereco"
        )?.value.trim() || "";


    const telefone =
        document.getElementById(
            "clinicaTelefone"
        )?.value.trim() || "";


    const bairroId =
        document.getElementById(
            "clinicaBairro"
        )?.value || "";


    const ativo =
        document.getElementById(
            "clinicaAtivo"
        )?.checked !== false;


    // ========================================================
    // VALIDAÇÕES
    // ========================================================

    if (!nome) {

        alert(
            "Digite o nome da clínica."
        );

        return;
    }


    if (!bairroId) {

        alert(
            "Selecione a região, estado, cidade e bairro da clínica."
        );

        return;
    }


    try {

        // ====================================================
        // DADOS DA CLÍNICA
        // ====================================================
        //
        // Somente campos conhecidos.
        // ====================================================

        const dadosClinica = {

            nome:
                nome,

            endereco:
                endereco || null,

            telefone:
                telefone || null,

            bairro_id:
                bairroId,

            ativo:
                ativo
        };


        let clinicaId =
            id;


        // ====================================================
        // NOVA CLÍNICA
        // ====================================================

        if (!id) {

            const {
                data,
                error
            } = await supabaseClient
                .from("clinicas")
                .insert(
                    dadosClinica
                )
                .select(
                    "id"
                )
                .single();


            if (error) {
                throw error;
            }


            clinicaId =
                data.id;


        } else {

            // ================================================
            // ATUALIZAR
            // ================================================

            const {
                error
            } = await supabaseClient
                .from("clinicas")
                .update(
                    dadosClinica
                )
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }
        }


        // ====================================================
        // ESPECIALIDADES E REDES
        // ====================================================

        await salvarEspecialidadesClinica(
            clinicaId
        );


        alert(
            id
                ? "Clínica atualizada com sucesso."
                : "Clínica cadastrada com sucesso."
        );


        fecharModalClinica();


        await listarClinicas();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar clínica:",
            erro
        );


        alert(
            "Erro ao salvar clínica. " +
            "Verifique os dados e tente novamente."
        );
    }
}


// ============================================================
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?\n\n" +
            "Os vínculos de especialidades também serão removidos."
        );


    if (!confirmar) return;


    try {

        // ====================================================
        // EXCLUIR VÍNCULOS
        // ====================================================

        const {
            error: erroVinculos
        } = await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "clinica_id",
                id
            );


        if (erroVinculos) {
            throw erroVinculos;
        }


        // ====================================================
        // EXCLUIR CLÍNICA
        // ====================================================

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
            throw error;
        }


        alert(
            "Clínica excluída com sucesso."
        );


        await listarClinicas();


        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir clínica:",
            erro
        );


        alert(
            "Não foi possível excluir a clínica."
        );
    }
}


// ============================================================
// CARREGAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function carregarEspecialidadesClinica(
    clinicaId
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    container.innerHTML =
        "";


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
                especialidade_id,
                rede,
                ativo,

                especialidades (
                    id,
                    nome
                )
            `)
            .eq(
                "clinica_id",
                clinicaId
            )
            .order(
                "rede"
            );


        if (error) {
            throw error;
        }


        if (!data?.length) {

            mostrarMensagemSemEspecialidades();

            return;
        }


        for (
            const item of data
        ) {

            await adicionarLinhaEspecialidade(
                item
            );
        }


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades da clínica:",
            erro
        );


        container.innerHTML = `
            <div class="especialidades-vazio">
                Erro ao carregar especialidades.
            </div>
        `;
    }
}


// ============================================================
// MENSAGEM SEM ESPECIALIDADES
// ============================================================

function mostrarMensagemSemEspecialidades() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    container.innerHTML = `
        <div class="especialidades-vazio">
            Nenhuma especialidade cadastrada.
        </div>
    `;
}


// ============================================================
// LIMPAR ESPECIALIDADES
// ============================================================

function limparEspecialidadesClinica() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    container.innerHTML = `
        <div class="especialidades-vazio">
            Nenhuma especialidade adicionada.
        </div>
    `;
}


// ============================================================
// ADICIONAR LINHA DE ESPECIALIDADE
// ============================================================

async function adicionarLinhaEspecialidade(
    dados = null
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    const vazio =
        container.querySelector(
            ".especialidades-vazio"
        );


    if (vazio) {
        vazio.remove();
    }


    const linha =
        document.createElement(
            "div"
        );


    linha.className =
        "especialidade-item";


    linha.dataset.id =
        dados?.id || "";


    const especialidadeSelecionada =
        dados?.especialidade_id ||
        "";


    const redeSelecionada =
        normalizarRedeAdmin(
            dados?.rede
        );


    linha.innerHTML = `

        <div class="especialidade-linha">

            <div class="campo-especialidade">

                <label>
                    Especialidade
                </label>

                <select
                    class="select-especialidade"
                    data-campo="especialidade"
                >

                    <option value="">
                        Selecione a Especialidade
                    </option>

                </select>

            </div>


            <div class="campo-rede">

                <label>
                    Rede
                </label>

                <select
                    class="select-rede"
                    data-campo="rede"
                >

                    <option value="">
                        Selecione a Rede
                    </option>

                    <option
                        value="${REDE_ESPECIALISTAS}"
                    >
                        Especialistas
                    </option>

                    <option
                        value="${REDE_SINDILEGIS}"
                    >
                        Sindilegis
                    </option>

                </select>

            </div>


            <div class="especialidade-acoes">

                <button
                    type="button"
                    class="btn-excluir-especialidade"
                    title="Remover"
                >
                    Remover
                </button>

            </div>

        </div>
    `;


    container.appendChild(
        linha
    );


    const selectEspecialidade =
        linha.querySelector(
            ".select-especialidade"
        );


    const selectRede =
        linha.querySelector(
            ".select-rede"
        );


    await popularEspecialidadesSelect(
        selectEspecialidade
    );


    if (
        especialidadeSelecionada
    ) {

        selectEspecialidade.value =
            especialidadeSelecionada;
    }


    if (
        redeSelecionada
    ) {

        selectRede.value =
            redeSelecionada;
    }


    const botaoRemover =
        linha.querySelector(
            ".btn-excluir-especialidade"
        );


    if (botaoRemover) {

        botaoRemover.addEventListener(
            "click",
            () => {

                linha.remove();


                const restantes =
                    container.querySelectorAll(
                        ".especialidade-item"
                    );


                if (!restantes.length) {

                    mostrarMensagemSemEspecialidades();
                }

            }
        );
    }
}


// ============================================================
// POPULAR ESPECIALIDADES
// ============================================================

async function popularEspecialidadesSelect(
    select
) {

    if (!select) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("especialidades")
            .select(
                "id, nome"
            )
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        select.innerHTML = `
            <option value="">
                Selecione a Especialidade
            </option>
        `;


        (data || []).forEach(
            especialidade => {

                select.innerHTML += `
                    <option
                        value="${especialidade.id}"
                    >
                        ${escaparHTML(
                            especialidade.nome
                        )}
                    </option>
                `;

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades:",
            erro
        );
    }
}


// ============================================================
// SALVAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function salvarEspecialidadesClinica(
    clinicaId
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    const linhas =
        container.querySelectorAll(
            ".especialidade-item"
        );


    const registros =
        [];


    // ========================================================
    // MONTAR REGISTROS
    // ========================================================

    linhas.forEach(
        linha => {

            const especialidade =
                linha.querySelector(
                    ".select-especialidade"
                )?.value || "";


            const rede =
                linha.querySelector(
                    ".select-rede"
                )?.value || "";


            if (
                especialidade &&
                rede
            ) {

                registros.push({

                    clinica_id:
                        clinicaId,

                    especialidade_id:
                        especialidade,

                    rede:
                        rede,

                    ativo:
                        true
                });
            }

        }
    );


    // ========================================================
    // VALIDAR DUPLICADOS
    // ========================================================

    const chaves =
        new Set();


    for (
        const registro of registros
    ) {

        const chave =
            `${registro.especialidade_id}-${registro.rede}`;


        if (
            chaves.has(chave)
        ) {

            throw new Error(
                "A mesma especialidade não pode ser cadastrada duas vezes na mesma rede."
            );
        }


        chaves.add(
            chave
        );
    }


    // ========================================================
    // REMOVER VÍNCULOS ANTIGOS
    // ========================================================

    const {
        error: erroDelete
    } = await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            clinicaId
        );


    if (erroDelete) {
        throw erroDelete;
    }


    // ========================================================
    // SE NÃO HOUVER ESPECIALIDADES
    // ========================================================

    if (!registros.length) {
        return;
    }


    // ========================================================
    // INSERIR NOVOS VÍNCULOS
    // ========================================================

    const {
        error
    } = await supabaseClient
        .from("clinica_especialidades")
        .insert(
            registros
        );


    if (error) {
        throw error;
    }
}


// ============================================================
// EXPORTAÇÕES DA PARTE 2
// ============================================================

window.listarClinicas =
    listarClinicas;

window.abrirModalClinica =
    abrirModalClinica;

window.fecharModalClinica =
    fecharModalClinica;

window.editarClinica =
    editarClinica;

window.excluirClinica =
    excluirClinica;

window.salvarClinica =
    salvarClinica;

window.carregarEstadosClinica =
    carregarEstadosClinica;

window.carregarCidadesClinica =
    carregarCidadesClinica;

window.carregarBairrosClinica =
    carregarBairrosClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.carregarEspecialidadesClinica =
    carregarEspecialidadesClinica;

window.salvarEspecialidadesClinica =
    salvarEspecialidadesClinica;

console.log(
    "Parte 2 do admin.js carregada."
);
