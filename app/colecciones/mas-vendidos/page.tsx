import Image from "next/image";
import Link from "next/link";

interface Producto {
  Codigo: string;
  Producto: string;
  Categoria: string;
  Precio_Venta: number;
  Stock: number;
  URL_Imagen: string;
  Handle?: string;
  total_vendido: number;
}

const generarHandle = (nombre: string) => {
  return nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// Llamamos a la nueva acción de PHP
async function getMasVendidos(): Promise<Producto[]> {
  const urlApi = "https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_productos_mas_vendidos";
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function MasVendidosPage() {
  const productos = await getMasVendidos();

  // Filtramos los que tengan imagen
  const productosConImagen = productos.filter(
    (item) => item.URL_Imagen && item.URL_Imagen.trim() !== ""
  );

  // Reutilizamos tu lógica de agrupación Y AÑADIMOS EL LÍMITE DE 20
  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      const handleFinal = (item.Handle && item.Handle.trim() !== "") ? item.Handle : generarHandle(item.Producto);
      if (!acc[handleFinal]) {
        acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      }
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  ).slice(0, 20); // <-- ESTA ES LA MAGIA: Limita el array a un máximo de 20 elementos

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans pb-20">
      
      {/* HEADER DE MÁS VENDIDOS */}
      <header className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden mb-12">
        <Image 
          src="/portada.jpeg" 
          alt="Productos más vendidos Splendide"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#1A1A1A]/50" />
        <div className="relative text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-serif drop-shadow-lg mb-2">Más Vendidos</h1>
          <p className="text-sm md:text-base uppercase tracking-[0.2em] opacity-90 text-[#D7A1A4] font-bold">
            Los favoritos de nuestras clientas
          </p>
        </div>
      </header>

      {/* REJILLA DE PRODUCTOS */}
      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        
        <div className="flex items-center justify-between border-b border-[#D7A1A4]/30 pb-4 mb-10">
          <p className="text-[#707070] text-sm uppercase tracking-widest">
            Top {productosAgrupados.length} Productos
          </p>
        </div>

        {productosAgrupados.length === 0 ? (
          <p className="text-center text-[#707070] py-20">No hay información de ventas disponible en este momento.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 lg:gap-x-10 gap-y-14">
            {productosAgrupados.map((item: any, index: number) => {
              const imagenes = item.URL_Imagen ? item.URL_Imagen.split(",") : [];
              const imagenPrincipal = imagenes[0] || null;
              const cantidadVariantes = item.Variantes.length;

              return (
                <Link href={`/producto/${item.HandleFinal}`} key={item.HandleFinal} className="group cursor-pointer block relative">
                  
                  {/* INSIGNIA DE TOP VENTAS (Ej: Top 1, Top 2) */}
                  <div className="absolute top-2 left-2 z-10 bg-[#D7A1A4] text-white text-[10px] md:text-xs font-bold px-2 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                    Top {index + 1}
                  </div>
                  
                  <div className="aspect-[3/4] bg-white rounded-md overflow-hidden mb-4 relative shadow-sm border border-[#D7A1A4]/20">
                    {imagenPrincipal && (
                      <img src={imagenPrincipal} alt={item.Producto} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <h3 className="font-medium text-[#1A1A1A] text-sm transition-colors group-hover:text-[#D7A1A4] line-clamp-2 min-h-[40px]">
                    {item.Producto}
                  </h3>
                  <p className="text-[#1A1A1A] font-semibold mt-2">
                    ${Number(item.Precio_Venta).toLocaleString('es-CO')}
                  </p>
                  {cantidadVariantes > 1 ? (
                    <span className="text-[10px] text-[#707070] uppercase tracking-widest block mt-2">{cantidadVariantes} Opciones</span>
                  ) : (
                    <span className="text-[10px] text-[#707070] uppercase tracking-widest block mt-2">Stock: {item.Stock}</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}