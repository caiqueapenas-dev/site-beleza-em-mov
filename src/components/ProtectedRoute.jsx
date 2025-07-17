// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

// Este componente recebe 'children', que são os componentes que ele deve renderizar se o usuário estiver logado.
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // Pega o status de autenticação do nosso contexto
  const location = useLocation();

  // Se o usuário NÃO estiver autenticado...
  if (!isAuthenticated) {
    // ...redirecione-o para a página de login.
    // O 'replace' evita que o usuário possa usar o botão "voltar" do navegador para acessar a página protegida.
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  // Se o usuário estiver autenticado, renderize os componentes filhos (a página do painel).
  return children;
}

export default ProtectedRoute;
