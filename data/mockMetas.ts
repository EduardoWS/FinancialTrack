import { Meta } from '../hooks/useMetas';

// Dados mock das metas
export const mockMetasData: Meta[] = [
  {
    id: '1',
    nome: 'Viagem',
    valorAtual: 3000,
    valorMeta: 10000,
    tipo: 'viagem',
    cor: '#3b82f6',
    icone: '✈️',
    dataInicio: new Date('2023-01-01'),
    dataLimite: new Date('2024-12-31'),
    finalizada: false
  },
  {
    id: '2',
    nome: 'Comprar Casa',
    valorAtual: 60000,
    valorMeta: 300000,
    tipo: 'casa',
    cor: '#ef4444',
    icone: '🏠',
    dataInicio: new Date('2023-01-01'),
    dataLimite: new Date('2028-12-31'),
    finalizada: false
  },
  {
    id: '3',
    nome: 'Investimentos',
    valorAtual: 5500,
    valorMeta: 10000,
    tipo: 'investimentos',
    cor: '#f59e0b',
    icone: '📊',
    dataInicio: new Date('2023-06-01'),
    dataLimite: new Date('2024-06-01'),
    finalizada: false
  },
  {
    id: '4',
    nome: 'Reserva de Emergência',
    valorAtual: 1500,
    valorMeta: 15000,
    tipo: 'emergencia',
    cor: '#10b981',
    icone: '💵',
    dataInicio: new Date('2023-01-01'),
    finalizada: false
  },
  {
    id: '5',
    nome: 'Carro novo',
    valorAtual: 25000,
    valorMeta: 25000,
    tipo: 'outros',
    cor: '#10b981',
    icone: '🚗',
    dataInicio: new Date('2022-01-01'),
    dataLimite: new Date('2023-12-20'),
    finalizada: true
  }
]; 