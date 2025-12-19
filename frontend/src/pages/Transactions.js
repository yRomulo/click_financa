// Página de Transações
import { useEffect, useState } from 'react';
import transactionStore from '../store/transactionStore';
import categoryStore from '../store/categoryStore';
import TransactionModal from '../components/TransactionModal';
import { format } from 'date-fns';
import './Transactions.css';

const Transactions = () => {
  const {
    transactions,
    fetchTransactions,
    deleteTransaction,
    loading,
  } = transactionStore();
  const { categories, fetchCategories } = categoryStore();

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category_id: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = () => {
    fetchTransactions(filters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      startDate: '',
      endDate: '',
      type: '',
      category_id: '',
    };
    setFilters(emptyFilters);
    fetchTransactions();
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      await deleteTransaction(id);
      fetchTransactions(filters);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    fetchTransactions(filters);
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transações</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          Nova Transação
        </button>
      </div>

      {/* Filtros */}
      <div className="card filters-card">
        <h2>Filtros</h2>
        <div className="filters-grid">
          <div className="form-group">
            <label>Data Inicial</label>
            <input
              type="date"
              name="startDate"
              className="input"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Data Final</label>
            <input
              type="date"
              name="endDate"
              className="input"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              name="type"
              className="input"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select
              name="category_id"
              className="input"
              value={filters.category_id}
              onChange={handleFilterChange}
            >
              <option value="">Todas</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="filters-actions">
          <button onClick={handleApplyFilters} className="btn btn-primary">
            Aplicar Filtros
          </button>
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Limpar
          </button>
        </div>
      </div>

      {/* Lista de transações */}
      <div className="card">
        {loading ? (
          <div className="loading">Carregando...</div>
        ) : transactions.length > 0 ? (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-main">
                    <h3>{transaction.description}</h3>
                    <div className="transaction-meta">
                      <span>{format(new Date(transaction.date), 'dd/MM/yyyy')}</span>
                      {transaction.category_name && (
                        <span className="category-badge" style={{ backgroundColor: transaction.category_color || '#6366f1' }}>
                          {transaction.category_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${transaction.type === 'income' ? 'positive' : 'negative'}`}>
                      {transaction.type === 'income' ? '+' : '-'} R$ {parseFloat(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="transaction-actions">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="btn btn-danger"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">Nenhuma transação encontrada</div>
        )}
      </div>

      {/* Modal de transação */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Transactions;

