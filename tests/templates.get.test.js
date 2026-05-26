import fs from 'fs';
import os from 'os';
import path from 'path';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('GET /templates/:id', () => {
  let app;
  let tempDbPath;

  beforeEach(() => {
    tempDbPath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'ptm-get-')),
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

  it('returns 200 with latest version content at top level', async () => {
    const created = await request(app).post('/templates').send({
      name: 'Code review',
      content: 'review {{language}} code for {{context}}',
      tags: ['review'],
    });

    const res = await request(app).get(`/templates/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.content).toBe(
      'review {{language}} code for {{context}}',
    );
    expect(res.body.currentVersion).toBe(1);
    expect(res.body.versions[0].content).toBe(res.body.content);
  });

  it('returns 404 when the template id does not exist', async () => {
    const res = await request(app).get(
      '/templates/00000000-0000-0000-0000-000000000000',
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'template not found' });
  });
});
