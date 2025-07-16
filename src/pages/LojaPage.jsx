// src/pages/LojaPage.jsx
import React, { useState, useEffect } from 'react';
import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Cart from '../components/Cart';
import FilterSidebar from '../components/FilterSidebar';
import productsData from '../data/produtos.json'; // Usado como carga inicial se o LocalStorage estiver vazio

function LojaPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ EFEITO PARA CARREGAR OS DADOS (com LocalStorage) - AQUI ESTÁ A CORREÇÃO
  useEffect(() => {
    // Tenta carregar os produtos do LocalStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Se não houver nada salvo, usa a carga inicial do JSON
      setProducts(productsData);
    }
  }, []);

  const handleProductClick = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);
  const handleAddToCart = (product, size) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id && item.size === size);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, size, quantity: 1 }];
    });
    handleCloseModal();
    setIsCartOpen(true);
  };
  const handleCheckout = () => {
    alert('Pedido finalizado! (Funcionalidade a ser implementada)');
  };

  const filteredProducts = products
    .filter(product => {
      if (activeCategory === 'todos') return true;
      return product.categoria === activeCategory;
    })
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <LojaHeader 
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <FilterSidebar 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          
          <div className="w-full md:w-3/4 lg:w-4/5">
            <h2 className="text-2xl font-bold mb-6 capitalize">
              {activeCategory === 'todos' ? 'Todos os Produtos' : activeCategory}
            </h2>
            
            <div id="product-grid" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} onClick={() => handleProductClick(product)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 px-6 bg-gray-100 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800">Nenhum produto encontrado</h3>
                <p className="mt-2 text-gray-600">Tente ajustar seus filtros ou o termo de busca.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ProductModal 
        product={selectedProduct} 
        onClose={handleCloseModal} 
        onAddToCart={handleAddToCart}
      />
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onCheckout={handleCheckout}
      />
    </>
  );
}

export default LojaPage;