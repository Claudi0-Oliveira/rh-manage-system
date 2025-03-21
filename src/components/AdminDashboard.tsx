import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { Users, LogOut, BarChart as ChartBar } from 'lucide-react';
import { adminLogout } from '../lib/adminUtils';

// Constante para a chave de armazenamento do usuário
const STORAGE_KEY = 'rh_user_session';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [adminName, setAdminName] = useState('Administrador');
  
  useEffect(() => {
    // Carregar o nome do administrador da sessão
    try {
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        const session = JSON.parse(adminSession);
        if (session.name) {
          setAdminName(session.name);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar nome do administrador:', error);
    }
  }, []);
  
  const handleLogout = () => {
    adminLogout();
  };

  const navigateToClientManagement = () => {
    navigate('/gerenciar-clientes');
  };

  const navigateToTools = () => {
    // Verificar se já existe uma sessão de administrador
    const adminSession = localStorage.getItem('admin_session');
    
    if (adminSession) {
      try {
        // Obter dados do admin da sessão
        const { email, name } = JSON.parse(adminSession);
        
        // Criar uma sessão de usuário para o admin, para que ele possa acessar o dashboard
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          name: name || 'Administrador do Sistema',
          email: email,
          role: 'admin'
        }));
        
        // Navegar para o dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Erro ao criar sessão de usuário para o admin:', error);
        navigate('/dashboard');
      }
    } else {
      // Navegar normalmente se não tiver sessão
      navigate('/dashboard');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient'}`}>
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <div className="p-2 px-4 rounded-full bg-white/10 text-white/90 text-sm">
          {adminName}
        </div>
        <button
          onClick={handleLogout}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-md"
          aria-label="Sair do painel administrativo"
          title="Sair do painel administrativo"
        >
          <LogOut size={20} className="text-white" />
        </button>
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <header className="mb-10 text-center relative pt-10">          
          <div className="inline-block p-2 px-4 rounded-full bg-white/10 text-white/70 text-sm mb-4">
            Sistema Integrado de RH
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Painel Administrativo
          </h1>
          <p className="text-blue-100/80 mb-4">
            Bem-vindo, {adminName}
          </p>
        </header>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de Gerenciamento de Clientes */}
          <div 
            onClick={navigateToClientManagement}
            className={`cursor-pointer rounded-2xl shadow-xl overflow-hidden p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
              darkMode 
                ? 'bg-gray-800/80 border border-gray-700 hover:bg-gray-700/80' 
                : 'glass border border-white/20 backdrop-blur-sm'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600/30' : 'bg-blue-500/30'}`}>
                <Users size={28} className={darkMode ? "text-blue-300" : "text-blue-900"} />
              </div>
              
              <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Clientes</h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                Gerencie os cadastros e status dos clientes do sistema
              </p>
              
              <div className="mt-auto">
                <span className={`inline-flex items-center text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                  Acessar gerenciamento
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          
          {/* Card de Ferramentas */}
          <div 
            onClick={navigateToTools}
            className={`cursor-pointer rounded-2xl shadow-xl overflow-hidden p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
              darkMode 
                ? 'bg-gray-800/80 border border-gray-700 hover:bg-gray-700/80' 
                : 'glass border border-white/20 backdrop-blur-sm'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600/30' : 'bg-blue-500/30'}`}>
                <ChartBar size={28} className={darkMode ? "text-blue-300" : "text-blue-900"} />
              </div>
              
              <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ferramentas</h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                Acesse as ferramentas disponíveis para os usuários
              </p>
              
              <div className="mt-auto">
                <span className={`inline-flex items-center text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                  Acessar ferramentas
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 