// ===============================
// BALANÇADA
// Módulo 1
// Cadastro de jogadores
// ===============================

const players = JSON.parse(localStorage.getItem("balancada_players") || "[]");

const playerList = document.getElementById("playerList");

const addPlayerBtn = document.getElementById("addPlayer");

const playerName = document.getElementById("playerName");

const playerLevel = document.getElementById("playerLevel");

const goalkeeper = document.getElementById("goalkeeper");

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

addPlayerBtn.addEventListener("click", addPlayer);

renderPlayers();
