import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import templatesRouter from './routes/templates.js';
import { setDbPath } from './storage/storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.resolve(__dirname, '../db.json');

export function createApp(options = {}) {
  const resolvedDbPath =
    options.dbPath ?? process.env.DB_PATH ?? DEFAULT_DB_PATH;
  setDbPath(resolvedDbPath);

  const app = express();

  app.locals.dbPath = resolvedDbPath;
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/templates', templatesRouter);

  return app;
}
