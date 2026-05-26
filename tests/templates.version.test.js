import fs from 'fs';
import os from 'os';
import path from 'path';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('GET /templates/:id/versions/:version', () => {
  let app;
  let tempDbPath;

  beforeEach(() => {
    tempDbPath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'ptm-version-')),
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

  it('returns 200 with the correct content for a valid id and version', async () => {
    const created = await request(app).post('/templates').send({
      name: 'Code review',
      content: 'review v1 content',
    });

    await request(app)
      .patch(`/templates/${created.body.id}`)
      .send({ content: 'review v2 content' });

    const res = await request(app).get(
      `/templates/${created.body.id}/versions/1`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      name: 'Code review',
      version: 1,
      content: 'review v1 content',
      currentVersion: 2,
    });
    expect(res.body.versionCreatedAt).toBeDefined();
  });

  it('returns 404 when the version does not exist', async () => {
    const created = await request(app).post('/templates').send({
      name: 'Code review',
      content: 'review v1 content',
    });

    const res = await request(app).get(
      `/templates/${created.body.id}/versions/99`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'version not found' });
  });

  it('returns 404 when the template id does not exist', async () => {
    const res = await request(app).get(
      '/templates/00000000-0000-0000-0000-000000000000/versions/1',
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'template not found' });
  });
});
