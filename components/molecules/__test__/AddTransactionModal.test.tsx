import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddTransactionModal from '../AddTransactionModal';

// ----- MOCKS (iguais aos de antes) -----
jest.mock('../../../hooks/useCategorias', () => ({
  useCategorias: () => ({
    categories: [],
    incomeCategories: [
      { id: '1', name: 'Salário', type: 'income', userId: 'user1' },
      { id: '2', name: 'Freelance', type: 'income', userId: 'user1' },
    ],
    expenseCategories: [
      { id: '3', name: 'Alimentação', type: 'expense', userId: 'user1' },
      { id: '4', name: 'Transporte', type: 'expense', userId: 'user1' },
    ],
    loading: false,
    error: null,
    adicionarCategoria: jest.fn(),
    atualizarCategoria: jest.fn(),
    excluirCategoria: jest.fn(),
    validarNomeCategoria: jest.fn(),
    atualizarCategorias: jest.fn(),
  }),
}));

jest.mock('../../../services/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} />,
  };
});

// ----- TESTES -----
describe('AddTransactionModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teste 1 (existente e passando)
  it('deve exibir mensagens de erro ao tentar submeter o formulário vazio', async () => {
    const { getByText } = render(
      <AddTransactionModal
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    const submitButton = getByText(/cadastrar/i);
    fireEvent.press(submitButton);
    await waitFor(() => {
      expect(getByText('Descrição é obrigatória')).toBeTruthy();
      expect(getByText('Valor é obrigatório')).toBeTruthy();
      expect(getByText('Categoria é obrigatória')).toBeTruthy();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  // Teste 2 (existente e passando)
  it('deve exibir erro se o valor for zero ou negativo', async () => {
    const { getByText, getByPlaceholderText } = render(
      <AddTransactionModal
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    fireEvent.changeText(getByPlaceholderText('Ex: Supermercado, Salário, etc.'), 'Teste de valor');
    fireEvent.changeText(getByPlaceholderText('0,00'), '0');
    const submitButton = getByText(/cadastrar/i);
    fireEvent.press(submitButton);
    await waitFor(() => {
      expect(getByText('Valor deve ser maior que zero')).toBeTruthy();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  // Teste 3: O CAMINHO FELIZ (AGORA FUNCIONA!)
  it('deve chamar onSave com os dados corretos ao preencher e submeter o formulário', async () => {
    const { getByText, getByPlaceholderText, getByTestId, findByTestId } = render(
      <AddTransactionModal
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // --- Ação (Act): Simula o preenchimento do usuário ---

    // 1. Preenche a descrição e o valor
    fireEvent.changeText(getByPlaceholderText('Ex: Supermercado, Salário, etc.'), 'Salário do Mês');
    fireEvent.changeText(getByPlaceholderText('0,00'), '5000.00');

    // 2. Interage com o ComboBox para selecionar uma categoria
    const comboBoxTrigger = getByTestId('combobox-trigger');
    fireEvent.press(comboBoxTrigger); // Abre o modal do ComboBox

    // `findByTestId` é assíncrono, ele espera o item aparecer na tela (ótimo para modais)
    const categoryOption = await findByTestId('combobox-option-Salário');
    fireEvent.press(categoryOption); // Seleciona a categoria 'Salário'

    // 3. Clica no botão de submeter
    const submitButton = getByText(/cadastrar/i);
    fireEvent.press(submitButton);

    // --- Verificação (Assert): Confirma se tudo ocorreu como esperado ---

    await waitFor(() => {
      // 4. Verifica se a função onSave foi chamada
      expect(mockOnSave).toHaveBeenCalledTimes(1);

      // 5. Verifica se onSave foi chamada COM OS DADOS CORRETOS
      expect(mockOnSave).toHaveBeenCalledWith(
        {
          description: 'Salário do Mês',
          amount: 5000, // O valor é um número
          type: 'income', // O tipo padrão é 'income'
          category: 'Salário', // A categoria que selecionamos
          date: expect.any(String), // A data é gerada, então só verificamos que é uma string
        },
        undefined // O segundo argumento (id) é undefined pois estamos criando, não editando
      );
    });
  });
});