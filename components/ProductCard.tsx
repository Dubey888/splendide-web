"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Definimos qué datos necesita recibir cada tarjeta
interface ProductCardProps {
  title: string;
  imageUrl: string;
  price: string;
  oldPrice?: string; // Opcional: solo si hay descuento normal
  precioMayor?: string; // NUEVO: Precio especial para mayoristas
  productUrl: string;
}

export default function ProductCard({ title, imageUrl, price, oldPrice, precioMayor, productUrl }: ProductCardProps) {
  const [esMayorista, setEsMayorista] = useState(false);
  const [montado, setMontado] = useState(false);

  // Verificamos en el navegador si es un cliente mayorista
  useEffect(() => {
    setMontado(true);
    const userStr = localStorage.getItem('usuario_splendide');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.rol === 'mayorista') {
          setEsMayorista(true);
        }
      } catch (e) {
        console.error("Error leyendo usuario", e);
      }
    }
  }, []);

  // Lógica para decidir qué precio mostrar
  const precioMostrar = (esMayorista && precioMayor) ? precioMayor : price;
  const precioTachado = (esMayorista && precioMayor) ? price : oldPrice;

  return (
    <div className="group flex flex-col gap-3">
      
      {/* Contenedor de la Imagen */}
      <Link href={productUrl} className="relative w-full aspect-square bg-[#f9f9f9] rounded-lg overflow-hidden border border-gray-100">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </Link>

      {/* Información del Producto */}
      <div className="flex flex-col gap-1 px-1">
        <Link href={productUrl}>
          <h3 className="font-sans text-sm text-[#1a1a1a] line-clamp-2 hover:underline decoration-gray-300 underline-offset-4">
            {title}
          </h3>
        </Link>
        
        {/* Precios (Solo se renderiza cuando el componente está montado para evitar errores visuales) */}
        {montado && (
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {precioTachado && (
              <span className="text-gray-400 text-sm line-through">{precioTachado}</span>
            )}
            <span className="text-gray-800 text-sm font-semibold">{precioMostrar}</span>
            
            {/* Etiqueta visible solo para mayoristas */}
            {esMayorista && precioMayor && (
              <span className="bg-[#955F71]/10 text-[#955F71] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                Mayorista
              </span>
            )}
          </div>
        )}
      </div>

      {/* Botón de Acción */}
      <button className="w-full py-2.5 px-4 mt-1 border border-gray-300 rounded text-sm text-[#1a1a1a] transition-all hover:border-gray-800 hover:bg-gray-50">
        Seleccionar opciones
      </button>
      
    </div>
  );
}