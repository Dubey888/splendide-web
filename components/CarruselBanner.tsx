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
      // Hicimos el banner más alto en PC (85vh) para que la imagen se vea completa como al inicio
      className="w-full h-[75vh] md:h-[85vh] lg:h-[90vh] bg-[#FCF6F6] banner-splendide"
    >
      <SwiperSlide className="relative w-full h-full flex items-center justify-center">
        {/* object-top asegura que se vea desde la cabeza bajando hasta las manos */}
        <Image 
          src="/portada.jpeg" 
          alt="Banner Principal" 
          fill 
          priority 
          className="object-cover object-top md:object-[center_10%]" 
        />
        
        {/* Sombra súper sutil solo para que la letra no se pierda, sin oscurecer mucho la foto */}
        <div className="absolute inset-0 bg-black/10" /> 
        
        {/* Textos delicados idénticos a tu versión inicial */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4 mt-8 md:mt-0">
          <p className="text-white text-[10px] md:text-xs lg:text-sm tracking-[0.35em] font-light uppercase mb-3 drop-shadow-sm">
            Nueva Colección
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white font-light drop-shadow-md leading-tight max-w-4xl mx-auto">
            Girl, es tu momento de<br />brillar
          </h2>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}