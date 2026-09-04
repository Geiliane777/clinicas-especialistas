// ======================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO
// ======================================

console.log("admin.js carregado");


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Painel administrativo iniciado"
        );


        configurarNavegacao();

        configurarEventos();

        await carregarDashboard();

        await mostrarPagina(
            "dashboard"
        );

    }
);


// ======================================
// CONFIGURAR EVENTOS
// ======================================

function configurarEventos() {

    // ==================================
    // BOTÃO MENU MOBILE
    // ==================================

    const btnMenu =
        document.getElementById(
            "btnMenuMobile"
        );

    if (btnMenu) {

        btnMenu.addEventListener(
            "click",
            () => {

                const sidebar =
                    document.getElementById(
                        "sidebar"
                    );

                sidebar?.classList.toggle(
                    "sidebar-aberta"
                );

            }
        );

    }


    // ==================================
    // FORM CLÍNICA
    // ==================================

    const formClinica =
        document.getElementById(
            "formClinica"
        );

    if (formClinica) {

        formClinica.addEventListener(
            "submit",
            salvarClinica
        );

    }


    // ==================================
    // CASCATA CLÍNICA
    // ==================================

    const clinicaRegiao =
        document.getElementById(
            "clinicaRegiao"
        );

    const clinicaEstado =
        document.getElementById(
            "clinicaEstado"
        );

    const clinicaCidade =
        document.getElementById(
            "clinicaCidade"
        );


    if (clinicaRegiao) {

        clinicaRegiao.addEventListener(
            "change",
            carregarEstadosClinica
        );

    }


    if (clinicaEstado) {

        clinicaEstado.addEventListener(
            "change",
            carregarCidadesClinica
        );

    }


    if (clinicaCidade) {

        clinicaCidade.addEventListener(
            "change",
            carregarBairrosClinica
        );

    }


    // ==================================
    // BUSCA CLÍNICAS
    // ==================================

    const buscarClinica =
        document.getElementById(
            "buscarClinica"
        );

    if (buscarClinica) {

        buscarClinica.addEventListener(
            "input",
            () => {

                listarClinicas();

            }
        );

    }


    // ==================================
    // FILTRO STATUS
    // ==================================

    const filtroStatus =
        document.getElementById(
            "filtroStatusClinica"
        );

    if (filtroStatus) {

        filtroStatus.addEventListener(
            "change",
            listarClinicas
        );

    }

}


// ======================================
// NAVEGAÇÃO DO PAINEL
// ======================================

function configurarNavegacao() {

    const botoes =
        document.querySelectorAll(
            "[data-pagina]"
        );


    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            async () => {

                const pagina =
                    botao.dataset.pagina;


                await mostrarPagina(
                    pagina
                );


                // Fecha menu mobile

                const sidebar =
                    document.getElementById(
                        "sidebar"
                    );

                sidebar?.classList.remove(
                    "sidebar-aberta"
                );

            }
        );

    });

}


// ======================================
// TÍTULOS DAS PÁGINAS
// ======================================

const TITULOS_PAGINA = {

    dashboard:
        "Dashboard",

    regioes:
        "Gerenciar Regiões",

    estados:
        "Gerenciar Estados",

    cidades:
        "Gerenciar Cidades",

    bairros:
        "Gerenciar Bairros",

    especialidades:
        "Gerenciar Especialidades",

    clinicas:
        "Gerenciar Clínicas"

};


// ======================================
// MOSTRAR PÁGINA
// ======================================

