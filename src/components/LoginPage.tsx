import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulando login bem-sucedido
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="relative glass border border-white/20 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Bem-vindo ao Sistema de RH
          </h2>
          <p className="text-gray-600 mt-2">
            Faça login para acessar sua área de gestão
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-200"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}