"use client";

import { useCart } from "@/context/CartContext";

interface BotonAnadirProps {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
}

export default function BotonAnadir({ id, nombre, precio, imagen }: BotonAnadirProps) {
  const { addToCart } = useCart();

  const manejarAnadir = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita comportamientos inesperados en las tarjetas
    addToCart({
      id,
      nombre,
      precio,
      imagen,
      cantidad: 1, // Quitamos 'shadow' de aquí para que TypeScript esté feliz
    });
  };

  return (
    <button
      onClick={manejarAnadir}
      className="w-full bg-[#1A1A1A] text-white font-sans uppercase tracking-widest text-[11px] h-11 flex items-center justify-center transition-colors duration-300 hover:bg-[#D7A1A4] font-medium cursor-pointer border border-transparent"
    >
      Añadir al Carrito
    </button>
  );
}