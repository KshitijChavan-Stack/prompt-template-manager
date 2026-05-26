import { randomUUID } from 'crypto';
import { readDb, writeDb } from '../storage/storage.js';

export class ValidationError extends Error {
  constructor(message = 'missing required fields') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

function isMissing(value) {
  return value === undefined || value === null || value === '';
}

export function createTemplate({ name, content, tags, variables }) {
  if (isMissing(name) || isMissing(content)) {
    throw new ValidationError();
  }

  const now = new Date().toISOString();
  const template = {
    id: randomUUID(),
    name,
    tags: tags ?? [],
    variables: variables ?? [],
    currentVersion: 1,
    createdAt: now,
    versions: [
      {
        version: 1,
        content,
        createdAt: now,
      },
    ],
  };

  const db = readDb();
  db.templates.push(template);
  writeDb(db);

  return template;
}

export function listTemplates({ tag, name } = {}) {
  const { templates } = readDb();

  return templates.filter((template) => {
    if (tag != null && tag !== '' && !template.tags.includes(tag)) {
      return false;
    }

    if (
      name != null &&
      name !== '' &&
      !template.name.toLowerCase().includes(name.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}
