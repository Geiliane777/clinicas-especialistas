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


    const especialidades =
        await buscarEspecialidades();


    const linha =
        document.createElement(
            "div"
        );


    linha.className =
        "especialidade-item";


    linha.innerHTML = `

        <select class="select-especialidade">

            <option value="">
                Selecione a especialidade
            </option>

            ${
                especialidades
                    .map(
                        especialidade => `
                            <option
                                value="${especialidade.id}"
                                ${
                                    dados &&
                                    String(
                                        dados.especialidade_id
                                    ) ===
                                    String(
                                        especialidade.id
                                    )
                                        ? "selected"
                                        : ""
                                }
                            >
                                ${escaparHTML(
                                    especialidade.nome
                                )}
                            </option>
                        `
                    )
                    .join("")
            }

        </select>


        <select class="select-rede">

            <option value="">
                Selecione a rede
            </option>

            <option
                value="especialistas"
                ${
                    dados &&
                    normalizarRedeAdmin(
                        dados.rede
                    ) ===
                    REDE_ESPECIALISTAS
                        ? "selected"
                        : ""
                }
            >
                Especialistas
            </option>

            <option
                value="sindilegis"
                ${
                    dados &&
                    normalizarRedeAdmin(
                        dados.rede
                    ) ===
                    REDE_SINDILEGIS
                        ? "selected"
                        : ""
                }
            >
                Sindilegis
            </option>

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
        >
            🗑️
        </button>

    `;


    const botaoRemover =
        linha.querySelector(
            ".btn-remover-especialidade"
        );


    if (botaoRemover) {

        botaoRemover.addEventListener(
            "click",
            () => {

                linha.remove();


                const linhas =
                    container.querySelectorAll(
                        ".especialidade-item"
                    );


                if (!linhas.length) {

                    mostrarMensagemSemEspecialidades();

                }

            }
        );

    }


    container.appendChild(
        linha
    );

}


// ============================================================
// BUSCAR ESPECIALIDADES
// ============================================================

async function buscarEspecialidades() {

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


        return data || [];


    } catch (erro) {

        console.error(
            "Erro ao buscar especialidades:",
            erro
        );


        return [];

    }

}


// ============================================================
// LIMPAR ESPECIALIDADES DA CLÍNICA
// ============================================================

function limparEspecialidadesClinica() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    container.innerHTML =
        "";


    adicionarLinhaEspecialidade();

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

        .from(
            "clinica_especialidades"
        )

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

    if (
        !registros.length
    ) {

        return;

    }


    // ========================================================
    // INSERIR NOVOS VÍNCULOS
    // ========================================================

    const {
        error
    } = await supabaseClient

        .from(
            "clinica_especialidades"
        )

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


    const especialidades =
        await buscarEspecialidades();


    const linha =
        document.createElement(
            "div"
        );


    linha.className =
        "especialidade-item";


    linha.innerHTML = `

        <select class="select-especialidade">

            <option value="">
                Selecione a especialidade
            </option>

            ${
                especialidades
                    .map(
                        especialidade => `
                            <option
                                value="${especialidade.id}"
                                ${
                                    dados &&
                                    String(
                                        dados.especialidade_id
                                    ) ===
                                    String(
                                        especialidade.id
                                    )
                                        ? "selected"
                                        : ""
                                }
                            >
                                ${escaparHTML(
                                    especialidade.nome
                                )}
                            </option>
                        `
                    )
                    .join("")
            }

        </select>


        <select class="select-rede">

            <option value="">
                Selecione a rede
            </option>

            <option
                value="especialistas"
                ${
                    dados &&
                    normalizarRedeAdmin(
                        dados.rede
                    ) ===
                    REDE_ESPECIALISTAS
                        ? "selected"
                        : ""
                }
            >
                Especialistas
            </option>

            <option
                value="sindilegis"
                ${
                    dados &&
                    normalizarRedeAdmin(
                        dados.rede
                    ) ===
                    REDE_SINDILEGIS
                        ? "selected"
                        : ""
                }
            >
                Sindilegis
            </option>

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
        >
            🗑️
        </button>

    `;


    const botaoRemover =
        linha.querySelector(
            ".btn-remover-especialidade"
        );


    if (botaoRemover) {

        botaoRemover.addEventListener(
            "click",
            () => {

                linha.remove();


                const linhas =
                    container.querySelectorAll(
                        ".especialidade-item"
                    );


                if (!linhas.length) {

                    mostrarMensagemSemEspecialidades();

                }

            }
        );

    }


    container.appendChild(
        linha
    );

}


