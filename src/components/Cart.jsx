// src/components/Cart.jsx
import React from 'react';
import { X } from 'lucide-react';

// O carrinho precisa saber se está aberto (isOpen), precisa da lista de itens (cartItems), e de funções para fechar e ir para o checkout.
function Cart({ isOpen, onClose, cartItems = [], onCheckout }) {
    if (!isOpen) {
        return null;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end animate-fade-in">
            <div className="bg-white w-full max-w-md h-full flex flex-col">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold">Meu Carrinho</h2>
                    <button onClick={onClose}><X /></button>
                </div>

                <div className="p-4 flex-grow overflow-y-auto space-y-4">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Seu carrinho está vazio.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">Tamanho: {item.size}</p>
                                    <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-lg">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t">
                    <div className="flex justify-between font-bold text-lg mb-4">
                        <span>Total</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                    </div>
                    <button 
                        onClick={onCheckout}
                        disabled={cartItems.length === 0}
                        className="w-full bg-cyan-500 text-white py-3 rounded-lg font-bold hover:bg-cyan-600 disabled:bg-gray-400"
                    >
                        Finalizar Pedido no WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;