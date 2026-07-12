export const esAdmin = () => {
  // Verificamos que estemos en el navegador (Next.js requiere esto)
  if (typeof window === 'undefined') return false; 
  
  const userStr = localStorage.getItem('usuario_splendide');
  if (!userStr) return false; 
  
  try {
    const usuario = JSON.parse(userStr);
    return usuario.rol === 'admin';
  } catch (e) {
    return false;
  }
};

export const obtenerIdUsuario = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('usuario_splendide');
  if (!userStr) return null;
  
  try {
    const usuario = JSON.parse(userStr);
    return usuario.id;
  } catch (e) {
    return null;
  }
};