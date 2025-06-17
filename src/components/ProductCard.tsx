// src/components/ProductCard.tsx
"use client"; // Marca este como um Client Component para permitir interatividade (onClick).

import React from 'react';
import { Product } from '@/types'; // Importa nosso tipo de produto
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Importa o hook de autenticação
import { useRouter } from 'next/navigation'; // Para redirecionamento
import Cookies from 'js-cookie'; // Para ler o token de autenticação

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth(); // Pega o estado do usuário do nosso contexto global
  const router = useRouter();

  // Função para lidar com o clique no botão "Adicionar ao Carrinho"
  const handleAddToCart = async () => {
    // 1. Verifica se o usuário está logado. Se não, o redireciona.
    if (!user) {
      router.push('/login');
      return;
    }

    try {
        // 2. Pega o token de acesso que foi salvo nos cookies durante o login
        const token = Cookies.get('access_token');
        if (!token) {
          // Se por algum motivo o token não estiver lá, força o login
          alert("Sua sessão expirou. Por favor, faça o login novamente.");
          router.push('/login');
          return;
        }

        // 3. Faz a requisição para a nossa API FastAPI para adicionar o item
        const response = await fetch('http://localhost:8000/cart/items/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token de autenticação
            },
            body: JSON.stringify({
                product_id: product.id,
                quantity: 1
            })
        });

        // 4. Lida com a resposta da API
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Falha ao adicionar ao carrinho");
        }
        
        // 5. Dá um feedback visual para o usuário
        alert(`'${product.name}' foi adicionado ao carrinho com sucesso!`);
        
        // Futuramente, poderíamos também disparar uma atualização do
        // estado global do carrinho para atualizar o ícone no header.
        
    } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
        alert("Ocorreu um erro ao adicionar o produto ao carrinho. Tente novamente.");
    }
  };

  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      {/* Link envolvendo a parte clicável que leva aos detalhes do produto */}
      <Link href={`/product/${product.id}`} passHref>
        <div>
          <div className="relative aspect-w-1 aspect-h-1 w-full bg-gray-200 h-80">
            {product.image_url ? (
              <Image 
                src={product.image_url} 
                alt={product.name} 
                fill 
                className="object-cover object-center group-hover:opacity-75 transition-opacity"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span className="text-gray-500">Sem Imagem</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-sm text-gray-700 truncate">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      </Link>
      
      {/* Divisória para o botão de ação */}
      <div className="p-4 pt-0 mt-auto">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Adicionar ao Carrinho
          </button>
      </div>
    </div>
  );
};

export default ProductCard;