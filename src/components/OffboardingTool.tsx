import React, { useState } from 'react';

export default function OffboardingTool() {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="relative container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <header className="mb-12 text-center">
          <div className="inline-block p-2 px-4 rounded-full bg-white/10 text-white/70 text-sm mb-4">
            Automação de Offboarding
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Automação Inteligente de Resumo e Classificação de Entrevistas de Desligamento
          </h1>
        </header>

        <div className="glass border border-white/20 rounded-2xl p-8 md:p-12 max-w-2xl w-full">
          <div className="absolute inset-0 grid-pattern opacity-40"></div>
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
              
              <p className="text-gray-300 my-2">ou</p>
              
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
                <p className="text-sm text-gray-300 mt-2">
                  Arquivo de áudio selecionado: {audioFile.name}
                </p>
              )}
              
              {sheetFile && (
                <p className="text-sm text-gray-300 mt-2">
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