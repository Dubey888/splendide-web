import Image from "next/image";
import Link from "next/link";

// Estructura de tus productos
interface Producto {
  Codigo: string;
  Producto: string;
  Categoria: string;
  Precio_Venta: number;
  Stock: number;
  URL_Imagen: string;
  Handle: string; // 🔥 Asegurado el campo Handle
}

async function getProductos(): Promise<Producto[]> {
  const urlApi = "https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_catalogo_web";
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const productos = await getProductos();

  // 1. Filtrar los que tienen imagen
  const productosConImagen = productos.filter(
    (item) => item.URL_Imagen && item.URL_Imagen.trim() !== ""
  );

  // 2. LÓGICA DE AGRUPACIÓN POR HANDLE
  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      if (!item.Handle) return acc; // Por si acaso hay algo sin Handle
      if (!acc[item.Handle]) {
        acc[item.Handle] = { ...item, Variantes: [] };
      }
      acc[item.Handle].Variantes.push(item);
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* NAVEGACIÓN */}
      <nav className="border-b border-gray-100 py-6 text-center">
        <h1 className="text-2xl font-serif tracking-widest uppercase">Splendide</h1>
      </nav>

      {/* HERO BANNER */}
      <header className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
        <Image 
          src="/portada.jpeg" 
          alt="Nueva Colección Splendide"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative text-center px-4 text-white">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] mb-2 drop-shadow-md">Nueva Colección</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif drop-shadow-lg">Girl, es tu momento de brillar</h2>
        </div>
      </header>

      {/* CATÁLOGO */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {productosAgrupados.map((item: any) => {
            const imagenes = item.URL_Imagen ? item.URL_Imagen.split(",") : [];
            const imagenPrincipal = imagenes[0] || null;
            const cantidadVariantes = item.Variantes.length;

            return (
              <Link href={`/producto/${item.Handle}`} key={item.Handle} className="group cursor-pointer block">
                {/* Imagen con efecto hover */}
                <div className="aspect-[3/4] bg-gray-50 rounded-sm overflow-hidden mb-4 relative">
                  {imagenPrincipal && (
                    <img 
                      src={imagenPrincipal} 
                      alt={item.Producto} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}
                </div>
                
                {/* Info producto */}
                <h3 className="font-medium text-gray-800 text-sm">{item.Producto}</h3>
                <p className="text-gray-900 font-semibold mt-1">
                  ${Number(item.Precio_Venta).toLocaleString('es-CO')}
                </p>
                
                {cantidadVariantes > 1 ? (
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block mt-1">
                    {cantidadVariantes} Opciones disponibles
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block mt-1">
                    Stock: {item.Stock}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-12 text-center text-sm text-gray-500">
        <p>©️ 2026 Splendide Co. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}