// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO - REDE ESPECIALISTAS
// ============================================================

console.log("admin.js carregado");


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const NOME_REDE = "Rede Especialistas";


// ============================================================
// VERIFICAR SUPABASE
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

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Painel administrativo iniciado."
        );

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

    }
);


// ============================================================
// NAVEGAÇÃO
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

        paginaSelecionada.classList.add(
            "ativa"
        );

    }


    const botaoSelecionado =
        document.querySelector(
            `.menu-btn[data-pagina="${pagina}"]`
        );


    if (botaoSelecionado) {

        botaoSelecionado.classList.add(
            "ativo"
        );

    }


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
// DATA
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

        console.log(
            "Carregando dashboard..."
        );


        // ----------------------------------------------------
        // TOTAL CLÍNICAS
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
        // ATIVAS
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


        const total =
            totalClinicas || 0;

        const ativas =
            totalAtivas || 0;

        const inativas =
            total - ativas;


        // ----------------------------------------------------
        // CARDS
        // ----------------------------------------------------

        definirTexto(
            "totalClinicas",
            total
        );


        definirTexto(
            "totalClinicasAtivas",
            ativas
        );


        definirTexto(
            "totalClinicasInativas",
            inativas
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
        // PORCENTAGEM
        // ----------------------------------------------------

        let porcentagem = 0;


        if (total > 0) {

            porcentagem =
                Math.round(
                    (ativas / total) * 100
                );

        }


        definirTexto(
            "porcentagemAtivas",
            porcentagem + "%"
        );


        definirTexto(
            "legendaAtivas",
            ativas
        );


        definirTexto(
            "legendaInativas",
            inativas
        );


        const barra =
            document.getElementById(
                "barraAtivas"
            );


        if (barra) {

            barra.style.width =
                porcentagem + "%";

        }


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
// DEFINIR TEXTO
// ============================================================

function definirTexto(id, valor) {

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
                ativo
            `)
            .order(
                "nome",
                {
                    ascending: true
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
                <div class="vazio">
                    Nenhuma clínica cadastrada.
                </div>
            `;

            return;

        }


        container.innerHTML = "";


        data.forEach(
            function (clinica) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-ultima-clinica";


                item.innerHTML = `

                    <div class="ultima-clinica-icone">
                        🏥
                    </div>

                    <div class="ultima-clinica-info">

                        <strong>
                            ${escapeHTML(
                                clinica.nome ||
                                "Sem nome"
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                clinica.endereco ||
                                "-"
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


                container.appendChild(
                    item
                );

            }
        );


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


        if (
            filtroStatus !== undefined &&
            filtroStatus !== ""
        ) {

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


        if (
            !data ||
            data.length === 0
        ) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="6" class="sem-dados">
                        Nenhuma clínica encontrada.
                    </td>
                </tr>
            `;

            return;

        }


        for (
            const clinica of data
        ) {

            const linha =
                document.createElement(
                    "tr"
                );


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


                if (partes.length) {

                    localizacao =
                        partes.join(
                            " - "
                        );

                }

            }


            // Buscar especialidades
            // da clínica

            const especialidades =
                await obterEspecialidadesClinica(
                    clinica.id
                );


            const nomesEspecialidades =
                especialidades
                    .map(
                        item =>
                            item.nome
                    );


            let textoEspecialidades =
                "-";


            if (
                nomesEspecialidades.length
            ) {

                textoEspecialidades =
                    nomesEspecialidades.join(
                        ", "
                    );

            }


            const status =
                clinica.ativo
                    ? "Ativa"
                    : "Inativa";


            const classeStatus =
                clinica.ativo
                    ? "status-ativa"
                    : "status-inativa";


            linha.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            clinica.nome ||
                            "-"
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        localizacao
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        clinica.telefone ||
                        "-"
                    )}
                </td>

                <td>
                    <span class="especialidades-tabela">
                        ${escapeHTML(
                            textoEspecialidades
                        )}
                    </span>
                </td>

                <td>
                    <span class="status-mini ${classeStatus}">
                        ${status}
                    </span>
                </td>

                <td>

                    <div class="acoes-tabela">

                        <button
                            type="button"
                            class="btn-acao btn-editar"
                            onclick="editarClinica('${clinica.id}')"
                            title="Editar clínica"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-acao btn-excluir"
                            onclick="excluirClinica('${clinica.id}')"
                            title="Excluir clínica"
                        >
                            🗑️
                        </button>

                    </div>

                </td>
            `;


            tabela.appendChild(
                linha
            );

        }


    } catch (erro) {

        console.error(
            "Erro ao listar clínicas:",
            erro
        );


        tabela.innerHTML = `
            <tr>
                <td colspan="6" class="erro">
                    Não foi possível carregar as clínicas.
                </td>
            </tr>
        `;

    }

}


// ============================================================
// OBTER ESPECIALIDADES DA CLÍNICA
// ============================================================

async function obterEspecialidadesClinica(
    clinicaId
) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .select(
                "especialidade_id"
            )
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
            !data.length
        ) {

            return [];

        }


        const ids =
            data.map(
                item =>
                    item.especialidade_id
            );


        const resultado =
            await supabaseClient
                .from(
                    "especialidades"
                )
                .select(
                    "id, nome"
                )
                .in(
                    "id",
                    ids
                )
                .order(
                    "nome",
                    {
                        ascending: true
                    }
                );


        if (resultado.error) {

            throw resultado.error;

        }


        return resultado.data || [];


    } catch (erro) {

        console.error(
            "Erro ao buscar especialidades da clínica:",
            erro
        );


        return [];

    }

}


// ============================================================
// MODAL CLÍNICA
// ============================================================

async function abrirModalClinica(
    id = null
) {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) return;


    limparFormularioClinica();


    await popularEspecialidades();


    if (id) {

        await editarClinica(id);

        return;

    }


    const titulo =
        document.getElementById(
            "tituloModalClinica"
        );


    if (titulo) {

        titulo.textContent =
            "Nova Clínica";

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


    limparFormularioClinica();

}


// ============================================================
// LIMPAR FORMULÁRIO
// ============================================================

function limparFormularioClinica() {

    const form =
        document.getElementById(
            "formClinica"
        );


    if (form) {

        form.reset();

    }


    definirValor(
        "clinicaId",
        ""
    );


    definirValor(
        "clinicaNome",
        ""
    );


    definirValor(
        "clinicaEndereco",
        ""
    );


    definirValor(
        "clinicaTelefone",
        ""
    );


    definirValor(
        "clinicaRegiao",
        ""
    );


    definirValor(
        "clinicaEstado",
        ""
    );


    definirValor(
        "clinicaCidade",
        ""
    );


    definirValor(
        "clinicaBairro",
        ""
    );


    const ativo =
        document.getElementById(
            "clinicaAtivo"
        );


    if (ativo) {

        ativo.checked = true;

    }


    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (container) {

        container.innerHTML = "";

    }

}


// ============================================================
// EDITAR CLÍNICA
// ============================================================

async function editarClinica(id) {

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


        if (!clinica) {

            alert(
                "Clínica não encontrada."
            );

            return;

        }


        const modal =
            document.getElementById(
                "modalClinica"
            );


        if (!modal) return;


        limparFormularioClinica();


        await popularRegioes();

        await popularEstados();

        await popularCidades();

        await popularBairros();

        await popularEspecialidades();


        definirValor(
            "clinicaId",
            clinica.id
        );


        definirValor(
            "clinicaNome",
            clinica.nome || ""
        );


        definirValor(
            "clinicaEndereco",
            clinica.endereco || ""
        );


        definirValor(
            "clinicaTelefone",
            clinica.telefone || ""
        );


        // ----------------------------------------------------
        // LOCALIZAÇÃO
        // ----------------------------------------------------

        if (clinica.bairro_id) {

            const {
                data: bairro,
                error: erroBairro
            } = await supabaseClient
                .from("bairros")
                .select(`
                    id,
                    nome,
                    cidade_id
                `)
                .eq(
                    "id",
                    clinica.bairro_id
                )
                .single();


            if (
                !erroBairro &&
                bairro
            ) {

                const {
                    data: cidade
                } = await supabaseClient
                    .from("cidades")
                    .select(`
                        id,
                        nome,
                        estado_id
                    `)
                    .eq(
                        "id",
                        bairro.cidade_id
                    )
                    .single();


                if (cidade) {

                    const {
                        data: estado
                    } = await supabaseClient
                        .from("estados")
                        .select(`
                            id,
                            nome,
                            regiao_id
                        `)
                        .eq(
                            "id",
                            cidade.estado_id
                        )
                        .single();


                    if (estado) {

                        definirValor(
                            "clinicaRegiao",
                            estado.regiao_id
                        );


                        await carregarEstadosClinica(
                            estado.regiao_id
                        );


                        definirValor(
                            "clinicaEstado",
                            estado.id
                        );


                        await carregarCidadesClinica(
                            estado.id
                        );


                        definirValor(
                            "clinicaCidade",
                            cidade.id
                        );


                        await carregarBairrosClinica(
                            cidade.id
                        );


                        definirValor(
                            "clinicaBairro",
                            bairro.id
                        );

                    }

                }

            }

        }


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        const ativo =
            document.getElementById(
                "clinicaAtivo"
            );


        if (ativo) {

            ativo.checked =
                !!clinica.ativo;

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


        const titulo =
            document.getElementById(
                "tituloModalClinica"
            );


        if (titulo) {

            titulo.textContent =
                "Editar Clínica";

        }


        // ----------------------------------------------------
        // ESPECIALIDADES
        // ----------------------------------------------------

        await carregarEspecialidadesClinicaNoModal(
            clinica.id
        );


        modal.classList.remove(
            "hidden"
        );


    } catch (erro) {

        console.error(
            "Erro ao editar clínica:",
            erro
        );


        alert(
            "Não foi possível carregar a clínica."
        );

    }

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


    if (!container) return;


    container.innerHTML = `
        <div class="carregando">
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
            .select(
                "especialidade_id"
            )
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


        container.innerHTML = "";


        if (
            data &&
            data.length
        ) {

            for (
                const item of data
            ) {

                adicionarLinhaEspecialidade(
                    item.especialidade_id
                );

            }

        } else {

            adicionarLinhaEspecialidade();

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades da clínica:",
            erro
        );


        container.innerHTML = "";


        adicionarLinhaEspecialidade();

    }

}


