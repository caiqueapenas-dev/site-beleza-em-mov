import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
    return <div className="flex">{stars}</div>;
};

function ProductModal({ product, onClose, onAddToCart, onRequestSize }) {

    const [selectedSize, setSelectedSize] = useState(null);
const [customSize, setCustomSize] = useState(''); // ADICIONE esta linha


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
            // Verifica se o estoque para o tamanho existe e é maior que zero
            const isAvailable = product.estoque && product.estoque[size] > 0;

            // Se o tamanho estiver disponível, renderize um botão selecionável
            if (isAvailable) {
                return (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`size-btn border rounded-md w-14 h-12 transition-colors
                            ${selectedSize === size 
                                ? 'bg-gray-900 text-white border-gray-900' 
                                : 'border-gray-400 hover:bg-gray-200'
                            }`
                        }
                    >
                        {size}
                    </button>
                );
            } 
            // Se o tamanho NÃO estiver disponível, renderize o botão "Solicitar"
            else {
                return (
                    <button
                        key={size}
                        onClick={() => onRequestSize(product, size)}
                        title={`Solicitar tamanho ${size}`}
                        className="border border-dashed border-cyan-500 text-cyan-600 rounded-md w-14 h-12 text-sm font-semibold transition-colors hover:bg-cyan-50"
                    >
                        Solicitar
                    </button>
                );
            }
        })}
    </div>
</div>
<p className="text-sm text-cyan-700 font-semibold mt-2">Não encontrou o seu tamanho? Clique em "Solicitar".</p>
<div className="mt-4 pt-4 border-t">
    <label className="text-sm font-semibold text-gray-600 mb-2 block">Solicitar outro tamanho:</label>
    <div className="flex gap-2">
        <input
            type="text"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value.toUpperCase())}
            placeholder="Ex: PP, XG"
            className="w-full p-2 border rounded-md"
        />
        <button
            onClick={() => {
                if (!customSize) return; // Não faz nada se o campo estiver vazio
                onRequestSize(product, customSize);
                setCustomSize(''); // Limpa o campo após a solicitação
            }}
            disabled={!customSize} // Desabilita o botão se o campo estiver vazio
            className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-md whitespace-nowrap hover:bg-cyan-700 disabled:bg-gray-400"
        >
            Solicitar
        </button>
    </div>
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
    );
}

export default ProductModal;