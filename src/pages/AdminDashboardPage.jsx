// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/produtos.json';

import AdminModal from '../components/AdminModal';
import ProductForm from '../components/ProductForm';

function AdminDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [requests, setRequests] = useState([]);


    useEffect(() => {
        const savedProducts = localStorage.getItem('products');
        const savedRequests = localStorage.getItem('productRequests');
    if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
    }
}, []);

    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem('products', JSON.stringify(products));
        }
    }, [products]);

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const formatStock = (stockObject) => {
        if (!stockObject) return 'N/A';
        return Object.entries(stockObject)
            .map(([size, quantity]) => `${size.toUpperCase()}: ${quantity}`)
            .join(' | ');
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };
    
    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (formData) => {
        if (editingProduct) {
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === editingProduct.id ? { ...p, ...formData, id: editingProduct.id } : p
                )
            );
        } else {
            setProducts(prevProducts => [
                ...prevProducts,
                { ...formData, id: Date.now(), avaliacao: formData.avaliacao || 0 }
            ]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteProduct = (productIdToDelete) => {
        if (window.confirm('Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.')) {
            setProducts(prevProducts => 
                prevProducts.filter(p => p.id !== productIdToDelete)
            );
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                 <div>
                    <h1 className="text-3xl font-bold text-gray-800">Painel de Controle</h1>
                    <p className="text-gray-500">Gerencie seus produtos e estoques.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <span className="text-gray-600">Bem-vindo, {user ? user.email : 'Admin'}!</span>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Sair</button>
                </div>
            </header>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Produtos Cadastrados</h2>
                    <button onClick={handleOpenAddModal} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                        Adicionar Novo Produto
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 font-semibold">Produto</th>
                                <th className="p-3 font-semibold">Categoria</th>
                                <th className="p-3 font-semibold">Preço</th>
                                <th className="p-3 font-semibold">Estoque</th>
                                <th className="p-3 font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3 capitalize">{product.categoria}</td>
                                    <td className="p-3">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</td>
                                    <td className="p-3 whitespace-nowrap">{formatStock(product.estoque)}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleOpenEditModal(product)} className="text-blue-600 hover:underline mr-4">Editar</button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:underline">Remover</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Solicitações de Clientes</h2>
    {requests.length > 0 ? (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 font-semibold">Produto Solicitado</th>
                        <th className="p-3 font-semibold">Tamanho</th>
                        <th className="p-3 font-semibold">Data</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="border-b">
                            <td className="p-3">{req.productName}</td>
                            <td className="p-3 font-bold">{req.requestedSize}</td>
                            <td className="p-3">{new Date(req.timestamp).toLocaleDateString('pt-BR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <p className="text-gray-500">Nenhuma solicitação de cliente no momento.</p>
    )}
</div>

            <AdminModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
            >
                <ProductForm 
                    onSubmit={handleSaveProduct}
                    // ✅ AQUI ESTÁ A CORREÇÃO
                    initialData={editingProduct || {}} 
                    onCancel={() => setIsModalOpen(false)}
                />
            </AdminModal>
        </div>
    );
}

export default AdminDashboardPage;