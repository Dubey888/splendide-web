"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

interface Producto {
  Codigo: string;
  Producto: string;
  Categoria: string;
  Precio_Venta: number;
  Stock: number;
  URL_Imagen: string;
  Handle: string;
}

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  
  const router = useRouter();
  const busquedasSugeridas = ["Labial", "Rubor", "Rímel", "Iluminador", "Gloss", "Paleta"];

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      cargarCatalogo();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isSearchOpen]);

  const cargarCatalogo = async () => {
    if (todosLosProductos.length > 0) return;
    setCargando(true);
    try {
      const res = await fetch("https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_catalogo_web");
      const json = await res.json();
      if (json.data) {
        const validos = json.data.filter((item: Producto) => item.URL_Imagen && item.URL_Imagen.trim() !== "");
        setTodosLosProductos(validos);
      }
    } catch (error) {
      console.error("Error al sincronizar el motor de búsqueda:", error);
    } finally {
      setCargando(false);
    }
  };

  const generarHandle = (nombre: string) => {
    return nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setProductosFiltrados([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtrados = todosLosProductos.filter(item => 
      item.Producto.toLowerCase().includes(query) || 
      item.Categoria.toLowerCase().includes(query)
    );

    const agrupados = Object.values(
      filtrados.reduce((acc: any, item) => {
        const handleFinal = item.Handle && item.Handle.trim() !== "" ? item.Handle : generarHandle(item.Producto);
        if (!acc[handleFinal]) {
          acc[handleFinal] = { ...item, HandleFinal: handleFinal };
        }
        return acc;
      }, {})
    );

    setProductosFiltrados(agrupados.slice(0, 5));
  }, [searchQuery, todosLosProductos]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    // Se usa un header relative para contener la barra de navegación y el dropdown de búsqueda
    <header className="sticky top-0 z-50 w-full">
      
      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="relative z-50 w-full bg-[#FAF4F4] border-b border-[#D7A1A4]/30 h-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-4 flex-1">
            <button className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors hidden sm:block cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>

          <Link href="/" className="text-2xl md:text-3xl font-serif tracking-widest uppercase text-center flex-1 text-[#1A1A1A]">
            Splendide
          </Link>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <button className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors hidden sm:block">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>

            <button 
              onClick={toggleCart} 
              className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors relative cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* DROPDOWN DE BÚSQUEDA Y BACKDROP */}
      {isSearchOpen && (
        <>
          {/* Fondo oscuro semi-transparente que deja ver la tienda detrás */}
          <div 
            className="fixed inset-0 top-20 bg-[#1A1A1A]/40 backdrop-blur-[2px] z-40 transition-opacity"
            onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
          />

          {/* Panel Desplegable (Ocupa solo lo necesario) */}
          <div className="absolute top-20 left-0 w-full bg-[#FAF4F4] z-50 shadow-2xl border-b border-[#D7A1A4]/30 rounded-b-xl animate-in slide-in-from-top-4 fade-in duration-200">
            <div className="max-w-[900px] mx-auto px-6 py-8">
              
              {/* Barra de Búsqueda Idéntica a Shopify (Fondo blanco, borde sutil) */}
              <div className="flex items-center gap-4 mb-8">
                <form 
                  onSubmit={handleSearchSubmit} 
                  className="flex-1 flex items-center bg-white border border-[#D7A1A4]/40 rounded-sm overflow-hidden h-12 transition-all focus-within:border-[#D7A1A4] focus-within:ring-1 focus-within:ring-[#D7A1A4]/30 shadow-sm"
                >
                  <div className="pl-4 pr-2 text-[#707070]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Búsqueda..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-[#1A1A1A] text-base h-full w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  
                  {/* PRIMERA "X": Para limpiar el texto escrito */}
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery("")} 
                      className="px-3 text-[#707070] hover:text-[#1A1A1A] transition-colors"
                      title="Limpiar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Botón secundario de la lupa dentro del input */}
                  <button type="submit" className="px-4 text-[#707070] hover:text-[#D7A1A4] border-l border-[#D7A1A4]/20 transition-colors h-full flex items-center bg-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </button>
                </form>
                
                {/* SEGUNDA "X" EXTERIOR: Para cerrar todo el buscador */}
                <button 
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="text-[#707070] hover:text-[#1A1A1A] p-2 transition-colors"
                  aria-label="Cerrar buscador"
                  title="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenedor con límite de altura para scroll interno */}
              <div className="max-h-[50vh] overflow-y-auto pr-2">
                
                {cargando && todosLosProductos.length === 0 && (
                  <p className="text-sm text-[#707070] animate-pulse pb-4">Conectando catálogo...</p>
                )}

                {/* Sugerencias Rápidas */}
                {!searchQuery && !cargando && (
                  <div className="animate-in fade-in duration-300 pb-4">
                    <h3 className="text-xs uppercase tracking-widest text-[#707070] mb-4 font-semibold">Búsquedas sugeridas</h3>
                    <div className="flex flex-wrap gap-2">
                      {busquedasSugeridas.map((termino) => (
                        <button
                          key={termino}
                          onClick={() => setSearchQuery(termino)}
                          className="px-4 py-2 bg-white border border-[#D7A1A4]/30 rounded-full text-sm text-[#1A1A1A] hover:border-[#D7A1A4] hover:bg-[#FAF4F4] transition-all shadow-sm cursor-pointer"
                        >
                          {termino}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resultados en Vivo */}
                {searchQuery && (
                  <div className="animate-in fade-in duration-200 pb-4">
                    <h3 className="text-xs uppercase tracking-widest text-[#707070] mb-6 font-semibold">
                      {productosFiltrados.length > 0 ? "Resultados de catálogo" : "Sin coincidencias"}
                    </h3>
                    
                    {productosFiltrados.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {productosFiltrados.map((item) => {
                          const imagenes = item.URL_Imagen ? item.URL_Imagen.split(",") : [];
                          const imagenPrincipal = imagenes[0] || null;

                          return (
                            <Link
                              href={`/producto/${item.HandleFinal}`}
                              key={item.HandleFinal}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-4 p-2 bg-white rounded-md border border-[#D7A1A4]/20 hover:border-[#D7A1A4]/60 transition-all group shadow-sm"
                            >
                              <div className="w-14 h-16 bg-[#FAF4F4] rounded-sm overflow-hidden flex-shrink-0 relative">
                                {imagenPrincipal && (
                                  <img 
                                    src={imagenPrincipal} 
                                    alt={item.Producto} 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-[#1A1A1A] truncate group-hover:text-[#D7A1A4] transition-colors">
                                  {item.Producto}
                                </h4>
                                <p className="text-sm font-semibold text-[#1A1A1A] mt-1">
                                  ${Number(item.Precio_Venta).toLocaleString('es-CO')}
                                </p>
                              </div>
                            </Link>
                          );
                        })}

                        <button 
                          onClick={handleSearchSubmit}
                          className="text-center w-full py-3 mt-4 text-xs uppercase tracking-widest text-[#1A1A1A] font-semibold bg-white border border-[#D7A1A4]/40 rounded-md hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm cursor-pointer"
                        >
                          Ver todos los resultados para "{searchQuery}"
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-[#707070] italic">
                        No se encontraron resultados para "{searchQuery}".
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}