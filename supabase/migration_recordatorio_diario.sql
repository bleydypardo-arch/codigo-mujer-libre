-- Código Mujer Libre — Recordatorio diario por correo ("Tienes un mensaje en Código ML").
-- ANTES de correr esto: (1) crear la función daily-reminder en Supabase, (2) guardar el secreto CRON_SECRET.
-- Cambia LA_CLAVE_SECRETA por la MISMA clave que pusiste en CRON_SECRET.
-- Corre todos los días a las 8:00 a. m. hora de Bogotá/Orlando (13:00 UTC). Es seguro correrlo más de una vez.
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.unschedule('daily-reminder') where exists (select 1 from cron.job where jobname = 'daily-reminder');
select cron.schedule('daily-reminder', '0 13 * * *', $$
  select net.http_post(
    url := 'https://ltuklkfymedhqncwzpks.supabase.co/functions/v1/daily-reminder',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', 'LA_CLAVE_SECRETA'),
    body := '{}'::jsonb);
$$);
