import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Transaction } from '../../data/mockData';
import { useScreenSize } from '../../hooks/useScreenSize';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';
import TransactionsModal from './TransactionsModal';

interface RecentTransactionsProps {
  transactions: Transaction[];
  allTransactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, allTransactions }) => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
  const isDark = theme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? '↑' : '↓';
  };

  // Altura fixa para mobile
  const cardHeight = isMobile ? 300 : undefined;

  return (
    <>
      <Card 
        className="" 
        style={cardHeight ? { height: cardHeight } : { minHeight: 400 }}
      >
        <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Últimas Transações
        </Text>
        
        <View className={`${isMobile ? 'space-y-2' : 'space-y-3'} flex-1`}>
          {transactions.slice(0, isMobile ? 4 : transactions.length).map((transaction) => (
            <View 
              key={transaction.id}
              className="flex-row items-center justify-between py-2"
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
                    {transaction.date}
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
          ))}
        </View>

        {/* Botão ver mais */}
        <View className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="py-2"
          >
            <Text className={`
              text-center text-sm font-medium
              ${isDark ? 'text-blue-400' : 'text-blue-600'}
            `}>
              Ver todas as transações
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Modal de todas as transações */}
      <TransactionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        transactions={allTransactions}
      />
    </>
  );
};

export default RecentTransactions; 