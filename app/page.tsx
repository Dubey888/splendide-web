import Image from "next/image";
import Link from "next/link";
import BotonAnadir from "@/components/BotonAnadir";
import CarruselBanner from "@/components/CarruselBanner";
import CarruselMarcas from "@/components/CarruselMarcas";

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

  const productosConImagen = productos.filter(
    (item) => item.URL_Imagen && item.URL_Imagen.trim() !== ""
  );

  // LÓGICA DE COLECCIONES (MARCAS)
  const marcasMap = new Map();
  productosConImagen.forEach((p) => {
    const nombreMarca = p.Proveedor || p.Categoria; 
    if (nombreMarca && nombreMarca !== "undefined" && nombreMarca.trim() !== "") {
      if (!marcasMap.has(nombreMarca)) {
        marcasMap.set(nombreMarca, {
          nombre: nombreMarca,
          imagen: p.URL_Imagen.split(",")[0],
          url: `/colecciones/${encodeURIComponent(nombreMarca)}`
        });
      }
    }
  });
  const colecciones = Array.from(marcasMap.values());

  // LÓGICA DE PRODUCTOS (Agrupando variantes)
  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      const handleFinal = (item.Handle && item.Handle.trim() !== "") ? item.Handle : generarHandle(item.Producto);
      if (!acc[handleFinal]) acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  );
  
  const productosEsenciales = productosAgrupados.slice(0, 4); 

  return (
    <div className="min-h-screen bg-[#FCF6F6] text-[#1A1A1A] font-sans">
      
      {/* BARRA DE ANUNCIO SUPERIOR (Opcional, estilo Shopify) */}
      <div className="w-full bg-[#E5B5C4] text-white text-center py-2 text-xs md:text-sm tracking-widest font-light">
        Welcome to our store
      </div>

      {/* 1. HERO BANNER INTERACTIVO CON TEXTO FLOTANTE */}
      <CarruselBanner />

      <main className="w-full">
        
        {/* 2. FRASE INSPIRACIONAL */}
        <div className="text-center mt-12 mb-10 md:mt-16 md:mb-14 px-4">
            <h2 className="text-2xl md:text-4xl font-serif text-[#1A1A1A] italic font-light tracking-wide">
              "Tu espacio favorito para brillar"
            </h2>
        </div>

        {/* 3. CARRUSEL DE MARCAS (CON FONDO ROSADO DE LADO A LADO) */}
        <section className="bg-[#DFB2C0] w-full py-12 md:py-16 mb-16">
          <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
            <CarruselMarcas marcas={colecciones} />
            <div className="text-center mt-10">
              <Link href="/colecciones" className="inline-block bg-white text-[#DFB2C0] font-medium px-8 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors shadow-sm">
                Ver todo
              </Link>
            </div>
          </div>
        </section>

        {/* CONTENEDOR CENTRAL PARA CATEGORÍAS Y PRODUCTOS */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">

          {/* 4. BLOQUE CATEGORÍAS 1 (Igual a Shopify: Texto centrado en imagen y subtexto abajo) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mb-20">
            {/* Skincare */}
            <div className="group flex flex-col">
              <Link href="/colecciones/skincare" className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg shadow-sm block">
                <Image src="/categorias/skincare.jpg" alt="Skincare" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500"></div>
                <h3 className="absolute inset-0 flex items-center justify-center text-white font-serif text-4xl lg:text-5xl drop-shadow-md">
                  Skincare
                </h3>
              </Link>
              <Link href="/colecciones/skincare" className="flex items-center gap-2 mt-4 text-[#1A1A1A] px-2">
                <span className="font-light text-lg">Cuidado Facial</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
              </Link>
            </div>

            {/* Esenciales */}
            <div className="group flex flex-col">
              <Link href="/colecciones/esenciales" className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg shadow-sm block">
                <Image src="/categorias/esenciales.jpg" alt="Esenciales" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500"></div>
                <h3 className="absolute inset-0 flex items-center justify-center text-white font-serif text-4xl lg:text-5xl drop-shadow-md">
                  Esenciales
                </h3>
              </Link>
              <Link href="/colecciones/esenciales" className="flex items-center gap-2 mt-4 text-[#1A1A1A] px-2">
                <span className="font-light text-lg">Ver productos</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
              </Link>
            </div>
          </section>

          {/* 5. PRODUCTOS ESENCIALES (Tarjetas elegantes) */}
          <section className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] italic">Esenciales</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {productosEsenciales.map((item: any) => {
                const imagenPrincipal = item.URL_Imagen ? item.URL_Imagen.split(",")[0] : null;
                const cantidadVariantes = item.Variantes.length;

                return (
                  <div key={item.HandleFinal} className="group flex flex-col bg-white rounded-2xl p-0 shadow-sm hover:shadow-lg border border-transparent hover:border-[#DFB2C0]/40 transition-all duration-300 h-full overflow-hidden">
                    <Link href={`/producto/${item.HandleFinal}`} className="cursor-pointer block p-4 pb-0">
                      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 relative">
                        {imagenPrincipal && (
                          <img src={imagenPrincipal} alt={item.Producto} className="object-contain w-full h-full p-2 group-hover:scale-110 transition-transform duration-700" />
                        )}
                      </div>
                      <h4 className="font-medium text-[#1A1A1A] text-sm md:text-base line-clamp-2 h-10 md:h-12">{item.Producto}</h4>
                      <p className="text-[#1A1A1A] font-semibold mt-2 mb-4 text-lg">
                        ${Number(item.Precio_Venta).toLocaleString('es-CO')}
                      </p>
                    </Link>
                    <div className="w-full mt-auto p-4 pt-0">
                      {cantidadVariantes > 1 ? (
                        <Link href={`/producto/${item.HandleFinal}`} className="w-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#DFB2C0] hover:text-white hover:border-[#DFB2C0] text-sm h-11 flex items-center justify-center rounded-full transition-all font-medium">
                          Seleccionar opciones
                        </Link>
                      ) : (
                        <div className="w-full [&>button]:w-full [&>button]:h-11 [&>button]:text-sm [&>button]:rounded-full [&>button]:border [&>button]:border-gray-200 [&>button]:bg-gray-50 [&>button]:text-gray-700 hover:[&>button]:bg-[#DFB2C0] hover:[&>button]:text-white hover:[&>button]:border-[#DFB2C0] [&>button]:transition-all [&>button]:font-medium">
                          <BotonAnadir id={item.Codigo} nombre={item.Producto} precio={item.Precio_Venta} imagen={imagenPrincipal} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6. BLOQUE CATEGORÍAS 2 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mb-16">
            {/* Perfumes */}
            <div className="group flex flex-col">
              <Link href="/colecciones/perfumes" className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg shadow-sm block">
                <Image src="/categorias/perfumes.jpg" alt="Perfumes & Splash" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500"></div>
                <h3 className="absolute inset-0 flex items-center justify-center text-white font-serif text-4xl lg:text-5xl italic drop-shadow-md">
                  Perfumes & Splash
                </h3>
              </Link>
              <Link href="/colecciones/perfumes" className="flex items-center gap-2 mt-4 text-[#1A1A1A] px-2">
                <span className="font-light text-lg">Fragancias</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
              </Link>
            </div>

            {/* Corporal */}
            <div className="group flex flex-col">
              <Link href="/colecciones/corporal" className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg shadow-sm block">
                <Image src="/categorias/corporal.jpg" alt="Cuidado Corporal" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500"></div>
                <h3 className="absolute inset-0 flex items-center justify-center text-white font-serif text-4xl lg:text-5xl italic drop-shadow-md">
                  Cuidado Corporal
                </h3>
              </Link>
              <Link href="/colecciones/corporal" className="flex items-center gap-2 mt-4 text-[#1A1A1A] px-2">
                <span className="font-light text-lg">Corporal</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
              </Link>
            </div>
          </section>

        </div>
      </main>
      
      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-16 mt-10">
        <div className="max-w-[1800px] mx-auto px-6 text-center text-sm text-[#707070]">
          <h3 className="text-2xl font-serif text-[#DFB2C0] mb-4">Splendide</h3>
          <p className="mb-6 max-w-md mx-auto">Desde la preparación hasta el diseño final. Encuentra herramientas, esmaltes y accesorios con calidad profesional.</p>
          <p>©️ 2026 Splendide Co.</p>
        </div>
      </footer>
    </div>
  );
}