import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import {
  addValueToMeta,
  createMeta,
  deleteMeta,
  fetchUserMetas,
  Meta,
  updateMeta,
} from '../services/metasService';

export const useMetas = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [metasAtivas, setMetasAtivas] = useState<Meta[]>([]);
  const [metasFinalizadas, setMetasFinalizadas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateMetasStates = useCallback((allMetas: Meta[]) => {
    setMetas(allMetas);
    setMetasAtivas(allMetas.filter(m => !m.finalizada));
    setMetasFinalizadas(allMetas.filter(m => m.finalizada));
  }, []);

  const loadMetas = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      const userMetas = await fetchUserMetas();
      updateMetasStates(userMetas);
    } catch (err: any) {
      setError('Erro ao carregar metas');
      console.error('Erro ao carregar metas:', err.message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [updateMetasStates]);

  useEffect(() => {
    if (user) {
      loadMetas();
    } else {
      setMetas([]);
      setMetasAtivas([]);
      setMetasFinalizadas([]);
    }
  }, [user, loadMetas]);

  const adicionarMeta = useCallback(async (metaData: Omit<Meta, 'id'>) => {
    try {
      const novaMeta = await createMeta(metaData);
      
      // Atualização otimista
      const newMetas = [...metas, novaMeta];
      updateMetasStates(newMetas);
      
      // Sincronizar em background sem loading
      loadMetas(false);
    } catch (err: any) {
      setError('Erro ao adicionar meta');
      console.error(err.message);
      // Reverter em caso de erro
      loadMetas(false);
      throw err;
    }
  }, [metas, updateMetasStates, loadMetas]);

  const atualizarMeta = useCallback(async (id: string, metaData: Partial<Omit<Meta, 'id'>>) => {
    try {
      // Atualização otimista
      const updatedMetas = metas.map(meta => 
        meta.id === id ? { ...meta, ...metaData } : meta
      );
      updateMetasStates(updatedMetas);
      
      // Atualizar no servidor em background
      await updateMeta(id, metaData);
      
      // Sincronizar em background sem loading
      loadMetas(false);
    } catch (err: any) {
      setError('Erro ao atualizar meta');
      console.error(err.message);
      // Reverter em caso de erro
      loadMetas(false);
      throw err;
    }
  }, [metas, updateMetasStates, loadMetas]);

  const excluirMeta = useCallback(async (id: string) => {
    try {
      // Atualização otimista
      const filteredMetas = metas.filter(meta => meta.id !== id);
      updateMetasStates(filteredMetas);
      
      // Excluir no servidor em background
      await deleteMeta(id);
      
      // Sincronizar em background sem loading
      loadMetas(false);
    } catch (err: any) {
      setError('Erro ao excluir meta');
      console.error(err.message);
      // Reverter em caso de erro
      loadMetas(false);
      throw err;
    }
  }, [metas, updateMetasStates, loadMetas]);

  const adicionarValorMeta = useCallback(async (id: string, valor: number) => {
    try {
      // Atualização otimista
      const updatedMetas = metas.map(meta => {
        if (meta.id === id) {
          const novoValor = meta.valorAtual + valor;
          const finalizada = novoValor >= meta.valorMeta;
          return { ...meta, valorAtual: novoValor, finalizada };
        }
        return meta;
      });
      updateMetasStates(updatedMetas);
      
      // Atualizar no servidor em background
      await addValueToMeta(id, valor);
      
      // Sincronizar em background sem loading
      loadMetas(false);
    } catch (err: any) {
      setError('Erro ao adicionar valor à meta');
      console.error(err.message);
      // Reverter em caso de erro
      loadMetas(false);
      throw err;
    }
  }, [metas, updateMetasStates, loadMetas]);
  
  const calcularProgresso = (valorAtual: number, valorMeta: number): number => {
    if (valorMeta === 0) return 0;
    return Math.min((valorAtual / valorMeta) * 100, 100);
  };
  
  const finalizarMeta = useCallback(async (id: string) => {
    try {
      // Atualização otimista
      const updatedMetas = metas.map(meta => 
        meta.id === id ? { ...meta, finalizada: true } : meta
      );
      updateMetasStates(updatedMetas);
      
      // Atualizar no servidor em background
      await updateMeta(id, { finalizada: true });
      
      // Sincronizar em background sem loading
      loadMetas(false);
    } catch (err: any) {
      setError('Erro ao finalizar meta');
      console.error(err.message);
      // Reverter em caso de erro
      loadMetas(false);
      throw err;
    }
  }, [metas, updateMetasStates, loadMetas]);

  return {
    metas,
    metasAtivas,
    metasFinalizadas,
    loading,
    error,
    adicionarMeta,
    atualizarMeta,
    excluirMeta,
    adicionarValorMeta,
    finalizarMeta,
    calcularProgresso,
    atualizarMetas: loadMetas,
  };
}; 