async function mostrarPagina(nomePagina) {

    console.log(
        "Abrindo página:",
        nomePagina
    );


    // ==================================
    // ESCONDE TODAS AS PÁGINAS
    // ==================================

    document
        .querySelectorAll(
            ".pagina"
        )
        .forEach(pagina => {

            pagina.classList.add(
                "hidden"
            );

        });


    // ==================================
    // MOSTRA PÁGINA SELECIONADA
    // ==================================

    const pagina =
        document.getElementById(
            `pagina-${nomePagina}`
        );


    if (pagina) {

        pagina.classList.remove(
            "hidden"
        );

    }


    // ==================================
    // ATUALIZA MENU ATIVO
    // ==================================

    document
        .querySelectorAll(
            "[data-pagina]"
        )
        .forEach(botao => {

            botao.classList.remove(
                "ativo"
            );

        });


    const botaoAtivo =
        document.querySelector(
            `[data-pagina="${nomePagina}"]`
        );


    botaoAtivo?.classList.add(
        "ativo"
    );


    // ==================================
    // ATUALIZA TÍTULO
    // ==================================

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (titulo) {

        titulo.textContent =
            TITULOS_PAGINA[nomePagina]
            || "Painel Administrativo";

    }


    // ==================================
    // CARREGADORES
    // ==================================

    switch (nomePagina) {

        case "dashboard":

            await carregarDashboard();

            break;


        case "regioes":

            await listarRegioes();

            break;


        case "estados":

            await carregarRegioesSelect();

            await listarEstados();

            break;


        case "cidades":

            await carregarEstadosSelect();

            await listarCidades();

            break;


        case "bairros":

            await carregarCidadesSelect();

            await listarBairros();

            break;


        case "especialidades":

            await listarEspecialidades();

            break;


        case "clinicas":

            await listarClinicas();

            break;

    }

}


// ======================================
// DASHBOARD
// ======================================

async function carregarDashboard() {

    console.log(
        "Atualizando dashboard..."
    );


    try {

        const [
            clinicas,
            especialidades,
            cidades,
            bairros
        ] = await Promise.all([

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
                )

        ]);


        const totalClinicas =
            document.getElementById(
                "totalClinicas"
            );

        const totalEspecialidades =
            document.getElementById(
                "totalEspecialidades"
            );

        const totalCidades =
            document.getElementById(
                "totalCidades"
            );

        const totalBairros =
            document.getElementById(
                "totalBairros"
            );


        if (totalClinicas) {

            totalClinicas.textContent =
                clinicas.count || 0;

        }


        if (totalEspecialidades) {

            totalEspecialidades.textContent =
                especialidades.count || 0;

        }


        if (totalCidades) {

            totalCidades.textContent =
                cidades.count || 0;

        }


        if (totalBairros) {

            totalBairros.textContent =
                bairros.count || 0;

        }


        // ==================================
        // CLÍNICAS ATIVAS
        // ==================================

        const {
            count: clinicasAtivas
        } = await supabaseClient
            .from("clinicas")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )
            .eq(
                "ativo",
                true
            );


        const totalAtivas =
            document.getElementById(
                "totalClinicasAtivas"
            );


        if (totalAtivas) {

            totalAtivas.textContent =
                clinicasAtivas || 0;

        }


    } catch (error) {

        console.error(
            "Erro ao carregar dashboard:",
            error
        );

    }

}


// ======================================
// REGIÕES
// ======================================

async function listarRegioes() {

    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaRegioes"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data?.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma região cadastrada.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${escaparTexto(item.nome)}
                    </strong>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarRegiao(${item.id})"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirRegiao(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

}


// ======================================
// SALVAR REGIÃO
// ======================================

async function salvarRegiao() {

    const nome =
        document
            .getElementById(
                "nomeRegiao"
            )
            ?.value
            .trim();


    const id =
        document
            .getElementById(
                "regiaoEditId"
            )
            ?.value;


    if (!nome) {

        alert(
            "Informe o nome da região."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("regioes")
                .update({
                    nome
                })
                .eq(
                    "id",
                    id
                );

    } else {

        resultado =
            await supabaseClient
                .from("regioes")
                .insert({
                    nome
                });

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar região."
        );

        return;

    }


    document.getElementById(
        "nomeRegiao"
    ).value = "";


    document.getElementById(
        "regiaoEditId"
    ).value = "";


    await listarRegioes();

    await carregarDashboard();

}


// ======================================
// EDITAR REGIÃO
// ======================================

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


    document.getElementById(
        "regiaoEditId"
    ).value = data.id;


    document.getElementById(
        "nomeRegiao"
    ).value = data.nome;

}


// ======================================
// EXCLUIR REGIÃO
// ======================================

async function excluirRegiao(id) {

    if (
        !confirm(
            "Deseja excluir esta região?"
        )
    ) return;


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

        console.error(error);

        alert(
            "Não foi possível excluir esta região. Verifique se existem estados vinculados."
        );

        return;

    }


    await listarRegioes();

    await carregarDashboard();

}


