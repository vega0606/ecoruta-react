// Funciones puras para consultar una colección de puntos (find y filter).
// Reciben el arreglo que entregó la API; no tocan el DOM ni piden datos.
// Migradas de consultas.js del segundo corte.

// Minúsculas, sin espacios en los extremos y sin tildes: "Plástico" coincide con "plastico".
export function normalizarTexto(texto) {
  return String(texto).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Puntos activos que acepten la categoría. 'Todo' quita el filtro.
export function filtrarPorCategoria(coleccion, categoria) {
  return coleccion.filter((punto) => {
    if (!punto.activo) return false;
    return categoria === 'Todo' || punto.categorias.includes(categoria);
  });
}

// Punto con ese id, o undefined si no existe.
export function buscarPorId(coleccion, id) {
  return coleccion.find((punto) => punto.id === id);
}

// Puntos cuyo material o categoría contiene el texto. Texto vacío = no filtra.
export function buscarPorMaterial(coleccion, texto) {
  const termino = normalizarTexto(texto);
  if (termino === '') return coleccion;
  return coleccion.filter((punto) =>
    punto.materiales.concat(punto.categorias)
      .some((material) => normalizarTexto(material).includes(termino))
  );
}

// Puntos cuyo nombre o dirección contiene el texto. Texto vacío = no filtra.
export function buscarPorUbicacion(coleccion, texto) {
  const termino = normalizarTexto(texto);
  if (termino === '') return coleccion;
  return coleccion.filter((punto) =>
    normalizarTexto(punto.nombre).includes(termino) ||
    normalizarTexto(punto.direccion).includes(termino)
  );
}

// Búsqueda libre: nombre, dirección o material.
export function buscarPorTermino(coleccion, texto) {
  const termino = normalizarTexto(texto);
  if (termino === '') return coleccion;
  return coleccion.filter((punto) =>
    [punto.nombre, punto.direccion, ...punto.materiales]
      .some((campo) => normalizarTexto(campo).includes(termino))
  );
}

// Distancia en metros entre dos coordenadas (fórmula de haversine).
export function distanciaMetros(a, b) {
  const R = 6371000;
  const rad = (grados) => (grados * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Punto más cercano a una posición, con su distancia. null si no hay puntos.
export function puntoMasCercano(coleccion, posicion) {
  let mejor = null;
  for (const punto of coleccion) {
    const metros = distanciaMetros(posicion, punto);
    if (mejor === null || metros < mejor.metros) mejor = { punto, metros };
  }
  return mejor;
}
