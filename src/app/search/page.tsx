import React, { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types';
import { Loader2 } from 'lucide-react';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #

interface SearchPageProps {
    searchParams: {
        q?: string; 
    };
}

// -------------------------------------------------------------------------- #
//                     FUNÇÃO DE BUSCA DE DADOS (FETCH)                       #
// -------------------------------------------------------------------------- #

/**
 * Busca os produtos na API com base em um termo de busca.
 */
async function searchProducts(query: string): Promise<Product[]> {
    try {
        const res = await fetch(`http://localhost:8000/products/?q=${encodeURIComponent(query)}`, {
            cache: 'no-store', 
        });

        if (!res.ok) {
            console.error(`Falha na API de busca, status: ${res.status}`);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error("Erro de rede ao buscar produtos:", error);
        return [];
    }
}

// -------------------------------------------------------------------------- #
//                        SUBCOMPONENTE PARA RESULTADOS                      #
// -------------------------------------------------------------------------- #

async function SearchResults({ query }: { query: string }) {
    const products = await searchProducts(query);

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">

                {/* Cabeçalho da Página de Busca */}
                <div className="border-b border-gray-200 pb-6 mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        Resultados da Busca
                    </h1>
                    <p className="mt-4 text-base text-gray-500">
                        {products.length > 0
                            ? `Exibindo ${products.length} resultado(s) para "${query}"`
                            : `Nenhum resultado encontrado para "${query}". Tente um termo diferente.`}
                    </p>
                </div>

                {/* Grade de Produtos com os resultados */}
                <ProductGrid products={products} />
            </div>
        </div>
    );
}

// -------------------------------------------------------------------------- #
//                  COMPONENTE DE "LOADING" PARA SUSPENSE                     #
// -------------------------------------------------------------------------- #

function SearchLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            <p className="mt-4 text-lg text-gray-600">Buscando produtos...</p>
        </div>
    );
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE PRINCIPAL DA PÁGINA                     #
// -------------------------------------------------------------------------- #

export default function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || "";

    return (
        <Suspense fallback={<SearchLoading />}>
            <SearchResults query={query} />
        </Suspense>
    );
}