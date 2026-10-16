import express from 'express';
import { registroApi } from '../controller/usuario.controller.js';

const router = express.Router();

router.post('/registro', registroApi);

export default router;