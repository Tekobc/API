import { Router } from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateCategory } from '../validations/category.validation.js';
import { protect, role } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, role('admin'), validate(validateCategory), createCategory);
router.put('/:id', protect, role('admin'), validate(validateCategory), updateCategory);
router.delete('/:id', protect, role('admin'), deleteCategory);

export default router;
