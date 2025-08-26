// src/pages/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { Helmet } from 'react-helmet-async';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import Notification from '../components/Notification';

function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // busca o produto principal
        const productRes = await fetch(`/api/produtos/${id}`);
        if (!productRes.ok) throw new Error('produto não encontrado');
        const productData = await productRes.json();
        setProduct(productData);
        setSelectedSize(null); // reseta o tamanho ao carregar novo produto

        // busca produtos relacionados (mesma categoria)
        const relatedRes = await fetch(
          `/api/produtos?categoria=${productData.categoria}&limit=5`,
        );
        const relatedData = await relatedRes.json();
        // filtra o produto atual da lista de relacionados e limita a 4
        setRelatedProducts(
          relatedData.products.filter((p) => p._id !== id).slice(0, 4),
        );
      } catch (error) {
        console.error('falha ao buscar dados do produto:', error);
        // idealmente, redirecionar para uma página de erro 404
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(
      () => setNotification({ message: '', type, visible: false }),
      3000,
    );
  };

  const handleAddToCartClick = () => {
    if (selectedSize && product) {
      addToCart(product, selectedSize);
      showNotification(`${product.name} foi adicionado ao carrinho!`);
    }
  };

  if (!product) {
    return <div>carregando...</div>; // ou um componente de loading
  }

  const hasDiscount = product.desconto_percentual > 0;
  const currentPrice = hasDiscount
    ? product.price * (1 - product.desconto_percentual / 100)
    : product.price;

  return (
    <>
      <Helmet>
        <title>{`${product.name} - beleza em movimento`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <LojaHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* lado esquerdo: carrossel de imagens */}
          <div>
            <Carousel
              showThumbs={true}
              showStatus={false}
              infiniteLoop
              useKeyboardArrows
              className="product-page-carousel"
            >
              {product.images && product.images.length > 0 ? (
                product.images.map((url, index) => (
                  <div key={index}>
                    <img
                      src={url}
                      alt={`${product.name} - imagem ${index + 1}`}
                      className="rounded-lg object-cover"
                    />
                  </div>
                ))
              ) : (
                <div>
                  <img
                    src="https://via.placeholder.com/600"
                    alt="imagem indisponível"
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </Carousel>
          </div>

          {/* lado direito: detalhes do produto */}
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
            <div className="my-4">
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

            {/* seleção de tamanhos */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">
                selecione o tamanho
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.estoque &&
                  Object.keys(product.estoque).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md w-14 h-12 transition-colors ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
              </div>
            </div>

            {/* botão de adicionar ao carrinho */}
            <div className="mt-8">
              <button
                onClick={handleAddToCartClick}
                disabled={!selectedSize}
                className="w-full bg-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                adicionar ao carrinho
              </button>
            </div>

            {/* descrição */}
            <div className="mt-8">
              <h3 className="font-semibold mb-2">descrição</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* produtos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              você também pode gostar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
      />
    </>
  );
}

export default ProductPage;