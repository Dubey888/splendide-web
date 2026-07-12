"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegistroMayorista() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Eliminamos nombre_negocio del estado inicial
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', telefono: '', 
    email: '', password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=registrar_mayorista";
      const respuesta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await respuesta.json();

      if (data.status === "success") {
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        router.push('/login');
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      alert("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-serif text-gray-900">Registro Mayorista</h2>
          <p className="mt-2 text-sm text-gray-600">Únete a Splendide y obtén precios especiales</p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input name="nombre" type="text" required placeholder="Nombre" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
            <input name="apellidos" type="text" required placeholder="Apellidos" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
          </div>
          <input name="telefono" type="tel" required placeholder="Teléfono" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
          <input name="email" type="email" required placeholder="Correo electrónico" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
          <input name="password" type="password" required placeholder="Contraseña" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />

          <button type="submit" disabled={loading} className="w-full bg-black text-white p-3 rounded text-sm font-medium hover:bg-gray-800 transition">
            {loading ? 'Registrando...' : 'Solicitar cuenta'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link href="/login" className="font-medium text-black hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}