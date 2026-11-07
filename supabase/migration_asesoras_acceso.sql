-- Código ML Asesoras · acceso seguro con códigos que vencen, se bloquean y se administran desde la app.
-- PASO ÚNICO: cambia  PON_AQUI_TU_CODIGO  (casi al final) por TU código de administradora de 6 NÚMEROS, y toca "Run".
-- Los códigos NO se pueden leer desde afuera: solo se usan por las funciones de abajo.

create table if not exists public.advisor_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[0-9]{6}$'),
  nombre text not null,
  ciudad text not null default '',
  pais text not null default 'co' check (pais in ('co','do','es','us')),
  rol text not null default 'asesora' check (rol in ('asesora','lider','admin')),
  valid_from date not null default current_date,
  valid_to date,
  activo boolean not null default true,
  last_login timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.advisor_sessions (
  token uuid primary key default gen_random_uuid(),
  code_id uuid not null references public.advisor_codes(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table if not exists public.advisor_attempts (
  id bigserial primary key,
  at timestamptz not null default now(),
  ok boolean not null
);
alter table public.advisor_codes enable row level security;
alter table public.advisor_sessions enable row level security;
alter table public.advisor_attempts enable row level security;
revoke all on public.advisor_codes, public.advisor_sessions, public.advisor_attempts from anon, authenticated;

create or replace function public._adv_ok(r public.advisor_codes) returns boolean
language sql immutable as $$
  select r.activo and r.valid_from <= current_date and (r.valid_to is null or r.valid_to >= current_date)
$$;

create or replace function public.advisor_login(p_code text) returns json
language plpgsql security definer set search_path = public as $$
declare r public.advisor_codes; fails int; tok uuid;
begin
  delete from public.advisor_attempts where at < now() - interval '1 day';
  select count(*) into fails from public.advisor_attempts where at > now() - interval '10 minutes' and not ok;
  if fails >= 15 then return json_build_object('ok', false, 'error', 'demasiados'); end if;
  select * into r from public.advisor_codes where code = trim(p_code);
  if not found then
    insert into public.advisor_attempts(ok) values (false);
    return json_build_object('ok', false, 'error', 'invalido');
  end if;
  if not public._adv_ok(r) then
    insert into public.advisor_attempts(ok) values (false);
    return json_build_object('ok', false, 'error', case when not r.activo then 'bloqueado' else 'vencido' end);
  end if;
  insert into public.advisor_sessions(code_id, expires_at) values (r.id, now() + interval '12 hours') returning token into tok;
  update public.advisor_codes set last_login = now() where id = r.id;
  return json_build_object('ok', true, 'token', tok, 'id', r.id, 'nombre', r.nombre, 'ciudad', r.ciudad, 'pais', r.pais, 'rol', r.rol);
end $$;

create or replace function public.advisor_check(p_token uuid) returns json
language plpgsql security definer set search_path = public as $$
declare r public.advisor_codes;
begin
  select c.* into r from public.advisor_sessions s join public.advisor_codes c on c.id = s.code_id
   where s.token = p_token and s.expires_at > now();
  if not found or not public._adv_ok(r) then return json_build_object('ok', false); end if;
  return json_build_object('ok', true, 'id', r.id, 'nombre', r.nombre, 'ciudad', r.ciudad, 'pais', r.pais, 'rol', r.rol);
end $$;

create or replace function public._adv_admin(p_token uuid) returns public.advisor_codes
language plpgsql security definer set search_path = public as $$
declare r public.advisor_codes;
begin
  select c.* into r from public.advisor_sessions s join public.advisor_codes c on c.id = s.code_id
   where s.token = p_token and s.expires_at > now();
  if not found or not public._adv_ok(r) or r.rol <> 'admin' then raise exception 'sin permiso'; end if;
  return r;
end $$;

create or replace function public.admin_list(p_token uuid) returns json
language plpgsql security definer set search_path = public as $$
begin
  perform public._adv_admin(p_token);
  return coalesce((select json_agg(row_to_json(t) order by t.created_at) from (
    select id, code, nombre, ciudad, pais, rol, valid_from, valid_to, activo, last_login, created_at from public.advisor_codes) t), '[]'::json);
end $$;

create or replace function public.admin_save(p_token uuid, p_id uuid, p_code text, p_nombre text, p_ciudad text, p_pais text, p_rol text, p_from date, p_to date) returns json
language plpgsql security definer set search_path = public as $$
declare nid uuid;
begin
  perform public._adv_admin(p_token);
  if p_id is null then
    insert into public.advisor_codes(code, nombre, ciudad, pais, rol, valid_from, valid_to)
    values (trim(p_code), p_nombre, coalesce(p_ciudad,''), p_pais, p_rol, coalesce(p_from, current_date), p_to) returning id into nid;
  else
    update public.advisor_codes set code = trim(p_code), nombre = p_nombre, ciudad = coalesce(p_ciudad,''), pais = p_pais, rol = p_rol,
           valid_from = coalesce(p_from, valid_from), valid_to = p_to where id = p_id returning id into nid;
  end if;
  return json_build_object('ok', true, 'id', nid);
exception when unique_violation then return json_build_object('ok', false, 'error', 'codigo_repetido');
end $$;

create or replace function public.admin_set_active(p_token uuid, p_id uuid, p_activo boolean) returns json
language plpgsql security definer set search_path = public as $$
declare me public.advisor_codes;
begin
  me := public._adv_admin(p_token);
  if me.id = p_id and not p_activo then return json_build_object('ok', false, 'error', 'no_te_bloquees'); end if;
  update public.advisor_codes set activo = p_activo where id = p_id;
  if not p_activo then delete from public.advisor_sessions where code_id = p_id; end if;
  return json_build_object('ok', true);
end $$;

create or replace function public.admin_delete(p_token uuid, p_id uuid) returns json
language plpgsql security definer set search_path = public as $$
declare me public.advisor_codes;
begin
  me := public._adv_admin(p_token);
  if me.id = p_id then return json_build_object('ok', false, 'error', 'no_te_borres'); end if;
  delete from public.advisor_codes where id = p_id;
  return json_build_object('ok', true);
end $$;

grant execute on function public.advisor_login(text), public.advisor_check(uuid),
  public.admin_list(uuid), public.admin_save(uuid, uuid, text, text, text, text, text, date, date),
  public.admin_set_active(uuid, uuid, boolean), public.admin_delete(uuid, uuid) to anon, authenticated;

-- Tu acceso de administradora (cambia el código por el tuyo; después puedes cambiarlo desde la app)
insert into public.advisor_codes(code, nombre, ciudad, pais, rol)
values ('PON_AQUI_TU_CODIGO', 'Jazz', 'Todas', 'us', 'admin')
on conflict (code) do nothing;
