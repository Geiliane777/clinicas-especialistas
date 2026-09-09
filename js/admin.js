// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO - REDE ESPECIALISTAS
// ============================================================

console.log("admin.js carregado");


// ============================================================
// CONFIGURAÇÕES
// ============================================================

let clinicaEditandoId = null;

let regiaoEditandoId = null;
let estadoEditandoId = null;
let cidadeEditandoId = null;
let bairroEditandoId = null;
let especialidadeEditandoId = null;

window.listaEspecialidadesAdmin = [];


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("DOM carregado.");

    if (typeof supabaseClient === "undefined") {
        console.error(
            "supabaseClient não foi encontrado."
        );

        alert(
            "Erro: conexão com o Supabase não foi carregada."
        );

        return;
    }

    console.log(
        "supabaseClient disponível:",
        supabaseClient
    );

    configurarEventos();

    await carregarDashboard();

    await popularRegioes();
    await popularEstados();
    await popularCidades();
    await popularBairros();
    await popularEspecialidades();

    await listarClinicas();

    await listarRegioes();
    await listarEstados();
    await listarCidades();
    await listarBairros();
    await listarEspecialidades();

    ligarCascataLocalizacao();

    console.log(
        "Painel administrativo inicializado."
    );
});


// ============================================================
// CONFIGURAR EVENTOS
// ============================================================

function configurarEventos() {

    // --------------------------------------------------------
    // MENU
    // --------------------------------------------------------

    document
        .querySelectorAll("[data-pagina]")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const pagina =
                        botao.dataset.pagina;

                    mostrarPagina(pagina);
                }
            );
        });


    // --------------------------------------------------------
    // LOGOUT
    // --------------------------------------------------------

    const btnLogout =
        document.getElementById("btnLogout");

    if (btnLogout) {

        btnLogout.addEventListener(
            "click",
            function () {

                window.location.href =
                    "index.html";
            }
        );
    }


    // --------------------------------------------------------
    // TEMA
    // --------------------------------------------------------

    const btnTema =
        document.getElementById("btnTema");

    if (btnTema) {

        btnTema.addEventListener(
            "click",
            alternarTema
        );
    }


    // --------------------------------------------------------
    // BOTÃO ADICIONAR ESPECIALIDADE
    // --------------------------------------------------------

    const btnAdicionarEspecialidade =
        document.getElementById(
            "btnAdicionarEspecialidade"
        );

    if (btnAdicionarEspecialidade) {

        btnAdicionarEspecialidade.addEventListener(
            "click",
            function () {

                adicionarLinhaEspecialidade();
            }
        );
    }


    // --------------------------------------------------------
    // FORMULÁRIO DE CLÍNICA
    // --------------------------------------------------------

    const formClinica =
        document.getElementById(
            "formClinica"
        );

    if (formClinica) {

        formClinica.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await salvarClinica();
            }
        );
    }


    // --------------------------------------------------------
    // FORMULÁRIOS
    // --------------------------------------------------------

    const formRegiao =
        document.getElementById(
            "formRegiao"
        );

    if (formRegiao) {

        formRegiao.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await salvarRegiao();
            }
        );
    }


    const formEstado =
        document.getElementById(
            "formEstado"
        );

    if (formEstado) {

        formEstado.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await salvarEstado();
            }
        );
    }


    const formCidade =
        document.getElementById(
            "formCidade"
        );

    if (formCidade) {

        formCidade.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await salvarCidade();
            }
        );
    }


    const formBairro =
        document.getElementById(
            "formBairro"
        );

    if (formBairro) {

        formBairro.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await salvarBairro();
            }
        );
    }


    const formEspecialidade =
        document.getElementById(
            "formEspecialidade"
        );

    if (formEspecialidade) {

        formEspecialidade.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await salvarEspecialidade();
            }
        );
    }
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


function mostrarPagina(pagina) {

    document
        .querySelectorAll(".pagina")
        .forEach(function (elemento) {

            elemento.style.display = "none";
        });


    const paginaSelecionada =
        document.getElementById(
            `pagina-${pagina}`
        );

    if (paginaSelecionada) {

        paginaSelecionada.style.display =
            "block";
    }


    document
        .querySelectorAll("[data-pagina]")
        .forEach(function (botao) {

            botao.classList.remove(
                "ativo"
            );

            if (
                botao.dataset.pagina ===
                pagina
            ) {

                botao.classList.add(
                    "ativo"
                );
            }
        });


    const titulo =
        document.getElementById(
            "tituloPagina"
        );

    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[pagina] ||
            "Painel Administrativo";
    }


    // Atualiza os dados da página
    // quando ela é aberta.

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
    }

    if (pagina === "cidades") {
        listarCidades();
    }

    if (pagina === "bairros") {
        listarBairros();
    }
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
            clinicas,
            especialidades
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
                .select("id"),

            supabaseClient
                .from("clinicas")
                .select("id"),

            supabaseClient
                .from("especialidades")
                .select("id")
        ]);


        atualizarNumero(
            "totalRegioes",
            regioes.data?.length || 0
        );

        atualizarNumero(
            "totalEstados",
            estados.data?.length || 0
        );

        atualizarNumero(
            "totalCidades",
            cidades.data?.length || 0
        );

        atualizarNumero(
            "totalBairros",
            bairros.data?.length || 0
        );

        atualizarNumero(
            "totalClinicas",
            clinicas.data?.length || 0
        );

        atualizarNumero(
            "totalEspecialidades",
            especialidades.data?.length || 0
        );


        await carregarUltimasClinicas();

    } catch (error) {

        console.error(
            "Erro no dashboard:",
            error
        );
    }
}


function atualizarNumero(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            valor;
    }
}


// ============================================================
// ÚLTIMAS CLÍNICAS
// ============================================================

