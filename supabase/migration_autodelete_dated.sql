-- Código Mujer Libre — borrado automático de actividades CON FECHA ya pasadas (+ reporte de lo borrado)
-- QUÉ HACE: cada noche borra definitivamente los planes que tienen fecha (conciertos, congresos, tours, clases, eventos)
--   cuando pasaron más de 5 días de su fecha. Se ocultan solos al día siguiente; a los 5 días se borran. Igual en todas las ciudades.
-- REPORTE: antes de borrar, guarda en la tabla deleted_plans_log qué se borró (título, tipo, fecha, lugar y cuándo se borró).
--   Se ve en Admin -> pestaña «Borrados».
-- QUÉ NO TOCA NUNCA: todo lo que NO tiene fecha (restaurantes, spas, happy hours, cafés, lecturas, recetas).
--   La condición es event_date IS NOT NULL. Sin fecha = nunca se borra.
-- OJO: al borrar un plan también se borran sus respuestas («voy / no voy»), votaciones y datos asociados. No se recupera.
-- Costo: cero (pg_cron viene con Supabase). Seguro de correr más de una vez.

create extension if not exists pg_cron;

create table if not exists public.deleted_plans_log (
  id bigint generated always as identity primary key,
  deleted_at timestamptz not null default now(),
  kind text not null default '',
  title text not null default '',
  event_date date,
  location text not null default ''
);
alter table public.deleted_plans_log enable row level security;
drop policy if exists "deleted log read admin" on public.deleted_plans_log;
create policy "deleted log read admin" on public.deleted_plans_log
  for select to authenticated using (public.is_content_admin());

create or replace function public.delete_past_dated_plans()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare n integer;
begin
  with gone as (
    delete from public.plans
     where event_date is not null
       and kind in ('event', 'trip', 'wellness')
       and event_date < (current_date - 5)
    returning kind, coalesce(nullif(title_es, ''), title_en) as title, event_date, location
  )
  insert into public.deleted_plans_log (kind, title, event_date, location)
  select kind, title, event_date, location from gone;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.delete_past_dated_plans() from public, anon, authenticated;

select cron.unschedule('delete-past-dated-plans')
 where exists (select 1 from cron.job where jobname = 'delete-past-dated-plans');
select cron.schedule('delete-past-dated-plans', '15 7 * * *', $$select public.delete_past_dated_plans()$$);
