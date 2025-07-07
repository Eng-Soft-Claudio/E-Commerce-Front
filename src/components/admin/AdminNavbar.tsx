/**
 * @file Componente Navbar para o Painel de Administração.
 * @description Renderiza a barra de navegação superior do layout administrativo,
 * exibindo a mensagem de boas-vindas ao usuário e o botão de logout.
 */

'use client';

import React from 'react';
import { LogOut, Menu, Store } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface AdminNavbarProps {
  onMenuClick: () => void;
}
/**
 * Componente de cliente que busca o usuário do AuthContext para renderizar
 * a barra de navegação superior do administrador.
 */
const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <header className="bg-white shadow-md p-4 flex justify-end items-center h-[68px]">
        <div className="animate-pulse flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded-md w-48"></div>
          <div className="h-8 bg-gray-200 rounded-md w-20"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </Button>
        <Button asChild variant="ghost" size="icon" aria-label="Ir para a loja">
          <Link href="/">
            <Store className="h-6 w-6" />
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 hidden sm:inline">Bem-vindo, {user.full_name}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
};

export default AdminNavbar;
