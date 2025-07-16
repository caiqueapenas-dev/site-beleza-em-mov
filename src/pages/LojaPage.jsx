// src/pages/LojaPage.jsx
import React, { useState, useEffect } from 'react';
import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal'; 
import Cart from '../components/Cart';              
import productsData from '../data/produtos.json';


function LojaPage() {
  // Criamos um estado para armazenar a lista de produtos
  const [products, setProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null); // Para controlar o produto no modal
    const [cartItems, setCartItems] = useState([]);              // Para armazenar os itens do carrinho
    const [isCartOpen, setIsCartOpen] = useState(false);          // Para controlar a visibilidade do carrinho


  // useEffect é usado para executar ações quando o componente carrega.
  // O array vazio [] no final garante que ele rode apenas uma vez.
  useEffect(() => {
    // Carregamos os dados importados para o nosso estado
    setProducts(productsData);
  }, []);
// Adicione estas funções dentro do componente LojaPage, antes do `return`

// Função para ABRIR o modal com um produto específico
const handleProductClick = (product) => {
    setSelectedProduct(product);
};

// Função para FECHAR o modal
const handleCloseModal = () => {
    setSelectedProduct(null);
};

// Função para ADICIONAR um item ao carrinho
const handleAddToCart = (product, size) => {
    setCartItems(prevItems => {
        const itemExists = prevItems.find(item => item.id === product.id && item.size === size);

        if (itemExists) {
            // Se o item já existe, aumenta a quantidade
            return prevItems.map(item =>
                item.id === product.id && item.size === size
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            // Se não existe, adiciona o novo item ao carrinho
            return [...prevItems, { ...product, size, quantity: 1 }];
        }
    });
    handleCloseModal(); // Fecha o modal
    setIsCartOpen(true); // Abre o carrinho
};

// Função para lidar com o checkout (por enquanto, apenas um alerta)
const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Lógica futura para enviar o pedido para o WhatsApp
    alert('Pedido finalizado! (Funcionalidade a ser implementada)');
};
  return (
    <>
        {/* O LojaHeader futuramente receberá a contagem de itens do carrinho */}
        <LojaHeader />

        <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full">
                    <h2 className="text-2xl font-bold mb-6">Todos os Produtos</h2>
                    <div id="product-grid" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {products.map(product => (
                            // Envolvemos o card em uma div para capturar o clique
                            <div key={product.id} onClick={() => handleProductClick(product)}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>

        <Footer />

        {/* Renderização Condicional do Modal e do Carrinho */}
        
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