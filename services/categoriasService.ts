import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // Importamos o db e o auth

// Interface para categoria (pode manter a sua)
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isDefault?: boolean;
  percentage?: number;
  transactionCount?: number;
  totalAmount?: number;
}

// Função auxiliar para obter a referência da coleção de categorias do usuário logado
const getCategoriesCollectionRef = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado para acessar categorias.');
  return collection(db, 'users', user.uid, 'categories');
};

// --- FUNÇÕES CRUD COM FIRESTORE ---

// Função para buscar todas as categorias do usuário
export const fetchUserCategories = async (): Promise<Category[]> => {
  const categoriesCollectionRef = getCategoriesCollectionRef();
  const querySnapshot = await getDocs(categoriesCollectionRef);

  const categories = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Category, 'id'>),
  }));

  return categories;
};

// Função para criar nova categoria
export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
  const categoriesCollectionRef = getCategoriesCollectionRef();
  // Omitimos o ID, pois o Firestore irá gerá-lo
  const docRef = await addDoc(categoriesCollectionRef, categoryData);

  return {
    id: docRef.id,
    ...categoryData,
  };
};

// Função para atualizar categoria
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id'>>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado.');
  
  const categoryDocRef = doc(db, 'users', user.uid, 'categories', id);
  await updateDoc(categoryDocRef, categoryData);
};

// Função para excluir categoria
export const deleteCategory = async (id: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado.');

  const categoryDocRef = doc(db, 'users', user.uid, 'categories', id);
  await deleteDoc(categoryDocRef);
};

// Função para validar nome da categoria (pode ser mantida como está)
export const validateCategoryName = (name: string, type: 'income' | 'expense', existingCategories: Category[]): string | null => {
  if (!name.trim()) return 'Nome da categoria é obrigatório';
  if (name.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
  if (name.trim().length > 50) return 'Nome deve ter no máximo 50 caracteres';
  
  const nameExists = existingCategories.some(
    cat => cat.name.toLowerCase() === name.trim().toLowerCase() && cat.type === type
  );

  if (nameExists) return 'Já existe uma categoria com este nome';

  return null;
};

