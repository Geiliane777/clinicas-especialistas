// ============================================================
// ADMIN.JS
// REDE ESPECIALISTAS
// PARTE 1/2
// ============================================================

console.log("admin.js carregado");

const NOME_REDE = "Rede Especialistas";

let clinicaEditandoId = null;


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    try {

        carregarTema();
        atualizarData();

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
        .forEach(botao => {

            botao.classList.remove("ativo");

            if (
                botao.dataset.pagina ===
                nomePagina
            ) {
                botao.classList.add("ativo");
            }

        });


    const titulo =
        document.getElementById("tituloPagina");


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina] ||
            nomePagina;

    }


    switch (nomePagina) {

        case "dashboard":
            await carregarDashboard();
            break;

        case "clinicas":
            await carregarPaginaClinicas();
            break;

        case "especialidades":
            await carregarPaginaEspecialidades();
            break;

        case "regioes":
            await carregarPaginaRegioes();
            break;

        case "estados":
            await carregarPaginaEstados();
            break;

        case "cidades":
            await carregarPaginaCidades();
            break;

        case "bairros":
            await carregarPaginaBairros();
            break;

    }

}


// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        const [
            clinicasResult,
            especialidadesResult,
            regioesResult,
            estadosResult,
            cidadesResult,
            bairrosResult
        ] = await Promise.all([

            supabaseClient
                .from("clinicas")
                .select("id, ativo"),

            supabaseClient
                .from("especialidades")
                .select("id"),

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


        if (clinicasResult.error) {
            throw clinicasResult.error;
        }


        if (especialidadesResult.error) {
            throw especialidadesResult.error;
        }


        const clinicas =
            clinicasResult.data || [];


        const totalClinicas =
            clinicas.length;


        const clinicasAtivas =
            clinicas.filter(
                clinica => clinica.ativo === true
            ).length;


        const clinicasInativas =
            clinicas.filter(
                clinica => clinica.ativo !== true
            ).length;


        const totalEspecialidades =
            (especialidadesResult.data || []).length;


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
                    (clinicasAtivas / totalClinicas) * 100
                )
                : 0;


        atualizarElemento(
            "porcentagemAtivas",
            `${percentual}%`
        );


        const barra =
            document.getElementById("barraAtivas");


        if (barra) {
            barra.style.width = `${percentual}%`;
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


// Compatibilidade com o HTML
function atualizarDashboard() {
    return carregarDashboard();
}


// ============================================================
// ÚLTIMAS CLÍNICAS
// ============================================================

async function carregarUltimasClinicas() {

    const container =
        document.getElementById("ultimasClinicas");


    if (!container) {
        return;
    }


    container.innerHTML =
        `<div class="carregando">
            Carregando clínicas...
        </div>`;


    const { data, error } =
        await supabaseClient
            .from("clinicas")
            .select(`
                id,
                nome,
                telefone,
                ativo
            `)
            .order(
                "data_cadastro",
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

        container.innerHTML =
            `<div class="carregando">
                Não foi possível carregar as clínicas.
            </div>`;

        return;
    }


    if (!data || data.length === 0) {

        container.innerHTML =
            `<div class="carregando">
                Nenhuma clínica cadastrada.
            </div>`;

        return;
    }


    container.innerHTML =
        data.map(clinica => {

            const status =
                clinica.ativo
                    ? "ativo"
                    : "inativo";


            const textoStatus =
                clinica.ativo
                    ? "Ativa"
                    : "Inativa";


            return `
                <div class="ultima-clinica">

                    <div>
                        <strong>
                            ${escapeHTML(clinica.nome)}
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

                    <span class="status ${status}">
                        ${textoStatus}
                    </span>

                </div>
            `;

        }).join("");

}


// ============================================================
// PÁGINA DE CLÍNICAS
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

    const tabela =
        document.getElementById("listaClinicas");


    if (!tabela) {
        return;
    }


    tabela.innerHTML =
        `<tr>
            <td colspan="6" class="carregando">
                Carregando clínicas...
            </td>
        </tr>`;


    try {

        const { data, error } =
            await supabaseClient
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
                    ),
                    clinica_especialidades (
                        id,
                        rede,
                        ativo,
                        especialidades (
                            id,
                            nome
                        )
                    )
                `)
                .order("nome");


        if (error) {
            throw error;
        }


        let clinicas =
            data || [];


        // ----------------------------------------------------
        // FILTRO POR NOME
        // ----------------------------------------------------

        const campoBusca =
            document.getElementById("buscarClinica");


        if (
            campoBusca &&
            campoBusca.value.trim()
        ) {

            const termo =
                campoBusca.value
                    .trim()
                    .toLowerCase();


            clinicas =
                clinicas.filter(clinica =>
                    String(clinica.nome || "")
                        .toLowerCase()
                        .includes(termo)
                );

        }


        // ----------------------------------------------------
        // FILTRO POR STATUS
        // ----------------------------------------------------

        const filtroStatus =
            document.getElementById(
                "filtroStatusClinica"
            );


        if (
            filtroStatus &&
            filtroStatus.value
        ) {

            if (filtroStatus.value === "ativa") {

                clinicas =
                    clinicas.filter(
                        clinica =>
                            clinica.ativo === true
                    );

            }


            if (filtroStatus.value === "inativa") {

                clinicas =
                    clinicas.filter(
                        clinica =>
                            clinica.ativo !== true
                    );

            }

        }


        if (clinicas.length === 0) {

            tabela.innerHTML =
                `<tr>
                    <td colspan="6" class="carregando">
                        Nenhuma clínica encontrada.
                    </td>
                </tr>`;

            return;
        }


        tabela.innerHTML =
            clinicas.map(clinica => {

                const localizacao =
                    montarLocalizacaoClinica(
                        clinica
                    );


                const especialidades =
                    obterEspecialidadesClinica(
                        clinica
                    );


                const status =
                    clinica.ativo
                        ? `
                            <span class="status ativo">
                                Ativa
                            </span>
                          `
                        : `
                            <span class="status inativo">
                                Inativa
                            </span>
                          `;


                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    clinica.nome
                                )}
                            </strong>
                        </td>

                        <td>
                            ${localizacao}
                        </td>

                        <td>
                            ${
                                clinica.telefone
                                    ? `
                                        <a
                                            href="tel:${escapeHTML(
                                                clinica.telefone
                                            )}"
                                        >
                                            ${escapeHTML(
                                                clinica.telefone
                                            )}
                                        </a>
                                      `
                                    : "-"
                            }
                        </td>

                        <td>
                            ${especialidades}
                        </td>

                        <td>
                            ${status}
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

                    </tr>
                `;

            }).join("");


    } catch (erro) {

        console.error(
            "Erro ao listar clínicas:",
            erro
        );


        tabela.innerHTML =
            `<tr>
                <td colspan="6" class="carregando">
                    Erro ao carregar clínicas.
                </td>
            </tr>`;

    }

}


