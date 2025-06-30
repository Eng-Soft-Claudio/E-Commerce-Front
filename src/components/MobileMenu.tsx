"use client";

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import Link from 'next/link';

// -------------------------------------------------------------------------- #
//                            TIPAGEM DO COMPONENTE                          #
// -------------------------------------------------------------------------- #

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DO MENU MÓVEL                         #
// -------------------------------------------------------------------------- #

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const imageUrl = "https://res.cloudinary.com/cloud-drone/image/upload/v1751244153/sidemenu_etkqoz.png";

  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300
                  ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* 1. Imagem de Fundo como Overlay */}
      <div className="absolute inset-0">
        <Image 
          src={imageUrl}
          alt="Destaque de fundo do Menu"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          onClick={onClose}
        />
      </div>


      {/* 2. Painel do Menu */}
      <div
        className={`relative w-2/6 max-w-xs bg-white h-full shadow-xl transform transition-transform duration-300 ease-in-out pointer-events-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button onClick={onClose} className="p-1 text-gray-500 hover:text-red-500">
                    <X size={24} />
                </button>
            </div>

            <nav className="space-y-8 overflow-y-auto">
              <div>
                <h3 className="font-bold text-lg mb-2 border-b pb-2">MINHA CONTA</h3>
                <ul>
                  <li><Link href="/minha-conta" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Minha Conta</Link></li>
                  <li><Link href="/meus-pedidos" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Meus Pedidos</Link></li>
                  <li><Link href="/cart" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Meu Carrinho</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 border-b pb-2">DÚVIDAS</h3>
                <ul>
                  <li><Link href="#" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Política de Troca</Link></li>
                  <li><Link href="#" onClick={onClose} className="text-gray-700 hover:text-black block py-2">Formas de Envio</Link></li>
                </ul>
              </div>
            </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;