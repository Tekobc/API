import { Router } from 'express';
import {
  getTables,
  getTable,
  createNewTable,
  updateTable,
  deleteTableById,
} from '../controllers/table.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateTable } from '../validations/table.validation.js';
import { protect, role } from '../middlewares/auth.middleware.js';

const router = Router();

// Public endpoints
router.get('/', getTables);
router.get('/:id', getTable);

// Protected admin routes
router.post('/', protect, role('admin'), validate(validateTable), createNewTable);
router.put('/:id', protect, role('admin'), validate(validateTable), updateTable);
router.delete('/:id', protect, role('admin'), deleteTableById);

export default router;
