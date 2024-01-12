import fs from 'fs/promises';
import { expect, test } from 'vitest';

test('gets all json match files', async () => {
    const getMissingMatchIds = async () => {
        const content = await fs.readFile(`./data/${2023}/rounds.json`, 'utf-8');
        const rounds = JSON.parse(content);
    
        let matchIds: number[] = [];
        for (const round of rounds) {
            for (const match of round.matches) {
                matchIds.push(match.id);
            }
        }
    
        const dirEntries = await fs.readdir(`./data/${2023}/matches`, { withFileTypes: true });
        const onlyFileEntries = dirEntries.filter(entry => entry.isFile()).map(entry => parseInt(entry.name.split('.json')[0]));
        const fileSet = new Set(onlyFileEntries);
        const missingMatchIds = matchIds.filter(matchId => !fileSet.has(matchId));

        return missingMatchIds;
    }

    const missingMatchIds = await getMissingMatchIds();
    expect(missingMatchIds.length).toBe(0);
});

test('all match files are valid json', async () => {
    const parseJson = async () => {
        const dirEntries = await fs.readdir(`./data/${2023}/matches`, { withFileTypes: true });
        const onlyFileEntries = dirEntries.filter(entry => entry.isFile()).map(entry => entry.name);
        for (const file of onlyFileEntries) {
            const content = await fs.readFile(`./data/${2023}/matches/${file}`, 'utf-8');
            JSON.parse(content);
        }
    }

    await expect(parseJson()).resolves.not.toThrowError();
});

test('gets all json totw files', async () => {
    const content = await fs.readFile(`./data/${2023}/rounds.json`, 'utf-8');
    const rounds = JSON.parse(content);

    const dirEntries = await fs.readdir(`./data/${2023}/totw`, { withFileTypes: true });
    const onlyFileEntries = dirEntries.filter(entry => entry.isFile());
    
    expect(onlyFileEntries.length).toEqual(rounds.length);
});

test('all totw files are valid json', async () => {
    const parseJson = async () => {
        const dirEntries = await fs.readdir(`./data/${2023}/totw`, { withFileTypes: true });
        const onlyFileEntries = dirEntries.filter(entry => entry.isFile()).map(entry => entry.name);
        for (const file of onlyFileEntries) {
            const content = await fs.readFile(`./data/${2023}/totw/${file}`, 'utf-8');
            JSON.parse(content);
        }
    }

    await expect(parseJson()).resolves.not.toThrowError();
});