import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export interface Meta {
  id: string;
  nome: string;
  valorAtual: number;
  valorMeta: number;
  tipo: 'viagem' | 'casa' | 'investimentos' | 'emergencia' | 'outros';
  cor: string;
  icone: string;
  dataInicio: Date;
  dataLimite?: Date;
  descricao?: string;
  finalizada: boolean;
}

// Interface para dados do Firestore, com Timestamps
interface MetaFirestore {
  nome: string;
  valorAtual: number;
  valorMeta: number;
  tipo: 'viagem' | 'casa' | 'investimentos' | 'emergencia' | 'outros';
  cor: string;
  icone: string;
  dataInicio: Timestamp;
  dataLimite?: Timestamp;
  descricao?: string;
  finalizada: boolean;
}

const getMetasCollectionRef = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado para acessar metas.');
  return collection(db, 'users', user.uid, 'metas');
};

const fromFirestore = (doc: any): Meta => {
  const data = doc.data() as MetaFirestore;
  return {
    id: doc.id,
    ...data,
    dataInicio: data.dataInicio.toDate(),
    dataLimite: data.dataLimite ? data.dataLimite.toDate() : undefined,
  };
};

const toFirestore = (meta: Partial<Omit<Meta, 'id'>>) => {
  const data = { ...meta };

  // Firestore não aceita `undefined`. Precisamos remover chaves com esse valor.
  Object.keys(data).forEach(key => {
    if ((data as any)[key] === undefined) {
      delete (data as any)[key];
    }
  });

  // Converte os campos de data para Timestamps do Firestore
  if (data.dataInicio) {
    (data as any).dataInicio = Timestamp.fromDate(data.dataInicio);
  }
  if (data.dataLimite) {
    (data as any).dataLimite = Timestamp.fromDate(data.dataLimite);
  }

  return data;
};

export const fetchUserMetas = async (): Promise<Meta[]> => {
  const metasCollectionRef = getMetasCollectionRef();
  const querySnapshot = await getDocs(metasCollectionRef);
  return querySnapshot.docs.map(fromFirestore);
};

export const createMeta = async (metaData: Omit<Meta, 'id'>): Promise<Meta> => {
  const metasCollectionRef = getMetasCollectionRef();
  const firestoreData = toFirestore(metaData);
  const docRef = await addDoc(metasCollectionRef, firestoreData);
  return {
    id: docRef.id,
    ...metaData,
  };
};

export const updateMeta = async (id: string, metaData: Partial<Omit<Meta, 'id'>>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado.');
  
  const metaDocRef = doc(db, 'users', user.uid, 'metas', id);
  const firestoreData = toFirestore(metaData);
  await updateDoc(metaDocRef, firestoreData);
};

export const deleteMeta = async (id: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado.');

  const metaDocRef = doc(db, 'users', user.uid, 'metas', id);
  await deleteDoc(metaDocRef);
};

export const addValueToMeta = async (id: string, valor: number): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    // Para esta operação, primeiro precisamos ler a meta
    const metas = await fetchUserMetas();
    const meta = metas.find(m => m.id === id);

    if (meta) {
        const novoValor = meta.valorAtual + valor;
        const finalizada = novoValor >= meta.valorMeta;
        await updateMeta(id, { valorAtual: novoValor, finalizada });
    } else {
        throw new Error('Meta não encontrada para adicionar valor.');
    }
};

export const calcularProgresso = (valorAtual: number, valorMeta: number): number => {
    if (valorMeta === 0) return 0;
    return Math.min((valorAtual / valorMeta) * 100, 100);
};

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}; 