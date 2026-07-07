export default async function MarcaPage({ params }: { params: { marca: string } }) {
  // 1. Extraemos el parámetro
  const marcaRaw = params.marca;
  
  // 2. VALIDACIÓN DE SEGURIDAD: Evita que busque la palabra literal "undefined"
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

  // 3. Si todo está bien, decodificamos y procedemos
  const marcaBuscada = decodeURIComponent(marcaRaw);
  const productos = await getProductosPorMarca(marcaBuscada);

  console.log(`Buscando marca: ${marcaBuscada}. Productos encontrados: ${productos.length}`);

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

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans pb-20">
      
      <header className="relative w-full h-[250px] flex items-center justify-center overflow-hidden mb-10">
        <div className="absolute inset-0 bg-[#D7A1A4]/20" />
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] capitalize">
            {marcaBuscada}
          </h1>
          <p className="text-sm mt-2 uppercase tracking-[0.2em] text-[#707070]">
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
              const imagenes = item.URL_Imagen ? item.URL_Imagen.split(",") : [];
              const imagenPrincipal = imagenes[0] || null;
              const cantidadVariantes = item.Variantes.length;

              return (
                <Link href={`/producto/${item.HandleFinal}`} key={item.HandleFinal} className="group cursor-pointer block">
                  <div className="aspect-[3/4] bg-white rounded-md overflow-hidden mb-4 relative shadow-sm border border-[#D7A1A4]/20">
                    {imagenPrincipal && (
                      <img src={imagenPrincipal} alt={item.Producto} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
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