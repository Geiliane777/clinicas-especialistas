// ============================================================
// ADMIN.JS — PARTE 1/3
// REDE ESPECIALISTAS
// ============================================================

console.log("admin.js carregado");

const NOME_REDE = "Rede Especialistas";

let clinicaEditandoId = null;
let especialidadesClinicaTemp = [];
let listaEspecialidadesAdmin = [];


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    try {

        atualizarData();

        carregarTema();

        await carregarDashboard();

        await popularRegioes();
        await popularEstados();
        await popularCidades();
        await popularBairros();
        await popularEspecialidades();

        await listarClinicas();
        await listarEspecialidades();
        await listarRegioes();
        await listarEstados();
        await listarCidades();
        await listarBairros();

        configurarEventosGerais();

        console.log(
            "Painel administrativo inicializado com sucesso."
        );

    } catch (erro) {

        console.error(
            "Erro ao inicializar o painel:",
            erro
        );

    }

});


// ============================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ============================================================

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

    dashboard: carregarDashboard,

    clinicas: carregarPaginaClinicas,

    especialidades: carregarPaginaEspecialidades,

    regioes: carregarPaginaRegioes,

    estados: carregarPaginaEstados,

    cidades: carregarPaginaCidades,

    bairros: carregarPaginaBairros

};


async function mostrarPagina(nomePagina) {

    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("ativa");

        });


    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (pagina) {

        pagina.classList.add("ativa");

    }


    document
        .querySelectorAll(".menu-btn")
        .forEach(btn => {

            btn.classList.remove("ativo");

            if (
                btn.dataset.pagina ===
                nomePagina
            ) {

                btn.classList.add("ativo");

            }

        });


    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina] ||
            nomePagina;

    }


    const carregador =
        CARREGADORES_PAGINA[nomePagina];


    if (typeof carregador === "function") {

        await carregador();

    }

}


// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        const {
            data: clinicas,
            error: erroClinicas
        } = await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                ativo
            `);


        if (erroClinicas) {

            throw erroClinicas;

        }


        const listaClinicas =
            clinicas || [];


        const totalClinicas =
            listaClinicas.length;


        const clinicasAtivas =
            listaClinicas.filter(
                clinica =>
                    clinica.ativo === true
            ).length;


        const clinicasInativas =
            listaClinicas.filter(
                clinica =>
                    clinica.ativo !== true
            ).length;


        const {
            data: especialidades,
            error: erroEspecialidades
        } = await supabaseClient
            .from("especialidades")
            .select("id");


        if (erroEspecialidades) {

            throw erroEspecialidades;

        }


        const totalEspecialidades =
            (especialidades || []).length;


        const [

            regioesResult,

            estadosResult,

            cidadesResult,

            bairrosResult

        ] = await Promise.all([

            supabaseClient
                .from("regioes")
                .select("id", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("estados")
                .select("id", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("cidades")
                .select("id", {
                    count: "exact",
                    head: true
                }),

            supabaseClient
                .from("bairros")
                .select("id", {
                    count: "exact",
                    head: true
                })

        ]);


        const totalRegioes =
            regioesResult.count || 0;


        const totalEstados =
            estadosResult.count || 0;


        const totalCidades =
            cidadesResult.count || 0;


        const totalBairros =
            bairrosResult.count || 0;


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
            "totalEspecialidades",
            totalEspecialidades
        );


        atualizarElemento(
            "totalRegioes",
            totalRegioes
        );


        atualizarElemento(
            "totalEstados",
            totalEstados
        );


        atualizarElemento(
            "totalCidades",
            totalCidades
        );


        atualizarElemento(
            "totalBairros",
            totalBairros
        );


        const percentual =
            totalClinicas > 0
                ? Math.round(
                    (
                        clinicasAtivas /
                        totalClinicas
                    ) * 100
                )
                : 0;


        atualizarElemento(
            "porcentagemAtivas",
            `${percentual}%`
        );


        const barra =
            document.getElementById(
                "barraAtivas"
            );


        if (barra) {

            barra.style.width =
                `${percentual}%`;

        }


        atualizarElemento(
            "legendaAtivas",
            `${clinicasAtivas} ativas`
        );


        atualizarElemento(
            "legendaInativas",
            `${clinicasInativas} inativas`
        );


        await carregarUltimasClinicas();

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// ============================================================
// ÚLTIMAS CLÍNICAS
// ============================================================

async function carregarUltimasClinicas() {

    const container =
        encontrarElemento(
            "ultimasClinicas",
            "listaUltimasClinicas"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<div class="carregando">
            Carregando clínicas...
        </div>`;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                telefone,
                ativo,
                bairro_id
            `)
            .order(
                "data_cadastro",
                {
                    ascending: false
                }
            )
            .limit(5);


        if (error) {

            throw error;

        }


        if (!data || data.length === 0) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhuma clínica cadastrada.
                </div>`;

            return;

        }


        container.innerHTML = "";


        for (const clinica of data) {

            const item =
                document.createElement("div");


            item.className =
                "item-gerenciamento";


            item.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(clinica.nome)}
                    </strong>

                    <small>
                        ${escapeHTML(
                            clinica.telefone || "Sem telefone"
                        )}
                    </small>

                </div>

                <span class="${
                    clinica.ativo
                        ? "status-ativo"
                        : "status-inativo"
                }">

                    ${
                        clinica.ativo
                            ? "Ativa"
                            : "Inativa"
                    }

                </span>

            `;


            container.appendChild(item);

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar últimas clínicas:",
            erro
        );


        container.innerHTML =
            `<div class="especialidades-vazio">
                Não foi possível carregar as clínicas.
            </div>`;

    }

}


// ============================================================
// PÁGINA DE CLÍNICAS
// ============================================================

async function carregarPaginaClinicas() {

    await listarClinicas();

}


// ============================================================
// LISTAR CLÍNICAS
// ============================================================

async function listarClinicas() {

    const tabela =
        encontrarElemento(
            "listaClinicas",
            "corpoTabelaClinicas"
        );


    if (!tabela) {

        console.warn(
            "Container de clínicas não encontrado."
        );

        return;

    }


    tabela.innerHTML =
        `<tr>
            <td colspan="10">
                Carregando clínicas...
            </td>
        </tr>`;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                endereco,
                telefone,
                ativo,
                bairro_id,
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


        if (!data || data.length === 0) {

            tabela.innerHTML =
                `<tr>
                    <td colspan="10">
                        Nenhuma clínica cadastrada.
                    </td>
                </tr>`;

            return;

        }


        tabela.innerHTML = "";


        for (const clinica of data) {

            const especialidades =
                await obterEspecialidadesClinica(
                    clinica.id
                );


            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>
                    ${escapeHTML(clinica.nome)}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.endereco || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.bairros?.nome || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.bairros?.cidades?.nome || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.bairros
                            ?.cidades
                            ?.estados
                            ?.nome || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.bairros
                            ?.cidades
                            ?.estados
                            ?.regioes
                            ?.nome || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.telefone || "-"
                    )}
                </td>

                <td>
                    ${
                        especialidades.length
                            ? especialidades
                                .map(
                                    especialidade =>
                                        `<span class="tag-especialidade">
                                            ${escapeHTML(
                                                especialidade.nome
                                            )}
                                        </span>`
                                )
                                .join("")
                            : "-"
                    }
                </td>

                <td>

                    <span class="${
                        clinica.ativo
                            ? "status-ativo"
                            : "status-inativo"
                    }">

                        ${
                            clinica.ativo
                                ? "Ativa"
                                : "Inativa"
                        }

                    </span>

                </td>

                <td>

                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarClinica(${clinica.id})"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirClinica(${clinica.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </td>

            `;


            tabela.appendChild(tr);

        }

    } catch (erro) {

        console.error(
            "Erro ao listar clínicas:",
            erro
        );


        tabela.innerHTML =
            `<tr>
                <td colspan="10">
                    Erro ao carregar clínicas.
                </td>
            </tr>`;

    }

}


// ============================================================
// OBTER ESPECIALIDADES DA CLÍNICA
// ============================================================

async function obterEspecialidadesClinica(clinicaId) {

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
            .eq(
                "ativo",
                true
            );


        if (error) {

            throw error;

        }


        return (data || [])
            .map(item => ({

                id: item.id,

                especialidade_id:
                    item.especialidade_id,

                nome:
                    item.especialidades?.nome ||
                    "Especialidade",

                rede:
                    normalizarRede(item.rede)

            }));

    } catch (erro) {

        console.error(
            "Erro ao obter especialidades da clínica:",
            erro
        );

        return [];

    }

}


// ============================================================
// LOCALIZAÇÃO DA CLÍNICA
// ============================================================

