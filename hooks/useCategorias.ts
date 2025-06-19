import { useCallback, useEffect, useState } from 'react';
import {
    CategoriasData,
    Category,
    createCategory,
    deleteCategory,
    fetchCategoriasData,
    fetchCategoriesByType,
    getCategoryUsageStats,
    updateCategory,
    validateCategoryName
} from '../services/categoriasService';

export interface UseCategorias {
  // Dados das categorias
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  customCategories: Category[];
  defaultCategories: Category[];
  mostUsedCategories: Category[];
  
  // Estados
  loading: boolean;
  error: string | null;
  
  // Estatísticas
  estatisticas: {
    totalCategories: number;
    incomeCategoriesCount: number;
    expenseCategoriesCount: number;
    customCategoriesCount: number;
  };
  
  // Funções
  adicionarCategoria: (categoryData: Omit<Category, 'id'>) => Promise<void>;
  atualizarCategoria: (id: string, categoryData: Partial<Category>) => Promise<void>;
  excluirCategoria: (id: string) => Promise<void>;
  buscarCategoriasPorTipo: (type: 'income' | 'expense') => Promise<Category[]>;
  obterEstatisticasCategoria: (id: string) => Promise<{
    transactionCount: number;
    totalAmount: number;
    averageAmount: number;
    lastUsed?: Date;
  }>;
  validarNomeCategoria: (name: string, type: 'income' | 'expense') => string | null;
  atualizarCategorias: () => Promise<void>;
}

