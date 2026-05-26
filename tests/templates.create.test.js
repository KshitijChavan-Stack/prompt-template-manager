import fs from 'fs';
import os from 'os';
import path from 'path';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('POST /templates', () => {
  let app;
  let tempDbPath;

  beforeEach(() => {
    tempDbPath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'ptm-create-')),
      'db.json',
    );
    app = createApp({ dbPath: tempDbPath });
  });

  afterEach(() => {
    const dir = path.dirname(tempDbPath);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns 201 with version 1 for a valid request', async () => {
    const res = await request(app).post('/templates').send({
      name: 'Code review',
      content: 'review {{language}} code for {{context}}',
      tags: ['review'],
      variables: [
        { name: 'language', default: 'javascript' },
        { name: 'context' },
      ],
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'Code review',
      tags: ['review'],
      currentVersion: 1,
      variables: [
        { name: 'language', default: 'javascript' },
        { name: 'context' },
      ],
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.versions).toHaveLength(1);
    expect(res.body.versions[0]).toMatchObject({
      version: 1,
      content: 'review {{language}} code for {{context}}',
    });
    expect(res.body.versions[0].createdAt).toBeDefined();
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/templates').send({
      content: 'review {{language}} code',
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'missing required fields' });
  });
});