// ======================================
// SELECT REGIÕES
// ======================================

async function carregarRegioesSelect() {

    const select =
        document.getElementById(
            "estadoRegiao"
        );


    if (!select) return;


    const valorAtual =
        select.value;


    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML = `
        <option value="">
            Selecione uma região
        </option>
    `;


    data?.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${escaparTexto(item.nome)}
            </option>
        `;

    });


    if (valorAtual) {

        select.value =
            valorAtual;

    }

}


// ======================================
// ESTADOS
// ======================================

async function listarEstados() {

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

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data?.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhum estado cadastrado.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${escaparTexto(item.nome)}
                    </strong>

                    <div class="item-subtitulo">

                        Região:
                        ${escaparTexto(
                            item.regioes?.nome || "-"
                        )}

                    </div>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEstado(${item.id})"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirEstado(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

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
            ?.value
            .trim();


    const regiaoId =
        document.getElementById(
            "estadoRegiao"
        )?.value;


    const id =
        document.getElementById(
            "estadoEditId"
        )?.value;


    if (!nome || !regiaoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("estados")
                .update({

                    nome,

                    regiao_id:
                        Number(regiaoId)

                })
                .eq(
                    "id",
                    id
                );

    } else {

        resultado =
            await supabaseClient
                .from("estados")
                .insert({

                    nome,

                    regiao_id:
                        Number(regiaoId)

                });

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar estado."
        );

        return;

    }


    document.getElementById(
        "nomeEstado"
    ).value = "";


    document.getElementById(
        "estadoRegiao"
    ).value = "";


    document.getElementById(
        "estadoEditId"
    ).value = "";


    await listarEstados();

    await carregarDashboard();

}


// ======================================
// EDITAR ESTADO
// ======================================

async function editarEstado(id) {

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

        console.error(error);

        return;

    }


    await carregarRegioesSelect();


    document.getElementById(
        "estadoEditId"
    ).value = data.id;


    document.getElementById(
        "nomeEstado"
    ).value = data.nome;


    document.getElementById(
        "estadoRegiao"
    ).value = data.regiao_id;

}


// ======================================
// EXCLUIR ESTADO
// ======================================

async function excluirEstado(id) {

    if (
        !confirm(
            "Deseja excluir este estado?"
        )
    ) return;


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

        console.error(error);

        alert(
            "Não foi possível excluir este estado. Verifique se existem cidades vinculadas."
        );

        return;

    }


    await listarEstados();

    await carregarDashboard();

}


// ======================================
// SELECT ESTADOS
// ======================================

async function carregarEstadosSelect() {

    const select =
        document.getElementById(
            "cidadeEstado"
        );


    if (!select) return;


    const valorAtual =
        select.value;


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

        console.error(error);

        return;

    }


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">

                ${escaparTexto(item.nome)}

            </option>

        `;

    });


    if (valorAtual) {

        select.value =
            valorAtual;

    }

}


// ======================================
// CIDADES
// ======================================

