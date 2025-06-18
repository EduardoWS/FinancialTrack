import { Transaction } from '../data/mockData';
import { mockTransacoesData } from '../data/mockTransacoes';
import { APP_CONFIG } from './config';

// Interface para os dados das transações
export interface TransacoesData {
  transactions: Transaction[];
  recentTransactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  estatisticas: {
    totalTransactions: number;
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    averageIncome: number;
    averageExpense: number;
    transactionsThisMonth: number;
  };
}

// Interface para filtros de transação
export interface TransactionFilters {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  description?: string;
}

// Interface para paginação
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Interface para ordenação
export interface SortOptions {
  field: 'date' | 'amount' | 'description' | 'category';
  order: 'asc' | 'desc';
}

// Simula delay de rede
const simulateNetworkDelay = () => 
  new Promise(resolve => setTimeout(resolve, APP_CONFIG.MOCK_DELAY));

// Função para buscar dados das transações
export const fetchTransacoesData = async (): Promise<TransacoesData> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/transacoes`);
      const transactions = await response.json();
      return processTransacoesData(transactions);
    } catch (error) {
      console.error('Erro ao buscar transações da API:', error);
      return processTransacoesData(mockTransacoesData);
    }
  } else {
    await simulateNetworkDelay();
    return processTransacoesData(mockTransacoesData);
  }
};

// Função para processar dados das transações
const processTransacoesData = (transactions: Transaction[]): TransacoesData => {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const recentTransactions = transactions.slice(0, 10);

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = Math.abs(expenseTransactions.reduce((acc, t) => acc + t.amount, 0));
  const balance = totalIncome - totalExpenses;

  // Transações do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const transactionsThisMonth = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  }).length;

  const estatisticas = {
    totalTransactions: transactions.length,
    totalIncome,
    totalExpenses,
    balance,
    averageIncome: incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0,
    averageExpense: expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0,
    transactionsThisMonth
  };

  return {
    transactions,
    recentTransactions,
    incomeTransactions,
    expenseTransactions,
    estatisticas
  };
};

// Função para buscar transações com filtros e paginação
export const fetchTransactionsWithFilters = async (
  filters?: TransactionFilters,
  pagination?: PaginationOptions,
  sort?: SortOptions
): Promise<{
  transactions: Transaction[];
  totalCount: number;
  hasMore: boolean;
}> => {
  if (APP_CONFIG.USE_API) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('limit', pagination.limit.toString());
      }
      
      if (sort) {
        queryParams.append('sortBy', sort.field);
        queryParams.append('sortOrder', sort.order);
      }

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/transacoes?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar transações filtradas:', error);
      return applyFiltersToMockData(filters, pagination, sort);
    }
  } else {
    await simulateNetworkDelay();
    return applyFiltersToMockData(filters, pagination, sort);
  }
};

// Função para aplicar filtros aos dados mock
const applyFiltersToMockData = (
  filters?: TransactionFilters,
  pagination?: PaginationOptions,
  sort?: SortOptions
): {
  transactions: Transaction[];
  totalCount: number;
  hasMore: boolean;
} => {
  let filteredTransactions = [...mockTransacoesData];

  // Aplicar filtros
  if (filters) {
    if (filters.type && filters.type !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }
    if (filters.category) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    if (filters.description) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.description.toLowerCase().includes(filters.description!.toLowerCase())
      );
    }
    if (filters.amountMin !== undefined) {
      filteredTransactions = filteredTransactions.filter(t => 
        Math.abs(t.amount) >= filters.amountMin!
      );
    }
    if (filters.amountMax !== undefined) {
      filteredTransactions = filteredTransactions.filter(t => 
        Math.abs(t.amount) <= filters.amountMax!
      );
    }
  }

  // Aplicar ordenação
  if (sort) {
    filteredTransactions.sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'date':
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }
      return sort.order === 'desc' ? -comparison : comparison;
    });
  }

  const totalCount = filteredTransactions.length;

  // Aplicar paginação
  if (pagination) {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    filteredTransactions = filteredTransactions.slice(startIndex, endIndex);
  }

  return {
    transactions: filteredTransactions,
    totalCount,
    hasMore: pagination ? (pagination.page * pagination.limit) < totalCount : false
  };
};

// Função para criar nova transação
export const createTransaction = async (transactionData: Omit<Transaction, 'id'>): Promise<Transaction> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/transacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString()
    };
    return newTransaction;
  }
};

// Função para atualizar transação
export const updateTransaction = async (id: string, transactionData: Partial<Transaction>): Promise<Transaction> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/transacoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    return { ...transactionData, id } as Transaction;
  }
};

// Função para excluir transação
export const deleteTransaction = async (id: string): Promise<void> => {
  if (APP_CONFIG.USE_API) {
    try {
      await fetch(`${APP_CONFIG.API_BASE_URL}/transacoes/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
  }
};

// Função para buscar transações recentes
export const fetchRecentTransactions = async (limit: number = 5): Promise<Transaction[]> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/transacoes/recent?limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar transações recentes:', error);
      return mockTransacoesData.slice(0, limit);
    }
  } else {
    await simulateNetworkDelay();
    return mockTransacoesData.slice(0, limit);
  }
};

// Função para buscar estatísticas por período
export const getTransactionStatsByPeriod = async (
  startDate: Date, 
  endDate: Date
): Promise<{
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  topCategories: { category: string; amount: number; count: number }[];
}> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(
        `${APP_CONFIG.API_BASE_URL}/transacoes/stats?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar estatísticas por período:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    
    // Mock de estatísticas por período
    const filteredTransactions = mockTransacoesData.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');

    const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = Math.abs(expenseTransactions.reduce((acc, t) => acc + t.amount, 0));

    // Top categorias
    const categoryStats = new Map<string, { amount: number; count: number }>();
    filteredTransactions.forEach(t => {
      const existing = categoryStats.get(t.category) || { amount: 0, count: 0 };
      categoryStats.set(t.category, {
        amount: existing.amount + Math.abs(t.amount),
        count: existing.count + 1
      });
    });

    const topCategories = Array.from(categoryStats.entries())
      .map(([category, stats]) => ({ category, ...stats }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: filteredTransactions.length,
      topCategories
    };
  }
};

// Função para formatar valores monetários
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Função para validar dados da transação
export const validateTransactionData = (data: Partial<Transaction>): string[] => {
  const errors: string[] = [];

  if (!data.description?.trim()) {
    errors.push('Descrição é obrigatória');
  }

  if (!data.amount || data.amount === 0) {
    errors.push('Valor deve ser maior que zero');
  }

  if (!data.category?.trim()) {
    errors.push('Categoria é obrigatória');
  }

  if (!data.type) {
    errors.push('Tipo da transação é obrigatório');
  }

  if (!data.date?.trim()) {
    errors.push('Data é obrigatória');
  }

  return errors;
}; 