// ============================================================
// BUSCAR ESPECIALIDADES
// ============================================================

async function buscarEspecialidades() {

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


        return data || [];


    } catch (erro) {

        console.error(
            "Erro ao buscar especialidades:",
            erro
        );


        return [];

    }

}


// ============================================================
// LIMPAR ESPECIALIDADES DA CLÍNICA
// ============================================================

function limparEspecialidadesClinica() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    container.innerHTML =
        "";


    adicionarLinhaEspecialidade();

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

        .from(
            "clinica_especialidades"
        )

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

    if (
        !registros.length
    ) {

        return;

    }


    // ========================================================
    // INSERIR NOVOS VÍNCULOS
    // ========================================================

    const {
        error
    } = await supabaseClient

        .from(
            "clinica_especialidades"
        )

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
// ============================================================
// REGIÕES
// ============================================================

async function carregarPaginaRegioes() {

    await listarRegioes();

}


// ============================================================
// LISTAR REGIÕES
// ============================================================

async function listarRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );


    if (!lista) return;


    lista.innerHTML = `
        <div class="item-carregando">
            Carregando regiões...
        </div>
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
                "nome",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        if (
            !data ||
            !data.length
        ) {

            lista.innerHTML = `
                <div class="item-vazio">
                    Nenhuma região cadastrada.
                </div>
            `;

            return;

        }


        lista.innerHTML =
            data.map(
                regiao => `

                    <div class="item-gerenciamento">

                        <div class="item-gerenciamento-info">

                            <strong>
                                ${escaparHTML(
                                    regiao.nome
                                )}
                            </strong>

                        </div>


                        <div class="item-acoes">

                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarRegiao('${regiao.id}')"
                            >
                                ✏️ Editar
                            </button>


                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirRegiao('${regiao.id}')"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </div>

                `
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar regiões:",
            erro
        );


        lista.innerHTML = `
            <div class="item-erro">
                Erro ao carregar regiões.
            </div>
        `;

    }

}


// ============================================================
// ADICIONAR REGIÃO
// ============================================================

async function adicionarRegiao() {

    const nome =
        prompt(
            "Digite o nome da região:"
        );


    if (!nome) return;


    const nomeLimpo =
        nome.trim();


    if (!nomeLimpo) return;


    try {

        const {
            error
        } = await supabaseClient

            .from("regioes")

            .insert({

                nome:
                    nomeLimpo

            });


        if (error) {

            throw error;

        }


        alert(
            "Região cadastrada com sucesso!"
        );


        await listarRegioes();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao adicionar região:",
            erro
        );


        alert(
            "Erro ao cadastrar região."
        );

    }

}


// ============================================================
// EDITAR REGIÃO
// ============================================================

async function editarRegiao(
    id
) {

    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("regioes")

            .select(
                "id, nome"
            )

            .eq(
                "id",
                id
            )

            .single();


        if (error) {

            throw error;

        }


        const novoNome =
            prompt(
                "Digite o novo nome da região:",
                data.nome
            );


        if (
            novoNome === null
        ) {

            return;

        }


        const nomeLimpo =
            novoNome.trim();


        if (!nomeLimpo) {

            alert(
                "Informe um nome válido."
            );

            return;

        }


        const {
            error: erroUpdate
        } = await supabaseClient

            .from("regioes")

            .update({

                nome:
                    nomeLimpo

            })

            .eq(
                "id",
                id
            );


        if (erroUpdate) {

            throw erroUpdate;

        }


        alert(
            "Região atualizada com sucesso!"
        );


        await listarRegioes();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao editar região:",
            erro
        );


        alert(
            "Erro ao atualizar região."
        );

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
            "Deseja realmente excluir esta região?"
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
            "Região excluída com sucesso!"
        );


        await listarRegioes();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir região:",
            erro
        );


        alert(
            "Não foi possível excluir a região. Verifique se existem estados vinculados a ela."
        );

    }

}


// ============================================================
// ESTADOS
// ============================================================

async function carregarPaginaEstados() {

    await popularFiltroRegiao(
        "filtroRegiaoEstado"
    );

    await listarEstados();

}


// ============================================================
// LISTAR ESTADOS
// ============================================================

async function listarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


    const filtro =
        document.getElementById(
            "filtroRegiaoEstado"
        )?.value || "";


    lista.innerHTML = `
        <div class="item-carregando">
            Carregando estados...
        </div>
    `;


    try {

        let consulta =
            supabaseClient

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
                    "nome",
                    {
                        ascending: true
                    }
                );


        if (filtro) {

            consulta =
                consulta.eq(
                    "regiao_id",
                    filtro
                );

        }


        const {
            data,
            error
        } = await consulta;


        if (error) {

            throw error;

        }


        if (
            !data ||
            !data.length
        ) {

            lista.innerHTML = `
                <div class="item-vazio">
                    Nenhum estado encontrado.
                </div>
            `;

            return;

        }


        lista.innerHTML =
            data.map(
                estado => `

                    <div class="item-gerenciamento">

                        <div class="item-gerenciamento-info">

                            <strong>
                                ${escaparHTML(
                                    estado.nome
                                )}
                            </strong>

                            <span>
                                ${escaparHTML(
                                    estado.regioes?.nome ||
                                    "Sem região"
                                )}
                            </span>

                        </div>


                        <div class="item-acoes">

                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarEstado('${estado.id}')"
                            >
                                ✏️ Editar
                            </button>


                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirEstado('${estado.id}')"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </div>

                `
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar estados:",
            erro
        );


        lista.innerHTML = `
            <div class="item-erro">
                Erro ao carregar estados.
            </div>
        `;

    }

}


// ============================================================
// POPULAR FILTRO DE REGIÃO
// ============================================================

async function popularFiltroRegiao(
    idSelect
) {

    const select =
        document.getElementById(
            idSelect
        );


    if (!select) return;


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
                Todas as regiões
            </option>
        `;


        (data || []).forEach(
            regiao => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    regiao.id;


                option.textContent =
                    regiao.nome;


                select.appendChild(
                    option
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar regiões do filtro:",
            erro
        );

    }

}


