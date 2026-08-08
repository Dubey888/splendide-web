import Image from "next/image";
import ProductCardCatalog from "@/components/ProductCardCatalog";

interface Producto {
  Codigo: string;
  Producto: string;
  Categoria: string;
  Precio_Venta: number;
  Stock: number;
  URL_Imagen: string;
  Handle: string;
  Estado: string; // <-- 1. Añadimos Estado a la interfaz
}

const generarHandle = (nombre: string) => {
  return nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

async function getProductos(): Promise<Producto[]> {
  const urlApi = "https://api.splendide.com.co/index.php?accion=obtener_catalogo_web";
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function CatalogoCompleto() {
  const productos = await getProductos();

  // 2. Modificamos el filtro para incluir la validación del Estado
  const productosFiltrados = productos.filter(
    (item) => 
      item.URL_Imagen && 
      item.URL_Imagen.trim() !== "" &&
      item.Estado === "activo" // <-- Solo pasa si el estado es 'activo'
  );

  const productosAgrupados = Object.values(
    productosFiltrados.reduce((acc: any, item) => {
      const handleFinal = (item.Handle && item.Handle.trim() !== "") ? item.Handle : generarHandle(item.Producto);
      if (!acc[handleFinal]) {
        acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      }
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  );

  return (
    // Fondo claro parecido a la página original
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans pb-20">
      
      {/* HEADER DEL CATÁLOGO */}
      <header className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <Image 
          src="/portada.jpeg" 
          alt="Catálogo Splendide"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-serif drop-shadow-lg mb-2">Nuestro Catálogo</h1>
          <p className="text-sm md:text-base uppercase tracking-[0.2em] opacity-90 drop-shadow-md">
            Todos los productos disponibles
          </p>
        </div>
      </header>

      {/* REJILLA DE PRODUCTOS */}
      <main className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-12">
        
        {/* Barra de utilidades */}
        <div className="flex items-center justify-between border-b border-[#D7A1A4]/30 pb-4 mb-8">
          <p className="text-[#707070] text-sm uppercase tracking-widest">
            {productosAgrupados.length} Productos
          </p>
          <div className="text-[#707070] text-sm flex items-center gap-2 cursor-pointer hover:text-[#D7A1A4] transition-colors">
            Filtrar y Ordenar
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        {/* Implementación de la Rejilla usando nuestro nuevo Componente Cliente */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-8 gap-y-12">
          {productosAgrupados.map((item: any) => (
            <ProductCardCatalog key={item.HandleFinal} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}