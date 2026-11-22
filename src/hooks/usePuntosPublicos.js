import { useEffect, useState } from 'react';
import { listarPuntosPublicos } from '../services/puntos.js';

// Lee los puntos que la API deja ver a quien consulta (inicio y mapa).
// Se vuelve a leer al cambiar la cuenta (userId) o al pedir recargar.
export function usePuntosPublicos(userId = null) {
  const [revision, setRevision] = useState(0);
  const [consulta, setConsulta] = useState({ puntos: [], cargando: true, error: '' });

  useEffect(() => {
    let vigente = true;
    const control = new AbortController();
    setConsulta({ puntos: [], cargando: true, error: '' });

    async function cargar() {
      try {
        const puntos = await listarPuntosPublicos(control.signal);
        if (vigente) setConsulta({ puntos, cargando: true, error: '' });
      } catch (error) {
        if (vigente && !control.signal.aborted) {
          setConsulta({ puntos: [], cargando: true, error: error.message });
        }
      } finally {
        if (vigente) setConsulta((actual) => ({ ...actual, cargando: false }));
      }
    }
    cargar();

    return () => {
      vigente = false;
      control.abort();
    };
  }, [userId, revision]);

  return { ...consulta, recargar: () => setRevision((n) => n + 1) };
}
