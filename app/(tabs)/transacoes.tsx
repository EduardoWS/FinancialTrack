import React, { useState } from "react";
import { Dimensions, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { errorToast, successToast } from '../../components/atoms/custom-toasts';
import ScreenLoader from '../../components/atoms/ScreenLoader';
import Header from '../../components/Header';
import AddTransactionModal from '../../components/molecules/AddTransactionModal';
import { FilterType, useTransactions } from '../../hooks/useTransactions';
import { useTheme } from '../../services/ThemeContext';
import { formatCurrency } from '../../services/transacoesService';

const TransacoesScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const showCategory = width >= 500;
  
  const [modalVisible, setModalVisible] = useState(false);

  // Hook customizado para gerenciar transações
  const {
    transactions,
    incomeTransactions,
    expenseTransactions,
    filteredTransactions,
    activeFilter,
    currentPage,
    totalPages,
    paginatedTransactions,
    loading,
    error,
    setActiveFilter,
    setCurrentPage,
    adicionarTransacao,
    refreshTransactions
  } = useTransactions(5);

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? '↑' : '↓';
  };

  const FilterButton = ({ 
    filter, 
    label, 
    count 
  }: { 
    filter: FilterType; 
    label: string; 
    count: number;
  }) => {
    const isActive = activeFilter === filter;
    
    return (
      <TouchableOpacity
        onPress={() => setActiveFilter(filter)}
        className={`
          ${isMobile 
            ? 'flex-1 py-2 px-1 rounded-lg border items-center mx-1'
            : 'px-4 py-2 rounded-full border-2 min-w-[100px] items-center'
          }
          ${isActive 
            ? (isDark ? 'bg-blue-600 border-blue-600' : 'bg-blue-600 border-blue-600')
            : (isDark ? 'bg-transparent border-gray-600' : 'bg-transparent border-gray-300')
          }
        `}
      >
        <Text className={`
          font-medium text-center
          ${isMobile ? 'text-xs' : 'text-sm'}
          ${isActive 
            ? 'text-white' 
            : (isDark ? 'text-gray-300' : 'text-gray-700')
          }
        `}>
          {label}
        </Text>
        <Text className={`
          text-xs mt-1
          ${isActive 
            ? 'text-blue-100' 
            : (isDark ? 'text-gray-400' : 'text-gray-500')
          }
        `}>
          {count}
        </Text>
      </TouchableOpacity>
    );
  };

  const PaginationButton = ({ 
    page, 
    isActive, 
    onPress 
  }: { 
    page: number; 
    isActive: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`
        w-10 h-10 rounded-lg items-center justify-center
        ${isActive 
          ? (isDark ? 'bg-blue-600' : 'bg-blue-600')
          : (isDark ? 'bg-gray-700' : 'bg-gray-200')
        }
      `}
    >
      <Text className={`
        font-medium
        ${isActive 
          ? 'text-white' 
          : (isDark ? 'text-gray-300' : 'text-gray-700')
        }
      `}>
        {page}
      </Text>
    </TouchableOpacity>
  );

  const handleAddTransaction = async (transactionData: any) => {
    try {
      await adicionarTransacao(transactionData);
      successToast('Transação adicionada com sucesso!');
      setModalVisible(false);
    } catch (err: any) {
      errorToast('Erro ao adicionar transação', err.message);
    }
  };

  // Componente de carregamento
  if (loading) {
    return <ScreenLoader title="Transações" text="Carregando transações..." />;
  }

  // Componente de erro
  if (error && !loading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="Transações" />
        <View className="flex-1 justify-center items-center p-4">
          <Text className={`text-center mb-4 text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={refreshTransactions}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Transações" />
      
      <View className="flex-1 p-4">
        {isMobile ? (
          // Layout para Mobile
          <View className="mb-6">
            <View className="flex-row mb-3">
              <FilterButton 
                filter="all" 
                label="Todas" 
                count={transactions.length}
              />
              <FilterButton 
                filter="income" 
                label="Entradas" 
                count={incomeTransactions.length}
              />
              <FilterButton 
                filter="expense" 
                label="Saídas" 
                count={expenseTransactions.length}
              />
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-blue-600 py-3 px-4 rounded-lg"
            >
              <Text className="text-white font-medium text-center">
                Cadastrar Nova Transação
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Layout para Web (Desktop)
          <View className="mb-6 flex-row justify-between items-center">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row space-x-3"
            >
              <FilterButton 
                filter="all" 
                label="Todas as transações" 
                count={transactions.length}
              />
              <FilterButton 
                filter="income" 
                label="Entradas" 
                count={incomeTransactions.length}
              />
              <FilterButton 
                filter="expense" 
                label="Saídas" 
                count={expenseTransactions.length}
              />
            </ScrollView>
            <View className="flex-1 items-end">
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Cadastrar Transação</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tabela de transações */}
        <View className={`
          flex-1 rounded-xl p-4 mb-4 
          ${isDark ? 'bg-gray-800' : 'bg-white'}
        `}>
          {/* Cabeçalho da tabela */}
          <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <Text className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {activeFilter === 'all' && 'Todas as transações'}
              {activeFilter === 'income' && 'Entradas'}
              {activeFilter === 'expense' && 'Saídas'}
            </Text>
            <Text className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transação' : 'transações'}
            </Text>
          </View>

          {/* Headers da tabela */}
          <View className="flex-row justify-between items-center mb-3 px-2">
            <Text className={`text-sm font-medium flex-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Descrição
            </Text>
            {showCategory && (
              <Text className={`text-sm font-medium w-24 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Categoria
              </Text>
            )}
            <Text className={`text-sm font-medium w-24 text-center ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Data
            </Text>
            <Text className={`text-sm font-medium w-24 text-right ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Valor
            </Text>
          </View>

          {/* Lista de transações paginadas */}
          <ScrollView 
            className="flex-1" 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refreshTransactions}
                colors={[isDark ? '#60A5FA' : '#3B82F6']}
                tintColor={isDark ? '#60A5FA' : '#3B82F6'}
              />
            }
          >
            {paginatedTransactions.length === 0 ? (
              <View className="flex-1 justify-center items-center p-8">
                <Text className="text-6xl mb-4">
                  {activeFilter === 'income' ? '💰' : activeFilter === 'expense' ? '💸' : '📊'}
                </Text>
                <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Nenhuma transação encontrada
                </Text>
                <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activeFilter === 'all' 
                    ? 'Adicione sua primeira transação para começar a acompanhar suas finanças!'
                    : `Nenhuma ${activeFilter === 'income' ? 'entrada' : 'saída'} encontrada`
                  }
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
                >
                  <Text className="text-white font-medium">
                    Adicionar Transação
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-2">
                {paginatedTransactions.map((transaction) => (
                <View 
                  key={transaction.id}
                  className={`
                    flex-row items-center justify-between p-3 rounded-lg
                    ${isDark ? 'bg-gray-750' : 'bg-gray-50'}
                  `}
                >
                  {/* Ícone e Descrição */}
                  <View className="flex-row items-center flex-1">
                    <View className={`
                      w-8 h-8 rounded-full items-center justify-center mr-3
                      ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}
                    `}>
                      <Text className={`
                        text-sm font-bold
                        ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                      `}>
                        {getTransactionIcon(transaction.type)}
                      </Text>
                    </View>
                    <Text className={`
                      font-medium flex-1
                      ${isDark ? 'text-white' : 'text-gray-900'}
                    `}>
                      {transaction.description}
                    </Text>
                  </View>

                  {/* Categoria */}
                  {showCategory && (
                    <View className="w-24 items-center">
                      <View className={`
                        px-2 py-1 rounded-full
                        ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                      `}>
                        <Text className={`
                          text-xs
                          ${isDark ? 'text-gray-300' : 'text-gray-700'}
                        `}>
                          {transaction.category}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Data */}
                  <View className="w-24 items-center">
                    <Text className={`
                      text-sm
                      ${isDark ? 'text-gray-400' : 'text-gray-600'}
                    `}>
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>

                  {/* Valor */}
                  <View className="w-24 items-end">
                    <Text className={`
                      font-semibold
                      ${getAmountColor(transaction.type)}
                    `}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                  </View>
                </View>
                              ))}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Paginação */}
        {totalPages > 1 && (
          <View className="flex-row justify-center items-center space-x-2">
            {/* Botão Anterior */}
            <TouchableOpacity
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`
                px-3 py-2 rounded-lg
                ${currentPage === 1 
                  ? (isDark ? 'bg-gray-700 opacity-50' : 'bg-gray-200 opacity-50')
                  : (isDark ? 'bg-gray-700' : 'bg-gray-200')
                }
              `}
            >
              <Text className={`
                ${isDark ? 'text-gray-300' : 'text-gray-700'}
              `}>
                ← Anterior
              </Text>
            </TouchableOpacity>

            {/* Números das páginas */}
            <View className="flex-row space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page = i + 1;
                
                // Ajustar páginas visíveis baseado na página atual
                if (totalPages > 5) {
                  const startPage = Math.max(1, currentPage - 2);
                  const endPage = Math.min(totalPages, startPage + 4);
                  page = startPage + i;
                  
                  if (page > endPage) return null;
                }
                
                return (
                  <PaginationButton
                    key={page}
                    page={page}
                    isActive={currentPage === page}
                    onPress={() => setCurrentPage(page)}
                  />
                );
              }).filter(Boolean)}
            </View>

            {/* Botão Próximo */}
            <TouchableOpacity
              onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`
                px-3 py-2 rounded-lg
                ${currentPage === totalPages 
                  ? (isDark ? 'bg-gray-700 opacity-50' : 'bg-gray-200 opacity-50')
                  : (isDark ? 'bg-gray-700' : 'bg-gray-200')
                }
              `}
            >
              <Text className={`
                ${isDark ? 'text-gray-300' : 'text-gray-700'}
              `}>
                Próxima →
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal para adicionar nova transação */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTransaction}
      />
      </SafeAreaView>
    );
  };
  
  export default TransacoesScreen;