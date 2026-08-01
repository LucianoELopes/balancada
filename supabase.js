// ==========================================
// SUPABASE
// ==========================================

const supabase = window.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
async function getPlayers() {

    const { data, error } = await db
        .from("players")
        .select("*")
        .eq("active", true)
        .order("name", { ascending: true });

    if (error) {

        alert("Erro ao carregar jogadores:\n\n" + error.message);

        return [];

    }

    return data ?? [];

}

async function addPlayerDB(name, level, goalkeeper) {

    const { error } = await db
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

async function deletePlayerDB(id) {

    const { error } = await db
        .from("players")
        .delete()
        .eq("id", id);

    if (error) {

        alert("Erro ao excluir:\n\n" + error.message);

        return false;

    }

    return true;

}
