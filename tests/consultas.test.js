import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buscarPorId, buscarPorMaterial, buscarPorTermino, buscarPorUbicacion,
  distanciaMetros, filtrarPorCategoria, normalizarTexto, puntoMasCercano,
} from '../src/services/consultas.js';

const puntos = [
  { id: 1, nombre: 'Centro Comunitario Norte', direccion: 'Av. Siempreviva 742', materiales: ['Papel', 'Cartón'], categorias: ['Papel', 'Vidrio'], lat: 4.556, lng: -75.67, activo: true },
  { id: 2, nombre: 'Punto Limpio Plaza Central', direccion: 'Plaza de Armas', materiales: ['Plástico PET', 'Latas'], categorias: ['Plástico', 'Metal'], lat: 4.5348, lng: -75.6757, activo: true },
  { id: 3, nombre: 'Ecoparque Sur', direccion: 'Calle del Parque 123', materiales: ['Electrónicos', 'Pilas'], categorias: ['Electrónicos'], lat: 4.51, lng: -75.69, activo: false },
];

test('normalizarTexto ignora tildes, mayúsculas y espacios', () => {
  assert.equal(normalizarTexto('  Plástico '), 'plastico');
});

test('filtrarPorCategoria descarta inactivos y respeta «Todo»', () => {
  assert.equal(filtrarPorCategoria(puntos, 'Todo').length, 2);
  assert.deepEqual(filtrarPorCategoria(puntos, 'Metal').map((p) => p.id), [2]);
  assert.deepEqual(filtrarPorCategoria(puntos, 'Electrónicos'), []);
});

test('buscarPorId devuelve undefined si no existe', () => {
  assert.equal(buscarPorId(puntos, 2).nombre, 'Punto Limpio Plaza Central');
  assert.equal(buscarPorId(puntos, 99), undefined);
});

test('búsquedas por material, ubicación y término', () => {
  assert.deepEqual(buscarPorMaterial(puntos, 'plastico').map((p) => p.id), [2]);
  assert.equal(buscarPorMaterial(puntos, '   ').length, 3);
  assert.deepEqual(buscarPorUbicacion(puntos, 'plaza').map((p) => p.id), [2]);
  assert.deepEqual(buscarPorTermino(puntos, 'pilas').map((p) => p.id), [3]);
  assert.deepEqual(buscarPorTermino(puntos, 'xyz'), []);
});

test('distancia y punto más cercano', () => {
  assert.equal(distanciaMetros({ lat: 4.5, lng: -75.6 }, { lat: 4.5, lng: -75.6 }), 0);
  // ~111 km por grado de latitud
  const km = distanciaMetros({ lat: 0, lng: 0 }, { lat: 1, lng: 0 }) / 1000;
  assert.ok(km > 110 && km < 112);
  const cerca = puntoMasCercano(puntos, { lat: 4.5349, lng: -75.6758 });
  assert.equal(cerca.punto.id, 2);
  assert.equal(puntoMasCercano([], { lat: 0, lng: 0 }), null);
});
