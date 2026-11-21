import { useState } from 'react';

// Geolocalización bajo demanda: solo se pide al pulsar el botón, y hay una
// alternativa sin permisos (escribir latitud y longitud a mano en el formulario).
export function Ubicacion({ onUbicada, disabled = false }) {
  const [mensaje, setMensaje] = useState('');
  const [pendiente, setPendiente] = useState(false);

  function ubicar() {
    if (!window.isSecureContext || !navigator.geolocation) {
      setMensaje('Ubicación no disponible. Escribe las coordenadas a mano.');
      return;
    }
    setPendiente(true);
    setMensaje('Solicitando ubicación…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = Number(coords.latitude.toFixed(5));
        const lng = Number(coords.longitude.toFixed(5));
        onUbicada({ lat, lng });
        setMensaje('Coordenadas aplicadas: ' + lat + ', ' + lng);
        setPendiente(false);
      },
      ({ code }) => {
        const causa = code === 1 ? 'Permiso denegado.' :
          code === 3 ? 'Se agotó el tiempo.' : 'Ubicación no disponible.';
        setMensaje(causa + ' Escribe las coordenadas a mano.');
        setPendiente(false);
      },
      { timeout: 8000 }
    );
  }

  return (
    <div aria-label="Ubicación" className="mb-2">
      <button type="button" className="btn btn-outline-success btn-sm"
        onClick={ubicar} disabled={pendiente || disabled}>
        Usar mi ubicación
      </button>
      <span role="status" className="ms-2 small">{mensaje}</span>
    </div>
  );
}