async function carregarUltimasClinicas() {

    const container =
        document.getElementById(
            "ultimasClinicas"
        );

    if (!container) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("clinicas")
        .select(`
            id,
            nome
        `)
        .order(
            "id",
            {
                ascending: false
            }
        )
        .limit(5);


    if (error) {

        console.error(
            "Erro ao carregar últimas clínicas:",
            error
        );

        return;
    }


    container.innerHTML = "";


    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>Nenhuma clínica cadastrada.</p>";

        return;
    }


    data.forEach(function (clinica) {

        const item =
            document.createElement("div");

        item.className =
            "item-clinica-dashboard";

        item.innerHTML = `
            <strong>
                ${escaparHTML(
                    clinica.nome || "Sem nome"
                )}
            </strong>
        `;

        container.appendChild(item);
    });
}


// ============================================================
// CLÍNICAS
// ============================================================

async function listarClinicas() {

    const tabela =
        document.getElementById(
            "tabelaClinicas"
        );

    if (!tabela) {
        return;
    }


    tabela.innerHTML = `
        <tr>
            <td colspan="100%">
                Carregando clínicas...
            </td>
        </tr>
    `;


    const {
        data,
        error
    } = await supabaseClient
        .from("clinicas")
        .select(`
            id,
            nome,
            telefone,
            whatsapp,
            email,
            endereco,
            numero,
            complemento,
            cep,
            regiao_id,
            estado_id,
            cidade_id,
            bairro_id
        `)
        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Erro ao listar clínicas:",
            error
        );

        tabela.innerHTML = `
            <tr>
                <td colspan="100%">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

        return;
    }


    tabela.innerHTML = "";


    if (!data || data.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="100%">
                    Nenhuma clínica cadastrada.
                </td>
            </tr>
        `;

        return;
    }


    for (const clinica of data) {

        const especialidades =
            await obterEspecialidadesClinica(
                clinica.id
            );


        const tr =
            document.createElement("tr");


        const nomesEspecialidades =
            especialidades
                .map(function (item) {
                    return item.nome;
                })
                .join(", ");


        tr.innerHTML = `
            <td>
                ${escaparHTML(
                    clinica.nome || ""
                )}
            </td>

            <td>
                ${escaparHTML(
                    nomesEspecialidades ||
                    "Nenhuma"
                )}
            </td>

            <td>
                ${escaparHTML(
                    clinica.telefone || ""
                )}
            </td>

            <td>
                <div class="acoes-tabela">

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
}


// ============================================================
// OBTER ESPECIALIDADES DA CLÍNICA
// ============================================================

async function obterEspecialidadesClinica(
    clinicaId
) {

    const {
        data,
        error
    } = await supabaseClient
        .from("clinica_especialidades")
        .select(`
            especialidade_id,
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

        console.error(
            "Erro ao buscar especialidades da clínica:",
            error
        );

        return [];
    }


    return (data || [])
        .map(function (item) {

            if (
                item.especialidades
            ) {

                return {
                    id:
                        item.especialidades.id,

                    nome:
                        item.especialidades.nome
                };
            }

            return null;
        })
        .filter(Boolean);
}


// ============================================================
// EDITAR CLÍNICA
// ============================================================

async function editarClinica(
    clinicaId
) {

    clinicaEditandoId =
        clinicaId;


    const {
        data: clinica,
        error
    } = await supabaseClient
        .from("clinicas")
        .select(`
            id,
            nome,
            telefone,
            whatsapp,
            email,
            endereco,
            numero,
            complemento,
            cep,
            regiao_id,
            estado_id,
            cidade_id,
            bairro_id
        `)
        .eq(
            "id",
            clinicaId
        )
        .single();


    if (error) {

        console.error(
            "Erro ao buscar clínica:",
            error
        );

        alert(
            "Não foi possível carregar a clínica."
        );

        return;
    }


    preencherCampo(
        "clinicaId",
        clinica.id
    );

    preencherCampo(
        "clinicaNome",
        clinica.nome
    );

    preencherCampo(
        "clinicaTelefone",
        clinica.telefone
    );

    preencherCampo(
        "clinicaWhatsapp",
        clinica.whatsapp
    );

    preencherCampo(
        "clinicaEmail",
        clinica.email
    );

    preencherCampo(
        "clinicaEndereco",
        clinica.endereco
    );

    preencherCampo(
        "clinicaNumero",
        clinica.numero
    );

    preencherCampo(
        "clinicaComplemento",
        clinica.complemento
    );

    preencherCampo(
        "clinicaCep",
        clinica.cep
    );


    await popularRegioes(
        "clinicaRegiao"
    );

    await popularEstados(
        "clinicaEstado",
        clinica.regiao_id
    );

    await popularCidades(
        "clinicaCidade",
        clinica.estado_id
    );

    await popularBairros(
        "clinicaBairro",
        clinica.cidade_id
    );


    selecionarValor(
        "clinicaRegiao",
        clinica.regiao_id
    );

    selecionarValor(
        "clinicaEstado",
        clinica.estado_id
    );

    selecionarValor(
        "clinicaCidade",
        clinica.cidade_id
    );

    selecionarValor(
        "clinicaBairro",
        clinica.bairro_id
    );


    await carregarEspecialidadesClinicaNoModal(
        clinicaId
    );


    abrirModal(
        "modalClinica"
    );
}


// ============================================================
// CARREGAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function carregarEspecialidadesClinicaNoModal(
    clinicaId
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) {

        console.error(
            "containerEspecialidades não encontrado."
        );

        return;
    }


    container.innerHTML = "";


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
        )
        .eq(
            "ativo",
            true
        );


    if (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

        alert(
            "Não foi possível carregar as especialidades."
        );

        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        adicionarLinhaEspecialidade();

        return;
    }


    for (const item of data) {

        const rede =
            normalizarRede(
                item.rede
            );


        adicionarLinhaEspecialidade(
            item.especialidade_id,
            rede
        );
    }
}


