import {
  mockCategoriasData
} from '../data/mockCategorias';
import { APP_CONFIG } from './config';

// Interface para categoria
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isDefault?: boolean;
  transactionCount?: number;
  totalAmount?: number;
}

// Interface para os dados das categorias
export interface CategoriasData {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  customCategories: Category[];
  defaultCategories: Category[];
  mostUsedCategories: Category[];
  estatisticas: {
    totalCategories: number;
    incomeCategoriesCount: number;
    expenseCategoriesCount: number;
    customCategoriesCount: number;
  };
}

// Simula delay de rede
const simulateNetworkDelay = () => 
  new Promise(resolve => setTimeout(resolve, APP_CONFIG.MOCK_DELAY));

// Função para buscar dados das categorias
export const fetchCategoriasData = async (): Promise<CategoriasData> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/categorias`);
      const categories = await response.json();
      return processCategoriasData(categories);
    } catch (error) {
      console.error('Erro ao buscar categorias da API:', error);
      return processCategoriasData(mockCategoriasData);
    }
  } else {
    await simulateNetworkDelay();
    return processCategoriasData(mockCategoriasData);
  }
};

// Função para processar dados das categorias
const processCategoriasData = (categories: Category[]): CategoriasData => {
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const customCategoriesFiltered = categories.filter(cat => !cat.isDefault);
  const defaultCategoriesFiltered = categories.filter(cat => cat.isDefault);
  const mostUsedCategories = categories
    .filter(cat => cat.transactionCount && cat.transactionCount > 0)
    .sort((a, b) => (b.transactionCount || 0) - (a.transactionCount || 0))
    .slice(0, 5);

  const estatisticas = {
    totalCategories: categories.length,
    incomeCategoriesCount: incomeCategories.length,
    expenseCategoriesCount: expenseCategories.length,
    customCategoriesCount: customCategoriesFiltered.length
  };

  return {
    categories,
    incomeCategories,
    expenseCategories,
    customCategories: customCategoriesFiltered,
    defaultCategories: defaultCategoriesFiltered,
    mostUsedCategories,
    estatisticas
  };
};

// Função para buscar categorias por tipo
export const fetchCategoriesByType = async (type: 'income' | 'expense'): Promise<Category[]> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/categorias?type=${type}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar categorias por tipo:', error);
      return mockCategoriasData.filter(cat => cat.type === type);
    }
  } else {
    await simulateNetworkDelay();
    return mockCategoriasData.filter(cat => cat.type === type);
  }
};

// Função para criar nova categoria
export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      isDefault: false,
      transactionCount: 0,
      totalAmount: 0
    };
    return newCategory;
  }
};

// Função para atualizar categoria
export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/categorias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    return { ...categoryData, id } as Category;
  }
};

// Função para excluir categoria
export const deleteCategory = async (id: string): Promise<void> => {
  if (APP_CONFIG.USE_API) {
    try {
      await fetch(`${APP_CONFIG.API_BASE_URL}/categorias/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
  }
};

// Função para buscar estatísticas de uso da categoria
export const getCategoryUsageStats = async (id: string): Promise<{
  transactionCount: number;
  totalAmount: number;
  averageAmount: number;
  lastUsed?: Date;
}> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/categorias/${id}/stats`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar estatísticas da categoria:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    // Mock de estatísticas
    return {
      transactionCount: Math.floor(Math.random() * 20) + 1,
      totalAmount: Math.floor(Math.random() * 5000) + 100,
      averageAmount: Math.floor(Math.random() * 500) + 50,
      lastUsed: new Date()
    };
  }
};

// Função para validar nome da categoria
export const validateCategoryName = (name: string, type: 'income' | 'expense', existingCategories: Category[]): string | null => {
  if (!name.trim()) {
    return 'Nome da categoria é obrigatório';
  }

  if (name.trim().length < 2) {
    return 'Nome deve ter pelo menos 2 caracteres';
  }

  if (name.trim().length > 50) {
    return 'Nome deve ter no máximo 50 caracteres';
  }

  const nameExists = existingCategories.some(
    cat => cat.name.toLowerCase() === name.trim().toLowerCase() && cat.type === type
  );

  if (nameExists) {
    return 'Já existe uma categoria com este nome';
  }

  return null;
};

// Cores e ícones disponíveis para categorias
export { availableColors, availableIcons } from '../data/mockCategorias';

