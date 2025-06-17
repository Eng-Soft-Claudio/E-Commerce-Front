import React from 'react';
import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden">
      <a href={`/product/${product.id}`}>
        <div className="relative aspect-w-1 aspect-h-1 w-full bg-gray-200 lg:aspect-none group-hover:opacity-75 h-80">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill 
              className="object-cover object-center" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500">Sem Imagem</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-medium text-gray-900">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </a>
      <div className="p-4 pt-0">
        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;