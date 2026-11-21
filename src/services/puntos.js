import { supabase, tabla } from '../lib/supabase.js';

const columnas = 'id,nombre,direccion,horario,materiales,categorias,lat,lng,activo';

// Escapa los comodines de LIKE para que el texto del usuario sea literal.
function literalLike(texto) {
  return texto.replace(/[\\%_]/g, (c) => '\\' + c);
}

// Consultar: el filtro de texto y de categoría se aplica en la API.
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
