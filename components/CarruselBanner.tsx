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
      // Hacemos el banner muy alto en computadora (95vh) para que quepan las manos
      className="w-full h-[70vh] md:h-[95vh] bg-[#FCF6F6]"
    >
      <SwiperSlide className="relative w-full h-full flex items-center justify-center">
        {/* object-top es la magia que evita que se corte la cabeza y las manos */}
        <Image 
          src="/portada.jpeg" 
          alt="Banner Principal" 
          fill 
          priority 
          className="object-cover object-top md:object-[center_top]" 
        />
        
        {/* Sombra casi invisible solo para que la letra blanca se lea bien */}
        <div className="absolute inset-0 bg-black/5" /> 
        
        {/* Textos delicados idénticos a tu versión de celular (image_20) */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4 mt-8 md:mt-12">
          <p className="text-white text-[10px] md:text-xs tracking-[0.4em] font-light uppercase mb-2 drop-shadow-sm">
            Nueva Colección
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-light drop-shadow-md leading-[1.15] max-w-3xl mx-auto">
            Girl, es tu momento de<br />brillar
          </h2>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}