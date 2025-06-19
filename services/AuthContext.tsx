import { auth } from './firebaseConfig'; 
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';

// A interface do usuário pode ser a do próprio Firebase, que já tem 'email', 'displayName', 'uid', etc.
// Mas podemos criar uma mais simples para o nosso contexto.
interface AppUser {
  uid: string;
  email: string | null;
  nome: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, nome: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa true para esperar a verificação inicial

  // Listener do Firebase que observa mudanças no estado de autenticação
  useEffect(() => {
    // onAuthStateChanged retorna uma função de 'unsubscribe'
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Usuário está logado
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          nome: firebaseUser.displayName,
        });
      } else {
        // Usuário está deslogado
        setUser(null);
      }
      setIsLoading(false); // Verificação concluída
    });

    // Limpa o listener quando o componente desmontar
    return () => unsubscribe();
  }, []);

  const login = async (email: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      return { success: true };
    } catch (error: any) {
      // Mapeia erros do Firebase para mensagens amigáveis
      let errorMessage = 'Ocorreu um erro ao fazer login.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Email ou senha inválidos.';
      }
      console.error('Erro no login:', error.code, error.message);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, nome: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // 1. Cria o usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      
      // 2. Atualiza o perfil do usuário recém-criado para adicionar o nome
      await updateProfile(userCredential.user, {
        displayName: nome,
      });

      // 3. Atualiza nosso estado local (opcional, pois o onAuthStateChanged já fará isso)
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        nome: userCredential.user.displayName,
      });

      return { success: true };
    } catch (error: any) {
      // Mapeia erros do Firebase para mensagens amigáveis
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está cadastrado.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      }
      console.error('Erro no cadastro:', error.code, error.message);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      // O listener onAuthStateChanged cuidará de setar o user para null
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 