async function listarCidades() {

    const {
        data,
        error
    } = await supabaseClient
        .from("cidades")
        .select(`
            *,
            estados(
                nome,
                regioes(nome)
            )
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data?.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma cidade cadastrada.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${escaparTexto(item.nome)}
                    </strong>

                    <div class="item-subtitulo">

                        ${escaparTexto(
                            item.estados?.nome || "-"
                        )}

                        -

                        ${escaparTexto(
                            item.estados?.regioes?.nome || "-"
                        )}

                    </div>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarCidade(${item.id})"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirCidade(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

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
            ?.value
            .trim();


    const estadoId =
        document.getElementById(
            "cidadeEstado"
        )?.value;


    const id =
        document.getElementById(
            "cidadeEditId"
        )?.value;


    if (!nome || !estadoId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("cidades")
                .update({

                    nome,

                    estado_id:
                        Number(estadoId)

                })
                .eq(
                    "id",
                    id
                );

    } else {

        resultado =
            await supabaseClient
                .from("cidades")
                .insert({

                    nome,

                    estado_id:
                        Number(estadoId)

                });

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar cidade."
        );

        return;

    }


    document.getElementById(
        "nomeCidade"
    ).value = "";


    document.getElementById(
        "cidadeEstado"
    ).value = "";


    document.getElementById(
        "cidadeEditId"
    ).value = "";


    await listarCidades();

    await carregarDashboard();

}


// ======================================
// EDITAR CIDADE
// ======================================

async function editarCidade(id) {

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

        console.error(error);

        return;

    }


    await carregarEstadosSelect();


    document.getElementById(
        "cidadeEditId"
    ).value = data.id;


    document.getElementById(
        "nomeCidade"
    ).value = data.nome;


    document.getElementById(
        "cidadeEstado"
    ).value = data.estado_id;

}


// ======================================
// EXCLUIR CIDADE
// ======================================

async function excluirCidade(id) {

    if (
        !confirm(
            "Deseja excluir esta cidade?"
        )
    ) return;


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

        console.error(error);

        alert(
            "Não foi possível excluir esta cidade. Verifique se existem bairros vinculados."
        );

        return;

    }


    await listarCidades();

    await carregarDashboard();

}


// ======================================
// SELECT CIDADES
// ======================================

async function carregarCidadesSelect() {

    const select =
        document.getElementById(
            "bairroCidade"
        );


    if (!select) return;


    const valorAtual =
        select.value;


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

        console.error(error);

        return;

    }


    select.innerHTML = `
        <option value="">
            Selecione uma cidade
        </option>
    `;


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">

                ${escaparTexto(item.nome)}
                -
                ${escaparTexto(
                    item.estados?.nome || ""
                )}

            </option>

        `;

    });


    if (valorAtual) {

        select.value =
            valorAtual;

    }

}


// ======================================
// BAIRROS
// ======================================