// ============================================================
// ADICIONAR LINHA DE ESPECIALIDADE
// ============================================================

function adicionarLinhaEspecialidade(
    especialidadeId = ""
) {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!container) return;


    const linha =
        document.createElement(
            "div"
        );


    linha.className =
        "linha-especialidade";


    const select =
        document.createElement(
            "select"
        );


    select.className =
        "select-especialidade";


    select.innerHTML = `
        <option value="">
            Selecione uma especialidade
        </option>
    `;


    const opcoes =
        window.listaEspecialidades ||
        [];


    opcoes.forEach(
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
                ) === String(
                    especialidadeId
                )
            ) {

                option.selected =
                    true;

            }


            select.appendChild(
                option
            );

        }
    );


    const botao =
        document.createElement(
            "button"
        );


    botao.type =
        "button";


    botao.className =
        "btn-remover-especialidade";


    botao.title =
        "Remover especialidade";


    botao.innerHTML =
        "🗑️";


    botao.onclick =
        function () {

            linha.remove();

        };


    linha.appendChild(
        select
    );


    linha.appendChild(
        botao
    );


    container.appendChild(
        linha
    );

}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(event) {

    event.preventDefault();


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
                "Selecione o bairro da clínica."
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


        // ====================================================
        // ATUALIZAR
        // ====================================================

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


        // ====================================================
        // INSERIR
        // ====================================================

        else {

            const {
                data,
                error
            } = await supabaseClient
                .from("clinicas")
                .insert(
                    dados
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
        // ESPECIALIDADES
        // ====================================================

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

    // --------------------------------------------------------
    // APAGAR RELACIONAMENTOS ATUAIS
    // --------------------------------------------------------

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


    const selects =
        document.querySelectorAll(
            "#containerEspecialidades .select-especialidade"
        );


    const ids = [];


    selects.forEach(
        function (select) {

            if (
                select.value &&
                !ids.includes(
                    select.value
                )
            ) {

                ids.push(
                    select.value
                );

            }

        }
    );


    if (!ids.length) {

        return;

    }


    const registros =
        ids.map(
            function (id) {

                return {

                    clinica_id:
                        clinicaId,

                    especialidade_id:
                        id,

                    rede:
                        NOME_REDE,

                    ativo:
                        true

                };

            }
        );


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
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta clínica?"
        );


    if (!confirmar) return;


    try {

        // Primeiro remove especialidades
        // relacionadas

        const {
            error:
                erroRelacionamentos
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
            erroRelacionamentos
        ) {

            throw erroRelacionamentos;

        }


        // Depois exclui a clínica

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
// POPULAR ESPECIALIDADES
// ============================================================

async function popularEspecialidades() {

    try {

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
            .order(
                "nome",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        window.listaEspecialidades =
            data || [];


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades:",
            erro
        );


        window.listaEspecialidades =
            [];

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


    try {

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
            .order(
                "nome",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        window.listaEspecialidades =
            data || [];


        container.innerHTML = "";


        if (
            !data ||
            !data.length
        ) {

            container.innerHTML = `
                <div class="vazio">
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
                        🦷
                        <strong>
                            ${escapeHTML(
                                item.nome
                            )}
                        </strong>
                    </div>

                    <div class="acoes-tabela">

                        <button
                            type="button"
                            class="btn-acao btn-editar"
                            onclick="editarEspecialidade('${item.id}')"
                            title="Editar"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-acao btn-excluir"
                            onclick="excluirEspecialidade('${item.id}')"
                            title="Excluir"
                        >
                            🗑️
                        </button>

                    </div>
                `;


                container.appendChild(
                    div
                );

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
                .from(
                    "especialidades"
                )
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
                .from(
                    "especialidades"
                )
                .insert({
                    nome: nome
                });


            if (error) {

                throw error;

            }

        }


        definirValor(
            "nomeEspecialidade",
            ""
        );


        definirValor(
            "especialidadeEditId",
            ""
        );


        await listarEspecialidades();

        await popularEspecialidades();

        await carregarDashboard();


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
            .from(
                "especialidades"
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


        mostrarPagina(
            "especialidades"
        );


    } catch (erro) {

        console.error(
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

        await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .delete()
            .eq(
                "especialidade_id",
                id
            );


        const {
            error
        } = await supabaseClient
            .from(
                "especialidades"
            )
            .delete()
            .eq(
                "id",
                id
            );


        if (error) {

            throw error;

        }


        await listarEspecialidades();

        await popularEspecialidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir especialidade:",
            erro
        );


        alert(
            "Não foi possível excluir a especialidade."
        );

    }

}


// ============================================================
// POPULAR REGIÕES
// ============================================================

async function popularRegioes() {

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


        preencherSelect(
            "estadoRegiao",
            data,
            "Selecione uma região"
        );


        preencherSelect(
            "clinicaRegiao",
            data,
            "Selecione uma região"
        );


    } catch (erro) {

        console.error(
            "Erro ao popular regiões:",
            erro
        );

    }

}


// ============================================================
// POPULAR ESTADOS
// ============================================================

async function popularEstados() {

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
                "nome",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        preencherSelect(
            "cidadeEstado",
            data,
            "Selecione um estado"
        );


        preencherSelect(
            "clinicaEstado",
            data,
            "Selecione um estado"
        );


    } catch (erro) {

        console.error(
            "Erro ao popular estados:",
            erro
        );

    }

}


// ============================================================
// POPULAR CIDADES
// ============================================================

async function popularCidades() {

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
                "nome",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        preencherSelect(
            "bairroCidade",
            data,
            "Selecione uma cidade"
        );


        preencherSelect(
            "clinicaCidade",
            data,
            "Selecione uma cidade"
        );


    } catch (erro) {

        console.error(
            "Erro ao popular cidades:",
            erro
        );

    }

}


// ============================================================
// POPULAR BAIRROS
// ============================================================

async function popularBairros() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bairros")
            .select(
                "id, nome, cidade_id"
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


        window.listaBairros =
            data || [];


    } catch (erro) {

        console.error(
            "Erro ao popular bairros:",
            erro
        );

    }

}


// ============================================================
// CASCATA - ESTADOS DA CLÍNICA
// ============================================================

async function carregarEstadosClinica(
    regiaoId = null
) {

    const select =
        document.getElementById(
            "clinicaEstado"
        );


    if (!select) return;


    const valorRegiao =
        regiaoId ||
        document.getElementById(
            "clinicaRegiao"
        )?.value;


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    if (!valorRegiao) {

        return;

    }


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
                valorRegiao
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


        preencherSelectElement(
            select,
            data,
            "Selecione um estado"
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar estados:",
            erro
        );

    }

}


// ============================================================
// CASCATA - CIDADES DA CLÍNICA
// ============================================================

async function carregarCidadesClinica(
    estadoId = null
) {

    const select =
        document.getElementById(
            "clinicaCidade"
        );


    if (!select) return;


    const valorEstado =
        estadoId ||
        document.getElementById(
            "clinicaEstado"
        )?.value;


    select.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


    const bairro =
        document.getElementById(
            "clinicaBairro"
        );


    if (bairro) {

        bairro.innerHTML = `
            <option value="">
                Selecione um bairro
            </option>
        `;

    }


    if (!valorEstado) {

        return;

    }


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
                valorEstado
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


        preencherSelectElement(
            select,
            data,
            "Selecione uma cidade"
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
            erro
        );

    }

}


