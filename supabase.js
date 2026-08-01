// ===============================
// SUPABASE
// ===============================

const { createClient } = window.supabase;

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase OK");

// Buscar todos os jogadores
async function loadPlayers() {

    const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("name");

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

// Salvar jogador
async function savePlayer(player) {

    const { data, error } = await supabase
        .from("players")
        .insert(player)
        .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        alert(error.message);
    }

}

// Remover jogador
async function deletePlayer(id) {

    const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
    }

}
