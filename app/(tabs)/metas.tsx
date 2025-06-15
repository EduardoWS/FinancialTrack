import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from '../../components/atoms/Toast';
import Header from '../../components/Header';
import AddMetaModal from '../../components/molecules/AddMetaModal';
import AddValorMetaModal from '../../components/molecules/AddValorMetaModal';
import MetaCard from '../../components/molecules/MetaCard';
import MetaOptionsModal from '../../components/molecules/MetaOptionsModal';
import { Meta, useMetas } from '../../hooks/useMetas';
import { formatCurrency } from '../../services/dashboardService';
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

  // Estatísticas das metas
  const totalMetas = metas.length;
  const metasCompletas = metasFinalizadas.length;
  const valorTotalMetas = metasAtivas.reduce((acc, meta) => acc + meta.valorMeta, 0);
  const valorAtualMetas = metasAtivas.reduce((acc, meta) => acc + meta.valorAtual, 0);
  const progressoGeral = valorTotalMetas > 0 ? (valorAtualMetas / valorTotalMetas) * 100 : 0;

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Metas Financeiras" />
      
      <View className="flex-1 p-4">
        {/* Resumo das Metas */}
        <View className={`p-4 rounded-xl mb-4 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Resumo das Metas
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-blue-600 px-3 py-1.5 rounded-lg"
            >
              <Text className="text-white font-medium text-sm">Criar Meta</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between mb-3">
            <View className="flex-1 items-center">
              <Text className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {totalMetas}
              </Text>
              <Text className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total de Metas
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-green-600">
                {metasCompletas}
              </Text>
              <Text className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Completas
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round(progressoGeral)}%
              </Text>
              <Text className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Progresso
              </Text>
            </View>
          </View>

          {/* Progresso Geral */}
          <View>
            <View className="flex-row justify-between mb-1">
              <Text className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Progresso Total
              </Text>
              <Text className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {formatCurrency(valorAtualMetas)} de {formatCurrency(valorTotalMetas)}
              </Text>
            </View>
            <View className={`h-2 rounded-full ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <View 
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${Math.min(progressoGeral, 100)}%` }}
              />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className={`flex-row mb-4 rounded-xl p-1 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <TouchableOpacity
            onPress={() => setActiveTab('ativas')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'ativas' 
                ? 'bg-blue-600' 
                : 'transparent'
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'ativas' 
                ? 'text-white'
                : (isDark ? 'text-gray-400' : 'text-gray-600')
            }`}>
              Metas Financeiras ({metasAtivas.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('finalizadas')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'finalizadas' 
                ? 'bg-green-600' 
                : 'transparent'
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'finalizadas' 
                ? 'text-white'
                : (isDark ? 'text-gray-400' : 'text-gray-600')
            }`}>
              Metas Passadas ({metasFinalizadas.length})
            </Text>
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

      {/* Modal para adicionar/editar meta */}
      <AddMetaModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleAddMeta}
        editingMeta={editingMeta}
      />

      {/* Modal para adicionar valor à meta */}
      <AddValorMetaModal
        visible={valorModalVisible}
        onClose={closeValorModal}
        onAddValor={handleConfirmAddValor}
        meta={selectedMeta}
      />

      {/* Modal de opções da meta */}
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