// ============================================================
// ADMIN.JS — PARTE 1/3
// REDE ESPECIALISTAS
// ============================================================

console.log("admin.js carregado");

const NOME_REDE = "Rede Especialistas";

let clinicaEditandoId = null;
let especialidadesClinicaTemp = [];


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

    /*
     * O HTML utiliza:
     *
     * .pagina
     * .ativa
     * id="pagina-dashboard"
     * id="pagina-clinicas"
     *
     * Por isso a navegação precisa seguir exatamente
     * essa estrutura.
     */

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


    /*
     * Atualiza o botão ativo do menu.
     *
     * O HTML utiliza:
     *
     * data-pagina="dashboard"
     *
     * e a classe:
     *
     * ativo
     */

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


    /*
     * Atualiza título, caso exista no HTML.
     */

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina] ||
            nomePagina;

    }


    /*
     * Carrega os dados específicos da página.
     */

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

        /*
         * Busca clínicas.
         */

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


        /*
         * Busca especialidades.
         */

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


        /*
         * Busca quantidade das localidades
         * em paralelo.
         */

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


        /*
         * Verifica erros das contagens.
         */

        if (regioesResult.error) {
            console.error(
                "Erro ao contar regiões:",
                regioesResult.error
            );
        }


        if (estadosResult.error) {
            console.error(
                "Erro ao contar estados:",
                estadosResult.error
            );
        }


        if (cidadesResult.error) {
            console.error(
                "Erro ao contar cidades:",
                cidadesResult.error
            );
        }


        if (bairrosResult.error) {
            console.error(
                "Erro ao contar bairros:",
                bairrosResult.error
            );
        }


        const totalRegioes =
            regioesResult.count || 0;


        const totalEstados =
            estadosResult.count || 0;


        const totalCidades =
            cidadesResult.count || 0;


        const totalBairros =
            bairrosResult.count || 0;


        /*
         * Atualiza os cards do dashboard.
         *
         * IDs corrigidos de acordo com admin.html.
         */

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


        /*
         * Percentual de clínicas ativas.
         */

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


        /*
         * Barra de progresso.
         */

        const barra =
            document.getElementById(
                "barraAtivas"
            );


        if (barra) {

            barra.style.width =
                `${percentual}%`;

        }


        /*
         * Legendas.
         */

        atualizarElemento(
            "legendaAtivas",
            `${clinicasAtivas} ativas`
        );


        atualizarElemento(
            "legendaInativas",
            `${clinicasInativas} inativas`
        );


        /*
         * Últimas clínicas cadastradas.
         */

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
        encontrarElemento([
            "ultimasClinicas",
            "listaUltimasClinicas"
        ]);


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


        if (!data?.length) {

            container.innerHTML =
                `<div class="carregando">
                    Nenhuma clínica cadastrada.
                </div>`;

            return;

        }


        container.innerHTML =
            data.map(clinica => {

                const status =
                    clinica.ativo === true
                        ? "ativo"
                        : "inativo";


                const textoStatus =
                    clinica.ativo === true
                        ? "Ativa"
                        : "Inativa";


                return `

                    <div class="item-clinica-dashboard">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    clinica.nome
                                )}
                            </strong>

                            ${
                                clinica.telefone
                                    ? `
                                        <small>
                                            ${escapeHTML(
                                                clinica.telefone
                                            )}
                                        </small>
                                      `
                                    : ""
                            }

                        </div>

                        <span
                            class="status ${status}"
                        >
                            ${textoStatus}
                        </span>

                    </div>

                `;

            }).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar últimas clínicas:",
            erro
        );


        container.innerHTML =
            `<div class="carregando">
                Não foi possível carregar as clínicas.
            </div>`;

    }

}


// ============================================================
// CLÍNICAS
// ============================================================

async function carregarPaginaClinicas() {

    await popularRegioes();

    await popularEstados();

    await popularCidades();

    await popularBairros();

    await listarClinicas();

}


// ============================================================
// LISTAR CLÍNICAS
// ============================================================

async function listarClinicas() {

    const container =
        document.getElementById(
            "listaClinicas"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        `<tr>
            <td colspan="6" class="carregando">
                Carregando clínicas...
            </td>
        </tr>`;


    try {

        let query =
            supabaseClient
                .from("clinicas")
                .select(`
                    id,
                    nome,
                    endereco,
                    telefone,
                    ativo,
                    bairro_id,
                    bairros(
                        id,
                        nome,
                        cidades(
                            id,
                            nome,
                            estados(
                                id,
                                nome,
                                regioes(
                                    id,
                                    nome
                                )
                            )
                        )
                    )
                `)
                .order("nome");


        /*
         * Filtro por nome.
         */

        const campoBusca =
            document.getElementById(
                "buscarClinica"
            );


        const busca =
            campoBusca?.value
                ?.trim();


        if (busca) {

            query =
                query.ilike(
                    "nome",
                    `%${busca}%`
                );

        }


        /*
         * Filtro por status.
         */

        const filtroStatus =
            document.getElementById(
                "filtroStatusClinica"
            );


        const status =
            filtroStatus?.value;


        if (
            status === "true"
        ) {

            query =
                query.eq(
                    "ativo",
                    true
                );

        }


        if (
            status === "false"
        ) {

            query =
                query.eq(
                    "ativo",
                    false
                );

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            throw error;

        }


        if (!data?.length) {

            container.innerHTML =
                `<tr>
                    <td
                        colspan="6"
                        class="vazio"
                    >
                        Nenhuma clínica encontrada.
                    </td>
                </tr>`;

            return;

        }


        const linhas = [];


        for (
            const clinica of data
        ) {

            const especialidades =
                await obterEspecialidadesClinica(
                    clinica.id
                );


            const localizacao =
                montarLocalizacaoClinica(
                    clinica
                );


            const nomesEspecialidades =
                especialidades
                    .map(
                        item =>
                            escapeHTML(
                                item.nome
                            )
                    )
                    .join(", ");


            const statusClinica =
                clinica.ativo === true
                    ? "Ativa"
                    : "Inativa";


            const classeStatus =
                clinica.ativo === true
                    ? "ativo"
                    : "inativo";


            linhas.push(`

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(
                                clinica.nome
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(
                            localizacao
                        )}
                    </td>

                    <td>
                        ${
                            clinica.telefone
                                ? escapeHTML(
                                    clinica.telefone
                                )
                                : "-"
                        }
                    </td>

                    <td>
                        ${
                            nomesEspecialidades ||
                            "-"
                        }
                    </td>

                    <td>
                        <span
                            class="status ${classeStatus}"
                        >
                            ${statusClinica}
                        </span>
                    </td>

                    <td>

                        <div class="acoes-tabela">

                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarClinica(${clinica.id})"
                            >
                                ✏️
                            </button>

                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirClinica(${clinica.id})"
                            >
                                🗑️
                            </button>

                        </div>

                    </td>

                </tr>

            `);

        }


        container.innerHTML =
            linhas.join("");


    } catch (erro) {

        console.error(
            "Erro ao listar clínicas:",
            erro
        );


        container.innerHTML =
            `<tr>
                <td
                    colspan="6"
                    class="vazio"
                >
                    Erro ao carregar clínicas.
                </td>
            </tr>`;

    }

}


// ============================================================
// LOCALIZAÇÃO DA CLÍNICA
// ============================================================

function montarLocalizacaoClinica(
    clinica
) {

    const bairro =
        clinica?.bairros;


    const cidade =
        bairro?.cidades;


    const estado =
        cidade?.estados;


    const regiao =
        estado?.regioes;


    const partes = [];


    if (bairro?.nome) {

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


    return partes.length
        ? partes.join(" - ")
        : "Sem localização";

}


// ============================================================
// ESPECIALIDADES DA CLÍNICA
// ============================================================

async function obterEspecialidadesClinica(
    clinicaId
) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinica_especialidades")
            .select(`
                clinica_id,
                especialidade_id,
                rede,
                ativo
            `)
            .eq(
                "clinica_id",
                clinicaId
            );


        if (error) {

            throw error;

        }


        if (!data?.length) {

            return [];

        }


        const ids =
            [
                ...new Set(
                    data
                        .map(
                            item =>
                                item.especialidade_id
                        )
                        .filter(Boolean)
                )
            ];


        if (!ids.length) {

            return [];

        }


        const {
            data: especialidades,
            error: erroEspecialidades
        } = await supabaseClient
            .from("especialidades")
            .select(`
                id,
                nome
            `)
            .in(
                "id",
                ids
            );


        if (erroEspecialidades) {

            throw erroEspecialidades;

        }


        const mapa =
            new Map(
                (especialidades || [])
                    .map(
                        item => [
                            item.id,
                            item.nome
                        ]
                    )
            );


        return data.map(item => ({

            id:
                item.especialidade_id,

            nome:
                mapa.get(
                    item.especialidade_id
                ) ||
                "Especialidade",

            rede:
                normalizarRede(
                    item.rede
                ),

            ativo:
                item.ativo !== false

        }));


    } catch (erro) {

        console.error(
            "Erro ao buscar especialidades da clínica:",
            erro
        );


        return [];

    }

}


