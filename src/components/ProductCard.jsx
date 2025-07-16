// src/components/ProductCard.jsx
import React from 'react';
import { Star } from 'lucide-react';

// Componente para renderizar as estrelas de avaliação
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    );
  }
  return <div className="flex">{stars}</div>;
};

// O card recebe um objeto 'product' como propriedade (prop)
function ProductCard({ product }) {
  // Formata o preço para o padrão brasileiro
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div className="product-card bg-white rounded-lg p-4 text-left group flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300">
      <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-md mb-4 aspect-[4/5] pointer-events-none" />
      <div className="flex-grow pointer-events-none">
        <h4 className="font-semibold product-name text-gray-800">{product.name}</h4>
        <div className="my-2">
          <StarRating rating={product.avaliacao} />
        </div>
        <p className="font-bold mt-2 text-xl text-gray-900">{formattedPrice}</p>
      </div>
      <button className="w-full mt-4 bg-gray-800 text-white py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Ver opções
      </button>
    </div>
  );
}

export default ProductCard;