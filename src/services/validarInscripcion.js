// Reglas del formulario de voluntariado (sin React ni red, para poder probarlas).
export function validarInscripcion(borrador) {
  const errores = {};
  const nombre = String(borrador.nombre ?? '').trim();
  const correo = String(borrador.correo ?? '').trim();
  const telefono = String(borrador.telefono ?? '').trim();
  const edad = Number(borrador.edad);

  if (nombre.length < 3) errores.nombre = 'Escribe tu nombre completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errores.correo = 'Escribe un correo válido, por ejemplo tu@correo.com.';
  }
  if (telefono.replace(/\D/g, '').length < 7) {
    errores.telefono = 'Escribe un teléfono de al menos 7 dígitos.';
  }
  if (!Number.isInteger(edad) || edad < 16 || edad > 99) {
    errores.edad = 'La edad debe estar entre 16 y 99 años.';
  }
  if (!borrador.terminos) {
    errores.terminos = 'Debes aceptar los términos y condiciones.';
  }
  return errores;
}
