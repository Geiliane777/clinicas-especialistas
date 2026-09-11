// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 1 DE 2
// ============================================================


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function definirTexto(elemento, texto) {
    if (!elemento) return;

    elemento.textContent =
        texto === null ||
        texto === undefined ||
        texto === ""
            ? "Não informado"
            : texto;
}


function escaparHTML(texto) {
    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// TROCA DE PÁGINA
// ============================================================

function abrirPagina(nomePagina) {

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


    if (
        nomePagina === "dashboard"
    ) {
        carregarDashboard();
    }

    if (
        nomePagina === "clinicas"
    ) {
        listarClinicas();
    }

    if (
        nomePagina === "especialidades"
    ) {
        listarEspecialidades();
    }

    if (
        nomePagina === "regioes"
    ) {
        listarRegioes();
    }

    if (
        nomePagina === "estados"
    ) {
        listarEstados();
    }

    if (
        nomePagina === "cidades"
    ) {
        listarCidades();
    }

    if (
        nomePagina === "bairros"
    ) {
        listarBairros();
    }
}


// ============================================================
// EVENTOS DO MENU
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .querySelectorAll(".menu-btn")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const pagina =
                            botao.dataset.pagina;

                        if (pagina) {
                            abrirPagina(pagina);
                        }

                    }
                );

            });


        abrirPagina("dashboard");

    }
);


// ============================================================
// DASHBOARD
// ============================================================

