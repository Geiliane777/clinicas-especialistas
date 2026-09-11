// ============================================================
// ADMIN - PARTE 1
// Dashboard, especialidades, regiões, estados,
// cidades, bairros e funções gerais
// ============================================================

console.log("admin_parte1.js carregado");

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function escaparHTML(valor) {
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

function definirTexto(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }
}

function encontrarElemento(ids) {
    for (const id of ids) {
        const elemento = document.getElementById(id);

        if (elemento) {
            return elemento;
        }
    }

    return null;
}

function obterValor(ids) {
    const elemento = encontrarElemento(ids);

    if (!elemento) {
        return "";
    }

    return elemento.value || "";
}

// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagem(mensagem, tipo = "sucesso") {
    alert(mensagem);
}

// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        const regioes = await supabaseClient
            .from("regioes")
            .select("*", {
                count: "exact",
                head: true
            });

        const estados = await supabaseClient
            .from("estados")
            .select("*", {
                count: "exact",
                head: true
            });

        const cidades = await supabaseClient
            .from("cidades")
            .select("*", {
                count: "exact",
                head: true
            });

        const bairros = await supabaseClient
            .from("bairros")
            .select("*", {
                count: "exact",
                head: true
            });

        const especialidades = await supabaseClient
            .from("especialidades")
            .select("*", {
                count: "exact",
                head: true
            });

        const clinicas = await supabaseClient
            .from("clinicas")
            .select(
                "id,nome,ativo",
                {
                    count: "exact"
                }
            )
            .order(
                "id",
                {
                    ascending: false
                }
            );

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

        const barra =
            document.getElementById(
                "barraAtivas"
            );

        if (barra) {
            barra.style.width =
                `${porcentagem}%`;
        }

        definirTexto(
            "legendaAtivas",
            `Ativas: ${ativas}`
        );

        definirTexto(
            "legendaInativas",
            `Inativas: ${inativas}`
        );

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

function carregarUltimasClinicas(clinicas) {

    const container =
        document.getElementById(
            "ultimasClinicas"
        );

    if (!container) {
        return;
    }

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

async function listarEspecialidades() {

    const lista =
        document.getElementById(
            "listaEspecialidades"
        );

    if (!lista) {
        return;
    }

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
            .select("*")
            .order(
                "nome",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }

        if (!data || !data.length) {

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
                especialidade => `
                    <tr>

                        <td>
                            ${escaparHTML(
                                especialidade.nome
                            )}
                        </td>

                        <td>
                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarEspecialidade(${especialidade.id})"
                            >
                                ✏️ Editar
                            </button>

                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirEspecialidade(${especialidade.id})"
                            >
                                🗑️ Excluir
                            </button>
                        </td>

                    </tr>
                `
            ).join("");

    } catch (erro) {

        console.error(
            "Erro ao listar especialidades:",
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
// LIMPAR FORMULÁRIO DE ESPECIALIDADE
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
// EDITAR ESPECIALIDADE
// ============================================================

async function editarEspecialidade(id) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("especialidades")
            .select("*")
            .eq(
                "id",
                id
            )
            .single();

        if (error) {
            throw error;
        }

        const campoId =
            document.getElementById(
                "especialidadeEditId"
            );

        const campoNome =
            document.getElementById(
                "nomeEspecialidade"
            );

        if (campoId) {
            campoId.value =
                data.id;
        }

        if (campoNome) {
            campoNome.value =
                data.nome || "";

            campoNome.focus();
        }

    } catch (erro) {

        console.error(
            "Erro ao editar especialidade:",
            erro
        );

        alert(
            "Erro ao carregar especialidade."
        );
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

    const nome =
        document.getElementById(
            "nomeEspecialidade"
        )?.value.trim() || "";

    if (!nome) {

        alert(
            "Informe o nome da especialidade."
        );

        return;
    }

    try {

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

        await listarEspecialidades();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar especialidade:",
            erro
        );

        alert(
            erro?.message ||
            "Erro ao salvar especialidade."
        );
    }
}

// ============================================================
// EXCLUIR ESPECIALIDADE
// ============================================================

async function excluirEspecialidade(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta especialidade?"
        );

    if (!confirmar) {
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

        alert(
            "Especialidade excluída com sucesso."
        );

        await listarEspecialidades();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir especialidade:",
            erro
        );

        alert(
            erro?.message ||
            "Não foi possível excluir a especialidade."
        );
    }
}

// ============================================================
// REGIÕES
// ============================================================

