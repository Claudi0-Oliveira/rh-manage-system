import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import OffboardingTool from './components/OffboardingTool';
import OffboardingDashboard from './components/OffboardingDashboard';
import AdminDashboard from './components/AdminDashboard';
import ClientManagement from './components/ClientManagement';
import { ThemeProvider } from './lib/ThemeContext';
import { AuthProvider } from './lib/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas protegidas de usuário normal */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/offboarding" element={<OffboardingTool />} />
              <Route path="/offboarding/dashboard" element={<OffboardingDashboard />} />
            </Route>
            
            {/* Rotas protegidas de administrador */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/painel-admin" element={<AdminDashboard />} />
              <Route path="/gerenciar-clientes" element={<ClientManagement />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;