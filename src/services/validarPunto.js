// Regla de negocio de EcoRuta, sin React ni red, para poder probarla.
// Replica las restricciones de la tabla puntos_reciclaje (ver supabase/).
export const CATEGORIAS = ['Papel', 'Plástico', 'Vidrio', 'Metal', 'Electrónicos'];

function numeroONull(texto) {
  if (typeof texto === 'number') return Number.isFinite(texto) ? texto : null;
  if (typeof texto !== 'string' || texto.trim() === '') return null;
  const n = Number(texto.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

// Convierte "Papel, cartón ,, vidrio" en ['Papel', 'cartón', 'vidrio'].
export function separarMateriales(texto) {
  if (typeof texto !== 'string') return [];
  return texto.split(',').map((m) => m.trim()).filter(Boolean);
}

// Devuelve { valores, errores }. Si errores está vacío, valores es enviable.
export function validarPunto(borrador) {
  const errores = {};
  const nombre = String(borrador.nombre ?? '').trim();
  const direccion = String(borrador.direccion ?? '').trim();
  const horario = String(borrador.horario ?? '').trim();
  const materiales = separarMateriales(borrador.materiales);
  const categorias = Array.isArray(borrador.categorias) ? borrador.categorias : [];
  const lat = numeroONull(borrador.lat);
  const lng = numeroONull(borrador.lng);

  if (nombre.length < 3 || nombre.length > 80) {
    errores.nombre = 'El nombre debe tener entre 3 y 80 caracteres.';
  }
  if (direccion.length < 3 || direccion.length > 120) {
    errores.direccion = 'La dirección debe tener entre 3 y 120 caracteres.';
  }
  if (!horario) errores.horario = 'Indica el horario de atención.';
  if (materiales.length === 0) {
    errores.materiales = 'Escribe al menos un material, separados por comas.';
  }
  if (categorias.length === 0) {
    errores.categorias = 'Elige al menos una categoría.';
  } else if (!categorias.every((c) => CATEGORIAS.includes(c))) {
    errores.categorias = 'Hay una categoría que no existe.';
  }
  if (lat === null || lat < -90 || lat > 90) {
    errores.lat = 'La latitud debe ser un número entre -90 y 90.';
  }
  if (lng === null || lng < -180 || lng > 180) {
    errores.lng = 'La longitud debe ser un número entre -180 y 180.';
  }

  return {
    errores,
    valores: { nombre, direccion, horario, materiales, categorias, lat, lng },
  };
}