function montarLocalizacaoClinica(clinica) {

    const bairro =
        clinica.bairros;


    if (!bairro) {

        return "-";

    }


    const cidade =
        bairro.cidades;


    const estado =
        cidade?.estados;


    const regiao =
        estado?.regioes;


    const partes = [];


    if (bairro.nome) {

        partes.push(
            bairro.nome
        );

    }


    if (cidade?.nome) {

        partes.push(
            cidade.nome
        );

    }


    if (estado?.nome) {

        partes.push(
            estado.nome
        );

    }


    if (regiao?.nome) {

        partes.push(
            regiao.nome
        );

    }


    return partes.join(" - ") || "-";

}


// ============================================================
// EDITAR CLÍNICA
// ============================================================

async function editarClinica(id) {

    await abrirModalClinica(id);

}


// ============================================================
// ABRIR MODAL DA CLÍNICA
// ============================================================

async function abrirModalClinica(id = null) {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) {

        console.error(
            "Modal da clínica não encontrado."
        );

        return;

    }


    const form =
        document.getElementById(
            "formClinica"
        );


    if (form && id === null) {

        form.reset();

    }


    clinicaEditandoId =
        id ? Number(id) : null;


    const titulo =
        document.getElementById(
            "tituloModalClinica"
        );


    const clinicaId =
        document.getElementById(
            "clinicaId"
        );


    const ativo =
        document.getElementById(
            "clinicaAtivo"
        );


    const containerEspecialidades =
        document.getElementById(
            "containerEspecialidades"
        );


    if (id === null) {

        if (titulo) {

            titulo.textContent =
                "Nova Clínica";

        }


        if (clinicaId) {

            clinicaId.value = "";

        }


        if (ativo) {

            ativo.checked = true;

        }


        if (containerEspecialidades) {

            containerEspecialidades.innerHTML = `

                <div class="especialidades-vazio">

                    Nenhuma especialidade adicionada.

                </div>

            `;

        }


        await popularRegioes(
            "clinicaRegiao"
        );


        await popularEspecialidades();

    } else {

        if (titulo) {

            titulo.textContent =
                "Editar Clínica";

        }


        if (clinicaId) {

            clinicaId.value =
                id;

        }


        try {

            const {
                data: clinica,
                error
            } = await supabaseClient
                .from("clinicas")
                .select(`
                    id,
                    nome,
                    endereco,
                    telefone,
                    ativo,
                    bairro_id,
                    bairros (
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
                    )
                `)
                .eq(
                    "id",
                    id
                )
                .single();


            if (error) {

                throw error;

            }


            preencherCampo(
                clinica.nome,
                "clinicaNome"
            );


            preencherCampo(
                clinica.endereco,
                "clinicaEndereco"
            );


            preencherCampo(
                clinica.telefone,
                "clinicaTelefone"
            );


            if (ativo) {

                ativo.checked =
                    clinica.ativo !== false;

            }


            await preencherLocalizacaoClinica(
                clinica
            );


            await popularEspecialidades();


            await carregarEspecialidadesClinicaNoModal(
                id
            );

        } catch (erro) {

            console.error(
                "Erro ao abrir clínica:",
                erro
            );


            mostrarMensagem(
                "Não foi possível carregar os dados da clínica.",
                "erro"
            );

            return;

        }

    }


    modal.classList.remove(
        "hidden"
    );


    modal.style.display =
        "flex";

}


// ============================================================
// CARREGAR TODAS AS ESPECIALIDADES
// ============================================================

