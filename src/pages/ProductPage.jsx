// src/pages/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { Helmet } from 'react-helmet-async';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';

function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [stockMessage, setStockMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const productRes = await fetch(`/api/produtos/${id}`);
        if (!productRes.ok) throw new Error('Produto não encontrado');
        const productData = await productRes.json();
        setProduct(productData);
        setSelectedSize(null);

        const relatedRes = await fetch(
          `/api/produtos?categoria=${productData.categoria}&limit=5`,
        );
        const relatedData = await relatedRes.json();
        setRelatedProducts(
          relatedData.products.filter((p) => p._id !== id).slice(0, 4),
        );
      } catch (error) {
        console.error('Falha ao buscar dados do produto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setStockMessage('');
  };

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
    if (product) {
      addToCart(product, selectedSize);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Produto Não Encontrado</h2>
        <Link
          to="/loja"
          className="text-brand-purple hover:underline mt-4 inline-block"
        >
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  const hasDiscount = product.desconto_percentual > 0;
  const currentPrice = hasDiscount
    ? product.price * (1 - product.desconto_percentual / 100)
    : product.price;

  const allSizes = ['p', 'm', 'g', 'gg'];

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Beleza em Movimento`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <LojaHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
                      alt={`${product.name} - Imagem ${index + 1}`}
                      className="rounded-lg object-cover"
                    />
                  </div>
                ))
              ) : (
                <div>
                  <img
                    src="https://via.placeholder.com/600"
                    alt="Imagem indisponível"
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </Carousel>
          </div>

          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
            <div>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-light text-gray-800">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(currentPrice)}
                </p>
                {hasDiscount && (
                  <p className="text-2xl font-light text-gray-400 line-through">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(product.price)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">
                Selecione o Tamanho
              </h3>
              <div className="flex flex-wrap gap-3">
                {allSizes.map((size) => {
                  const isInStock =
                    product.estoque && product.estoque[size] > 0;
                  return isInStock ? (
                    <button
                      key={size}
                      onClick={() => handleSelectSize(size)}
                      className={`border rounded-md w-14 h-12 transition-colors ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ) : (
                    <div
                      key={size}
                      className="relative"
                      title="Produto esgotado"
                    >
                      <button
                        disabled
                        className="border rounded-md w-14 h-12 bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        {size.toUpperCase()}
                      </button>
                      <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400 transform -rotate-12"></div>
                    </div>
                  );
                })}
              </div>
              {stockMessage && (
                <p className="text-red-500 text-sm mt-2">{stockMessage}</p>
              )}
            </div>

            <div>
              <button
                onClick={handleAddToCartClick}
                className="w-full bg-brand-purple text-white py-4 rounded-lg font-bold text-lg hover:bg-brand-purple-dark transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Você Também Pode Gostar
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
    </>
  );
}

export default ProductPage;