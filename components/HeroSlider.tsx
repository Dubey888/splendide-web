"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BANNERS_DATA = [
  {
    id: 1,
    title: "Atenea profesional",
    subtitle: "Diseñados para un acabado impecable y duradero en cada aplicación.",
    buttonText: "Comprar ahora",
    linkUrl: "/colecciones/atenea",
    imageUrl: "/banners/banner-atenea.jpg",
    textPosition: "right"
  },
  {
    id: 2,
    title: "Maquillaje", 
    subtitle: "Todo lo que necesitas para crear looks espectaculares y profesionales.",
    buttonText: "Ver colección",
    linkUrl: "/colecciones/maquillaje", 
    imageUrl: "/banners/banner-maquillaje.jpg", 
    textPosition: "center"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNERS_DATA.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + BANNERS_DATA.length) % BANNERS_DATA.length);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  return (
    <section className="relative w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-[#FCF6F6]">
      
      <div className="relative w-full h-full">
        {BANNERS_DATA.map((slide, index) => {
          const isActive = index === currentIndex;
          
          let positionClass = "left-1/2 -translate-x-1/2"; 
          if (slide.textPosition === "right") positionClass = "md:left-auto md:right-12 md:translate-x-0 left-1/2 -translate-x-1/2";
          if (slide.textPosition === "left") positionClass = "md:left-12 md:translate-x-0 left-1/2 -translate-x-1/2";

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />

              <div className="absolute inset-0 bg-black/5 md:bg-transparent" />

              {/* AQUÍ ESTÁ LA MAGIA: p-4 en móvil, md:p-8 en PC. w-[75%] en móvil, md:w-[420px] en PC */}
              <div className={`absolute bottom-[52px] md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-[75%] md:w-[420px] bg-white rounded-lg md:rounded-2xl p-3 md:p-8 shadow-xl border border-gray-100 transition-all duration-700 ${positionClass} ${
                isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}>
                {/* Título: text-lg en móvil, md:text-4xl en PC */}
                <h2 className="font-serif text-lg md:text-4xl text-[#1A1A1A] mb-1 md:mb-3 font-normal tracking-tight">
                  {slide.title}
                </h2>
                {/* Subtítulo: text-[10px] en móvil, md:text-sm en PC */}
                <p className="font-sans text-[10px] md:text-sm text-gray-600 mb-2 md:mb-6 leading-tight md:leading-relaxed">
                  {slide.subtitle}
                </p>
                {/* Botón: texto súper pequeño y menos padding en móvil */}
                <Link 
                  href={slide.linkUrl}
                  className="inline-block w-full md:w-auto text-center bg-[#1A1A1A] text-white font-sans text-[9px] md:text-xs uppercase tracking-widest py-2 md:py-3.5 px-4 md:px-8 rounded hover:bg-[#E5B5C4] transition-colors duration-300"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 shadow-sm">
        <button onClick={prevSlide} className="text-gray-700 hover:text-[#E5B5C4] text-xs font-bold transition-colors px-1">
          &lt;
        </button>

        <div className="flex items-center gap-2">
          {BANNERS_DATA.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-4 bg-[#1A1A1A]" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button onClick={nextSlide} className="text-gray-700 hover:text-[#E5B5C4] text-xs font-bold transition-colors px-1">
          &gt;
        </button>

        <span className="w-[1px] h-3 bg-gray-300 mx-0.5" />

        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          className="text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-[#1A1A1A] transition-colors"
        >
          {isPlaying ? "‖ Pausa" : "▶️ Play"}
        </button>
      </div>
    </section>
  );
}