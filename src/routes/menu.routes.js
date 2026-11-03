import { Router } from 'express';
import { getMenu, getMenuItem, createNewMenuItem, updateExistingMenuItem, deleteMenuItemById, uploadMenuImage } from '../controllers/menu.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateMenuItem } from '../validations/menu.validation.js';
import { protect } from '../middlewares/auth.middleware.js';
import { role } from '../middlewares/role.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';

const router = Router();

// Public endpoints
router.get('/items', getMenu);
router.get('/items/:id', getMenuItem);

// Protected routes (admin only)
router.post('/items', protect, role('admin'), validate(validateMenuItem), createNewMenuItem);
router.put('/items/:id', protect, role('admin'), validate((data) => validateMenuItem(data, true)), updateExistingMenuItem);
router.delete('/items/:id', protect, role('admin'), deleteMenuItemById);
router.post('/items/:id/upload-image', protect, role('admin'), uploadImage, uploadMenuImage);

export default router;
