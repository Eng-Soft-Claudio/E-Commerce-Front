"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import UserAccountLayout from '@/components/user/UserAccountLayout';
import { ChangePasswordForm } from '@/components/user/ChangePasswordForm';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface PasswordData {
    current_password: string;
    new_password: string;
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DA PÁGINA                             #
// -------------------------------------------------------------------------- #
const ChangePasswordPage = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handlePasswordChange = async (data: PasswordData) => {
        setIsUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(null);
        const token = Cookies.get('access_token');

        try {
            const response = await fetch('http://localhost:8000/auth/users/me/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.detail || "Falha ao alterar a senha.");
            }

            setUpdateSuccess("Senha alterada com sucesso! Você será desconectado por segurança.");

            setTimeout(() => {
                logout();
            }, 3000);

        } catch (err: any) {
            setUpdateError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    if (authLoading || !user) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <UserAccountLayout>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                Alterar Senha
            </h2>
            <div className='max-w-md'>
                <ChangePasswordForm onSubmit={handlePasswordChange} isLoading={isUpdating} />
                {updateError && <p className="mt-4 text-sm font-semibold text-center text-red-600 bg-red-100 p-3 rounded-md">{updateError}</p>}
                {updateSuccess && <p className="mt-4 text-sm font-semibold text-center text-green-600 bg-green-100 p-3 rounded-md">{updateSuccess}</p>}
            </div>
        </UserAccountLayout>
    );
};

export default ChangePasswordPage;