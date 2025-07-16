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

    // --- NOVO ESTADO ---
    // Guarda o produto que está sendo editado. Se for null, estamos no modo de "adicionar".
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            setProducts(productsData);
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

    // --- NOVAS FUNÇÕES ---

    // Abre o modal para ADICIONAR
    const handleOpenAddModal = () => {
        setEditingProduct(null); // Garante que não há produto em modo de edição
        setIsModalOpen(true);
    };
    
    // Abre o modal para EDITAR
    const handleOpenEditModal = (product) => {
        setEditingProduct(product); // Define o produto a ser editado
        setIsModalOpen(true);
    };

    // Salva o produto (seja novo ou editado)
    const handleSaveProduct = (formData) => {
        if (editingProduct) {
            // Lógica de ATUALIZAÇÃO
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === editingProduct.id ? { ...p, ...formData } : p
                )
            );
        } else {
            // Lógica de ADIÇÃO
            setProducts(prevProducts => [
                ...prevProducts,
                { ...formData, id: Date.now(), avaliacao: formData.avaliacao || 0 }
            ]);
        }
        setIsModalOpen(false); // Fecha o modal
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                 {/* ... header continua igual ... */}
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
                    {/* Botão agora usa a nova função para abrir o modal de adição */}
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
                                        {/* Botão de editar agora chama a função para abrir o modal de edição */}
                                        <button onClick={() => handleOpenEditModal(product)} className="text-blue-600 hover:underline mr-4">Editar</button>
                                        <button className="text-red-600 hover:underline">Remover</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* O Modal agora é mais inteligente */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
            >
                <ProductForm 
                    onSubmit={handleSaveProduct}
                    // Se estivermos editando, passamos os dados do produto para o formulário
                    initialData={editingProduct}
                    onCancel={() => setIsModalOpen(false)}
                />
            </AdminModal>
        </div>
    );
}

export default AdminDashboardPage;