// ============================================================
// NORMALIZAR REDE
// ============================================================

function normalizarRede(
    valor
) {

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


// ============================================================
// ADICIONAR LINHA DE ESPECIALIDADE
// ============================================================

function adicionarLinhaEspecialidade(
    especialidadeSelecionada = "",
    redeSelecionada = ""
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) {

        console.error(
            "containerEspecialidades não encontrado."
        );

        return;
    }


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    linha.innerHTML = `

        <select
            class="select-especialidade"
        >

            <option value="">
                Selecione a especialidade
            </option>

        </select>


        <select
            class="select-rede-especialidade"
        >

            <option value="">
                Selecione a rede
            </option>

            <option value="Sindilegis">
                Sindilegis
            </option>

            <option value="Especialistas">
                Especialistas
            </option>

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
        >
            Remover
        </button>

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
            ".select-rede-especialidade"
        );


    // --------------------------------------------------------
    // POPULAR ESPECIALIDADES
    // --------------------------------------------------------

    const especialidades =
        window.listaEspecialidadesAdmin ||
        [];


    especialidades.forEach(
        function (especialidade) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                especialidade.id;


            option.textContent =
                especialidade.nome;


            if (
                String(
                    especialidade.id
                ) ===
                String(
                    especialidadeSelecionada
                )
            ) {

                option.selected =
                    true;
            }


            selectEspecialidade
                .appendChild(
                    option
                );
        }
    );


    // --------------------------------------------------------
    // REDE
    // --------------------------------------------------------

    const rede =
        normalizarRede(
            redeSelecionada
        );


    if (rede) {

        selectRede.value =
            rede;
    }


    // --------------------------------------------------------
    // REMOVER
    // --------------------------------------------------------

    const btnRemover =
        linha.querySelector(
            ".btn-remover-especialidade"
        );


    btnRemover.addEventListener(
        "click",
        function () {

            linha.remove();


            const linhas =
                container.querySelectorAll(
                    ".linha-especialidade"
                );


            if (
                linhas.length === 0
            ) {

                adicionarLinhaEspecialidade();
            }
        }
    );
}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica() {

    const nome =
        obterValor(
            "clinicaNome"
        );


    if (!nome) {

        alert(
            "Informe o nome da clínica."
        );

        return;
    }


    const dados = {

        nome:
            nome,

        telefone:
            obterValor(
                "clinicaTelefone"
            ),

        whatsapp:
            obterValor(
                "clinicaWhatsapp"
            ),

        email:
            obterValor(
                "clinicaEmail"
            ),

        endereco:
            obterValor(
                "clinicaEndereco"
            ),

        numero:
            obterValor(
                "clinicaNumero"
            ),

        complemento:
            obterValor(
                "clinicaComplemento"
            ),

        cep:
            obterValor(
                "clinicaCep"
            ),

        regiao_id:
            obterValor(
                "clinicaRegiao"
            ) || null,

        estado_id:
            obterValor(
                "clinicaEstado"
            ) || null,

        cidade_id:
            obterValor(
                "clinicaCidade"
            ) || null,

        bairro_id:
            obterValor(
                "clinicaBairro"
            ) || null
    };


    try {

        let clinicaId;


        // ----------------------------------------------------
        // EDITANDO
        // ----------------------------------------------------

        if (clinicaEditandoId) {

            const {
                error
            } = await supabaseClient
                .from("clinicas")
                .update(dados)
                .eq(
                    "id",
                    clinicaEditandoId
                );


            if (error) {

                throw error;
            }


            clinicaId =
                clinicaEditandoId;
        }


        // ----------------------------------------------------
        // NOVA CLÍNICA
        // ----------------------------------------------------

        else {

            const {
                data,
                error
            } = await supabaseClient
                .from("clinicas")
                .insert(
                    dados
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
        // RELACIONAMENTOS
        // ----------------------------------------------------

        const especialidadesSalvas =
            await atualizarEspecialidadesClinica(
                clinicaId
            );


        if (
            !especialidadesSalvas
        ) {

            return;
        }


        alert(
            "Clínica salva com sucesso!"
        );


        fecharModal(
            "modalClinica"
        );


        clinicaEditandoId =
            null;


        await listarClinicas();

        await carregarDashboard();

    } catch (error) {

        console.error(
            "Erro ao salvar clínica:",
            error
        );


        alert(
            "Erro ao salvar a clínica."
        );
    }
}


// ============================================================
// ATUALIZAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function atualizarEspecialidadesClinica(
    clinicaId
) {

    try {

        // ----------------------------------------------------
        // PRIMEIRO REMOVE OS RELACIONAMENTOS ATUAIS
        // ----------------------------------------------------

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

            console.error(
                "Erro ao remover especialidades antigas:",
                erroDelete
            );

            alert(
                "Erro ao atualizar as especialidades."
            );

            return false;
        }


        // ----------------------------------------------------
        // LER LINHAS
        // ----------------------------------------------------

        const container =
            document.getElementById(
                "containerEspecialidades"
            );


        if (!container) {

            return true;
        }


        const linhas =
            container.querySelectorAll(
                ".linha-especialidade"
            );


        const registros = [];

        const chaves =
            new Set();


        for (
            const linha of linhas
        ) {

            const selectEspecialidade =
                linha.querySelector(
                    ".select-especialidade"
                );


            const selectRede =
                linha.querySelector(
                    ".select-rede-especialidade"
                );


            if (
                !selectEspecialidade ||
                !selectRede
            ) {

                continue;
            }


            const especialidadeId =
                selectEspecialidade.value;


            const rede =
                normalizarRede(
                    selectRede.value
                );


            // Linha vazia
            if (
                !especialidadeId &&
                !rede
            ) {

                continue;
            }


            // Especialidade sem rede
            if (
                especialidadeId &&
                !rede
            ) {

                alert(
                    "Selecione a rede para todas as especialidades."
                );

                selectRede.focus();

                return false;
            }


            // Rede sem especialidade
            if (
                !especialidadeId &&
                rede
            ) {

                alert(
                    "Selecione uma especialidade para a rede escolhida."
                );

                selectEspecialidade.focus();

                return false;
            }


            // ------------------------------------------------
            // CHAVE ÚNICA
            // ------------------------------------------------

            const chave =
                `${especialidadeId}_${rede}`;


            if (
                chaves.has(chave)
            ) {

                continue;
            }


            chaves.add(
                chave
            );


            registros.push({

                clinica_id:
                    clinicaId,

                especialidade_id:
                    Number(
                        especialidadeId
                    ),

                rede:
                    rede,

                ativo:
                    true
            });
        }


        // ----------------------------------------------------
        // NENHUMA ESPECIALIDADE
        // ----------------------------------------------------

        if (
            registros.length === 0
        ) {

            return true;
        }


        console.log(
            "Relacionamentos a salvar:",
            registros
        );


        // ----------------------------------------------------
        // INSERIR
        // ----------------------------------------------------

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

            console.error(
                "Erro ao inserir especialidades:",
                error
            );

            alert(
                "Erro ao salvar as especialidades."
            );

            return false;
        }


        return true;

    } catch (error) {

        console.error(
            "Erro ao atualizar especialidades:",
            error
        );

        alert(
            "Erro ao atualizar as especialidades."
        );

        return false;
    }
}


// ============================================================
// COMPATIBILIDADE
// ============================================================

async function salvarEspecialidadesClinica(
    clinicaId
) {

    return await atualizarEspecialidadesClinica(
        clinicaId
    );
}


// ============================================================
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(
    clinicaId
) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta clínica?"
        );


    if (!confirmar) {
        return;
    }


    try {

        // Remove relacionamentos
        const {
            error: erroRelacionamentos
        } = await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .delete()
            .eq(
                "clinica_id",
                clinicaId
            );


        if (
            erroRelacionamentos
        ) {

            throw erroRelacionamentos;
        }


        // Remove clínica
        const {
            error
        } = await supabaseClient
            .from(
                "clinicas"
            )
            .delete()
            .eq(
                "id",
                clinicaId
            );


        if (error) {

            throw error;
        }


        alert(
            "Clínica excluída com sucesso!"
        );


        await listarClinicas();

        await carregarDashboard();

    } catch (error) {

        console.error(
            "Erro ao excluir clínica:",
            error
        );


        alert(
            "Não foi possível excluir a clínica."
        );
    }
}


// ============================================================
// ESPECIALIDADES
// ============================================================

async function popularEspecialidades(
    selectId = null
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            "especialidades"
        )
        .select(
            "id, nome"
        )
        .eq(
            "ativo",
            true
        )
        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

        return;
    }


    window.listaEspecialidadesAdmin =
        data || [];


    // --------------------------------------------------------
    // SELECT ESPECÍFICO
    // --------------------------------------------------------

    if (selectId) {

        const select =
            document.getElementById(
                selectId
            );


        if (select) {

            preencherSelectEspecialidades(
                select,
                data
            );
        }

        return;
    }


    // --------------------------------------------------------
    // TODOS OS SELECTS DE ESPECIALIDADE
    // --------------------------------------------------------

    document
        .querySelectorAll(
            ".select-especialidade"
        )
        .forEach(function (select) {

            const valorAtual =
                select.value;


            preencherSelectEspecialidades(
                select,
                data
            );


            if (valorAtual) {

                select.value =
                    valorAtual;
            }
        });
}


function preencherSelectEspecialidades(
    select,
    especialidades
) {

    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione a especialidade
        </option>
    `;


    especialidades.forEach(
        function (especialidade) {

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


    if (valorAtual) {

        select.value =
            valorAtual;
    }
}


// ============================================================
// LISTAR ESPECIALIDADES
// ============================================================

async function listarEspecialidades() {

    const tabela =
        document.getElementById(
            "tabelaEspecialidades"
        );


    if (!tabela) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from(
            "especialidades"
        )
        .select(
            "id, nome, ativo"
        )
        .order(
            "nome",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Erro ao listar especialidades:",
            error
        );

        return;
    }


    tabela.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        tabela.innerHTML = `
            <tr>
                <td colspan="100%">
                    Nenhuma especialidade cadastrada.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(
        function (especialidade) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${escaparHTML(
                        especialidade.nome
                    )}
                </td>

                <td>
                    ${
                        especialidade.ativo
                            ? "Ativa"
                            : "Inativa"
                    }
                </td>

                <td>

                    <div class="acoes-tabela">

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

                </td>
            `;


            tabela.appendChild(
                tr
            );
        }
    );
}


