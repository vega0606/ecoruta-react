import { useState } from 'react';

const CLAVE = 'ecoruta:menu-compacto:v1';

function leerPreferencia() {
  try {
    return window.localStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
}

// Preferencia del dispositivo (no sensible). Si no hay almacenamiento,
// se conserva en memoria mientras la app está abierta.
export function useMenuCompacto() {
  const [compacto, setCompacto] = useState(leerPreferencia);

  function alternar() {
    const siguiente = !compacto;
    setCompacto(siguiente);
    try {
      window.localStorage.setItem(CLAVE, siguiente ? '1' : '0');
    } catch {
      // La interfaz sigue funcionando sin almacenamiento.
    }
  }

  return { compacto, alternar };
}
