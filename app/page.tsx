import Image from "next/image";
import Link from "next/link";
import BotonAnadir from "@/components/BotonAnadir";

// Estructura de tus productos (Añadimos Proveedor para agrupar por marcas)
interface Producto {
  Codigo: string;
  Producto: string;
  Categoria: string;
  Proveedor?: string; // Clave para agrupar las marcas
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

  // 1. Filtrar los que tienen imagen
  const productosConImagen = productos.filter(
    (item) => item.URL_Imagen && item.URL_Imagen.trim() !== ""
  );

  // 2. LÓGICA DE COLECCIONES (MARCAS)
  // Extraemos las marcas únicas y les asignamos la foto de su primer producto
  const marcasMap = new Map();
  productosConImagen.forEach((p) => {
    // Usamos Proveedor, si está vacío usamos Categoría como plan B
    const nombreMarca = p.Proveedor || p.Categoria; 
    
    if (nombreMarca && nombreMarca !== "undefined" && nombreMarca.trim() !== "") {
      if (!marcasMap.has(nombreMarca)) {
        marcasMap.set(nombreMarca, {
          nombre: nombreMarca,
          imagen: p.URL_Imagen.split(",")[0], // Imagen de portada de la colección
          url: `/colecciones/${encodeURIComponent(nombreMarca)}`
        });
      }
    }
  });
  const colecciones = Array.from(marcasMap.values());

  // 3. LÓGICA DE AGRUPACIÓN PARA PRODUCTOS DESTACADOS (Solo mostramos algunos en el inicio)
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
  
  // Seleccionamos solo los primeros 10 productos para no saturar el inicio
  const productosDestacados = productosAgrupados.slice(0, 10);

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans">
      
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
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] mb-3 drop-shadow-md">Nueva Colección</p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif drop-shadow-lg">Girl, es tu momento de brillar</h2>
        </div>
      </header>

      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-12">
        
        {/* FRASE INSPIRACIONAL (Estilo Shopify) */}
        <div className="text-center my-8 md:my-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#D7A1A4] italic">
              "Tu espacio favorito para brillar"
            </h2>
        </div>

        {/* SECCIÓN 1: COLECCIONES / MARCAS (El look interactivo) */}
        <section className="mb-24">
          <h3 className="text-xl md:text-2xl font-serif mb-8 text-[#1A1A1A]">Nuestras Marcas</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {colecciones.map((coleccion: any) => (
              <Link 
                href={coleccion.url} 
                key={coleccion.nombre} 
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl shadow-sm cursor-pointer"
              >
                <img 
                  src={coleccion.imagen} 
                  alt={`Colección ${coleccion.nombre}`} 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                />
                {/* Degradado oscuro para que el texto resalte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity group-hover:opacity-90" />
                
                {/* Caja de texto de la marca */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 text-center rounded">
                  <span className="font-serif text-lg text-[#1A1A1A] block mb-1">{coleccion.nombre}</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#707070] flex items-center justify-center gap-2">
                    Ver Colección <span className="text-[#D7A1A4]">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* LÍNEA SEPARADORA */}
        <hr className="border-[#D7A1A4]/30 mb-16" />

        {/* SECCIÓN 2: CATÁLOGO DESTACADO (Cuadrícula tradicional limitada) */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-xl md:text-2xl font-serif text-[#1A1A1A]">Llegadas Recientes</h3>
            <Link href="/all" className="text-sm underline decoration-[#D7A1A4] underline-offset-4 text-[#707070] hover:text-[#1A1A1A] transition-colors">
              Ver todo el catálogo
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
            {productosDestacados.map((item: any) => {
              const imagenes = item.URL_Imagen ? item.URL_Imagen.split(",") : [];
              const imagenPrincipal = imagenes[0] || null;
              const cantidadVariantes = item.Variantes.length;

              return (
                <div key={item.HandleFinal} className="group flex flex-col h-full justify-between">
                  
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
                    
                    {cantidadVariantes > 1 ? (
                      <span className="text-[10px] text-[#707070] uppercase tracking-widest block mt-2 mb-3">
                        {cantidadVariantes} Opciones
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#707070] uppercase tracking-widest block mt-2 mb-3">
                        Stock: {item.Stock}
                      </span>
                    )}
                  </Link>

                  <div className="mt-2 w-full">
                    {cantidadVariantes > 1 ? (
                      <Link 
                        href={`/producto/${item.HandleFinal}`} 
                        className="w-full bg-[#1A1A1A] text-white font-sans uppercase tracking-widest text-[11px] h-11 flex items-center justify-center transition-colors duration-300 hover:bg-[#D7A1A4] font-medium text-center rounded"
                      >
                        Ver Opciones
                      </Link>
                    ) : (
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
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#EAD8D9]/40 border-t border-[#D7A1A4]/30 py-16 mt-10">
        <div className="max-w-[1600px] mx-auto px-6 text-center text-sm text-[#707070]">
          <h3 className="text-2xl font-serif text-[#1A1A1A] mb-4">Splendide</h3>
          <p className="mb-6 max-w-md mx-auto">Desde la preparación hasta el diseño final. Encuentra herramientas, esmaltes y accesorios con calidad profesional.</p>
          <p>© 2026 Splendide Co. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}