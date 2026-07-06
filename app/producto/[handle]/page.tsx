"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

const generarHandle = (item: any) => {
  if (item.Handle && item.Handle.trim() !== "") {
    return item.Handle;
  }
  return item.Producto.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export default function DetalleProducto() {
  const params = useParams();
  const router = useRouter();
  const handleUrl = params.handle as string;

  const [productoPadre, setProductoPadre] = useState<any>(null);
  const [varianteActiva, setVarianteActiva] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  
  // 🔥 Estados para el Carrusel
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_catalogo_web")
      .then(res => res.json())
      .then(json => {
        const variantes = json.data.filter((p: any) => {
            const handleCalculado = generarHandle(p);
            return handleCalculado === handleUrl;
        });

        if (variantes.length > 0) {
          setProductoPadre({ Producto: variantes[0].Producto, Variantes: variantes });
          setVarianteActiva(variantes[0]); 
        }
        setCargando(false);
      });
  }, [handleUrl]);

  // 🔥 Lógica para detectar en qué imagen estamos
  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setCurrentIndex(index);
    }
  };

  if (cargando) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!varianteActiva) return <div className="min-h-screen flex items-center justify-center">Producto no encontrado</div>;

  const listaImagenes = varianteActiva.URL_Imagen ? varianteActiva.URL_Imagen.split(",") : [];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="text-xs uppercase tracking-widest text-gray-500 mb-8 hover:text-black">
         ← Volver al catálogo
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        
        {/* 🔥 CONTENEDOR DEL CARRUSEL */}
        <div className="relative">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory w-full aspect-[3/4] bg-gray-50 rounded-sm scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {listaImagenes.map((url: string, index: number) => (
              <img 
                key={index}
                src={url} 
                className="w-full h-full flex-none object-cover snap-center" 
                alt={varianteActiva.Producto} 
              />
            ))}
          </div>

          {/* Indicadores (Dots) corregidos para TypeScript */}
          {listaImagenes.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {listaImagenes.map((_: any, index: number) => (
                <div 
                  key={index} 
                  className={`h-2 w-2 rounded-full transition-colors ${currentIndex === index ? 'bg-black' : 'bg-gray-400'}`} 
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-serif mb-4">{productoPadre.Producto}</h1>
          <p className="text-2xl text-gray-800 mb-8">${Number(varianteActiva.Precio_Venta).toLocaleString('es-CO')}</p>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-3">Color / Variante:</p>
            <div className="flex flex-wrap gap-2">
              {productoPadre.Variantes.map((v: any) => (
                <button 
                  key={v.Codigo} 
                  onClick={() => setVarianteActiva(v)}
                  className={`px-4 py-2 text-sm border ${varianteActiva.Codigo === v.Codigo ? 'bg-black text-white' : 'bg-white border-gray-200 hover:border-black'}`}
                >
                  {v.Variante_Color || v.Codigo}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest hover:bg-gray-800">
            Añadir al Carrito
          </button>
        </div>
      </div>
      
      {/* Estilo para ocultar la barra de scroll en navegadores que lo requieran */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}