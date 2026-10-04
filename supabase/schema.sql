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

-- ============================================================
-- 11. MEMORIES / RECUERDOS  (event albums: photos, short videos, posts, comments, hearts)
--     Private to approved members. Files live in a PRIVATE bucket and are shown with
--     short-lived signed links, never public URLs.
-- ============================================================

-- 11a. Member approval gate. New members can use the app, but only approved members
--      (and admins) can see Memories. One-time backfill: everyone who already exists is approved.
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'profiles' and column_name = 'approved') then
    alter table public.profiles add column approved boolean not null default false;
    update public.profiles set approved = true;
  end if;
end $$;

create or replace function public.my_approved() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select approved from public.profiles where id = auth.uid()), false)
$$;

-- Approved member OR admin
create or replace function public.is_approved() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select approved or role in ('admin','super_admin') from public.profiles where id = auth.uid()), false)
$$;

-- A member can never approve herself: block any change of her own "approved" value.
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = public.my_role() and approved = public.my_approved());

-- Admins approve / un-approve members through this function only (cannot touch roles).
create or replace function public.approve_member(target uuid, ok boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  update public.profiles set approved = ok where id = target;
end $$;

-- 11b. Tables
create table if not exists public.memories (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid unique references public.plans(id) on delete set null,   -- the original event
  code        text check (code is null or code in
                ('Social','Wellness','Faith','Adventure','Family','Connection','Support','Recharge')),
  title_es    text not null default '',
  title_en    text not null default '',
  desc_es     text not null default '',
  desc_en     text not null default '',
  event_date  date,                                  -- ORIGINAL event date (never the upload date)
  location    text not null default '',
  image_url   text not null default '' check (image_url = '' or image_url ~* '^https?://'),
  posting     text not null default 'going' check (posting in ('going','members','closed')),
  cover_media_id uuid,
  hidden      boolean not null default false,
  created_by  uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists memories_date_idx on public.memories (event_date desc);

create table if not exists public.memory_posts (
  id          uuid primary key default gen_random_uuid(),
  memory_id   uuid not null references public.memories(id) on delete cascade,
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  author_name text not null default '',
  body        text not null default '' check (char_length(body) <= 1000),
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists memory_posts_memory_idx on public.memory_posts (memory_id, created_at desc);

create table if not exists public.memory_media (
  id          uuid primary key default gen_random_uuid(),
  memory_id   uuid not null references public.memories(id) on delete cascade,
  post_id     uuid not null references public.memory_posts(id) on delete cascade,
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  kind        text not null check (kind in ('photo','video')),
  path        text not null,                       -- storage path in bucket "memories"
  thumb_path  text not null default '',
  caption     text not null default '' check (char_length(caption) <= 300),
  size_bytes  integer not null default 0 check (size_bytes between 0 and 26214400),
  width       integer,
  height      integer,
  duration_s  integer check (duration_s is null or duration_s <= 30),
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists memory_media_post_idx on public.memory_media (post_id);
create index if not exists memory_media_memory_idx on public.memory_media (memory_id);

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'memories_cover_fk') then
    alter table public.memories add constraint memories_cover_fk
      foreign key (cover_media_id) references public.memory_media(id) on delete set null;
  end if;
end $$;

create table if not exists public.memory_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.memory_posts(id) on delete cascade,
  memory_id   uuid not null references public.memories(id) on delete cascade,
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  author_name text not null default '',
  body        text not null check (char_length(body) between 1 and 500),
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists memory_comments_post_idx on public.memory_comments (post_id, created_at);

create table if not exists public.memory_reactions (
  post_id     uuid not null references public.memory_posts(id) on delete cascade,
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)                   -- one heart per member per post
);

-- Author names are stamped by the database so they cannot be faked.
create or replace function public.stamp_author_name() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  select coalesce(nullif(trim(first_name || ' ' || case when last_name <> '' then left(last_name,1) || '.' else '' end), ''), 'Member')
    into new.author_name from public.profiles where id = new.user_id;
  if new.author_name is null then new.author_name := 'Member'; end if;
  return new;
end $$;
drop trigger if exists memory_posts_author on public.memory_posts;
create trigger memory_posts_author before insert on public.memory_posts
  for each row execute function public.stamp_author_name();
drop trigger if exists memory_comments_author on public.memory_comments;
create trigger memory_comments_author before insert on public.memory_comments
  for each row execute function public.stamp_author_name();

-- 11c. Permission helpers
-- Can the current user add posts/photos/videos to this memory?
create or replace function public.can_post_memory(mid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_approved() and exists (
    select 1 from public.memories m
    where m.id = mid
      and (
        public.is_admin()
        or (not m.hidden and (
              m.posting = 'members'
              or (m.posting = 'going' and exists (
                    select 1 from public.responses r
                    where r.plan_id = m.plan_id and r.user_id = auth.uid() and r.status = 'going'))
        ))
      )
  )
$$;

-- Can the current user comment / heart in this memory? (any approved member, unless closed or hidden)
create or replace function public.can_interact_memory(mid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_approved() and exists (
    select 1 from public.memories m
    where m.id = mid and (public.is_admin() or (not m.hidden and m.posting <> 'closed'))
  )
$$;

-- Is this memory visible to the current user?
create or replace function public.memory_visible(mid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_approved() and exists (
    select 1 from public.memories m where m.id = mid and (not m.hidden or public.is_admin())
  )
$$;

-- 11d. Row-level security
alter table public.memories          enable row level security;
alter table public.memory_posts      enable row level security;
alter table public.memory_media      enable row level security;
alter table public.memory_comments   enable row level security;
alter table public.memory_reactions  enable row level security;

drop policy if exists "memories read"         on public.memories;
drop policy if exists "memories admin insert" on public.memories;
drop policy if exists "memories admin update" on public.memories;
drop policy if exists "memories admin delete" on public.memories;
create policy "memories read" on public.memories
  for select to authenticated using (public.is_approved() and (not hidden or public.is_admin()));
create policy "memories admin insert" on public.memories
  for insert to authenticated with check (public.is_admin());
create policy "memories admin update" on public.memories
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "memories admin delete" on public.memories
  for delete to authenticated using (public.is_admin());

drop policy if exists "mposts read"   on public.memory_posts;
drop policy if exists "mposts insert" on public.memory_posts;
drop policy if exists "mposts update" on public.memory_posts;
drop policy if exists "mposts delete" on public.memory_posts;
create policy "mposts read" on public.memory_posts
  for select to authenticated
  using (public.memory_visible(memory_id) and (not hidden or public.is_admin() or user_id = auth.uid()));
create policy "mposts insert" on public.memory_posts
  for insert to authenticated
  with check (user_id = auth.uid() and hidden = false and public.can_post_memory(memory_id));
create policy "mposts update" on public.memory_posts
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "mposts delete" on public.memory_posts
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "mmedia read"   on public.memory_media;
drop policy if exists "mmedia insert" on public.memory_media;
drop policy if exists "mmedia update" on public.memory_media;
drop policy if exists "mmedia delete" on public.memory_media;
create policy "mmedia read" on public.memory_media
  for select to authenticated
  using (public.memory_visible(memory_id) and (not hidden or public.is_admin() or user_id = auth.uid()));
create policy "mmedia insert" on public.memory_media
  for insert to authenticated
  with check (
    user_id = auth.uid() and hidden = false and public.can_post_memory(memory_id)
    and exists (select 1 from public.memory_posts p
                where p.id = post_id and p.memory_id = memory_media.memory_id
                  and (p.user_id = auth.uid() or public.is_admin()))
  );
create policy "mmedia update" on public.memory_media
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "mmedia delete" on public.memory_media
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "mcomments read"   on public.memory_comments;
drop policy if exists "mcomments insert" on public.memory_comments;
drop policy if exists "mcomments update" on public.memory_comments;
drop policy if exists "mcomments delete" on public.memory_comments;
create policy "mcomments read" on public.memory_comments
  for select to authenticated
  using (public.memory_visible(memory_id) and (not hidden or public.is_admin() or user_id = auth.uid()));
create policy "mcomments insert" on public.memory_comments
  for insert to authenticated
  with check (user_id = auth.uid() and hidden = false and public.can_interact_memory(memory_id)
              and exists (select 1 from public.memory_posts p where p.id = post_id and p.memory_id = memory_comments.memory_id));
create policy "mcomments update" on public.memory_comments
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "mcomments delete" on public.memory_comments
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "mreact read"   on public.memory_reactions;
drop policy if exists "mreact insert" on public.memory_reactions;
drop policy if exists "mreact delete" on public.memory_reactions;
create policy "mreact read" on public.memory_reactions
  for select to authenticated
  using (exists (select 1 from public.memory_posts p where p.id = post_id and public.memory_visible(p.memory_id)));
create policy "mreact insert" on public.memory_reactions
  for insert to authenticated
  with check (user_id = auth.uid()
              and exists (select 1 from public.memory_posts p where p.id = post_id and public.can_interact_memory(p.memory_id)));
create policy "mreact delete" on public.memory_reactions
  for delete to authenticated using (user_id = auth.uid());

-- Counts for the timeline ("12 photos • 2 videos"). Runs as the caller, so RLS decides what is counted.
create or replace function public.memory_stats()
returns table (memory_id uuid, photos bigint, videos bigint, posts bigint)
language sql stable security invoker set search_path = public as $$
  select m.id,
         (select count(*) from public.memory_media x where x.memory_id = m.id and x.kind = 'photo' and not x.hidden),
         (select count(*) from public.memory_media x where x.memory_id = m.id and x.kind = 'video' and not x.hidden),
         (select count(*) from public.memory_posts p where p.memory_id = m.id and not p.hidden)
  from public.memories m
$$;

-- 11e. Private storage bucket "memories": 25 MB max per file; images and short videos only.
--      File path format: <memory_id>/<member_id>/<random-name>.<ext>
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memories', 'memories', false, 26214400,
        array['image/jpeg','image/png','image/webp','video/mp4','video/quicktime','video/webm'])
on conflict (id) do update
  set public = false, file_size_limit = 26214400,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','video/mp4','video/quicktime','video/webm'];

drop policy if exists "memories files read"   on storage.objects;
drop policy if exists "memories files insert" on storage.objects;
drop policy if exists "memories files delete" on storage.objects;
create policy "memories files read" on storage.objects
  for select to authenticated using (bucket_id = 'memories' and public.is_approved());
create policy "memories files insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'memories' and public.is_approved()
    and (storage.foldername(name))[2] = auth.uid()::text
    and public.can_post_memory(((storage.foldername(name))[1])::uuid)
  );
create policy "memories files delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'memories' and ((storage.foldername(name))[2] = auth.uid()::text or public.is_admin()));

-- 11f. Function permissions and Data API access
revoke all on function public.my_approved()            from public, anon;
revoke all on function public.is_approved()            from public, anon;
revoke all on function public.approve_member(uuid, boolean) from public, anon;
revoke all on function public.can_post_memory(uuid)    from public, anon;
revoke all on function public.can_interact_memory(uuid) from public, anon;
revoke all on function public.memory_visible(uuid)     from public, anon;
revoke all on function public.memory_stats()           from public, anon;
grant execute on function public.my_approved()            to authenticated;
grant execute on function public.is_approved()            to authenticated;
grant execute on function public.approve_member(uuid, boolean) to authenticated;
grant execute on function public.can_post_memory(uuid)    to authenticated;
grant execute on function public.can_interact_memory(uuid) to authenticated;
grant execute on function public.memory_visible(uuid)     to authenticated;
grant execute on function public.memory_stats()           to authenticated;

grant select, insert, update, delete on public.memories         to authenticated;
grant select, insert, update, delete on public.memory_posts     to authenticated;
grant select, insert, update, delete on public.memory_media     to authenticated;
grant select, insert, update, delete on public.memory_comments  to authenticated;
grant select, insert, delete         on public.memory_reactions to authenticated;

-- ============================================================================
-- 12. MEMORIES: EMOJI REACTIONS (❤️ 😂 😍 👏 🔥 🥂) — safe to run more than once
-- ============================================================================
alter table public.memory_reactions add column if not exists emoji text not null default '❤️';
alter table public.memory_reactions drop constraint if exists memory_reactions_emoji_check;
alter table public.memory_reactions add constraint memory_reactions_emoji_check
  check (emoji in ('❤️','😂','😍','👏','🔥','🥂'));
alter table public.memory_reactions drop constraint if exists memory_reactions_pkey;
alter table public.memory_reactions add primary key (post_id, user_id, emoji);

-- ============================================================================
-- 13. SECURITY: APPROVAL FOR THE WHOLE APP + EXACTLY TWO ADMIN POSITIONS
--     Safe to run more than once. Existing members are NOT locked out: anyone who is
--     already approved stays approved (the memory gate in section 11 backfilled it).
-- ============================================================================

-- 13a. Rejected state (approved=false + rejected=true  → "not approved" screen)
alter table public.profiles add column if not exists rejected boolean not null default false;

create or replace function public.my_rejected() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select rejected from public.profiles where id = auth.uid()), false)
$$;

-- A member can never change her own role, approval or rejection.
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid()
              and role = public.my_role()
              and approved = public.my_approved()
              and rejected = public.my_rejected());

