import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import menuRoutes from './menu.routes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/menu', menuRoutes);

export default router;