async function carregarDashboard() {

    try {

        const hoje =
            new Date();

        const dataFormatada =
            hoje.toLocaleDateString(
                "pt-BR",
                {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );


        const dataAtual =
            document.getElementById(
                "dataAtual"
            );


        definirTexto(
            dataAtual,
            dataFormatada
        );


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
                .select("id, ativo, nome, created_at"),

            supabaseClient
                .from("especialidades")
                .select("id"),

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


        if (clinicasResult.error) {
            throw clinicasResult.error;
        }

        if (especialidadesResult.error) {
            throw especialidadesResult.error;
        }

        if (regioesResult.error) {
            throw regioesResult.error;
        }

        if (estadosResult.error) {
            throw estadosResult.error;
        }

        if (cidadesResult.error) {
            throw cidadesResult.error;
        }

        if (bairrosResult.error) {
            throw bairrosResult.error;
        }


        const clinicas =
            clinicasResult.data || [];

        const ativas =
            clinicas.filter(
                clinica =>
                    clinica.ativo === true
            ).length;


        const inativas =
            clinicas.length -
            ativas;


        const totalClinicas =
            document.getElementById(
                "totalClinicas"
            );

        const totalClinicasAtivas =
            document.getElementById(
                "totalClinicasAtivas"
            );

        const totalClinicasInativas =
            document.getElementById(
                "totalClinicasInativas"
            );

        const totalEspecialidades =
            document.getElementById(
                "totalEspecialidades"
            );

        const totalRegioes =
            document.getElementById(
                "totalRegioes"
            );

        const totalEstados =
            document.getElementById(
                "totalEstados"
            );

        const totalCidades =
            document.getElementById(
                "totalCidades"
            );

        const totalBairros =
            document.getElementById(
                "totalBairros"
            );


        definirTexto(
            totalClinicas,
            clinicas.length
        );

        definirTexto(
            totalClinicasAtivas,
            ativas
        );

        definirTexto(
            totalClinicasInativas,
            inativas
        );

        definirTexto(
            totalEspecialidades,
            (
                especialidadesResult.data ||
                []
            ).length
        );

        definirTexto(
            totalRegioes,
            (
                regioesResult.data ||
                []
            ).length
        );

        definirTexto(
            totalEstados,
            (
                estadosResult.data ||
                []
            ).length
        );

        definirTexto(
            totalCidades,
            (
                cidadesResult.data ||
                []
            ).length
        );

        definirTexto(
            totalBairros,
            (
                bairrosResult.data ||
                []
            ).length
        );


        const porcentagem =
            clinicas.length
                ? Math.round(
                    (
                        ativas /
                        clinicas.length
                    ) * 100
                )
                : 0;


        const porcentagemAtivas =
            document.getElementById(
                "porcentagemAtivas"
            );


        const barraAtivas =
            document.getElementById(
                "barraAtivas"
            );


        const legendaAtivas =
            document.getElementById(
                "legendaAtivas"
            );


        const legendaInativas =
            document.getElementById(
                "legendaInativas"
            );


        definirTexto(
            porcentagemAtivas,
            `${porcentagem}%`
        );


        if (barraAtivas) {
            barraAtivas.style.width =
                `${porcentagem}%`;
        }


        definirTexto(
            legendaAtivas,
            `${ativas} ativas`
        );


        definirTexto(
            legendaInativas,
            `${inativas} inativas`
        );


        carregarUltimasClinicas(
            clinicas
        );

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

function carregarUltimasClinicas(
    clinicas
) {

    const lista =
        document.getElementById(
            "ultimasClinicas"
        );


    if (!lista) return;


    const ultimas =
        [...clinicas]
            .sort(
                (a, b) =>
                    new Date(
                        b.created_at || 0
                    ) -
                    new Date(
                        a.created_at || 0
                    )
            )
            .slice(0, 5);


    if (!ultimas.length) {

        lista.innerHTML =
            `
            <div class="vazio-dashboard">
                Nenhuma clínica cadastrada.
            </div>
            `;

        return;
    }


    lista.innerHTML =
        ultimas
            .map(
                clinica => {

                    const status =
                        clinica.ativo
                            ? "Ativa"
                            : "Inativa";


                    return `
                        <div class="ultima-clinica">

                            <div class="ultima-clinica-info">

                                <strong>
                                    ${escaparHTML(
                                        clinica.nome
                                    )}
                                </strong>

                                <span>
                                    Clínica cadastrada
                                </span>

                            </div>

                            <span
                                class="status ${
                                    clinica.ativo
                                        ? "ativo"
                                        : "inativo"
                                }"
                            >
                                ${status}
                            </span>

                        </div>
                    `;

                }
            )
            .join("");

}


// ============================================================
// ESPECIALIDADES
// ============================================================

async function listarEspecialidades() {

    const lista =
        document.getElementById(
            "listaEspecialidades"
        );


    if (!lista) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("especialidades")
                .select("id, nome")
                .order("nome");


        if (error) {
            throw error;
        }


        if (!data || !data.length) {

            lista.innerHTML =
                `
                <div class="item-gerenciamento vazio">
                    Nenhuma especialidade cadastrada.
                </div>
                `;

            return;
        }


        lista.innerHTML =
            data
                .map(
                    especialidade => {

                        return `
                            <div
                                class="item-gerenciamento"
                            >

                                <div
                                    class="item-gerenciamento-info"
                                >
                                    <span
                                        class="item-icone"
                                    >
                                        🦷
                                    </span>

                                    <strong>
                                        ${escaparHTML(
                                            especialidade.nome
                                        )}
                                    </strong>
                                </div>


                                <div
                                    class="item-acoes"
                                >

                                    <button
                                        type="button"
                                        class="btn-editar"
                                        onclick="editarEspecialidade(
                                            '${especialidade.id}',
                                            '${escaparHTML(
                                                especialidade.nome
                                            )}'
                                        )"
                                    >
                                        ✏️ Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="btn-excluir"
                                        onclick="excluirEspecialidade(
                                            '${especialidade.id}'
                                        )"
                                    >
                                        🗑️ Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar especialidades:",
            erro
        );


        lista.innerHTML =
            `
            <div class="item-gerenciamento erro">
                Erro ao carregar especialidades.
            </div>
            `;

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


    const input =
        document.getElementById(
            "nomeEspecialidade"
        );


    const nome =
        input?.value.trim();


    if (!nome) {

        alert(
            "Informe o nome da especialidade."
        );

        return;
    }


    try {

        let resultado;


        if (id) {

            resultado =
                await supabaseClient
                    .from("especialidades")
                    .update({
                        nome
                    })
                    .eq("id", id);

        } else {

            resultado =
                await supabaseClient
                    .from("especialidades")
                    .insert({
                        nome
                    });

        }


        if (resultado.error) {
            throw resultado.error;
        }


        document.getElementById(
            "especialidadeEditId"
        ).value = "";


        input.value = "";


        listarEspecialidades();

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

function editarEspecialidade(
    id,
    nome
) {

    const campoId =
        document.getElementById(
            "especialidadeEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeEspecialidade"
        );


    if (campoId) {
        campoId.value = id;
    }


    if (campoNome) {

        campoNome.value =
            nome;

        campoNome.focus();

    }

}


// ============================================================
// EXCLUIR ESPECIALIDADE
// ============================================================

async function excluirEspecialidade(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta especialidade?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("especialidades")
                .delete()
                .eq("id", id);


        if (error) {
            throw error;
        }


        listarEspecialidades();


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
// REGIÕES
// ============================================================

async function listarRegioes() {

    const lista =
        document.getElementById(
            "listaRegioes"
        );


    if (!lista) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("regioes")
                .select("id, nome")
                .order("nome");


        if (error) {
            throw error;
        }


        if (!data || !data.length) {

            lista.innerHTML =
                `
                <div class="item-gerenciamento vazio">
                    Nenhuma região cadastrada.
                </div>
                `;

            return;
        }


        lista.innerHTML =
            data
                .map(
                    regiao => {

                        return `
                            <div
                                class="item-gerenciamento"
                            >

                                <div
                                    class="item-gerenciamento-info"
                                >
                                    <span
                                        class="item-icone"
                                    >
                                        🌎
                                    </span>

                                    <strong>
                                        ${escaparHTML(
                                            regiao.nome
                                        )}
                                    </strong>
                                </div>


                                <div
                                    class="item-acoes"
                                >

                                    <button
                                        type="button"
                                        class="btn-editar"
                                        onclick="editarRegiao(
                                            '${regiao.id}',
                                            '${escaparHTML(
                                                regiao.nome
                                            )}'
                                        )"
                                    >
                                        ✏️ Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="btn-excluir"
                                        onclick="excluirRegiao(
                                            '${regiao.id}'
                                        )"
                                    >
                                        🗑️ Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar regiões:",
            erro
        );


        lista.innerHTML =
            `
            <div class="item-gerenciamento erro">
                Erro ao carregar regiões.
            </div>
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


    const input =
        document.getElementById(
            "nomeRegiao"
        );


    const nome =
        input?.value.trim();


    if (!nome) {

        alert(
            "Informe o nome da região."
        );

        return;
    }


    try {

        let resultado;


        if (id) {

            resultado =
                await supabaseClient
                    .from("regioes")
                    .update({
                        nome
                    })
                    .eq("id", id);

        } else {

            resultado =
                await supabaseClient
                    .from("regioes")
                    .insert({
                        nome
                    });

        }


        if (resultado.error) {
            throw resultado.error;
        }


        document.getElementById(
            "regiaoEditId"
        ).value = "";


        input.value = "";


        listarRegioes();


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

function editarRegiao(
    id,
    nome
) {

    const campoId =
        document.getElementById(
            "regiaoEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeRegiao"
        );


    if (campoId) {
        campoId.value = id;
    }


    if (campoNome) {

        campoNome.value =
            nome;

        campoNome.focus();

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
            "Deseja realmente excluir esta região?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("regioes")
                .delete()
                .eq("id", id);


        if (error) {
            throw error;
        }


        listarRegioes();


    } catch (erro) {

        console.error(
            "Erro ao excluir região:",
            erro
        );


        alert(
            "Não foi possível excluir a região."
        );

    }

}


// ============================================================
// POPULAR SELECT DE REGIÕES
// ============================================================

async function popularSelectRegioes(
    idSelect
) {

    const select =
        document.getElementById(
            idSelect
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("regioes")
                .select("id, nome")
                .order("nome");


        if (error) {
            throw error;
        }


        select.innerHTML =
            `<option value="">
                Selecione a Região
            </option>`;


        (data || [])
            .forEach(
                regiao => {

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


    } catch (erro) {

        console.error(
            "Erro ao carregar regiões:",
            erro
        );

    }

}


// ============================================================
// ESTADOS
// ============================================================

async function listarEstados() {

    const lista =
        document.getElementById(
            "listaEstados"
        );


    if (!lista) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("estados")
                .select(`
                    id,
                    nome,
                    regiao_id,
                    regioes (
                        nome
                    )
                `)
                .order("nome");


        if (error) {
            throw error;
        }


        if (!data || !data.length) {

            lista.innerHTML =
                `
                <div class="item-gerenciamento vazio">
                    Nenhum estado cadastrado.
                </div>
                `;

            return;
        }


        lista.innerHTML =
            data
                .map(
                    estado => {

                        return `
                            <div
                                class="item-gerenciamento"
                            >

                                <div
                                    class="item-gerenciamento-info"
                                >

                                    <span
                                        class="item-icone"
                                    >
                                        📍
                                    </span>

                                    <div>

                                        <strong>
                                            ${escaparHTML(
                                                estado.nome
                                            )}
                                        </strong>

                                        <span
                                            class="item-subtexto"
                                        >
                                            ${
                                                escaparHTML(
                                                    estado.regioes?.nome ||
                                                    "Região não informada"
                                                )
                                            }
                                        </span>

                                    </div>

                                </div>


                                <div
                                    class="item-acoes"
                                >

                                    <button
                                        type="button"
                                        class="btn-editar"
                                        onclick="editarEstado(
                                            '${estado.id}',
                                            '${escaparHTML(
                                                estado.nome
                                            )}',
                                            '${estado.regiao_id || ""}'
                                        )"
                                    >
                                        ✏️ Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="btn-excluir"
                                        onclick="excluirEstado(
                                            '${estado.id}'
                                        )"
                                    >
                                        🗑️ Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar estados:",
            erro
        );


        lista.innerHTML =
            `
            <div class="item-gerenciamento erro">
                Erro ao carregar estados.
            </div>
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
        )?.value.trim();


    const regiaoId =
        document.getElementById(
            "estadoRegiao"
        )?.value || null;


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

        let resultado;


        const dados = {
            nome,
            regiao_id: regiaoId
        };


        if (id) {

            resultado =
                await supabaseClient
                    .from("estados")
                    .update(dados)
                    .eq("id", id);

        } else {

            resultado =
                await supabaseClient
                    .from("estados")
                    .insert(dados);

        }


        if (resultado.error) {
            throw resultado.error;
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


        listarEstados();


    } catch (erro) {

        console.error(
            "Erro ao salvar estado:",
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

async function editarEstado(
    id,
    nome,
    regiaoId
) {

    await popularSelectRegioes(
        "estadoRegiao"
    );


    const campoId =
        document.getElementById(
            "estadoEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeEstado"
        );


    const campoRegiao =
        document.getElementById(
            "estadoRegiao"
        );


    if (campoId) {
        campoId.value = id;
    }


    if (campoNome) {
        campoNome.value = nome;
    }


    if (campoRegiao) {
        campoRegiao.value =
            regiaoId || "";
    }


    if (campoNome) {
        campoNome.focus();
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
            "Deseja realmente excluir este estado?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("estados")
                .delete()
                .eq("id", id);


        if (error) {
            throw error;
        }


        listarEstados();


    } catch (erro) {

        console.error(
            "Erro ao excluir estado:",
            erro
        );


        alert(
            "Não foi possível excluir o estado."
        );

    }

}


// ============================================================
// POPULAR SELECT DE ESTADOS
// ============================================================

async function popularSelectEstados(
    idSelect
) {

    const select =
        document.getElementById(
            idSelect
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("estados")
                .select("id, nome")
                .order("nome");


        if (error) {
            throw error;
        }


        select.innerHTML =
            `<option value="">
                Selecione o Estado
            </option>`;


        (data || [])
            .forEach(
                estado => {

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


    } catch (erro) {

        console.error(
            "Erro ao carregar estados:",
            erro
        );

    }

}


// ============================================================
// CIDADES
// ============================================================

async function listarCidades() {

    const lista =
        document.getElementById(
            "listaCidades"
        );


    if (!lista) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("cidades")
                .select(`
                    id,
                    nome,
                    estado_id,
                    estados (
                        nome,
                        regioes (
                            nome
                        )
                    )
                `)
                .order("nome");


        if (error) {
            throw error;
        }


        if (!data || !data.length) {

            lista.innerHTML =
                `
                <div class="item-gerenciamento vazio">
                    Nenhuma cidade cadastrada.
                </div>
                `;

            return;
        }


        lista.innerHTML =
            data
                .map(
                    cidade => {

                        return `
                            <div
                                class="item-gerenciamento"
                            >

                                <div
                                    class="item-gerenciamento-info"
                                >

                                    <span
                                        class="item-icone"
                                    >
                                        🏙️
                                    </span>

                                    <div>

                                        <strong>
                                            ${escaparHTML(
                                                cidade.nome
                                            )}
                                        </strong>

                                        <span
                                            class="item-subtexto"
                                        >
                                            ${escaparHTML(
                                                cidade.estados?.nome ||
                                                "Estado não informado"
                                            )}

                                            ${
                                                cidade.estados?.regioes?.nome
                                                    ? ` • ${escaparHTML(
                                                        cidade.estados.regioes.nome
                                                    )}`
                                                    : ""
                                            }
                                        </span>

                                    </div>

                                </div>


                                <div
                                    class="item-acoes"
                                >

                                    <button
                                        type="button"
                                        class="btn-editar"
                                        onclick="editarCidade(
                                            '${cidade.id}',
                                            '${escaparHTML(
                                                cidade.nome
                                            )}',
                                            '${cidade.estado_id || ""}'
                                        )"
                                    >
                                        ✏️ Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="btn-excluir"
                                        onclick="excluirCidade(
                                            '${cidade.id}'
                                        )"
                                    >
                                        🗑️ Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
            erro
        );


        lista.innerHTML =
            `
            <div class="item-gerenciamento erro">
                Erro ao carregar cidades.
            </div>
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
        )?.value.trim();


    const estadoId =
        document.getElementById(
            "cidadeEstado"
        )?.value || null;


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

        let resultado;


        const dados = {
            nome,
            estado_id: estadoId
        };


        if (id) {

            resultado =
                await supabaseClient
                    .from("cidades")
                    .update(dados)
                    .eq("id", id);

        } else {

            resultado =
                await supabaseClient
                    .from("cidades")
                    .insert(dados);

        }


        if (resultado.error) {
            throw resultado.error;
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


        listarCidades();


    } catch (erro) {

        console.error(
            "Erro ao salvar cidade:",
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

async function editarCidade(
    id,
    nome,
    estadoId
) {

    await popularSelectEstados(
        "cidadeEstado"
    );


    const campoId =
        document.getElementById(
            "cidadeEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeCidade"
        );


    const campoEstado =
        document.getElementById(
            "cidadeEstado"
        );


    if (campoId) {
        campoId.value = id;
    }


    if (campoNome) {
        campoNome.value = nome;
    }


    if (campoEstado) {
        campoEstado.value =
            estadoId || "";
    }


    if (campoNome) {
        campoNome.focus();
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
            "Deseja realmente excluir esta cidade?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("cidades")
                .delete()
                .eq("id", id);


        if (error) {
            throw error;
        }


        listarCidades();


    } catch (erro) {

        console.error(
            "Erro ao excluir cidade:",
            erro
        );


        alert(
            "Não foi possível excluir a cidade."
        );

    }

}


// ============================================================
// POPULAR SELECT DE CIDADES
// ============================================================

async function popularSelectCidades(
    idSelect
) {

    const select =
        document.getElementById(
            idSelect
        );


    if (!select) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("cidades")
                .select("id, nome")
                .order("nome");


        if (error) {
            throw error;
        }


        select.innerHTML =
            `<option value="">
                Selecione a Cidade
            </option>`;


        (data || [])
            .forEach(
                cidade => {

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


    } catch (erro) {

        console.error(
            "Erro ao carregar cidades:",
            erro
        );

    }

}


// ============================================================
// BAIRROS
// ============================================================

async function listarBairros() {

    const lista =
        document.getElementById(
            "listaBairros"
        );


    if (!lista) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("bairros")
                .select(`
                    id,
                    nome,
                    cidade_id,
                    cidades (
                        nome,
                        estados (
                            nome
                        )
                    )
                `)
                .order("nome");


        if (error) {
            throw error;
        }


        if (!data || !data.length) {

            lista.innerHTML =
                `
                <div class="item-gerenciamento vazio">
                    Nenhum bairro cadastrado.
                </div>
                `;

            return;
        }


        lista.innerHTML =
            data
                .map(
                    bairro => {

                        return `
                            <div
                                class="item-gerenciamento"
                            >

                                <div
                                    class="item-gerenciamento-info"
                                >

                                    <span
                                        class="item-icone"
                                    >
                                        🏘️
                                    </span>

                                    <div>

                                        <strong>
                                            ${escaparHTML(
                                                bairro.nome
                                            )}
                                        </strong>

                                        <span
                                            class="item-subtexto"
                                        >
                                            ${escaparHTML(
                                                bairro.cidades?.nome ||
                                                "Cidade não informada"
                                            )}

                                            ${
                                                bairro.cidades?.estados?.nome
                                                    ? ` • ${escaparHTML(
                                                        bairro.cidades.estados.nome
                                                    )}`
                                                    : ""
                                            }
                                        </span>

                                    </div>

                                </div>


                                <div
                                    class="item-acoes"
                                >

                                    <button
                                        type="button"
                                        class="btn-editar"
                                        onclick="editarBairro(
                                            '${bairro.id}',
                                            '${escaparHTML(
                                                bairro.nome
                                            )}',
                                            '${bairro.cidade_id || ""}'
                                        )"
                                    >
                                        ✏️ Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="btn-excluir"
                                        onclick="excluirBairro(
                                            '${bairro.id}'
                                        )"
                                    >
                                        🗑️ Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar bairros:",
            erro
        );


        lista.innerHTML =
            `
            <div class="item-gerenciamento erro">
                Erro ao carregar bairros.
            </div>
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
        )?.value.trim();


    const cidadeId =
        document.getElementById(
            "bairroCidade"
        )?.value || null;


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

        let resultado;


        const dados = {
            nome,
            cidade_id: cidadeId
        };


        if (id) {

            resultado =
                await supabaseClient
                    .from("bairros")
                    .update(dados)
                    .eq("id", id);

        } else {

            resultado =
                await supabaseClient
                    .from("bairros")
                    .insert(dados);

        }


        if (resultado.error) {
            throw resultado.error;
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


        listarBairros();


    } catch (erro) {

        console.error(
            "Erro ao salvar bairro:",
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

async function editarBairro(
    id,
    nome,
    cidadeId
) {

    await popularSelectCidades(
        "bairroCidade"
    );


    const campoId =
        document.getElementById(
            "bairroEditId"
        );


    const campoNome =
        document.getElementById(
            "nomeBairro"
        );


    const campoCidade =
        document.getElementById(
            "bairroCidade"
        );


    if (campoId) {
        campoId.value = id;
    }


    if (campoNome) {
        campoNome.value = nome;
    }


    if (campoCidade) {
        campoCidade.value =
            cidadeId || "";
    }


    if (campoNome) {
        campoNome.focus();
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
            "Deseja realmente excluir este bairro?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("bairros")
                .delete()
                .eq("id", id);


        if (error) {
            throw error;
        }


        listarBairros();


    } catch (erro) {

        console.error(
            "Erro ao excluir bairro:",
            erro
        );


        alert(
            "Não foi possível excluir o bairro."
        );

    }

}


// ============================================================
// EXPOR FUNÇÕES PARA O HTML
// ============================================================

window.abrirPagina =
    abrirPagina;

window.carregarDashboard =
    carregarDashboard;

window.listarEspecialidades =
    listarEspecialidades;

window.salvarEspecialidade =
    salvarEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.listarRegioes =
    listarRegioes;

window.salvarRegiao =
    salvarRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.listarEstados =
    listarEstados;

window.salvarEstado =
    salvarEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;

window.listarCidades =
    listarCidades;

window.salvarCidade =
    salvarCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;

window.listarBairros =
    listarBairros;

window.salvarBairro =
    salvarBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;

window.popularSelectRegioes =
    popularSelectRegioes;

window.popularSelectEstados =
    popularSelectEstados;

window.popularSelectCidades =
    popularSelectCidades;


console.log(
    "admin_parte1.js carregado com sucesso."
);
// ============================================================
// ADMIN.JS
// PAINEL ADMINISTRATIVO | REDE ESPECIALISTAS
// PARTE 2 DE 2
// ============================================================


// ============================================================
// CLÍNICAS
// ============================================================

async function listarClinicas() {

    const lista = document.getElementById("listaClinicas");

    if (!lista) return;

    lista.innerHTML = `
        <tr>
            <td colspan="8">
                Carregando clínicas...
            </td>
        </tr>
    `;

    try {

        const busca =
            document.getElementById("buscarClinica")
                ?.value
                ?.trim()
                ?.toLowerCase() || "";

        const statusFiltro =
            document.getElementById("filtroStatusClinica")
                ?.value || "";


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
            .order("nome", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        let clinicas = data || [];


        // ====================================================
        // FILTRO DE BUSCA
        // ====================================================

        if (busca) {

            clinicas = clinicas.filter(clinica => {

                const nome =
                    String(clinica.nome || "")
                        .toLowerCase();

                const telefone =
                    String(clinica.telefone || "")
                        .toLowerCase();

                const endereco =
                    String(clinica.endereco || "")
                        .toLowerCase();

                const bairro =
                    String(clinica.bairros?.nome || "")
                        .toLowerCase();

                const cidade =
                    String(
                        clinica.bairros?.cidades?.nome || ""
                    )
                    .toLowerCase();

                const estado =
                    String(
                        clinica.bairros?.cidades?.estados?.nome || ""
                    )
                    .toLowerCase();

                return (
                    nome.includes(busca) ||
                    telefone.includes(busca) ||
                    endereco.includes(busca) ||
                    bairro.includes(busca) ||
                    cidade.includes(busca) ||
                    estado.includes(busca)
                );

            });
        }


        // ====================================================
        // FILTRO DE STATUS
        // ====================================================

        if (statusFiltro === "ativa") {

            clinicas = clinicas.filter(
                clinica => clinica.ativo === true
            );

        } else if (statusFiltro === "inativa") {

            clinicas = clinicas.filter(
                clinica => clinica.ativo !== true
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

        lista.innerHTML = clinicas.map(clinica => {

            const bairro = clinica.bairros;
            const cidade = bairro?.cidades;
            const estado = cidade?.estados;
            const regiao = estado?.regioes;

            const redes =
                obterRedesClinica(clinica);

            const ativa =
                clinica.ativo === true;

            const status =
                ativa ? "Ativa" : "Inativa";

            const classeStatus =
                ativa ? "ativo" : "inativo";


            // =================================================
            // ESPECIALIDADES
            // =================================================

            const especialidades =
                (clinica.clinica_especialidades || [])
                    .filter(vinculo => vinculo.ativo !== false)
                    .map(vinculo =>
                        vinculo.especialidades?.nome
                    )
                    .filter(Boolean);


            const especialidadesUnicas =
                [...new Set(especialidades)];


            const especialidadesHTML =
                especialidadesUnicas.length
                    ? especialidadesUnicas
                        .map(nome => `
                            <span class="tag-especialidade">
                                ${escaparHTML(nome)}
                            </span>
                        `)
                        .join("")
                    : `
                        <span class="texto-sem-dado">
                            Nenhuma
                        </span>
                    `;


            // =================================================
            // REDES
            // =================================================

            const redesHTML = `

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
                                <span class="texto-sem-dado">
                                    Nenhuma
                                </span>
                            `
                            : ""
                    }

                </div>
            `;


            return `
                <tr>

                    <!-- CLÍNICA -->

                    <td>
                        <strong>
                            ${escaparHTML(
                                clinica.nome || "Sem nome"
                            )}
                        </strong>
                    </td>


                    <!-- LOCALIZAÇÃO -->

                    <td>

                        <div class="localizacao-clinica">

                            <strong>
                                ${escaparHTML(
                                    bairro?.nome ||
                                    "Não informado"
                                )}
                            </strong>

                            <small>
                                ${escaparHTML(
                                    cidade?.nome ||
                                    "Não informado"
                                )}
                                ${
                                    estado?.nome
                                        ? ` - ${escaparHTML(
                                            estado.nome
                                        )}`
                                        : ""
                                }
                            </small>

                            ${
                                regiao?.nome
                                    ? `
                                        <small>
                                            ${escaparHTML(
                                                regiao.nome
                                            )}
                                        </small>
                                    `
                                    : ""
                            }

                        </div>

                    </td>


                    <!-- TELEFONE -->

                    <td>
                        ${
                            clinica.telefone
                                ? `
                                    <span>
                                        ${escaparHTML(
                                            clinica.telefone
                                        )}
                                    </span>
                                `
                                : `
                                    <span class="texto-sem-dado">
                                        Não informado
                                    </span>
                                `
                        }
                    </td>


                    <!-- ESPECIALIDADES -->

                    <td>
                        <div class="especialidades-tabela">
                            ${especialidadesHTML}
                        </div>
                    </td>


                    <!-- REDES -->

                    <td>
                        ${redesHTML}
                    </td>


                    <!-- STATUS -->

                    <td>
                        <span class="status ${classeStatus}">
                            ${status}
                        </span>
                    </td>


                    <!-- AÇÕES -->

                    <td>

                        <div class="acoes-tabela">

                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarClinica('${clinica.id}')"
                                title="Editar clínica"
                            >
                                ✏️ Editar
                            </button>

                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirClinica('${clinica.id}')"
                                title="Excluir clínica"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");


    } catch (erro) {

        console.error(
            "Erro ao carregar clínicas:",
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
// REDES DA CLÍNICA
// ============================================================

function obterRedesClinica(clinica) {

    const resultado = {
        especialistas: false,
        sindilegis: false
    };


    const vinculos =
        clinica?.clinica_especialidades || [];


    vinculos.forEach(vinculo => {

        if (vinculo.ativo === false) {
            return;
        }

        const rede =
            String(vinculo.rede || "")
                .trim()
                .toLowerCase();


        if (rede === "especialistas") {
            resultado.especialistas = true;
        }

        if (rede === "sindilegis") {
            resultado.sindilegis = true;
        }

    });


    return resultado;
}


// ============================================================
// NORMALIZAR REDE
// ============================================================

function normalizarRedeAdmin(rede) {

    const valor =
        String(rede || "")
            .trim()
            .toLowerCase();


    if (
        valor === "especialistas" ||
        valor === "rede especialistas"
    ) {
        return "especialistas";
    }


    if (
        valor === "sindilegis" ||
        valor === "rede sindilegis"
    ) {
        return "sindilegis";
    }


    return "";
}


// ============================================================
// ABRIR MODAL DE CLÍNICA
// ============================================================

async function abrirModalClinica(id = null) {

    const modal =
        document.getElementById("modalClinica");

    const form =
        document.getElementById("formClinica");


    if (!modal || !form) return;


    form.reset();


    const campoId =
        document.getElementById("clinicaId");

    const campoAtivo =
        document.getElementById("clinicaAtivo");

    const areaStatus =
        document.getElementById("areaStatusClinica");

    const containerEspecialidades =
        document.getElementById(
            "containerEspecialidades"
        );


    if (campoId) {
        campoId.value = "";
    }


    if (campoAtivo) {
        campoAtivo.checked = true;
    }


    if (areaStatus) {
        areaStatus.style.display = "none";
    }


    if (containerEspecialidades) {

        containerEspecialidades.innerHTML = `
            <div class="especialidades-vazio">
                Nenhuma especialidade adicionada.
            </div>
        `;
    }


    await carregarRegioesClinica();


    const titulo =
        modal.querySelector(".modal-titulo") ||
        modal.querySelector("h2");


    if (titulo) {
        titulo.textContent = "Nova Clínica";
    }


    modal.classList.remove("hidden");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


// ============================================================
// MOSTRAR MODAL
// ============================================================

function mostrarModalClinica() {

    const modal =
        document.getElementById("modalClinica");

    if (!modal) return;

    modal.classList.remove("hidden");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


// ============================================================
// FECHAR MODAL
// ============================================================

function fecharModalClinica() {

    const modal =
        document.getElementById("modalClinica");

    if (!modal) return;

    modal.classList.add("hidden");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
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
                telefone,
                endereco,
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


        const modal =
            document.getElementById(
                "modalClinica"
            );

        const form =
            document.getElementById(
                "formClinica"
            );


        if (!modal || !form) {
            return;
        }


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

        const areaStatus =
            document.getElementById(
                "areaStatusClinica"
            );


        if (campoId) {
            campoId.value = clinica.id;
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
                clinica.ativo === true;
        }

        if (areaStatus) {
            areaStatus.style.display =
                "block";
        }


        // ====================================================
        // CARREGAR LOCALIZAÇÃO
        // ====================================================

        await carregarRegioesClinica();


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
                            regiao_id,
                            regioes (
                                id
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


            const estado =
                bairro?.cidades?.estados;

            const cidade =
                bairro?.cidades;

            const regiao =
                estado?.regioes;


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


            if (
                campoRegiao &&
                regiao?.id
            ) {

                campoRegiao.value =
                    regiao.id;

                await carregarEstadosClinica(
                    regiao.id
                );
            }


            if (
                campoEstado &&
                estado?.id
            ) {

                campoEstado.value =
                    estado.id;

                await carregarCidadesClinica(
                    estado.id
                );
            }


            if (
                campoCidade &&
                cidade?.id
            ) {

                campoCidade.value =
                    cidade.id;

                await carregarBairrosClinica(
                    cidade.id
                );
            }


            if (
                campoBairro &&
                bairro?.id
            ) {

                campoBairro.value =
                    bairro.id;
            }

        }


        // ====================================================
        // CARREGAR ESPECIALIDADES
        // ====================================================

        await carregarEspecialidadesClinica(
            clinica.id
        );


        const titulo =
            modal.querySelector(
                ".modal-titulo"
            ) ||
            modal.querySelector("h2");


        if (titulo) {
            titulo.textContent =
                "Editar Clínica";
        }


        mostrarModalClinica();


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
// CARREGAR REGIÕES DA CLÍNICA
// ============================================================

async function carregarRegioesClinica() {

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


        limparSelectAdmin(
            select,
            "Selecione a Região"
        );


        (data || []).forEach(regiao => {

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


    } catch (erro) {

        console.error(
            "Erro ao carregar regiões:",
            erro
        );
    }
}


// ============================================================
// CARREGAR ESTADOS DA CLÍNICA
// ============================================================

async function carregarEstadosClinica(
    regiaoId
) {

    const selectEstado =
        document.getElementById(
            "clinicaEstado"
        );

    const selectCidade =
        document.getElementById(
            "clinicaCidade"
        );

    const selectBairro =
        document.getElementById(
            "clinicaBairro"
        );


    if (!selectEstado) return;


    limparSelectAdmin(
        selectEstado,
        "Selecione o Estado"
    );

    if (selectCidade) {
        limparSelectAdmin(
            selectCidade,
            "Selecione a Cidade"
        );
        selectCidade.disabled = true;
    }

    if (selectBairro) {
        limparSelectAdmin(
            selectBairro,
            "Selecione o Bairro"
        );
        selectBairro.disabled = true;
    }


    if (!regiaoId) {

        selectEstado.disabled = true;

        return;
    }


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


        (data || []).forEach(estado => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                estado.id;

            option.textContent =
                estado.nome;

            selectEstado.appendChild(
                option
            );

        });


        selectEstado.disabled = false;


    } catch (erro) {

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

    const selectCidade =
        document.getElementById(
            "clinicaCidade"
        );

    const selectBairro =
        document.getElementById(
            "clinicaBairro"
        );


    if (!selectCidade) return;


    limparSelectAdmin(
        selectCidade,
        "Selecione a Cidade"
    );


    if (selectBairro) {

        limparSelectAdmin(
            selectBairro,
            "Selecione o Bairro"
        );

        selectBairro.disabled = true;
    }


    if (!estadoId) {

        selectCidade.disabled = true;

        return;
    }


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


        (data || []).forEach(cidade => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                cidade.id;

            option.textContent =
                cidade.nome;

            selectCidade.appendChild(
                option
            );

        });


        selectCidade.disabled = false;


    } catch (erro) {

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


    if (!select) return;


    limparSelectAdmin(
        select,
        "Selecione o Bairro"
    );


    if (!cidadeId) {

        select.disabled = true;

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
                nome,
                cidade_id
            `)
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


        (data || []).forEach(bairro => {

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


        select.disabled = false;


    } catch (erro) {

        console.error(
            "Erro ao carregar bairros:",
            erro
        );
    }
}


