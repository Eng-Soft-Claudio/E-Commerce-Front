// src/components/HeroCarousel.tsx

"use client";

import React from 'react';
import Image from 'next/image';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

const HeroCarousel = () => {
    const banners = [
        { id: 1, src: 'https://res.cloudinary.com/cloud-drone/image/upload/v1751242011/banner1_sxlchy.png', alt: 'Banner image' },
        { id: 2, src: 'https://res.cloudinary.com/cloud-drone/image/upload/v1751242011/banner2_i1frnk.png', alt: 'Banner image' },
        { id: 3, src: 'https://res.cloudinary.com/cloud-drone/image/upload/v1751242011/banner3_ysp2kw.png', alt: 'Banner image' },
        { id: 4, src: 'https://res.cloudinary.com/cloud-drone/image/upload/v1751242011/banner4_k0njzh.png', alt: 'Banner image' },

    
    ];

    return (
        <section className="w-full">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                        stopOnInteraction: false, 
                        stopOnMouseEnter: true, 
                    }),
                ]}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id}>
                            {/* CORREÇÃO: Substituímos a div cinza pelo componente Image real */}
                            <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px]">
                                <Image
                                    src={banner.src}
                                    alt={banner.alt}
                                    fill
                                    style={{ objectFit: 'cover' }} 
                                    priority={banner.id === 1} 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {/* Adiciona classes para estilizar melhor as setas sobre a imagem */}
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white border-none hover:bg-black/75" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white border-none hover:bg-black/75" />
            </Carousel>
        </section>
    );
};

export default HeroCarousel;