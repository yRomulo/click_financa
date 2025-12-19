// Controller de transações financeiras
const pool = require('../config/database');

// Criar nova transação
const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, date, category_id } = req.body;
    const userId = req.user.id;

    // Inserir transação
    const result = await pool.query(
      `INSERT INTO transactions (user_id, category_id, description, amount, type, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, category_id || null, description, amount, type, date]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
};

// Listar transações do usuário (com filtros)
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, type, category_id, limit = 100, offset = 0 } = req.query;

    // Construir query dinâmica com filtros
    let query = 'SELECT t.*, c.name as category_name, c.color as category_color FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (startDate) {
      query += ` AND t.date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND t.date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    if (type) {
      query += ` AND t.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (category_id) {
      query += ` AND t.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }

    query += ` ORDER BY t.date DESC, t.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json(result.rows);

  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
};

// Obter transação por ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT t.*, c.name as category_name, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.id = $1 AND t.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro ao buscar transação' });
  }
};

// Atualizar transação
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, date, category_id } = req.body;
    const userId = req.user.id;

    // Verificar se transação pertence ao usuário
    const checkResult = await pool.query(
      'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    // Atualizar transação
    const result = await pool.query(
      `UPDATE transactions 
       SET description = $1, amount = $2, type = $3, date = $4, category_id = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [description, amount, type, date, category_id || null, id, userId]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
};

// Deletar transação
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json({ message: 'Transação deletada com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
};

// Obter resumo financeiro (saldo, total de receitas, despesas)
const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let dateFilter = 'WHERE user_id = $1';
    const params = [userId];

    if (startDate && endDate) {
      dateFilter += ' AND date >= $2 AND date <= $3';
      params.push(startDate, endDate);
    }

    // Calcular totais por tipo
    const incomeResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM transactions 
       ${dateFilter} AND type = 'income'`,
      params
    );

    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM transactions 
       ${dateFilter} AND type = 'expense'`,
      params
    );

    const totalIncome = parseFloat(incomeResult.rows[0].total);
    const totalExpense = parseFloat(expenseResult.rows[0].total);
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
    });

  } catch (error) {
    console.error('Erro ao calcular resumo:', error);
    res.status(500).json({ error: 'Erro ao calcular resumo financeiro' });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
};

