// Página Dashboard - Visão geral financeira
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import transactionStore from '../store/transactionStore';
import categoryStore from '../store/categoryStore';
import api from '../config/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { summary, fetchSummary, transactions, fetchTransactions } = transactionStore();
  const { categories, fetchCategories } = categoryStore();
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const end = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      
      await Promise.all([
        fetchSummary(start, end),
        fetchTransactions({ startDate: start, endDate: end, limit: 10 }),
        fetchCategories(),
      ]);

      // Buscar dados do relatório mensal
      try {
        const response = await api.get('/reports/monthly');
        setMonthlyData(response.data);
      } catch (error) {
        console.error('Erro ao buscar relatório:', error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Preparar dados para gráfico de pizza (categorias)
  const pieData = monthlyData?.byCategory
    .filter(item => item.type === 'expense')
    .map(item => ({
      name: item.category_name || 'Sem categoria',
      value: parseFloat(item.total),
      color: item.category_color || '#6366f1',
    })) || [];

  // Preparar dados para gráfico de linha (por dia)
  const lineData = monthlyData?.byDay.map(item => ({
    date: format(new Date(item.date), 'dd/MM'),
    Receitas: item.type === 'income' ? parseFloat(item.total) : 0,
    Despesas: item.type === 'expense' ? parseFloat(item.total) : 0,
  })) || [];

  // Agrupar por dia para o gráfico
  const groupedLineData = lineData.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing.Receitas += item.Receitas;
      existing.Despesas += item.Despesas;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Cards de resumo */}
      <div className="summary-cards">
        <div className="summary-card income">
          <h3>Total de Receitas</h3>
          <p className="amount positive">
            R$ {summary.totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="summary-card expense">
          <h3>Total de Despesas</h3>
          <p className="amount negative">
            R$ {summary.totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="summary-card balance">
          <h3>Saldo</h3>
          <p className={`amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
            R$ {summary.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="card">
          <h2>Receitas vs Despesas (Mensal)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={groupedLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="Receitas" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Despesas" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2>Despesas por Categoria</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">Nenhuma despesa registrada este mês</p>
          )}
        </div>
      </div>

      {/* Últimas transações */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Últimas Transações</h2>
          <Link to="/transactions" className="btn btn-primary">
            Ver todas
          </Link>
        </div>
        {transactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id}>
                  <td>{format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category_name || '-'}</td>
                  <td>
                    <span className={`badge ${transaction.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={transaction.type === 'income' ? 'positive' : 'negative'}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {parseFloat(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">Nenhuma transação registrada</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

