/**
 * @file Componente do Carrossel de Banners da Página Inicial.
 * @description Renderiza um carrossel de imagens dinâmico a partir dos
 * dados de banner recebidos da API, utilizando shadcn/ui e Embla Autoplay.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Banner } from '@/types';

/**
 * Propriedades para o componente HeroCarousel.
 */
interface HeroCarouselProps {
  banners: Banner[];
}

const HeroCarousel = ({ banners }: HeroCarouselProps) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full" aria-label="Carrossel de banners promocionais">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] xl:h-[550px] bg-black">
                {banner.link_url ? (
                  <Link href={banner.link_url} passHref>
                    <Image
                      src={banner.image_url}
                      alt={banner.title}
                      fill
                      style={{ objectFit: 'contain' }}
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </Link>
                ) : (
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    priority={index === 0}
                    sizes="100vw"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white border-none hover:bg-black/60 transition-colors" />
        <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white border-none hover:bg-black/60 transition-colors" />
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
