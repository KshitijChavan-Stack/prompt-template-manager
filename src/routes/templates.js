import { Router } from 'express';
import {
  createTemplate,
  getTemplateById,
  getTemplateVersion,
  listTemplates,
  NotFoundError,
  updateTemplate,
  ValidationError,
  VersionNotFoundError,
  renderTemplate
} from '../services/templateService.js';

const router = Router();

router.get('/', (req, res) => {
  const { tag, name } = req.query;
  const templates = listTemplates({ tag, name });
  res.status(200).json(templates);
});

router.get('/:id/versions/:version', (req, res) => {
  try {
    const result = getTemplateVersion(req.params.id, req.params.version);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof VersionNotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    throw err;
  }
});

router.get('/:id', (req, res) => {
  try {
    const template = getTemplateById(req.params.id);
    res.status(200).json(template);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    throw err;
  }
});

router.post('/', (req, res) => {
  try {
    const { name, content, tags, variables } = req.body;
    const template = createTemplate({ name, content, tags, variables });
    res.status(201).json(template);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }
});

router.patch('/:id', (req, res) => {
  try {
    const { content, tags, variables } = req.body;
    const template = updateTemplate(req.params.id, {
      content,
      tags,
      variables,
    });
    res.status(200).json(template);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    throw err;
  }
});

export default router;




router.post('/:id/render', (req, res) => {
  try {
    const result = renderTemplate(req.params.id, req.body.variables ?? {});
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    throw err;
  }
});