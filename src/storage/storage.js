import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.resolve(__dirname, '../../db.json');

let dbPath = process.env.DB_PATH || DEFAULT_DB_PATH;

export function getDbPath() {
  return dbPath;
}

export function setDbPath(newPath) {
  dbPath = newPath;
}

export function readDb() {
  if (!fs.existsSync(dbPath)) {
    return { templates: [] };
  }

  const raw = fs.readFileSync(dbPath, 'utf-8').trim();
  if (!raw) {
    return { templates: [] };
  }

  return JSON.parse(raw);
}

export function writeDb(data) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(dbPath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}
