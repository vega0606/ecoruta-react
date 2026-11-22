import test from 'node:test';
import assert from 'node:assert/strict';
import { validarInscripcion } from '../src/services/validarInscripcion.js';

const valido = { nombre: 'María Pérez', correo: 'maria@correo.com', telefono: '+57 300 123 4567', edad: '28', terminos: true };

test('acepta una inscripción completa', () => {
  assert.deepEqual(validarInscripcion(valido), {});
});

test('rechaza correo, teléfono, edad y términos inválidos', () => {
  assert.ok(validarInscripcion({ ...valido, correo: 'sin-arroba' }).correo);
  assert.ok(validarInscripcion({ ...valido, telefono: '123' }).telefono);
  assert.ok(validarInscripcion({ ...valido, edad: '15' }).edad);
  assert.ok(validarInscripcion({ ...valido, edad: '28.5' }).edad);
  assert.ok(validarInscripcion({ ...valido, terminos: false }).terminos);
  assert.ok(validarInscripcion({ ...valido, nombre: '  ' }).nombre);
});
