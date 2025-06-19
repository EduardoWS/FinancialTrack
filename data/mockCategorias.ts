import { Category } from '../services/categoriasService';

// Dados mock das categorias padrão
export const mockDefaultCategories: Category[] = [
  // Categorias de Receita
  { id: '1', name: 'Salário', type: 'income', color: '#10b981', icon: '💰', isDefault: true, transactionCount: 12, totalAmount: 54000 },
  { id: '2', name: 'Freelance', type: 'income', color: '#3b82f6', icon: '💻', isDefault: true, transactionCount: 8, totalAmount: 9600 },
  { id: '3', name: 'Transferência', type: 'income', color: '#06b6d4', icon: '🔄', isDefault: true, transactionCount: 5, totalAmount: 3000 },
  { id: '4', name: 'Investimentos', type: 'income', color: '#8b5cf6', icon: '📈', isDefault: true, transactionCount: 3, totalAmount: 2400 },
  { id: '5', name: 'Outros', type: 'income', color: '#6b7280', icon: '💡', isDefault: true, transactionCount: 4, totalAmount: 800 },
  
  // Categorias de Despesa
  { id: '6', name: 'Mercado', type: 'expense', color: '#ef4444', icon: '🛒', isDefault: true, transactionCount: 24, totalAmount: 4800 },
  { id: '7', name: 'Transporte', type: 'expense', color: '#f59e0b', icon: '🚗', isDefault: true, transactionCount: 18, totalAmount: 1800 },
  { id: '8', name: 'Lazer', type: 'expense', color: '#ec4899', icon: '🎮', isDefault: true, transactionCount: 15, totalAmount: 2250 },
  { id: '9', name: 'Moradia', type: 'expense', color: '#10b981', icon: '🏠', isDefault: true, transactionCount: 12, totalAmount: 42000 },
  { id: '10', name: 'Saúde', type: 'expense', color: '#06b6d4', icon: '🏥', isDefault: true, transactionCount: 6, totalAmount: 1500 },
  { id: '11', name: 'Educação', type: 'expense', color: '#3b82f6', icon: '📚', isDefault: true, transactionCount: 3, totalAmount: 600 },
  { id: '12', name: 'Outros', type: 'expense', color: '#6b7280', icon: '❓', isDefault: true, transactionCount: 9, totalAmount: 750 }
];

// Dados mock das categorias customizadas
export const mockCustomCategories: Category[] = [
  { id: '13', name: 'Fast Food', type: 'expense', color: '#f59e0b', icon: '🍔', isDefault: false, transactionCount: 12, totalAmount: 850 },
  { id: '14', name: 'Combustível', type: 'expense', color: '#ef4444', icon: '⛽', isDefault: false, transactionCount: 8, totalAmount: 960 },
  { id: '15', name: 'Roupas', type: 'expense', color: '#ec4899', icon: '👕', isDefault: false, transactionCount: 4, totalAmount: 1200 },
  { id: '16', name: 'Academia', type: 'expense', color: '#10b981', icon: '🏋️', isDefault: false, transactionCount: 12, totalAmount: 1440 },
  { id: '17', name: 'Streaming', type: 'expense', color: '#8b5cf6', icon: '🎬', isDefault: false, transactionCount: 12, totalAmount: 360 },
  { id: '18', name: 'Vendas Online', type: 'income', color: '#f59e0b', icon: '📱', isDefault: false, transactionCount: 6, totalAmount: 1800 },
  { id: '19', name: 'Consultoria', type: 'income', color: '#06b6d4', icon: '💼', isDefault: false, transactionCount: 4, totalAmount: 3200 }
];

// Dados mock consolidados das categorias
export const mockCategoriasData: Category[] = [
  ...mockDefaultCategories,
  ...mockCustomCategories
];

// Cores disponíveis para categorias
export const availableColors = [
  '#ef4444', '#f59e0b', '#10b981', '#06b6d4', 
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
];

// Ícones disponíveis para categorias
export const availableIcons = [
  '💰', '💻', '🔄', '📈', '💡', '🛒', '🚗', '🎮', 
  '🏠', '🏥', '📚', '❓', '🍔', '⛽', '👕', '🎬', 
  '📱', '💊', '🎯', '📌', '🏋️', '💼', '✈️', '🎵',
  '🌟', '🔧', '📊', '🎨', '🌍', '💎'
]; 