// ============================================================
// ADICIONAR ESTADO
// ============================================================

async function adicionarEstado() {

    const nome =
        prompt(
            "Digite o nome do estado:"
        );


    if (!nome) return;


    const regiaoId =
        document.getElementById(
            "filtroRegiaoEstado"
        )?.value || "";


    if (!regiaoId) {

        alert(
            "Selecione uma região antes de cadastrar o estado."
        );

        return;

    }


    try {

        const {
            error
        } = await supabaseClient

            .from("estados")

            .insert({

                nome:
                    nome.trim(),

                regiao_id:
                    regiaoId

            });


        if (error) {

            throw error;

        }


        alert(
            "Estado cadastrado com sucesso!"
        );


        await listarEstados();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao adicionar estado:",
            erro
        );


        alert(
            "Erro ao cadastrar estado."
        );

    }

}


// ============================================================
// EDITAR ESTADO
// ============================================================

async function editarEstado(
    id
) {

    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("estados")

            .select(
                "id, nome, regiao_id"
            )

            .eq(
                "id",
                id
            )

            .single();


        if (error) {

            throw error;

        }


        const nome =
            prompt(
                "Digite o novo nome do estado:",
                data.nome
            );


        if (
            nome === null
        ) {

            return;

        }


        if (
            !nome.trim()
        ) {

            alert(
                "Informe um nome válido."
            );

            return;

        }


        const {
            error: erroUpdate
        } = await supabaseClient

            .from("estados")

            .update({

                nome:
                    nome.trim()

            })

            .eq(
                "id",
                id
            );


        if (erroUpdate) {

            throw erroUpdate;

        }


        alert(
            "Estado atualizado com sucesso!"
        );


        await listarEstados();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao editar estado:",
            erro
        );


        alert(
            "Erro ao atualizar estado."
        );

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
            "Deseja realmente excluir este estado?"
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
            "Estado excluído com sucesso!"
        );


        await listarEstados();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir estado:",
            erro
        );


        alert(
            "Não foi possível excluir o estado. Verifique se existem cidades vinculadas a ele."
        );

    }

}


// ============================================================
// CIDADES
// ============================================================

async function carregarPaginaCidades() {

    await popularFiltroEstado(
        "filtroEstadoCidade"
    );

    await listarCidades();

}


// ============================================================
// POPULAR FILTRO DE ESTADO
// ============================================================

