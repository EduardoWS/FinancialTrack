import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from '../../components/atoms/Toast';
import Header from '../../components/Header';
import AddMetaModal from '../../components/molecules/AddMetaModal';
import AddValorMetaModal from '../../components/molecules/AddValorMetaModal';
import MetaCard from '../../components/molecules/MetaCard';
import MetaOptionsModal from '../../components/molecules/MetaOptionsModal';
import { Meta, useMetas } from '../../hooks/useMetas';
import { useTheme } from '../../services/ThemeContext';

const MetasScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [modalVisible, setModalVisible] = useState(false);
  const [valorModalVisible, setValorModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [selectedMeta, setSelectedMeta] = useState<Meta | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'ativas' | 'finalizadas'>('ativas');

  const {
    metas,
    metasAtivas,
    metasFinalizadas,
    loading,
    calcularProgresso,
    adicionarMeta,
    atualizarMeta,
    excluirMeta,
    adicionarValorMeta
  } = useMetas();

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleAddMeta = (novaMeta: Omit<Meta, 'id'>) => {
    if (editingMeta) {
      atualizarMeta(editingMeta.id, novaMeta);
      showToast('Meta atualizada com sucesso!');
    } else {
      adicionarMeta(novaMeta);
      showToast('Meta criada com sucesso!');
    }
    setEditingMeta(null);
  };

  const handleEditMeta = (meta: Meta) => {
    setEditingMeta(meta);
    setModalVisible(true);
  };

  const handleDeleteMeta = (meta: Meta) => {
    Alert.alert(
      'Excluir Meta',
      `Tem certeza que deseja excluir a meta "${meta.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            excluirMeta(meta.id);
            showToast('Meta excluída com sucesso!');
          }
        }
      ]
    );
  };

  const handleAddValor = (meta: Meta) => {
    console.log('handleAddValor chamado com meta:', meta.nome);
    setSelectedMeta(meta);
    setValorModalVisible(true);
  };

  const handleConfirmAddValor = (valor: number) => {
    if (selectedMeta) {
      adicionarValorMeta(selectedMeta.id, valor);
      const novoProgresso = calcularProgresso(selectedMeta.valorAtual + valor, selectedMeta.valorMeta);
      
      if (novoProgresso >= 100) {
        showToast(`🎉 Parabéns! Meta "${selectedMeta.nome}" foi concluída!`);
      } else {
        showToast(`Valor adicionado com sucesso! Progresso: ${Math.round(novoProgresso)}%`);
      }
    }
    setSelectedMeta(null);
  };

  const handleMetaClick = (meta: Meta) => {
    console.log('Meta clicada:', meta.nome);
    setSelectedMeta(meta);
    setOptionsModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMeta(null);
  };

  const closeValorModal = () => {
    setValorModalVisible(false);
    setTimeout(() => {
      setSelectedMeta(null);
    }, 100);
  };

  const closeOptionsModal = () => {
    setOptionsModalVisible(false);
    // selectedMeta será limpo pelos outros métodos conforme necessário
  };

  const metasExibidas = activeTab === 'ativas' ? metasAtivas : metasFinalizadas;

  const FilterButton = ({ 
    filter, 
    label, 
    count,
    color = 'blue'
  }: { 
    filter: 'ativas' | 'finalizadas'; 
    label: string; 
    count: number;
    color?: 'blue' | 'green';
  }) => {
    const isActive = activeTab === filter;
    
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(filter)}
        className={`
          px-4 py-2 rounded-full border-2 min-w-[120px] items-center mr-3
          ${isActive 
            ? (color === 'green' 
              ? (isDark ? 'bg-green-600 border-green-600' : 'bg-green-600 border-green-600')
              : (isDark ? 'bg-blue-600 border-blue-600' : 'bg-blue-600 border-blue-600')
            )
            : (isDark ? 'bg-transparent border-gray-600' : 'bg-transparent border-gray-300')
          }
        `}
      >
        <Text className={`
          font-medium text-sm
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
            ? (color === 'green' ? 'text-green-100' : 'text-blue-100')
            : (isDark ? 'text-gray-400' : 'text-gray-500')
          }
        `}>
          {count}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Metas Financeiras" />
      
      <View className="flex-1 p-4">
        {/* Filtros e Botão Criar Meta */}
        <View className="flex-row justify-between items-center mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-1"
          >
            <FilterButton 
              filter="ativas" 
              label="Metas Financeiras" 
              count={metasAtivas.length}
              color="blue"
            />
            <FilterButton 
              filter="finalizadas" 
              label="Metas Passadas" 
              count={metasFinalizadas.length}
              color="green"
            />
          </ScrollView>
          
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-blue-600 px-4 py-2 rounded-lg ml-3"
          >
            <Text className="text-white font-medium text-sm">Criar Meta</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Metas */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {metasExibidas.length === 0 ? (
            <View className={`p-6 rounded-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-sm items-center`}>
              <Text className="text-6xl mb-4">
                {activeTab === 'ativas' ? '🎯' : '🏆'}
              </Text>
              <Text className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {activeTab === 'ativas' 
                  ? 'Nenhuma meta ativa'
                  : 'Nenhuma meta finalizada'
                }
              </Text>
              <Text className={`text-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {activeTab === 'ativas' 
                  ? 'Crie sua primeira meta financeira para começar a economizar!'
                  : 'Complete suas metas ativas para vê-las aqui.'
                }
              </Text>
              {activeTab === 'ativas' && (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
                >
                  <Text className="text-white font-medium">Criar Primeira Meta</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            metasExibidas.map((meta) => (
              <MetaCard
                key={meta.id}
                meta={meta}
                progresso={calcularProgresso(meta.valorAtual, meta.valorMeta)}
                onPress={() => handleMetaClick(meta)}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Modais */}
      <AddMetaModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleAddMeta}
        editingMeta={editingMeta}
      />

      <AddValorMetaModal
        visible={valorModalVisible}
        onClose={closeValorModal}
        onAddValor={handleConfirmAddValor}
        meta={selectedMeta}
      />

      <MetaOptionsModal
        visible={optionsModalVisible}
        onClose={closeOptionsModal}
        meta={selectedMeta}
        isActive={activeTab === 'ativas'}
        progresso={selectedMeta ? calcularProgresso(selectedMeta.valorAtual, selectedMeta.valorMeta) : 0}
        onAddValor={() => {
          const meta = selectedMeta;
          closeOptionsModal();
          setTimeout(() => {
            if (meta) handleAddValor(meta);
          }, 100);
        }}
        onEdit={() => {
          const meta = selectedMeta;
          closeOptionsModal();
          setTimeout(() => {
            if (meta) handleEditMeta(meta);
          }, 100);
        }}
        onDelete={() => {
          const meta = selectedMeta;
          closeOptionsModal();
          setTimeout(() => {
            if (meta) handleDeleteMeta(meta);
          }, 100);
        }}
      />

      {/* Toast */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
        type="success"
      />
    </SafeAreaView>
  );
};

export default MetasScreen;