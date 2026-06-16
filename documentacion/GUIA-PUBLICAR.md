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

## Paso 1 — Restringir la API key (¡ANTES de subir!)
La key viaja al navegador, así que la protegemos limitándola a tu dominio.

1. Entra a https://console.cloud.google.com/apis/credentials
2. Arriba, selecciona el proyecto de la key (**Default Gemini Project**).
3. En **Claves de API**, abre la clave `feria-jaguar`.
4. **Restricciones de aplicación** → *Sitios web (HTTP referrers)* → agrega:
   - `https://hays05.github.io/*`
   - `http://localhost:8000/*`  (para seguir probando en tu compu)
5. **Restricciones de API** → *Restringir clave* → marca solo
   **Generative Language API**.
6. **Guardar**. Puede tardar unos minutos en aplicarse.

> Con esto, aunque alguien vea la key en el código, **no le sirve** fuera de
> tu dominio. Es la misma técnica que usa Google Maps en páginas públicas.

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
- Escribe en el chat: debe responder con Gemini.
- Si Gemini no responde pero el chat sí (cerebro local), revisa que la
  restricción de dominio del Paso 1 incluya EXACTAMENTE tu dirección
  `.github.io` y que ya hayan pasado unos minutos.

---

## Para actualizar la página después de un cambio
```bash
git add .
git commit -m "Actualizo la feria"
git push
```
GitHub Pages se actualiza solo en 1–2 minutos.
