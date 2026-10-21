import { Router } from 'express';
import { getMenu, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateMenuItem } from '../validations/menu.validation.js';
import { protect, role } from '../middlewares/auth.middleware.js';

const router = Router();

// Public endpoints
router.get('/', getMenu);
router.get('/:id', getMenuItem);

// Protected routes (admin only – role check could be added later)
router.post('/', protect, role('admin'), validate(validateMenuItem), createMenuItem);
router.put('/:id', protect, role('admin'), validate(validateMenuItem), updateMenuItem);
router.delete('/:id', protect, role('admin'), deleteMenuItem);

export default router;
