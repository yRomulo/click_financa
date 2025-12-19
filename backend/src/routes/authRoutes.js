// Rotas de autenticação
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { authenticateToken } = require('../middleware/auth');

// Registro e login (públicos)
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Obter dados do usuário autenticado
router.get('/me', authenticateToken, getMe);

module.exports = router;