// ============================================================
// EDITAR CLÍNICA
// ============================================================

async function editarClinica(id) {

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
                bairro_id
            `)
            .eq(
                "id",
                id
            )
            .single();


        if (error) {

            throw error;

        }


        clinicaEditandoId =
            id;


        preencherCampo(
            [
                "clinicaId"
            ],
            data.id
        );


        preencherCampo(
            [
                "clinicaNome"
            ],
            data.nome
        );


        preencherCampo(
            [
                "clinicaEndereco"
            ],
            data.endereco
        );


        preencherCampo(
            [
                "clinicaTelefone"
            ],
            data.telefone
        );


        const ativo =
            encontrarElemento([
                "clinicaAtivo"
            ]);


        if (ativo) {

            ativo.checked =
                data.ativo !== false;

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


        await preencherLocalizacaoClinica(
            data.bairro_id
        );


        await carregarEspecialidadesClinicaNoModal(
            id
        );


        const titulo =
            document.getElementById(
                "tituloModalClinica"
            );


        if (titulo) {

            titulo.textContent =
                "Editar Clínica";

        }


        abrirModalClinica();


    } catch (erro) {

        console.error(
            "Erro ao editar clínica:",
            erro
        );

        mostrarMensagem(
            "Não foi possível carregar a clínica.",
            "erro"
        );

    }

}


// ============================================================
// PREENCHER LOCALIZAÇÃO DA CLÍNICA
// ============================================================

async function preencherLocalizacaoClinica(
    bairroId
) {

    if (!bairroId) {

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select(`
                id,
                cidade_id,
                cidades(
                    id,
                    estado_id,
                    estados(
                        id,
                        regiao_id,
                        regioes(
                            id
                        )
                    )
                )
            `)
            .eq(
                "id",
                bairroId
            )
            .single();


        if (error) {

            throw error;

        }


        const cidadeId =
            data.cidade_id;


        const estadoId =
            data.cidades?.estado_id;


        const regiaoId =
            data.cidades?.estados?.regiao_id;


        const regiao =
            encontrarElemento([
                "clinicaRegiao"
            ]);


        const estado =
            encontrarElemento([
                "clinicaEstado"
            ]);


        const cidade =
            encontrarElemento([
                "clinicaCidade"
            ]);


        const bairro =
            encontrarElemento([
                "clinicaBairro"
            ]);


        /*
         * Carrega região.
         */

        if (regiao) {

            await popularRegioes(
                regiao.id
            );

            regiao.value =
                regiaoId || "";

        }


        /*
         * Carrega estados daquela região.
         */

        if (estado) {

            await popularEstados(
                estado.id,
                regiaoId
            );

            estado.value =
                estadoId || "";

        }


        /*
         * Carrega cidades daquele estado.
         */

        if (cidade) {

            await popularCidades(
                cidade.id,
                estadoId
            );

            cidade.value =
                cidadeId || "";

        }


        /*
         * Carrega bairros daquela cidade.
         */

        if (bairro) {

            await popularBairros(
                bairro.id,
                cidadeId
            );

            bairro.value =
                bairroId || "";

        }

    } catch (erro) {

        console.error(
            "Erro ao preencher localização:",
            erro
        );

    }

}


// ============================================================
// CARREGAR ESPECIALIDADES NO MODAL
// ============================================================

async function carregarEspecialidadesClinicaNoModal(
    clinicaId
) {

    const container =
        encontrarElemento([
            "containerEspecialidades",
            "listaEspecialidadesClinica",
            "especialidadesClinica",
            "linhasEspecialidades"
        ]);


    if (!container) {

        return;

    }


    container.innerHTML = "";

    especialidadesClinicaTemp = [];


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinica_especialidades")
            .select(`
                especialidade_id,
                rede,
                ativo
            `)
            .eq(
                "clinica_id",
                clinicaId
            );


        if (error) {

            throw error;

        }


        if (!data?.length) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhuma especialidade adicionada.
                </div>`;

            return;

        }


        for (
            const item of data
        ) {

            await adicionarLinhaEspecialidade(
                item.especialidade_id,
                item.rede,
                item.ativo,
                true
            );

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades da clínica:",
            erro
        );

    }

}


// ============================================================
// ADICIONAR LINHA DE ESPECIALIDADE
// ============================================================

