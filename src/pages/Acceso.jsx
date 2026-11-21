import { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { AvisoError } from '../components/AvisoError.jsx';

export function Acceso() {
  const { sesion, entrar } = useAuth();
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState('');

  async function iniciar() {
    setPendiente(true);
    setError('');
    try {
      // Normalmente el proveedor lleva el navegador fuera de esta vista.
      await entrar();
    } catch {
      setError('No se pudo iniciar el acceso. Inténtalo de nuevo.');
      setPendiente(false);
    }
  }

  if (sesion === undefined) return <p role="status">Comprobando sesión…</p>;
  if (sesion) return <Navigate to="/puntos" replace />;
  return (
    <section>
      <h1>Acceso</h1>
      <p>Entra con tu cuenta de Google para gestionar tus puntos.</p>
      <button type="button" className="btn btn-success" disabled={pendiente} onClick={iniciar}>
        {pendiente ? 'Abriendo el acceso…' : 'Entrar con Google'}
      </button>
      {error && <div className="mt-3"><AvisoError>{error}</AvisoError></div>}
    </section>
  );
}
