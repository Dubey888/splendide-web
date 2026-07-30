'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MayoristasPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Guardamos el estado usando Cookies. 
    // "path=/" es crucial para que Next.js pueda leerla en todas las páginas.
    // "max-age=604800" asegura que dure 7 días.
    document.cookie = "tipo_cliente_splendide=mayorista; path=/; max-age=604800";

    // 2. Redirigir inmediatamente a la página principal
    router.push('/');
  }, [router]);

  // 3. Pantalla de carga ultra rápida mientras redirige
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
      <p>Configurando catálogo mayorista...</p>
    </div>
  );
}