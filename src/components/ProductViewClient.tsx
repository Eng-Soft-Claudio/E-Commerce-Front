// src/components/ProductViewClient.tsx - CRIAR ARQUIVO

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Loader2, ShoppingCart } from 'lucide-react';

interface ProductViewClientProps {
  product: Product;
}

export default function ProductViewClient({ product }: ProductViewClientProps) {
  // --- ESTADOS DO COMPONENTE ---
  const [isAdding, setIsAdding] = useState(false);

  // --- HOOKS ---
  const { user, fetchCart } = useAuth(); // fetchCart foi adicionado aqui para uso
  const router = useRouter();

  // --- MANIPULADOR DE EVENTOS ---
  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsAdding(true);
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        alert('Sua sessão expirou. Por favor, faça o login novamente.');
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/cart/items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao adicionar ao carrinho');
      }
      alert(`'${product.name}' foi adicionado ao carrinho!`);
      await fetchCart(); // Chama a função do contexto para atualizar o estado do carrinho
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao adicionar o produto ao carrinho.');
    } finally {
      setIsAdding(false);
    }
  };

  // O loading e o tratamento de 'not found' já aconteceram no servidor
  // então aqui podemos renderizar o produto diretamente.
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Sem Imagem</span>
              </div>
            )}
          </div>

          <div className="flex flex-col py-4">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-4">
              <p className="text-3xl text-gray-800">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {product.description && (
              <div className="mt-8">
                <h3 className="text-base font-semibold text-gray-900">Descrição</h3>
                <div className="mt-2 text-base text-gray-600 space-y-4">
                  <p>{product.description}</p>
                </div>
              </div>
            )}

            {product.category && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Categoria</h3>
                <div className="mt-2">
                  <Link
                    href={`/category/${product.category.id}`}
                    className="text-base text-teal-600 hover:text-teal-800 font-semibold"
                  >
                    {product.category.title}
                  </Link>
                  {product.category.description && (
                    <p className="mt-1 text-sm text-gray-500">{product.category.description}</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-10">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex w-full max-w-xs items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
              >
                {isAdding ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-2 h-5 w-5" />
                )}
                {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
