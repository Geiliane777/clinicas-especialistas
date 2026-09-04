// ======================================
// SUPABASE.JS
// CONFIGURAÇÃO DO SUPABASE
// ======================================

console.log("supabase.js carregado");


// ======================================
// CONFIGURAÇÕES
// ======================================

const SUPABASE_URL =
    "https://mmmiqqxienjeioxcnggu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ZHE8lc4B6IgyqDLe_LRK7w_edpWgmSz";


// ======================================
// VERIFICAR BIBLIOTECA
// ======================================

if (!window.supabase) {

    console.error(
        "Biblioteca do Supabase não foi carregada!"
    );

} else {

    console.log(
        "Biblioteca Supabase carregada com sucesso."
    );

}


// ======================================
// CRIAR CLIENTE
// ======================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


console.log(
    "supabaseClient criado com sucesso:",
    supabaseClient
);
