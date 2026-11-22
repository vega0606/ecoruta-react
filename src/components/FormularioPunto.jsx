import { useId, useState } from 'react';
import { CATEGORIAS, validarPunto } from '../services/validarPunto.js';
import { Ubicacion } from './Ubicacion.jsx';

function borradorDe(punto) {
  if (!punto) {
    return { nombre: '', direccion: '', horario: '', materiales: '', categorias: [], lat: '', lng: '' };
  }
  return {
    nombre: punto.nombre,
    direccion: punto.direccion,
    horario: punto.horario,
    materiales: punto.materiales.join(', '),
    categorias: punto.categorias,
    lat: String(punto.lat),
    lng: String(punto.lng),
  };
}

// Formulario controlado. punto = null crea; con un punto edita ese id.
// onGuardar recibe valores ya validados y devuelve una promesa (true si guardó).
export function FormularioPunto({ punto, ocupado, onGuardar, onCancelar }) {
  const prefijo = useId();
  const [borrador, setBorrador] = useState(() => borradorDe(punto));
  const [errores, setErrores] = useState({});

  function cambiar(event) {
    const { name, value } = event.target;
    setBorrador((actual) => ({ ...actual, [name]: value }));
  }

  function alternarCategoria(categoria) {
    setBorrador((actual) => ({
      ...actual,
      categorias: actual.categorias.includes(categoria)
        ? actual.categorias.filter((c) => c !== categoria)
        : [...actual.categorias, categoria],
    }));
  }

  async function enviar(event) {
    event.preventDefault();
    if (ocupado) return;
    const { errores: encontrados, valores } = validarPunto(borrador);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    await onGuardar(valores);
  }

  // Campo de texto con etiqueta asociada y mensaje de error accesible.
  function campo(nombre, etiqueta, props = {}) {
    const id = prefijo + '-' + nombre;
    return (
      <div>
        <label htmlFor={id}>{etiqueta}</label>
        <input id={id} name={nombre} value={borrador[nombre]} onChange={cambiar}
          aria-invalid={Boolean(errores[nombre])}
          aria-describedby={errores[nombre] ? id + '-error' : undefined} {...props} />
        {errores[nombre] && <p id={id + '-error'} className="campo-error">{errores[nombre]}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate aria-label={punto ? 'Editar punto' : 'Registrar un punto'}>
      <fieldset disabled={ocupado}>
        <h2 style={{ marginTop: 0 }}>{punto ? 'Editar punto' : 'Información del punto'}</h2>
        <div className="campos">
          {campo('nombre', 'Nombre del punto')}
          {campo('direccion', 'Dirección completa')}
          {campo('horario', 'Horario de atención', { placeholder: 'Lun-Vie 09:00 - 18:00' })}
          {campo('materiales', 'Materiales (separados por comas)', { placeholder: 'Papel, Cartón' })}
        </div>

        <fieldset style={{ marginTop: 14 }}>
          <legend>Categorías</legend>
          <div className="categorias">
            {CATEGORIAS.map((categoria) => {
              const id = prefijo + '-cat-' + categoria;
              return (
                <label key={categoria} htmlFor={id}>
                  <input id={id} type="checkbox" checked={borrador.categorias.includes(categoria)}
                    onChange={() => alternarCategoria(categoria)} />
                  {categoria}
                </label>
              );
            })}
          </div>
          {errores.categorias && <p className="campo-error" role="alert">{errores.categorias}</p>}
        </fieldset>

        <Ubicacion disabled={ocupado}
          onUbicada={({ lat, lng }) => setBorrador((a) => ({ ...a, lat: String(lat), lng: String(lng) }))} />
        <div className="campos">
          {campo('lat', 'Latitud', { inputMode: 'decimal' })}
          {campo('lng', 'Longitud', { inputMode: 'decimal' })}
        </div>

        <div className="acciones-form">
          <button type="submit">
            {ocupado ? 'Procesando…' : punto ? 'Guardar cambios' : 'Registrar punto'}
          </button>
          {punto && (
            <button type="button" className="boton-secundario" onClick={onCancelar}>
              Cancelar edición
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
