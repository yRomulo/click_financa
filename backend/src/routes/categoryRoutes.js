// Rotas de categorias
const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validate');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas exigem autenticação
router.use(authenticateToken);

// Criar categoria
router.post('/', validateCategory, createCategory);

// Listar categorias (com filtro opcional por tipo)
router.get('/', getCategories);

// Atualizar e deletar categoria
router.put('/:id', validateCategory, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

