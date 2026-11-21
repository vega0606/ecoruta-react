import test from 'node:test';
import assert from 'node:assert/strict';
import { validarPunto, separarMateriales } from '../src/services/validarPunto.js';

const valido = {
  nombre: 'Punto Limpio Plaza',
  direccion: 'Plaza de Armas',
  horario: 'Todos los días: 24hrs',
  materiales: 'Plástico PET, Latas',
  categorias: ['Plástico', 'Metal'],
  lat: '4.5348',
  lng: '-75.6757',
};

test('acepta un punto completo y normaliza los valores', () => {
  const { errores, valores } = validarPunto(valido);
  assert.deepEqual(errores, {});
  assert.deepEqual(valores.materiales, ['Plástico PET', 'Latas']);
  assert.equal(valores.lat, 4.5348);
  assert.equal(valores.lng, -75.6757);
});

test('rechaza nombre con solo espacios, categorías vacías o inexistentes', () => {
  assert.ok(validarPunto({ ...valido, nombre: '    ' }).errores.nombre);
  assert.ok(validarPunto({ ...valido, categorias: [] }).errores.categorias);
  assert.ok(validarPunto({ ...valido, categorias: ['Orgánico'] }).errores.categorias);
});

test('rechaza coordenadas fuera de rango o no numéricas', () => {
  assert.ok(validarPunto({ ...valido, lat: '91' }).errores.lat);
  assert.ok(validarPunto({ ...valido, lng: '-181' }).errores.lng);
  assert.ok(validarPunto({ ...valido, lat: 'abc' }).errores.lat);
  assert.ok(validarPunto({ ...valido, lng: '' }).errores.lng);
});

test('separarMateriales ignora vacíos y espacios', () => {
  assert.deepEqual(separarMateriales(' Papel , ,cartón,, '), ['Papel', 'cartón']);
  assert.deepEqual(separarMateriales(undefined), []);
});