async function listarBairros() {

    const {
        data,
        error
    } = await supabaseClient
        .from("bairros")
        .select(`
            *,
            cidades(
                nome,
                estados(
                    nome,
                    regioes(nome)
                )
            )
        `)
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data?.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhum bairro cadastrado.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${escaparTexto(item.nome)}
                    </strong>

                    <div class="item-subtitulo">

                        ${escaparTexto(
                            item.cidades?.nome || "-"
                        )}

                        -

                        ${escaparTexto(
                            item.cidades?.estados?.nome || "-"
                        )}

                    </div>

                </div>


                <div class="item-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarBairro(${item.id})"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirBairro(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `;

    });

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
            ?.value
            .trim();


    const cidadeId =
        document.getElementById(
            "bairroCidade"
        )?.value;


    const id =
        document.getElementById(
            "bairroEditId"
        )?.value;


    if (!nome || !cidadeId) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("bairros")
                .update({

                    nome,

                    cidade_id:
                        Number(cidadeId)

                })
                .eq(
                    "id",
                    id
                );

    } else {

        resultado =
            await supabaseClient
                .from("bairros")
                .insert({

                    nome,

                    cidade_id:
                        Number(cidadeId)

                });

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar bairro."
        );

        return;

    }


    document.getElementById(
        "nomeBairro"
    ).value = "";


    document.getElementById(
        "bairroCidade"
    ).value = "";


    document.getElementById(
        "bairroEditId"
    ).value = "";


    await listarBairros();

    await carregarDashboard();

}


// ======================================
// EDITAR BAIRRO
// ======================================

async function editarBairro(id) {

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

        console.error(error);

        return;

    }


    await carregarCidadesSelect();


    document.getElementById(
        "bairroEditId"
    ).value = data.id;


    document.getElementById(
        "nomeBairro"
    ).value = data.nome;


    document.getElementById(
        "bairroCidade"
    ).value = data.cidade_id;

}


// ======================================
// EXCLUIR BAIRRO
// ======================================

async function excluirBairro(id) {

    if (
        !confirm(
            "Deseja excluir este bairro?"
        )
    ) return;


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

        console.error(error);

        alert(
            "Erro ao excluir bairro."
        );

        return;

    }


    await listarBairros();

    await carregarDashboard();

}


// ======================================
// ESPECIALIDADES
// ======================================

async function listarEspecialidades() {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    const lista =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data?.length) {

        lista.innerHTML = `
            <div class="sem-dados">
                Nenhuma especialidade cadastrada.
            </div>
        `;

        return;

    }


    data.forEach(item => {

        lista.innerHTML += `

            <div class="item-gerenciamento">

                <div>

                    <strong>
                        ${escaparTexto(item.nome)}
                    </strong>

                </div>


                <div class="item-acoes">

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

                </div>

            </div>

        `;

    });

}


// ======================================
// SALVAR ESPECIALIDADE
// ======================================

async function salvarEspecialidade() {

    const nome =
        document
            .getElementById(
                "nomeEspecialidade"
            )
            ?.value
            .trim();


    const id =
        document.getElementById(
            "especialidadeEditId"
        )?.value;


    if (!nome) {

        alert(
            "Informe o nome da especialidade."
        );

        return;

    }


    let resultado;


    if (id) {

        resultado =
            await supabaseClient
                .from("especialidades")
                .update({
                    nome
                })
                .eq(
                    "id",
                    id
                );

    } else {

        resultado =
            await supabaseClient
                .from("especialidades")
                .insert({
                    nome
                });

    }


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            "Erro ao salvar especialidade."
        );

        return;

    }


    document.getElementById(
        "nomeEspecialidade"
    ).value = "";


    document.getElementById(
        "especialidadeEditId"
    ).value = "";


    await listarEspecialidades();

    await carregarDashboard();

}


// ======================================
// EDITAR ESPECIALIDADE
// ======================================

async function editarEspecialidade(id) {

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

        console.error(error);

        return;

    }


    document.getElementById(
        "especialidadeEditId"
    ).value = data.id;


    document.getElementById(
        "nomeEspecialidade"
    ).value = data.nome;

}


// ======================================
// EXCLUIR ESPECIALIDADE
// ======================================

async function excluirEspecialidade(id) {

    if (
        !confirm(
            "Deseja excluir esta especialidade?"
        )
    ) return;


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

        console.error(error);

        alert(
            "Não foi possível excluir esta especialidade porque ela pode estar vinculada a uma clínica."
        );

        return;

    }


    await listarEspecialidades();

    await carregarDashboard();

}


// ======================================
// LISTAR CLÍNICAS
// ======================================

async function listarClinicas() {

    const busca =
        document
            .getElementById(
                "buscarClinica"
            )
            ?.value
            .trim() || "";


    const status =
        document
            .getElementById(
                "filtroStatusClinica"
            )
            ?.value ?? "";


    let consulta =
        supabaseClient
            .from("clinicas")
            .select(`
                *,
                bairros(
                    nome,
                    cidades(
                        nome,
                        estados(nome)
                    )
                ),
                clinica_especialidades(
                    rede,
                    ativo,
                    especialidades(nome)
                )
            `)
            .order(
                "nome"
            );


    if (busca) {

        consulta =
            consulta.ilike(
                "nome",
                `%${busca}%`
            );

    }


    if (status !== "") {

        consulta =
            consulta.eq(
                "ativo",
                status === "true"
            );

    }


    const {
        data,
        error
    } = await consulta;


    if (error) {

        console.error(
            "Erro ao listar clínicas:",
            error
        );

        return;

    }


    const lista =
        document.getElementById(
            "listaClinicas"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (!data?.length) {

        lista.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    class="sem-dados"
                >

                    Nenhuma clínica encontrada.

                </td>

            </tr>
        `;

        return;

    }


    data.forEach(clinica => {

        const bairro =
            clinica.bairros?.nome || "-";


        const cidade =
            clinica.bairros?.cidades?.nome || "-";


        const estado =
            clinica.bairros?.cidades
                ?.estados?.nome || "-";


        const especialidades =
            clinica.clinica_especialidades
                ?.filter(
                    item => item.ativo
                )
                .map(item => {

                    const nome =
                        item.especialidades?.nome || "";


                    const rede =
                        formatarRede(
                            item.rede
                        );


                    return `

                        <span
                            class="especialidade-tag"
                        >

                            ${escaparTexto(nome)}
                            (${escaparTexto(rede)})

                        </span>

                    `;

                })
                .join("")
            || "";


        lista.innerHTML += `

            <tr>

                <td>

                    <strong>
                        ${escaparTexto(
                            clinica.nome
                        )}
                    </strong>

                </td>


                <td>

                    ${escaparTexto(bairro)}

                    <br>

                    ${escaparTexto(cidade)}
                    -
                    ${escaparTexto(estado)}

                </td>


                <td>

                    ${escaparTexto(
                        clinica.telefone || "-"
                    )}

                </td>


                <td>

                    ${especialidades || "-"}

                </td>


                <td>

                    ${
                        clinica.ativo
                            ?
                            `
                            <span class="status-ativa">
                                Ativa
                            </span>
                            `
                            :
                            `
                            <span class="status-inativa">
                                Inativa
                            </span>
                            `
                    }

                </td>


                <td>

                    <div class="acoes">

                        <button
                            class="btn-editar"
                            onclick="editarClinica(${clinica.id})"
                        >
                            Editar
                        </button>


                        <button
                            class="${
                                clinica.ativo
                                    ? "btn-desativar"
                                    : "btn-ativar"
                            }"
                            onclick="alterarStatusClinica(
                                ${clinica.id},
                                ${clinica.ativo}
                            )"
                        >

                            ${
                                clinica.ativo
                                    ? "Desativar"
                                    : "Ativar"
                            }

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ======================================
// ABRIR MODAL CLÍNICA
// ======================================

async function abrirModalClinica() {

    const form =
        document.getElementById(
            "formClinica"
        );


    if (!form) return;


    form.reset();


    document.getElementById(
        "clinicaId"
    ).value = "";


    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (container) {

        container.innerHTML = "";

    }


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Nova Clínica";


    document.getElementById(
        "areaStatusClinica"
    )?.classList.add(
        "hidden"
    );


    document.getElementById(
        "modalClinica"
    )?.classList.remove(
        "hidden"
    );


    await carregarRegioesClinica();

}


// ======================================
// FECHAR MODAL
// ======================================

function fecharModalClinica() {

    document
        .getElementById(
            "modalClinica"
        )
        ?.classList.add(
            "hidden"
        );

}


// ======================================
// REGIÕES CLÍNICA
// ======================================

async function carregarRegioesClinica() {

    const select =
        document.getElementById(
            "clinicaRegiao"
        );


    if (!select) return;


    const {
        data,
        error
    } = await supabaseClient
        .from("regioes")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    select.innerHTML = `
        <option value="">
            Selecione uma região
        </option>
    `;


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">

                ${escaparTexto(item.nome)}

            </option>

        `;

    });

}