async function popularFiltroEstado(
    idSelect
) {

    const select =
        document.getElementById(
            idSelect
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("estados")

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
                Todos os estados
            </option>
        `;


        (data || []).forEach(
            estado => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    estado.id;


                option.textContent =
                    estado.nome;


                select.appendChild(
                    option
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar estados do filtro:",
            erro
        );

    }

}


// ============================================================
// LISTAR CIDADES
// ============================================================

async function listarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


    const filtro =
        document.getElementById(
            "filtroEstadoCidade"
        )?.value || "";


    lista.innerHTML = `
        <div class="item-carregando">
            Carregando cidades...
        </div>
    `;


    try {

        let consulta =
            supabaseClient

                .from("cidades")

                .select(`
                    id,
                    nome,
                    estado_id,

                    estados (
                        id,
                        nome
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
                consulta.eq(
                    "estado_id",
                    filtro
                );

        }


        const {
            data,
            error
        } = await consulta;


        if (error) {

            throw error;

        }


        if (
            !data ||
            !data.length
        ) {

            lista.innerHTML = `
                <div class="item-vazio">
                    Nenhuma cidade encontrada.
                </div>
            `;

            return;

        }


        lista.innerHTML =
            data.map(
                cidade => `

                    <div class="item-gerenciamento">

                        <div class="item-gerenciamento-info">

                            <strong>
                                ${escaparHTML(
                                    cidade.nome
                                )}
                            </strong>

                            <span>
                                ${escaparHTML(
                                    cidade.estados?.nome ||
                                    "Sem estado"
                                )}
                            </span>

                        </div>


                        <div class="item-acoes">

                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarCidade('${cidade.id}')"
                            >
                                ✏️ Editar
                            </button>


                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirCidade('${cidade.id}')"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </div>

                `
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar cidades:",
            erro
        );


        lista.innerHTML = `
            <div class="item-erro">
                Erro ao carregar cidades.
            </div>
        `;

    }

}


// ============================================================
// ADICIONAR CIDADE
// ============================================================

async function adicionarCidade() {

    const nome =
        prompt(
            "Digite o nome da cidade:"
        );


    if (!nome) return;


    const estadoId =
        document.getElementById(
            "filtroEstadoCidade"
        )?.value || "";


    if (!estadoId) {

        alert(
            "Selecione um estado antes de cadastrar a cidade."
        );

        return;

    }


    try {

        const {
            error
        } = await supabaseClient

            .from("cidades")

            .insert({

                nome:
                    nome.trim(),

                estado_id:
                    estadoId

            });


        if (error) {

            throw error;

        }


        alert(
            "Cidade cadastrada com sucesso!"
        );


        await listarCidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao adicionar cidade:",
            erro
        );


        alert(
            "Erro ao cadastrar cidade."
        );

    }

}


// ============================================================
// EDITAR CIDADE
// ============================================================

async function editarCidade(
    id
) {

    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("cidades")

            .select(
                "id, nome, estado_id"
            )

            .eq(
                "id",
                id
            )

            .single();


        if (error) {

            throw error;

        }


        const nome =
            prompt(
                "Digite o novo nome da cidade:",
                data.nome
            );


        if (
            nome === null
        ) {

            return;

        }


        if (
            !nome.trim()
        ) {

            alert(
                "Informe um nome válido."
            );

            return;

        }


        const {
            error: erroUpdate
        } = await supabaseClient

            .from("cidades")

            .update({

                nome:
                    nome.trim()

            })

            .eq(
                "id",
                id
            );


        if (erroUpdate) {

            throw erroUpdate;

        }


        alert(
            "Cidade atualizada com sucesso!"
        );


        await listarCidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao editar cidade:",
            erro
        );


        alert(
            "Erro ao atualizar cidade."
        );

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
            "Deseja realmente excluir esta cidade?"
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
            "Cidade excluída com sucesso!"
        );


        await listarCidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir cidade:",
            erro
        );


        alert(
            "Não foi possível excluir a cidade. Verifique se existem bairros vinculados a ela."
        );

    }

}


// ============================================================
// BAIRROS
// ============================================================

async function carregarPaginaBairros() {

    await popularFiltroCidade(
        "filtroCidadeBairro"
    );

    await listarBairros();

}


// ============================================================
// POPULAR FILTRO DE CIDADE
// ============================================================

