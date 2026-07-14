"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; 

// Lista de departamentos de Colombia para el select
const departamentosColombia = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá",
  "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba",
  "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca",
  "Vaupés", "Vichada"
];

// Lista de indicativos de América (Norte, Centro y Sur)
const codigosPais = [
  { code: '+57', country: 'CO (+57)' }, // Colombia por defecto
  { code: '+54', country: 'AR (+54)' }, // Argentina
  { code: '+591', country: 'BO (+591)' }, // Bolivia
  { code: '+55', country: 'BR (+55)' }, // Brasil
  { code: '+1', country: 'CA/US/PR (+1)' }, // Canadá, EE.UU., Puerto Rico
  { code: '+56', country: 'CL (+56)' }, // Chile
  { code: '+506', country: 'CR (+506)' }, // Costa Rica
  { code: '+53', country: 'CU (+53)' }, // Cuba
  { code: '+593', country: 'EC (+593)' }, // Ecuador
  { code: '+503', country: 'SV (+503)' }, // El Salvador
  { code: '+502', country: 'GT (+502)' }, // Guatemala
  { code: '+504', country: 'HN (+504)' }, // Honduras
  { code: '+52', country: 'MX (+52)' }, // México
  { code: '+505', country: 'NI (+505)' }, // Nicaragua
  { code: '+507', country: 'PA (+507)' }, // Panamá
  { code: '+595', country: 'PY (+595)' }, // Paraguay
  { code: '+51', country: 'PE (+51)' }, // Perú
  { code: '+1', country: 'DO (+1)' }, // Rep. Dominicana
  { code: '+598', country: 'UY (+598)' }, // Uruguay
  { code: '+58', country: 'VE (+58)' }, // Venezuela
];

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  
  const subtotalReal = cartItems.reduce((total: number, item: any) => total + (Number(item.precio) * item.cantidad), 0);
  const subtotal = Math.round(subtotalReal / 100) * 100;
  
  const [metodoEntrega, setMetodoEntrega] = useState<'envio' | 'retiro'>('envio');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para mostrar/ocultar el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    direccion: '',
    detalles: '',
    departamento: '',
    ciudad: '',
    codigoPais: '+57', 
    telefono: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Intercepta el envío del formulario para mostrar el modal primero
  const revisarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // Se ejecuta al confirmar desde el modal
  const procesarPedido = async () => {
    setIsSubmitting(true);
    
    const detalleProductos = cartItems.map((item: any) => {
      const nombreVariante = item.variante ? ` (${item.variante})` : '';
      return `- ${item.cantidad}x ${item.nombre}${nombreVariante} - $${Number(item.precio).toLocaleString('es-CO')}`;
    }).join('\n');

    const numeroTienda = "573224511590"; 
    
    const telefonoCompleto = `${formData.codigoPais} ${formData.telefono}`;
    const ciudadConDepartamento = formData.departamento 
      ? `${formData.ciudad}, ${formData.departamento}` 
      : formData.ciudad;
    
    const payload = {
      crear_cuenta: false,
      password: "", 
      email_contacto: formData.email, 
      nombre_entrega: formData.nombre,
      apellidos_entrega: formData.apellidos,
      telefono_contacto: telefonoCompleto,
      metodo_entrega: metodoEntrega,
      direccion: formData.direccion,
      detalles_direccion: formData.detalles,
      ciudad: ciudadConDepartamento,
      total_pagar: subtotal,
      detalle_productos: cartItems 
    };

    try {
      const apiURL = "https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=guardar_pedido";
      
      const respuesta = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const datosBD = await respuesta.json();

      if (datosBD.status === "success") {
        const infoEntrega = metodoEntrega === 'envio' 
          ? `*Datos de envío:*\n` +
            `Nombre: ${formData.nombre} ${formData.apellidos}\n` +
            `Dirección: ${formData.direccion}\n` +
            `Detalles: ${formData.detalles || 'N/A'}\n` +
            `Ciudad: ${ciudadConDepartamento}\n` +
            `Teléfono: ${telefonoCompleto}\n\n`
          : `*Método de entrega:* Retiro en Tienda\n` +
            `Nombre de quien retira: ${formData.nombre} ${formData.apellidos}\n` +
            `Teléfono: ${telefonoCompleto}\n\n`;

        const mensaje = `¡Hola Splendide! Quiero confirmar mi pedido web.\n\n` +
          `*Número de Pedido:* #${datosBD.pedido_id}\n` +
          `*Mi Pedido:*\n${detalleProductos}\n\n` +
          infoEntrega +
          `*Método de pago:* Transferencia Bancolombia / Llave BRED\n` +
          `*Total a pagar:* $${subtotal.toLocaleString('es-CO')}\n\n` +
          `Aquí adjunto mi comprobante de pago.`;

        const mensajeSeguro = encodeURIComponent(mensaje);
        clearCart();
        window.location.href = `https://wa.me/${numeroTienda}?text=${mensajeSeguro}`;
      } else {
        alert("Hubo un problema al registrar tu pedido: " + datosBD.mensaje);
        setShowConfirmModal(false); 
      }
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un error de conexión. Por favor, intenta de nuevo.");
      setShowConfirmModal(false); 
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-white md:bg-white flex flex-col md:flex-row font-sans relative">
      
      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4 transition-opacity">
          <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-md transform transition-all">
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-4 border-b pb-2">Confirma tus datos</h3>
            <p className="text-sm text-gray-600 mb-4">Por favor revisa que la información sea correcta antes de enviar tu pedido.</p>
            
            <div className="space-y-3 text-sm text-gray-800 mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
              <p><span className="font-medium text-gray-500 w-24 inline-block">Nombre:</span> {formData.nombre} {formData.apellidos}</p>
              <p><span className="font-medium text-gray-500 w-24 inline-block">Email:</span> {formData.email}</p>
              <p><span className="font-medium text-gray-500 w-24 inline-block">Teléfono:</span> {formData.codigoPais} {formData.telefono}</p>
              <p><span className="font-medium text-gray-500 w-24 inline-block">Método:</span> {metodoEntrega === 'envio' ? 'Envío a domicilio' : 'Retiro en tienda'}</p>
              
              {metodoEntrega === 'envio' && (
                <>
                  <p><span className="font-medium text-gray-500 w-24 inline-block">Dirección:</span> {formData.direccion} {formData.detalles && `(${formData.detalles})`}</p>
                  <p><span className="font-medium text-gray-500 w-24 inline-block">Ciudad:</span> {formData.ciudad}, {formData.departamento}</p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition"
              >
                Modificar datos
              </button>
              <button 
                type="button"
                onClick={procesarPedido}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 text-white rounded-md text-sm font-medium transition flex justify-center items-center ${
                  isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#1A1A1A] hover:bg-black'
                }`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Sí, todo está correcto'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COLUMNA IZQUIERDA (Formulario) */}
      <div className="w-full md:w-[55%] bg-white p-6 md:p-12 lg:p-20 order-2 md:order-1 flex justify-end">
        <div className="w-full max-w-xl">
          
          <Link href="/" className="md:hidden text-3xl font-serif text-[#1A1A1A] block mb-8 text-center">
            Splendide
          </Link>

          <form onSubmit={revisarPedido}>
            
            <h2 className="text-lg font-medium mb-4 text-gray-900">Contacto</h2>
            <input 
              type="email" name="email" required placeholder="Correo electrónico"
              value={formData.email} onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition mb-8" 
            />

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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" name="nombre" required placeholder="Nombre"
                  value={formData.nombre} onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                />
                <input 
                  type="text" name="apellidos" required placeholder="Apellidos"
                  value={formData.apellidos} onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                />
              </div>

              {metodoEntrega === 'envio' ? (
                <>
                  <input 
                    type="text" name="direccion" required placeholder="Dirección"
                    value={formData.direccion} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                  />
                  <input 
                    type="text" name="detalles" placeholder="Casa, apartamento, etc. (opcional)"
                    value={formData.detalles} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                  />
                  
                  {/* SELECCIÓN DE DEPARTAMENTO Y CIUDAD */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <select 
                        name="departamento" 
                        required 
                        value={formData.departamento}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition appearance-none bg-white text-gray-700"
                      >
                        <option value="" disabled>Departamento</option>
                        {departamentosColombia.map((dep) => (
                          <option key={dep} value={dep}>{dep}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>

                    <input 
                      type="text" name="ciudad" required placeholder="Ciudad / Municipio"
                      value={formData.ciudad} onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                    />
                  </div>
                  
                  {/* TELÉFONO CON INDICATIVO */}
                  <div className="flex gap-4">
                    <div className="w-[35%] relative">
                      <select 
                        name="codigoPais" 
                        value={formData.codigoPais}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition appearance-none bg-white text-gray-700"
                      >
                        {codigosPais.map((pais) => (
                          <option key={pais.country} value={pais.code}>{pais.country}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    
                    <input 
                      type="tel" name="telefono" required placeholder="Teléfono"
                      value={formData.telefono} onChange={handleInputChange}
                      className="w-[65%] border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
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
                  
                  {/* TELÉFONO CON INDICATIVO PARA RETIRO */}
                  <div className="flex gap-4 mt-4">
                    <div className="w-[35%] relative">
                      <select 
                        name="codigoPais" 
                        value={formData.codigoPais}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition appearance-none bg-white text-gray-700"
                      >
                        {codigosPais.map((pais) => (
                          <option key={pais.country} value={pais.code}>{pais.country}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    
                    <input 
                      type="tel" name="telefono" required placeholder="Teléfono de contacto"
                      value={formData.telefono} onChange={handleInputChange}
                      className="w-[65%] border border-gray-300 rounded-md shadow-sm p-3.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-medium mb-1 text-gray-900">Pago</h2>
              <p className="text-sm text-gray-500 mb-4">Todas las transacciones son seguras y están encriptadas.</p>
              
              <div className="border border-gray-300 rounded-md bg-[#F4F4F4] p-8 flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                
                <p className="text-sm text-gray-700 mb-4 text-center">Para procesar tu pedido, transfiere el total a nuestra cuenta o Llave BRE-B:</p>
                
                <div className="bg-white px-8 py-5 rounded border border-gray-200 inline-block text-center w-full max-w-sm shadow-sm">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Banco: <span className="font-medium text-black">Bancolombia</span></p>
                    <p className="text-sm text-gray-600 mb-1">Cuenta: <span className="font-medium text-black">Ahorros 325-065268-91</span></p>
                    <p className="text-sm text-gray-600">A nombre de: <span className="font-medium text-black">Dubey Arcila</span></p>
                  </div>
                  
                  <div className="h-px w-full bg-gray-200 my-4"></div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Llave BRE-B: <span className="font-medium text-black">0091007756</span></p>
                    <p className="text-sm text-gray-600">A nombre de: <span className="font-medium text-black">Splendide</span></p>
                    <p className="text-xs text-gray-400 mt-1">(Aceptamos envíos desde otros bancos)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN ACTUALIZADO */}
            <button 
              type="submit" 
              className={`w-full text-white py-4 rounded-md text-sm font-medium tracking-wide transition-colors mt-6 shadow-md bg-[#1A1A1A] hover:bg-black`}
            >
              Confirmar pedido y enviar comprobante
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Podrás revisar tus datos antes de ser redirigida a WhatsApp.
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