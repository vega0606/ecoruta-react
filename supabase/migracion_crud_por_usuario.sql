-- OBJETIVO: habilitar el CRUD por cuenta sobre public.puntos_reciclaje (tercer corte).
-- Se ejecuta UNA vez en Supabase > SQL Editor, sobre la tabla que ya creaste en el
-- segundo corte (supabase/puntos_reciclaje.sql del repositorio anterior).
-- No recrea la tabla ni borra datos. Usa solo datos ficticios al probar.

-- PASO 1. Propietario de cada fila (Supabase Auth). Las filas anteriores quedan con null.
alter table public.puntos_reciclaje
  add column if not exists user_id uuid
    default auth.uid()
    references auth.users (id) on delete cascade;

create index if not exists puntos_reciclaje_user_id_idx
  on public.puntos_reciclaje (user_id);

-- PASO 2. RLS sigue activo. Quitamos la lectura pública anterior: con ella,
-- cualquier persona vería también las filas privadas de otras cuentas.
alter table public.puntos_reciclaje enable row level security;
drop policy if exists "lectura_publica_puntos" on public.puntos_reciclaje;

-- PASO 3. Privilegios mínimos. anon ya no accede; authenticated opera solo con RLS.
revoke all on table public.puntos_reciclaje from anon, authenticated;
grant select, insert, update, delete on table public.puntos_reciclaje to authenticated;
-- Con identity, el insert necesita usar la secuencia del id.
grant usage, select on all sequences in schema public to authenticated;

-- PASO 4. Políticas: cada cuenta ve y cambia únicamente sus filas.
create policy "puntos_select_propios"
on public.puntos_reciclaje for select to authenticated
using (user_id = (select auth.uid()));

create policy "puntos_insert_propios"
on public.puntos_reciclaje for insert to authenticated
with check (user_id = (select auth.uid()));

-- UPDATE comprueba la fila existente (using) y el resultado (with check):
-- no se puede cambiar el propietario para apropiarse de otra fila.
create policy "puntos_update_propios"
on public.puntos_reciclaje for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "puntos_delete_propios"
on public.puntos_reciclaje for delete to authenticated
using (user_id = (select auth.uid()));

-- Las restricciones check de la tabla original (nombre, dirección, categorías,
-- lat/lng) se conservan: NOT NULL por sí solo no rechaza textos vacíos.
