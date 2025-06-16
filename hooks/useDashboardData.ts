import { useEffect, useState } from 'react';
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro no hook useDashboardData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => {
    await fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}; 