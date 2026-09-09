/* ============================================================
   ADMIN.JS
   Painel Administrativo - Rede Especialistas
   ============================================================ */

const NOME_REDE = "Rede Especialistas";

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
    console.log("admin.js carregado");

    try {
        atualizarData();
        carregarTema();

        await Promise.all([
            popularRegioes(),
            popularEstados(),
            popularCidades(),
            popularBairros(),
            popularEspecialidades()
        ]);

        await carregarDashboard();

        await Promise.all([
            listarClinicas(),
            listarEspecialidades(),
            listarRegioes(),
            listarEstados(),
            listarCidades(),
            listarBairros()
        ]);

        configurarEventosGerais();

        console.log("Painel administrativo carregado.");
    } catch (erro) {
        console.error("Erro ao inicializar painel:", erro);
    }
});


/* ============================================================
   UTILITÁRIOS
   ============================================================ */

function mostrarErro(contexto, erro) {
    console.error(`Erro em ${contexto}:`, erro);

    let mensagem = "Ocorreu um erro.";

    if (erro?.message) {
        mensagem = erro.message;
    }

    if (erro?.details) {
        mensagem += ` ${erro.details}`;
    }

    if (erro?.hint) {
        mensagem += ` ${erro.hint}`;
    }

    return mensagem;
}


function normalizarRede(valor) {
    const rede = String(valor ?? "")
        .trim()
        .toLowerCase();

    if (
        rede === "sindilegis" ||
        rede === "rede sindilegis"
    ) {
        return "Sindilegis";
    }

    if (
        rede === "especialista" ||
        rede === "especialistas" ||
        rede === "rede especialistas"
    ) {
        return "Especialistas";
    }

    return String(valor ?? "").trim();
}


function redesSaoIguais(valor1, valor2) {
    return normalizarRede(valor1).toLowerCase() ===
           normalizarRede(valor2).toLowerCase();
}


function escapeHTML(valor) {
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


function obterValor(id) {
    const elemento = document.getElementById(id);
    return elemento ? elemento.value : "";
}


function elementoExiste(id) {
    return document.getElementById(id) !== null;
}


/* ============================================================
   DATA
   ============================================================ */

function atualizarData() {
    const elemento = document.getElementById("dataAtual");

    if (!elemento) {
        return;
    }

    const agora = new Date();

    elemento.textContent = agora.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

const TITULOS_PAGINA = {
    dashboard: "Dashboard",
    clinicas: "Clínicas",
    especialidades: "Especialidades",
    regioes: "Regiões",
    estados: "Estados",
    cidades: "Cidades",
    bairros: "Bairros"
};


function mostrarPagina(pagina) {
    document
        .querySelectorAll(".pagina")
        .forEach(secao => {
            secao.style.display = "none";
        });

    const paginaSelecionada =
        document.getElementById(pagina);

    if (paginaSelecionada) {
        paginaSelecionada.style.display = "block";
    }

    document
        .querySelectorAll(".menu-item")
        .forEach(item => {
            item.classList.remove("ativo");
        });

    const menuSelecionado =
        document.querySelector(
            `[data-pagina="${pagina}"]`
        );

    if (menuSelecionado) {
        menuSelecionado.classList.add("ativo");
    }

    const titulo =
        document.getElementById("tituloPagina");

    if (titulo) {
        titulo.textContent =
            TITULOS_PAGINA[pagina] || pagina;
    }
}


/* ============================================================
   DASHBOARD
   ============================================================ */

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
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("estados")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("cidades")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("bairros")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("clinicas")
                .select("id", { count: "exact", head: true }),

            supabaseClient
                .from("especialidades")
                .select("id", { count: "exact", head: true })
        ]);

        atualizarContador("totalRegioes", regioes.count);
        atualizarContador("totalEstados", estados.count);
        atualizarContador("totalCidades", cidades.count);
        atualizarContador("totalBairros", bairros.count);
        atualizarContador("totalClinicas", clinicas.count);
        atualizarContador(
            "totalEspecialidades",
            especialidades.count
        );

        await carregarUltimasClinicas();

    } catch (erro) {
        mostrarErro("carregarDashboard", erro);
    }
}


function atualizarContador(id, valor) {
    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        valor ?? 0;
}


/* ============================================================
   ÚLTIMAS CLÍNICAS
   ============================================================ */

async function carregarUltimasClinicas() {
    try {
        const { data, error } =
            await supabaseClient
                .from("clinicas")
                .select(`
                    id,
                    nome,
                    endereco,
                    telefone,
                    ativo
                `)
                .order("id", { ascending: false })
                .limit(5);

        if (error) {
            throw error;
        }

        const container =
            document.getElementById("ultimasClinicas");

        if (!container) {
            return;
        }

        if (!data || data.length === 0) {
            container.innerHTML =
                `<p class="sem-registros">
                    Nenhuma clínica cadastrada.
                </p>`;

            return;
        }

        container.innerHTML = data.map(clinica => `
            <div class="item-dashboard">
                <div>
                    <strong>
                        ${escapeHTML(clinica.nome)}
                    </strong>

                    <small>
                        ${escapeHTML(
                            clinica.endereco || "Endereço não informado"
                        )}
                    </small>
                </div>

                <span class="${clinica.ativo ? "status-ativo" : "status-inativo"}">
                    ${clinica.ativo ? "Ativa" : "Inativa"}
                </span>
            </div>
        `).join("");

    } catch (erro) {
        mostrarErro(
            "carregarUltimasClinicas",
            erro
        );
    }
}


/* ============================================================
   CLÍNICAS
   ============================================================ */

async function listarClinicas() {
    try {
        const { data, error } =
            await supabaseClient
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
                .order("nome", { ascending: true });

        if (error) {
            throw error;
        }

        const container =
            document.getElementById("listaClinicas");

        if (!container) {
            return;
        }

        if (!data || data.length === 0) {
            container.innerHTML =
                `<p class="sem-registros">
                    Nenhuma clínica cadastrada.
                </p>`;

            return;
        }

        /*
         * A consulta é feita SOMENTE em clinicas.
         * Isso evita duplicação causada pela tabela
         * clinica_especialidades.
         */

        const clinicas = data;

        const registros =
            await Promise.all(
                clinicas.map(async clinica => {

                    const especialidades =
                        await obterEspecialidadesClinica(
                            clinica.id
                        );

                    return {
                        ...clinica,
                        especialidades
                    };
                })
            );

        container.innerHTML =
            registros.map(clinica =>
                criarCardClinica(clinica)
            ).join("");

    } catch (erro) {
        mostrarErro(
            "listarClinicas",
            erro
        );
    }
}


