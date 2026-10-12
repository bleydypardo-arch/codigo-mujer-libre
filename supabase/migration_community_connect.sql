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

-- ---------------------------------------------------------------------------
-- Formulario nuevo: "¿A qué te dedicas hoy?" y "¿Qué sueño todavía vive en ti?"
-- La función que limpia las respuestas del formulario ahora también guarda esas dos.
create or replace function public.cml_application_from_meta(meta jsonb) returns jsonb
language sql immutable set search_path = public as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'heard',      case when meta->'application'->>'heard' in ('friend','event','social','other') then meta->'application'->>'heard' end,
    'invited_by', nullif(left(trim(coalesce(meta->'application'->>'invited_by', '')), 80), ''),
    'smile',      nullif(left(trim(coalesce(meta->'application'->>'smile', '')), 300), ''),
    'occupation', nullif(left(trim(coalesce(meta->'application'->>'occupation', '')), 120), ''),
    'dream',      nullif(left(trim(coalesce(meta->'application'->>'dream', '')), 300), ''),
    'guidelines', case when (meta->'application'->>'guidelines') = 'true' then true end,
    'lang',       case when meta->'application'->>'lang' in ('es','en') then meta->'application'->>'lang' end
  ))
$$;

-- Para que una integrante ya aprobada pueda completar estas dos respuestas desde "Mi perfil".
create or replace function public.set_my_story(p_occupation text, p_dream text)
returns void language sql security definer set search_path = public as $$
  update public.profiles
     set application = coalesce(application, '{}'::jsonb)
       || jsonb_build_object('occupation', left(trim(coalesce(p_occupation, '')), 120),
                             'dream',      left(trim(coalesce(p_dream, '')), 300))
   where id = auth.uid()
$$;
revoke all on function public.set_my_story(text, text) from public, anon;
grant execute on function public.set_my_story(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Reportar y bloquear
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('post','member')),
  target_id uuid,
  target_user uuid,
  reason text not null default '' check (char_length(reason) <= 40),
  excerpt text not null default '' check (char_length(excerpt) <= 300),
  status text not null default 'open' check (status in ('open','done')),
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "reports send" on public.reports;
create policy "reports send" on public.reports for insert to authenticated
  with check (reporter = auth.uid() and public.is_approved());
drop policy if exists "reports read admin" on public.reports;
create policy "reports read admin" on public.reports for select to authenticated using (public.is_admin());
drop policy if exists "reports update admin" on public.reports;
create policy "reports update admin" on public.reports for update to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.reports from public, anon;
grant select, insert on public.reports to authenticated;
grant update (status) on public.reports to authenticated;

create table if not exists public.blocks (
  blocker uuid not null references public.profiles(id) on delete cascade,
  blocked uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked),
  check (blocker <> blocked)
);
alter table public.blocks enable row level security;
drop policy if exists "blocks own" on public.blocks;
create policy "blocks own" on public.blocks for all to authenticated
  using (blocker = auth.uid()) with check (blocker = auth.uid() and public.is_approved());
revoke all on public.blocks from public, anon;
grant select, insert, delete on public.blocks to authenticated;

-- ---------------------------------------------------------------------------
-- WhatsApp opcional entre dos mujeres conectadas.
-- El número solo se muestra cuando las DOS aceptaron conocerse y las DOS eligieron compartirlo.
alter table public.connections add column if not exists from_share boolean not null default false;
alter table public.connections add column if not exists to_share boolean not null default false;

create or replace function public.share_whatsapp(p_other uuid, p_share boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_approved() then return; end if;
  update public.connections set from_share = p_share
   where from_user = auth.uid() and to_user = p_other and status = 'accepted';
  update public.connections set to_share = p_share
   where to_user = auth.uid() and from_user = p_other and status = 'accepted';
end $$;
revoke all on function public.share_whatsapp(uuid, boolean) from public, anon;
grant execute on function public.share_whatsapp(uuid, boolean) to authenticated;

create or replace function public.connection_phone(p_other uuid)
returns text language sql stable security definer set search_path = public as $$
  select p.phone
    from public.connections c
    join public.profiles p on p.id = p_other
   where c.status = 'accepted' and c.from_share and c.to_share and public.is_approved()
     and ((c.from_user = auth.uid() and c.to_user = p_other) or (c.to_user = auth.uid() and c.from_user = p_other))
     and coalesce(p.phone, '') <> ''
$$;
revoke all on function public.connection_phone(uuid) from public, anon;
grant execute on function public.connection_phone(uuid) to authenticated;