// ============================================================
// LOCALIZAÇÃO DA CLÍNICA
// ============================================================

function montarLocalizacaoClinica(clinica) {

    const bairro =
        clinica.bairros;


    const cidade =
        bairro?.cidades;


    const estado =
        cidade?.estados;


    const regiao =
        estado?.regioes;


    const partes = [];


    if (bairro?.nome) {
        partes.push(bairro.nome);
    }


    if (cidade?.nome) {
        partes.push(cidade.nome);
    }


    if (estado?.nome) {
        partes.push(estado.nome);
    }


    if (regiao?.nome) {
        partes.push(regiao.nome);
    }


    return partes.length
        ? escapeHTML(partes.join(" - "))
        : "Localização não informada";

}


// ============================================================
// ESPECIALIDADES DA CLÍNICA
// ============================================================

function obterEspecialidadesClinica(clinica) {

    const relacoes =
        clinica.clinica_especialidades || [];


    const ativas =
        relacoes.filter(
            relacao =>
                relacao.ativo !== false &&
                relacao.especialidades
        );


    if (ativas.length === 0) {
        return "-";
    }


    return ativas.map(relacao => {

        const nome =
            escapeHTML(
                relacao.especialidades.nome
            );


        const rede =
            exibirNomeRede(
                relacao.rede
            );


        return `
            <span class="tag-especialidade">
                ${nome}
                ${
                    rede
                        ? ` - ${escapeHTML(rede)}`
                        : ""
                }
            </span>
        `;

    }).join(" ");

}


// ============================================================
// EDITAR CLÍNICA
// ============================================================

async function editarClinica(id) {

    const { data, error } =
        await supabaseClient
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
            .eq("id", id)
            .single();


    if (error || !data) {

        console.error(
            "Erro ao buscar clínica:",
            error
        );

        mostrarMensagem(
            "Não foi possível carregar a clínica.",
            "erro"
        );

        return;
    }


    clinicaEditandoId = id;


    const nome =
        document.getElementById("clinicaNome");


    const endereco =
        document.getElementById("clinicaEndereco");


    const telefone =
        document.getElementById("clinicaTelefone");


    const ativo =
        document.getElementById("clinicaAtivo");


    const idCampo =
        document.getElementById("clinicaId");


    if (nome) {
        nome.value = data.nome || "";
    }


    if (endereco) {
        endereco.value = data.endereco || "";
    }


    if (telefone) {
        telefone.value = data.telefone || "";
    }


    if (ativo) {
        ativo.checked = data.ativo === true;
    }


    if (idCampo) {
        idCampo.value = data.id;
    }


    const areaStatus =
        document.getElementById(
            "areaStatusClinica"
        );


    if (areaStatus) {

        areaStatus.classList.remove("hidden");
        areaStatus.style.display = "";

    }


    await popularRegioes("clinicaRegiao");


    const regiaoId =
        data.bairros
            ?.cidades
            ?.estados
            ?.regiao_id;


    const estadoId =
        data.bairros
            ?.cidades
            ?.estado_id;


    const cidadeId =
        data.bairros
            ?.cidade_id;


    const bairroId =
        data.bairro_id;


    if (regiaoId) {

        await popularEstados(
            "clinicaEstado",
            regiaoId
        );

    }


    if (estadoId) {

        await popularCidades(
            "clinicaCidade",
            estadoId
        );

    }


    if (cidadeId) {

        await popularBairros(
            "clinicaBairro",
            cidadeId
        );

    }


    preencherCampo(
        regiaoId,
        "clinicaRegiao"
    );


    preencherCampo(
        estadoId,
        "clinicaEstado"
    );


    preencherCampo(
        cidadeId,
        "clinicaCidade"
    );


    preencherCampo(
        bairroId,
        "clinicaBairro"
    );


    const titulo =
        document.getElementById(
            "tituloModalClinica"
        );


    if (titulo) {
        titulo.textContent = "Editar Clínica";
    }


    await carregarEspecialidadesClinicaNoModal(id);


    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (modal) {

        modal.classList.remove("hidden");
        modal.style.display = "flex";

    }

}


// ============================================================
// PREENCHER LOCALIZAÇÃO
// ============================================================

async function preencherLocalizacaoClinica(
    regiaoId,
    estadoId,
    cidadeId,
    bairroId
) {

    try {

        await popularRegioes(
            "clinicaRegiao"
        );


        preencherCampo(
            regiaoId,
            "clinicaRegiao"
        );


        if (regiaoId) {

            await popularEstados(
                "clinicaEstado",
                regiaoId
            );

        }


        preencherCampo(
            estadoId,
            "clinicaEstado"
        );


        if (estadoId) {

            await popularCidades(
                "clinicaCidade",
                estadoId
            );

        }


        preencherCampo(
            cidadeId,
            "clinicaCidade"
        );


        if (cidadeId) {

            await popularBairros(
                "clinicaBairro",
                cidadeId
            );

        }


        preencherCampo(
            bairroId,
            "clinicaBairro"
        );

    } catch (erro) {

        console.error(
            "Erro ao preencher localização:",
            erro
        );

    }

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
        return;
    }


    container.innerHTML =
        `<div class="carregando">
            Carregando especialidades...
        </div>`;


    const [
        especialidadesResult,
        vinculadasResult
    ] = await Promise.all([

        supabaseClient
            .from("especialidades")
            .select("id, nome")
            .order("nome"),

        supabaseClient
            .from("clinica_especialidades")
            .select(`
                id,
                especialidade_id,
                rede,
                ativo
            `)
            .eq("clinica_id", clinicaId)

    ]);


    if (especialidadesResult.error) {

        console.error(
            "Erro ao carregar especialidades:",
            especialidadesResult.error
        );

        container.innerHTML =
            `<div class="especialidades-vazio">
                Erro ao carregar especialidades.
            </div>`;

        return;
    }


    const especialidades =
        especialidadesResult.data || [];


    const vinculadas =
        vinculadasResult.data || [];


    container.innerHTML = "";


    if (especialidades.length === 0) {

        container.innerHTML =
            `<div class="especialidades-vazio">
                Nenhuma especialidade cadastrada.
            </div>`;

        return;
    }


    especialidades.forEach(especialidade => {

        const existentes =
            vinculadas.filter(
                item =>
                    item.especialidade_id ===
                    especialidade.id
            );


        const redes = {


            Especialistas:
                existentes.find(
                    item =>
                        normalizarRede(item.rede) ===
                        "especialistas"
                ),


            Sindilegis:
                existentes.find(
                    item =>
                        normalizarRede(item.rede) ===
                        "sindilegis"
                )

        };


        adicionarLinhaEspecialidade(
            especialidade,
            redes
        );

    });

}


