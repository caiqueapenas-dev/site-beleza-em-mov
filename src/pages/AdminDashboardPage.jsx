// src/pages/AdminDashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {
    const { user, logout } = useAuth(); // Pegamos o usuário e a função de logout do contexto
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin'); // Redireciona para a página de login após o logout
    };

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Painel do Administrador</h1>
                <div className="flex items-center gap-4">
                    {/* Mostra o email do usuário se ele existir */}
                    <span className="text-gray-600">Bem-vindo, {user ? user.email : 'Admin'}!</span>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Sair
                    </button>
                </div>
            </header>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold">Gerenciamento de Produtos</h2>
                <p className="mt-4 text-gray-700">
                    Em breve, a tabela de produtos será exibida aqui.
                </p>
            </div>
        </div>
    );
}

export default AdminDashboardPage;