// ============================================================
// CASCATA - BAIRROS DA CLÍNICA
// ============================================================

async function carregarBairrosClinica(
    cidadeId = null
) {

    const select =
        document.getElementById(
            "clinicaBairro"
        );


    if (!select) return;


    const valorCidade =
        cidadeId ||
        document.getElementById(
            "clinicaCidade"
        )?.value;


    select.innerHTML = `
        <option value="">
            Selecione um bairro
        </option>
    `;


    if (!valorCidade) {

        return;

    }


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
                valorCidade
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


        preencherSelectElement(
            select,
            data,
            "Selecione um bairro"
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar bairros:",
            erro
        );

    }

}


// ============================================================
// LISTAR REGIÕES
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
            .select(
                "id, nome"
            )
            .order(
                "nome"
            );


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(
            function (item) {

                container.innerHTML += `
                    <div class="item-gerenciamento">

                        <div>
                            🌎
                            <strong>
                                ${escapeHTML(
                                    item.nome
                                )}
                            </strong>
                        </div>

                        <div class="acoes-tabela">

                            <button
                                class="btn-acao btn-editar"
                                onclick="editarRegiao('${item.id}')"
                            >
                                ✏️
                            </button>

                            <button
                                class="btn-acao btn-excluir"
                                onclick="excluirRegiao('${item.id}')"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>
                `;

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

            await supabaseClient
                .from("regioes")
                .update(dados)
                .eq(
                    "id",
                    id
                );

        } else {

            await supabaseClient
                .from("regioes")
                .insert(dados);

        }


        definirValor(
            "nomeRegiao",
            ""
        );


        definirValor(
            "regiaoEditId",
            ""
        );


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


// ============================================================
// EDITAR REGIÃO
// ============================================================

async function editarRegiao(id) {

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


    mostrarPagina(
        "regioes"
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

        await popularRegioes();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível excluir a região."
        );

    }

}


