import { mockMetasData } from '../data/mockMetas';
import { Meta } from '../hooks/useMetas';
import { APP_CONFIG } from './config';

// Interface para os dados de metas
export interface MetasData {
  metas: Meta[];
  metasAtivas: Meta[];
  metasFinalizadas: Meta[];
  estatisticas: {
    totalMetas: number;
    metasFinalizadas: number;
    valorTotalMetas: number;
    valorTotalArrecadado: number;
    percentualGeral: number;
  };
}

// Simula delay de rede
const simulateNetworkDelay = () => 
  new Promise(resolve => setTimeout(resolve, APP_CONFIG.MOCK_DELAY));

// Função para buscar dados das metas
export const fetchMetasData = async (): Promise<MetasData> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/metas`);
      const metas = await response.json();
      return processMetasData(metas);
    } catch (error) {
      console.error('Erro ao buscar metas da API:', error);
      return processMetasData(mockMetasData);
    }
  } else {
    await simulateNetworkDelay();
    return processMetasData(mockMetasData);
  }
};

// Função para processar dados das metas
const processMetasData = (metas: Meta[]): MetasData => {
  const metasAtivas = metas.filter(meta => !meta.finalizada);
  const metasFinalizadas = metas.filter(meta => meta.finalizada);
  
  const estatisticas = {
    totalMetas: metas.length,
    metasFinalizadas: metasFinalizadas.length,
    valorTotalMetas: metas.reduce((acc, meta) => acc + meta.valorMeta, 0),
    valorTotalArrecadado: metas.reduce((acc, meta) => acc + meta.valorAtual, 0),
    percentualGeral: metas.length > 0 
      ? Math.round((metas.reduce((acc, meta) => acc + (meta.valorAtual / meta.valorMeta), 0) / metas.length) * 100)
      : 0
  };

  return {
    metas,
    metasAtivas,
    metasFinalizadas,
    estatisticas
  };
};

// Função para criar nova meta
export const createMeta = async (novaMeta: Omit<Meta, 'id'>): Promise<Meta> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/metas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaMeta)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    const meta: Meta = {
      ...novaMeta,
      id: Date.now().toString()
    };
    return meta;
  }
};

// Função para atualizar meta
export const updateMeta = async (id: string, metaAtualizada: Partial<Meta>): Promise<Meta> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/metas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metaAtualizada)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    return { ...metaAtualizada, id } as Meta;
  }
};

// Função para excluir meta
export const deleteMeta = async (id: string): Promise<void> => {
  if (APP_CONFIG.USE_API) {
    try {
      await fetch(`${APP_CONFIG.API_BASE_URL}/metas/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
  }
};

// Função para adicionar valor à meta
export const addValueToMeta = async (id: string, valor: number): Promise<Meta> => {
  if (APP_CONFIG.USE_API) {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/metas/${id}/add-value`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ valor })
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar valor à meta:', error);
      throw error;
    }
  } else {
    await simulateNetworkDelay();
    // Mock de resposta
    const metaMock = mockMetasData.find(m => m.id === id);
    if (metaMock) {
      const novoValor = metaMock.valorAtual + valor;
      const finalizada = novoValor >= metaMock.valorMeta;
      return { 
        ...metaMock, 
        valorAtual: novoValor,
        finalizada
      };
    }
    throw new Error('Meta não encontrada');
  }
};

// Função para calcular progresso
export const calcularProgresso = (valorAtual: number, valorMeta: number): number => {
  if (valorMeta === 0) return 0;
  return Math.min((valorAtual / valorMeta) * 100, 100);
};

// Função para formatar valores monetários
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}; 