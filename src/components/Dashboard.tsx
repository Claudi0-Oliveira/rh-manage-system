import { Users, Calculator, Calendar, FileText, BarChart as ChartBar, GraduationCap, Clock, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isReady?: boolean;
  url?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, onClick, isReady }) => {
  const { darkMode } = useTheme();
  
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden
        ${isReady 
          ? darkMode 
            ? 'bg-gray-800 border border-gray-700 hover:border-blue-500/50 hover:translate-y-[-4px] hover:shadow-xl' 
            : 'glass border border-white/20 hover:border-white/40 hover:translate-y-[-4px] hover:shadow-xl' 
          : 'glass-dark border border-gray-700/30'}
        flex flex-col items-center text-center group
      `}
    >
      <div className={`absolute inset-0 grid-pattern ${darkMode ? 'opacity-20' : 'opacity-40'}`}></div>
      <div className={`
        relative z-10 p-4 rounded-2xl mb-4 transition-transform duration-500 group-hover:scale-110
        ${isReady 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
          : 'bg-gray-800/50 text-gray-400'}
      `}>
        {icon}
      </div>
      <h3 className={`
        relative z-10 text-lg font-bold mb-2 
        ${isReady 
          ? darkMode 
            ? 'text-white text-shadow-sm' 
            : 'text-gray-900' 
          : 'text-gray-400'}
      `}>
        {title}
      </h3>
      <p className={`
        relative z-10 text-sm 
        ${isReady 
          ? darkMode 
            ? 'text-gray-200 text-shadow-sm' 
            : 'text-gray-700' 
          : 'text-gray-500'}
      `}>
        {description}
      </p>
      {!isReady && (
        <span className="relative z-10 mt-4 text-xs px-3 py-1.5 bg-gray-800 text-gray-400 rounded-full border border-gray-700">
          Em breve
        </span>
      )}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { userData, signOut } = useAuth();
  
  const tools = [
    {
      title: "Planos de Desenvolvimento Personalizados",
      description: "A IA automatiza a análise das avaliações de desempenho dos funcionários, das metas da empresa e do feedback para gerar um Plano de Desenvolvimento Individual (PDI personalizado para cada funcionário.",
      icon: <Users size={24} />,
    },
    {
      title: "Resolução de Conflitos nas Relações de Trabalho",
      description: "Um assistente de IA analisa reclamações e interpreta o contexto dos conflitos para sugerir resoluções com base nas diretrizes da empresa e nas melhores práticas de gestão.",
      icon: <Calculator size={24} />,
    },
    {
      title: "Recrutamento e Seleção Aprimorados",
      description: "Usando o método de contratação 'Quem', a IA cria um scorecard para vagas de emprego, automatiza a análise de currículos e gera perguntas de entrevista personalizadas, auxiliando no processo de seleção.",
      icon: <Calendar size={24} />
    },
    {
      title: "Gestão de Avaliação de Desempenho",
      description: "A IA fornece modelos de avaliação de desempenho, sugestões de feedback construtivo e planos de desenvolvimento, ajudando a gerenciar o desempenho dos funcionários de forma eficaz.",
      icon: <FileText size={24} />
    },
    {
      title: "Benefícios Personalizados para Funcionários",
      description: "A IA auxilia na análise e criação de pacotes de benefícios personalizados, considerando as necessidades e preferências dos funcionários para melhor satisfação e retenção.",
      icon: <ChartBar size={24} />
    },
    {
      title: "Programas de Bem-Estar no Local de Trabalho",
      description: "A IA recomenda iniciativas para o bem-estar no local de trabalho, incluindo programas de saúde mental e atividades de equilíbrio entre vida pessoal e profissional para melhorar o bem-estar dos funcionários.",
      icon: <GraduationCap size={24} />
    },
    {
      title: "Processo de Integração Simplificados",
      description: "A IA fornece orientação para a criação de programas de integração eficazes, garantindo que os novos funcionários tenham o treinamento e a documentação necessários para um início tranquilo.",
      icon: <Clock size={24} />
    },
    {
      title: "Automação de Offboarding Perspicaz",
      description: "Sistemas automatizados processam entrevistas de saída, identificam os principais motivos da saída e geram insights acionáveis para que o RH melhore a retenção.",
      icon: <Settings size={24} />,
      isReady: true,
      url: "/offboarding"
    }
  ];

  const handleToolClick = (index: number) => {
    if (tools[index].isReady) {
      console.log(`Abrindo ferramenta: ${tools[index].title}`);
      
      if (tools[index].url) {
        if (tools[index].url.startsWith('/')) {
          navigate(tools[index].url);
        } else {
          window.open(tools[index].url, '_blank');
        }
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient'}`}>
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        {userData && (
          <div className="p-2 px-4 rounded-full bg-white/10 text-white/90 text-sm">
            {userData.name}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-md"
          aria-label="Sair do sistema"
          title="Sair"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
        <ThemeToggle />
      </div>
      
      <div className="relative container mx-auto px-4 py-12">
        <header className="mb-16 text-center relative pt-10">          
          <div className="inline-block p-2 px-4 rounded-full bg-white/10 text-white/70 text-sm mb-4">
            Sistema Integrado de RH
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Gestão de Recursos Humanos
          </h1>
          {userData && (
            <p className="text-blue-100/80 mb-2">
              Bem-vindo(a), {userData.name}
            </p>
          )}
          <p className="text-blue-100/80 mb-4">
            Selecione uma ferramenta para começar
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              onClick={() => handleToolClick(index)}
              isReady={tool.isReady}
            />
          ))}
        </div>
      </div>
    </div>
  );
}