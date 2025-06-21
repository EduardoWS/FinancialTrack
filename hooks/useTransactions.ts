import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import {
    createTransaction,
    deleteTransaction,
    fetchUserTransactions,
    Transaction,
    updateTransaction,
    validateTransactionData,
} from '../services/transacoesService';

export type FilterType = 'all' | 'income' | 'expense';

export type DateFilter = 
  | { type: 'all' }
  | { type: 'year'; year: number }
  | { type: 'month'; year: number; month: number } // month is 0-indexed
  | { type: 'day'; date: Date };

interface UseTransactionsReturn {
  transactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  filteredTransactions: Transaction[];
  activeFilter: FilterType;
  dateFilter: DateFilter;
  filterTitle: string;
  currentPage: number;
  totalPages: number;
  paginatedTransactions: Transaction[];
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
  setActiveFilter: (filter: FilterType) => void;
  setDateFilter: (filter: DateFilter) => void;
  setCurrentPage: (page: number) => void;
  adicionarTransacao: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  atualizarTransacao: (id: string, transactionData: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  excluirTransacao: (id: string) => Promise<void>;
  validarDadosTransacao: (data: Partial<Transaction>) => string[];
  atualizarTransacoes: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export const useTransactions = (itemsPerPage = 5): UseTransactionsReturn => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    type: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadTransacoes = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const userTransactions = await fetchUserTransactions();
      setAllTransactions(userTransactions);
    } catch (err: any) {
      setError('Erro ao carregar transações');
      console.error('Erro ao carregar transações:', err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadTransacoes();
    } else {
      setAllTransactions([]);
    }
  }, [user, loadTransacoes]);

  const transactions = useMemo(() => {
    if (dateFilter.type === 'all') {
      return allTransactions;
    }
    return allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (dateFilter.type === 'year') {
        return transactionDate.getFullYear() === dateFilter.year;
      }
      if (dateFilter.type === 'month') {
        return transactionDate.getFullYear() === dateFilter.year && transactionDate.getMonth() === dateFilter.month;
      }
      if (dateFilter.type === 'day') {
        return transactionDate.getFullYear() === dateFilter.date.getFullYear() &&
               transactionDate.getMonth() === dateFilter.date.getMonth() &&
               transactionDate.getDate() === dateFilter.date.getDate();
      }
      return false;
    });
  }, [allTransactions, dateFilter]);
  
  const incomeTransactions = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions]);
  const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

  const filterTitle = useMemo(() => {
    const { type } = dateFilter;
    if (type === 'all') return 'Todas as transações';
    
    if (type === 'year') return `Transações de ${dateFilter.year}`;

    if (type === 'month') {
      const monthName = new Date(dateFilter.year, dateFilter.month).toLocaleString('pt-BR', { month: 'long' });
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      return `Transações de ${capitalizedMonth} de ${dateFilter.year}`;
    }
    
    if (type === 'day') {
      return `Transações de ${dateFilter.date.toLocaleDateString('pt-BR')}`;
    }

    return 'Transações';
  }, [dateFilter]);

  const filteredTransactions = useMemo(() => {
    switch (activeFilter) {
      case 'income':
        return incomeTransactions;
      case 'expense':
        return expenseTransactions;
      default:
        return transactions;
    }
  }, [activeFilter, transactions, incomeTransactions, expenseTransactions]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const handleSetActiveFilter = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  const handleSetDateFilter = useCallback((filter: DateFilter) => {
    setDateFilter(filter);
    setCurrentPage(1);
  }, []);

  const adicionarTransacao = useCallback(async (transactionData: Omit<Transaction, 'id'>) => {
    const validationErrors = validateTransactionData(transactionData);
    if (validationErrors.length > 0) {
      const errorMsg = validationErrors.join(', ');
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    try {
      await createTransaction(transactionData);
      await loadTransacoes(false);
    } catch (err: any) {
      setError('Erro ao adicionar transação');
      console.error(err.message);
      throw err;
    }
  }, [loadTransacoes]);

  const atualizarTransacao = useCallback(async (id: string, transactionData: Partial<Omit<Transaction, 'id'>>) => {
    try {
      await updateTransaction(id, transactionData);
      await loadTransacoes(false);
    } catch (err: any) {
      setError('Erro ao atualizar transação');
      console.error(err.message);
      throw err;
    }
  }, [loadTransacoes]);

  const excluirTransacao = useCallback(async (id: string) => {
    try {
      await deleteTransaction(id);
      await loadTransacoes(false);
    } catch (err: any) {
      setError('Erro ao excluir transação');
      console.error(err.message);
      throw err;
    }
  }, [loadTransacoes]);

  const validarDadosTransacao = useCallback((data: Partial<Transaction>): string[] => {
    return validateTransactionData(data);
  }, []);

  const refreshTransactions = useCallback(async () => {
    await loadTransacoes(true);
  }, [loadTransacoes]);

  return {
    transactions,
    incomeTransactions,
    expenseTransactions,
    filteredTransactions,
    activeFilter,
    dateFilter,
    filterTitle,
    currentPage,
    totalPages,
    paginatedTransactions,
    itemsPerPage,
    loading,
    error,
    setActiveFilter: handleSetActiveFilter,
    setDateFilter: handleSetDateFilter,
    setCurrentPage,
    adicionarTransacao,
    atualizarTransacao,
    excluirTransacao,
    validarDadosTransacao,
    atualizarTransacoes: loadTransacoes,
    refreshTransactions,
  };
}; 