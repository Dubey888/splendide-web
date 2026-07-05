import Image from "next/image";

// Estructura de tus productos
interface Producto {
  Codigo: string;
  Producto: string;
  Categoria: string;
  Precio_Venta: number;
  Stock: number;
  URL_Imagen: string;
}

// Función para obtener productos
async function getProductos(): Promise<Producto[]> {
  // URL extraída de tu configuración en image_12.png
  const urlApi = "https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_catalogo_web";
  
  try {
    const res = await fetch(urlApi, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al conectar con el servidor');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

export default async function Home() {
  const productos = await getProductos();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Catálogo Splendide
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {productos.map((item) => (
          <div key={item.Codigo} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="h-48 relative mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
               {item.URL_Imagen ? (
                  <img src={item.URL_Imagen} alt={item.Producto} className="object-cover h-full w-full" />
               ) : (
                  <span className="text-gray-400">Sin imagen</span>
               )}
            </div>
            
            <h2 className="font-semibold text-gray-800 truncate">{item.Producto}</h2>
            <p className="text-blue-600 font-bold mt-2">
              ${Number(item.Precio_Venta).toLocaleString('es-CO')}
            </p>
            <p className="text-sm text-gray-500 mt-1">Stock: {item.Stock}</p>
          </div>
        ))}
      </div>
    </main>
  );
}