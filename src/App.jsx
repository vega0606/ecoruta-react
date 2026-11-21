import { Link, Route, Routes } from 'react-router';
import { useAuth } from './context/useAuth.js';
import { Marco } from './components/Marco.jsx';
import { RutaPrivada } from './components/RutaPrivada.jsx';
import { PanelPuntos } from './components/PanelPuntos.jsx';
import { Acceso } from './pages/Acceso.jsx';
import { Detalle } from './pages/Detalle.jsx';
import { Inicio } from './pages/Inicio.jsx';

function Panel() {
  const { sesion } = useAuth();
  const cuenta = sesion.user.id;
  // La key separa el estado si cambia la cuenta.
  return <PanelPuntos key={cuenta} userId={cuenta} />;
}

function NoEncontrada() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}

export default function App() {
  return (
    <Marco>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/acceso" element={<Acceso />} />
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
