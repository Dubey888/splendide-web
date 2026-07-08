"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

export default function CarruselBanner() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
      // Altura responsiva: llena un buen porcentaje de la pantalla
      className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-black banner-splendide"
    >
      <SwiperSlide className="relative w-full h-full">
        {/* LA CLAVE: object-[center_20%] asegura que al estirar la imagen en PC, NO le corte la cabeza a la modelo */}
        <Image 
          src="/portada.jpeg" 
          alt="Banner Principal" 
          fill 
          priority 
          className="object-cover object-[center_20%] md:object-[center_15%]" 
        />
        
        {/* Capa oscura suave para que las letras blancas resalten */}
        <div className="absolute inset-0 bg-black/20" /> 
        
        {/* Textos flotantes "NUEVA COLECCIÓN" y "Girl, es tu momento de brillar" */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4">
          <p className="text-white text-xs md:text-sm lg:text-base tracking-[0.25em] uppercase mb-4 drop-shadow-md">
            Nueva Colección
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white drop-shadow-lg leading-tight">
            Girl, es tu momento de<br />brillar
          </h2>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}