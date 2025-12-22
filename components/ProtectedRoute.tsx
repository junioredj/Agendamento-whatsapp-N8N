
import React from 'react';
// Fix: Use namespace import for react-router-dom to resolve missing member errors
import * as ReactRouter from 'react-router-dom';

const { Navigate, useLocation } = ReactRouter;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  const location = useLocation();

  if (!token) {
    // Redireciona para o login, mas salva a página que o usuário tentou acessar
    return <Navigate to={`/login?redirectTo=${location.pathname}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