// ============================================================
// ADICIONAR LINHA DE ESPECIALIDADE
// ============================================================

function adicionarLinhaEspecialidade(
    especialidade = null,
    redes = {}
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


    if (!especialidade) {

        mostrarMensagem(
            "Selecione uma especialidade válida.",
            "erro"
        );

        return;
    }


    const linha =
        document.createElement("div");


    linha.className =
        "linha-especialidade";


    const especialistas =
        redes.Especialistas;


    const sindilegis =
        redes.Sindilegis;


    linha.innerHTML = `

        <div class="especialidade-nome">

            <strong>
                ${escapeHTML(
                    especialidade.nome
                )}
            </strong>

        </div>


        <div class="especialidade-redes">

            <label>

                <input
                    type="checkbox"
                    class="checkbox-especialidade"
                    data-especialidade-id="${especialidade.id}"
                    data-rede="Especialistas"
                    ${
                        especialistas?.ativo
                            ? "checked"
                            : ""
                    }
                >

                Especialistas

            </label>


            <label>

                <input
                    type="checkbox"
                    class="checkbox-especialidade"
                    data-especialidade-id="${especialidade.id}"
                    data-rede="Sindilegis"
                    ${
                        sindilegis?.ativo
                            ? "checked"
                            : ""
                    }
                >

                Sindilegis

            </label>

        </div>

    `;


    container.appendChild(linha);

}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(event) {

    if (event) {
        event.preventDefault();
    }


    const nome =
        obterValor("clinicaNome");


    const endereco =
        obterValor("clinicaEndereco");


    const telefone =
        obterValor("clinicaTelefone");


    const bairroId =
        obterValor("clinicaBairro");


    const idCampo =
        document.getElementById("clinicaId");


    const idEdicao =
        idCampo?.value ||
        clinicaEditandoId ||
        "";


    const ativoCampo =
        document.getElementById(
            "clinicaAtivo"
        );


    const ativo =
        ativoCampo
            ? ativoCampo.checked
            : true;


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
        telefone: telefone || null,
        bairro_id: Number(bairroId),
        ativo

    };


    let clinicaIdFinal =
        idEdicao
            ? Number(idEdicao)
            : null;


    try {

        if (clinicaIdFinal) {

            const { error } =
                await supabaseClient
                    .from("clinicas")
                    .update(dadosClinica)
                    .eq("id", clinicaIdFinal);


            if (error) {
                throw error;
            }

        } else {

            const { data, error } =
                await supabaseClient
                    .from("clinicas")
                    .insert(dadosClinica)
                    .select("id")
                    .single();


            if (error) {
                throw error;
            }


            clinicaIdFinal =
                data.id;

        }


        await salvarEspecialidadesClinica(
            clinicaIdFinal
        );


        mostrarMensagem(
            idEdicao
                ? "Clínica atualizada com sucesso!"
                : "Clínica cadastrada com sucesso!",
            "sucesso"
        );


        fecharModalClinica();


        document
            .getElementById("formClinica")
            ?.reset();


        clinicaEditandoId = null;


        await listarClinicas();
        await carregarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao salvar clínica:",
            erro
        );


        if (
            erro?.code === "23505"
        ) {

            mostrarMensagem(
                "Já existe uma clínica com esse nome nesta localização.",
                "erro"
            );

        } else {

            mostrarMensagem(
                "Não foi possível salvar a clínica.",
                "erro"
            );

        }

    }

}


// ============================================================
// SALVAR ESPECIALIDADES DA CLÍNICA
// ============================================================

async function salvarEspecialidadesClinica(
    clinicaId
) {

    if (!clinicaId) {
        return;
    }


    const checkboxes =
        document.querySelectorAll(
            ".checkbox-especialidade"
        );


    const registros = [];


    checkboxes.forEach(checkbox => {

        if (!checkbox.checked) {
            return;
        }


        const especialidadeId =
            Number(
                checkbox.dataset.especialidadeId
            );


        const rede =
            checkbox.dataset.rede;


        if (
            especialidadeId &&
            rede
        ) {

            registros.push({

                clinica_id: Number(clinicaId),

                especialidade_id:
                    especialidadeId,

                rede,

                ativo: true

            });

        }

    });


    // Remove vínculos atuais
    const { error: erroDelete } =
        await supabaseClient
            .from("clinica_especialidades")
            .delete()
            .eq(
                "clinica_id",
                clinicaId
            );


    if (erroDelete) {
        throw erroDelete;
    }


    if (registros.length === 0) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("clinica_especialidades")
            .insert(registros);


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


    if (!confirmar) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("clinicas")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(
            "Erro ao excluir clínica:",
            error
        );


        mostrarMensagem(
            "Não foi possível excluir a clínica.",
            "erro"
        );

        return;
    }


    mostrarMensagem(
        "Clínica excluída com sucesso!",
        "sucesso"
    );


    await listarClinicas();
    await carregarDashboard();

}
// ============================================================
// PARTE 2/2
// ESPECIALIDADES, REGIÕES, ESTADOS, CIDADES, BAIRROS,
// LOCALIZAÇÃO, MODAL, TEMA E FUNÇÕES AUXILIARES
// ============================================================


// ============================================================
// ESPECIALIDADES
// ============================================================

async function carregarPaginaEspecialidades() {
    await listarEspecialidades();
}


