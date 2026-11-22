import { useEffect } from 'react';

// Mantiene el título de la pestaña sincronizado con la página actual.
// El efecto existe porque document.title está fuera de React.
export function useTituloPagina(titulo) {
  useEffect(() => {
    const anterior = document.title;
    document.title = titulo + ' · EcoRuta';
    return () => {
      document.title = anterior;
    };
  }, [titulo]);
}
