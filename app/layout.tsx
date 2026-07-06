import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

// Importamos nuestros nuevos componentes globales (Rutas corregidas a "componentes")
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton;

// Importamos el Cerebro (Provider) del carrito
import { CartProvider } from "../context/CartContext";

// Configuración de la fuente Sans-serif (para textos, precios y botones)
const sansFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

// Configuración de la fuente Serif (para títulos elegantes de marca y colecciones)
const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Splendide CO",
  description: "Catálogo Oficial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}>
      {/* Aplicamos la estructura flexible junto con el color de fondo y fuente base */}
      <body className="min-h-full flex flex-col bg-splendide-bg text-splendide-dark font-sans">
        
        {/* Envolvemos toda la app con el Provider del carrito */}
        <CartProvider>
          {/* Barra de navegación global */}
          <Navbar />

          {/* Contenido dinámico de las páginas */}
          {children}

          {/* Botón flotante de WhatsApp global */}
          <WhatsAppButton />
        </CartProvider>
        
      </body>
    </html>
  );
}