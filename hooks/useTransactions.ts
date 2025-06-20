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

interface UseTransactionsReturn {
  transactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  filteredTransactions: Transaction[];
  activeFilter: FilterType;
  currentPage: number;
  totalPages: number;
  paginatedTransactions: Transaction[];
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
  setActiveFilter: (filter: FilterType) => void;
  setCurrentPage: (page: number) => void;
  adicionarTransacao: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  atualizarTransacao: (id: string, transactionData: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  excluirTransacao: (id: string) => Promise<void>;
  validarDadosTransacao: (data: Partial<Transaction>) => string[];
  atualizarTransacoes: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export const useTransactions = (itemsPerPage = 5): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Função para carregar e processar transações
  const loadTransacoes = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      const userTransactions = await fetchUserTransactions();
      setTransactions(userTransactions);
      setIncomeTransactions(userTransactions.filter(t => t.type === 'income'));
      setExpenseTransactions(userTransactions.filter(t => t.type === 'expense'));
    } catch (err: any) {
      setError('Erro ao carregar transações');
      console.error('Erro ao carregar transações:', err.message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  // Recarregar transações quando o usuário mudar (login/logout)
  useEffect(() => {
    if (user) {
      loadTransacoes();
    } else {
      // Limpar dados se o usuário fizer logout
      setTransactions([]);
      setIncomeTransactions([]);
      setExpenseTransactions([]);
    }
  }, [user, loadTransacoes]);

  // Filtragem das transações baseada no filtro ativo
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

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Resetar página quando mudar filtro
  const handleSetActiveFilter = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  const adicionarTransacao = useCallback(async (transactionData: Omit<Transaction, 'id'>) => {
    // Validar dados antes de enviar
    const validationErrors = validateTransactionData(transactionData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      throw new Error(validationErrors.join(', '));
    }

    try {
      // Atualização otimista - adicionar temporariamente na lista
      const tempTransaction: Transaction = {
        ...transactionData,
        id: `temp-${Date.now()}`,
      };
      
      setTransactions(prev => [tempTransaction, ...prev]);
      
      // Criar no servidor
      const newTransaction = await createTransaction(transactionData);
      
      // Recarregar dados para garantir consistência
      await loadTransacoes(false);
    } catch (err: any) {
      setError('Erro ao adicionar transação');
      console.error(err.message);
      // Reverter atualização otimista
      loadTransacoes(false);
      throw err;
    }
  }, [loadTransacoes]);

  const atualizarTransacao = useCallback(async (id: string, transactionData: Partial<Omit<Transaction, 'id'>>) => {
    try {
      // Atualização otimista
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === id ? { ...transaction, ...transactionData } : transaction
      );
      setTransactions(updatedTransactions);
      
      // Atualizar no servidor
      await updateTransaction(id, transactionData);
      
      // Recarregar para garantir consistência
      await loadTransacoes(false);
    } catch (err: any) {
      setError('Erro ao atualizar transação');
      console.error(err.message);
      // Reverter em caso de erro
      loadTransacoes(false);
      throw err;
    }
  }, [transactions, loadTransacoes]);

  const excluirTransacao = useCallback(async (id: string) => {
    try {
      // Atualização otimista
      const filteredTransactions = transactions.filter(transaction => transaction.id !== id);
      setTransactions(filteredTransactions);
      
      // Excluir no servidor
      await deleteTransaction(id);
      
      // Recarregar para garantir consistência
      await loadTransacoes(false);
    } catch (err: any) {
      setError('Erro ao excluir transação');
      console.error(err.message);
      // Reverter em caso de erro
      loadTransacoes(false);
      throw err;
    }
  }, [transactions, loadTransacoes]);

  const validarDadosTransacao = useCallback((data: Partial<Transaction>): string[] => {
    return validateTransactionData(data);
  }, []);

  // Atualizar transações (útil para pull-to-refresh)
  const refreshTransactions = useCallback(async () => {
    await loadTransacoes(true);
  }, [loadTransacoes]);

  return {
    transactions,
    incomeTransactions,
    expenseTransactions,
    filteredTransactions,
    activeFilter,
    currentPage,
    totalPages,
    paginatedTransactions,
    itemsPerPage,
    loading,
    error,
    setActiveFilter: handleSetActiveFilter,
    setCurrentPage,
    adicionarTransacao,
    atualizarTransacao,
    excluirTransacao,
    validarDadosTransacao,
    atualizarTransacoes: loadTransacoes,
    refreshTransactions,
  };
}; 