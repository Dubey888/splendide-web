"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';

export default function CarruselBanner() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={true}
      // Ajustamos la altura usando porcentajes de la pantalla (vh) para que escale bien
      // y agregamos el fondo para que los lados se vean bien integrados
      className="w-full h-[60vh] md:h-[70vh] lg:h-[85vh] bg-[#FAF4F4] pb-10 banner-splendide"
    >
      {/* Slide 1 */}
      <SwiperSlide className="relative w-full h-full flex justify-center items-center">
        <Image 
          src="/portada.jpeg" 
          alt="Banner 1" 
          fill 
          priority 
          // Clave: En móvil usamos 'cover', en PC usamos 'contain' para que se vea la foto entera
          className="object-cover md:object-contain object-center" 
        />
      </SwiperSlide>
      {/* Slide 2 */}
      <SwiperSlide className="relative w-full h-full flex justify-center items-center">
        <Image 
          src="/portada.jpeg" 
          alt="Banner 2" 
          fill 
          className="object-cover md:object-contain object-center" 
        />
      </SwiperSlide>
    </Swiper>
  );
}