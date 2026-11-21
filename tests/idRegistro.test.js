import test from 'node:test';
import assert from 'node:assert/strict';
import { idValido } from '../src/services/idRegistro.js';

test('acepta el formato de las claves del proyecto', () => {
  assert.equal(idValido('24'), true);
  assert.equal(idValido('fa7391d5-7bb0-444d-9ec7-9924c400861b'), true);
});

test('rechaza entradas que no corresponden al contrato', () => {
  for (const entrada of [undefined, 24, '01', '12abc', '0', ' 24 ']) {
    assert.equal(idValido(entrada), false);
  }
});