async function carregarListaEspecialidadesAdmin() {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select(`
            id,
            nome
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


    listaEspecialidadesAdmin =
        data || [];


    return listaEspecialidadesAdmin;

}


// ============================================================
// CARREGAR ESPECIALIDADES DA CLÍNICA NO MODAL
// ============================================================

async function carregarEspecialidadesClinicaNoModal(
    clinicaId
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<div class="carregando">
            Carregando especialidades...
        </div>`;


    try {

        await carregarListaEspecialidadesAdmin();


        const {
            data,
            error
        } = await supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
                clinica_id,
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
            .eq(
                "ativo",
                true
            );


        if (error) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML = `

                <div class="especialidades-vazio">

                    Nenhuma especialidade adicionada.

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        data.forEach(
            vinculo => {

                criarLinhaEspecialidadeExistente(
                    vinculo
                );

            }
        );

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
// LINHA DE ESPECIALIDADE EXISTENTE
// ============================================================

function criarLinhaEspecialidadeExistente(
    vinculo
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) {

        return;

    }


    const linha =
        document.createElement(
            "div"
        );


    linha.className =
        "linha-especialidade";


    linha.dataset.id =
        vinculo.id;


    linha.dataset.especialidadeId =
        vinculo.especialidade_id;


    linha.dataset.rede =
        normalizarRede(
            vinculo.rede
        );


    const nome =
        vinculo.especialidades?.nome ||
        "Especialidade não encontrada";


    const rede =
        normalizarRede(
            vinculo.rede
        );


    const nomeRede =
        rede === "sindilegis"
            ? "Rede Sindilegis"
            : "Rede Especialistas";


    linha.innerHTML = `

        <div class="nome-especialidade">

            ${escapeHTML(nome)}

        </div>


        <div class="rede-especialidade">

            ${escapeHTML(nomeRede)}

        </div>


        <div class="acoes-especialidade">

            <button
                type="button"
                class="btn-editar"
                onclick="editarEspecialidadeClinica(${vinculo.id})"
            >
                Editar
            </button>


            <button
                type="button"
                class="btn-excluir"
                onclick="excluirEspecialidadeClinica(${vinculo.id})"
            >
                Excluir
            </button>

        </div>

    `;


    container.appendChild(
        linha
    );

}


// ============================================================
// ADICIONAR NOVA ESPECIALIDADE
// ============================================================

async function adicionarLinhaEspecialidade() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) {

        return;

    }


    if (!clinicaEditandoId) {

        mostrarMensagem(
            "Salve a clínica antes de adicionar especialidades.",
            "erro"
        );

        return;

    }


    try {

        await carregarListaEspecialidadesAdmin();

    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades:",
            erro
        );


        mostrarMensagem(
            "Não foi possível carregar as especialidades.",
            "erro"
        );

        return;

    }


    const linhaExistente =
        container.querySelector(
            '[data-nova="true"]'
        );


    if (linhaExistente) {

        return;

    }


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
        "linha-especialidade";


    linha.dataset.nova =
        "true";


    let options =
        `<option value="">
            Selecione a especialidade
        </option>`;


    listaEspecialidadesAdmin.forEach(
        especialidade => {

            options += `

                <option value="${especialidade.id}">

                    ${escapeHTML(
                        especialidade.nome
                    )}

                </option>

            `;

        }
    );


    linha.innerHTML = `

        <select
            class="select-especialidade"
        >

            ${options}

        </select>


        <select
            class="select-rede-especialidade"
        >

            <option value="">
                Selecione a rede
            </option>

            <option value="especialistas">
                Rede Especialistas
            </option>

            <option value="sindilegis">
                Rede Sindilegis
            </option>

        </select>


        <div class="acoes-especialidade">

            <button
                type="button"
                class="btn-editar"
                onclick="salvarNovaEspecialidadeClinica(this)"
            >
                Salvar
            </button>


            <button
                type="button"
                class="btn-excluir"
                onclick="cancelarNovaEspecialidadeClinica(this)"
            >
                Cancelar
            </button>

        </div>

    `;


    container.appendChild(
        linha
    );


    linha
        .querySelector(
            ".select-especialidade"
        )
        ?.focus();

}


// ============================================================
// EDITAR ESPECIALIDADE DA CLÍNICA
// ============================================================

async function editarEspecialidadeClinica(
    vinculoId
) {

    const linha =
        document.querySelector(
            `.linha-especialidade[data-id="${vinculoId}"]`
        );


    if (!linha) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient
        .from("clinica_especialidades")
        .select(`
            id,
            especialidade_id,
            rede,
            ativo
        `)
        .eq(
            "id",
            vinculoId
        )
        .single();


    if (error) {

        console.error(
            "Erro ao editar especialidade:",
            error
        );


        mostrarMensagem(
            "Não foi possível editar a especialidade.",
            "erro"
        );

        return;

    }


    await carregarListaEspecialidadesAdmin();


    let options =
        `<option value="">
            Selecione a especialidade
        </option>`;


    listaEspecialidadesAdmin.forEach(
        especialidade => {

            options += `

                <option
                    value="${especialidade.id}"
                    ${
                        Number(
                            especialidade.id
                        ) ===
                        Number(
                            data.especialidade_id
                        )
                            ? "selected"
                            : ""
                    }
                >

                    ${escapeHTML(
                        especialidade.nome
                    )}

                </option>

            `;

        }
    );


    const rede =
        normalizarRede(
            data.rede
        );


    linha.innerHTML = `

        <select
            class="select-especialidade"
        >

            ${options}

        </select>


        <select
            class="select-rede-especialidade"
        >

            <option value="">
                Selecione a rede
            </option>

            <option
                value="especialistas"
                ${
                    rede === "especialistas"
                        ? "selected"
                        : ""
                }
            >
                Rede Especialistas
            </option>

            <option
                value="sindilegis"
                ${
                    rede === "sindilegis"
                        ? "selected"
                        : ""
                }
            >
                Rede Sindilegis
            </option>

        </select>


        <div class="acoes-especialidade">

            <button
                type="button"
                class="btn-editar"
                onclick="salvarEdicaoEspecialidadeClinica(${vinculoId})"
            >
                Salvar
            </button>


            <button
                type="button"
                class="btn-excluir"
                onclick="cancelarEdicaoEspecialidadeClinica()"
            >
                Cancelar
            </button>

        </div>

    `;

}


// ============================================================
// SALVAR NOVA ESPECIALIDADE DA CLÍNICA
// ============================================================

async function salvarNovaEspecialidadeClinica(
    botao
) {

    const linha =
        botao.closest(
            ".linha-especialidade"
        );


    if (!linha) {

        return;

    }


    const especialidadeId =
        linha.querySelector(
            ".select-especialidade"
        )?.value;


    const rede =
        normalizarRede(
            linha.querySelector(
                ".select-rede-especialidade"
            )?.value
        );


    if (!especialidadeId) {

        mostrarMensagem(
            "Selecione uma especialidade.",
            "erro"
        );

        return;

    }


    if (!rede) {

        mostrarMensagem(
            "Selecione a rede.",
            "erro"
        );

        return;

    }


    if (!clinicaEditandoId) {

        mostrarMensagem(
            "Salve a clínica antes de adicionar especialidades.",
            "erro"
        );

        return;

    }


    const {
        data: existente,
        error: erroBusca
    } = await supabaseClient
        .from("clinica_especialidades")
        .select("id")
        .eq(
            "clinica_id",
            clinicaEditandoId
        )
        .eq(
            "especialidade_id",
            Number(
                especialidadeId
            )
        )
        .eq(
            "rede",
            rede
        )
        .maybeSingle();


    if (erroBusca) {

        console.error(
            "Erro ao verificar especialidade:",
            erroBusca
        );


        mostrarMensagem(
            "Não foi possível verificar a especialidade.",
            "erro"
        );

        return;

    }


    if (existente) {

        mostrarMensagem(
            "Essa especialidade já está cadastrada para essa rede.",
            "erro"
        );

        return;

    }


    const {
        error
    } = await supabaseClient
        .from("clinica_especialidades")
        .insert({

            clinica_id:
                Number(
                    clinicaEditandoId
                ),

            especialidade_id:
                Number(
                    especialidadeId
                ),

            rede:
                rede,

            ativo:
                true

        });


    if (error) {

        console.error(
            "Erro ao adicionar especialidade:",
            error
        );


        mostrarMensagem(
            "Não foi possível adicionar a especialidade.",
            "erro"
        );

        return;

    }


    await carregarEspecialidadesClinicaNoModal(
        clinicaEditandoId
    );

}


// ============================================================
// SALVAR EDIÇÃO DA ESPECIALIDADE
// ============================================================

async function salvarEdicaoEspecialidadeClinica(
    vinculoId
) {

    const linha =
        document.querySelector(
            `.linha-especialidade[data-id="${vinculoId}"]`
        );


    if (!linha) {

        return;

    }


    const especialidadeId =
        linha.querySelector(
            ".select-especialidade"
        )?.value;


    const rede =
        normalizarRede(
            linha.querySelector(
                ".select-rede-especialidade"
            )?.value
        );


    if (
        !especialidadeId ||
        !rede
    ) {

        mostrarMensagem(
            "Selecione a especialidade e a rede.",
            "erro"
        );

        return;

    }


    const {
        data: existente,
        error: erroBusca
    } = await supabaseClient
        .from("clinica_especialidades")
        .select("id")
        .eq(
            "clinica_id",
            clinicaEditandoId
        )
        .eq(
            "especialidade_id",
            Number(
                especialidadeId
            )
        )
        .eq(
            "rede",
            rede
        )
        .neq(
            "id",
            vinculoId
        )
        .maybeSingle();


    if (erroBusca) {

        console.error(
            "Erro ao verificar duplicidade:",
            erroBusca
        );


        mostrarMensagem(
            "Não foi possível verificar a duplicidade.",
            "erro"
        );

        return;

    }


    if (existente) {

        mostrarMensagem(
            "Essa especialidade já está cadastrada para essa rede.",
            "erro"
        );

        return;

    }


    const {
        error
    } = await supabaseClient
        .from("clinica_especialidades")
        .update({

            especialidade_id:
                Number(
                    especialidadeId
                ),

            rede:
                rede,

            ativo:
                true

        })
        .eq(
            "id",
            vinculoId
        );


    if (error) {

        console.error(
            "Erro ao atualizar especialidade:",
            error
        );


        mostrarMensagem(
            "Não foi possível atualizar a especialidade.",
            "erro"
        );

        return;

    }


    await carregarEspecialidadesClinicaNoModal(
        clinicaEditandoId
    );

}


// ============================================================
// EXCLUIR ESPECIALIDADE DA CLÍNICA
// ============================================================

async function excluirEspecialidadeClinica(
    vinculoId
) {

    if (
        !confirm(
            "Deseja realmente excluir esta especialidade da clínica?"
        )
    ) {

        return;

    }


    const {
        error
    } = await supabaseClient
        .from("clinica_especialidades")
        .delete()
        .eq(
            "id",
            vinculoId
        );


    if (error) {

        console.error(
            "Erro ao excluir especialidade:",
            error
        );


        mostrarMensagem(
            "Não foi possível excluir a especialidade.",
            "erro"
        );

        return;

    }


    await carregarEspecialidadesClinicaNoModal(
        clinicaEditandoId
    );

}


// ============================================================
// CANCELAR NOVA ESPECIALIDADE
// ============================================================

function cancelarNovaEspecialidadeClinica(
    botao
) {

    const linha =
        botao.closest(
            ".linha-especialidade"
        );


    if (linha) {

        linha.remove();

    }


    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (
        container &&
        !container.querySelector(
            ".linha-especialidade"
        )
    ) {

        container.innerHTML = `

            <div class="especialidades-vazio">

                Nenhuma especialidade adicionada.

            </div>

        `;

    }

}


// ============================================================
// CANCELAR EDIÇÃO DE ESPECIALIDADE
// ============================================================

async function cancelarEdicaoEspecialidadeClinica() {

    if (!clinicaEditandoId) {

        return;

    }


    await carregarEspecialidadesClinicaNoModal(
        clinicaEditandoId
    );

}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(event) {

    if (event) {

        event.preventDefault();

    }


    const nome =
        obterValor(
            "clinicaNome"
        );


    const endereco =
        obterValor(
            "clinicaEndereco"
        );


    const telefone =
        obterValor(
            "clinicaTelefone"
        );


    const bairroId =
        obterValor(
            "clinicaBairro"
        );


    const ativoElemento =
        document.getElementById(
            "clinicaAtivo"
        );


    const ativo =
        ativoElemento
            ? ativoElemento.checked
            : true;


    if (!nome) {

        mostrarMensagem(
            "Informe o nome da clínica.",
            "erro"
        );

        return;

    }


    if (!bairroId) {

        mostrarMensagem(
            "Selecione o bairro da clínica.",
            "erro"
        );

        return;

    }


    try {

        let clinicaId =
            clinicaEditandoId;


        const dadosClinica = {

            nome:
                nome,

            endereco:
                endereco || null,

            telefone:
                telefone || null,

            bairro_id:
                Number(
                    bairroId
                ),

            ativo:
                ativo

        };


        if (clinicaId) {

            const {
                error
            } = await supabaseClient
                .from("clinicas")
                .update(
                    dadosClinica
                )
                .eq(
                    "id",
                    clinicaId
                );


            if (error) {

                throw error;

            }

        } else {

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


            clinicaEditandoId =
                Number(
                    data.id
                );

        }


        mostrarMensagem(
            "Clínica salva com sucesso!",
            "sucesso"
        );


        await listarClinicas();

        await carregarDashboard();


        /*
         * Depois de salvar uma nova clínica,
         * mantemos o modal aberto para permitir
         * adicionar as especialidades.
         */

        const campoId =
            document.getElementById(
                "clinicaId"
            );


        if (campoId) {

            campoId.value =
                clinicaId;

        }


        await carregarEspecialidadesClinicaNoModal(
            clinicaId
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar clínica:",
            erro
        );


        mostrarMensagem(
            "Não foi possível salvar a clínica.",
            "erro"
        );

    }

}


// ============================================================
// SALVAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function salvarEspecialidadesClinica(
    clinicaId
) {

    /*
     * As especialidades agora são salvas
     * imediatamente através dos botões
     * Adicionar / Editar / Excluir.
     *
     * Esta função permanece para compatibilidade
     * com versões anteriores do HTML.
     */

    return true;

}


// ============================================================
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta clínica?"
        )
    ) {

        return;

    }


    try {

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


        mostrarMensagem(
            "Clínica excluída com sucesso!",
            "sucesso"
        );


        await listarClinicas();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir clínica:",
            erro
        );


        mostrarMensagem(
            "Não foi possível excluir a clínica.",
            "erro"
        );

    }

}


// ============================================================
// PARTE DE ESPECIALIDADES GERAIS
// ============================================================

async function carregarPaginaEspecialidades() {

    await listarEspecialidades();

}


async function listarEspecialidades() {

    const container =
        encontrarElemento(
            "listaEspecialidades"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<div class="carregando">
            Carregando especialidades...
        </div>`;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("especialidades")
            .select(`
                id,
                nome
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


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhuma especialidade cadastrada.
                </div>`;

            return;

        }


        data.forEach(
            especialidade => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-gerenciamento";


                item.innerHTML = `

                    <div class="item-conteudo">

                        <strong>
                            ${escapeHTML(
                                especialidade.nome
                            )}
                        </strong>

                    </div>


                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarEspecialidade(${especialidade.id})"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirEspecialidade(${especialidade.id})"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao listar especialidades:",
            erro
        );


        container.innerHTML =
            `<div class="especialidades-vazio">
                Erro ao carregar especialidades.
            </div>`;

    }

}


// ============================================================
// SALVAR ESPECIALIDADE GERAL
// ============================================================

async function salvarEspecialidade() {

    const id =
        obterValor(
            "especialidadeEditId"
        );


    const nome =
        obterValor(
            "nomeEspecialidade"
        );


    if (!nome) {

        mostrarMensagem(
            "Informe o nome da especialidade.",
            "erro"
        );

        return;

    }


    try {

        let resposta;


        if (id) {

            resposta =
                await supabaseClient
                    .from("especialidades")
                    .update({

                        nome:
                            nome

                    })
                    .eq(
                        "id",
                        Number(id)
                    );

        } else {

            resposta =
                await supabaseClient
                    .from("especialidades")
                    .insert({

                        nome:
                            nome

                    });

        }


        if (resposta.error) {

            if (
                resposta.error.code ===
                "23505"
            ) {

                mostrarMensagem(
                    "Essa especialidade já existe.",
                    "erro"
                );

                return;

            }


            throw resposta.error;

        }


        preencherCampo(
            "",
            "especialidadeEditId"
        );


        preencherCampo(
            "",
            "nomeEspecialidade"
        );


        mostrarMensagem(
            "Especialidade salva com sucesso!",
            "sucesso"
        );


        await carregarListaEspecialidadesAdmin();

        await listarEspecialidades();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar especialidade:",
            erro
        );


        mostrarMensagem(
            "Não foi possível salvar a especialidade.",
            "erro"
        );

    }

}


// ============================================================
// EDITAR ESPECIALIDADE GERAL
// ============================================================

async function editarEspecialidade(
    id
) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("especialidades")
            .select(`
                id,
                nome
            `)
            .eq(
                "id",
                id
            )
            .single();


        if (error) {

            throw error;

        }


        preencherCampo(
            data.id,
            "especialidadeEditId"
        );


        preencherCampo(
            data.nome,
            "nomeEspecialidade"
        );


        const campo =
            document.getElementById(
                "nomeEspecialidade"
            );


        if (campo) {

            campo.focus();

        }

    } catch (erro) {

        console.error(
            "Erro ao editar especialidade:",
            erro
        );


        mostrarMensagem(
            "Não foi possível carregar a especialidade.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR ESPECIALIDADE GERAL
// ============================================================

async function excluirEspecialidade(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta especialidade?"
        )
    ) {

        return;

    }


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


        mostrarMensagem(
            "Especialidade excluída com sucesso!",
            "sucesso"
        );


        await carregarListaEspecialidadesAdmin();

        await listarEspecialidades();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir especialidade:",
            erro
        );


        mostrarMensagem(
            "Não foi possível excluir a especialidade. Verifique se ela está sendo utilizada.",
            "erro"
        );

    }

}


// ============================================================
// REGIÕES
// ============================================================

async function carregarPaginaRegioes() {

    await listarRegioes();

}


async function listarRegioes() {

    const container =
        encontrarElemento(
            "listaRegioes"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<div class="carregando">
            Carregando regiões...
        </div>`;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select(`
                id,
                nome
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


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhuma região cadastrada.
                </div>`;

            return;

        }


        data.forEach(
            regiao => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-gerenciamento";


                item.innerHTML = `

                    <div class="item-conteudo">

                        <strong>
                            ${escapeHTML(
                                regiao.nome
                            )}
                        </strong>

                    </div>


                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarRegiao(${regiao.id})"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirRegiao(${regiao.id})"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao listar regiões:",
            erro
        );


        container.innerHTML =
            `<div class="especialidades-vazio">
                Erro ao carregar regiões.
            </div>`;

    }

}


// ============================================================
// SALVAR REGIÃO
// ============================================================

async function salvarRegiao() {

    const id =
        obterValor(
            "regiaoEditId"
        );


    const nome =
        obterValor(
            "nomeRegiao"
        );


    if (!nome) {

        mostrarMensagem(
            "Informe o nome da região.",
            "erro"
        );

        return;

    }


    try {

        let resposta;


        if (id) {

            resposta =
                await supabaseClient
                    .from("regioes")
                    .update({

                        nome:
                            nome

                    })
                    .eq(
                        "id",
                        Number(id)
                    );

        } else {

            resposta =
                await supabaseClient
                    .from("regioes")
                    .insert({

                        nome:
                            nome

                    });

        }


        if (resposta.error) {

            if (
                resposta.error.code ===
                "23505"
            ) {

                mostrarMensagem(
                    "Essa região já existe.",
                    "erro"
                );

                return;

            }


            throw resposta.error;

        }


        preencherCampo(
            "",
            "regiaoEditId"
        );


        preencherCampo(
            "",
            "nomeRegiao"
        );


        mostrarMensagem(
            "Região salva com sucesso!",
            "sucesso"
        );


        await listarRegioes();

        await popularRegioes();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar região:",
            erro
        );


        mostrarMensagem(
            "Não foi possível salvar a região.",
            "erro"
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
            .select(`
                id,
                nome
            `)
            .eq(
                "id",
                id
            )
            .single();


        if (error) {

            throw error;

        }


        preencherCampo(
            data.id,
            "regiaoEditId"
        );


        preencherCampo(
            data.nome,
            "nomeRegiao"
        );


        document
            .getElementById(
                "nomeRegiao"
            )
            ?.focus();

    } catch (erro) {

        console.error(
            "Erro ao editar região:",
            erro
        );


        mostrarMensagem(
            "Não foi possível carregar a região.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR REGIÃO
// ============================================================

async function excluirRegiao(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta região? Todos os estados, cidades, bairros e clínicas relacionados poderão ser afetados."
        )
    ) {

        return;

    }


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


        mostrarMensagem(
            "Região excluída com sucesso!",
            "sucesso"
        );


        await listarRegioes();

        await popularRegioes();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir região:",
            erro
        );


        mostrarMensagem(
            "Não foi possível excluir a região. Verifique os registros relacionados.",
            "erro"
        );

    }

}
// ============================================================
// ESTADOS
// ============================================================

async function carregarPaginaEstados() {

    await listarEstados();

    await popularRegioesComTodas(
        "filtro_estado_regiao"
    );

}


async function listarEstados() {

    const container =
        encontrarElemento(
            "listaEstados"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<div class="carregando">
            Carregando estados...
        </div>`;


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
                "nome",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhum estado cadastrado.
                </div>`;

            return;

        }


        data.forEach(
            estado => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-gerenciamento";


                item.innerHTML = `

                    <div class="item-conteudo">

                        <strong>
                            ${escapeHTML(
                                estado.nome
                            )}
                        </strong>

                        <small>
                            Região:
                            ${escapeHTML(
                                estado.regioes?.nome ||
                                "-"
                            )}
                        </small>

                    </div>


                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarEstado(${estado.id})"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirEstado(${estado.id})"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao listar estados:",
            erro
        );


        container.innerHTML =
            `<div class="especialidades-vazio">
                Erro ao carregar estados.
            </div>`;

    }

}


// ============================================================
// SALVAR ESTADO
// ============================================================

async function salvarEstado() {

    const id =
        obterValor(
            "estadoEditId"
        );


    const nome =
        obterValor(
            "nomeEstado"
        );


    const regiaoId =
        obterValor(
            "estadoRegiao"
        );


    if (!nome) {

        mostrarMensagem(
            "Informe o nome do estado.",
            "erro"
        );

        return;

    }


    if (!regiaoId) {

        mostrarMensagem(
            "Selecione a região.",
            "erro"
        );

        return;

    }


    try {

        let resposta;


        const dados = {

            nome:
                nome,

            regiao_id:
                Number(
                    regiaoId
                )

        };


        if (id) {

            resposta =
                await supabaseClient
                    .from("estados")
                    .update(
                        dados
                    )
                    .eq(
                        "id",
                        Number(id)
                    );

        } else {

            resposta =
                await supabaseClient
                    .from("estados")
                    .insert(
                        dados
                    );

        }


        if (resposta.error) {

            if (
                resposta.error.code ===
                "23505"
            ) {

                mostrarMensagem(
                    "Esse estado já existe.",
                    "erro"
                );

                return;

            }


            throw resposta.error;

        }


        preencherCampo(
            "",
            "estadoEditId"
        );


        preencherCampo(
            "",
            "nomeEstado"
        );


        preencherCampo(
            "",
            "estadoRegiao"
        );


        mostrarMensagem(
            "Estado salvo com sucesso!",
            "sucesso"
        );


        await listarEstados();

        await popularEstados();

        await popularEstadosComTodas(
            "filtro_estado_regiao"
        );

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar estado:",
            erro
        );


        mostrarMensagem(
            "Não foi possível salvar o estado.",
            "erro"
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
            .select(`
                id,
                nome,
                regiao_id
            `)
            .eq(
                "id",
                id
            )
            .single();


        if (error) {

            throw error;

        }


        preencherCampo(
            data.id,
            "estadoEditId"
        );


        preencherCampo(
            data.nome,
            "nomeEstado"
        );


        await popularRegioes(
            "estadoRegiao"
        );


        preencherCampo(
            data.regiao_id,
            "estadoRegiao"
        );


        document
            .getElementById(
                "nomeEstado"
            )
            ?.focus();

    } catch (erro) {

        console.error(
            "Erro ao editar estado:",
            erro
        );


        mostrarMensagem(
            "Não foi possível carregar o estado.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR ESTADO
// ============================================================

async function excluirEstado(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir este estado? Cidades, bairros e clínicas relacionados poderão ser afetados."
        )
    ) {

        return;

    }


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


        mostrarMensagem(
            "Estado excluído com sucesso!",
            "sucesso"
        );


        await listarEstados();

        await popularEstados();

        await popularEstadosComTodas(
            "filtro_estado_regiao"
        );

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir estado:",
            erro
        );


        mostrarMensagem(
            "Não foi possível excluir o estado. Verifique os registros relacionados.",
            "erro"
        );

    }

}


// ============================================================
// CIDADES
// ============================================================

async function carregarPaginaCidades() {

    await listarCidades();

    await popularEstadosComTodas(
        "filtro_cidade_estado"
    );

}


async function listarCidades() {

    const container =
        encontrarElemento(
            "listaCidades"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<div class="carregando">
            Carregando cidades...
        </div>`;


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
                    nome
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


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhuma cidade cadastrada.
                </div>`;

            return;

        }


        data.forEach(
            cidade => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-gerenciamento";


                item.innerHTML = `

                    <div class="item-conteudo">

                        <strong>
                            ${escapeHTML(
                                cidade.nome
                            )}
                        </strong>

                        <small>
                            Estado:
                            ${escapeHTML(
                                cidade.estados?.nome ||
                                "-"
                            )}
                        </small>

                    </div>


                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarCidade(${cidade.id})"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirCidade(${cidade.id})"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao listar cidades:",
            erro
        );


        container.innerHTML =
            `<div class="especialidades-vazio">
                Erro ao carregar cidades.
            </div>`;

    }

}


// ============================================================
// SALVAR CIDADE
// ============================================================

async function salvarCidade() {

    const id =
        obterValor(
            "cidadeEditId"
        );


    const nome =
        obterValor(
            "nomeCidade"
        );


    const estadoId =
        obterValor(
            "cidadeEstado"
        );


    if (!nome) {

        mostrarMensagem(
            "Informe o nome da cidade.",
            "erro"
        );

        return;

    }


    if (!estadoId) {

        mostrarMensagem(
            "Selecione o estado.",
            "erro"
        );

        return;

    }


    try {

        const dados = {

            nome:
                nome,

            estado_id:
                Number(
                    estadoId
                )

        };


        let resposta;


        if (id) {

            resposta =
                await supabaseClient
                    .from("cidades")
                    .update(
                        dados
                    )
                    .eq(
                        "id",
                        Number(id)
                    );

        } else {

            resposta =
                await supabaseClient
                    .from("cidades")
                    .insert(
                        dados
                    );

        }


        if (resposta.error) {

            if (
                resposta.error.code ===
                "23505"
            ) {

                mostrarMensagem(
                    "Essa cidade já existe nesse estado.",
                    "erro"
                );

                return;

            }


            throw resposta.error;

        }


        preencherCampo(
            "",
            "cidadeEditId"
        );


        preencherCampo(
            "",
            "nomeCidade"
        );


        preencherCampo(
            "",
            "cidadeEstado"
        );


        mostrarMensagem(
            "Cidade salva com sucesso!",
            "sucesso"
        );


        await listarCidades();

        await popularCidades();

        await popularCidadesComTodas(
            "filtro_cidade_estado"
        );

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar cidade:",
            erro
        );


        mostrarMensagem(
            "Não foi possível salvar a cidade.",
            "erro"
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
            .select(`
                id,
                nome,
                estado_id
            `)
            .eq(
                "id",
                id
            )
            .single();


        if (error) {

            throw error;

        }


        preencherCampo(
            data.id,
            "cidadeEditId"
        );


        preencherCampo(
            data.nome,
            "nomeCidade"
        );


        await popularEstados(
            "cidadeEstado"
        );


        preencherCampo(
            data.estado_id,
            "cidadeEstado"
        );


        document
            .getElementById(
                "nomeCidade"
            )
            ?.focus();

    } catch (erro) {

        console.error(
            "Erro ao editar cidade:",
            erro
        );


        mostrarMensagem(
            "Não foi possível carregar a cidade.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR CIDADE
// ============================================================

async function excluirCidade(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta cidade? Bairros e clínicas relacionados poderão ser afetados."
        )
    ) {

        return;

    }


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


        mostrarMensagem(
            "Cidade excluída com sucesso!",
            "sucesso"
        );


        await listarCidades();

        await popularCidades();

        await popularCidadesComTodas(
            "filtro_cidade_estado"
        );

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir cidade:",
            erro
        );


        mostrarMensagem(
            "Não foi possível excluir a cidade. Verifique os registros relacionados.",
            "erro"
        );

    }

}


// ============================================================
// BAIRROS
// ============================================================

async function carregarPaginaBairros() {

    await listarBairros();

    await popularCidadesComTodas(
        "filtro_bairro_cidade"
    );

}


async function listarBairros() {

    const container =
        encontrarElemento(
            "listaBairros"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<div class="carregando">
            Carregando bairros...
        </div>`;


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
                    nome
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


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhum bairro cadastrado.
                </div>`;

            return;

        }


        data.forEach(
            bairro => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-gerenciamento";


                item.innerHTML = `

                    <div class="item-conteudo">

                        <strong>
                            ${escapeHTML(
                                bairro.nome
                            )}
                        </strong>

                        <small>
                            Cidade:
                            ${escapeHTML(
                                bairro.cidades?.nome ||
                                "-"
                            )}
                        </small>

                    </div>


                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarBairro(${bairro.id})"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirBairro(${bairro.id})"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao listar bairros:",
            erro
        );


        container.innerHTML =
            `<div class="especialidades-vazio">
                Erro ao carregar bairros.
            </div>`;

    }

}


