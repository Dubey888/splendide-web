import Link from 'next/link';
import Image from 'next/image';

// Función auxiliar para transformar el nombre del proveedor al nombre de su archivo local .jpeg
function obtenerRutaImagen(proveedor: string): string {
  let slug = proveedor
    .toLowerCase()
    .normalize("NFD")               // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, "") // Remueve tildes (ej: Salomé -> salome)
    .replace(/[^a-z0-9\s-]/g, "")    // Remueve caracteres especiales como el '&'
    .trim()
    .replace(/\s+/g, '-');           // Cambia espacios por guiones medios (ej: Kiss Beauty -> kiss-beauty)

  // Ajustes manuales específicos por si acaso:
  if (slug === 'salome-makeup') return '/marcas/salome.jpeg';
  if (slug === 'kevin-coco') return '/marcas/kevin-coco.jpeg';

  return `/marcas/${slug}.jpeg`;
}

async function obtenerMarcasDesdeBD(): Promise<string[]> {
  const urlApi = 'https://api.splendide.com.co/index.php?accion=obtener_marcas_activas';
  
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error cargando las marcas desde la API de PHP:", error);
    return [];
  }
}

export default async function ColeccionesPage() {
  // Traemos el arreglo de marcas directamente filtrado por el servidor PHP
  const marcasProveedor = await obtenerMarcasDesdeBD();

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans pb-20">
      
      {/* HEADER DE COLECCIONES */}
      <header className="relative w-full h-[250px] flex items-center justify-center overflow-hidden mb-12">
        <Image 
          src="/portada.jpeg" 
          alt="Colecciones Splendide"
          fill
          priority
          unoptimized
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-[#1A1A1A]/50" />
        <div className="relative text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-serif drop-shadow-lg mb-2">Colecciones</h1>
          <p className="text-sm md:text-base uppercase tracking-[0.2em] opacity-90">
            Tu espacio favorito para brillar
          </p>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12">
        
        {marcasProveedor.length === 0 ? (
          <div className="text-center py-20 text-[#707070]">
            <p className="text-lg">No hay colecciones con productos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-8">
            {marcasProveedor.map((proveedor) => {
              const rutaImagenLocal = obtenerRutaImagen(proveedor);

              return (
                <Link href={`/colecciones/${encodeURIComponent(proveedor)}`} key={proveedor} className="group cursor-pointer block">
                  <div className="relative overflow-hidden rounded-md bg-white shadow-sm transition-transform duration-500 group-hover:-translate-y-2 border border-[#D7A1A4]/20">
                    
                    {/* Formato retrato (3:4) mantenido */}
                    <div className="aspect-[3/4] relative bg-[#EAEAEA]">
                      <Image
                        src={rutaImagenLocal}
                        alt={`Colección ${proveedor}`}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    <div className="p-4 md:p-6 bg-white flex justify-between items-center">
                      <h2 className="text-sm md:text-xl font-serif text-[#1A1A1A] truncate pr-2">
                        {proveedor}
                      </h2>
                      <span className="text-[#D7A1A4] text-lg md:text-xl transition-transform group-hover:translate-x-2 hidden md:block">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}