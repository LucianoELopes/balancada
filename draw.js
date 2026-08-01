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

function teamScore(players) {
    return players.reduce((sum, p) => sum + p.level, 0);
}

function sortTeams(players, playersPerTeam) {

    const teamCount = Math.floor(players.length / playersPerTeam);

    if (teamCount < 2) {
        alert("São necessários jogadores suficientes para formar pelo menos duas equipes.");
        return null;
    }

    let bestTeams = null;
    let bestDiff = Number.MAX_SAFE_INTEGER;

    for (let attempt = 0; attempt < 1000; attempt++) {

        // Separa goleiros e jogadores de linha
        const goalkeepers  = shuffle(players.filter(p => p.goalkeeper));
        const fieldPlayers = shuffle(players.filter(p => !p.goalkeeper));

        const teams = Array.from({ length: teamCount }, () => ({
            players: [],
            reserves: []
        }));

        // ── 1. Distribui no máximo 1 goleiro por time ──────────────────
        // Os primeiros N goleiros (N = teamCount) vão um por time.
        // Goleiros excedentes entram na fila de linha.
        const extraGoalkeepers = [];

        goalkeepers.forEach((gk, i) => {
            if (i < teamCount) {
                teams[i].players.push(gk);
            } else {
                extraGoalkeepers.push(gk);
            }
        });

        // ── 2. Junta linha + goleiros excedentes e ordena por nível ────
        const remaining = [...fieldPlayers, ...extraGoalkeepers]
            .sort((a, b) => b.level - a.level);

        // ── 3. Preenche os times até playersPerTeam (snake draft) ──────
        remaining.forEach(player => {
            // Times que ainda têm vaga, ordenados pelo menor score atual
            const available = teams
                .filter(t => t.players.length < playersPerTeam)
                .sort((a, b) => teamScore(a.players) - teamScore(b.players));

            if (available.length > 0) {
                available[0].players.push(player);
            }
        });

        // ── 4. Jogadores que sobraram viram reservas ───────────────────
        // Distribuição: um por time em round-robin para ficar equilibrado.
        const usedIds = new Set(teams.flatMap(t => t.players).map(p => p.id));
        const reserves = players.filter(p => !usedIds.has(p.id));

        reserves.forEach((player, i) => {
            teams[i % teamCount].reserves.push(player);
        });

        // ── 5. Avalia qualidade desta distribuição ─────────────────────
        const scores = teams.map(t => teamScore(t.players));
        const diff = Math.max(...scores) - Math.min(...scores);

        if (diff < bestDiff) {
            bestDiff = diff;
            bestTeams = teams;
            if (diff === 0) break; // perfeito, não precisa mais tentar
        }
    }

    return bestTeams;
}
