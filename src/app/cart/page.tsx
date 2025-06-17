"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { X, Plus, Minus, Loader2 } from 'lucide-react';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface Cart {
  id: number;
  items: CartItem[];
  total_price: number;
}


// -------------------------------------------------------------------------- #
//                             COMPONENTE DA PÁGINA                            #
// -------------------------------------------------------------------------- #

const CartPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Funções de Interação com a API ---
  
  const fetchCart = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token) return;
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/cart/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Falha ao buscar os dados do carrinho.");
      const data = await response.json();
      setCart(data);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Não foi possível carregar seu carrinho.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItemQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      if (window.confirm("Tem certeza que deseja remover este item do carrinho?")) {
        await removeItem(productId);
      }
      return;
    }
    
    const token = Cookies.get('access_token');
    try {
      const response = await fetch(`http://localhost:8000/cart/items/${productId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (!response.ok) throw new Error("Falha ao atualizar a quantidade.");
      await fetchCart(); // Re-fetch para atualizar a UI
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar a quantidade.");
    }
  };

  const removeItem = async (productId: number) => {
    const token = Cookies.get('access_token');
    try {
        const response = await fetch(`http://localhost:8000/cart/items/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Falha ao remover item.");
        await fetchCart(); // Re-fetch para atualizar a UI
    } catch (error) {
        console.error(error);
        alert("Erro ao remover item.");
    }
  };
  
  const handleCheckout = () => {
    router.push(`/checkout`); // No futuro, isso levará à página de checkout
  }

  // Efeito principal para buscar os dados iniciais do carrinho
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchCart();
      }
    }
  }, [user, authLoading, router, fetchCart]);
  

  // --- LÓGICA DE RENDERIZAÇÃO CONDICIONAL ---

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-600 font-semibold">{error}</div>;
  }
  
  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        </div>
      );
  }
  
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800">Seu carrinho está vazio.</h1>
        <Link href="/" className="text-white bg-black hover:bg-gray-800 font-semibold py-3 px-6 rounded-lg mt-6 inline-block">
          Continue Comprando
        </Link>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL DO CARRINHO ---
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Seu Carrinho</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <ul className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm space-y-4">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.image_url ? (
                    <Image src={item.product.image_url} alt={item.product.name} layout="fill" objectFit="cover" />
                  ) : (
                    <div className="bg-gray-200 h-full w-full"></div>
                  )}
                </div>
                <div className="flex-grow">
                  <Link href={`/product/${item.product.id}`} className="font-semibold text-gray-800 hover:underline">{item.product.name}</Link>
                  <p className="text-sm text-gray-500">R$ {item.product.price.toFixed(2)}</p>
                  <button onClick={() => removeItem(item.product.id)} className="text-xs text-red-500 hover:text-red-700 mt-1">Remover</button>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateItemQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-full text-gray-600 hover:bg-gray-200"><Minus size={16}/></button>
                  <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
                  <button onClick={() => updateItemQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-full text-gray-600 hover:bg-gray-200"><Plus size={16}/></button>
                </div>
                <p className="font-semibold w-24 text-right text-gray-800">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28">
              <h2 className="text-xl font-bold border-b pb-4 text-gray-900">Resumo</h2>
              <div className="flex justify-between mt-4 text-gray-600">
                <p>Subtotal</p>
                <p>R$ {cart.total_price.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t text-gray-900">
                <p>Total</p>
                <p>R$ {cart.total_price.toFixed(2)}</p>
              </div>
              <button onClick={handleCheckout} className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-transform transform hover:scale-105">
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;