// ============================================================
// LISTAR ESTADOS
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

            throw error;

        }


        container.innerHTML = "";


        data.forEach(
            function (item) {

                container.innerHTML += `
                    <div class="item-gerenciamento">

                        <div>

                            📍

                            <strong>
                                ${escapeHTML(
                                    item.nome
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    item.regioes?.nome ||
                                    "-"
                                )}
                            </small>

                        </div>

                        <div class="acoes-tabela">

                            <button
                                class="btn-acao btn-editar"
                                onclick="editarEstado('${item.id}')"
                            >
                                ✏️
                            </button>

                            <button
                                class="btn-acao btn-excluir"
                                onclick="excluirEstado('${item.id}')"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>
                `;

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

            regiao_id:
                regiaoId

        };


        if (id) {

            await supabaseClient
                .from("estados")
                .update(dados)
                .eq(
                    "id",
                    id
                );

        } else {

            await supabaseClient
                .from("estados")
                .insert(dados);

        }


        definirValor(
            "nomeEstado",
            ""
        );


        definirValor(
            "estadoRegiao",
            ""
        );


        definirValor(
            "estadoEditId",
            ""
        );


        await listarEstados();

        await popularEstados();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );

    }

}


// ============================================================
// EDITAR ESTADO
// ============================================================