// ======================================
// ESTADOS CLÍNICA
// ======================================

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


    select.innerHTML = `
        <option value="">
            Selecione um estado
        </option>
    `;


    const cidade =
        document.getElementById(
            "clinicaCidade"
        );

    const bairro =
        document.getElementById(
            "clinicaBairro"
        );


    if (cidade) {

        cidade.innerHTML = `
            <option value="">
                Selecione uma cidade
            </option>
        `;

    }


    if (bairro) {

        bairro.innerHTML = `
            <option value="">
                Selecione um bairro
            </option>
        `;

    }


    if (!regiaoId) return;


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
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">

                ${escaparTexto(item.nome)}

            </option>

        `;

    });

}


// ======================================
// CIDADES CLÍNICA
// ======================================

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


    if (!estadoId) return;


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
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">

                ${escaparTexto(item.nome)}

            </option>

        `;

    });

}


// ======================================
// BAIRROS CLÍNICA
// ======================================

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


    select.innerHTML = `
        <option value="">
            Selecione um bairro
        </option>
    `;


    if (!cidadeId) return;


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

        console.error(error);

        return;

    }


    data?.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">

                ${escaparTexto(item.nome)}

            </option>

        `;

    });

}


// ======================================
// ADICIONAR ESPECIALIDADE
// ======================================

async function adicionarLinhaEspecialidade(
    especialidadeSelecionada = "",
    redeSelecionada = "especialistas"
) {

    const {
        data,
        error
    } = await supabaseClient
        .from("especialidades")
        .select("*")
        .order("nome");


    if (error) {

        console.error(error);

        return;

    }


    let options = `
        <option value="">
            Selecione uma especialidade
        </option>
    `;


    data?.forEach(item => {

        const selected =
            String(item.id) ===
            String(especialidadeSelecionada)
                ? "selected"
                : "";


        options += `

            <option
                value="${item.id}"
                ${selected}
            >

                ${escaparTexto(item.nome)}

            </option>

        `;

    });


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

            ${options}

        </select>


        <select
            class="select-rede"
        >

            <option
                value="especialistas"
                ${
                    redeSelecionada ===
                    "especialistas"
                        ? "selected"
                        : ""
                }
            >

                Rede Especialistas

            </option>


            <option
                value="sindilegis"
                ${
                    redeSelecionada ===
                    "sindilegis"
                        ? "selected"
                        : ""
                }
            >

                Rede Sindilegis

            </option>

        </select>


        <button
            type="button"
            class="btn-remover-especialidade"
        >

            Remover

        </button>

    `;


    linha
        .querySelector(
            ".btn-remover-especialidade"
        )
        .addEventListener(
            "click",
            () => {

                linha.remove();

            }
        );


    document
        .getElementById(
            "containerEspecialidades"
        )
        ?.appendChild(
            linha
        );

}


