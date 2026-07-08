"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const destacados = [
  { id: 1, title: "Maxglow Profesional", desc: "Diseñados para ofrecer un manejo sencillo, máxima durabilidad y un acabado espectacular.", img: "/pro1.jpg" },
  { id: 2, title: "Serum Vitalidad", desc: "Nutrición profunda para una piel radiante y llena de vida.", img: "/pro2.jpg" },
];

export default function ShowcaseInteractivo() {
  const [index, setIndex] = useState(0);

  return (
    <section className="py-16 bg-[#FDFBFB]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <div className="w-full aspect-[16/9] bg-gray-200 mb-8 rounded-2xl overflow-hidden shadow-xl">
              {/* Aquí iría la imagen */}
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-white flex items-center justify-center text-pink-300">Imagen {destacados[index].title}</div>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4 italic">{destacados[index].title}</h2>
            <p className="text-[#707070] max-w-lg mb-8 leading-relaxed">{destacados[index].desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Controles de paginación */}
        <div className="flex justify-center gap-4">
          {destacados.map((_, i) => (
            <button 
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${index === i ? 'bg-[#DFB2C0] w-8' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}