"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const url = "https://app-23c8f020-a783-451d-b1cf-b48a15a79604.cleverapps.io/index.php?accion=login";
      const respuesta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await respuesta.json();

      if (data.status === "success") {
        localStorage.setItem('usuario_splendide', JSON.stringify(data.usuario));
        window.location.href = '/'; 
      } else {
        setMensaje({ texto: data.mensaje, tipo: 'error' });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión. Inténtalo de nuevo.", tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-2xl text-gray-900">Iniciar sesión</h2>
        </div>
        
        {mensaje.texto && (
          <div className="p-3 rounded text-sm text-center bg-red-100 text-red-700">
            {mensaje.texto}
          </div>
        )}
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input name="email" type="email" required placeholder="Correo electrónico" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
          <input name="password" type="password" required placeholder="Contraseña" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />

          <button type="submit" disabled={loading} className="w-full bg-black text-white p-3 rounded text-sm font-medium hover:bg-gray-800 transition">
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}