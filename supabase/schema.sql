-- Código Mujer Libre — database setup (run once in Supabase → SQL Editor).
-- Safe to re-run: uses "if not exists" / "or replace" / drop-policy-if-exists.
-- Nothing here uses or exposes a secret key.

-- ============================================================
-- 1. PROFILES (one row per registered member)
-- ============================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  city          text,
  role          text not null default 'member',
  created_at    timestamptz not null default now()
);

-- Upgrade in place (works on a fresh project AND on the older profiles table, which had only
-- id, display_name, city, role, created_at). Nothing is dropped; existing rows are kept.
alter table public.profiles add column if not exists email      text not null default '';
alter table public.profiles add column if not exists first_name text not null default '';
alter table public.profiles add column if not exists last_name  text not null default '';
alter table public.profiles add column if not exists company    text not null default '';
alter table public.profiles add column if not exists interests  text[] not null default '{}';
update public.profiles set city = '' where city is null;
alter table public.profiles alter column city set default '';
alter table public.profiles alter column city set not null;
alter table public.profiles alter column role set default 'member';
update public.profiles set role = 'member' where role not in ('member','admin','super_admin');
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('member','admin','super_admin'));
update public.profiles p set email = lower(u.email) from auth.users u where u.id = p.id and p.email = '';
update public.profiles set first_name = display_name where first_name = '' and coalesce(display_name,'') <> '';

-- Role helpers (SECURITY DEFINER so policies can call them without recursion)
create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin','super_admin') from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'super_admin' from public.profiles where id = auth.uid()), false)
$$;

-- Create the profile automatically when someone signs up.
-- The role is ALWAYS 'member' here; client-supplied metadata can never grant admin.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  picked text[] := '{}';
begin
  if jsonb_typeof(meta->'interests') = 'array' then
    select coalesce(array_agg(left(v, 40)), '{}') into picked
    from (select jsonb_array_elements_text(meta->'interests') as v limit 20) s;
  end if;
  insert into public.profiles (id, email, display_name, first_name, last_name, company, city, interests)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    trim(left(coalesce(meta->>'first_name', '') || ' ' || coalesce(meta->>'last_name', ''), 120)),
    left(coalesce(meta->>'first_name', ''), 60),
    left(coalesce(meta->>'last_name', ''), 60),
    left(coalesce(meta->>'company', ''), 120),
    left(coalesce(meta->>'city', ''), 80),
    picked
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

-- Remove the older policies from the previous profiles design ("update own profile" would let a
-- member change her own role). The stricter policies below replace them.
drop policy if exists "insert own profile" on public.profiles;
drop policy if exists "read own profile"   on public.profiles;
drop policy if exists "update own profile" on public.profiles;

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- Members may edit their own profile but never change their own role.
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = public.my_role());

-- Only the super admin can promote/demote others (to member or admin).
drop policy if exists "profiles super admin update" on public.profiles;
create policy "profiles super admin update" on public.profiles
  for update to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin() and (role in ('member','admin') or id = auth.uid()));

-- ============================================================
-- 2. PLANS (events, future trips, home highlights, wellness cards)
-- ============================================================
create table if not exists public.plans (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('event','trip','home','wellness')),
  code        text check (code is null or code in
                ('Social','Wellness','Faith','Adventure','Family','Connection','Support','Recharge')),
  title_es    text not null default '',
  title_en    text not null default '',
  desc_es     text not null default '',
  desc_en     text not null default '',
  event_date  date,                      -- the month shown in the app is derived from this
  event_time  text not null default '',
  date_text   text not null default '',  -- tentative dates for trips ("late spring", "May 15-17")
  location    text not null default '',
  price       text not null default '',  -- approximate price / budget
  url         text not null default '' check (url = '' or url ~* '^https?://'),
  details     text not null default '',  -- "More details / contact"
  image_url   text not null default '' check (image_url = '' or image_url ~* '^https?://'),
  published   boolean not null default false,
  created_by  uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists plans_kind_date_idx on public.plans (kind, event_date);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists plans_touch on public.plans;
create trigger plans_touch before update on public.plans
  for each row execute function public.touch_updated_at();

alter table public.plans enable row level security;

drop policy if exists "plans read published or admin" on public.plans;
create policy "plans read published or admin" on public.plans
  for select to authenticated using (published or public.is_admin());

drop policy if exists "plans admin insert" on public.plans;
create policy "plans admin insert" on public.plans
  for insert to authenticated with check (public.is_admin());

drop policy if exists "plans admin update" on public.plans;
create policy "plans admin update" on public.plans
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "plans admin delete" on public.plans;
create policy "plans admin delete" on public.plans
  for delete to authenticated using (public.is_admin());

-- ============================================================
-- 3. RESPONSES (❤️ Interested / ✓ Going), stored centrally
-- ============================================================
create table if not exists public.responses (
  plan_id     uuid not null references public.plans(id) on delete cascade,
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  status      text not null check (status in ('interested','going')),
  created_at  timestamptz not null default now(),
  primary key (plan_id, user_id)
);
alter table public.responses enable row level security;

