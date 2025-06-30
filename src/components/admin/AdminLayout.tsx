"use client";

import React, { ReactNode, useEffect } from 'react'; 
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Box, ShoppingBag, Users, FolderKanban } from 'lucide-react';

// -------------------------------------------------------------------------- #
//                            TIPAGEM DO COMPONENTE                          #
// -------------------------------------------------------------------------- #
interface AdminLayoutProps {
  children: ReactNode;
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DE LAYOUT ADMIN                         #
// -------------------------------------------------------------------------- #
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading, logout } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !user.is_superuser) {
        
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.is_superuser) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando ou redirecionando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Menu Lateral Fixo */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0 hidden md:block">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          <Link href="/admin/dashboard">Admin Panel</Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/categories" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
            <FolderKanban className="mr-3 h-5 w-5" />
            Categorias
          </Link>
          <Link href="/admin/products" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
            <Box className="mr-3 h-5 w-5" />
            Produtos
          </Link>
          <Link href="/admin/orders" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
            <ShoppingBag className="mr-3 h-5 w-5" />
            Pedidos
          </Link>
          <Link href="/admin/users" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
            <Users className="mr-3 h-5 w-5" />
            Usuários
          </Link>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div /> {/* Elemento vazio para empurrar o resto para a direita */}
          <div>
            <span className="text-gray-700 mr-4">Bem-vindo, {user.full_name}</span>
            <Button variant="outline" size="sm" onClick={logout}>Sair</Button>
          </div>
        </header>

        <main className="flex-grow p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

import { Button } from '../ui/button';

export default AdminLayout;