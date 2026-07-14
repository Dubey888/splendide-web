"use client";
import Link from "next/link";
import { useState, useRef } from "react";
// 1. Importamos tu contexto del carrito
import { useCart } from "@/context/CartContext"; 

export default function ProductCardCatalog({ item }: { item: any }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. Extraemos la función addToCart del contexto
  const { addToCart } = useCart();

  // Limpiamos las imágenes y verificamos cuántas hay
  const imagenes = item.URL_Imagen 
    ? item.URL_Imagen.split(",").map((url: string) => url.trim()).filter((url: string) => url !== "") 
    : [];
  
  const cantidadVariantes = item.Variantes?.length || 1;
  const tieneVariasImagenes = imagenes.length > 1;

  // Actualiza los punticos cuando arrastras con el dedo (swipe)
  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const width = sliderRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / width);
      setCurrentIndex(newIndex);
    }
  };

  // Función para las flechas en PC
  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const width = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({ left: width * index, behavior: "smooth" });
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (currentIndex < imagenes.length - 1) scrollToIndex(currentIndex + 1);
    else scrollToIndex(0); // Vuelve al inicio
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (currentIndex > 0) scrollToIndex(currentIndex - 1);
    else scrollToIndex(imagenes.length - 1); // Va a la última
  };

  // 3. Creamos una función que realmente agregue el producto
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que la página salte
    
    addToCart({
      id: item.Codigo, // Usamos el código único del producto
      nombre: item.Producto,
      precio: Number(item.Precio_Venta),
      imagen: imagenes.length > 0 ? imagenes[0] : "", // La primera imagen si existe
      cantidad: 1, // Por defecto agrega 1
    });

    // Opcional: Puedes dejar la alerta o usar un toast más bonito si prefieres
    alert(`Agregado ${item.Producto} al carrito`);
  };

  return (
    <div className="flex flex-col group h-full">
      
      {/* CONTENEDOR DE IMAGEN Y CARRUSEL (Formato Retrato) */}
      <div className="relative aspect-[4/5] bg-white rounded-xl overflow-hidden mb-4 shadow-sm border border-[#D7A1A4]/20 group">
        
        {/* Slider con Scroll Snap (permite arrastrar en celular) */}
        <div 
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {imagenes.length > 0 ? (
            imagenes.map((img: string, idx: number) => (
              <div key={idx} className="w-full h-full flex-shrink-0 snap-start relative">
                <Link href={`/producto/${item.HandleFinal}`} className="block w-full h-full">
                  <img 
                    src={img} 
                    alt={`${item.Producto} - Imagen ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </Link>
              </div>
            ))
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
               Sin imagen
             </div>
          )}
        </div>

        {/* Flechas de navegación (Solo PC al pasar el mouse) */}
        {tieneVariasImagenes && (
          <>
            <button 
              onClick={prevImage} 
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-[#1A1A1A] hover:scale-110 z-10 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-[#1A1A1A] hover:scale-110 z-10 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </>
        )}

        {/* Punticos de paginación inferiores */}
        {tieneVariasImagenes && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {imagenes.map((_: string, idx: number) => (
              <span 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-[#1A1A1A] scale-110' : 'bg-white/80 border border-gray-300'
                }`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="flex flex-col flex-grow px-1">
        <Link href={`/producto/${item.HandleFinal}`}>
          {/* Título en Serif bonito */}
          <h3 className="font-serif text-[#1A1A1A] text-base md:text-lg transition-colors group-hover:text-[#D7A1A4] line-clamp-2 min-h-[48px] leading-snug">
            {item.Producto}
          </h3>
          <p className="text-[#1A1A1A] font-bold mt-2 text-md md:text-lg">
            ${Number(item.Precio_Venta).toLocaleString('es-CO')}
          </p>
          <span className="text-[10px] md:text-xs text-[#707070] uppercase tracking-widest block mt-2">
            {cantidadVariantes > 1 ? `${cantidadVariantes} OPCIONES DISPONIBLES` : `STOCK: ${item.Stock}`}
          </span>
        </Link>

        {/* BOTONES */}
        <div className="mt-4 mt-auto pt-3">
          {cantidadVariantes > 1 ? (
            <Link 
              href={`/producto/${item.HandleFinal}`} 
              className="block w-full py-3 px-4 bg-[#1A1A1A] text-white text-center text-xs font-semibold uppercase tracking-wider hover:bg-[#D7A1A4] transition-colors rounded-sm"
            >
              Ver Opciones
            </Link>
          ) : (
            <button 
              onClick={handleAddToCart} // 4. Conectamos el botón con nuestra nueva función
              className="block w-full py-3 px-4 bg-[#1A1A1A] text-white text-center text-xs font-semibold uppercase tracking-wider hover:bg-[#D7A1A4] transition-colors rounded-sm cursor-pointer"
            >
              Añadir al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}