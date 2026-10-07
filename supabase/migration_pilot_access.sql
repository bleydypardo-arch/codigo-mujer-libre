-- Código Mujer Libre — pilot access fix (approval gate)
-- WHAT IT DOES: three content tables could be read by any signed-in account, even one whose application
-- has not been approved yet (plans = event/trip/wellness details incl. locations, contacts and payment
-- instructions; daily_codes; did_you_know). This makes them follow the same rule as the rest of the app:
-- published rows are visible to APPROVED members; owner / admins / content admins still see everything.
-- WHAT IT DOES NOT TOUCH: no data, no users, no roles, no passwords, no other policies, no settings.
-- Safe to run more than once. Run it in Supabase -> SQL Editor.

drop policy if exists "plans read published or admin" on public.plans;
create policy "plans read published or admin" on public.plans
  for select to authenticated
  using (public.is_content_admin() or (published and public.is_approved()));

drop policy if exists "daily_codes read" on public.daily_codes;
create policy "daily_codes read" on public.daily_codes
  for select to authenticated
  using (public.is_content_admin() or (published and public.is_approved()));

drop policy if exists "dyk read" on public.did_you_know;
create policy "dyk read" on public.did_you_know
  for select to authenticated
  using (public.is_content_admin() or (published and public.is_approved()));