// ============================================================
// EDITAR ESPECIALIDADE
// ============================================================

async function editarEspecialidade(
    id
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            "especialidades"
        )
        .select(
            "id, nome, ativo"
        )
        .eq(
            "id",
            id
        )
        .single();


    if (error) {

        console.error(
            error
        );

        return;
    }


    especialidadeEditandoId =
        id;


    preencherCampo(
        "especialidadeId",
        data.id
    );


    preencherCampo(
        "especialidadeNome",
        data.nome
    );


    const ativo =
        document.getElementById(
            "especialidadeAtivo"
        );


    if (ativo) {

        ativo.checked =
            data.ativo;
    }


    abrirModal(
        "modalEspecialidade"
    );
}


// ============================================================
// SALVAR ESPECIALIDADE
// ============================================================

async function salvarEspecialidade() {

    const nome =
        obterValor(
            "especialidadeNome"
        );


    if (!nome) {

        alert(
            "Informe o nome da especialidade."
        );

        return;
    }


    const ativoElemento =
        document.getElementById(
            "especialidadeAtivo"
        );


    const ativo =
        ativoElemento
            ? ativoElemento.checked
            : true;


    try {

        if (
            especialidadeEditandoId
        ) {

            const {
                error
            } = await supabaseClient
                .from(
                    "especialidades"
                )
                .update({

                    nome:
                        nome,

                    ativo:
                        ativo
                })
                .eq(
                    "id",
                    especialidadeEditandoId
                );


            if (error) {
                throw error;
            }

        } else {

            const {
                error
            } = await supabaseClient
                .from(
                    "especialidades"
                )
                .insert({

                    nome:
                        nome,

                    ativo:
                        ativo
                });


            if (error) {
                throw error;
            }
        }


        alert(
            "Especialidade salva com sucesso!"
        );


        fecharModal(
            "modalEspecialidade"
        );


        especialidadeEditandoId =
            null;


        await popularEspecialidades();

        await listarEspecialidades();

        await carregarDashboard();

    } catch (error) {

        console.error(
            "Erro ao salvar especialidade:",
            error
        );


        alert(
            "Erro ao salvar especialidade."
        );
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
            "Tem certeza que deseja excluir esta especialidade?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from(
                "especialidades"
            )
            .update({
                ativo: false
            })
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        alert(
            "Especialidade excluída com sucesso!"
        );


        await popularEspecialidades();

        await listarEspecialidades();

        await carregarDashboard();

    } catch (error) {

        console.error(
            "Erro ao excluir especialidade:",
            error
        );


        alert(
            "Erro ao excluir especialidade."
        );
    }
}


