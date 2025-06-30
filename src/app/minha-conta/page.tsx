"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { UserProfileForm } from '@/components/user/UserProfileForm';
import UserAccountLayout from '@/components/user/UserAccountLayout'; // Importando o novo layout

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
    // --- HOOKS E ESTADOS ---
    const { user, loading: authLoading, fetchUser } = useAuth();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

    // --- FUNÇÃO DE SUBMISSÃO ---
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

            // Remove a mensagem de sucesso após alguns segundos
            setTimeout(() => setUpdateSuccess(null), 3000);

        } catch (err: any) {
            setUpdateError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    // --- LÓGICA DE RENDERIZAÇÃO CONDICIONAL ---
    if (authLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user) {
        if (typeof window !== "undefined") {
            router.push('/login');
        }
        return null;
    }

    // --- RENDERIZAÇÃO PRINCIPAL ---
    return (
        <UserAccountLayout>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                Meu Perfil
            </h2>
            <UserProfileForm
                user={user}
                onSubmit={handleUpdateProfile}
                isLoading={isUpdating}
            />
            {updateError && <p className="mt-4 text-sm font-semibold text-center text-red-600 bg-red-100 p-3 rounded-md">{updateError}</p>}
            {updateSuccess && <p className="mt-4 text-sm font-semibold text-center text-green-600 bg-green-100 p-3 rounded-md">{updateSuccess}</p>}
        </UserAccountLayout>
    );
};

export default MinhaContaPage;