// ============================================================
// SALVAR BAIRRO
// ============================================================

async function salvarBairro() {

    const id =
        obterValor(
            "bairroEditId"
        );


    const nome =
        obterValor(
            "nomeBairro"
        );


    const cidadeId =
        obterValor(
            "bairroCidade"
        );


    if (!nome) {

        mostrarMensagem(
            "Informe o nome do bairro.",
            "erro"
        );

        return;

    }


    if (!cidadeId) {

        mostrarMensagem(
            "Selecione a cidade.",
            "erro"
        );

        return;

    }


    try {

        const dados = {

            nome:
                nome,

            cidade_id:
                Number(
                    cidadeId
                )

        };


        let resposta;


        if (id) {

            resposta =
                await supabaseClient
                    .from("bairros")
                    .update(
                        dados
                    )
                    .eq(
                        "id",
                        Number(id)
                    );

        } else {

            resposta =
                await supabaseClient
                    .from("bairros")
                    .insert(
                        dados
                    );

        }


        if (resposta.error) {

            if (
                resposta.error.code ===
                "23505"
            ) {

                mostrarMensagem(
                    "Esse bairro já existe nessa cidade.",
                    "erro"
                );

                return;

            }


            throw resposta.error;

        }


        preencherCampo(
            "",
            "bairroEditId"
        );


        preencherCampo(
            "",
            "nomeBairro"
        );


        preencherCampo(
            "",
            "bairroCidade"
        );


        mostrarMensagem(
            "Bairro salvo com sucesso!",
            "sucesso"
        );


        await listarBairros();

        await popularBairros();

        await popularBairrosComTodas(
            "filtro_bairro_cidade"
        );

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar bairro:",
            erro
        );


        mostrarMensagem(
            "Não foi possível salvar o bairro.",
            "erro"
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
            .select(`
                id,
                nome,
                cidade_id
            `)
            .eq(
                "id",
                id
            )
            .single();


        if (error) {

            throw error;

        }


        preencherCampo(
            data.id,
            "bairroEditId"
        );


        preencherCampo(
            data.nome,
            "nomeBairro"
        );


        await popularCidades(
            "bairroCidade"
        );


        preencherCampo(
            data.cidade_id,
            "bairroCidade"
        );


        document
            .getElementById(
                "nomeBairro"
            )
            ?.focus();

    } catch (erro) {

        console.error(
            "Erro ao editar bairro:",
            erro
        );


        mostrarMensagem(
            "Não foi possível carregar o bairro.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR BAIRRO
// ============================================================

async function excluirBairro(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir este bairro? Clínicas relacionadas poderão ser afetadas."
        )
    ) {

        return;

    }


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


        mostrarMensagem(
            "Bairro excluído com sucesso!",
            "sucesso"
        );


        await listarBairros();

        await popularBairros();

        await popularBairrosComTodas(
            "filtro_bairro_cidade"
        );

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir bairro:",
            erro
        );


        mostrarMensagem(
            "Não foi possível excluir o bairro. Verifique os registros relacionados.",
            "erro"
        );

    }

}


