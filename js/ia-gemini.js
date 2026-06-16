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

/* ¿Esta configurado y encendido Gemini? */
function geminiDisponible() {
  return typeof CONFIG !== "undefined"
      && CONFIG.USAR_GEMINI === true
      && typeof CONFIG.GEMINI_API_KEY === "string"
      && CONFIG.GEMINI_API_KEY.trim().length > 0
      && !/PEGA-AQUI/i.test(CONFIG.GEMINI_API_KEY);
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

  const modelo = CONFIG.GEMINI_MODELO || "gemini-2.5-flash";
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    modelo + ":generateContent?key=" + encodeURIComponent(CONFIG.GEMINI_API_KEY);

  const cuerpo = {
    system_instruction: { parts: [{ text: instruccionesParaGemini() }] },
    contents: [{ role: "user", parts: [{ text: pregunta }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200,
      // Apagamos el "pensamiento" del modelo: respuestas mas directas,
      // mas rapidas y MAS BARATAS (no gasta tokens pensando).
      thinkingConfig: { thinkingBudget: 0 }
    }
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
