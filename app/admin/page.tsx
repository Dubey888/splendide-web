"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { esAdmin, obtenerIdUsuario } from '../utils/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // 1. Barrera de seguridad en el Frontend
    if (!esAdmin()) {
      router.push('/login'); // Lo pateamos al login si no es admin
      return;
    }
    
    setAutorizado(true);
    const userId = obtenerIdUsuario();

    // 2. Pedimos los datos al backend enviando nuestro ID
    fetch(`https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_pedidos&user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setPedidos(data.data);
        } else {
          alert("Error cargando pedidos: " + data.mensaje);
        }
      })
      .catch(err => console.error("Error de conexión:", err));
  }, [router]);

  // Pantalla de carga mientras verifica
  if (!autorizado) return <div className="p-8 text-center">Verificando seguridad...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 font-serif">Panel de Control Mayorista</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-medium mb-4">Últimos Pedidos</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-3 text-sm font-medium text-gray-600">ID</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Cliente</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Total</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No hay pedidos aún.</td>
              </tr>
            ) : (
              pedidos.map((p: any) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm">#{p.id}</td>
                  <td className="p-3 text-sm">{p.nombre} {p.apellidos}</td>
                  <td className="p-3 text-sm font-medium">${p.total_pagar}</td>
                  <td className="p-3 text-sm text-gray-500">{p.fecha_pedido}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}