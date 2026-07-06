import Image from "next/image";
import Link from "next/link";
// Importamos el botón cliente que creamos previamente para el home
import BotonAnadir from "../componentes/BotonAnadir";

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

  const productosConImagen = productos.filter(
    (item) => item.URL_Imagen && item.URL_Imagen.trim() !== ""
  );

  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      const handleFinal = (item.Handle && item.Handle.trim() !== "") 
                          ? item.Handle 
                          : generarHandle(item.Producto);
      
      if (!acc[handleFinal]) {
        acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      }
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans">
      
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

      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 lg:gap-x-10 gap-y-14">
          
          {productosAgrupados.map((item: any) => {
            const imagenes = item.URL_Imagen ? item.URL_Imagen.split(",") : [];
            const imagenPrincipal = imagenes[0] || null;
            const cantidadVariantes = item.Variantes.length;

            return (
              // Cambiamos el Link global por un div para evitar conflictos HTML
              <div key={item.HandleFinal} className="group flex flex-col h-full">
                
                {/* 1. ZONA CLICKEABLE HACIA EL DETALLE */}
                <Link href={`/producto/${item.HandleFinal}`} className="cursor-pointer block flex-grow">
                  <div className="aspect-[3/4] bg-white rounded-md overflow-hidden mb-4 relative shadow-sm border border-[#D7A1A4]/20">
                    {imagenPrincipal && (
                      <img 
                        src={imagenPrincipal} 
                        alt={item.Producto} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                      />
                    )}
                  </div>
                  
                  <h3 className="font-medium text-[#1A1A1A] text-sm transition-colors group-hover:text-[#D7A1A4] line-clamp-2 min-h-[40px]">
                    {item.Producto}
                  </h3>
                  <p className="text-[#1A1A1A] font-semibold mt-2">
                    ${Number(item.Precio_Venta).toLocaleString('es-CO')}
                  </p>
                </Link>

                {/* 2. ZONA DE ACCIÓN RÁPIDA */}
                <div className="mt-4">
                  {cantidadVariantes > 1 ? (
                    // Si tiene variantes de color, le pedimos que vaya a ver las opciones
                    <Link 
                      href={`/producto/${item.HandleFinal}`} 
                      className="w-full text-center block border border-[#1A1A1A] text-[#1A1A1A] py-2 text-[10px] uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors"
                    >
                      Ver Opciones ({cantidadVariantes})
                    </Link>
                  ) : (
                    // Si es producto único, habilitamos el Añadir Rápido
                    <BotonAnadir 
                      id={item.Codigo}
                      nombre={item.Producto}
                      precio={item.Precio_Venta}
                      imagen={imagenPrincipal}
                    />
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-[#D7A1A4]/30 py-12 text-center text-sm text-[#707070]">
        <p>© 2026 Splendide Co. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}