async function listarRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );

    if (!lista) {
        return;
    }

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
            .select("*")
            .order(
                "nome",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }

        if (!data || !data.length) {

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
                regiao => `
                    <tr>

                        <td>
                            ${escaparHTML(
                                regiao.nome
                            )}
                        </td>

                        <td>
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
                        </td>

                    </tr>
                `
            ).join("");

    } catch (erro) {

        console.error(
            "Erro ao listar regiões:",
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
            "Informe o nome da região."
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

        const campoId =
            document.getElementById(
                "regiaoEditId"
            );

        const campoNome =
            document.getElementById(
                "nomeRegiao"
            );

        if (campoId) {
            campoId.value = "";
        }

        if (campoNome) {
            campoNome.value = "";
        }

        await listarRegioes();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar região:",
            erro
        );

        alert(
            erro?.message ||
            "Erro ao salvar região."
        );
    }
}

// ============================================================
// EDITAR REGIÃO
// ============================================================

async function editarRegiao(id) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select("*")
            .eq(
                "id",
                id
            )
            .single();

        if (error) {
            throw error;
        }

        document.getElementById(
            "regiaoEditId"
        ).value = data.id;

        document.getElementById(
            "nomeRegiao"
        ).value = data.nome || "";

        document.getElementById(
            "nomeRegiao"
        ).focus();

    } catch (erro) {

        console.error(
            "Erro ao editar região:",
            erro
        );

        alert(
            "Erro ao carregar região."
        );
    }
}

// ============================================================
// EXCLUIR REGIÃO
// ============================================================

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

        alert(
            "Região excluída com sucesso."
        );

        await listarRegioes();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir região:",
            erro
        );

        alert(
            erro?.message ||
            "Não foi possível excluir a região."
        );
    }
}

// ============================================================
// ESTADOS
// ============================================================

async function carregarRegioesSelect() {

    const select =
        document.getElementById(
            "estadoRegiao"
        );

    if (!select) {
        return;
    }

    limparSelectAdmin(
        "estadoRegiao",
        "Selecione a Região"
    );

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select("id,nome")
            .order(
                "nome",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }

        data?.forEach(
            regiao => {

                select.innerHTML += `
                    <option value="${regiao.id}">
                        ${escaparHTML(
                            regiao.nome
                        )}
                    </option>
                `;
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar regiões:",
            erro
        );
    }
}

// ============================================================
// LIMPAR SELECT ADMIN
// ============================================================

