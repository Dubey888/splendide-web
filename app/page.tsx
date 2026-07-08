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
  
  const productosEsenciales = productosAgrupados.slice(0, 5); 

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans">
      
      {/* 1. HERO BANNER INTERACTIVO */}
      <CarruselBanner />

      {/* AQUÍ ESTÁ EL CAMBIO: Quitamos los márgenes gigantes. Ahora se expande de lado a lado */}
      <main className="w-full mx-auto px-4 md:px-8 py-8">
        
        {/* 2. FRASE INSPIRACIONAL */}
        <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-serif text-[#1A1A1A] italic font-light tracking-wide">
              "Tu espacio favorito para brillar"
            </h2>
        </div>

        {/* 3. CARRUSEL DE MARCAS */}
        <section className="mb-16">
          <CarruselMarcas marcas={colecciones} />
          <div className="text-center mt-8">
            <Link href="/colecciones" className="bg-[#D7A1A4] text-white px-8 py-3 rounded-full text-sm hover:bg-[#c28d90] transition-colors">
              Ver todo
            </Link>
          </div>
        </section>

        {/* 4. BLOQUE CATEGORÍAS 1 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <Link href="/colecciones/skincare" className="group relative block aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-md">
            <Image src="/categorias/skincare.jpg" alt="Skincare" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10"></div>
            <h3 className="absolute bottom-6 left-6 text-white font-serif text-2xl flex items-center gap-2">
              Skincare <span className="text-sm">&rarr;</span>
            </h3>
          </Link>
          <Link href="/colecciones/esenciales" className="group relative block aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-md">
            <Image src="/categorias/esenciales.jpg" alt="Esenciales" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10"></div>
            <h3 className="absolute bottom-6 left-6 text-white font-serif text-2xl flex items-center gap-2">
              Esenciales <span className="text-sm">&rarr;</span>
            </h3>
          </Link>
        </section>

        {/* 5. PRODUCTOS ESENCIALES */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl md:text-2xl font-serif text-[#1A1A1A]">Esenciales</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {productosEsenciales.map((item: any) => {
              const imagenPrincipal = item.URL_Imagen ? item.URL_Imagen.split(",")[0] : null;
              const cantidadVariantes = item.Variantes.length;

              return (
                <div key={item.HandleFinal} className="group flex flex-col bg-white rounded-xl p-3 shadow-sm border border-gray-100 h-full justify-between">
                  <Link href={`/producto/${item.HandleFinal}`} className="cursor-pointer block">
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 relative">
                      {imagenPrincipal && (
                        <img src={imagenPrincipal} alt={item.Producto} className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500" />
                      )}
                    </div>
                    <h4 className="font-medium text-[#1A1A1A] text-sm line-clamp-2 h-10">{item.Producto}</h4>
                    <p className="text-[#1A1A1A] font-semibold mt-1 mb-3">
                      ${Number(item.Precio_Venta).toLocaleString('es-CO')}
                    </p>
                  </Link>
                  <div className="w-full">
                    {cantidadVariantes > 1 ? (
                      <Link href={`/producto/${item.HandleFinal}`} className="w-full border border-gray-300 text-gray-700 hover:border-[#D7A1A4] hover:text-[#D7A1A4] text-xs h-10 flex items-center justify-center rounded-full transition-all">
                        Seleccionar opciones
                      </Link>
                    ) : (
                      <div className="w-full [&>button]:w-full [&>button]:h-10 [&>button]:text-xs [&>button]:rounded-full [&>button]:border [&>button]:border-gray-300 [&>button]:bg-transparent [&>button]:text-gray-700 hover:[&>button]:border-[#D7A1A4] hover:[&>button]:text-[#D7A1A4] [&>button]:transition-all">
                        <BotonAnadir id={item.Codigo} nombre={item.Producto} precio={item.Precio_Venta} imagen={imagenPrincipal} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/all" className="bg-[#D7A1A4] text-white px-8 py-3 rounded-full text-sm hover:bg-[#c28d90] transition-colors">
              Ver todo
            </Link>
          </div>
        </section>

        {/* 6. BLOQUE CATEGORÍAS 2 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <Link href="/colecciones/perfumes" className="group relative block aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-md">
            <Image src="/categorias/perfumes.jpg" alt="Perfumes & Splash" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10"></div>
            <h3 className="absolute bottom-6 left-6 text-white font-serif text-2xl flex items-center gap-2">
              Fragancias <span className="text-sm">&rarr;</span>
            </h3>
          </Link>
          <Link href="/colecciones/corporal" className="group relative block aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-md">
            <Image src="/categorias/corporal.jpg" alt="Cuidado Corporal" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10"></div>
            <h3 className="absolute bottom-6 left-6 text-white font-serif text-2xl flex items-center gap-2">
              Corporal <span className="text-sm">&rarr;</span>
            </h3>
          </Link>
        </section>

      </main>
      
      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-16 mt-10">
        <div className="w-full mx-auto px-4 md:px-8 text-center text-sm text-[#707070]">
          <h3 className="text-2xl font-serif text-[#D7A1A4] mb-4">Splendide</h3>
          <p className="mb-6 max-w-md mx-auto">Desde la preparación hasta el diseño final. Encuentra herramientas, esmaltes y accesorios con calidad profesional.</p>
          <p>©️ 2026 Splendide Co.</p>
        </div>
      </footer>
    </div>
  );
}