// ============================================================
// FILTRO DE ESTADOS POR REGIÃO
// ============================================================

async function filtrarEstadosPorRegiao() {

    const regiaoId =
        obterValor(
            "filtro_estado_regiao"
        );


    const container =
        encontrarElemento(
            "listaEstados"
        );


    if (!container) {

        return;

    }


    try {

        let query =
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


        if (regiaoId) {

            query =
                query.eq(
                    "regiao_id",
                    Number(regiaoId)
                );

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhum estado encontrado.
                </div>`;

            return;

        }


        data.forEach(
            estado => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-gerenciamento";


                item.innerHTML = `

                    <div class="item-conteudo">

                        <strong>
                            ${escapeHTML(
                                estado.nome
                            )}
                        </strong>

                        <small>
                            Região:
                            ${escapeHTML(
                                estado.regioes?.nome ||
                                "-"
                            )}
                        </small>

                    </div>


                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarEstado(${estado.id})"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirEstado(${estado.id})"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao filtrar estados:",
            erro
        );

    }

}


// ============================================================
// FILTRO DE CIDADES POR ESTADO
// ============================================================

async function filtrarCidadesPorEstado() {

    const estadoId =
        obterValor(
            "filtro_cidade_estado"
        );


    const container =
        encontrarElemento(
            "listaCidades"
        );


    if (!container) {

        return;

    }


    try {

        let query =
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


        if (estadoId) {

            query =
                query.eq(
                    "estado_id",
                    Number(estadoId)
                );

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhuma cidade encontrada.
                </div>`;

            return;

        }


        data.forEach(
            cidade => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-gerenciamento";


                item.innerHTML = `

                    <div class="item-conteudo">

                        <strong>
                            ${escapeHTML(
                                cidade.nome
                            )}
                        </strong>

                        <small>
                            Estado:
                            ${escapeHTML(
                                cidade.estados?.nome ||
                                "-"
                            )}
                        </small>

                    </div>


                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarCidade(${cidade.id})"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirCidade(${cidade.id})"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao filtrar cidades:",
            erro
        );

    }

}


