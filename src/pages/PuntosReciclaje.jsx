import { useEffect, useId, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { usePuntosPublicos } from '../hooks/usePuntosPublicos.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import {
  buscarPorId, buscarPorTermino, filtrarPorCategoria, puntoMasCercano,
} from '../services/consultas.js';
import { CATEGORIAS } from '../services/validarPunto.js';
import { MapaPuntos } from '../components/MapaPuntos.jsx';
import { TarjetaPunto } from '../components/TarjetaPunto.jsx';
import { AvisoError } from '../components/AvisoError.jsx';

const FILTROS = ['Todo', ...CATEGORIAS];

export function PuntosReciclaje() {
  useTituloPagina('Puntos de reciclaje');
  const idCampo = useId();
  const { sesion } = useAuth();
  const { puntos, cargando, error, recargar } = usePuntosPublicos(sesion?.user?.id ?? null);
  const [parametros] = useSearchParams();
  const [categoria, setCategoria] = useState('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [aviso, setAviso] = useState({ texto: '', error: false });
  const refMapa = useRef(null);

  // La lista visible se deriva de la categoría y la búsqueda.
  const visibles = buscarPorTermino(filtrarPorCategoria(puntos, categoria), busqueda);

  // Si venimos del inicio (?id=3), abrimos ese punto cuando llegan los datos.
  const idEnUrl = parametros.get('id');
  useEffect(() => {
    if (cargando || error || idEnUrl === null) return;
    const id = Number(idEnUrl);
    if (!Number.isInteger(id) || !buscarPorId(puntos, id)) {
      setAviso({ texto: 'El enlace no trae un punto válido.', error: true });
      return;
    }
    setSeleccionadoId(id);
  }, [idEnUrl, puntos, cargando, error]);

  function mensajeEstado() {
    if (aviso.texto) return aviso;
    if (cargando) return { texto: 'Cargando puntos de reciclaje…', error: false };
    if (puntos.length === 0) return { texto: 'La consulta no devolvió puntos de reciclaje activos.', error: false };
    if (visibles.length === 0) {
      return { texto: 'No hay coincidencias entre los puntos cargados. Cambia el material o la búsqueda.', error: false };
    }
    return { texto: 'Mostrando ' + visibles.length + ' de ' + puntos.length + ' puntos cargados.', error: false };
  }

  function verEnMapa(id) {
    const punto = buscarPorId(puntos, id);
    if (!punto) {
      setAviso({ texto: 'No se encontró ese punto de reciclaje.', error: true });
      return;
    }
    // Si el filtro actual lo oculta, quitamos los filtros para poder mostrarlo.
    if (!visibles.some((p) => p.id === id)) {
      setCategoria('Todo');
      setBusqueda('');
    }
    setAviso({ texto: '', error: false });
    setSeleccionadoId(id);
    refMapa.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // «Cerca de mí»: distancia a cada punto visible y elige el menor.
  function cercaDeMi() {
    if (!navigator.geolocation) {
      setAviso({ texto: 'Tu navegador no permite obtener la ubicación.', error: true });
      return;
    }
    if (visibles.length === 0) {
      setAviso({ texto: 'No hay puntos visibles para comparar.', error: true });
      return;
    }
    setAviso({ texto: 'Buscando tu ubicación…', error: false });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const posicion = { lat: coords.latitude, lng: coords.longitude };
        const mejor = puntoMasCercano(visibles, posicion);
        setUsuario(posicion);
        setSeleccionadoId(mejor.punto.id);
        setAviso({
          texto: 'El punto más cercano es ' + mejor.punto.nombre +
            ' (a ' + (mejor.metros / 1000).toFixed(1) + ' km).',
          error: false,
        });
      },
      () => setAviso({ texto: 'No pudimos obtener tu ubicación. Revisa los permisos del navegador.', error: true })
    );
  }

  const estado = mensajeEstado();

  return (
    <>
      <section className="encabezado">
        <h1>Puntos de Reciclaje</h1>
      </section>

      <section className="filtros" aria-label="Filtrar por categoría">
        {FILTROS.map((nombre) => (
          <button key={nombre} type="button" aria-pressed={categoria === nombre}
            className={categoria === nombre ? 'activo' : undefined}
            disabled={cargando || Boolean(error)}
            onClick={() => setCategoria(nombre)}>
            {nombre}
          </button>
        ))}
      </section>

      <section className="herramientas">
        <div>
          <label htmlFor={idCampo + '-busqueda'}>Buscar por nombre, dirección o material</label>
          <input id={idCampo + '-busqueda'} type="search" placeholder="Ej: pilas, universidad..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            disabled={cargando || Boolean(error)} />
        </div>
        <button type="button" onClick={cercaDeMi} disabled={cargando || Boolean(error)}>Cerca de mí</button>
        <button type="button" onClick={recargar} disabled={cargando}>Actualizar puntos</button>
      </section>

      {error ? (
        <div>
          <AvisoError>No se pudieron cargar los puntos: {error}</AvisoError>
          <p>Revisa tu conexión y pulsa «Actualizar puntos».</p>
        </div>
      ) : (
        <p role="status" className={estado.error ? 'error' : undefined}>{estado.texto}</p>
      )}

      <div ref={refMapa}>
        <MapaPuntos puntos={visibles} seleccionadoId={seleccionadoId} usuario={usuario}
          onSeleccionar={setSeleccionadoId} />
      </div>

      <section className="puntos" aria-busy={cargando}>
        {visibles.map((punto) => (
          <TarjetaPunto key={punto.id} punto={punto} seleccionado={punto.id === seleccionadoId}>
            <a href="#mapa" onClick={(e) => { e.preventDefault(); verEnMapa(punto.id); }}>Ver en el mapa</a>
          </TarjetaPunto>
        ))}
      </section>
    </>
  );
}