-- Admins (owner or second admin) approve / reject ordinary members only.
create or replace function public.approve_member(target uuid, ok boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  update public.profiles set approved = ok, rejected = false
   where id = target and role = 'member';
end $$;

create or replace function public.reject_member(target uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  update public.profiles set approved = false, rejected = true
   where id = target and role = 'member';
end $$;

revoke all on function public.my_rejected()                from public, anon;
revoke all on function public.reject_member(uuid)          from public, anon;
grant execute on function public.my_rejected()             to authenticated;
grant execute on function public.reject_member(uuid)       to authenticated;

-- 13b. Every private table now requires an approved member (or an admin).
drop policy if exists "plans read published or admin" on public.plans;
create policy "plans read published or admin" on public.plans
  for select to authenticated
  using (public.is_admin() or (published and public.is_approved()));

drop policy if exists "responses read own or admin" on public.responses;
create policy "responses read own or admin" on public.responses
  for select to authenticated
  using (public.is_admin() or (user_id = auth.uid() and public.is_approved()));

drop policy if exists "responses insert own" on public.responses;
create policy "responses insert own" on public.responses
  for insert to authenticated
  with check (user_id = auth.uid() and public.is_approved()
              and exists (select 1 from public.plans p where p.id = plan_id and p.published));

drop policy if exists "responses update own" on public.responses;
create policy "responses update own" on public.responses
  for update to authenticated
  using (user_id = auth.uid() and public.is_approved())
  with check (user_id = auth.uid() and public.is_approved());

drop policy if exists "responses delete own" on public.responses;
create policy "responses delete own" on public.responses
  for delete to authenticated using (user_id = auth.uid() and public.is_approved());

create or replace function public.plan_counts()
returns table (plan_id uuid, interested bigint, going bigint)
language sql stable security definer set search_path = public as $$
  select r.plan_id,
         count(*) filter (where r.status = 'interested'),
         count(*) filter (where r.status = 'going')
  from public.responses r
  join public.plans p on p.id = r.plan_id and p.published
  where public.is_approved()
  group by r.plan_id
$$;

drop policy if exists "posts read" on public.community_posts;
create policy "posts read" on public.community_posts
  for select to authenticated using (public.is_approved());

drop policy if exists "posts insert own" on public.community_posts;
create policy "posts insert own" on public.community_posts
  for insert to authenticated with check (user_id = auth.uid() and public.is_approved());

drop policy if exists "posts delete own or admin" on public.community_posts;
create policy "posts delete own or admin" on public.community_posts
  for delete to authenticated
  using (public.is_admin() or (user_id = auth.uid() and public.is_approved()));

create or replace function public.community_members()
returns table (first_name text, interests text[])
language sql stable security definer set search_path = public as $$
  select first_name, interests from public.profiles
  where first_name <> '' and public.is_approved()
  order by created_at desc
  limit 100
$$;

drop policy if exists "messages read own or admin" on public.messages;
create policy "messages read own or admin" on public.messages
  for select to authenticated
  using (public.is_admin() or (user_id = auth.uid() and public.is_approved()));

drop policy if exists "messages insert own" on public.messages;
create policy "messages insert own" on public.messages
  for insert to authenticated
  with check (user_id = auth.uid() and admin_reply = '' and public.is_approved());

-- 13c. EXACTLY TWO ADMIN POSITIONS: one owner (super_admin) + at most one admin.
--      Unique partial indexes make this impossible to break, even by a race.
create unique index if not exists one_super_admin_only on public.profiles ((true)) where role = 'super_admin';
create unique index if not exists one_second_admin_only on public.profiles ((true)) where role = 'admin';

-- The owner's super_admin status cannot be removed or handed out from the app
-- (only from the SQL editor, where there is no signed-in app user).
create or replace function public.protect_owner() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null then
    if tg_op = 'UPDATE' and old.role = 'super_admin' and new.role <> 'super_admin' then
      raise exception 'The owner role cannot be removed from the app.';
    end if;
    if new.role = 'super_admin' and (tg_op = 'INSERT' or old.role <> 'super_admin') then
      raise exception 'Only one owner is allowed.';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect_owner on public.profiles;
create trigger profiles_protect_owner before insert or update of role on public.profiles
  for each row execute function public.protect_owner();

-- ============================================================================
-- 14. EVENT CHAT + COMMUNITY UPGRADE (photos, comments, ❤️ reactions)
--     Safe to run more than once. Everything requires an approved member.
-- ============================================================================

-- Community, chat and comments show FIRST NAME only (same as the member list today).
create or replace function public.stamp_first_name() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  select coalesce(nullif(trim(first_name), ''), 'Member') into new.author_name
    from public.profiles where id = new.user_id;
  if new.author_name is null then new.author_name := 'Member'; end if;
  return new;
end $$;

-- 14a. EVENT CHAT — members marked GOING (and admins) can read and write.
create table if not exists public.event_messages (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references public.plans(id) on delete cascade,
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  author_name text not null default '',
  body        text not null check (char_length(body) between 1 and 500),
  created_at  timestamptz not null default now()
);
create index if not exists event_messages_plan_idx on public.event_messages (plan_id, created_at);

create or replace function public.can_chat_event(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_approved()
     and exists (select 1 from public.plans p where p.id = pid and (p.published or public.is_admin()))
     and (public.is_admin()
          or exists (select 1 from public.responses r
                     where r.plan_id = pid and r.user_id = auth.uid() and r.status = 'going'))
$$;

drop trigger if exists event_messages_author on public.event_messages;
create trigger event_messages_author before insert on public.event_messages
  for each row execute function public.stamp_first_name();

alter table public.event_messages enable row level security;
drop policy if exists "echat read"   on public.event_messages;
drop policy if exists "echat insert" on public.event_messages;
drop policy if exists "echat delete" on public.event_messages;
create policy "echat read" on public.event_messages
  for select to authenticated using (public.can_chat_event(plan_id));
create policy "echat insert" on public.event_messages
  for insert to authenticated with check (user_id = auth.uid() and public.can_chat_event(plan_id));
create policy "echat delete" on public.event_messages
  for delete to authenticated
  using (public.is_admin() or (user_id = auth.uid() and public.is_approved()));

-- 14b. COMMUNITY posts: optional PRIVATE photo, names stamped by the database
alter table public.community_posts add column if not exists photo_path text not null default '';
alter table public.community_posts drop constraint if exists community_posts_body_check;
alter table public.community_posts drop constraint if exists community_posts_body_or_photo;
alter table public.community_posts add constraint community_posts_body_or_photo
  check (char_length(body) <= 1000 and (char_length(body) > 0 or photo_path <> ''));
alter table public.community_posts drop constraint if exists community_posts_photo_own_folder;
alter table public.community_posts add constraint community_posts_photo_own_folder
  check (photo_path = '' or photo_path like user_id::text || '/%');

drop trigger if exists community_posts_author on public.community_posts;
create trigger community_posts_author before insert on public.community_posts
  for each row execute function public.stamp_first_name();

create table if not exists public.community_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.community_posts(id) on delete cascade,
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  author_name text not null default '',
  body        text not null check (char_length(body) between 1 and 500),
  created_at  timestamptz not null default now()
);
create index if not exists community_comments_post_idx on public.community_comments (post_id, created_at);
drop trigger if exists community_comments_author on public.community_comments;
create trigger community_comments_author before insert on public.community_comments
  for each row execute function public.stamp_first_name();

create table if not exists public.community_reactions (
  post_id     uuid not null references public.community_posts(id) on delete cascade,
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)               -- one ❤️ per member per post
);

alter table public.community_comments  enable row level security;
alter table public.community_reactions enable row level security;
drop policy if exists "ccomment read"   on public.community_comments;
drop policy if exists "ccomment insert" on public.community_comments;
drop policy if exists "ccomment delete" on public.community_comments;
create policy "ccomment read" on public.community_comments
  for select to authenticated using (public.is_approved());
create policy "ccomment insert" on public.community_comments
  for insert to authenticated with check (user_id = auth.uid() and public.is_approved());
create policy "ccomment delete" on public.community_comments
  for delete to authenticated
  using (public.is_admin() or (user_id = auth.uid() and public.is_approved()));
drop policy if exists "creact read"   on public.community_reactions;
drop policy if exists "creact insert" on public.community_reactions;
drop policy if exists "creact delete" on public.community_reactions;
create policy "creact read" on public.community_reactions
  for select to authenticated using (public.is_approved());
create policy "creact insert" on public.community_reactions
  for insert to authenticated with check (user_id = auth.uid() and public.is_approved());
create policy "creact delete" on public.community_reactions
  for delete to authenticated using (user_id = auth.uid() and public.is_approved());

-- 14c. PRIVATE bucket for community photos (one folder per member)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community', 'community', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = false, file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "community files read"   on storage.objects;
drop policy if exists "community files insert" on storage.objects;
drop policy if exists "community files delete" on storage.objects;
create policy "community files read" on storage.objects
  for select to authenticated using (bucket_id = 'community' and public.is_approved());
create policy "community files insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'community' and public.is_approved()
              and (storage.foldername(name))[1] = auth.uid()::text);
