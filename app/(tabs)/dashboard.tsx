import React, { useMemo } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';
import Card from '../../components/atoms/Card';
import ScreenLoader from '../../components/atoms/ScreenLoader';
import Header from '../../components/Header';
import BalanceHistoryChart from '../../components/molecules/BalanceHistoryChart';
import CategoryExpensesChart from '../../components/molecules/CategoryExpensesChart';
import MonthlyActivityChart from '../../components/molecules/MonthlyActivityChart';
import RecentTransactions from '../../components/molecules/RecentTransactions';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useScreenSize } from '../../hooks/useScreenSize';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';

const DashboardScreen = () => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
  const { data, loading, error, refetch } = useDashboardData();
  const isDark = theme === 'dark';

  // Dados de receita/despesa dos últimos 6 meses
  const monthlyActivity = useMemo(() => {
    if (!data?.allTransactions) return null;

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();

    return Array.from({ length: 6 }).map((_, idx) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      const monthIndex = date.getMonth();
      const label = months[monthIndex];

      const monthTransactions = data.allTransactions.filter(t => {
        const tDate = t.date instanceof Date ? t.date : new Date(t.date);
        return tDate.getMonth() === monthIndex && tDate.getFullYear() === date.getFullYear();
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return { month: label, income, expense };
    });
  }, [data?.allTransactions]);

  // Componente de loading
  if (loading && !data) {
    return <ScreenLoader title="Dashboard" text="Carregando dados do dashboard..." />;
  }

  // Componente de erro
  if (error && !data) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="Dashboard" />
        <View className="flex-1 justify-center items-center p-4">
          <Text className={`text-center mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </Text>
          <Text
            className={`text-center font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
            onPress={refetch}
          >
            Tentar novamente
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Dashboard" />
      
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[isDark ? '#60A5FA' : '#3B82F6']}
            tintColor={isDark ? '#60A5FA' : '#3B82F6'}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isMobile ? 20 : 0 }}
      >
        <View className="p-4">
          {/* Saudação */}
          <Text className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${
            isDark ? 'text-white' : 'text-gray-800'
          } mb-6`}>
            Bem-vindo ao seu Dashboard!
          </Text>

          {/* Cards de estatísticas principais */}
          <View className={`${isMobile ? '' : 'flex-row flex-wrap gap-4'} mb-6`}>
            {/* Saldo Total */}
            <View className={`${isMobile ? 'w-full mb-4' : 'flex-1 min-w-[150px]'}`}>
              <Card className="items-center p-4">
                <Text className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Saldo Total
                </Text>
                <Text className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatCurrency(data?.stats.totalBalance || 0)}
                </Text>
              </Card>
            </View>

            {/* Receitas e Gastos lado a lado no mobile */}
            <View className={isMobile ? 'flex-row' : 'contents'}>
              {/* Receitas do Mês */}
              <View className={isMobile ? 'flex-1 mr-2' : 'flex-1 min-w-[150px]'}>
                <Card className="items-center p-4">
                  <Text className={`text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Receitas do Mês
                  </Text>
                  <Text className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mt-1 text-green-600`}>
                    {formatCurrency(data?.stats.monthlyIncome || 0)}
                  </Text>
                </Card>
              </View>

              {/* Gastos do Mês */}
              <View className={isMobile ? 'flex-1 ml-2' : 'flex-1 min-w-[150px]'}>
                <Card className="items-center p-4">
                  <Text className={`text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Gastos do Mês
                  </Text>
                  <Text className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mt-1 text-red-600`}>
                    {formatCurrency(data?.stats.monthlyExpenses || 0)}
                  </Text>
                </Card>
              </View>
            </View>
          </View>

          {/* Gráficos e componentes */}
          <View className={`${isMobile ? '' : 'flex-row space-x-4 mb-6'}`}>
            {/* Atividade Semanal */}
            <View className={`${isMobile ? 'w-full mb-6' : 'flex-1'}`}>
              {monthlyActivity && (
                <MonthlyActivityChart data={monthlyActivity} />
              )}
            </View>

            {/* Últimas Transações */}
            <View className={`${isMobile ? 'w-full mb-6' : 'flex-1'}`}>
              {data?.recentTransactions && data?.allTransactions && (
                <RecentTransactions 
                  transactions={data.recentTransactions} 
                  allTransactions={data.allTransactions}
                  maxTransactions={isMobile ? 4 : 4}
                />
              )}
            </View>
          </View>

          {/* Gráficos em coluna única no mobile, lado a lado no desktop */}
          <View className={isMobile ? '' : 'flex-row space-x-4'}>
            {/* Histórico de Saldo */}
            <View className={`${isMobile ? 'w-full mb-6' : 'flex-1'}`}>
              {data?.balanceHistory && (
                <BalanceHistoryChart data={data.balanceHistory} />
              )}
            </View>

            {/* Gastos por Categoria */}
            <View className={isMobile ? 'w-full' : 'flex-1'}>
              {data?.categoryExpenses && (
                <CategoryExpensesChart data={data.categoryExpenses} />
              )}
            </View>
          </View>

          {/* Espaçamento inferior para scroll */}
          <View className="h-6" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;