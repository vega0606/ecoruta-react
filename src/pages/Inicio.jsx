import { useId, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { usePuntosPublicos } from '../hooks/usePuntosPublicos.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { buscarPorMaterial, buscarPorUbicacion } from '../services/consultas.js';
import { CATEGORIAS } from '../services/validarPunto.js';
import { TarjetaPunto } from '../components/TarjetaPunto.jsx';
import { AvisoError } from '../components/AvisoError.jsx';

const pasos = [
  { titulo: '1. Localiza', texto: 'Usa nuestro buscador para encontrar el punto verde o contenedor más cercano según el tipo de residuo.' },
  { titulo: '2. Clasifica', texto: 'Separa tus residuos en casa siguiendo nuestras guías rápidas para asegurar un reciclaje efectivo.' },
  { titulo: '3. Impacta', texto: 'Registra tus entregas, acumula puntos y visualiza tu impacto positivo en la comunidad.' },
];

export function Inicio() {
  useTituloPagina('Inicio');
  const prefijo = useId();
  const { sesion } = useAuth();
  const { puntos, cargando, error, recargar } = usePuntosPublicos(sesion?.user?.id ?? null);
  const [criterios, setCriterios] = useState({ material: '', ubicacion: '' });
  // null = todavía no se ha buscado; si no, los criterios enviados.
  const [busqueda, setBusqueda] = useState(null);

  function buscar(event) {
    event.preventDefault();
    setBusqueda({ ...criterios });
  }

  // El resultado se deriva de los puntos y de la búsqueda: no es otro estado.
  const vacia = busqueda && !busqueda.material.trim() && !busqueda.ubicacion.trim();
  const resultados = busqueda && !vacia
    ? buscarPorUbicacion(buscarPorMaterial(puntos, busqueda.material), busqueda.ubicacion)
    : [];

  function mensajeBusqueda() {
    if (vacia) return 'Escribe un material o una zona para buscar.';
    if (cargando) return 'Cargando puntos…';
    if (error) return 'No pudimos consultar los puntos. Intenta de nuevo en un momento.';
    if (resultados.length === 0) return 'No encontramos puntos con esos datos. Prueba con otro material.';
    return resultados.length + ' punto(s) encontrado(s).';
  }

  return (
    <>
      <section className="inicio">
        <h1>Reciclar es el camino.</h1>
        <p>
          Encuentra el punto de reciclaje más cercano, únete a campañas locales y
          haz tu parte por un planeta más limpio. Todo desde un solo lugar.
        </p>

        <form onSubmit={buscar} aria-label="Buscar punto de reciclaje">
          <label htmlFor={prefijo + '-material'}>¿Qué necesitas reciclar?</label>
          <input id={prefijo + '-material'} type="text" placeholder="Ej: Plástico, Vidrio, Pilas..."
            value={criterios.material}
            onChange={(e) => setCriterios({ ...criterios, material: e.target.value })} />

          <label htmlFor={prefijo + '-ubicacion'}>Zona o dirección (opcional):</label>
          <input id={prefijo + '-ubicacion'} type="text" placeholder="Ej: Plaza de Armas, Universidad..."
            value={criterios.ubicacion}
            onChange={(e) => setCriterios({ ...criterios, ubicacion: e.target.value })} />

          <button type="submit" disabled={cargando}>Buscar punto</button>
        </form>

        {busqueda && (
          <section id="resultados-busqueda" aria-label="Resultados de la búsqueda">
            <p role="status">{mensajeBusqueda()}</p>
            <div className="puntos">
              {resultados.map((punto) => (
                <TarjetaPunto key={punto.id} punto={punto}>
                  <Link to={'/puntos-reciclaje?id=' + punto.id}>Ver en el mapa</Link>
                </TarjetaPunto>
              ))}
            </div>
          </section>
        )}
      </section>

      <section className="como-funciona">
        <h2>Cómo funciona EcoRuta</h2>
        <p>Tres simples pasos para convertirte en un ciudadano más responsable con el medio ambiente.</p>
        <ol>
          {pasos.map((paso) => (
            <li key={paso.titulo}>
              <article>
                <h3 style={{ marginTop: 0 }}>{paso.titulo}</h3>
                <p style={{ marginBottom: 0 }}>{paso.texto}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Materiales que aceptamos</h2>
        <ul className="materiales-aceptados">
          {CATEGORIAS.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </section>

      <section className="puntos-destacados" aria-busy={cargando}>
        <h2>Puntos Destacados</h2>
        <p>Lugares de recolección activos en tu zona.</p>

        {cargando && <p role="status">Cargando puntos…</p>}
        {!cargando && error && (
          <div>
            <AvisoError>No se pudieron cargar los puntos: {error}</AvisoError>
            <button type="button" onClick={recargar}>Reintentar</button>
          </div>
        )}
        {!cargando && !error && puntos.length === 0 && (
          <p role="status">Todavía no hay puntos activos.</p>
        )}
        {!cargando && !error && puntos.length > 0 && (
          <div className="puntos">
            {puntos.slice(0, 2).map((punto) => (
              <TarjetaPunto key={punto.id} punto={punto}>
                <Link to={'/puntos-reciclaje?id=' + punto.id}>Ver detalles</Link>
              </TarjetaPunto>
            ))}
          </div>
        )}

        <Link to="/puntos-reciclaje">Ver todos los puntos</Link>
      </section>
    </>
  );
}
