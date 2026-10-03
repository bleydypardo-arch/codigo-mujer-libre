Código Mujer Libre — interfaz bilingüe ES/EN (GitHub Pages + Supabase).

Archivos del sitio (subir juntos): index.html, style.css, app.js, admin.js

Base de datos y IA (carpeta supabase/):
  schema.sql                    -> ejecutar una vez en Supabase > SQL Editor
  bootstrap_admin.sql           -> ejecutar una vez DESPUÉS de que la dueña se registre (la hace administradora principal)
  functions/ai-assist/index.ts  -> función segura del asistente de IA (Supabase > Edge Functions)
                                   Secreto requerido en Supabase: ANTHROPIC_API_KEY (nunca en el código del sitio)

Ajustes en Supabase:
  Authentication > URL Configuration > Site URL = dirección de GitHub Pages del sitio
  (para que el enlace del correo de confirmación regrese a la app).
