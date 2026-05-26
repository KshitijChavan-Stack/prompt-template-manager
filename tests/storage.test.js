import fs from 'fs';
import os from 'os';
import path from 'path';
import { createApp } from '../src/app.js';
import { getDbPath, readDb, writeDb } from '../src/storage/storage.js';

describe('storage', () => {
  let tempDbPath;

  beforeEach(() => {
    tempDbPath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'ptm-storage-')),
      'db.json',
    );
  });

  afterEach(() => {
    const dir = path.dirname(tempDbPath);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  describe('readDb / writeDb', () => {
    beforeEach(() => {
      createApp({ dbPath: tempDbPath });
    });

    it('returns empty templates when the file does not exist', () => {
      expect(readDb()).toEqual({ templates: [] });
    });

    it('round-trips data through writeDb and readDb', () => {
      const data = {
        templates: [
          {
            id: 'test-id',
            name: 'Sample',
            tags: ['demo'],
            variables: [],
            currentVersion: 1,
            createdAt: '2026-05-26T00:00:00.000Z',
            versions: [{ version: 1, content: 'hello', createdAt: '2026-05-26T00:00:00.000Z' }],
          },
        ],
      };

      writeDb(data);
      expect(readDb()).toEqual(data);
    });

    it('returns empty templates when the file is empty', () => {
      fs.writeFileSync(tempDbPath, '', 'utf-8');
      expect(readDb()).toEqual({ templates: [] });
    });
  });

  describe('createApp dbPath injection', () => {
    it('sets storage to use the injected temp db path', () => {
      const app = createApp({ dbPath: tempDbPath });

      expect(app.locals.dbPath).toBe(tempDbPath);
      expect(getDbPath()).toBe(tempDbPath);

      writeDb({ templates: [{ id: 'injected' }] });
      expect(readDb().templates[0].id).toBe('injected');

      const realDbPath = path.resolve(process.cwd(), 'db.json');
      expect(tempDbPath).not.toBe(realDbPath);
      if (fs.existsSync(realDbPath)) {
        const realDb = JSON.parse(fs.readFileSync(realDbPath, 'utf-8'));
        expect(realDb.templates).toEqual([]);
      }
    });
  });
});
