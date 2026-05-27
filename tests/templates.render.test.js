import fs from 'fs';
import os from 'os';
import path from 'path';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('POST /templates/:id/render', () => {
  let app;
  let tempDbPath;
  let templateId;

  beforeEach(async () => {
    tempDbPath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'ptm-render-')),
      'db.json',
    );
    app = createApp({ dbPath: tempDbPath });

    const created = await request(app).post('/templates').send({
      name: 'Code Review',
      content: 'Review this {{language}} code for {{context}}',
      tags: ['review'],
      variables: [
        { name: 'language', default: 'JavaScript' },
        { name: 'context' },
      ],
    });
    templateId = created.body.id;
  });

  afterEach(() => {
    const dir = path.dirname(tempDbPath);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns 200 with rendered content when all variables provided', async () => {
    const res = await request(app)
      .post(`/templates/${templateId}/render`)
      .send({ variables: { language: 'Python', context: 'performance' } });

    expect(res.status).toBe(200);
    expect(res.body.rendered).toBe('Review this Python code for performance');
  });

  it('uses default value when variable not provided', async () => {
    const res = await request(app)
      .post(`/templates/${templateId}/render`)
      .send({ variables: { context: 'security' } });

    expect(res.status).toBe(200);
    expect(res.body.rendered).toBe('Review this JavaScript code for security');
  });

  it('ignores unknown variables silently', async () => {
    const res = await request(app)
      .post(`/templates/${templateId}/render`)
      .send({ variables: { language: 'Python', context: 'performance', extra: 'ignored' } });

    expect(res.status).toBe(200);
    expect(res.body.rendered).toBe('Review this Python code for performance');
  });

  it('returns 400 when required variable is missing', async () => {
    const res = await request(app)
      .post(`/templates/${templateId}/render`)
      .send({ variables: { language: 'Python' } });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing required variables: context');
  });

  it('returns 404 when template not found', async () => {
    const res = await request(app)
      .post('/templates/00000000-0000-0000-0000-000000000000/render')
      .send({ variables: {} });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'template not found' });
  });
});