// ======================================
// SALVAR CLÍNICA
// ======================================

async function salvarClinica(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "clinicaId"
        ).value;


    const nome =
        document.getElementById(
            "clinicaNome"
        ).value.trim();


    const endereco =
        document.getElementById(
            "clinicaEndereco"
        ).value.trim();


    const telefone =
        document.getElementById(
            "clinicaTelefone"
        ).value.trim();


    const bairroId =
        document.getElementById(
            "clinicaBairro"
        ).value;


    if (
        !nome ||
        !endereco ||
        !bairroId
    ) {

        alert(
            "Preencha os campos obrigatórios."
        );

        return;

    }


    const dadosClinica = {

        nome,

        endereco,

        telefone:
            telefone || null,

        bairro_id:
            Number(bairroId)

    };


    let clinicaId;


    // ==================================
    // EDITAR CLÍNICA
    // ==================================

    if (id) {

        const ativo =
            document.getElementById(
                "clinicaAtivo"
            )?.checked;


        dadosClinica.ativo =
            Boolean(ativo);


        const {
            error
        } = await supabaseClient
            .from("clinicas")
            .update(
                dadosClinica
            )
            .eq(
                "id",
                id
            );


        if (error) {

            console.error(error);

            alert(
                "Erro ao atualizar clínica."
            );

            return;

        }


        clinicaId =
            Number(id);

    }


    // ==================================
    // NOVA CLÍNICA
    // ==================================

    else {

        const {
            data,
            error
        } = await supabaseClient
            .from("clinicas")
            .insert(
                dadosClinica
            )
            .select()
            .single();


        if (error) {

            console.error(error);

            alert(
                "Erro ao cadastrar clínica."
            );

            return;

        }


        clinicaId =
            data.id;

    }


    // ==================================
    // REMOVE ESPECIALIDADES ANTIGAS
    // ==================================

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
            erroDelete
        );

        alert(
            "Erro ao atualizar especialidades."
        );

        return;

    }


    // ==================================
    // PEGA LINHAS
    // ==================================

    const linhas =
        document.querySelectorAll(
            ".linha-especialidade"
        );


    const especialidades = [];


    linhas.forEach(linha => {

        const especialidadeId =
            linha
                .querySelector(
                    ".select-especialidade"
                )
                ?.value;


        const rede =
            linha
                .querySelector(
                    ".select-rede"
                )
                ?.value;


        if (
            especialidadeId &&
            rede
        ) {

            especialidades.push({

                clinica_id:
                    Number(clinicaId),

                especialidade_id:
                    Number(especialidadeId),

                rede,

                ativo:
                    true

            });

        }

    });


    // ==================================
    // REMOVE DUPLICADOS
    // ==================================

    const especialidadesUnicas =
        especialidades.filter(
            (item, index, array) =>

                index ===
                array.findIndex(
                    outro =>

                        outro.especialidade_id ===
                        item.especialidade_id

                        &&

                        outro.rede ===
                        item.rede
                )
        );


    // ==================================
    // SALVAR ESPECIALIDADES
    // ==================================

    if (
        especialidadesUnicas.length > 0
    ) {

        const {
            error
        } = await supabaseClient
            .from(
                "clinica_especialidades"
            )
            .insert(
                especialidadesUnicas
            );


        if (error) {

            console.error(error);

            alert(
                "Erro ao salvar especialidades."
            );

            return;

        }

    }


    alert(
        "Clínica salva com sucesso!"
    );


    fecharModalClinica();

    await listarClinicas();

    await carregarDashboard();

}


