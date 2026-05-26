import fs from 'fs';
import os from 'os';
import path from 'path';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('GET /templates', () => {
  let app;
  let tempDbPath;

  beforeEach(() => {
    tempDbPath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'ptm-list-')),
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

  async function seedTemplates() {
    await request(app).post('/templates').send({
      name: 'Code Review Prompt',
      content: 'review code',
      tags: ['review', 'code'],
    });
    await request(app).post('/templates').send({
      name: 'Email Draft',
      content: 'draft email',
      tags: ['email'],
    });
    await request(app).post('/templates').send({
      name: 'Meeting Summary',
      content: 'summarize meeting',
      tags: ['review'],
    });
  }

  it('returns all templates when no filters are provided', async () => {
    await seedTemplates();

    const res = await request(app).get('/templates');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body.map((t) => t.name).sort()).toEqual([
      'Code Review Prompt',
      'Email Draft',
      'Meeting Summary',
    ]);
  });

  it('returns a subset when filtering by tag', async () => {
    await seedTemplates();

    const res = await request(app).get('/templates').query({ tag: 'review' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((t) => t.tags.includes('review'))).toBe(true);
    expect(res.body.map((t) => t.name).sort()).toEqual([
      'Code Review Prompt',
      'Meeting Summary',
    ]);
  });

  it('returns a subset when filtering by name (case-insensitive substring)', async () => {
    await seedTemplates();

    const res = await request(app).get('/templates').query({ name: 'email' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Email Draft');
  });

  it('returns an empty array when no templates match', async () => {
    await seedTemplates();

    const res = await request(app).get('/templates').query({ tag: 'nonexistent' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