// ============================================================
// FILTRO DE BAIRROS POR CIDADE
// ============================================================

async function filtrarBairrosPorCidade() {

    const cidadeId =
        obterValor(
            "filtro_bairro_cidade"
        );


    const container =
        encontrarElemento(
            "listaBairros"
        );


    if (!container) {

        return;

    }


    try {

        let query =
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


        if (cidadeId) {

            query =
                query.eq(
                    "cidade_id",
                    Number(cidadeId)
                );

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhum bairro encontrado.
                </div>`;

            return;

        }


        data.forEach(
            bairro => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-gerenciamento";


                item.innerHTML = `

                    <div class="item-conteudo">

                        <strong>
                            ${escapeHTML(
                                bairro.nome
                            )}
                        </strong>

                        <small>
                            Cidade:
                            ${escapeHTML(
                                bairro.cidades?.nome ||
                                "-"
                            )}
                        </small>

                    </div>


                    <div class="item-acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarBairro(${bairro.id})"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirBairro(${bairro.id})"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao filtrar bairros:",
            erro
        );

    }

}


// ============================================================
// POPULAR REGIÕES
// ============================================================

async function popularRegioes(
    selectId = "clinicaRegiao"
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select(`
                id,
                nome
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


        select.innerHTML =
            `<option value="">
                Selecione Região
            </option>`;


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
            "Erro ao popular regiões:",
            erro
        );

    }

}


// ============================================================
// POPULAR REGIÕES COM TODAS
// ============================================================

async function popularRegioesComTodas(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    await popularRegioes(
        selectId
    );


    if (
        select.options.length > 0
    ) {

        select.options[0].textContent =
            "Todas as Regiões";

    }

}


// ============================================================
// POPULAR ESTADOS
// ============================================================

async function popularEstados(
    selectId = "clinicaEstado",
    regiaoId = null
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    try {

        let query =
            supabaseClient
                .from("estados")
                .select(`
                    id,
                    nome,
                    regiao_id
                `)
                .order(
                    "nome",
                    {
                        ascending: true
                    }
                );


        if (regiaoId) {

            query =
                query.eq(
                    "regiao_id",
                    Number(regiaoId)
                );

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            throw error;

        }


        select.innerHTML =
            `<option value="">
                Selecione Estado
            </option>`;


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
            "Erro ao popular estados:",
            erro
        );

    }

}


// ============================================================
// POPULAR ESTADOS SEM REGIÃO
// ============================================================

async function popularEstadosSemRegiao(
    selectId
) {

    return popularEstados(
        selectId
    );

}


// ============================================================
// POPULAR ESTADOS COM TODAS
// ============================================================

async function popularEstadosComTodas(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    await popularEstados(
        selectId
    );


    if (
        select.options.length > 0
    ) {

        select.options[0].textContent =
            "Todos os Estados";

    }

}


// ============================================================
// POPULAR CIDADES
// ============================================================

async function popularCidades(
    selectId = "clinicaCidade",
    estadoId = null
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    try {

        let query =
            supabaseClient
                .from("cidades")
                .select(`
                    id,
                    nome,
                    estado_id
                `)
                .order(
                    "nome",
                    {
                        ascending: true
                    }
                );


        if (estadoId) {

            query =
                query.eq(
                    "estado_id",
                    Number(estadoId)
                );

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            throw error;

        }


        select.innerHTML =
            `<option value="">
                Selecione Cidade
            </option>`;


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
            "Erro ao popular cidades:",
            erro
        );

    }

}


// ============================================================
// POPULAR CIDADES SEM ESTADO
// ============================================================

async function popularCidadesSemEstado(
    selectId
) {

    return popularCidades(
        selectId
    );

}


// ============================================================
// POPULAR CIDADES COM TODAS
// ============================================================

async function popularCidadesComTodas(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    await popularCidades(
        selectId
    );


    if (
        select.options.length > 0
    ) {

        select.options[0].textContent =
            "Todas as Cidades";

    }

}


// ============================================================
// POPULAR BAIRROS
// ============================================================

async function popularBairros(
    selectId = "clinicaBairro",
    cidadeId = null
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    try {

        let query =
            supabaseClient
                .from("bairros")
                .select(`
                    id,
                    nome,
                    cidade_id
                `)
                .order(
                    "nome",
                    {
                        ascending: true
                    }
                );


        if (cidadeId) {

            query =
                query.eq(
                    "cidade_id",
                    Number(cidadeId)
                );

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            throw error;

        }


        select.innerHTML =
            `<option value="">
                Selecione Bairro
            </option>`;


        (data || []).forEach(
            bairro => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    bairro.id;


                option.textContent =
                    bairro.nome;


                select.appendChild(
                    option
                );

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao popular bairros:",
            erro
        );

    }

}


// ============================================================
// POPULAR BAIRROS COM TODAS
// ============================================================

async function popularBairrosComTodas(
    selectId
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    await popularBairros(
        selectId
    );


    if (
        select.options.length > 0
    ) {

        select.options[0].textContent =
            "Todos os Bairros";

    }

}


// ============================================================
// POPULAR ESPECIALIDADES
// ============================================================

async function popularEspecialidades(
    selectId = null
) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("especialidades")
            .select(`
                id,
                nome
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


        listaEspecialidadesAdmin =
            data || [];


        if (!selectId) {

            return data || [];

        }


        const select =
            document.getElementById(
                selectId
            );


        if (!select) {

            return data || [];

        }


        select.innerHTML =
            `<option value="">
                Selecione Especialidade
            </option>`;


        (data || []).forEach(
            especialidade => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    especialidade.id;


                option.textContent =
                    especialidade.nome;


                select.appendChild(
                    option
                );

            }
        );


        return data || [];

    } catch (erro) {

        console.error(
            "Erro ao popular especialidades:",
            erro
        );


        return [];

    }

}


