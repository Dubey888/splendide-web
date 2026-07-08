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
      className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-white pb-10 banner-splendide"
    >
      {/* Slide 1 */}
      <SwiperSlide className="relative w-full h-full">
        <Image src="/portada.jpeg" alt="Banner 1" fill priority className="object-cover" />
      </SwiperSlide>
      {/* Slide 2 (Agrega otra imagen en public/ o repite portada por ahora) */}
      <SwiperSlide className="relative w-full h-full">
        <Image src="/portada.jpeg" alt="Banner 2" fill className="object-cover" />
      </SwiperSlide>
    </Swiper>
  );
}