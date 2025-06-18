import { mockRelatoriosData } from '../data/mockRelatorios';
import { ReportItem } from '../hooks/useReports';
import { APP_CONFIG } from './config';

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
  new Promise(resolve => setTimeout(resolve, APP_CONFIG.MOCK_DELAY));

// Função para buscar dados dos relatórios
export const fetchRelatoriosData = async (): Promise<RelatoriosData> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/relatorios`);
      const reports = await response.json();
      return processRelatoriosData(reports);
    } catch (error) {
      console.error('Erro ao buscar relatórios da API:', error);
      return processRelatoriosData(mockRelatoriosData);
    }
  } else {
    await simulateNetworkDelay();
    return processRelatoriosData(mockRelatoriosData);
  }
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
  if (APP_CONFIG.USE_API) {
    try {
      await fetch(`${APP_CONFIG.API_BASE_URL}/relatorios/${reportId}/mark-read`, {
        method: 'PATCH'
      });
    } catch (error) {
      console.error('Erro ao marcar relatório como lido:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
  }
};

// Função para marcar todos os relatórios como lidos
export const markAllReportsAsRead = async (): Promise<void> => {
  if (APP_CONFIG.USE_API) {
    try {
      await fetch(`${APP_CONFIG.API_BASE_URL}/relatorios/mark-all-read`, {
        method: 'PATCH'
      });
    } catch (error) {
      console.error('Erro ao marcar todos os relatórios como lidos:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
  }
};

// Função para remover relatório
export const removeReport = async (reportId: string): Promise<void> => {
  if (APP_CONFIG.USE_API) {
    try {
      await fetch(`${APP_CONFIG.API_BASE_URL}/relatorios/${reportId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Erro ao remover relatório:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
  }
};

// Função para atualizar/gerar novos relatórios
export const refreshReports = async (): Promise<RelatoriosData> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/relatorios/refresh`, {
        method: 'POST'
      });
      const reports = await response.json();
      return processRelatoriosData(reports);
    } catch (error) {
      console.error('Erro ao atualizar relatórios:', error);
      return processRelatoriosData(mockRelatoriosData);
    }
  } else {
    await simulateNetworkDelay();
    return processRelatoriosData(mockRelatoriosData);
  }
};

// Função para criar novo relatório personalizado
export const createCustomReport = async (reportData: Omit<ReportItem, 'id' | 'createdAt'>): Promise<ReportItem> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/relatorios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    const newReport: ReportItem = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    return newReport;
  }
};

// Função para filtrar relatórios por período
export const getReportsByDateRange = async (startDate: Date, endDate: Date): Promise<ReportItem[]> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(
        `${APP_CONFIG.API_BASE_URL}/relatorios?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar relatórios por período:', error);
      return mockRelatoriosData.filter(
        report => report.createdAt >= startDate && report.createdAt <= endDate
      );
    }
  } else {
    await simulateNetworkDelay();
    return mockRelatoriosData.filter(
      report => report.createdAt >= startDate && report.createdAt <= endDate
    );
  }
}; 