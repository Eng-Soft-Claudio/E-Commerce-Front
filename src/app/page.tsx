// src/app/page.tsx

import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:8000/products/', { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Falha ao buscar produtos');
    }

    return res.json();
  } catch (error) {
    console.error("Erro na API:", error);
    return [];
  }
}


export default async function Home() {
  const products = await getProducts();
  return (
    <main className="flex flex-col items-center w-full">
      <HeroCarousel />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
          EM ALTA NA SEMANA
        </h2>
        <ProductGrid products={products} />
      </div>
    </main>
  );
}