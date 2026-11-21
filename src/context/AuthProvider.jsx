import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { AuthContext } from './useAuth.js';

export function AuthProvider({ children }) {
  // undefined: comprobando; null: sin sesión; objeto: con sesión.
  const [sesion, setSesion] = useState(undefined);

  useEffect(() => {
    // También informa la sesión restaurada (INITIAL_SESSION).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => setSesion(nuevaSesion)
    );
    return () => subscription.unsubscribe();
  }, []);

  async function entrar() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/acceso' },
    });
    if (error) throw error;
  }

  async function salir() {
    // Cierra la sesión de este dispositivo, no la de todos.
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
  }

  // Solo la identidad visible sale del proveedor; el SDK conserva el token.
  const sesionVista = sesion ? { user: sesion.user } : sesion;
  return (
    <AuthContext.Provider value={{ sesion: sesionVista, entrar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}
