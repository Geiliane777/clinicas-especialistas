// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// REDE ESPECIALISTAS
// ======================================

console.log("admin.js carregado");


// ======================================
// CONFIGURAÇÕES
// ======================================

const REDES = {
    ESPECIALISTAS: "Especialistas",
    SINDILEGIS: "Sindilegis"
};


// ======================================
// VARIÁVEIS GLOBAIS
// ======================================

let regioes = [];
let estados = [];
let cidades = [];
let bairros = [];
let especialidades = [];
let clinicas = [];

let clinicaEditandoId = null;


// ======================================
// VERIFICAR LOGIN
// ======================================

function verificarLogin() {

    const logado =
        localStorage.getItem("adminLogado");

    if (logado !== "true") {

        window.location.href = "login.html";

        return false;
    }

    return true;
}


// ======================================
// LOGOUT
// ======================================

function sairAdmin() {

    localStorage.removeItem("adminLogado");

    window.location.href = "login.html";
}


// ======================================
// NORMALIZAR REDE
// ======================================

function normalizarRede(valor) {

    const v =
        String(valor ?? "")
            .trim()
            .toLowerCase();

    if (
        v === "sindilegis" ||
        v === "rede sindilegis"
    ) {

        return REDES.SINDILEGIS;
    }

    if (
        v === "especialista" ||
        v === "especialistas" ||
        v === "rede especialistas"
    ) {

        return REDES.ESPECIALISTAS;
    }

    return "";
}


// ======================================
// ESCAPAR HTML
// ======================================

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";
    }

    const div =
        document.createElement("div");

    div.textContent = valor;

    return div.innerHTML;
}


// ======================================
// MOSTRAR MENSAGEM
// ======================================

function mostrarMensagem(
    mensagem,
    tipo = "sucesso"
) {

    console.log(
        `[${tipo}]`,
        mensagem
    );

    if (typeof window.mostrarToast === "function") {

        window.mostrarToast(
            mensagem,
            tipo
        );

        return;
    }

    alert(mensagem);
}


// ======================================
// ELEMENTO
// ======================================

function elemento(id) {

    return document.getElementById(id);
}


// ======================================
// PÁGINAS
// ======================================

const TITULOS_PAGINA = {

    dashboard:
        "Dashboard",

    regioes:
        "Regiões",

    estados:
        "Estados",

    cidades:
        "Cidades",

    bairros:
        "Bairros",

    especialidades:
        "Especialidades",

    clinicas:
        "Clínicas"

};


// ======================================
// MOSTRAR PÁGINA
// ======================================

function mostrarPagina(nome) {

    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove(
                "ativa"
            );

        });


    const pagina =
        document.getElementById(
            `pagina-${nome}`
        );


    if (pagina) {

        pagina.classList.add(
            "ativa"
        );

    }


    document
        .querySelectorAll(".item-menu")
        .forEach(item => {

            item.classList.remove(
                "ativo"
            );

        });


    const titulo =
        elemento("tituloPagina");


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nome] ||
            "Painel Administrativo";

    }


    const carregador =
        CARREGADORES_PAGINA[nome];


    if (
        typeof carregador ===
        "function"
    ) {

        carregador();

    }

}


// ======================================
// CARREGADORES
// ======================================

const CARREGADORES_PAGINA = {

    dashboard:
        carregarDashboard,

    regioes:
        listarRegioes,

    estados:
        listarEstados,

    cidades:
        listarCidades,

    bairros:
        listarBairros,

    especialidades:
        listarEspecialidades,

    clinicas:
        listarClinicas

};


// ======================================
// REGIÕES
// ======================================

async function carregarRegioes() {

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


        regioes =
            data || [];


        console.log(
            "Regiões:",
            regioes
        );


        popularSelect(
            "selectRegiao",
            regioes,
            "Selecione a Região"
        );


        popularSelect(
            "filtroRegiao",
            regioes,
            "Todas as Regiões"
        );


    } catch (error) {

        console.error(
            "Erro ao carregar regiões:",
            error
        );

    }

}


// ======================================
// POPULAR SELECT
// ======================================

function popularSelect(
    id,
    dados,
    placeholder
) {

    const select =
        elemento(id);

    if (!select) return;


    select.innerHTML = `
        <option value="">
            ${placeholder}
        </option>
    `;


    dados.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparHTML(item.nome)}
            </option>
        `;

    });

}


// ======================================
// LISTAR REGIÕES
// ======================================

async function listarRegioes() {

    const tabela =
        elemento("listaRegioes");

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


        regioes =
            data || [];


        if (!tabela) return;


        if (
            regioes.length === 0
        ) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="3">
                        Nenhuma região cadastrada.
                    </td>
                </tr>
            `;

            return;

        }


        tabela.innerHTML =
            regioes
                .map(regiao => `
                    <tr>

                        <td>
                            ${regiao.id}
                        </td>

                        <td>
                            ${escaparHTML(
                                regiao.nome
                            )}
                        </td>

                        <td>

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

                        </td>

                    </tr>
                `)
                .join("");


    } catch (error) {

        console.error(
            "Erro ao listar regiões:",
            error
        );

        if (tabela) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="3">
                        Erro ao carregar regiões.
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================
// ADICIONAR REGIÃO
// ======================================

async function adicionarRegiao() {

    const input =
        elemento("nomeRegiao");

    if (!input) return;


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
            error
        } = await supabaseClient
            .from("regioes")
            .insert({
                nome: nome
            });


        if (error) {

            throw error;

        }


        input.value = "";


        mostrarMensagem(
            "Região cadastrada com sucesso."
        );


        await listarRegioes();
        await carregarRegioes();


    } catch (error) {

        console.error(
            "Erro ao adicionar região:",
            error
        );

        mostrarMensagem(
            "Erro ao cadastrar região.",
            "erro"
        );

    }

}


