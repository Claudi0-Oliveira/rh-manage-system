import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkAdminSession } from '../lib/adminUtils';

export default function ProtectedAdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkSession = () => {
      const isValid = checkAdminSession();
      setIsAuthenticated(isValid);
    };
    
    checkSession();
  }, []);
  
  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redireciona para a página de login admin se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  
  // Renderiza o conteúdo da rota se estiver autenticado
  return <Outlet />;
} 