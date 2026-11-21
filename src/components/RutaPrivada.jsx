import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/useAuth.js';

// Guardián de la interfaz. La autorización real de los datos la hace RLS.
export function RutaPrivada() {
  const { sesion } = useAuth();

  // Evita redirigir (o mostrar contenido privado) mientras se restaura la sesión.
  if (sesion === undefined) {
    return <p role="status">Comprobando sesión…</p>;
  }
  if (!sesion) return <Navigate to="/acceso" replace />;
  return <Outlet />;
}
