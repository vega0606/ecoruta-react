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
      <div className="col-12 col-md-6">
        <label htmlFor={id} className="form-label">{etiqueta}</label>
        <input id={id} name={nombre} className={'form-control' + (errores[nombre] ? ' is-invalid' : '')}
          value={borrador[nombre]} onChange={cambiar}
          aria-invalid={Boolean(errores[nombre])}
          aria-describedby={errores[nombre] ? id + '-error' : undefined} {...props} />
        {errores[nombre] && (
          <div id={id + '-error'} className="invalid-feedback">{errores[nombre]}</div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate>
      <fieldset disabled={ocupado} className="row g-3">
        <legend className="h5">{punto ? 'Editar punto' : 'Registrar un punto'}</legend>
        {campo('nombre', 'Nombre')}
        {campo('direccion', 'Dirección')}
        {campo('horario', 'Horario', { placeholder: 'Lunes a viernes: 8:00 - 18:00' })}
        {campo('materiales', 'Materiales (separados por comas)', { placeholder: 'Papel, Cartón' })}

        <div className="col-12">
          <fieldset>
            <legend className="form-label fs-6">Categorías</legend>
            {CATEGORIAS.map((categoria) => {
              const id = prefijo + '-cat-' + categoria;
              return (
                <div key={categoria} className="form-check form-check-inline">
                  <input id={id} type="checkbox" className="form-check-input"
                    checked={borrador.categorias.includes(categoria)}
                    onChange={() => alternarCategoria(categoria)} />
                  <label htmlFor={id} className="form-check-label">{categoria}</label>
                </div>
              );
            })}
            {errores.categorias && (
              <div className="text-danger small" role="alert">{errores.categorias}</div>
            )}
          </fieldset>
        </div>

        <div className="col-12">
          <Ubicacion disabled={ocupado}
            onUbicada={({ lat, lng }) => setBorrador((a) => ({ ...a, lat: String(lat), lng: String(lng) }))} />
        </div>
        {campo('lat', 'Latitud', { inputMode: 'decimal' })}
        {campo('lng', 'Longitud', { inputMode: 'decimal' })}

        <div className="col-12 d-flex flex-wrap gap-2">
          <button type="submit" className="btn btn-success">
            {ocupado ? 'Procesando…' : punto ? 'Guardar cambios' : 'Registrar punto'}
          </button>
          {punto && (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
              Cancelar edición
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
