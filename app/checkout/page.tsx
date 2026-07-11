"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; 

export default function CheckoutPage() {
  const { cartItems } = useCart();
  
  // Calculamos el subtotal exacto
  const subtotalReal = cartItems.reduce((total: number, item: any) => total + (Number(item.precio) * item.cantidad), 0);
  
  // Mantenemos la regla de redondeo a la centena (100 pesos)
  const subtotal = Math.round(subtotalReal / 100) * 100;
  
  // Estado para el método de entrega
  const [metodoEntrega, setMetodoEntrega] = useState<'envio' | 'retiro'>('envio');

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
    const detalleProductos = cartItems.map((item: any) => {
      const nombreVariante = item.variante ? ` (${item.variante})` : '';
      return `- ${item.cantidad}x ${item.nombre}${nombreVariante} - $${Number(item.precio).toLocaleString('es-CO')}`;
    }).join('%0A');

    const numeroTienda = "573224511590"; // Tu número real de WhatsApp
    
    // Configurar el texto de entrega basado en la selección
    const infoEntrega = metodoEntrega === 'envio' 
      ? `*Datos de envío:*%0A` +
        `Nombre: ${formData.nombre} ${formData.apellidos}%0A` +
        `Dirección: ${formData.direccion}, ${formData.ciudad}%0A` +
        `Detalles: ${formData.detalles || 'N/A'}%0A` +
        `Teléfono: ${formData.telefono}%0A%0A`
      : `*Método de entrega:* Retiro en Tienda%0A` +
        `Nombre de quien retira: ${formData.nombre} ${formData.apellidos}%0A` +
        `Teléfono: ${formData.telefono}%0A%0A`;

    const mensaje = `¡Hola Splendide! Quiero confirmar mi pedido web.%0A%0A` +
      `*Mi Pedido:*%0A${detalleProductos}%0A%0A` +
      infoEntrega +
      `*Método de pago:* Transferencia Bancolombia / Llave BRED%0A` +
      `*Total a pagar:* $${subtotal.toLocaleString('es-CO')}%0A%0A` +
      `Aquí adjunto mi comprobante de pago.`;

    window.open(`https://wa.me/${numeroTienda}?text=${mensaje}`, '_blank');
  };

  // Validación de carrito vacío
  if (!cartItems || cartItems.length === 0) {
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
    <div className="min-h-screen bg-white md:bg-white flex flex-col md:flex-row font-sans">
      
      {/* COLUMNA IZQUIERDA (Formulario) */}
      <div className="w-full md:w-[55%] bg-white p-6 md:p-12 lg:p-20 order-2 md:order-1 flex justify-end">
        <div className="w-full max-w-xl">
          
          <Link href="/" className="md:hidden text-3xl font-serif text-[#1A1A1A] block mb-8 text-center">
            Splendide
          </Link>

          <form onSubmit={procesarPedido}>
            
            {/* Contacto */}
            <h2 className="text-lg font-medium mb-4 text-gray-900">Contacto</h2>
            <input 
              type="email" name="email" required placeholder="Correo electrónico"
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition mb-8" 
            />

            {/* Selector de Entrega */}
            <h2 className="text-lg font-medium mb-4 text-gray-900">Entrega</h2>
            
            <div className="flex p-1 bg-gray-100 border border-gray-300 rounded-md mb-6">
              <button
                type="button"
                onClick={() => setMetodoEntrega('envio')}
                className={`flex-1 py-2 text-sm font-medium rounded flex items-center justify-center gap-2 transition-colors ${
                  metodoEntrega === 'envio' ? 'bg-white shadow-sm border border-gray-200 text-black' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envío
              </button>
              <button
                type="button"
                onClick={() => setMetodoEntrega('retiro')}
                className={`flex-1 py-2 text-sm font-medium rounded flex items-center justify-center gap-2 transition-colors ${
                  metodoEntrega === 'retiro' ? 'bg-white shadow-sm border border-gray-200 text-black' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Retiro
              </button>
            </div>

            {/* Campos del Formulario */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" name="nombre" required placeholder="Nombre"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                />
                <input 
                  type="text" name="apellidos" required placeholder="Apellidos"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                />
              </div>

              {metodoEntrega === 'envio' ? (
                <>
                  <input 
                    type="text" name="direccion" required placeholder="Dirección"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                  />
                  <input 
                    type="text" name="detalles" placeholder="Casa, apartamento, etc. (opcional)"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" name="ciudad" required placeholder="Ciudad"
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                    />
                    <input 
                      type="tel" name="telefono" required placeholder="Teléfono"
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                    />
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Splendide</p>
                      <p className="text-sm text-gray-600">Carrera 49 #51-04 Local 101 El Santuario, Antioquia</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">GRATIS</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Normalmente está listo en 24 horas
                  </p>
                  
                  {/* Teléfono requerido incluso para retiro para avisar al cliente */}
                  <input 
                    type="tel" name="telefono" required placeholder="Teléfono de contacto"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition mt-4" 
                  />
                </div>
              )}
            </div>

            {/* SECCIÓN DE PAGO (Centrado y con Llave BRED) */}
            <div className="mt-10">
              <h2 className="text-lg font-medium mb-1 text-gray-900">Pago</h2>
              <p className="text-sm text-gray-500 mb-4">Todas las transacciones son seguras y están encriptadas.</p>
              
              <div className="border border-gray-300 rounded-md bg-[#F4F4F4] p-8 flex flex-col items-center justify-center">
                {/* Icono de tarjeta centrado */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                
                <p className="text-sm text-gray-700 mb-4 text-center">Para procesar tu pedido, transfiere el total a nuestra cuenta o Llave BRE-B:</p>
                
                {/* Cuadro de datos centrado */}
                <div className="bg-white px-8 py-5 rounded border border-gray-200 inline-block text-center w-full max-w-sm shadow-sm">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Banco: <span className="font-medium text-black">Bancolombia</span></p>
                    <p className="text-sm text-gray-600 mb-1">Cuenta: <span className="font-medium text-black">Ahorros 325-065268-91</span></p>
                    <p className="text-sm text-gray-600">A nombre de: <span className="font-medium text-black">Dubey Arcila</span></p>
                  </div>
                  
                  {/* Línea divisoria */}
                  <div className="h-px w-full bg-gray-200 my-4"></div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Llave BRE-B: <span className="font-medium text-black">0091007756</span></p>
                    <p className="text-sm text-gray-600">A nombre de: <span className="font-medium text-black">Splendide</span></p>
                    <p className="text-xs text-gray-400 mt-1">(Aceptamos envíos desde otros bancos)</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-md text-sm font-medium tracking-wide hover:bg-black transition-colors mt-6 shadow-md"
            >
              Confirmar pedido y enviar comprobante
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Serás redirigida a WhatsApp para enviar el comprobante de pago.
            </p>
          </form>
        </div>
      </div>

      {/* COLUMNA DERECHA (Resumen) */}
      <div className="w-full md:w-[45%] bg-[#FAFAFA] md:border-l border-gray-200 p-6 md:p-12 lg:p-20 order-1 md:order-2 flex justify-start">
        <div className="w-full max-w-md">
          
          <Link href="/" className="hidden md:block text-3xl font-serif text-[#1A1A1A] mb-8">
            Splendide
          </Link>

          <div className="flex flex-col gap-4 mb-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
            {cartItems.map((item: any, index: number) => {
              const imagenItem = item.imagen ? item.imagen.split(',')[0] : ''; 
              
              return (
                <div key={`${item.id}-${index}`} className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white border border-gray-300 rounded-lg overflow-hidden relative flex items-center justify-center">
                      {/* Usamos <img> estándar con onError para evitar errores si la URL falla */}
                      <img 
                        src={imagenItem || 'https://via.placeholder.com/150?text=Sin+Imagen'} 
                        alt={item.nombre} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                        }}
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-gray-500 bg-opacity-90 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
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

          <div className="border-t border-gray-200 py-4 flex flex-col gap-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">${subtotalReal.toLocaleString('es-CO')}</span>
            </div>
            {subtotalReal !== subtotal && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ajuste de redondeo</span>
                <span className="font-medium text-gray-900">${(subtotal - subtotalReal).toLocaleString('es-CO')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Envío</span>
              {metodoEntrega === 'retiro' ? (
                <span className="text-sm font-medium text-gray-900">Gratis</span>
              ) : (
                <span className="text-xs">A coordinar por WhatsApp</span>
              )}
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