export const useCategorias = (): UseCategorias => {
  // Estados
  const [categoriasData, setCategoriasData] = useState<CategoriasData>({
    categories: [],
    incomeCategories: [],
    expenseCategories: [],
    customCategories: [],
    defaultCategories: [],
    mostUsedCategories: [],
    estatisticas: {
      totalCategories: 0,
      incomeCategoriesCount: 0,
      expenseCategoriesCount: 0,
      customCategoriesCount: 0
    }
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar dados das categorias
  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchCategoriasData();
      setCategoriasData(data);
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  // Função para adicionar categoria
  const adicionarCategoria = useCallback(async (categoryData: Omit<Category, 'id'>) => {
    try {
      setError(null);
      
      // Validar nome da categoria
      const validationError = validateCategoryName(
        categoryData.name, 
        categoryData.type, 
        categoriasData.categories
      );
      
      if (validationError) {
        setError(validationError);
        return;
      }

      const newCategory = await createCategory(categoryData);
      
      // Atualizar estado local
      setCategoriasData(prev => {
        const newCategories = [...prev.categories, newCategory];
        const incomeCategories = newCategories.filter(cat => cat.type === 'income');
        const expenseCategories = newCategories.filter(cat => cat.type === 'expense');
        const customCategories = newCategories.filter(cat => !cat.isDefault);
        const defaultCategories = newCategories.filter(cat => cat.isDefault);
        
        return {
          categories: newCategories,
          incomeCategories,
          expenseCategories,
          customCategories,
          defaultCategories,
          mostUsedCategories: prev.mostUsedCategories,
          estatisticas: {
            totalCategories: newCategories.length,
            incomeCategoriesCount: incomeCategories.length,
            expenseCategoriesCount: expenseCategories.length,
            customCategoriesCount: customCategories.length
          }
        };
      });
    } catch (err) {
      setError('Erro ao adicionar categoria');
      console.error('Erro ao adicionar categoria:', err);
      throw err;
    }
  }, [categoriasData.categories]);

  // Função para atualizar categoria
  const atualizarCategoria = useCallback(async (id: string, categoryData: Partial<Category>) => {
    try {
      setError(null);
      
      // Se o nome foi alterado, validar
      if (categoryData.name) {
        const existingCategory = categoriasData.categories.find(cat => cat.id === id);
        if (existingCategory && categoryData.name !== existingCategory.name) {
          const validationError = validateCategoryName(
            categoryData.name, 
            categoryData.type || existingCategory.type, 
            categoriasData.categories.filter(cat => cat.id !== id)
          );
          
          if (validationError) {
            setError(validationError);
            return;
          }
        }
      }

      const updatedCategory = await updateCategory(id, categoryData);
      
      // Atualizar estado local
      setCategoriasData(prev => {
        const newCategories = prev.categories.map(cat => 
          cat.id === id ? { ...cat, ...updatedCategory } : cat
        );
        const incomeCategories = newCategories.filter(cat => cat.type === 'income');
        const expenseCategories = newCategories.filter(cat => cat.type === 'expense');
        const customCategories = newCategories.filter(cat => !cat.isDefault);
        const defaultCategories = newCategories.filter(cat => cat.isDefault);
        
        return {
          categories: newCategories,
          incomeCategories,
          expenseCategories,
          customCategories,
          defaultCategories,
          mostUsedCategories: prev.mostUsedCategories,
          estatisticas: {
            totalCategories: newCategories.length,
            incomeCategoriesCount: incomeCategories.length,
            expenseCategoriesCount: expenseCategories.length,
            customCategoriesCount: customCategories.length
          }
        };
      });
    } catch (err) {
      setError('Erro ao atualizar categoria');
      console.error('Erro ao atualizar categoria:', err);
      throw err;
    }
  }, [categoriasData.categories]);

  // Função para excluir categoria
  const excluirCategoria = useCallback(async (id: string) => {
    try {
      setError(null);
      
      // Verificar se é uma categoria padrão
      const category = categoriasData.categories.find(cat => cat.id === id);
      if (category?.isDefault) {
        setError('Não é possível excluir categorias padrão');
        return;
      }

      await deleteCategory(id);
      
      // Atualizar estado local
      setCategoriasData(prev => {
        const newCategories = prev.categories.filter(cat => cat.id !== id);
        const incomeCategories = newCategories.filter(cat => cat.type === 'income');
        const expenseCategories = newCategories.filter(cat => cat.type === 'expense');
        const customCategories = newCategories.filter(cat => !cat.isDefault);
        const defaultCategories = newCategories.filter(cat => cat.isDefault);
        
        return {
          categories: newCategories,
          incomeCategories,
          expenseCategories,
          customCategories,
          defaultCategories,
          mostUsedCategories: prev.mostUsedCategories.filter(cat => cat.id !== id),
          estatisticas: {
            totalCategories: newCategories.length,
            incomeCategoriesCount: incomeCategories.length,
            expenseCategoriesCount: expenseCategories.length,
            customCategoriesCount: customCategories.length
          }
        };
      });
    } catch (err) {
      setError('Erro ao excluir categoria');
      console.error('Erro ao excluir categoria:', err);
      throw err;
    }
  }, [categoriasData.categories]);

  // Função para buscar categorias por tipo
  const buscarCategoriasPorTipo = useCallback(async (type: 'income' | 'expense'): Promise<Category[]> => {
    try {
      setError(null);
      return await fetchCategoriesByType(type);
    } catch (err) {
      setError('Erro ao buscar categorias por tipo');
      console.error('Erro ao buscar categorias por tipo:', err);
      throw err;
    }
  }, []);

  // Função para obter estatísticas da categoria
  const obterEstatisticasCategoria = useCallback(async (id: string) => {
    try {
      setError(null);
      return await getCategoryUsageStats(id);
    } catch (err) {
      setError('Erro ao buscar estatísticas da categoria');
      console.error('Erro ao buscar estatísticas da categoria:', err);
      throw err;
    }
  }, []);

  // Função para validar nome da categoria
  const validarNomeCategoria = useCallback((name: string, type: 'income' | 'expense'): string | null => {
    return validateCategoryName(name, type, categoriasData.categories);
  }, [categoriasData.categories]);

  // Função para atualizar categorias (útil para pull-to-refresh)
  const atualizarCategorias = useCallback(async () => {
    await loadCategorias();
  }, [loadCategorias]);

  return {
    // Dados das categorias
    categories: categoriasData.categories,
    incomeCategories: categoriasData.incomeCategories,
    expenseCategories: categoriasData.expenseCategories,
    customCategories: categoriasData.customCategories,
    defaultCategories: categoriasData.defaultCategories,
    mostUsedCategories: categoriasData.mostUsedCategories,
    
    // Estados
    loading,
    error,
    
    // Estatísticas
    estatisticas: categoriasData.estatisticas,
    
    // Funções
    adicionarCategoria,
    atualizarCategoria,
    excluirCategoria,
    buscarCategoriasPorTipo,
    obterEstatisticasCategoria,
    validarNomeCategoria,
    atualizarCategorias
  };
}; 