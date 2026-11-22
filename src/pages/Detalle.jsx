import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { idValido } from '../services/idRegistro.js';
import { leerPunto } from '../services/puntos.js';
import { TarjetaPunto } from '../components/TarjetaPunto.jsx';
import { AvisoError } from '../components/AvisoError.jsx';

export function Detalle() {
  useTituloPagina('Detalle del punto');
  const { id } = useParams();
  const { sesion } = useAuth();
  const usuario = sesion.user.id;
  const volver = useNavigate();
  const [revision, setRevision] = useState(0);
  const [resultado, setResultado] = useState(null);
  const valido = idValido(id);

  useEffect(() => {
    if (!valido) return;
    const control = new AbortController();
    let vigente = true;

    async function cargar() {
      try {
        const fila = await leerPunto(id, usuario, control.signal);
        if (vigente) setResultado({ id, usuario, revision, fila });
      } catch {
        if (vigente) setResultado({ id, usuario, revision, fallo: true });
      }
    }
    cargar();
    return () => {
      vigente = false;
      control.abort();
    };
  }, [id, usuario, revision, valido]);

  // El resultado se identifica con los criterios usados: no se muestra el dato anterior.
  const actual = resultado?.id === id &&
    resultado?.usuario === usuario && resultado?.revision === revision;

  if (!valido) {
    return <p>Identificador inválido. <Link to="/puntos">Volver</Link></p>;
  }
  if (!actual) return <p role="status">Consultando punto…</p>;

  if (resultado.fallo) {
    return (
      <>
        <AvisoError>No se pudo consultar el punto.</AvisoError>
        <button type="button" onClick={() => setRevision((n) => n + 1)}>Reintentar</button>
        <p style={{ marginTop: 16 }}><Link to="/puntos">Volver al listado</Link></p>
      </>
    );
  }

  const { fila } = resultado;
  if (!fila) {
    return <p>Punto no disponible. <Link to="/puntos">Volver</Link></p>;
  }
  return (
    <section>
      <TarjetaPunto punto={fila} titulo="h1" mostrarCoordenadas>
        <Link className="boton boton-chico" to="/puntos">Volver al listado</Link>
        <button type="button" className="boton-secundario boton-chico" onClick={() => volver('/')}>
          Ir a inicio
        </button>
      </TarjetaPunto>
    </section>
  );
}