// ============================================================
// REGIÕES
// ============================================================

async function popularRegioes(
    selectId = "clinicaRegiao"
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            "regioes"
        )
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

        console.error(
            "Erro ao carregar regiões:",
            error
        );

        return;
    }


    const select =
        document.getElementById(
            selectId
        );


    if (!select) {
        return;
    }


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione a região
        </option>
    `;


    (data || []).forEach(
        function (regiao) {

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


    if (valorAtual) {
        select.value =
            valorAtual;
    }
}


// ============================================================
// LISTAR REGIÕES
// ============================================================

async function listarRegioes() {

    const tabela =
        document.getElementById(
            "tabelaRegioes"
        );


    if (!tabela) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from(
            "regioes"
        )
        .select(
            "id, nome"
        )
        .order(
            "nome"
        );


    if (error) {

        console.error(
            "Erro ao listar regiões:",
            error
        );

        return;
    }


    tabela.innerHTML = "";


    (data || []).forEach(
        function (regiao) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${escaparHTML(
                        regiao.nome
                    )}
                </td>

                <td>

                    <div class="acoes-tabela">

                        <button
                            class="btn-editar"
                            onclick="editarRegiao(${regiao.id})"
                        >
                            Editar
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirRegiao(${regiao.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </td>
            `;


            tabela.appendChild(
                tr
            );
        }
    );
}


// ============================================================
// EDITAR REGIÃO
// ============================================================

async function editarRegiao(
    id
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            "regioes"
        )
        .select(
            "id, nome"
        )
        .eq(
            "id",
            id
        )
        .single();


    if (error) {

        console.error(
            error
        );

        return;
    }


    regiaoEditandoId =
        id;


    preencherCampo(
        "regiaoId",
        data.id
    );


    preencherCampo(
        "regiaoNome",
        data.nome
    );


    abrirModal(
        "modalRegiao"
    );
}


// ============================================================
// SALVAR REGIÃO
// ============================================================

async function salvarRegiao() {

    const nome =
        obterValor(
            "regiaoNome"
        );


    if (!nome) {

        alert(
            "Informe o nome da região."
        );

        return;
    }


    try {

        if (regiaoEditandoId) {

            const {
                error
            } = await supabaseClient
                .from(
                    "regioes"
                )
                .update({
                    nome:
                        nome
                })
                .eq(
                    "id",
                    regiaoEditandoId
                );


            if (error) {
                throw error;
            }

        } else {

            const {
                error
            } = await supabaseClient
                .from(
                    "regioes"
                )
                .insert({
                    nome:
                        nome
                });


            if (error) {
                throw error;
            }
        }


        alert(
            "Região salva com sucesso!"
        );


        fecharModal(
            "modalRegiao"
        );


        regiaoEditandoId =
            null;


        await popularRegioes();

        await listarRegioes();

        await carregarDashboard();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Erro ao salvar região."
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
            "Deseja excluir esta região?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from(
                "regioes"
            )
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


        await popularRegioes();

        await listarRegioes();

        await carregarDashboard();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Não foi possível excluir a região."
        );
    }
}


// ============================================================
// ESTADOS
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


    let query =
        supabaseClient
            .from(
                "estados"
            )
            .select(
                "id, nome, regiao_id"
            )
            .order(
                "nome"
            );


    if (regiaoId) {

        query =
            query.eq(
                "regiao_id",
                regiaoId
            );
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

        return;
    }


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione o estado
        </option>
    `;


    (data || []).forEach(
        function (estado) {

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


    if (valorAtual) {
        select.value =
            valorAtual;
    }
}


// ============================================================
// LISTAR ESTADOS
// ============================================================

async function listarEstados() {

    const tabela =
        document.getElementById(
            "tabelaEstados"
        );


    if (!tabela) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from(
            "estados"
        )
        .select(`
            id,
            nome,
            regiao_id,
            regioes (
                nome
            )
        `)
        .order(
            "nome"
        );


    if (error) {

        console.error(
            "Erro ao listar estados:",
            error
        );

        return;
    }


    tabela.innerHTML = "";


    (data || []).forEach(
        function (estado) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

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

                <td>

                    <div class="acoes-tabela">

                        <button
                            class="btn-editar"
                            onclick="editarEstado(${estado.id})"
                        >
                            Editar
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirEstado(${estado.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </td>
            `;


            tabela.appendChild(
                tr
            );
        }
    );
}


