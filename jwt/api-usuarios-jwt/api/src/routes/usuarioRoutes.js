const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const { verificarAuth } = require('../middlewares/authMiddleware');

router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);

router.get('/perfil', verificarAuth, usuarioController.perfil);

module.exports = router;
