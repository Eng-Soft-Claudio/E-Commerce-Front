// src/components/ProductGrid.tsx
"use client"; // Este componente se tornará interativo no futuro (filtros, etc), então já o marcamos.

import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
     <div className="bg-white">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {/* O design original coloca este título do lado, vamos ajustá-lo no layout principal */}
        </h2>
        
        {products.length === 0 ? (
          <p className="mt-4">Nenhum produto encontrado.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
    </div>
  );
};

export default ProductGrid;