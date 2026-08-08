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
}

const generarHandle = (nombre: string) => {
  return nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// Petición de productos de la marca
async function getProductosPorMarca(marca: string): Promise<Producto[]> {
  if (!marca || marca === "undefined") return [];

  const urlApi = `https://api.splendide.com.co/index.php?accion=obtener_por_marca&marca=${encodeURIComponent(marca)}`;
  
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    const json = await res.json();
    return json.data || json || [];
  } catch (error) {
    console.error("Error al conectar con la BD:", error);
    return [];
  }
}

// NUEVA FUNCIÓN: Obtiene la imagen de la portada guardada en la BD (Cloudinary)
async function getImagenPortadaColeccion(marca: string): Promise<string | null> {
  const urlApi = `https://api.splendide.com.co/index.php?accion=obtener_colecciones&tienda=ambas`;
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    const json = await res.json();
    if (json.status === "success" && Array.isArray(json.data)) {
      const coleccion = json.data.find(
        (c: any) => c.nombre.toLowerCase().trim() === marca.toLowerCase().trim()
      );
      return coleccion?.imagen_url || null;
    }
  } catch (error) {
    console.error("Error cargando portada de la colección:", error);
  }
  return null;
}

export default async function MarcaPage({ params }: { params: Promise<{ marca: string }> }) {
  const resolvedParams = await params;
  const marcaRaw = resolvedParams.marca;
  
  if (!marcaRaw) {
    return (
      <div className="min-h-screen bg-[#FAF4F4] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl text-red-500 mb-4 font-serif">Error de Enrutamiento</h1>
        <p className="text-[#707070]">Next.js no está recibiendo el nombre de la marca.</p>
      </div>
    );
  }

  const marcaBuscada = decodeURIComponent(marcaRaw);

  // Ejecutamos ambas peticiones en paralelo
  const [productos, imagenPortadaBD] = await Promise.all([
    getProductosPorMarca(marcaBuscada),
    getImagenPortadaColeccion(marcaBuscada)
  ]);

  const productosConImagen = productos.filter(
    (item) => item.URL_Imagen && item.URL_Imagen.trim() !== ""
  );

  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      const handleFinal = (item.Handle && item.Handle.trim() !== "") ? item.Handle : generarHandle(item.Producto);
      if (!acc[handleFinal]) {
        acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      }
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  );

  const procesarImagenes = (urlStr: string) => {
    if (!urlStr) return [];
    return urlStr.split(",").map(url => url.trim()).filter(url => url !== "");
  };

  // Si existe en la BD usa la URL de Cloudinary, de lo contrario muestra una imagen por defecto
  const rutaBanner = imagenPortadaBD || "https://via.placeholder.com/1200x400?text=Coleccion";

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans pb-20">
      
      {/* HEADER DINÁMICO DESDE LA BASE DE DATOS */}
      <header className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center overflow-hidden mb-10 bg-gray-900">
        <Image 
          src={rutaBanner}
          alt={`Portada de la colección ${marcaBuscada}`}
          fill
          className="object-cover opacity-80"
          sizes="100vw"
          priority
          unoptimized
        />
        
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative text-center px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-serif capitalize drop-shadow-md">
            {marcaBuscada}
          </h1>
          <p className="text-sm mt-2 uppercase tracking-[0.2em] text-white/90 drop-shadow-md">
            Colección Oficial
          </p>
        </div>
      </header>

      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        
        <div className="flex items-center justify-between border-b border-[#D7A1A4]/30 pb-4 mb-10">
          <p className="text-[#707070] text-sm uppercase tracking-widest">
            {productosAgrupados.length} Productos de {marcaBuscada}
          </p>
          <Link href="/colecciones" className="text-[#D7A1A4] text-sm hover:text-[#1A1A1A] transition-colors uppercase tracking-widest">
            ← Volver a marcas
          </Link>
        </div>

        {productosAgrupados.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#707070] text-lg">No hay productos disponibles de {marcaBuscada} en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 lg:gap-x-10 gap-y-14">
            {productosAgrupados.map((item: any) => {
              const imagenes = procesarImagenes(item.URL_Imagen);
              const imagenPrincipal = imagenes[0] || null;
              const cantidadVariantes = item.Variantes.length;

              return (
                <Link href={`/producto/${item.HandleFinal}`} key={item.HandleFinal} className="group cursor-pointer block">
                  <div className="aspect-[3/4] bg-white rounded-md overflow-hidden mb-4 relative shadow-sm border border-[#D7A1A4]/20">
                    {imagenPrincipal && (
                      <Image 
                        src={imagenPrincipal} 
                        alt={item.Producto} 
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        unoptimized
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
                    <span className="text-[10px] text-[#707070] uppercase tracking-widest block mt-2">{cantidadVariantes} Opciones disponibles</span>
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