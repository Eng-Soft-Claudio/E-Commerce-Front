"use client";

import React, { useState } from 'react';
import { Menu, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="bg-black text-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">

            {/* Ícone de Menu (Sanduíche) */}
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="text-xl md:text-3xl font-bold">
              <a href="/" className="hover:text-gray-400">ROCK N' METAL</a>
            </div>

            {/* Barra de Busca (Visível apenas em telas maiores) */}
            <div className="hidden lg:block lg:w-1/3">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Ícones da Direita: Conta e Carrinho */}
            <div className="flex items-center space-x-4">
              {/* Lógica condicional de exibição */}
              {user ? (
                <>
                  <a href="/minha-conta" className="flex items-center space-x-2 hover:text-red-500">
                    <UserIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Olá, {user.email.split('@')[0]}</span>
                  </a>
                  <button onClick={logout} className="flex items-center space-x-2 hover:text-red-500">
                    <LogOut className="h-5 w-5" />
                    <span className="hidden md:inline">Sair</span>
                  </button>
                </>
              ) : (
                <a href="/login" className="flex items-center space-x-2 hover:text-red-500">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Entrar</span>
                </a>
              )}

              <div className="h-6 w-px bg-gray-600"></div> {/* Divisor vertical */}

              <Link href="/cart" className="flex items-center space-x-2 hover:text-red-500">
                <ShoppingCart className="h-5 w-5" />
                <span>R$0,00</span>
              </Link>
            </div>

          </div>

          {/* Navegação Principal */}
          <nav className="hidden lg:flex justify-center space-x-6 py-2 border-t border-gray-700">
            <a href="/bandas" className="hover:text-red-500 uppercase font-medium">Bandas</a>
            <a href="/cds" className="hover:text-red-500 uppercase font-medium">CDs</a>
            <a href="/acessorios" className="hover:text-red-500 uppercase font-medium">Acessórios</a>
            <a href="/em-oferta" className="text-red-600 hover:text-red-500 uppercase font-medium">Em Oferta</a>
          </nav>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;