function limparSelectAdmin(
    id,
    mensagem
) {

    const select =
        document.getElementById(
            id
        );

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            ${escaparHTML(
                mensagem
            )}
        </option>
    `;
}

// ============================================================
// LISTAR ESTADOS
// ============================================================

async function listarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML = `
        <tr>
            <td colspan="4">
                Carregando...
            </td>
        </tr>
    `;

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

        if (!data || !data.length) {

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
                estado => `
                    <tr>

                        <td>
                            ${escaparHTML(
                                estado.nome
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                estado.regioes?.nome ||
                                "-"
                            )}
                        </td>

                        <td>
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
                        </td>

                    </tr>
                `
            ).join("");

    } catch (erro) {

        console.error(
            "Erro ao listar estados:",
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
            "Informe o nome do estado."
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

        const dados = {
            nome: nome,
            regiao_id: regiaoId
        };

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("estados")
                .update(dados)
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
                error
            } = await supabaseClient
                .from("estados")
                .insert(dados);

            if (error) {
                throw error;
            }

            alert(
                "Estado cadastrado com sucesso."
            );
        }

        document.getElementById(
            "estadoEditId"
        ).value = "";

        document.getElementById(
            "nomeEstado"
        ).value = "";

        document.getElementById(
            "estadoRegiao"
        ).value = "";

        await listarEstados();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar estado:",
            erro
        );

        alert(
            erro?.message ||
            "Erro ao salvar estado."
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
            .select("*")
            .eq(
                "id",
                id
            )
            .single();

        if (error) {
            throw error;
        }

        document.getElementById(
            "estadoEditId"
        ).value = data.id;

        document.getElementById(
            "nomeEstado"
        ).value = data.nome || "";

        document.getElementById(
            "estadoRegiao"
        ).value = data.regiao_id || "";

        document.getElementById(
            "nomeEstado"
        ).focus();

    } catch (erro) {

        console.error(
            "Erro ao editar estado:",
            erro
        );

        alert(
            "Erro ao carregar estado."
        );
    }
}

// ============================================================
// EXCLUIR ESTADO
// ============================================================

async function excluirEstado(id) {

    if (
        !confirm(
            "Deseja realmente excluir este estado?"
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

        alert(
            "Estado excluído com sucesso."
        );

        await listarEstados();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir estado:",
            erro
        );

        alert(
            erro?.message ||
            "Não foi possível excluir o estado."
        );
    }
}

// ============================================================
// CIDADES
// ============================================================

async function carregarEstadosSelectCidade() {

    const select =
        document.getElementById(
            "cidadeEstado"
        );

    if (!select) {
        return;
    }

    limparSelectAdmin(
        "cidadeEstado",
        "Selecione o Estado"
    );

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select("id,nome")
            .order(
                "nome",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }

        data?.forEach(
            estado => {

                select.innerHTML += `
                    <option value="${estado.id}">
                        ${escaparHTML(
                            estado.nome
                        )}
                    </option>
                `;
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar estados:",
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

    if (!lista) {
        return;
    }

    lista.innerHTML = `
        <tr>
            <td colspan="4">
                Carregando...
            </td>
        </tr>
    `;

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

        if (!data || !data.length) {

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
                cidade => `
                    <tr>

                        <td>
                            ${escaparHTML(
                                cidade.nome
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                cidade.estados?.nome ||
                                "-"
                            )}
                        </td>

                        <td>
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
                        </td>

                    </tr>
                `
            ).join("");

    } catch (erro) {

        console.error(
            "Erro ao listar cidades:",
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
            "Informe o nome da cidade."
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

        const dados = {
            nome: nome,
            estado_id: estadoId
        };

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("cidades")
                .update(dados)
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
                error
            } = await supabaseClient
                .from("cidades")
                .insert(dados);

            if (error) {
                throw error;
            }

            alert(
                "Cidade cadastrada com sucesso."
            );
        }

        document.getElementById(
            "cidadeEditId"
        ).value = "";

        document.getElementById(
            "nomeCidade"
        ).value = "";

        document.getElementById(
            "cidadeEstado"
        ).value = "";

        await listarCidades();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar cidade:",
            erro
        );

        alert(
            erro?.message ||
            "Erro ao salvar cidade."
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
            .select("*")
            .eq(
                "id",
                id
            )
            .single();

        if (error) {
            throw error;
        }

        document.getElementById(
            "cidadeEditId"
        ).value = data.id;

        document.getElementById(
            "nomeCidade"
        ).value = data.nome || "";

        document.getElementById(
            "cidadeEstado"
        ).value = data.estado_id || "";

        document.getElementById(
            "nomeCidade"
        ).focus();

    } catch (erro) {

        console.error(
            "Erro ao editar cidade:",
            erro
        );

        alert(
            "Erro ao carregar cidade."
        );
    }
}

// ============================================================
// EXCLUIR CIDADE
// ============================================================

async function excluirCidade(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta cidade?"
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

        alert(
            "Cidade excluída com sucesso."
        );

        await listarCidades();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir cidade:",
            erro
        );

        alert(
            erro?.message ||
            "Não foi possível excluir a cidade."
        );
    }
}

// ============================================================
// BAIRROS
// ============================================================

async function carregarCidadesSelectBairro() {

    const select =
        document.getElementById(
            "bairroCidade"
        );

    if (!select) {
        return;
    }

    limparSelectAdmin(
        "bairroCidade",
        "Selecione a Cidade"
    );

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select("id,nome")
            .order(
                "nome",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }

        data?.forEach(
            cidade => {

                select.innerHTML += `
                    <option value="${cidade.id}">
                        ${escaparHTML(
                            cidade.nome
                        )}
                    </option>
                `;
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
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

    if (!lista) {
        return;
    }

    lista.innerHTML = `
        <tr>
            <td colspan="4">
                Carregando...
            </td>
        </tr>
    `;

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

        if (!data || !data.length) {

            lista.innerHTML = `
                <tr>
                    <td colspan="4">
                        Nenhum bairro cadastrado.
                    </td>
                </tr>
            `;

            return;
        }

        lista.innerHTML =
            data.map(
                bairro => `
                    <tr>

                        <td>
                            ${escaparHTML(
                                bairro.nome
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                bairro.cidades?.nome ||
                                "-"
                            )}
                        </td>

                        <td>
                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarBairro(${bairro.id})"
                            >
                                ✏️ Editar
                            </button>

                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirBairro(${bairro.id})"
                            >
                                🗑️ Excluir
                            </button>
                        </td>

                    </tr>
                `
            ).join("");

    } catch (erro) {

        console.error(
            "Erro ao listar bairros:",
            erro
        );

        lista.innerHTML = `
            <tr>
                <td colspan="4">
                    Erro ao carregar bairros.
                </td>
            </tr>
        `;
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
            "Informe o nome do bairro."
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

        const dados = {
            nome: nome,
            cidade_id: cidadeId
        };

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("bairros")
                .update(dados)
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
                error
            } = await supabaseClient
                .from("bairros")
                .insert(dados);

            if (error) {
                throw error;
            }

            alert(
                "Bairro cadastrado com sucesso."
            );
        }

        document.getElementById(
            "bairroEditId"
        ).value = "";

        document.getElementById(
            "nomeBairro"
        ).value = "";

        document.getElementById(
            "bairroCidade"
        ).value = "";

        await listarBairros();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao salvar bairro:",
            erro
        );

        alert(
            erro?.message ||
            "Erro ao salvar bairro."
        );
    }
}

// ============================================================
// EDITAR BAIRRO
// ============================================================

async function editarBairro(id) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select("*")
            .eq(
                "id",
                id
            )
            .single();

        if (error) {
            throw error;
        }

        document.getElementById(
            "bairroEditId"
        ).value = data.id;

        document.getElementById(
            "nomeBairro"
        ).value = data.nome || "";

        document.getElementById(
            "bairroCidade"
        ).value = data.cidade_id || "";

        document.getElementById(
            "nomeBairro"
        ).focus();

    } catch (erro) {

        console.error(
            "Erro ao editar bairro:",
            erro
        );

        alert(
            "Erro ao carregar bairro."
        );
    }
}

// ============================================================
// EXCLUIR BAIRRO
// ============================================================

async function excluirBairro(id) {

    if (
        !confirm(
            "Deseja realmente excluir este bairro?"
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

        alert(
            "Bairro excluído com sucesso."
        );

        await listarBairros();

        await carregarDashboard();

    } catch (erro) {

        console.error(
            "Erro ao excluir bairro:",
            erro
        );

        alert(
            erro?.message ||
            "Não foi possível excluir o bairro."
        );
    }
}

// ============================================================
// MENU
// ============================================================

function iniciarMenu() {

    const botoes =
        document.querySelectorAll(
            ".menu-btn"
        );

    botoes.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    const pagina =
                        botao.dataset.pagina ||
                        botao.dataset.page;

                    if (pagina) {
                        mostrarPagina(pagina);
                    }
                }
            );
        }
    );
}

// ============================================================
// TÍTULOS DAS PÁGINAS
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

// ============================================================
// MOSTRAR PÁGINA
// ============================================================

function mostrarPagina(pagina) {

    document
        .querySelectorAll(
            ".pagina"
        )
        .forEach(
            item => {
                item.classList.remove(
                    "ativa"
                );
            }
        );

    const paginaSelecionada =
        document.getElementById(
            `pagina-${pagina}`
        ) ||
        document.getElementById(
            pagina
        );

    if (paginaSelecionada) {

        paginaSelecionada.classList.add(
            "ativa"
        );
    }

    document
        .querySelectorAll(
            ".menu-btn"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "ativo"
                );

                item.classList.remove(
                    "active"
                );
            }
        );

    const botao =
        document.querySelector(
            `[data-pagina="${pagina}"]`
        ) ||
        document.querySelector(
            `[data-page="${pagina}"]`
        );

    if (botao) {

        botao.classList.add(
            "ativo"
        );

        botao.classList.add(
            "active"
        );
    }

    const titulo =
        document.getElementById(
            "tituloPagina"
        );

    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[pagina] ||
            "Painel";
    }

    switch (pagina) {

        case "dashboard":

            carregarDashboard();

            break;

        case "clinicas":

            if (
                typeof listarClinicas ===
                "function"
            ) {
                listarClinicas();
            }

            break;

        case "especialidades":

            listarEspecialidades();

            break;

        case "regioes":

            listarRegioes();

            break;

        case "estados":

            carregarRegioesSelect();

            listarEstados();

            break;

        case "cidades":

            carregarEstadosSelectCidade();

            listarCidades();

            break;

        case "bairros":

            carregarCidadesSelectBairro();

            listarBairros();

            break;
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function iniciarAdmin() {

    iniciarMenu();

    document
        .getElementById(
            "btnSalvarEspecialidade"
        )
        ?.addEventListener(
            "click",
            salvarEspecialidade
        );

    document
        .getElementById(
            "btnSalvarRegiao"
        )
        ?.addEventListener(
            "click",
            salvarRegiao
        );

    document
        .getElementById(
            "btnSalvarEstado"
        )
        ?.addEventListener(
            "click",
            salvarEstado
        );

    document
        .getElementById(
            "btnSalvarCidade"
        )
        ?.addEventListener(
            "click",
            salvarCidade
        );

    document
        .getElementById(
            "btnSalvarBairro"
        )
        ?.addEventListener(
            "click",
            salvarBairro
        );

    document
        .getElementById(
            "estadoRegiao"
        )
        ?.addEventListener(
            "focus",
            carregarRegioesSelect
        );

    document
        .getElementById(
            "cidadeEstado"
        )
        ?.addEventListener(
            "focus",
            carregarEstadosSelectCidade
        );

    document
        .getElementById(
            "bairroCidade"
        )
        ?.addEventListener(
            "focus",
            carregarCidadesSelectBairro
        );

    const dataAtual =
        document.getElementById(
            "dataAtual"
        );

    if (dataAtual) {

        const agora =
            new Date();

        dataAtual.textContent =
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

    carregarDashboard();
}

// ============================================================
// DOM
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarAdmin
);

// ============================================================
// EXPORTAÇÕES
// ============================================================

window.carregarDashboard =
    carregarDashboard;

window.listarEspecialidades =
    listarEspecialidades;

window.editarEspecialidade =
    editarEspecialidade;

window.salvarEspecialidade =
    salvarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.listarRegioes =
    listarRegioes;

window.editarRegiao =
    editarRegiao;

window.salvarRegiao =
    salvarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.carregarRegioesSelect =
    carregarRegioesSelect;

window.listarEstados =
    listarEstados;

window.editarEstado =
    editarEstado;

window.salvarEstado =
    salvarEstado;

window.excluirEstado =
    excluirEstado;

window.listarCidades =
    listarCidades;

window.editarCidade =
    editarCidade;

window.salvarCidade =
    salvarCidade;

window.excluirCidade =
    excluirCidade;

window.listarBairros =
    listarBairros;

window.editarBairro =
    editarBairro;

window.salvarBairro =
    salvarBairro;

window.excluirBairro =
    excluirBairro;

window.mostrarPagina =
    mostrarPagina;

console.log(
    "Parte 1 do admin.js carregada."
);
// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 2 DE 2
// ============================================================

console.log("admin_parte2.js carregado");

// ============================================================
// CONSTANTES
// ============================================================

const REDE_ESPECIALISTAS = "especialistas";
const REDE_SINDILEGIS = "sindilegis";

let clinicaEditandoId = null;


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function escaparHTMLClinica(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function limparSelectClinica(
    id,
    texto
) {

    const select =
        document.getElementById(id);

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            ${escaparHTMLClinica(texto)}
        </option>
    `;
}


