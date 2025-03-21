import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { checkAdminSession } from '../lib/adminUtils';
import { useEffect, useState } from 'react';

export default function ProtectedRoute() {
  const { userData, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  useEffect(() => {
    // Verificar se existe uma sessão de administrador válida
    const checkAdmin = () => {
      const adminStatus = checkAdminSession();
      setIsAdmin(adminStatus);
      setCheckingAdmin(false);
      
      // Se for admin e não tiver userData, imprimir na console para debug
      if (adminStatus && !userData) {
        console.log("Admin detectado sem userData", adminStatus);
      }
    };
    
    checkAdmin();
  }, [userData]);

  // Mostra um indicador de carregamento enquanto verifica ambas autenticações
  if ((loading || checkingAdmin) && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se for admin ou usuário normal, permite acesso
  if (isAdmin || userData) {
    return <Outlet />;
  }
  
  // Redireciona para a página de login se não estiver autenticado
  return <Navigate to="/login" replace />;
} 