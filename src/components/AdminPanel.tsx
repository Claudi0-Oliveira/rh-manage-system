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

export default function AdminPanel() {
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
    navigate('/dashboard');
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-50 to-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReturn}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors`}
              aria-label="Voltar para o Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold flex items-center">
              <Users className="mr-2" />
              Painel Administrativo - Clientes
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchClients}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors flex items-center justify-center`}
              aria-label="Atualizar dados"
              title="Atualizar dados"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleLogout}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors flex items-center justify-center`}
              aria-label="Sair do painel administrativo"
              title="Sair do painel administrativo"
            >
              <LogOut size={20} />
            </button>
            <ThemeToggle />
          </div>
        </div>
        
        {error && (
          <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-100' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}
        
        {/* Visualização de Debug (apenas em modo de desenvolvimento) */}
        {rawData && import.meta.env.DEV && (
          <div className={`p-4 mb-6 rounded-lg overflow-auto max-h-40 text-xs ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
            <div className="font-semibold mb-2">Dados recebidos (debug):</div>
            <pre>{JSON.stringify(rawData, null, 2)}</pre>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className={`overflow-x-auto rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    CPF/CNPJ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {clients.map((client, index) => (
                  <tr key={index} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getClientDocument(client)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.ativo.toLowerCase() === 'true'
                            ? darkMode
                              ? 'bg-green-900/30 text-green-300'
                              : 'bg-green-100 text-green-800'
                            : darkMode
                              ? 'bg-red-900/30 text-red-300'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {client.ativo.toLowerCase() === 'true' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleClientStatus(client)}
                        className={`px-3 py-1 rounded ${
                          client.ativo.toLowerCase() === 'true'
                            ? darkMode
                              ? 'bg-red-900/30 text-red-300 hover:bg-red-900/60'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                            : darkMode
                              ? 'bg-green-900/30 text-green-300 hover:bg-green-900/60'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
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
        )}
      </div>
    </div>
  );
} 