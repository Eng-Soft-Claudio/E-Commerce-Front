"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


interface User {
  id: number;
  email: string;
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (formData: FormData) => Promise<void>;
  logout: () => void;
  register: (formData: FormData) => Promise<void>;
  loading: boolean;
  error: string | null;
   setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    const token = Cookies.get('access_token');
    if (token) {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/auth/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
          Cookies.remove('access_token');
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Falha no login.');
      
      Cookies.set('access_token', data.access_token, { expires: 1, secure: process.env.NODE_ENV === 'production' });
      await fetchUser(); 
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
    router.push('/login');
  };

  // LÓGICA DE REGISTRO COMPLETA
  const register = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      // Pega os dados do FormData para o corpo da requisição de registro
      const email = formData.get('email');
      const password = formData.get('password');
      
      const response = await fetch('http://localhost:8000/auth/users/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.detail || 'Falha ao registrar.');
      }
      
      // Se o registro foi bem-sucedido, tenta fazer o login automaticamente
      console.log("Registro bem-sucedido, tentando login automático...");
      const loginFormData = new FormData();
      loginFormData.append('username', email as string);
      loginFormData.append('password', password as string);
      await login(loginFormData);
      
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const value = { user, login, logout, register, loading, error, setError };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="flex h-screen items-center justify-center">Carregando...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};