// ============================================================
// EDITAR ESTADO
// ============================================================

async function editarEstado(
    id
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            "estados"
        )
        .select(
            "id, nome, regiao_id"
        )
        .eq(
            "id",
            id
        )
        .single();


    if (error) {

        console.error(
            error
        );

        return;
    }


    estadoEditandoId =
        id;


    preencherCampo(
        "estadoId",
        data.id
    );


    preencherCampo(
        "estadoNome",
        data.nome
    );


    await popularRegioes(
        "estadoRegiao"
    );


    selecionarValor(
        "estadoRegiao",
        data.regiao_id
    );


    abrirModal(
        "modalEstado"
    );
}


// ============================================================
// SALVAR ESTADO
// ============================================================

async function salvarEstado() {

    const nome =
        obterValor(
            "estadoNome"
        );


    const regiaoId =
        obterValor(
            "estadoRegiao"
        );


    if (!nome) {

        alert(
            "Informe o nome do estado."
        );

        return;
    }


    try {

        const dados = {

            nome:
                nome,

            regiao_id:
                regiaoId || null
        };


        if (estadoEditandoId) {

            const {
                error
            } = await supabaseClient
                .from(
                    "estados"
                )
                .update(
                    dados
                )
                .eq(
                    "id",
                    estadoEditandoId
                );


            if (error) {
                throw error;
            }

        } else {

            const {
                error
            } = await supabaseClient
                .from(
                    "estados"
                )
                .insert(
                    dados
                );


            if (error) {
                throw error;
            }
        }


        alert(
            "Estado salvo com sucesso!"
        );


        fecharModal(
            "modalEstado"
        );


        estadoEditandoId =
            null;


        await popularEstados();

        await listarEstados();

        await carregarDashboard();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Erro ao salvar estado."
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
            "Deseja excluir este estado?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from(
                "estados"
            )
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


        await popularEstados();

        await listarEstados();

        await carregarDashboard();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Não foi possível excluir o estado."
        );
    }
}


// ============================================================
// CIDADES
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


    let query =
        supabaseClient
            .from(
                "cidades"
            )
            .select(
                "id, nome, estado_id"
            )
            .order(
                "nome"
            );


    if (estadoId) {

        query =
            query.eq(
                "estado_id",
                estadoId
            );
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

        return;
    }


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione a cidade
        </option>
    `;


    (data || []).forEach(
        function (cidade) {

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


    if (valorAtual) {
        select.value =
            valorAtual;
    }
}


// ============================================================
// LISTAR CIDADES
// ============================================================

async function listarCidades() {

    const tabela =
        document.getElementById(
            "tabelaCidades"
        );


    if (!tabela) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from(
            "cidades"
        )
        .select(`
            id,
            nome,
            estado_id,
            estados (
                nome
            )
        `)
        .order(
            "nome"
        );


    if (error) {

        console.error(
            "Erro ao listar cidades:",
            error
        );

        return;
    }


    tabela.innerHTML = "";


    (data || []).forEach(
        function (cidade) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

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

                    <div class="acoes-tabela">

                        <button
                            class="btn-editar"
                            onclick="editarCidade(${cidade.id})"
                        >
                            Editar
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirCidade(${cidade.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </td>
            `;


            tabela.appendChild(
                tr
            );
        }
    );
}


// ============================================================
// EDITAR CIDADE
// ============================================================

async function editarCidade(
    id
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            "cidades"
        )
        .select(
            "id, nome, estado_id"
        )
        .eq(
            "id",
            id
        )
        .single();


    if (error) {

        console.error(
            error
        );

        return;
    }


    cidadeEditandoId =
        id;


    preencherCampo(
        "cidadeId",
        data.id
    );


    preencherCampo(
        "cidadeNome",
        data.nome
    );


    await popularEstados(
        "cidadeEstado"
    );


    selecionarValor(
        "cidadeEstado",
        data.estado_id
    );


    abrirModal(
        "modalCidade"
    );
}


// ============================================================
// SALVAR CIDADE
// ============================================================

async function salvarCidade() {

    const nome =
        obterValor(
            "cidadeNome"
        );


    const estadoId =
        obterValor(
            "cidadeEstado"
        );


    if (!nome) {

        alert(
            "Informe o nome da cidade."
        );

        return;
    }


    try {

        const dados = {

            nome:
                nome,

            estado_id:
                estadoId || null
        };


        if (cidadeEditandoId) {

            const {
                error
            } = await supabaseClient
                .from(
                    "cidades"
                )
                .update(
                    dados
                )
                .eq(
                    "id",
                    cidadeEditandoId
                );


            if (error) {
                throw error;
            }

        } else {

            const {
                error
            } = await supabaseClient
                .from(
                    "cidades"
                )
                .insert(
                    dados
                );


            if (error) {
                throw error;
            }
        }


        alert(
            "Cidade salva com sucesso!"
        );


        fecharModal(
            "modalCidade"
        );


        cidadeEditandoId =
            null;


        await popularCidades();

        await listarCidades();

        await carregarDashboard();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Erro ao salvar cidade."
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
            "Deseja excluir esta cidade?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from(
                "cidades"
            )
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


        await popularCidades();

        await listarCidades();

        await carregarDashboard();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Não foi possível excluir a cidade."
        );
    }
}


