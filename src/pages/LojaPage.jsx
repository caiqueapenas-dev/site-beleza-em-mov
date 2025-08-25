import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import { Helmet } from 'react-helmet-async';

// Componentes
import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Cart from '../components/Cart';
import FilterDropdown from '../components/FilterDropdown';

function LojaPage() {
  const navigate = useNavigate();

  // --- ESTADOS PRINCIPAIS ---
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [promoSettings, setPromoSettings] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    visible: false,
  });
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000); // A notificação some após 3 segundos
  };

  // --- ESTADOS DE UI (Interface do Usuário) ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- ESTADOS DOS FILTROS ---
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('todos');
  const [selectedColor, setSelectedColor] = useState('todos');

  // --- EFEITOS (CARREGAMENTO E SALVAMENTO DE DADOS) ---

  // Carrega produtos e solicitações do LocalStorage (ou do arquivo JSON) na primeira vez
  useEffect(() => {
    // 1. Busca os produtos da nossa nova API
    const fetchProducts = async () => {
      try {
        // Faz a chamada para a rota que criamos na Vercel
        const response = await fetch('/api/produtos');
        const data = await response.json();
        setProducts(data); // Atualiza o estado com os produtos do banco de dados
      } catch (error) {
        console.error('Falha ao buscar produtos da API:', error);
        // Opcional: carregar do localStorage como fallback se a API falhar
        // const savedProducts = localStorage.getItem('products');
        // if (savedProducts) setProducts(JSON.parse(savedProducts));
      }
    };

    fetchProducts(); // Executa a função de busca

    // 2. Mantém o carregamento das outras informações do localStorage
    const savedRequests = localStorage.getItem('productRequests');
    if (savedRequests) setRequests(JSON.parse(savedRequests));

    const savedPromos = localStorage.getItem('promoSettings'); // NOVO
    if (savedPromos) setPromoSettings(JSON.parse(savedPromos));
  }, []);

  // Salva o carrinho no LocalStorage sempre que ele muda
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Salva as solicitações no LocalStorage sempre que elas mudam
  useEffect(() => {
    localStorage.setItem('productRequests', JSON.stringify(requests));
  }, [requests]);
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Verifica se a chave 'products' foi a que mudou em outra aba
      if (event.key === 'products' && event.newValue) {
        // Atualiza o estado da loja com os novos dados do localStorage
        setProducts(JSON.parse(event.newValue));
      }
    };

    // Adiciona o "ouvinte" de eventos de storage
    window.addEventListener('storage', handleStorageChange);

    // Função de limpeza: remove o "ouvinte" quando o componente é desmontado para evitar vazamento de memória
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // O array vazio [] garante que esta lógica rode apenas uma vez (ao montar/desmontar o componente)

  // --- FUNÇÕES DE MANIPULAÇÃO ---

  const handleProductClick = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  const handleAddToCart = (product, size) => {
    setCartItems((prev) => {
      const itemExists = prev.find(
        (item) => item._id === product._id && item.size === size, // <-- MUDANÇA AQUI
      );
      if (itemExists) {
        return prev.map((item) =>
          item._id === product._id && item.size === size // <-- E AQUI
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    handleCloseModal();
    setIsCartOpen(true);
  };

  const handleRequestSize = (product, size, requesterInfo) => {
    const newRequest = {
      id: Date.now(),
      productName: product.name,
      requestedSize: size,
      requesterName: requesterInfo.name, // Novo campo
      requesterPhone: requesterInfo.phone, // Novo campo
      timestamp: new Date().toISOString(),
      seen: false,
    };
    setRequests((prev) => [...prev, newRequest]);
    // A lógica do toast virá no próximo passo, por enquanto vamos manter um alerta melhorado
    showNotification(
      `Obrigado, ${requesterInfo.name}! Sua solicitação foi registrada com sucesso.`,
    );

    handleCloseModal();
  };

  // Funções de controle do carrinho
  const handleIncreaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId && item.size === itemSize // <-- MUDANÇA AQUI
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );

  const handleDecreaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === itemId && item.size === itemSize // <-- MUDANÇA AQUI
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );

  const handleRemoveItem = (itemId, itemSize) =>
    setCartItems(
      (prev) =>
        prev.filter((item) => !(item._id === itemId && item.size === itemSize)), // <-- MUDANÇA AQUI
    );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout', { state: { items: cartItems } });
  };

  // --- LÓGICA DE FILTRAGEM ---

  const availableColors = products
    .flatMap((p) => p.cores || [])
    .reduce((unique, color) => {
      if (!unique.some((c) => c.nome === color.nome)) unique.push(color);
      return unique;
    }, []);

  const handleClearFilters = () => {
    setActiveCategory('todos');
    setSearchTerm('');
    setSelectedSize('todos');
    setSelectedColor('todos');
  };

  const filteredProducts = products
    .filter((p) => activeCategory === 'todos' || p.categoria === activeCategory)
    .filter((p) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(term);
      const keywordMatch = p.palavras_chave
        ? p.palavras_chave.toLowerCase().includes(term)
        : false;
      return nameMatch || keywordMatch;
    })
    .filter(
      (p) =>
        selectedSize === 'todos' || (p.estoque && selectedSize in p.estoque),
    )
    .filter(
      (p) =>
        selectedColor === 'todos' ||
        (p.cores && p.cores.some((c) => c.nome === selectedColor)),
    );

  const totalItemsInCart = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  // --- RENDERIZAÇÃO ---
  return (
    <>
          <Helmet>
        <title>nossa coleção - beleza em movimento</title>
        <meta
          name="description"
          content="explore nossa coleção completa de roupas fitness. encontre o look perfeito para cada tipo de treino."
        />
      </Helmet>
      <LojaHeader
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        cartItemCount={totalItemsInCart}
        onCartClick={() => setIsCartOpen(true)}
        promoBanner={promoSettings?.banner}
      />
      <main className="container mx-auto px-4 py-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {searchTerm ? 'Resultados da Busca' : 'Nossos Produtos'}
            </h2>
            <FilterDropdown
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              availableColors={availableColors}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div
            id="product-grid"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className="cursor-pointer"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 px-6 bg-gray-100 rounded-lg col-span-full mt-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Nenhum produto encontrado
              </h3>
              <p className="mt-2 text-gray-600">
                Tente usar outros filtros ou clique em "Limpar Filtros".
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        onRequestSize={handleRequestSize}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onCheckout={handleCheckout}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
      />
    </>
  );
}

export default LojaPage;
