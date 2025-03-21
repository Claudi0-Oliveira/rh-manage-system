import { supabase } from './supabase';

interface AdminAccount {
  email: string;
  name: string;
  role: 'admin';
  timestamp: number;
}

/**
 * Verifica se um email é de um administrador
 * @param email O email a ser verificado
 * @returns true se for um email de admin configurado
 */
export const isAdminEmail = (email: string): boolean => {
  const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  return email === configuredAdminEmail;
};

/**
 * Verifica se uma sessão de admin é válida
 * @returns true se a sessão for válida
 */
export const checkAdminSession = (): boolean => {
  try {
    const storedSession = localStorage.getItem('admin_session');
    
    if (!storedSession) {
      return false;
    }
    
    const session = JSON.parse(storedSession) as { email: string; isAdmin: boolean; timestamp: number };
    
    // Verificar se o email de sessão corresponde ao email de admin configurado
    if (!session.isAdmin || !isAdminEmail(session.email)) {
      return false;
    }
    
    // Verificar se a sessão não expirou (24 horas)
    const sessionAge = Date.now() - session.timestamp;
    const sessionMaxAge = 24 * 60 * 60 * 1000; // 24 horas
    
    if (sessionAge > sessionMaxAge) {
      // Sessão expirada
      localStorage.removeItem('admin_session');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar sessão de administrador:', error);
    return false;
  }
};

/**
 * Efetua logout do painel administrativo
 */
export const adminLogout = (): void => {
  localStorage.removeItem('admin_session');
  window.location.href = '/admin-login';
}; 