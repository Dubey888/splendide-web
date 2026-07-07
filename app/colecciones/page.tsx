import Link from 'next/link';
import Image from 'next/image';

// REGLA DE ORO: El 'id' debe ser EXACTAMENTE igual a como está en la columna Proveedor de tu base de datos.
const marcas = [
  { id: 'Atenea', nombre: 'Atenea', imagen: '/marcas/atenea.jpg' },
  { id: 'Bloomshell', nombre: 'Bloomshell', imagen: '/marcas/bloomshell.jpg' },
  { id: 'Bioaqua', nombre: 'Bioaqua', imagen: '/marcas/bioaqua.jpg' },
  { id: 'Salomé Makeup', nombre: 'Salomé Makeup', imagen: '/marcas/salome.jpg' } 
];

export default function ColeccionesPage() {
  return (
    <div className="min-h-screen bg-[#FAF4F4] text-[#1A1A1A] font-sans pb-20">
      
      {/* HEADER DE COLECCIONES */}
      <header className="relative w-full h-[250px] flex items-center justify-center overflow-hidden mb-12">
        <Image 
          src="/portada.jpeg" 
          alt="Colecciones Splendide"
          fill
          priority
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-[#1A1A1A]/50" />
        <div className="relative text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-serif drop-shadow-lg mb-2">Colecciones</h1>
          <p className="text-sm md:text-base uppercase tracking-[0.2em] opacity-90">
            Tu espacio favorito para brillar
          </p>
        </div>
      </header>

      <main className="w-full max-w-[1200px] mx-auto px-6 md:px-12">
        {/* CUADRÍCULA CORREGIDA: 2 en móviles (grid-cols-2), 4 en PC (md:grid-cols-4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {marcas.map((marca) => (
            <Link href={`/colecciones/${marca.id}`} key={marca.id} className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-md bg-white shadow-sm transition-transform duration-500 group-hover:-translate-y-2 border border-[#D7A1A4]/20">
                <div className="aspect-[4/5] relative bg-[#EAEAEA]">
                  <Image
                    src={marca.imagen}
                    alt={`Colección ${marca.nombre}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 md:p-6 bg-white flex justify-between items-center">
                  <h2 className="text-sm md:text-xl font-serif text-[#1A1A1A] truncate">
                    {marca.nombre}
                  </h2>
                  <span className="text-[#D7A1A4] text-lg md:text-xl transition-transform group-hover:translate-x-2 hidden md:block">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}