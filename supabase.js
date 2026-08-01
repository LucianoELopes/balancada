// ==========================================
// SUPABASE
// ==========================================

var supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ==========================================
// Buscar jogadores (todos, ativos e inativos)
// ==========================================

async function getPlayers() {

    const { data, error } = await supabaseClient
        .from("players")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        alert("Erro ao carregar jogadores:\n\n" + error.message);
        console.error(error);
        return [];
    }

    return data ?? [];

}

// ==========================================
// Alternar ativo/inativo
// ==========================================

async function toggleActiveDB(id, active) {

    const { error } = await supabaseClient
        .from("players")
        .update({ active: active })
        .eq("id", id);

    if (error) {
        console.error("Erro ao atualizar status:", error);
        return false;
    }

    return true;

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

// ==========================================
// Salvar sorteio
// ==========================================

async function saveDrawDB(teams) {

    const { error } = await supabaseClient
        .from("draws")
        .insert([{ teams: teams }]);

    if (error) {
        console.error("Erro ao salvar sorteio:", error);
        return false;
    }

    return true;

}

// ==========================================
// Buscar último sorteio
// ==========================================

async function getLastDrawDB() {

    const { data, error } = await supabaseClient
        .from("draws")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        // sem sorteio salvo ainda é normal
        return null;
    }

    return data ?? null;

}
