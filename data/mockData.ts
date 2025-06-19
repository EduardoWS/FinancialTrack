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
      date: '28 janeiro 2025',
      category: 'Aluguel'
    },
    {
      id: '2', 
      description: 'Pedro Henrique',
      amount: 2500,
      type: 'income' as const,
      date: '25 janeiro 2025',
      category: 'Empréstimo'
    },
    {
      id: '3',
      description: 'João Vitor',
      amount: 5400,
      type: 'income' as const,
      date: '25 janeiro 2025',
      category: 'Empréstimo'
    },
    {
      id: '4',
      description: 'Assinatura Spotify',
      amount: -20.90,
      type: 'expense' as const,
      date: '20 janeiro 2025',
      category: 'Outros'
    },
    {
      id: '5',
      description: 'Compra mercado',
      amount: -875.63,
      type: 'expense' as const,
      date: '19 janeiro 2025',
      category: 'Mercado'
    },
    {
      id: '6',
      description: 'Salário Janeiro',
      amount: 4500,
      type: 'income' as const,
      date: '18 janeiro 2025',
      category: 'Salário'
    },
    {
      id: '7',
      description: 'Conta de Luz',
      amount: -180.45,
      type: 'expense' as const,
      date: '17 janeiro 2025',
      category: 'Moradia'
    },
    {
      id: '8',
      description: 'Freelance Design',
      amount: 1200,
      type: 'income' as const,
      date: '16 janeiro 2025',
      category: 'Freelance'
    },
    {
      id: '9',
      description: 'Gasolina',
      amount: -95.80,
      type: 'expense' as const,
      date: '15 janeiro 2025',
      category: 'Transporte'
    },
    {
      id: '10',
      description: 'Transferência Recebida',
      amount: 500,
      type: 'income' as const,
      date: '14 janeiro 2025',
      category: 'Transferência'
    },
    {
      id: '11',
      description: 'Farmácia São João',
      amount: -89.90,
      type: 'expense' as const,
      date: '13 janeiro 2025',
      category: 'Saúde'
    },
    {
      id: '12',
      description: 'Cinema Shopping',
      amount: -45.00,
      type: 'expense' as const,
      date: '12 janeiro 2025',
      category: 'Lazer'
    },
    {
      id: '13',
      description: 'Uber',
      amount: -25.50,
      type: 'expense' as const,
      date: '11 janeiro 2025',
      category: 'Transporte'
    },
    {
      id: '14',
      description: 'Curso Online',
      amount: -199.90,
      type: 'expense' as const,
      date: '10 janeiro 2025',
      category: 'Educação'
    },
    {
      id: '15',
      description: 'Venda de Item',
      amount: 300,
      type: 'income' as const,
      date: '09 janeiro 2025',
      category: 'Outros'
    },
    {
      id: '16',
      description: 'Restaurante',
      amount: -89.50,
      type: 'expense' as const,
      date: '08 janeiro 2025',
      category: 'Lazer'
    },
    {
      id: '17',
      description: 'Internet',
      amount: -79.90,
      type: 'expense' as const,
      date: '07 janeiro 2025',
      category: 'Moradia'
    },
    {
      id: '18',
      description: 'Consultório Médico',
      amount: -150.00,
      type: 'expense' as const,
      date: '06 janeiro 2025',
      category: 'Saúde'
    }
  ] as Transaction[],

  // Últimas N transações para exibição rápida
  get recentTransactions() {
    return this.allTransactions.slice(0, 4);
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
  }
}; 