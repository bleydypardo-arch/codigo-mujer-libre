-- Código Mujer Libre — Chat privado entre mujeres conectadas
-- Se pega UNA vez en Supabase → SQL Editor → Run. Es seguro repetirlo y NO cambia nada de lo que ya existe.
-- Qué hace:
--  1) Crea la tabla "chat_messages" (mensajes de texto entre dos mujeres).
--  2) Reglas de privacidad: cada mujer solo ve los mensajes que envió o recibió.
--     Solo pueden escribirse dos mujeres que ya estén CONECTADAS (saludo aceptado) y entre las que no haya un bloqueo.
--  3) Las administradoras NO leen estas conversaciones (son privadas). Lo que se reporta llega por "Reportar".

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender uuid not null references public.profiles(id) on delete cascade,
  recipient uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  check (sender <> recipient)
);
create index if not exists chat_messages_recipient_idx on public.chat_messages (recipient, created_at desc);
create index if not exists chat_messages_pair_idx on public.chat_messages (sender, recipient, created_at desc);
alter table public.chat_messages enable row level security;

-- ¿Puedo escribirle a esta mujer? (conectadas y sin bloqueo en ningún sentido)
create or replace function public.chat_allowed(p_other uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_approved()
     and exists (select 1 from public.connections c
                  where c.status = 'accepted'
                    and ((c.from_user = auth.uid() and c.to_user = p_other) or (c.to_user = auth.uid() and c.from_user = p_other)))
     and not exists (select 1 from public.blocks b
                      where (b.blocker = auth.uid() and b.blocked = p_other) or (b.blocker = p_other and b.blocked = auth.uid()))
$$;
revoke all on function public.chat_allowed(uuid) from public, anon;
grant execute on function public.chat_allowed(uuid) to authenticated;

drop policy if exists "chat read own" on public.chat_messages;
create policy "chat read own" on public.chat_messages
  for select to authenticated using (sender = auth.uid() or recipient = auth.uid());

drop policy if exists "chat send" on public.chat_messages;
create policy "chat send" on public.chat_messages
  for insert to authenticated
  with check (sender = auth.uid() and read_at is null and public.chat_allowed(recipient));

drop policy if exists "chat mark read" on public.chat_messages;
create policy "chat mark read" on public.chat_messages
  for update to authenticated using (recipient = auth.uid()) with check (recipient = auth.uid());

drop policy if exists "chat delete own" on public.chat_messages;
create policy "chat delete own" on public.chat_messages
  for delete to authenticated using (sender = auth.uid());

revoke all on public.chat_messages from public, anon;
grant select, insert, delete on public.chat_messages to authenticated;
grant update (read_at) on public.chat_messages to authenticated;
