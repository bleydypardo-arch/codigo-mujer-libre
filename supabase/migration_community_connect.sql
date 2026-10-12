-- Código Mujer Libre — Community "tarjetas" + Saludar/Conectar (paso 1)
-- Se pega UNA vez en Supabase → SQL Editor → Run. Es seguro repetirlo.
-- Qué hace:
--  1) La lista de integrantes ahora también devuelve foto, ciudad, "a qué se dedica" y "su sueño".
--  2) Crea la tabla "connections" (saludos entre mujeres) con reglas de privacidad:
--     cada mujer solo ve los saludos que envió o recibió.

drop function if exists public.community_members();
create or replace function public.community_members()
returns table (id uuid, first_name text, interests text[], avatar_path text, city text, occupation text, dream text)
language sql stable security definer set search_path = public as $$
  select p.id, p.first_name, p.interests, p.avatar_path, p.city,
         nullif(left(p.application->>'occupation', 120), ''),
         nullif(left(p.application->>'dream', 300), '')
  from public.profiles p
  where p.first_name <> '' and public.is_approved()
  order by p.created_at desc
  limit 100
$$;
revoke all on function public.community_members() from public, anon;
grant execute on function public.community_members() to authenticated;

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references public.profiles(id) on delete cascade,
  to_user uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  unique (from_user, to_user),
  check (from_user <> to_user)
);
alter table public.connections enable row level security;

drop policy if exists "connections read own" on public.connections;
create policy "connections read own" on public.connections
  for select to authenticated using (from_user = auth.uid() or to_user = auth.uid());

drop policy if exists "connections send" on public.connections;
create policy "connections send" on public.connections
  for insert to authenticated
  with check (from_user = auth.uid() and status = 'pending' and public.is_approved());

drop policy if exists "connections answer" on public.connections;
create policy "connections answer" on public.connections
  for update to authenticated
  using (to_user = auth.uid() and public.is_approved())
  with check (to_user = auth.uid() and status in ('accepted','declined'));

drop policy if exists "connections remove own" on public.connections;
create policy "connections remove own" on public.connections
  for delete to authenticated using (from_user = auth.uid() or to_user = auth.uid());

revoke all on public.connections from public, anon;
grant select, insert, delete on public.connections to authenticated;
grant update (status) on public.connections to authenticated;
