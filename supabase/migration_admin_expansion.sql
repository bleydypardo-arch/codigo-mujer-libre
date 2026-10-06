-- Código Mujer Libre — admin expansion migration (same text as section 21 of schema.sql)

-- ============================================================================
-- 21. CONTENT ADMIN ROLE + ADMIN-MANAGED CONTENT  (additive, safe to run more than once)
--     * New role 'content_admin': can manage content + upload images, nothing else.
--       It can NOT read members, applications, messages, responses, or change roles.
--     * Owner (super_admin) and the existing admin keep every current permission.
--     * Owner + at most 2 additional admin accounts (admin or content_admin).
--     * New tables: daily_codes (Your Code for Today), did_you_know.
--     * Nothing is dropped, reset or rewritten. Existing rows are untouched.
-- ============================================================================
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('member','admin','super_admin','content_admin'));

-- true for every account that may manage CONTENT (owner, admin, content admin)
create or replace function public.is_content_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin','super_admin','content_admin') from public.profiles where id = auth.uid()), false)
$$;
revoke all on function public.is_content_admin() from public, anon;
grant execute on function public.is_content_admin() to authenticated;

-- a content admin is a signed-in trusted account (same as the other admins)
create or replace function public.is_approved() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select approved or role in ('admin','super_admin','content_admin') from public.profiles where id = auth.uid()), false)
$$;

-- the owner may now also appoint a content admin (still never another owner)
drop policy if exists "profiles super admin update" on public.profiles;
create policy "profiles super admin update" on public.profiles
  for update to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin() and (role in ('member','admin','content_admin') or id = auth.uid()));

-- Owner + at most 2 additional admin accounts (admin + content_admin together)
create or replace function public.limit_extra_admins() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role in ('admin','content_admin')
     and (tg_op = 'INSERT' or old.role is distinct from new.role) then
    if (select count(*) from public.profiles
         where role in ('admin','content_admin') and id <> new.id) >= 2 then
      raise exception 'Only two additional admin accounts are allowed.';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists profiles_limit_extra_admins on public.profiles;
create trigger profiles_limit_extra_admins before insert or update of role on public.profiles
  for each row execute function public.limit_extra_admins();

-- CONTENT write access: owner / admin / content admin (everything private stays is_admin())
drop policy if exists "plans read published or admin" on public.plans;
create policy "plans read published or admin" on public.plans
  for select to authenticated using (published or public.is_content_admin());
drop policy if exists "plans admin insert" on public.plans;
create policy "plans admin insert" on public.plans
  for insert to authenticated with check (public.is_content_admin());
drop policy if exists "plans admin update" on public.plans;
create policy "plans admin update" on public.plans
  for update to authenticated using (public.is_content_admin()) with check (public.is_content_admin());
drop policy if exists "plans admin delete" on public.plans;
create policy "plans admin delete" on public.plans
  for delete to authenticated using (public.is_content_admin());

drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all to authenticated using (public.is_content_admin()) with check (public.is_content_admin());

drop policy if exists "images admin insert" on storage.objects;
create policy "images admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'images' and public.is_content_admin());
drop policy if exists "images admin update" on storage.objects;
create policy "images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'images' and public.is_content_admin())
  with check (bucket_id = 'images' and public.is_content_admin());
drop policy if exists "images admin delete" on storage.objects;
create policy "images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'images' and public.is_content_admin());

