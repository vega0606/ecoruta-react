// Los ids de puntos_reciclaje son enteros (identity). Se admite también UUID
// por si la entidad cambia. El id llega de la URL como texto.
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const entero = /^[1-9][0-9]{0,18}$/;

export function idValido(id) {
  return typeof id === 'string' && (uuid.test(id) || entero.test(id));
}
