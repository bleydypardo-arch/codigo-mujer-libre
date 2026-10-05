Código Mujer Libre — interfaz bilingüe ES/EN (GitHub Pages + Supabase).

Archivos del sitio (subir juntos): index.html, style.css, app.js, admin.js

Base de datos y IA (carpeta supabase/):
  schema.sql                    -> ejecutar una vez en Supabase > SQL Editor
  migration_join_application.sql -> ejecutar una vez ANTES de publicar la nueva solicitud de membresía
                                   (teléfono, WhatsApp, cumpleaños y respuestas de la solicitud)
  bootstrap_admin.sql           -> ejecutar una vez DESPUÉS de que la dueña se registre (la hace administradora principal)
  functions/ai-assist/index.ts  -> función segura del asistente de IA (Supabase > Edge Functions)
                                   Secreto requerido en Supabase: ANTHROPIC_API_KEY (nunca en el código del sitio)

Ajustes en Supabase:
  Authentication > URL Configuration > Site URL = dirección de GitHub Pages del sitio
  (para que el enlace del correo de confirmación regrese a la app).

AI assistant (v2) - secrets to add in Supabase > Edge Functions > Secrets (never in code):
  OPENAI_API_KEY, TICKETMASTER_API_KEY, GOOGLE_PLACES_API_KEY
Optional: OPENAI_MODEL (default gpt-4o-mini), AI_DAILY_LIMIT (default 40), AI_HOME_AREA, AI_TM_CITY, AI_TM_STATE, AI_TM_RADIUS.
Google Maps JavaScript key is a browser key: restrict it to the site's HTTP referrer in Google Cloud.
