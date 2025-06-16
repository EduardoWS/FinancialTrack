import { useState } from 'react';

export interface Meta {
  id: string;
  nome: string;
  valorAtual: number;
  valorMeta: number;
  tipo: 'viagem' | 'casa' | 'investimentos' | 'emergencia' | 'outros';
  cor: string;
  icone: string;
  dataInicio: Date;
  dataLimite?: Date;
  descricao?: string;
  finalizada: boolean;
}

export const useMetas = () => {
  const [metas, setMetas] = useState<Meta[]>([
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
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metasAtivas = metas.filter(meta => !meta.finalizada);
  const metasFinalizadas = metas.filter(meta => meta.finalizada);

  const calcularProgresso = (valorAtual: number, valorMeta: number): number => {
    if (valorMeta === 0) return 0;
    return Math.min((valorAtual / valorMeta) * 100, 100);
  };

  const adicionarMeta = (novaMeta: Omit<Meta, 'id'>) => {
    const meta: Meta = {
      ...novaMeta,
      id: Date.now().toString(),
    };
    setMetas(prev => [...prev, meta]);
  };

  const atualizarMeta = (id: string, metaAtualizada: Partial<Meta>) => {
    setMetas(prev => prev.map(meta => 
      meta.id === id ? { ...meta, ...metaAtualizada } : meta
    ));
  };

  const excluirMeta = (id: string) => {
    setMetas(prev => prev.filter(meta => meta.id !== id));
  };

  const adicionarValorMeta = (id: string, valor: number) => {
    setMetas(prev => prev.map(meta => {
      if (meta.id === id) {
        const novoValor = meta.valorAtual + valor;
        const finalizada = novoValor >= meta.valorMeta;
        return { 
          ...meta, 
          valorAtual: novoValor,
          finalizada
        };
      }
      return meta;
    }));
  };

  const finalizarMeta = (id: string) => {
    setMetas(prev => prev.map(meta => 
      meta.id === id ? { ...meta, finalizada: true } : meta
    ));
  };

  return {
    metas,
    metasAtivas,
    metasFinalizadas,
    loading,
    error,
    calcularProgresso,
    adicionarMeta,
    atualizarMeta,
    excluirMeta,
    adicionarValorMeta,
    finalizarMeta
  };
}; 