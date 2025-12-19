// Página de Categorias
import { useEffect, useState } from 'react';
import categoryStore from '../store/categoryStore';
import CategoryModal from '../components/CategoryModal';
import './Categories.css';

const Categories = () => {
  const { categories, fetchCategories, deleteCategory, loading } = categoryStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      await deleteCategory(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    fetchCategories();
  };

  const filteredCategories = filterType
    ? categories.filter((cat) => cat.type === filterType)
    : categories;

  const incomeCategories = filteredCategories.filter((cat) => cat.type === 'income');
  const expenseCategories = filteredCategories.filter((cat) => cat.type === 'expense');

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Categorias</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          Nova Categoria
        </button>
      </div>

      {/* Filtro por tipo */}
      <div className="card">
        <div className="filter-tabs">
          <button
            onClick={() => setFilterType('')}
            className={filterType === '' ? 'active' : ''}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={filterType === 'income' ? 'active' : ''}
          >
            Receitas
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={filterType === 'expense' ? 'active' : ''}
          >
            Despesas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          {/* Categorias de Receita */}
          {(!filterType || filterType === 'income') && incomeCategories.length > 0 && (
            <div className="card">
              <h2>Categorias de Receita</h2>
              <div className="categories-grid">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="category-item">
                    <div
                      className="category-color"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="category-info">
                      <h3>{category.name}</h3>
                    </div>
                    <div className="category-actions">
                      <button
                        onClick={() => handleEdit(category)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorias de Despesa */}
          {(!filterType || filterType === 'expense') && expenseCategories.length > 0 && (
            <div className="card">
              <h2>Categorias de Despesa</h2>
              <div className="categories-grid">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="category-item">
                    <div
                      className="category-color"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="category-info">
                      <h3>{category.name}</h3>
                    </div>
                    <div className="category-actions">
                      <button
                        onClick={() => handleEdit(category)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCategories.length === 0 && (
            <div className="card">
              <div className="no-data">
                Nenhuma categoria encontrada. Crie uma nova categoria!
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de categoria */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Categories;

