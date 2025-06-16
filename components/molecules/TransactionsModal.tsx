import React from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Transaction } from '../../data/mockData';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';

interface TransactionsModalProps {
  visible: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const TransactionsModal: React.FC<TransactionsModalProps> = ({ 
  visible, 
  onClose, 
  transactions 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? '↑' : '↓';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Fundo desfocado */}
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
        {/* Container do modal centralizado */}
        <View 
          className={`
            rounded-2xl shadow-2xl
            ${isDark ? 'bg-gray-800' : 'bg-white'}
          `}
          style={{
            width: Math.min(screenWidth * 0.9, 600),
            maxHeight: screenHeight * 0.8
          }}
        >
          {/* Header */}
          <View className={`
            flex-row items-center justify-between p-6 border-b
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <Text className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Todas as Transações
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className={`
                w-8 h-8 rounded-full items-center justify-center
                ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
              `}
            >
              <Text className={`text-lg font-bold ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lista de transações */}
          <ScrollView 
            className="flex-1 px-6 py-4"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: screenHeight * 0.8 - 160 }}
          >
            <View className="space-y-3">
              {transactions.map((transaction) => (
                <View 
                  key={transaction.id}
                  className={`
                    flex-row items-center justify-between p-4 rounded-xl
                    ${isDark ? 'bg-gray-750' : 'bg-gray-50'}
                  `}
                >
                  {/* Ícone e informações */}
                  <View className="flex-row items-center flex-1">
                    {/* Ícone da transação */}
                    <View className={`
                      w-12 h-12 rounded-full items-center justify-center mr-4
                      ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}
                    `}>
                      <Text className={`
                        text-xl font-bold
                        ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                      `}>
                        {getTransactionIcon(transaction.type)}
                      </Text>
                    </View>

                    {/* Informações da transação */}
                    <View className="flex-1">
                      <Text className={`
                        font-semibold text-base
                        ${isDark ? 'text-white' : 'text-gray-900'}
                      `}>
                        {transaction.description}
                      </Text>
                      <Text className={`
                        text-sm mt-1
                        ${isDark ? 'text-gray-400' : 'text-gray-500'}
                      `}>
                        {transaction.date} • {transaction.category}
                      </Text>
                    </View>
                  </View>

                  {/* Valor */}
                  <View className="items-end">
                    <Text className={`
                      font-bold text-lg
                      ${getAmountColor(transaction.type)}
                    `}>
                      {transaction.type === 'income' ? '+' : ''}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Espaçamento inferior */}
            <View className="h-4" />
          </ScrollView>

          {/* Footer com resumo */}
          <View className={`
            p-6 border-t
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <View className="flex-row justify-between">
              <Text className={`font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Total de transações:
              </Text>
              <Text className={`font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {transactions.length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionsModal; 