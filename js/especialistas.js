/* =========================================================
   RESET + VARIÁVEIS
========================================================= */

{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}

:root{
    --azul-escuro:#172554;
    --azul:#2563eb;
    --azul-claro:#3b82f6;
    --roxo:#7c3aed;
    --roxo-claro:#8b5cf6;
    --verde:#10b981;
    --vermelho:#ef4444;

    --fundo:#f4f6fb;
    --card:#fff;
    --texto:#334155;
    --texto-forte:#1e293b;
    --texto-claro:#64748b;
    --borda:#e2e8f0;

    --sombra:0 10px 30px rgba(15,23,42,.08);
    --sombra-forte:0 18px 40px rgba(15,23,42,.14);
}

body{
    font-family:Arial,Helvetica,sans-serif;
    background:var(--fundo);
    color:var(--texto);
    min-height:100vh;
    transition:.2s ease;
}

button,input,select,textarea{font:inherit}
button,a{-webkit-tap-highlight-color:transparent}
a{text-decoration:none}

body.dark{
    --fundo:#0b1428;
    --card:#1e293b;
    --texto:#cbd5e1;
    --texto-forte:#f8fafc;
    --texto-claro:#94a3b8;
    --borda:#334155;
    --sombra:0 10px 30px rgba(0,0,0,.28);
    --sombra-forte:0 18px 40px rgba(0,0,0,.38);
}


/* =========================================================
   HEADER
========================================================= */

.header{
    width:100%;
    min-height:88px;

    display:flex;
    align-items:center;
    justify-content:space-between;

    padding:14px 48px;

    background:#1e293b;
    border-bottom:1px solid #334155;

    position:sticky;
    top:0;
    z-index:1000;
}

.header-left{
    display:flex;
    align-items:center;
    gap:14px;
}

.logo{
    width:46px;
    height:46px;
    object-fit:contain;
}

.titulo-site h1{
    color:#dbeafe;
    font-size:21px;
    line-height:1.1;
    font-weight:800;
}

.titulo-site p{
    margin-top:4px;
    color:#94a3b8;
    font-size:11px;
}

.menu-topo{
    display:flex;
    align-items:center;
    gap:7px;
}

.menu-link{
    min-height:46px;

    display:inline-flex;
    align-items:center;
    justify-content:center;

    padding:0 16px;

    border-radius:10px;

    color:#94a3b8;
    font-size:11px;
    font-weight:700;

    transition:.2s ease;
}

.menu-link:hover{
    color:#fff;
    background:rgba(255,255,255,.06);
}

.menu-link.ativo{
    color:#fff;

    background:linear-gradient(
        135deg,
        #2563eb,
        #3b82f6
    );

    box-shadow:0 8px 20px rgba(37,99,235,.25);
}

body.sindilegis .menu-link.ativo{
    background:linear-gradient(
        135deg,
        #7c3aed,
        #8b5cf6
    );

    box-shadow:0 8px 20px rgba(124,58,237,.25);
}

.login-link{
    border:1px solid #334155;
}

.btn-tema{
    width:46px;
    height:46px;

    display:flex;
    align-items:center;
    justify-content:center;

    border:1px solid #334155;
    border-radius:10px;

    background:transparent;
    color:#fff;

    cursor:pointer;
    font-size:15px;

    transition:.2s ease;
}

.btn-tema:hover{
    background:rgba(255,255,255,.07);
}


/* =========================================================
   CONTAINER
========================================================= */

.container{
    width:calc(100% - 56px);
    max-width:1450px;

    margin:0 auto;

    padding:38px 0 55px;
}


/* =========================================================
   HERO
========================================================= */

.hero-site{
    min-height:256px;

    display:flex;
    align-items:center;
    justify-content:space-between;

    gap:50px;

    padding:36px 42px;

    margin-bottom:38px;

    border-radius:18px;

    background:
        linear-gradient(
            110deg,
            #1e3a8a 0%,
            #21419b 45%,
            #2563eb 100%
        );

    color:#fff;

    box-shadow:
        0 18px 42px rgba(23,37,84,.20);

    position:relative;
    overflow:hidden;
}

.hero-site::after{
    content:"";

    position:absolute;

    width:300px;
    height:300px;

    right:-80px;
    top:-110px;

    border-radius:50%;

    background:rgba(255,255,255,.07);
}

