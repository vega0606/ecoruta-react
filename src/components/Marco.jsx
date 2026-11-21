import { NavLink, useLocation } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { useMenuCompacto } from '../hooks/useMenuCompacto.js';
import styles from './Marco.module.css';

// Marco compartido: menú con sección activa, preferencia y cierre de sesión.
export function Marco({ children }) {
  const { sesion, salir } = useAuth();
  const { pathname } = useLocation();
  const { compacto, alternar } = useMenuCompacto();
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState('');

  const clase = ({ isActive }) =>
    isActive ? styles.enlace + ' ' + styles.activo : styles.enlace;

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
        <p className={styles.marca}>♻️ EcoRuta</p>
        <nav aria-label="Principal" className={compacto ? styles.compacto : styles.menu}>
          <NavLink to="/" end className={clase}>Inicio</NavLink>
          {sesion ? (
            <NavLink to="/puntos" className={clase}>Mis puntos</NavLink>
          ) : sesion === null ? (
            <NavLink to="/acceso" className={clase}>Acceso</NavLink>
          ) : null}
        </nav>
        <div className={styles.controles}>
          <button type="button" className="btn btn-outline-secondary btn-sm"
            aria-pressed={compacto} onClick={alternar}>
            Menú compacto
          </button>
          {sesion && (
            <button type="button" className="btn btn-success btn-sm"
              disabled={pendiente} onClick={cerrar}>
              {pendiente ? 'Cerrando…' : 'Cerrar sesión'}
            </button>
          )}
        </div>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <p className={styles.ubicacion}>Ruta actual: {pathname}</p>
      </header>
      <main className={styles.contenido}>{children}</main>
    </>
  );
}
