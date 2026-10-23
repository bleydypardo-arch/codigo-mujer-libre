-- Código Mujer Libre — interest log (lista de interés de Esencias + toques en promociones)
-- WHAT IT DOES: creates ONE new table, interest_log. Each row = "this member asked to be told when the essences
-- line arrives" (kind essences_waitlist, ref = the aroma she wants first) or "this member tapped How to get there /
-- More info on a promotion" (kind promo_tap, ref = the plan id).
-- WHO CAN DO WHAT: an approved member can ADD rows for herself only. Only admins / content admins can READ them.
-- WHAT IT DOES NOT TOUCH: no existing table, row, user, role, password or policy.
-- Safe to run more than once. Run it in Supabase -> SQL Editor.

create table if not exists public.interest_log (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (kind in ('essences_waitlist', 'promo_tap')),
  ref text not null default '' check (char_length(ref) <= 80),
  created_at timestamptz not null default now()
);

create index if not exists interest_log_kind_idx on public.interest_log (kind, created_at desc);
-- one waitlist entry per member (she can change which aroma she wants first)
create unique index if not exists interest_log_waitlist_one on public.interest_log (user_id) where kind = 'essences_waitlist';

alter table public.interest_log enable row level security;

drop policy if exists "interest insert own" on public.interest_log;
create policy "interest insert own" on public.interest_log
  for insert to authenticated
  with check (user_id = auth.uid() and public.is_approved());

drop policy if exists "interest read admin" on public.interest_log;
create policy "interest read admin" on public.interest_log
  for select to authenticated
  using (public.is_content_admin());