async function listarEspecialidades() {

    const lista =
        document.getElementById(
            "listaEspecialidades"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML =
        `<div class="carregando">
            Carregando especialidades...
        </div>`;

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("id, nome")
            .order("nome");

    if (error) {

        console.error(
            "Erro ao listar especialidades:",
            error
        );

        lista.innerHTML =
            `<div class="carregando">
                Erro ao carregar especialidades.
            </div>`;

        return;
    }

    if (!data || data.length === 0) {

        lista.innerHTML =
            `<div class="carregando">
                Nenhuma especialidade cadastrada.
            </div>`;

        return;
    }

    lista.innerHTML = "";

    data.forEach(especialidade => {

        const item =
            document.createElement("div");

        item.className =
            "item-gerenciamento";

        item.innerHTML = `
            <div>
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

        lista.appendChild(item);

    });

}


async function salvarEspecialidade() {

    const input =
        document.getElementById(
            "nomeEspecialidade"
        );

    const editId =
        document.getElementById(
            "especialidadeEditId"
        );

    if (!input) {
        return;
    }

    const nome =
        input.value.trim();

    const idEdicao =
        editId?.value || "";

    if (!nome) {

        mostrarMensagem(
            "Informe o nome da especialidade.",
            "erro"
        );

        input.focus();

        return;
    }

    let consulta =
        supabaseClient
            .from("especialidades")
            .select("id")
            .ilike("nome", nome);

    if (idEdicao) {
        consulta =
            consulta.neq(
                "id",
                idEdicao
            );
    }

    const {
        data: existente,
        error: erroConsulta
    } = await consulta.maybeSingle();

    if (erroConsulta) {

        console.error(
            "Erro ao verificar especialidade:",
            erroConsulta
        );

        mostrarMensagem(
            "Não foi possível verificar a especialidade.",
            "erro"
        );

        return;
    }

    if (existente) {

        mostrarMensagem(
            "Esta especialidade já está cadastrada.",
            "erro"
        );

        return;
    }

    let error;

    if (idEdicao) {

        const resposta =
            await supabaseClient
                .from("especialidades")
                .update({
                    nome
                })
                .eq(
                    "id",
                    idEdicao
                );

        error =
            resposta.error;

    } else {

        const resposta =
            await supabaseClient
                .from("especialidades")
                .insert({
                    nome
                });

        error =
            resposta.error;
    }

    if (error) {

        console.error(
            "Erro ao salvar especialidade:",
            error
        );

        mostrarMensagem(
            "Não foi possível salvar a especialidade.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        idEdicao
            ? "Especialidade atualizada com sucesso!"
            : "Especialidade cadastrada com sucesso!",
        "sucesso"
    );

    input.value = "";

    if (editId) {
        editId.value = "";
    }

    await listarEspecialidades();
    await carregarDashboard();

}


async function editarEspecialidade(id) {

    const { data, error } =
        await supabaseClient
            .from("especialidades")
            .select("id, nome")
            .eq("id", id)
            .single();

    if (error || !data) {

        console.error(
            "Erro ao buscar especialidade:",
            error
        );

        mostrarMensagem(
            "Não foi possível carregar a especialidade.",
            "erro"
        );

        return;
    }

    preencherCampo(
        data.nome,
        "nomeEspecialidade"
    );

    preencherCampo(
        data.id,
        "especialidadeEditId"
    );

    const input =
        document.getElementById(
            "nomeEspecialidade"
        );

    input?.focus();

}


async function excluirEspecialidade(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta especialidade?\n\n" +
            "Os vínculos dessa especialidade com as clínicas também serão removidos."
        );

    if (!confirmar) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("especialidades")
            .delete()
            .eq("id", id);

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

    mostrarMensagem(
        "Especialidade excluída com sucesso!",
        "sucesso"
    );

    await listarEspecialidades();
    await carregarDashboard();

}


// ============================================================
// REGIÕES
// ============================================================

async function carregarPaginaRegioes() {
    await listarRegioes();
}


async function popularRegioes(
    selectId = null
) {

    const selects = selectId
        ? [
            document.getElementById(selectId)
        ]
        : [
            document.getElementById("clinicaRegiao"),
            document.getElementById("estadoRegiao")
        ];

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("id, nome")
            .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar regiões:",
            error
        );

        return;
    }

    selects.forEach(select => {

        if (!select) {
            return;
        }

        const valorAtual =
            select.value;

        select.innerHTML =
            `<option value="">
                Selecione a Região
            </option>`;

        (data || []).forEach(regiao => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                regiao.id;

            option.textContent =
                regiao.nome;

            select.appendChild(option);

        });

        if (valorAtual) {
            select.value =
                valorAtual;
        }

    });

}


async function listarRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML =
        `<div class="carregando">
            Carregando regiões...
        </div>`;

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("id, nome")
            .order("nome");

    if (error) {

        console.error(
            "Erro ao listar regiões:",
            error
        );

        lista.innerHTML =
            `<div class="carregando">
                Erro ao carregar regiões.
            </div>`;

        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML =
            `<div class="carregando">
                Nenhuma região cadastrada.
            </div>`;

        return;
    }

    data.forEach(regiao => {

        const item =
            document.createElement("div");

        item.className =
            "item-gerenciamento";

        item.innerHTML = `
            <div>
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

        lista.appendChild(item);

    });

}


async function salvarRegiao() {

    const input =
        document.getElementById(
            "nomeRegiao"
        );

    const editId =
        document.getElementById(
            "regiaoEditId"
        );

    if (!input) {
        return;
    }

    const nome =
        input.value.trim();

    const idEdicao =
        editId?.value || "";

    if (!nome) {

        mostrarMensagem(
            "Informe o nome da região.",
            "erro"
        );

        input.focus();

        return;
    }

    let consulta =
        supabaseClient
            .from("regioes")
            .select("id")
            .ilike("nome", nome);

    if (idEdicao) {
        consulta =
            consulta.neq(
                "id",
                idEdicao
            );
    }

    const {
        data: existente,
        error: erroConsulta
    } = await consulta.maybeSingle();

    if (erroConsulta) {

        console.error(
            "Erro ao verificar região:",
            erroConsulta
        );

        return;
    }

    if (existente) {

        mostrarMensagem(
            "Esta região já está cadastrada.",
            "erro"
        );

        return;
    }

    let error;

    if (idEdicao) {

        const resposta =
            await supabaseClient
                .from("regioes")
                .update({
                    nome
                })
                .eq(
                    "id",
                    idEdicao
                );

        error =
            resposta.error;

    } else {

        const resposta =
            await supabaseClient
                .from("regioes")
                .insert({
                    nome
                });

        error =
            resposta.error;

    }

    if (error) {

        console.error(
            "Erro ao salvar região:",
            error
        );

        mostrarMensagem(
            "Não foi possível salvar a região.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        idEdicao
            ? "Região atualizada com sucesso!"
            : "Região cadastrada com sucesso!",
        "sucesso"
    );

    input.value = "";

    if (editId) {
        editId.value = "";
    }

    await listarRegioes();
    await popularRegioes();
    await carregarDashboard();

}


async function editarRegiao(id) {

    const { data, error } =
        await supabaseClient
            .from("regioes")
            .select("id, nome")
            .eq("id", id)
            .single();

    if (error || !data) {

        mostrarMensagem(
            "Não foi possível carregar a região.",
            "erro"
        );

        return;
    }

    preencherCampo(
        data.nome,
        "nomeRegiao"
    );

    preencherCampo(
        data.id,
        "regiaoEditId"
    );

    document
        .getElementById("nomeRegiao")
        ?.focus();

}


async function excluirRegiao(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta região?\n\n" +
            "Os estados, cidades, bairros e vínculos de localização relacionados também poderão ser afetados."
        );

    if (!confirmar) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("regioes")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(
            "Erro ao excluir região:",
            error
        );

        mostrarMensagem(
            "Não foi possível excluir a região.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        "Região excluída com sucesso!",
        "sucesso"
    );

    await listarRegioes();
    await popularRegioes();
    await carregarDashboard();

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

    let selects;

    if (selectId) {

        selects = [
            document.getElementById(
                selectId
            )
        ];

    } else {

        selects = [
            document.getElementById(
                "clinicaEstado"
            ),
            document.getElementById(
                "cidadeEstado"
            )
        ];

    }

    const { data, error } =
        await supabaseClient
            .from("estados")
            .select("id, nome, regiao_id")
            .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar estados:",
            error
        );

        return;
    }

    selects.forEach(select => {

        if (!select) {
            return;
        }

        const valorAtual =
            select.value;

        select.innerHTML =
            `<option value="">
                Selecione o Estado
            </option>`;

        (data || [])
            .filter(estado => {

                if (!regiaoId) {
                    return true;
                }

                return String(
                    estado.regiao_id
                ) === String(regiaoId);

            })
            .forEach(estado => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    estado.id;

                option.textContent =
                    estado.nome;

                select.appendChild(option);

            });

        if (valorAtual) {
            select.value =
                valorAtual;
        }

    });

}