// ======================================
// EDITAR REGIÃO
// ======================================

async function editarRegiao(id) {

    const regiao =
        regioes.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!regiao) return;


    const novoNome =
        prompt(
            "Digite o novo nome da região:",
            regiao.nome
        );


    if (
        novoNome === null
    ) return;


    const nome =
        novoNome.trim();


    if (!nome) {

        mostrarMensagem(
            "O nome não pode ficar vazio.",
            "erro"
        );

        return;

    }


    try {

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


        mostrarMensagem(
            "Região atualizada."
        );


        await listarRegioes();
        await carregarRegioes();


    } catch (error) {

        console.error(
            "Erro ao editar região:",
            error
        );

        mostrarMensagem(
            "Erro ao editar região.",
            "erro"
        );

    }

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta região?"
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
            "Região excluída."
        );


        await listarRegioes();
        await carregarRegioes();


    } catch (error) {

        console.error(
            "Erro ao excluir região:",
            error
        );

        mostrarMensagem(
            "Não foi possível excluir a região. Verifique se existem estados vinculados.",
            "erro"
        );

    }

}


// ======================================
// ESTADOS
// ======================================

async function listarEstados() {

    const tabela =
        elemento("listaEstados");

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
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        estados =
            data || [];


        if (!tabela) return;


        if (
            estados.length === 0
        ) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="4">
                        Nenhum estado cadastrado.
                    </td>
                </tr>
            `;

            return;

        }


        tabela.innerHTML =
            estados
                .map(estado => `

                    <tr>

                        <td>
                            ${estado.id}
                        </td>

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

                        </td>

                    </tr>

                `)
                .join("");


    } catch (error) {

        console.error(
            "Erro ao listar estados:",
            error
        );

    }

}


// ======================================
// ADICIONAR ESTADO
// ======================================

async function adicionarEstado() {

    const nomeInput =
        elemento("nomeEstado");

    const regiaoSelect =
        elemento("selectRegiao");


    if (
        !nomeInput ||
        !regiaoSelect
    ) return;


    const nome =
        nomeInput.value.trim();

    const regiaoId =
        regiaoSelect.value;


    if (!nome) {

        mostrarMensagem(
            "Informe o nome do estado.",
            "erro"
        );

        return;

    }


    if (!regiaoId) {

        mostrarMensagem(
            "Selecione uma região.",
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

                nome: nome,

                regiao_id:
                    regiaoId

            });


        if (error) {

            throw error;

        }


        nomeInput.value = "";
        regiaoSelect.value = "";


        mostrarMensagem(
            "Estado cadastrado com sucesso."
        );


        await listarEstados();


    } catch (error) {

        console.error(
            "Erro ao adicionar estado:",
            error
        );

        mostrarMensagem(
            "Erro ao cadastrar estado.",
            "erro"
        );

    }

}


// ======================================
// EDITAR ESTADO
// ======================================

async function editarEstado(id) {

    const estado =
        estados.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!estado) return;


    const nome =
        prompt(
            "Nome do estado:",
            estado.nome
        );


    if (nome === null) return;


    const novoNome =
        nome.trim();


    if (!novoNome) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("estados")
            .update({
                nome: novoNome
            })
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        mostrarMensagem(
            "Estado atualizado."
        );


        await listarEstados();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Erro ao atualizar estado.",
            "erro"
        );

    }

}


// ======================================
// EXCLUIR ESTADO
// ======================================

async function excluirEstado(id) {

    if (
        !confirm(
            "Deseja realmente excluir este estado?"
        )
    ) return;


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
            "Estado excluído."
        );


        await listarEstados();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Não foi possível excluir o estado.",
            "erro"
        );

    }

}


// ======================================
// CIDADES
// ======================================

async function listarCidades() {

    const tabela =
        elemento("listaCidades");


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
            .order(
                "nome"
            );


        if (error) {
            throw error;
        }


        cidades =
            data || [];


        if (!tabela) return;


        tabela.innerHTML =
            cidades.length
                ? cidades
                    .map(cidade => `

                        <tr>

                            <td>
                                ${cidade.id}
                            </td>

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

                            </td>

                        </tr>

                    `)
                    .join("")
                : `
                    <tr>
                        <td colspan="4">
                            Nenhuma cidade cadastrada.
                        </td>
                    </tr>
                `;


    } catch (error) {

        console.error(
            "Erro ao listar cidades:",
            error
        );

    }

}


// ======================================
// ADICIONAR CIDADE
// ======================================

async function adicionarCidade() {

    const nomeInput =
        elemento("nomeCidade");

    const estadoSelect =
        elemento("selectEstado");


    if (
        !nomeInput ||
        !estadoSelect
    ) return;


    const nome =
        nomeInput.value.trim();

    const estadoId =
        estadoSelect.value;


    if (!nome) {

        mostrarMensagem(
            "Informe o nome da cidade.",
            "erro"
        );

        return;

    }


    if (!estadoId) {

        mostrarMensagem(
            "Selecione um estado.",
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

                nome: nome,

                estado_id:
                    estadoId

            });


        if (error) {
            throw error;
        }


        nomeInput.value = "";
        estadoSelect.value = "";


        mostrarMensagem(
            "Cidade cadastrada com sucesso."
        );


        await listarCidades();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Erro ao cadastrar cidade.",
            "erro"
        );

    }

}


// ======================================
// EDITAR CIDADE
// ======================================

async function editarCidade(id) {

    const cidade =
        cidades.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!cidade) return;


    const nome =
        prompt(
            "Nome da cidade:",
            cidade.nome
        );


    if (nome === null) return;


    const novoNome =
        nome.trim();


    if (!novoNome) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("cidades")
            .update({
                nome: novoNome
            })
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        mostrarMensagem(
            "Cidade atualizada."
        );


        await listarCidades();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Erro ao atualizar cidade.",
            "erro"
        );

    }

}


// ======================================
// EXCLUIR CIDADE
// ======================================

async function excluirCidade(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta cidade?"
        )
    ) return;


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
            "Cidade excluída."
        );


        await listarCidades();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Não foi possível excluir a cidade.",
            "erro"
        );

    }

}


// ======================================
// BAIRROS
// ======================================

async function listarBairros() {

    const tabela =
        elemento("listaBairros");


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

                cidades(
                    id,
                    nome,

                    estados(
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


        bairros =
            data || [];


        if (!tabela) return;


        tabela.innerHTML =
            bairros.length
                ? bairros
                    .map(bairro => `

                        <tr>

                            <td>
                                ${bairro.id}
                            </td>

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

                            </td>

                        </tr>

                    `)
                    .join("")
                : `
                    <tr>
                        <td colspan="4">
                            Nenhum bairro cadastrado.
                        </td>
                    </tr>
                `;


    } catch (error) {

        console.error(
            "Erro ao listar bairros:",
            error
        );

    }

}


// ======================================
// ADICIONAR BAIRRO
// ======================================

async function adicionarBairro() {

    const nomeInput =
        elemento("nomeBairro");

    const cidadeSelect =
        elemento("selectCidade");


    if (
        !nomeInput ||
        !cidadeSelect
    ) return;


    const nome =
        nomeInput.value.trim();

    const cidadeId =
        cidadeSelect.value;


    if (!nome) {

        mostrarMensagem(
            "Informe o nome do bairro.",
            "erro"
        );

        return;

    }


    if (!cidadeId) {

        mostrarMensagem(
            "Selecione uma cidade.",
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

                nome: nome,

                cidade_id:
                    cidadeId

            });


        if (error) {
            throw error;
        }


        nomeInput.value = "";
        cidadeSelect.value = "";


        mostrarMensagem(
            "Bairro cadastrado com sucesso."
        );


        await listarBairros();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Erro ao cadastrar bairro.",
            "erro"
        );

    }

}


// ======================================
// EDITAR BAIRRO
// ======================================

async function editarBairro(id) {

    const bairro =
        bairros.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!bairro) return;


    const nome =
        prompt(
            "Nome do bairro:",
            bairro.nome
        );


    if (nome === null) return;


    const novoNome =
        nome.trim();


    if (!novoNome) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("bairros")
            .update({
                nome: novoNome
            })
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        mostrarMensagem(
            "Bairro atualizado."
        );


        await listarBairros();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Erro ao atualizar bairro.",
            "erro"
        );

    }

}


// ======================================
// EXCLUIR BAIRRO
// ======================================

async function excluirBairro(id) {

    if (
        !confirm(
            "Deseja realmente excluir este bairro?"
        )
    ) return;


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
            "Bairro excluído."
        );


        await listarBairros();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Não foi possível excluir o bairro.",
            "erro"
        );

    }

}


// ======================================
// ESPECIALIDADES
// ======================================

async function carregarEspecialidadesAdmin() {

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


        especialidades =
            data || [];


        console.log(
            "Especialidades carregadas:",
            especialidades
        );


        popularSelectEspecialidades();


    } catch (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

    }

}


// ======================================
// POPULAR ESPECIALIDADES
// ======================================

function popularSelectEspecialidades() {

    document
        .querySelectorAll(
            ".select-especialidade"
        )
        .forEach(select => {

            const valorAtual =
                select.value;


            select.innerHTML = `
                <option value="">
                    Selecione a especialidade
                </option>
            `;


            especialidades.forEach(item => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    item.id;

                option.textContent =
                    item.nome;


                if (
                    String(item.id) ===
                    String(valorAtual)
                ) {

                    option.selected =
                        true;

                }


                select.appendChild(
                    option
                );

            });

        });

}


// ======================================
// LISTAR ESPECIALIDADES
// ======================================

async function listarEspecialidades() {

    const tabela =
        elemento(
            "listaEspecialidades"
        );


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


        especialidades =
            data || [];


        if (!tabela) return;


        tabela.innerHTML =
            especialidades.length
                ? especialidades
                    .map(item => `

                        <tr>

                            <td>
                                ${item.id}
                            </td>

                            <td>
                                ${escaparHTML(
                                    item.nome
                                )}
                            </td>

                            <td>

                                <button
                                    class="btn-editar"
                                    onclick="editarEspecialidade(${item.id})"
                                >
                                    Editar
                                </button>

                                <button
                                    class="btn-excluir"
                                    onclick="excluirEspecialidade(${item.id})"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>

                    `)
                    .join("")
                : `
                    <tr>
                        <td colspan="3">
                            Nenhuma especialidade cadastrada.
                        </td>
                    </tr>
                `;


    } catch (error) {

        console.error(
            "Erro ao listar especialidades:",
            error
        );

    }

}


// ======================================
// ADICIONAR ESPECIALIDADE
// ======================================

async function adicionarEspecialidade() {

    const input =
        elemento(
            "nomeEspecialidade"
        );


    if (!input) return;


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
            error
        } = await supabaseClient
            .from("especialidades")
            .insert({
                nome: nome
            });


        if (error) {
            throw error;
        }


        input.value = "";


        mostrarMensagem(
            "Especialidade cadastrada."
        );


        await listarEspecialidades();
        await carregarEspecialidadesAdmin();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Erro ao cadastrar especialidade.",
            "erro"
        );

    }

}


// ======================================
// EDITAR ESPECIALIDADE
// ======================================

async function editarEspecialidade(id) {

    const item =
        especialidades.find(
            especialidade =>
                String(
                    especialidade.id
                ) ===
                String(id)
        );


    if (!item) return;


    const nome =
        prompt(
            "Nome da especialidade:",
            item.nome
        );


    if (nome === null) return;


    const novoNome =
        nome.trim();


    if (!novoNome) return;


    try {

        const {
            error
        } = await supabaseClient
            .from("especialidades")
            .update({
                nome: novoNome
            })
            .eq(
                "id",
                id
            );


        if (error) {
            throw error;
        }


        mostrarMensagem(
            "Especialidade atualizada."
        );


        await listarEspecialidades();
        await carregarEspecialidadesAdmin();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Erro ao atualizar especialidade.",
            "erro"
        );

    }

}


// ======================================
// EXCLUIR ESPECIALIDADE
// ======================================

async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta especialidade?"
        )
    ) return;


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
            "Especialidade excluída."
        );


        await listarEspecialidades();
        await carregarEspecialidadesAdmin();


    } catch (error) {

        console.error(
            error
        );

        mostrarMensagem(
            "Não foi possível excluir a especialidade. Verifique se ela está vinculada a alguma clínica.",
            "erro"
        );

    }

}


// ======================================
// CLÍNICAS
// ======================================

async function listarClinicas() {

    const tabela =
        elemento(
            "listaClinicas"
        );


    try {

        // IMPORTANTE:
        // Não fazer JOIN com
        // clinica_especialidades aqui.
        //
        // Isso evita clínicas duplicadas.
        //
        // Também não usar created_at,
        // pois essa coluna não existe.

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
            .order(
                "id",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        clinicas =
            data || [];


        if (!tabela) return;


        if (
            clinicas.length === 0
        ) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="7">
                        Nenhuma clínica cadastrada.
                    </td>
                </tr>
            `;

            return;

        }


        tabela.innerHTML =
            clinicas
                .map(clinica => {

                    const bairro =
                        clinica.bairros;

                    const cidade =
                        bairro?.cidades;

                    const estado =
                        cidade?.estados;


                    const localizacao =
                        [
                            bairro?.nome,
                            cidade?.nome,
                            estado?.nome
                        ]
                            .filter(Boolean)
                            .join(" - ");


                    return `

                        <tr>

                            <td>
                                ${clinica.id}
                            </td>

                            <td>
                                ${escaparHTML(
                                    clinica.nome
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    clinica.endereco ||
                                    "Não informado"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    clinica.telefone ||
                                    "Não informado"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    localizacao ||
                                    "Não informado"
                                )}
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

                            </td>

                        </tr>

                    `;

                })
                .join("");


        // Carrega especialidades
        // separadamente.

        await carregarEspecialidadesDasClinicas();


    } catch (error) {

        console.error(
            "Erro ao carregar registros:",
            error
        );


        if (tabela) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="7">
                        Erro ao carregar clínicas.
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================
// CARREGAR ESPECIALIDADES DAS CLÍNICAS
// ======================================

async function carregarEspecialidadesDasClinicas() {

    if (
        clinicas.length === 0
    ) return;


    const ids =
        clinicas.map(
            clinica =>
                clinica.id
        );


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
                ativo,

                especialidades(
                    id,
                    nome
                )
            `)
            .in(
                "clinica_id",
                ids
            );


        if (error) {
            throw error;
        }


        const porClinica =
            new Map();


        data?.forEach(item => {

            if (!item.ativo) return;


            if (
                !porClinica.has(
                    item.clinica_id
                )
            ) {

                porClinica.set(
                    item.clinica_id,
                    []
                );

            }


            porClinica
                .get(item.clinica_id)
                .push(item);

        });


        // Mostra especialidades
        // caso exista uma área própria
        // no HTML.

        clinicas.forEach(clinica => {

            const container =
                document.querySelector(
                    `[data-especialidades-clinica="${clinica.id}"]`
                );


            if (!container) return;


            const itens =
                porClinica.get(
                    clinica.id
                ) || [];


            container.innerHTML =
                itens.length
                    ? itens
                        .map(item => `
                            <span class="tag">
                                ${escaparHTML(
                                    item.especialidades?.nome ||
                                    ""
                                )}
                                -
                                ${escaparHTML(
                                    normalizarRede(
                                        item.rede
                                    )
                                )}
                            </span>
                        `)
                        .join("")
                    : `
                        <span class="tag">
                            Nenhuma
                        </span>
                    `;

        });


    } catch (error) {

        console.error(
            "Erro ao carregar especialidades das clínicas:",
            error
        );

    }

}


// ======================================
// ABRIR MODAL CLÍNICA
// ======================================

async function abrirModalClinica(
    clinicaId = null
) {

    clinicaEditandoId =
        clinicaId;


    const modal =
        elemento(
            "modalClinica"
        );


    if (!modal) {

        console.error(
            "Modal de clínica não encontrado."
        );

        return;

    }


    // ==================================
    // LIMPAR FORMULÁRIO
    // ==================================

    limparFormularioClinica();


    // ==================================
    // CARREGAR LOCALIDADES
    // ==================================

    await carregarDadosParaClinica();


    // ==================================
    // NOVA CLÍNICA
    // ==================================

    if (!clinicaId) {

        modal.classList.add(
            "ativo"
        );

        return;

    }


    // ==================================
    // EDITAR CLÍNICA
    // ==================================

    const clinica =
        clinicas.find(
            item =>
                String(item.id) ===
                String(clinicaId)
        );


    if (!clinica) {

        mostrarMensagem(
            "Clínica não encontrada.",
            "erro"
        );

        return;

    }


    preencherFormularioClinica(
        clinica
    );


    await carregarEspecialidadesClinicaNoModal(
        clinicaId
    );


    modal.classList.add(
        "ativo"
    );

}


// ======================================
// NOVA CLÍNICA
// ======================================

function novaClinica() {

    abrirModalClinica();

}


// ======================================
// EDITAR CLÍNICA
// ======================================

function editarClinica(id) {

    abrirModalClinica(id);

}


// ======================================
// FECHAR MODAL
// ======================================

function fecharModalClinica() {

    const modal =
        elemento(
            "modalClinica"
        );

    if (!modal) return;


    modal.classList.remove(
        "ativo"
    );


    clinicaEditandoId =
        null;

}


// ======================================
// LIMPAR FORMULÁRIO CLÍNICA
// ======================================

function limparFormularioClinica() {

    const campos = [
        "nomeClinica",
        "enderecoClinica",
        "telefoneClinica"
    ];


    campos.forEach(id => {

        const campo =
            elemento(id);

        if (campo) {

            campo.value = "";

        }

    });


    const bairro =
        elemento(
            "selectBairroClinica"
        );


    if (bairro) {

        bairro.innerHTML = `
            <option value="">
                Selecione o bairro
            </option>
        `;

    }


    const lista =
        elemento(
            "listaEspecialidadesClinica"
        );


    if (lista) {

        lista.innerHTML = "";

    }


    const ativo =
        elemento(
            "clinicaAtiva"
        );


    if (ativo) {

        ativo.checked = true;

    }

}


// ======================================
// CARREGAR DADOS PARA CLÍNICA
// ======================================

async function carregarDadosParaClinica() {

    await carregarRegioes();

    await listarEstadosParaClinica();

    await listarCidadesParaClinica();

    await listarBairrosParaClinica();

    await carregarEspecialidadesAdmin();

}


// ======================================
// PREENCHER FORMULÁRIO
// ======================================

function preencherFormularioClinica(
    clinica
) {

    const nome =
        elemento(
            "nomeClinica"
        );

    const endereco =
        elemento(
            "enderecoClinica"
        );

    const telefone =
        elemento(
            "telefoneClinica"
        );

    const ativo =
        elemento(
            "clinicaAtiva"
        );


    if (nome) {

        nome.value =
            clinica.nome || "";

    }


    if (endereco) {

        endereco.value =
            clinica.endereco || "";

    }


    if (telefone) {

        telefone.value =
            clinica.telefone || "";

    }


    if (ativo) {

        ativo.checked =
            clinica.ativo !== false;

    }


    // Selecionar bairro
    const bairro =
        elemento(
            "selectBairroClinica"
        );


    if (bairro) {

        bairro.value =
            clinica.bairro_id || "";

    }

}


// ======================================
// ESTADOS PARA CLÍNICA
// ======================================

async function listarEstadosParaClinica(
    regiaoId = ""
) {

    const select =
        elemento(
            "selectEstadoClinica"
        );


    if (!select) return;


    select.innerHTML = `
        <option value="">
            Selecione o estado
        </option>
    `;


    let consulta =
        supabaseClient
            .from("estados")
            .select(
                "id, nome, regiao_id"
            )
            .order(
                "nome"
            );


    if (regiaoId) {

        consulta =
            consulta.eq(
                "regiao_id",
                regiaoId
            );

    }


    const {
        data,
        error
    } = await consulta;


    if (error) {

        console.error(
            error
        );

        return;

    }


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparHTML(
                    item.nome
                )}
            </option>
        `;

    });

}


