
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/precos" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrar" element={<RegisterPage />} />
        
        {/* Dashboard Routes with Sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/integracoes" element={<IntegrationsPage />} />
          <Route path="/bloqueio" element={<ScheduleBlockingPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
