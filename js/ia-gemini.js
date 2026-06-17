/* ============================================================
   FASE 7 - MOTOR DE IA CON GEMINI (Equipo 3)
   ------------------------------------------------------------
   Conecta a Jago con Google Gemini para que de respuestas mas
   inteligentes. Sigue usando el cerebro local (conocimiento.json)
   como "fuente de verdad": le pasamos la info de la feria a Gemini
   para que NO se invente cosas.

   Si no hay API Key, o no hay internet, o falla la llamada,
   Jago usa su cerebro local de siempre (nunca se queda mudo).

   La API Key se pone en config.js (ese archivo NO se sube a
   internet). Ver LEEME.txt -> "Conectar Gemini".
   ============================================================ */

/* Nombre de la "caja" del navegador donde el equipo guarda la key
   en MODO KIOSCO (solo en la computadora de la feria). */
const CLAVE_GEMINI_LS = "jago_gemini_key";

/* ¿Una key tiene pinta de ser valida (no vacia ni el texto de ejemplo)? */
function claveValida(clave) {
  return typeof clave === "string"
      && clave.trim().length > 10
      && !/PEGA-AQUI/i.test(clave);
}

/* Devuelve la key a usar:
   1) la que el equipo activo en este navegador (modo kiosco), o
   2) la de config.js (util al probar en tu compu).
   Si no hay ninguna valida, devuelve null. */
function obtenerClaveGemini() {
  const delKiosco = localStorage.getItem(CLAVE_GEMINI_LS);
  if (claveValida(delKiosco)) return delKiosco.trim();
  if (typeof CONFIG !== "undefined" && claveValida(CONFIG.GEMINI_API_KEY)) {
    return CONFIG.GEMINI_API_KEY.trim();
  }
  return null;
}

/* ¿Esta encendido Gemini y hay una key disponible? */
function geminiDisponible() {
  return typeof CONFIG !== "undefined"
      && CONFIG.USAR_GEMINI === true
      && obtenerClaveGemini() !== null;
}

/* ---- MODO KIOSCO: activar / desactivar Gemini en esta computadora ---- */

/* Guarda la key SOLO en este navegador (no se sube a internet) */
function activarGemini(clave) {
  if (!claveValida(clave)) return false;
  localStorage.setItem(CLAVE_GEMINI_LS, clave.trim());
  actualizarEstadoGemini();
  return true;
}

/* Borra la key de este navegador */
function desactivarGemini() {
  localStorage.removeItem(CLAVE_GEMINI_LS);
  actualizarEstadoGemini();
}

/* Refresca el textito de estado en el Panel del profesor */
function actualizarEstadoGemini() {
  const estado = document.getElementById("estadoGemini");
  if (!estado) return;
  if (geminiDisponible()) {
    estado.textContent = "✅ activado (Gemini)";
    estado.style.color = "#7CFFB2";
  } else {
    estado.textContent = "⚪ desactivado (cerebro local)";
    estado.style.color = "";
  }
}

/* Se llama desde el boton del panel: lee el campo y activa */
function activarGeminiDesdePanel() {
  const campo = document.getElementById("claveGemini");
  if (!campo) return;
  const ok = activarGemini(campo.value);
  if (ok) {
    campo.value = "";   // no dejamos la key escrita a la vista
    if (typeof agregarMensaje === "function") {
      agregarMensaje("Gemini activado en esta computadora. ¡Ya puedo dar respuestas mas completas!", "jago");
    }
  } else {
    alert("Esa key no parece valida. Pega la API key completa de Gemini.");
  }
}

/* ---- Construye las "instrucciones" (personalidad + datos) ----
   Esto le dice a Gemini quien es y QUE puede contar. Usamos la
   misma informacion del cerebro local para que las respuestas
   coincidan con la feria real. */
function instruccionesParaGemini() {
  // Resumimos el conocimiento en un texto que Gemini pueda leer
  const f = cerebro.feria;
  let info = "DATOS DE LA FERIA:\n";
  info += "- Nombre: " + f.nombre + "\n";
  info += "- Fecha: " + f.fecha + "\n";
  info += "- Horario: " + f.horario + "\n";
  info += "- Lugar: " + f.lugar + "\n\n";

  info += "STANDS:\n";
  for (const s of cerebro.stands) {
    info += "- " + s.titulo + " (" + s.grado + "): " + (s.detalle || s.resumen) + "\n";
  }

  if (cerebro.preguntas_frecuentes && cerebro.preguntas_frecuentes.length) {
    info += "\nPREGUNTAS FRECUENTES:\n";
    for (const p of cerebro.preguntas_frecuentes) {
      info += "- P: " + p.pregunta + " R: " + p.respuesta + "\n";
    }
  }

  const persona = cerebro.avatar;
  return (
    "Eres " + persona.nombre + ", la mascota jaguar de la feria. " +
    "Tu personalidad es: " + persona.personalidad + ".\n" +
    "REGLAS:\n" +
    "1. Responde SIEMPRE en espanol, con un tono alegre y amable para ninos y familias.\n" +
    "2. Respuestas CORTAS: 1 a 3 frases. Nada de listas largas.\n" +
    "3. Usa SOLO la informacion de la feria que aparece abajo. No inventes datos.\n" +
    "4. Si te preguntan algo que no esta en la informacion, dilo con amabilidad y " +
    "sugiere preguntar por los stands, el horario o el lugar.\n" +
    "5. No uses asteriscos ni formato Markdown; texto simple porque se leera en voz alta.\n\n" +
    info
  );
}

/* ---- Llama a Gemini y devuelve el texto de la respuesta ----
   Es "async": tarda un poco porque pregunta por internet.
   Devuelve null si algo falla (para usar el cerebro local). */
async function responderConGemini(pregunta) {
  if (!geminiDisponible() || !cerebro) return null;

  const clave = obtenerClaveGemini();
  if (!clave) return null;

  const modelo = CONFIG.GEMINI_MODELO || "gemini-2.5-flash";
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    modelo + ":generateContent?key=" + encodeURIComponent(clave);

  // Ajustamos el "pensamiento" segun el modelo:
  // - flash / flash-lite: pensamiento APAGADO (rapido y barato).
  // - pro (calidad/pago): pensamiento ACOTADO, con espacio extra para que
  //   la respuesta siempre salga (pro no acepta pensamiento en 0).
  const esPro = /pro/i.test(modelo);
  const generationConfig = esPro
    ? { temperature: 0.7, maxOutputTokens: 1024, thinkingConfig: { thinkingBudget: 256 } }
    : { temperature: 0.7, maxOutputTokens: 200,  thinkingConfig: { thinkingBudget: 0 } };

  const cuerpo = {
    system_instruction: { parts: [{ text: instruccionesParaGemini() }] },
    contents: [{ role: "user", parts: [{ text: pregunta }] }],
    generationConfig: generationConfig
  };

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    });

    if (!respuesta.ok) {
      console.warn("Gemini respondio con error:", respuesta.status, await respuesta.text());
      return null;
    }

    const datos = await respuesta.json();
    // El texto viene anidado; lo sacamos con cuidado.
    const texto = datos?.candidates?.[0]?.content?.parts?.[0]?.text;
    return texto ? texto.trim() : null;

  } catch (error) {
    console.warn("No se pudo conectar con Gemini:", error);
    return null;   // Jago usara su cerebro local
  }
}
