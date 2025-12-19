// Controller de relatórios e exportação
const pool = require('../config/database');

// Funções auxiliares para formatação de datas
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateBR = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getMonthName = (date) => {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return months[date.getMonth()];
};

const startOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Obter relatório mensal com dados agrupados
const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query;

    // Se não fornecido, usar mês atual
    const targetDate = year && month 
      ? new Date(parseInt(year), parseInt(month) - 1, 1)
      : new Date();

    const start = startOfMonth(targetDate);
    const end = endOfMonth(targetDate);

    // Transações do mês agrupadas por categoria
    const transactionsByCategory = await pool.query(
      `SELECT 
        c.id as category_id,
        c.name as category_name,
        c.color as category_color,
        t.type,
        SUM(t.amount) as total,
        COUNT(t.id) as count
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.date >= $2 AND t.date <= $3
       GROUP BY c.id, c.name, c.color, t.type
       ORDER BY total DESC`,
      [userId, formatDate(start), formatDate(end)]
    );

    // Transações por dia (para gráfico)
    const transactionsByDay = await pool.query(
      `SELECT 
        date,
        type,
        SUM(amount) as total
       FROM transactions
       WHERE user_id = $1 AND date >= $2 AND date <= $3
       GROUP BY date, type
       ORDER BY date ASC`,
      [userId, formatDate(start), formatDate(end)]
    );

    res.json({
      period: {
        start: formatDate(start),
        end: formatDate(end),
        month: `${getMonthName(start)} ${start.getFullYear()}`,
      },
      byCategory: transactionsByCategory.rows,
      byDay: transactionsByDay.rows,
    });

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};

// Exportar transações para CSV
const exportCSV = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let query = `SELECT 
      t.date,
      t.description,
      t.type,
      t.amount,
      c.name as category_name
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = $1`;
    
    const params = [userId];

    if (startDate && endDate) {
      query += ' AND t.date >= $2 AND t.date <= $3';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY t.date DESC';

    const result = await pool.query(query, params);

    // Converter para CSV
    const csvHeader = 'Data,Descrição,Tipo,Valor,Categoria\n';
    const csvRows = result.rows.map(row => {
      const date = formatDateBR(row.date);
      const description = `"${row.description}"`;
      const type = row.type === 'income' ? 'Receita' : 'Despesa';
      const amount = row.amount.toFixed(2).replace('.', ',');
      const category = row.category_name || '';
      return `${date},${description},${type},${amount},${category}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=transacoes-${formatDate(new Date())}.csv`);
    res.send('\ufeff' + csv); // BOM para Excel

  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    res.status(500).json({ error: 'Erro ao exportar CSV' });
  }
};

module.exports = {
  getMonthlyReport,
  exportCSV,
};

