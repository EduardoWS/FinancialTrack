import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Transaction } from '../../data/mockData';
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
  const isDark = theme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? '↑' : '↓';
  };

  return (
    <>
      <Card className="min-h-[400px]">
        <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Últimas Transações
        </Text>
        
        <View className="space-y-3">
          {transactions.map((transaction) => (
            <View 
              key={transaction.id}
              className="flex-row items-center justify-between py-2"
            >
              {/* Ícone e informações */}
              <View className="flex-row items-center flex-1">
                {/* Ícone da transação */}
                <View className={`
                  w-10 h-10 rounded-full items-center justify-center mr-3
                  ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}
                `}>
                  <Text className={`
                    text-lg font-bold
                    ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                  `}>
                    {getTransactionIcon(transaction.type)}
                  </Text>
                </View>

                {/* Informações da transação */}
                <View className="flex-1">
                  <Text className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    {transaction.description}
                  </Text>
                  <Text className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    {transaction.date}
                  </Text>
                </View>
              </View>

              {/* Valor */}
              <View className="items-end">
                <Text className={`
                  font-semibold text-base
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
        <View className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
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