// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // redireciona para a página de login se não estiver autenticado
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  // se estiver autenticado, renderiza a página filha (o painel)
  return children;
}

export default ProtectedRoute;