async function adicionarLinhaEspecialidade(
    especialidadeId = "",
    rede = "",
    ativo = true,
    carregandoDoBanco = false
) {

    const container =
        encontrarElemento([
            "containerEspecialidades",
            "listaEspecialidadesClinica",
            "especialidadesClinica",
            "linhasEspecialidades"
        ]);


    if (!container) {

        console.error(
            "Container de especialidades não encontrado."
        );

        return;

    }


    /*
     * Remove mensagem de vazio.
     */

    const vazio =
        container.querySelector(
            ".especialidades-vazio"
        );


    if (vazio) {

        vazio.remove();

    }


    /*
     * Cria linha.
     */

    const linha =
        document.createElement(
            "div"
        );


    linha.className =
        "linha-especialidade";


    /*
     * Select de especialidade.
     */

    const selectEspecialidade =
        document.createElement(
            "select"
        );


    selectEspecialidade.className =
        "select-especialidade";


    selectEspecialidade.innerHTML =
        `<option value="">
            Selecione a especialidade
        </option>`;


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
            .order("nome");


        if (error) {

            throw error;

        }


        (data || [])
            .forEach(item => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    item.id;


                option.textContent =
                    item.nome;


                selectEspecialidade.appendChild(
                    option
                );

            });


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades:",
            erro
        );

    }


    if (especialidadeId) {

        selectEspecialidade.value =
            especialidadeId;

    }


    /*
     * Select da rede.
     */

    const selectRede =
        document.createElement(
            "select"
        );


    selectRede.className =
        "select-rede-especialidade";


    selectRede.innerHTML = `

        <option value="">
            Selecione a rede
        </option>

        <option value="Especialistas">
            Rede Especialistas
        </option>

        <option value="Sindilegis">
            Rede Sindilegis
        </option>

    `;


    const redeNormalizada =
        normalizarRede(
            rede
        );


    if (redeNormalizada) {

        selectRede.value =
            redeNormalizada;

    }


    if (carregandoDoBanco) {

        linha.dataset.redeOriginal =
            String(
                rede ?? ""
            );

    }


    /*
     * Checkbox de ativo.
     */

    const areaAtivo =
        document.createElement(
            "label"
        );


    areaAtivo.className =
        "checkbox-especialidade";


    const checkbox =
        document.createElement(
            "input"
        );


    checkbox.type =
        "checkbox";


    checkbox.className =
        "checkbox-especialidade-ativa";


    checkbox.checked =
        ativo !== false;


    areaAtivo.appendChild(
        checkbox
    );


    const textoAtivo =
        document.createElement(
            "span"
        );


    textoAtivo.textContent =
        "Ativa";


    areaAtivo.appendChild(
        textoAtivo
    );


    /*
     * Botão remover.
     */

    const btnRemover =
        document.createElement(
            "button"
        );


    btnRemover.type =
        "button";


    btnRemover.className =
        "btn-remover-especialidade";


    btnRemover.textContent =
        "✕";


    btnRemover.title =
        "Remover especialidade";


    btnRemover.addEventListener(
        "click",
        () => {

            linha.remove();


            /*
             * Se não houver mais linhas,
             * mostra novamente a mensagem.
             */

            const linhas =
                container.querySelectorAll(
                    ".linha-especialidade"
                );


            if (!linhas.length) {

                container.innerHTML =
                    `<div class="especialidades-vazio">
                        Nenhuma especialidade adicionada.
                    </div>`;

            }

        }
    );


    /*
     * Monta a linha.
     */

    linha.appendChild(
        selectEspecialidade
    );


    linha.appendChild(
        selectRede
    );


    linha.appendChild(
        areaAtivo
    );


    linha.appendChild(
        btnRemover
    );


    container.appendChild(
        linha
    );


    /*
     * Guarda referência temporária.
     */

    especialidadesClinicaTemp.push({

        linha,

        selectEspecialidade,

        selectRede,

        checkbox

    });

}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(event) {

    /*
     * O formulário do admin.html chama:
     *
     * onsubmit="salvarClinica(event)"
     *
     * Portanto é obrigatório impedir o submit
     * tradicional do navegador.
     */

    if (event) {

        event.preventDefault();

    }


    const nome =
        obterValor([
            "clinicaNome"
        ]).trim();


    const endereco =
        obterValor([
            "clinicaEndereco"
        ]).trim();


    const telefone =
        obterValor([
            "clinicaTelefone"
        ]).trim();


    const bairroId =
        obterValor([
            "clinicaBairro"
        ]);


    const ativoElemento =
        encontrarElemento([
            "clinicaAtivo"
        ]);


    const ativo =
        ativoElemento
            ? ativoElemento.checked
            : true;


    /*
     * Validações.
     */

    if (!nome) {

        mostrarMensagem(
            "Informe o nome da clínica.",
            "erro"
        );

        return;

    }


    if (!endereco) {

        mostrarMensagem(
            "Informe o endereço da clínica.",
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


    const dadosClinica = {

        nome,

        endereco,

        telefone:
            telefone || null,

        bairro_id:
            Number(bairroId),

        ativo

    };


    try {

        let clinicaId =
            clinicaEditandoId;


        /*
         * Se existe ID, atualiza.
         * Caso contrário, cria nova clínica.
         */

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
                .select("id")
                .single();


            if (error) {

                throw error;

            }


            clinicaId =
                data.id;

        }


        /*
         * Salva as especialidades relacionadas.
         */

        await salvarEspecialidadesClinica(
            clinicaId
        );


        mostrarMensagem(
            clinicaEditandoId
                ? "Clínica atualizada com sucesso!"
                : "Clínica cadastrada com sucesso!",
            "sucesso"
        );


        fecharModalClinica();


        const form =
            document.getElementById(
                "formClinica"
            );


        if (form) {

            form.reset();

        }


        clinicaEditandoId =
            null;


        await listarClinicas();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar clínica:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
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
     * Busca relacionamentos existentes.
     */

    const {
        data: existentes,
        error: erroExistentes
    } = await supabaseClient
        .from("clinica_especialidades")
        .select(`
            id,
            especialidade_id,
            rede,
            ativo
        `)
        .eq(
            "clinica_id",
            clinicaId
        );


    if (erroExistentes) {

        throw erroExistentes;

    }


    /*
     * Todas as linhas atualmente no modal.
     */

    const linhas =
        document.querySelectorAll(
            "#containerEspecialidades .linha-especialidade"
        );


    const selecionadas = [];


    linhas.forEach(linha => {

        const selectEspecialidade =
            linha.querySelector(
                ".select-especialidade"
            );


        const selectRede =
            linha.querySelector(
                ".select-rede-especialidade"
            );


        const checkbox =
            linha.querySelector(
                ".checkbox-especialidade-ativa"
            );


        if (
            !selectEspecialidade ||
            !selectRede
        ) {

            return;

        }


        const especialidadeId =
            selectEspecialidade.value;


        const rede =
            normalizarRede(
                selectRede.value
            );


        if (
            !especialidadeId ||
            !rede
        ) {

            return;

        }


        const redeOriginal =
            linha.dataset.redeOriginal ||
            "";


        selecionadas.push({

            especialidade_id:
                Number(
                    especialidadeId
                ),

            rede,

            redeOriginal,

            ativo:
                checkbox
                    ? checkbox.checked
                    : true

        });

    });


    /*
     * Remove duplicidades.
     */

    const unicas = [];


    const chaves =
        new Set();


    selecionadas.forEach(item => {

        const chave =
            `${item.especialidade_id}|${item.rede}`;


        if (
            chaves.has(chave)
        ) {

            return;

        }


        chaves.add(chave);

        unicas.push(item);

    });


    /*
     * Exclui relacionamentos que foram removidos
     * do formulário.
     */

    for (
        const existente of (
            existentes || []
        )
    ) {

        const redeExistente =
            normalizarRede(
                existente.rede
            );


        const aindaExiste =
            unicas.some(item =>

                Number(
                    item.especialidade_id
                ) ===
                Number(
                    existente.especialidade_id
                )

                &&

                (
                    item.redeOriginal
                        ? item.redeOriginal ===
                          existente.rede
                        : item.rede ===
                          redeExistente
                )

            );


        if (!aindaExiste) {

            const {
                error
            } = await supabaseClient
                .from("clinica_especialidades")
                .delete()
                .eq(
                    "id",
                    existente.id
                );


            if (error) {

                throw error;

            }

        }

    }


    /*
     * Atualiza ou cria relacionamentos.
     */

    for (
        const item of unicas
    ) {

        let existente =
            (existentes || [])
                .find(row =>

                    Number(
                        row.especialidade_id
                    ) ===
                    Number(
                        item.especialidade_id
                    )

                    &&

                    (
                        item.redeOriginal
                            ? row.rede ===
                              item.redeOriginal
                            : normalizarRede(
                                row.rede
                              ) ===
                              item.rede
                    )

                );


        if (existente) {

            const {
                error
            } = await supabaseClient
                .from("clinica_especialidades")
                .update({
                    ativo:
                        item.ativo
                })
                .eq(
                    "id",
                    existente.id
                );


            if (error) {

                throw error;

            }

        } else {

            const {
                error
            } = await supabaseClient
                .from("clinica_especialidades")
                .insert({

                    clinica_id:
                        Number(
                            clinicaId
                        ),

                    especialidade_id:
                        Number(
                            item.especialidade_id
                        ),

                    rede:
                        item.rede,

                    ativo:
                        item.ativo

                });


            if (error) {

                throw error;

            }

        }

    }

}


// ============================================================
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta clínica?"
        )
    ) {

        return;

    }


    try {

        /*
         * A FK já possui ON DELETE CASCADE,
         * mas a exclusão dos relacionamentos é feita
         * explicitamente para evitar problemas caso
         * a estrutura do banco tenha sido alterada.
         */

        const {
            error: erroRelacionamentos
        } = await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "clinica_id",
                id
            );


        if (erroRelacionamentos) {

            throw erroRelacionamentos;

        }


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
            erro?.message ||
            "Não foi possível excluir a clínica.",
            "erro"
        );

    }

}
// ============================================================
// ESPECIALIDADES
// ============================================================

