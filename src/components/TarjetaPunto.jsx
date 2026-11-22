import styles from './TarjetaPunto.module.css';

// Pieza reutilizada en cinco lugares: destacados y buscador del inicio, lista del
// mapa, panel «Registrar un punto» y detalle. Los datos llegan por props y las
// acciones (ver en el mapa, editar, eliminar, volver…) por children, así que
// no conoce el CRUD ni el mapa.
export function TarjetaPunto({ punto, titulo: Titulo = 'h3', seleccionado = false, mostrarCoordenadas = false, children }) {
  return (
    <article className={seleccionado ? styles.seleccionado : undefined} data-id={punto.id}>
      <Titulo className={styles.titulo}>{punto.nombre}</Titulo>
      <p>Horario: {punto.horario}</p>
      <p>Dirección: {punto.direccion}</p>
      <p style={{ marginBottom: 0 }}>Materiales:</p>
      <ul className={styles.materiales}>
        {punto.materiales.map((m) => <li key={m}>{m}</li>)}
      </ul>
      <ul className={styles.etiquetas} aria-label="Categorías">
        {punto.categorias.map((c) => <li key={c} className={styles.etiqueta}>{c}</li>)}
      </ul>
      {mostrarCoordenadas && (
        <p className={styles.coordenadas}>Coordenadas: {punto.lat}, {punto.lng}</p>
      )}
      {children && <div className={styles.acciones}>{children}</div>}
    </article>
  );
}
