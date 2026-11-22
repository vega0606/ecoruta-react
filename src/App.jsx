import { Link, Navigate, Route, Routes } from 'react-router';
import { useAuth } from './context/useAuth.js';
import { useTituloPagina } from './hooks/useTituloPagina.js';
import { Marco } from './components/Marco.jsx';
import { RutaPrivada } from './components/RutaPrivada.jsx';
import { PanelPuntos } from './components/PanelPuntos.jsx';
import { Acceso } from './pages/Acceso.jsx';
import { Campanas } from './pages/Campanas.jsx';
import { Detalle } from './pages/Detalle.jsx';
import { Inicio } from './pages/Inicio.jsx';
import { PuntosReciclaje } from './pages/PuntosReciclaje.jsx';
import { Voluntariado } from './pages/Voluntariado.jsx';

function Panel() {
  useTituloPagina('Registrar un punto');
  const { sesion } = useAuth();
  const cuenta = sesion.user.id;
  // La key separa el estado si cambia la cuenta.
  return <PanelPuntos key={cuenta} userId={cuenta} />;
}

function NoEncontrada() {
  useTituloPagina('Página no encontrada');
  return (
    <>
      <h1>Página no encontrada</h1>
      <p>La dirección que abriste no existe.</p>
      <Link className="boton" to="/">Volver al inicio</Link>
    </>
  );
}

export default function App() {
  return (
    <Marco>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/puntos-reciclaje" element={<PuntosReciclaje />} />
        <Route path="/campanas" element={<Campanas />} />
        <Route path="/voluntariado" element={<Voluntariado />} />
        <Route path="/acceso" element={<Acceso />} />
        {/* Direcciones del sitio anterior. */}
        <Route path="/registrar-punto" element={<Navigate to="/puntos" replace />} />
        {/* El guardián decide si llega a montarse cada página. */}
        <Route element={<RutaPrivada />}>
          <Route path="/puntos" element={<Panel />} />
          <Route path="/puntos/:id" element={<Detalle />} />
        </Route>
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </Marco>
  );
}
