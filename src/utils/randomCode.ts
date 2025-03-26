import fs from 'fs';
import path from 'path';

const jsonPath = path.join(__dirname, '../words.json');
const palabrasJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

export function generateConfirmationCode(): string {
    const palabras: string[] = palabrasJson.palabras;
    const palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
    return palabraAleatoria;
}
