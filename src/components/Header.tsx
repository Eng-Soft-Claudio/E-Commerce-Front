"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Adicionado para redirecionamento do logout

// -------------------------------------------------------------------------- #
//                          COMPONENTE DO CABEÇALHO                          #
// -------------------------------------------------------------------------- #

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, cart } = useAuth();
  const router = useRouter();

  // CORREÇÃO:
  // 1. Usar o 'final_price' que já considera descontos.
  // 2. Garantir que, se o carrinho for nulo ou o usuário for admin, o valor seja 0.
  const cartValue = (user && !user.is_superuser && cart) ? cart.final_price : 0;

  // CORREÇÃO: Envolver logout em uma função que também redireciona
  const handleLogout = () => {
    logout();
    router.push('/');
  }

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

            {/* Este campo de pesquisa pode ser implementado no futuro */}
            <div className="hidden lg:block lg:w-1/3">
              {/* <input type="text" placeholder="Pesquisar produtos..." ... /> */}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href={user.is_superuser ? "/admin/dashboard" : "/minha-conta"} className="flex items-center space-x-2 hover:text-red-500">
                    <UserIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Olá, {user.full_name.split(' ')[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-2 hover:text-red-500" aria-label="Sair">
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
                {/* Usa a variável corrigida e segura `cartValue` */}
                <span>{`R$${cartValue.toFixed(2).replace('.', ',')}`}</span>
              </Link>

            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;