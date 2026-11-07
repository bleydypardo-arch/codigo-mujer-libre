-- Código Mujer Libre — Campaña "Primeras 50 fundadoras" (Bogotá): misión diaria, caja secreta y boletos.
-- Se pega UNA vez en Supabase → SQL Editor → Run. Es seguro repetirlo y NO cambia nada de lo que ya existe.
-- Qué hace:
--  1) Crea la tabla "campaign_days": un renglón por mujer y por día (qué elemento le tocó en la caja y qué pasos hizo).
--  2) Funciones para abrir la caja (el azar se decide aquí, en el servidor) y marcar los pasos de la misión.
--  3) Funciones SOLO para administradoras: ver la tabla de boletos y hacer el sorteo ponderado (más días = más oportunidades).
-- El día cambia a las 12 AM hora de Bogotá.

create table if not exists public.campaign_days (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  element text not null check (element in ('orquidea','bienestar','viajes','comunidad','matcha')),
  step_code boolean not null default false,
  step_question boolean not null default false,
  step_activity boolean not null default false,
  answer text,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);
alter table public.campaign_days enable row level security;
drop policy if exists "campaign own read" on public.campaign_days;
create policy "campaign own read" on public.campaign_days for select to authenticated using (user_id = auth.uid() or public.is_admin());
revoke all on public.campaign_days from public, anon;
grant select on public.campaign_days to authenticated;

create or replace function public.campaign_today() returns date language sql stable as $$
  select (now() at time zone 'America/Bogota')::date $$;
grant execute on function public.campaign_today() to authenticated;

-- Abrir la caja (una vez al día). Si ya la abrió, devuelve la de hoy.
create or replace function public.campaign_open_box() returns public.campaign_days
language plpgsql security definer set search_path = public as $$
declare d date := public.campaign_today(); r public.campaign_days;
        els text[] := array['orquidea','bienestar','viajes','comunidad','matcha'];
begin
  if auth.uid() is null or not public.is_approved() then raise exception 'not allowed'; end if;
  select * into r from public.campaign_days where user_id = auth.uid() and day = d;
  if found then return r; end if;
  insert into public.campaign_days (user_id, day, element) values (auth.uid(), d, els[1 + floor(random() * 5)::int]) returning * into r;
  return r;
end $$;
revoke all on function public.campaign_open_box() from public, anon;
grant execute on function public.campaign_open_box() to authenticated;

-- Marcar un paso de la misión de hoy: 'code', 'question' (con respuesta) o 'activity'.
create or replace function public.campaign_step(p_step text, p_answer text default null) returns public.campaign_days
language plpgsql security definer set search_path = public as $$
declare d date := public.campaign_today(); r public.campaign_days;
begin
  if auth.uid() is null or not public.is_approved() then raise exception 'not allowed'; end if;
  if p_step not in ('code','question','activity') then raise exception 'bad step'; end if;
  select * into r from public.campaign_days where user_id = auth.uid() and day = d;
  if not found then raise exception 'open the box first'; end if;
  update public.campaign_days set
    step_code = step_code or p_step = 'code',
    step_question = step_question or p_step = 'question',
    step_activity = step_activity or p_step = 'activity',
    answer = case when p_step = 'question' then left(coalesce(p_answer, ''), 80) else answer end
  where user_id = auth.uid() and day = d returning * into r;
  if r.step_code and r.step_question and r.step_activity and not r.completed then
    update public.campaign_days set completed = true where user_id = auth.uid() and day = d returning * into r;
  end if;
  return r;
end $$;
revoke all on function public.campaign_step(text, text) from public, anon;
grant execute on function public.campaign_step(text, text) to authenticated;

-- Solo administradoras: tabla de boletos de las inscritas en Bogotá (inscripción hasta el 12 de diciembre).
create or replace function public.campaign_standings(p_from date default '2026-11-09', p_to date default '2026-12-14')
returns table (user_id uuid, nombre text, ciudad text, dias_completos int, boletos int, elementos int)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admins only'; end if;
  return query
    select p.id, coalesce(nullif(p.first_name, ''), p.display_name), p.city,
           (count(*) filter (where c.completed))::int, (count(*) filter (where c.completed))::int, count(distinct c.element)::int
    from public.campaign_days c join public.profiles p on p.id = c.user_id
    where c.day between p_from and p_to and p.city ilike '%bogot%' and p.created_at < timestamptz '2026-12-13 00:00:00-05'
    group by p.id, p.first_name, p.display_name, p.city
    order by 5 desc;
end $$;
revoke all on function public.campaign_standings(date, date) from public, anon;
grant execute on function public.campaign_standings(date, date) to authenticated;

-- Solo administradoras: sorteo ponderado (cada día completo es un boleto). Devuelve las ganadoras en orden: 1.º, 2.º, 3.º.
create or replace function public.campaign_draw(p_winners int default 3, p_min_days int default 5)
returns table (puesto int, user_id uuid, nombre text, ciudad text, boletos int)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admins only'; end if;
  return query
    select (row_number() over (order by t.k))::int, t.user_id, t.nombre, t.ciudad, t.boletos
    from (select s.user_id, s.nombre, s.ciudad, s.boletos, -ln(1 - random()) / s.boletos as k
          from public.campaign_standings() s where s.boletos >= p_min_days) t
    order by t.k limit p_winners;
end $$;
revoke all on function public.campaign_draw(int, int) from public, anon;
grant execute on function public.campaign_draw(int, int) to authenticated;