// ======================================
// EDITAR CLÍNICA
// ======================================

async function editarClinica(id) {

    const {
        data,
        error
    } = await supabaseClient
        .from("clinicas")
        .select(`
            *,
            bairros(
                id,
                cidade_id,
                cidades(
                    id,
                    estado_id,
                    estados(
                        id,
                        regiao_id
                    )
                )
            ),
            clinica_especialidades(
                especialidade_id,
                rede,
                ativo
            )
        `)
        .eq(
            "id",
            id
        )
        .single();


    if (error) {

        console.error(error);

        alert(
            "Erro ao carregar clínica."
        );

        return;

    }


    await abrirModalClinica();


    document.getElementById(
        "tituloModalClinica"
    ).textContent =
        "Editar Clínica";


    document.getElementById(
        "clinicaId"
    ).value =
        data.id;


    document.getElementById(
        "clinicaNome"
    ).value =
        data.nome || "";


    document.getElementById(
        "clinicaEndereco"
    ).value =
        data.endereco || "";


    document.getElementById(
        "clinicaTelefone"
    ).value =
        data.telefone || "";


    document.getElementById(
        "areaStatusClinica"
    )?.classList.remove(
        "hidden"
    );


    const checkboxAtivo =
        document.getElementById(
            "clinicaAtivo"
        );


    if (checkboxAtivo) {

        checkboxAtivo.checked =
            Boolean(data.ativo);

    }


    // ==================================
    // LOCALIZAÇÃO
    // ==================================

    const bairro =
        data.bairros;


    const cidade =
        bairro?.cidades;


    const estado =
        cidade?.estados;


    if (
        bairro &&
        cidade &&
        estado
    ) {

        // Região

        document.getElementById(
            "clinicaRegiao"
        ).value =
            estado.regiao_id;


        await carregarEstadosClinica();


        // Estado

        document.getElementById(
            "clinicaEstado"
        ).value =
            cidade.estado_id;


        await carregarCidadesClinica();


        // Cidade

        document.getElementById(
            "clinicaCidade"
        ).value =
            bairro.cidade_id;


        await carregarBairrosClinica();


        // Bairro

        document.getElementById(
            "clinicaBairro"
        ).value =
            bairro.id;

    }


    // ==================================
    // ESPECIALIDADES
    // ==================================

    const container =
        document.getElementById(
            "containerEspecialidades"
        );


    if (container) {

        container.innerHTML = "";

    }


    if (
        data.clinica_especialidades &&
        data.clinica_especialidades.length
    ) {

        for (
            const item of
            data.clinica_especialidades
        ) {

            await adicionarLinhaEspecialidade(
                item.especialidade_id,
                item.rede
            );

        }

    }

}


// ======================================
// ALTERAR STATUS CLÍNICA
// ======================================

async function alterarStatusClinica(
    id,
    statusAtual
) {

    const novoStatus =
        !statusAtual;


    const mensagem =
        novoStatus
            ? "Deseja ativar esta clínica?"
            : "Deseja desativar esta clínica?";


    if (
        !confirm(mensagem)
    ) return;


    const {
        error
    } = await supabaseClient
        .from("clinicas")
        .update({

            ativo:
                novoStatus

        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Erro ao alterar status."
        );

        return;

    }


    await listarClinicas();

    await carregarDashboard();

}


// ======================================
// FORMATAR REDE
// ======================================

function formatarRede(rede) {

    if (
        rede === "especialistas"
    ) {

        return "Especialistas";

    }


    if (
        rede === "sindilegis"
    ) {

        return "Sindilegis";

    }


    return rede || "";

}


// ======================================
// ESCAPAR TEXTO
// PROTEÇÃO CONTRA HTML
// ======================================

function escaparTexto(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(texto);


    return div.innerHTML;

}


// ======================================
// FECHAR MODAL AO CLICAR FORA
// ======================================

document.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "modalClinica"
            );


        if (
            modal &&
            event.target === modal
        ) {

            fecharModalClinica();

        }

    }
);
