import { fetchTransacoesData, Transaction } from './transacoesService';

// Interfaces para os dados do dashboard
export interface WeeklyActivity {
  day: string;
  income: number;
  expense: number;
}

export interface BalanceHistory {
  month: string;
  balance: number;
}

// Interface para os dados do dashboard
export interface DashboardData {
  recentTransactions: Transaction[];
  allTransactions: Transaction[];
  weeklyActivity: WeeklyActivity[];
  balanceHistory: BalanceHistory[];
  categoryExpenses: CategoryExpense[];
  stats: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
  };
}

// Interface para despesas por categoria (compatível com Category)
export interface CategoryExpense {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

// Função para processar atividade semanal a partir das transações
const processWeeklyActivity = (transactions: Transaction[]): WeeklyActivity[] => {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const weeklyData: WeeklyActivity[] = weekDays.map(day => ({ day, income: 0, expense: 0 }));

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  transactions
    .filter(t => t.date >= oneWeekAgo)
    .forEach(transaction => {
      const dayIndex = transaction.date.getDay();
      if (transaction.type === 'income') {
        weeklyData[dayIndex].income += transaction.amount;
      } else {
        weeklyData[dayIndex].expense += Math.abs(transaction.amount);
      }
    });

  return weeklyData;
};

// Função para processar despesas por categoria (apenas do mês atual)
const processCategoryExpenses = (transactions: Transaction[]): CategoryExpense[] => {
  const categoryMap = new Map<string, number>();
  
  // Filtrar apenas transações do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = transactions.filter(t => {
    const transactionDate = typeof t.date === 'string' ? new Date(t.date) : t.date;
    return t.type === 'expense' && 
           transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const expenseTransactions = currentMonthExpenses;

  expenseTransactions.forEach(transaction => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);
    categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
  });

  const totalExpenses = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);
  
  // Cores para as categorias
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  return Array.from(categoryMap.entries())
    .map(([category, amount], index) => ({
      name: category,
      amount,
      color: colors[index % colors.length],
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6); // Limitar a 6 categorias principais
};

// Função para processar histórico de saldo
const processBalanceHistory = (transactions: Transaction[]): BalanceHistory[] => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentDate = new Date();
  const history: BalanceHistory[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthTransactions = transactions.filter(t => {
      const transactionDate = t.date;
      return transactionDate.getMonth() === date.getMonth() && 
             transactionDate.getFullYear() === date.getFullYear();
    });

    const monthlyIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    history.push({
      month: months[date.getMonth()],
      balance: monthlyIncome - monthlyExpenses,
    });
  }

  return history;
};

// Função para buscar dados do dashboard
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const transacoesData = await fetchTransacoesData();
    const { transactions, recentTransactions, estatisticas } = transacoesData;

    const weeklyActivity = processWeeklyActivity(transactions);
    const categoryExpenses = processCategoryExpenses(transactions);
    const balanceHistory = processBalanceHistory(transactions);

    return {
      recentTransactions,
      allTransactions: transactions,
      weeklyActivity,
      balanceHistory,
      categoryExpenses,
      stats: {
        totalBalance: estatisticas.balance,
        monthlyIncome: estatisticas.totalIncome,
        monthlyExpenses: estatisticas.totalExpenses,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw error;
  }
};

// Função para buscar transações recentes
export const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  try {
    const transacoesData = await fetchTransacoesData();
    return transacoesData.recentTransactions;
  } catch (error) {
    console.error('Erro ao buscar transações recentes:', error);
    throw error;
  }
};

// Função para formatar valores monetários
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}; 