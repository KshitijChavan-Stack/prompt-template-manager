import { Router } from 'express';
import {
  createTemplate,
  listTemplates,
  ValidationError,
} from '../services/templateService.js';

const router = Router();

router.get('/', (req, res) => {
  const { tag, name } = req.query;
  const templates = listTemplates({ tag, name });
  res.status(200).json(templates);
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

export default router;
