
import React from 'react';
// Fix: Use namespace import for react-router-dom to handle environment-specific export issues
import * as ReactRouter from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import IntegrationsPage from './pages/IntegrationsPage';
import ProfilePage from './pages/ProfilePage';
import ScheduleBlockingPage from './pages/ScheduleBlockingPage';
import ServicesPage from './pages/ServicesPage';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

const { BrowserRouter, Routes, Route, Navigate } = ReactRouter;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/precos" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrar" element={<RegisterPage />} />
        
        {/* Rotas Protegidas - Só acessíveis se logado */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/integracoes" element={<IntegrationsPage />} />
          <Route path="/bloqueio" element={<ScheduleBlockingPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
