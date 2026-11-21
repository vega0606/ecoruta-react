import { useEffect, useState } from 'react';
import { listarPuntos } from '../services/puntos.js';

// Sincroniza la lista con la API según cuenta, criterios y revisión.
// Espera 300 ms tras escribir (debounce) y cancela lecturas obsoletas.
export function usePuntos(userId, texto, categoria) {
  const [revision, setRevision] = useState(0);
  const [consulta, setConsulta] = useState({ filas: [], cargando: true, error: '' });

  useEffect(() => {
    let vigente = true;
    const control = new AbortController();
    setConsulta({ filas: [], cargando: true, error: '' });

    const espera = setTimeout(async () => {
      try {
        const filas = await listarPuntos(userId, { texto, categoria }, control.signal);
        if (vigente) setConsulta({ filas, cargando: true, error: '' });
      } catch (error) {
        if (vigente && !control.signal.aborted) {
          setConsulta({ filas: [], cargando: true, error: error.message });
        }
      } finally {
        if (vigente) setConsulta((actual) => ({ ...actual, cargando: false }));
      }
    }, 300);

    return () => {
      vigente = false;
      clearTimeout(espera);
      control.abort();
    };
  }, [userId, texto, categoria, revision]);

  return { ...consulta, recargar: () => setRevision((n) => n + 1) };
}
