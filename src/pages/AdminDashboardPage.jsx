// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// componentes
import AdminModal from '../components/AdminModal';
import ProductForm from '../components/ProductForm';
import Notification from '../components/Notification';
import PromotionSettings from '../components/PromotionSettings';
import ProductsTable from '../components/ProductsTable';
import RequestsTable from '../components/RequestsTable';
import OrdersDashboard from '../components/OrdersDashboard';

function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [promoSettings, setPromoSettings] = useState({
    banner: {
      isActive: false,
      text: '',
      textColor: '#FFFFFF',
      backgroundColor: '#06B6D4',
    },
    coupons: [],
  });
  const [activeTab, setActiveTab] = useState('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
  });
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminCategory, setAdminCategory] = useState('todos');

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/produtos?limit=1000'); // busca todos os produtos
      if (!response.ok) {
        throw new Error('falha ao carregar os produtos da api.');
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('falha ao buscar produtos da api:', error);
      showNotification('erro ao carregar produtos.', 'error');
    }
  };

  useEffect(() => {
    fetchProducts();

    const savedRequests = localStorage.getItem('productRequests');
    setRequests(savedRequests ? JSON.parse(savedRequests) : []);

    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        const data = await response.json();
        setPromoSettings(data);
      } catch (error) {
        console.error('falha ao buscar promoções:', error);
        showNotification('erro ao carregar promoções.', 'error');
      }
    };
    fetchPromotions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(
      () => setNotification({ message: '', type, visible: false }),
      3000,
    );
  };

  const handleMarkRequestAsSeen = (requestId) => {
    const updatedRequests = requests.map((req) =>
      req.id === requestId ? { ...req, seen: true } : req,
    );
    setRequests(updatedRequests);
    localStorage.setItem('productRequests', JSON.stringify(updatedRequests));
    showNotification('solicitação marcada como vista!');
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct
      ? `/api/produtos/${editingProduct._id}`
      : '/api/produtos';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `falha ao ${method === 'PUT' ? 'editar' : 'adicionar'} produto`,
        );
      }
      // atualiza a lista de produtos após salvar
      await fetchProducts();
      showNotification(
        `produto ${method === 'PUT' ? 'editado' : 'adicionado'} com sucesso!`,
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(`falha ao salvar produto:`, error);
      showNotification(
        `erro ao ${method === 'PUT' ? 'editar' : 'adicionar'} produto.`,
        'error',
      );
    }
  };

  const handleDeleteProduct = async (productIdToDelete) => {
    if (
      !window.confirm(
        'tem certeza que deseja remover este produto? a ação não pode ser desfeita.',
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/produtos/${productIdToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('falha ao deletar o produto');
      }

      setProducts((prev) => prev.filter((p) => p._id !== productIdToDelete));
      showNotification('produto removido com sucesso!');
    } catch (error) {
      console.error('erro ao deletar produto:', error);
      showNotification('erro ao remover produto.', 'error');
    }
  };

  const handleSavePromotions = async (newSettings) => {
    try {
      await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      setPromoSettings(newSettings);
      showNotification('promoções salvas com sucesso!');
    } catch (error) {
      console.error('falha ao salvar promoções:', error);
      showNotification('erro ao salvar promoções.', 'error');
    }
  };

  // usa usememo para evitar recálculos desnecessários
  const { allCategories, allMaterials, allKeywords } = useMemo(() => {
    const categories = [
      ...new Set(products.map((p) => p.categoria).filter(Boolean)),
    ].sort();
    const materials = [
      ...new Set(products.map((p) => p.material).filter(Boolean)),
    ].sort();
    const keywords = [
      ...new Set(
        products.flatMap((p) =>
          p.palavras_chave
            ? p.palavras_chave.split(',').map((k) => k.trim())
            : [],
        ),
      ),
    ].sort();
    return {
      allCategories: categories,
      allMaterials: materials,
      allKeywords: keywords,
    };
  }, [products]);

  const unseenRequestsCount = requests.filter((req) => !req.seen).length;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            painel de controle
          </h1>
          <p className="text-gray-500">
            gerencie seus produtos, promoções e estoques.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-gray-600">
            bem-vindo, {user?.name || 'admin'}!
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            sair
          </button>
        </div>
      </header>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {/* abas de navegação */}
          {[
            { key: 'products', label: 'produtos' },
            { key: 'promotions', label: 'promoções' },
            { key: 'requests', label: 'solicitações' },
            { key: 'orders', label: 'pedidos' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.key === 'requests' && unseenRequestsCount > 0 && (
                <span className="absolute top-3 -right-3 ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unseenRequestsCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'products' && (
          <ProductsTable
            products={products}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteProduct}
            onAddNew={handleOpenAddModal}
            adminSearchTerm={adminSearchTerm}
            onAdminSearchChange={(e) => setAdminSearchTerm(e.target.value)}
            adminCategory={adminCategory}
            onAdminCategoryChange={(e) => setAdminCategory(e.target.value)}
            allCategories={allCategories}
          />
        )}

        {activeTab === 'promotions' && (
          <div className="animate-fade-in">
            <PromotionSettings
              promoSettings={promoSettings}
              onSave={handleSavePromotions}
              showNotification={showNotification}
            />
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <RequestsTable
              requests={requests}
              onMarkAsSeen={handleMarkRequestAsSeen}
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <OrdersDashboard allProducts={products} />
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'editar produto' : 'adicionar novo produto'}
      >
        <ProductForm
          onSubmit={handleSaveProduct}
          initialData={editingProduct}
          onCancel={() => setIsModalOpen(false)}
          allCategories={allCategories}
          allMaterials={allMaterials}
          allKeywords={allKeywords}
        />
      </AdminModal>

      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
      />
    </div>
  );
}

export default AdminDashboardPage;