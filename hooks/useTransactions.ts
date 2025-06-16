import { useCallback, useMemo, useState } from 'react';
import { mockDashboardData, Transaction } from '../data/mockData';

export type FilterType = 'all' | 'income' | 'expense';

interface UseTransactionsReturn {
  transactions: Transaction[];
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
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  refreshTransactions: () => void;
}

export const useTransactions = (itemsPerPage = 7): UseTransactionsReturn => {
  // Estados
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data das transações - aqui seria fácil trocar pela chamada da API
  const [transactions, setTransactions] = useState<Transaction[]>(
    mockDashboardData.allTransactions
  );

  // Filtragem das transações baseada no filtro ativo
  const filteredTransactions = useMemo(() => {
    switch (activeFilter) {
      case 'income':
        return transactions.filter(t => t.type === 'income');
      case 'expense':
        return transactions.filter(t => t.type === 'expense');
      default:
        return transactions;
    }
  }, [activeFilter, transactions]);

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

  // Adicionar nova transação
  const addTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    // Gerar ID único (na API real, isso seria feito no backend)
    const id = Date.now().toString();
    const transaction: Transaction = {
      ...newTransaction,
      id
    };

    setTransactions(prev => [transaction, ...prev]);
    
    // TODO: Aqui seria feita a chamada para a API
    // try {
    //   const response = await api.createTransaction(transaction);
    //   setTransactions(prev => [response.data, ...prev.slice(1)]);
    // } catch (error) {
    //   setError('Erro ao criar transação');
    //   setTransactions(prev => prev.slice(1)); // Reverter otimistic update
    // }
  }, []);

  // Atualizar transações (útil para pull-to-refresh)
  const refreshTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Aqui seria feita a chamada para a API
      // const response = await api.getTransactions();
      // setTransactions(response.data);
      
      // Por enquanto, mantemos os dados mock
      setTransactions(mockDashboardData.allTransactions);
      
    } catch (err) {
      setError('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transactions,
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
    addTransaction,
    refreshTransactions
  };
}; 