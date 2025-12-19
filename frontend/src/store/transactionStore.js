// Store Zustand para transações
import { create } from 'zustand';
import api from '../config/api';

const transactionStore = create((set, get) => ({
  transactions: [],
  summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
  loading: false,
  error: null,

  // Buscar transações
  fetchTransactions: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.type) params.append('type', filters.type);
      if (filters.category_id) params.append('category_id', filters.category_id);
      
      const response = await api.get(`/transactions?${params.toString()}`);
      set({ transactions: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao buscar transações', loading: false });
    }
  },

  // Buscar resumo financeiro
  fetchSummary: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/transactions/summary?${params.toString()}`);
      set({ summary: response.data });
    } catch (error) {
      console.error('Erro ao buscar resumo:', error);
    }
  },

  // Criar transação
  createTransaction: async (transactionData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/transactions', transactionData);
      set((state) => ({
        transactions: [response.data, ...state.transactions],
        loading: false,
      }));
      // Atualizar resumo
      get().fetchSummary();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar transação';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Atualizar transação
  updateTransaction: async (id, transactionData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? response.data : t
        ),
        loading: false,
      }));
      // Atualizar resumo
      get().fetchSummary();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar transação';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Deletar transação
  deleteTransaction: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/transactions/${id}`);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        loading: false,
      }));
      // Atualizar resumo
      get().fetchSummary();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao deletar transação';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Limpar erro
  clearError: () => set({ error: null }),
}));

export default transactionStore;

