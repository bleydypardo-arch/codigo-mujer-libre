-- Código Mujer Libre — launch starter content (run ONCE in Supabase → SQL Editor).
-- Additive and safe to re-run: it only INSERTS rows that do not exist yet, never updates or deletes anything.
-- Everything here is editable (or removable) afterwards from Admin.

-- 1) Recipe of the Month (Matcha & Arte). Skipped if you already set one.
insert into public.settings (key, value)
select 'recipe_month', jsonb_build_object(
  'published', true,
  'title_es', 'Matcha latte suave',
  'title_en', 'Gentle matcha latte',
  'teaser_es', 'Un pequeño ritual para parar, respirar y disfrutar.',
  'teaser_en', 'A small ritual to pause, breathe and enjoy.',
  'text_es', E'1 cucharadita de matcha\n60 ml de agua caliente (no hirviendo)\n180 ml de leche tibia (la que prefieras)\nMiel o sirope al gusto\n\nBate el matcha con el agua hasta que quede sin grumos y con espuma fina. Añade la leche tibia y endulza si quieres. Tómalo despacio.',
  'text_en', E'1 teaspoon matcha\n60 ml hot (not boiling) water\n180 ml warm milk of your choice\nHoney or syrup to taste\n\nWhisk the matcha with the water until smooth with a fine foam. Add the warm milk and sweeten if you like. Sip it slowly.',
  'image', '', 'link', '')
where not exists (select 1 from public.settings where key = 'recipe_month');

-- 2) Did You Know? / ¿Sabías que? Added only if the list is empty.
insert into public.did_you_know (position, title_es, title_en, body_es, body_en, published)
select v.*, true from (values
  (1, 'Matcha', 'Matcha', 'El té matcha se cultiva a la sombra durante unas semanas antes de la cosecha, y eso le da su color verde intenso y su sabor suave.', 'Matcha tea is shade-grown for a few weeks before harvest, which gives it its deep green color and gentle flavor.'),
  (2, 'Luz de la mañana', 'Morning light', 'Unos minutos de luz natural por la mañana ayudan al cuerpo a regular su ritmo de sueño y energía.', 'A few minutes of natural light in the morning help your body set its sleep and energy rhythm.'),
  (3, 'Respirar', 'Breathing', 'Alargar la exhalación un poco más que la inhalación puede ayudar al cuerpo a sentirse más tranquilo.', 'Making your exhale a little longer than your inhale can help your body feel calmer.'),
  (4, 'Caminar', 'A short walk', 'Una caminata corta al aire libre puede mejorar el ánimo, incluso si dura solo diez minutos.', 'A short walk outdoors can lift your mood, even if it lasts only ten minutes.'),
  (5, 'Orquídeas', 'Orchids', 'Muchas orquídeas pueden volver a florecer año tras año si se cuidan con paciencia.', 'Many orchids can bloom again year after year when cared for with patience.')
) as v(position, title_es, title_en, body_es, body_en)
where not exists (select 1 from public.did_you_know);

-- 3) Launch posts (no invented venues or dates). Added only when no post with that title exists.
insert into public.plans (kind, code, title_es, title_en, desc_es, desc_en, date_text, location, published)
select 'trip', 'Adventure', 'Código Experience: Girls Weekend', 'Código Experience: Girls Weekend',
  'Nuestro primer fin de semana juntas. Pronto compartiremos las fechas y los detalles.',
  'Our first weekend away together. Dates and details coming soon.',
  'Fecha por anunciar', '', true
where not exists (select 1 from public.plans where title_en = 'Código Experience: Girls Weekend');

insert into public.plans (kind, code, title_es, title_en, desc_es, desc_en, date_text, location, published)
select 'event', 'Social', 'Café de bienvenida Código', 'Código welcome coffee',
  'Un primer encuentro tranquilo para conocernos. Pronto confirmaremos el día y el lugar.',
  'A relaxed first get-together to meet each other. We will confirm the day and place soon.',
  'Fecha por anunciar', 'Orlando, FL', true
where not exists (select 1 from public.plans where title_en = 'Código welcome coffee');

insert into public.plans (kind, code, title_es, title_en, desc_es, desc_en, date_text, location, published)
select 'wellness', 'Wellness', 'Mañana de bienestar', 'Wellness morning',
  'Una mañana para moverte, respirar y desconectar. Detalles muy pronto.',
  'A morning to move, breathe and unplug. Details coming soon.',
  'Fecha por anunciar', 'Orlando, FL', true
where not exists (select 1 from public.plans where title_en = 'Wellness morning');
