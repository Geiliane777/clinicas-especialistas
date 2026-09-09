console.log("admin.js carregado");


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const NOME_REDE = "Rede Especialistas";


// ============================================================
// VARIÁVEIS GLOBAIS
// ============================================================

let clinicaEditandoId = null;
let especialidadesClinicaTemp = [];


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Inicializando painel administrativo...");

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

    console.log("Painel administrativo inicializado.");

});


// ============================================================
// NAVEGAÇÃO
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

    console.log("Abrindo página:", nomePagina);

    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    const pagina = document.getElementById(nomePagina);

    if (pagina) {
        pagina.style.display = "block";
    }

    const titulo = document.getElementById("tituloPagina");

    if (titulo) {
        titulo.textContent =
            TITULOS_PAGINA[nomePagina] ||
            nomePagina;
    }

    document.querySelectorAll(".menu-btn").forEach(btn => {

        btn.classList.remove("active");

        if (
            btn.dataset.page === nomePagina
        ) {
            btn.classList.add("active");
        }

    });

    const carregador =
        CARREGADORES_PAGINA[nomePagina];

    if (carregador) {
        await carregador();
    }

}


// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        console.log("Carregando dashboard...");


        // ----------------------------------------------------
        // CLÍNICAS
        // ----------------------------------------------------

        const {
            data: clinicas,
            error: erroClinicas
        } = await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                ativo
            `)
            .order("id", {
                ascending: false
            });

        if (erroClinicas) {
            throw erroClinicas;
        }


        const listaClinicas =
            Array.isArray(clinicas)
                ? clinicas
                : [];


        const totalClinicas =
            listaClinicas.length;


        const clinicasAtivas =
            listaClinicas.filter(clinica => {

                return (
                    clinica.ativo === true ||
                    clinica.ativo === "true" ||
                    clinica.ativo === 1 ||
                    clinica.ativo === "1"
                );

            }).length;


        const clinicasInativas =
            totalClinicas -
            clinicasAtivas;


        // ----------------------------------------------------
        // ESPECIALIDADES
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // LOCALIZAÇÕES
        // ----------------------------------------------------

        const [
            regioesResult,
            estadosResult,
            cidadesResult,
            bairrosResult
        ] = await Promise.all([

            supabaseClient
                .from("regioes")
                .select("id"),

            supabaseClient
                .from("estados")
                .select("id"),

            supabaseClient
                .from("cidades")
                .select("id"),

            supabaseClient
                .from("bairros")
                .select("id")

        ]);


        if (regioesResult.error) {
            console.error(
                "Erro ao carregar regiões:",
                regioesResult.error
            );
        }

        if (estadosResult.error) {
            console.error(
                "Erro ao carregar estados:",
                estadosResult.error
            );
        }

        if (cidadesResult.error) {
            console.error(
                "Erro ao carregar cidades:",
                cidadesResult.error
            );
        }

        if (bairrosResult.error) {
            console.error(
                "Erro ao carregar bairros:",
                bairrosResult.error
            );
        }


        const totalRegioes =
            (regioesResult.data || []).length;

        const totalEstados =
            (estadosResult.data || []).length;

        const totalCidades =
            (cidadesResult.data || []).length;

        const totalBairros =
            (bairrosResult.data || []).length;


        // ----------------------------------------------------
        // ATUALIZAR CARDS
        // ----------------------------------------------------

        atualizarElemento(
            "totalClinicas",
            totalClinicas
        );

        atualizarElemento(
            "clinicasAtivas",
            clinicasAtivas
        );

        atualizarElemento(
            "clinicasInativas",
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


        // ----------------------------------------------------
        // PORCENTAGEM
        // ----------------------------------------------------

        let percentual = 0;

        if (totalClinicas > 0) {

            percentual =
                Math.round(
                    (clinicasAtivas /
                        totalClinicas) *
                    100
                );

        }


        atualizarElemento(
            "percentualClinicasAtivas",
            percentual + "%"
        );


        atualizarElemento(
            "statusClinicasAtivas",
            clinicasAtivas
        );

        atualizarElemento(
            "statusClinicasInativas",
            clinicasInativas
        );


        // ----------------------------------------------------
        // BARRA
        // ----------------------------------------------------

        const barra =
            document.getElementById(
                "barraClinicasAtivas"
            );

        if (barra) {

            barra.style.width =
                percentual + "%";

        }


        // ----------------------------------------------------
        // ÚLTIMAS CLÍNICAS
        // ----------------------------------------------------

        await carregarUltimasClinicas();


        console.log(
            "Dashboard carregado:",
            {
                totalClinicas,
                clinicasAtivas,
                clinicasInativas,
                totalEspecialidades,
                totalRegioes,
                totalEstados,
                totalCidades,
                totalBairros
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


async function carregarUltimasClinicas() {

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
            .order("id", {
                ascending: false
            })
            .limit(5);


        if (error) {
            throw error;
        }


        const lista =
            data || [];


        const container =
            document.getElementById(
                "ultimasClinicas"
            ) ||
            document.getElementById(
                "listaUltimasClinicas"
            );


        if (!container) {
            return;
        }


        if (lista.length === 0) {

            container.innerHTML =
                `<p class="vazio">
                    Nenhuma clínica cadastrada.
                </p>`;

            return;
        }


        container.innerHTML =
            lista.map(clinica => {

                const status =
                    clinica.ativo
                        ? "Ativa"
                        : "Inativa";


                return `
                    <div class="item-clinica-dashboard">

                        <div>
                            <strong>
                                ${escapeHTML(clinica.nome || "Sem nome")}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    clinica.telefone || "Sem telefone"
                                )}
                            </small>
                        </div>

                        <span class="status ${clinica.ativo ? "ativo" : "inativo"}">
                            ${status}
                        </span>

                    </div>
                `;

            }).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar últimas clínicas:",
            erro
        );

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


async function listarClinicas() {

    try {

        console.log("Carregando clínicas...");


        /*
         * IMPORTANTE:
         *
         * Não fazemos JOIN com clinica_especialidades
         * aqui.
         *
         * Isso evita que uma clínica apareça várias vezes
         * quando possui várias especialidades.
         */

        const {
            data: clinicas,
            error
        } = await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                endereco,
                telefone,
                bairro_id,
                ativo,
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


        if (error) {
            throw error;
        }


        const lista =
            clinicas || [];


        const container =
            document.getElementById(
                "listaClinicas"
            );


        if (!container) {
            return;
        }


        if (lista.length === 0) {

            container.innerHTML =
                `<p class="vazio">
                    Nenhuma clínica cadastrada.
                </p>`;

            return;
        }


        container.innerHTML = "";


        for (const clinica of lista) {

            const especialidades =
                await obterEspecialidadesClinica(
                    clinica.id
                );


            const local =
                montarLocalizacaoClinica(
                    clinica
                );


            const card =
                document.createElement("div");


            card.className =
                "item-clinica";


            card.innerHTML = `

                <div class="clinica-info">

                    <h3>
                        ${escapeHTML(
                            clinica.nome || "Sem nome"
                        )}
                    </h3>

                    <p>
                        📍 ${escapeHTML(local)}
                    </p>

                    <p>
                        📞 ${escapeHTML(
                            clinica.telefone || "Não informado"
                        )}
                    </p>

                    <div class="especialidades-resumo">
                        ${
                            especialidades.length
                                ? especialidades.map(item => `
                                    <span class="tag">
                                        ${escapeHTML(item.nome)}
                                        ${
                                            item.rede
                                                ? ` - ${escapeHTML(
                                                    exibirNomeRede(item.rede)
                                                  )}`
                                                : ""
                                        }
                                    </span>
                                `).join("")
                                : "<span>Sem especialidades</span>"
                        }
                    </div>

                </div>


                <div class="clinica-acoes">

                    <span class="status ${
                        clinica.ativo
                            ? "ativo"
                            : "inativo"
                    }">
                        ${
                            clinica.ativo
                                ? "Ativa"
                                : "Inativa"
                        }
                    </span>

                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarClinica(${clinica.id})"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirClinica(${clinica.id})"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            `;


            container.appendChild(card);

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar clínicas:",
            erro
        );

        mostrarMensagem(
            "Erro ao carregar clínicas.",
            "erro"
        );

    }

}


function montarLocalizacaoClinica(clinica) {

    const bairro =
        clinica.bairros;

    const cidade =
        bairro?.cidades;

    const estado =
        cidade?.estados;

    const regiao =
        estado?.regioes;


    return [
        bairro?.nome,
        cidade?.nome,
        estado?.nome,
        regiao?.nome
    ]
        .filter(Boolean)
        .join(" - ") ||
        "Localização não informada";

}


// ============================================================
// OBTÉM ESPECIALIDADES DA CLÍNICA
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
            )
            .order("especialidade_id");


        if (error) {
            throw error;
        }


        const relacionamentos =
            data || [];


        if (
            relacionamentos.length === 0
        ) {
            return [];
        }


        const ids =
            [
                ...new Set(
                    relacionamentos.map(
                        item =>
                            item.especialidade_id
                    )
                )
            ];


        const {
            data: especialidades,
            error: erroEspecialidades
        } = await supabaseClient
            .from("especialidades")
            .select(`
                id,
                nome
            `)
            .in("id", ids);


        if (erroEspecialidades) {
            throw erroEspecialidades;
        }


        const mapa =
            new Map(
                (especialidades || [])
                    .map(item => [
                        item.id,
                        item.nome
                    ])
            );


        return relacionamentos.map(item => ({
            id: item.especialidade_id,
            nome:
                mapa.get(
                    item.especialidade_id
                ) ||
                "Especialidade não encontrada",
            rede: item.rede,
            ativo: item.ativo
        }));


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades da clínica:",
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

        clinicaEditandoId = id;


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
                bairro_id,
                ativo
            `)
            .eq("id", id)
            .single();


        if (error) {
            throw error;
        }


        if (!clinica) {
            throw new Error(
                "Clínica não encontrada."
            );
        }


        preencherCampo(
            [
                "clinicaNome",
                "nomeClinica",
                "editarClinicaNome"
            ],
            clinica.nome
        );


        preencherCampo(
            [
                "clinicaEndereco",
                "enderecoClinica",
                "editarClinicaEndereco"
            ],
            clinica.endereco
        );


        preencherCampo(
            [
                "clinicaTelefone",
                "telefoneClinica",
                "editarClinicaTelefone"
            ],
            clinica.telefone
        );


        const ativo =
            document.getElementById(
                "clinicaAtivo"
            ) ||
            document.getElementById(
                "ativoClinica"
            );


        if (ativo) {
            ativo.checked =
                clinica.ativo === true;
        }


        // ----------------------------------------------------
        // LOCALIZAÇÃO
        // ----------------------------------------------------

        await preencherLocalizacaoClinica(
            clinica.bairro_id
        );


        // ----------------------------------------------------
        // ESPECIALIDADES
        // ----------------------------------------------------

        await carregarEspecialidadesClinicaNoModal(
            id
        );


        // ----------------------------------------------------
        // ABRIR MODAL/PÁGINA
        // ----------------------------------------------------

        abrirModalClinica();


    } catch (erro) {

        console.error(
            "Erro ao editar clínica:",
            erro
        );

        mostrarMensagem(
            "Erro ao carregar clínica para edição.",
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


    const {
        data: bairro,
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
        .eq("id", bairroId)
        .single();


    if (error) {

        console.error(
            "Erro ao buscar localização:",
            error
        );

        return;
    }


    const regiaoId =
        bairro?.cidades
            ?.estados
            ?.regiao_id;

    const estadoId =
        bairro?.cidades
            ?.estado_id;

    const cidadeId =
        bairro?.cidade_id;


    const selectRegiao =
        encontrarElemento([
            "clinicaRegiao",
            "clinica_regiao"
        ]);


    const selectEstado =
        encontrarElemento([
            "clinicaEstado",
            "clinica_estado"
        ]);


    const selectCidade =
        encontrarElemento([
            "clinicaCidade",
            "clinica_cidade"
        ]);


    const selectBairro =
        encontrarElemento([
            "clinicaBairro",
            "clinica_bairro"
        ]);


    if (
        selectRegiao &&
        regiaoId
    ) {

        await popularRegioes(
            selectRegiao.id
        );

        selectRegiao.value =
            String(regiaoId);

    }


    if (
        selectEstado &&
        estadoId
    ) {

        await popularEstados(
            selectEstado.id,
            regiaoId
        );

        selectEstado.value =
            String(estadoId);

    }


    if (
        selectCidade &&
        cidadeId
    ) {

        await popularCidades(
            selectCidade.id,
            estadoId
        );

        selectCidade.value =
            String(cidadeId);

    }


    if (
        selectBairro &&
        bairroId
    ) {

        await popularBairros(
            selectBairro.id,
            cidadeId
        );

        selectBairro.value =
            String(bairroId);

    }

}


// ============================================================
// CARREGAR ESPECIALIDADES NO MODAL
// ============================================================

async function carregarEspecialidadesClinicaNoModal(
    clinicaId
) {

    try {

        const container =
            encontrarElemento([
                "listaEspecialidadesClinica",
                "especialidadesClinica",
                "linhasEspecialidades"
            ]);


        if (container) {
            container.innerHTML = "";
        }


        especialidadesClinicaTemp = [];


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
            )
            .order(
                "especialidade_id"
            );


        if (error) {
            throw error;
        }


        const registros =
            data || [];


        for (
            const item of registros
        ) {

            await adicionarLinhaEspecialidade(
                item.especialidade_id,
                item.rede,
                item.ativo,
                true
            );

        }


        console.log(
            "Especialidades carregadas para edição:",
            registros
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades no modal:",
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
            "listaEspecialidadesClinica",
            "especialidadesClinica",
            "linhasEspecialidades"
        ]);


    if (!container) {

        console.warn(
            "Container de especialidades não encontrado."
        );

        return;

    }


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    const selectEspecialidade =
        document.createElement("select");


    selectEspecialidade.className =
        "select-especialidade";


    selectEspecialidade.innerHTML =
        `<option value="">
            Selecione a especialidade
        </option>`;


    const {
        data: especialidades,
        error
    } = await supabaseClient
        .from("especialidades")
        .select(`
            id,
            nome
        `)
        .order("nome");


    if (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

    }


    (especialidades || [])
        .forEach(item => {

            const option =
                document.createElement("option");

            option.value =
                item.id;

            option.textContent =
                item.nome;

            if (
                String(item.id) ===
                String(especialidadeId)
            ) {
                option.selected = true;
            }

            selectEspecialidade.appendChild(
                option
            );

        });


    const selectRede =
        document.createElement("select");


    selectRede.className =
        "select-rede-especialidade";


    selectRede.innerHTML = `
        <option value="">
            Selecione a rede
        </option>

        <option value="Sindilegis">
            Sindilegis
        </option>

        <option value="Especialistas">
            Especialistas
        </option>
    `;


    /*
     * IMPORTANTE:
     *
     * O banco pode ter valores como:
     *
     * Sindilegis
     * sindilegis
     * Rede Sindilegis
     * Especialistas
     * especialistas
     * Rede Especialistas
     *
     * Aqui fazemos apenas a correspondência visual.
     * Não alteramos o banco automaticamente.
     */

    const redeNormalizada =
        normalizarRede(rede);


    if (redeNormalizada) {

        selectRede.value =
            redeNormalizada;

    }


    /*
     * Guardamos o valor original.
     *
     * Isso permite preservar os dados que já estão
     * no banco quando o usuário não alterar a rede.
     */

    if (carregandoDoBanco) {

        linha.dataset.redeOriginal =
            String(rede ?? "");

    }


    const checkboxAtivo =
        document.createElement("input");

    checkboxAtivo.type =
        "checkbox";

    checkboxAtivo.className =
        "checkbox-especialidade-ativa";

    checkboxAtivo.checked =
        ativo !== false;


    const btnRemover =
        document.createElement("button");

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

        }
    );


    linha.appendChild(
        selectEspecialidade
    );

    linha.appendChild(
        selectRede
    );

    linha.appendChild(
        checkboxAtivo
    );

    linha.appendChild(
        btnRemover
    );


    container.appendChild(
        linha
    );

}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica() {

    try {

        const nome =
            obterValor([
                "clinicaNome",
                "nomeClinica",
                "editarClinicaNome"
            ]);


        const endereco =
            obterValor([
                "clinicaEndereco",
                "enderecoClinica",
                "editarClinicaEndereco"
            ]);


        const telefone =
            obterValor([
                "clinicaTelefone",
                "telefoneClinica",
                "editarClinicaTelefone"
            ]);


        const bairroId =
            obterValor([
                "clinicaBairro",
                "clinica_bairro"
            ]);


        const ativoElemento =
            encontrarElemento([
                "clinicaAtivo",
                "ativoClinica"
            ]);


        const ativo =
            ativoElemento
                ? ativoElemento.checked
                : true;


        if (!nome.trim()) {

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


        const dadosClinica = {

            nome: nome.trim(),

            endereco:
                endereco.trim() ||
                null,

            telefone:
                telefone.trim() ||
                null,

            bairro_id:
                Number(bairroId),

            ativo

        };


        let clinicaId =
            clinicaEditandoId;


        // ----------------------------------------------------
        // INSERIR
        // ----------------------------------------------------

        if (!clinicaId) {

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


        // ----------------------------------------------------
        // ATUALIZAR
        // ----------------------------------------------------

        else {

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

        }


        // ----------------------------------------------------
        // SALVAR ESPECIALIDADES
        // ----------------------------------------------------

        await salvarEspecialidadesClinica(
            clinicaId
        );


        mostrarMensagem(
            "Clínica salva com sucesso!",
            "sucesso"
        );


        fecharModalClinica();


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
            "Erro ao salvar clínica.",
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
     * NÃO apagamos tudo e recriamos.
     *
     * Primeiro lemos o que já existe no banco.
     * Depois:
     *
     * - mantemos o que continua selecionado;
     * - atualizamos o que foi alterado;
     * - inserimos o que é novo;
     * - removemos somente o que o usuário excluiu.
     *
     * Assim os dados existentes são preservados.
     */

    const {
        data: existentes,
        error: erroExistentes
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


    if (erroExistentes) {
        throw erroExistentes;
    }


    const registrosBanco =
        existentes || [];


    const linhas =
        document.querySelectorAll(
            ".linha-especialidade"
        );


    const selecionados = [];


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


        const redeSelecionada =
            selectRede.value;


        if (
            !especialidadeId &&
            !redeSelecionada
        ) {
            return;
        }


        if (!especialidadeId) {

            throw new Error(
                "Selecione a especialidade em todas as linhas."
            );

        }


        if (!redeSelecionada) {

            throw new Error(
                "Selecione a rede em todas as linhas."
            );

        }


        /*
         * Valor original da rede.
         *
         * Se o usuário não alterou a rede,
         * preservamos exatamente o valor do banco.
         */

        const redeOriginal =
            linha.dataset.redeOriginal;


        const redeFinal =
            redeOriginal &&
            normalizarRede(redeOriginal) ===
            redeSelecionada

                ? redeOriginal

                : redeSelecionada;


        selecionados.push({

            especialidade_id:
                Number(especialidadeId),

            rede:
                redeFinal,

            ativo:
                checkbox
                    ? checkbox.checked
                    : true

        });

    });


    // --------------------------------------------------------
    // ELIMINAR DUPLICADOS
    // --------------------------------------------------------

    const mapaSelecionados =
        new Map();


    selecionados.forEach(item => {

        const chave =
            `${item.especialidade_id}|${normalizarRede(item.rede)}`;


        mapaSelecionados.set(
            chave,
            item
        );

    });


    const listaSelecionados =
        Array.from(
            mapaSelecionados.values()
        );


    // --------------------------------------------------------
    // REMOVER O QUE FOI EXCLUÍDO
    // --------------------------------------------------------

    for (
        const existente of registrosBanco
    ) {

        const aindaExiste =
            listaSelecionados.some(item => {

                return (
                    Number(item.especialidade_id) ===
                    Number(existente.especialidade_id)
                    &&
                    normalizarRede(item.rede) ===
                    normalizarRede(existente.rede)
                );

            });


        if (!aindaExiste) {

            const {
                error
            } = await supabaseClient
                .from("clinica_especialidades")
                .delete()
                .eq(
                    "clinica_id",
                    clinicaId
                )
                .eq(
                    "especialidade_id",
                    existente.especialidade_id
                )
                .eq(
                    "rede",
                    existente.rede
                );


            if (error) {
                throw error;
            }

        }

    }


    // --------------------------------------------------------
    // INSERIR / ATUALIZAR
    // --------------------------------------------------------

    for (
        const item of listaSelecionados
    ) {

        const existente =
            registrosBanco.find(registro => {

                return (
                    Number(
                        registro.especialidade_id
                    ) ===
                    Number(
                        item.especialidade_id
                    )
                    &&
                    normalizarRede(
                        registro.rede
                    ) ===
                    normalizarRede(
                        item.rede
                    )
                );

            });


        // ----------------------------------------------------
        // JÁ EXISTE
        // ----------------------------------------------------

        if (existente) {

            if (
                Boolean(existente.ativo) !==
                Boolean(item.ativo)
            ) {

                const {
                    error
                } = await supabaseClient
                    .from(
                        "clinica_especialidades"
                    )
                    .update({
                        ativo: item.ativo
                    })
                    .eq(
                        "clinica_id",
                        clinicaId
                    )
                    .eq(
                        "especialidade_id",
                        item.especialidade_id
                    )
                    .eq(
                        "rede",
                        existente.rede
                    );


                if (error) {
                    throw error;
                }

            }

        }


        // ----------------------------------------------------
        // NOVO
        // ----------------------------------------------------

        else {

            const {
                error
            } = await supabaseClient
                .from(
                    "clinica_especialidades"
                )
                .insert({

                    clinica_id:
                        clinicaId,

                    especialidade_id:
                        item.especialidade_id,

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

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta clínica?"
        );


    if (!confirmar) {
        return;
    }


    try {

        // Primeiro remove especialidades relacionadas.

        const {
            error: erroEspecialidades
        } = await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "clinica_id",
                id
            );


        if (erroEspecialidades) {
            throw erroEspecialidades;
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
            "Erro ao excluir clínica.",
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


async function salvarEspecialidade() {

    const input =
        encontrarElemento([
            "novaEspecialidade",
            "nova_especialidade"
        ]);


    if (!input) {
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


        carregarDashboard();


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


async function editarEspecialidade(id) {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select("id,nome")
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        return;

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


    const {
        error: erroUpdate
    } = await supabaseClient
        .from("especialidades")
        .update({
            nome: novoNome.trim()
        })
        .eq(
            "id",
            id
        );


    if (erroUpdate) {

        console.error(
            erroUpdate
        );

        mostrarMensagem(
            "Erro ao atualizar especialidade.",
            "erro"
        );

        return;

    }


    mostrarMensagem(
        "Especialidade atualizada!",
        "sucesso"
    );


    await listarEspecialidades();

    await popularEspecialidades();

}


async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) {
        return;
    }


    try {

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


async function popularRegioes(selectId = null) {

    const selects = selectId
        ? [document.getElementById(selectId)]
        : document.querySelectorAll(
            "#estadoRegiao, #clinicaRegiao, #filtroEstadoRegiao"
        );


    for (
        const select of selects
    ) {

        if (!select) {
            continue;
        }


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


        container.innerHTML =
            (data || []).map(regiao => `

                <div class="item-lista">

                    <span>
                        ${escapeHTML(regiao.nome)}
                    </span>

                    <div class="acoes">

                        <button
                            class="btn-editar"
                            onclick="editarRegiao(${regiao.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
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


async function salvarRegiao() {

    const input =
        encontrarElemento([
            "novaRegiao",
            "nova_regiao"
        ]);


    if (!input) {
        return;
    }


    const nome =
        input.value.trim();


    if (!nome) {
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


        await listarRegioes();

        await popularRegioes();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar região:",
            erro
        );

    }

}


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


    const {
        error
    } = await supabaseClient
        .from("regioes")
        .update({
            nome: nome.trim()
        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        return;

    }


    await listarRegioes();

    await popularRegioes();

}


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


async function popularEstados(
    selectId = null,
    regiaoId = null
) {

    const selects = selectId
        ? [document.getElementById(selectId)]
        : document.querySelectorAll(
            "#cidadeEstado, #clinicaEstado, #filtroCidadeEstado"
        );


    for (
        const select of selects
    ) {

        if (!select) {
            continue;
        }


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


        if (regiaoId) {

            query =
                query.eq(
                    "regiao_id",
                    regiaoId
                );

        }


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
                        regiaoFiltro
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


        container.innerHTML =
            (data || []).map(estado => `

                <div class="item-lista">

                    <div>

                        <strong>
                            ${escapeHTML(estado.nome)}
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
                            class="btn-editar"
                            onclick="editarEstado(${estado.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
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


async function salvarEstado() {

    const input =
        encontrarElemento([
            "novoEstado",
            "novo_estado"
        ]);


    const select =
        encontrarElemento([
            "estadoRegiao"
        ]);


    if (!input || !select) {
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


        await listarEstados();

        await popularEstados();

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


async function editarEstado(id) {

    const nome =
        prompt(
            "Novo nome do estado:"
        );


    if (
        nome === null ||
        !nome.trim()
    ) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("estados")
        .update({
            nome: nome.trim()
        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        return;

    }


    await listarEstados();

}


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

    }

}


// ============================================================
// CIDADES
// ============================================================

async function carregarPaginaCidades() {

    await popularEstados();

    await listarCidades();

}


async function popularCidades(
    selectId = null,
    estadoId = null
) {

    const selects = selectId
        ? [document.getElementById(selectId)]
        : document.querySelectorAll(
            "#bairroCidade, #clinicaCidade, #filtroBairroCidade"
        );


    for (
        const select of selects
    ) {

        if (!select) {
            continue;
        }


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
                    estadoId
                );

        }


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
                        estadoFiltro
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


        container.innerHTML =
            (data || []).map(cidade => `

                <div class="item-lista">

                    <div>

                        <strong>
                            ${escapeHTML(cidade.nome)}
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
                            class="btn-editar"
                            onclick="editarCidade(${cidade.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
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


async function salvarCidade() {

    const input =
        encontrarElemento([
            "novaCidade",
            "nova_cidade"
        ]);


    const select =
        encontrarElemento([
            "cidadeEstado"
        ]);


    if (!input || !select) {
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


        await listarCidades();

        await popularCidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar cidade:",
            erro
        );

    }

}


async function editarCidade(id) {

    const nome =
        prompt(
            "Novo nome da cidade:"
        );


    if (
        nome === null ||
        !nome.trim()
    ) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("cidades")
        .update({
            nome: nome.trim()
        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        return;

    }


    await listarCidades();

}


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


        await listarCidades();

        await popularCidades();

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir cidade:",
            erro
        );

    }

}


// ============================================================
// BAIRROS
// ============================================================

async function carregarPaginaBairros() {

    await popularCidades();

    await listarBairros();

}


async function popularBairros(
    selectId = null,
    cidadeId = null
) {

    const selects = selectId
        ? [document.getElementById(selectId)]
        : document.querySelectorAll(
            "#bairroCidade, #clinicaBairro, #filtroBairroCidade"
        );


    /*
     * Quando existem IDs duplicados na chamada,
     * removemos duplicidade.
     */

    const listaSelects =
        [...selects]
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
                .from("bairros")
                .select(`
                    id,
                    nome,
                    cidade_id
                `)
                .order("nome");


        if (cidadeId) {

            query =
                query.eq(
                    "cidade_id",
                    cidadeId
                );

        }


        if (
            select.id ===
            "filtroBairroCidade"
        ) {

            const cidadeFiltro =
                obterValor([
                    "filtroBairroCidade"
                ]);


            if (
                cidadeFiltro &&
                cidadeFiltro !== valorAtual
            ) {

                query =
                    query.eq(
                        "cidade_id",
                        cidadeFiltro
                    );

            }

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            console.error(
                "Erro ao carregar bairros:",
                error
            );

            continue;

        }


        let texto =
            "Selecione Bairro";


        if (
            select.id ===
            "filtroBairroCidade"
        ) {
            texto =
                "Todos os Bairros";
        }


        select.innerHTML =
            `<option value="">
                ${texto}
            </option>`;


        (data || [])
            .forEach(bairro => {

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

            });


        if (valorAtual) {
            select.value =
                valorAtual;
        }

    }


    /*
     * Mantemos também a lista global,
     * caso o restante do HTML/JS antigo utilize.
     */

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
        .order("nome");


    if (!error) {
        window.listaBairros =
            data || [];
    }

}


async function listarBairros() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select(`
                id,
                nome,
                cidades(
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
                "listaBairros"
            );


        if (!container) {
            return;
        }


        container.innerHTML =
            (data || []).map(bairro => `

                <div class="item-lista">

                    <div>

                        <strong>
                            ${escapeHTML(bairro.nome)}
                        </strong>

                        <small>
                            ${
                                escapeHTML(
                                    bairro.cidades?.nome ||
                                    "Sem cidade"
                                )
                            }
                        </small>

                    </div>

                    <div class="acoes">

                        <button
                            class="btn-editar"
                            onclick="editarBairro(${bairro.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirBairro(${bairro.id})"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            `).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar bairros:",
            erro
        );

    }

}


async function salvarBairro() {

    const input =
        encontrarElemento([
            "novoBairro",
            "novo_bairro"
        ]);


    const select =
        encontrarElemento([
            "bairroCidade"
        ]);


    if (!input || !select) {
        return;
    }


    const nome =
        input.value.trim();


    const cidadeId =
        select.value;


    if (!nome || !cidadeId) {

        mostrarMensagem(
            "Informe o bairro e selecione a cidade.",
            "erro"
        );

        return;

    }


    try {

        const {
            error
        } = await supabaseClient
            .from("bairros")
            .insert({

                nome,

                cidade_id:
                    Number(cidadeId)

            });


        if (error) {
            throw error;
        }


        input.value = "";

        select.value = "";


        await listarBairros();

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar bairro:",
            erro
        );

    }

}


async function editarBairro(id) {

    const nome =
        prompt(
            "Novo nome do bairro:"
        );


    if (
        nome === null ||
        !nome.trim()
    ) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("bairros")
        .update({
            nome: nome.trim()
        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        return;

    }


    await listarBairros();

}


async function excluirBairro(id) {

    if (
        !confirm(
            "Excluir este bairro?"
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


        await listarBairros();

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir bairro:",
            erro
        );

    }

}


// ============================================================
// POPULAR ESPECIALIDADES
// ============================================================

async function popularEspecialidades(
    selectId = null
) {

    const selects = selectId
        ? [document.getElementById(selectId)]
        : document.querySelectorAll(
            ".select-especialidade-global"
        );


    if (
        !selects ||
        selects.length === 0
    ) {
        return;
    }


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

        console.error(
            "Erro ao popular especialidades:",
            error
        );

        return;

    }


    selects.forEach(select => {

        if (!select) {
            return;
        }


        const valor =
            select.value;


        select.innerHTML =
            `<option value="">
                Todas as Especialidades
            </option>`;


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

                select.appendChild(
                    option
                );

            });


        if (valor) {
            select.value =
                valor;
        }

    });

}


// ============================================================
// CASCATAS DA CLÍNICA
// ============================================================

async function carregarEstadosClinica() {

    const regiao =
        obterValor([
            "clinicaRegiao"
        ]);


    const estado =
        encontrarElemento([
            "clinicaEstado"
        ]);


    if (!estado) {
        return;
    }


    await popularEstados(
        estado.id,
        regiao
    );


    const cidade =
        encontrarElemento([
            "clinicaCidade"
        ]);


    const bairro =
        encontrarElemento([
            "clinicaBairro"
        ]);


    if (cidade) {
        cidade.innerHTML =
            `<option value="">
                Selecione Cidade
            </option>`;
    }


    if (bairro) {
        bairro.innerHTML =
            `<option value="">
                Selecione Bairro
            </option>`;
    }

}


async function carregarCidadesClinica() {

    const estado =
        obterValor([
            "clinicaEstado"
        ]);


    const cidade =
        encontrarElemento([
            "clinicaCidade"
        ]);


    if (!cidade) {
        return;
    }


    await popularCidades(
        cidade.id,
        estado
    );


    const bairro =
        encontrarElemento([
            "clinicaBairro"
        ]);


    if (bairro) {

        bairro.innerHTML =
            `<option value="">
                Selecione Bairro
            </option>`;

    }

}


async function carregarBairrosClinica() {

    const cidade =
        obterValor([
            "clinicaCidade"
        ]);


    const bairro =
        encontrarElemento([
            "clinicaBairro"
        ]);


    if (!bairro) {
        return;
    }


    await popularBairros(
        bairro.id,
        cidade
    );

}


// ============================================================
// MODAL DA CLÍNICA
// ============================================================

function abrirModalClinica() {

    const modal =
        encontrarElemento([
            "modalClinica",
            "modalEditarClinica"
        ]);


    if (modal) {

        modal.style.display =
            "flex";

        modal.classList.add(
            "aberto"
        );

    }

}


function fecharModalClinica() {

    const modal =
        encontrarElemento([
            "modalClinica",
            "modalEditarClinica"
        ]);


    if (modal) {

        modal.style.display =
            "none";

        modal.classList.remove(
            "aberto"
        );

    }


    clinicaEditandoId =
        null;

}


// ============================================================
// TEMA
// ============================================================

function carregarTema() {

    const temaSalvo =
        localStorage.getItem(
            "tema"
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

    document.body.classList.toggle(
        "dark"
    );


    const tema =
        document.body.classList.contains(
            "dark"
        )
            ? "dark"
            : "light";


    localStorage.setItem(
        "tema",
        tema
    );

}


// ============================================================
// DATA
// ============================================================

function atualizarData() {

    const elemento =
        document.getElementById(
            "dataAtual"
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
// EVENTOS
// ============================================================

function configurarEventosGerais() {

    // --------------------------------------------------------
    // REGIÃO DA CLÍNICA
    // --------------------------------------------------------

    const clinicaRegiao =
        document.getElementById(
            "clinicaRegiao"
        );


    if (clinicaRegiao) {

        clinicaRegiao.addEventListener(
            "change",
            carregarEstadosClinica
        );

    }


    // --------------------------------------------------------
    // ESTADO DA CLÍNICA
    // --------------------------------------------------------

    const clinicaEstado =
        document.getElementById(
            "clinicaEstado"
        );


    if (clinicaEstado) {

        clinicaEstado.addEventListener(
            "change",
            carregarCidadesClinica
        );

    }


    // --------------------------------------------------------
    // CIDADE DA CLÍNICA
    // --------------------------------------------------------

    const clinicaCidade =
        document.getElementById(
            "clinicaCidade"
        );


    if (clinicaCidade) {

        clinicaCidade.addEventListener(
            "change",
            carregarBairrosClinica
        );

    }


    // --------------------------------------------------------
    // BOTÃO TEMA
    // --------------------------------------------------------

    const btnTema =
        document.getElementById(
            "btnTema"
        );


    if (btnTema) {

        btnTema.addEventListener(
            "click",
            alternarTema
        );

    }


    // --------------------------------------------------------
    // ESC
    // --------------------------------------------------------

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                fecharModalClinica();

            }

        }
    );


    // --------------------------------------------------------
    // CLIQUE FORA DO MODAL
    // --------------------------------------------------------

    document.addEventListener(
        "click",
        event => {

            const modal =
                encontrarElemento([
                    "modalClinica",
                    "modalEditarClinica"
                ]);


            if (
                modal &&
                event.target === modal
            ) {

                fecharModalClinica();

            }

        }
    );

}


// ============================================================
// UTILITÁRIOS
// ============================================================

function encontrarElemento(ids) {

    for (
        const id of ids
    ) {

        const elemento =
            document.getElementById(id);


        if (elemento) {
            return elemento;
        }

    }


    return null;

}


function obterValor(ids) {

    const elemento =
        encontrarElemento(ids);


    return elemento
        ? elemento.value || ""
        : "";

}


function preencherCampo(
    ids,
    valor
) {

    const elemento =
        encontrarElemento(ids);


    if (elemento) {

        elemento.value =
            valor ?? "";

    }

}


function atualizarElemento(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        console.warn(
            `Elemento #${id} não encontrado.`
        );

        return;

    }


    elemento.textContent =
        valor ?? 0;

}


// ============================================================
// REDE
// ============================================================

function normalizarRede(valor) {

    const v =
        String(
            valor ?? ""
        )
        .trim()
        .toLowerCase();


    if (
        v === "sindilegis" ||
        v === "rede sindilegis"
    ) {

        return "Sindilegis";

    }


    if (
        v === "especialista" ||
        v === "especialistas" ||
        v === "rede especialistas"
    ) {

        return "Especialistas";

    }


    return "";

}


function exibirNomeRede(valor) {

    const normalizada =
        normalizarRede(valor);


    if (normalizada) {
        return normalizada;
    }


    return valor || "";

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(valor) {

    return String(
        valor ?? ""
    )
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
// MENSAGENS
// ============================================================

function mostrarMensagem(
    mensagem,
    tipo = "sucesso"
) {

    /*
     * Se o seu HTML possuir um elemento de mensagem,
     * utilizamos ele.
     */

    const elemento =
        encontrarElemento([
            "mensagem",
            "mensagemAdmin",
            "loginMensagem",
            "statusMensagem"
        ]);


    if (!elemento) {

        console.log(
            `[${tipo}] ${mensagem}`
        );

        return;

    }


    elemento.textContent =
        mensagem;


    elemento.className =
        `mensagem ${tipo}`;


    setTimeout(() => {

        elemento.textContent =
            "";

        elemento.className =
            "mensagem";

    }, 4000);

}


// ============================================================
// LOGOUT
// ============================================================

async function logout() {

    try {

        if (
            typeof supabaseClient !==
            "undefined"
        ) {

            await supabaseClient.auth.signOut();

        }

    } catch (erro) {

        console.error(
            "Erro ao fazer logout:",
            erro
        );

    }


    window.location.href =
        "login.html";

}


// ============================================================
// FUNÇÕES DE PÁGINA
// ============================================================

async function carregarPaginaClinicas() {

    await popularRegioes();

    await popularEstados();

    await popularCidades();

    await popularBairros();

    await listarClinicas();

}


async function carregarPaginaEspecialidades() {

    await listarEspecialidades();

}


async function carregarPaginaRegioes() {

    await listarRegioes();

}


async function carregarPaginaEstados() {

    await popularRegioes();

    await listarEstados();

}


async function carregarPaginaCidades() {

    await popularEstados();

    await listarCidades();

}


async function carregarPaginaBairros() {

    await popularCidades();

    await listarBairros();

}


// ============================================================
// TORNAR FUNÇÕES DISPONÍVEIS PARA O HTML
// ============================================================

window.mostrarPagina =
    mostrarPagina;

window.carregarDashboard =
    carregarDashboard;

window.editarClinica =
    editarClinica;

window.excluirClinica =
    excluirClinica;

window.salvarClinica =
    salvarClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.fecharModalClinica =
    fecharModalClinica;

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

window.carregarEstadosClinica =
    carregarEstadosClinica;

window.carregarCidadesClinica =
    carregarCidadesClinica;

window.carregarBairrosClinica =
    carregarBairrosClinica;

window.alternarTema =
    alternarTema;

window.logout =
    logout;

window.normalizarRede =
    normalizarRede;

console.log(
    "Todas as funções do admin.js foram carregadas."
);
