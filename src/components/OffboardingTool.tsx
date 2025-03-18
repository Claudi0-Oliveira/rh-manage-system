import React, { useState } from 'react';
import { useTheme } from '../lib/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { ArrowLeft, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OffboardingTool() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [sheetFile, setSheetFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (sheetFile) {
        alert("Você não pode selecionar ambos os tipos de arquivo. Por favor, selecione apenas um tipo de arquivo (Áudio ou Planilha).");
        e.target.value = '';
        return;
      }
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (audioFile) {
        alert("Você não pode selecionar ambos os tipos de arquivo. Por favor, selecione apenas um tipo de arquivo (Áudio ou Planilha).");
        e.target.value = '';
        return;
      }
      setSheetFile(e.target.files[0]);
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleDashboardClick = () => {
    navigate('/offboarding/dashboard');
  };

  const handleUpload = async () => {
    if (!audioFile && !sheetFile) return;

    setIsUploading(true);
    const formData = new FormData();
    let fileType = '';

    if (audioFile) {
      formData.append('audio', audioFile);
      fileType = 'audio';
    }
    if (sheetFile) {
      formData.append('sheet', sheetFile);
      fileType = 'planilha';
    }
    
    formData.append('type', fileType);
    
    try {
      const response = await fetch('https://webhookn8n.altivus-ai.com/webhook/recebe-dados', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      alert('Arquivo enviado com sucesso!');
      // Reset form
      setAudioFile(null);
      setSheetFile(null);
      // Clear file inputs
      const audioInput = document.getElementById('audioFile') as HTMLInputElement;
      const sheetInput = document.getElementById('sheetFile') as HTMLInputElement;
      if (audioInput) audioInput.value = '';
      if (sheetInput) sheetInput.value = '';
    } catch (error) {
      alert('Erro ao enviar arquivo!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient'}`}>
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      {/* Fixed positioned navigation and theme controls */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={handleBackClick}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
      </div>
      
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <div className="relative">
          <div className="absolute -bottom-12 right-0 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-10">
            Dashboard Interativo
            <div className="absolute -top-1 right-5 w-2 h-2 bg-blue-600 transform rotate-45"></div>
          </div>
          
          <button
            onClick={handleDashboardClick}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-md relative animate-pulse-subtle"
            aria-label="Ver Dashboard Interativo"
            title="Dashboard Interativo"
          >
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
            <BarChart size={20} className="text-white" />
          </button>
        </div>
        <ThemeToggle />
      </div>
      
      <div className="relative container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <header className="mb-12 text-center w-full pt-10">
          <div className="inline-block p-2 px-4 rounded-full bg-white/10 text-white/70 text-sm mb-4">
            Automação de Offboarding
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Automação Inteligente de Resumo e Classificação de Entrevistas de Desligamento
          </h1>
          
          <div className="flex mt-4 mb-2 justify-center">
            <div className="bg-blue-600/90 text-white py-2 px-4 rounded-lg text-sm flex items-center space-x-2 shadow-lg animate-pulse">
              <BarChart size={18} />
              <span>Confira as estatísticas no <b>Dashboard Interativo</b> no canto superior direito</span>
              <svg width="20" height="20" className="ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </header>

        <div className={`${darkMode ? 'bg-gray-800/80' : 'glass'} border ${darkMode ? 'border-gray-700' : 'border-white/20'} rounded-2xl p-8 md:p-12 max-w-2xl w-full relative`}>
          <div className="absolute inset-0 grid-pattern opacity-40 rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-gray-100 mb-6 text-center">
              Faça o Upload do Arquivo da Entrevista abaixo
            </h3>
            
            <div className="flex flex-col gap-4 items-center">
              <label 
                htmlFor="audioFile" 
                className="w-full text-center py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium cursor-pointer hover:shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700"
              >
                Upload Áudio
              </label>
              <input 
                type="file" 
                id="audioFile" 
                accept="audio/*" 
                className="hidden" 
                onChange={handleAudioChange}
              />
              
              <p className={`my-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>ou</p>
              
              <label 
                htmlFor="sheetFile" 
                className="w-full text-center py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium cursor-pointer hover:shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700"
              >
                Upload Planilha
              </label>
              <input 
                type="file" 
                id="sheetFile" 
                accept=".xls,.xlsx,.csv" 
                className="hidden" 
                onChange={handleSheetChange}
              />
              
              {(audioFile || sheetFile) && (
                <button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isUploading 
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg'
                  }`}
                >
                  {isUploading ? 'Enviando...' : 'Enviar Arquivo'}
                </button>
              )}
              
              {audioFile && (
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Arquivo de áudio selecionado: {audioFile.name}
                </p>
              )}
              
              {sheetFile && (
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Planilha selecionada: {sheetFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 