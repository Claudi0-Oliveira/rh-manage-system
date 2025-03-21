import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { supabase } from '../lib/supabase';
import { Users, ArrowLeft, RefreshCw, LogOut } from 'lucide-react';
import { adminLogout } from '../lib/adminUtils';

interface Client {
  unique_id?: string;
  id?: string;
  "unique id"?: string;
  name: string;
  email: string;
  ativo: string;
  cpf_cnpj?: string;
  [key: string]: any; // Para outros campos possíveis
}

export default function ClientManagement() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any>(null); // Para debug
  
  // Carregar dados dos clientes
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Para debug, salvar os dados brutos para inspeção
        setRawData(data);
        console.log('Dados recebidos do Supabase:', data);
        
        // Verificar qual campo representa o ID único
        setClients(data);
      }
    } catch (err: any) {
      console.error('Erro ao carregar clientes:', err);
      setError(err.message || 'Ocorreu um erro ao carregar os dados dos clientes.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);

  // Função para obter o ID do cliente (dependendo da estrutura do banco)
  const getClientId = (client: Client): string => {
    // Tenta diferentes possibilidades de campos de ID
    return client.unique_id || client.id || client["unique id"] || (client as any).uid || 'ID não disponível';
  };

  // Função para obter o CPF/CNPJ do cliente (dependendo da estrutura do banco)
  const getClientDocument = (client: Client): string => {
    // Tenta diferentes possibilidades de campos de documento
    if (client.cpf_cnpj) return client.cpf_cnpj;
    if (client["cpf_cnpj"]) return client["cpf_cnpj"];
    if (client.cpf) return client.cpf;
    if (client.cnpj) return client.cnpj;
    return "Não informado";
  };

  const handleReturn = () => {
    navigate('/painel-admin');
  };

  const toggleClientStatus = async (client: Client) => {
    try {
      const newStatus = client.ativo.toLowerCase() === 'true' ? 'false' : 'true';
      const clientId = getClientId(client);
      
      // Determinar qual coluna usar para identificar o cliente
      const idField = client.hasOwnProperty('unique_id') ? 'unique_id' : 
                     client.hasOwnProperty('unique id') ? 'unique id' : 
                     client.hasOwnProperty('id') ? 'id' : 'unique id';
      
      const { error } = await supabase
        .from('user')
        .update({ ativo: newStatus })
        .eq(idField, clientId);
      
      if (error) {
        throw error;
      }
      
      // Atualizar a lista de clientes
      fetchClients();
    } catch (err: any) {
      console.error('Erro ao atualizar status do cliente:', err);
      setError(err.message || 'Ocorreu um erro ao atualizar o status do cliente.');
    }
  };

  const handleLogout = () => {
    adminLogout();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient'}`}>
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <button
          onClick={fetchClients}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-md"
          aria-label="Atualizar dados"
          title="Atualizar dados"
        >
          <RefreshCw size={20} className="text-white" />
        </button>
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
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={handleReturn}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-md"
            aria-label="Voltar para o Painel Administrativo"
            title="Voltar para o Painel Administrativo"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
        </div>
        
        <header className="mb-10 text-center relative pt-10">          
          <div className="inline-block p-2 px-4 rounded-full bg-white/10 text-white/70 text-sm mb-4">
            Sistema Integrado de RH
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Gerenciamento de Clientes
          </h1>
          <p className="text-blue-100/80 mb-4">
            Gerencie os cadastros e status dos clientes
          </p>
        </header>
        
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
        
        {/* Visualização de Debug (apenas em modo de desenvolvimento) */}
        {rawData && import.meta.env.DEV && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-lg overflow-auto max-h-40 text-xs bg-gray-800/70 text-gray-200 border border-gray-700">
            <div className="font-semibold mb-2">Dados recebidos (debug):</div>
            <pre>{JSON.stringify(rawData, null, 2)}</pre>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className={`max-w-6xl mx-auto rounded-2xl shadow-xl overflow-hidden ${
            darkMode 
              ? 'bg-gray-800/80 border border-gray-700' 
              : 'glass border border-white/20 backdrop-blur-sm'
          }`}>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className={darkMode ? 'bg-gray-900/80' : 'bg-blue-900/50'}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      CPF/CNPJ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-blue-900/20'}`}>
                  {clients.map((client, index) => (
                    <tr key={index} className={`${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-900/10'} transition-colors`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900 font-medium'}`}>
                        {getClientDocument(client)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900 font-medium'}`}>
                        {client.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900 font-medium'}`}>
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.ativo.toLowerCase() === 'true'
                              ? darkMode 
                                ? 'bg-green-900/30 text-green-300 border border-green-500/30'
                                : 'bg-green-900/40 text-green-100 border border-green-500/30'
                              : darkMode
                                ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                                : 'bg-red-900/40 text-red-100 border border-red-500/30'
                          }`}
                        >
                          {client.ativo.toLowerCase() === 'true' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleClientStatus(client)}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            client.ativo.toLowerCase() === 'true'
                              ? darkMode 
                                ? 'bg-red-900/30 text-red-300 border border-red-500/30 hover:bg-red-900/50'
                                : 'bg-red-900/40 text-red-100 border border-red-500/30 hover:bg-red-900/60'
                              : darkMode
                                ? 'bg-green-900/30 text-green-300 border border-green-500/30 hover:bg-green-900/50'
                                : 'bg-green-900/40 text-green-100 border border-green-500/30 hover:bg-green-900/60'
                          }`}
                        >
                          {client.ativo.toLowerCase() === 'true' ? 'Desativar' : 'Ativar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 