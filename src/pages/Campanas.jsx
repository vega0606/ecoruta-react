import { useState } from 'react';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { calendario, campanaDestacada, campanas } from '../data/campanas.js';

// Tarjeta de campaña reutilizada para cada evento de la lista.
function TarjetaCampana({ campana, alInscribirse }) {
  return (
    <article className="campana">
      <img src={campana.imagen} alt={campana.alt} loading="lazy" />
      <div className="contenido-campana">
        <div>
          {campana.etiquetas.map((e) => <span key={e}>{e}</span>)}
        </div>
        <h3 style={{ marginTop: 0 }}>{campana.titulo}</h3>
        <p>{campana.descripcion}</p>
        <div className="datos">
          <p>Fecha: {campana.fecha}</p>
          <p>Lugar: {campana.lugar}</p>
        </div>
        <button type="button" onClick={() => alInscribirse(campana.titulo)}>{campana.accion}</button>
      </div>
    </article>
  );
}

export function Campanas() {
  useTituloPagina('Campañas');
  const [mostrarTodas, setMostrarTodas] = useState(true);
  const [aviso, setAviso] = useState('');
  const visibles = mostrarTodas ? campanas : campanas.slice(0, 2);

  return (
    <>
      <header className="encabezado">
        <h1>Campañas Ambientales</h1>
        <p>
          Únete a nuestras iniciativas comunitarias y sé parte del cambio. Descubre
          eventos de reforestación, limpieza y reciclaje en tu zona.
        </p>
      </header>

      <section className="campana-destacada" aria-label="Campaña destacada">
        <img src={campanaDestacada.imagen} alt={campanaDestacada.titulo} />
        <div className="contenido-destacado">
          <span>Destacado</span>
          <h2>{campanaDestacada.titulo}</h2>
          <p>{campanaDestacada.descripcion}</p>
          <div className="datos-evento">
            <p>Fecha: {campanaDestacada.fecha}</p>
            <p>Lugar: {campanaDestacada.lugar}</p>
          </div>
          <button type="button" onClick={() => setAviso('Para inscribirte, ve a «Unirse» en el menú.')}>
            Inscribirse
          </button>
        </div>
      </section>

      {aviso && <p role="status">{aviso}</p>}

      <section className="proximos-eventos">
        <div className="titulo-seccion">
          <h2>Próximos Eventos</h2>
          <button type="button" className="boton-secundario" aria-pressed={mostrarTodas}
            onClick={() => setMostrarTodas((v) => !v)}>
            {mostrarTodas ? 'Ver menos' : 'Ver todos'}
          </button>
        </div>

        <div className="campanas">
          {visibles.map((c) => (
            <TarjetaCampana key={c.id} campana={c}
              alInscribirse={() => setAviso('Para participar en «' + c.titulo + '», ve a «Unirse» en el menú.')} />
          ))}
        </div>

        <div className="tabla-scroll">
          <table>
            <caption>Calendario de campañas ambientales</caption>
            <thead>
              <tr><th scope="col">Evento</th><th scope="col">Categoría</th><th scope="col">Fecha</th><th scope="col">Lugar</th></tr>
            </thead>
            <tbody>
              {calendario.map((fila) => (
                <tr key={fila.evento}>
                  <td>{fila.evento}</td><td>{fila.categoria}</td><td>{fila.fecha}</td><td>{fila.lugar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