// ============================================================
// CASCATA DE LOCALIZAÇÃO
// ============================================================

function ligarCascataLocalizacao(
    idRegiao,
    idEstado,
    idCidade,
    idBairro
) {

    const regiao =
        document.getElementById(
            idRegiao
        );


    const estado =
        document.getElementById(
            idEstado
        );


    const cidade =
        document.getElementById(
            idCidade
        );


    const bairro =
        document.getElementById(
            idBairro
        );


    if (regiao) {

        regiao.addEventListener(
            "change",
            async () => {

                const regiaoId =
                    regiao.value;


                limparSelect(
                    estado,
                    "Selecione Estado"
                );


                limparSelect(
                    cidade,
                    "Selecione Cidade"
                );


                limparSelect(
                    bairro,
                    "Selecione Bairro"
                );


                if (!regiaoId) {

                    return;

                }


                await popularEstados(
                    idEstado,
                    regiaoId
                );

            }
        );

    }


    if (estado) {

        estado.addEventListener(
            "change",
            async () => {

                const estadoId =
                    estado.value;


                limparSelect(
                    cidade,
                    "Selecione Cidade"
                );


                limparSelect(
                    bairro,
                    "Selecione Bairro"
                );


                if (!estadoId) {

                    return;

                }


                await popularCidades(
                    idCidade,
                    estadoId
                );

            }
        );

    }


    if (cidade) {

        cidade.addEventListener(
            "change",
            async () => {

                const cidadeId =
                    cidade.value;


                limparSelect(
                    bairro,
                    "Selecione Bairro"
                );


                if (!cidadeId) {

                    return;

                }


                await popularBairros(
                    idBairro,
                    cidadeId
                );

            }
        );

    }

}


// ============================================================
// PREENCHER LOCALIZAÇÃO DA CLÍNICA
// ============================================================

async function preencherLocalizacaoClinica(
    clinica
) {

    const bairro =
        clinica.bairros;


    const cidade =
        bairro?.cidades;


    const estado =
        cidade?.estados;


    const regiao =
        estado?.regioes;


    await popularRegioes(
        "clinicaRegiao"
    );


    preencherCampo(
        regiao?.id || "",
        "clinicaRegiao"
    );


    await popularEstados(
        "clinicaEstado",
        regiao?.id || null
    );


    preencherCampo(
        estado?.id || "",
        "clinicaEstado"
    );


    await popularCidades(
        "clinicaCidade",
        estado?.id || null
    );


    preencherCampo(
        cidade?.id || "",
        "clinicaCidade"
    );


    await popularBairros(
        "clinicaBairro",
        cidade?.id || null
    );


    preencherCampo(
        bairro?.id || "",
        "clinicaBairro"
    );

}


// ============================================================
// FECHAR MODAL DA CLÍNICA
// ============================================================

function fecharModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "hidden"
    );


    modal.style.display =
        "none";


    clinicaEditandoId =
        null;


    const form =
        document.getElementById(
            "formClinica"
        );


    if (form) {

        form.reset();

    }


    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (container) {

        container.innerHTML = `

            <div class="especialidades-vazio">

                Nenhuma especialidade adicionada.

            </div>

        `;

    }

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

    try {

        localStorage.removeItem(
            "adminLogado"
        );

        localStorage.removeItem(
            "usuarioAdmin"
        );

    } catch (erro) {

        console.warn(
            "Não foi possível limpar o localStorage:",
            erro
        );

    }


    window.location.href =
        "admin.html";

}
// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function encontrarElemento(...ids) {

    for (const id of ids) {

        const elemento =
            document.getElementById(id);


        if (elemento) {

            return elemento;

        }

    }


    return null;

}


// ============================================================
// OBTER VALOR DE CAMPO
// ============================================================

function obterValor(id) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        return "";

    }


    return String(
        elemento.value ?? ""
    ).trim();

}


// ============================================================
// PREENCHER CAMPO
// ============================================================

function preencherCampo(
    valor,
    ...ids
) {

    for (const id of ids) {

        const elemento =
            document.getElementById(id);


        if (elemento) {

            elemento.value =
                valor ?? "";

            return true;

        }

    }


    return false;

}


// ============================================================
// ATUALIZAR ELEMENTO
// ============================================================

function atualizarElemento(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            valor ?? "";

    }

}


// ============================================================
// LIMPAR SELECT
// ============================================================

