/**
 * @file Página Inicial (Home) da Aplicação.
 * @description Este é o principal Server Component da aplicação, responsável por
 * buscar os dados iniciais de produtos, categorias e banners ativos.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

import HeroCarousel from '@/components/HeroCarousel';
import ProductGrid from '@/components/ProductGrid';
import FeaturedCategories from '@/components/FeaturedCategories';
import { Product, Banner } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Category {
  id: number;
  title: string;
  image_url?: string | null;
}

async function getActiveBanners(): Promise<Banner[] | null> {
  try {
    const res = await fetch(`${API_URL}/banners/active/`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao buscar banners da API.');
    return res.json();
  } catch (error) {
    console.error('Erro em getActiveBanners:', error);
    return null;
  }
}

/**
 * Busca todos os produtos para a vitrine principal.
 * @returns Promise com um array de produtos ou nulo em caso de erro.
 */
async function getProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch(`${API_URL}/products/`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao buscar produtos da API.');
    return res.json();
  } catch (error) {
    console.error('Erro em getProducts:', error);
    return null;
  }
}

/**
 * Busca todas as categorias para a seção de destaque.
 * @returns Promise com um array de categorias ou nulo em caso de erro.
 */
async function getCategories(): Promise<Category[] | null> {
  try {
    const res = await fetch(`${API_URL}/categories/`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao buscar categorias da API.');
    return res.json();
  } catch (error) {
    console.error('Erro em getCategories:', error);
    return null;
  }
}

export default async function Home() {
  const [bannersData, productsData, categoriesData] = await Promise.all([
    getActiveBanners(),
    getProducts(),
    getCategories(),
  ]);

  const banners = bannersData ?? [];
  const products = productsData ?? [];
  const categories = categoriesData ?? [];

  const fetchError = !productsData || !categoriesData;

  return (
    <main className="flex flex-col items-center w-full">
      <HeroCarousel banners={banners} />
      <FeaturedCategories categories={categories} />
      <div className="container mx-auto px-4 py-12">
        {fetchError ? (
          <div className="text-center py-10 bg-red-50 text-red-700 rounded-lg" role="alert">
            <AlertCircle className="mx-auto h-12 w-12" />
            <h3 className="mt-4 text-xl font-semibold">Ocorreu um erro</h3>
            <p className="mt-2">
              Não foi possível carregar os produtos ou categorias. Tente novamente mais tarde.
            </p>
          </div>
        ) : (
          <ProductGrid
            title="PRODUTOS EM DESTAQUE"
            products={products}
            emptyStateMessage="Nenhum produto em destaque no momento."
          />
        )}
      </div>
    </main>
  );
}
