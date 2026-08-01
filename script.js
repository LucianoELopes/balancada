// ===============================
// BALANÇADA
// script.js
// Cadastro + Integração
// ===============================

const players = JSON.parse(
    localStorage.getItem("balancada_players") || "[]"
);

const playerList = document.getElementById("playerList");
const addPlayerBtn = document.getElementById("addPlayer");
const drawTeamsBtn = document.getElementById("drawTeams");
const copyResultBtn = document.getElementById("copyResult");

const playerName = document.getElementById("playerName");
const playerLevel = document.getElementById("playerLevel");
const goalkeeper = document.getElementById("goalkeeper");
const playersPerTeam = document.getElementById("playersPerTeam");

function savePlayers() {

    localStorage.setItem(
        "balancada_players",
        JSON.stringify(players)
    );

}

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

    players.forEach((player, index) => {

        const div = document.createElement("div");

        div.className = "player";

        div.innerHTML = `

            <div>

                ${player.goalkeeper ? "🥅 " : ""}

                <strong>${player.name}</strong><br>

                ⭐ ${player.level}

            </div>

            <button onclick="removePlayer(${index})">

                ❌

            </button>

        `;

        playerList.appendChild(div);

    });

}

function addPlayer() {

    const name = playerName.value.trim();

    if (!name) {

        alert("Informe o nome do jogador.");

        return;

    }

    players.push({

        name,

        level: Number(playerLevel.value),

        goalkeeper: goalkeeper.checked

    });

    savePlayers();

    renderPlayers();

    playerName.value = "";

    playerLevel.value = "3";

    goalkeeper.checked = false;

    playerName.focus();

}

function removePlayer(index) {

    players.splice(index, 1);

    savePlayers();

    renderPlayers();

}

// ===============================
// Integração do sorteio
// ===============================

drawTeamsBtn.addEventListener("click", () => {

    const qtd = Number(playersPerTeam.value);

    const teams = sortTeams(players, qtd);

    if (!teams) return;

    renderResult(teams);

});

copyResultBtn.addEventListener("click", () => {

    copyResult();

});

// ===============================

addPlayerBtn.addEventListener("click", addPlayer);

renderPlayers();
