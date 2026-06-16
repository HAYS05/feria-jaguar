# 🚀 Fase 8 — Publicar la feria en internet (GitHub Pages, gratis)

Esta guía deja a Jago en una dirección pública que cualquiera puede abrir,
manteniendo la API key **segura mediante restricción por dominio**.

> Reemplaza `hays05` por tu usuario de GitHub y usa `feria-jaguar`
> como nombre del repositorio (o el que prefieras).

Tu página pública quedará en:

```
https://hays05.github.io/feria-jaguar/
```

---

## Paso 1 — La API key NO se sube (modo kiosco)
La cuenta de Google de este proyecto **no permite** restringir la key por
dominio (política de la organización). Por eso usamos **modo kiosco**:

- En internet, `config.js` va **sin** la key (queda como `PEGA-AQUI-TU-API-KEY`).
- La página publicada responde con el **cerebro local** para todos.
- En la **computadora de la feria**, el equipo activa Gemini así:
  1. Abre la página y despliega **"📊 Panel del profesor"** (abajo).
  2. En **"🤖 Asistente inteligente (Gemini)"**, pega la API key.
  3. Clic en **"Activar Gemini"**.
- La key se guarda **solo en ese navegador** (localStorage); nunca se sube
  ni la ven otros visitantes. Para quitarla: botón **"Quitar"**.

> Resultado: cero riesgo de exponer la key, y en el kiosco de la feria Jago
> responde con Gemini. Los visitantes en su propio teléfono usan el cerebro
> local (gratis).

---

## Paso 2 — Crear el repositorio en GitHub
1. Entra a https://github.com/new
2. **Repository name:** `feria-jaguar`
3. Visibilidad: **Public** (GitHub Pages gratis necesita público).
4. NO marques "Add a README" (ya tenemos uno).
5. **Create repository**.

---

## Paso 3 — Subir el proyecto
En la carpeta del proyecto, ejecuta (una sola vez):

```bash
git remote add origin https://github.com/hays05/feria-jaguar.git
git branch -M main
git push -u origin main
```

GitHub te pedirá iniciar sesión la primera vez.

---

## Paso 4 — Activar GitHub Pages
1. En el repositorio → **Settings** → **Pages**.
2. En **Source**, elige **Deploy from a branch**.
3. Branch: **main**, carpeta: **/ (root)** → **Save**.
4. Espera 1–2 minutos. Aparecerá el enlace:
   `https://hays05.github.io/feria-jaguar/`

---

## Paso 5 — Probar
- Abre tu enlace público en el teléfono o en otra compu.
- Escribe en el chat: responde con el **cerebro local** (sin key).
- En la **computadora de la feria**, activa Gemini desde el
  **Panel del profesor** (ver Paso 1). Vuelve a preguntar: ahora
  Jago responde con Gemini en esa computadora.

---

## Para actualizar la página después de un cambio
```bash
git add .
git commit -m "Actualizo la feria"
git push
```
GitHub Pages se actualiza solo en 1–2 minutos.
