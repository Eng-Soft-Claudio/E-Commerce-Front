"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { UserProfileForm } from '@/components/user/UserProfileForm';
import Link from 'next/link';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
type ProfileData = {
    full_name?: string;
    phone?: string;
    address_street?: string;
    address_number?: string;
    address_complement?: string | null;
    address_zip?: string;
    address_city?: string;
    address_state?: string;
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DA PÁGINA                             #
// -------------------------------------------------------------------------- #
const MinhaContaPage = () => {
    const { user, loading: authLoading, fetchUser } = useAuth();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

    const handleUpdateProfile = async (data: ProfileData) => {
        setIsUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(null);
        const token = Cookies.get('access_token');

        try {
            const response = await fetch('http://localhost:8000/auth/users/me/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.detail || "Falha ao atualizar o perfil.");
            }

            await fetchUser();
            setUpdateSuccess("Perfil atualizado com sucesso!");

        } catch (err: any) {
            setUpdateError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    if (authLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user) {
        if (typeof window !== "undefined") {
            router.push('/login');
        }
        return null; 
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Minha Conta</h1>
                <p className="text-gray-500 mb-8">Gerencie suas informações pessoais e de endereço.</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* MENU LATERAL */}
                    <aside className="md:col-span-1">
                        <nav className="p-4 bg-white rounded-lg shadow-sm">
                            <ul>
                                <li>
                                    <Link href="/minha-conta" className="block py-2 px-3 bg-gray-100 rounded font-semibold text-gray-900">
                                        Meu Perfil
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/meus-pedidos" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-600">
                                        Meus Pedidos
                                    </Link>
                                </li>
                                {/* Futuro link para alterar senha */}
                                <li>
                                    <Link href="/minha-conta/alterar-senha" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-600">
                                        Alterar Senha
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* CONTEÚDO PRINCIPAL (FORMULÁRIO) */}
                    <main className="md:col-span-3">
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <UserProfileForm user={user} onSubmit={handleUpdateProfile} isLoading={isUpdating} />
                            {updateError && <p className="mt-4 text-sm text-center text-red-600">{updateError}</p>}
                            {updateSuccess && <p className="mt-4 text-sm text-center text-green-600">{updateSuccess}</p>}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MinhaContaPage;