// ======================================
// CIDADES PARA CLÍNICA
// ======================================

async function listarCidadesParaClinica(
    estadoId = ""
) {

    const select =
        elemento(
            "selectCidadeClinica"
        );


    if (!select) return;


    select.innerHTML = `
        <option value="">
            Selecione a cidade
        </option>
    `;


    let consulta =
        supabaseClient
            .from("cidades")
            .select(
                "id, nome, estado_id"
            )
            .order(
                "nome"
            );


    if (estadoId) {

        consulta =
            consulta.eq(
                "estado_id",
                estadoId
            );

    }


    const {
        data,
        error
    } = await consulta;


    if (error) {

        console.error(
            error
        );

        return;

    }


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparHTML(
                    item.nome
                )}
            </option>
        `;

    });

}


// ======================================
// BAIRROS PARA CLÍNICA
// ======================================

async function listarBairrosParaClinica(
    cidadeId = ""
) {

    const select =
        elemento(
            "selectBairroClinica"
        );


    if (!select) return;


    select.innerHTML = `
        <option value="">
            Selecione o bairro
        </option>
    `;


    let consulta =
        supabaseClient
            .from("bairros")
            .select(
                "id, nome, cidade_id"
            )
            .order(
                "nome"
            );


    if (cidadeId) {

        consulta =
            consulta.eq(
                "cidade_id",
                cidadeId
            );

    }


    const {
        data,
        error
    } = await consulta;


    if (error) {

        console.error(
            error
        );

        return;

    }


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparHTML(
                    item.nome
                )}
            </option>
        `;

    });

}


