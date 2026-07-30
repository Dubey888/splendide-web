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

// --- NUEVA LÓGICA CON COOKIES PARA MAYORISTAS ---

export const obtenerTipoCliente = () => {
  // Verificamos que estemos en el navegador
  if (typeof document === 'undefined') return 'detal'; 
  
  // Leemos todas las cookies guardadas en el navegador
  const cookies = document.cookie.split('; ');
  
  // Buscamos específicamente la que creamos para el tipo de cliente
  const cookieMayorista = cookies.find(row => row.startsWith('tipo_cliente_splendide='));
  
  // Si la encuentra, devuelve su valor ('mayorista'). Si no, por defecto es 'detal'.
  return cookieMayorista ? cookieMayorista.split('=')[1] : 'detal';
};