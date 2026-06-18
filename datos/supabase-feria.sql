-- ============================================================
--  BASE DE DATOS EN LA NUBE - Feria Jaguar (Supabase, gratis)
--  ------------------------------------------------------------
--  Copia TODO este texto y pegalo en Supabase:
--    Tu proyecto -> SQL Editor -> New query -> pega -> RUN
--  Crea 2 tablas y deja la seguridad lista (solo se puede
--  GUARDAR desde la pagina; LEER solo tu, desde el panel de
--  Supabase). Es seguro repetirlo.
-- ============================================================

-- 1) Personas que entran a la feria y hablan con Jago
create table if not exists public.visitantes (
  id        uuid primary key default gen_random_uuid(),
  nombre    text,
  apellido  text,
  hijo_sms  text,          -- "Si" / "No"
  grado     text,          -- Sexto..Undecimo (o vacio)
  creado    timestamptz default now()
);

-- 2) Preguntas y respuestas (opcional, para ver de que hablaron)
create table if not exists public.mensajes (
  id        uuid primary key default gen_random_uuid(),
  nombre    text,
  apellido  text,
  pregunta  text,
  respuesta text,
  creado    timestamptz default now()
);

-- 3) Seguridad (RLS): el sitio publico SOLO puede INSERTAR (no leer ni borrar).
--    Tu lees/descargas desde el panel de Supabase (Table Editor).
alter table public.visitantes enable row level security;
alter table public.mensajes   enable row level security;

drop policy if exists "insertar visitantes" on public.visitantes;
drop policy if exists "insertar mensajes"   on public.mensajes;

create policy "insertar visitantes" on public.visitantes
  for insert to anon with check (true);

create policy "insertar mensajes" on public.mensajes
  for insert to anon with check (true);
