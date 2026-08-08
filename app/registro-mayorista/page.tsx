"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegistroMayorista() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
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
    setMensaje({ texto: '', tipo: '' });

    try {
      const url = "https://api.splendide.com.co/index.php?accion=registrar_mayorista";
      const respuesta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await respuesta.json();

      if (data.status === "success") {
        setMensaje({ texto: "¡Registro exitoso! Redirigiendo...", tipo: 'success' });
        setTimeout(() => router.push('/login'), 2000);
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
          <h2 className="mt-6 text-3xl font-serif text-gray-900">Registro Mayorista</h2>
        </div>
        
        {mensaje.texto && (
          <div className={`p-3 rounded text-sm text-center ${mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje.texto}
          </div>
        )}
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input name="nombre" type="text" required placeholder="Nombre" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
            <input name="apellidos" type="text" required placeholder="Apellidos" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
          </div>
          <input name="telefono" type="tel" required placeholder="Teléfono" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
          <input name="email" type="email" required placeholder="Correo electrónico" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />
          <input name="password" type="password" required placeholder="Contraseña" onChange={handleChange} className="w-full border p-3 rounded text-sm outline-none focus:ring-1 focus:ring-black" />

          <button type="submit" disabled={loading} className="w-full bg-black text-white p-3 rounded text-sm font-medium hover:bg-gray-800 transition">
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>

          {/* NUEVO: Enlace para iniciar sesión */}
          <div className="pt-4 text-center">
            <p className="text-[#707070] text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-[#955F71] hover:text-[#D7A1A4] font-medium transition-colors underline-offset-2 hover:underline">
                Iniciar sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}