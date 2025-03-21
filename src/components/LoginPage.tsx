import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../lib/AuthContext';
import { isAdminEmail } from '../lib/adminUtils';

export default function LoginPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Verificar se são credenciais de admin
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      
      if (adminEmail && adminPassword && 
          formData.email === adminEmail && 
          formData.password === adminPassword) {
        
        // Armazenar sessão de admin
        localStorage.setItem('admin_session', JSON.stringify({
          email: formData.email,
          isAdmin: true,
          timestamp: new Date().getTime()
        }));
        
        // Redirecionar para o painel administrativo
        navigate('/painel-admin');
        return;
      }
      
      // Se não for admin, tentar login normal
      const { error, success, userActive } = await signIn(formData.email, formData.password);
      
      if (!success) {
        if (userActive === false) {
          setError("Seu usuário está inativo, contate o time responsável pelo sistema para obter mais informações.");
        } else if (error) {
          setError(error.message);
        } else {
          setError("Falha ao fazer login. Verifique suas credenciais.");
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient'} flex items-center justify-center p-4`}>
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className={`relative ${darkMode ? 'bg-gray-800/80' : 'glass'} border ${darkMode ? 'border-gray-700' : 'border-white/20'} rounded-2xl shadow-xl p-8 w-full max-w-md`}>
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Bem-vindo ao Sistema de RH
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Faça login para acessar sua área de gestão
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white/50 border-gray-200'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="seu@email.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              Senha
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white/50 border-gray-200'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg transition duration-200 ${
              loading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:from-blue-600 hover:to-indigo-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}