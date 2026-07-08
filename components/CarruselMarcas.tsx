"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link';

export default function CarruselMarcas({ marcas }: { marcas: any[] }) {
  return (
    <Swiper
      slidesPerView={1.8} 
      spaceBetween={16}
      breakpoints={{
        480: { slidesPerView: 2.5, spaceBetween: 16 },
        768: { slidesPerView: 3.5, spaceBetween: 20 },
        1024: { slidesPerView: 4.5, spaceBetween: 24 },
        1440: { slidesPerView: 5.5, spaceBetween: 28 }, 
      }}
      className="w-full cursor-grab active:cursor-grabbing pb-6 pt-2"
    >
      {marcas.map((marca, index) => (
        <SwiperSlide key={index}>
          {/* Diseño exacto de la tarjeta de marca en Shopify */}
          <Link 
            href={marca.url} 
            className="block group bg-[#FAFAFA] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Foto sin márgenes arriba/lados */}
            <div className="aspect-[4/4] md:aspect-[4/5] relative overflow-hidden">
              <img 
                src={marca.imagen} 
                alt={marca.nombre} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            {/* Caja de texto blanca abajo con flechita animada */}
            <div className="p-4 flex justify-between items-center bg-white">
              <span className="font-serif text-[#1A1A1A] text-lg">{marca.nombre}</span>
              <span className="text-[#1A1A1A] transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}