// src/components/Cart.jsx
import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // importa o hook

function Cart() {
  // pega tudo o que precisa do contexto, corrigindo a desestruturação
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();

  // se o carrinho não estiver aberto, não renderiza nada
  if (!isCartOpen) {
    return null;
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false); // fecha o carrinho ao ir para o checkout
    navigate('/checkout', { state: { items: cartItems } });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div
      onClick={() => setIsCartOpen(false)}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md h-full flex flex-col"
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">meu carrinho</h2>
          <button onClick={() => setIsCartOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-4 flex-grow overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              seu carrinho está vazio.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="flex items-center gap-4"
              >
                <img
                  src={item.images[0]} // usa a primeira imagem
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">tamanho: {item.size}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => decreaseQuantity(item._id, item.size)}
                      className="border rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item._id, item.size)}
                      className="border rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between self-stretch">
                  <p className="font-bold text-lg">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t space-y-2">
          <div className="flex justify-between font-bold text-lg">
            <span>total</span>
            <span>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </span>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
            >
              continuar comprando
            </button>
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full bg-cyan-500 text-white py-3 rounded-lg font-bold hover:bg-cyan-600 disabled:bg-gray-400"
            >
              finalizar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;