-- ---------- Your Code for Today: one daily entry, both languages, always matched ----------
create table if not exists public.daily_codes (
  id          uuid primary key default gen_random_uuid(),
  position    integer not null default 0,
  aff_es      text not null default '',
  aff_en      text not null default '',
  back_es     text not null default '',   -- back of the card: theme / title
  back_en     text not null default '',
  verse_es    text not null default '',
  verse_en    text not null default '',
  ref_es      text not null default '',   -- Bible reference
  ref_en      text not null default '',
  msg_es      text not null default '',   -- Today's Message (empty = use the existing Daily message)
  msg_en      text not null default '',
  publish_on  date,                       -- optional: show on exactly this Florida date
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists daily_codes_touch on public.daily_codes;
create trigger daily_codes_touch before update on public.daily_codes
  for each row execute function public.touch_updated_at();
alter table public.daily_codes enable row level security;
drop policy if exists "daily_codes read" on public.daily_codes;
create policy "daily_codes read" on public.daily_codes
  for select to authenticated using (published or public.is_content_admin());
drop policy if exists "daily_codes write" on public.daily_codes;
create policy "daily_codes write" on public.daily_codes
  for all to authenticated using (public.is_content_admin()) with check (public.is_content_admin());

-- seed ONLY when the table is empty: the 8 entries that are in the app today
insert into public.daily_codes (position, aff_es, aff_en, back_es, back_en, verse_es, verse_en, ref_es, ref_en, published)
select v.*, true from (values
  (1, 'Hoy no caminas sola: Su luz va delante de ti.', 'You don''t walk alone today: His light goes before you.', 'Antes de que abrieras los ojos, Dios ya pensaba en ti. Empieza este día desde la calma, no desde la prisa.', 'Before you opened your eyes, God was already thinking of you. Begin this day from calm, not from hurry.', 'Nuevas son cada mañana; grande es tu fidelidad.', 'They are new every morning: great is thy faithfulness.', 'Lamentaciones 3:23', 'Lamentations 3:23'),
  (2, 'Eres amada antes de lograr nada.', 'You are loved before you achieve anything.', 'Tu valor no depende de tu agenda ni de tu productividad. Fuiste creada con intención y propósito.', 'Your worth doesn''t depend on your schedule or your productivity. You were created with intention and purpose.', 'Te alabaré; porque formidables, maravillosas son tus obras.', 'I will praise thee; for I am fearfully and wonderfully made.', 'Salmos 139:14', 'Psalm 139:14'),
  (3, 'La paz de Dios cabe en tu día más lleno.', 'God''s peace fits inside your busiest day.', 'No tienes que cargarlo todo hoy. Entrega lo que pesa y quédate con lo que da vida.', 'You don''t have to carry everything today. Hand over what weighs you down and keep what gives life.', 'Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.', 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', 'Mateo 11:28', 'Matthew 11:28'),
  (4, 'Te vistes de fuerza y dignidad.', 'You are clothed in strength and dignity.', 'La verdadera fuerza es serena. No necesita gritar para mantenerse firme.', 'True strength is quiet. It doesn''t need to shout to stand firm.', 'Fortaleza y honor son su vestidura; y en el día postrero reirá.', 'Strength and honour are her clothing; and she shall rejoice in time to come.', 'Proverbios 31:25', 'Proverbs 31:25'),
  (5, 'Lo que Él empezó en ti, lo va a terminar.', 'What He began in you, He will complete.', 'Tu proceso no es un error. Cada etapa tiene sentido en las manos de Dios.', 'Your process is not a mistake. Every season has meaning in God''s hands.', '…el que comenzó en vosotros la buena obra, la perfeccionará.', '…he which hath begun a good work in you will perform it.', 'Filipenses 1:6', 'Philippians 1:6'),
  (6, 'No temas: Dios va contigo.', 'Fear not: God goes with you.', 'El valor no es la ausencia de miedo; es dar el siguiente paso de la mano de Dios.', 'Courage isn''t the absence of fear; it''s taking the next step holding God''s hand.', 'No temas, que yo soy contigo; no desmayes, que yo soy tu Dios.', 'Fear thou not; for I am with thee: be not dismayed; for I am thy God.', 'Isaías 41:10', 'Isaiah 41:10'),
  (7, 'Florecer también lleva su tiempo.', 'Blooming takes its own time.', 'Hay estaciones para sembrar y estaciones para esperar. Confía en el tiempo de Dios.', 'There are seasons to plant and seasons to wait. Trust God''s timing.', 'Todo lo que se quiere debajo del cielo, tiene su tiempo.', 'To every thing there is a season, and a time to every purpose under the heaven.', 'Eclesiastés 3:1', 'Ecclesiastes 3:1'),
  (8, 'Eres luz donde Dios te ha puesto.', 'You are light where God has placed you.', 'Una palabra amable o un mensaje a tiempo pueden iluminar el día de otra mujer.', 'A kind word or a timely message can light up another woman''s day.', 'Vosotros sois la luz del mundo.', 'Ye are the light of the world.', 'Mateo 5:14', 'Matthew 5:14')
) as v(position, aff_es, aff_en, back_es, back_en, verse_es, verse_en, ref_es, ref_en)
where not exists (select 1 from public.daily_codes);

-- ---------- Did You Know? / ¿Sabías que? ----------
create table if not exists public.did_you_know (
  id          uuid primary key default gen_random_uuid(),
  position    integer not null default 0,
  title_es    text not null default '',
  title_en    text not null default '',
  body_es     text not null default '',
  body_en     text not null default '',
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists did_you_know_touch on public.did_you_know;
create trigger did_you_know_touch before update on public.did_you_know
  for each row execute function public.touch_updated_at();
alter table public.did_you_know enable row level security;
drop policy if exists "dyk read" on public.did_you_know;
create policy "dyk read" on public.did_you_know
  for select to authenticated using (published or public.is_content_admin());
drop policy if exists "dyk write" on public.did_you_know;
create policy "dyk write" on public.did_you_know
  for all to authenticated using (public.is_content_admin()) with check (public.is_content_admin());

revoke all on public.daily_codes, public.did_you_know from anon;
grant select, insert, update, delete on public.daily_codes, public.did_you_know to authenticated;
