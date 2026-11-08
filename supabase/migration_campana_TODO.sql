-- Código Mujer Libre — Campaña Bogotá: boletos y colecciones para la rifa del 15 de diciembre.
-- Se pega UNA vez en Supabase → SQL Editor → Run. Es seguro repetirlo y NO borra nada.
-- Reglas: 1 boleto por cada día con la misión completa; cada 7 días con caja abierta = 1 colección completa = 3 boletos extra.
-- Para entrar a la rifa: mínimo 1 colección completa. Cada ciclo de 7 días reparte las 7 esferas sin repetir.

-- 1) La caja reparte las 7 esferas por ciclos de 7 días (no repite dentro del ciclo).
create or replace function public.campaign_open_box() returns public.campaign_days
language plpgsql security definer set search_path = public as $$
declare d date := public.campaign_today(); r public.campaign_days;
        els text[] := array['fe','sabiduria','amor','fortaleza','proposito','diligencia','gratitud'];
        n int; used text[]; pend text[]; pick text;
begin
  if auth.uid() is null or not public.is_approved() then raise exception 'not allowed'; end if;
  select * into r from public.campaign_days where user_id = auth.uid() and day = d;
  if found then return r; end if;
  select count(*) into n from public.campaign_days where user_id = auth.uid();
  select coalesce(array_agg(element), '{}') into used
    from (select element from public.campaign_days where user_id = auth.uid() order by day offset (n / 7) * 7) x;
  select coalesce(array_agg(e), '{}') into pend from unnest(els) e where not (e = any(used));
  if array_length(pend, 1) is null then pend := els; end if;
  pick := pend[1 + floor(random() * array_length(pend, 1))::int];
  insert into public.campaign_days (user_id, day, element) values (auth.uid(), d, pick) returning * into r;
  return r;
end $$;
revoke all on function public.campaign_open_box() from public, anon;
grant execute on function public.campaign_open_box() to authenticated;

-- 2) Tabla de boletos (solo administradoras).
drop function if exists public.campaign_standings(date, date);
create or replace function public.campaign_standings(p_from date default '2026-11-07', p_to date default '2026-12-15')
returns table (user_id uuid, nombre text, ciudad text, codigo text, dias_completos int, colecciones int, boletos int)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admins only'; end if;
  return query
    select p.id, coalesce(nullif(p.first_name, ''), p.display_name), p.city,
           'CML-' || upper(substr(replace(p.id::text, '-', ''), 1, 6)),
           (count(*) filter (where c.completed))::int,
           (count(*) / 7)::int,
           ((count(*) filter (where c.completed)) + 3 * (count(*) / 7))::int
    from public.campaign_days c join public.profiles p on p.id = c.user_id
    where c.day between p_from and p_to and p.city ilike '%bogot%'
    group by p.id, p.first_name, p.display_name, p.city
    order by 7 desc;
end $$;
revoke all on function public.campaign_standings(date, date) from public, anon;
grant execute on function public.campaign_standings(date, date) to authenticated;

-- 3) Sorteo ponderado (solo administradoras): más boletos = más probabilidad. Solo entran con mínimo 1 colección.
drop function if exists public.campaign_draw(int, int);
create or replace function public.campaign_draw(p_winners int default 3, p_min_sets int default 1)
returns table (puesto int, user_id uuid, nombre text, ciudad text, codigo text, boletos int)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admins only'; end if;
  return query
    select (row_number() over (order by t.k))::int, t.user_id, t.nombre, t.ciudad, t.codigo, t.boletos
    from (select s.user_id, s.nombre, s.ciudad, s.codigo, s.boletos, -ln(1 - random()) / greatest(s.boletos, 1) as k
          from public.campaign_standings() s where s.colecciones >= p_min_sets) t
    order by t.k limit p_winners;
end $$;
revoke all on function public.campaign_draw(int, int) from public, anon;
grant execute on function public.campaign_draw(int, int) to authenticated;

-- Código Mujer Libre — Campaña Bogotá: "Atrapa tu esfera". Cada mujer intenta varias veces al día y antes de las 5 p. m. siempre la consigue.
-- Se pega UNA vez en Supabase → SQL Editor → Run (después de migration_campana_boletos.sql). Es seguro repetirlo y NO borra nada.
-- Reglas: cada día se sortea en secreto en qué intento cae su esfera (1.º a 5.º). Entre intento e intento pasan 30 minutos
-- (las administradoras no esperan). Cada día hay una hora límite secreta (entre las 3 y las 5 p. m., hora de Bogotá, distinta cada día y para cada mujer):
-- pasada esa hora, el siguiente intento SIEMPRE la atrapa. Así nadie puede esperar a una hora fija, y todas la tienen antes de las 6.

create table if not exists public.campaign_tries (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  tries int not null default 0,
  target int not null,
  limit_hr int not null default 17,
  last_at timestamptz,
  primary key (user_id, day)
);
alter table public.campaign_tries add column if not exists limit_hr int not null default 17;
alter table public.campaign_tries enable row level security;
revoke all on public.campaign_tries from public, anon, authenticated;

create or replace function public.campaign_try() returns json
language plpgsql security definer set search_path = public as $$
declare d date := public.campaign_today(); r public.campaign_days; t public.campaign_tries;
        hr int := extract(hour from (now() at time zone 'America/Bogota'))::int;
        els text[] := array['fe','sabiduria','amor','fortaleza','proposito','diligencia','gratitud'];
        n int; used text[]; pend text[]; pick text; secs int;
begin
  if auth.uid() is null or not public.is_approved() then raise exception 'not allowed'; end if;
  select * into r from public.campaign_days where user_id = auth.uid() and day = d;
  if found then return json_build_object('caught', true, 'row', to_json(r)); end if;

  insert into public.campaign_tries (user_id, day, tries, target, limit_hr)
    values (auth.uid(), d, 0, (array[1,2,3,3,4,5])[1 + floor(random() * 6)::int], 15 + floor(random() * 3)::int) on conflict do nothing;
  select * into t from public.campaign_tries where user_id = auth.uid() and day = d for update;

  if hr < t.limit_hr and t.last_at is not null and not public.is_admin() and now() - t.last_at < interval '30 minutes' then
    secs := ceil(extract(epoch from (t.last_at + interval '30 minutes' - now())))::int;
    return json_build_object('caught', false, 'wait', secs, 'tries', t.tries);
  end if;

  update public.campaign_tries set tries = tries + 1, last_at = now() where user_id = auth.uid() and day = d returning * into t;
  if t.tries < t.target and hr < t.limit_hr then
    return json_build_object('caught', false, 'wait', case when public.is_admin() then 0 else 1800 end, 'tries', t.tries);
  end if;

  select count(*) into n from public.campaign_days where user_id = auth.uid();
  select coalesce(array_agg(element), '{}') into used
    from (select element from public.campaign_days where user_id = auth.uid() order by day offset (n / 7) * 7) x;
  select coalesce(array_agg(e), '{}') into pend from unnest(els) e where not (e = any(used));
  if array_length(pend, 1) is null then pend := els; end if;
  pick := pend[1 + floor(random() * array_length(pend, 1))::int];
  insert into public.campaign_days (user_id, day, element) values (auth.uid(), d, pick) returning * into r;
  return json_build_object('caught', true, 'row', to_json(r));
end $$;
revoke all on function public.campaign_try() from public, anon;
grant execute on function public.campaign_try() to authenticated;
