"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/context/AuthContext';

// -------------------------------------------------------------------------- #
//                          COMPONENTE DO CABEÇALHO                          #
// -------------------------------------------------------------------------- #

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, cart } = useAuth();

  const cartTotal = user && !user.is_superuser && cart ? cart.total_price : 0;

  return (
    <>
      <header className="bg-white text-black shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">

            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(true)} aria-label="Abrir menu">
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-xl md:text-3xl font-bold">
              <Link href="/" className="hover:text-gray-400">E-Commerce</Link>
            </div>

            <div className="hidden lg:block lg:w-1/3">
              <input 
                type="text" 
                placeholder="Pesquisar produtos..."
                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:border-red-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/minha-conta" className="flex items-center space-x-2 hover:text-red-500">
                    <UserIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Olá, {user.email.split('@')[0]}</span>
                  </Link>
                  <button onClick={logout} className="flex items-center space-x-2 hover:text-red-500" aria-label="Sair">
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex items-center space-x-2 hover:text-red-500">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Entrar</span>
                </Link>
              )}
              
              <div className="h-6 w-px bg-gray-600"></div>

              <Link href="/cart" className="flex items-center space-x-2 hover:text-red-500">
                <ShoppingCart className="h-5 w-5" />
                <span>{`R$${cartTotal.toFixed(2).replace('.', ',')}`}</span>
              </Link>
            </div>
          </div>
          
          {/* BARRA DE NAVEGAÇÃO RESTAURADA */}
          <nav className="hidden lg:flex justify-center space-x-6 py-2 border-t border-gray-700">
            <Link href="/noticias" className="hover:text-red-500 uppercase font-medium">Notícias</Link>
            <Link href="/loja" className="hover:text-red-500 uppercase font-medium">Loja</Link>
            <Link href="/em-oferta" className="text-red-600 hover:text-red-500 uppercase font-medium">Em Oferta</Link>
          </nav>
        </div>
      </header>
      
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;