// src/components/admin/AdminMobileMenu.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  LayoutDashboard,
  Box,
  ShoppingBag,
  Users,
  FolderKanban,
  LogOut,
  GalleryHorizontal, 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminMobileMenu = ({ isOpen, onClose }: AdminMobileMenuProps) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLinkClick = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogoutClick = () => {
    logout();
    onClose();
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 lg:hidden transition-opacity duration-300', 
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Conteúdo do Menu */}
      <div
        className={cn(
          'relative w-4/5 max-w-sm bg-gray-800 text-white h-full shadow-xl transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white"
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="p-4 space-y-2 flex-grow">
            <NavItem onClick={() => handleLinkClick('/admin/dashboard')} icon={LayoutDashboard}>
              Dashboard
            </NavItem>
            <NavItem onClick={() => handleLinkClick('/admin/banners')} icon={GalleryHorizontal}>
              Banners
            </NavItem>
            <NavItem onClick={() => handleLinkClick('/admin/categories')} icon={FolderKanban}>
              Categorias
            </NavItem>
            <NavItem onClick={() => handleLinkClick('/admin/products')} icon={Box}>
              Produtos
            </NavItem>
            <NavItem onClick={() => handleLinkClick('/admin/orders')} icon={ShoppingBag}>
              Pedidos
            </NavItem>
            <NavItem onClick={() => handleLinkClick('/admin/users')} icon={Users}>
              Usuários
            </NavItem>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <Button variant="destructive" className="w-full" onClick={handleLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({
  onClick,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white text-left transition-colors"
    >
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </button>
  );
};

export default AdminMobileMenu;