async function carregarPaginaEspecialidades() {

    await listarEspecialidades();

}


async function listarEspecialidades() {

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
            .order("nome");


        if (error) {

            throw error;

        }


        const container =
            document.getElementById(
                "listaEspecialidades"
            );


        if (!container) {

            return;

        }


        if (!data?.length) {

            container.innerHTML =
                `<p class="vazio">
                    Nenhuma especialidade cadastrada.
                </p>`;

            return;

        }


        container.innerHTML =
            data.map(item => `

                <div class="item-lista">

                    <span>
                        ${escapeHTML(item.nome)}
                    </span>

                    <div class="acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarEspecialidade(${item.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirEspecialidade(${item.id})"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades:",
            erro
        );

    }

}


// ============================================================
// SALVAR ESPECIALIDADE
// ============================================================

async function salvarEspecialidade() {

    const input =
        encontrarElemento([
            "nomeEspecialidade",
            "novaEspecialidade",
            "nova_especialidade"
        ]);


    if (!input) {

        console.error(
            "Campo de especialidade não encontrado."
        );

        return;

    }


    const nome =
        input.value.trim();


    if (!nome) {

        mostrarMensagem(
            "Informe o nome da especialidade.",
            "erro"
        );

        return;

    }


    try {

        /*
         * Verifica se já existe uma especialidade
         * com o mesmo nome.
         */

        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("especialidades")
            .select("id,nome")
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
            existente.length > 0
        ) {

            mostrarMensagem(
                "Esta especialidade já está cadastrada.",
                "erro"
            );

            return;

        }


        const {
            error
        } = await supabaseClient
            .from("especialidades")
            .insert({

                nome

            });


        if (error) {

            throw error;

        }


        input.value = "";


        mostrarMensagem(
            "Especialidade cadastrada com sucesso!",
            "sucesso"
        );


        await listarEspecialidades();

        await popularEspecialidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar especialidade:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Erro ao salvar especialidade.",
            "erro"
        );

    }

}


// ============================================================
// EDITAR ESPECIALIDADE
// ============================================================

async function editarEspecialidade(id) {

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


        const novoNome =
            prompt(
                "Digite o novo nome:",
                data.nome
            );


        if (
            novoNome === null ||
            !novoNome.trim()
        ) {

            return;

        }


        const nome =
            novoNome.trim();


        /*
         * Verifica duplicidade.
         */

        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("especialidades")
            .select("id,nome")
            .ilike(
                "nome",
                nome
            )
            .neq(
                "id",
                id
            )
            .limit(1);


        if (erroBusca) {

            throw erroBusca;

        }


        if (existente?.length) {

            mostrarMensagem(
                "Já existe outra especialidade com esse nome.",
                "erro"
            );

            return;

        }


        const {
            error: erroUpdate
        } = await supabaseClient
            .from("especialidades")
            .update({

                nome

            })
            .eq(
                "id",
                id
            );


        if (erroUpdate) {

            throw erroUpdate;

        }


        mostrarMensagem(
            "Especialidade atualizada!",
            "sucesso"
        );


        await listarEspecialidades();

        await popularEspecialidades();


    } catch (erro) {

        console.error(
            "Erro ao editar especialidade:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Erro ao atualizar especialidade.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR ESPECIALIDADE
// ============================================================

async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) {

        return;

    }


    try {

        /*
         * Primeiro remove os relacionamentos.
         */

        const {
            error: erroRelacionamentos
        } = await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "especialidade_id",
                id
            );


        if (erroRelacionamentos) {

            throw erroRelacionamentos;

        }


        /*
         * Depois remove a especialidade.
         */

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
            "Especialidade excluída!",
            "sucesso"
        );


        await listarEspecialidades();

        await popularEspecialidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir especialidade:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Não foi possível excluir a especialidade.",
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


// ============================================================
// POPULAR REGIÕES
// ============================================================

async function popularRegioes(
    selectId = null
) {

    const selects = selectId
        ? [
            document.getElementById(
                selectId
            )
        ]
        : [
            ...document.querySelectorAll(
                "#estadoRegiao, #clinicaRegiao, #filtroEstadoRegiao"
            )
        ];


    /*
     * Remove elementos inexistentes
     * e duplicados.
     */

    const listaSelects =
        selects
            .filter(Boolean)
            .filter(
                (select, index, array) =>
                    array.indexOf(select) === index
            );


    for (
        const select of listaSelects
    ) {

        const valorAtual =
            select.value;


        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select(`
                id,
                nome
            `)
            .order("nome");


        if (error) {

            console.error(
                "Erro ao carregar regiões:",
                error
            );

            continue;

        }


        let primeiraOpcao =
            "Selecione Região";


        if (
            select.id ===
            "filtroEstadoRegiao"
        ) {

            primeiraOpcao =
                "Todas as Regiões";

        }


        select.innerHTML =
            `<option value="">
                ${primeiraOpcao}
            </option>`;


        (data || [])
            .forEach(regiao => {

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

            });


        if (valorAtual) {

            select.value =
                valorAtual;

        }

    }

}


// ============================================================
// LISTAR REGIÕES
// ============================================================

async function listarRegioes() {

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
            .order("nome");


        if (error) {

            throw error;

        }


        const container =
            document.getElementById(
                "listaRegioes"
            );


        if (!container) {

            return;

        }


        if (!data?.length) {

            container.innerHTML =
                `<p class="vazio">
                    Nenhuma região cadastrada.
                </p>`;

            return;

        }


        container.innerHTML =
            data.map(regiao => `

                <div class="item-lista">

                    <span>
                        ${escapeHTML(
                            regiao.nome
                        )}
                    </span>

                    <div class="acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarRegiao(${regiao.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirRegiao(${regiao.id})"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar regiões:",
            erro
        );

    }

}


// ============================================================
// SALVAR REGIÃO
// ============================================================

async function salvarRegiao() {

    const input =
        encontrarElemento([
            "nomeRegiao",
            "novaRegiao",
            "nova_regiao"
        ]);


    if (!input) {

        console.error(
            "Campo de região não encontrado."
        );

        return;

    }


    const nome =
        input.value.trim();


    if (!nome) {

        mostrarMensagem(
            "Informe o nome da região.",
            "erro"
        );

        return;

    }


    try {

        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("regioes")
            .select("id,nome")
            .ilike(
                "nome",
                nome
            )
            .limit(1);


        if (erroBusca) {

            throw erroBusca;

        }


        if (existente?.length) {

            mostrarMensagem(
                "Esta região já está cadastrada.",
                "erro"
            );

            return;

        }


        const {
            error
        } = await supabaseClient
            .from("regioes")
            .insert({

                nome

            });


        if (error) {

            throw error;

        }


        input.value = "";


        mostrarMensagem(
            "Região cadastrada com sucesso!",
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
            erro?.message ||
            "Erro ao salvar região.",
            "erro"
        );

    }

}


// ============================================================
// EDITAR REGIÃO
// ============================================================

