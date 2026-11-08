-- Código Mujer Libre — Campaña: las 7 esferas que salen de la caja sorpresa.
-- Se pega UNA vez en Supabase → SQL Editor → Run. Es seguro repetirlo y NO borra nada.
-- Qué hace: permite las 7 esferas (Fe, Sabiduría, Amor, Fortaleza, Propósito, Diligencia, Gratitud)
-- y hace que la caja le dé primero una esfera que aún no tiene, para que pueda completar su colección.

alter table public.campaign_days drop constraint if exists campaign_days_element_check;
alter table public.campaign_days add constraint campaign_days_element_check
  check (element in ('fe','sabiduria','amor','fortaleza','proposito','diligencia','gratitud','emprendimiento','bienestar','libertad','crecimiento','liderazgo','emprende','viajes','boutiques','comunidad','eventos','premios','orquidea','matcha'));

create or replace function public.campaign_open_box() returns public.campaign_days
language plpgsql security definer set search_path = public as $$
declare d date := public.campaign_today(); r public.campaign_days;
        els text[] := array['fe','sabiduria','amor','fortaleza','proposito','diligencia','gratitud'];
        pend text[]; pick text;
begin
  if auth.uid() is null or not public.is_approved() then raise exception 'not allowed'; end if;
  select * into r from public.campaign_days where user_id = auth.uid() and day = d;
  if found then return r; end if;
  select coalesce(array_agg(e), '{}') into pend from unnest(els) e
    where not exists (select 1 from public.campaign_days c where c.user_id = auth.uid() and c.element = e);
  if array_length(pend, 1) is null then pend := els; end if;
  pick := pend[1 + floor(random() * array_length(pend, 1))::int];
  insert into public.campaign_days (user_id, day, element) values (auth.uid(), d, pick) returning * into r;
  return r;
end $$;
revoke all on function public.campaign_open_box() from public, anon;
grant execute on function public.campaign_open_box() to authenticated;
