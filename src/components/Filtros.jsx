import { useId } from 'react';
import { CATEGORIAS } from '../services/validarPunto.js';

// Los criterios viajan a la API (búsqueda por nombre y categoría).
export function Filtros({ filtros, onCambiar, disabled }) {
  const prefijo = useId();

  function actualizar(event) {
    const { name, value } = event.target;
    onCambiar({ ...filtros, [name]: value });
  }

  return (
    <fieldset className="row g-2 mb-3" disabled={disabled}>
      <legend className="h6">Buscar puntos</legend>
      <div className="col-12 col-md-6">
        <label htmlFor={prefijo + '-texto'} className="form-label">Nombre</label>
        <input id={prefijo + '-texto'} name="texto" className="form-control"
          value={filtros.texto} onChange={actualizar} placeholder="Ej. Plaza" />
      </div>
      <div className="col-12 col-md-4">
        <label htmlFor={prefijo + '-categoria'} className="form-label">Categoría</label>
        <select id={prefijo + '-categoria'} name="categoria" className="form-select"
          value={filtros.categoria} onChange={actualizar}>
          <option value="">Todas</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="col-12 col-md-2 d-flex align-items-end">
        <button type="button" className="btn btn-outline-secondary w-100"
          onClick={() => onCambiar({ texto: '', categoria: '' })}>
          Limpiar
        </button>
      </div>
    </fieldset>
  );
}