function criarCardClinica(clinica) {
    const bairro =
        clinica.bairros?.nome || "";

    const cidade =
        clinica.bairros?.cidades?.nome || "";

    const estado =
        clinica.bairros?.cidades?.estados?.nome || "";

    const regiao =
        clinica.bairros
            ?.cidades
            ?.estados
            ?.regioes
            ?.nome || "";

    const localizacao = [
        bairro,
        cidade,
        estado,
        regiao
    ]
        .filter(Boolean)
        .join(" • ");

    const especialidades =
        clinica.especialidades || [];

    const especialidadesHTML =
        especialidades.length
            ? especialidades.map(item => `
                <span class="tag-especialidade">
                    ${escapeHTML(item.nome)}
                    ${item.rede
                        ? ` - ${escapeHTML(
                            normalizarRede(item.rede)
                        )}`
                        : ""}
                </span>
            `).join("")
            : `<span class="sem-especialidade">
                    Nenhuma especialidade
               </span>`;

    return `
        <div class="card-clinica">

            <div class="card-clinica-conteudo">

                <div class="card-clinica-topo">

                    <div>
                        <h3>
                            ${escapeHTML(clinica.nome)}
                        </h3>

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

                </div>

                <div class="card-clinica-info">

                    ${
                        localizacao
                            ? `<p>
                                📍 ${escapeHTML(localizacao)}
                               </p>`
                            : ""
                    }

                    ${
                        clinica.endereco
                            ? `<p>
                                🏠 ${escapeHTML(
                                    clinica.endereco
                                )}
                               </p>`
                            : ""
                    }

                    ${
                        clinica.telefone
                            ? `<p>
                                📞 ${escapeHTML(
                                    clinica.telefone
                                )}
                               </p>`
                            : ""
                    }

                </div>

                <div class="especialidades-clinica">

                    <strong>
                        Especialidades:
                    </strong>

                    <div class="tags-especialidades">
                        ${especialidadesHTML}
                    </div>

                </div>

            </div>

            <div class="card-clinica-acoes">

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

        </div>
    `;
}


/* ============================================================
   ESPECIALIDADES DA CLÍNICA
   ============================================================ */

async function obterEspecialidadesClinica(
    clinicaId
) {
    try {
        const { data, error } =
            await supabaseClient
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
                .eq("clinica_id", clinicaId)
                .order("especialidade_id");

        if (error) {
            throw error;
        }

        return data || [];

    } catch (erro) {
        mostrarErro(
            "obterEspecialidadesClinica",
            erro
        );

        return [];
    }
}


/* ============================================================
   MODAL DE CLÍNICA
   ============================================================ */

async function abrirModalClinica(
    clinicaId = null
) {
    const modal =
        document.getElementById("modalClinica");

    if (!modal) {
        console.error(
            "Modal modalClinica não encontrado."
        );

        return;
    }

    modal.style.display = "flex";

    const titulo =
        document.getElementById("tituloModalClinica");

    if (titulo) {
        titulo.textContent =
            clinicaId
                ? "Editar Clínica"
                : "Nova Clínica";
    }

    const campoId =
        document.getElementById("clinicaId");

    if (campoId) {
        campoId.value =
            clinicaId || "";
    }

    limparLinhasEspecialidades();

    if (clinicaId) {
        await carregarClinicaNoModal(
            clinicaId
        );

        await carregarEspecialidadesClinicaNoModal(
            clinicaId
        );
    } else {
        limparFormularioClinica();
    }
}


async function carregarClinicaNoModal(
    clinicaId
) {
    try {
        const { data, error } =
            await supabaseClient
                .from("clinicas")
                .select(`
                    id,
                    nome,
                    endereco,
                    telefone,
                    bairro_id,
                    ativo
                `)
                .eq("id", clinicaId)
                .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return;
        }

        preencherCampo("clinicaId", data.id);
        preencherCampo("clinicaNome", data.nome);
        preencherCampo("clinicaEndereco", data.endereco);
        preencherCampo("clinicaTelefone", data.telefone);
        preencherCampo("clinicaBairro", data.bairro_id);

        const ativo =
            document.getElementById("clinicaAtivo");

        if (ativo) {
            ativo.checked =
                data.ativo !== false;
        }

        if (data.bairro_id) {
            await prepararLocalizacaoClinica(
                data.bairro_id
            );
        }

    } catch (erro) {
        mostrarErro(
            "carregarClinicaNoModal",
            erro
        );
    }
}


function preencherCampo(id, valor) {
    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.value =
            valor ?? "";
    }
}


/* ============================================================
   CARREGAR ESPECIALIDADES NO MODAL
   ============================================================ */

async function carregarEspecialidadesClinicaNoModal(
    clinicaId
) {
    try {
        const { data, error } =
            await supabaseClient
                .from("clinica_especialidades")
                .select(`
                    clinica_id,
                    especialidade_id,
                    rede,
                    ativo
                `)
                .eq("clinica_id", clinicaId)
                .order("especialidade_id");

        if (error) {
            throw error;
        }

        const lista =
            data || [];

        if (lista.length === 0) {
            return;
        }

        for (const item of lista) {
            adicionarLinhaEspecialidade(
                item.especialidade_id,
                item.rede,
                item.ativo
            );
        }

    } catch (erro) {
        mostrarErro(
            "carregarEspecialidadesClinicaNoModal",
            erro
        );
    }
}


/* ============================================================
   LINHAS DE ESPECIALIDADES
   ============================================================ */

function obterContainerEspecialidades() {
    return (
        document.getElementById(
            "listaEspecialidadesClinica"
        ) ||
        document.getElementById(
            "especialidadesClinica"
        )
    );
}


function limparLinhasEspecialidades() {
    const container =
        obterContainerEspecialidades();

    if (!container) {
        return;
    }

    container.innerHTML = "";
}


