import { Transaction } from '../services/transacoesService';

// Dados mock das transações - reutilizando os dados do dashboard
export const mockTransacoesData: Transaction[] = [
  {
    id: '1',
    description: 'Pagamento aluguel',
    amount: -3500,
    type: 'expense' as const,
    date: '28 janeiro 2025',
    category: 'Moradia'
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
    category: 'Streaming'
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
    category: 'Combustível'
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
    category: 'Vendas Online'
  },
  {
    id: '16',
    description: 'Restaurante',
    amount: -89.50,
    type: 'expense' as const,
    date: '08 janeiro 2025',
    category: 'Fast Food'
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
  },
  {
    id: '19',
    description: 'Freelance Janeiro',
    amount: 1800,
    type: 'income' as const,
    date: '05 janeiro 2025',
    category: 'Freelance'
  },
  {
    id: '20',
    description: 'Academia Mensal',
    amount: -120.00,
    type: 'expense' as const,
    date: '04 janeiro 2025',
    category: 'Academia'
  },
  {
    id: '21',
    description: 'Netflix',
    amount: -29.90,
    type: 'expense' as const,
    date: '03 janeiro 2025',
    category: 'Streaming'
  },
  {
    id: '22',
    description: 'Consultoria TI',
    amount: 2200,
    type: 'income' as const,
    date: '02 janeiro 2025',
    category: 'Consultoria'
  },
  {
    id: '23',
    description: 'Compras Roupas',
    amount: -350.00,
    type: 'expense' as const,
    date: '01 janeiro 2025',
    category: 'Roupas'
  },
  {
    id: '24',
    description: 'Dividendos',
    amount: 180.50,
    type: 'income' as const,
    date: '31 dezembro 2024',
    category: 'Investimentos'
  },
  {
    id: '25',
    description: 'Mercado Dezembro',
    amount: -420.80,
    type: 'expense' as const,
    date: '30 dezembro 2024',
    category: 'Mercado'
  }
]; 