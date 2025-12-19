// Rotas de transações
const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validate');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas exigem autenticação
router.use(authenticateToken);

// Criar transação
router.post('/', validateTransaction, createTransaction);

// Listar transações (com filtros opcionais)
router.get('/', getTransactions);

// Obter resumo financeiro
router.get('/summary', getSummary);

// Obter, atualizar e deletar transação específica
router.get('/:id', getTransactionById);
router.put('/:id', validateTransaction, updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;

