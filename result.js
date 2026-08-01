// ===============================
// BALANÇADA
// result.js
// Exibe o resultado do sorteio
// ===============================

function renderResult(teams) {

    const result = document.getElementById("result");

    if (!teams) {
        return;
    }

    let html = "";

    teams.forEach((team, index) => {

        const total = team.players.reduce(
            (sum, p) => sum + p.level,
            0
        );

        html += `
            <div class="team">

                <h3>🏆 Equipe ${index + 1}</h3>
        `;

        team.players.forEach(player => {

            html += `
                <p>
                    ${player.goalkeeper ? "🥅" : ""}
                    ${player.name}
                    ⭐${player.level}
                </p>
            `;

        });

        html += `
            <p class="total">
                Total: ${total}
            </p>
        `;

        if (team.reserves.length) {

            html += `
                <div class="reserve">

                    <strong>🪑 Reservas</strong>
            `;

            team.reserves.forEach(player => {

                html += `
                    <p>
                        ${player.goalkeeper ? "🥅" : ""}
                        ${player.name}
                        ⭐${player.level}
                    </p>
                `;

            });

            html += `</div>`;

        }

        html += `</div>`;

    });

    result.innerHTML = html;

}

function copyResult() {

    const texto = document
        .getElementById("result")
        .innerText;

    navigator.clipboard.writeText(texto);

    alert("Resultado copiado!");

}
