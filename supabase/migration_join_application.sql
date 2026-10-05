-- ============================================================================
-- Código Mujer Libre — NEW MEMBER APPLICATION (approved by the owner, Oct 2026)
-- Run ONCE in Supabase > SQL Editor. Safe to run more than once.
--
-- What it does (and nothing else):
--   1. Adds three fields to the existing members table (public.profiles):
--        phone        text   (the applicant's phone)
--        whatsapp     boolean (may we write to her on WhatsApp?)
--        application  jsonb  (her short answers + the date she accepted the guidelines)
--   2. Extends the existing sign-up function so a new application is saved:
--        phone, WhatsApp, birthday (month + day only, in the birth_month / birth_day
--        columns that already exist — the year is never asked or stored) and the answers.
--      Invalid values are skipped, so a sign-up can never fail because of the new fields.
--   3. Fills the new fields for anyone who already applied with the new form, from her
--      own sign-up answers — only where the new fields are still empty.
--
-- Not changed: roles, approval/rejection, security rules (RLS), Amilú's access,
-- existing columns or existing member data. Admins already read every profile;
-- a member reads only her own; member lists only show first name + photo.
-- ============================================================================

alter table public.profiles add column if not exists phone       text  not null default '';
alter table public.profiles add column if not exists whatsapp    boolean;
alter table public.profiles add column if not exists application jsonb not null default '{}'::jsonb;

-- Shared helper: the application answers from the sign-up data, cleaned and size-limited.
create or replace function public.cml_application_from_meta(meta jsonb) returns jsonb
language sql immutable set search_path = public as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'heard',      case when meta->'application'->>'heard' in ('friend','event','social','other') then meta->'application'->>'heard' end,
    'invited_by', nullif(left(trim(coalesce(meta->'application'->>'invited_by', '')), 80), ''),
    'smile',      nullif(left(trim(coalesce(meta->'application'->>'smile', '')), 300), ''),
    'guidelines', case when (meta->'application'->>'guidelines') = 'true' then true end,
    'lang',       case when meta->'application'->>'lang' in ('es','en') then meta->'application'->>'lang' end
  ))
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  picked text[] := '{}';
  bm int; bd int;
  app jsonb;
begin
  if jsonb_typeof(meta->'interests') = 'array' then
    select coalesce(array_agg(left(v, 40)), '{}') into picked
    from (select jsonb_array_elements_text(meta->'interests') as v limit 20) s;
  end if;
  -- birthday: month + day only, stored only when it is a real date
  if coalesce(meta->>'birth_month', '') ~ '^\d{1,2}$' and coalesce(meta->>'birth_day', '') ~ '^\d{1,2}$' then
    bm := (meta->>'birth_month')::int; bd := (meta->>'birth_day')::int;
    if not (bm between 1 and 12 and bd between 1 and
            (case bm when 2 then 29 when 4 then 30 when 6 then 30 when 9 then 30 when 11 then 30 else 31 end)) then
      bm := null; bd := null;
    end if;
  end if;
  app := public.cml_application_from_meta(meta);
  if app ? 'guidelines' then app := app || jsonb_build_object('guidelines_at', now()); end if;

  insert into public.profiles (id, email, display_name, first_name, last_name, company, city, interests,
                               phone, whatsapp, birth_month, birth_day, application)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    trim(left(coalesce(meta->>'first_name', '') || ' ' || coalesce(meta->>'last_name', ''), 120)),
    left(coalesce(meta->>'first_name', ''), 60),
    left(coalesce(meta->>'last_name', ''), 60),
    left(coalesce(meta->>'company', ''), 120),
    left(coalesce(meta->>'city', ''), 80),
    picked,
    left(regexp_replace(coalesce(meta->>'phone', ''), '[^0-9+() .-]', '', 'g'), 30),
    case when meta->>'whatsapp' in ('true', 'false') then (meta->>'whatsapp')::boolean end,
    bm, bd,
    app
  )
  on conflict (id) do nothing;
  return new;
end $$;

-- Fill the new fields for applicants who already used the new form (only empty fields).
update public.profiles p set
  phone       = left(regexp_replace(coalesce(u.raw_user_meta_data->>'phone', ''), '[^0-9+() .-]', '', 'g'), 30),
  whatsapp    = case when u.raw_user_meta_data->>'whatsapp' in ('true', 'false') then (u.raw_user_meta_data->>'whatsapp')::boolean end,
  application = public.cml_application_from_meta(u.raw_user_meta_data)
                || case when (u.raw_user_meta_data->'application'->>'guidelines') = 'true'
                        then jsonb_build_object('guidelines_at', u.created_at) else '{}'::jsonb end
from auth.users u
where u.id = p.id
  and p.phone = '' and p.application = '{}'::jsonb
  and u.raw_user_meta_data ? 'application';

revoke all on function public.cml_application_from_meta(jsonb) from public, anon;
