"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function CarruselBanner() {
  return (
    <section className="relative w-full h-[70vh] md:h-[85vh]">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image 
              src="/portada.jpeg" 
              alt="Colección Principal" 
              fill 
              priority 
              className="object-cover object-center" 
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6">
              <span className="font-sans text-xs md:text-sm tracking-[0.4em] uppercase mb-4 opacity-90">Nueva Colección</span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-center leading-tight drop-shadow-sm">
                Girl, es tu momento de<br />brillar
              </h2>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}