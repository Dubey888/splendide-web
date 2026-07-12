"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=obtener_pedidos")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setPedidos(data.data);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Pedidos</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Cliente</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p: any) => (
            <tr key={p.id}>
              <td className="border p-2">{p.nombre} {p.apellidos}</td>
              <td className="border p-2">${p.total_pagar}</td>
              <td className="border p-2">{p.estado_pago}</td>
              <td className="border p-2">{p.fecha_pedido}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}