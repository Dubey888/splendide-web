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
      // AQUÍ ESTÁ EL CAMBIO: Mayor altura en pantallas grandes (lg y xl)
      className="w-full h-[500px] md:h-[600px] lg:h-[750px] xl:h-[800px] bg-white pb-10 banner-splendide"
    >
      {/* Slide 1 */}
      <SwiperSlide className="relative w-full h-full">
        <Image 
          src="/portada.jpeg" 
          alt="Banner 1" 
          fill 
          priority 
          // AQUÍ ESTÁ EL CAMBIO: Enfoca el recorte al 20% desde arriba (mantiene el rostro)
          className="object-cover object-[center_20%]" 
        />
      </SwiperSlide>
      
      {/* Slide 2 (Repetido como ejemplo, asegúrate de aplicar el mismo object-position a tus otras fotos) */}
      <SwiperSlide className="relative w-full h-full">
        <Image 
          src="/portada.jpeg" 
          alt="Banner 2" 
          fill 
          className="object-cover object-[center_20%]" 
        />
      </SwiperSlide>
    </Swiper>
  );
}