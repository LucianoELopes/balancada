// ==========================================
// BALANÇADA
// script.js
// ==========================================

let players = [];

const playerList = document.getElementById("playerList");

const playerName = document.getElementById("playerName");
const playerLevel = document.getElementById("playerLevel");
const goalkeeper = document.getElementById("goalkeeper");

const addPlayerBtn = document.getElementById("addPlayer");

const drawTeamsBtn = document.getElementById("drawTeams");
const copyResultBtn = document.getElementById("copyResult");

const playersPerTeam = document.getElementById("playersPerTeam");

// ==========================================

let editingId = null;

// ==========================================

function renderPlayers() {

    if (players.length === 0) {

        playerList.innerHTML = `
            <p class="empty">
                Nenhum jogador cadastrado.
            </p>
        `;

        return;

    }

    playerList.innerHTML = "";

    const active   = players.filter(p => p.active);
    const inactive = players.filter(p => !p.active);

    function createPlayerRow(player) {

        const div = document.createElement("div");
        div.className = "player" + (player.active ? "" : " player-inactive");

        div.innerHTML = `
            <div class="player-info">
                ${player.goalkeeper ? "🥅 " : ""}
                <strong>${player.name}</strong>
                <span>⭐ ${player.level}</span>
            </div>

            <div class="player-actions">
                <button class="btn-toggle ${player.active ? "active" : "inactive"}"
                    data-id="${player.id}"
                    title="${player.active ? "Desativar" : "Ativar"}">
                    ${player.active ? "✅" : "⛔"}
                </button>
                <button class="btn-edit" data-id="${player.id}" title="Editar">✏️</button>
                <button class="btn-delete" data-id="${player.id}" title="Excluir">🗑️</button>
            </div>
        `;

        div.querySelector(".btn-toggle").onclick = async () => {
            await toggleActiveDB(player.id, !player.active);
            await loadScreen();
        };

        div.querySelector(".btn-edit").onclick = () => {

            editingId = player.id;
            playerName.value = player.name;
            playerLevel.value = player.level;
            goalkeeper.checked = player.goalkeeper;

            addPlayerBtn.textContent = "💾 Salvar Alterações";
            addPlayerBtn.classList.add("editing");

            playerName.focus();
            playerName.scrollIntoView({ behavior: "smooth", block: "center" });

        };

        div.querySelector(".btn-delete").onclick = async () => {
            const ok = await deletePlayerDB(player.id);
            if (ok) await loadScreen();
        };

        return div;

    }

    active.forEach(p => playerList.appendChild(createPlayerRow(p)));

    if (inactive.length > 0) {

        const divider = document.createElement("p");
        divider.className = "inactive-label";
        divider.textContent = "⛔ Inativos (fora do sorteio)";
        playerList.appendChild(divider);

        inactive.forEach(p => playerList.appendChild(createPlayerRow(p)));

    }

}

// ==========================================

async function loadScreen() {

    players = await getPlayers();

    renderPlayers();

}

// ==========================================

addPlayerBtn.onclick = async () => {

    const name = playerName.value.trim();

    if (!name) {

        alert("Informe o nome do jogador.");

        return;

    }

    addPlayerBtn.disabled = true;

    if (editingId) {

        // modo edição
        addPlayerBtn.textContent = "Salvando...";

        const ok = await updatePlayerDB(
            editingId,
            name,
            Number(playerLevel.value),
            goalkeeper.checked
        );

        addPlayerBtn.disabled = false;
        addPlayerBtn.textContent = "➕ Adicionar Jogador";
        addPlayerBtn.classList.remove("editing");

        if (!ok) return;

        editingId = null;

    } else {

        // modo adição
        addPlayerBtn.textContent = "Salvando...";

        const ok = await addPlayerDB(
            name,
            Number(playerLevel.value),
            goalkeeper.checked
        );

        addPlayerBtn.disabled = false;
        addPlayerBtn.textContent = "➕ Adicionar Jogador";

        if (!ok) return;

    }

    playerName.value = "";
    playerLevel.value = "3";
    goalkeeper.checked = false;

    await loadScreen();

};

// ==========================================

drawTeamsBtn.onclick = async () => {

    const activePlayers = players.filter(p => p.active);

    const teams = sortTeams(

        activePlayers,

        Number(playersPerTeam.value)

    );

    if (teams) {

        drawTeamsBtn.disabled = true;
        drawTeamsBtn.textContent = "Sorteando...";

        await saveDrawDB(teams);

        drawTeamsBtn.disabled = false;
        drawTeamsBtn.textContent = "🎲 Sortear Equipes";

        const draw = await getLastDrawDB();
        const timestamp = draw
            ? new Date(draw.created_at).toLocaleString("pt-BR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })
            : null;

        renderResult(teams, timestamp);

    }

};

copyResultBtn.onclick = () => {

    copyResult();

};

// ==========================================

loadScreen();

// Restaura último sorteio do banco de dados
getLastDrawDB().then(draw => {
    if (draw) {
        const timestamp = new Date(draw.created_at).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
        renderResult(draw.teams, timestamp);
    }
});
