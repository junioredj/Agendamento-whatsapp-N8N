
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('auth_token');

  // Se não estiver autenticado, redireciona para o login salvando a rota original
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirectTo=${location.pathname}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
