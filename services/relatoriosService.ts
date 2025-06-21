import { mockRelatoriosData } from '../data/mockRelatorios';
import { ReportItem } from '../hooks/useReports';

// Interface para os dados dos relatórios
export interface RelatoriosData {
  reports: ReportItem[];
  alertReports: ReportItem[];
  tipReports: ReportItem[];
  unreadReports: ReportItem[];
  highPriorityReports: ReportItem[];
  estatisticas: {
    totalReports: number;
    alertsCount: number;
    tipsCount: number;
    unreadCount: number;
    highPriorityCount: number;
  };
}

// Simula delay de rede
const simulateNetworkDelay = () => 
  new Promise(resolve => setTimeout(resolve, 1000));

// Função para buscar dados dos relatórios
export const fetchRelatoriosData = async (): Promise<RelatoriosData> => {
  // Por enquanto usando dados mock até integrar com Firebase
  await simulateNetworkDelay();
  return processRelatoriosData(mockRelatoriosData);
};

// Função para processar dados dos relatórios
const processRelatoriosData = (reports: ReportItem[]): RelatoriosData => {
  const alertReports = reports.filter(report => report.type === 'alert');
  const tipReports = reports.filter(report => report.type === 'tip');
  const unreadReports = reports.filter(report => !report.isRead);
  const highPriorityReports = reports.filter(report => report.severity === 'high');

  const estatisticas = {
    totalReports: reports.length,
    alertsCount: alertReports.length,
    tipsCount: tipReports.length,
    unreadCount: unreadReports.length,
    highPriorityCount: highPriorityReports.length
  };

  return {
    reports,
    alertReports,
    tipReports,
    unreadReports,
    highPriorityReports,
    estatisticas
  };
};

// Função para marcar relatório como lido
export const markReportAsRead = async (reportId: string): Promise<void> => {
  await simulateNetworkDelay();
  // TODO: Integrar com Firebase quando necessário
};

// Função para marcar todos os relatórios como lidos
export const markAllReportsAsRead = async (): Promise<void> => {
  await simulateNetworkDelay();
  // TODO: Integrar com Firebase quando necessário
};

// Função para remover relatório
export const removeReport = async (reportId: string): Promise<void> => {
  await simulateNetworkDelay();
  // TODO: Integrar com Firebase quando necessário
};

// Função para atualizar/gerar novos relatórios
export const refreshReports = async (): Promise<RelatoriosData> => {
  await simulateNetworkDelay();
  return processRelatoriosData(mockRelatoriosData);
};

// Função para criar novo relatório personalizado
export const createCustomReport = async (reportData: Omit<ReportItem, 'id' | 'createdAt'>): Promise<ReportItem> => {
  await simulateNetworkDelay();
  const newReport: ReportItem = {
    ...reportData,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  return newReport;
};

// Função para filtrar relatórios por período
export const getReportsByDateRange = async (startDate: Date, endDate: Date): Promise<ReportItem[]> => {
  await simulateNetworkDelay();
  return mockRelatoriosData.filter(
    report => report.createdAt >= startDate && report.createdAt <= endDate
  );
}; 