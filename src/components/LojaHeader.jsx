// src/components/LojaHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu } from 'lucide-react';

// O Header agora recebe o termo da busca (searchTerm) e a função para alterá-lo (onSearchChange)
function LojaHeader({ searchTerm, onSearchChange, cartItemCount }) {


  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-40">
      <nav className="p-4 md:px-8 flex justify-between items-center container mx-auto">
        <Link to="/" className="text-3xl font-bold tracking-tighter text-cyan-600">BeM</Link>
        <div className="relative flex-1 mx-4 md:mx-8">
          {/* O input agora é um "componente controlado".
            - O `value` é definido pelo estado do componente pai (LojaPage).
            - O `onChange` chama a função do pai para atualizar o estado a cada letra digitada.
          */}
          <input
            type="text"
            placeholder="O que você procura hoje?"
            className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-5 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={searchTerm}
            onChange={onSearchChange}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
            <Search size={20} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button id="cart-button" className="relative hover:text-cyan-600 transition-colors">
            <ShoppingCart />
           <span id="cart-count" className="absolute -top-2 -right-2 ...">
    {cartItemCount}
</span>
          </button>
          <button id="mobile-menu-button-loja" className="md:hidden"><Menu /></button>
        </div>
      </nav>
    </header>
  );
}

export default LojaHeader;