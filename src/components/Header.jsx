// src/components/Header.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Menu } from 'lucide-react'
import { useCart } from '../context/CartContext'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItemsInCart, setIsCartOpen } = useCart()

  return (
    <>
      <div className="relative hero-bg text-white">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <nav className="relative z-10 p-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold tracking-tighter">
            <img
              src="https://res.cloudinary.com/dnescubo4/image/upload/v1756503535/538968010_17882407869363451_6804061717713560360_n_bzkryc.jpg"
              alt="Beleza em Movimento Logo"
              className="h-12 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/loja"
              className="hover:text-brand-purple-light transition-colors"
            >
              Coleções
            </Link>
            <Link
              to="/sobre"
              className="hover:text-brand-purple-light transition-colors"
            >
              Sobre Nós
            </Link>
            <a
              href="#contact"
              className="hover:text-brand-purple-light transition-colors"
            >
              Contato
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-brand-purple-light transition-colors"
              aria-label={`Abrir carrinho com ${totalItemsInCart} itens`}
            >
              <ShoppingCart />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItemsInCart}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu />
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden relative z-10 bg-white bg-opacity-80">
            <Link
              to="/loja"
              className="block p-4 text-center hover:bg-gray-800"
            >
              Coleções
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
  )
}

export default Header;