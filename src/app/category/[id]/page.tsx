// src/app/category/[id]/page.tsx
import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types';
import { notFound } from 'next/navigation';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #

// Tipo específico para os detalhes da categoria que vamos buscar
interface Category {
  id: number;
  title: string;
  description?: string | null;
}

interface CategoryPageProps {
  params: {
    id: string; // O ID da categoria virá da URL
  };
}

// -------------------------------------------------------------------------- #
//                        FUNÇÕES DE BUSCA DE DADOS (FETCH)                    #
// -------------------------------------------------------------------------- #

/**
 * Busca os detalhes de uma única categoria por seu ID.
 */
async function getCategoryDetails(categoryId: string): Promise<Category | null> {
  try {
    const res = await fetch(`http://localhost:8000/categories/${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar detalhes da categoria:", error);
    return null;
  }
}

/**
 * Busca os produtos pertencentes a uma categoria específica.
 */
async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    // Assumimos que a API suporta um parâmetro de query ?category_id=...
    const res = await fetch(`http://localhost:8000/products/?category_id=${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar produtos da categoria:", error);
    return [];
  }
}


// -------------------------------------------------------------------------- #
//                          METADADOS DINÂMICOS (PARA SEO)                     #
// -------------------------------------------------------------------------- #
export async function generateMetadata({ params }: CategoryPageProps) {
    const category = await getCategoryDetails(params.id);
    if (!category) {
      return { title: 'Categoria não encontrada' };
    }
    return {
      title: `${category.title} - E-Commerce`,
      description: category.description || `Confira todos os produtos da categoria ${category.title}.`,
    };
  }


// -------------------------------------------------------------------------- #
//                          COMPONENTE PRINCIPAL DA PÁGINA                     #
// -------------------------------------------------------------------------- #

export default async function CategoryPage({ params }: CategoryPageProps) {
  // --- BUSCA DE DADOS EM PARALELO ---
  // Usamos Promise.all para buscar os detalhes da categoria e os produtos
  // ao mesmo tempo, o que é mais performático.
  const [category, products] = await Promise.all([
    getCategoryDetails(params.id),
    getProductsByCategory(params.id)
  ]);

  // Se a categoria não for encontrada, renderiza a página 404 padrão do Next.js
  if (!category) {
    notFound();
  }

  // --- RENDERIZAÇÃO DA PÁGINA ---
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Categoria */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{category.title}</h1>
          {category.description && (
            <p className="mt-4 text-base text-gray-500 text-justify">{category.description}</p>
          )}
        </div>
        
        {/* 
          Grade de Produtos
          Reutilizamos o mesmo componente ProductGrid da página inicial,
          passando a lista de produtos já filtrada.
        */}
        <ProductGrid products={products} />

      </div>
    </div>
  );
}