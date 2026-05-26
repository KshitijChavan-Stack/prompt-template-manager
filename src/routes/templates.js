import { Router } from 'express';
import {
  createTemplate,
  ValidationError,
} from '../services/templateService.js';

const router = Router();

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
