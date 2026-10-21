import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { validateRegistration, validateLogin } from '../validations/auth.validation.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validate(validateRegistration), register);
router.post('/login', validate(validateLogin), login);
router.get('/profile', protect, getProfile);

export default router;
