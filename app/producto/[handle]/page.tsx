"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

const generarHandle = (item: any) => {
  if (item.Handle && item.Handle.trim() !== "") {
    return item.Handle;
  }
  return item.Producto.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// Componente auxiliar para los acordeones
const Acordeon = ({ titulo, contenido, abiertoPorDefecto = false }: { titulo: string, contenido: React.ReactNode, abiertoPorDefecto?: boolean }) => {
  const [abierto, setAbierto] = useState(abiertoPorDefecto);
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setAbierto(!abierto)} 
        className="w-full flex justify-between items-center text-xs uppercase tracking-widest text-gray-800 hover:text-black transition-colors cursor-pointer"
      >
        {titulo}
        <span className="text-lg font-light">{abierto ? "−" : "+"}</span>
      </button>
      {abierto && (
        <div className="mt-4 text-sm text-gray-600 leading-relaxed text-justify">
          {contenido}
        </div>
      )}
    </div>
  );
};

export default function DetalleProducto() {
  const params = useParams();
  const router = useRouter();
  const handleUrl = params.handle as string;

  const { addToCart } = useCart();

  const [productoPadre, setProductoPadre] = useState<any>(null);
  const [varianteActiva, setVarianteActiva] = useState<any>(null);
  const [productosRelacionados, setProductosRelacionados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [cantidad, setCantidad] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://api.splendide.com.co/index.php?accion=obtener_catalogo_web")
      .then(res => res.json())
      .then(json => {
        const data = json.data;
        
        const variantes = data.filter((p: any) => generarHandle(p) === handleUrl);

        if (variantes.length > 0) {
          setProductoPadre({ Producto: variantes[0].Producto, Variantes: variantes });
          setVarianteActiva(variantes[0]); 
        }

        const otrosProductos = data.filter((p: any) => 
          generarHandle(p) !== handleUrl && 
          p.URL_Imagen && 
          p.URL_Imagen.trim() !== ""
        );
        
        const unicos = otrosProductos.filter((valor: any, indice: number, arreglo: any[]) => 
          arreglo.findIndex(v => v.Producto === valor.Producto) === indice
        );
        const aleatorios = unicos.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProductosRelacionados(aleatorios);

        setCargando(false);
      });
  }, [handleUrl]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setCurrentIndex(index);
    }
  };

  const manejarAnadir = () => {
    if (!varianteActiva) return;
    const nombreConVariante = varianteActiva.Variante_Color 
      ? `${productoPadre.Producto} - ${varianteActiva.Variante_Color}` 
      : productoPadre.Producto;

    addToCart({
      id: varianteActiva.Codigo,
      nombre: nombreConVariante,
      precio: Number(varianteActiva.Precio_Venta),
      imagen: listaImagenes[0] || "",
      cantidad: cantidad, 
    });
  };

  if (cargando) return <div className="min-h-screen flex items-center justify-center font-serif italic text-gray-500">Cargando la magia...</div>;
  if (!varianteActiva) return <div className="min-h-screen flex items-center justify-center font-serif text-gray-500">Producto no encontrado</div>;

  const listaImagenes = varianteActiva.URL_Imagen ? varianteActiva.URL_Imagen.split(",") : [];

  return (
    <div className="min-h-screen text-gray-800 font-sans p-6 md:p-12 max-w-6xl mx-auto bg-white pt-8">
      {/* ELIMINADA LA CABECERA DUPLICADA AQUÍ */}

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* CARRUSEL DE IMÁGENES */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory w-full bg-[#fcfaf9] rounded-sm scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {listaImagenes.map((url: string, index: number) => (
              <img 
                key={index}
                src={url} 
                className="w-full h-auto max-h-[600px] flex-none object-cover snap-center" 
                alt={varianteActiva.Producto} 
              />
            ))}
          </div>

          {listaImagenes.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {listaImagenes.map((_: any, index: number) => (
                <div key={index} className={`h-1.5 w-1.5 rounded-full transition-colors ${currentIndex === index ? 'bg-black' : 'bg-gray-300'}`} />
              ))}
            </div>
          )}
        </div>

        {/* INFO DEL PRODUCTO */}
        <div className="sticky top-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-2">{productoPadre.Producto}</h2>
          <p className="text-lg text-gray-600 mb-6 font-light">${Number(varianteActiva.Precio_Venta).toLocaleString('es-CO')}</p>

          {/* Selector de Variante */}
          <div className="mb-6 border-t border-gray-100 pt-6">
            <label className="text-xs text-gray-500 mb-2 block">Color</label>
            <div className="relative">
              <select 
                value={varianteActiva.Codigo}
                onChange={(e) => {
                  const seleccion = productoPadre.Variantes.find((v: any) => v.Codigo === e.target.value);
                  if (seleccion) setVarianteActiva(seleccion);
                  setCantidad(1);
                }}
                className="w-full appearance-none border border-gray-200 rounded-sm py-3 px-4 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400 cursor-pointer"
              >
                {productoPadre.Variantes.map((v: any) => (
                  <option key={v.Codigo} value={v.Codigo}>
                    {v.Variante_Color || v.Codigo}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Fila de Cantidad y Agregar al carrito */}
          <div className="flex gap-4 mb-3">
            <div className="flex items-center border border-gray-200 rounded-sm w-32 bg-white">
              <button onClick={() => setCantidad(c => c > 1 ? c - 1 : 1)} className="px-4 py-3 text-gray-500 hover:text-black transition-colors cursor-pointer">−</button>
              <span className="flex-1 text-center text-sm">{cantidad}</span>
              <button onClick={() => setCantidad(c => c + 1)} className="px-4 py-3 text-gray-500 hover:text-black transition-colors cursor-pointer">+</button>
            </div>
            
            <button 
              onClick={manejarAnadir}
              className="flex-1 bg-[#d6a5b3] text-white py-3 px-4 text-sm rounded-sm hover:bg-[#c995a4] transition-colors flex justify-center items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              Agregar al carrito
            </button>
          </div>

          {/* Botón Comprar Ahora */}
          <button 
            onClick={() => {
              manejarAnadir(); 
              router.push('/checkout');
            }}
            className="w-full bg-[#4a4a4a] text-white py-3.5 text-sm rounded-sm hover:bg-black transition-colors mb-6 cursor-pointer"
          >
            Comprar ahora
          </button>

          {/* Disponibilidad de tienda */}
          <div className="flex gap-3 items-start mb-8 text-sm text-gray-700">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <div>
              <p>Retiro disponible en <strong className="font-semibold">Splendide</strong></p>
              <p className="text-gray-500 text-xs mt-1">Normalmente está listo en 24 horas</p>
              <button className="text-xs text-gray-500 mt-2 hover:text-black transition-colors cursor-pointer">Ver la información de la tienda</button>
            </div>
          </div>

          {/* Acordeones de Información */}
          <div className="border-t border-gray-200">
            <Acordeon 
                titulo="Details" 
                abiertoPorDefecto={true} /* CAMBIADO A TRUE PARA ABRIR POR DEFECTO */
                contenido={
                  varianteActiva.Descripcion ? (
                   <div 
                     /* AÑADIDAS CLASES PARA QUITAR EL AMARILLO DE <mark> */
                     className="[&>p]:mb-4 [&>p:last-child]:mb-0 [&_strong]:font-semibold [&_mark]:bg-transparent [&_mark]:text-inherit" 
                     dangerouslySetInnerHTML={{ __html: varianteActiva.Descripcion }} 
                   />
                 ) : (
                   <p className="text-gray-500 italic">No hay descripción disponible para este producto en este momento.</p>
               )
              } 
            />
            <Acordeon 
              titulo="Materials + Care" 
              contenido={<p>Información sobre materiales y cuidados irá aquí.</p>} 
            />
            <Acordeon 
              titulo="Shipping + Returns" 
              contenido={<p>Envíos estándar de 3 a 5 días hábiles. Tienes 30 días para realizar devoluciones.</p>} 
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN: TAMBIÉN TE PUEDE INTERESAR */}
      {productosRelacionados.length > 0 && (
        <div className="mt-24 border-t border-gray-100 pt-16">
          <h3 className="text-3xl font-serif italic text-gray-800 mb-10 text-center">You might also like...</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {productosRelacionados.map((prod) => (
              <div 
                key={prod.Codigo} 
                className="group cursor-pointer"
                onClick={() => router.push(`/producto/${generarHandle(prod)}`)}
              >
                <div className="aspect-[3/4] bg-[#fcfaf9] mb-4 overflow-hidden rounded-sm relative">
                  <img 
                    src={prod.URL_Imagen ? prod.URL_Imagen.split(",")[0] : ""} 
                    alt={prod.Producto}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-sm text-gray-800 font-medium truncate">{prod.Producto}</h4>
                <p className="text-sm text-gray-500 mt-1">${Number(prod.Precio_Venta).toLocaleString('es-CO')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}