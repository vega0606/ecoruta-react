import { supabase, tabla } from '../lib/supabase.js';

const columnas = 'id,nombre,direccion,horario,materiales,categorias,lat,lng,activo';

// Escapa los comodines de LIKE para que el texto del usuario sea literal.
function literalLike(texto) {
  return texto.replace(/[\\%_]/g, (c) => '\\' + c);
}

// Comprueba que un registro tenga los campos y tipos que usa la interfaz.
function esPuntoValido(p) {
  return p !== null && typeof p === 'object' &&
    Number.isInteger(p.id) &&
    typeof p.nombre === 'string' &&
    typeof p.direccion === 'string' &&
    typeof p.horario === 'string' &&
    Array.isArray(p.materiales) &&
    Array.isArray(p.categorias) &&
    typeof p.lat === 'number' &&
    typeof p.lng === 'number' &&
    typeof p.activo === 'boolean';
}

// Mapa e inicio: puntos activos que la política RLS deja leer a quien consulta.
// Sin sesión llegan solo los puntos de ejemplo; con sesión, también los propios.
export async function listarPuntosPublicos(signal) {
  const { data, error } = await supabase.from(tabla)
    .select(columnas)
    .eq('activo', true)
    .order('id', { ascending: true })
    .limit(50)
    .abortSignal(signal);
  if (error) throw new Error(error.message);
  if (!Array.isArray(data)) throw new Error('Se esperaba una colección de puntos.');
  if (!data.every(esPuntoValido)) {
    throw new Error('Los campos recibidos no coinciden con los de la tabla de puntos.');
  }
  return data;
}

// Consultar (mis puntos): el filtro de texto y de categoría se aplica en la API.
export async function listarPuntos(userId, { texto = '', categoria = '' }, signal) {
  let consulta = supabase.from(tabla)
    .select(columnas)
    .eq('user_id', userId)
    .order('nombre', { ascending: true })
    .limit(100);
  const busqueda = texto.trim();
  if (busqueda) consulta = consulta.ilike('nombre', '%' + literalLike(busqueda) + '%');
  if (categoria) consulta = consulta.contains('categorias', [categoria]);

  const { data, error } = await consulta.abortSignal(signal);
  if (error) throw new Error(error.message);
  if (!Array.isArray(data)) throw new Error('Respuesta sin colección.');
  return data;
}

// Detalle por id real. null = no hay fila visible para esta cuenta.
export async function leerPunto(id, userId, signal) {
  const { data, error } = await supabase.from(tabla)
    .select(columnas)
    .eq('id', id)
    .eq('user_id', userId)
    .abortSignal(signal)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// Crear: se pide de vuelta la fila persistida con su id generado.
export async function crearPunto(userId, valores) {
  const { data, error } = await supabase.from(tabla)
    .insert({ ...valores, user_id: userId, activo: true })
    .select(columnas)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Editar (PATCH): solo campos editables, nunca el propietario.
export async function actualizarPunto(id, userId, valores) {
  const { data, error } = await supabase.from(tabla)
    .update(valores)
    .eq('id', id)
    .eq('user_id', userId)
    .select(columnas)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Eliminar: devuelve el id de la única fila retirada.
export async function eliminarPunto(id, userId) {
  const { data, error } = await supabase.from(tabla)
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}
