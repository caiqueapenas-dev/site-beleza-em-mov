// src/pages/LojaPage.jsx
import React, { useState, useEffect } from 'react';
import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Cart from '../components/Cart';
import FilterDropdown from '../components/FilterDropdown';

import productsData from '../data/produtos.json';

function LojaPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
});

  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // --- ESTADOS DOS FILTROS ---
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('todos'); // Novo estado para tamanho
  const [selectedColor, setSelectedColor] = useState('todos'); // Novo estado para cor
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}, [cartItems]);

  useEffect(() => {
    const savedRequests = localStorage.getItem('productRequests');
    if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
    }
}, []);

// Salva as solicitações no LocalStorage sempre que o estado 'requests' mudar
useEffect(() => {
    // Evita salvar o array vazio inicial
    if (requests.length > 0) {
        localStorage.setItem('productRequests', JSON.stringify(requests));
    }
}, [requests]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(productsData);
    }
  }, []);

  const handleProductClick = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);
  const handleAddToCart = (product, size) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id && item.size === size);
      if (itemExists) {
        return prevItems.map(item => item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevItems, { ...product, size, quantity: 1 }];
    });
    handleCloseModal(); // ADICIONE ESTA LINHA para fechar o modal do produto
    setIsCartOpen(true); // Abre o carrinho
};

  const handleCheckout = () => { /* ... */ };

  const handleMarkRequestAsSeen = (requestId) => {
    setRequests(prevRequests =>
        prevRequests.map(req =>
            req.id === requestId ? { ...req, seen: true } : req
        )
    );
    // Salva a alteração no LocalStorage
    const updatedRequests = requests.map(req => req.id === requestId ? { ...req, seen: true } : req);
    localStorage.setItem('productRequests', JSON.stringify(updatedRequests));
};

const handleIncreaseQuantity = (itemId, itemSize) => {
    setCartItems(prev => prev.map(item => 
        item.id === itemId && item.size === itemSize 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
    ));
};

const handleDecreaseQuantity = (itemId, itemSize) => {
    setCartItems(prev => prev.map(item => 
        item.id === itemId && item.size === itemSize && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
    ).filter(item => item.quantity > 0)); // Opcional: remove se a quantidade chegar a 0
};

const handleRemoveItem = (itemId, itemSize) => {
    setCartItems(prev => prev.filter(item => 
        !(item.id === itemId && item.size === itemSize)
    ));
};



// ADICIONAR ESTA FUNÇÃO
const handleRequestSize = (product, size) => {
    const newRequest = {
    id: Date.now(),
        productId: product.id,
        productName: product.name,
        requestedSize: size,
        timestamp: new Date().toISOString(),
        seen: false 
    };
    setRequests(prev => [...prev, newRequest]);
    alert(`Sua solicitação para o produto ${product.name}, tamanho ${size}, foi registrada!`);
    handleCloseModal();
};


  // --- LÓGICA DE FILTROS AVANÇADA ---

  // Pega todas as cores únicas de todos os produtos para exibir na sidebar
  const availableColors = products.flatMap(p => p.cores || [])
  .reduce((unique, color) => {
      if (!unique.some(c => c.nome === color.nome)) {
        unique.push(color);
      }
      return unique;
    }, []);

  // Limpa todos os filtros
  const handleClearFilters = () => {
    setActiveCategory('todos');
    setSearchTerm('');
    setSelectedSize('todos');
    setSelectedColor('todos');
  };

  // Aplica todos os filtros em sequência
  // Aplica todos os filtros em sequência
const filteredProducts = products
    .filter(product => activeCategory === 'todos' || product.categoria === activeCategory)
    .filter(product => {
        if (!searchTerm) return true; // Se a busca estiver vazia, não filtra
        const term = searchTerm.toLowerCase();

        const nameMatch = product.name.toLowerCase().includes(term);
        const keywordMatch = product.palavras_chave ? product.palavras_chave.toLowerCase().includes(term) : false;

        return nameMatch || keywordMatch;
    })
    .filter(product => {
        if (selectedSize === 'todos') return true; // Se não houver filtro de tamanho, inclua todos
        return product.estoque && selectedSize in product.estoque; // Senão, verifique o estoque
    })
    .filter(product => {
        if (selectedColor === 'todos') return true; // Se não houver filtro de cor, inclua todos
        if (!product.cores) return false; // Se o produto não tiver cores, ele não pode corresponder ao filtro
        return product.cores.some(color => color.nome === selectedColor); // Senão, verifique as cores
    });
    const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <LojaHeader 
    searchTerm={searchTerm}
    onSearchChange={(e) => setSearchTerm(e.target.value)}
    cartItemCount={totalItemsInCart} 
    onCartClick={() => setIsCartOpen(true)}
/><main className="container mx-auto px-4 py-8">
  <div>
    {/* Header com título e FilterDropdown */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Resultados da Busca</h2>
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

    {/* Grade de produtos */}
    <div
      id="product-grid"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    >
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          onClick={() => handleProductClick(product)}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>

    {/* Mensagem de nenhum produto encontrado */}
    {filteredProducts.length === 0 && (
      <div className="text-center py-12 px-6 bg-gray-100 rounded-lg col-span-full">
        <h3 className="text-2xl font-bold text-gray-800">Nenhum produto encontrado</h3>
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
    onRequestSize={handleRequestSize} // Adicionar esta prop
/>
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onCheckout={() => alert('Funcionalidade de Checkout não implementada.')}
        onIncreaseQuantity={handleIncreaseQuantity}
    onDecreaseQuantity={handleDecreaseQuantity}
    onRemoveItem={handleRemoveItem}
      />
    </>
  );
}

export default LojaPage;