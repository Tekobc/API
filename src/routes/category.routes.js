import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createNewCategory,
  updateExistingCategory,
  deleteExistingCategory
} from '../controllers/category.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateCategory } from '../validations/category.validation.js';
import { protect } from '../middlewares/auth.middleware.js';
import { role } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, role('admin'), validate(validateCategory), createNewCategory);
router.put('/:id', protect, role('admin'), validate(validateCategory), updateExistingCategory);
router.delete('/:id', protect, role('admin'), deleteExistingCategory);

export default router;