body.sindilegis .hero-site{
    background:
        linear-gradient(
            110deg,
            #4c1d95 0%,
            #6d28d9 50%,
            #8b5cf6 100%
        );
}

.hero-texto{
    max-width:800px;
    position:relative;
    z-index:2;
}

.hero-badge{
    display:inline-flex;
    align-items:center;

    padding:7px 13px;

    margin-bottom:17px;

    border-radius:999px;

    background:rgba(255,255,255,.12);
    border:1px solid rgba(255,255,255,.18);

    color:#fff;

    font-size:10px;
    font-weight:800;

    letter-spacing:.5px;
}

.hero-texto h2{
    color:#fff;

    font-size:42px;
    line-height:1.08;

    font-weight:800;

    margin-bottom:12px;
}

.hero-texto h2 span{
    color:#bfdbfe;
}

body.sindilegis .hero-texto h2 span{
    color:#ddd6fe;
}

.hero-texto p{
    color:rgba(255,255,255,.85);

    font-size:13px;
    line-height:1.6;
}

.hero-destaque{
    width:345px;
    min-height:103px;

    display:flex;
    align-items:center;

    gap:16px;

    padding:19px;

    border-radius:14px;

    background:rgba(255,255,255,.10);
    border:1px solid rgba(255,255,255,.18);

    backdrop-filter:blur(8px);

    position:relative;
    z-index:2;
}

.hero-icone{
    width:58px;
    height:58px;

    display:flex;
    align-items:center;
    justify-content:center;

    flex-shrink:0;

    border-radius:12px;

    background:rgba(255,255,255,.13);

    font-size:25px;
}

.hero-destaque strong{
    display:block;

    color:#fff;

    font-size:14px;

    margin-bottom:5px;
}

.hero-destaque span{
    display:block;

    color:rgba(255,255,255,.72);

    font-size:10px;
    line-height:1.5;
}


/* =========================================================
   TÍTULOS
========================================================= */

.titulo-principal{
    margin-bottom:21px;
}

.section-label{
    display:block;

    margin-bottom:7px;

    color:#3b82f6;

    font-size:10px;
    font-weight:800;

    letter-spacing:.8px;
    text-transform:uppercase;
}

body.sindilegis .section-label{
    color:#a78bfa;
}

.titulo-principal h2,
.resultado-topo h2{
    color:var(--texto-forte);

    font-size:27px;
    font-weight:800;

    margin-bottom:7px;
}

.titulo-principal p,
.resultado-topo p{
    color:var(--texto-claro);

    font-size:12px;
    line-height:1.5;
}


/* =========================================================
   FILTROS
========================================================= */

.filtros{
    display:grid;

    grid-template-columns:
        repeat(3,minmax(0,1fr));

    gap:17px;

    padding:24px;

    margin-bottom:38px;

    background:var(--card);

    border:1px solid var(--borda);

    border-radius:16px;

    box-shadow:var(--sombra);

    position:relative;
}

.filtros::before{
    content:"";

    position:absolute;

    left:0;
    top:18px;
    bottom:18px;

    width:3px;

    border-radius:0 5px 5px 0;

    background:var(--azul);
}

body.sindilegis .filtros::before{
    background:var(--roxo);
}

.filtro{
    min-width:0;
}

.filtro label{
    display:block;

    margin:0 0 8px 2px;

    color:var(--texto-forte);

    font-size:10px;
    font-weight:800;

    text-transform:uppercase;
}

.filtro select{
    width:100%;
    height:50px;

    padding:0 15px;

    border:1px solid var(--borda);
    border-radius:10px;

    background:var(--card);
    color:var(--texto);

    outline:none;

    cursor:pointer;

    font-size:11px;

    transition:.2s ease;
}

.filtro select:hover{
    border-color:#94a3b8;
}

.filtro select:focus{
    border-color:var(--azul);

    box-shadow:
        0 0 0 3px rgba(37,99,235,.10);
}

body.sindilegis .filtro select:focus{
    border-color:var(--roxo);

    box-shadow:
        0 0 0 3px rgba(124,58,237,.10);
}

.filtro-botao{
    display:flex;
    flex-direction:column;
    justify-content:flex-end;
}

