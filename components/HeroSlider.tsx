"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// CORRECCIÓN 1: Rutas de imágenes ajustadas a los nombres y extensiones reales de tu carpeta
const BANNERS_DATA = [
  {
    id: 1,
    title: "Atenea profesional",
    subtitle: "Diseñados para un acabado impecable y duradero en cada aplicación.",
    buttonText: "Comprar ahora",
    linkUrl: "/colecciones/Atenea",
    imageUrl: "/banners/Atenea.jpeg", // <-- Nombre exacto de tu archivo local
    textPosition: "right"
  },
  {
    id: 2,
    title: "Montoc Cosmetics", // <-- Cambié 'Maquillaje' por 'Montoc'
    subtitle: "Todo lo que necesitas para crear looks espectaculares y profesionales.",
    buttonText: "Ver colección",
    linkUrl: "/colecciones/Montoc", 
    imageUrl: "/banners/montoc.jpeg", // <-- Nombre exacto de tu archivo local
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
          
          // Lógica de posición: Siempre a la derecha en celular (right-4). En PC, respeta la configuración.
          let positionClass = "right-4 md:right-auto md:left-1/2 md:-translate-x-1/2"; 
          if (slide.textPosition === "right") positionClass = "right-4 md:left-auto md:right-12 md:translate-x-0";
          if (slide.textPosition === "left") positionClass = "right-4 md:left-12 md:right-auto md:translate-x-0";

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
                unoptimized // <-- CORRECCIÓN 2: Previene el error 500 en Clever Cloud
              />

              <div className="absolute inset-0 bg-black/5 md:bg-transparent" />

              {/* TARJETA MINIATURA PARA CELULAR */}
              <div className={`absolute bottom-[70px] md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-auto max-w-[160px] md:max-w-none md:w-[420px] bg-white/95 backdrop-blur-sm rounded md:rounded-2xl p-2.5 md:p-8 shadow-xl border border-gray-100 transition-all duration-700 ${positionClass} ${
                isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}>
                {/* Título pequeño en celular */}
                <h2 className="font-serif text-[14px] md:text-4xl text-[#1A1A1A] mb-1.5 md:mb-3 font-semibold md:font-normal tracking-tight leading-tight">
                  {slide.title}
                </h2>
                
                {/* EL SECRETO: Subtítulo oculto en celular (hidden) para ahorrar espacio */}
                <p className="hidden md:block font-sans text-sm text-gray-600 mb-6 leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Botón súper compacto */}
                <Link 
                  href={slide.linkUrl}
                  className="inline-block w-full text-center bg-[#1A1A1A] text-white font-sans text-[8px] md:text-xs uppercase tracking-widest py-1.5 md:py-3.5 px-2 md:px-8 rounded-sm hover:bg-[#E5B5C4] transition-colors duration-300"
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