// ============================================================
// BAIRROS
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


    let query =
        supabaseClient
            .from(
                "bairros"
            )
            .select(
                "id, nome, cidade_id"
            )
            .order(
                "nome"
            );


    if (cidadeId) {

        query =
            query.eq(
                "cidade_id",
                cidadeId
            );
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

        return;
    }


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione o bairro
        </option>
    `;


    (data || []).forEach(
        function (bairro) {

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


    if (valorAtual) {
        select.value =
            valorAtual;
    }
}


// ============================================================
// LISTAR BAIRROS
// ============================================================

async function listarBairros() {

    const tabela =
        document.getElementById(
            "tabelaBairros"
        );


    if (!tabela) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from(
            "bairros"
        )
        .select(`
            id,
            nome,
            cidade_id,
            cidades (
                nome
            )
        `)
        .order(
            "nome"
        );


    if (error) {

        console.error(
            "Erro ao listar bairros:",
            error
        );

        return;
    }


    tabela.innerHTML = "";


    (data || []).forEach(
        function (bairro) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${escaparHTML(
                        bairro.nome
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        bairro.cidades?.nome ||
                        "Não informado"
                    )}
                </td>

                <td>

                    <div class="acoes-tabela">

                        <button
                            class="btn-editar"
                            onclick="editarBairro(${bairro.id})"
                        >
                            Editar
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirBairro(${bairro.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </td>
            `;


            tabela.appendChild(
                tr
            );
        }
    );
}


// ============================================================
// EDITAR BAIRRO
// ============================================================

async function editarBairro(
    id
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            "bairros"
        )
        .select(
            "id, nome, cidade_id"
        )
        .eq(
            "id",
            id
        )
        .single();


    if (error) {

        console.error(
            error
        );

        return;
    }


    bairroEditandoId =
        id;


    preencherCampo(
        "bairroId",
        data.id
    );


    preencherCampo(
        "bairroNome",
        data.nome
    );


    await popularCidades(
        "bairroCidade"
    );


    selecionarValor(
        "bairroCidade",
        data.cidade_id
    );


    abrirModal(
        "modalBairro"
    );
}


// ============================================================
// SALVAR BAIRRO
// ============================================================

async function salvarBairro() {

    const nome =
        obterValor(
            "bairroNome"
        );


    const cidadeId =
        obterValor(
            "bairroCidade"
        );


    if (!nome) {

        alert(
            "Informe o nome do bairro."
        );

        return;
    }


    try {

        const dados = {

            nome:
                nome,

            cidade_id:
                cidadeId || null
        };


        if (bairroEditandoId) {

            const {
                error
            } = await supabaseClient
                .from(
                    "bairros"
                )
                .update(
                    dados
                )
                .eq(
                    "id",
                    bairroEditandoId
                );


            if (error) {
                throw error;
            }

        } else {

            const {
                error
            } = await supabaseClient
                .from(
                    "bairros"
                )
                .insert(
                    dados
                );


            if (error) {
                throw error;
            }
        }


        alert(
            "Bairro salvo com sucesso!"
        );


        fecharModal(
            "modalBairro"
        );


        bairroEditandoId =
            null;


        await popularBairros();

        await listarBairros();

        await carregarDashboard();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Erro ao salvar bairro."
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
            "Deseja excluir este bairro?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from(
                "bairros"
            )
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


        await popularBairros();

        await listarBairros();

        await carregarDashboard();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Não foi possível excluir o bairro."
        );
    }
}


// ============================================================
// CASCATA DE LOCALIZAÇÃO
// ============================================================

function ligarCascataLocalizacao() {

    // --------------------------------------------------------
    // CLÍNICA
    // --------------------------------------------------------

    const regiao =
        document.getElementById(
            "clinicaRegiao"
        );

    const estado =
        document.getElementById(
            "clinicaEstado"
        );

    const cidade =
        document.getElementById(
            "clinicaCidade"
        );


    if (regiao) {

        regiao.addEventListener(
            "change",
            async function () {

                const regiaoId =
                    regiao.value;


                await popularEstados(
                    "clinicaEstado",
                    regiaoId
                );


                const cidadeSelect =
                    document.getElementById(
                        "clinicaCidade"
                    );


                const bairroSelect =
                    document.getElementById(
                        "clinicaBairro"
                    );


                if (cidadeSelect) {

                    cidadeSelect.innerHTML = `
                        <option value="">
                            Selecione a cidade
                        </option>
                    `;
                }


                if (bairroSelect) {

                    bairroSelect.innerHTML = `
                        <option value="">
                            Selecione o bairro
                        </option>
                    `;
                }
            }
        );
    }


    if (estado) {

        estado.addEventListener(
            "change",
            async function () {

                const estadoId =
                    estado.value;


                await popularCidades(
                    "clinicaCidade",
                    estadoId
                );


                const bairroSelect =
                    document.getElementById(
                        "clinicaBairro"
                    );


                if (bairroSelect) {

                    bairroSelect.innerHTML = `
                        <option value="">
                            Selecione o bairro
                        </option>
                    `;
                }
            }
        );
    }


    if (cidade) {

        cidade.addEventListener(
            "change",
            async function () {

                const cidadeId =
                    cidade.value;


                await popularBairros(
                    "clinicaBairro",
                    cidadeId
                );
            }
        );
    }


    // --------------------------------------------------------
    // CADASTRO DE ESTADO
    // --------------------------------------------------------

    const estadoRegiao =
        document.getElementById(
            "estadoRegiao"
        );


    if (estadoRegiao) {

        estadoRegiao.addEventListener(
            "change",
            function () {
                // reservado para futuras melhorias
            }
        );
    }


    // --------------------------------------------------------
    // CADASTRO DE CIDADE
    // --------------------------------------------------------

    const cidadeEstado =
        document.getElementById(
            "cidadeEstado"
        );


    if (cidadeEstado) {

        cidadeEstado.addEventListener(
            "change",
            function () {
                // reservado para futuras melhorias
            }
        );
    }


    // --------------------------------------------------------
    // CADASTRO DE BAIRRO
    // --------------------------------------------------------

    const bairroCidade =
        document.getElementById(
            "bairroCidade"
        );


    if (bairroCidade) {

        bairroCidade.addEventListener(
            "change",
            function () {
                // reservado para futuras melhorias
            }
        );
    }
}


