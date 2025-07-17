// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Usado para navegação interna
import { ShoppingCart, Menu } from 'lucide-react';

function Header() {
  // Lógica para controlar o estado do menu mobile (aberto ou fechado)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // O HTML do header é envolvido por um elemento pai para evitar erros
    <>
      <div className="relative hero-bg text-white">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <nav className="relative z-10 p-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold tracking-tighter">
            BeM
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/loja" className="hover:text-cyan-300 transition-colors">
              Coleções
            </Link>
            <Link to="/loja" className="hover:text-cyan-300 transition-colors">
              Mais Vendidos
            </Link>
            <Link to="/sobre" className="hover:text-cyan-300 transition-colors">
              Sobre Nós
            </Link>
            <a
              href="#contact"
              className="hover:text-cyan-300 transition-colors"
            >
              Contato
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/loja" className="hover:text-cyan-300 transition-colors">
              <ShoppingCart />
            </Link>
            {/* Ao clicar no botão de menu, o estado isMenuOpen é alterado */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu />
            </button>
          </div>
        </nav>

        {/* O menu mobile só é exibido se o estado 'isMenuOpen' for verdadeiro */}
        {isMenuOpen && (
          <div className="md:hidden relative z-10 bg-black bg-opacity-80">
            <Link
              to="/loja"
              className="block p-4 text-center hover:bg-gray-800"
            >
              Coleções
            </Link>
            <Link
              to="/loja"
              className="block p-4 text-center hover:bg-gray-800"
            >
              Mais Vendidos
            </Link>
            <Link
              to="/sobre"
              className="block p-4 text-center hover:bg-gray-800"
            >
              Sobre Nós
            </Link>
            <a
              href="#contact"
              className="block p-4 text-center hover:bg-gray-800"
            >
              Contato
            </a>
          </div>
        )}
      </div>
    </>
  );
}

// ✅ A linha essencial que estava faltando
export default Header;
