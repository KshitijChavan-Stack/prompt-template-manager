import fs from 'fs';
import os from 'os';
import path from 'path';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('PATCH /templates/:id', () => {
  let app;
  let tempDbPath;

  beforeEach(() => {
    tempDbPath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'ptm-update-')),
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

  it('creates a new version and keeps the old version in the array', async () => {
    const created = await request(app).post('/templates').send({
      name: 'Code review',
      content: 'review v1 content',
      tags: ['review'],
      variables: [{ name: 'context' }],
    });

    const originalContent = created.body.versions[0].content;

    const res = await request(app)
      .patch(`/templates/${created.body.id}`)
      .send({
        content: 'review v2 content',
        tags: ['review', 'updated'],
        variables: [{ name: 'context' }, { name: 'language', default: 'js' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.currentVersion).toBe(2);
    expect(res.body.content).toBe('review v2 content');
    expect(res.body.tags).toEqual(['review', 'updated']);
    expect(res.body.variables).toEqual([
      { name: 'context' },
      { name: 'language', default: 'js' },
    ]);
    expect(res.body.versions).toHaveLength(2);
    expect(res.body.versions[0]).toMatchObject({
      version: 1,
      content: originalContent,
    });
    expect(res.body.versions[1]).toMatchObject({
      version: 2,
      content: 'review v2 content',
    });
  });

  it('returns 404 when the template id does not exist', async () => {
    const res = await request(app)
      .patch('/templates/00000000-0000-0000-0000-000000000000')
      .send({ content: 'updated content' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'template not found' });
  });
});