// ============================================================
// MODAIS
// ============================================================

function abrirModal(
    id
) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {

        console.warn(
            `Modal ${id} não encontrado.`
        );

        return;
    }


    modal.classList.add(
        "ativo"
    );


    modal.style.display =
        "flex";
}


function fecharModal(
    id
) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "ativo"
    );


    modal.style.display =
        "none";
}


// ============================================================
// NOVA CLÍNICA
// ============================================================

function novaClinica() {

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

        container.innerHTML = "";

        adicionarLinhaEspecialidade();
    }


    popularRegioes(
        "clinicaRegiao"
    );


    const estado =
        document.getElementById(
            "clinicaEstado"
        );


    const cidade =
        document.getElementById(
            "clinicaCidade"
        );


    const bairro =
        document.getElementById(
            "clinicaBairro"
        );


    if (estado) {

        estado.innerHTML = `
            <option value="">
                Selecione o estado
            </option>
        `;
    }


    if (cidade) {

        cidade.innerHTML = `
            <option value="">
                Selecione a cidade
            </option>
        `;
    }


    if (bairro) {

        bairro.innerHTML = `
            <option value="">
                Selecione o bairro
            </option>
        `;
    }


    abrirModal(
        "modalClinica"
    );
}


// ============================================================
// NOVA ESPECIALIDADE
// ============================================================

function novaEspecialidade() {

    especialidadeEditandoId =
        null;


    const form =
        document.getElementById(
            "formEspecialidade"
        );


    if (form) {
        form.reset();
    }


    const ativo =
        document.getElementById(
            "especialidadeAtivo"
        );


    if (ativo) {
        ativo.checked =
            true;
    }


    abrirModal(
        "modalEspecialidade"
    );
}


// ============================================================
// NOVA REGIÃO
// ============================================================

function novaRegiao() {

    regiaoEditandoId =
        null;


    const form =
        document.getElementById(
            "formRegiao"
        );


    if (form) {
        form.reset();
    }


    abrirModal(
        "modalRegiao"
    );
}


// ============================================================
// NOVO ESTADO
// ============================================================

async function novoEstado() {

    estadoEditandoId =
        null;


    const form =
        document.getElementById(
            "formEstado"
        );


    if (form) {
        form.reset();
    }


    await popularRegioes(
        "estadoRegiao"
    );


    abrirModal(
        "modalEstado"
    );
}


// ============================================================
// NOVA CIDADE
// ============================================================

async function novaCidade() {

    cidadeEditandoId =
        null;


    const form =
        document.getElementById(
            "formCidade"
        );


    if (form) {
        form.reset();
    }


    await popularEstados(
        "cidadeEstado"
    );


    abrirModal(
        "modalCidade"
    );
}


// ============================================================
// NOVO BAIRRO
// ============================================================

async function novoBairro() {

    bairroEditandoId =
        null;


    const form =
        document.getElementById(
            "formBairro"
        );


    if (form) {
        form.reset();
    }


    await popularCidades(
        "bairroCidade"
    );


    abrirModal(
        "modalBairro"
    );
}


// ============================================================
// FECHAR MODAIS CLICANDO FORA
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList &&
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.style.display =
                "none";

            event.target.classList.remove(
                "ativo"
            );
        }
    }
);


// ============================================================
// BOTÕES FECHAR MODAL
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const botao =
            event.target.closest(
                "[data-fechar-modal]"
            );


        if (!botao) {
            return;
        }


        const modalId =
            botao.dataset.fecharModal;


        fecharModal(
            modalId
        );
    }
);


// ============================================================
// TEMA
// ============================================================

function alternarTema() {

    document.body.classList.toggle(
        "tema-escuro"
    );


    const escuro =
        document.body.classList.contains(
            "tema-escuro"
        );


    localStorage.setItem(
        "temaAdmin",
        escuro
            ? "escuro"
            : "claro"
    );
}


// ============================================================
// RESTAURAR TEMA
// ============================================================

(function restaurarTema() {

    const tema =
        localStorage.getItem(
            "temaAdmin"
        );


    if (
        tema === "escuro"
    ) {

        document.body.classList.add(
            "tema-escuro"
        );
    }
})();


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function obterValor(
    id
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {
        return "";
    }


    return String(
        elemento.value ?? ""
    ).trim();
}


function preencherCampo(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {
        return;
    }


    elemento.value =
        valor ?? "";
}


function selecionarValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {
        return;
    }


    elemento.value =
        valor ?? "";
}


function escaparHTML(
    valor
) {

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
// EXPOR FUNÇÕES PARA O HTML
// ============================================================

window.mostrarPagina =
    mostrarPagina;

window.editarClinica =
    editarClinica;

window.excluirClinica =
    excluirClinica;

window.novaClinica =
    novaClinica;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.novaEspecialidade =
    novaEspecialidade;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.novaRegiao =
    novaRegiao;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;

window.novoEstado =
    novoEstado;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;

window.novaCidade =
    novaCidade;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;

window.novoBairro =
    novoBairro;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.abrirModal =
    abrirModal;

window.fecharModal =
    fecharModal;

window.salvarClinica =
    salvarClinica;

window.salvarEspecialidadesClinica =
    salvarEspecialidadesClinica;

window.salvarEspecialidade =
    salvarEspecialidade;

window.salvarRegiao =
    salvarRegiao;

window.salvarEstado =
    salvarEstado;

window.salvarCidade =
    salvarCidade;

window.salvarBairro =
    salvarBairro;

console.log(
    "admin.js finalizado."
);
