// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importa nosso hook
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth(); // Pega a função de login do contexto
  const navigate = useNavigate(); // Hook para navegação

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    const isLoggedIn = login(email, password); // Tenta fazer o login

    if (isLoggedIn) {
      navigate('/admin/dashboard'); // Se o login for bem-sucedido, redireciona para o painel
    } else {
      setError('Email ou senha inválidos.'); // Se falhar, mostra uma mensagem de erro
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-cyan-600">
            BeM
          </h1>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Acesso Restrito
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* ... (o resto do formulário continua igual) ... */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-bold text-gray-600 block"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-600 block"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
