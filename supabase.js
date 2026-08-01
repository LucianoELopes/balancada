// ==========================================
// SUPABASE
// ==========================================

var supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ==========================================
// Buscar jogadores
// ==========================================

async function getPlayers() {

    const { data, error } = await supabaseClient
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

    const { error } = await supabaseClient
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
// Editar jogador
// ==========================================

async function updatePlayerDB(id, name, level, goalkeeper) {

    const { data, error } = await supabaseClient
        .from("players")
        .update({
            name: name,
            level: level,
            goalkeeper: goalkeeper
        })
        .eq("id", id)
        .select();

    if (error) {
        alert("Erro ao atualizar:\n\n" + error.message);
        console.error(error);
        return false;
    }

    if (!data || data.length === 0) {
        alert("Nenhum jogador foi atualizado. Verifique as permissões no banco.");
        console.warn("Update retornou sem dados:", { id, name, level, goalkeeper });
        return false;
    }

    return true;

}

// ==========================================
// Excluir jogador
// ==========================================

async function deletePlayerDB(id) {

    const { error } = await supabaseClient
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
