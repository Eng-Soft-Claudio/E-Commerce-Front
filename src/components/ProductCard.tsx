// src/components/ProductCard.tsx - CÓDIGO CORRIGIDO

"use client";

import React, { useState } from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loader2, ShoppingCart } from 'lucide-react';

// -------------------------------------------------------------------------- #
//                          TIPAGEM DO COMPONENTE                            #
// -------------------------------------------------------------------------- #

interface ProductCardProps {
  product: Product;
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DO CARD DE PRODUTO                      #
// -------------------------------------------------------------------------- #

const ProductCard = ({ product }: ProductCardProps) => {
  const { user, fetchCart } = useAuth(); // Pega a função para atualizar o carrinho
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  /**
   * Lida com o clique no botão "Adicionar ao Carrinho", fazendo a chamada
   * para a API e atualizando o estado global do carrinho em caso de sucesso.
   */
  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsAdding(true);
    try {
      const token = Cookies.get('access_token');
      if (!token) throw new Error("Sessão inválida.");

      const response = await fetch('http://localhost:8000/cart/items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Falha ao adicionar ao carrinho");
      }

      alert(`'${product.name}' foi adicionado ao carrinho!`);
      await fetchCart(); // Atualiza o carrinho globalmente

    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <Link href={`/product/${product.id}`} passHref>
        <div>
          <div className="relative aspect-w-1 aspect-h-1 w-full bg-gray-200 h-80">
            {product.image_url ? (<Image src={product.image_url} alt={product.name} fill className="object-contain object-center group-hover:opacity-75 transition-opacity" />)
              : (<div className="w-full h-full flex items-center justify-center bg-gray-300"><span>Sem Imagem</span></div>)}
          </div>
          <div className="p-4">
            <h3 className="text-sm text-gray-700 truncate">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-500"
        >
          {isAdding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
          {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;