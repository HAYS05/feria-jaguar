# 🤖 Cómo crear e integrar un Agente (IA) a un proyecto

Guía **breve y precisa**. Un "agente" es un asistente con **personalidad + conocimiento + reglas** que responde usando un modelo de IA (Gemini, OpenAI o Claude). Ejemplo real: **Jago**, el jaguar del Open House.

---

## Pasos

**1. Define el agente (en papel).**
Nombre, **personalidad**, qué hace y **reglas** (qué SÍ y qué NO responde).
→ *Jago: amistoso, responde sobre la feria, no inventa datos.*

**2. Reúne su conocimiento.**
Junta la información que debe saber en un archivo (texto o JSON).
→ *`datos/conocimiento.json`.*

**3. Consigue una API Key.**
Crea cuenta en un proveedor de IA y genera la clave:
- Gemini → https://aistudio.google.com/apikey
- OpenAI → platform.openai.com
- Claude → console.anthropic.com

**4. Arma las "instrucciones" (system prompt).**
Un texto que combina **personalidad + reglas + el conocimiento**. Esto *define* al agente y se envía en cada llamada.

**5. Programa la llamada a la API.** El núcleo (ejemplo con Gemini):
```js
const r = await fetch(URL_DEL_MODELO + "?key=" + API_KEY, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    system_instruction: { parts: [{ text: INSTRUCCIONES }] },   // paso 4
    contents: [{ role: "user", parts: [{ text: preguntaDelUsuario }] }]
  })
});
const data = await r.json();
const respuesta = data.candidates[0].content.parts[0].text;
```

**6. Conéctalo a la interfaz.**
Flujo: `input del usuario → llamada al agente → mostrar/decir la respuesta`.

**7. Agrega respaldo y límites.**
Si la API falla → respuesta local; limita los tokens; instruye **"no inventes"**.
→ *Jago cae a su "cerebro local" si no hay internet.*

**8. Protege la API Key.**
Nunca la publiques: usa **variable de entorno**, **modo kiosco** (solo en el navegador del evento) o un **proxy** en el servidor.

**9. Prueba e itera.**
Haz preguntas reales y ajusta las **instrucciones** hasta que responda bien.

---

## Resumen en una frase
> **Personalidad + conocimiento + reglas = instrucciones.** Las mandas junto con la pregunta a la **API del modelo**, muestras la respuesta, le pones **respaldo** y **proteges la key**.

## Checklist rápido
- [ ] Personalidad y reglas definidas
- [ ] Conocimiento en un archivo
- [ ] API Key generada
- [ ] Instrucciones (system prompt) armadas
- [ ] Llamada a la API funcionando
- [ ] Conectado a la interfaz (entrada → salida)
- [ ] Respaldo si falla + límite de tokens
- [ ] API Key protegida
- [ ] Probado e iterado
