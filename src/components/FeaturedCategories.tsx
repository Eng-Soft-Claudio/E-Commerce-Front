"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; 

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface Category {
  id: number;
  title: string;
}

interface FeaturedCategoriesProps {
  categories: Category[];
}

// -------------------------------------------------------------------------- #
//                   MAPEAMENTO DE IMAGENS PARA CATEGORIAS                     #
// -------------------------------------------------------------------------- #
const imageUrlMap: { [key: string]: string } = {
  Categoria_1: "https://res.cloudinary.com/cloud-drone/image/upload/v1751242471/categoria3_qwpzrm.png",
  Categoria_2: "https://res.cloudinary.com/cloud-drone/image/upload/v1751242471/categoria2_umszpi.png",
  Categoria_3: "https://res.cloudinary.com/cloud-drone/image/upload/v1751242471/categoria1_b2osso.png",

};


// -------------------------------------------------------------------------- #
//                        COMPONENTE DA SEÇÃO DE CATEGORIAS                    #
// -------------------------------------------------------------------------- #
const FeaturedCategories = ({ categories }: FeaturedCategoriesProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-gray-50 w-full">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 text-center mb-10">
          CLIQUE E CONHEÇA
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {categories.map((category) => {
            const imageUrl = imageUrlMap[category.title.toLowerCase()];

            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group block text-center"
              >
                <div
                  className="relative aspect-square w-full rounded-lg bg-slate-300 text-gray flex flex-col items-center justify-center p-2 transition-all duration-300 group-hover:bg-slate-500 group-hover:scale-105"
                >
                  {/* Container para a imagem */}
                  <div className="relative w-3/4 h-3/4">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`Ícone da categoria ${category.title}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 30vw, 10vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 rounded-md"></div>
                    )}
                  </div>

                  {/* Nome da Categoria abaixo da imagem */}
                  <h3 className="font-bold uppercase tracking-wider text-xs sm:text-sm mt-2">
                    {category.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;