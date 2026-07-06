"use client";

import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* CAPA OSCURA DE FONDO */}
      <div 
        onClick={toggleCart} 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* CONTENEDOR DEL MENÚ LATERAL */}
      <div className="relative w-full max-w-[400px] h-full bg-[#FAF4F4] shadow-2xl flex flex-col z-10 animate-fade-in-right">
        
        {/* CABECERA ESTILO MINIMALISTA */}
        <div className="p-6 border-b border-[#D7A1A4]/30 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#1A1A1A]">Tu carrito</h2>
          <button 
            onClick={toggleCart}
            className="text-gray-400 hover:text-black transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="font-sans text-sm tracking-wide">Tu carrito está vacío</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-2 border-b border-gray-100 last:border-0 relative">
                {/* Imagen */}
                <div className="w-20 h-24 bg-[#FAF4F4] rounded flex-none overflow-hidden">
                  <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                </div>
                
                {/* Detalles y Controles */}
                <div className="flex flex-col flex-1 justify-between py-1">
                  
                  {/* Título y Precio */}
                  <div className="flex justify-between gap-2">
                    <h4 className="font-sans font-medium text-sm text-[#1A1A1A] line-clamp-2 leading-tight pr-4">
                      {item.nombre}
                    </h4>
                    <p className="font-sans font-semibold text-sm text-[#1A1A1A] whitespace-nowrap">
                      ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                    </p>
                  </div>

                  {/* Controles estilo Shopify (Botones + - y Papelera) */}
                  <div className="flex items-center gap-4 mt-3">
                    {/* Selector de cantidad */}
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                        disabled={item.cantidad <= 1}
                      >
                        −
                      </button>
                      
                      {/* INPUT PARA ESCRIBIR LA CANTIDAD */}
                      <input 
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val > 0) {
                            updateQuantity(item.id, val);
                          }
                        }}
                        className="w-10 px-1 py-1 text-xs font-medium font-sans text-center bg-transparent focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none m-0"
                        style={{ MozAppearance: 'textfield' }}
                      />

                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Ícono de Papelera */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Eliminar producto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* PIE DEL MENÚ */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-gray-600">Total estimado</span>
              <span className="font-sans font-bold text-xl text-[#1A1A1A]">
                ${cartTotal.toLocaleString('es-CO')}
              </span>
            </div>
            
            <button 
              onClick={() => alert("¡Próximamente conectaremos con WhatsApp!")}
              className="w-full bg-[#1A1A1A] text-white font-sans uppercase tracking-widest text-[11px] h-12 flex items-center justify-center transition-colors duration-300 hover:bg-[#D7A1A4] font-medium cursor-pointer rounded-full"
            >
              Iniciar Pedido
            </button>
          </div>
        )}

      </div>

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