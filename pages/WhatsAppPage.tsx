
import React from 'react';
// Fix: Use namespace import for react-router-dom to resolve missing member error
import * as ReactRouter from 'react-router-dom';

const { Navigate } = ReactRouter;

const WhatsAppPage: React.FC = () => {
  return <Navigate to="/integracoes" replace />;
};

export default WhatsAppPage;
