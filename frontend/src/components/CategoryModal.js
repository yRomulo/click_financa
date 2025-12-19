// Modal para criar/editar categoria
import { useState, useEffect } from 'react';
import categoryStore from '../store/categoryStore';
import './CategoryModal.css';

const CategoryModal = ({ category, onClose }) => {
  const { createCategory, updateCategory } = categoryStore();
  const isEditing = !!category;

  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#6366f1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cores predefinidas
  const predefinedColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#ef4444', '#f59e0b', '#10b981', '#06b6d4',
    '#3b82f6', '#14b8a6', '#f97316', '#84cc16',
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = isEditing
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select
              name="type"
              className="input"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cor</label>
            <div className="color-picker">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="color-input"
              />
              <div className="color-preview" style={{ backgroundColor: formData.color }} />
              <div className="predefined-colors">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;