async function editarEstado(id) {

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

        console.error(error);

        return;

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


    mostrarPagina(
        "estados"
    );

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
            "Não foi possível excluir o estado."
        );

    }

}


// ============================================================
// LISTAR CIDADES
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

            throw error;

        }


        container.innerHTML = "";


        data.forEach(
            function (item) {

                container.innerHTML += `
                    <div class="item-gerenciamento">

                        <div>

                            🏙️

                            <strong>
                                ${escapeHTML(
                                    item.nome
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    item.estados?.nome ||
                                    "-"
                                )}
                            </small>

                        </div>

                        <div class="acoes-tabela">

                            <button
                                class="btn-acao btn-editar"
                                onclick="editarCidade('${item.id}')"
                            >
                                ✏️
                            </button>

                            <button
                                class="btn-acao btn-excluir"
                                onclick="excluirCidade('${item.id}')"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>
                `;

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

            estado_id:
                estadoId

        };


        if (id) {

            await supabaseClient
                .from("cidades")
                .update(dados)
                .eq(
                    "id",
                    id
                );

        } else {

            await supabaseClient
                .from("cidades")
                .insert(dados);

        }


        definirValor(
            "nomeCidade",
            ""
        );


        definirValor(
            "cidadeEstado",
            ""
        );


        definirValor(
            "cidadeEditId",
            ""
        );


        await listarCidades();

        await popularCidades();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );

    }

}


