// ==========================================
// SUPABASE
// ==========================================

if (!SUPABASE_KEY || !SUPABASE_KEY.startsWith("eyJ")) {
    console.error(
        "⚠️ SUPABASE_KEY inválida! Acesse: Supabase → Settings → API → anon/public key"
    );
}

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ==========================================
// Buscar jogadores
// ==========================================

async function getPlayers() {

    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("active", true)
        .order("name", { ascending: true });

    if (error) {
        alert("Erro ao carregar jogadores:\n\n" + error.message);
        console.error(error);
        return [];
    }

    return data ?? [];

}

// ==========================================
// Adicionar jogador
// ==========================================

async function addPlayerDB(name, level, goalkeeper) {

    const { error } = await supabase
        .from("players")
        .insert([{
            name: name,
            level: level,
            goalkeeper: goalkeeper,
            active: true
        }]);

    if (error) {
        alert("Erro ao salvar:\n\n" + error.message);
        console.error(error);
        return false;
    }

    return true;

}

// ==========================================
// Excluir jogador
// ==========================================

async function deletePlayerDB(id) {

    const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Erro ao excluir:\n\n" + error.message);
        console.error(error);
        return false;
    }

    return true;

}
