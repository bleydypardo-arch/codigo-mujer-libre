-- ============================================================================
-- Código Mujer Libre — APPROVAL EMAIL (Step 2, prepared in dev)
-- Run ONCE in Supabase > SQL Editor. Safe to run more than once.
--
-- What it does (and nothing else):
--   Adds ONE column to the existing members table (public.profiles):
--     approval_emailed_at  timestamptz   (when the "you are approved" email was sent; empty = not sent)
--
-- Not changed: roles, approval/rejection, security rules (RLS), Amilú's access,
-- existing columns, existing members' data, sign-in, or the Supabase email settings.
--
-- To undo:  alter table public.profiles drop column if exists approval_emailed_at;
-- ============================================================================

alter table public.profiles add column if not exists approval_emailed_at timestamptz;
