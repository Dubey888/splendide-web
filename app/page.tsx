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
  Handle: string;
}

// Función auxiliar para crear un Handle desde el nombre si el campo está vacío
const generarHandle = (nombre: string) => {
  return nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

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

  // 2. LÓGICA DE AGRUPACIÓN (Con fallback si falta el Handle)
  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      // Usamos el Handle de la BD, o generamos uno desde el nombre si está vacío
      const handleFinal = (item.Handle && item.Handle.trim() !== "") 
                          ? item.Handle 
                          : generarHandle(item.Producto);
      
      if (!acc[handleFinal]) {
        // Guardamos el handleFinal en el objeto para usarlo en el Link
        acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      }
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  );

  return (
    // 🔥 CORRECCIÓN: Quitamos bg-white para liberar el fondo rosado suave global
    <div className="min-h-screen text-splendide-dark font-sans">
      
      {/* NAVEGACIÓN */}
      <nav className="border-b border-splendide-lightPink/40 py-6 text-center bg-transparent">
        <h1 className="text-3xl font-serif tracking-widest uppercase text-splendide-dark">Splendide</h1>
      </nav>

      {/* HERO BANNER */}
      <header className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] flex items-center justify-center overflow-hidden">
        <Image 
          src="/portada.jpeg" 
          alt="Nueva Colección Splendide"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative text-center px-4 text-white">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] mb-3 drop-shadow-md">Nueva Colección</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif drop-shadow-lg">Girl, es tu momento de brillar</h2>
        </div>
      </header>

      {/* CATÁLOGO (Ajustado con max-w-7xl óptimo para PC y monitores anchos) */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {productosAgrupados.map((item: any) => {
            const imagenes = item.URL_Imagen ? item.URL_Imagen.split(",") : [];
            const imagenPrincipal = imagenes[0] || null;
            const cantidadVariantes = item.Variantes.length;

            return (
              <Link href={`/producto/${item.HandleFinal}`} key={item.HandleFinal} className="group cursor-pointer block">
                {/* Imagen con efecto hover suave */}
                <div className="aspect-[3/4] bg-white rounded-md overflow-hidden mb-4 relative shadow-sm border border-splendide-lightPink/20">
                  {imagenPrincipal && (
                    <img 
                      src={imagenPrincipal} 
                      alt={item.Producto} 
                      className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500" 
                    />
                  )}
                </div>
                
                {/* Info producto aplicando la paleta de colores oficial */}
                <h3 className="font-medium text-splendide-dark text-sm transition-colors group-hover:text-splendide-pink">{item.Producto}</h3>
                <p className="text-splendide-dark font-medium mt-1">
                  ${Number(item.Precio_Venta).toLocaleString('es-CO')}
                </p>
                
                {cantidadVariantes > 1 ? (
                  <span className="text-[10px] text-splendide-gray uppercase tracking-widest block mt-1">
                    {cantidadVariantes} Opciones disponibles
                  </span>
                ) : (
                  <span className="text-[10px] text-splendide-gray uppercase tracking-widest block mt-1">
                    Stock: {item.Stock}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-splendide-lightPink/40 py-12 text-center text-sm text-splendide-gray">
        <p>©️ 2026 Splendide Co. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}