function limparSelect(
    select,
    texto = "Selecione"
) {

    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            ${texto}
        </option>

    `;

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escapeHTML(valor) {

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
// NORMALIZAR REDE
// ============================================================

function normalizarRede(
    rede
) {

    if (!rede) {

        return "";

    }


    const valor =
        String(rede)
            .trim()
            .toLowerCase();


    if (
        valor === "especialistas" ||
        valor === "rede especialistas"
    ) {

        return "especialistas";

    }


    if (
        valor === "sindilegis" ||
        valor === "rede sindilegis"
    ) {

        return "sindilegis";

    }


    return valor;

}


// ============================================================
// NOME DA REDE
// ============================================================

function nomeRede(
    rede
) {

    const redeNormalizada =
        normalizarRede(
            rede
        );


    if (
        redeNormalizada ===
        "sindilegis"
    ) {

        return "Rede Sindilegis";

    }


    if (
        redeNormalizada ===
        "especialistas"
    ) {

        return "Rede Especialistas";

    }


    return rede || "-";

}


// ============================================================
// MENSAGENS
// ============================================================

function mostrarMensagem(
    mensagem,
    tipo = "info"
) {

    /*
     * Procura primeiro por elementos já existentes
     * no HTML para não alterar o layout.
     */

    const elemento =
        encontrarElemento(
            "mensagem",
            "loginMensagem",
            "mensagemAdmin"
        );


    if (!elemento) {

        /*
         * Se o HTML não tiver uma área de mensagem,
         * usamos alert apenas como fallback.
         */

        console.log(
            `[${tipo}] ${mensagem}`
        );

        return;

    }


    elemento.textContent =
        mensagem;


    elemento.classList.remove(
        "sucesso",
        "erro",
        "info"
    );


    elemento.classList.add(
        tipo
    );


    elemento.style.display =
        "block";


    clearTimeout(
        elemento._timerMensagem
    );


    elemento._timerMensagem =
        setTimeout(
            () => {

                elemento.style.display =
                    "";

            },
            4000
        );

}


// ============================================================
// DATA ATUAL
// ============================================================

function atualizarData() {

    const elemento =
        encontrarElemento(
            "dataAtual",
            "dataHoje"
        );


    if (!elemento) {

        return;

    }


    const agora =
        new Date();


    elemento.textContent =
        agora.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}


// ============================================================
// TEMA
// ============================================================

function carregarTema() {

    const temaSalvo =
        localStorage.getItem(
            "temaAdmin"
        );


    if (
        temaSalvo ===
        "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }

}


// ============================================================
// ALTERNAR TEMA
// ============================================================

function alternarTema() {

    const ativo =
        document.body.classList.toggle(
            "dark-mode"
        );


    localStorage.setItem(
        "temaAdmin",
        ativo
            ? "dark"
            : "light"
    );

}


// ============================================================
// EVENTOS GERAIS
// ============================================================

function configurarEventosGerais() {

    /*
     * Cascata da localização da clínica.
     */

    ligarCascataLocalizacao(
        "clinicaRegiao",
        "clinicaEstado",
        "clinicaCidade",
        "clinicaBairro"
    );


    /*
     * Botão de adicionar especialidade.
     *
     * O HTML atual possui a classe
     * .btn-adicionar-especialidade.
     */

    const botoesAdicionar =
        document.querySelectorAll(
            ".btn-adicionar-especialidade"
        );


    botoesAdicionar.forEach(
        botao => {

            /*
             * Evita registrar o evento duas vezes
             * caso o HTML já possua onclick.
             */

            if (
                !botao.hasAttribute(
                    "onclick"
                )
            ) {

                botao.addEventListener(
                    "click",
                    adicionarLinhaEspecialidade
                );

            }

        }
    );


    /*
     * Filtros.
     */

    const filtroRegiao =
        document.getElementById(
            "filtro_estado_regiao"
        );


    if (
        filtroRegiao &&
        !filtroRegiao.hasAttribute(
            "onchange"
        )
    ) {

        filtroRegiao.addEventListener(
            "change",
            filtrarEstadosPorRegiao
        );

    }


    const filtroEstado =
        document.getElementById(
            "filtro_cidade_estado"
        );


    if (
        filtroEstado &&
        !filtroEstado.hasAttribute(
            "onchange"
        )
    ) {

        filtroEstado.addEventListener(
            "change",
            filtrarCidadesPorEstado
        );

    }


    const filtroCidade =
        document.getElementById(
            "filtro_bairro_cidade"
        );


    if (
        filtroCidade &&
        !filtroCidade.hasAttribute(
            "onchange"
        )
    ) {

        filtroCidade.addEventListener(
            "change",
            filtrarBairrosPorCidade
        );

    }


    /*
     * Fechar modal clicando fora.
     */

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            evento => {

                if (
                    evento.target ===
                    modal
                ) {

                    fecharModalClinica();

                }

            }
        );

    }

}


// ============================================================
// LOGIN
// ============================================================

async function fazerLogin() {

    const usuario =
        obterValor(
            "usuario"
        );


    const senha =
        obterValor(
            "senha"
        );


    const mensagem =
        document.getElementById(
            "loginMensagem"
        );


    if (!usuario || !senha) {

        if (mensagem) {

            mensagem.textContent =
                "Informe usuário e senha.";

            mensagem.className =
                "erro";

        }

        return;

    }


    /*
     * Mantemos a lógica de autenticação existente.
     * O admin.js não deve substituir a configuração
     * de autenticação definida no HTML/projeto.
     */

    try {

        /*
         * Primeiro tentamos autenticação pelo
         * Supabase Auth, caso esteja configurado.
         */

        if (
            typeof supabaseClient.auth
                ?.signInWithPassword ===
            "function"
        ) {

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

                        email:
                            usuario,

                        password:
                            senha

                    });


            if (
                !error &&
                data?.session
            ) {

                localStorage.setItem(
                    "adminLogado",
                    "true"
                );


                localStorage.setItem(
                    "usuarioAdmin",
                    usuario
                );


                window.location.href =
                    "admin.html";


                return;

            }

        }


        /*
         * Se o projeto estiver utilizando o login
         * administrativo existente no HTML, não
         * alteramos as credenciais aqui.
         */

        if (mensagem) {

            mensagem.textContent =
                "Usuário ou senha inválidos.";

            mensagem.className =
                "erro";

        }

    } catch (erro) {

        console.error(
            "Erro no login:",
            erro
        );


        if (mensagem) {

            mensagem.textContent =
                "Não foi possível realizar o login.";

            mensagem.className =
                "erro";

        }

    }

}


// ============================================================
// VERIFICAR LOGIN
// ============================================================

async function verificarLogin() {

    /*
     * Verificação por sessão do Supabase.
     */

    try {

        if (
            typeof supabaseClient.auth
                ?.getSession ===
            "function"
        ) {

            const {
                data
            } =
                await supabaseClient.auth
                    .getSession();


            if (
                data?.session
            ) {

                return true;

            }

        }

    } catch (erro) {

        console.warn(
            "Não foi possível verificar sessão:",
            erro
        );

    }


    return (
        localStorage.getItem(
            "adminLogado"
        ) === "true"
    );

}


// ============================================================
// LOGOUT
// ============================================================

async function fazerLogout() {

    try {

        if (
            typeof supabaseClient.auth
                ?.signOut ===
            "function"
        ) {

            await supabaseClient.auth
                .signOut();

        }

    } catch (erro) {

        console.warn(
            "Erro ao encerrar sessão:",
            erro
        );

    }


    localStorage.removeItem(
        "adminLogado"
    );


    localStorage.removeItem(
        "usuarioAdmin"
    );


    window.location.href =
        "admin.html";

}


// ============================================================
// ATUALIZAR DASHBOARD
// ============================================================

window.atualizarDashboard =
    carregarDashboard;


// ============================================================
// EXPOSIÇÃO DAS FUNÇÕES PARA O HTML
// ============================================================

window.mostrarPagina =
    mostrarPagina;


window.abrirModalClinica =
    abrirModalClinica;


window.fecharModalClinica =
    fecharModalClinica;


window.salvarClinica =
    salvarClinica;


window.editarClinica =
    editarClinica;


window.excluirClinica =
    excluirClinica;


window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;


window.editarEspecialidadeClinica =
    editarEspecialidadeClinica;


window.excluirEspecialidadeClinica =
    excluirEspecialidadeClinica;


window.salvarNovaEspecialidadeClinica =
    salvarNovaEspecialidadeClinica;


window.salvarEdicaoEspecialidadeClinica =
    salvarEdicaoEspecialidadeClinica;


window.cancelarNovaEspecialidadeClinica =
    cancelarNovaEspecialidadeClinica;


window.cancelarEdicaoEspecialidadeClinica =
    cancelarEdicaoEspecialidadeClinica;


window.salvarEspecialidadesClinica =
    salvarEspecialidadesClinica;


// ============================================================
// ESPECIALIDADES GERAIS
// ============================================================

window.salvarEspecialidade =
    salvarEspecialidade;


window.editarEspecialidade =
    editarEspecialidade;


window.excluirEspecialidade =
    excluirEspecialidade;


window.listarEspecialidades =
    listarEspecialidades;


// ============================================================
// REGIÕES
// ============================================================

window.salvarRegiao =
    salvarRegiao;


window.editarRegiao =
    editarRegiao;


window.excluirRegiao =
    excluirRegiao;


window.listarRegioes =
    listarRegioes;


// ============================================================
// ESTADOS
// ============================================================

window.salvarEstado =
    salvarEstado;


window.editarEstado =
    editarEstado;


window.excluirEstado =
    excluirEstado;


window.listarEstados =
    listarEstados;


window.filtrarEstadosPorRegiao =
    filtrarEstadosPorRegiao;


// ============================================================
// CIDADES
// ============================================================

window.salvarCidade =
    salvarCidade;


window.editarCidade =
    editarCidade;


window.excluirCidade =
    excluirCidade;


window.listarCidades =
    listarCidades;


window.filtrarCidadesPorEstado =
    filtrarCidadesPorEstado;


// ============================================================
// BAIRROS
// ============================================================

window.salvarBairro =
    salvarBairro;


window.editarBairro =
    editarBairro;


window.excluirBairro =
    excluirBairro;


window.listarBairros =
    listarBairros;


window.filtrarBairrosPorCidade =
    filtrarBairrosPorCidade;


// ============================================================
// LOGIN / LOGOUT
// ============================================================

window.fazerLogin =
    fazerLogin;


window.fazerLogout =
    fazerLogout;


window.verificarLogin =
    verificarLogin;


window.sair =
    sair;


window.voltarAoSite =
    voltarAoSite;


// ============================================================
// TEMA
// ============================================================

window.alternarTema =
    alternarTema;


window.carregarTema =
    carregarTema;


// ============================================================
// LOCALIZAÇÃO
// ============================================================

window.popularRegioes =
    popularRegioes;


window.popularRegioesComTodas =
    popularRegioesComTodas;


window.popularEstados =
    popularEstados;


window.popularEstadosSemRegiao =
    popularEstadosSemRegiao;


window.popularEstadosComTodas =
    popularEstadosComTodas;


window.popularCidades =
    popularCidades;


window.popularCidadesSemEstado =
    popularCidadesSemEstado;


window.popularCidadesComTodas =
    popularCidadesComTodas;


window.popularBairros =
    popularBairros;


window.popularBairrosComTodas =
    popularBairrosComTodas;


window.popularEspecialidades =
    popularEspecialidades;


window.ligarCascataLocalizacao =
    ligarCascataLocalizacao;


// ============================================================
// FUNÇÕES AUXILIARES EXPORTADAS
// ============================================================

window.normalizarRede =
    normalizarRede;


window.nomeRede =
    nomeRede;


// ============================================================
// FIM DO ADMIN.JS
// ============================================================

console.log(
    "admin.js finalizado e funções globais registradas."
);
