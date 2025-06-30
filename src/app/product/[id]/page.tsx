// src/app/product/[id]/page.tsx - REFAZER

import React from 'react';
import { notFound } from 'next/navigation';
import { Product } from '@/types';
import ProductViewClient from '@/components/ProductViewClient'; 

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface ProductPageProps {
  params: {
    id: string;
  };
}

// -------------------------------------------------------------------------- #
//                        FUNÇÕES DE BUSCA DE DADOS (FETCH)                    #
// -------------------------------------------------------------------------- #
async function getProduct(productId: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:8000/products/${productId}`, {
      cache: 'no-store', 
    });

    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error('Falha ao buscar dados do produto do servidor');
    }
    return res.json();
  } catch (error) {
    console.error("Erro na API ao buscar produto no servidor:", error);
    return null;
  }
}

// -------------------------------------------------------------------------- #
//                COMPONENTE PRINCIPAL DA PÁGINA                              #
// -------------------------------------------------------------------------- #
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductViewClient product={product} />;
}