function adicionarLinhaEspecialidade(
    especialidadeId = "",
    redeExistente = "",
    ativoExistente = true
) {
    const container =
        obterContainerEspecialidades();

    if (!container) {
        console.error(
            "Container de especialidades não encontrado."
        );

        return;
    }

    const linha =
        document.createElement("div");

    linha.className =
        "linha-especialidade";

    linha.dataset.redeOriginal =
        redeExistente || "";

    linha.dataset.redeAlterada =
        "false";

    const selectEspecialidade =
        document.createElement("select");

    selectEspecialidade.className =
        "select-especialidade";

    selectEspecialidade.innerHTML = `
        <option value="">
            Selecione a especialidade
        </option>
    `;

    const especialidades =
        window.listaEspecialidades || [];

    especialidades.forEach(especialidade => {
        const option =
            document.createElement("option");

        option.value =
            especialidade.id;

        option.textContent =
            especialidade.nome;

        if (
            String(especialidade.id) ===
            String(especialidadeId)
        ) {
            option.selected = true;
        }

        selectEspecialidade.appendChild(
            option
        );
    });


    /* --------------------------------------------
       SELECT DA REDE
       -------------------------------------------- */

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
     * Aqui usamos o dado EXISTENTE no banco
     * para selecionar a rede correta.
     *
     * Não alteramos o valor do banco neste momento.
     */

    const redeNormalizada =
        normalizarRede(redeExistente);

    if (redeNormalizada) {
        selectRede.value =
            redeNormalizada;
    }

    selectRede.addEventListener(
        "change",
        () => {
            linha.dataset.redeAlterada =
                "true";
        }
    );


    /* --------------------------------------------
       BOTÃO REMOVER
       -------------------------------------------- */

    const botaoRemover =
        document.createElement("button");

    botaoRemover.type =
        "button";

    botaoRemover.className =
        "btn-remover-especialidade";

    botaoRemover.innerHTML =
        "✕ Remover";

    botaoRemover.addEventListener(
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
        botaoRemover
    );

    /*
     * Guardamos se a linha veio do banco.
     * Isso permite preservar a rede original.
     */

    linha.dataset.especialidadeOriginal =
        especialidadeId || "";

    linha.dataset.ativoOriginal =
        ativoExistente !== false
            ? "true"
            : "false";

    container.appendChild(linha);
}


/* ============================================================
   SALVAR CLÍNICA
   ============================================================ */

async function salvarClinica() {
    try {
        const id =
            obterValor("clinicaId");

        const nome =
            obterValor("clinicaNome").trim();

        const endereco =
            obterValor("clinicaEndereco").trim();

        const telefone =
            obterValor("clinicaTelefone").trim();

        const bairroId =
            obterValor("clinicaBairro");

        const ativoElemento =
            document.getElementById(
                "clinicaAtivo"
            );

        const ativo =
            ativoElemento
                ? ativoElemento.checked
                : true;

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

        const dados = {
            nome,
            endereco,
            telefone,
            bairro_id: bairroId,
            ativo
        };


        let clinicaId =
            id
                ? Number(id)
                : null;


        /* --------------------------------------------
           UPDATE
           -------------------------------------------- */

        if (clinicaId) {

            const { error } =
                await supabaseClient
                    .from("clinicas")
                    .update(dados)
                    .eq("id", clinicaId);

            if (error) {
                throw error;
            }

        }

        /* --------------------------------------------
           INSERT
           -------------------------------------------- */

        else {

            const { data, error } =
                await supabaseClient
                    .from("clinicas")
                    .insert(dados)
                    .select("id")
                    .single();

            if (error) {
                throw error;
            }

            clinicaId =
                data.id;

            preencherCampo(
                "clinicaId",
                clinicaId
            );
        }


        /* --------------------------------------------
           SALVA ESPECIALIDADES
           -------------------------------------------- */

        await salvarEspecialidadesClinica(
            clinicaId
        );


        alert(
            "Clínica salva com sucesso!"
        );

        fecharModalClinica();

        await listarClinicas();
        await carregarDashboard();

    } catch (erro) {
        alert(
            "Erro ao salvar clínica:\n\n" +
            mostrarErro(
                "salvarClinica",
                erro
            )
        );
    }
}


/* ============================================================
   SALVAR ESPECIALIDADES DA CLÍNICA
   ============================================================ */

