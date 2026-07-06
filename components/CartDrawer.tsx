"use client";

import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, cartTotal } = useCart();

  // Si el carrito está cerrado en el estado global, no renderizamos nada en pantalla
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* CAPA OSCURA DE FONDO (Hacer clic aquí también cierra el carrito) */}
      <div 
        onClick={toggleCart} 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* CONTENEDOR DEL MENÚ LATERAL (Se desliza desde la derecha) */}
      <div className="relative w-full max-w-md h-full bg-[#FAF4F4] shadow-2xl flex flex-col z-10 animate-fade-in-right">
        
        {/* CABECERA */}
        <div className="p-6 border-b border-[#D7A1A4]/20 flex items-center justify-between bg-white">
          <h2 className="font-serif text-xl uppercase tracking-wider text-[#1A1A1A]">Tu Bolsa de Compra</h2>
          <button 
            onClick={toggleCart}
            className="text-gray-500 hover:text-black transition-colors text-xl font-sans cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* LISTADO DE PRODUCTOS AGREGADOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <svg className="w-12 h-12 text-[#D7A1A4]/60 mb-3" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="font-sans text-sm tracking-wide">Tu carrito está vacío</p>
              <button 
                onClick={toggleCart} 
                className="mt-4 text-xs uppercase tracking-widest text-[#D7A1A4] font-medium underline"
              >
                Continuar viendo
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-md border border-[#D7A1A4]/10 shadow-xs relative">
                {/* Imagen Miniatura */}
                <div className="w-20 h-24 bg-[#FAF4F4] rounded overflow-hidden flex-none">
                  <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                </div>
                
                {/* Detalles Texto */}
                <div className="flex flex-col justify-between flex-1 pr-6">
                  <div>
                    <h4 className="font-sans font-medium text-xs text-[#1A1A1A] line-clamp-2">{item.nombre}</h4>
                    <p className="text-[11px] text-gray-500 mt-1">Cantidad: {item.cantidad}</p>
                  </div>
                  <p className="font-sans font-semibold text-xs text-[#1A1A1A]">
                    ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                  </p>
                </div>

                {/* Botón Eliminar Ítem */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-sm"
                  title="Eliminar producto"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* PIE DEL MENÚ (CÁLCULO TOTAL Y BOTÓN DE PAGO) */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-[#D7A1A4]/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-widest text-gray-500">Subtotal</span>
              <span className="font-sans font-bold text-lg text-[#1A1A1A]">${cartTotal.toLocaleString('es-CO')}</span>
            </div>
            
            <p className="text-[11px] text-gray-400 font-sans">
              Los costos de envío y descuentos se calculan al proceder con la compra por WhatsApp.
            </p>

            <button 
              onClick={() => alert("¡Próximamente! Aquí procesaremos tu pedido hacia WhatsApp.")}
              className="w-full bg-[#1A1A1A] text-white font-sans uppercase tracking-widest text-xs h-12 flex items-center justify-center transition-colors duration-300 hover:bg-[#D7A1A4] font-medium cursor-pointer"
            >
              Iniciar Pedido
            </button>
          </div>
        )}

      </div>

      {/* Pequeño estilo inline para la animación suave de entrada */}
      <style jsx global>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}