.btn-buscar{
    width:100%;
    height:50px;

    border:0;
    border-radius:10px;

    background:
        linear-gradient(
            135deg,
            var(--azul),
            var(--azul-claro)
        );

    color:#fff;

    font-size:11px;
    font-weight:800;

    cursor:pointer;

    box-shadow:
        0 7px 16px rgba(37,99,235,.22);

    transition:.2s ease;
}

.btn-buscar:hover{
    transform:translateY(-2px);

    box-shadow:
        0 10px 22px rgba(37,99,235,.28);
}

body.sindilegis .btn-buscar{
    background:
        linear-gradient(
            135deg,
            var(--roxo),
            var(--roxo-claro)
        );

    box-shadow:
        0 7px 16px rgba(124,58,237,.22);
}


/* =========================================================
   RESULTADO
========================================================= */

#resultado{
    width:100%;
}

.resultado-topo{
    display:flex;
    align-items:flex-end;
    justify-content:space-between;

    gap:20px;

    margin-bottom:18px;
}

.resultado-contador{
    min-width:82px;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    padding:11px 15px;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:10px;

    box-shadow:var(--sombra);
}

.resultado-contador strong{
    color:var(--azul);

    font-size:22px;
    line-height:1;
}

body.sindilegis .resultado-contador strong{
    color:var(--roxo-claro);
}

.resultado-contador span{
    margin-top:5px;

    color:var(--texto-claro);

    font-size:9px;
    font-weight:700;
}


/* =========================================================
   CARDS
========================================================= */

.cards{
    width:100%;

    display:grid;

    grid-template-columns:
        repeat(2,minmax(0,1fr));

    gap:18px;
}

.card{
    min-width:0;

    display:flex;
    flex-direction:column;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:15px;

    overflow:hidden;

    box-shadow:var(--sombra);

    transition:.2s ease;
}

.card:hover{
    transform:translateY(-3px);

    box-shadow:var(--sombra-forte);

    border-color:rgba(37,99,235,.28);
}

body.sindilegis .card:hover{
    border-color:rgba(124,58,237,.28);
}


/* =========================================================
   CABEÇALHO CARD
========================================================= */

.cardHeader{
    min-height:86px;

    display:flex;
    align-items:flex-start;
    justify-content:space-between;

    gap:14px;

    padding:18px 20px;

    border-top:3px solid var(--azul);

    background:
        linear-gradient(
            180deg,
            rgba(37,99,235,.055),
            transparent
        );
}

body.sindilegis .cardHeader{
    border-top-color:var(--roxo);

    background:
        linear-gradient(
            180deg,
            rgba(124,58,237,.055),
            transparent
        );
}

.cardHeader-principal{
    min-width:0;

    display:flex;
    align-items:center;

    gap:12px;
}

.card-icone-clinica{
    width:46px;
    height:46px;

    display:flex;
    align-items:center;
    justify-content:center;

    flex-shrink:0;

    border-radius:11px;

    background:rgba(37,99,235,.09);

    font-size:20px;
}

body.sindilegis .card-icone-clinica{
    background:rgba(124,58,237,.10);
}

.card-titulo{
    min-width:0;
}

.card-rede{
    display:block;

    margin-bottom:4px;

    color:var(--azul);

    font-size:8px;
    font-weight:800;

    text-transform:uppercase;
    letter-spacing:.5px;
}

body.sindilegis .card-rede{
    color:var(--roxo-claro);
}

.card-titulo h3{
    color:var(--texto-forte);

    font-size:15px;
    line-height:1.25;

    font-weight:800;

    overflow-wrap:anywhere;
}

.card-status{
    flex-shrink:0;

    display:inline-flex;
    align-items:center;

    gap:5px;

    padding:6px 9px;

    border-radius:999px;

    background:rgba(16,185,129,.09);

    color:var(--verde);

    font-size:8px;
    font-weight:800;

    white-space:nowrap;
}

.status-ponto{
    width:5px;
    height:5px;

    border-radius:50%;

    background:var(--verde);
}


/* =========================================================
   CORPO CARD
========================================================= */

.card-corpo{
    flex:1;

    display:flex;
    flex-direction:column;

    padding:0 20px 18px;
}

.card-informacoes{
    display:flex;
    flex-direction:column;

    gap:9px;
}

