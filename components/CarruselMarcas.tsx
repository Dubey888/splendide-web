"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link';

export default function CarruselMarcas({ marcas }: { marcas: any[] }) {
  return (
    <Swiper
      slidesPerView={2.2} // Muestra 2 y un pedacito en móvil
      spaceBetween={15}
      breakpoints={{
        640: { slidesPerView: 3.5, spaceBetween: 20 },
        1024: { slidesPerView: 5.5, spaceBetween: 20 }, // 5 en PC
      }}
      className="w-full pb-4 cursor-grab active:cursor-grabbing"
    >
      {marcas.map((marca, index) => (
        <SwiperSlide key={index}>
          <Link href={marca.url} className="block group">
            <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden relative shadow-sm mb-3">
              <img 
                src={marca.imagen} 
                alt={marca.nombre} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="font-serif text-[#1A1A1A]">{marca.nombre}</span>
              <span className="text-[#D7A1A4]">&rarr;</span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}