// ============================================================
// EDITAR CIDADE
// ============================================================

async function editarCidade(id) {

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

        console.error(error);

        return;

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


    mostrarPagina(
        "cidades"
    );

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
            "Não foi possível excluir a cidade."
        );

    }

}


// ============================================================
// LISTAR BAIRROS
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

            throw error;

        }


        container.innerHTML = "";


        data.forEach(
            function (item) {

                container.innerHTML += `
                    <div class="item-gerenciamento">

                        <div>

                            🏘️

                            <strong>
                                ${escapeHTML(
                                    item.nome
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    item.cidades?.nome ||
                                    "-"
                                )}
                            </small>

                        </div>

                        <div class="acoes-tabela">

                            <button
                                class="btn-acao btn-editar"
                                onclick="editarBairro('${item.id}')"
                            >
                                ✏️
                            </button>

                            <button
                                class="btn-acao btn-excluir"
                                onclick="excluirBairro('${item.id}')"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>
                `;

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

            cidade_id:
                cidadeId

        };


        if (id) {

            await supabaseClient
                .from("bairros")
                .update(dados)
                .eq(
                    "id",
                    id
                );

        } else {

            await supabaseClient
                .from("bairros")
                .insert(dados);

        }


        definirValor(
            "nomeBairro",
            ""
        );


        definirValor(
            "bairroCidade",
            ""
        );


        definirValor(
            "bairroEditId",
            ""
        );


        await listarBairros();

        await popularBairros();

        await carregarDashboard();


    } catch (erro) {

        console.error(
            erro
        );

    }

}


// ============================================================
// EDITAR BAIRRO
// ============================================================

async function editarBairro(id) {

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

        console.error(error);

        return;

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


    mostrarPagina(
        "bairros"
    );

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
            "Não foi possível excluir o bairro."
        );

    }

}


// ============================================================
// TEMA
// ============================================================

function alternarTema() {

    document.body.classList.toggle(
        "dark"
    );


    const escuro =
        document.body.classList.contains(
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
// CARREGAR TEMA
// ============================================================

function carregarTema() {

    const tema =
        localStorage.getItem(
            "temaAdmin"
        );


    if (tema === "dark") {

        document.body.classList.add(
            "dark"
        );

    } else {

        document.body.classList.remove(
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
            "Deseja sair do painel administrativo?"
        );


    if (!confirmar) return;


    // Caso futuramente exista
    // autenticação, podemos
    // adicionar signOut aqui.

    window.location.href =
        "login.html";

}


// ============================================================
// PREENCHER SELECT
// ============================================================

function preencherSelect(
    id,
    dados,
    textoPadrao
) {

    const select =
        document.getElementById(
            id
        );


    if (!select) return;


    preencherSelectElement(
        select,
        dados,
        textoPadrao
    );

}


// ============================================================
// PREENCHER SELECT ELEMENT
// ============================================================

function preencherSelectElement(
    select,
    dados,
    textoPadrao
) {

    if (!select) return;


    select.innerHTML = "";


    const primeira =
        document.createElement(
            "option"
        );


    primeira.value = "";

    primeira.textContent =
        textoPadrao;


    select.appendChild(
        primeira
    );


    if (!dados) return;


    dados.forEach(
        function (item) {

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

        }
    );

}


// ============================================================
// DEFINIR VALOR
// ============================================================

function definirValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.value =
            valor ?? "";

    }

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escapeHTML(
    valor
) {

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
// FECHAR MODAL AO CLICAR FORA
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
// ESC
// ============================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            const modal =
                document.getElementById(
                    "modalClinica"
                );


            if (
                modal &&
                !modal.classList.contains(
                    "hidden"
                )
            ) {

                fecharModalClinica();

            }

        }

    }
);


console.log(
    "admin.js carregado completamente."
);
