import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';

// Interface para dados de usuário da tabela 'user' ajustada
interface UserData {
  unique_id: string;
  name: string;
  email: string;
  ativo: string;
  senha: string;
}

type AuthContextType = {
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
    userActive?: boolean;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Armazenamento da sessão no localStorage
const STORAGE_KEY = 'rh_user_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as UserData;
          setUserData(parsedUser);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do armazenamento:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Verificar se as credenciais são válidas
  const signIn = async (email: string, password: string) => {
    try {
      // Buscar usuário pelo email
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        return {
          error: new Error('Usuário não encontrado ou credenciais inválidas.'),
          success: false
        };
      }

      // Verificar se o usuário está ativo (agora como string "true" ou "false")
      if (data.ativo.toLowerCase() !== "true") {
        return {
          error: new Error('Seu usuário está inativo, contate o time responsável pelo sistema para obter mais informações.'),
          success: false,
          userActive: false
        };
      }

      // Verificar senha
      if (data.senha !== password) {
        return {
          error: new Error('Email ou senha incorretos.'),
          success: false
        };
      }

      // Credenciais corretas, armazenar usuário
      const userData = data as UserData;
      
      // Não armazenar a senha no estado ou localStorage
      const { senha, ...userToStore } = userData;
      
      // Armazenar no estado e localStorage
      setUserData(userToStore as UserData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userToStore));

      return {
        error: null,
        success: true,
        userActive: true
      };
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      return {
        error: new Error('Ocorreu um erro ao processar o login. Tente novamente.'),
        success: false
      };
    }
  };

  const signOut = async () => {
    // Limpar dados do usuário
    setUserData(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    userData,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 