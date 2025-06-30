"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Product } from '@/types';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
export type RegisterData = Record<string, any>;

export interface User {
  id: number;
  email: string;
  is_superuser: boolean;
  is_active: boolean;
  full_name: string;
  cpf: string;
  phone: string;
  address_street: string;
  address_number: string;
  address_complement: string | null;
  address_zip: string;
  address_city: string;
  address_state: string;
  orders: any[]; 
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  discount_amount: number;
  final_price: number;
}

interface AuthContextType {
  user: User | null;
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  fetchUser: () => Promise<void>; 
  login: (formData: FormData) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

// -------------------------------------------------------------------------- #
//                          CRIAÇÃO DO CONTEXTO E PROVEDOR                     #
// -------------------------------------------------------------------------- #

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCart = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      setCart(null);
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/cart/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        setCart(null);
      }
    } catch (e) {
      console.error("Falha ao buscar carrinho:", e);
      setCart(null);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const res = await fetch('http://localhost:8000/auth/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          if (!userData.is_superuser) {
            await fetchCart();
          }
        } else {
          Cookies.remove('access_token');
          setUser(null);
          setCart(null);
        }
      } catch (e) {
        console.error("Falha ao buscar usuário:", e);
        setUser(null);
        setCart(null);
      }
    }
    setLoading(false);
  }, [fetchCart]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/auth/token', { method: 'POST', body: formData });
      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Falha no login.');

      const tokenRes = await fetch('http://localhost:8000/auth/users/me/', {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });
      const userData = await tokenRes.json();

      Cookies.set('access_token', data.access_token, { expires: 1, secure: process.env.NODE_ENV === 'production' });

      setUser(userData); 

      router.push(userData.is_superuser ? '/admin/dashboard' : '/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const registerResponse = await fetch('http://localhost:8000/auth/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const registerData = await registerResponse.json();
      if (!registerResponse.ok) {
        if (registerData.detail && Array.isArray(registerData.detail)) {
          const errorMessage = registerData.detail.map((err: any) => err.msg).join(', ');
          throw new Error(errorMessage);
        }
        throw new Error(registerData.detail || 'Falha ao tentar registrar.');
      }

      const loginFormData = new FormData();
      loginFormData.append('username', userData.email);
      loginFormData.append('password', userData.password);
      await login(loginFormData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
    setCart(null);
    router.push('/login');
  };

  const value = { user, cart, loading, error, setError, fetchCart, fetchUser, login, logout, register };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};