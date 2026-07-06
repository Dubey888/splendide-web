"use client";

import { useCart } from "../context/CartContext";

// Definimos qué datos del producto necesitamos recibir desde la página del servidor
interface BotonAnadirProps {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
}

export default function BotonAnadir({ id, nombre, precio, imagen }: BotonAnadirProps) {
  // Consumimos la función addToCart de nuestro cerebro global
  const { addToCart } = useCart();

  const manejarAnadir = () => {
    addToCart({
      id,
      nombre,
      precio,
      imagen,
      cantidad: 1, // Por defecto añadimos de a 1
    });
  };

  return (
    <button
      onClick={manejarAnadir}
      className="w-full bg-[#1A1A1A] text-white font-sans uppercase tracking-widest text-xs py-4 px-6 rounded-md hover:bg-[#D7A1A4] transition-colors duration-300 font-medium cursor-pointer shadow-sm"
    >
      Añadir al Carrito
    </button>
  );
}