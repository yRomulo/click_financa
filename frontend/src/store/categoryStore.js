// Store Zustand para categorias
import { create } from 'zustand';
import api from '../config/api';

const categoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // Buscar categorias
  fetchCategories: async (type = null) => {
    set({ loading: true, error: null });
    try {
      const url = type ? `/categories?type=${type}` : '/categories';
      const response = await api.get(url);
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao buscar categorias', loading: false });
    }
  },

  // Criar categoria
  createCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/categories', categoryData);
      set((state) => ({
        categories: [...state.categories, response.data],
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar categoria';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Atualizar categoria
  updateCategory: async (id, categoryData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? response.data : c
        ),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar categoria';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Deletar categoria
  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao deletar categoria';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },
}));

export default categoryStore;

