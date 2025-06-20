import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { DashboardData, fetchDashboardData } from '../services/dashboardService';

interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
    } catch (err: any) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro no hook useDashboardData:', err.message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  // Recarregar dados quando o usuário mudar (login/logout)
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Limpar dados se o usuário fizer logout
      setData(null);
      setLoading(false);
    }
  }, [user, fetchData]);

  const refetch = async () => {
    await fetchData(true);
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}; 