async function editarRegiao(id) {

    const nome =
        prompt(
            "Novo nome da região:"
        );


    if (
        nome === null ||
        !nome.trim()
    ) {

        return;

    }


    try {

        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("regioes")
            .select("id,nome")
            .ilike(
                "nome",
                nome.trim()
            )
            .neq(
                "id",
                id
            )
            .limit(1);


        if (erroBusca) {

            throw erroBusca;

        }


        if (existente?.length) {

            mostrarMensagem(
                "Já existe outra região com esse nome.",
                "erro"
            );

            return;

        }


        const {
            error
        } = await supabaseClient
            .from("regioes")
            .update({

                nome:
                    nome.trim()

            })
            .eq(
                "id",
                id
            );


        if (error) {

            throw error;

        }


        mostrarMensagem(
            "Região atualizada!",
            "sucesso"
        );


        await listarRegioes();

        await popularRegioes();

        await popularEstados();


    } catch (erro) {

        console.error(
            "Erro ao editar região:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Erro ao atualizar região.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR REGIÃO
// ============================================================

async function excluirRegiao(id) {

    if (
        !confirm(
            "Excluir esta região? Os estados, cidades e bairros relacionados poderão ser afetados."
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

        await popularEstados();

        await popularCidades();

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir região:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Não foi possível excluir a região.",
            "erro"
        );

    }

}


// ============================================================
// ESTADOS
// ============================================================

async function carregarPaginaEstados() {

    await popularRegioes();

    await listarEstados();

}


// ============================================================
// POPULAR ESTADOS
// ============================================================

async function popularEstados(
    selectId = null,
    regiaoId = null
) {

    const selects = selectId
        ? [
            document.getElementById(
                selectId
            )
        ]
        : [
            ...document.querySelectorAll(
                "#cidadeEstado, #clinicaEstado, #filtroCidadeEstado"
            )
        ];


    const listaSelects =
        selects
            .filter(Boolean)
            .filter(
                (select, index, array) =>
                    array.indexOf(select) === index
            );


    for (
        const select of listaSelects
    ) {

        const valorAtual =
            select.value;


        let query =
            supabaseClient
                .from("estados")
                .select(`
                    id,
                    nome,
                    regiao_id
                `)
                .order("nome");


        /*
         * Se foi informada uma região,
         * filtra os estados.
         */

        if (regiaoId) {

            query =
                query.eq(
                    "regiao_id",
                    Number(regiaoId)
                );

        }


        /*
         * Filtro da página de cidades.
         */

        if (
            select.id ===
            "filtroCidadeEstado"
        ) {

            const regiaoFiltro =
                obterValor([
                    "filtroEstadoRegiao"
                ]);


            if (regiaoFiltro) {

                query =
                    query.eq(
                        "regiao_id",
                        Number(
                            regiaoFiltro
                        )
                    );

            }

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            console.error(
                "Erro ao carregar estados:",
                error
            );

            continue;

        }


        let texto =
            "Selecione Estado";


        if (
            select.id ===
            "filtroCidadeEstado"
        ) {

            texto =
                "Todos os Estados";

        }


        select.innerHTML =
            `<option value="">
                ${texto}
            </option>`;


        (data || [])
            .forEach(estado => {

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

            });


        if (valorAtual) {

            select.value =
                valorAtual;

        }

    }

}


// ============================================================
// LISTAR ESTADOS
// ============================================================

async function listarEstados() {

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
                regioes(
                    id,
                    nome
                )
            `)
            .order("nome");


        if (error) {

            throw error;

        }


        const container =
            document.getElementById(
                "listaEstados"
            );


        if (!container) {

            return;

        }


        if (!data?.length) {

            container.innerHTML =
                `<p class="vazio">
                    Nenhum estado cadastrado.
                </p>`;

            return;

        }


        container.innerHTML =
            data.map(estado => `

                <div class="item-lista">

                    <div>

                        <strong>
                            ${escapeHTML(
                                estado.nome
                            )}
                        </strong>

                        <small>
                            ${
                                escapeHTML(
                                    estado.regioes?.nome ||
                                    "Sem região"
                                )
                            }
                        </small>

                    </div>

                    <div class="acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarEstado(${estado.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirEstado(${estado.id})"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar estados:",
            erro
        );

    }

}


// ============================================================
// SALVAR ESTADO
// ============================================================

async function salvarEstado() {

    const input =
        encontrarElemento([
            "nomeEstado",
            "novoEstado",
            "novo_estado"
        ]);


    const select =
        encontrarElemento([
            "estadoRegiao"
        ]);


    if (!input || !select) {

        console.error(
            "Campos de estado não encontrados."
        );

        return;

    }


    const nome =
        input.value.trim();


    const regiaoId =
        select.value;


    if (!nome || !regiaoId) {

        mostrarMensagem(
            "Informe o estado e selecione a região.",
            "erro"
        );

        return;

    }


    try {

        /*
         * Verifica duplicidade dentro da mesma região.
         */

        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("estados")
            .select("id,nome,regiao_id")
            .ilike(
                "nome",
                nome
            )
            .eq(
                "regiao_id",
                Number(regiaoId)
            )
            .limit(1);


        if (erroBusca) {

            throw erroBusca;

        }


        if (existente?.length) {

            mostrarMensagem(
                "Este estado já está cadastrado nesta região.",
                "erro"
            );

            return;

        }


        const {
            error
        } = await supabaseClient
            .from("estados")
            .insert({

                nome,

                regiao_id:
                    Number(regiaoId)

            });


        if (error) {

            throw error;

        }


        input.value = "";

        select.value = "";


        mostrarMensagem(
            "Estado cadastrado com sucesso!",
            "sucesso"
        );


        await listarEstados();

        await popularEstados();

        await popularCidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar estado:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Erro ao salvar estado.",
            "erro"
        );

    }

}


// ============================================================
// EDITAR ESTADO
// ============================================================

async function editarEstado(id) {

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


        const nome =
            prompt(
                "Novo nome do estado:",
                data.nome
            );


        if (
            nome === null ||
            !nome.trim()
        ) {

            return;

        }


        const novoNome =
            nome.trim();


        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("estados")
            .select("id,nome")
            .ilike(
                "nome",
                novoNome
            )
            .neq(
                "id",
                id
            )
            .limit(1);


        if (erroBusca) {

            throw erroBusca;

        }


        if (existente?.length) {

            mostrarMensagem(
                "Já existe outro estado com esse nome.",
                "erro"
            );

            return;

        }


        const {
            error: erroUpdate
        } = await supabaseClient
            .from("estados")
            .update({

                nome:
                    novoNome

            })
            .eq(
                "id",
                id
            );


        if (erroUpdate) {

            throw erroUpdate;

        }


        mostrarMensagem(
            "Estado atualizado!",
            "sucesso"
        );


        await listarEstados();

        await popularEstados();

        await popularCidades();


    } catch (erro) {

        console.error(
            "Erro ao editar estado:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Erro ao atualizar estado.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR ESTADO
// ============================================================

async function excluirEstado(id) {

    if (
        !confirm(
            "Excluir este estado?"
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

        await popularCidades();

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir estado:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Não foi possível excluir o estado.",
            "erro"
        );

    }

}


// ============================================================
// CIDADES
// ============================================================

async function carregarPaginaCidades() {

    await popularEstados();

    await listarCidades();

}


// ============================================================
// POPULAR CIDADES
// ============================================================

async function popularCidades(
    selectId = null,
    estadoId = null
) {

    const selects = selectId
        ? [
            document.getElementById(
                selectId
            )
        ]
        : [
            ...document.querySelectorAll(
                "#bairroCidade, #clinicaCidade, #filtroBairroCidade"
            )
        ];


    const listaSelects =
        selects
            .filter(Boolean)
            .filter(
                (select, index, array) =>
                    array.indexOf(select) === index
            );


    for (
        const select of listaSelects
    ) {

        const valorAtual =
            select.value;


        let query =
            supabaseClient
                .from("cidades")
                .select(`
                    id,
                    nome,
                    estado_id
                `)
                .order("nome");


        if (estadoId) {

            query =
                query.eq(
                    "estado_id",
                    Number(estadoId)
                );

        }


        /*
         * Filtro da página de bairros.
         */

        if (
            select.id ===
            "filtroBairroCidade"
        ) {

            const estadoFiltro =
                obterValor([
                    "filtroCidadeEstado"
                ]);


            if (estadoFiltro) {

                query =
                    query.eq(
                        "estado_id",
                        Number(
                            estadoFiltro
                        )
                    );

            }

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            console.error(
                "Erro ao carregar cidades:",
                error
            );

            continue;

        }


        let texto =
            "Selecione Cidade";


        if (
            select.id ===
            "filtroBairroCidade"
        ) {

            texto =
                "Todas as Cidades";

        }


        select.innerHTML =
            `<option value="">
                ${texto}
            </option>`;


        (data || [])
            .forEach(cidade => {

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

            });


        if (valorAtual) {

            select.value =
                valorAtual;

        }

    }

}


// ============================================================
// LISTAR CIDADES
// ============================================================

async function listarCidades() {

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
                estados(
                    id,
                    nome
                )
            `)
            .order("nome");


        if (error) {

            throw error;

        }


        const container =
            document.getElementById(
                "listaCidades"
            );


        if (!container) {

            return;

        }


        if (!data?.length) {

            container.innerHTML =
                `<p class="vazio">
                    Nenhuma cidade cadastrada.
                </p>`;

            return;

        }


        container.innerHTML =
            data.map(cidade => `

                <div class="item-lista">

                    <div>

                        <strong>
                            ${escapeHTML(
                                cidade.nome
                            )}
                        </strong>

                        <small>
                            ${
                                escapeHTML(
                                    cidade.estados?.nome ||
                                    "Sem estado"
                                )
                            }
                        </small>

                    </div>

                    <div class="acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarCidade(${cidade.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirCidade(${cidade.id})"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar cidades:",
            erro
        );

    }

}


