// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // importa nosso hook
import { useNavigate } from 'react-router-dom'; // para redirecionar o usuário

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // estado para controlar o carregamento

  const { login } = useAuth(); // pega a função de login do contexto
  const navigate = useNavigate(); // hook para navegação

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // limpa erros anteriores
    setIsLoading(true); // inicia o carregamento

    const isLoggedIn = await login(email, password); // tenta fazer o login (agora é assíncrono)

    setIsLoading(false); // finaliza o carregamento

    if (isLoggedIn) {
      navigate('/admin/dashboard'); // se o login for bem-sucedido, redireciona para o painel
    } else {
      setError('email ou senha inválidos.'); // se falhar, mostra uma mensagem de erro
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-cyan-600">
            bem
          </h1>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            acesso restrito
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-bold text-gray-600 block"
            >
              email
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
              senha
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
              className="w-full px-4 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400"
              disabled={isLoading} // desabilita o botão durante o carregamento
            >
              {isLoading ? 'entrando...' : 'entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;