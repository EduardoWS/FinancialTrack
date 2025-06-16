import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';
import Card from '../../components/atoms/Card';
import LoadingSpinner from '../../components/atoms/LoadingSpinner';
import Header from '../../components/Header';
import BalanceHistoryChart from '../../components/molecules/BalanceHistoryChart';
import CategoryExpensesChart from '../../components/molecules/CategoryExpensesChart';
import RecentTransactions from '../../components/molecules/RecentTransactions';
import WeeklyActivityChart from '../../components/molecules/WeeklyActivityChart';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';

const DashboardScreen = () => {
  const { theme } = useTheme();
  const { data, loading, error, refetch } = useDashboardData();
  const isDark = theme === 'dark';

  // Componente de loading
  if (loading && !data) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="Dashboard" />
        <LoadingSpinner 
          className="flex-1" 
          text="Carregando dados do dashboard..." 
        />
      </SafeAreaView>
    );
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
      >
        <View className="p-4 space-y-4">
          {/* Saudação */}
          <Text className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Bem-vindo ao seu Dashboard!
          </Text>

          {/* Cards de estatísticas principais */}
          <View className="flex-row flex-wrap gap-4 mb-4">
            {/* Saldo Total */}
            <View className="flex-1 min-w-[150px]">
              <Card className="items-center">
                <Text className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Saldo Total
                </Text>
                <Text className={`text-2xl font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatCurrency(data?.stats.totalBalance || 0)}
                </Text>
              </Card>
            </View>

            {/* Receitas do Mês */}
            <View className="flex-1 min-w-[150px]">
              <Card className="items-center">
                <Text className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Receitas
                </Text>
                <Text className="text-2xl font-bold mt-1 text-green-600">
                  {formatCurrency(data?.stats.monthlyIncome || 0)}
                </Text>
              </Card>
            </View>

            {/* Gastos do Mês */}
            <View className="flex-1 min-w-[150px]">
              <Card className="items-center">
                <Text className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Gastos
                </Text>
                <Text className="text-2xl font-bold mt-1 text-red-600">
                  {formatCurrency(data?.stats.monthlyExpenses || 0)}
                </Text>
              </Card>
            </View>
          </View>

          {/* Layout responsivo para desktop e mobile */}
          <View className="space-y-4">
            {/* Primeira Linha */}
            <View className="flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
              {/* Atividade Semanal */}
              <View className="flex-1">
                {data?.weeklyActivity && (
                  <WeeklyActivityChart data={data.weeklyActivity} />
                )}
              </View>

              {/* Últimas Transações */}
              <View className="flex-1">
                {data?.recentTransactions && data?.allTransactions && (
                  <RecentTransactions 
                    transactions={data.recentTransactions} 
                    allTransactions={data.allTransactions}
                  />
                )}
              </View>
            </View>

            {/* Segunda Linha */}
            <View className="flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
              {/* Histórico de Saldo */}
              <View className="flex-1">
                {data?.balanceHistory && (
                  <BalanceHistoryChart data={data.balanceHistory} />
                )}
              </View>

              {/* Gastos por Categoria */}
              <View className="flex-1">
                {data?.categoryExpenses && (
                  <CategoryExpensesChart data={data.categoryExpenses} />
                )}
              </View>
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