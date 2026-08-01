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

    players.forEach(player => {

        const div = document.createElement("div");

        div.className = "player";

        div.innerHTML = `
            <div class="player-info">
                ${player.goalkeeper ? "🥅 " : ""}
                <strong>${player.name}</strong>
                <span>⭐ ${player.level}</span>
            </div>

            <div class="player-actions">
                <button class="btn-edit" data-id="${player.id}" title="Editar">✏️</button>
                <button class="btn-delete" data-id="${player.id}" title="Excluir">🗑️</button>
            </div>
        `;

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

    if (editingId) {

        // modo edição
        const ok = await updatePlayerDB(
            editingId,
            name,
            Number(playerLevel.value),
            goalkeeper.checked
        );

        addPlayerBtn.disabled = false;

        if (!ok) return;

        editingId = null;
        addPlayerBtn.textContent = "➕ Adicionar Jogador";
        addPlayerBtn.classList.remove("editing");

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