// ======================================
// CARREGAR ESPECIALIDADES NO MODAL
// ======================================

async function carregarEspecialidadesClinicaNoModal(
    clinicaId
) {

    const lista =
        elemento(
            "listaEspecialidadesClinica"
        );


    if (!lista) return;


    lista.innerHTML = "";


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .select(`
                especialidade_id,
                rede,
                ativo,

                especialidades(
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

            return;

        }


        data.forEach(item => {

            adicionarLinhaEspecialidade(
                item.especialidade_id,
                item.rede
            );

        });


    } catch (error) {

        console.error(
            "Erro ao carregar especialidades da clínica:",
            error
        );

    }

}


// ======================================
// ADICIONAR LINHA DE ESPECIALIDADE
// ======================================

function adicionarLinhaEspecialidade(
    especialidadeId = "",
    rede = ""
) {

    const lista =
        elemento(
            "listaEspecialidadesClinica"
        );


    if (!lista) return;


    const linha =
        document.createElement(
            "div"
        );


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


    const selectEspecialidade =
        linha.querySelector(
            ".select-especialidade"
        );


    const selectRede =
        linha.querySelector(
            ".select-rede-especialidade"
        );


    // ==================================
    // POPULAR ESPECIALIDADES
    // ==================================

    especialidades.forEach(item => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.id;


        option.textContent =
            item.nome;


        if (
            String(item.id) ===
            String(especialidadeId)
        ) {

            option.selected =
                true;

        }


        selectEspecialidade.appendChild(
            option
        );

    });


    // ==================================
    // REDE
    // ==================================

    selectRede.value =
        normalizarRede(rede);


    // ==================================
    // REMOVER
    // ==================================

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


    lista.appendChild(
        linha
    );

}


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica() {

    const nome =
        elemento(
            "nomeClinica"
        )?.value.trim();


    const endereco =
        elemento(
            "enderecoClinica"
        )?.value.trim();


    const telefone =
        elemento(
            "telefoneClinica"
        )?.value.trim();


    const bairroId =
        elemento(
            "selectBairroClinica"
        )?.value;


    const ativo =
        elemento(
            "clinicaAtiva"
        )?.checked ?? true;


    if (!nome) {

        mostrarMensagem(
            "Informe o nome da clínica.",
            "erro"
        );

        return;

    }


    if (!bairroId) {

        mostrarMensagem(
            "Selecione o bairro.",
            "erro"
        );

        return;

    }


    try {

        let clinicaId =
            clinicaEditandoId;


        // ==================================
        // ATUALIZAR
        // ==================================

        if (clinicaId) {

            const {
                error
            } = await supabaseClient
                .from("clinicas")
                .update({

                    nome: nome,

                    endereco:
                        endereco || null,

                    telefone:
                        telefone || null,

                    bairro_id:
                        bairroId,

                    ativo:
                        ativo

                })
                .eq(
                    "id",
                    clinicaId
                );


            if (error) {
                throw error;
            }


        } else {

            // ==================================
            // INSERIR
            // ==================================

            const {
                data,
                error
            } = await supabaseClient
                .from("clinicas")
                .insert({

                    nome: nome,

                    endereco:
                        endereco || null,

                    telefone:
                        telefone || null,

                    bairro_id:
                        bairroId,

                    ativo:
                        ativo

                })
                .select(
                    "id"
                )
                .single();


            if (error) {
                throw error;
            }


            clinicaId =
                data.id;

        }


        // ==================================
        // SALVAR ESPECIALIDADES
        // ==================================

        const sucesso =
            await salvarEspecialidadesClinica(
                clinicaId
            );


        if (!sucesso) {

            return;

        }


        mostrarMensagem(
            clinicaEditandoId
                ? "Clínica atualizada com sucesso."
                : "Clínica cadastrada com sucesso."
        );


        fecharModalClinica();


        await listarClinicas();


        // Limpar ID
        clinicaEditandoId =
            null;


    } catch (error) {

        console.error(
            "Erro ao salvar clínica:",
            error
        );


        mostrarMensagem(
            "Erro ao salvar clínica.",
            "erro"
        );

    }

}


// ======================================
// SALVAR ESPECIALIDADES DA CLÍNICA
// ======================================

async function salvarEspecialidadesClinica(
    clinicaId
) {

    const lista =
        elemento(
            "listaEspecialidadesClinica"
        );


    if (!lista) {

        return true;

    }


    const linhas =
        lista.querySelectorAll(
            ".linha-especialidade"
        );


    const registros = [];

    const chaves =
        new Set();


    // ==================================
    // LER LINHAS
    // ==================================

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


        if (!especialidadeId) {

            mostrarMensagem(
                "Selecione uma especialidade em todas as linhas.",
                "erro"
            );

            return false;

        }


        if (!rede) {

            mostrarMensagem(
                "Selecione a rede em todas as linhas.",
                "erro"
            );

            return false;

        }


        const chave =
            `${especialidadeId}-${rede}`;


        // Não permite duplicar
        // a mesma especialidade
        // na mesma rede.

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
                especialidadeId,

            rede:
                rede,

            ativo:
                true

        });

    }


    try {

        // ==================================
        // BUSCAR REGISTROS ATUAIS
        // ==================================

        const {
            data: atuais,
            error: erroBusca
        } = await supabaseClient
            .from(
                "clinica_especialidades"
            )
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


        if (erroBusca) {

            throw erroBusca;

        }


        // ==================================
        // REMOVER ASSOCIAÇÕES ANTIGAS
        // ==================================

        for (
            const atual of atuais || []
        ) {

            const redeAtual =
                normalizarRede(
                    atual.rede
                );


            const chaveAtual =
                `${atual.especialidade_id}-${redeAtual}`;


            if (
                !chaves.has(
                    chaveAtual
                )
            ) {

                const {
                    error
                } = await supabaseClient
                    .from(
                        "clinica_especialidades"
                    )
                    .delete()
                    .eq(
                        "clinica_id",
                        clinicaId
                    )
                    .eq(
                        "especialidade_id",
                        atual.especialidade_id
                    )
                    .eq(
                        "rede",
                        atual.rede
                    );


                if (error) {

                    throw error;

                }

            }

        }


        // ==================================
        // INSERIR / ATUALIZAR
        // ==================================

        if (
            registros.length > 0
        ) {

            const {
                error
            } = await supabaseClient
                .from(
                    "clinica_especialidades"
                )
                .upsert(
                    registros,
                    {
                        onConflict:
                            "clinica_id,especialidade_id,rede"
                    }
                );


            if (error) {

                throw error;

            }

        }


        return true;


    } catch (error) {

        console.error(
            "Erro ao salvar especialidades:",
            error
        );


        mostrarMensagem(
            "Erro ao salvar as especialidades da clínica.",
            "erro"
        );


        return false;

    }

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta clínica?"
        )
    ) {

        return;

    }


    try {

        // Primeiro remove
        // as associações.

        const {
            error: erroEspecialidades
        } = await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .delete()
            .eq(
                "clinica_id",
                id
            );


        if (
            erroEspecialidades
        ) {

            throw erroEspecialidades;

        }


        // Depois remove a clínica.

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
            "Clínica excluída com sucesso."
        );


        await listarClinicas();


    } catch (error) {

        console.error(
            "Erro ao excluir clínica:",
            error
        );


        mostrarMensagem(
            "Erro ao excluir clínica.",
            "erro"
        );

    }

}


// ======================================
// EVENTOS DOS SELECTS DO MODAL
// ======================================

function configurarSelectsClinica() {

    const regiao =
        elemento(
            "selectRegiaoClinica"
        );


    const estado =
        elemento(
            "selectEstadoClinica"
        );


    const cidade =
        elemento(
            "selectCidadeClinica"
        );


    regiao?.addEventListener(
        "change",
        async function () {

            await listarEstadosParaClinica(
                this.value
            );


            const cidadeSelect =
                elemento(
                    "selectCidadeClinica"
                );


            const bairroSelect =
                elemento(
                    "selectBairroClinica"
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


    estado?.addEventListener(
        "change",
        async function () {

            await listarCidadesParaClinica(
                this.value
            );


            const bairroSelect =
                elemento(
                    "selectBairroClinica"
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


    cidade?.addEventListener(
        "change",
        async function () {

            await listarBairrosParaClinica(
                this.value
            );

        }
    );

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        const [
            regioesResult,
            estadosResult,
            cidadesResult,
            bairrosResult,
            clinicasResult,
            especialidadesResult
        ] = await Promise.all([

            supabaseClient
                .from("regioes")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),

            supabaseClient
                .from("estados")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),

            supabaseClient
                .from("cidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),

            supabaseClient
                .from("bairros")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),

            supabaseClient
                .from("clinicas")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                ),

            supabaseClient
                .from("especialidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )

        ]);


        const resultados = [
            regioesResult,
            estadosResult,
            cidadesResult,
            bairrosResult,
            clinicasResult,
            especialidadesResult
        ];


        const erro =
            resultados.find(
                item => item.error
            );


        if (erro) {

            throw erro.error;

        }


        atualizarNumero(
            [
                "totalRegioes",
                "qtdRegioes"
            ],
            regioesResult.count || 0
        );


        atualizarNumero(
            [
                "totalEstados",
                "qtdEstados"
            ],
            estadosResult.count || 0
        );


        atualizarNumero(
            [
                "totalCidades",
                "qtdCidades"
            ],
            cidadesResult.count || 0
        );


        atualizarNumero(
            [
                "totalBairros",
                "qtdBairros"
            ],
            bairrosResult.count || 0
        );


        atualizarNumero(
            [
                "totalClinicas",
                "qtdClinicas"
            ],
            clinicasResult.count || 0
        );


        atualizarNumero(
            [
                "totalEspecialidades",
                "qtdEspecialidades"
            ],
            especialidadesResult.count || 0
        );


        await carregarUltimasClinicas();


    } catch (error) {

        console.error(
            "Erro ao carregar dashboard:",
            error
        );

    }

}


// ======================================
// ATUALIZAR NÚMERO
// ======================================

function atualizarNumero(
    ids,
    valor
) {

    ids.forEach(id => {

        const campo =
            elemento(id);

        if (campo) {

            campo.textContent =
                valor;

        }

    });

}


// ======================================
// ÚLTIMAS CLÍNICAS
// ======================================

async function carregarUltimasClinicas() {

    const container =
        elemento(
            "ultimasClinicas"
        );


    if (!container) return;


    try {

        // NÃO usar created_at.
        // A tabela clinicas não possui
        // essa coluna.

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

                bairros(
                    nome,

                    cidades(
                        nome
                    )
                )
            `)
            .order(
                "id",
                {
                    ascending: false
                }
            )
            .limit(5);


        if (error) {
            throw error;
        }


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML = `
                <div class="sem-dados">
                    Nenhuma clínica cadastrada.
                </div>
            `;

            return;

        }


        container.innerHTML =
            data
                .map(clinica => `

                    <div class="item-clinica">

                        <div>

                            <strong>
                                ${escaparHTML(
                                    clinica.nome
                                )}
                            </strong>

                            <small>

                                ${escaparHTML(
                                    clinica.bairros?.nome ||
                                    "Bairro não informado"
                                )}

                                -

                                ${escaparHTML(
                                    clinica.bairros?.cidades?.nome ||
                                    "Cidade não informada"
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

                    </div>

                `)
                .join("");


    } catch (error) {

        console.error(
            "Erro ao carregar últimas clínicas:",
            error
        );


        container.innerHTML = `
            <div class="sem-dados">
                Não foi possível carregar as clínicas.
            </div>
        `;

    }

}


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // ==================================
        // LOGIN
        // ==================================

        if (!verificarLogin()) {
            return;
        }


        // ==================================
        // SELECTS
        // ==================================

        configurarSelectsClinica();


        // ==================================
        // DADOS INICIAIS
        // ==================================

        await carregarRegioes();

        await carregarEspecialidadesAdmin();


        // ==================================
        // DASHBOARD
        // ==================================

        await carregarDashboard();


        // ==================================
        // PÁGINA INICIAL
        // ==================================

        mostrarPagina(
            "dashboard"
        );


        console.log(
            "Painel administrativo inicializado."
        );

    }
);


// ======================================
// DISPONIBILIZAR FUNÇÕES GLOBALMENTE
// ======================================

window.mostrarPagina =
    mostrarPagina;

window.sairAdmin =
    sairAdmin;

window.adicionarRegiao =
    adicionarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.adicionarEstado =
    adicionarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;

window.adicionarCidade =
    adicionarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;

window.adicionarBairro =
    adicionarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;

window.adicionarEspecialidade =
    adicionarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.novaClinica =
    novaClinica;

window.editarClinica =
    editarClinica;

window.excluirClinica =
    excluirClinica;

window.abrirModalClinica =
    abrirModalClinica;

window.fecharModalClinica =
    fecharModalClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.salvarClinica =
    salvarClinica;
