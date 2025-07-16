import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
    return <div className="flex">{stars}</div>;
};

function ProductModal({ product, onClose, onAddToCart }) {
    const [selectedSize, setSelectedSize] = useState(null);

    if (!product) {
        return null;
    }
    
    const handleAddToCartClick = () => {
        if (selectedSize) {
            onAddToCart(product, selectedSize);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative overflow-hidden animate-fade-in">
                <div className="w-full md:w-1/2">
                    {/* ✅ IMAGEM CORRIGIDA: Altura fixa em telas pequenas e altura total em telas grandes */}
                    <img src={product.image} alt={product.name} className="w-full h-80 object-cover md:h-full" />
                </div>

                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                    <div className="my-3">
                        <StarRating rating={product.avaliacao} />
                    </div>
                    <p className="text-4xl font-light text-gray-800 mb-6">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">SELECIONE O TAMANHO</h3>
                            <div className="flex flex-wrap gap-3">
                                {['P', 'M', 'G', 'GG'].map(size => {
                                    const isAvailable = size in product.estoque;
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => isAvailable && setSelectedSize(size)}
                                            disabled={!isAvailable}
                                            className={`
                                                size-btn border rounded-md w-14 h-12 transition-colors relative
                                                ${isAvailable ? 'hover:bg-gray-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                                                ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-400'}
                                            `}
                                        >
                                            {size}
                                            {!isAvailable && <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400 transform -rotate-45"></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">DESCRIÇÃO</h3>
                            <p className="text-gray-700 text-base">
                                {product.material}. {product.palavras_chave}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <button 
                            onClick={handleAddToCartClick}
                            disabled={!selectedSize}
                            className="w-full bg-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;