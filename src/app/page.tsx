import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import FeaturedCategories from "@/components/FeaturedCategories";
import { Product } from "@/types";

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface Category {
  id: number;
  title: string;
}

// -------------------------------------------------------------------------- #
//                        FUNÇÕES DE BUSCA DE DADOS (FETCH)                   #
// -------------------------------------------------------------------------- #

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:8000/products/', { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao buscar produtos');
    return res.json();
  } catch (error) {
    console.error("Erro na API (getProducts):", error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch('http://localhost:8000/categories/', { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao buscar categorias');
    return res.json();
  } catch (error) {
    console.error("Erro na API (getCategories):", error);
    return [];
  }
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE PRINCIPAL DA PÁGINA                    #
// -------------------------------------------------------------------------- #

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <main className="flex flex-col items-center w-full">
      <HeroCarousel />
      <FeaturedCategories categories={categories} />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8 text-center sm:text-left">
          PRODUTOS EM DESTAQUE
        </h2>
        <ProductGrid products={products} />
      </div>
    </main>
  );
}