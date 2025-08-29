// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const isLoggedIn = await login(email, password);

    setIsLoading(false);

    if (isLoggedIn) {
      navigate('/admin/dashboard');
    } else {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img src="/logo-bem.png" alt="Beleza em Movimento Logo" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Acesso Restrito
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
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
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
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
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-brand-purple rounded-lg hover:bg-brand-purple-dark disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;