async function salvarEspecialidadesClinica(
    clinicaId
) {
    try {

        /*
         * Primeiro buscamos o que já existe no banco.
         * Não apagamos tudo.
         *
         * Isso permite preservar os dados existentes.
         */

        const { data: existentes, error: erroExistentes } =
            await supabaseClient
                .from("clinica_especialidades")
                .select(`
                    clinica_id,
                    especialidade_id,
                    rede,
                    ativo
                `)
                .eq("clinica_id", clinicaId);

        if (erroExistentes) {
            throw erroExistentes;
        }


        const container =
            obterContainerEspecialidades();

        const linhas =
            container
                ? Array.from(
                    container.querySelectorAll(
                        ".linha-especialidade"
                    )
                )
                : [];


        const selecionados = [];


        /* --------------------------------------------
           LER O QUE FOI SELECIONADO NO MODAL
           -------------------------------------------- */

        for (const linha of linhas) {

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

            const redeSelecionada =
                selectRede.value;

            if (!especialidadeId) {
                continue;
            }

            if (!redeSelecionada) {
                alert(
                    "Selecione a rede para todas as especialidades."
                );

                throw new Error(
                    "Rede não selecionada."
                );
            }


            /*
             * Evita a mesma especialidade +
             * mesma rede duas vezes na tela.
             */

            const existe =
                selecionados.some(item =>
                    String(
                        item.especialidade_id
                    ) === String(
                        especialidadeId
                    ) &&
                    redesSaoIguais(
                        item.rede,
                        redeSelecionada
                    )
                );

            if (existe) {
                continue;
            }


            /*
             * Se esta linha veio do banco e a rede
             * não foi alterada, mantemos o valor
             * ORIGINAL exatamente como estava.
             */

            const redeOriginal =
                linha.dataset.redeOriginal || "";

            const redeFoiAlterada =
                linha.dataset.redeAlterada === "true";


            const redeParaSalvar =
                (
                    redeOriginal &&
                    !redeFoiAlterada &&
                    redesSaoIguais(
                        redeOriginal,
                        redeSelecionada
                    )
                )
                    ? redeOriginal
                    : redeSelecionada;


            selecionados.push({
                especialidade_id:
                    Number(especialidadeId),

                rede:
                    redeParaSalvar,

                ativo:
                    true
            });
        }


        /* --------------------------------------------
           COMPARAR BANCO X TELA
           -------------------------------------------- */

        const existentesUsados =
            new Set();


        /*
         * INSERIR / ATUALIZAR
         */

        for (
            const selecionado
            of selecionados
        ) {

            /*
             * Procuramos primeiro uma associação
             * com mesma especialidade e mesma rede.
             */

            let existente =
                existentes.find(item =>
                    String(
                        item.especialidade_id
                    ) === String(
                        selecionado.especialidade_id
                    ) &&
                    redesSaoIguais(
                        item.rede,
                        selecionado.rede
                    )
                );


            /*
             * Caso a rede tenha sido alterada,
             * procuramos a especialidade original.
             */

            if (!existente) {

                existente =
                    existentes.find(item =>
                        String(
                            item.especialidade_id
                        ) === String(
                            selecionado.especialidade_id
                        ) &&
                        !existentesUsados.has(item)
                    );
            }


            /* ----------------------------------------
               EXISTENTE
               ---------------------------------------- */

            if (existente) {

                existentesUsados.add(
                    existente
                );


                /*
                 * Se a rede selecionada é diferente
                 * da rede original, precisamos atualizar.
                 */

                const mudouRede =
                    !redesSaoIguais(
                        existente.rede,
                        selecionado.rede
                    );


                if (
                    mudouRede ||
                    existente.ativo !==
                    selecionado.ativo
                ) {

                    const { error } =
                        await supabaseClient
                            .from(
                                "clinica_especialidades"
                            )
                            .update({
                                rede:
                                    selecionado.rede,

                                ativo:
                                    selecionado.ativo
                            })
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


            /* ----------------------------------------
               NOVA
               ---------------------------------------- */

            else {

                const { error } =
                    await supabaseClient
                        .from(
                            "clinica_especialidades"
                        )
                        .insert({
                            clinica_id:
                                clinicaId,

                            especialidade_id:
                                selecionado.especialidade_id,

                            rede:
                                selecionado.rede,

                            ativo:
                                true
                        });

                if (error) {
                    throw error;
                }
            }
        }


        /* --------------------------------------------
           REMOVER O QUE FOI EXCLUÍDO NO MODAL
           -------------------------------------------- */

        for (
            const existente
            of existentes
        ) {

            if (
                existentesUsados.has(
                    existente
                )
            ) {
                continue;
            }


            /*
             * Verifica se a associação ainda existe
             * na tela.
             */

            const aindaExiste =
                selecionados.some(item =>
                    String(
                        item.especialidade_id
                    ) === String(
                        existente.especialidade_id
                    ) &&
                    redesSaoIguais(
                        item.rede,
                        existente.rede
                    )
                );


            if (!aindaExiste) {

                const { error } =
                    await supabaseClient
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

    } catch (erro) {

        mostrarErro(
            "salvarEspecialidadesClinica",
            erro
        );

        throw erro;
    }
}


/* ============================================================
   EDITAR CLÍNICA
   ============================================================ */

async function editarClinica(
    clinicaId
) {
    await abrirModalClinica(
        clinicaId
    );
}


/* ============================================================
   EXCLUIR CLÍNICA
   ============================================================ */

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

        /*
         * Primeiro remove as relações.
         */

        const { error: erroRelacoes } =
            await supabaseClient
                .from("clinica_especialidades")
                .delete()
                .eq(
                    "clinica_id",
                    clinicaId
                );

        if (erroRelacoes) {
            throw erroRelacoes;
        }


        /*
         * Depois remove a clínica.
         */

        const { error } =
            await supabaseClient
                .from("clinicas")
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

    } catch (erro) {

        alert(
            "Erro ao excluir clínica:\n\n" +
            mostrarErro(
                "excluirClinica",
                erro
            )
        );
    }
}


/* ============================================================
   LOCALIZAÇÃO DA CLÍNICA
   ============================================================ */

async function prepararLocalizacaoClinica(
    bairroId
) {
    try {

        const { data, error } =
            await supabaseClient
                .from("bairros")
                .select(`
                    id,
                    nome,
                    cidade_id,
                    cidades(
                        id,
                        nome,
                        estado_id,
                        estados(
                            id,
                            nome,
                            regiao_id,
                            regioes(
                                id,
                                nome
                            )
                        )
                    )
                `)
                .eq("id", bairroId)
                .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return;
        }

        const cidade =
            data.cidades;

        const estado =
            cidade?.estados;

        const regiao =
            estado?.regioes;


        if (
            regiao &&
            elementoExiste("clinicaRegiao")
        ) {
            preencherCampo(
                "clinicaRegiao",
                regiao.id
            );

            await carregarEstadosClinica(
                regiao.id
            );
        }


        if (
            estado &&
            elementoExiste("clinicaEstado")
        ) {
            preencherCampo(
                "clinicaEstado",
                estado.id
            );

            await carregarCidadesClinica(
                estado.id
            );
        }


        if (
            cidade &&
            elementoExiste("clinicaCidade")
        ) {
            preencherCampo(
                "clinicaCidade",
                cidade.id
            );

            await carregarBairrosClinica(
                cidade.id
            );
        }


        preencherCampo(
            "clinicaBairro",
            bairroId
        );

    } catch (erro) {
        mostrarErro(
            "prepararLocalizacaoClinica",
            erro
        );
    }
}


/* ============================================================
   ESPECIALIDADES
   ============================================================ */

async function popularEspecialidades() {
    try {

        const { data, error } =
            await supabaseClient
                .from("especialidades")
                .select(`
                    id,
                    nome
                `)
                .order("nome");

        if (error) {
            throw error;
        }

        window.listaEspecialidades =
            data || [];


        const selects =
            document.querySelectorAll(
                "#especialidade, " +
                "#clinicaEspecialidade"
            );


        selects.forEach(select => {

            const valorAtual =
                select.value;

            const primeiraOpcao =
                select.options[0]?.textContent ||
                "Selecione";


            select.innerHTML = `
                <option value="">
                    ${escapeHTML(
                        primeiraOpcao
                    )}
                </option>
            `;


            window.listaEspecialidades
                .forEach(especialidade => {

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
                });


            if (valorAtual) {
                select.value =
                    valorAtual;
            }
        });

    } catch (erro) {
        mostrarErro(
            "popularEspecialidades",
            erro
        );
    }
}


async function listarEspecialidades() {
    try {

        const { data, error } =
            await supabaseClient
                .from("especialidades")
                .select(`
                    id,
                    nome
                `)
                .order("nome");

        if (error) {
            throw error;
        }

        window.listaEspecialidades =
            data || [];

        const container =
            document.getElementById(
                "listaEspecialidades"
            );

        if (!container) {
            return;
        }

        if (!data || data.length === 0) {
            container.innerHTML =
                `<p class="sem-registros">
                    Nenhuma especialidade cadastrada.
                </p>`;

            return;
        }

        container.innerHTML =
            data.map(item => `
                <div class="linha-registro">

                    <div>
                        <strong>
                            ${escapeHTML(item.nome)}
                        </strong>
                    </div>

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
        mostrarErro(
            "listarEspecialidades",
            erro
        );
    }
}


async function salvarEspecialidade() {
    try {

        const id =
            obterValor(
                "especialidadeId"
            );

        const nome =
            obterValor(
                "especialidadeNome"
            ).trim();

        if (!nome) {
            alert(
                "Informe o nome da especialidade."
            );

            return;
        }

        if (id) {

            const { error } =
                await supabaseClient
                    .from("especialidades")
                    .update({
                        nome
                    })
                    .eq(
                        "id",
                        id
                    );

            if (error) {
                throw error;
            }

        } else {

            const { error } =
                await supabaseClient
                    .from("especialidades")
                    .insert({
                        nome
                    });

            if (error) {
                throw error;
            }
        }

        alert(
            "Especialidade salva com sucesso!"
        );

        fecharModalEspecialidade();

        await popularEspecialidades();
        await listarEspecialidades();

    } catch (erro) {

        alert(
            "Erro ao salvar especialidade:\n\n" +
            mostrarErro(
                "salvarEspecialidade",
                erro
            )
        );
    }
}


async function editarEspecialidade(
    id
) {
    try {

        const { data, error } =
            await supabaseClient
                .from("especialidades")
                .select(`
                    id,
                    nome
                `)
                .eq("id", id)
                .single();

        if (error) {
            throw error;
        }

        preencherCampo(
            "especialidadeId",
            data.id
        );

        preencherCampo(
            "especialidadeNome",
            data.nome
        );

        const modal =
            document.getElementById(
                "modalEspecialidade"
            );

        if (modal) {
            modal.style.display =
                "flex";
        }

    } catch (erro) {
        mostrarErro(
            "editarEspecialidade",
            erro
        );
    }
}


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

        const { error } =
            await supabaseClient
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
            "Especialidade excluída com sucesso!"
        );

        await popularEspecialidades();
        await listarEspecialidades();

    } catch (erro) {

        alert(
            "Não foi possível excluir a especialidade.\n\n" +
            mostrarErro(
                "excluirEspecialidade",
                erro
            )
        );
    }
}


/* ============================================================
   REGIÕES
   ============================================================ */

async function popularRegioes() {
    try {

        const { data, error } =
            await supabaseClient
                .from("regioes")
                .select(`
                    id,
                    nome
                `)
                .order("nome");

        if (error) {
            throw error;
        }

        window.listaRegioes =
            data || [];


        const ids = [
            "estadoRegiao",
            "clinicaRegiao"
        ];


        ids.forEach(id => {

            const select =
                document.getElementById(id);

            if (!select) {
                return;
            }

            const valorAtual =
                select.value;

            select.innerHTML = `
                <option value="">
                    Selecione a Região
                </option>
            `;

            window.listaRegioes
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
        });

    } catch (erro) {
        mostrarErro(
            "popularRegioes",
            erro
        );
    }
}


async function listarRegioes() {
    try {

        const { data, error } =
            await supabaseClient
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
            data?.length
                ? data.map(regiao => `
                    <div class="linha-registro">

                        <strong>
                            ${escapeHTML(
                                regiao.nome
                            )}
                        </strong>

                        <div class="acoes">

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

                        </div>

                    </div>
                `).join("")
                : `<p class="sem-registros">
                    Nenhuma região cadastrada.
                   </p>`;

    } catch (erro) {
        mostrarErro(
            "listarRegioes",
            erro
        );
    }
}


async function salvarRegiao() {
    try {

        const id =
            obterValor("regiaoId");

        const nome =
            obterValor("regiaoNome")
                .trim();

        if (!nome) {
            alert(
                "Informe o nome da região."
            );

            return;
        }

        if (id) {

            const { error } =
                await supabaseClient
                    .from("regioes")
                    .update({
                        nome
                    })
                    .eq(
                        "id",
                        id
                    );

            if (error) {
                throw error;
            }

        } else {

            const { error } =
                await supabaseClient
                    .from("regioes")
                    .insert({
                        nome
                    });

            if (error) {
                throw error;
            }
        }

        alert(
            "Região salva com sucesso!"
        );

        fecharModalRegiao();

        await popularRegioes();
        await listarRegioes();

    } catch (erro) {

        alert(
            "Erro ao salvar região:\n\n" +
            mostrarErro(
                "salvarRegiao",
                erro
            )
        );
    }
}


async function editarRegiao(
    id
) {
    try {

        const { data, error } =
            await supabaseClient
                .from("regioes")
                .select(`
                    id,
                    nome
                `)
                .eq("id", id)
                .single();

        if (error) {
            throw error;
        }

        preencherCampo(
            "regiaoId",
            data.id
        );

        preencherCampo(
            "regiaoNome",
            data.nome
        );

        const modal =
            document.getElementById(
                "modalRegiao"
            );

        if (modal) {
            modal.style.display =
                "flex";
        }

    } catch (erro) {
        mostrarErro(
            "editarRegiao",
            erro
        );
    }
}


async function excluirRegiao(
    id
) {
    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta região?"
        );

    if (!confirmar) {
        return;
    }

    try {

        const { error } =
            await supabaseClient
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
            "Região excluída com sucesso!"
        );

        await popularRegioes();
        await listarRegioes();

    } catch (erro) {

        alert(
            "Não foi possível excluir a região.\n\n" +
            mostrarErro(
                "excluirRegiao",
                erro
            )
        );
    }
}


/* ============================================================
   ESTADOS
   ============================================================ */

async function popularEstados() {
    try {

        const { data, error } =
            await supabaseClient
                .from("estados")
                .select(`
                    id,
                    nome,
                    regiao_id
                `)
                .order("nome");

        if (error) {
            throw error;
        }

        window.listaEstados =
            data || [];


        const select =
            document.getElementById(
                "cidadeEstado"
            );

        if (select) {

            const valorAtual =
                select.value;

            select.innerHTML = `
                <option value="">
                    Selecione o Estado
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

                select.appendChild(
                    option
                );
            });

            if (valorAtual) {
                select.value =
                    valorAtual;
            }
        }

    } catch (erro) {
        mostrarErro(
            "popularEstados",
            erro
        );
    }
}


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

    select.innerHTML = `
        <option value="">
            Selecione o Estado
        </option>
    `;

    if (!regiaoId) {
        return;
    }

    try {

        const { data, error } =
            await supabaseClient
                .from("estados")
                .select(`
                    id,
                    nome
                `)
                .eq(
                    "regiao_id",
                    regiaoId
                )
                .order("nome");

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

            select.appendChild(
                option
            );
        });

    } catch (erro) {
        mostrarErro(
            "carregarEstadosClinica",
            erro
        );
    }
}