// ============================================================
// LIMPAR SELECT
// ============================================================

function limparSelectAdmin(
    select,
    texto
) {

    if (!select) return;


    select.innerHTML = `
        <option value="">
            ${texto}
        </option>
    `;

    select.value = "";
}


// ============================================================
// SALVAR CLÍNICA
// ============================================================

async function salvarClinica(
    event
) {

    if (event) {
        event.preventDefault();
    }


    try {

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

        const campoBairro =
            document.getElementById(
                "clinicaBairro"
            );

        const campoAtivo =
            document.getElementById(
                "clinicaAtivo"
            );


        const id =
            campoId?.value || "";

        const nome =
            campoNome?.value
                ?.trim() || "";

        const endereco =
            campoEndereco?.value
                ?.trim() || "";

        const telefone =
            campoTelefone?.value
                ?.trim() || "";

        const bairroId =
            campoBairro?.value || "";

        const ativo =
            campoAtivo
                ? campoAtivo.checked
                : true;


        // ====================================================
        // VALIDAÇÕES
        // ====================================================

        if (!nome) {

            alert(
                "Informe o nome da clínica."
            );

            campoNome?.focus();

            return;
        }


        if (!bairroId) {

            alert(
                "Selecione o bairro da clínica."
            );

            campoBairro?.focus();

            return;
        }


        const dados = {

            nome:
                nome,

            endereco:
                endereco,

            telefone:
                telefone,

            bairro_id:
                bairroId,

            ativo:
                ativo
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
                .update(
                    dados
                )
                .eq(
                    "id",
                    id
                );


            if (error) {
                throw error;
            }


        // ====================================================
        // NOVA CLÍNICA
        // ====================================================

        } else {

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
                data?.id;
        }


        // ====================================================
        // SALVAR ESPECIALIDADES
        // ====================================================

        if (clinicaId) {

            await salvarEspecialidadesClinica(
                clinicaId
            );
        }


        alert(
            id
                ? "Clínica atualizada com sucesso!"
                : "Clínica cadastrada com sucesso!"
        );


        fecharModalClinica();


        if (
            typeof listarClinicas ===
            "function"
        ) {

            await listarClinicas();
        }


        if (
            typeof carregarDashboard ===
            "function"
        ) {

            await carregarDashboard();
        }


    } catch (erro) {

        console.error(
            "Erro ao salvar clínica:",
            erro
        );


        alert(
            erro?.message ||
            "Não foi possível salvar a clínica."
        );
    }
}


