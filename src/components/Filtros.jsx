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
    <form className="filtros-api" onSubmit={(e) => e.preventDefault()} aria-label="Buscar mis puntos">
      <div>
        <label htmlFor={prefijo + '-texto'}>Buscar por nombre</label>
        <input id={prefijo + '-texto'} name="texto" value={filtros.texto}
          onChange={actualizar} placeholder="Ej. Plaza" disabled={disabled} />
      </div>
      <div>
        <label htmlFor={prefijo + '-categoria'}>Categoría</label>
        <select id={prefijo + '-categoria'} name="categoria" value={filtros.categoria}
          onChange={actualizar} disabled={disabled}>
          <option value="">Todas</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button type="button" className="boton-secundario" disabled={disabled}
        onClick={() => onCambiar({ texto: '', categoria: '' })}>
        Limpiar
      </button>
    </form>
  );
}
