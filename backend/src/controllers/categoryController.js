// Controller de categorias
const pool = require('../config/database');

// Criar nova categoria
const createCategory = async (req, res) => {
  try {
    const { name, type, color } = req.body;
    const userId = req.user.id;

    // Verificar se categoria já existe para o usuário
    const existing = await pool.query(
      'SELECT id FROM categories WHERE user_id = $1 AND name = $2 AND type = $3',
      [userId, name, type]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Categoria já existe' });
    }

    // Criar categoria
    const result = await pool.query(
      'INSERT INTO categories (user_id, name, type, color) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, type, color || '#6366f1']
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
};

// Listar categorias do usuário
const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    let query = 'SELECT * FROM categories WHERE user_id = $1';
    const params = [userId];

    if (type) {
      query += ' AND type = $2';
      params.push(type);
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

// Atualizar categoria
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const userId = req.user.id;

    // Verificar se categoria pertence ao usuário
    const checkResult = await pool.query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Atualizar categoria
    const result = await pool.query(
      'UPDATE categories SET name = $1, color = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, color, id, userId]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

// Deletar categoria
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json({ message: 'Categoria deletada com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

