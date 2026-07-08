"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link';

export default function CarruselMarcas({ marcas }: { marcas: any[] }) {
  return (
    <Swiper
      slidesPerView={2} 
      spaceBetween={16}
      breakpoints={{
        480: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        // Aquí le decimos que en pantallas grandes muestre SOLO 5, ni una más ni una menos
        1024: { slidesPerView: 5, spaceBetween: 20 },
        1280: { slidesPerView: 5, spaceBetween: 24 },
        1536: { slidesPerView: 5, spaceBetween: 28 }, 
      }}
      className="w-full cursor-grab active:cursor-grabbing pb-6 pt-2"
    >
      {marcas.map((marca, index) => (
        <SwiperSlide key={index}>
          <Link 
            href={marca.url} 
            className="block group bg-[#FAFAFA] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <img 
                src={marca.imagen} 
                alt={marca.nombre} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            <div className="p-4 flex justify-between items-center bg-white">
              {/* Letra fina y delicada en las marcas también */}
              <span className="font-serif text-[#1A1A1A] font-light text-base md:text-lg">{marca.nombre}</span>
              <span className="text-[#1A1A1A] font-light transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}