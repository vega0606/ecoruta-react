import { useState } from 'react';
import { Link } from 'react-router';
import { usePuntos } from '../hooks/usePuntos.js';
import { actualizarPunto, crearPunto, eliminarPunto } from '../services/puntos.js';
import { Filtros } from './Filtros.jsx';
import { FormularioPunto } from './FormularioPunto.jsx';
import { TarjetaPunto } from './TarjetaPunto.jsx';
import { AvisoError } from './AvisoError.jsx';

// CRUD de puntos de reciclaje de la cuenta. Las escrituras viven en los
// manejadores de eventos; la lectura la coordina el Hook usePuntos.
export function PanelPuntos({ userId }) {
  const [filtros, setFiltros] = useState({ texto: '', categoria: '' });
  const { filas, cargando, error, recargar } = usePuntos(userId, filtros.texto, filtros.categoria);
  const [enEdicion, setEnEdicion] = useState(null); // fila completa o null
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [errorAccion, setErrorAccion] = useState('');
  const bloqueado = ocupado || cargando;

  // Devuelve true si la escritura fue confirmada por la API.
  async function guardar(valores) {
    if (bloqueado) return false;
    setMensaje('');
    setErrorAccion('');
    setOcupado(true);
    try {
      const fila = enEdicion === null
        ? await crearPunto(userId, valores)
        : await actualizarPunto(enEdicion.id, userId, valores);
      setMensaje('Guardado confirmado. Identificador: ' + fila.id);
      setEnEdicion(null);
      recargar();
      return true;
    } catch (e) {
      // El formulario conserva el borrador si falla.
      setErrorAccion(e.message);
      return false;
    } finally {
      setOcupado(false);
    }
  }

  async function eliminar(fila) {
    if (bloqueado || !window.confirm('¿Eliminar "' + fila.nombre + '"?')) return;
    setOcupado(true);
    setMensaje('');
    setErrorAccion('');
    try {
      const idEliminado = await eliminarPunto(fila.id, userId);
      setMensaje('Eliminación confirmada: ' + idEliminado);
      if (enEdicion?.id === idEliminado) setEnEdicion(null);
      recargar();
    } catch (e) {
      setErrorAccion(e.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <section aria-label="Gestión de puntos" className="d-grid gap-4">
      <h1 className="h3">Mis puntos de reciclaje</h1>

      {/* key: al cambiar de punto en edición, el formulario reinicia su borrador. */}
      <FormularioPunto key={enEdicion?.id ?? 'nuevo'} punto={enEdicion}
        ocupado={bloqueado} onGuardar={guardar} onCancelar={() => setEnEdicion(null)} />

      {mensaje && <p role="status" className="alert alert-success mb-0">{mensaje}</p>}
      {errorAccion && <AvisoError>{errorAccion}</AvisoError>}

      <Filtros filtros={filtros} onCambiar={setFiltros} disabled={ocupado} />

      {cargando && <p role="status">Cargando puntos…</p>}
      {!cargando && error && (
        <div>
          <AvisoError>No se pudo consultar: {error}</AvisoError>
          <button type="button" className="btn btn-outline-danger" onClick={recargar} disabled={ocupado}>
            Reintentar consulta
          </button>
        </div>
      )}
      {!cargando && !error && (
        <section aria-label="Puntos consultados">
          <p>{filas.length} puntos visibles.</p>
          {filas.length === 0 && (
            <p>
              {filtros.texto || filtros.categoria
                ? 'No hay puntos que coincidan con la búsqueda.'
                : 'Aún no has registrado puntos. Usa el formulario de arriba.'}
            </p>
          )}
          <div className="row g-3">
            {filas.map((fila) => (
              <div key={fila.id} className="col-12 col-md-6 col-lg-4">
                <TarjetaPunto punto={fila}>
                  {/* La URL lleva el id real, no la posición en el arreglo. */}
                  <Link className="btn btn-outline-success btn-sm"
                    to={'/puntos/' + encodeURIComponent(fila.id)}>
                    Ver detalle de {fila.nombre}
                  </Link>
                  <button type="button" className="btn btn-outline-primary btn-sm"
                    disabled={ocupado} onClick={() => { setMensaje(''); setErrorAccion(''); setEnEdicion(fila); }}>
                    Editar
                  </button>
                  <button type="button" className="btn btn-outline-danger btn-sm"
                    disabled={ocupado} onClick={() => eliminar(fila)}>
                    Eliminar
                  </button>
                </TarjetaPunto>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
