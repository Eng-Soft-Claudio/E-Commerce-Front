"use client";

import React, { ReactNode } from 'react'; 
import { X } from 'lucide-react';
import Link from 'next/link';

// -------------------------------------------------------------------------- #
//                            TIPAGEM DO COMPONENTE                          #
// -------------------------------------------------------------------------- #

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode; 
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DO MENU MÓVEL                         #
// -------------------------------------------------------------------------- #

const MobileMenu = ({ isOpen, onClose, children }: MobileMenuProps) => {
  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300
                  ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Overlay escuro de fundo */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Painel do Menu */}
      <div
        className={`relative w-4/5 max-w-sm bg-white h-full shadow-xl transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-red-500">
              <X size={24} />
            </button>
          </div>

          {/* Renderiza os filhos (o formulário de busca) aqui */}
          {children}

          <nav className="space-y-6 overflow-y-auto mt-4 flex-grow">
            <div>
              <h3 className="font-bold text-lg mb-2 border-b pb-2">MINHA CONTA</h3>
              <ul>
                <li><Link href="/minha-conta" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Meu Perfil</Link></li>
                <li><Link href="/meus-pedidos" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Meus Pedidos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 border-b pb-2">LOJA</h3>
              <ul>
                <li><Link href="/" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Página Inicial</Link></li>
                <li><Link href="#" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Todas as Categorias</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;