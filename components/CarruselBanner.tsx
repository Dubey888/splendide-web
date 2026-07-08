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
      // Volvemos a un alto proporcionado para evitar el efecto de "zoom" extremo
      className="w-full h-[65vh] md:h-[75vh] lg:h-[80vh] bg-[#FCF6F6]"
    >
      <SwiperSlide className="relative w-full h-full flex items-center justify-center">
        {/* EL AJUSTE CLAVE: object-center recupera el encuadre hermoso del inicio (enfocando el rostro) */}
        <Image 
          src="/portada.jpeg" 
          alt="Banner Principal" 
          fill 
          priority 
          className="object-cover object-center" 
        />
        
        {/* Sombra sutil para no oscurecer la belleza de la foto */}
        <div className="absolute inset-0 bg-black/10" /> 
        
        {/* Textos femeninos y delicados */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4 mt-2">
          <p className="text-white text-[10px] md:text-sm tracking-[0.35em] font-light uppercase mb-3 drop-shadow-md">
            Nueva Colección
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white font-light drop-shadow-lg leading-tight">
            Girl, es tu momento de<br />brillar
          </h2>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}