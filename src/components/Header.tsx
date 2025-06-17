"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-black text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">

            {/* Ícone de Menu (Sanduíche) - Só aparece em telas pequenas */}
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="text-xl md:text-3xl font-bold">
              <a href="/" className="hover:text-gray-400">COPOS DE METAL</a>
            </div>

            {/* A busca agora fica melhor centralizada */}
            <div className="hidden lg:block lg:w-1/3">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span>🛒</span>
              <a href="/cart" className="hover:text-gray-400">R$0,00</a>
            </div>
          </div>

          {/* Navegação Principal - Agora escondida em telas pequenas */}
          <nav className="hidden lg:flex justify-center space-x-6 py-2 border-t border-gray-700">
            {/* Links da Navbar */}
            <a href="/copos-termicos" className="hover:text-red-500 uppercase font-medium">Copos Térmicos</a>
            <a href="/em-oferta" className="text-red-600 hover:text-red-500 uppercase font-medium">Em Oferta</a>
          </nav>
        </div>
      </header>

      {/* Componente do Menu Móvel, renderizado fora do header */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;