// Rotas de relatórios
const express = require('express');
const router = express.Router();
const { getMonthlyReport, exportCSV } = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas exigem autenticação
router.use(authenticateToken);

// Relatório mensal
router.get('/monthly', getMonthlyReport);

// Exportar CSV
router.get('/export/csv', exportCSV);

module.exports = router;

