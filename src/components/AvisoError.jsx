import Alert from 'react-bootstrap/Alert';

// Componente de la librería visual (React Bootstrap) para errores reales.
export function AvisoError({ children }) {
  return <Alert variant="danger" role="alert">{children}</Alert>;
}