.card-info-item{
    display:flex;
    align-items:flex-start;

    gap:10px;
}

.card-info-icone{
    width:29px;
    height:29px;

    display:flex;
    align-items:center;
    justify-content:center;

    flex-shrink:0;

    border-radius:8px;

    background:rgba(37,99,235,.07);

    font-size:13px;
}

body.sindilegis .card-info-icone{
    background:rgba(124,58,237,.08);
}

.card-info-conteudo{
    min-width:0;
}

.card-info-label{
    display:block;

    margin-bottom:2px;

    color:var(--texto-claro);

    font-size:8px;
    font-weight:700;

    text-transform:uppercase;
}

.card-info-conteudo strong{
    display:block;

    color:var(--texto);

    font-size:10px;
    line-height:1.45;

    font-weight:600;

    overflow-wrap:anywhere;
}


/* =========================================================
   ESPECIALIDADES
========================================================= */

.card-secao{
    margin-top:15px;
    padding-top:12px;

    border-top:1px solid var(--borda);
}

.card-secao-titulo{
    display:flex;
    align-items:center;

    gap:6px;

    margin-bottom:8px;

    color:var(--texto-forte);

    font-size:10px;
    font-weight:800;
}

.tags{
    display:flex;
    flex-wrap:wrap;

    gap:6px;
}

.tag{
    display:inline-flex;
    align-items:center;

    padding:6px 9px;

    border-radius:999px;

    background:rgba(37,99,235,.07);

    border:1px solid rgba(37,99,235,.10);

    color:var(--azul);

    font-size:8px;
    font-weight:700;

    line-height:1.2;
}

body.sindilegis .tag{
    background:rgba(124,58,237,.08);

    border-color:rgba(124,58,237,.11);

    color:var(--roxo-claro);
}


/* =========================================================
   AÇÕES
========================================================= */

.acoes{
    display:flex;
    flex-wrap:wrap;

    gap:8px;

    margin-top:auto;
    padding-top:16px;
}

.btnAcao{
    min-height:36px;

    display:inline-flex;
    align-items:center;
    justify-content:center;

    gap:5px;

    padding:0 12px;

    border-radius:8px;

    font-size:9px;
    font-weight:800;

    transition:.2s ease;
}

.btnAcao:hover{
    transform:translateY(-1px);
}

.btn-mapa{
    background:
        linear-gradient(
            135deg,
            var(--azul),
            var(--azul-claro)
        );

    color:#fff;

    box-shadow:
        0 5px 12px rgba(37,99,235,.18);
}

.btn-whatsapp{
    background:rgba(16,185,129,.07);

    border:1px solid rgba(16,185,129,.16);

    color:var(--verde);
}


/* =========================================================
   SEM RESULTADO
========================================================= */

.semResultado{
    width:100%;

    display:flex;
    flex-direction:column;

    align-items:center;
    justify-content:center;

    text-align:center;

    padding:55px 20px;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:15px;

    box-shadow:var(--sombra);
}

.semResultado h2{
    color:var(--texto-forte);

    font-size:20px;

    margin-bottom:7px;
}

.semResultado p{
    max-width:560px;

    color:var(--texto-claro);

    font-size:11px;
    line-height:1.6;
}


/* =========================================================
   INFORMAÇÕES
========================================================= */

.informacoes-site{
    display:grid;

    grid-template-columns:
        repeat(3,minmax(0,1fr));

    gap:16px;

    margin-top:35px;
}

.info-site-item{
    display:flex;
    align-items:flex-start;

    gap:12px;

    padding:18px;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:12px;

    box-shadow:var(--sombra);
}

.info-site-icone{
    width:40px;
    height:40px;

    display:flex;
    align-items:center;
    justify-content:center;

    flex-shrink:0;

    border-radius:10px;

    background:rgba(37,99,235,.08);

    font-size:17px;
}

body.sindilegis .info-site-icone{
    background:rgba(124,58,237,.09);
}

.info-site-item strong{
    display:block;

    color:var(--texto-forte);

    font-size:11px;

    margin-bottom:5px;
}

.info-site-item p{
    color:var(--texto-claro);

    font-size:9px;
    line-height:1.5;
}


/* =========================================================
   RODAPÉ
========================================================= */

.rodape{
    border-top:1px solid var(--borda);

    background:var(--card);
}