async function listarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML =
        `<div class="carregando">
            Carregando estados...
        </div>`;

    const { data, error } =
        await supabaseClient
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
            .order("nome");

    if (error) {

        console.error(
            "Erro ao listar estados:",
            error
        );

        lista.innerHTML =
            `<div class="carregando">
                Erro ao carregar estados.
            </div>`;

        return;
    }

    if (!data || data.length === 0) {

        lista.innerHTML =
            `<div class="carregando">
                Nenhum estado cadastrado.
            </div>`;

        return;
    }

    lista.innerHTML = "";

    data.forEach(estado => {

        const item =
            document.createElement("div");

        item.className =
            "item-gerenciamento";

        item.innerHTML = `
            <div>

                <strong>
                    ${escapeHTML(
                        estado.nome
                    )}
                </strong>

                <small>
                    ${
                        estado.regioes?.nome
                            ? escapeHTML(
                                estado.regioes.nome
                            )
                            : "Região não informada"
                    }
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

        lista.appendChild(item);

    });

}


async function salvarEstado() {

    const input =
        document.getElementById(
            "nomeEstado"
        );

    const regiao =
        document.getElementById(
            "estadoRegiao"
        );

    const editId =
        document.getElementById(
            "estadoEditId"
        );

    if (!input || !regiao) {
        return;
    }

    const nome =
        input.value.trim();

    const regiaoId =
        regiao.value;

    const idEdicao =
        editId?.value || "";

    if (!nome) {

        mostrarMensagem(
            "Informe o nome do estado.",
            "erro"
        );

        input.focus();

        return;
    }

    if (!regiaoId) {

        mostrarMensagem(
            "Selecione a região.",
            "erro"
        );

        regiao.focus();

        return;
    }

    let consulta =
        supabaseClient
            .from("estados")
            .select("id")
            .ilike("nome", nome);

    if (idEdicao) {

        consulta =
            consulta.neq(
                "id",
                idEdicao
            );

    }

    const {
        data: existente,
        error: erroConsulta
    } = await consulta.maybeSingle();

    if (erroConsulta) {

        console.error(
            "Erro ao verificar estado:",
            erroConsulta
        );

        return;
    }

    if (existente) {

        mostrarMensagem(
            "Este estado já está cadastrado.",
            "erro"
        );

        return;
    }

    let error;

    if (idEdicao) {

        const resposta =
            await supabaseClient
                .from("estados")
                .update({
                    nome,
                    regiao_id:
                        Number(regiaoId)
                })
                .eq(
                    "id",
                    idEdicao
                );

        error =
            resposta.error;

    } else {

        const resposta =
            await supabaseClient
                .from("estados")
                .insert({
                    nome,
                    regiao_id:
                        Number(regiaoId)
                });

        error =
            resposta.error;

    }

    if (error) {

        console.error(
            "Erro ao salvar estado:",
            error
        );

        mostrarMensagem(
            "Não foi possível salvar o estado.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        idEdicao
            ? "Estado atualizado com sucesso!"
            : "Estado cadastrado com sucesso!",
        "sucesso"
    );

    input.value = "";
    regiao.value = "";

    if (editId) {
        editId.value = "";
    }

    await listarEstados();
    await popularEstados();
    await carregarDashboard();

}


async function editarEstado(id) {

    const { data, error } =
        await supabaseClient
            .from("estados")
            .select(`
                id,
                nome,
                regiao_id
            `)
            .eq("id", id)
            .single();

    if (error || !data) {

        mostrarMensagem(
            "Não foi possível carregar o estado.",
            "erro"
        );

        return;
    }

    preencherCampo(
        data.nome,
        "nomeEstado"
    );

    preencherCampo(
        data.regiao_id,
        "estadoRegiao"
    );

    preencherCampo(
        data.id,
        "estadoEditId"
    );

    document
        .getElementById("nomeEstado")
        ?.focus();

}


async function excluirEstado(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este estado?\n\n" +
            "As cidades e bairros vinculados a ele também serão afetados."
        );

    if (!confirmar) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("estados")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(
            "Erro ao excluir estado:",
            error
        );

        mostrarMensagem(
            "Não foi possível excluir o estado.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        "Estado excluído com sucesso!",
        "sucesso"
    );

    await listarEstados();
    await popularEstados();
    await carregarDashboard();

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

    let selects;

    if (selectId) {

        selects = [
            document.getElementById(
                selectId
            )
        ];

    } else {

        selects = [
            document.getElementById(
                "clinicaCidade"
            ),
            document.getElementById(
                "bairroCidade"
            )
        ];

    }

    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select(`
                id,
                nome,
                estado_id
            `)
            .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar cidades:",
            error
        );

        return;
    }

    selects.forEach(select => {

        if (!select) {
            return;
        }

        const valorAtual =
            select.value;

        select.innerHTML =
            `<option value="">
                Selecione a Cidade
            </option>`;

        (data || [])
            .filter(cidade => {

                if (!estadoId) {
                    return true;
                }

                return String(
                    cidade.estado_id
                ) === String(estadoId);

            })
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

    });

}


async function listarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML =
        `<div class="carregando">
            Carregando cidades...
        </div>`;

    const { data, error } =
        await supabaseClient
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
            .order("nome");

    if (error) {

        console.error(
            "Erro ao listar cidades:",
            error
        );

        lista.innerHTML =
            `<div class="carregando">
                Erro ao carregar cidades.
            </div>`;

        return;
    }

    if (!data || data.length === 0) {

        lista.innerHTML =
            `<div class="carregando">
                Nenhuma cidade cadastrada.
            </div>`;

        return;
    }

    lista.innerHTML = "";

    data.forEach(cidade => {

        const item =
            document.createElement("div");

        item.className =
            "item-gerenciamento";

        item.innerHTML = `
            <div>

                <strong>
                    ${escapeHTML(
                        cidade.nome
                    )}
                </strong>

                <small>
                    ${
                        cidade.estados?.nome
                            ? escapeHTML(
                                cidade.estados.nome
                            )
                            : "Estado não informado"
                    }
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

        lista.appendChild(item);

    });

}


