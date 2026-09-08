// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// ======================================


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("admin.js carregado");

    atualizarData();

    await carregarDashboard();

    await carregarDadosIniciais();

});


// ======================================
// DATA ATUAL
// ======================================

function atualizarData() {

    const elementoData =
        document.getElementById("dataAtual");

    if (!elementoData) return;

    const hoje = new Date();

    elementoData.textContent =
        hoje.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}


// ======================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ======================================

const TITULOS_PAGINA = {

    dashboard: "Dashboard",
    clinicas: "Clínicas",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"

};


async function mostrarPagina(nomePagina) {

    // Remove página ativa

    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("ativa");

        });


    // Remove botão ativo

    document
        .querySelectorAll(".menu-btn[data-pagina]")
        .forEach(botao => {

            botao.classList.remove("ativo");

        });


    // Ativa página

    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );

    if (pagina) {

        pagina.classList.add("ativa");

    }


    // Ativa botão

    const botao =
        document.querySelector(
            `.menu-btn[data-pagina="${nomePagina}"]`
        );

    if (botao) {

        botao.classList.add("ativo");

    }


    // Carrega dados da página

    try {

        if (nomePagina === "dashboard") {

            await carregarDashboard();

        }


        if (nomePagina === "clinicas") {

            await listarClinicas();

        }


        if (nomePagina === "especialidades") {

            await listarEspecialidades();

        }


        if (nomePagina === "regioes") {

            await listarRegioes();

        }


        if (nomePagina === "estados") {

            await popularRegioes("estadoRegiao");

            await listarEstados();

        }


        if (nomePagina === "cidades") {

            await popularEstados("cidadeEstado");

            await listarCidades();

        }


        if (nomePagina === "bairros") {

            await popularCidades("bairroCidade");

            await listarBairros();

        }

    } catch (error) {

        console.error(
            "Erro ao carregar página:",
            error
        );

    }


    // Volta para o topo

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ======================================
// CARREGAR DADOS INICIAIS
// ======================================

async function carregarDadosIniciais() {

    try {

        await popularRegioes("estadoRegiao");

        await popularEstados("cidadeEstado");

        await popularCidades("bairroCidade");

    } catch (error) {

        console.error(
            "Erro ao carregar dados iniciais:",
            error
        );

    }

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    try {

        console.log(
            "Carregando dashboard..."
        );


        // ======================================
        // CLÍNICAS
        // ======================================

        const {

            data: clinicas,

            error: erroClinicas

        } = await supabaseClient

            .from("clinicas")

            .select("*");


        if (erroClinicas) {

            throw erroClinicas;

        }


        const totalClinicas =
            clinicas?.length || 0;


        const clinicasAtivas =
            clinicas?.filter(
                clinica =>
                    clinica.ativo === true
            ).length || 0;


        const clinicasInativas =
            totalClinicas -
            clinicasAtivas;


        // ======================================
        // ESPECIALIDADES
        // ======================================

        const {

            data: especialidades,

            error: erroEspecialidades

        } = await supabaseClient

            .from("especialidades")

            .select("*");


        if (erroEspecialidades) {

            console.warn(
                "Erro especialidades:",
                erroEspecialidades
            );

        }


        const totalEspecialidades =
            especialidades?.length || 0;


        // ======================================
        // REGIÕES
        // ======================================

        const {

            data: regioes

        } = await supabaseClient

            .from("regioes")

            .select("*");


        const totalRegioes =
            regioes?.length || 0;


        // ======================================
        // ESTADOS
        // ======================================

        const {

            data: estados

        } = await supabaseClient

            .from("estados")

            .select("*");


        const totalEstados =
            estados?.length || 0;


        // ======================================
        // CIDADES
        // ======================================

        const {

            data: cidades

        } = await supabaseClient

            .from("cidades")

            .select("*");


        const totalCidades =
            cidades?.length || 0;


        // ======================================
        // BAIRROS
        // ======================================

        const {

            data: bairros

        } = await supabaseClient

            .from("bairros")

            .select("*");


        const totalBairros =
            bairros?.length || 0;


        // ======================================
        // ATUALIZAR CARDS
        // ======================================

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


        // ======================================
        // PORCENTAGEM
        // ======================================

        let porcentagem = 0;


        if (totalClinicas > 0) {

            porcentagem =
                Math.round(
                    (
                        clinicasAtivas /
                        totalClinicas
                    ) * 100
                );

        }


        atualizarElemento(
            "porcentagemAtivas",
            `${porcentagem}%`
        );


        atualizarElemento(
            "legendaAtivas",
            clinicasAtivas
        );


        atualizarElemento(
            "legendaInativas",
            clinicasInativas
        );


        // Barra de progresso

        const barra =
            document.getElementById(
                "barraAtivas"
            );


        if (barra) {

            barra.style.width =
                `${porcentagem}%`;

        }


        // Últimas clínicas

        await carregarUltimasClinicas();


        console.log(
            "Dashboard carregado com sucesso."
        );

    } catch (error) {

        console.error(
            "Erro ao carregar dashboard:",
            error
        );

    }

}