.rodape-conteudo{
    width:calc(100% - 56px);
    max-width:1450px;

    min-height:82px;

    margin:auto;

    display:flex;
    align-items:center;
    justify-content:space-between;

    gap:20px;
}

.rodape-marca{
    display:flex;
    align-items:center;

    gap:10px;
}

.rodape-marca img{
    width:34px;
    height:34px;
}

.rodape-marca strong{
    display:block;

    color:var(--texto-forte);

    font-size:10px;
}

.rodape-marca span{
    display:block;

    margin-top:3px;

    color:var(--texto-claro);

    font-size:8px;
}

.rodape-direitos{
    color:var(--texto-claro);

    font-size:8px;
}


/* =========================================================
   =========================================================
   ADMIN
   =========================================================
========================================================= */

.menu{
    position:fixed;

    left:0;
    top:0;
    bottom:0;

    width:250px;

    display:flex;
    flex-direction:column;

    background:
        linear-gradient(
            180deg,
            #172554 0%,
            #1e3a8a 48%,
            #581c87 100%
        );

    color:#fff;

    overflow-y:auto;

    z-index:1000;

    box-shadow:
        5px 0 24px rgba(15,23,42,.16);
}

.menu-logo{
    display:flex;
    align-items:center;

    gap:12px;

    padding:20px 18px;

    border-bottom:
        1px solid rgba(255,255,255,.09);
}

.logo-admin{
    width:50px;
    height:50px;

    object-fit:contain;
}

.menu-logo-text strong{
    display:block;

    color:#fff;

    font-size:14px;
}

.menu-logo-text span{
    display:block;

    margin-top:4px;

    color:rgba(255,255,255,.55);

    font-size:8px;
}

.menu-nav{
    display:flex;
    flex-direction:column;

    gap:5px;

    padding:17px 10px;
}

.menu-btn{
    width:100%;
    min-height:42px;

    display:flex;
    align-items:center;

    gap:9px;

    padding:0 12px;

    border:0;
    border-radius:9px;

    background:transparent;

    color:rgba(255,255,255,.68);

    font-size:10px;
    font-weight:700;

    text-align:left;

    cursor:pointer;

    transition:.2s ease;
}

.menu-btn:hover{
    background:rgba(255,255,255,.08);
    color:#fff;
}

.menu-btn.ativo{
    background:
        linear-gradient(
            135deg,
            #3b82f6,
            #2563eb
        );

    color:#fff;

    box-shadow:
        0 7px 17px rgba(0,0,0,.15);
}

.menu-footer{
    margin-top:auto;

    padding:12px 10px;

    border-top:
        1px solid rgba(255,255,255,.09);
}

.btn-sair{
    width:100%;
    min-height:40px;

    display:flex;
    align-items:center;

    gap:8px;

    padding:0 12px;

    border:0;
    border-radius:9px;

    background:rgba(239,68,68,.09);

    color:#fecaca;

    font-size:10px;
    font-weight:700;

    cursor:pointer;
}

.conteudo{
    min-height:100vh;

    margin-left:250px;

    padding:32px;
}

.pagina{display:none}

.pagina.ativa{
    display:block;

    animation:aparecer .2s ease;
}

