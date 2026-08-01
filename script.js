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

function openEditModal(player) {

    editingId = player.id;

    document.getElementById("editName").value = player.name;
    document.getElementById("editLevel").value = player.level;
    document.getElementById("editGoalkeeper").checked = player.goalkeeper;

    document.getElementById("editModal").classList.add("open");

}

function closeEditModal() {

    editingId = null;

    document.getElementById("editModal").classList.remove("open");

}

document.getElementById("editSave").onclick = async () => {

    const name = document.getElementById("editName").value.trim();

    if (!name) {
        alert("Informe o nome.");
        return;
    }

    const btn = document.getElementById("editSave");
    btn.disabled = true;
    btn.textContent = "Salvando...";

    const ok = await updatePlayerDB(
        editingId,
        name,
        Number(document.getElementById("editLevel").value),
        document.getElementById("editGoalkeeper").checked
    );

    btn.disabled = false;
    btn.textContent = "💾 Salvar";

    if (!ok) return;

    closeEditModal();
    await loadScreen();

};

document.getElementById("editCancel").onclick = () => closeEditModal();

document.getElementById("editModal").onclick = (e) => {
    if (e.target === document.getElementById("editModal")) closeEditModal();
};

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

    players.forEach(player => {

        const div = document.createElement("div");

        div.className = "player";

        div.innerHTML = `
            <div>
                ${player.goalkeeper ? "🥅 " : ""}
                <strong>${player.name}</strong><br>
                ⭐ ${player.level}
            </div>

            <div class="player-actions">
                <button class="btn-edit" data-id="${player.id}">✏️</button>
                <button class="btn-delete" data-id="${player.id}">🗑️</button>
            </div>
        `;

        div.querySelector(".btn-edit").onclick = () => openEditModal(player);

        div.querySelector(".btn-delete").onclick = async () => {

            const ok = await deletePlayerDB(player.id);

            if (ok) {

                await loadScreen();

            }

        };

        playerList.appendChild(div);

    });

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
    addPlayerBtn.textContent = "Salvando...";

    const ok = await addPlayerDB(

        name,

        Number(playerLevel.value),

        goalkeeper.checked

    );

    addPlayerBtn.disabled = false;
    addPlayerBtn.textContent = "➕ Adicionar Jogador";

    if (!ok) return;

    playerName.value = "";
    playerLevel.value = "3";
    goalkeeper.checked = false;

    await loadScreen();

};

// ==========================================

drawTeamsBtn.onclick = () => {

    const teams = sortTeams(

        players,

        Number(playersPerTeam.value)

    );

    if (teams) {

        renderResult(teams);

    }

};

copyResultBtn.onclick = () => {

    copyResult();

};

// ==========================================

loadScreen();
