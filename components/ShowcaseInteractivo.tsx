"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const destacados = [
  { id: 1, title: "Maxglow Profesional", desc: "Diseñados para un acabado impecable.", img: "/prod1.jpg" },
  { id: 2, title: "Serum Radiance", desc: "La esencia del brillo natural.", img: "/prod2.jpg" },
  { id: 3, title: "Kit Esencial", desc: "Todo lo que necesitas en un solo set.", img: "/prod3.jpg" },
];

export default function ShowcaseInteractivo() {
  const [activo, setActivo] = useState(destacados[0]);

  return (
    <section className="max-w-[1400px] mx-auto py-20 px-6 grid md:grid-cols-2 gap-12 items-center">
      {/* Lado de la Imagen con Transición */}
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activo.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image src={activo.img} alt={activo.title} fill className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lado de los Botones Interactivos */}
      <div className="space-y-8">
        <h2 className="font-serif text-5xl italic">Nuestros favoritos</h2>
        {destacados.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivo(item)}
            className={`w-full text-left p-6 rounded-2xl transition-all border ${activo.id === item.id ? 'bg-white border-[#DFB2C0] shadow-md' : 'border-transparent hover:bg-white/50'}`}
          >
            <h3 className="text-2xl font-serif">{item.title}</h3>
            <p className="font-sans text-gray-500">{item.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}