// src/components/LojaHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu } from 'lucide-react';

function LojaHeader() {
  // A lógica do carrinho e do menu virá depois com o useState
  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-40">
      <nav className="p-4 md:px-8 flex justify-between items-center container mx-auto">
        <Link to="/" className="text-3xl font-bold tracking-tighter text-cyan-600">BeM</Link>
        <div className="relative flex-1 mx-4 md:mx-8">
          <input type="text" id="search-input" placeholder="O que você procura hoje?" className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 px-5 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
            <Search size={20} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button id="cart-button" className="relative hover:text-cyan-600 transition-colors">
            <ShoppingCart />
            <span id="cart-count" className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </button>
          <button id="mobile-menu-button-loja" className="md:hidden"><Menu /></button>
        </div>
      </nav>
    </header>
  );
}

export default LojaHeader;