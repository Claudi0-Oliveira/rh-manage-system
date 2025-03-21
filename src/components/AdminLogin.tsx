import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        throw new Error('Credenciais de administrador não configuradas. Contate o suporte técnico.');
      }
      
      if (formData.email !== adminEmail || formData.password !== adminPassword) {
        throw new Error('Credenciais de administrador inválidas.');
      }
      
      // Armazenar sessão
      localStorage.setItem('admin_session', JSON.stringify({
        email: formData.email,
        isAdmin: true,
        timestamp: new Date().getTime()
      }));
      
      // Redirecionar para o painel
      navigate('/painel');
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação. Tente novamente.');
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center py-12 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient'}`}>
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10 ${darkMode ? 'bg-gray-800 text-white' : 'glass border border-white/20'}`}>
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-white'}`}>
            Painel Administrativo
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-100'}`}>
            Acesso restrito a administradores
          </p>
        </div>
        
        {error && (
          <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-100' : 'bg-red-100/90 text-red-700'}`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-white'}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white/10 text-white border-white/20'} border focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              placeholder="admin@exemplo.com"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-white'}`}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white/10 text-white border-white/20'} border focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
              }`}
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Autenticando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className={`text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-blue-100 hover:text-white'} transition-colors`}
          >
            Voltar para o login principal
          </button>
        </div>
      </div>
    </div>
  );
} 