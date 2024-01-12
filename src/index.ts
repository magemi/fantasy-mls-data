import fs from 'fs/promises';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchTeamOfTheWeek(season: number) {
    await fs.mkdir(`data/${season}/totw`).catch(console.error)
    const content = await fs.readFile(`./data/${season}/rounds.json`, 'utf-8');
    const rounds = JSON.parse(content);
    for (const round of rounds) {
        try {
            const response = await fetch(`https://fgp-data-us.s3.us-east-1.amazonaws.com/json/mls_mls/team_of_week/${round.id}.json`);
            const teamOfTheWeek = await response.json();
            fs.writeFile(`./data/${season}/totw/${round.id}.json`, JSON.stringify(teamOfTheWeek, null, 4), 'utf-8');
            await sleep(1000);
        } catch (error: any) {
            console.error(error.message);
        }
    }
}

async function fetchMatchStats(season: number) {
    await fs.mkdir(`data/${season}/matches`).catch(console.error)
    const content = await fs.readFile(`./data/${season}/rounds.json`, 'utf-8');
    const rounds = JSON.parse(content);
    for (const round of rounds) {
        for (const match of round.matches) {
            try {
                const response = await fetch(`https://fgp-data-us.s3.us-east-1.amazonaws.com/json/mls_mls/stats/${match.id}.json`);
                const matchStats = await response.json();
                fs.writeFile(`./data/${season}/matches/${match.id}.json`, JSON.stringify(matchStats, null, 4), 'utf-8');
                await sleep(1000);
            } catch (error: any) {
                console.error(error.message);
            }
        }
    }
}

//await fetchTeamOfTheWeek(2023);
await fetchMatchStats(2023);