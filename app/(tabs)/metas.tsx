import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import ScreenLoader from '../../components/atoms/ScreenLoader';
import { errorToast, successToast } from '../../components/atoms/custom-toasts';
import AddMetaModal from '../../components/molecules/AddMetaModal';
import AddValorMetaModal from '../../components/molecules/AddValorMetaModal';
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import MetaCard from '../../components/molecules/MetaCard';
import MetaOptionsModal from '../../components/molecules/MetaOptionsModal';
import { useMetas } from '../../hooks/useMetas';
import { useTheme } from '../../services/ThemeContext';
import { formatCurrency } from '../../services/dashboardService';
import { Meta } from '../../services/metasService';

const MetasScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [modalVisible, setModalVisible] = useState(false);
  const [valorModalVisible, setValorModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [selectedMeta, setSelectedMeta] = useState<Meta | null>(null);
  const [activeTab, setActiveTab] = useState<'ativas' | 'finalizadas'>('ativas');

  const {
    metasAtivas,
    metasFinalizadas,
    loading,
    calcularProgresso,
    adicionarMeta,
    atualizarMeta,
    excluirMeta,
    adicionarValorMeta,
    finalizarMeta,
  } = useMetas();

  const handleSaveMeta = async (metaData: Omit<Meta, 'id'>) => {
    try {
      if (editingMeta) {
        await atualizarMeta(editingMeta.id, metaData);
        successToast('Meta atualizada com sucesso!');
      } else {
        const novaMeta = {
          ...metaData,
          valorAtual: 0,
          finalizada: false,
        };
        await adicionarMeta(novaMeta);
        successToast('Meta criada com sucesso!');
      }
      closeModal();
    } catch (err: any) {
      errorToast('Erro ao salvar meta', err.message);
    }
  };

  const handleEditMeta = (meta: Meta) => {
    setEditingMeta(meta);
    setOptionsModalVisible(false);
    setModalVisible(true);
  };

  const handleDeleteMeta = (meta: Meta) => {
    setSelectedMeta(meta);
    setOptionsModalVisible(false);
    setDeleteModalVisible(true);
  };

  const confirmDeleteMeta = async () => {
    if (selectedMeta) {
      try {
        await excluirMeta(selectedMeta.id);
        successToast('Meta excluída com sucesso!');
        setDeleteModalVisible(false);
        setSelectedMeta(null);
      } catch (err: any) {
        errorToast('Erro ao excluir meta', err.message);
      }
    }
  };

  const handleOpenAddValor = (meta: Meta) => {
    setSelectedMeta(meta);
    setOptionsModalVisible(false);
    setValorModalVisible(true);
  };

  const handleConfirmAddValor = async (valor: number) => {
    if (selectedMeta) {
      try {
        await adicionarValorMeta(selectedMeta.id, valor);
        const metaAtualizada = {
          ...selectedMeta,
          valorAtual: selectedMeta.valorAtual + valor,
        };
        const novoProgresso = calcularProgresso(metaAtualizada.valorAtual, metaAtualizada.valorMeta);

        if (novoProgresso >= 100) {
          successToast(`🎉 Parabéns! Meta "${selectedMeta.nome}" foi concluída!`);
          // Não precisa chamar finalizarMeta aqui, pois a função adicionarValorMeta 
          // já finaliza automaticamente quando o valor atinge 100%
        } else {
          successToast(`Valor adicionado! Progresso: ${Math.round(novoProgresso)}%`);
        }
        closeValorModal();
      } catch (err: any) {
        errorToast('Erro ao adicionar valor', err.message);
      }
    }
  };

  const handleFinalizarMeta = async (meta: Meta) => {
    try {
        const valorFaltante = meta.valorMeta - meta.valorAtual;
        
        if (valorFaltante > 0) {
          // Adicionar o valor faltante primeiro
          await adicionarValorMeta(meta.id, valorFaltante);
          successToast(`🎉 Valor faltante (${formatCurrency(valorFaltante)}) adicionado e meta "${meta.nome}" foi concluída!`);
        } else {
          // Meta já foi completada, apenas marcar como finalizada
          await finalizarMeta(meta.id);
          successToast(`Meta "${meta.nome}" marcada como finalizada!`);
        }
        
        setOptionsModalVisible(false);
    } catch(err: any) {
      errorToast('Erro ao finalizar meta', err.message);
    }
  }

  const handleMetaClick = (meta: Meta) => {
    setSelectedMeta(meta);
    setOptionsModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMeta(null);
  };

  const closeValorModal = () => {
    setValorModalVisible(false);
    setSelectedMeta(null);
  };

  const closeOptionsModal = () => {
    setOptionsModalVisible(false);
    setSelectedMeta(null);
  };

  const metasExibidas = activeTab === 'ativas' ? metasAtivas : metasFinalizadas;

  const FilterButton = ({
    filter,
    label,
    count,
    color = 'blue',
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
          flex-1 py-2 px-2 rounded-lg border items-center mx-1
          ${
            isActive
              ? color === 'green'
                ? isDark
                  ? 'bg-green-600 border-green-600'
                  : 'bg-green-600 border-green-600'
                : isDark
                ? 'bg-blue-600 border-blue-600'
                : 'bg-blue-600 border-blue-600'
              : isDark
              ? 'bg-transparent border-gray-600'
              : 'bg-transparent border-gray-300'
          }
        `}
      >
        <Text
          className={`
          font-medium text-sm text-center
          ${isActive ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'}
        `}
        >
          {label}
        </Text>
        <Text
          className={`
          text-xs mt-1
          ${
            isActive
              ? color === 'green'
                ? 'text-green-100'
                : 'text-blue-100'
              : isDark
              ? 'text-gray-400'
              : 'text-gray-500'
          }
        `}
        >
          {count}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ScreenLoader title="Metas Financeiras" text="Carregando suas metas..." />;
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Metas Financeiras" />

      <View className="flex-1 p-4">
        <View className="mb-6">
          <View className="flex-row mb-3">
            <FilterButton
              filter="ativas"
              label="Metas Ativas"
              count={metasAtivas.length}
              color="blue"
            />
            <FilterButton
              filter="finalizadas"
              label="Metas Concluídas"
              count={metasFinalizadas.length}
              color="green"
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => setModalVisible(true)} 
            className="bg-blue-600 py-3 px-4 rounded-lg"
          >
            <Text className="text-white font-medium text-center">
              Criar Nova Meta
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {metasExibidas.length === 0 ? (
            <View className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm items-center`}>
              <Text className="text-6xl mb-4">{activeTab === 'ativas' ? '🎯' : '🏆'}</Text>
              <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {activeTab === 'ativas' ? 'Nenhuma meta ativa' : 'Nenhuma meta concluída'}
              </Text>
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeTab === 'ativas'
                  ? 'Crie sua primeira meta financeira para começar a economizar!'
                  : 'Complete suas metas ativas para vê-las aqui.'}
              </Text>
              {activeTab === 'ativas' && (
                <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-blue-600 px-6 py-3 rounded-lg mt-4">
                  <Text className="text-white font-medium">Criar Primeira Meta</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            metasExibidas.map(meta => (
              <MetaCard
                key={meta.id}
                meta={meta}
                progresso={calcularProgresso(meta.valorAtual, meta.valorMeta)}
                onPress={() => handleMetaClick(meta)}
              />
            ))
          )}
          <View className="h-4" />
        </ScrollView>
      </View>

      <AddMetaModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSaveMeta}
        editingMeta={editingMeta}
      />

      {selectedMeta && (
        <>
          <AddValorMetaModal
            visible={valorModalVisible}
            onClose={closeValorModal}
            onAddValor={handleConfirmAddValor}
            meta={selectedMeta}
          />
          <MetaOptionsModal
            visible={optionsModalVisible}
            onClose={closeOptionsModal}
            onEdit={() => handleEditMeta(selectedMeta)}
            onDelete={() => handleDeleteMeta(selectedMeta)}
            onAddValor={() => handleOpenAddValor(selectedMeta)}
            onFinalizar={() => handleFinalizarMeta(selectedMeta)}
            meta={selectedMeta}
            progresso={selectedMeta ? calcularProgresso(selectedMeta.valorAtual, selectedMeta.valorMeta) : 0}
            isActive={!selectedMeta?.finalizada}
          />
          <ConfirmationModal
            visible={deleteModalVisible}
            onClose={() => setDeleteModalVisible(false)}
            onConfirm={confirmDeleteMeta}
            title="Excluir Meta"
            message={`Tem certeza que deseja excluir a meta "${selectedMeta?.nome}"?`}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default MetasScreen;