async function salvarCidade() {

    const input =
        document.getElementById(
            "nomeCidade"
        );

    const estado =
        document.getElementById(
            "cidadeEstado"
        );

    const editId =
        document.getElementById(
            "cidadeEditId"
        );

    if (!input || !estado) {
        return;
    }

    const nome =
        input.value.trim();

    const estadoId =
        estado.value;

    const idEdicao =
        editId?.value || "";

    if (!nome) {

        mostrarMensagem(
            "Informe o nome da cidade.",
            "erro"
        );

        input.focus();

        return;
    }

    if (!estadoId) {

        mostrarMensagem(
            "Selecione o estado.",
            "erro"
        );

        estado.focus();

        return;
    }

    let consulta =
        supabaseClient
            .from("cidades")
            .select("id")
            .ilike("nome", nome)
            .eq(
                "estado_id",
                estadoId
            );

    if (idEdicao) {

        consulta =
            consulta.neq(
                "id",
                idEdicao
            );

    }

    const {
        data: existente,
        error: erroConsulta
    } = await consulta.maybeSingle();

    if (erroConsulta) {

        console.error(
            "Erro ao verificar cidade:",
            erroConsulta
        );

        return;
    }

    if (existente) {

        mostrarMensagem(
            "Esta cidade já está cadastrada neste estado.",
            "erro"
        );

        return;
    }

    let error;

    if (idEdicao) {

        const resposta =
            await supabaseClient
                .from("cidades")
                .update({
                    nome,
                    estado_id:
                        Number(estadoId)
                })
                .eq(
                    "id",
                    idEdicao
                );

        error =
            resposta.error;

    } else {

        const resposta =
            await supabaseClient
                .from("cidades")
                .insert({
                    nome,
                    estado_id:
                        Number(estadoId)
                });

        error =
            resposta.error;

    }

    if (error) {

        console.error(
            "Erro ao salvar cidade:",
            error
        );

        mostrarMensagem(
            "Não foi possível salvar a cidade.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        idEdicao
            ? "Cidade atualizada com sucesso!"
            : "Cidade cadastrada com sucesso!",
        "sucesso"
    );

    input.value = "";
    estado.value = "";

    if (editId) {
        editId.value = "";
    }

    await listarCidades();
    await popularCidades();
    await carregarDashboard();

}


async function editarCidade(id) {

    const { data, error } =
        await supabaseClient
            .from("cidades")
            .select(`
                id,
                nome,
                estado_id
            `)
            .eq("id", id)
            .single();

    if (error || !data) {

        mostrarMensagem(
            "Não foi possível carregar a cidade.",
            "erro"
        );

        return;
    }

    preencherCampo(
        data.nome,
        "nomeCidade"
    );

    preencherCampo(
        data.estado_id,
        "cidadeEstado"
    );

    preencherCampo(
        data.id,
        "cidadeEditId"
    );

    document
        .getElementById("nomeCidade")
        ?.focus();

}


async function excluirCidade(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta cidade?\n\n" +
            "Os bairros vinculados a ela também serão afetados."
        );

    if (!confirmar) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("cidades")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(
            "Erro ao excluir cidade:",
            error
        );

        mostrarMensagem(
            "Não foi possível excluir a cidade.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        "Cidade excluída com sucesso!",
        "sucesso"
    );

    await listarCidades();
    await popularCidades();
    await carregarDashboard();

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

    let selects;

    if (selectId) {

        selects = [
            document.getElementById(
                selectId
            )
        ];

    } else {

        selects = [
            document.getElementById(
                "clinicaBairro"
            )
        ];

    }

    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select(`
                id,
                nome,
                cidade_id
            `)
            .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar bairros:",
            error
        );

        return;
    }

    selects.forEach(select => {

        if (!select) {
            return;
        }

        const valorAtual =
            select.value;

        select.innerHTML =
            `<option value="">
                Selecione o Bairro
            </option>`;

        (data || [])
            .filter(bairro => {

                if (!cidadeId) {
                    return true;
                }

                return String(
                    bairro.cidade_id
                ) === String(cidadeId);

            })
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

    });

}


