import Image from 'next/image';
import Link from 'next/link';

interface CategoryBlockProps {
  title: string;
  imageUrl: string;
  linkUrl: string;
  cursiveOverlay?: string; // Opcional: Texto manuscrito/cursivo encima de la foto (ej: "Perfumes & Splash")
  aspectRatio?: string;     // Opcional: Para cambiar la proporción si se quiere más alto o cuadrado
}

export default function CategoryBlock({ 
  title, 
  imageUrl, 
  linkUrl, 
  cursiveOverlay, 
  aspectRatio = "aspect-[4/5]" 
}: CategoryBlockProps) {
  return (
    <Link href={linkUrl} className="group flex flex-col w-full">
      {/* Contenedor de la imagen */}
      <div className={`relative w-full ${aspectRatio} overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm`}>
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Capa de oscurecimiento suave para que resalte la tipografía cursiva blanca */}
        {cursiveOverlay && (
          <div className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/25" />
        )}

        {/* Texto cursivo flotante (Estilo Sweet Body) */}
        {cursiveOverlay && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <span className="text-white font-serif italic text-3xl md:text-4xl text-center drop-shadow-md tracking-wide">
              {cursiveOverlay}
            </span>
          </div>
        )}
      </div>

      {/* Franja de navegación inferior con flecha */}
      <div className="mt-4 flex items-center justify-between px-1 border-b border-transparent group-hover:border-gray-200 pb-2 transition-all">
        <h3 className="font-sans text-base md:text-lg font-medium text-[#1A1A1A] tracking-wide">
          {title}
        </h3>
        <span className="text-[#1A1A1A] text-lg transition-transform duration-300 group-hover:translate-x-1.5">
          →
        </span>
      </div>
    </Link>
  );
}