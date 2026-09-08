// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO - REDE ESPECIALISTAS
// ============================================================

console.log("admin.js carregado");


// ============================================================
// VERIFICAÇÃO DO SUPABASE
// ============================================================

if (typeof supabaseClient === "undefined") {

    console.error(
        "ERRO: supabaseClient não foi encontrado."
    );

} else {

    console.log(
        "supabaseClient disponível no admin.js"
    );

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("Painel administrativo iniciado.");

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

});


// ============================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ============================================================

function mostrarPagina(pagina) {

    const paginas =
        document.querySelectorAll(".pagina");

    const botoes =
        document.querySelectorAll(".menu-btn");

    paginas.forEach(function (item) {

        item.classList.remove("ativa");

    });

    botoes.forEach(function (botao) {

        botao.classList.remove("ativo");

    });


    const paginaSelecionada =
        document.getElementById(
            "pagina-" + pagina
        );

    if (paginaSelecionada) {

        paginaSelecionada.classList.add("ativa");

    }


    const botaoSelecionado =
        document.querySelector(
            `.menu-btn[data-pagina="${pagina}"]`
        );

    if (botaoSelecionado) {

        botaoSelecionado.classList.add("ativo");

    }


    // Carregar dados quando abrir a página

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
// DATA ATUAL
// ============================================================

function atualizarData() {

    const elemento =
        document.getElementById("dataAtual");

    if (!elemento) return;


    const agora = new Date();

    const data =
        agora.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    elemento.textContent =
        data.charAt(0).toUpperCase() +
        data.slice(1);

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
            count: totalClinicas,
            error: erroClinicas
        } = await supabaseClient
            .from("clinicas")
            .select("*", {
                count: "exact",
                head: true
            });


        if (erroClinicas) {

            throw erroClinicas;

        }


        // ----------------------------------------------------
        // CLÍNICAS ATIVAS
        // ----------------------------------------------------

        const {
            count: totalAtivas,
            error: erroAtivas
        } = await supabaseClient
            .from("clinicas")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("ativo", true);


        if (erroAtivas) {

            throw erroAtivas;

        }


        // ----------------------------------------------------
        // ESPECIALIDADES
        // ----------------------------------------------------

        const {
            count: totalEspecialidades,
            error: erroEspecialidades
        } = await supabaseClient
            .from("especialidades")
            .select("*", {
                count: "exact",
                head: true
            });


        if (erroEspecialidades) {

            throw erroEspecialidades;

        }


        // ----------------------------------------------------
        // REGIÕES
        // ----------------------------------------------------

        const {
            count: totalRegioes,
            error: erroRegioes
        } = await supabaseClient
            .from("regioes")
            .select("*", {
                count: "exact",
                head: true
            });


        if (erroRegioes) {

            throw erroRegioes;

        }


        // ----------------------------------------------------
        // ESTADOS
        // ----------------------------------------------------

        const {
            count: totalEstados,
            error: erroEstados
        } = await supabaseClient
            .from("estados")
            .select("*", {
                count: "exact",
                head: true
            });


        if (erroEstados) {

            throw erroEstados;

        }


        // ----------------------------------------------------
        // CIDADES
        // ----------------------------------------------------

        const {
            count: totalCidades,
            error: erroCidades
        } = await supabaseClient
            .from("cidades")
            .select("*", {
                count: "exact",
                head: true
            });


        if (erroCidades) {

            throw erroCidades;

        }


        // ----------------------------------------------------
        // BAIRROS
        // ----------------------------------------------------

        const {
            count: totalBairros,
            error: erroBairros
        } = await supabaseClient
            .from("bairros")
            .select("*", {
                count: "exact",
                head: true
            });


        if (erroBairros) {

            throw erroBairros;

        }


        // ----------------------------------------------------
        // ATUALIZAR CARDS
        // ----------------------------------------------------

        definirTexto(
            "totalClinicas",
            totalClinicas || 0
        );

        definirTexto(
            "totalClinicasAtivas",
            totalAtivas || 0
        );

        definirTexto(
            "totalClinicasInativas",
            (totalClinicas || 0) -
            (totalAtivas || 0)
        );

        definirTexto(
            "totalEspecialidades",
            totalEspecialidades || 0
        );

        definirTexto(
            "totalRegioes",
            totalRegioes || 0
        );

        definirTexto(
            "totalEstados",
            totalEstados || 0
        );

        definirTexto(
            "totalCidades",
            totalCidades || 0
        );

        definirTexto(
            "totalBairros",
            totalBairros || 0
        );


        // ----------------------------------------------------
        // PERCENTUAL
        // ----------------------------------------------------

        const inativas =
            (totalClinicas || 0) -
            (totalAtivas || 0);


        let porcentagem = 0;

        if (totalClinicas > 0) {

            porcentagem =
                Math.round(
                    (totalAtivas / totalClinicas) *
                    100
                );

        }


        definirTexto(
            "porcentagemAtivas",
            porcentagem + "%"
        );


        const barra =
            document.getElementById(
                "barraAtivas"
            );

        if (barra) {

            barra.style.width =
                porcentagem + "%";

        }


        definirTexto(
            "legendaAtivas",
            totalAtivas || 0
        );

        definirTexto(
            "legendaInativas",
            inativas
        );


        // ----------------------------------------------------
        // ÚLTIMAS CLÍNICAS
        // ----------------------------------------------------

        await carregarUltimasClinicas();


        console.log(
            "Dashboard carregado com sucesso."
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


// ============================================================
// FUNÇÃO AUXILIAR PARA TEXTO
// ============================================================

function definirTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent = valor;

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

    if (!container) return;


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
                created_at
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(5);


        if (error) {

            throw error;

        }


        if (!data || data.length === 0) {

            container.innerHTML = `
                <div class="vazio">
                    Nenhuma clínica cadastrada.
                </div>
            `;

            return;

        }


        container.innerHTML = "";


        data.forEach(function (clinica) {

            const item =
                document.createElement("div");

            item.className =
                "item-ultima-clinica";


            item.innerHTML = `

                <div class="ultima-clinica-icone">
                    🏥
                </div>

                <div class="ultima-clinica-info">

                    <strong>
                        ${escapeHTML(
                            clinica.nome || "Sem nome"
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            clinica.endereco || "-"
                        )}
                    </span>

                </div>

                <span class="status-mini ${
                    clinica.ativo
                        ? "status-ativa"
                        : "status-inativa"
                }">

                    ${
                        clinica.ativo
                            ? "Ativa"
                            : "Inativa"
                    }

                </span>

            `;


            container.appendChild(item);

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar últimas clínicas:",
            erro
        );


        container.innerHTML = `
            <div class="erro">
                Não foi possível carregar as clínicas.
            </div>
        `;

    }

}


// ============================================================
// LISTAR CLÍNICAS
// ============================================================

async function listarClinicas() {

    const tabela =
        document.getElementById(
            "listaClinicas"
        );

    if (!tabela) return;


    tabela.innerHTML = `
        <tr>
            <td colspan="6" class="carregando">
                Carregando clínicas...
            </td>
        </tr>
    `;


    try {

        const busca =
            document.getElementById(
                "buscarClinica"
            )?.value.trim();


        const filtroStatus =
            document.getElementById(
                "filtroStatusClinica"
            )?.value;


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
                    bairros (
                        id,
                        nome,
                        cidades (
                            id,
                            nome,
                            estados (
                                id,
                                nome
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


        if (busca) {

            query =
                query.ilike(
                    "nome",
                    `%${busca}%`
                );

        }


        if (filtroStatus !== "") {

            query =
                query.eq(
                    "ativo",
                    filtroStatus === "true"
                );

        }


        const {
            data,
            error
        } = await query;


        if (error) {

            throw error;

        }


        tabela.innerHTML = "";


        if (!data || data.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="6" class="sem-dados">
                        Nenhuma clínica encontrada.
                    </td>
                </tr>
            `;

            return;

        }


        data.forEach(function (clinica) {

            const linha =
                document.createElement("tr");


            let localizacao = "-";


            if (clinica.bairros) {

                const bairro =
                    clinica.bairros;

                const cidade =
                    bairro.cidades;

                const estado =
                    cidade?.estados;


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


                if (partes.length > 0) {

                    localizacao =
                        partes.join(" - ");

                }

            }


            linha.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            clinica.nome || "-"
                        )}
                    </strong>

                </td>

                <td>
                    ${escapeHTML(localizacao)}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.telefone || "-"
                    )}
                </td>

                <td>
                    <span
                        class="especialidades-resumo"
                        data-clinica="${clinica.id}"
                    >
                        -
                    </span>
                </td>

                <td>

                    <span class="status-badge ${
                        clinica.ativo
                            ? "status-ativa"
                            : "status-inativa"
                    }">

                        ${
                            clinica.ativo
                                ? "Ativa"
                                : "Inativa"
                        }

                    </span>

                </td>

                <td>

                    <div class="acoes-tabela">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarClinica('${clinica.id}')"
                            title="Editar clínica"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirClinica('${clinica.id}')"
                            title="Excluir clínica"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            tabela.appendChild(linha);


            carregarResumoEspecialidades(
                clinica.id
            );

        });


    } catch (erro) {

        console.error(
            "Erro ao listar clínicas:",
            erro
        );


        tabela.innerHTML = `
            <tr>
                <td colspan="6" class="erro">
                    Erro ao carregar clínicas.
                </td>
            </tr>
        `;

    }

}


// ============================================================
// RESUMO DE ESPECIALIDADES DA TABELA
// ============================================================

async function carregarResumoEspecialidades(
    clinicaId
) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinica_especialidades")
            .select(`
                especialidade_id,
                especialidades (
                    nome
                )
            `)
            .eq(
                "clinica_id",
                clinicaId
            );


        if (error) {

            console.error(
                "Erro ao buscar resumo de especialidades:",
                error
            );

            return;

        }


        const elemento =
            document.querySelector(
                `.especialidades-resumo[data-clinica="${clinicaId}"]`
            );


        if (!elemento) return;


        if (!data || data.length === 0) {

            elemento.textContent = "-";

            return;

        }


        const nomes =
            data
                .map(
                    item =>
                        item.especialidades?.nome
                )
                .filter(Boolean);


        elemento.textContent =
            nomes.length > 0
                ? nomes.join(", ")
                : "-";


    } catch (erro) {

        console.error(erro);

    }

}


// ============================================================
// ABRIR MODAL NOVA CLÍNICA
// ============================================================

async function abrirModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );

    if (!modal) return;


    // Limpar formulário

    const formulario =
        document.getElementById(
            "formClinica"
        );

    if (formulario) {

        formulario.reset();

    }


    definirTexto(
        "tituloModalClinica",
        "Nova Clínica"
    );


    const id =
        document.getElementById(
            "clinicaId"
        );

    if (id) {

        id.value = "";

    }


    const areaStatus =
        document.getElementById(
            "areaStatusClinica"
        );

    if (areaStatus) {

        areaStatus.classList.add(
            "hidden"
        );

    }


    const ativo =
        document.getElementById(
            "clinicaAtivo"
        );

    if (ativo) {

        ativo.checked = true;

    }


    limparEspecialidades();


    await popularRegioesClinica();


    resetarSelect(
        "clinicaEstado",
        "Selecione um estado"
    );

    resetarSelect(
        "clinicaCidade",
        "Selecione uma cidade"
    );

    resetarSelect(
        "clinicaBairro",
        "Selecione um bairro"
    );


    adicionarLinhaEspecialidade();


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

async function editarClinica(id) {

    console.log(
        "Editando clínica:",
        id
    );


    try {

        const {
            data: clinica,
            error
        } = await supabaseClient
            .from("clinicas")
            .select("*")
            .eq("id", id)
            .single();


        if (error) {

            throw error;

        }


        if (!clinica) {

            alert(
                "Clínica não encontrada."
            );

            return;

        }


        // ----------------------------------------------------
        // ABRIR MODAL
        // ----------------------------------------------------

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


        modal.classList.remove(
            "hidden"
        );


        definirTexto(
            "tituloModalClinica",
            "Editar Clínica"
        );


        // ----------------------------------------------------
        // CAMPOS
        // ----------------------------------------------------

        definirValor(
            "clinicaId",
            clinica.id
        );

        definirValor(
            "clinicaNome",
            clinica.nome
        );

        definirValor(
            "clinicaEndereco",
            clinica.endereco
        );

        definirValor(
            "clinicaTelefone",
            clinica.telefone
        );


        const ativo =
            document.getElementById(
                "clinicaAtivo"
            );

        if (ativo) {

            ativo.checked =
                clinica.ativo === true;

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


        // ----------------------------------------------------
        // LOCALIZAÇÃO
        // ----------------------------------------------------

        await popularRegioesClinica();


        if (clinica.bairro_id) {

            const {
                data: bairro,
                error: erroBairro
            } = await supabaseClient
                .from("bairros")
                .select(`
                    id,
                    cidade_id,
                    cidades (
                        id,
                        estado_id,
                        estados (
                            id,
                            regiao_id
                        )
                    )
                `)
                .eq(
                    "id",
                    clinica.bairro_id
                )
                .single();


            if (erroBairro) {

                console.error(
                    "Erro ao carregar localização:",
                    erroBairro
                );

            } else if (bairro) {

                const cidade =
                    bairro.cidades;

                const estado =
                    cidade?.estados;


                if (estado?.regiao_id) {

                    definirValor(
                        "clinicaRegiao",
                        estado.regiao_id
                    );


                    await carregarEstadosClinica();


                    definirValor(
                        "clinicaEstado",
                        cidade.estado_id
                    );


                    await carregarCidadesClinica();


                    definirValor(
                        "clinicaCidade",
                        bairro.cidade_id
                    );


                    await carregarBairrosClinica();


                    definirValor(
                        "clinicaBairro",
                        bairro.id
                    );

                }

            }

        }


        // ----------------------------------------------------
        // ESPECIALIDADES
        // ----------------------------------------------------

        console.log(
            "Carregando especialidades da clínica..."
        );


        await carregarEspecialidadesClinica(
            clinica.id
        );


    } catch (erro) {

        console.error(
            "Erro ao editar clínica:",
            erro
        );


        alert(
            "Não foi possível carregar os dados da clínica."
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

        console.error(
            "containerEspecialidades não encontrado."
        );

        return;

    }


    container.innerHTML = `
        <div class="carregando">
            Carregando especialidades...
        </div>
    `;


    try {

        // ----------------------------------------------------
        // TODAS AS ESPECIALIDADES
        // ----------------------------------------------------

        const {
            data: especialidades,
            error: erroEspecialidades
        } = await supabaseClient
            .from("especialidades")
            .select("*")
            .order(
                "nome",
                {
                    ascending: true
                }
            );


        if (erroEspecialidades) {

            throw erroEspecialidades;

        }


        // ----------------------------------------------------
        // ESPECIALIDADES DA CLÍNICA
        // ----------------------------------------------------

        const {
            data: vinculadas,
            error: erroVinculadas
        } = await supabaseClient
            .from("clinica_especialidades")
            .select(
                "especialidade_id"
            )
            .eq(
                "clinica_id",
                clinicaId
            );


        if (erroVinculadas) {

            throw erroVinculadas;

        }


        console.log(
            "Especialidades vinculadas:",
            vinculadas
        );


        const idsVinculados =
            new Set(
                (vinculadas || []).map(
                    item =>
                        String(
                            item.especialidade_id
                        )
                )
            );


        container.innerHTML = "";


        if (
            !especialidades ||
            especialidades.length === 0
        ) {

            container.innerHTML = `
                <p class="mensagem-vazia">
                    Nenhuma especialidade cadastrada.
                </p>
            `;

            return;

        }


        // ----------------------------------------------------
        // CRIAR CHECKBOXES
        // ----------------------------------------------------

        especialidades.forEach(
            function (especialidade) {

                const linha =
                    document.createElement(
                        "div"
                    );


                linha.className =
                    "linha-especialidade";


                const marcada =
                    idsVinculados.has(
                        String(
                            especialidade.id
                        )
                    );


                linha.innerHTML = `

                    <label class="especialidade-item">

                        <input
                            type="checkbox"
                            class="checkbox-especialidade"
                            value="${especialidade.id}"
                            ${marcada ? "checked" : ""}
                        >

                        <span>
                            ${escapeHTML(
                                especialidade.nome
                            )}
                        </span>

                    </label>

                `;


                container.appendChild(
                    linha
                );

            }
        );


        console.log(
            "Especialidades carregadas no modal."
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades da clínica:",
            erro
        );


        container.innerHTML = `
            <p class="erro">
                Não foi possível carregar as especialidades.
            </p>
        `;

    }

}


// ============================================================
// LIMPAR ESPECIALIDADES
// ============================================================

function limparEspecialidades() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );

    if (container) {

        container.innerHTML = "";

    }

}


// ============================================================
// ADICIONAR LINHA DE ESPECIALIDADE
// ============================================================

async function adicionarLinhaEspecialidade() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    // Se já estamos usando checkboxes,
    // não criamos outra lista duplicada.

    const quantidade =
        container.querySelectorAll(
            ".checkbox-especialidade"
        ).length;


    if (quantidade > 0) {

        return;

    }


    await popularEspecialidades();


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

        console.error(error);

        return;

    }


    container.innerHTML = "";


    data.forEach(
        function (especialidade) {

            const linha =
                document.createElement(
                    "div"
                );


            linha.className =
                "linha-especialidade";


            linha.innerHTML = `

                <label class="especialidade-item">

                    <input
                        type="checkbox"
                        class="checkbox-especialidade"
                        value="${especialidade.id}"
                    >

                    <span>
                        ${escapeHTML(
                            especialidade.nome
                        )}
                    </span>

                </label>

            `;


            container.appendChild(
                linha
            );

        }
    );

}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(event) {

    if (event) {

        event.preventDefault();

    }


    try {

        const id =
            document.getElementById(
                "clinicaId"
            )?.value;


        const nome =
            document.getElementById(
                "clinicaNome"
            )?.value.trim();


        const endereco =
            document.getElementById(
                "clinicaEndereco"
            )?.value.trim();


        const telefone =
            document.getElementById(
                "clinicaTelefone"
            )?.value.trim();


        const bairroId =
            document.getElementById(
                "clinicaBairro"
            )?.value;


        const ativo =
            document.getElementById(
                "clinicaAtivo"
            )?.checked ?? true;


        if (!nome) {

            alert(
                "Informe o nome da clínica."
            );

            return;

        }


        if (!endereco) {

            alert(
                "Informe o endereço da clínica."
            );

            return;

        }


        if (!bairroId) {

            alert(
                "Selecione o bairro."
            );

            return;

        }


        const dados = {

            nome: nome,

            endereco: endereco,

            telefone: telefone || null,

            bairro_id: bairroId,

            ativo: ativo

        };


        let clinicaId = id;


        // ----------------------------------------------------
        // ATUALIZAR
        // ----------------------------------------------------

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("clinicas")
                .update(dados)
                .eq(
                    "id",
                    id
                );


            if (error) {

                throw error;

            }


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
                .insert([
                    dados
                ])
                .select()
                .single();


            if (error) {

                throw error;

            }


            clinicaId =
                data.id;

        }


        // ----------------------------------------------------
        // SALVAR ESPECIALIDADES
        // ----------------------------------------------------

        await salvarEspecialidadesClinica(
            clinicaId
        );


        alert(
            id
                ? "Clínica atualizada com sucesso!"
                : "Clínica cadastrada com sucesso!"
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
            "Não foi possível salvar a clínica."
        );

    }

}


// ============================================================
// SALVAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function salvarEspecialidadesClinica(
    clinicaId
) {

    const checkboxes =
        document.querySelectorAll(
            ".checkbox-especialidade:checked"
        );


    const ids =
        Array.from(
            checkboxes
        ).map(
            checkbox =>
                checkbox.value
        );


    // --------------------------------------------------------
    // APAGAR VÍNCULOS ANTIGOS
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // INSERIR NOVOS
    // --------------------------------------------------------

    if (ids.length === 0) {

        return;

    }


    const registros =
        ids.map(
            function (especialidadeId) {

                return {

                    clinica_id: clinicaId,

                    especialidade_id:
                        especialidadeId

                };

            }
        );


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
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta clínica?"
        );


    if (!confirmar) return;


    try {

        // Primeiro remove os vínculos

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


        // Depois remove a clínica

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
            "Clínica excluída com sucesso!"
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
// REGIÕES - SELECT
// ============================================================

async function popularRegioesClinica() {

    const select =
        document.getElementById(
            "clinicaRegiao"
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select("*")
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        select.innerHTML = `
            <option value="">
                Selecione uma região
            </option>
        `;


        data.forEach(
            function (regiao) {

                select.innerHTML += `
                    <option value="${regiao.id}">
                        ${escapeHTML(
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
// REGIÕES GERAL
// ============================================================

async function popularRegioes() {

    await popularRegioesClinica();

}


// ============================================================
// ESTADOS - SELECT DA CLÍNICA
// ============================================================

async function carregarEstadosClinica() {

    const regiaoId =
        document.getElementById(
            "clinicaRegiao"
        )?.value;


    const select =
        document.getElementById(
            "clinicaEstado"
        );


    if (!select) return;


    resetarSelect(
        "clinicaEstado",
        "Selecione um estado"
    );


    resetarSelect(
        "clinicaCidade",
        "Selecione uma cidade"
    );


    resetarSelect(
        "clinicaBairro",
        "Selecione um bairro"
    );


    if (!regiaoId) return;


    try {

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
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        data.forEach(
            function (estado) {

                select.innerHTML += `
                    <option value="${estado.id}">
                        ${escapeHTML(
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
// CIDADES - SELECT DA CLÍNICA
// ============================================================

async function carregarCidadesClinica() {

    const estadoId =
        document.getElementById(
            "clinicaEstado"
        )?.value;


    const select =
        document.getElementById(
            "clinicaCidade"
        );


    if (!select) return;


    resetarSelect(
        "clinicaCidade",
        "Selecione uma cidade"
    );


    resetarSelect(
        "clinicaBairro",
        "Selecione um bairro"
    );


    if (!estadoId) return;


    try {

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
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        data.forEach(
            function (cidade) {

                select.innerHTML += `
                    <option value="${cidade.id}">
                        ${escapeHTML(
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
// BAIRROS - SELECT DA CLÍNICA
// ============================================================

async function carregarBairrosClinica() {

    const cidadeId =
        document.getElementById(
            "clinicaCidade"
        )?.value;


    const select =
        document.getElementById(
            "clinicaBairro"
        );


    if (!select) return;


    resetarSelect(
        "clinicaBairro",
        "Selecione um bairro"
    );


    if (!cidadeId) return;


    try {

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
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        data.forEach(
            function (bairro) {

                select.innerHTML += `
                    <option value="${bairro.id}">
                        ${escapeHTML(
                            bairro.nome
                        )}
                    </option>
                `;

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar bairros:",
            erro
        );

    }

}


// ============================================================
// ESPECIALIDADES - SELECT / DADOS
// ============================================================

async function popularEspecialidades() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("especialidades")
            .select("*")
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


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
// LISTAR ESPECIALIDADES
// ============================================================

async function listarEspecialidades() {

    const container =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!container) return;


    container.innerHTML = `
        <div class="carregando">
            Carregando...
        </div>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("especialidades")
            .select("*")
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        if (!data || data.length === 0) {

            container.innerHTML = `
                <div class="sem-dados">
                    Nenhuma especialidade cadastrada.
                </div>
            `;

            return;

        }


        data.forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "item-gerenciamento";


                div.innerHTML = `

                    <div>
                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>
                    </div>

                    <div class="acoes-gerenciamento">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarEspecialidade('${item.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirEspecialidade('${item.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                `;


                container.appendChild(div);

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao listar especialidades:",
            erro
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
        )?.value;


    const nome =
        document.getElementById(
            "nomeEspecialidade"
        )?.value.trim();


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


        } else {

            const {
                error
            } = await supabaseClient
                .from("especialidades")
                .insert([
                    {
                        nome: nome
                    }
                ]);


            if (error) {

                throw error;

            }

        }


        limparFormularioEspecialidade();

        await listarEspecialidades();

        await carregarDashboard();


        alert(
            "Especialidade salva com sucesso!"
        );


    } catch (erro) {

        console.error(
            "Erro ao salvar especialidade:",
            erro
        );


        alert(
            "Não foi possível salvar a especialidade."
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
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


        if (error) {

            throw error;

        }


        definirValor(
            "especialidadeEditId",
            data.id
        );


        definirValor(
            "nomeEspecialidade",
            data.nome
        );


        const input =
            document.getElementById(
                "nomeEspecialidade"
            );


        if (input) {

            input.focus();

        }


    } catch (erro) {

        console.error(
            "Erro ao editar especialidade:",
            erro
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


        await listarEspecialidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir especialidade:",
            erro
        );


        alert(
            "Não foi possível excluir. Verifique se ela está vinculada a alguma clínica."
        );

    }

}


// ============================================================
// REGIÕES - LISTAGEM
// ============================================================

async function listarRegioes() {

    const container =
        document.getElementById(
            "listaRegioes"
        );


    if (!container) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select("*")
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "item-gerenciamento";


                div.innerHTML = `

                    <strong>
                        ${escapeHTML(
                            item.nome
                        )}
                    </strong>

                    <div class="acoes-gerenciamento">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarRegiao('${item.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirRegiao('${item.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                `;


                container.appendChild(div);

            }
        );


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

    const id =
        document.getElementById(
            "regiaoEditId"
        )?.value;


    const nome =
        document.getElementById(
            "nomeRegiao"
        )?.value.trim();


    if (!nome) {

        alert(
            "Informe o nome da região."
        );

        return;

    }


    try {

        const dados = {
            nome: nome
        };


        if (id) {

            const {
                error
            } = await supabaseClient
                .from("regioes")
                .update(dados)
                .eq(
                    "id",
                    id
                );


            if (error) {

                throw error;

            }

        } else {

            const {
                error
            } = await supabaseClient
                .from("regioes")
                .insert([
                    dados
                ]);


            if (error) {

                throw error;

            }

        }


        limparFormularioRegiao();

        await listarRegioes();

        await popularRegioesClinica();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar região:",
            erro
        );


        alert(
            "Não foi possível salvar a região."
        );

    }

}


// ============================================================
// EDITAR REGIÃO
// ============================================================

async function editarRegiao(id) {

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

        console.error(error);

        return;

    }


    definirValor(
        "regiaoEditId",
        data.id
    );


    definirValor(
        "nomeRegiao",
        data.nome
    );

}


// ============================================================
// EXCLUIR REGIÃO
// ============================================================

async function excluirRegiao(id) {

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

        await popularRegioesClinica();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível excluir a região. Verifique se existem estados vinculados."
        );

    }

}


// ============================================================
// ESTADOS - LISTAGEM
// ============================================================

async function listarEstados() {

    const container =
        document.getElementById(
            "listaEstados"
        );


    if (!container) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select(`
                *,
                regioes (
                    nome
                )
            `)
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "item-gerenciamento";


                div.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                item.regioes?.nome || "-"
                            )}
                        </small>

                    </div>

                    <div class="acoes-gerenciamento">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarEstado('${item.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirEstado('${item.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                `;


                container.appendChild(div);

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao listar estados:",
            erro
        );

    }

}


// ============================================================
// POPULAR ESTADOS
// ============================================================

async function popularEstados() {

    const select =
        document.getElementById(
            "estadoRegiao"
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("regioes")
            .select("*")
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        select.innerHTML = `
            <option value="">
                Selecione uma região
            </option>
        `;


        data.forEach(
            function (regiao) {

                select.innerHTML += `
                    <option value="${regiao.id}">
                        ${escapeHTML(
                            regiao.nome
                        )}
                    </option>
                `;

            }
        );


    } catch (erro) {

        console.error(
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
        )?.value;


    const nome =
        document.getElementById(
            "nomeEstado"
        )?.value.trim();


    const regiaoId =
        document.getElementById(
            "estadoRegiao"
        )?.value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha o nome e a região."
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

        } else {

            const {
                error
            } = await supabaseClient
                .from("estados")
                .insert([
                    dados
                ]);


            if (error) {

                throw error;

            }

        }


        limparFormularioEstado();

        await listarEstados();

        await popularEstados();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível salvar o estado."
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


        definirValor(
            "estadoEditId",
            data.id
        );


        definirValor(
            "nomeEstado",
            data.nome
        );


        definirValor(
            "estadoRegiao",
            data.regiao_id
        );


    } catch (erro) {

        console.error(
            erro
        );

    }

}


// ============================================================
// EXCLUIR ESTADO
// ============================================================

async function excluirEstado(id) {

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

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível excluir o estado. Verifique se existem cidades vinculadas."
        );

    }

}


// ============================================================
// CIDADES - LISTAGEM
// ============================================================

async function listarCidades() {

    const container =
        document.getElementById(
            "listaCidades"
        );


    if (!container) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select(`
                *,
                estados (
                    nome
                )
            `)
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "item-gerenciamento";


                div.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                item.estados?.nome || "-"
                            )}
                        </small>

                    </div>

                    <div class="acoes-gerenciamento">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarCidade('${item.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirCidade('${item.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                `;


                container.appendChild(div);

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao listar cidades:",
            erro
        );

    }

}


// ============================================================
// POPULAR CIDADES
// ============================================================

async function popularCidades() {

    const select =
        document.getElementById(
            "cidadeEstado"
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("estados")
            .select("*")
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        select.innerHTML = `
            <option value="">
                Selecione um estado
            </option>
        `;


        data.forEach(
            function (estado) {

                select.innerHTML += `
                    <option value="${estado.id}">
                        ${escapeHTML(
                            estado.nome
                        )}
                    </option>
                `;

            }
        );


    } catch (erro) {

        console.error(
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
        )?.value;


    const nome =
        document.getElementById(
            "nomeCidade"
        )?.value.trim();


    const estadoId =
        document.getElementById(
            "cidadeEstado"
        )?.value;


    if (!nome || !estadoId) {

        alert(
            "Preencha o nome e o estado."
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

        } else {

            const {
                error
            } = await supabaseClient
                .from("cidades")
                .insert([
                    dados
                ]);


            if (error) {

                throw error;

            }

        }


        limparFormularioCidade();

        await listarCidades();

        await popularCidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível salvar a cidade."
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


        definirValor(
            "cidadeEditId",
            data.id
        );


        definirValor(
            "nomeCidade",
            data.nome
        );


        definirValor(
            "cidadeEstado",
            data.estado_id
        );


    } catch (erro) {

        console.error(
            erro
        );

    }

}


// ============================================================
// EXCLUIR CIDADE
// ============================================================

async function excluirCidade(id) {

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

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível excluir a cidade. Verifique se existem bairros vinculados."
        );

    }

}


// ============================================================
// BAIRROS - LISTAGEM
// ============================================================

async function listarBairros() {

    const container =
        document.getElementById(
            "listaBairros"
        );


    if (!container) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select(`
                *,
                cidades (
                    nome
                )
            `)
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "item-gerenciamento";


                div.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                item.cidades?.nome || "-"
                            )}
                        </small>

                    </div>

                    <div class="acoes-gerenciamento">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarBairro('${item.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirBairro('${item.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                `;


                container.appendChild(div);

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao listar bairros:",
            erro
        );

    }

}


// ============================================================
// POPULAR BAIRROS
// ============================================================

async function popularBairros() {

    const select =
        document.getElementById(
            "bairroCidade"
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cidades")
            .select("*")
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        select.innerHTML = `
            <option value="">
                Selecione uma cidade
            </option>
        `;


        data.forEach(
            function (cidade) {

                select.innerHTML += `
                    <option value="${cidade.id}">
                        ${escapeHTML(
                            cidade.nome
                        )}
                    </option>
                `;

            }
        );


    } catch (erro) {

        console.error(
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
        )?.value;


    const nome =
        document.getElementById(
            "nomeBairro"
        )?.value.trim();


    const cidadeId =
        document.getElementById(
            "bairroCidade"
        )?.value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha o nome e a cidade."
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

        } else {

            const {
                error
            } = await supabaseClient
                .from("bairros")
                .insert([
                    dados
                ]);


            if (error) {

                throw error;

            }

        }


        limparFormularioBairro();

        await listarBairros();

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível salvar o bairro."
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


        definirValor(
            "bairroEditId",
            data.id
        );


        definirValor(
            "nomeBairro",
            data.nome
        );


        definirValor(
            "bairroCidade",
            data.cidade_id
        );


    } catch (erro) {

        console.error(
            erro
        );

    }

}


// ============================================================
// EXCLUIR BAIRRO
// ============================================================

async function excluirBairro(id) {

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
            erro
        );


        alert(
            "Não foi possível excluir o bairro. Verifique se ele está vinculado a alguma clínica."
        );

    }

}


// ============================================================
// LIMPAR FORMULÁRIOS
// ============================================================

function limparFormularioEspecialidade() {

    definirValor(
        "especialidadeEditId",
        ""
    );

    definirValor(
        "nomeEspecialidade",
        ""
    );

}


function limparFormularioRegiao() {

    definirValor(
        "regiaoEditId",
        ""
    );

    definirValor(
        "nomeRegiao",
        ""
    );

}


function limparFormularioEstado() {

    definirValor(
        "estadoEditId",
        ""
    );

    definirValor(
        "nomeEstado",
        ""
    );

    definirValor(
        "estadoRegiao",
        ""
    );

}


function limparFormularioCidade() {

    definirValor(
        "cidadeEditId",
        ""
    );

    definirValor(
        "nomeCidade",
        ""
    );

    definirValor(
        "cidadeEstado",
        ""
    );

}


function limparFormularioBairro() {

    definirValor(
        "bairroEditId",
        ""
    );

    definirValor(
        "nomeBairro",
        ""
    );

    definirValor(
        "bairroCidade",
        ""
    );

}


// ============================================================
// TEMA
// ============================================================

function alternarTema() {

    document.body.classList.toggle(
        "dark"
    );


    const temaEscuro =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "tema",
        temaEscuro
            ? "dark"
            : "light"
    );

}


function carregarTema() {

    const tema =
        localStorage.getItem(
            "tema"
        );


    if (tema === "dark") {

        document.body.classList.add(
            "dark"
        );

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

    const confirmar =
        confirm(
            "Deseja realmente sair do painel?"
        );


    if (!confirmar) return;


    // Se futuramente houver autenticação
    // do Supabase, podemos adicionar:
    //
    // await supabaseClient.auth.signOut();


    window.location.href =
        "index.html";

}


// ============================================================
// UTILITÁRIOS
// ============================================================

function definirValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.value =
            valor ?? "";

    }

}


function resetarSelect(
    id,
    texto
) {

    const select =
        document.getElementById(id);


    if (!select) return;


    select.innerHTML = `

        <option value="">
            ${texto}
        </option>

    `;

}


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
// FECHAR MODAL CLICANDO FORA
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "modalClinica"
            );


        if (!modal) return;


        if (
            event.target === modal
        ) {

            fecharModalClinica();

        }

    }
);


// ============================================================
// ESC PARA FECHAR MODAL
// ============================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            fecharModalClinica();

        }

    }
);


// ============================================================
// FIM DO ADMIN.JS
// ============================================================

console.log(
    "admin.js carregado completamente."
);