async function listarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML =
        `<div class="carregando">
            Carregando bairros...
        </div>`;

    const { data, error } =
        await supabaseClient
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

        console.error(
            "Erro ao listar bairros:",
            error
        );

        lista.innerHTML =
            `<div class="carregando">
                Erro ao carregar bairros.
            </div>`;

        return;
    }

    if (!data || data.length === 0) {

        lista.innerHTML =
            `<div class="carregando">
                Nenhum bairro cadastrado.
            </div>`;

        return;
    }

    lista.innerHTML = "";

    data.forEach(bairro => {

        const item =
            document.createElement("div");

        item.className =
            "item-gerenciamento";

        const cidade =
            bairro.cidades?.nome ||
            "";

        const estado =
            bairro.cidades?.estados?.nome ||
            "";

        item.innerHTML = `
            <div>

                <strong>
                    ${escapeHTML(
                        bairro.nome
                    )}
                </strong>

                <small>
                    ${escapeHTML(
                        cidade
                    )}
                    ${
                        estado
                            ? ` - ${escapeHTML(
                                estado
                            )}`
                            : ""
                    }
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

        lista.appendChild(item);

    });

}


async function salvarBairro() {

    const input =
        document.getElementById(
            "nomeBairro"
        );

    const cidade =
        document.getElementById(
            "bairroCidade"
        );

    const editId =
        document.getElementById(
            "bairroEditId"
        );

    if (!input || !cidade) {
        return;
    }

    const nome =
        input.value.trim();

    const cidadeId =
        cidade.value;

    const idEdicao =
        editId?.value || "";

    if (!nome) {

        mostrarMensagem(
            "Informe o nome do bairro.",
            "erro"
        );

        input.focus();

        return;
    }

    if (!cidadeId) {

        mostrarMensagem(
            "Selecione a cidade.",
            "erro"
        );

        cidade.focus();

        return;
    }

    let consulta =
        supabaseClient
            .from("bairros")
            .select("id")
            .ilike("nome", nome)
            .eq(
                "cidade_id",
                cidadeId
            );

    if (idEdicao) {

        consulta =
            consulta.neq(
                "id",
                idEdicao
            );

    }

    const {
        data: existente,
        error: erroConsulta
    } = await consulta.maybeSingle();

    if (erroConsulta) {

        console.error(
            "Erro ao verificar bairro:",
            erroConsulta
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

        const resposta =
            await supabaseClient
                .from("bairros")
                .update({
                    nome,
                    cidade_id:
                        Number(cidadeId)
                })
                .eq(
                    "id",
                    idEdicao
                );

        error =
            resposta.error;

    } else {

        const resposta =
            await supabaseClient
                .from("bairros")
                .insert({
                    nome,
                    cidade_id:
                        Number(cidadeId)
                });

        error =
            resposta.error;

    }

    if (error) {

        console.error(
            "Erro ao salvar bairro:",
            error
        );

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
    cidade.value = "";

    if (editId) {
        editId.value = "";
    }

    await listarBairros();
    await popularBairros();
    await carregarDashboard();

}


async function editarBairro(id) {

    const { data, error } =
        await supabaseClient
            .from("bairros")
            .select(`
                id,
                nome,
                cidade_id
            `)
            .eq("id", id)
            .single();

    if (error || !data) {

        mostrarMensagem(
            "Não foi possível carregar o bairro.",
            "erro"
        );

        return;
    }

    preencherCampo(
        data.nome,
        "nomeBairro"
    );

    preencherCampo(
        data.cidade_id,
        "bairroCidade"
    );

    preencherCampo(
        data.id,
        "bairroEditId"
    );

    document
        .getElementById("nomeBairro")
        ?.focus();

}


async function excluirBairro(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este bairro?\n\n" +
            "As clínicas vinculadas perderão o bairro cadastrado."
        );

    if (!confirmar) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("bairros")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(
            "Erro ao excluir bairro:",
            error
        );

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
    await popularBairros();
    await carregarDashboard();

}


// ============================================================
// CASCATA DA LOCALIZAÇÃO DA CLÍNICA
// ============================================================

async function carregarEstadosClinica() {

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

    const bairro =
        document.getElementById(
            "clinicaBairro"
        );


    if (!regiao || !estado) {
        return;
    }


    const regiaoId =
        regiao.value;


    estado.innerHTML =
        `<option value="">
            Selecione o Estado
        </option>`;


    if (cidade) {

        cidade.innerHTML =
            `<option value="">
                Selecione a Cidade
            </option>`;

    }


    if (bairro) {

        bairro.innerHTML =
            `<option value="">
                Selecione o Bairro
            </option>`;

    }


    if (!regiaoId) {
        return;
    }


    await popularEstados(
        "clinicaEstado",
        regiaoId
    );

}


async function carregarCidadesClinica() {

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


    if (!estado || !cidade) {
        return;
    }


    const estadoId =
        estado.value;


    cidade.innerHTML =
        `<option value="">
            Selecione a Cidade
        </option>`;


    if (bairro) {

        bairro.innerHTML =
            `<option value="">
                Selecione o Bairro
            </option>`;

    }


    if (!estadoId) {
        return;
    }


    await popularCidades(
        "clinicaCidade",
        estadoId
    );

}


async function carregarBairrosClinica() {

    const cidade =
        document.getElementById(
            "clinicaCidade"
        );

    const bairro =
        document.getElementById(
            "clinicaBairro"
        );


    if (!cidade || !bairro) {
        return;
    }


    const cidadeId =
        cidade.value;


    bairro.innerHTML =
        `<option value="">
            Selecione o Bairro
        </option>`;


    if (!cidadeId) {
        return;
    }


    await popularBairros(
        "clinicaBairro",
        cidadeId
    );

}

// ============================================================
// POPULAR ESPECIALIDADES
// ============================================================

async function popularEspecialidades(selectId = null) {

    let selects;

    if (selectId) {

        selects = [
            document.getElementById(selectId)
        ];

    } else {

        selects = Array.from(
            document.querySelectorAll(
                ".select-especialidade"
            )
        );

    }

    // Se não encontrou nenhum select, não faz nada
    if (!selects.length) {
        return;
    }

    const {
        data,
        error
    } = await supabaseClient
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

        const valorAtual =
            select.value;

        select.innerHTML =
            `<option value="">
                Selecione a Especialidade
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

        if (valorAtual) {

            const existe =
                Array.from(
                    select.options
                ).some(
                    option =>
                        String(option.value) ===
                        String(valorAtual)
                );

            if (existe) {
                select.value =
                    valorAtual;
            }

        }

    });

}