// ============================================================
// SALVAR CIDADE
// ============================================================

async function salvarCidade() {

    const input =
        encontrarElemento([
            "nomeCidade",
            "novaCidade",
            "nova_cidade"
        ]);


    const select =
        encontrarElemento([
            "cidadeEstado"
        ]);


    if (!input || !select) {

        console.error(
            "Campos de cidade não encontrados."
        );

        return;

    }


    const nome =
        input.value.trim();


    const estadoId =
        select.value;


    if (!nome || !estadoId) {

        mostrarMensagem(
            "Informe a cidade e selecione o estado.",
            "erro"
        );

        return;

    }


    try {

        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("cidades")
            .select("id,nome,estado_id")
            .ilike(
                "nome",
                nome
            )
            .eq(
                "estado_id",
                Number(estadoId)
            )
            .limit(1);


        if (erroBusca) {

            throw erroBusca;

        }


        if (existente?.length) {

            mostrarMensagem(
                "Esta cidade já está cadastrada neste estado.",
                "erro"
            );

            return;

        }


        const {
            error
        } = await supabaseClient
            .from("cidades")
            .insert({

                nome,

                estado_id:
                    Number(estadoId)

            });


        if (error) {

            throw error;

        }


        input.value = "";

        select.value = "";


        mostrarMensagem(
            "Cidade cadastrada com sucesso!",
            "sucesso"
        );


        await listarCidades();

        await popularCidades();

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar cidade:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Erro ao salvar cidade.",
            "erro"
        );

    }

}


// ============================================================
// EDITAR CIDADE
// ============================================================

async function editarCidade(id) {

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


        const nome =
            prompt(
                "Novo nome da cidade:",
                data.nome
            );


        if (
            nome === null ||
            !nome.trim()
        ) {

            return;

        }


        const novoNome =
            nome.trim();


        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("cidades")
            .select("id,nome")
            .ilike(
                "nome",
                novoNome
            )
            .eq(
                "estado_id",
                data.estado_id
            )
            .neq(
                "id",
                id
            )
            .limit(1);


        if (erroBusca) {

            throw erroBusca;

        }


        if (existente?.length) {

            mostrarMensagem(
                "Já existe outra cidade com esse nome neste estado.",
                "erro"
            );

            return;

        }


        const {
            error: erroUpdate
        } = await supabaseClient
            .from("cidades")
            .update({

                nome:
                    novoNome

            })
            .eq(
                "id",
                id
            );


        if (erroUpdate) {

            throw erroUpdate;

        }


        mostrarMensagem(
            "Cidade atualizada!",
            "sucesso"
        );


        await listarCidades();

        await popularCidades();

        await popularBairros();


    } catch (erro) {

        console.error(
            "Erro ao editar cidade:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Erro ao atualizar cidade.",
            "erro"
        );

    }

}


// ============================================================
// EXCLUIR CIDADE
// ============================================================

async function excluirCidade(id) {

    if (
        !confirm(
            "Excluir esta cidade?"
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

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir cidade:",
            erro
        );


        mostrarMensagem(
            erro?.message ||
            "Não foi possível excluir a cidade.",
            "erro"
        );

    }

}
// ============================================================
// ADMIN.JS — PARTE 3/3
// Bairros, modal, localização, tema e funções auxiliares
// ============================================================


// ============================================================
// BAIRROS
// ============================================================

async function carregarPaginaBairros() {
    await popularCidades();
    await listarBairros();
}


// ============================================================
// POPULAR CIDADES
// ============================================================

async function popularCidades(selectId = "bairroCidade") {

    const select = document.getElementById(selectId);

    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Selecione a Cidade</option>';

    const { data, error } = await supabaseClient
        .from("cidades")
        .select(`
            id,
            nome,
            estados (
                id,
                nome
            )
        `)
        .order("nome");

    if (error) {
        console.error("Erro ao carregar cidades:", error);
        return;
    }

    (data || []).forEach(cidade => {

        const option = document.createElement("option");

        option.value = cidade.id;

        const nomeEstado = cidade.estados?.nome
            ? ` - ${cidade.estados.nome}`
            : "";

        option.textContent = `${cidade.nome}${nomeEstado}`;

        select.appendChild(option);
    });
}

// ============================================================
// POPULAR BAIRROS
// ============================================================

async function popularBairros(selectId = "clinicaBairro") {

    const select = document.getElementById(selectId);

    if (!select) {
        return;
    }

    select.innerHTML =
        '<option value="">Selecione o Bairro</option>';

    const { data, error } = await supabaseClient
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
        .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar bairros:",
            error
        );

        return;
    }

    (data || []).forEach(bairro => {

        const option = document.createElement("option");

        option.value = bairro.id;

        const nomeCidade =
            bairro.cidades?.nome
                ? ` - ${bairro.cidades.nome}`
                : "";

        option.textContent =
            `${bairro.nome}${nomeCidade}`;

        select.appendChild(option);
    });
}
// ============================================================
// LISTAR BAIRROS
// ============================================================

