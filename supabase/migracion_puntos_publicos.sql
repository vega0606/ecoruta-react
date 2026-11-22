-- OBJETIVO: que el inicio y el mapa públicos muestren los puntos de ejemplo
-- (las filas sin dueño, user_id null) a cualquier visitante, SIN abrir los puntos
-- privados de cada cuenta. Se ejecuta DESPUÉS de migracion_crud_por_usuario.sql.

-- anon necesita el privilegio SELECT; RLS decide qué filas puede ver.
grant select on table public.puntos_reciclaje to anon;

drop policy if exists "puntos_select_publicos" on public.puntos_reciclaje;
create policy "puntos_select_publicos"
on public.puntos_reciclaje for select to anon, authenticated
using (user_id is null and activo = true);

-- Resultado:
--   sin sesión  -> ve solo los puntos de ejemplo (user_id null).
--   con sesión  -> ve esos mismos más los suyos (política puntos_select_propios).
--   nadie ve filas de otra cuenta, y anon no puede insertar, editar ni borrar.
