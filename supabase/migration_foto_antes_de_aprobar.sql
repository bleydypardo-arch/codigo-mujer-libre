-- Permite que una mujer suba SU foto de perfil mientras espera la aprobación.
-- Solo puede subir a su propia carpeta. Ver las fotos sigue siendo solo para aprobadas.
drop policy if exists "avatars insert" on storage.objects;
create policy "avatars insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
