"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; // Asegúrate de que esta ruta coincide con tu proyecto

export default function CheckoutPage() {
  // Traemos los productos reales del contexto. 
  // Nota: Si en tu contexto el array se llama 'cartItems' en vez de 'cart', cámbialo aquí.
  const { cart } = useCart();
  
  // Calculamos el subtotal exacto
  const subtotalReal = cart.reduce((total: number, item: any) => total + (Number(item.precio) * item.cantidad), 0);
  
  // Aplicamos la regla de redondeo a 100 pesos para mantener consistencia con el sistema local
  const subtotal = Math.round(subtotalReal / 100) * 100;
  
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    direccion: '',
    detalles: '',
    ciudad: '',
    telefono: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const procesarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Armar la lista dinámica de productos para el mensaje
    const detalleProductos = cart.map((item: any) => {
      // Si manejas la variante en el carrito, la agregamos al texto
      const nombreVariante = item.variante ? ` (${item.variante})` : '';
      return `- ${item.cantidad}x ${item.nombre}${nombreVariante} - $${Number(item.precio).toLocaleString('es-CO')}`;
    }).join('%0A');

    const numeroTienda = "573000000000"; // Reemplaza con el número real de WhatsApp de Splendide
    
    const mensaje = `¡Hola Splendide! Quiero confirmar mi pedido web.%0A%0A` +
      `*Mi Pedido:*%0A${detalleProductos}%0A%0A` +
      `*Datos de envío:*%0A` +
      `Nombre: ${formData.nombre} ${formData.apellidos}%0A` +
      `Dirección: ${formData.direccion}, ${formData.ciudad}%0A` +
      `Detalles: ${formData.detalles || 'N/A'}%0A` +
      `Teléfono: ${formData.telefono}%0A%0A` +
      `*Total a pagar:* $${subtotal.toLocaleString('es-CO')}%0A%0A` +
      `Aquí adjunto mi comprobante de pago.`;

    window.open(`https://wa.me/${numeroTienda}?text=${mensaje}`, '_blank');
  };

  // Si el carrito está vacío, mostramos un mensaje para que vuelvan a la tienda
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] font-sans px-4">
        <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8 text-center">Parece que aún no has agregado productos a tu pedido.</p>
        <Link href="/" className="bg-[#1A1A1A] text-white px-8 py-3 rounded text-sm hover:bg-black transition-colors">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-[#F5F5F5] flex flex-col md:flex-row font-sans">
      
      {/* COLUMNA IZQUIERDA: Formulario de Datos (Envío) */}
      <div className="w-full md:w-[55%] bg-white p-6 md:p-12 lg:p-20 order-2 md:order-1 flex justify-end">
        <div className="w-full max-w-xl">
          
          <Link href="/" className="md:hidden text-2xl font-serif text-[#1A1A1A] block mb-6 text-center">
            Splendide
          </Link>

          <h2 className="text-xl font-medium mb-6 text-gray-900">Contacto</h2>
          <form onSubmit={procesarPedido} className="space-y-4">
            
            <input 
              type="email" name="email" required placeholder="Correo electrónico"
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-black outline-none transition" 
            />

            <h2 className="text-xl font-medium mt-10 mb-4 text-gray-900">Entrega</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" name="nombre" required placeholder="Nombre"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-black outline-none transition" 
              />
              <input 
                type="text" name="apellidos" required placeholder="Apellidos"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-black outline-none transition" 
              />
            </div>

            <input 
              type="text" name="direccion" required placeholder="Dirección"
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-black outline-none transition" 
            />
            
            <input 
              type="text" name="detalles" placeholder="Casa, apartamento, etc. (opcional)"
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-black outline-none transition" 
            />

            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" name="ciudad" required placeholder="Ciudad"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-black outline-none transition" 
              />
              <input 
                type="tel" name="telefono" required placeholder="Teléfono"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-black outline-none transition" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1A1A1A] text-white py-4 rounded text-sm font-medium tracking-wide hover:bg-black transition-colors mt-8"
            >
              Confirmar pedido y enviar comprobante
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Serás redirigida a WhatsApp para coordinar el pago.
            </p>
          </form>
        </div>
      </div>

      {/* COLUMNA DERECHA: Resumen del Pedido */}
      <div className="w-full md:w-[45%] bg-[#FAFAFA] border-l border-gray-200 p-6 md:p-12 lg:p-20 order-1 md:order-2 flex justify-start">
        <div className="w-full max-w-md">
          
          <Link href="/" className="hidden md:block text-3xl font-serif text-[#1A1A1A] mb-8">
            Splendide
          </Link>

          {/* Lista de productos conectada al CartContext */}
          <div className="flex flex-col gap-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
            {cart.map((item: any, index: number) => {
              // Asegurarnos de tener una imagen válida
              const imagenItem = item.imagen ? item.imagen.split(',')[0] : '/placeholder.jpg'; 
              
              return (
                <div key={`${item.id}-${index}`} className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white border border-gray-200 rounded-md overflow-hidden relative">
                      <Image 
                        src={imagenItem} 
                        alt={item.nombre} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full">
                      {item.cantidad}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{item.nombre}</span>
                    {item.variante && (
                      <span className="text-xs text-gray-500">{item.variante}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(Number(item.precio) * item.cantidad).toLocaleString('es-CO')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 py-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">${subtotalReal.toLocaleString('es-CO')}</span>
            </div>
            {/* Si el subtotal redondeado es diferente, mostramos el ajuste */}
            {subtotalReal !== subtotal && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ajuste de redondeo</span>
                <span className="font-medium text-gray-900">${(subtotal - subtotalReal).toLocaleString('es-CO')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Envío</span>
              <span className="text-xs">A coordinar por WhatsApp</span>
            </div>
          </div>

          <div className="border-t border-gray-200 py-4 flex justify-between items-center mt-2">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <div className="flex items-end gap-2">
              <span className="text-xs text-gray-500 mb-1">COP</span>
              <span className="text-2xl font-medium text-gray-900">${subtotal.toLocaleString('es-CO')}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}