// ============================================================
// NORMALIZAR REDE
// ============================================================

function normalizarRedeAdmin(
    valor
) {

    const rede =
        String(valor ?? "")
            .trim()
            .toLowerCase();

    if (
        rede === "especialistas" ||
        rede === "especialista" ||
        rede === "rede especialistas"
    ) {

        return REDE_ESPECIALISTAS;
    }

    if (
        rede === "sindilegis" ||
        rede === "rede sindilegis"
    ) {

        return REDE_SINDILEGIS;
    }

    return "";
}


// ============================================================
// OBTER REDES DA CLÍNICA
// ============================================================

function obterRedesClinica(
    clinica
) {

    const resultado = {
        especialistas: false,
        sindilegis: false
    };

    const vinculos =
        Array.isArray(
            clinica?.clinica_especialidades
        )
            ? clinica.clinica_especialidades
            : [];

    vinculos.forEach(
        vinculo => {

            if (
                vinculo.ativo === false
            ) {
                return;
            }

            const rede =
                normalizarRedeAdmin(
                    vinculo.rede
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
// LISTAR CLÍNICAS
// ============================================================

async function listarClinicas() {

    const lista =
        document.getElementById(
            "listaClinicas"
        );

    if (!lista) {
        return;
    }

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
        // FILTRO DE TEXTO
        // ====================================================

        if (busca) {

            clinicas =
                clinicas.filter(
                    clinica => {

                        const nome =
                            String(
                                clinica.nome || ""
                            ).toLowerCase();

                        const telefone =
                            String(
                                clinica.telefone || ""
                            ).toLowerCase();

                        const endereco =
                            String(
                                clinica.endereco || ""
                            ).toLowerCase();

                        const bairro =
                            String(
                                clinica.bairros?.nome || ""
                            ).toLowerCase();

                        const cidade =
                            String(
                                clinica.bairros
                                    ?.cidades
                                    ?.nome || ""
                            ).toLowerCase();

                        const estado =
                            String(
                                clinica.bairros
                                    ?.cidades
                                    ?.estados
                                    ?.nome || ""
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
        // FILTRO DE STATUS
        // ====================================================

        if (
            statusFiltro === "ativa"
        ) {

            clinicas =
                clinicas.filter(
                    clinica =>
                        clinica.ativo === true
                );
        }

        else if (
            statusFiltro === "inativa"
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

                            <td>
                                <strong>
                                    ${escaparHTMLClinica(
                                        clinica.nome ||
                                        "Sem nome"
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escaparHTMLClinica(
                                    regiao?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td>
                                ${escaparHTMLClinica(
                                    estado?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td>
                                ${escaparHTMLClinica(
                                    cidade?.nome ||
                                    "Não informado"
                                )}
                            </td>

                            <td>
                                ${escaparHTMLClinica(
                                    bairro?.nome ||
                                    "Não informado"
                                )}
                            </td>

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

                            <td>

                                <span
                                    class="status ${classeStatus}"
                                >
                                    ${status}
                                </span>

                            </td>

                            <td>

                                <div class="acoes-tabela">

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

                            </td>

                        </tr>
                    `;
                }
            ).join("");

    }

    catch (erro) {

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
// ABRIR MODAL DA CLÍNICA
// ============================================================

async function abrirModalClinica(
    id = ""
) {

    const modal =
        document.getElementById(
            "modalClinica"
        );

    if (!modal) {
        return;
    }

    clinicaEditandoId =
        id || null;


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


    limparSelectClinica(
        "clinicaEstado",
        "Selecione o Estado"
    );

    limparSelectClinica(
        "clinicaCidade",
        "Selecione a Cidade"
    );

    limparSelectClinica(
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


        if (campoNome) {
            campoNome.value =
                clinica.nome || "";
        }

        if (campoEndereco) {
            campoEndereco.value =
                clinica.endereco || "";
        }

        if (campoTelefone) {
            campoTelefone.value =
                clinica.telefone || "";
        }

        if (campoAtivo) {
            campoAtivo.checked =
                clinica.ativo !== false;
        }


        // ====================================================
        // LOCALIZAÇÃO
        // ====================================================

        if (clinica.bairro_id) {

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


            // REGIÃO

            if (regiao) {

                if (campoRegiao) {
                    campoRegiao.value =
                        regiao.id;
                }

                await carregarEstadosClinica(
                    regiao.id
                );
            }


            // ESTADO

            if (estado) {

                if (campoEstado) {
                    campoEstado.value =
                        estado.id;
                }

                await carregarCidadesClinica(
                    estado.id
                );
            }


            // CIDADE

            if (cidade) {

                if (campoCidade) {
                    campoCidade.value =
                        cidade.id;
                }

                await carregarBairrosClinica(
                    cidade.id
                );
            }


            // BAIRRO

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

    }

    catch (erro) {

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

    if (!modal) {
        return;
    }

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

    if (!modal) {
        return;
    }

    modal.classList.add(
        "hidden"
    );

    clinicaEditandoId =
        null;
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

    if (!select) {
        return;
    }

    limparSelectClinica(
        "clinicaEstado",
        "Selecione o Estado"
    );

    limparSelectClinica(
        "clinicaCidade",
        "Selecione a Cidade"
    );

    limparSelectClinica(
        "clinicaBairro",
        "Selecione o Bairro"
    );


    if (!regiaoId) {
        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select(
                "id,nome"
            )
            .eq(
                "regiao_id",
                regiaoId
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


        (data || []).forEach(
            estado => {

                select.innerHTML += `
                    <option value="${estado.id}">
                        ${escaparHTMLClinica(
                            estado.nome
                        )}
                    </option>
                `;
            }
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar estados:",
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

    if (!select) {
        return;
    }

    limparSelectClinica(
        "clinicaCidade",
        "Selecione a Cidade"
    );

    limparSelectClinica(
        "clinicaBairro",
        "Selecione o Bairro"
    );


    if (!estadoId) {
        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select(
                "id,nome"
            )
            .eq(
                "estado_id",
                estadoId
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


        (data || []).forEach(
            cidade => {

                select.innerHTML += `
                    <option value="${cidade.id}">
                        ${escaparHTMLClinica(
                            cidade.nome
                        )}
                    </option>
                `;
            }
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
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

    if (!select) {
        return;
    }

    limparSelectClinica(
        "clinicaBairro",
        "Selecione o Bairro"
    );


    if (!cidadeId) {
        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select(
                "id,nome"
            )
            .eq(
                "cidade_id",
                cidadeId
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


        (data || []).forEach(
            bairro => {

                select.innerHTML += `
                    <option value="${bairro.id}">
                        ${escaparHTMLClinica(
                            bairro.nome
                        )}
                    </option>
                `;
            }
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar bairros:",
            erro
        );
    }
}


// ============================================================
// POPULAR REGIÕES
// ============================================================

async function popularSelectRegioes(
    id
) {

    const select =
        document.getElementById(
            id
        );

    if (!select) {
        return;
    }

    limparSelectClinica(
        id,
        "Selecione a Região"
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select(
                "id,nome"
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


        (data || []).forEach(
            regiao => {

                select.innerHTML += `
                    <option value="${regiao.id}">
                        ${escaparHTMLClinica(
                            regiao.nome
                        )}
                    </option>
                `;
            }
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar regiões:",
            erro
        );
    }
}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(
    evento
) {

    if (evento) {
        evento.preventDefault();
    }


    try {

        const nome =
            document.getElementById(
                "clinicaNome"
            )?.value
            ?.trim() || "";

        const endereco =
            document.getElementById(
                "clinicaEndereco"
            )?.value
            ?.trim() || "";

        const telefone =
            document.getElementById(
                "clinicaTelefone"
            )?.value
            ?.trim() || "";

        const bairroId =
            document.getElementById(
                "clinicaBairro"
            )?.value || "";

        const ativoElemento =
            document.getElementById(
                "clinicaAtivo"
            );

        const ativo =
            ativoElemento
                ? ativoElemento.checked
                : true;


        // ====================================================
        // VALIDAÇÕES
        // ====================================================

        if (!nome) {

            alert(
                "Informe o nome da clínica."
            );

            return;
        }


        if (!bairroId) {

            alert(
                "Selecione o bairro da clínica."
            );

            return;
        }


        const dadosClinica = {

            nome:
                nome,

            endereco:
                endereco ||
                null,

            telefone:
                telefone ||
                null,

            bairro_id:
                Number(bairroId),

            ativo:
                ativo
        };


        let clinicaId =
            clinicaEditandoId;


        // ====================================================
        // INSERIR
        // ====================================================

        if (!clinicaId) {

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
        }


        // ====================================================
        // ATUALIZAR
        // ====================================================

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


        // ====================================================
        // SALVAR ESPECIALIDADES
        // ====================================================

        await salvarEspecialidadesClinica(
            clinicaId
        );


        alert(
            "Clínica salva com sucesso!"
        );


        fecharModalClinica();


        await listarClinicas();


        if (
            typeof carregarDashboard ===
            "function"
        ) {

            await carregarDashboard();
        }

    }

    catch (erro) {

        console.error(
            "Erro ao salvar clínica:",
            erro
        );

        alert(
            erro?.message ||
            "Erro ao salvar clínica."
        );
    }
}


// ============================================================
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(
    id
) {

    if (!id) {
        return;
    }


    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?"
        );

    if (!confirmar) {
        return;
    }


    try {

        // ====================================================
        // REMOVER ESPECIALIDADES
        // ====================================================

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


        // ====================================================
        // REMOVER CLÍNICA
        // ====================================================

        const {
            error
        } = await supabaseClient
            .from(
                "clinicas"
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
            "Clínica excluída com sucesso."
        );


        await listarClinicas();


        if (
            typeof carregarDashboard ===
            "function"
        ) {

            await carregarDashboard();
        }

    }

    catch (erro) {

        console.error(
            "Erro ao excluir clínica:",
            erro
        );

        alert(
            erro?.message ||
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

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="especialidades-vazio">
            Carregando especialidades...
        </div>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from(
                "clinica_especialidades"
            )
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
            .order(
                "id",
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

            limparEspecialidadesClinica();

            return;
        }


        container.innerHTML = "";


        for (
            const item of data
        ) {

            await adicionarLinhaEspecialidade(
                item
            );
        }

    }

    catch (erro) {

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

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="especialidades-vazio">
            Nenhuma especialidade adicionada.
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

    if (!container) {
        return;
    }

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

    if (!container) {
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
                    title="Remover especialidade"
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
            String(
                especialidadeSelecionada
            );
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
// POPULAR SELECT DE ESPECIALIDADES
// ============================================================

async function popularEspecialidadesSelect(
    select
) {

    if (!select) {
        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from(
                "especialidades"
            )
            .select(
                "id,nome"
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
                        ${escaparHTMLClinica(
                            especialidade.nome
                        )}
                    </option>
                `;
            }
        );

    }

    catch (erro) {

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

    if (!container) {
        return;
    }


    const linhas =
        container.querySelectorAll(
            ".especialidade-item"
        );


    const registros = [];


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
                        Number(
                            clinicaId
                        ),

                    especialidade_id:
                        Number(
                            especialidade
                        ),

                    rede:
                        normalizarRedeAdmin(
                            rede
                        ),

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
    // NENHUMA ESPECIALIDADE
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
// EVENTOS
// ============================================================

function iniciarEventosClinicas() {

    // --------------------------------------------------------
    // NOVA CLÍNICA
    // --------------------------------------------------------

    document
        .getElementById(
            "btnNovaClinica"
        )
        ?.addEventListener(
            "click",
            () => abrirModalClinica()
        );


    // --------------------------------------------------------
    // FECHAR MODAL
    // --------------------------------------------------------

    document
        .getElementById(
            "btnFecharModal"
        )
        ?.addEventListener(
            "click",
            fecharModalClinica
        );


    document
        .getElementById(
            "btnCancelarModal"
        )
        ?.addEventListener(
            "click",
            fecharModalClinica
        );


    // --------------------------------------------------------
    // FORMULÁRIO
    // --------------------------------------------------------

    document
        .getElementById(
            "formClinica"
        )
        ?.addEventListener(
            "submit",
            salvarClinica
        );


    // --------------------------------------------------------
    // ADICIONAR ESPECIALIDADE
    // --------------------------------------------------------

    document
        .getElementById(
            "btnAdicionarEspecialidade"
        )
        ?.addEventListener(
            "click",
            () =>
                adicionarLinhaEspecialidade()
        );


    // --------------------------------------------------------
    // BUSCA
    // --------------------------------------------------------

    document
        .getElementById(
            "buscarClinica"
        )
        ?.addEventListener(
            "input",
            listarClinicas
        );


    // --------------------------------------------------------
    // FILTRO STATUS
    // --------------------------------------------------------

    document
        .getElementById(
            "filtroStatusClinica"
        )
        ?.addEventListener(
            "change",
            listarClinicas
        );


    // --------------------------------------------------------
    // REGIÃO
    // --------------------------------------------------------

    document
        .getElementById(
            "clinicaRegiao"
        )
        ?.addEventListener(
            "change",
            evento => {

                carregarEstadosClinica(
                    evento.target.value
                );
            }
        );


    // --------------------------------------------------------
    // ESTADO
    // --------------------------------------------------------

    document
        .getElementById(
            "clinicaEstado"
        )
        ?.addEventListener(
            "change",
            evento => {

                carregarCidadesClinica(
                    evento.target.value
                );
            }
        );


    // --------------------------------------------------------
    // CIDADE
    // --------------------------------------------------------

    document
        .getElementById(
            "clinicaCidade"
        )
        ?.addEventListener(
            "change",
            evento => {

                carregarBairrosClinica(
                    evento.target.value
                );
            }
        );
}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarEventosClinicas();

    }
);


// ============================================================
// EXPORTAÇÕES
// ============================================================

window.listarClinicas =
    listarClinicas;

window.abrirModalClinica =
    abrirModalClinica;

window.mostrarModalClinica =
    mostrarModalClinica;

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

window.popularSelectRegioes =
    popularSelectRegioes;

window.carregarEspecialidadesClinica =
    carregarEspecialidadesClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.popularEspecialidadesSelect =
    popularEspecialidadesSelect;

window.salvarEspecialidadesClinica =
    salvarEspecialidadesClinica;

window.normalizarRedeAdmin =
    normalizarRedeAdmin;

window.obterRedesClinica =
    obterRedesClinica;


console.log(
    "admin_parte2.js carregado com sucesso."
);
