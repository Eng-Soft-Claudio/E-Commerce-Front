// src/components/Sidebar.tsx
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-full lg:w-64 pr-8">
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 border-b pb-2">MINHA CONTA</h3>
        <ul>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              Minha Conta
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              Meus Pontos
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              Campanhas
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-4 border-b pb-2">DÚVIDAS</h3>
        <ul>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              Política de Troca
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              Postagem
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              Formas de Envio
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              Sobre Nós
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              FAQ
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-black">
              Contato
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
