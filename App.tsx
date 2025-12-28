import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ← Importe o AuthProvider
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import IntegrationsPage from "./pages/IntegrationsPage";
import ProfilePage from "./pages/ProfilePage";
import ScheduleBlockingPage from "./pages/ScheduleBlockingPage";
import ThankYouPage from './pages/ThankYouPage';
import ServicesPage from "./pages/ServicesPage";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionManagementPage from './pages/SubscriptionManagementPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        {" "}
        {/* ← Tudo dentro dele agora tem acesso ao useAuth */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/precos" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} /> 

          {/* Rota de Sucesso pós-venda */}
          <Route
            path="/purchase/approved"
            element={
              <ProtectedRoute>
                <ThankYouPage />
              </ProtectedRoute>
            }
          />

          {/* Rotas Protegidas */}
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
            <Route path="/minha-assinatura" element={<SubscriptionManagementPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
