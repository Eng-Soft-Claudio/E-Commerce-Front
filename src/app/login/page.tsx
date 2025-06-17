// src/app/login/page.tsx
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log("--- Formulário enviado, handleSubmit foi chamado! ---");

        const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    await login(formData);
  };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg md:w-1/3">
                <h3 className="text-2xl font-bold text-center">Login na sua Conta</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="email">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="password">Senha</label>
                            <input
                                type="password"
                                placeholder="Senha"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                                required
                            />
                        </div>
                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        <div className="flex items-baseline justify-between">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 mt-4 text-white bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                            <a href="/register" className="text-sm text-teal-600 hover:underline">Criar conta</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;