// ============================================================
// MODAL
// ============================================================

async function abrirModalClinica(id = null) {

    const modal =
        document.getElementById(
            "modalClinica"
        );

    const form =
        document.getElementById(
            "formClinica"
        );

    const titulo =
        document.getElementById(
            "tituloModalClinica"
        );

    const idCampo =
        document.getElementById(
            "clinicaId"
        );

    const areaStatus =
        document.getElementById(
            "areaStatusClinica"
        );

    const ativo =
        document.getElementById(
            "clinicaAtivo"
        );

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (!modal) {
        return;
    }


    clinicaEditandoId =
        id || null;


    if (!id) {

        form?.reset();


        if (idCampo) {
            idCampo.value = "";
        }


        if (titulo) {
            titulo.textContent =
                "Nova Clínica";
        }


        if (ativo) {
            ativo.checked = true;
        }


        if (areaStatus) {

            areaStatus.classList.add(
                "hidden"
            );

            areaStatus.style.display =
                "none";

        }


        if (container) {

            container.innerHTML =
                `<div class="especialidades-vazio">
                    Nenhuma especialidade adicionada.
                </div>`;

        }


        await popularRegioes(
            "clinicaRegiao"
        );


        if (document.getElementById(
            "clinicaEstado"
        )) {

            document.getElementById(
                "clinicaEstado"
            ).innerHTML =
                `<option value="">
                    Selecione o Estado
                </option>`;

        }


        if (document.getElementById(
            "clinicaCidade"
        )) {

            document.getElementById(
                "clinicaCidade"
            ).innerHTML =
                `<option value="">
                    Selecione a Cidade
                </option>`;

        }


        if (document.getElementById(
            "clinicaBairro"
        )) {

            document.getElementById(
                "clinicaBairro"
            ).innerHTML =
                `<option value="">
                    Selecione o Bairro
                </option>`;

        }

    } else {

        await editarClinica(id);

        return;

    }


    modal.classList.remove(
        "hidden"
    );

    modal.style.display =
        "flex";

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

    modal.style.display =
        "none";


    clinicaEditandoId =
        null;

}


// ============================================================
// TEMA
// ============================================================

function carregarTema() {

    const tema =
        localStorage.getItem(
            "tema"
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


function alternarTema() {

    document.body.classList.toggle(
        "dark"
    );


    const escuro =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "tema",
        escuro
            ? "dark"
            : "light"
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


    const texto =
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
        texto.charAt(0).toUpperCase() +
        texto.slice(1);

}


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function encontrarElemento(...ids) {

    for (const id of ids) {

        if (!id) {
            continue;
        }


        const elemento =
            document.getElementById(
                id
            );


        if (elemento) {
            return elemento;
        }

    }


    return null;

}


function obterValor(...ids) {

    const elemento =
        encontrarElemento(
            ...ids
        );


    if (!elemento) {
        return "";
    }


    return String(
        elemento.value ?? ""
    ).trim();

}


function preencherCampo(
    valor,
    ...ids
) {

    const elemento =
        encontrarElemento(
            ...ids
        );


    if (!elemento) {
        return;
    }


    elemento.value =
        valor ?? "";

}


function atualizarElemento(
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


    elemento.textContent =
        valor ?? "";

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
// REDE
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

    const normalizada =
        normalizarRede(
            rede
        );


    if (
        normalizada ===
        "especialistas"
    ) {
        return "Especialistas";
    }


    if (
        normalizada ===
        "sindilegis"
    ) {
        return "Sindilegis";
    }


    return rede || "";

}


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagem(
    texto,
    tipo = "info"
) {

    console.log(
        `[${tipo}] ${texto}`
    );


    const possiveis = [
        "mensagemAdmin",
        "mensagem",
        "statusMensagem"
    ];


    let elemento =
        null;


    for (
        const id of possiveis
    ) {

        elemento =
            document.getElementById(
                id
            );


        if (elemento) {
            break;
        }

    }


    if (!elemento) {
        return;
    }


    elemento.textContent =
        texto;


    elemento.className =
        `mensagem ${tipo}`;


    setTimeout(() => {

        if (elemento) {
            elemento.textContent =
                "";
        }

    }, 4000);

}


// ============================================================
// VOLTAR PARA O SITE
// ============================================================

function voltarAoSite() {

    window.location.href =
        "index.html";

}


// ============================================================
// SAIR
// ============================================================

function sair() {

    localStorage.removeItem(
        "adminLogado"
    );


    window.location.href =
        "login.html";

}


async function logout() {

    try {

        if (
            supabaseClient &&
            supabaseClient.auth
        ) {

            await supabaseClient
                .auth
                .signOut();

        }

    } catch (erro) {

        console.warn(
            "Erro ao encerrar sessão:",
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


    // Fechar modal clicando fora
    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    fecharModalClinica();

                }

            }
        );

    }

}


// ============================================================
// DISPONIBILIZAR FUNÇÕES PARA O HTML
// ============================================================

window.mostrarPagina =
    mostrarPagina;

window.popularEspecialidades =
    popularEspecialidades;

window.atualizarDashboard =
    atualizarDashboard;

window.listarClinicas =
    listarClinicas;

window.abrirModalClinica =
    abrirModalClinica;

window.fecharModalClinica =
    fecharModalClinica;

window.salvarClinica =
    salvarClinica;

window.excluirClinica =
    excluirClinica;

window.editarClinica =
    editarClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.carregarEstadosClinica =
    carregarEstadosClinica;

window.carregarCidadesClinica =
    carregarCidadesClinica;

window.carregarBairrosClinica =
    carregarBairrosClinica;


// Especialidades
window.salvarEspecialidade =
    salvarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;


// Regiões
window.salvarRegiao =
    salvarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;


// Estados
window.salvarEstado =
    salvarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;


// Cidades
window.salvarCidade =
    salvarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;


// Bairros
window.salvarBairro =
    salvarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;


// Tema
window.alternarTema =
    alternarTema;

window.carregarTema =
    carregarTema;


// Navegação
window.voltarAoSite =
    voltarAoSite;

window.sair =
    sair;

window.logout =
    logout;
