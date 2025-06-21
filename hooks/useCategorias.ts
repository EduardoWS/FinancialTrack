// hooks/useCategorias.ts

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import {
  Category,
  createCategory,
  deleteCategory,
  fetchUserCategories, // Nova função do service
  updateCategory,
  validateCategoryName,
} from '../services/categoriasService';

export interface UseCategorias {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  loading: boolean;
  error: string | null;
  adicionarCategoria: (categoryData: Omit<Category, 'id'>) => Promise<void>;
  atualizarCategoria: (id: string, categoryData: Partial<Omit<Category, 'id'>>) => Promise<void>;
  excluirCategoria: (id: string) => Promise<void>;
  validarNomeCategoria: (name: string, type: 'income' | 'expense') => string | null;
  atualizarCategorias: () => Promise<void>;
}

export const useCategorias = (): UseCategorias => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Usamos o usuário do AuthContext para recarregar

  // Função para carregar e processar dados das categorias
  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userCategories = await fetchUserCategories();
      setCategories(userCategories);
      setIncomeCategories(userCategories.filter(c => c.type === 'income'));
      setExpenseCategories(userCategories.filter(c => c.type === 'expense'));
    } catch (err: any) {
      setError('Erro ao carregar categorias');
      console.error('Erro ao carregar categorias:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarregar categorias quando o usuário mudar (login/logout)
  useEffect(() => {
    if (user) {
      loadCategorias();
    } else {
      // Limpar dados se o usuário fizer logout
      setCategories([]);
      setIncomeCategories([]);
      setExpenseCategories([]);
    }
  }, [user, loadCategorias]);

  const adicionarCategoria = useCallback(async (categoryData: Omit<Category, 'id'>) => {
    // A lógica de validação é ótima, vamos mantê-la
    const validationError = validateCategoryName(categoryData.name, categoryData.type, categories);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    try {
      const newCategory = await createCategory(categoryData);
      // Recarrega tudo para garantir consistência
      await loadCategorias();
    } catch (err: any) {
      setError('Erro ao adicionar categoria');
      console.error(err.message);
      throw err;
    }
  }, [categories, loadCategorias]);

  const atualizarCategoria = useCallback(async (id: string, categoryData: Partial<Omit<Category, 'id'>>) => {
    try {
      await updateCategory(id, categoryData);
      await loadCategorias();
    } catch (err: any) {
      setError('Erro ao atualizar categoria');
      console.error(err.message);
      throw err;
    }
  }, [loadCategorias]);

  const excluirCategoria = useCallback(async (id: string) => {
    try {
      await deleteCategory(id);
      // Remove do estado local para uma UI mais rápida antes de recarregar
      setCategories(prev => prev.filter(c => c.id !== id));
      await loadCategorias();
    } catch (err: any) {
      setError('Erro ao excluir categoria');
      console.error(err.message);
      throw err;
    }
  }, [loadCategorias]);

  const validarNomeCategoria = useCallback((name: string, type: 'income' | 'expense'): string | null => {
    return validateCategoryName(name, type, categories);
  }, [categories]);

  return {
    categories,
    incomeCategories,
    expenseCategories,
    loading,
    error,
    adicionarCategoria,
    atualizarCategoria,
    excluirCategoria,
    validarNomeCategoria,
    atualizarCategorias: loadCategorias,
  };
};