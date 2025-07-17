// src/components/ProductCard.jsx
import React from 'react';
import { Star } from 'lucide-react';

// Componente para renderizar as estrelas de avaliação
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />,
    );
  }
  return <div className="flex">{stars}</div>;
};

function ProductCard({ product }) {
  // 1. A verificação crucial: o desconto só é "real" se for maior que zero.
  const hasDiscount =
    product.desconto_percentual && product.desconto_percentual > 0;

  // 2. O preço final é calculado com base na verificação acima.
  const finalPrice = hasDiscount
    ? product.price * (1 - product.desconto_percentual / 100)
    : product.price;

  // 3. Formatação dos valores para a moeda brasileira (R$).
  const originalPriceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  const finalPriceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(finalPrice);

  return (
    <div className="product-card bg-white rounded-lg p-4 text-left group flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300 relative">
      {/* A tag de % de desconto só aparece se 'hasDiscount' for verdadeiro */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{product.desconto_percentual}%
        </div>
      )}

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-auto object-cover rounded-md mb-4 aspect-[4/5] pointer-events-none"
      />
      <div className="flex-grow pointer-events-none">
        <h4 className="font-semibold product-name text-gray-800">
          {product.name}
        </h4>
        <div className="my-2">
          <StarRating rating={product.avaliacao} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-bold text-xl text-gray-900">
            {finalPriceFormatted}
          </p>

          {/* O preço antigo riscado só aparece se 'hasDiscount' for verdadeiro */}
          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              {originalPriceFormatted}
            </p>
          )}
        </div>
      </div>
      <button className="w-full mt-4 bg-gray-800 text-white py-2 rounded-lg font-semibold transition-opacity duration-300">
        Ver opções
      </button>
    </div>
  );
}

export default ProductCard;
