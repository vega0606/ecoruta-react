import styles from './TarjetaPunto.module.css';

// Pieza reutilizada: la lista del panel y la página de detalle muestran un
// punto con este mismo componente. Los datos llegan por props y las acciones
// (editar, eliminar, volver…) por children, así no conoce el CRUD.
export function TarjetaPunto({ punto, titulo: Titulo = 'h3', children }) {
  return (
    <article className={styles.tarjeta}>
      <Titulo className={styles.titulo}>{punto.nombre}</Titulo>
      <p className={styles.dato}><strong>Dirección:</strong> {punto.direccion}</p>
      <p className={styles.dato}><strong>Horario:</strong> {punto.horario}</p>
      <p className={styles.dato}>
        <strong>Materiales:</strong> {punto.materiales.join(', ')}
      </p>
      <ul className={styles.etiquetas} aria-label="Categorías">
        {punto.categorias.map((c) => <li key={c} className={styles.etiqueta}>{c}</li>)}
      </ul>
      <p className={styles.coordenadas}>
        Coordenadas: {punto.lat}, {punto.lng}
      </p>
      {children && <div className={styles.acciones}>{children}</div>}
    </article>
  );
}
