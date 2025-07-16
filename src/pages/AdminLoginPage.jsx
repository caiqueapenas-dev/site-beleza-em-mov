// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';

function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        // No futuro, a lógica de autenticação virá aqui
        console.log('Tentativa de login com:', { email, password });
        alert('Funcionalidade de login ainda não implementada.');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-cyan-600">BeM</h1>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">Acesso Restrito</h2>
                    <p className="mt-2 text-sm text-gray-600">Painel de Gerenciamento da Loja</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="seuemail@exemplo.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="text-sm font-bold text-gray-600 block">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="********"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
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