import { ReportItem } from '../hooks/useReports';

// Dados mock dos relatórios
export const mockRelatoriosData: ReportItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Você está gastando muito em Lazer!',
    description: 'Seus gastos com lazer aumentaram 45% este mês comparado ao anterior.',
    category: 'Lazer',
    severity: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    isRead: false
  },
  {
    id: '2',
    type: 'tip',
    title: 'Revise seu orçamento mensal para evitar despesas inesperadas!',
    description: 'Uma revisão mensal do orçamento pode ajudar a identificar gastos desnecessários.',
    severity: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
    isRead: false
  },
  {
    id: '3',
    type: 'alert',
    title: 'Você está desviando de sua meta de Poupança!',
    description: 'Você está 30% abaixo da meta estabelecida para este mês.',
    category: 'Poupança',
    severity: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 dias atrás
    isRead: false
  },
  {
    id: '4',
    type: 'tip',
    title: 'Reveja o saldo de suas dívidas e foque em pagar as de maior taxa de juros!',
    description: 'Priorizar dívidas com juros mais altos pode economizar dinheiro a longo prazo.',
    severity: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 dias atrás
    isRead: true
  },
  {
    id: '5',
    type: 'alert',
    title: 'Limite de cartão de crédito está próximo!',
    description: 'Você já utilizou 85% do limite disponível no cartão principal.',
    category: 'Cartão de Crédito',
    severity: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 dias atrás
    isRead: true
  },
  {
    id: '6',
    type: 'tip',
    title: 'Considere investir em renda fixa!',
    description: 'Com o valor atual em conta corrente, você pode obter melhores rendimentos.',
    severity: 'low',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168), // 1 semana atrás
    isRead: false
  },
  {
    id: '7',
    type: 'alert',
    title: 'Gasto excessivo em alimentação!',
    description: 'Seus gastos com restaurantes e delivery aumentaram 60% este mês.',
    category: 'Alimentação',
    severity: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 192), // 8 dias atrás
    isRead: false
  },
  {
    id: '8',
    type: 'tip',
    title: 'Aproveite as promoções de final de ano!',
    description: 'É uma boa época para fazer compras planejadas com desconto.',
    severity: 'low',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240), // 10 dias atrás
    isRead: true
  }
]; 