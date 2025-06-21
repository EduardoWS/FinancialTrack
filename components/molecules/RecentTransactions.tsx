import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useScreenSize } from '../../hooks/useScreenSize';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';
import { Transaction } from '../../services/transacoesService';
import Card from '../atoms/Card';
import TransactionsModal from './TransactionsModal';

interface RecentTransactionsProps {
  transactions: Transaction[];
  allTransactions: Transaction[];
  maxTransactions?: number; // Número configurável de transações a mostrar
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  allTransactions,
  maxTransactions = 3 // Valor padrão
}) => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
  const isDark = theme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  // Filtrar transações do mês corrente
  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return allTransactions.filter(transaction => {
      const transactionDate = typeof transaction.date === 'string' 
        ? new Date(transaction.date) 
        : transaction.date;
      
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    }).sort((a, b) => {
      const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
      const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
      return dateB.getTime() - dateA.getTime(); // Mais recentes primeiro
    });
  }, [allTransactions]);

  // Transações recentes do mês corrente (limitadas)
  const recentCurrentMonthTransactions = useMemo(() => {
    const limit = maxTransactions;
    return currentMonthTransactions.slice(0, limit);
  }, [currentMonthTransactions, isMobile, maxTransactions]);

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? '↑' : '↓';
  };

  // Altura fixa para mobile
  const cardHeight = isMobile ? 300 : undefined;

  // Nome do mês atual
  const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <>
      <Card 
        className="" 
        style={cardHeight ? { height: cardHeight } : { minHeight: 400 }}
      >
        <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Últimas Transações de {currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)}
        </Text>
        
        <View className={`${isMobile ? 'space-y-2' : 'space-y-3'} flex-1`}>
          {recentCurrentMonthTransactions.length > 0 ? (
            recentCurrentMonthTransactions.map((transaction) => (
              <View 
                key={transaction.id}
                className={`${isMobile ? 'mb-2' : '' } flex-row items-center justify-between py-2`}
              >
                {/* Ícone e informações */}
                <View className="flex-row items-center flex-1">
                  {/* Ícone da transação */}
                  <View className={`
                    ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full items-center justify-center mr-3
                    ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}
                  `}>
                    <Text className={`
                      ${isMobile ? 'text-base' : 'text-lg'} font-bold
                      ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                    `}>
                      {getTransactionIcon(transaction.type)}
                    </Text>
                  </View>

                  {/* Informações da transação */}
                  <View className="flex-1">
                    <Text className={`
                      font-medium ${isMobile ? 'text-sm' : ''}
                      ${isDark ? 'text-white' : 'text-gray-900'}
                    `}>
                      {transaction.description}
                    </Text>
                    <Text className={`
                      text-xs ${isMobile ? '' : 'text-sm'}
                      ${isDark ? 'text-gray-400' : 'text-gray-500'}
                    `}>
                      {typeof transaction.date === 'string' ? transaction.date : transaction.date.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                </View>

                {/* Valor */}
                <View className="items-end">
                  <Text className={`
                    font-semibold ${isMobile ? 'text-sm' : 'text-base'}
                    ${getAmountColor(transaction.type)}
                  `}>
                    {transaction.type === 'income' ? '+' : ''}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Nenhuma transação encontrada para {currentMonthName}
              </Text>
            </View>
          )}
        </View>

        {/* Botão ver mais */}
        {currentMonthTransactions.length > 0 && (
          <View className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="py-2"
            >
              <Text className={`
                text-center text-sm font-medium
                ${isDark ? 'text-blue-400' : 'text-blue-600'}
              `}>
                Ver todas as transações de {currentMonthName}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      {/* Modal de todas as transações do mês */}
      <TransactionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        transactions={currentMonthTransactions}
      />
    </>
    );
};

export default RecentTransactions; 