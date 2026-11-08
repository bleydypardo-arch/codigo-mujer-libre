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