async function listarEstados() {
    try {

        const { data, error } =
            await supabaseClient
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
            data?.length
                ? data.map(estado => `
                    <div class="linha-registro">

                        <div>
                            <strong>
                                ${escapeHTML(
                                    estado.nome
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    estado.regioes?.nome ||
                                    "Sem região"
                                )}
                            </small>
                        </div>

                        <div class="acoes">

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

                        </div>

                    </div>
                `).join("")
                : `<p class="sem-registros">
                    Nenhum estado cadastrado.
                   </p>`;

    } catch (erro) {
        mostrarErro(
            "listarEstados",
            erro
        );
    }
}


async function salvarEstado() {
    try {

        const id =
            obterValor("estadoId");

        const nome =
            obterValor("estadoNome")
                .trim();

        const regiaoId =
            obterValor("estadoRegiao");

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

        const dados = {
            nome,
            regiao_id: regiaoId
        };

        if (id) {

            const { error } =
                await supabaseClient
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

            const { error } =
                await supabaseClient
                    .from("estados")
                    .insert(dados);

            if (error) {
                throw error;
            }
        }

        alert(
            "Estado salvo com sucesso!"
        );

        fecharModalEstado();

        await popularEstados();
        await listarEstados();

    } catch (erro) {

        alert(
            "Erro ao salvar estado:\n\n" +
            mostrarErro(
                "salvarEstado",
                erro
            )
        );
    }
}


