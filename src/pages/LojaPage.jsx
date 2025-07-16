// src/pages/LojaPage.jsx
import React, { useState, useEffect } from 'react';
import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

// Importamos os dados diretamente do arquivo JSON
import productsData from '../data/produtos.json';

function LojaPage() {
  // Criamos um estado para armazenar a lista de produtos
  const [products, setProducts] = useState([]);

  // useEffect é usado para executar ações quando o componente carrega.
  // O array vazio [] no final garante que ele rode apenas uma vez.
  useEffect(() => {
    // Carregamos os dados importados para o nosso estado
    setProducts(productsData);
  }, []);

  return (
    <>
      <LojaHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Futuramente, o banner e os filtros virão aqui */}

        <div className="flex flex-col md:flex-row gap-8">
          {/* A barra lateral de filtros <aside> virá aqui */}
          
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">Todos os Produtos</h2>
            <div id="product-grid" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {/* Usamos o .map() para percorrer a lista de produtos no estado.
                Para cada 'product' na lista, renderizamos um componente <ProductCard>.
                A 'key' é um identificador único que o React precisa para otimizar a lista.
                Passamos o objeto 'product' inteiro como uma 'prop'.
              */}
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default LojaPage;