// ======================================
// ATUALIZAR ELEMENTO
// ======================================

function atualizarElemento(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent = valor;

    }

}


// ======================================
// ÚLTIMAS CLÍNICAS
// ======================================

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

            .select("*")

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


        if (!data || data.length === 0) {

            container.innerHTML = `

                <p class="carregando">
                    Nenhuma clínica cadastrada.
                </p>

            `;

            return;

        }


        container.innerHTML = "";


        data.forEach(clinica => {

            const status =
                clinica.ativo
                    ? "Ativa"
                    : "Inativa";


            container.innerHTML += `

                <div class="ultima-clinica">

                    <div class="ultima-clinica-icone">
                        🏥
                    </div>

                    <div class="ultima-clinica-info">

                        <strong>
                            ${clinica.nome || "Sem nome"}
                        </strong>

                        <span>
                            ${clinica.endereco || "Endereço não informado"}
                        </span>

                    </div>

                    <span class="
                        status-clinica
                        ${clinica.ativo ? "status-ativo" : "status-inativo"}
                    ">
                        ${status}
                    </span>

                </div>

            `;

        });

    } catch (error) {

        console.error(
            "Erro ao carregar últimas clínicas:",
            error
        );

        container.innerHTML = `

            <p class="carregando">
                Não foi possível carregar as clínicas.
            </p>

        `;

    }

}


// ======================================
// LISTAR CLÍNICAS
// ======================================

