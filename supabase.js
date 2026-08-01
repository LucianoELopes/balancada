// ==========================================
// SUPABASE
// ==========================================

// Verifica se o SDK foi carregado
if (!window.createClient) {
    alert("Erro: SDK do Supabase não foi carregado.");
}

// Cria conexão
const supabase = window.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===============================
// Buscar jogadores
// ===============================

async function getPlayers() {

    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("active", true)
        .order("name");

    if (error) {

        alert("Erro ao carregar jogadores:\n\n" + error.message);

        return [];

    }

    return data || [];

}

// ===============================
// Adicionar jogador
// ===============================

async function addPlayerDB(name, level, goalkeeper) {

    const { error } = await supabase
        .from("players")
        .insert([{
            name,
            level,
            goalkeeper,
            active: true
        }]);

    if (error) {

        alert("Erro ao salvar:\n\n" + error.message);

        return false;

    }

    return true;

}

// ===============================
// Excluir jogador
// ===============================

async function deletePlayerDB(id) {

    const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", id);

    if (error) {

        alert("Erro ao excluir:\n\n" + error.message);

        return false;

    }

    return true;

}
