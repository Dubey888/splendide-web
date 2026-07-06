"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Lógica idéntica a la página principal para generar el handle
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

  useEffect(() => {
    fetch("https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_catalogo_web")
      .then(res => res.json())
      .then(json => {
        // Buscamos todas las variantes que, al procesar su handle, coincidan con la URL
        const variantes = json.data.filter((p: any) => {
            const handleCalculado = generarHandle(p);
            return handleCalculado === handleUrl;
        });

        if (variantes.length > 0) {
          // Usamos el nombre del primer producto encontrado como título principal
          setProductoPadre({ 
            Producto: variantes[0].Producto, 
            Variantes: variantes 
          });
          setVarianteActiva(variantes[0]); 
        }
        setCargando(false);
      });
  }, [handleUrl]);

  if (cargando) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!varianteActiva) return <div className="min-h-screen flex items-center justify-center">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="text-xs uppercase tracking-widest text-gray-500 mb-8 hover:text-black">
         ← Volver al catálogo
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
          <img 
            src={varianteActiva.URL_Imagen.split(",")[0]} 
            className="w-full h-full object-cover" 
            alt={varianteActiva.Producto} 
          />
        </div>

        <div>
          <h1 className="text-3xl font-serif mb-4">{productoPadre.Producto}</h1>
          <p className="text-2xl text-gray-800 mb-8">${Number(varianteActiva.Precio_Venta).toLocaleString('es-CO')}</p>

          {/* Selector de Variantes */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-3">Color / Variante:</p>
            <div className="flex flex-wrap gap-2">
              {productoPadre.Variantes.map((v: any) => (
                <button 
                  key={v.Codigo} 
                  onClick={() => setVarianteActiva(v)}
                  className={`px-4 py-2 text-sm border ${varianteActiva.Codigo === v.Codigo ? 'bg-black text-white' : 'bg-white border-gray-200 hover:border-black'}`}
                >
                  {/* 🔥 Aquí mostramos Variante_Color, o el Código si está vacío */}
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
    </div>
  );
}