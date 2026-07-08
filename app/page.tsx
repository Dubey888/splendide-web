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

export default async function Home() {
  const productos = await getProductos();
  const productosConImagen = productos.filter((item) => item.URL_Imagen && item.URL_Imagen.trim() !== "");

  // Lógica de Marcas (Cambiado Maxglow por Atenea)
  const colecciones = [
    { nombre: "Salomé Makeup", imagen: "/marcas/salome.jpg", url: "/colecciones/salome" },
    { nombre: "Dolce Bella", imagen: "/marcas/dolcebella.jpg", url: "/colecciones/dolce-bella" },
    { nombre: "Ushas", imagen: "/marcas/ushas.jpg", url: "/colecciones/ushas" },
    { nombre: "Atenea Cosmetics", imagen: "/marcas/atenea.jpg", url: "/colecciones/atenea" }, // CAMBIO A ATENEA
    { nombre: "Kevin&Coco", imagen: "/marcas/kevincoco.jpg", url: "/colecciones/kevin-coco" },
    { nombre: "Kiss Beauty", imagen: "/marcas/kissbeauty.jpg", url: "/colecciones/kiss-beauty" }
  ];

  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      const handleFinal = (item.Handle && item.Handle.trim() !== "") ? item.Handle : generarHandle(item.Producto);
      if (!acc[handleFinal]) acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  );
  
  const productosEsenciales = productosAgrupados.slice(0, 4);

  // Lógica para obtener productos de ATENEA
  const productosAtenea = productosAgrupados.filter((item: any) => {
    return item.Proveedor?.toLowerCase().includes('atenea') || item.Producto?.toLowerCase().includes('atenea'); 
  }).slice(0, 4); 

  return (
    <div className="min-h-screen bg-[#FCF6F6] text-[#1A1A1A]">
      
      {/* Top Bar Promocional */}
      <div className="w-full bg-[#E5B5C4] text-white text-center py-2.5 text-[11px] tracking-[0.3em] uppercase font-medium">
        Welcome to our store
      </div>

      {/* 1. SECCIÓN: Carrusel Hero Automático */}
      <HeroSlider />

      <main className="w-full">
        
        {/* NUEVA IMAGEN: Portada.jpeg con el texto como la captura del celular */}
        <div className="relative w-full aspect-[4/5] md:aspect-[21/9] mb-16 overflow-hidden">
          <Image
            src="/portada.jpeg" 
            alt="Delicada, es tu momento de brillar"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Capa superpuesta con los textos */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-black/10">
              <span className="text-[10px] md:text-sm tracking-[0.3em] uppercase text-white/90 mb-2 md:mb-4 font-medium">
                Nueva Colección
              </span>
              <h2 className="text-4xl md:text-6xl font-serif text-white font-normal tracking-tight max-w-3xl leading-snug drop-shadow-md">
                Delicada, es tu momento <br /> de brillar
              </h2>
          </div>
        </div>

        {/* 2. SECCIÓN: Marcas Deslizantes */}
        <section className="bg-[#DFB2C0]/20 w-full py-12 mb-16">
          <div className="max-w-[1400px] mx-auto px-6">
            <CarruselMarcas marcas={colecciones} />
          </div>
        </section>

        {/* 3. SECCIÓN: Bloque Asimétrico (Skincare y Esenciales) */}
        <section className="max-w-[1400px] mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <CategoryBlock 
                title="Skincare" 
                imageUrl="/categorias/skincare.jpg" 
                linkUrl="/colecciones/skincare" 
                aspectRatio="aspect-[4/5] md:aspect-[4/3]" 
              />
            </div>
            <div className="md:col-span-5">
              <CategoryBlock 
                title="Esenciales" 
                imageUrl="/categorias/esenciales.jpg" 
                linkUrl="/colecciones/esenciales" 
                aspectRatio="aspect-[4/5] md:aspect-[3/4]" 
              />
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN: Grid de Productos Destacados */}
        <section className="max-w-[1400px] mx-auto px-6 mb-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {productosEsenciales.map((item: any) => {
                const imagenPrincipal = item.URL_Imagen ? item.URL_Imagen.split(",")[0] : null;
                const precioVenta = Number(item.Precio_Venta);
                const precioTachado = precioVenta * 1.25;

                return (
                  <div key={item.HandleFinal} className="group flex flex-col gap-3">
                    <Link href={`/producto/${item.HandleFinal}`} className="relative w-full aspect-square bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                      {imagenPrincipal && (
                        <Image 
                          src={imagenPrincipal} 
                          alt={item.Producto} 
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      )}
                    </Link>
                    
                    <div className="flex flex-col gap-1 px-1">
                      <Link href={`/producto/${item.HandleFinal}`}>
                        <h4 className="font-sans text-sm text-[#1A1A1A] line-clamp-2 hover:underline decoration-gray-300 underline-offset-4">
                          {item.Producto}
                        </h4>
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400 text-sm line-through">
                          ${precioTachado.toLocaleString('es-CO')}
                        </span>
                        <span className="text-gray-800 text-sm font-medium">
                          ${precioVenta.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full mt-1 [&>button]:w-full [&>button]:py-2.5 [&>button]:border [&>button]:border-gray-300 [&>button]:rounded [&>button]:text-sm [&>button]:text-[#1a1a1a] hover:[&>button]:border-[#1a1a1a] hover:[&>button]:bg-gray-50 [&>button]:transition-all">
                        <BotonAnadir id={item.Codigo} nombre={item.Producto} precio={item.Precio_Venta} imagen={imagenPrincipal} />
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

        {/* 5. SECCIÓN: Sweet Body */}
        <section className="max-w-[1400px] mx-auto px-6 mb-24">
          <div className="mb-8">
            <h3 className="text-3xl font-serif text-[#1A1A1A]">Sweet Body</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryBlock 
              title="Fragancias" 
              cursiveOverlay="Perfumes & Splash" 
              imageUrl="/categorias/fragancias.jpg" 
              linkUrl="/colecciones/fragancias" 
              aspectRatio="aspect-[4/5] md:aspect-square" 
            />
            <CategoryBlock 
              title="Corporal" 
              cursiveOverlay="Cuidado corporal" 
              imageUrl="/categorias/corporal.jpg" 
              linkUrl="/colecciones/corporal" 
              aspectRatio="aspect-[4/5] md:aspect-square" 
            />
          </div>
        </section>

        {/* 6. SECCIÓN: Atenea Cosmetics (Moviendo esta sección justo DESPUÉS de Sweet Body) */}
        <section className="max-w-[1400px] mx-auto px-6 mb-24">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="text-3xl font-serif text-[#1A1A1A]">Atenea Cosmetics</h3>
            <Link href="/colecciones/atenea" className="text-sm text-[#B58B99] hover:underline flex items-center gap-1.5 font-medium uppercase tracking-wider">
              Ver Colección Completa <span className="text-lg">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {productosAtenea.map((item: any) => {
              const imagenPrincipal = item.URL_Imagen ? item.URL_Imagen.split(",")[0] : null;
              const precioVenta = Number(item.Precio_Venta);
              
              return (
                <div key={item.HandleFinal} className="group flex flex-col gap-3">
                  <Link href={`/producto/${item.HandleFinal}`} className="relative w-full aspect-square bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                    {imagenPrincipal && (
                      <Image 
                        src={imagenPrincipal} 
                        alt={item.Producto} 
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    )}
                  </Link>
                  
                  <div className="flex flex-col gap-1 px-1">
                    <Link href={`/producto/${item.HandleFinal}`}>
                      <h4 className="font-sans text-sm text-[#1A1A1A] line-clamp-2 hover:underline decoration-gray-300 underline-offset-4">
                        {item.Producto}
                      </h4>
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-800 text-sm font-medium">
                        ${precioVenta.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full mt-1 [&>button]:w-full [&>button]:py-2.5 [&>button]:border [&>button]:border-gray-300 [&>button]:rounded [&>button]:text-sm [&>button]:text-[#1a1a1a] hover:[&>button]:border-[#1a1a1a] hover:[&>button]:bg-gray-50 [&>button]:transition-all">
                      <BotonAnadir id={item.Codigo} nombre={item.Producto} precio={item.Precio_Venta} imagen={imagenPrincipal} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. SECCIÓN: Complementos */}
        <section className="max-w-[1400px] mx-auto px-6 mb-24">
          <div className="mb-8">
            <h3 className="text-3xl font-serif text-[#1A1A1A]">Complementos</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryBlock 
              title="Bolsos" 
              cursiveOverlay="Bolsos & Mochilas" 
              imageUrl="/categorias/bolsos.jpg" 
              linkUrl="/colecciones/bolsos" 
              aspectRatio="aspect-[4/5] md:aspect-[16/10]" 
            />
            <CategoryBlock 
              title="Carteras" 
              cursiveOverlay="Carteras & Bandoleras" 
              imageUrl="/categorias/carteras.jpg" 
              linkUrl="/colecciones/carteras" 
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