-- Privacy: a member sees only her own response rows; admins see everyone's.
-- Members see COUNTS only, through plan_counts() below.
drop policy if exists "responses read own or admin" on public.responses;
create policy "responses read own or admin" on public.responses
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "responses insert own" on public.responses;
create policy "responses insert own" on public.responses
  for insert to authenticated
  with check (user_id = auth.uid()
              and exists (select 1 from public.plans p where p.id = plan_id and p.published));

drop policy if exists "responses update own" on public.responses;
create policy "responses update own" on public.responses
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "responses delete own" on public.responses;
create policy "responses delete own" on public.responses
  for delete to authenticated using (user_id = auth.uid());

create or replace function public.plan_counts()
returns table (plan_id uuid, interested bigint, going bigint)
language sql stable security definer set search_path = public as $$
  select r.plan_id,
         count(*) filter (where r.status = 'interested'),
         count(*) filter (where r.status = 'going')
  from public.responses r
  join public.plans p on p.id = r.plan_id and p.published
  group by r.plan_id
$$;

-- ============================================================
-- 4. COMMUNITY (shared posts + member list)
-- ============================================================
create table if not exists public.community_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  author_name text not null default '',
  body        text not null check (char_length(body) between 1 and 1000),
  created_at  timestamptz not null default now()
);
alter table public.community_posts enable row level security;

drop policy if exists "posts read" on public.community_posts;
create policy "posts read" on public.community_posts
  for select to authenticated using (true);

drop policy if exists "posts insert own" on public.community_posts;
create policy "posts insert own" on public.community_posts
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "posts delete own or admin" on public.community_posts;
create policy "posts delete own or admin" on public.community_posts
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- Members only learn each other's FIRST NAME and interests (no email, company or last name).
create or replace function public.community_members()
returns table (first_name text, interests text[])
language sql stable security definer set search_path = public as $$
  select first_name, interests from public.profiles
  where first_name <> ''
  order by created_at desc
  limit 100
$$;

-- ============================================================
-- 5. PRIVATE MESSAGES to the administrator
-- ============================================================
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  type        text not null default 'message'
              check (type in ('message','talk','prayer','idea','family')),
  body        text not null check (char_length(body) between 1 and 4000),
  admin_reply text not null default '',
  replied_at  timestamptz,
  created_at  timestamptz not null default now()
);
alter table public.messages enable row level security;

drop policy if exists "messages read own or admin" on public.messages;
create policy "messages read own or admin" on public.messages
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "messages insert own" on public.messages;
create policy "messages insert own" on public.messages
  for insert to authenticated with check (user_id = auth.uid() and admin_reply = '');

drop policy if exists "messages admin update" on public.messages;
create policy "messages admin update" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 6. SETTINGS (hero image, message of the day) — readable by everyone, edited by admins
-- ============================================================
create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);
alter table public.settings enable row level security;

drop policy if exists "settings read" on public.settings;
create policy "settings read" on public.settings
  for select to anon, authenticated using (true);

drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 7. AI usage counter (used only by the ai-assist Edge Function; no client access)
-- ============================================================
create table if not exists public.ai_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day     date not null default current_date,
  count   int  not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;  -- no policies = no client access

-- ============================================================
-- 8. IMAGE STORAGE (public bucket; only admins can upload/change/delete)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "images admin insert" on storage.objects;
create policy "images admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'images' and public.is_admin());

drop policy if exists "images admin update" on storage.objects;
create policy "images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'images' and public.is_admin())
  with check (bucket_id = 'images' and public.is_admin());

drop policy if exists "images admin delete" on storage.objects;
create policy "images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'images' and public.is_admin());

-- ============================================================
-- 9. FUNCTION PERMISSIONS
-- ============================================================
revoke all on function public.plan_counts()        from public, anon;
revoke all on function public.community_members()  from public, anon;
revoke all on function public.my_role()            from public, anon;
revoke all on function public.is_admin()           from public, anon;
revoke all on function public.is_super_admin()     from public, anon;
grant execute on function public.plan_counts()       to authenticated;
grant execute on function public.community_members() to authenticated;
grant execute on function public.my_role()           to authenticated;
grant execute on function public.is_admin()          to authenticated;
grant execute on function public.is_super_admin()    to authenticated;

-- ============================================================
-- 10. DATA API ACCESS (this project does not expose new tables automatically)
--     Row-level security above still decides which rows each person can touch.
-- ============================================================
grant usage on schema public to anon, authenticated;

grant select, update                  on public.profiles        to authenticated;
grant select, insert, update, delete  on public.plans           to authenticated;
grant select, insert, update, delete  on public.responses       to authenticated;
grant select, insert, delete          on public.community_posts to authenticated;
grant select, insert, update          on public.messages        to authenticated;
grant select                          on public.settings        to anon, authenticated;
grant insert, update, delete          on public.settings        to authenticated;
-- ai_usage has no grants on purpose: only the Edge Function (service role) touches it.

-- The Edge Function (ai-assist) reads profiles and counts AI usage using the service role.
grant usage on schema public to service_role;
grant select on public.profiles to service_role;
grant select, insert, update on public.ai_usage to service_role;
