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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  
  const router = useRouter();
  const busquedasSugeridas = ["Labial", "Rubor", "Rímel", "Iluminador", "Gloss", "Paleta"];

  // Bloquear scroll cuando el buscador o el menú móvil estén abiertos
  useEffect(() => {
    if (isSearchOpen || isMenuOpen) {
      document.body.style.overflow = "hidden";
      if (isSearchOpen) cargarCatalogo();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isSearchOpen, isMenuOpen]);

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

  const menuLinks = [
    { name: "Inicio", href: "/" },
    { name: "Productos más vendidos", href: "/colecciones/mas-vendidos" },
    { name: "Colecciones", href: "/colecciones" },
    { name: "Catálogo", href: "/colecciones/all" },
    { name: "Registro Mayorista", href: "/mayoristas" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF4F4]">
      
      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="relative z-40 w-full border-b border-[#D7A1A4]/30 h-20">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20 h-full flex items-center justify-between">
          
          {/* LADO IZQUIERDO: Menú y Lupa (Lupa solo visible en PC aquí) */}
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors p-1"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors hidden md:block cursor-pointer p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>

          {/* CENTRO: Logo (Cambiado a fuente Serif, cursiva y color específico) */}
          <Link href="/" className="text-3xl md:text-4xl font-serif italic tracking-wide text-center flex-[2] md:flex-1 text-[#955F71]">
            Splendide
          </Link>

          {/* LADO DERECHO: Lupa (solo móvil), Usuario (solo PC) y Carrito */}
          <div className="flex items-center justify-end gap-3 md:gap-4 flex-1">
            
            {/* LUPA VERSIÓN MÓVIL */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors md:hidden cursor-pointer p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Ícono de Usuario (Solo visible en PC) */}
            <Link href="/login" className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors hidden md:block p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            <button 
              onClick={toggleCart} 
              className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors relative cursor-pointer p-1 mr-2 md:mr-0"
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

      {/* MENÚ MÓVIL (PANEL LATERAL TIPO DRAWER) */}
      {isMenuOpen && (
        <>
          {/* Backdrop (Fondo oscuro semitransparente) */}
          <div 
            className="fixed inset-0 bg-[#1A1A1A]/50 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menú Lateral */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-[360px] bg-[#FAF4F4] z-[70] flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            
            {/* Cabecera del Menú */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-[#D7A1A4]/30">
              <span className="text-xl font-serif tracking-widest uppercase text-[#1A1A1A]">
                Menú
              </span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-[#707070] hover:text-[#1A1A1A] p-2 transition-colors rounded-full hover:bg-white"
              >
                <svg className="w-7 h-7 font-light" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Enlaces de Navegación */}
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="flex flex-col">
                {menuLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-6 py-4 text-base font-medium text-[#1A1A1A] border-l-2 border-transparent hover:border-[#D7A1A4] hover:bg-white transition-all"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pie del Menú (Usuario y Redes Sociales) */}
            <div className="px-6 py-8 bg-[#FAF4F4] border-t border-[#D7A1A4]/30">
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-white border border-[#D7A1A4] text-[#1A1A1A] font-medium rounded-sm hover:bg-[#D7A1A4] hover:text-white transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Iniciar sesión
              </Link>
              
              <div className="flex items-center justify-center gap-6">
                {/* Instagram */}
                <a href="https://www.instagram.com/splendide.co?igsh=NXJsbWN4bXpyaXB5" target="_blank" rel="noreferrer" className="text-[#707070] hover:text-[#D7A1A4] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a href="https://www.tiktok.com/@splendide.co?_r=1&_t=ZS-97qMsNilZyM" target="_blank" rel="noreferrer" className="text-[#707070] hover:text-[#D7A1A4] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DROPDOWN DE BÚSQUEDA Y BACKDROP */}
      {isSearchOpen && (
        <>
          <div 
            className="fixed inset-0 top-20 bg-[#1A1A1A]/40 backdrop-blur-[2px] z-40 transition-opacity"
            onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
          />
          <div className="absolute top-20 left-0 w-full bg-[#FAF4F4] z-50 shadow-2xl border-b border-[#D7A1A4]/30 rounded-b-xl animate-in slide-in-from-top-4 fade-in duration-200">
            <div className="max-w-[900px] mx-auto px-6 py-8">
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
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="px-3 text-[#707070] hover:text-[#1A1A1A] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                  <button type="submit" className="px-4 text-[#707070] hover:text-[#D7A1A4] border-l border-[#D7A1A4]/20 transition-colors h-full flex items-center bg-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                  </button>
                </form>
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="text-[#707070] hover:text-[#1A1A1A] p-2 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto pr-2">
                {cargando && todosLosProductos.length === 0 && (
                  <p className="text-sm text-[#707070] animate-pulse pb-4">Conectando catálogo...</p>
                )}
                {!searchQuery && !cargando && (
                  <div className="animate-in fade-in duration-300 pb-4">
                    <h3 className="text-xs uppercase tracking-widest text-[#707070] mb-4 font-semibold">Búsquedas sugeridas</h3>
                    <div className="flex flex-wrap gap-2">
                      {busquedasSugeridas.map((termino) => (
                        <button key={termino} onClick={() => setSearchQuery(termino)} className="px-4 py-2 bg-white border border-[#D7A1A4]/30 rounded-full text-sm text-[#1A1A1A] hover:border-[#D7A1A4] hover:bg-[#FAF4F4] transition-all shadow-sm">
                          {termino}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchQuery && (
                  <div className="animate-in fade-in duration-200 pb-4">
                    <h3 className="text-xs uppercase tracking-widest text-[#707070] mb-6 font-semibold">
                      {productosFiltrados.length > 0 ? "Resultados de catálogo" : "Sin coincidencias"}
                    </h3>
                    {productosFiltrados.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {productosFiltrados.map((item) => {
                          const imagenes = item.URL_Imagen ? item.URL_Imagen.split(",") : [];
                          return (
                            <Link href={`/producto/${item.HandleFinal}`} key={item.HandleFinal} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-4 p-2 bg-white rounded-md border border-[#D7A1A4]/20 hover:border-[#D7A1A4]/60 transition-all group shadow-sm">
                              <div className="w-14 h-16 bg-[#FAF4F4] rounded-sm overflow-hidden flex-shrink-0 relative">
                                {imagenes[0] && <img src={imagenes[0]} alt={item.Producto} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-[#1A1A1A] truncate group-hover:text-[#D7A1A4] transition-colors">{item.Producto}</h4>
                                <p className="text-sm font-semibold text-[#1A1A1A] mt-1">${Number(item.Precio_Venta).toLocaleString('es-CO')}</p>
                              </div>
                            </Link>
                          );
                        })}
                        <button onClick={handleSearchSubmit} className="text-center w-full py-3 mt-4 text-xs uppercase tracking-widest text-[#1A1A1A] font-semibold bg-white border border-[#D7A1A4]/40 rounded-md hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm">
                          Ver todos los resultados para "{searchQuery}"
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-[#707070] italic">No se encontraron resultados para "{searchQuery}".</p>
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