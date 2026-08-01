// ===============================
// BALANÇADA
// Cadastro de jogadores
// ===============================

let players = [];

const playerList = document.getElementById("playerList");
const addPlayerBtn = document.getElementById("addPlayer");
const drawTeamsBtn = document.getElementById("drawTeams");
const copyResultBtn = document.getElementById("copyResult");

const playerName = document.getElementById("playerName");
const playerLevel = document.getElementById("playerLevel");
const goalkeeper = document.getElementById("goalkeeper");
const playersPerTeam = document.getElementById("playersPerTeam");

// ===============================

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

    players.forEach((player) => {

        const div = document.createElement("div");

        div.className = "player";

        div.innerHTML = `

            <div>

                ${player.goalkeeper ? "🥅 " : ""}

                <strong>${player.name}</strong><br>

                ⭐ ${player.level}

            </div>

            <button onclick="removePlayer(${player.id})">

                ❌

            </button>

        `;

        playerList.appendChild(div);

    });

}

// ===============================

async function refreshPlayers() {

    players = await loadPlayers();

    renderPlayers();

}

// ===============================

async function addPlayer() {

    const name = playerName.value.trim();

    if (!name) {

        alert("Informe o nome do jogador.");

        return;

    }

    await savePlayer({

        name,

        level: Number(playerLevel.value),

        goalkeeper: goalkeeper.checked

    });

    playerName.value = "";

    playerLevel.value = "3";

    goalkeeper.checked = false;

    playerName.focus();

    await refreshPlayers();

}

// ===============================

async function removePlayer(id) {

    await deletePlayer(id);

    await refreshPlayers();

}

// ===============================
// Sorteio
// ===============================

drawTeamsBtn.addEventListener("click", () => {

    const qtd = Number(playersPerTeam.value);

    const teams = sortTeams(players, qtd);

    if (!teams) return;

    renderResult(teams);

});

// ===============================

copyResultBtn.addEventListener("click", () => {

    copyResult();

});

// ===============================

addPlayerBtn.addEventListener("click", addPlayer);

refreshPlayers();