async function listarBairros() {

    const lista = document.getElementById("listaBairros");

    if (!lista) {
        return;
    }

    lista.innerHTML = '<div class="carregando">Carregando bairros...</div>';

    const { data, error } = await supabaseClient
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
                    nome
                )
            )
        `)
        .order("nome");

    if (error) {

        console.error("Erro ao listar bairros:", error);

        lista.innerHTML = `
            <div class="carregando">
                Erro ao carregar bairros.
            </div>
        `;

        return;
    }

    if (!data || data.length === 0) {

        lista.innerHTML = `
            <div class="carregando">
                Nenhum bairro cadastrado.
            </div>
        `;

        return;
    }

    lista.innerHTML = "";

    data.forEach(bairro => {

        const cidade = bairro.cidades?.nome || "Cidade não informada";
        const estado = bairro.cidades?.estados?.nome || "";

        const item = document.createElement("div");

        item.className = "item-lista";

        item.innerHTML = `
            <div>
                <strong>${escapeHTML(bairro.nome)}</strong>
                <small>
                    ${escapeHTML(cidade)}
                    ${estado ? ` - ${escapeHTML(estado)}` : ""}
                </small>
            </div>

            <div class="acoes">
                <button
                    class="btn-editar"
                    onclick="editarBairro(${bairro.id})"
                    type="button"
                >
                    Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirBairro(${bairro.id})"
                    type="button"
                >
                    Excluir
                </button>
            </div>
        `;

        lista.appendChild(item);
    });
}


// ============================================================
// SALVAR BAIRRO
// ============================================================

async function salvarBairro() {

    const input = document.getElementById("nomeBairro");
    const select = document.getElementById("bairroCidade");
    const editId = document.getElementById("bairroEditId");

    if (!input || !select) {
        return;
    }

    const nome = input.value.trim();
    const cidadeId = select.value;
    const idEdicao = editId?.value || "";

    if (!nome) {
        mostrarMensagem("Informe o nome do bairro.", "erro");
        input.focus();
        return;
    }

    if (!cidadeId) {
        mostrarMensagem("Selecione uma cidade.", "erro");
        select.focus();
        return;
    }

    // Verifica duplicidade dentro da mesma cidade
    let consultaDuplicidade = supabaseClient
        .from("bairros")
        .select("id")
        .eq("nome", nome)
        .eq("cidade_id", cidadeId);

    if (idEdicao) {
        consultaDuplicidade = consultaDuplicidade.neq("id", idEdicao);
    }

    const { data: existente, error: erroDuplicidade } =
        await consultaDuplicidade.maybeSingle();

    if (erroDuplicidade) {

        console.error(
            "Erro ao verificar bairro existente:",
            erroDuplicidade
        );

        mostrarMensagem(
            "Não foi possível verificar se o bairro já existe.",
            "erro"
        );

        return;
    }

    if (existente) {

        mostrarMensagem(
            "Este bairro já está cadastrado nesta cidade.",
            "erro"
        );

        return;
    }

    let error;

    if (idEdicao) {

        const resposta = await supabaseClient
            .from("bairros")
            .update({
                nome,
                cidade_id: Number(cidadeId)
            })
            .eq("id", idEdicao);

        error = resposta.error;

    } else {

        const resposta = await supabaseClient
            .from("bairros")
            .insert({
                nome,
                cidade_id: Number(cidadeId)
            });

        error = resposta.error;
    }

    if (error) {

        console.error("Erro ao salvar bairro:", error);

        mostrarMensagem(
            "Não foi possível salvar o bairro.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        idEdicao
            ? "Bairro atualizado com sucesso!"
            : "Bairro cadastrado com sucesso!",
        "sucesso"
    );

    input.value = "";

    if (editId) {
        editId.value = "";
    }

    select.value = "";

    await listarBairros();

    atualizarDashboard();
}


// ============================================================
// EDITAR BAIRRO
// ============================================================

async function editarBairro(id) {

    const { data, error } = await supabaseClient
        .from("bairros")
        .select(`
            id,
            nome,
            cidade_id
        `)
        .eq("id", id)
        .single();

    if (error || !data) {

        console.error("Erro ao buscar bairro:", error);

        mostrarMensagem(
            "Não foi possível carregar o bairro.",
            "erro"
        );

        return;
    }

    const input = document.getElementById("nomeBairro");
    const select = document.getElementById("bairroCidade");
    const editId = document.getElementById("bairroEditId");

    if (input) {
        input.value = data.nome;
    }

    if (select) {
        select.value = data.cidade_id;
    }

    if (editId) {
        editId.value = data.id;
    }

    input?.focus();
}


// ============================================================
// EXCLUIR BAIRRO
// ============================================================

async function excluirBairro(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este bairro?\n\n" +
        "As clínicas vinculadas a este bairro perderão a localização do bairro."
    );

    if (!confirmar) {
        return;
    }

    const { error } = await supabaseClient
        .from("bairros")
        .delete()
        .eq("id", id);

    if (error) {

        console.error("Erro ao excluir bairro:", error);

        mostrarMensagem(
            "Não foi possível excluir o bairro.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        "Bairro excluído com sucesso!",
        "sucesso"
    );

    await listarBairros();

    atualizarDashboard();
}


// ============================================================
// ESPECIALIDADES PARA O MODAL DA CLÍNICA
// ============================================================

async function popularEspecialidades(selectId = null) {

    const selects = selectId
        ? [document.getElementById(selectId)]
        : Array.from(
            document.querySelectorAll(".select-especialidade")
        );

    const { data, error } = await supabaseClient
        .from("especialidades")
        .select("id, nome")
        .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

        return;
    }

    selects.forEach(select => {

        if (!select) {
            return;
        }

        const valorAtual = select.value;

        select.innerHTML = `
            <option value="">
                Selecione a Especialidade
            </option>
        `;

        (data || []).forEach(especialidade => {

            const option = document.createElement("option");

            option.value = especialidade.id;
            option.textContent = especialidade.nome;

            select.appendChild(option);
        });

        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}


// ============================================================
// CARREGAR ESTADOS DA CLÍNICA
// ============================================================

async function carregarEstadosClinica() {

    const regiaoSelect = document.getElementById("clinicaRegiao");
    const estadoSelect = document.getElementById("clinicaEstado");
    const cidadeSelect = document.getElementById("clinicaCidade");
    const bairroSelect = document.getElementById("clinicaBairro");

    if (!regiaoSelect || !estadoSelect) {
        return;
    }

    const regiaoId = regiaoSelect.value;

    estadoSelect.innerHTML =
        '<option value="">Selecione o Estado</option>';

    if (cidadeSelect) {
        cidadeSelect.innerHTML =
            '<option value="">Selecione a Cidade</option>';
    }

    if (bairroSelect) {
        bairroSelect.innerHTML =
            '<option value="">Selecione o Bairro</option>';
    }

    if (!regiaoId) {
        return;
    }

    const { data, error } = await supabaseClient
        .from("estados")
        .select("id, nome")
        .eq("regiao_id", regiaoId)
        .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar estados da clínica:",
            error
        );

        return;
    }

    (data || []).forEach(estado => {

        const option = document.createElement("option");

        option.value = estado.id;
        option.textContent = estado.nome;

        estadoSelect.appendChild(option);
    });
}


// ============================================================
// CARREGAR CIDADES DA CLÍNICA
// ============================================================

async function carregarCidadesClinica() {

    const estadoSelect = document.getElementById("clinicaEstado");
    const cidadeSelect = document.getElementById("clinicaCidade");
    const bairroSelect = document.getElementById("clinicaBairro");

    if (!estadoSelect || !cidadeSelect) {
        return;
    }

    const estadoId = estadoSelect.value;

    cidadeSelect.innerHTML =
        '<option value="">Selecione a Cidade</option>';

    if (bairroSelect) {
        bairroSelect.innerHTML =
            '<option value="">Selecione o Bairro</option>';
    }

    if (!estadoId) {
        return;
    }

    const { data, error } = await supabaseClient
        .from("cidades")
        .select("id, nome")
        .eq("estado_id", estadoId)
        .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar cidades da clínica:",
            error
        );

        return;
    }

    (data || []).forEach(cidade => {

        const option = document.createElement("option");

        option.value = cidade.id;
        option.textContent = cidade.nome;

        cidadeSelect.appendChild(option);
    });
}


// ============================================================
// CARREGAR BAIRROS DA CLÍNICA
// ============================================================

async function carregarBairrosClinica() {

    const cidadeSelect = document.getElementById("clinicaCidade");
    const bairroSelect = document.getElementById("clinicaBairro");

    if (!cidadeSelect || !bairroSelect) {
        return;
    }

    const cidadeId = cidadeSelect.value;

    bairroSelect.innerHTML =
        '<option value="">Selecione o Bairro</option>';

    if (!cidadeId) {
        return;
    }

    const { data, error } = await supabaseClient
        .from("bairros")
        .select("id, nome")
        .eq("cidade_id", cidadeId)
        .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar bairros da clínica:",
            error
        );

        return;
    }

    (data || []).forEach(bairro => {

        const option = document.createElement("option");

        option.value = bairro.id;
        option.textContent = bairro.nome;

        bairroSelect.appendChild(option);
    });
}


// ============================================================
// ABRIR MODAL DE CLÍNICA
// ============================================================

async function abrirModalClinica(id = null) {

    const modal = document.getElementById("modalClinica");
    const form = document.getElementById("formClinica");
    const titulo = document.getElementById("tituloModalClinica");
    const clinicaId = document.getElementById("clinicaId");
    const areaStatus = document.getElementById("areaStatusClinica");
    const ativo = document.getElementById("clinicaAtivo");
    const containerEspecialidades =
        document.getElementById("containerEspecialidades");

    if (!modal) {
        return;
    }

    // Abrindo nova clínica
    if (!id) {

        form?.reset();

        if (clinicaId) {
            clinicaId.value = "";
        }

        if (titulo) {
            titulo.textContent = "Nova Clínica";
        }

        if (ativo) {
            ativo.checked = true;
        }

        if (areaStatus) {
            areaStatus.classList.add("hidden");
            areaStatus.style.display = "none";
        }

        if (containerEspecialidades) {

            containerEspecialidades.innerHTML = `
                <div class="especialidades-vazio">
                    Nenhuma especialidade adicionada.
                </div>
            `;
        }

        await popularRegioes("clinicaRegiao");
        await popularEspecialidades();

    } else {

        if (titulo) {
            titulo.textContent = "Editar Clínica";
        }

        if (clinicaId) {
            clinicaId.value = id;
        }

        if (areaStatus) {
            areaStatus.classList.remove("hidden");
            areaStatus.style.display = "";
        }

        await carregarEspecialidadesClinicaNoModal(id);
    }

    modal.classList.remove("hidden");
    modal.style.display = "flex";
}


// ============================================================
// FECHAR MODAL
// ============================================================

function fecharModalClinica() {

    const modal = document.getElementById("modalClinica");

    if (!modal) {
        return;
    }

    modal.classList.add("hidden");
    modal.style.display = "none";
}


// ============================================================
// TEMA
// ============================================================

function carregarTema() {

    const tema = localStorage.getItem("tema");

    if (tema === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}


function alternarTema() {

    document.body.classList.toggle("dark");

    const modoEscuro =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "tema",
        modoEscuro ? "dark" : "light"
    );
}


// ============================================================
// DATA ATUAL
// ============================================================

function atualizarData() {

    const elemento = document.getElementById("dataAtual");

    if (!elemento) {
        return;
    }

    const agora = new Date();

    const data = agora.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

    elemento.textContent =
        data.charAt(0).toUpperCase() + data.slice(1);
}


// ============================================================
// NORMALIZAR REDE
// ============================================================

function normalizarRede(rede) {

    if (!rede) {
        return "";
    }

    return String(rede)
        .trim()
        .toLowerCase();
}


function exibirNomeRede(rede) {

    const redeNormalizada = normalizarRede(rede);

    if (redeNormalizada === "especialistas") {
        return "Especialistas";
    }

    if (redeNormalizada === "sindilegis") {
        return "Sindilegis";
    }

    return rede || "";
}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escapeHTML(valor) {

    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// ELEMENTO
// ============================================================

function encontrarElemento(...ids) {

    for (const id of ids) {

        if (!id) {
            continue;
        }

        const elemento =
            typeof id === "string"
                ? document.getElementById(id)
                : id;

        if (elemento) {
            return elemento;
        }
    }

    return null;
}


// ============================================================
// OBTER VALOR
// ============================================================

function obterValor(...ids) {

    const elemento = encontrarElemento(...ids);

    if (!elemento) {
        return "";
    }

    return String(elemento.value ?? "").trim();
}


// ============================================================
// PREENCHER CAMPO
// ============================================================

function preencherCampo(valor, ...ids) {

    const elemento = encontrarElemento(...ids);

    if (!elemento) {
        return;
    }

    elemento.value =
        valor === null || valor === undefined
            ? ""
            : valor;
}


// ============================================================
// ATUALIZAR ELEMENTO
// ============================================================

function atualizarElemento(id, valor) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        valor === null || valor === undefined
            ? ""
            : valor;
}


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagem(texto, tipo = "info") {

    console.log(`[${tipo}] ${texto}`);

    const possiveisElementos = [
        "mensagemAdmin",
        "mensagem",
        "statusMensagem"
    ];

    let elemento = null;

    for (const id of possiveisElementos) {

        elemento = document.getElementById(id);

        if (elemento) {
            break;
        }
    }

    if (!elemento) {
        return;
    }

    elemento.textContent = texto;
    elemento.className = `mensagem ${tipo}`;

    setTimeout(() => {

        if (elemento) {
            elemento.textContent = "";
        }

    }, 4000);
}


// ============================================================
// VOLTAR PARA O SITE
// ============================================================

function voltarAoSite() {
    window.location.href = "index.html";
}


// ============================================================
// SAIR DO PAINEL
// ============================================================

function sair() {

    localStorage.removeItem("adminLogado");

    window.location.href = "login.html";
}


// ============================================================
// LOGOUT
// ============================================================

async function logout() {

    try {

        if (supabaseClient?.auth) {
            await supabaseClient.auth.signOut();
        }

    } catch (erro) {

        console.warn(
            "Não foi possível encerrar a sessão do Supabase:",
            erro
        );

    }

    sair();
}


// ============================================================
// EVENTOS GERAIS
// ============================================================

function configurarEventosGerais() {

    // Fechar modal com ESC
    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            fecharModalClinica();
        }

    });


    // Fechar modal clicando fora dele
    const modal = document.getElementById("modalClinica");

    if (modal) {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                fecharModalClinica();
            }

        });

    }
}


// ============================================================
// GARANTIR FUNÇÕES DISPONÍVEIS NO HTML
// ============================================================

window.mostrarPagina = mostrarPagina;

window.atualizarDashboard = atualizarDashboard;
window.listarClinicas = listarClinicas;

window.abrirModalClinica = abrirModalClinica;
window.fecharModalClinica = fecharModalClinica;
window.salvarClinica = salvarClinica;
window.excluirClinica = excluirClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.editarClinica = editarClinica;

window.salvarEspecialidade =
    salvarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.salvarRegiao = salvarRegiao;
window.editarRegiao = editarRegiao;
window.excluirRegiao = excluirRegiao;

window.salvarEstado = salvarEstado;
window.editarEstado = editarEstado;
window.excluirEstado = excluirEstado;

window.salvarCidade = salvarCidade;
window.editarCidade = editarCidade;
window.excluirCidade = excluirCidade;

window.salvarBairro = salvarBairro;
window.editarBairro = editarBairro;
window.excluirBairro = excluirBairro;

window.carregarEstadosClinica =
    carregarEstadosClinica;

window.carregarCidadesClinica =
    carregarCidadesClinica;

window.carregarBairrosClinica =
    carregarBairrosClinica;

window.alternarTema = alternarTema;
window.carregarTema = carregarTema;

window.voltarAoSite = voltarAoSite;
window.sair = sair;
window.logout = logout;
window.popularBairros = popularBairros;

// ============================================================
// INICIALIZAÇÃO FINAL
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    carregarTema();

    atualizarData();

    configurarEventosGerais();

});
