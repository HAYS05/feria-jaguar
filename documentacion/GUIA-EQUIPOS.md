# 🐆 Proyecto Jago — Guía por Equipos

Asistente virtual de la **Feria Tecnológica Saint Margaret School**.
Todo el proyecto es **100% gratuito**. Esta guía conecta a cada equipo con
la parte del proyecto que construye y lo que debe entregar.

---

## 🧩 Cómo está armado el proyecto (visión general)

```
Usuario  →  escribe o habla  →  JAGO (el jaguar)  →  responde con voz + mueve la boca
                                   │
                  ┌────────────────┼─────────────────┐
                  │                │                 │
            Cerebro (IA)      Voz (oír/hablar)   Avatar (verse vivo)
          Gemini + datos      navegador gratis    imagen + animación
```

Cada equipo es dueño de **un archivo o carpeta**. Así trabajan en paralelo sin chocar.

| Equipo | Misión | Archivo/Carpeta que construye | Entrega |
|---|---|---|---|
| **1. Diseño del Agente** | Personalidad y comportamiento | `datos/conocimiento.json` | Manual del agente |
| **2. Interfaz Web** | La página visual | `index.html` + `css/estilos.css` | Interfaz terminada |
| **3. Motor de IA** | Conectar **Gemini** | `js/ia-gemini.js` + `config.js` | IA respondiendo |
| **4. Sistema de Voz** | Oír y hablar | `js/voz.js` | Agente que escucha y habla |
| **5. Avatar e Integración** | Apariencia + boca | `assets/` + `js/avatar.js` | Avatar funcional |

> Herramientas de programación (gratis) recomendadas para todos:
> **Visual Studio Code** (editor) + **Google Chrome** (para probar).

---

## 🎨 Equipo 1 — Diseño del Agente
**Investigación base:** Sección A (Fundamentos de IA) y G (Ética).

**Qué hacen:** llenar el "cerebro" del jaguar en `datos/conocimiento.json`:
- Nombre, historia y personalidad del agente.
- Frases de bienvenida y despedida.
- Preguntas y respuestas frecuentes.
- Reglas de comportamiento y normas éticas.

**Tip:** todo lo que diga "EJEMPLO" en ese archivo lo cambian por información real.

**Entrega:** `documentacion/manual-agente.md` (el Manual del Agente).

---

## 🖥️ Equipo 2 — Interfaz Web
**Investigación base:** Sección E (HTML, CSS, JavaScript).

**Qué hacen:** mejorar el diseño en `index.html` y `css/estilos.css`:
- Colores del colegio, logo, menús.
- Área de conversación (chat), caja de texto, botones.
- Espacio para el avatar.

**Entrega:** la interfaz visual terminada y bonita.

---

## 🧠 Equipo 3 — Motor de Inteligencia Artificial (Gemini)
**Investigación base:** Sección A, F (APIs y API Key).

**Qué hacen:**
1. Crear cuenta gratis en **Google AI Studio** (https://aistudio.google.com).
2. Generar una **API Key** gratuita.
3. Conectar la página con **Gemini** (archivo `js/ia-gemini.js`).
4. Probar enviar preguntas y recibir respuestas.

**⚠️ Seguridad (de la Sección F y G):** la API Key NUNCA se sube a internet
pública tal cual. La guardamos aparte y, al publicar, usamos protección.
(Esto lo resolvemos juntos en la fase de publicación.)

**Entrega:** IA respondiendo preguntas reales.

---

## 🔊 Equipo 4 — Sistema de Voz
**Investigación base:** Sección B (Voz a Texto) y C (Texto a Voz).

**Qué hacen:** archivo `js/voz.js` usando lo que YA trae el navegador (gratis):
- **Entrada:** micrófono → voz a texto (Web Speech API).
- **Salida:** texto a voz → configurar voz, velocidad y tono.

**Entrega:** el agente escucha por micrófono y responde hablando.

---

## 🎭 Equipo 5 — Avatar e Integración
**Investigación base:** Sección D (Avatares Digitales).

**Qué hacen:**
- Preparar la imagen del jaguar (`assets/`): recortar fondo, limpiarla.
- Animaciones y **movimiento de boca** al hablar (`js/avatar.js`).
- Expresiones (contento al saludar, etc.).
- Integrar todo para que se vea como un solo personaje vivo.

**Entrega:** avatar funcional que se mueve al hablar.

---

## ✅ Estado actual del proyecto

- [x] Estructura de carpetas creada
- [x] Imagen de la mascota y logo colocados en `assets/`
- [x] **Fase 1:** Jago aparece y habla en voz alta (gratis)
- [x] **Fase 2:** responder preguntas escritas (chat + cerebro local)
- [x] **Fase 3:** escuchar por micrófono (voz a texto)
- [x] **Fase 4:** mover la boca al hablar (boca animada ajustable) + respiración y parpadeo
- [x] **Fase 5:** base de datos de visitantes (localStorage + descarga CSV/JSON)
- [x] **Fase 6:** integración con la web de la feria (galería de stands + resumir stand)
- [x] **Fase 7:** conectar Gemini (respuestas inteligentes con respaldo offline)
- [ ] Fase 8: publicar en internet (GitHub Pages, gratis)

> **Novedad Fase 7** (archivos `js/ia-gemini.js` + `config.js`): ahora el chat
> responde con **Google Gemini**, usando la info de `conocimiento.json` como
> contexto para que no invente datos. La **API Key** va en `config.js`
> (NUNCA se sube a internet: ya está en `.gitignore`; usa `config.ejemplo.js`
> como plantilla). Si no hay key o falla internet, Jago usa su **cerebro local**
> automáticamente, así que nunca se queda mudo. El modelo se elige en `config.js`
> (`gemini-2.5-pro` = más listo; `gemini-2.5-flash` = más rápido/económico).

> **Novedad Fase 6** (archivo `js/feria.js`): la página ahora muestra una
> **galería de stands**. Al tocar un stand, Jago lo **resume** en voz alta.
> En `datos/conocimiento.json` cada stand tiene dos campos nuevos:
> `detalle` (texto largo que Jago resume) y `url` (enlace a su página real).
> El botón "Ver página" solo aparece cuando el enlace ya NO dice "EJEMPLO".
