import { useEffect, useState } from 'react';

export interface ReportItem {
  id: string;
  type: 'alert' | 'tip';
  title: string;
  description?: string;
  category?: string;
  severity?: 'low' | 'medium' | 'high';
  createdAt: Date;
  isRead: boolean;
}

export const useReports = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulação de dados - em um app real, viria de uma API
  const generateReports = (): ReportItem[] => {
    return [
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
      }
    ];
  };

  useEffect(() => {
    // Simula carregamento de dados
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const reportsData = generateReports();
        setReports(reportsData);
      } catch (err) {
        setError('Erro ao carregar relatórios');
        console.error('Erro ao carregar relatórios:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Filtros de relatórios
  const alertReports = reports.filter(report => report.type === 'alert');
  const tipReports = reports.filter(report => report.type === 'tip');
  const unreadReports = reports.filter(report => !report.isRead);
  const highPriorityReports = reports.filter(report => report.severity === 'high');

  // Função para marcar como lido
  const markAsRead = (reportId: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, isRead: true }
          : report
      )
    );
  };

  // Função para marcar todos como lidos
  const markAllAsRead = () => {
    setReports(prevReports =>
      prevReports.map(report => ({ ...report, isRead: true }))
    );
  };

  // Função para remover um relatório
  const removeReport = (reportId: string) => {
    setReports(prevReports =>
      prevReports.filter(report => report.id !== reportId)
    );
  };

  // Função para atualizar relatórios
  const refreshReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const reportsData = generateReports();
      setReports(reportsData);
    } catch (err) {
      setError('Erro ao atualizar relatórios');
      console.error('Erro ao atualizar relatórios:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    alertReports,
    tipReports,
    unreadReports,
    highPriorityReports,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeReport,
    refreshReports
  };
}; 