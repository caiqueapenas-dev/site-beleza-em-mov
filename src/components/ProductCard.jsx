// src/components/ProductCard.jsx
import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ));
  return <div className="flex">{stars}</div>;
};

function ProductCard({ product }) {
  // checagem mais robusta para desconto
  const hasDiscount =
    product.desconto_percentual != null && product.desconto_percentual > 0;

  const finalPrice = hasDiscount
    ? product.price * (1 - product.desconto_percentual / 100)
    : product.price;

  const originalPriceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  const finalPriceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(finalPrice);

  // usa a primeira imagem do array 'images' como capa
  const coverImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/400x500.png?text=sem+imagem';

  return (
    <Link
      to={`/produto/${product._id}`}
      className="product-card bg-white rounded-lg p-4 text-left group flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300 relative"
    >
      {hasDiscount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{product.desconto_percentual}%
        </div>
      )}

      <img
        src={coverImage}
        alt={product.name}
        className="w-full h-auto object-cover rounded-md mb-4 aspect-[4/5]"
      />
      <div className="flex-grow">
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
          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              {originalPriceFormatted}
            </p>
          )}
        </div>
      </div>
      <button className="w-full mt-4 bg-gray-800 text-white py-2 rounded-lg font-semibold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        ver opções
      </button>
    </Link>
  );
}

export default ProductCard;