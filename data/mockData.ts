// Mock data para simular dados da API
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export interface WeeklyActivity {
  day: string;
  income: number;
  expense: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface BalanceHistory {
  month: string;
  balance: number;
}

// Dados mock do dashboard
export const mockDashboardData = {
  // Todas as transações
  allTransactions: [
    {
      id: '1',
      description: 'Pagamento aluguel',
      amount: -3500,
      type: 'expense' as const,
      date: '28 Janeiro 2025',
      category: 'Moradia'
    },
    {
      id: '2', 
      description: 'Pedro Henrique',
      amount: 2500,
      type: 'income' as const,
      date: '25 Janeiro 2025',
      category: 'Transferência'
    },
    {
      id: '3',
      description: 'João Vitor',
      amount: 5400,
      type: 'income' as const,
      date: '25 Janeiro 2025',
      category: 'Freelance'
    },
    {
      id: '4',
      description: 'Supermercado Extra',
      amount: -245.80,
      type: 'expense' as const,
      date: '24 Janeiro 2025',
      category: 'Mercado'
    },
    {
      id: '5',
      description: 'Salário',
      amount: 4500,
      type: 'income' as const,
      date: '23 Janeiro 2025',
      category: 'Trabalho'
    },
    {
      id: '6',
      description: 'Uber',
      amount: -25.50,
      type: 'expense' as const,
      date: '22 Janeiro 2025',
      category: 'Transporte'
    },
    {
      id: '7',
      description: 'Cinema',
      amount: -45.00,
      type: 'expense' as const,
      date: '21 Janeiro 2025',
      category: 'Lazer'
    },
    {
      id: '8',
      description: 'Freelance Design',
      amount: 1200,
      type: 'income' as const,
      date: '20 Janeiro 2025',
      category: 'Freelance'
    },
    {
      id: '9',
      description: 'Farmácia',
      amount: -89.90,
      type: 'expense' as const,
      date: '19 Janeiro 2025',
      category: 'Saúde'
    },
    {
      id: '10',
      description: 'Transferência Recebida',
      amount: 500,
      type: 'income' as const,
      date: '18 Janeiro 2025',
      category: 'Transferência'
    }
  ] as Transaction[],

  // Últimas 3 transações para exibição rápida
  get recentTransactions() {
    return this.allTransactions.slice(0, 3);
  },

  // Atividade semanal
  weeklyActivity: [
    { day: 'Sáb', income: 250, expense: 480 },
    { day: 'Dom', income: 0, expense: 260 },
    { day: 'Seg', income: 400, expense: 160 },
    { day: 'Ter', income: 380, expense: 380 },
    { day: 'Qua', income: 250, expense: 150 },
    { day: 'Qui', income: 280, expense: 410 },
    { day: 'Sex', income: 340, expense: 400 }
  ] as WeeklyActivity[],

  // Histórico de saldo dos últimos 12 meses
  get balanceHistory() {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const history: BalanceHistory[] = [];
    
    // Valores base para criar uma curva mais interessante
    const baseValues = [280, 350, 420, 680, 590, 380, 480, 620, 720, 580, 350, 650];
    
    // Gera dados dos últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const month = months[monthIndex];
      
      // Usa valores predefinidos para criar uma curva consistente e variada
      const baseBalance = baseValues[i] || 400;
      
      // Adiciona pequena variação para tornar mais natural
      const variation = (Math.sin(i * 0.5) * 50) + (Math.cos(i * 0.3) * 30);
      const balance = Math.round(baseBalance + variation);
      
      history.push({ month, balance: Math.max(balance, 250) });
    }
    
    return history;
  },

  // Gastos por categoria
  categoryExpenses: [
    { category: 'Mercado', amount: 1200, color: '#3B82F6', percentage: 35 },
    { category: 'Lazer', amount: 800, color: '#EC4899', percentage: 25 },
    { category: 'Aluguel', amount: 600, color: '#10B981', percentage: 20 },
    { category: 'Transporte', amount: 400, color: '#F59E0B', percentage: 20 }
  ] as CategoryExpense[],

  // Estatísticas gerais
  stats: {
    totalBalance: 12450.75,
    monthlyIncome: 8500.00,
    monthlyExpenses: 6200.00,
    savings: 2300.00
  }
}; 