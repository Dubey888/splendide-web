"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { esAdmin, obtenerIdUsuario } from '../utils/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);
  const [detallesPedido, setDetallesPedido] = useState<any[]>([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);

  useEffect(() => {
    if (!esAdmin()) {
      router.push('/login');
      return;
    }
    setAutorizado(true);
    cargarPedidos();
  }, [router]);

  const cargarPedidos = () => {
    const userId = obtenerIdUsuario();
    fetch(`https://api.splendide.com.co/index.php?accion=obtener_pedidos&user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setPedidos(data.data);
        }
      })
      .catch(err => console.error("Error:", err));
  };

  const abrirDetalles = (pedido: any) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
    setCargandoDetalles(true);
    setDetallesPedido([]);

    // La petición limpia que recibe los datos procesados por tu backend en PHP
    fetch(`https://api.splendide.com.co/index.php?accion=obtener_detalles_pedido&pedido_id=${pedido.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setDetallesPedido(data.data);
        }
      })
      .catch(err => console.error("Error al obtener detalles:", err))
      .finally(() => setCargandoDetalles(false));
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!pedidoSeleccionado) return;

    try {
      const res = await fetch("https://api.splendide.com.co/index.php?accion=actualizar_estado_pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedido_id: pedidoSeleccionado.id,
          estado: nuevoEstado
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        if (nuevoEstado === 'Entregado') {
          setPedidos(pedidos.filter((p: any) => p.id !== pedidoSeleccionado.id));
          setModalAbierto(false);
        } else {
          setPedidoSeleccionado({ ...pedidoSeleccionado, estado_pago: nuevoEstado });
          setPedidos(pedidos.map(p => p.id === pedidoSeleccionado.id ? { ...p, estado_pago: nuevoEstado } : p));
        }
      } else {
        alert("Error al cambiar estado: " + data.mensaje);
      }
    } catch (error) {
      alert("Error de conexión al cambiar el estado.");
    }
  };

  const colorEstado = (estado: string) => {
    switch(estado?.toLowerCase()) {
      case 'pagado': return 'bg-green-100 text-green-800 border-green-200';
      case 'procesado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'enviado': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'entregado': return 'bg-gray-800 text-white border-gray-900';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!autorizado) return <div className="p-8 text-center">Verificando seguridad...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 font-serif">Panel de Control Mayorista</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <h2 className="text-xl font-medium mb-4">Gestión de Pedidos Activos</h2>
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-3 text-sm font-medium text-gray-600">ID</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Cliente (Entrega)</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Total</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Estado</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Fecha</th>
              <th className="text-center p-3 text-sm font-medium text-gray-600">Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">No hay pedidos activos.</td>
              </tr>
            ) : (
              pedidos.map((p: any) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm">#{p.id}</td>
                  <td className="p-3 text-sm font-medium">{p.nombre_entrega} {p.apellidos_entrega}</td>
                  <td className="p-3 text-sm font-semibold">${Number(p.total_pagar).toLocaleString('es-CO')}</td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${colorEstado(p.estado_pago)}`}>
                      {(p.estado_pago || 'Pendiente').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => abrirDetalles(p)}
                      className="text-xs font-medium text-[#955F71] border border-[#955F71] px-3 py-1.5 rounded hover:bg-[#955F71] hover:text-white transition-colors"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && pedidoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h3 className="text-xl font-serif font-bold text-gray-900">
                Pedido #{pedidoSeleccionado.id}
              </h3>
              <button onClick={() => setModalAbierto(false)} className="text-gray-500 hover:text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Nombre de entrega:</p>
                  <p className="font-medium text-gray-900">{pedidoSeleccionado.nombre_entrega} {pedidoSeleccionado.apellidos_entrega}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Contacto:</p>
                  <p className="font-medium text-gray-900">{pedidoSeleccionado.telefono_contacto}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Dirección:</p>
                  <p className="font-medium text-gray-900">{pedidoSeleccionado.direccion}, {pedidoSeleccionado.ciudad}</p>
                  <p className="text-gray-500 text-xs">{pedidoSeleccionado.detalles_direccion}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Método:</p>
                  <p className="font-medium text-gray-900 uppercase">{pedidoSeleccionado.metodo_entrega}</p>
                </div>
              </div>

              <h4 className="font-medium font-serif border-b pb-2 mb-3">Productos solicitados</h4>
              {cargandoDetalles ? (
                <p className="text-sm text-gray-500 text-center py-4">Cargando productos...</p>
              ) : (
                <ul className="space-y-3 mb-6">
                  {detallesPedido.map((item, idx) => (
                    <li key={idx} className="flex flex-col text-sm p-3 bg-gray-50 rounded border">
                      {/* Primera fila: ID y Detalles del unitario */}
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">ID: {item.producto_id}</span>
                        <span className="text-xs text-gray-500">
                          {item.cantidad}x ${(Number(item.precio_unitario)).toLocaleString('es-CO')}
                        </span>
                      </div>
                      
                      {/* Segunda fila: Renderizado del Producto y Variante mapeados desde PHP */}
                      <div className="flex justify-between items-start mt-1">
                        <span className="font-medium text-gray-900 pr-4">
                          {item.producto || item.nombre || 'Producto'} 
                          {item.variante && item.variante.trim() !== '' && item.variante !== 'undefined' ? ` - ${item.variante}` : ''}
                        </span>
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          ${(item.cantidad * item.precio_unitario).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-between items-center p-4 bg-[#FAF4F4] rounded border border-[#D7A1A4]/30 mt-2">
                <span className="font-medium text-gray-700">Total a pagar</span>
                <span className="text-xl font-bold text-[#955F71]">${Number(pedidoSeleccionado.total_pagar).toLocaleString('es-CO')}</span>
              </div>
            </div>

            <div className="p-5 border-t bg-white">
              <p className="text-sm font-bold text-gray-900 mb-3">Actualizar Estado</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                  onClick={() => cambiarEstado('Pendiente')}
                  className={`py-2.5 text-sm font-medium rounded transition-colors ${pedidoSeleccionado.estado_pago === 'Pendiente' || !pedidoSeleccionado.estado_pago ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  Pendiente
                </button>
                <button 
                  onClick={() => cambiarEstado('Pagado')}
                  className={`py-2.5 text-sm font-medium rounded transition-colors ${pedidoSeleccionado.estado_pago === 'Pagado' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Pagado
                </button>
                <button 
                  onClick={() => cambiarEstado('Procesado')}
                  className={`py-2.5 text-sm font-medium rounded transition-colors ${pedidoSeleccionado.estado_pago === 'Procesado' ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Procesado
                </button>
                <button 
                  onClick={() => cambiarEstado('Enviado')}
                  className={`py-2.5 text-sm font-medium rounded transition-colors ${pedidoSeleccionado.estado_pago === 'Enviado' ? 'bg-purple-200 text-purple-800' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                >
                  Enviado
                </button>
              </div>
              <button 
                onClick={() => cambiarEstado('Entregado')}
                className="w-full py-3 mt-2 text-sm font-bold rounded transition-colors bg-[#1A1C29] text-white hover:bg-black"
              >
                Finalizar (Entregado)
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}