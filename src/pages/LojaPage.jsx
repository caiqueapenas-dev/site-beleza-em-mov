// src/pages/LojaPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

// componentes
import LojaHeader from '../components/LojaHeader';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FilterDropdown from '../components/FilterDropdown';
import Loader from '../components/Loader';

function LojaPage() {
  // --- estados principais ---
  const [products, setProducts] = useState([]);
  const [allProductsForFilters, setAllProductsForFilters] = useState([]);
  const [promoSettings, setPromoSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- estados de ui (interface do usuário) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- estados dos filtros ---
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('todos');
  const [selectedColor, setSelectedColor] = useState('todos');

  // carrega produtos do backend com base nos filtros
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const params = new URLSearchParams({
        q: searchTerm,
        page: currentPage,
        categoria: activeCategory,
        tamanho: selectedSize,
        cor: selectedColor,
      });

      try {
        const response = await fetch(`/api/produtos?${params.toString()}`);
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('falha ao buscar produtos da api:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage, activeCategory, selectedSize, selectedColor]);

  // carrega todas as opções de filtros uma única vez
  useEffect(() => {
    const fetchAllProductsForFilters = async () => {
      try {
        const response = await fetch('/api/produtos?limit=1000');
        const data = await response.json();
        setAllProductsForFilters(data.products || []);
      } catch (error) {
        console.error('falha ao buscar produtos para filtros:', error);
      }
    };

    fetchAllProductsForFilters();

    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        const data = await response.json();
        setPromoSettings(data);
      } catch (error) {
        console.error('falha ao buscar promoções na loja:', error);
      }
    };
    fetchPromotions();
  }, []);

  // calcula dinamicamente os filtros disponíveis
  const { availableCategories, availableSizes, availableColors } =
    useMemo(() => {
      const categories = [
        ...new Set(
          allProductsForFilters.map((p) => p.categoria).filter(Boolean),
        ),
      ].sort();

      const sizes = [
        ...new Set(
          allProductsForFilters.flatMap((p) =>
            p.estoque ? Object.keys(p.estoque) : [],
          ),
        ),
      ].sort();

      const colors = allProductsForFilters
        .flatMap((p) => p.cores || [])
        .reduce((acc, color) => {
          if (color && color.nome && !acc.some((c) => c.nome === color.nome)) {
            acc.push(color);
          }
          return acc;
        }, [])
        .sort((a, b) => a.nome.localeCompare(b.nome));

      return {
        availableCategories: categories,
        availableSizes: sizes,
        availableColors: colors,
      };
    }, [allProductsForFilters]);

  const handleClearFilters = () => {
    setActiveCategory('todos');
    setSearchTerm('');
    setSelectedSize('todos');
    setSelectedColor('todos');
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

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
        onSearchChange={handleSearchChange}
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
              onCategoryChange={handleFilterChange(setActiveCategory)}
              availableCategories={availableCategories}
              selectedColor={selectedColor}
              onColorChange={handleFilterChange(setSelectedColor)}
              availableColors={availableColors}
              selectedSize={selectedSize}
              onSizeChange={handleFilterChange(setSelectedSize)}
              availableSizes={availableSizes}
              onClearFilters={handleClearFilters}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-24">
              <Loader />
            </div>
          ) : (
            <>
              <div
                id="product-grid"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-12 px-6 bg-gray-100 rounded-lg col-span-full mt-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    nenhum produto encontrado
                  </h3>
                  <p className="mt-2 text-gray-600">
                    tente usar outros filtros ou clique em "limpar filtros".
                  </p>
                </div>
              )}
            </>
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
    </>
  );
}

export default LojaPage;