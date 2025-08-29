// src/components/LojaHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

function LojaHeader({ searchTerm, onSearchChange, promoBanner }) {
  const { totalItemsInCart, setIsCartOpen } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      {promoBanner && promoBanner.isActive && (
        <div
          style={{
            backgroundColor: promoBanner.backgroundColor,
            color: promoBanner.textColor,
          }}
          className="py-2 text-center text-sm font-semibold"
        >
          <p>{promoBanner.text}</p>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/loja" className="text-3xl font-bold tracking-tighter">
            <img src="/logo-bem.png" alt="Beleza em Movimento Logo" className="h-10 w-auto" />
          </Link>

          <div className="relative flex-1 mx-4 md:mx-8 max-w-lg">
            <input
              type="text"
              placeholder="O que você procura hoje?"
              className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-purple-dark"
              value={searchTerm}
              onChange={onSearchChange}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              id="cart-button"
              className="relative hover:text-brand-purple transition-colors"
              aria-label={`Abrir carrinho com ${totalItemsInCart} itens`}
            >
              <ShoppingCart />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItemsInCart}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LojaHeader;