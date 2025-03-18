import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import OffboardingTool from './components/OffboardingTool';
import OffboardingDashboard from './components/OffboardingDashboard';
import { ThemeProvider } from './lib/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/offboarding" element={<OffboardingTool />} />
          <Route path="/offboarding/dashboard" element={<OffboardingDashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;