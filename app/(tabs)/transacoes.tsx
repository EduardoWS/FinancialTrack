import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { Dimensions, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { errorToast, successToast } from '../../components/atoms/custom-toasts';
import ScreenLoader from '../../components/atoms/ScreenLoader';
import Header from '../../components/Header';
import AddTransactionModal from '../../components/molecules/AddTransactionModal';
import ConfirmationModal from "../../components/molecules/ConfirmationModal";
import TransactionFilterModal from '../../components/molecules/TransactionFilterModal';
import TransactionOptionsModal from "../../components/molecules/TransactionOptionsModal";
import { DateFilter, FilterType, useTransactions } from '../../hooks/useTransactions';
import { useTheme } from '../../services/ThemeContext';
import { formatCurrency, Transaction } from "../../services/transacoesService";

const TransacoesScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const showCategory = width >= 500;
  const isVeryNarrow = width < 400;
  const isNarrowHeader = width < 450;
  const showFilterLabel = width >= 500;
  
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Hook customizado para gerenciar transações
  const {
    transactions,
    incomeTransactions,
    expenseTransactions,
    filteredTransactions,
    activeFilter,
    dateFilter,
    filterTitle,
    currentPage,
    totalPages,
    paginatedTransactions,
    loading,
    error,
    setActiveFilter,
    setDateFilter,
    setCurrentPage,
    adicionarTransacao,
    atualizarTransacao,
    excluirTransacao,
    refreshTransactions
  } = useTransactions(10);

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOptionsModalVisible(true);
  };

  const handleEdit = () => {
    setOptionsModalVisible(false);
    setAddEditModalVisible(true);
  };

  const handleDelete = () => {
    setOptionsModalVisible(false);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedTransaction) {
      try {
        await excluirTransacao(selectedTransaction.id);
        successToast('Transação excluída com sucesso!');
        setDeleteModalVisible(false);
        setSelectedTransaction(null);
      } catch (err: any) {
        errorToast('Erro ao excluir transação', err.message);
      }
    }
  };

  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id'>, id?: string) => {
    try {
      if (id) {
        await atualizarTransacao(id, transactionData);
        successToast('Transação atualizada com sucesso!');
      } else {
        await adicionarTransacao(transactionData);
        successToast('Transação adicionada com sucesso!');
      }
      setAddEditModalVisible(false);
      setSelectedTransaction(null); // Limpa a seleção após salvar/editar
    } catch (err: any) {
      errorToast(id ? 'Erro ao atualizar' : 'Erro ao adicionar', err.message);
    }
  };

  const handleApplyFilter = (filter: DateFilter) => {
    setDateFilter(filter);
    setFilterModalVisible(false);
  };

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
      className={`mr-2
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
        {/* Filtros de Tipo e Ações */}
        <View className={`mb-4 ${!isMobile ? 'flex-row justify-between items-center' : ''}`}>
          <View className="flex-row">
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
          {/* Botão de Cadastrar (apenas web) */}
          {!isMobile && (
            <TouchableOpacity
              onPress={() => {
                setSelectedTransaction(null);
                setAddEditModalVisible(true);
              }}
              className="flex-row items-center bg-blue-600 px-4 py-2 rounded-lg"
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Nova Transação</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botão de Cadastrar (apenas mobile) */}
        {isMobile && (
          <TouchableOpacity
            onPress={() => {
              setSelectedTransaction(null);
              setAddEditModalVisible(true);
            }}
            className="bg-blue-600 py-3 px-4 rounded-lg mb-4"
          >
            <Text className="text-white font-medium text-center">Cadastrar Nova Transação</Text>
          </TouchableOpacity>
        )}

        {/* Tabela de transações */}
        <View className={`
          flex-1 rounded-xl p-4 mb-4 
          ${isDark ? 'bg-gray-800' : 'bg-white'}
        `}>
          {/* Cabeçalho da tabela */}
          <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <View>
              <Text className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {filterTitle}
              </Text>
              <Text className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transação encontrada' : 'transações encontradas'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(true)}
              className="flex-row items-center bg-blue-600 px-3 py-2 rounded-lg"
            >
              <Ionicons name="filter" size={16} color="white" />
              {showFilterLabel && (
                <Text className="text-white font-medium ml-2 text-sm">Filtrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Headers da tabela */}
          {/* <View className="flex-row justify-between items-center mb-3 px-2">
            <Text className={`${isNarrowHeader ? 'text-xs' : 'text-sm'} font-medium flex-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Descrição
            </Text>
            {showCategory && (
              <Text className={`${isNarrowHeader ? 'text-xs' : 'text-sm'} font-medium w-24 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Categoria
              </Text>
            )}
            {!isMobile && (
              <Text className={`${isNarrowHeader ? 'text-xs' : 'text-sm'} font-medium w-24 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Data
              </Text>
            )}
            <Text className={`${isNarrowHeader ? 'text-xs' : 'text-sm'} font-medium w-24 text-right ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Valor
            </Text>
          </View> */}

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
                  onPress={() => {
                    setSelectedTransaction(null); // Garante que estamos criando, não editando
                    setAddEditModalVisible(true);
                  }}
                  className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
                >
                  <Text className="text-white font-medium">
                    Adicionar Transação
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="">
                {paginatedTransactions.map((transaction, index) => (
                  <View key={transaction.id} className={index > 0 ? '' : ''}>
                    <TouchableOpacity 
                      onPress={() => handleTransactionPress(transaction)}
                      className={` ${isMobile ? 'mb-2 py-6 px-4' : 'mb-2 py-6 px-4' }
                        flex-row items-center justify-between p-3 rounded-lg
                        ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
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
                        <View className="flex-1">
                          <Text className={`
                            font-medium flex-1
                            ${isVeryNarrow ? 'text-sm' : ''}
                            ${isDark ? 'text-white' : 'text-gray-900'}
                          `}>
                            {transaction.description}
                          </Text>
                          {isMobile && (
                            <Text className={`
                              text-xs
                              ${isDark ? 'text-gray-400' : 'text-gray-500'}
                            `}>
                              {new Date(transaction.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: isVeryNarrow ? '2-digit' : 'numeric',
                              })}
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* Categoria */}
                      {showCategory && (
                        <View className="w-24 items-center">
                          <View className={`
                            px-2 py-1 rounded-full
                            ${isDark ? 'bg-gray-600' : 'bg-gray-200'}
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
                      {!isMobile && (
                        <View className="w-24 items-center">
                          <Text className={`
                            text-sm
                            ${isDark ? 'text-gray-400' : 'text-gray-600'}
                          `}>
                            {new Date(transaction.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: isVeryNarrow ? '2-digit' : 'numeric',
                            })}
                          </Text>
                        </View>
                      )}

                      {/* Valor */}
                      <View className="w-24 items-end">
                        <Text className={`
                          font-semibold
                          ${isVeryNarrow ? 'text-sm' : ''}
                          ${getAmountColor(transaction.type)}
                        `}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Paginação */}
        {totalPages > 1 && (
          <View className="flex-row justify-center items-center">
            <TouchableOpacity
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg mr-2 ${
                currentPage === 1 
                  ? (isDark ? 'bg-gray-700 opacity-50' : 'bg-gray-200 opacity-50')
                  : (isDark ? 'bg-gray-700' : 'bg-gray-200')
              }`}
            >
              <Text className={`
                ${isDark ? 'text-gray-300' : 'text-gray-700'}
              `}>
                ← Anterior
              </Text>
            </TouchableOpacity>

            {/* Números das páginas */}
            <View className="flex-row">
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
              className={`px-3 py-2 rounded-lg mr-2 ${
                currentPage === totalPages 
                  ? (isDark ? 'bg-gray-700 opacity-50' : 'bg-gray-200 opacity-50')
                  : (isDark ? 'bg-gray-700' : 'bg-gray-200')
              }`}
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

      {/* Modal para adicionar/editar nova transação */}
      <AddTransactionModal
        visible={addEditModalVisible}
        onClose={() => {
          setAddEditModalVisible(false);
          setSelectedTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={selectedTransaction}
      />

      {/* Modal de Opções da Transação */}
      <TransactionOptionsModal
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        transaction={selectedTransaction}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal de Confirmação para Excluir */}
      <ConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        title="Excluir Transação"
        message={`Tem certeza que deseja excluir a transação "${selectedTransaction?.description}"? Esta ação não pode ser desfeita.`}
      />

      {/* Modal de Filtro de Data */}
      <TransactionFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilter}
        currentFilter={dateFilter}
      />
      </SafeAreaView>
    );
  };
  
  export default TransacoesScreen;