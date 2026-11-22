import { Link, NavLink } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { useMenuCompacto } from '../hooks/useMenuCompacto.js';
import styles from './Marco.module.css';

// Marco compartido: menú con sección activa, preferencia del dispositivo,
// acceso/cierre de sesión y pie. Permanece montado mientras cambian las rutas.
export function Marco({ children }) {
  const { sesion, salir } = useAuth();
  const { compacto, alternar } = useMenuCompacto();
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState('');

  const clase = ({ isActive }) =>
    isActive ? styles.enlace + ' ' + styles.activo : styles.enlace;
  const claseDestacada = ({ isActive }) =>
    clase({ isActive }) + ' ' + styles.destacado;

  async function cerrar() {
    setError('');
    setPendiente(true);
    try {
      await salir();
      // La ruta privada reacciona al cambio real de sesión.
    } catch {
      setError('No se pudo cerrar la sesión. Vuelve a intentar.');
    } finally {
      setPendiente(false);
    }
  }

  return (
    <>
      <header className={styles.cabecera}>
        <div className={styles.barra}>
          <Link to="/" className={styles.marca}>♻️ EcoRuta</Link>
          <nav aria-label="Principal" className={compacto ? styles.compacto : styles.menu}>
            <NavLink to="/" end className={clase}>Inicio</NavLink>
            <NavLink to="/puntos-reciclaje" className={clase}>Puntos de reciclaje</NavLink>
            <NavLink to="/campanas" className={clase}>Campañas</NavLink>
            <NavLink to="/puntos" className={clase}>Registrar un punto</NavLink>
            <NavLink to="/voluntariado" className={claseDestacada}>Unirse</NavLink>
            {sesion === null && <NavLink to="/acceso" className={clase}>Acceso</NavLink>}
            {sesion && (
              <button type="button" className={styles.boton} disabled={pendiente} onClick={cerrar}>
                {pendiente ? 'Cerrando…' : 'Cerrar sesión'}
              </button>
            )}
            <button type="button" className={styles.boton} aria-pressed={compacto} onClick={alternar}>
              Menú compacto
            </button>
          </nav>
        </div>
        {error && <p role="alert" className={styles.error}>{error}</p>}
      </header>

      <main>{children}</main>

      <footer className={styles.pie}>
        <h3>EcoRuta</h3>
        <p>© 2026 EcoRuta. Todos los derechos reservados. Compromiso con el reciclaje comunitario.</p>
        <div>
          <a href="#">Privacidad</a>
          <a href="#">Términos de Servicio</a>
          <a href="#">Contacto</a>
          <a href="#">Mapa del Sitio</a>
        </div>
      </footer>
    </>
  );
}
