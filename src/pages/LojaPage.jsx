// src/pages/LojaPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import { Helmet } from 'react-helmet-async';

// componentes
import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Cart from '../components/Cart';
import FilterDropdown from '../components/FilterDropdown';

function LojaPage() {
  const navigate = useNavigate();

  // --- estados principais ---
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
    }, 3000);
  };

  // --- estados de ui (interface do usuário) ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- estados dos filtros ---
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('todos');
  const [selectedColor, setSelectedColor] = useState('todos');

  // --- efeitos (carregamento e salvamento de dados) ---

  // carrega produtos do backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/produtos?q=${searchTerm}&page=${currentPage}`,
        );
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('falha ao buscar produtos da api:', error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  // carrega outras informações do localstorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('productRequests');
    if (savedRequests) setRequests(JSON.parse(savedRequests));

    const savedPromos = localStorage.getItem('promoSettings');
    if (savedPromos) setPromoSettings(JSON.parse(savedPromos));
  }, []);

  // salva o carrinho no localstorage sempre que ele muda
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // salva as solicitações no localstorage sempre que elas mudam
  useEffect(() => {
    localStorage.setItem('productRequests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'products' && event.newValue) {
        setProducts(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // --- funções de manipulação ---

  const handleProductClick = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  const handleAddToCart = (product, size) => {
    setCartItems((prev) => {
      const itemExists = prev.find(
        (item) => item._id === product._id && item.size === size,
      );
      if (itemExists) {
        return prev.map((item) =>
          item._id === product._id && item.size === size
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
      requesterName: requesterInfo.name,
      requesterPhone: requesterInfo.phone,
      timestamp: new Date().toISOString(),
      seen: false,
    };
    setRequests((prev) => [...prev, newRequest]);
    showNotification(
      `obrigado, ${requesterInfo.name}! sua solicitação foi registrada com sucesso.`,
    );
    handleCloseModal();
  };

  const handleIncreaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId && item.size === itemSize
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );

  const handleDecreaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === itemId && item.size === itemSize
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );

  const handleRemoveItem = (itemId, itemSize) =>
    setCartItems(
      (prev) =>
        prev.filter((item) => !(item._id === itemId && item.size === itemSize)),
    );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout', { state: { items: cartItems } });
  };

  // --- lógica de filtragem ---

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
    setCurrentPage(1);
  };

  const filteredProducts = products
    .filter((p) => activeCategory === 'todos' || p.categoria === activeCategory)
    .filter(
      (p) =>
        selectedSize === 'todos' || (p.estoque && selectedSize in p.estoque),
    )
    .filter(
      (p) =>
        selectedColor === 'todos' ||
        (p.cores && p.cores.some((c) => c.nome === selectedColor)),
    );

  const relatedProducts = selectedProduct
    ? products
        .filter(
          (p) =>
            p.categoria === selectedProduct.categoria &&
            p._id !== selectedProduct._id,
        )
        .slice(0, 4)
    : [];

  const totalItemsInCart = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  // --- renderização ---
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
              {searchTerm ? 'resultados da busca' : 'nossos produtos'}
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
                nenhum produto encontrado
              </h3>
              <p className="mt-2 text-gray-600">
                tente usar outros filtros ou clique em "limpar filtros".
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              anterior
            </button>
            <span className="font-semibold">
              página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              próxima
            </button>
          </div>
        )}
      </main>

      <Footer />
      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        onRequestSize={handleRequestSize}
        relatedProducts={relatedProducts}
        onProductClick={handleProductClick}
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