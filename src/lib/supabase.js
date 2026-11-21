import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !clave) {
  throw new Error('Completa .env.local (ver .env.example) y reinicia Vite.');
}

// Un único cliente compartido gestiona la sesión y los encabezados.
export const supabase = createClient(url, clave);
export const tabla = import.meta.env.VITE_TABLA_PUNTOS || 'puntos_reciclaje';
