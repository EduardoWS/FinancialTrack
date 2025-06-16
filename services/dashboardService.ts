import { BalanceHistory, CategoryExpense, mockDashboardData, Transaction, WeeklyActivity } from '../data/mockData';
import { APP_CONFIG } from './config';

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
    savings: number;
  };
}

// Simula delay de rede
const simulateNetworkDelay = () => 
  new Promise(resolve => setTimeout(resolve, APP_CONFIG.MOCK_DELAY));

// Função para buscar dados do dashboard
export const fetchDashboardData = async (): Promise<DashboardData> => {
  if (APP_CONFIG.USE_API) {
    // TODO: Implementar chamada real para API
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/dashboard`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      // Fallback para dados mock em caso de erro
      return mockDashboardData;
    }
  } else {
    // Usar dados mock com delay simulado
    await simulateNetworkDelay();
    return mockDashboardData;
  }
};

// Função para buscar transações recentes
export const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  if (APP_CONFIG.USE_API) {
    // TODO: Implementar chamada real para API
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/transactions/recent`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar transações da API:', error);
      return mockDashboardData.recentTransactions;
    }
  } else {
    await simulateNetworkDelay();
    return mockDashboardData.recentTransactions;
  }
};

// Função para formatar valores monetários
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}; 