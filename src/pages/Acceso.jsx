import { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { AvisoError } from '../components/AvisoError.jsx';

export function Acceso() {
  useTituloPagina('Acceso');
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
    <section className="cuenta">
      <h1 style={{ marginTop: 0 }}>Acceso</h1>
      <p>Entra con tu cuenta de Google para registrar y gestionar tus puntos.</p>
      <button type="button" disabled={pendiente} onClick={iniciar}>
        {pendiente ? 'Abriendo el acceso…' : 'Continuar con Google'}
      </button>
      {error && <div style={{ marginTop: 16 }}><AvisoError>{error}</AvisoError></div>}
    </section>
  );
}