async function editarEstado(
    id
) {
    try {

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

        if (error) {
            throw error;
        }

        preencherCampo(
            "estadoId",
            data.id
        );

        preencherCampo(
            "estadoNome",
            data.nome
        );

        preencherCampo(
            "estadoRegiao",
            data.regiao_id
        );

        const modal =
            document.getElementById(
                "modalEstado"
            );

        if (modal) {
            modal.style.display =
                "flex";
        }

    } catch (erro) {
        mostrarErro(
            "editarEstado",
            erro
        );
    }
}


async function excluirEstado(
    id
) {
    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este estado?"
        );

    if (!confirmar) {
        return;
    }

    try {

        const { error } =
            await supabaseClient
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
            "Estado excluído com sucesso!"
        );

        await popularEstados();
        await listarEstados();

    } catch (erro) {

        alert(
            "Não foi possível excluir o estado.\n\n" +
            mostrarErro(
                "excluirEstado",
                erro
            )
        );
    }
}


/* ============================================================
   CIDADES
   ============================================================ */

async function popularCidades() {
    try {

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
            throw error;
        }

        window.listaCidades =
            data || [];

    } catch (erro) {
        mostrarErro(
            "popularCidades",
            erro
        );
    }
}


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

    select.innerHTML = `
        <option value="">
            Selecione a Cidade
        </option>
    `;

    if (!estadoId) {
        return;
    }

    try {

        const { data, error } =
            await supabaseClient
                .from("cidades")
                .select(`
                    id,
                    nome
                `)
                .eq(
                    "estado_id",
                    estadoId
                )
                .order("nome");

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

            select.appendChild(
                option
            );
        });

    } catch (erro) {
        mostrarErro(
            "carregarCidadesClinica",
            erro
        );
    }
}


async function listarCidades() {
    try {

        const { data, error } =
            await supabaseClient
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
            data?.length
                ? data.map(cidade => `
                    <div class="linha-registro">

                        <div>
                            <strong>
                                ${escapeHTML(
                                    cidade.nome
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    cidade.estados?.nome ||
                                    "Sem estado"
                                )}
                            </small>
                        </div>

                        <div class="acoes">

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

                        </div>

                    </div>
                `).join("")
                : `<p class="sem-registros">
                    Nenhuma cidade cadastrada.
                   </p>`;

    } catch (erro) {
        mostrarErro(
            "listarCidades",
            erro
        );
    }
}


async function salvarCidade() {
    try {

        const id =
            obterValor("cidadeId");

        const nome =
            obterValor("cidadeNome")
                .trim();

        const estadoId =
            obterValor("cidadeEstado");

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

        const dados = {
            nome,
            estado_id: estadoId
        };

        if (id) {

            const { error } =
                await supabaseClient
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

            const { error } =
                await supabaseClient
                    .from("cidades")
                    .insert(dados);

            if (error) {
                throw error;
            }
        }

        alert(
            "Cidade salva com sucesso!"
        );

        fecharModalCidade();

        await popularCidades();
        await listarCidades();

    } catch (erro) {

        alert(
            "Erro ao salvar cidade:\n\n" +
            mostrarErro(
                "salvarCidade",
                erro
            )
        );
    }
}


async function editarCidade(
    id
) {
    try {

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

        if (error) {
            throw error;
        }

        preencherCampo(
            "cidadeId",
            data.id
        );

        preencherCampo(
            "cidadeNome",
            data.nome
        );

        preencherCampo(
            "cidadeEstado",
            data.estado_id
        );

        const modal =
            document.getElementById(
                "modalCidade"
            );

        if (modal) {
            modal.style.display =
                "flex";
        }

    } catch (erro) {
        mostrarErro(
            "editarCidade",
            erro
        );
    }
}


