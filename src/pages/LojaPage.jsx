import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes
import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Cart from '../components/Cart';
import FilterDropdown from '../components/FilterDropdown';

// Dados
import productsData from '../data/produtos.json';

function LojaPage() {
  const navigate = useNavigate();

  // --- ESTADOS PRINCIPAIS ---
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

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
    const savedProducts = localStorage.getItem('products');
    setProducts(savedProducts ? JSON.parse(savedProducts) : productsData);

    const savedRequests = localStorage.getItem('productRequests');
    if (savedRequests) setRequests(JSON.parse(savedRequests));
  }, []);

  // Salva o carrinho no LocalStorage sempre que ele muda
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Salva as solicitações no LocalStorage sempre que elas mudam
  useEffect(() => {
    localStorage.setItem('productRequests', JSON.stringify(requests));
  }, [requests]);

  // --- FUNÇÕES DE MANIPULAÇÃO ---

  const handleProductClick = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  const handleAddToCart = (product, size) => {
    setCartItems((prev) => {
      const itemExists = prev.find(
        (item) => item.id === product.id && item.size === size,
      );
      if (itemExists) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    handleCloseModal();
    setIsCartOpen(true);
  };

  const handleRequestSize = (product, size) => {
    const newRequest = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      requestedSize: size,
      timestamp: new Date().toISOString(),
      seen: false, // Adicionado para a funcionalidade do painel admin
    };
    setRequests((prev) => [...prev, newRequest]);
    alert(
      `Sua solicitação para o produto ${product.name}, tamanho ${size}, foi registrada!`,
    );
    handleCloseModal();
  };

  // Funções de controle do carrinho
  const handleIncreaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.size === itemSize
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  const handleDecreaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId && item.size === itemSize
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const handleRemoveItem = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === itemId && item.size === itemSize)),
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
      <LojaHeader
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        cartItemCount={totalItemsInCart}
        onCartClick={() => setIsCartOpen(true)}
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
                key={product.id}
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
    </>
  );
}

export default LojaPage;
