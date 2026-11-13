-- Corrige el borrado automático: un evento de varios días (ej. Navidad del 1 al 24 de dic) se borra
-- 5 días después de su ÚLTIMA fecha (fecha de fin), no de su fecha de inicio.
create or replace function public.plan_last_day(p_date date, p_details text)
returns date language plpgsql immutable as $$
declare e date;
begin
  if p_date is null then return null; end if;
  if p_details is not null and left(p_details, 4) = 'CML:' then
    begin
      e := nullif(substring(p_details from 5)::jsonb ->> 'end_date', '')::date;
    exception when others then e := null;
    end;
  end if;
  return greatest(p_date, coalesce(e, p_date));
end $$;

create or replace function public.delete_past_dated_plans()
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  with gone as (
    delete from public.plans
     where event_date is not null
       and kind in ('event', 'trip', 'wellness')
       and public.plan_last_day(event_date, details) < (current_date - 5)
    returning kind, coalesce(nullif(title_es, ''), title_en) as title, event_date, location
  )
  insert into public.deleted_plans_log (kind, title, event_date, location)
  select kind, title, event_date, location from gone;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.delete_past_dated_plans() from public, anon, authenticated;
