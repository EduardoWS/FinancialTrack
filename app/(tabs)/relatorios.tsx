import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LoadingSpinner from '../../components/atoms/LoadingSpinner';
import Toast from '../../components/atoms/Toast';
import Header from '../../components/Header';
import ReportDetailsModal from '../../components/molecules/ReportDetailsModal';
import { ReportItem, useReports } from '../../hooks/useReports';
import { useTheme } from '../../services/ThemeContext';

type FilterType = 'all' | 'alerts' | 'tips' | 'unread';

const RelatoriosScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReportItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const {
    reports,
    alertReports,
    tipReports,
    unreadReports,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshReports
  } = useReports();

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleCardPress = (item: ReportItem) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedItem(null);
    }, 300);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    showToast('Todos os relatórios foram marcados como lidos!');
  };

  const getFilteredReports = (): ReportItem[] => {
    switch (activeFilter) {
      case 'alerts':
        return alertReports;
      case 'tips':
        return tipReports;
      case 'unread':
        return unreadReports;
      default:
        return reports;
    }
  };

  const getIcon = (type: 'alert' | 'tip') => {
    if (type === 'alert') {
      return (
        <View className="w-12 h-12 bg-red-100 rounded-lg items-center justify-center">
          <Ionicons name="warning" size={24} color="#DC2626" />
        </View>
      );
    } else {
      return (
        <View className="w-12 h-12 bg-yellow-100 rounded-lg items-center justify-center">
          <Ionicons name="bulb" size={24} color="#D97706" />
        </View>
      );
    }
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
          flex-1 py-2 px-1 rounded-lg border items-center mx-1
          ${isActive 
            ? (isDark ? 'bg-blue-600 border-blue-600' : 'bg-blue-600 border-blue-600')
            : (isDark ? 'bg-transparent border-gray-600' : 'bg-transparent border-gray-300')
          }
        `}
      >
        <Text className={`
          font-medium text-xs text-center
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

  const ReportCard = ({ item }: { item: ReportItem }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item)}
      className={`
        p-4 rounded-xl mb-3 shadow-sm border-2
        ${!item.isRead 
          ? (item.type === 'alert' 
            ? (isDark ? 'bg-gray-800 border-red-500' : 'bg-white border-red-300')
            : (isDark ? 'bg-gray-800 border-yellow-500' : 'bg-white border-yellow-300')
          )
          : (isDark ? 'bg-gray-800 border-transparent' : 'bg-white border-transparent')
        }
      `}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        {getIcon(item.type)}
        
        <View className="flex-1 ml-3">
          <Text className={`text-base font-medium leading-5 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {item.title}
          </Text>
          {item.category && (
            <Text className={`text-xs mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {item.category}
            </Text>
          )}
        </View>
        
        {/* Seta indicando que é clicável */}
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDark ? '#9CA3AF' : '#6B7280'} 
        />
      </View>
    </TouchableOpacity>
  );

  // Componente de erro
  if (error && !loading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="Relatórios e Dicas" />
        <View className="flex-1 justify-center items-center p-4">
          <Text className={`text-center mb-4 text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={refreshReports}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const filteredReports = getFilteredReports();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Relatórios e Dicas" />
      
      <View className="flex-1 p-4">
        {/* Filtros em grid 2x2 para mobile */}
        <View className="mb-6">
          <View className="flex-row mb-3">
            <FilterButton 
              filter="all" 
              label="Todos" 
              count={reports.length}
            />
            <FilterButton 
              filter="unread" 
              label="Não lidos" 
              count={unreadReports.length}
            />
          </View>
          <View className="flex-row mb-3">
            <FilterButton 
              filter="alerts" 
              label="Alertas" 
              count={alertReports.length}
            />
            <FilterButton 
              filter="tips" 
              label="Dicas" 
              count={tipReports.length}
            />
          </View>
          
          {/* Botão Marcar todos como lidos */}
          {unreadReports.length > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              className="bg-blue-600 py-2 px-4 rounded-lg"
            >
              <Text className="text-white font-medium text-center text-sm">
                Marcar todos como lidos
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de Relatórios e Dicas */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <LoadingSpinner text="Carregando relatórios..." />
          </View>
        ) : (
          <ScrollView 
            className="flex-1" 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refreshReports}
                colors={[isDark ? '#60A5FA' : '#3B82F6']}
                tintColor={isDark ? '#60A5FA' : '#3B82F6'}
              />
            }
          >
            {filteredReports.length > 0 ? (
              filteredReports.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))
            ) : (
              <View className="flex-1 justify-center items-center py-12">
                <Ionicons 
                  name="document-text-outline" 
                  size={64} 
                  color={isDark ? '#6B7280' : '#9CA3AF'} 
                />
                <Text className={`text-lg font-medium mt-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Nenhum relatório encontrado
                </Text>
                <Text className={`text-sm mt-2 text-center ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {activeFilter === 'all' 
                    ? 'Não há relatórios disponíveis no momento' 
                    : `Não há ${activeFilter === 'alerts' ? 'alertas' : activeFilter === 'tips' ? 'dicas' : 'itens não lidos'} no momento`
                  }
                </Text>
              </View>
            )}
            
            {/* Espaçamento final */}
            <View className="h-4" />
          </ScrollView>
        )}
      </View>

      {/* Modal de Detalhes */}
      <ReportDetailsModal
        visible={modalVisible}
        onClose={handleCloseModal}
        item={selectedItem}
      />

      {/* Toast de notificações */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
        type="success"
      />
    </SafeAreaView>
  );
};

export default RelatoriosScreen;