import Image from 'next/image';
import Link from 'next/link';

// Definimos qué datos necesita recibir cada tarjeta
interface ProductCardProps {
  title: string;
  imageUrl: string;
  price: string;
  oldPrice?: string; // Opcional: solo si hay descuento
  productUrl: string;
}

export default function ProductCard({ title, imageUrl, price, oldPrice, productUrl }: ProductCardProps) {
  return (
    <div className="group flex flex-col gap-3">
      
      {/* Contenedor de la Imagen */}
      {/* Usamos aspect-square para que todas las fotos queden simétricas sin importar su tamaño original */}
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
        
        {/* Precios */}
        <div className="flex items-center gap-2 mt-1">
          {oldPrice && (
            <span className="text-gray-400 text-sm line-through">{oldPrice}</span>
          )}
          <span className="text-gray-800 text-sm">{price}</span>
        </div>
      </div>

      {/* Botón de Acción */}
      <button className="w-full py-2.5 px-4 mt-1 border border-gray-300 rounded text-sm text-[#1a1a1a] transition-all hover:border-gray-800 hover:bg-gray-50">
        Seleccionar opciones
      </button>
      
    </div>
  );
}