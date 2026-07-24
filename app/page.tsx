import Image from "next/image";
import Link from "next/link";
import BotonAnadir from "@/components/BotonAnadir";
import CarruselMarcas from "@/components/CarruselMarcas";
import HeroSlider from "@/components/HeroSlider";
import CategoryBlock from "@/components/CategoryBlock";

interface Producto {
  Codigo: string;
  Producto: string;
  Categoria: string;
  Proveedor?: string;
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

// Carga las colecciones activas directamente desde la Base de Datos
async function getColecciones() {
  const urlApi = "https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_colecciones&tienda=ambas";
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    const json = await res.json();
    if (json.status === "success" && Array.isArray(json.data)) {
      return json.data.map((c: any) => {
        const urlSegura = c.imagen_url ? c.imagen_url.trim().replace(/ /g, '%20') : null;
        return {
          nombre: c.nombre,
          imagen: urlSegura || "https://via.placeholder.com/400x500?text=Marca",
          url: `/colecciones/${encodeURIComponent(c.nombre)}`
        };
      });
    }
  } catch (error) {
    console.error("Error al obtener colecciones para la home:", error);
  }
  return [];
}

export default async function Home() {
  // Carga en paralelo de productos y colecciones de la BD
  const [productos, colecciones] = await Promise.all([
    getProductos(),
    getColecciones()
  ]);

  const productosConImagen = productos.filter((item) => item.URL_Imagen && item.URL_Imagen.trim() !== "");

  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      const handleFinal = (item.Handle && item.Handle.trim() !== "") ? item.Handle : generarHandle(item.Producto);
      if (!acc[handleFinal]) acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  );
  
  const productosEsenciales = productosAgrupados.slice(0, 4);

  const productosAtenea = productosAgrupados.filter((item: any) => {
    return item.Proveedor?.toLowerCase().includes('atenea') || item.Producto?.toLowerCase().includes('atenea'); 
  }).slice(0, 4); 

  // Procesa y limpia las URLs separadas por coma, codificando espacios para evitar errores de carga
  const procesarImagenes = (urlStr: string) => {
    if (!urlStr) return [];
    return urlStr
      .split(",")
      .map(url => url.trim().replace(/ /g, '%20'))
      .filter(url => url !== "");
  };

  // Función auxiliar para buscar dinámicamente la imagen de una categoría
  // Utiliza un placeholder online en caso de no encontrar la imagen en la base de datos
  const getCategoriaImagen = (nombreCategoria: string, fallbackText: string) => {
    const categoriaEncontrada = colecciones.find(
      (c: any) => c.nombre.toLowerCase() === nombreCategoria.toLowerCase()
    );
    return categoriaEncontrada?.imagen || `https://via.placeholder.com/600x800?text=${fallbackText}`;
  };

  return (
    <div className="min-h-screen bg-[#FCF6F6] text-[#1A1A1A]">
      
      {/* Top Bar Promocional */}
      <div className="w-full bg-[#E5B5C4] text-white text-center py-2.5 text-[11px] tracking-[0.3em] uppercase font-medium">
        Welcome to our store
      </div>

      <main className="w-full overflow-hidden">
        
        {/* 1. SECCIÓN BIENVENIDA: Imagen Portada */}
        <div className="relative w-full aspect-[4/5] md:aspect-[21/9] mb-16 overflow-hidden">
          <Image
            src="/portada.jpeg" 
            alt="Girl, es tu momento de brillar"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-black/10">
              <span className="text-[10px] md:text-sm tracking-[0.3em] uppercase text-white/90 mb-2 md:mb-4 font-medium">
                Nueva Colección
              </span>
              <h2 className="text-4xl md:text-6xl font-serif text-white font-normal tracking-tight max-w-3xl leading-snug drop-shadow-md">
                Girl, es tu momento <br /> de brillar
              </h2>
          </div>
        </div>

        {/* 2. SECCIÓN: Marcas Deslizantes (Colecciones dinámicas desde BD) */}
        <section className="bg-[#DFB2C0]/20 w-full py-12 mb-16">
          <div className="w-full px-4 lg:px-8 mx-auto">
            <div className="flex justify-between items-end mb-6 md:px-4">
              <h3 className="text-xl md:text-2xl font-serif text-[#1A1A1A]">Descubre por Marca</h3>
              <span className="text-[10px] md:text-xs text-gray-600 uppercase tracking-widest flex items-center gap-1.5 font-medium">
                 Desliza para ver más <span className="text-base md:text-lg leading-none">→</span>
              </span>
            </div>
            <CarruselMarcas marcas={colecciones} />
          </div>
        </section>

        {/* 3. SECCIÓN: Bloque Asimétrico (Skincare y Esenciales cargados desde BD) */}
        <section className="w-full px-4 lg:px-8 mx-auto mb-20">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6 lg:gap-8">
            <div className="col-span-1 md:col-span-7">
              <CategoryBlock 
                title="Skin Care" 
                imageUrl={getCategoriaImagen("Skin Care", "Skin+Care")} 
                linkUrl={`/colecciones/${encodeURIComponent("Skin Care")}`} 
                aspectRatio="aspect-[4/5] md:aspect-[4/3]" 
              />
            </div>
            <div className="col-span-1 md:col-span-5">
              <CategoryBlock 
                title="Esenciales" 
                imageUrl={getCategoriaImagen("Esenciales", "Esenciales")} 
                linkUrl={`/colecciones/${encodeURIComponent("Esenciales")}`} 
                aspectRatio="aspect-[4/5] md:aspect-[3/4]" 
              />
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN: Grid de Productos Destacados */}
        <section className="w-full px-4 lg:px-8 mx-auto mb-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 lg:gap-x-10 lg:gap-y-12">
              {productosEsenciales.map((item: any) => {
                const imagenes = procesarImagenes(item.URL_Imagen);
                const precioVenta = Number(item.Precio_Venta);

                return (
                  <div key={item.HandleFinal} className="group flex flex-col gap-3">
                    
                    <div className="relative w-full aspect-[4/5] bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                      {imagenes.length > 1 ? (
                        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {imagenes.map((img: string, idx: number) => (
                            <Link key={idx} href={`/producto/${item.HandleFinal}`} className="relative w-full h-full flex-shrink-0 snap-center block">
                              <Image 
                                src={img} 
                                alt={`${item.Producto} - Imagen ${idx + 1}`} 
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover" 
                              />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link href={`/producto/${item.HandleFinal}`} className="relative w-full h-full block">
                          {imagenes[0] && (
                            <Image 
                              src={imagenes[0]} 
                              alt={item.Producto} 
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          )}
                        </Link>
                      )}

                      {imagenes.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                          {imagenes.map((_, idx) => (
                            <div key={idx} className="w-1.5 h-1.5 rounded-full bg-black/30 border border-white/60 shadow-sm" />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 px-1">
                      <Link href={`/producto/${item.HandleFinal}`}>
                        <h4 className="font-sans text-sm md:text-base text-[#1A1A1A] line-clamp-2 hover:underline decoration-gray-300 underline-offset-4">
                          {item.Producto}
                        </h4>
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-800 text-sm font-medium">
                          ${precioVenta.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full mt-2 [&>button]:w-full [&>button]:py-2.5 [&>button]:border [&>button]:border-[#1A1A1A] [&>button]:bg-[#1A1A1A] [&>button]:text-white [&>button]:rounded [&>button]:text-sm hover:[&>button]:bg-transparent hover:[&>button]:text-[#1A1A1A] [&>button]:transition-all">
                        <BotonAnadir id={item.Codigo} nombre={item.Producto} precio={item.Precio_Venta} imagen={imagenes[0]} />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-12 flex justify-center">
              <Link href="/tienda" className="bg-[#B58B99] text-white px-8 py-2.5 rounded text-sm hover:bg-[#9c7682] transition-colors">
                Ver todo
              </Link>
            </div>
        </section>

        {/* 5. SECCIÓN: Sweet Body (Fragancias y Corporal cargados desde BD) */}
        <section className="w-full px-4 lg:px-8 mx-auto mb-24">
          <div className="mb-6 md:mb-8">
            <h3 className="text-2xl md:text-3xl font-serif text-[#1A1A1A]">Sweet Body</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-10">
            <CategoryBlock 
              title="Fragancias" 
              cursiveOverlay="Perfumes & Splash" 
              imageUrl={getCategoriaImagen("Fragancias", "Fragancias")} 
              linkUrl={`/colecciones/${encodeURIComponent("Fragancias")}`} 
              aspectRatio="aspect-[4/5] md:aspect-square" 
            />
            <CategoryBlock 
              title="Corporal" 
              cursiveOverlay="Cuidado corporal" 
              imageUrl={getCategoriaImagen("Corporal", "Corporal")} 
              linkUrl={`/colecciones/${encodeURIComponent("Corporal")}`} 
              aspectRatio="aspect-[4/5] md:aspect-square" 
            />
          </div>
        </section>

        {/* 6. SECCIÓN: Carrusel Hero Automático */}
        <div className="w-full mb-16">
          <HeroSlider />
        </div>

        {/* 7. SECCIÓN: Atenea Cosmetics */}
        <section className="w-full px-4 lg:px-8 mx-auto mb-24">
          <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h3 className="text-2xl md:text-3xl font-serif text-[#1A1A1A]">Atenea Cosmetics</h3>
            <Link href="/colecciones/atenea" className="text-xs md:text-sm text-[#B58B99] hover:underline flex items-center gap-1.5 font-medium uppercase tracking-wider">
              Ver Colección Completa <span className="text-lg">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 lg:gap-x-10 lg:gap-y-12">
            {productosAtenea.map((item: any) => {
              const imagenes = procesarImagenes(item.URL_Imagen);
              const precioVenta = Number(item.Precio_Venta);
              
              return (
                <div key={item.HandleFinal} className="group flex flex-col gap-3">
                  
                  <div className="relative w-full aspect-[4/5] bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                      {imagenes.length > 1 ? (
                        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {imagenes.map((img: string, idx: number) => (
                            <Link key={idx} href={`/producto/${item.HandleFinal}`} className="relative w-full h-full flex-shrink-0 snap-center block">
                              <Image 
                                src={img} 
                                alt={`${item.Producto} - Imagen ${idx + 1}`} 
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover" 
                              />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link href={`/producto/${item.HandleFinal}`} className="relative w-full h-full block">
                          {imagenes[0] && (
                            <Image 
                              src={imagenes[0]} 
                              alt={item.Producto} 
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          )}
                        </Link>
                      )}

                      {imagenes.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                          {imagenes.map((_, idx) => (
                            <div key={idx} className="w-1.5 h-1.5 rounded-full bg-black/30 border border-white/60 shadow-sm" />
                          ))}
                        </div>
                      )}
                  </div>
                  
                  <div className="flex flex-col gap-1 px-1">
                    <Link href={`/producto/${item.HandleFinal}`}>
                      <h4 className="font-sans text-sm md:text-base text-[#1A1A1A] line-clamp-2 hover:underline decoration-gray-300 underline-offset-4">
                        {item.Producto}
                      </h4>
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-800 text-sm font-medium">
                        ${precioVenta.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full mt-2 [&>button]:w-full [&>button]:py-2.5 [&>button]:border [&>button]:border-[#1A1A1A] [&>button]:bg-[#1A1A1A] [&>button]:text-white [&>button]:rounded [&>button]:text-sm hover:[&>button]:bg-transparent hover:[&>button]:text-[#1A1A1A] [&>button]:transition-all">
                      <BotonAnadir id={item.Codigo} nombre={item.Producto} precio={item.Precio_Venta} imagen={imagenes[0]} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. SECCIÓN: Complementos (Bolsos y Carteras cargados desde BD) */}
        <section className="w-full px-4 lg:px-8 mx-auto mb-24">
          <div className="mb-6 md:mb-8">
            <h3 className="text-2xl md:text-3xl font-serif text-[#1A1A1A]">Complementos</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-10">
            <CategoryBlock 
              title="Bolsos" 
              cursiveOverlay="Bolsos & Mochilas" 
              imageUrl={getCategoriaImagen("Bolsos", "Bolsos")} 
              linkUrl={`/colecciones/${encodeURIComponent("Bolsos")}`} 
              aspectRatio="aspect-[4/5] md:aspect-[16/10]" 
            />
            <CategoryBlock 
              title="Carteras" 
              cursiveOverlay="Carteras & Bandoleras" 
              imageUrl={getCategoriaImagen("Carteras", "Carteras")} 
              linkUrl={`/colecciones/${encodeURIComponent("Carteras")}`} 
              aspectRatio="aspect-[4/5] md:aspect-[16/10]" 
            />
          </div>
        </section>

      </main>
      
      {/* Footer Minimalista */}
      <footer className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center text-[#707070]">
          <h3 className="text-3xl font-serif text-[#DFB2C0] mb-6">Splendide</h3>
          <p className="max-w-md mx-auto mb-8 leading-relaxed font-light">Calidad profesional para resaltar tu belleza única. Encuentra tus favoritos hoy.</p>
          <p className="text-xs uppercase tracking-widest">©️ 2026 Splendide Co.</p>
        </div>
      </footer>

    </div>
  );
}