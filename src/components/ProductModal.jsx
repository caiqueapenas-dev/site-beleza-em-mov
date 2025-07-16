import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';

// Componente auxiliar para renderizar as estrelas de avaliação
const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
    return <div className="flex">{stars}</div>;
};


function ProductModal({ product, onClose, onAddToCart, onRequestSize }) {
    // --- ESTADOS DO MODAL ---
    const [selectedSize, setSelectedSize] = useState(null);
    const [customSize, setCustomSize] = useState('');
    const [isCustomRequestVisible, setIsCustomRequestVisible] = useState(false);

    // Efeito para resetar o estado sempre que um novo produto for aberto
    useEffect(() => {
        setSelectedSize(null);
        setIsCustomRequestVisible(false);
        setCustomSize('');
    }, [product]);

    // Se nenhum produto estiver selecionado, não renderize o modal
    if (!product) {
        return null;
    }

    // Função para o botão principal de adicionar ao carrinho
    const handleAddToCartClick = () => {
        if (selectedSize) {
            onAddToCart(product, selectedSize);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            {/* Overlay para fechar o modal ao clicar fora */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative overflow-hidden animate-fade-in">
                
                {/* Lado Esquerdo: Imagem do Produto */}
                <div className="w-full md:w-1/2">
                    <img src={product.image} alt={product.name} className="w-full h-80 object-cover md:h-full" />
                </div>

                {/* Lado Direito: Detalhes do Produto */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
                        <X className="w-6 h-6" />
                    </button>

                    {/* Bloco de Informações Principais */}
                    <div className='mb-6'>
                      <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                      <div className="my-3"><StarRating rating={product.avaliacao} /></div>
                      <p className="text-4xl font-light text-gray-800">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </p>
                    </div>

                    {/* Bloco de Conteúdo (com scroll se necessário) */}
                    <div className="flex-grow space-y-6">
                        
                        {/* Seção de Seleção de Tamanhos */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">SELECIONE O TAMANHO</h3>
                            <div className="flex flex-wrap gap-3 items-center">
                                {/* Mapeia dinamicamente os tamanhos do estoque */}
                                {product.estoque && Object.keys(product.estoque).map(size => {
                                    const isInStock = product.estoque[size] > 0;
                                    
                                    // Renderiza botão SELECIONÁVEL se tiver estoque
                                    if (isInStock) {
                                        return (
                                            <button key={size} onClick={() => setSelectedSize(size)} className={`border rounded-md w-14 h-12 transition-colors ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-400 hover:bg-gray-200'}`}>
                                                {size}
                                            </button>
                                        );
                                    } 
                                    // Renderiza botão DESABILITADO se o estoque for 0
                                    else {
                                        return (
                                            <div key={size} className="relative" title="Produto esgotado">
                                                <button disabled className="border rounded-md w-14 h-12 bg-gray-100 text-gray-400 cursor-not-allowed">{size}</button>
                                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400 transform -rotate-12"></div>
                                            </div>
                                        );
                                    }
                                })}

                                {/* Botão para revelar a opção de solicitar outro tamanho */}
                                <button onClick={() => setIsCustomRequestVisible(true)} title="Solicitar um tamanho diferente" className="text-sm text-cyan-700 font-semibold hover:underline px-2">
                                    Não achou o tamanho que procurava? Solicite aqui.
                                </button>
                            </div>

                            {/* Seção de solicitação customizada (só aparece se 'isCustomRequestVisible' for true) */}
                            {isCustomRequestVisible && (
                                <div className="mt-4 pt-4 border-t animate-fade-in">
                                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Digite o tamanho desejado:</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text" value={customSize} onChange={(e) => setCustomSize(e.target.value.toUpperCase())}
                                            placeholder="Ex: PP, XG, 38..."
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <button
                                            onClick={() => { if (customSize) onRequestSize(product, customSize); }}
                                            disabled={!customSize}
                                            className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-md whitespace-nowrap hover:bg-cyan-700 disabled:bg-gray-400"
                                        >
                                            Solicitar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Seção de Descrição */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">DESCRIÇÃO</h3>
                            <p className="text-gray-700 text-base">{product.description}</p>

                        </div>
                    </div>

                    {/* Botão de Adicionar ao Carrinho (sempre no final) */}
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