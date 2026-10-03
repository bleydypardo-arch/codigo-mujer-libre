-- Make the owner the super admin.
-- Run this ONCE, AFTER the owner has registered in the app with this email.
-- (Deliberately not automatic: an automatic "this email is admin" rule could be claimed
--  by someone else who registers first with that address.)

update public.profiles
   set role = 'super_admin'
 where email = lower('codigomujerlibre@gmail.com');

-- Check it worked (should return one row with role = super_admin):
select email, role from public.profiles where role = 'super_admin';