// ============================================================
// EXCLUIR CLÍNICA
// ============================================================

async function excluirClinica(
    id
) {

    if (!id) return;


    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta clínica?"
        );


    if (!confirmar) {
        return;
    }


    try {

        // ====================================================
        // EXCLUIR VÍNCULOS
        // ====================================================

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


        // ====================================================
        // EXCLUIR CLÍNICA
        // ====================================================

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


        if (
            typeof carregarDashboard ===
            "function"
        ) {

            await carregarDashboard();
        }


    } catch (erro) {

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


    if (!container) return;


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
            .from("clinica_especialidades")
            .select(`
                id,
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
                "id"
            );


        if (error) {
            throw error;
        }


        container.innerHTML = "";


        if (!data || !data.length) {

            limparEspecialidadesClinica();

            return;
        }


        for (
            const item of data
        ) {

            await adicionarLinhaEspecialidade(
                item
            );
        }


    } catch (erro) {

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


    if (!container) return;


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


    if (!container) return;


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


    if (!container) return;


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
        dados?.especialidade_id || "";


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

                    <option value="especialistas">
                        Especialistas
                    </option>

                    <option value="sindilegis">
                        Sindilegis
                    </option>

                </select>

            </div>


            <div class="especialidade-acoes">

                <button
                    type="button"
                    class="btn-excluir-especialidade"
                    title="Remover"
                >
                    🗑️ Remover
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
            especialidadeSelecionada;
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

    if (!select) return;


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


    } catch (erro) {

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


    if (!container) return;


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
                        clinicaId,

                    especialidade_id:
                        especialidade,

                    rede:
                        rede,

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
        .from("clinica_especialidades")
        .delete()
        .eq(
            "clinica_id",
            clinicaId
        );


    if (erroDelete) {
        throw erroDelete;
    }


    // ========================================================
    // SE NÃO HOUVER ESPECIALIDADES
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
        .from("clinica_especialidades")
        .insert(
            registros
        );


    if (error) {
        throw error;
    }
}


// ============================================================
// EXPORTAÇÕES DA PARTE 2
// ============================================================

window.listarClinicas =
    listarClinicas;

window.abrirModalClinica =
    abrirModalClinica;

window.fecharModalClinica =
    fecharModalClinica;

window.editarClinica =
    editarClinica;

window.excluirClinica =
    excluirClinica;

window.salvarClinica =
    salvarClinica;

window.carregarRegioesClinica =
    carregarRegioesClinica;

window.carregarEstadosClinica =
    carregarEstadosClinica;

window.carregarCidadesClinica =
    carregarCidadesClinica;

window.carregarBairrosClinica =
    carregarBairrosClinica;

window.adicionarLinhaEspecialidade =
    adicionarLinhaEspecialidade;

window.carregarEspecialidadesClinica =
    carregarEspecialidadesClinica;

window.salvarEspecialidadesClinica =
    salvarEspecialidadesClinica;


console.log(
    "Parte 2 do admin.js carregada."
);
