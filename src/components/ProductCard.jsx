import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    );
  }
  return <div className="flex">{stars}</div>;
};

function ProductCard({ product }) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    // Removido o 'cursor-pointer' daqui, pois o clique é gerenciado pelo componente pai
    <div className="product-card bg-white rounded-lg p-4 text-left group flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300">
      <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-md mb-4 aspect-[4/5] pointer-events-none" />
      <div className="flex-grow pointer-events-none">
        <h4 className="font-semibold product-name text-gray-800">{product.name}</h4>
        <div className="my-2">
          <StarRating rating={product.avaliacao} />
        </div>
        <p className="font-bold mt-2 text-xl text-gray-900">{formattedPrice}</p>
      </div>
      {/* ✅ BOTÃO CORRIGIDO: classes de opacidade removidas */}
      <button className="w-full mt-4 bg-gray-800 text-white py-2 rounded-lg font-semibold transition-opacity duration-300">
        Ver opções
      </button>
    </div>
  );
}

export default ProductCard;