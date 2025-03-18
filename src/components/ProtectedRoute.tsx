import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function ProtectedRoute() {
  const { userData, loading } = useAuth();

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redireciona para a página de login se não estiver autenticado
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza o conteúdo da rota se estiver autenticado
  return <Outlet />;
} 