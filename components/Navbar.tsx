"use client";

import Link from "next/link";
// Importamos el hook del Cerebro para acceder a los datos del carrito
import { useCart } from "../context/CartContext";

export default function Navbar() {
  // Extraemos la cantidad de productos y la función para abrir la bolsa
  const { cartCount, toggleCart } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FAF4F4] border-b border-[#D7A1A4]/30">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
        
        {/* Izquierda: Menú Hamburguesa y Buscador */}
        <div className="flex items-center gap-4 flex-1">
          <button className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors">
            {/* Ícono de Menú */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          
          <button className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors hidden sm:block">
            {/* Ícono de Lupa (Buscador) */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>

        {/* Centro: Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-serif tracking-widest uppercase text-center flex-1 text-[#1A1A1A]">
          Splendide
        </Link>

        {/* Derecha: Usuario y Carrito */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <button className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors hidden sm:block">
            {/* Ícono de Usuario */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>

          {/* Botón de Bolsa (Carrito) - Ahora con evento onClick */}
          <button 
            onClick={toggleCart} 
            className="text-[#1A1A1A] hover:text-[#D7A1A4] transition-colors relative cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            
            {/* Burbuja contadora del carrito: solo se muestra si hay productos */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}