async function excluirCidade(
    id
) {
    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta cidade?"
        );

    if (!confirmar) {
        return;
    }

    try {

        const { error } =
            await supabaseClient
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
            "Cidade excluída com sucesso!"
        );

        await popularCidades();
        await listarCidades();

    } catch (erro) {

        alert(
            "Não foi possível excluir a cidade.\n\n" +
            mostrarErro(
                "excluirCidade",
                erro
            )
        );
    }
}


/* ============================================================
   BAIRROS
   ============================================================ */

async function popularBairros() {
    try {

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
            throw error;
        }

        window.listaBairros =
            data || [];

    } catch (erro) {
        mostrarErro(
            "popularBairros",
            erro
        );
    }
}


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

    select.innerHTML = `
        <option value="">
            Selecione o Bairro
        </option>
    `;

    if (!cidadeId) {
        return;
    }

    try {

        const { data, error } =
            await supabaseClient
                .from("bairros")
                .select(`
                    id,
                    nome
                `)
                .eq(
                    "cidade_id",
                    cidadeId
                )
                .order("nome");

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

    } catch (erro) {
        mostrarErro(
            "carregarBairrosClinica",
            erro
        );
    }
}


async function listarBairros() {
    try {

        const { data, error } =
            await supabaseClient
                .from("bairros")
                .select(`
                    id,
                    nome,
                    cidades(
                        id,
                        nome,
                        estados(
                            id,
                            nome
                        )
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
            data?.length
                ? data.map(bairro => `
                    <div class="linha-registro">

                        <div>
                            <strong>
                                ${escapeHTML(
                                    bairro.nome
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    bairro.cidades?.nome ||
                                    "Sem cidade"
                                )}
                                ${
                                    bairro.cidades
                                        ?.estados
                                        ?.nome
                                        ? " - " +
                                          escapeHTML(
                                            bairro.cidades
                                                .estados
                                                .nome
                                          )
                                        : ""
                                }
                            </small>
                        </div>

                        <div class="acoes">

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

                        </div>

                    </div>
                `).join("")
                : `<p class="sem-registros">
                    Nenhum bairro cadastrado.
                   </p>`;

    } catch (erro) {
        mostrarErro(
            "listarBairros",
            erro
        );
    }
}


async function salvarBairro() {
    try {

        const id =
            obterValor("bairroId");

        const nome =
            obterValor("bairroNome")
                .trim();

        const cidadeId =
            obterValor("bairroCidade");

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

        const dados = {
            nome,
            cidade_id: cidadeId
        };

        if (id) {

            const { error } =
                await supabaseClient
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

            const { error } =
                await supabaseClient
                    .from("bairros")
                    .insert(dados);

            if (error) {
                throw error;
            }
        }

        alert(
            "Bairro salvo com sucesso!"
        );

        fecharModalBairro();

        await popularBairros();
        await listarBairros();

    } catch (erro) {

        alert(
            "Erro ao salvar bairro:\n\n" +
            mostrarErro(
                "salvarBairro",
                erro
            )
        );
    }
}


async function editarBairro(
    id
) {
    try {

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

        if (error) {
            throw error;
        }

        preencherCampo(
            "bairroId",
            data.id
        );

        preencherCampo(
            "bairroNome",
            data.nome
        );

        preencherCampo(
            "bairroCidade",
            data.cidade_id
        );

        const modal =
            document.getElementById(
                "modalBairro"
            );

        if (modal) {
            modal.style.display =
                "flex";
        }

    } catch (erro) {
        mostrarErro(
            "editarBairro",
            erro
        );
    }
}


async function excluirBairro(
    id
) {
    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este bairro?"
        );

    if (!confirmar) {
        return;
    }

    try {

        const { error } =
            await supabaseClient
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
            "Bairro excluído com sucesso!"
        );

        await popularBairros();
        await listarBairros();

    } catch (erro) {

        alert(
            "Não foi possível excluir o bairro.\n\n" +
            mostrarErro(
                "excluirBairro",
                erro
            )
        );
    }
}


/* ============================================================
   CASCATA DE LOCALIZAÇÃO
   ============================================================ */

function ligarCascataLocalizacao() {

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
            async () => {

                if (estado) {
                    estado.value = "";
                }

                if (cidade) {
                    cidade.value = "";
                }

                const bairro =
                    document.getElementById(
                        "clinicaBairro"
                    );

                if (bairro) {
                    bairro.innerHTML = `
                        <option value="">
                            Selecione o Bairro
                        </option>
                    `;
                }

                await carregarEstadosClinica(
                    regiao.value
                );
            }
        );
    }


    if (estado) {

        estado.addEventListener(
            "change",
            async () => {

                if (cidade) {
                    cidade.value = "";
                }

                const bairro =
                    document.getElementById(
                        "clinicaBairro"
                    );

                if (bairro) {
                    bairro.innerHTML = `
                        <option value="">
                            Selecione o Bairro
                        </option>
                    `;
                }

                await carregarCidadesClinica(
                    estado.value
                );
            }
        );
    }


    if (cidade) {

        cidade.addEventListener(
            "change",
            async () => {

                await carregarBairrosClinica(
                    cidade.value
                );
            }
        );
    }
}


/* ============================================================
   MODAIS
   ============================================================ */

function fecharModalClinica() {
    const modal =
        document.getElementById(
            "modalClinica"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function fecharModalEspecialidade() {
    const modal =
        document.getElementById(
            "modalEspecialidade"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function fecharModalRegiao() {
    const modal =
        document.getElementById(
            "modalRegiao"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function fecharModalEstado() {
    const modal =
        document.getElementById(
            "modalEstado"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function fecharModalCidade() {
    const modal =
        document.getElementById(
            "modalCidade"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function fecharModalBairro() {
    const modal =
        document.getElementById(
            "modalBairro"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function limparFormularioClinica() {

    [
        "clinicaId",
        "clinicaNome",
        "clinicaEndereco",
        "clinicaTelefone"
    ].forEach(id => {
        preencherCampo(id, "");
    });


    const ativo =
        document.getElementById(
            "clinicaAtivo"
        );

    if (ativo) {
        ativo.checked =
            true;
    }


    [
        "clinicaRegiao",
        "clinicaEstado",
        "clinicaCidade",
        "clinicaBairro"
    ].forEach(id => {

        const select =
            document.getElementById(id);

        if (select) {
            select.value = "";
        }
    });


    const estado =
        document.getElementById(
            "clinicaEstado"
        );

    if (estado) {
        estado.innerHTML = `
            <option value="">
                Selecione o Estado
            </option>
        `;
    }


    const cidade =
        document.getElementById(
            "clinicaCidade"
        );

    if (cidade) {
        cidade.innerHTML = `
            <option value="">
                Selecione a Cidade
            </option>
        `;
    }


    const bairro =
        document.getElementById(
            "clinicaBairro"
        );

    if (bairro) {
        bairro.innerHTML = `
            <option value="">
                Selecione o Bairro
            </option>
        `;
    }
}


/* ============================================================
   TEMA
   ============================================================ */

function carregarTema() {

    const temaSalvo =
        localStorage.getItem(
            "tema"
        );

    if (
        temaSalvo === "escuro"
    ) {
        document.body.classList.add(
            "tema-escuro"
        );
    }

    atualizarBotaoTema();
}


function alternarTema() {

    document.body.classList.toggle(
        "tema-escuro"
    );

    const escuro =
        document.body.classList.contains(
            "tema-escuro"
        );

    localStorage.setItem(
        "tema",
        escuro
            ? "escuro"
            : "claro"
    );

    atualizarBotaoTema();
}


function atualizarBotaoTema() {

    const botao =
        document.getElementById(
            "btnTema"
        );

    if (!botao) {
        return;
    }

    const escuro =
        document.body.classList.contains(
            "tema-escuro"
        );

    botao.textContent =
        escuro
            ? "☀️"
            : "🌙";
}


/* ============================================================
   EVENTOS GERAIS
   ============================================================ */

function configurarEventosGerais() {

    ligarCascataLocalizacao();


    /* --------------------------------------------
       BOTÃO TEMA
       -------------------------------------------- */

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


    /* --------------------------------------------
       FECHAR MODAL CLICANDO FORA
       -------------------------------------------- */

    document.addEventListener(
        "click",
        evento => {

            if (
                evento.target.classList.contains(
                    "modal"
                )
            ) {
                evento.target.style.display =
                    "none";
            }
        }
    );


    /* --------------------------------------------
       ESC
       -------------------------------------------- */

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key !== "Escape"
            ) {
                return;
            }

            document
                .querySelectorAll(".modal")
                .forEach(modal => {
                    modal.style.display =
                        "none";
                });
        }
    );
}


/* ============================================================
   ABRIR MODAIS NOVOS
   ============================================================ */

function novaClinica() {
    abrirModalClinica();
}


function novaEspecialidade() {

    preencherCampo(
        "especialidadeId",
        ""
    );

    preencherCampo(
        "especialidadeNome",
        ""
    );

    const modal =
        document.getElementById(
            "modalEspecialidade"
        );

    if (modal) {
        modal.style.display =
            "flex";
    }
}


function novaRegiao() {

    preencherCampo(
        "regiaoId",
        ""
    );

    preencherCampo(
        "regiaoNome",
        ""
    );

    const modal =
        document.getElementById(
            "modalRegiao"
        );

    if (modal) {
        modal.style.display =
            "flex";
    }
}


function novoEstado() {

    preencherCampo(
        "estadoId",
        ""
    );

    preencherCampo(
        "estadoNome",
        ""
    );

    preencherCampo(
        "estadoRegiao",
        ""
    );

    const modal =
        document.getElementById(
            "modalEstado"
        );

    if (modal) {
        modal.style.display =
            "flex";
    }
}


function novaCidade() {

    preencherCampo(
        "cidadeId",
        ""
    );

    preencherCampo(
        "cidadeNome",
        ""
    );

    preencherCampo(
        "cidadeEstado",
        ""
    );

    const modal =
        document.getElementById(
            "modalCidade"
        );

    if (modal) {
        modal.style.display =
            "flex";
    }
}


function novoBairro() {

    preencherCampo(
        "bairroId",
        ""
    );

    preencherCampo(
        "bairroNome",
        ""
    );

    preencherCampo(
        "bairroCidade",
        ""
    );

    const modal =
        document.getElementById(
            "modalBairro"
        );

    if (modal) {
        modal.style.display =
            "flex";
    }
}


/* ============================================================
   LOGOUT
   ============================================================ */

function logout() {

    localStorage.removeItem(
        "usuarioLogado"
    );

    sessionStorage.clear();

    window.location.href =
        "login.html";
}


/* ============================================================
   EXPORTAR FUNÇÕES
   ============================================================ */

window.mostrarPagina =
    mostrarPagina;

window.novaClinica =
    novaClinica;

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

window.novaEspecialidade =
    novaEspecialidade;

window.editarEspecialidade =
    editarEspecialidade;

window.excluirEspecialidade =
    excluirEspecialidade;

window.salvarEspecialidade =
    salvarEspecialidade;

window.fecharModalEspecialidade =
    fecharModalEspecialidade;

window.novaRegiao =
    novaRegiao;

window.editarRegiao =
    editarRegiao;

window.excluirRegiao =
    excluirRegiao;

window.salvarRegiao =
    salvarRegiao;

window.fecharModalRegiao =
    fecharModalRegiao;

window.novoEstado =
    novoEstado;

window.editarEstado =
    editarEstado;

window.excluirEstado =
    excluirEstado;

window.salvarEstado =
    salvarEstado;

window.fecharModalEstado =
    fecharModalEstado;

window.novaCidade =
    novaCidade;

window.editarCidade =
    editarCidade;

window.excluirCidade =
    excluirCidade;

window.salvarCidade =
    salvarCidade;

window.fecharModalCidade =
    fecharModalCidade;

window.novoBairro =
    novoBairro;

window.editarBairro =
    editarBairro;

window.excluirBairro =
    excluirBairro;

window.salvarBairro =
    salvarBairro;

window.fecharModalBairro =
    fecharModalBairro;

window.limparLinhasEspecialidades =
    limparLinhasEspecialidades;

window.alternarTema =
    alternarTema;

window.logout =
    logout;
