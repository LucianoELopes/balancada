// ===============================
// BALANÇADA
// draw.js
// Responsável pelo sorteio
// ===============================

function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function teamScore(team) {
    return team.reduce((sum, player) => sum + player.level, 0);
}

function sortTeams(players, playersPerTeam) {

    const teamCount = Math.floor(players.length / playersPerTeam);

    if (teamCount < 2) {

        alert("São necessários jogadores suficientes para formar pelo menos duas equipes.");

        return null;
    }

    let bestTeams = null;
    let bestDifference = Number.MAX_SAFE_INTEGER;

    for (let attempt = 0; attempt < 500; attempt++) {

        const goalkeepers = shuffle(
            players.filter(p => p.goalkeeper)
        );

        const fieldPlayers = shuffle(
            players.filter(p => !p.goalkeeper)
        ).sort((a, b) => b.level - a.level);

        const teams = [];

        for (let i = 0; i < teamCount; i++) {

            teams.push({
                players: [],
                reserves: []
            });

        }

        // Distribui goleiros

        goalkeepers.forEach((gk, index) => {

            if (index < teamCount) {

                teams[index].players.push(gk);

            }

        });

        // Distribui jogadores

        fieldPlayers.forEach(player => {

            const available = teams
                .filter(t => t.players.length < playersPerTeam)
                .sort((a, b) =>
                    teamScore(a.players) - teamScore(b.players)
                );

            if (available.length) {

                available[0].players.push(player);

            }

        });

        // Descobre reservas

        const used = teams.flatMap(t => t.players);

        const reserves = players.filter(
            p => !used.includes(p)
        );

        reserves.forEach((player, index) => {

            teams[index % teamCount].reserves.push(player);

        });

        const scores = teams.map(t =>
            teamScore(t.players)
        );

        const diff =
            Math.max(...scores) -
            Math.min(...scores);

        if (diff < bestDifference) {

            bestDifference = diff;

            bestTeams = teams;

        }

    }

    return bestTeams;

}
