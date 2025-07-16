import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/produtos.json';

// Componentes
import AdminModal from '../components/AdminModal';
import ProductForm from '../components/ProductForm';
import Notification from '../components/Notification';

function AdminDashboardPage() {
  // --- ESTADOS DO COMPONENTE ---
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
  });
  const [adminSearchTerm, setAdminSearchTerm] = useState(''); // Para a busca no painel
  const [adminCategory, setAdminCategory] = useState('todos'); // Para o filtro de categoria no painel

  // --- EFEITOS DE CARREGAMENTO E SALVAMENTO ---

  // Efeito para carregar dados do LocalStorage na inicialização
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    setProducts(savedProducts ? JSON.parse(savedProducts) : productsData);

    const savedRequests = localStorage.getItem('productRequests');
    setRequests(savedRequests ? JSON.parse(savedRequests) : []);

    setIsDataLoaded(true);
  }, []);

  // Efeito para salvar produtos no LocalStorage sempre que a lista mudar
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, isDataLoaded]);

  // Efeito para salvar solicitações no LocalStorage sempre que a lista mudar
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('productRequests', JSON.stringify(requests));
    }
  }, [requests, isDataLoaded]);

  // --- FUNÇÕES DE LÓGICA ---

  const handleLogout = () => {
    // logout(); // Comentado para não precisar logar de novo durante os testes
    navigate('/admin');
  };

  const showNotification = (message) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleMarkRequestAsSeen = (requestId) => {
    const updatedRequests = requests.map((req) =>
      req.id === requestId ? { ...req, seen: true } : req,
    );
    setRequests(updatedRequests);
    showNotification('Solicitação marcada como vista!');
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
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...formData, id: editingProduct.id }
            : p,
        ),
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { ...formData, id: Date.now(), avaliacao: formData.avaliacao || 0 },
      ]);
    }
    setIsModalOpen(false);
    showNotification('Produto salvo com sucesso!');
  };

  const handleDeleteProduct = (productIdToDelete) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productIdToDelete));
      showNotification('Produto removido com sucesso!');
    }
  };

  // --- PREPARAÇÃO DE DADOS PARA COMPONENTES FILHOS ---

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

  // ADICIONE este bloco
  // Filtra os produtos para exibição no painel admin
  const filteredAdminProducts = products
    .filter((p) => adminCategory === 'todos' || p.categoria === adminCategory)
    .filter((p) =>
      p.name.toLowerCase().includes(adminSearchTerm.toLowerCase()),
    );

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Painel de Controle
          </h1>
          <p className="text-gray-500">Gerencie seus produtos e estoques.</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-gray-600">Bem-vindo, Admin!</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Abas de Navegação */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Solicitações
            {unseenRequestsCount > 0 && (
              <span className="absolute top-3 -right-3 ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unseenRequestsCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Conteúdo da Aba de PRODUTOS */}
      {activeTab === 'products' && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold">Produtos Cadastrados</h2>
            <button
              onClick={handleOpenAddModal}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg whitespace-nowrap"
            >
              Adicionar Novo
            </button>
          </div>

          {/* ADICIONE TODO ESTE BLOCO */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="Buscar por nome do produto..."
              value={adminSearchTerm}
              onChange={(e) => setAdminSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border rounded-md"
            />
            <select
              value={adminCategory}
              onChange={(e) => setAdminCategory(e.target.value)}
              className="w-full md:w-auto p-2 border rounded-md bg-white"
            >
              <option value="todos">Todas as Categorias</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">{/* ... */}</table>
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
                {filteredAdminProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3 capitalize">{product.categoria}</td>
                    <td className="p-3">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.price)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {formatStock(product.estoque)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:underline"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba de SOLICITAÇÕES */}
      {activeTab === 'requests' && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4">
            Solicitações de Clientes
          </h2>
          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 font-semibold">Cliente</th>
                    <th className="p-3 font-semibold">Contato (WhatsApp)</th>
                    <th className="p-3 font-semibold">Produto Solicitado</th>
                    <th className="p-3 font-semibold">Tamanho</th>
                    <th className="p-3 font-semibold">Data</th>
                    <th className="p-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className={`border-b transition-opacity ${req.seen ? 'opacity-50' : ''}`}
                    >
                      <td className="p-3 font-semibold">
                        {req.requesterName || 'Não informado'}
                      </td>
                      <td className="p-3">
                        {req.requesterPhone ? (
                          <a
                            href={`https://wa.me/55${(req.requesterPhone || '').replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:underline"
                          >
                            {req.requesterPhone}
                          </a>
                        ) : (
                          'Não informado'
                        )}
                      </td>
                      <td className="p-3">{req.productName}</td>
                      <td className="p-3 font-bold">{req.requestedSize}</td>
                      <td className="p-3">
                        {new Date(req.timestamp).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3">
                        {!req.seen && (
                          <button
                            onClick={() => handleMarkRequestAsSeen(req.id)}
                            className="text-green-600 hover:underline text-sm font-semibold"
                          >
                            Marcar como visto
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma solicitação no momento.</p>
          )}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
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
        visible={notification.visible}
      />
    </div>
  );
}

export default AdminDashboardPage;
