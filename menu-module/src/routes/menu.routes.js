import { Router } from 'express';
import * as ctrl from '../controllers/menu.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js'; // ajustá al nombre real de tu middleware JWT
import { requireRole } from '../middlewares/role.middleware.js';   // requireRole('admin')
import { uploadImage } from '../middlewares/upload.middleware.js';

const router = Router();
const admin = [authenticate, requireRole('admin')];

// Públicas: cualquiera puede ver la carta
router.get('/items', ctrl.list);
router.get('/items/:id', ctrl.getOne);

// Solo admin: modifican la carta
router.post('/items', ...admin, ctrl.create);
router.put('/items/:id', ...admin, ctrl.update);
router.delete('/items/:id', ...admin, ctrl.remove);
router.post('/items/:id/upload-image', ...admin, uploadImage, ctrl.uploadImage);

export default router;
