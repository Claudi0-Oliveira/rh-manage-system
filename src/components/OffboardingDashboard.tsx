import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { ArrowLeft, BarChart } from 'lucide-react';

// We'll use a script loader approach for ApexCharts
export default function OffboardingDashboard() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<{ nome: string[], porcentagem: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  // Load ApexCharts script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if ApexCharts is already loaded
    if (window.ApexCharts) {
      setApexChartsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/apexcharts@latest';
    script.async = true;
    script.onload = () => setApexChartsLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Fetch data from the webhook
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://webhookn8n.altivus-ai.com/webhook/1739283086997x983901976261336800/dashboard');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        // Check if data has the expected format (array with an object containing nome and porcentagem)
        if (Array.isArray(data) && data.length > 0 && data[0].nome && data[0].porcentagem) {
          setChartData(data[0]);
        } else {
          throw new Error('Formato de dados inválido recebido da API');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        console.log('Usando dados de fallback');
        
        // Dados de fallback para garantir que o dashboard funcione mesmo se a API falhar
        setChartData({
          nome: [
            "Clima organizacional",
            "Falta de reconhecimento",
            "Gestão ineficiente",
            "Falta de comunicação",
            "Salário abaixo do mercado",
            "Falta de benefícios",
            "Estagnação profissional",
            "Falta de oportunidades",
            "Melhor oportunidade de emprego",
            "Reestruturação",
            "Outros"
          ],
          porcentagem: [
            "9.09%", 
            "9.09%", 
            "9.09%", 
            "9.09%", 
            "9.09%", 
            "9.09%", 
            "9.09%", 
            "9.09%", 
            "9.09%", 
            "9.09%", 
            "9.09%"
          ]
        });
        
        setLoading(false);
      }
    };
    
    loadChartData();
  }, []);

  // Initialize chart when both ApexCharts and data are loaded
  useEffect(() => {
    if (!apexChartsLoaded || !chartData || !chartRef.current || typeof window === 'undefined' || !window.ApexCharts) return;

    console.log('Rendering chart with data:', chartData);

    try {
      // Safe parsing of percentage values
      const getPercentageValues = () => {
        return chartData.porcentagem.map(p => {
          const numValue = parseFloat(p.replace('%', ''));
          return isNaN(numValue) ? 0 : numValue;
        });
      };

      // Colors for the chart
      const colors = [
        "#525AF2", "#0583F2", "#2BB8CA", "#F2A950", "#EAC43B",
        "#6A70F7", "#1F8FE0", "#35C0BA", "#F2B875", "#F0CC55"
      ];

      // Chart options
      const options = {
        series: getPercentageValues(),
        chart: {
          type: 'pie',
          height: 500,
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 1000
          },
          dropShadow: {
            enabled: true,
            top: 8,
            left: 0,
            blur: 15,
            opacity: 0.3
          },
          background: darkMode ? '#1F2937' : '#FFFFFF',
          foreColor: darkMode ? '#FFFFFF' : '#333333',
        },
        labels: chartData.nome,
        colors: colors,
        legend: {
          position: 'right',
          verticalAlign: 'middle',
          offsetY: 50,
          fontSize: '16px',
          formatter: function(seriesName: string, opts: any) {
            const percent = opts.w.globals.series[opts.seriesIndex].toFixed(1);
            return seriesName + " - " + percent + "%";
          },
          itemMargin: {
            horizontal: 15,
            vertical: 5
          },
          labels: {
            colors: darkMode ? '#FFFFFF' : '#333333'
          }
        },
        tooltip: {
          theme: darkMode ? 'dark' : 'light',
          y: {
            formatter: function(value: number) {
              return value + "%";
            }
          }
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 400
              },
              legend: {
                position: 'bottom',
                offsetY: 0,
                horizontalAlign: 'center'
              }
            }
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 300
              },
              legend: {
                fontSize: '14px'
              }
            }
          }
        ]
      };

      // Clean up previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ApexCharts = window.ApexCharts;
      chartInstance.current = new ApexCharts(chartRef.current, options);
      chartInstance.current.render();
    } catch (err) {
      console.error('Error creating chart:', err);
      setError(`Erro ao criar o gráfico: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [apexChartsLoaded, chartData, darkMode]);

  const handleBackClick = () => {
    navigate('/offboarding');
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 animate-gradient'}`}>
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      {/* Fixed positioned navigation and theme controls */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={handleBackClick}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center shadow-md"
          aria-label="Voltar para o Offboarding"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
      </div>
      
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <button
          onClick={handleHomeClick}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-md"
          aria-label="Voltar para o Dashboard Principal"
          title="Dashboard Principal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
        <ThemeToggle />
      </div>
      
      <div className="relative container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <header className="mb-12 text-center w-full pt-10">
          <div className="inline-block p-2 px-4 rounded-full bg-white/10 text-white/70 text-sm mb-4">
            Dashboard de Offboarding
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Insights de Entrevistas de Desligamento
          </h1>
          <p className="text-blue-100/80 mb-8">
            Principais motivos de saída de colaboradores
          </p>
        </header>

        <div className={`${darkMode ? 'bg-gray-800/80' : 'glass'} border ${darkMode ? 'border-gray-700' : 'border-white/20'} rounded-2xl p-8 md:p-12 w-full max-w-5xl relative`}>
          <div className="absolute inset-0 grid-pattern opacity-40 rounded-2xl"></div>
          <div className="relative z-10">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-8">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            ) : chartData ? (
              <div id="chart" ref={chartRef} className="w-full min-h-[400px] md:min-h-[500px]">
                {/* ApexCharts will render here */}
              </div>
            ) : (
              <div className="text-center text-gray-400 p-8">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 