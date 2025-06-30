"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, LogOut } from 'lucide-react';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface UserAccountLayoutProps {
    children: React.ReactNode;
}

interface NavItemProps {
    href: string;
    children: React.ReactNode;
}

// -------------------------------------------------------------------------- #
//                        SUBCOMPONENTE DE NAVEGAÇÃO                         #
// -------------------------------------------------------------------------- #
const NavItem = ({ href, children }: NavItemProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <li>
            <Link
                href={href}
                className={cn(
                    "block py-2 px-3 rounded hover:bg-gray-100 transition-colors",
                    isActive ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600"
                )}
            >
                {children}
            </Link>
        </li>
    );
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DE LAYOUT                             #
// -------------------------------------------------------------------------- #
const UserAccountLayout = ({ children }: UserAccountLayoutProps) => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Minha Área</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

                    {/* MENU LATERAL */}
                    <aside className="md:col-span-1 md:sticky md:top-28">
                        <nav className="p-4 bg-white rounded-lg shadow-sm">
                            <ul className="space-y-1">
                                <NavItem href="/minha-conta">Meu Perfil</NavItem>
                                <NavItem href="/meus-pedidos">Meus Pedidos</NavItem>
                                <NavItem href="/minha-conta/alterar-senha">Alterar Senha</NavItem>
                                {/* Adicionar um separador visual */}
                                <li className="pt-2 mt-2 border-t">
                                    <Link href="/logout" className="flex items-center gap-2 py-2 px-3 text-red-600 hover:bg-red-50 rounded">
                                        <LogOut size={16} />
                                        Sair
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* CONTEÚDO PRINCIPAL DA PÁGINA */}
                    <main className="md:col-span-3">
                        <div className="p-6 sm:p-8 bg-white rounded-lg shadow-sm">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};

export default UserAccountLayout;