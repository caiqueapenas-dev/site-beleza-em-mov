// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// componentes
import AdminModal from '../components/AdminModal';
import ProductForm from '../components/ProductForm';
import Notification from '../components/Notification';
import PromotionSettings from '../components/PromotionSettings';
import ProductsTable from '../components/ProductsTable';
import RequestsTable from '../components/RequestsTable';
import OrdersDashboard from '../components/OrdersDashboard'; // import do novo componente

function AdminDashboardPage() {
  // --- estados do componente ---
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [promoSettings, setPromoSettings] = useState({
    banner: {
      isActive: false,
      text: '',
      textColor: '#ffffff',
      backgroundColor: '#06b6d4',
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

  // --- efeitos de carregamento e salvamento ---

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
          throw new error('falha ao carregar os produtos da api.');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('falha ao buscar produtos da api:', error);
        showNotification('erro ao carregar produtos.', 'error');
      }
    };
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

  // --- funções de lógica ---

  const handleLogout = () => navigate('/admin');

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
    const method = editingProduct ? 'put' : 'post';
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
        throw new error(`falha ao ${method === 'put' ? 'editar' : 'adicionar'} produto`);
      }

      const savedProduct = await response.json();
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? savedProduct : p)),
        );
        showNotification('produto editado com sucesso!');
      } else {
        setProducts((prev) => [...prev, savedProduct]);
        showNotification('produto adicionado com sucesso!');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(`falha ao salvar produto:`, error);
      showNotification(`erro ao ${method === 'put' ? 'editar' : 'adicionar'} produto.`, 'error');
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
        method: 'delete',
      });

      if (!response.ok) {
        throw new error('falha ao deletar o produto');
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
        method: 'post',
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

  // --- preparação de dados ---
  const allNames = [...new Set(products.map((p) => p.name))];
  const allMaterials = [
    ...new Set(products.map((p) => p.material).filter(Boolean)),
  ];
  const allKeywords = [
    ...new Set(
      products.flatMap((p) =>
        p.palavras_chave
          ? p.palavras_chave.split(',').map((k) => k.trim())
          : [],
      ),
    ),
  ];
  const allCategories = [
    ...new Set(products.map((p) => p.categoria).filter(Boolean)),
  ];
  const unseenRequestsCount = requests.filter((req) => !req.seen).length;

  // --- renderização ---
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
          <span className="text-gray-600">bem-vindo, {user?.name || 'admin'}!</span>
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
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            produtos
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'promotions'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            promoções
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            solicitações
            {unseenRequestsCount > 0 && (
              <span className="absolute top-3 -right-3 ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unseenRequestsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            pedidos
          </button>
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
          initialData={editingProduct || {}}
          onCancel={() => setIsModalOpen(false)}
          allNames={allNames}
          allMaterials={allMaterials}
          allKeywords={allKeywords}
          allCategories={allCategories}
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