create policy "community files delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'community'
         and (public.is_admin() or (public.is_approved() and (storage.foldername(name))[1] = auth.uid()::text)));

-- 14d. Permissions
revoke all on function public.can_chat_event(uuid) from public, anon;
grant execute on function public.can_chat_event(uuid) to authenticated;
grant select, insert, delete on public.event_messages     to authenticated;
grant select, insert, delete on public.community_comments to authenticated;
grant select, insert, delete on public.community_reactions to authenticated;

-- ============================================================================
-- 15. POLLS (reusable: attached to an event, a trip, or free-standing) + TRIP PLANNING CHAT
--     Safe to run more than once. Admins create polls; approved members vote and see results.
-- ============================================================================
create table if not exists public.polls (
  id         uuid primary key default gen_random_uuid(),
  plan_id    uuid references public.plans(id) on delete cascade,   -- null = general poll
  question   text not null check (char_length(question) between 1 and 200),
  multi      boolean not null default false,                       -- false = one choice only
  closes_at  timestamptz,
  closed     boolean not null default false,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists polls_plan_idx on public.polls (plan_id);

create table if not exists public.poll_options (
  id       uuid primary key default gen_random_uuid(),
  poll_id  uuid not null references public.polls(id) on delete cascade,
  label    text not null check (char_length(label) between 1 and 100),
  position int  not null default 0
);
create index if not exists poll_options_poll_idx on public.poll_options (poll_id, position);

create table if not exists public.poll_votes (
  poll_id    uuid not null references public.polls(id) on delete cascade,
  option_id  uuid not null references public.poll_options(id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (poll_id, user_id, option_id)         -- the same option can never be counted twice
);

-- Who may see / vote
create or replace function public.poll_visible(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_approved() and exists (
    select 1 from public.polls p
    where p.id = pid
      and (p.plan_id is null or public.is_admin()
           or exists (select 1 from public.plans pl where pl.id = p.plan_id and pl.published)))
$$;

create or replace function public.can_vote(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.poll_visible(pid) and exists (
    select 1 from public.polls p
    where p.id = pid and not p.closed and (p.closes_at is null or p.closes_at > now()))
$$;

-- One-choice polls: a second, different option from the same member is refused.
-- The option must belong to the poll.
create or replace function public.check_poll_vote() returns trigger
language plpgsql security definer set search_path = public as $$
declare is_multi boolean;
begin
  if not exists (select 1 from public.poll_options o where o.id = new.option_id and o.poll_id = new.poll_id) then
    raise exception 'That option does not belong to this poll.';
  end if;
  select multi into is_multi from public.polls where id = new.poll_id;
  if not is_multi and exists (select 1 from public.poll_votes v
                              where v.poll_id = new.poll_id and v.user_id = new.user_id and v.option_id <> new.option_id) then
    raise exception 'This poll allows only one choice.';
  end if;
  return new;
end $$;
drop trigger if exists poll_votes_check on public.poll_votes;
create trigger poll_votes_check before insert on public.poll_votes
  for each row execute function public.check_poll_vote();

alter table public.polls        enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes   enable row level security;

drop policy if exists "polls read"          on public.polls;
drop policy if exists "polls admin write"   on public.polls;
create policy "polls read" on public.polls for select to authenticated using (public.poll_visible(id));
create policy "polls admin write" on public.polls for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "poll options read"        on public.poll_options;
drop policy if exists "poll options admin write" on public.poll_options;
create policy "poll options read" on public.poll_options for select to authenticated using (public.poll_visible(poll_id));
create policy "poll options admin write" on public.poll_options for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Members see only their OWN votes (and admins see all). Everyone sees totals through poll_results().
drop policy if exists "poll votes read"   on public.poll_votes;
drop policy if exists "poll votes insert" on public.poll_votes;
drop policy if exists "poll votes delete" on public.poll_votes;
create policy "poll votes read" on public.poll_votes for select to authenticated
  using (public.is_admin() or (user_id = auth.uid() and public.is_approved()));
create policy "poll votes insert" on public.poll_votes for insert to authenticated
  with check (user_id = auth.uid() and public.can_vote(poll_id));
create policy "poll votes delete" on public.poll_votes for delete to authenticated
  using (user_id = auth.uid() and public.can_vote(poll_id));

-- Totals per option (no names), for every poll the caller may see
create or replace function public.poll_results()
returns table (poll_id uuid, option_id uuid, votes bigint, voters bigint)
language sql stable security definer set search_path = public as $$
  select o.poll_id, o.id,
         (select count(*) from public.poll_votes v where v.option_id = o.id),
         (select count(distinct v.user_id) from public.poll_votes v where v.poll_id = o.poll_id)
  from public.poll_options o
  where public.poll_visible(o.poll_id)
$$;

-- Trip planning: members who are INTERESTED or GOING in a trip can join its discussion
-- (events stay GOING-only).
create or replace function public.can_chat_event(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_approved()
     and exists (select 1 from public.plans p where p.id = pid and (p.published or public.is_admin()))
     and (public.is_admin()
          or exists (select 1 from public.responses r join public.plans p on p.id = r.plan_id
                     where r.plan_id = pid and r.user_id = auth.uid()
                       and (r.status = 'going' or (p.kind = 'trip' and r.status = 'interested'))))
$$;

revoke all on function public.poll_visible(uuid) from public, anon;
revoke all on function public.can_vote(uuid)     from public, anon;
revoke all on function public.poll_results()     from public, anon;
grant execute on function public.poll_visible(uuid) to authenticated;
grant execute on function public.can_vote(uuid)     to authenticated;
grant execute on function public.poll_results()     to authenticated;
grant select, insert, update, delete on public.polls        to authenticated;
grant select, insert, update, delete on public.poll_options to authenticated;
grant select, insert, delete         on public.poll_votes   to authenticated;

-- ============================================================================
-- 16. PROFILES & CELEBRATIONS: profile photo (private), optional birthday (month + day ONLY —
--     the year is never stored, so age can never be shown), preferred language.
--     Safe to run more than once.
-- ============================================================================
alter table public.profiles add column if not exists avatar_path text;
alter table public.profiles add column if not exists birth_month smallint;
alter table public.profiles add column if not exists birth_day   smallint;
alter table public.profiles add column if not exists pref_lang   text;

alter table public.profiles drop constraint if exists profiles_birth_check;
alter table public.profiles add constraint profiles_birth_check check (
  (birth_month is null and birth_day is null)
  or (birth_month between 1 and 12 and birth_day between 1 and 31
      and birth_day <= (case birth_month when 2 then 29 when 4 then 30 when 6 then 30 when 9 then 30 when 11 then 30 else 31 end)));
alter table public.profiles drop constraint if exists profiles_pref_lang_check;
alter table public.profiles add constraint profiles_pref_lang_check check (pref_lang is null or pref_lang in ('es','en'));
-- a member's photo must live in her own folder of the private bucket
alter table public.profiles drop constraint if exists profiles_avatar_own_folder;
alter table public.profiles add constraint profiles_avatar_own_folder check (
  avatar_path is null or avatar_path like (id::text || '/%'));

-- Private bucket: only approved members can see profile photos (signed links), each member writes only her own folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = false, file_size_limit = 2097152,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "avatars read"   on storage.objects;
drop policy if exists "avatars insert" on storage.objects;
drop policy if exists "avatars delete" on storage.objects;
create policy "avatars read" on storage.objects
  for select to authenticated using (bucket_id = 'avatars' and public.is_approved());
create policy "avatars insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and public.is_approved() and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars'
         and (public.is_admin() or (public.is_approved() and (storage.foldername(name))[1] = auth.uid()::text)));

-- Upcoming birthdays for the Home screen: first name + date + photo path. NEVER the year or age.
-- "Today" is New York time (the community is in Orlando).
create or replace function public.upcoming_birthdays(within_days int default 14)
returns table (user_id uuid, first_name text, avatar_path text, birth_month smallint, birth_day smallint,
               next_on date, days_until int)
language sql stable security definer set search_path = public as $$
  with t as (select (now() at time zone 'America/New_York')::date as today),
  c as (
    select p.id, p.first_name, p.avatar_path, p.birth_month, p.birth_day,
           case when p.birth_month = 2 and p.birth_day = 29 then 3 else p.birth_month end as m,
           case when p.birth_month = 2 and p.birth_day = 29 then 1 else p.birth_day end as d,
           t.today
    from public.profiles p, t
    where public.is_approved() and p.birth_month is not null and p.first_name <> ''
      and (p.approved or p.role in ('admin','super_admin'))
  ),
  n as (
    select c.*, make_date(extract(year from c.today)::int, c.m, c.d) as this_year from c
  )
  select id, first_name, avatar_path, birth_month, birth_day,
         (case when this_year >= today then this_year else make_date(extract(year from today)::int + 1, m, d) end),
         ((case when this_year >= today then this_year else make_date(extract(year from today)::int + 1, m, d) end) - today)::int
  from n
  where ((case when this_year >= today then this_year else make_date(extract(year from today)::int + 1, m, d) end) - today) <= greatest(0, least(within_days, 366))
  order by 7, first_name
$$;
revoke all on function public.upcoming_birthdays(int) from public, anon;
grant execute on function public.upcoming_birthdays(int) to authenticated;