async function listarClinicas() {

    const tbody =
        document.getElementById(
            "listaClinicas"
        );


    if (!tbody) return;


    tbody.innerHTML = `

        <tr>

            <td colspan="6">
                Carregando clínicas...
            </td>

        </tr>

    `;


    try {

        const busca =
            document
                .getElementById("buscarClinica")
                ?.value
                .trim();


        const status =
            document
                .getElementById(
                    "filtroStatusClinica"
                )
                ?.value;


        let query =
            supabaseClient

                .from("clinicas")

                .select(`
                    *,
                    bairros(
                        nome,
                        cidades(
                            nome,
                            estados(
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


        if (status !== "") {

            query =
                query.eq(
                    "ativo",
                    status === "true"
                );

        }


        const {

            data,

            error

        } = await query;


        if (error) {

            throw error;

        }


        tbody.innerHTML = "";


        if (!data || data.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="6">
                        Nenhuma clínica encontrada.
                    </td>

                </tr>

            `;

            return;

        }


        data.forEach(clinica => {

            const bairro =
                clinica.bairros?.nome ||
                "-";


            const cidade =
                clinica.bairros?.cidades?.nome ||
                "-";


            const estado =
                clinica.bairros?.cidades?.estados?.nome ||
                "";


            const localizacao =
                `${bairro} - ${cidade}${estado ? "/" + estado : ""}`;


            tbody.innerHTML += `

                <tr>

                    <td>
                        <strong>
                            ${clinica.nome || "-"}
                        </strong>
                    </td>


                    <td>
                        ${localizacao}
                    </td>


                    <td>
                        ${clinica.telefone || "-"}
                    </td>


                    <td>
                        -
                    </td>


                    <td>

                        <span class="
                            status-clinica
                            ${clinica.ativo
                                ? "status-ativo"
                                : "status-inativo"
                            }
                        ">

                            ${clinica.ativo
                                ? "Ativa"
                                : "Inativa"
                            }

                        </span>

                    </td>


                    <td>

                        <button
                            class="btn-tabela editar"
                            onclick="editarClinica(${clinica.id})"
                        >
                            Editar
                        </button>


                        <button
                            class="btn-tabela excluir"
                            onclick="excluirClinica(${clinica.id})"
                        >
                            Excluir
                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(
            "Erro ao listar clínicas:",
            error
        );


        tbody.innerHTML = `

            <tr>

                <td colspan="6">
                    Erro ao carregar clínicas.
                </td>

            </tr>

        `;

    }

}


// ======================================
// MODAL CLÍNICA
// ======================================

async function abrirModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (!modal) return;


    document
        .getElementById("formClinica")
        .reset();


    document
        .getElementById("clinicaId")
        .value = "";


    document
        .getElementById(
            "tituloModalClinica"
        )
        .textContent =
        "Nova Clínica";


    document
        .getElementById(
            "areaStatusClinica"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "containerEspecialidades"
        )
        .innerHTML = "";


    await popularRegioes(
        "clinicaRegiao"
    );


    modal.classList.remove("hidden");

}


// ======================================
// FECHAR MODAL
// ======================================

function fecharModalClinica() {

    const modal =
        document.getElementById(
            "modalClinica"
        );


    if (modal) {

        modal.classList.add("hidden");

    }

}


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica(event) {

    event.preventDefault();


    try {

        const id =
            document
                .getElementById("clinicaId")
                .value;


        const nome =
            document
                .getElementById("clinicaNome")
                .value
                .trim();


        const endereco =
            document
                .getElementById("clinicaEndereco")
                .value
                .trim();


        const telefone =
            document
                .getElementById("clinicaTelefone")
                .value
                .trim();


        const bairroId =
            document
                .getElementById("clinicaBairro")
                .value;


        if (!nome) {

            alert(
                "Informe o nome da clínica."
            );

            return;

        }


        if (!endereco) {

            alert(
                "Informe o endereço."
            );

            return;

        }


        if (!bairroId) {

            alert(
                "Selecione o bairro."
            );

            return;

        }


        const dadosClinica = {

            nome: nome,

            endereco: endereco,

            telefone: telefone || null,

            bairro_id:
                Number(bairroId)

        };


        if (id) {

            const ativo =
                document
                    .getElementById(
                        "clinicaAtivo"
                    )
                    .checked;


            dadosClinica.ativo =
                ativo;


            const {

                error

            } = await supabaseClient

                .from("clinicas")

                .update(dadosClinica)

                .eq(
                    "id",
                    id
                );


            if (error) {

                throw error;

            }


            alert(
                "Clínica atualizada com sucesso!"
            );

        } else {

            dadosClinica.ativo = true;


            const {

                error

            } = await supabaseClient

                .from("clinicas")

                .insert(
                    dadosClinica
                );


            if (error) {

                throw error;

            }


            alert(
                "Clínica cadastrada com sucesso!"
            );

        }


        fecharModalClinica();

        await listarClinicas();

        await carregarDashboard();

    } catch (error) {

        console.error(
            "Erro ao salvar clínica:",
            error
        );

        alert(
            "Erro ao salvar clínica: " +
            error.message
        );

    }

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id) {

    try {

        const {

            data,

            error

        } = await supabaseClient

            .from("clinicas")

            .select("*")

            .eq(
                "id",
                id
            )

            .single();


        if (error) {

            throw error;

        }


        await abrirModalClinica();


        document
            .getElementById("clinicaId")
            .value =
            data.id;


        document
            .getElementById(
                "tituloModalClinica"
            )
            .textContent =
            "Editar Clínica";


        document
            .getElementById("clinicaNome")
            .value =
            data.nome || "";


        document
            .getElementById(
                "clinicaEndereco"
            )
            .value =
            data.endereco || "";


        document
            .getElementById(
                "clinicaTelefone"
            )
            .value =
            data.telefone || "";


        document
            .getElementById(
                "areaStatusClinica"
            )
            .classList.remove("hidden");


        document
            .getElementById(
                "clinicaAtivo"
            )
            .checked =
            data.ativo === true;


        if (data.bairro_id) {

            await selecionarLocalizacaoClinica(
                data.bairro_id
            );

        }

    } catch (error) {

        console.error(
            "Erro ao editar clínica:",
            error
        );

        alert(
            "Erro ao carregar clínica."
        );

    }

}


// ======================================
// EXCLUIR CLÍNICA
// ======================================

async function excluirClinica(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta clínica?"
        );


    if (!confirmar) return;


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
            "Erro ao excluir clínica."
        );

    }

}


// ======================================
// POPULAR REGIÕES
// ======================================

async function popularRegioes(selectId) {

    const select =
        document.getElementById(selectId);


    if (!select) return;


    try {

        const {

            data,

            error

        } = await supabaseClient

            .from("regioes")

            .select("*")

            .order("nome");


        if (error) {

            throw error;

        }


        const valorAtual =
            select.value;


        select.innerHTML = `

            <option value="">
                Selecione uma região
            </option>

        `;


        data.forEach(regiao => {

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


        select.value =
            valorAtual;

    } catch (error) {

        console.error(
            "Erro ao popular regiões:",
            error
        );

    }

}


// ======================================
// POPULAR ESTADOS
// ======================================

async function popularEstados(
    selectId,
    regiaoId = null
) {

    const select =
        document.getElementById(selectId);


    if (!select) return;


    try {

        let query =
            supabaseClient

                .from("estados")

                .select("*")

                .order("nome");


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

            throw error;

        }


        select.innerHTML = `

            <option value="">
                Selecione um estado
            </option>

        `;


        data.forEach(estado => {

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

    } catch (error) {

        console.error(
            "Erro ao popular estados:",
            error
        );

    }

}


// ======================================
// POPULAR CIDADES
// ======================================

async function popularCidades(
    selectId,
    estadoId = null
) {

    const select =
        document.getElementById(selectId);


    if (!select) return;


    try {

        let query =
            supabaseClient

                .from("cidades")

                .select("*")

                .order("nome");


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

            throw error;

        }


        select.innerHTML = `

            <option value="">
                Selecione uma cidade
            </option>

        `;


        data.forEach(cidade => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                cidade.id;


            option.textContent =
                cidade.nome;


            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Erro ao popular cidades:",
            error
        );

    }

}


// ======================================
// CARREGAR ESTADOS DA CLÍNICA
// ======================================

async function carregarEstadosClinica() {

    const regiaoId =
        document
            .getElementById(
                "clinicaRegiao"
            )
            .value;


    await popularEstados(
        "clinicaEstado",
        regiaoId
    );


    document
        .getElementById(
            "clinicaCidade"
        )
        .innerHTML = `
            <option value="">
                Selecione uma cidade
            </option>
        `;


    document
        .getElementById(
            "clinicaBairro"
        )
        .innerHTML = `
            <option value="">
                Selecione um bairro
            </option>
        `;

}


// ======================================
// CARREGAR CIDADES DA CLÍNICA
// ======================================

async function carregarCidadesClinica() {

    const estadoId =
        document
            .getElementById(
                "clinicaEstado"
            )
            .value;


    await popularCidades(
        "clinicaCidade",
        estadoId
    );


    document
        .getElementById(
            "clinicaBairro"
        )
        .innerHTML = `
            <option value="">
                Selecione um bairro
            </option>
        `;

}


// ======================================
// CARREGAR BAIRROS DA CLÍNICA
// ======================================

async function carregarBairrosClinica() {

    const cidadeId =
        document
            .getElementById(
                "clinicaCidade"
            )
            .value;


    const select =
        document.getElementById(
            "clinicaBairro"
        );


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

            .order("nome");


        if (error) {

            throw error;

        }


        select.innerHTML = `

            <option value="">
                Selecione um bairro
            </option>

        `;


        data.forEach(bairro => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                bairro.id;


            option.textContent =
                bairro.nome;


            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Erro ao carregar bairros:",
            error
        );

    }

}


// ======================================
// SELECIONAR LOCALIZAÇÃO AO EDITAR
// ======================================

async function selecionarLocalizacaoClinica(
    bairroId
) {

    try {

        const {

            data: bairro,

            error

        } = await supabaseClient

            .from("bairros")

            .select(`
                *,
                cidades(
                    *,
                    estados(
                        *
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


        const cidade =
            bairro.cidades;


        const estado =
            cidade.estados;


        const regiaoId =
            estado.regiao_id;


        document
            .getElementById(
                "clinicaRegiao"
            )
            .value =
            regiaoId;


        await carregarEstadosClinica();


        document
            .getElementById(
                "clinicaEstado"
            )
            .value =
            estado.id;


        await carregarCidadesClinica();


        document
            .getElementById(
                "clinicaCidade"
            )
            .value =
            cidade.id;


        await carregarBairrosClinica();


        document
            .getElementById(
                "clinicaBairro"
            )
            .value =
            bairro.id;

    } catch (error) {

        console.error(
            "Erro ao selecionar localização:",
            error
        );

    }

}


// ======================================
// LISTAR ESPECIALIDADES
// ======================================

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

            .from("especialidades")

            .select("*")

            .order("nome");


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(item => {

            container.innerHTML += `

                <div class="item-gerenciamento">

                    <span>
                        🦷 ${item.nome}
                    </span>

                    <div>

                        <button
                            onclick="editarEspecialidade(${item.id}, '${escaparTexto(item.nome)}')"
                        >
                            Editar
                        </button>

                        <button
                            onclick="excluirEspecialidade(${item.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(
            "Erro ao listar especialidades:",
            error
        );

    }

}


// ======================================
// SALVAR ESPECIALIDADE
// ======================================

async function salvarEspecialidade() {

    const input =
        document.getElementById(
            "nomeEspecialidade"
        );


    const id =
        document.getElementById(
            "especialidadeEditId"
        );


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Informe o nome da especialidade."
        );

        return;

    }


    try {

        if (id.value) {

            const {

                error

            } = await supabaseClient

                .from("especialidades")

                .update({
                    nome: nome
                })

                .eq(
                    "id",
                    id.value
                );


            if (error) {

                throw error;

            }

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

        }


        input.value = "";

        id.value = "";


        await listarEspecialidades();

        await carregarDashboard();

    } catch (error) {

        console.error(
            "Erro ao salvar especialidade:",
            error
        );

        alert(
            error.message
        );

    }

}


// ======================================
// EDITAR ESPECIALIDADE
// ======================================

function editarEspecialidade(id, nome) {

    document
        .getElementById(
            "especialidadeEditId"
        )
        .value = id;


    document
        .getElementById(
            "nomeEspecialidade"
        )
        .value = nome;

}


// ======================================
// EXCLUIR ESPECIALIDADE
// ======================================

async function excluirEspecialidade(id) {

    if (!confirm("Deseja excluir esta especialidade?")) {

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

    } catch (error) {

        alert(
            "Erro ao excluir especialidade."
        );

    }

}


// ======================================
// LISTAR REGIÕES
// ======================================

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

            .order("nome");


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(item => {

            container.innerHTML += `

                <div class="item-gerenciamento">

                    <span>
                        🌎 ${item.nome}
                    </span>

                    <div>

                        <button
                            onclick="editarRegiao(${item.id}, '${escaparTexto(item.nome)}')"
                        >
                            Editar
                        </button>

                        <button
                            onclick="excluirRegiao(${item.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// SALVAR REGIÃO
// ======================================

async function salvarRegiao() {

    const input =
        document.getElementById(
            "nomeRegiao"
        );


    const inputId =
        document.getElementById(
            "regiaoEditId"
        );


    const nome =
        input.value.trim();


    if (!nome) return;


    try {

        if (inputId.value) {

            await supabaseClient

                .from("regioes")

                .update({
                    nome
                })

                .eq(
                    "id",
                    inputId.value
                );

        } else {

            await supabaseClient

                .from("regioes")

                .insert({
                    nome
                });

        }


        input.value = "";

        inputId.value = "";


        await listarRegioes();

        await popularRegioes(
            "estadoRegiao"
        );

        await carregarDashboard();

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// EDITAR REGIÃO
// ======================================

function editarRegiao(id, nome) {

    document
        .getElementById(
            "regiaoEditId"
        )
        .value = id;


    document
        .getElementById(
            "nomeRegiao"
        )
        .value = nome;

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

    if (!confirm("Deseja excluir esta região?")) {

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

        await carregarDashboard();

    } catch (error) {

        alert(
            "Não foi possível excluir a região."
        );

    }

}


// ======================================
// LISTAR ESTADOS
// ======================================

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
                regioes(nome)
            `)

            .order("nome");


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(item => {

            container.innerHTML += `

                <div class="item-gerenciamento">

                    <span>
                        📍 ${item.nome}
                        <small>
                            (${item.regioes?.nome || "Sem região"})
                        </small>
                    </span>

                    <div>

                        <button
                            onclick="editarEstado(
                                ${item.id},
                                '${escaparTexto(item.nome)}',
                                ${item.regiao_id}
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="excluirEstado(${item.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// SALVAR ESTADO
// ======================================

async function salvarEstado() {

    const nome =
        document
            .getElementById(
                "nomeEstado"
            )
            .value
            .trim();


    const regiaoId =
        document
            .getElementById(
                "estadoRegiao"
            )
            .value;


    const id =
        document
            .getElementById(
                "estadoEditId"
            )
            .value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    try {

        const dados = {

            nome,

            regiao_id:
                Number(regiaoId)

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


        document
            .getElementById(
                "nomeEstado"
            )
            .value = "";


        document
            .getElementById(
                "estadoRegiao"
            )
            .value = "";


        document
            .getElementById(
                "estadoEditId"
            )
            .value = "";


        await listarEstados();

        await carregarDashboard();

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// EDITAR ESTADO
// ======================================

function editarEstado(
    id,
    nome,
    regiaoId
) {

    document
        .getElementById(
            "estadoEditId"
        )
        .value = id;


    document
        .getElementById(
            "nomeEstado"
        )
        .value = nome;


    document
        .getElementById(
            "estadoRegiao"
        )
        .value = regiaoId;

}


// ======================================
// EXCLUIR ESTADO
// ======================================

async function excluirEstado(id) {

    if (!confirm("Deseja excluir este estado?")) {

        return;

    }


    try {

        await supabaseClient

            .from("estados")

            .delete()

            .eq(
                "id",
                id
            );


        await listarEstados();

        await carregarDashboard();

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// LISTAR CIDADES
// ======================================

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
                estados(nome)
            `)

            .order("nome");


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(item => {

            container.innerHTML += `

                <div class="item-gerenciamento">

                    <span>
                        🏙 ${item.nome}

                        <small>
                            (${item.estados?.nome || "Sem estado"})
                        </small>
                    </span>

                    <div>

                        <button
                            onclick="editarCidade(
                                ${item.id},
                                '${escaparTexto(item.nome)}',
                                ${item.estado_id}
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="excluirCidade(${item.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// SALVAR CIDADE
// ======================================

async function salvarCidade() {

    const nome =
        document
            .getElementById(
                "nomeCidade"
            )
            .value
            .trim();


    const estadoId =
        document
            .getElementById(
                "cidadeEstado"
            )
            .value;


    const id =
        document
            .getElementById(
                "cidadeEditId"
            )
            .value;


    if (!nome || !estadoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    try {

        const dados = {

            nome,

            estado_id:
                Number(estadoId)

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


        document
            .getElementById(
                "nomeCidade"
            )
            .value = "";


        document
            .getElementById(
                "cidadeEstado"
            )
            .value = "";


        document
            .getElementById(
                "cidadeEditId"
            )
            .value = "";


        await listarCidades();

        await carregarDashboard();

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// EDITAR CIDADE
// ======================================

function editarCidade(
    id,
    nome,
    estadoId
) {

    document
        .getElementById(
            "cidadeEditId"
        )
        .value = id;


    document
        .getElementById(
            "nomeCidade"
        )
        .value = nome;


    document
        .getElementById(
            "cidadeEstado"
        )
        .value = estadoId;

}


// ======================================
// EXCLUIR CIDADE
// ======================================

async function excluirCidade(id) {

    if (!confirm("Deseja excluir esta cidade?")) {

        return;

    }


    try {

        await supabaseClient

            .from("cidades")

            .delete()

            .eq(
                "id",
                id
            );


        await listarCidades();

        await carregarDashboard();

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// LISTAR BAIRROS
// ======================================

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
                cidades(nome)
            `)

            .order("nome");


        if (error) {

            throw error;

        }


        container.innerHTML = "";


        data.forEach(item => {

            container.innerHTML += `

                <div class="item-gerenciamento">

                    <span>
                        🏘 ${item.nome}

                        <small>
                            (${item.cidades?.nome || "Sem cidade"})
                        </small>
                    </span>

                    <div>

                        <button
                            onclick="editarBairro(
                                ${item.id},
                                '${escaparTexto(item.nome)}',
                                ${item.cidade_id}
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="excluirBairro(${item.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// SALVAR BAIRRO
// ======================================

async function salvarBairro() {

    const nome =
        document
            .getElementById(
                "nomeBairro"
            )
            .value
            .trim();


    const cidadeId =
        document
            .getElementById(
                "bairroCidade"
            )
            .value;


    const id =
        document
            .getElementById(
                "bairroEditId"
            )
            .value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    try {

        const dados = {

            nome,

            cidade_id:
                Number(cidadeId)

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


        document
            .getElementById(
                "nomeBairro"
            )
            .value = "";


        document
            .getElementById(
                "bairroCidade"
            )
            .value = "";


        document
            .getElementById(
                "bairroEditId"
            )
            .value = "";


        await listarBairros();

        await carregarDashboard();

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// EDITAR BAIRRO
// ======================================

function editarBairro(
    id,
    nome,
    cidadeId
) {

    document
        .getElementById(
            "bairroEditId"
        )
        .value = id;


    document
        .getElementById(
            "nomeBairro"
        )
        .value = nome;


    document
        .getElementById(
            "bairroCidade"
        )
        .value = cidadeId;

}


// ======================================
// EXCLUIR BAIRRO
// ======================================

async function excluirBairro(id) {

    if (!confirm("Deseja excluir este bairro?")) {

        return;

    }


    try {

        await supabaseClient

            .from("bairros")

            .delete()

            .eq(
                "id",
                id
            );


        await listarBairros();

        await carregarDashboard();

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// ADICIONAR LINHA ESPECIALIDADE
// ======================================

async function adicionarLinhaEspecialidade() {

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    try {

        const {

            data,

            error

        } = await supabaseClient

            .from("especialidades")

            .select("*")

            .order("nome");


        if (error) {

            throw error;

        }


        const linha =
            document.createElement("div");


        linha.className =
            "linha-especialidade";


        let options =
            `<option value="">Selecione uma especialidade</option>`;


        data.forEach(item => {

            options += `

                <option value="${item.id}">
                    ${item.nome}
                </option>

            `;

        });


        linha.innerHTML = `

            <select class="select-especialidade">

                ${options}

            </select>

            <button
                type="button"
                onclick="this.parentElement.remove()"
            >
                ×
            </button>

        `;


        container.appendChild(linha);

    } catch (error) {

        console.error(
            "Erro ao carregar especialidades:",
            error
        );

    }

}


// ======================================
// ALTERNAR TEMA
// ======================================

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


// ======================================
// CARREGAR TEMA SALVO
// ======================================

(function carregarTema() {

    const tema =
        localStorage.getItem("tema");


    if (tema === "dark") {

        document.body.classList.add(
            "dark"
        );

    }

})();


// ======================================
// VOLTAR AO SITE
// ======================================

function voltarAoSite() {

    window.location.href =
        "index.html";

}


// ======================================
// SAIR
// ======================================

function sair() {

    const confirmar =
        confirm(
            "Deseja realmente sair do painel?"
        );


    if (confirmar) {

        window.location.href =
            "index.html";

    }

}


// ======================================
// ESCAPAR TEXTO
// ======================================

function escaparTexto(texto) {

    if (!texto) return "";


    return String(texto)

        .replace(/\\/g, "\\\\")

        .replace(/'/g, "\\'")

        .replace(/"/g, "&quot;");

}


// ======================================
// FECHAR MODAL AO CLICAR FORA
// ======================================

window.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "modalClinica"
            );


        if (
            event.target === modal
        ) {

            fecharModalClinica();

        }

    }
);
