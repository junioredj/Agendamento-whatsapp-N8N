// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // o contexto que criamos
import SmartIALoader from "./SmartIALoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enquanto verifica o usuário (ao carregar a app), mostra um loading
  // Enquanto verifica a sessão, mostra a animação imersiva da SmartIA
  if (loading) {
    return (
      <SmartIALoader 
        variant="dark"
        message="Verificando Credenciais"
        submessage="Aguarde enquanto validamos sua sessão de segurança..."
      />
    );
  }

  // Se não tiver usuário autenticado, redireciona para login
  if (!user) {
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  // Usuário autenticado → renderiza a página
  return <>{children}</>;
};

export default ProtectedRoute;