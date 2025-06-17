"use client";

import React from 'react';

// Este componente recebe o estado 'isOpen' e uma função para fechá-lo como props.
interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        // Fundo semi-transparente que cobre a tela inteira
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose} // Fecha o menu ao clicar fora dele
        >
            {/* O painel do menu que desliza da esquerda */}
            <div
                className="fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-xl z-50 text-black"
                onClick={(e) => e.stopPropagation()} // Impede que cliques dentro do menu o fechem
            >
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">MINHA CONTA</h3>
                    <ul>
                        <li><a href="#" className="text-gray-700 hover:text-black block py-2">Minha Conta</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-black block py-2">Meus Pontos</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-black block py-2">Campanhas</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">DÚVIDAS</h3>
                    <ul>
                        <li><a href="#" className="text-gray-700 hover:text-black block py-2">Política de Troca</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-black block py-2">Postagem</a></li>
                        {/* Adicione os outros links aqui */}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;