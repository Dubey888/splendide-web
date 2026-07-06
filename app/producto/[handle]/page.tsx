"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
// 1. IMPORTAMOS EL CEREBRO DEL CARRITO
import { useCart } from "../../../context/CartContext"; 

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

  // 2. EXTRAEMOS LA FUNCIÓN PARA AÑADIR AL CARRITO
  const { addToCart } = useCart();

  const [productoPadre, setProductoPadre] = useState<any>(null);
  const [varianteActiva, setVarianteActiva] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  
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

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setCurrentIndex(index);
    }
  };

  const scrollSiguiente = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const scrollAnterior = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  // 3. CREAMOS LA FUNCIÓN QUE SE EJECUTA AL DAR CLIC
  const manejarAnadir = () => {
    if (!varianteActiva) return;

    // Si tiene variante de color, se lo agregamos al nombre para que se vea en el carrito
    const nombreConVariante = varianteActiva.Variante_Color 
      ? `${productoPadre.Producto} - ${varianteActiva.Variante_Color}` 
      : productoPadre.Producto;

    addToCart({
      id: varianteActiva.Codigo,
      nombre: nombreConVariante,
      precio: Number(varianteActiva.Precio_Venta),
      imagen: listaImagenes[0] || "",
      cantidad: 1, // Añadimos de a 1 por clic
    });
  };

  if (cargando) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!varianteActiva) return <div className="min-h-screen flex items-center justify-center">Producto no encontrado</div>;

  const listaImagenes = varianteActiva.URL_Imagen ? varianteActiva.URL_Imagen.split(",") : [];

  return (
    <div className="min-h-screen text-splendide-dark font-sans p-6 md:p-12 max-w-7xl mx-auto">
      <button onClick={() => router.back()} className="text-xs uppercase tracking-widest text-gray-500 mb-8 hover:text-black transition-colors cursor-pointer">
         ← Volver al catálogo
      </button>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* CARRUSEL DE IMÁGENES */}
        <div className="lg:col-span-7 relative group">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory w-full bg-white rounded-md scrollbar-hide shadow-sm"
            style={{ scrollBehavior: 'smooth' }}
          >
            {listaImagenes.map((url: string, index: number) => (
              <img 
                key={index}
                src={url} 
                className="w-full h-auto max-h-[700px] flex-none object-contain snap-center py-4" 
                alt={varianteActiva.Producto} 
              />
            ))}
          </div>

          {listaImagenes.length > 1 && (
            <>
              <button onClick={scrollAnterior} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:block cursor-pointer">
                ❮
              </button>
              <button onClick={scrollSiguiente} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:block cursor-pointer">
                ❯
              </button>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {listaImagenes.map((_: any, index: number) => (
                  <div key={index} className={`h-2 w-2 rounded-full transition-colors ${currentIndex === index ? 'bg-black' : 'bg-gray-300'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* INFO DEL PRODUCTO */}
        <div className="lg:col-span-5 sticky top-12">
          <h1 className="text-3xl lg:text-4xl font-serif mb-4 text-splendide-dark">{productoPadre.Producto}</h1>
          <p className="text-2xl text-gray-800 mb-8 font-light">${Number(varianteActiva.Precio_Venta).toLocaleString('es-CO')}</p>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-3 text-gray-500">Color / Variante:</p>
            <div className="flex flex-wrap gap-2">
              {productoPadre.Variantes.map((v: any) => (
                <button 
                  key={v.Codigo} 
                  onClick={() => setVarianteActiva(v)}
                  className={`px-4 py-2 text-sm border transition-colors cursor-pointer rounded-sm ${varianteActiva.Codigo === v.Codigo ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-black text-gray-700'}`}
                >
                  {v.Variante_Color || v.Codigo}
                </button>
              ))}
            </div>
          </div>

          {/* 4. BOTÓN DE AÑADIR CON EL EVENTO onClick */}
          <button 
            onClick={manejarAnadir}
            /* SE CAMBIÓ rounded-full POR rounded */
            className="w-full bg-splendide-dark text-white py-4 text-sm uppercase tracking-widest hover:bg-black transition-colors shadow-lg cursor-pointer rounded"
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}