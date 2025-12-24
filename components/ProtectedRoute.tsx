// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // o contexto que criamos

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enquanto verifica o usuário (ao carregar a app), mostra um loading
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Se não tiver usuário autenticado, redireciona para login
  if (!user) {
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  // Usuário autenticado → renderiza a página
  return <>{children}</>;
};

export default ProtectedRoute;