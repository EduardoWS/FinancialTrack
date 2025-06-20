import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// Interface para transação
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date | string; // Aceita tanto Date quanto string
  category: string;
  categoryId?: string; // Para referenciar categorias do Firebase
}

// Interface para dados do Firestore, com Timestamps
interface TransactionFirestore {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Timestamp;
  category: string;
  categoryId?: string;
}

// Interface para filtros de transação
export interface TransactionFilters {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  categoryId?: string;
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

// Interface para estatísticas
export interface TransactionStats {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  averageIncome: number;
  averageExpense: number;
  transactionsThisMonth: number;
}

// Interface para dados das transações processadas
export interface TransacoesData {
  transactions: Transaction[];
  recentTransactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  estatisticas: TransactionStats;
}

// Função auxiliar para obter a referência da coleção de transações do usuário logado
const getTransactionsCollectionRef = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado para acessar transações.');
  return collection(db, 'users', user.uid, 'transactions');
};

// Função para converter do Firestore para Transaction
const fromFirestore = (doc: any): Transaction => {
  const data = doc.data() as TransactionFirestore;
  return {
    id: doc.id,
    ...data,
    date: data.date.toDate(),
  };
};

// Função para converter Transaction para dados do Firestore
const toFirestore = (transaction: Partial<Omit<Transaction, 'id'>>) => {
  const data = { ...transaction };

  // Remove campos undefined
  Object.keys(data).forEach(key => {
    if ((data as any)[key] === undefined) {
      delete (data as any)[key];
    }
  });

  // Converte data para Timestamp do Firestore
  if (data.date) {
    let dateObj: Date;
    
    if (data.date instanceof Date) {
      dateObj = data.date;
    } else {
      // Converte string para Date
      const dateStr = String(data.date);
      if (dateStr.includes('/')) {
        // Formato brasileiro DD/MM/YYYY
        const [day, month, year] = dateStr.split('/');
        dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Outros formatos, deixa o Date constructor tentar converter
        dateObj = new Date(dateStr);
      }
    }
    
    // Verifica se a data é válida
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date(); // Fallback para data atual
    }
    
    (data as any).date = Timestamp.fromDate(dateObj);
  }

  return data;
};

// --- FUNÇÕES CRUD COM FIRESTORE ---

