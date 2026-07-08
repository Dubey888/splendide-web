import Image from "next/image";
import Link from "next/link";
import BotonAnadir from "@/components/BotonAnadir";
import CarruselBanner from "@/components/CarruselBanner";
import CarruselMarcas from "@/components/CarruselMarcas";
import ShowcaseInteractivo from "@/components/ShowcaseInteractivo";

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

  const productosAgrupados = Object.values(
    productosConImagen.reduce((acc: any, item) => {
      const handleFinal = (item.Handle && item.Handle.trim() !== "") ? item.Handle : generarHandle(item.Producto);
      if (!acc[handleFinal]) acc[handleFinal] = { ...item, HandleFinal: handleFinal, Variantes: [] };
      acc[handleFinal].Variantes.push(item);
      return acc;
    }, {})
  );
  
  const productosEsenciales = productosAgrupados.slice(0, 4);

  // Lista de categorías para llenar la página
  const categoriasDestacadas = [
    { title: "Skincare", url: "/categorias/skincare.jpg", link: "/colecciones/skincare" },
    { title: "Esenciales", url: "/categorias/esenciales.jpg", link: "/colecciones/esenciales" },
    { title: "Carteras", url: "/categorias/carteras.jpg", link: "/colecciones/carteras" },
    { title: "Termos", url: "/categorias/termos.jpg", link: "/colecciones/termos" },
    { title: "Fragancias", url: "/categorias/fragancias.jpg", link: "/colecciones/fragancias" },
    { title: "Corporal", url: "/categorias/corporal.jpg", link: "/colecciones/corporal" }
  ];

  return (
    <div className="min-h-screen bg-[#FCF6F6] text-[#1A1A1A]">
      {/* Header Promo */}
      <div className="w-full bg-[#E5B5C4] text-white text-center py-2 text-xs tracking-[0.2em] uppercase font-light">
        Bienvenida a Splendide
      </div>

      <CarruselBanner />

      <main className="w-full">
        {/* Frase Inspiracional */}
        <div className="text-center py-20 px-6">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] italic font-normal tracking-tight">
              "Tu espacio favorito para brillar"
            </h2>
        </div>

        {/* Sección Marcas */}
        <section className="bg-[#DFB2C0]/10 w-full py-16">
          <div className="max-w-[1400px] mx-auto px-6">
            <CarruselMarcas marcas={colecciones} />
          </div>
        </section>

        {/* Sección Interactiva (El toque premium) */}
        <ShowcaseInteractivo />

        {/* Bloque Categorías Ampliado */}
        <section className="max-w-[1400px] mx-auto px-6 py-20">
          <h3 className="text-3xl font-serif text-[#1A1A1A] mb-12">Explora nuestras colecciones</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categoriasDestacadas.map((cat) => (
                <div key={cat.title} className="group flex flex-col">
                    <Link href={cat.link} className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-sm block">
                        <Image src={cat.url} alt={cat.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/10 transition-colors duration-500"></div>
                        <div className="absolute bottom-6 left-6 text-white font-serif text-2xl drop-shadow-md">
                            {cat.title}
                        </div>
                    </Link>
                </div>
            ))}
          </div>
        </section>

        {/* Productos Esenciales */}
        <section className="max-w-[1400px] mx-auto px-6 mb-24">
            <h3 className="text-3xl font-serif text-[#1A1A1A] italic mb-12">Nuevos Ingresos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {productosEsenciales.map((item: any) => {
                const imagenPrincipal = item.URL_Imagen ? item.URL_Imagen.split(",")[0] : null;
                return (
                  <div key={item.HandleFinal} className="group flex flex-col">
                    <Link href={`/producto/${item.HandleFinal}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-white mb-4">
                      {imagenPrincipal && (
                        <img src={imagenPrincipal} alt={item.Producto} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                    </Link>
                    <h4 className="font-sans text-sm text-[#1A1A1A] mb-1">{item.Producto}</h4>
                    <p className="font-serif text-lg text-[#1A1A1A] mb-4">${Number(item.Precio_Venta).toLocaleString('es-CO')}</p>
                    
                    <div className="mt-auto">
                        <BotonAnadir id={item.Codigo} nombre={item.Producto} precio={item.Precio_Venta} imagen={imagenPrincipal} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-20 mt-10">
        <div className="max-w-[1200px] mx-auto px-6 text-center text-[#707070]">
          <h3 className="text-3xl font-serif text-[#DFB2C0] mb-6">Splendide</h3>
          <p className="max-w-md mx-auto mb-8 leading-relaxed font-light">Calidad profesional para resaltar tu belleza única. Encuentra tus favoritos hoy.</p>
          <p className="text-xs uppercase tracking-widest">©️ 2026 Splendide Co.</p>
        </div>
      </footer>
    </div>
  );
}