async function popularFiltroCidade(
    idSelect
) {

    const select =
        document.getElementById(
            idSelect
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("cidades")

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
                Todas as cidades
            </option>
        `;


        (data || []).forEach(
            cidade => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    cidade.id;


                option.textContent =
                    cidade.nome;


                select.appendChild(
                    option
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades do filtro:",
            erro
        );

    }

}


// ============================================================
// LISTAR BAIRROS
// ============================================================

async function listarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    const filtro =
        document.getElementById(
            "filtroCidadeBairro"
        )?.value || "";


    lista.innerHTML = `
        <div class="item-carregando">
            Carregando bairros...
        </div>
    `;


    try {

        let consulta =
            supabaseClient

                .from("bairros")

                .select(`
                    id,
                    nome,
                    cidade_id,

                    cidades (
                        id,
                        nome
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
                consulta.eq(
                    "cidade_id",
                    filtro
                );

        }


        const {
            data,
            error
        } = await consulta;


        if (error) {

            throw error;

        }


        if (
            !data ||
            !data.length
        ) {

            lista.innerHTML = `
                <div class="item-vazio">
                    Nenhum bairro encontrado.
                </div>
            `;

            return;

        }


        lista.innerHTML =
            data.map(
                bairro => `

                    <div class="item-gerenciamento">

                        <div class="item-gerenciamento-info">

                            <strong>
                                ${escaparHTML(
                                    bairro.nome
                                )}
                            </strong>

                            <span>
                                ${escaparHTML(
                                    bairro.cidades?.nome ||
                                    "Sem cidade"
                                )}
                            </span>

                        </div>


                        <div class="item-acoes">

                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarBairro('${bairro.id}')"
                            >
                                ✏️ Editar
                            </button>


                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirBairro('${bairro.id}')"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </div>

                `
            ).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar bairros:",
            erro
        );


        lista.innerHTML = `
            <div class="item-erro">
                Erro ao carregar bairros.
            </div>
        `;

    }

}


// ============================================================
// ADICIONAR BAIRRO
// ============================================================

async function adicionarBairro() {

    const nome =
        prompt(
            "Digite o nome do bairro:"
        );


    if (!nome) return;


    const cidadeId =
        document.getElementById(
            "filtroCidadeBairro"
        )?.value || "";


    if (!cidadeId) {

        alert(
            "Selecione uma cidade antes de cadastrar o bairro."
        );

        return;

    }


    try {

        const {
            error
        } = await supabaseClient

            .from("bairros")

            .insert({

                nome:
                    nome.trim(),

                cidade_id:
                    cidadeId

            });


        if (error) {

            throw error;

        }


        alert(
            "Bairro cadastrado com sucesso!"
        );


        await listarBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao adicionar bairro:",
            erro
        );


        alert(
            "Erro ao cadastrar bairro."
        );

    }

}


// ============================================================
// EDITAR BAIRRO
// ============================================================

async function editarBairro(
    id
) {

    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("bairros")

            .select(
                "id, nome, cidade_id"
            )

            .eq(
                "id",
                id
            )

            .single();


        if (error) {

            throw error;

        }


        const nome =
            prompt(
                "Digite o novo nome do bairro:",
                data.nome
            );


        if (
            nome === null
        ) {

            return;

        }


        if (
            !nome.trim()
        ) {

            alert(
                "Informe um nome válido."
            );

            return;

        }


        const {
            error: erroUpdate
        } = await supabaseClient

            .from("bairros")

            .update({

                nome:
                    nome.trim()

            })

            .eq(
                "id",
                id
            );


        if (erroUpdate) {

            throw erroUpdate;

        }


        alert(
            "Bairro atualizado com sucesso!"
        );


        await listarBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao editar bairro:",
            erro
        );


        alert(
            "Erro ao atualizar bairro."
        );

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
            "Deseja realmente excluir este bairro?"
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
            "Bairro excluído com sucesso!"
        );


        await listarBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir bairro:",
            erro
        );


        alert(
            "Não foi possível excluir o bairro."
        );

    }

}


// ============================================================
// EXPORTAÇÕES
// ============================================================

window.carregarPaginaRegioes =
    carregarPaginaRegioes;

window.listarRegioes =
    listarRegioes;

window.adicionarRegiao =
    adicionarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;


window.carregarPaginaEstados =
    carregarPaginaEstados;

window.listarEstados =
    listarEstados;

window.adicionarEstado =
    adicionarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;


window.carregarPaginaCidades =
    carregarPaginaCidades;

window.listarCidades =
    listarCidades;

window.adicionarCidade =
    adicionarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;


window.carregarPaginaBairros =
    carregarPaginaBairros;

window.listarBairros =
    listarBairros;

window.adicionarBairro =
    adicionarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;
