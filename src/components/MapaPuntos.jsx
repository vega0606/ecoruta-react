import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Con Vite, Leaflet no encuentra solo sus imágenes (y antepone una ruta a la URL),
// así que definimos un ícono explícito con las imágenes importadas.
const iconoMarcador = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Centro inicial del mapa (Armenia, Quindío).
const CENTRO_INICIAL = [4.5339, -75.6811];

// Leaflet es un sistema externo a React: se crea al montar y se destruye al desmontar.
// Recibe los puntos a dibujar, el id seleccionado, la posición de la persona
// y avisa con onSeleccionar cuando se pulsa un marcador.
export function MapaPuntos({ puntos, seleccionadoId, usuario, onSeleccionar }) {
  const contenedor = useRef(null);
  const mapa = useRef(null);
  const capa = useRef(null);
  const marcadores = useRef({});
  const marcadorUsuario = useRef(null);
  const alSeleccionar = useRef(onSeleccionar);
  alSeleccionar.current = onSeleccionar;

  // Crear y destruir el mapa (StrictMode lo monta dos veces en desarrollo).
  useEffect(() => {
    const instancia = L.map(contenedor.current).setView(CENTRO_INICIAL, 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; Colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(instancia);
    capa.current = L.layerGroup().addTo(instancia);
    mapa.current = instancia;
    return () => {
      instancia.remove();
      mapa.current = null;
      capa.current = null;
      marcadores.current = {};
      marcadorUsuario.current = null;
    };
  }, []);

  // Un marcador por cada punto visible.
  useEffect(() => {
    if (!mapa.current) return;
    capa.current.clearLayers();
    marcadores.current = {};

    puntos.forEach((punto) => {
      // El popup se arma con elementos del DOM (no con HTML) para evitar inyecciones.
      const contenido = document.createElement('div');
      const nombre = document.createElement('strong');
      nombre.textContent = punto.nombre;
      const detalle = document.createElement('p');
      detalle.textContent = punto.direccion + ' · ' + punto.horario;
      contenido.append(nombre, detalle);

      const marcador = L.marker([punto.lat, punto.lng], { icon: iconoMarcador }).bindPopup(contenido);
      marcador.on('click', () => alSeleccionar.current?.(punto.id));
      marcador.addTo(capa.current);
      marcadores.current[punto.id] = marcador;
    });

    if (puntos.length > 0) {
      mapa.current.fitBounds(puntos.map((p) => [p.lat, p.lng]), { padding: [40, 40], maxZoom: 15 });
    }
  }, [puntos]);

  // Acercar y abrir el popup del punto seleccionado.
  useEffect(() => {
    const punto = puntos.find((p) => p.id === seleccionadoId);
    const marcador = marcadores.current[seleccionadoId];
    if (!mapa.current || !punto || !marcador) return;
    mapa.current.setView([punto.lat, punto.lng], 16);
    marcador.openPopup();
  }, [seleccionadoId, puntos]);

  // Marca «Tú estás aquí» cuando la persona comparte su ubicación.
  useEffect(() => {
    if (!mapa.current) return;
    if (marcadorUsuario.current) {
      marcadorUsuario.current.remove();
      marcadorUsuario.current = null;
    }
    if (usuario) {
      marcadorUsuario.current = L.circleMarker([usuario.lat, usuario.lng], {
        radius: 9, color: '#1b4332', fillColor: '#a5d0b9', fillOpacity: 1,
      }).addTo(mapa.current).bindPopup('Tú estás aquí');
    }
  }, [usuario]);

  return (
    <div
      ref={contenedor}
      role="region"
      aria-label="Mapa de puntos de reciclaje"
      style={{ height: 420, width: '100%', marginBottom: 32, border: '1px solid var(--border)', borderRadius: 12, position: 'relative', zIndex: 0 }}
    />
  );
}
