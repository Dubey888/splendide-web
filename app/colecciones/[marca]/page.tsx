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

async function getProductosPorMarca(marca: string): Promise<Producto[]> {
  if (!marca || marca === "undefined") return [];

  const urlApi = `https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_por_marca&marca=${encodeURIComponent(marca)}`;
  
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    const json = await res.json();
    return json.data || json || [];
  } catch (error) {
    console.error("Error al conectar con la BD:", error);
    return [];
  }
}

export default async function MarcaPage({ params }: { params: Promise<{ marca: string }> }) {
  const resolvedParams = await params;
  const marcaRaw = resolvedParams.marca;
  
  if (!marcaRaw) {
    return (
      <div className="min-h-screen bg-[#FAF4F4] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl text-red-500 mb-4 font-serif">Error de Enrutamiento</h1>
        <p className="text-[#707070]">Next.js no está recibiendo el nombre de la marca.</p>
        <p className="text-[#707070] mt-2">
          Verifica que tu estructura de carpetas sea exactamente: <br/>
          <b>app/colecciones/[marca]/page.tsx</b>
        </p>
      </div>
    );
  }

  const marcaBuscada = decodeURIComponent(marcaRaw);
  const productos = await getProductosPorMarca(marcaBuscada);

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

  // 1. Limpieza de URLs de las fotos de los productos (Evita cuadros en blanco)
  const procesarImagenes = (urlStr: string) => {
    if (!urlStr) return [];
    return urlStr.split(",").map(url => url.trim()).filter(url => url !== "");
  };

  // 2. Lógica para buscar el banner en la carpeta public/marcas
  // Convierte "Kiss Beauty" en "kissbeauty" para que coincida con tus archivos .jpeg
  const marcaNormalizada = marcaBuscada.toLowerCase().replace(/[^a-z0-9]/g, '');
  const rutaBanner = `/marcas/${marcaNormalizada}.jpeg`;

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans pb-20">
      
      {/* HEADER DINÁMICO CON LA IMAGEN DE LA MARCA */}
      <header className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center overflow-hidden mb-10">
        
        {/* Imagen de fondo extraída de tu carpeta public/marcas */}
        <Image 
          src={rutaBanner}
          alt={`Portada de la colección ${marcaBuscada}`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized // Soluciona el error 500 en Clever Cloud
        />
        
        {/* Capa oscura semitransparente para que el texto blanco resalte sobre cualquier foto */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative text-center px-4 text-white">
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
            <p className="text-[#707070] text-sm mt-2">Verifica que el nombre del proveedor en la base de datos coincida exactamente con la URL.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 lg:gap-x-10 gap-y-14">
            {productosAgrupados.map((item: any) => {
              
              // Usamos la función procesarImagenes aquí también
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
                        unoptimized // También agregado aquí para prevenir fallos con las fotos de productos
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