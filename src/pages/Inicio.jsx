import { Link } from 'react-router';
import { useAuth } from '../context/useAuth.js';

export function Inicio() {
  const { sesion } = useAuth();
  return (
    <section>
      <h1>EcoRuta</h1>
      <p className="lead">
        Plataforma para registrar y consultar puntos de reciclaje: dónde están,
        qué materiales reciben y en qué horario.
      </p>
      <p>
        Cada persona gestiona sus propios puntos. Inicia sesión con Google para
        crearlos, editarlos y eliminarlos.
      </p>
      {sesion ? (
        <Link className="btn btn-success" to="/puntos">Ir a mis puntos</Link>
      ) : (
        <Link className="btn btn-success" to="/acceso">Iniciar sesión</Link>
      )}
    </section>
  );
}
