// src/components/ProductModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // importa os estilos do carrossel

// componente auxiliar para renderizar as estrelas de avaliação
const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${
        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ));
  return <div className="flex">{stars}</div>;
};

function ProductModal({
  product,
  onClose,
  onAddToCart,
  onRequestSize,
  relatedProducts,
  onProductClick,
}) {
  // --- estados do modal ---
  const [selectedSize, setSelectedSize] = useState(null);
  const [customSize, setCustomSize] = useState('');
  const [isCustomRequestVisible, setIsCustomRequestVisible] = useState(false);
  const [requesterInfo, setRequesterInfo] = useState({ name: '', phone: '' });
  const [stockMessage, setStockMessage] = useState('');

  // efeito para resetar o estado sempre que um novo produto for aberto
  useEffect(() => {
    setSelectedSize(null);
    setIsCustomRequestVisible(false);
    setCustomSize('');
    setRequesterInfo({ name: '', phone: '' });
    setStockMessage('');
  }, [product]);

  // se nenhum produto estiver selecionado, não renderize o modal
  if (!product) {
    return null;
  }
  // lógica de preço com desconto
  const hasDiscount =
    product.desconto_percentual && product.desconto_percentual > 0;
  const currentPrice = hasDiscount
    ? product.price * (1 - product.desconto_percentual / 100)
    : product.price;

  // função para o botão principal de adicionar ao carrinho
  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setStockMessage('Por favor, selecione um tamanho.');
      return;
    }
    
    const stockLimit = product.estoque[selectedSize] || 0;
    if (stockLimit === 0) {
      setStockMessage(`Tamanho ${selectedSize.toUpperCase()} está esgotado.`);
      return;
    }
    
    setStockMessage('');
    if (selectedSize) {
      onAddToCart(product, selectedSize);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setStockMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* overlay para fechar o modal ao clicar fora */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative overflow-hidden animate-fade-in">
        {/* lado esquerdo: carrossel de imagens do produto */}
        <div className="w-full md:w-1/2">
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            useKeyboardArrows
            className="product-carousel"
          >
            {product.images && product.images.length > 0 ? (
              product.images.map((url) => (
                <div key={url}>
                  <img
                    src={url}
                    alt={product.name}
                    className="w-full h-80 object-cover md:h-full"
                  />
                </div>
              ))
            ) : (
              <div>
                <img
                  src="https://via.placeholder.com/600"
                  alt="imagem indisponível"
                  className="w-full h-80 object-cover md:h-full"
                />
              </div>
            )}
          </Carousel>
        </div>

        {/* lado direito: detalhes do produto */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* bloco de informações principais */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
            <div className="my-3">
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-light text-gray-800">
                  {new Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'brl',
                  }).format(currentPrice)}
                </p>
                {hasDiscount && (
                  <p className="text-2xl font-light text-gray-400 line-through">
                    {new Intl.NumberFormat('pt-br', {
                      style: 'currency',
                      currency: 'brl',
                    }).format(product.price)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* bloco de conteúdo (com scroll se necessário) */}
          <div className="flex-grow space-y-6">
            {/* seção de seleção de tamanhos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                selecione o tamanho
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                {product.estoque &&
                  Object.keys(product.estoque).map((size) => {
                    const isInStock = product.estoque[size] > 0;
                    return isInStock ? (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`border rounded-md w-14 h-12 transition-colors ${
                          selectedSize === size
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'border-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ) : (
                      <div
                        key={size}
                        className="relative"
                        title="produto esgotado"
                      >
                        <button
                          onClick={() => handleSizeSelect(size)}
                          className={`border rounded-md w-14 h-12 transition-colors ${
                            selectedSize === size
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-gray-100 text-gray-400 border-gray-300'
                          }`}
                        >
                          {size.toUpperCase()}
                        </button>
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400 transform -rotate-12"></div>
                      </div>
                    );
                  })}
              </div>
              {stockMessage && (
                <p className="text-red-500 text-sm mt-2">{stockMessage}</p>
              )}
            </div>

            {/* seção de descrição */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                descrição
              </h3>
              <p className="text-gray-700 text-base">{product.description}</p>
            </div>

            {/* seção de produtos relacionados */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  você também pode gostar
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedProducts.map((related) => (
                    <div
                      key={related._id}
                      onClick={() => onProductClick(related)}
                      className="cursor-pointer group text-center"
                    >
                      <img
                        src={
                          related.images && related.images.length > 0
                            ? related.images[0]
                            : 'https://via.placeholder.com/150'
                        }
                        alt={related.name}
                        className="w-full h-auto object-cover rounded-md aspect-square group-hover:opacity-80 transition-opacity"
                      />
                      <p className="text-xs mt-2 truncate">{related.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* botão de adicionar ao carrinho (sempre no final) */}
          <div className="mt-auto pt-6">
            <button
              onClick={handleAddToCartClick}
              className="w-full bg-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-cyan-700 transition-colors"
            >
              adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;