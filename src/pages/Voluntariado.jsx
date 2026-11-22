import { useId, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { validarInscripcion } from '../services/validarInscripcion.js';

const IMAGEN_EVENTO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDiFF2wjv0Xt2IBhfKJx-phzl18cDw6lU5X9HPdXDSDOf-Nq_d9AVyvnaFZo0uBZRfU6Xy9HR3X8dcwhbfPgT5zK5DXZSA24tqr_m8QDJZTkYE4yCFJ1J1S2Ow3CXdaUo6DYbBXbkgUa3e5Gl9_CnedrxU0u0EhMyiLcNZIR5As-DovS0wWUF2C986zmNXdEHT38UIFM1KWfQuFL6QELoiYtvqA8sKoyzNH7wGZB_9IaDai7HY9zx09OA';

const VACIO = { nombre: '', correo: '', telefono: '', edad: '', medico: '', terminos: false };

export function Voluntariado() {
  useTituloPagina('Voluntariado');
  const prefijo = useId();
  const { sesion } = useAuth();
  const [borrador, setBorrador] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [confirmacion, setConfirmacion] = useState('');

  // La cuenta es opcional: si hay sesión, se ofrece autocompletar nombre y correo.
  const usuario = sesion?.user;
  const nombreCuenta = usuario?.user_metadata?.full_name ?? usuario?.user_metadata?.name ?? '';

  function cambiar(event) {
    const { name, type, value, checked } = event.target;
    setBorrador((actual) => ({ ...actual, [name]: type === 'checkbox' ? checked : value }));
  }

  function usarCuenta() {
    setBorrador((actual) => ({
      ...actual,
      nombre: nombreCuenta || actual.nombre,
      correo: usuario.email ?? actual.correo,
    }));
  }

  function enviar(event) {
    event.preventDefault();
    const encontrados = validarInscripcion(borrador);
    setErrores(encontrados);
    setConfirmacion('');
    if (Object.keys(encontrados).length > 0) return;
    // Por ahora el envío es de prueba: todavía no se guarda en el servidor.
    setBorrador(VACIO);
    setConfirmacion('Datos recibidos. Por ahora el envío es de prueba: todavía no se guardan en el servidor.');
  }

  function campo(nombre, etiqueta, props = {}) {
    const id = prefijo + '-' + nombre;
    return (
      <>
        <label htmlFor={id}>{etiqueta}</label>
        <input id={id} name={nombre} value={borrador[nombre]} onChange={cambiar}
          aria-invalid={Boolean(errores[nombre])}
          aria-describedby={errores[nombre] ? id + '-error' : undefined} {...props} />
        {errores[nombre] && <p id={id + '-error'} className="campo-error">{errores[nombre]}</p>}
      </>
    );
  }

  return (
    <section className="voluntariado">
      <div>
        <h1 style={{ marginTop: 0 }}>Inscripción de Voluntariado</h1>
        <p>
          Únete a nuestra comunidad y haz una diferencia real en el medio ambiente.
          Completa el formulario para asegurar tu lugar.
        </p>
        <article className="detalles-evento">
          <h2 style={{ marginTop: 0 }}>Detalles del Evento</h2>
          <img src={IMAGEN_EVENTO} alt="Voluntarios realizando una limpieza de playa" loading="lazy" />
          <div>
            <h3>Nombre del Evento</h3>
            <p>Limpieza Costera - Playa del Sol</p>
          </div>
          <div>
            <h3>Fecha y Hora</h3>
            <p>Sábado, 14 de Noviembre, 2026<br />08:00 AM - 12:00 PM</p>
          </div>
          <div>
            <h3>Lugar</h3>
            <p style={{ marginBottom: 0 }}>Acceso Principal, Playa del Sol<br />Sector Norte</p>
          </div>
        </article>
      </div>

      <div>
        <section className="cuenta" aria-label="Tu cuenta">
          <h2>Tu cuenta</h2>
          {sesion === undefined && <p role="status">Comprobando sesión…</p>}
          {sesion === null && (
            <>
              <p>Sin sesión iniciada. Es opcional: con tu cuenta de Google puedes autocompletar tus datos.</p>
              <Link className="boton" to="/acceso">Continuar con Google</Link>
            </>
          )}
          {usuario && (
            <>
              <p>Sesión iniciada como <strong>{usuario.email}</strong>.</p>
              <button type="button" className="boton-secundario" onClick={usarCuenta}>
                Autocompletar mis datos
              </button>
            </>
          )}
        </section>

        <form onSubmit={enviar} noValidate aria-label="Inscripción de voluntariado">
          <h2 style={{ marginTop: 0 }}>Tus Datos</h2>
          {campo('nombre', 'Nombre completo:', { placeholder: 'Ej. María Pérez' })}
          {campo('correo', 'Correo electrónico:', { type: 'email', placeholder: 'tu@correo.com' })}
          {campo('telefono', 'Teléfono de contacto:', { type: 'tel', placeholder: '+57 300 123 4567' })}
          {campo('edad', 'Edad:', { type: 'number', min: 16, max: 99, placeholder: 'Ej. 28' })}

          <label htmlFor={prefijo + '-medico'}>Restricciones médicas o alergias:</label>
          <textarea id={prefijo + '-medico'} name="medico" rows="3" value={borrador.medico}
            onChange={cambiar} placeholder="Opcional..." />

          <label htmlFor={prefijo + '-terminos'}>
            <input id={prefijo + '-terminos'} type="checkbox" name="terminos"
              checked={borrador.terminos} onChange={cambiar} />
            <span>
              He leído y acepto los <a href="#">términos y condiciones</a> del evento, así como
              el descargo de responsabilidad para voluntarios.
            </span>
          </label>
          {errores.terminos && <p className="campo-error">{errores.terminos}</p>}

          <button type="submit">Confirmar inscripción</button>
          {confirmacion && <p role="status" style={{ marginTop: 16 }}>{confirmacion}</p>}
        </form>
      </div>
    </section>
  );
}