// Função para buscar todas as transações do usuário
export const fetchUserTransactions = async (): Promise<Transaction[]> => {
  const transactionsCollectionRef = getTransactionsCollectionRef();
  const q = query(transactionsCollectionRef, orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(fromFirestore);
};

// Função para buscar dados processados das transações
export const fetchTransacoesData = async (): Promise<TransacoesData> => {
  const transactions = await fetchUserTransactions();
  return processTransacoesData(transactions);
};

// Função para processar dados das transações
const processTransacoesData = (transactions: Transaction[]): TransacoesData => {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const recentTransactions = transactions.slice(0, 10);

  // Transações do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const currentMonthIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const currentMonthExpenses = Math.abs(currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0));

  // Totais gerais (para o saldo total)
  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = Math.abs(expenseTransactions.reduce((acc, t) => acc + t.amount, 0));
  const balance = totalIncome - totalExpenses;

  const estatisticas: TransactionStats = {
    totalTransactions: transactions.length,
    totalIncome: currentMonthIncome, // Usar receitas do mês atual
    totalExpenses: currentMonthExpenses, // Usar gastos do mês atual
    balance,
    averageIncome: incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0,
    averageExpense: expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0,
    transactionsThisMonth: currentMonthTransactions.length // Corrigir esta linha
  };

  return {
    transactions,
    recentTransactions,
    incomeTransactions,
    expenseTransactions,
    estatisticas
  };
};

// Função para criar nova transação
export const createTransaction = async (transactionData: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const transactionsCollectionRef = getTransactionsCollectionRef();
  const firestoreData = toFirestore(transactionData);
  const docRef = await addDoc(transactionsCollectionRef, firestoreData);

  return {
    id: docRef.id,
    ...transactionData,
  };
};

// Função para atualizar transação
export const updateTransaction = async (id: string, transactionData: Partial<Omit<Transaction, 'id'>>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado.');
  
  const transactionDocRef = doc(db, 'users', user.uid, 'transactions', id);
  const firestoreData = toFirestore(transactionData);
  await updateDoc(transactionDocRef, firestoreData);
};

// Função para excluir transação
export const deleteTransaction = async (id: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado.');

  const transactionDocRef = doc(db, 'users', user.uid, 'transactions', id);
  await deleteDoc(transactionDocRef);
};

// Função para buscar transações com filtros
export const fetchTransactionsWithFilters = async (
  filters?: TransactionFilters,
  pagination?: PaginationOptions,
  sort?: SortOptions
): Promise<{
  transactions: Transaction[];
  totalCount: number;
  hasMore: boolean;
}> => {
  const transactionsCollectionRef = getTransactionsCollectionRef();
  let q = query(transactionsCollectionRef);

  // Aplicar filtros
  if (filters) {
    if (filters.type && filters.type !== 'all') {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.categoryId) {
      q = query(q, where('categoryId', '==', filters.categoryId));
    }
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.dateFrom) {
      q = query(q, where('date', '>=', Timestamp.fromDate(filters.dateFrom)));
    }
    if (filters.dateTo) {
      q = query(q, where('date', '<=', Timestamp.fromDate(filters.dateTo)));
    }
  }

  // Aplicar ordenação
  const sortField = sort?.field || 'date';
  const sortOrder = sort?.order || 'desc';
  q = query(q, orderBy(sortField, sortOrder));

  // Aplicar paginação
  if (pagination) {
    q = query(q, limit(pagination.limit));
    // Para paginação mais avançada, seria necessário implementar cursor-based pagination
  }

  const querySnapshot = await getDocs(q);
  const transactions = querySnapshot.docs.map(fromFirestore);

  // Aplicar filtros que não podem ser feitos no Firestore
  let filteredTransactions = transactions;
  if (filters) {
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

  return {
    transactions: filteredTransactions,
    totalCount: filteredTransactions.length,
    hasMore: false, // Simplified for now
  };
};

// Função para buscar transações recentes
export const fetchRecentTransactions = async (limitCount: number = 5): Promise<Transaction[]> => {
  const transactionsCollectionRef = getTransactionsCollectionRef();
  const q = query(
    transactionsCollectionRef, 
    orderBy('date', 'desc'), 
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(fromFirestore);
};

// Função para obter estatísticas por período
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
  const transactionsCollectionRef = getTransactionsCollectionRef();
  const q = query(
    transactionsCollectionRef,
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    orderBy('date', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const transactions = querySnapshot.docs.map(fromFirestore);

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = Math.abs(expenseTransactions.reduce((acc, t) => acc + t.amount, 0));

  // Agrupar por categoria
  const categoryStats = new Map<string, { amount: number; count: number }>();
  transactions.forEach(t => {
    if (!categoryStats.has(t.category)) {
      categoryStats.set(t.category, { amount: 0, count: 0 });
    }
    const stats = categoryStats.get(t.category)!;
    stats.amount += Math.abs(t.amount);
    stats.count += 1;
  });

  const topCategories = Array.from(categoryStats.entries())
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
    topCategories,
  };
};

// Função para validar dados da transação
export const validateTransactionData = (data: Partial<Transaction>): string[] => {
  const errors: string[] = [];

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Descrição é obrigatória');
  }

  if (!data.amount || data.amount === 0) {
    errors.push('Valor deve ser diferente de zero');
  }

  if (!data.type || !['income', 'expense'].includes(data.type)) {
    errors.push('Tipo deve ser receita ou despesa');
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push('Categoria é obrigatória');
  }

  if (!data.date) {
    errors.push('Data é obrigatória');
  }

  return errors;
};

// Função para formatar moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}; 