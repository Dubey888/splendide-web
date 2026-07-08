"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link';

export default function CarruselMarcas({ marcas }: { marcas: any[] }) {
  return (
    <div className="w-full py-10">
      <Swiper
        slidesPerView={2} 
        spaceBetween={20}
        breakpoints={{
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="px-4 md:px-12"
      >
        {marcas.map((marca, index) => (
          <SwiperSlide key={index}>
            <Link href={marca.url} className="group block">
              <div className="aspect-[4/5] relative overflow-hidden rounded-2xl bg-gray-100 mb-4">
                <img 
                  src={marca.imagen} 
                  alt={marca.nombre} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <h3 className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#DFB2C0] transition-colors">
                {marca.nombre}
              </h3>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}