@keyframes aparecer{
    from{
        opacity:0;
        transform:translateY(6px);
    }

    to{
        opacity:1;
        transform:translateY(0);
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

.topo-dashboard{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;

    gap:20px;

    margin-bottom:25px;
}

.topo-dashboard h1{
    color:var(--texto-forte);

    font-size:27px;

    margin-bottom:6px;
}

.subtitulo-dashboard{
    color:var(--texto-claro);

    font-size:11px;
}

.data-dashboard{
    min-width:165px;

    padding:12px 15px;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:10px;

    box-shadow:var(--sombra);

    color:var(--texto-claro);

    font-size:9px;

    text-align:center;
}

.dashboard-cards{
    display:grid;

    grid-template-columns:
        repeat(4,minmax(0,1fr));

    gap:14px;

    margin-bottom:18px;
}

.dashboard-card{
    display:flex;
    align-items:center;

    gap:12px;

    padding:18px;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:13px;

    box-shadow:var(--sombra);
}

.dashboard-card-icon{
    width:44px;
    height:44px;

    display:flex;
    align-items:center;
    justify-content:center;

    flex-shrink:0;

    border-radius:10px;

    background:rgba(37,99,235,.08);

    font-size:18px;
}

.dashboard-card strong{
    display:block;

    color:var(--texto-forte);

    font-size:21px;
}

.dashboard-card span{
    display:block;

    margin-top:5px;

    color:var(--texto-claro);

    font-size:9px;
}

.dashboard-grid{
    display:grid;

    grid-template-columns:
        1.3fr .9fr;

    gap:15px;

    margin-bottom:15px;
}

.dashboard-panel{
    padding:19px;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:13px;

    box-shadow:var(--sombra);
}

.panel-titulo{
    color:var(--texto-forte);

    font-size:13px;
    font-weight:800;

    margin-bottom:5px;
}

.panel-label{
    display:block;

    color:var(--texto-claro);

    font-size:9px;

    margin-bottom:15px;
}

.progresso-container{
    margin-top:8px;
}

.progresso-info{
    display:flex;
    justify-content:space-between;

    margin-bottom:7px;

    color:var(--texto);

    font-size:10px;
    font-weight:700;
}

.barra-progresso{
    width:100%;
    height:8px;

    overflow:hidden;

    border-radius:999px;

    background:var(--borda);
}

.barra-progresso-fill{
    width:0;
    height:100%;

    border-radius:999px;

    background:
        linear-gradient(
            90deg,
            var(--azul),
            var(--azul-claro)
        );

    transition:width .3s ease;
}

.legenda-progresso{
    display:flex;
    justify-content:space-between;

    margin-top:8px;

    color:var(--texto-claro);

    font-size:8px;
}

.ponto{
    display:inline-block;

    width:6px;
    height:6px;

    margin-right:4px;

    border-radius:50%;
}

.ponto.ativo{background:var(--verde)}
.ponto.inativo{background:var(--vermelho)}

.coverage-grid{
    display:grid;

    grid-template-columns:
        repeat(2,minmax(0,1fr));

    gap:8px;
}

.coverage-item{
    display:flex;
    align-items:center;
    justify-content:space-between;

    gap:8px;

    padding:11px;

    border:1px solid var(--borda);
    border-radius:9px;

    background:rgba(37,99,235,.035);
}

.coverage-item span{
    color:var(--texto-claro);

    font-size:9px;
}

.coverage-item strong{
    color:var(--texto-forte);

    font-size:13px;
}

.ultimas-clinicas-panel{
    margin-bottom:15px;
}

.ultimas-clinicas{
    display:flex;
    flex-direction:column;

    gap:7px;
}

.estado-vazio{
    padding:20px;

    text-align:center;

    color:var(--texto-claro);

    font-size:10px;
}


/* =========================================================
   ADMIN PÁGINAS
========================================================= */

.titulo-pagina{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;

    gap:16px;

    margin-bottom:20px;
}

.titulo-pagina h1{
    color:var(--texto-forte);

    font-size:25px;

    margin-bottom:5px;
}

.titulo-pagina p{
    color:var(--texto-claro);

    font-size:11px;
}

.painel{
    padding:19px;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:13px;

    box-shadow:var(--sombra);

    margin-bottom:15px;
}

.pagina-acoes{
    display:flex;
    align-items:center;
    justify-content:space-between;

    gap:12px;

    margin-bottom:15px;
}

.campo-busca{
    width:min(360px,100%);
}

.campo-busca input{
    width:100%;
    height:40px;

    padding:0 12px;

    border:1px solid var(--borda);
    border-radius:9px;

    background:var(--card);
    color:var(--texto);

    outline:none;

    font-size:10px;
}

.btn-primario{
    min-height:40px;

    display:inline-flex;
    align-items:center;
    justify-content:center;

    padding:0 15px;

    border:0;
    border-radius:9px;

    background:
        linear-gradient(
            135deg,
            var(--azul),
            var(--azul-claro)
        );

    color:#fff;

    font-size:10px;
    font-weight:800;

    cursor:pointer;
}

.btn-secundario{
    min-height:38px;

    padding:0 14px;

    border:1px solid var(--borda);
    border-radius:9px;

    background:var(--card);
    color:var(--texto);

    font-size:10px;
    font-weight:700;

    cursor:pointer;
}


/* =========================================================
   FORM INLINE
========================================================= */

.form-inline{
    display:grid;

    grid-template-columns:
        minmax(0,1fr)
        auto;

    gap:10px;

    margin-bottom:15px;
}

.form-inline input,
.form-inline select{
    width:100%;
    height:40px;

    padding:0 12px;

    border:1px solid var(--borda);
    border-radius:9px;

    background:var(--card);
    color:var(--texto);

    outline:none;

    font-size:10px;
}

#pagina-estados .form-inline,
#pagina-cidades .form-inline,
#pagina-bairros .form-inline{
    grid-template-columns:
        minmax(0,1fr)
        minmax(180px,.7fr)
        auto;
}


/* =========================================================
   TABELAS
========================================================= */

.tabela-container{
    width:100%;

    overflow-x:auto;

    border:1px solid var(--borda);
    border-radius:10px;
}

.tabela-container table{
    width:100%;
    min-width:700px;

    border-collapse:collapse;
}

.tabela-container th{
    padding:12px;

    background:rgba(37,99,235,.045);

    border-bottom:1px solid var(--borda);

    color:var(--texto-claro);

    font-size:8px;
    font-weight:800;

    text-transform:uppercase;

    text-align:left;
}

.tabela-container td{
    padding:12px;

    border-bottom:1px solid var(--borda);

    color:var(--texto);

    font-size:10px;
}

.status{
    display:inline-flex;

    padding:5px 8px;

    border-radius:999px;

    font-size:8px;
    font-weight:800;
}

.status.ativo{
    color:var(--verde);
    background:rgba(16,185,129,.09);
}

.status.inativo{
    color:var(--vermelho);
    background:rgba(239,68,68,.09);
}

.acoes-tabela{
    display:flex;
    gap:5px;
}

.btn-editar,
.btn-excluir{
    width:30px;
    height:30px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:7px;

    cursor:pointer;
}

.btn-editar{
    border:1px solid rgba(37,99,235,.14);
    background:rgba(37,99,235,.06);
    color:var(--azul);
}

.btn-excluir{
    border:1px solid rgba(239,68,68,.14);
    background:rgba(239,68,68,.06);
    color:var(--vermelho);
}


/* =========================================================
   MODAL
========================================================= */

.modal{
    position:fixed;

    inset:0;

    display:flex;
    align-items:center;
    justify-content:center;

    padding:20px;

    background:rgba(15,23,42,.68);

    backdrop-filter:blur(5px);

    z-index:2000;
}

.modal.hidden{
    display:none;
}

.modal-conteudo{
    width:min(800px,100%);

    max-height:90vh;

    overflow-y:auto;

    background:var(--card);

    border:1px solid var(--borda);
    border-radius:15px;

    box-shadow:0 25px 65px rgba(0,0,0,.28);
}

.modal-header{
    display:flex;
    align-items:center;
    justify-content:space-between;

    padding:17px 19px;

    border-bottom:1px solid var(--borda);
}

.modal-header h2{
    color:var(--texto-forte);

    font-size:17px;
}

.modal-fechar{
    width:31px;
    height:31px;

    display:flex;
    align-items:center;
    justify-content:center;

    border:1px solid var(--borda);
    border-radius:8px;

    background:var(--card);
    color:var(--texto-claro);

    cursor:pointer;
}

.formulario{
    padding:19px;
}

.form-grid{
    display:grid;

    grid-template-columns:
        repeat(2,minmax(0,1fr));

    gap:14px;
}

.form-section{
    margin-bottom:19px;
}

.form-section-titulo{
    margin-bottom:12px;
    padding-bottom:8px;

    border-bottom:1px solid var(--borda);

    color:var(--texto-forte);

    font-size:11px;
    font-weight:800;
}

.campo-formulario{
    display:flex;
    flex-direction:column;

    gap:5px;
}

.campo-formulario label{
    color:var(--texto);

    font-size:9px;
    font-weight:800;
}

.campo-formulario input,
.campo-formulario select,
.campo-formulario textarea{
    width:100%;

    min-height:40px;

    padding:8px 11px;

    border:1px solid var(--borda);
    border-radius:9px;

    background:var(--card);
    color:var(--texto);

    outline:none;

    font-size:10px;
}

.campo-formulario textarea{
    resize:vertical;
}

.campo-completo{
    grid-column:1/-1;
}

.checkbox-status{
    display:flex;
    align-items:center;

    gap:8px;

    color:var(--texto);

    font-size:10px;
    font-weight:700;

    cursor:pointer;
}

.checkbox-status input{
    display:none;
}

.checkbox-custom{
    width:19px;
    height:19px;

    display:flex;
    align-items:center;
    justify-content:center;

    border:1px solid var(--borda);
    border-radius:5px;

    background:var(--card);
}

.checkbox-status input:checked+.checkbox-custom{
    background:var(--azul);
    border-color:var(--azul);
}

.checkbox-status input:checked+.checkbox-custom::after{
    content:"✓";

    color:#fff;

    font-size:12px;
    font-weight:800;
}

.especialidades-form{
    display:flex;
    flex-direction:column;

    gap:8px;
}

.form-acoes{
    display:flex;
    justify-content:flex-end;

    gap:9px;

    padding-top:14px;
    margin-top:7px;

    border-top:1px solid var(--borda);
}


/* =========================================================
   RESPONSIVIDADE
========================================================= */

@media(max-width:1100px){

    .header{
        padding-left:28px;
        padding-right:28px;
    }

    .container{
        width:calc(100% - 40px);
    }

    .hero-site{
        padding:32px;
    }

    .hero-texto h2{
        font-size:36px;
    }

    .hero-destaque{
        width:300px;
    }

    .dashboard-cards{
        grid-template-columns:
            repeat(2,minmax(0,1fr));
    }
}


@media(max-width:900px){

    .hero-site{
        flex-direction:column;
        align-items:flex-start;

        gap:25px;
    }

    .hero-destaque{
        width:100%;
    }

    .filtros{
        grid-template-columns:
            repeat(2,minmax(0,1fr));
    }

    .informacoes-site{
        grid-template-columns:1fr;
    }

    .dashboard-grid{
        grid-template-columns:1fr;
    }
}


@media(max-width:700px){

    .header{
        position:relative;

        flex-direction:column;

        align-items:stretch;

        gap:12px;

        padding:14px 18px;
    }

    .header-left{
        justify-content:center;
    }

    .menu-topo{
        display:grid;

        grid-template-columns:
            1fr 1fr 45px 75px;
    }

    .menu-link{
        padding:0 7px;

        font-size:8px;
    }

    .container{
        width:calc(100% - 24px);

        padding-top:24px;
    }

    .hero-site{
        padding:25px 22px;
    }

    .hero-texto h2{
        font-size:30px;
    }

    .filtros{
        grid-template-columns:1fr;

        padding:18px;
    }

    .cards{
        grid-template-columns:1fr;
    }

    .resultado-topo{
        flex-direction:column;
        align-items:flex-start;
    }

    .resultado-contador{
        width:100%;
    }

    .rodape-conteudo{
        width:calc(100% - 24px);

        flex-direction:column;

        justify-content:center;

        padding:18px 0;
    }


    /* ADMIN */

    .menu{
        position:relative;

        width:100%;

        min-height:auto;
    }

    .menu-nav{
        display:grid;

        grid-template-columns:
            repeat(2,1fr);
    }

    .conteudo{
        margin-left:0;

        padding:20px 12px;
    }

    .dashboard-cards{
        grid-template-columns:1fr;
    }

    .pagina-acoes{
        flex-direction:column;
        align-items:stretch;
    }

    .campo-busca{
        width:100%;
    }

    .form-grid{
        grid-template-columns:1fr;
    }

    .campo-completo{
        grid-column:auto;
    }

    .form-inline,
    #pagina-estados .form-inline,
    #pagina-cidades .form-inline,
    #pagina-bairros .form-inline{
        grid-template-columns:1fr;
    }
}


@media(max-width:430px){

    .menu-topo{
        grid-template-columns:
            1fr 1fr 42px 65px;
    }

    .titulo-site h1{
        font-size:18px;
    }

    .hero-texto h2{
        font-size:27px;
    }

    .hero-destaque{
        padding:15px;
    }

    .cardHeader{
        flex-direction:column;
    }

    .card-status{
        align-self:flex-start;
    }

    .acoes{
        flex-direction:column;
    }

    .btnAcao{
        width:100%;
    }
}
