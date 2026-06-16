/* ============================================================
   CEREBRO LOCAL de Jago
   Entiende la pregunta del usuario y elige la mejor respuesta
   usando datos/conocimiento.json. Funciona SIN internet.
   ============================================================ */

/* Quita acentos y mayusculas para comparar mas facil.
   "¿A qué HORA?" -> "a que hora" */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")                 // separa las letras de sus acentos
    .replace(/[̀-ͯ]/g, "")  // borra los acentos
    .replace(/[¿?¡!.,]/g, "")         // borra signos
    .trim();
}

/* Cuenta cuantas palabras clave aparecen en el texto del usuario */
function contarCoincidencias(textoUsuario, palabrasClave) {
  let puntos = 0;
  for (const palabra of palabrasClave) {
    if (textoUsuario.includes(normalizar(palabra))) {
      puntos++;
    }
  }
  return puntos;
}

/* Funcion principal: recibe lo que escribio el usuario,
   devuelve la respuesta de Jago (texto). */
function responder(textoUsuario) {
  if (!cerebro) {
    return "Todavia estoy cargando mi informacion, intenta en un momento.";
  }

  const texto = normalizar(textoUsuario);

  // --- 1. Saludos ---
  const palabrasSaludo = ["hola", "buenas", "buenos dias", "buenas tardes", "que tal", "saludos"];
  if (contarCoincidencias(texto, palabrasSaludo) > 0) {
    return elegirAlAzar(cerebro.avatar.saludos);
  }

  // --- 2. Despedidas ---
  const palabrasDespedida = ["adios", "chao", "hasta luego", "nos vemos", "bye", "gracias"];
  if (contarCoincidencias(texto, palabrasDespedida) > 0) {
    return elegirAlAzar(cerebro.avatar.despedidas);
  }

  // --- 3. Preguntas frecuentes ---
  let mejorFAQ = null;
  let mejorPuntajeFAQ = 0;
  for (const faq of cerebro.preguntas_frecuentes) {
    const puntos = contarCoincidencias(texto, faq.palabras_clave);
    if (puntos > mejorPuntajeFAQ) {
      mejorPuntajeFAQ = puntos;
      mejorFAQ = faq;
    }
  }

  // --- 4. Stands ---
  let mejorStand = null;
  let mejorPuntajeStand = 0;
  for (const stand of cerebro.stands) {
    const puntos = contarCoincidencias(texto, stand.palabras_clave);
    if (puntos > mejorPuntajeStand) {
      mejorPuntajeStand = puntos;
      mejorStand = stand;
    }
  }

  // --- 4.5 Lista de stands ("que stands hay", "muestrame los stands") ---
  if (contarCoincidencias(texto, ["que stands", "cuales stands", "lista de stands", "todos los stands", "muestrame los stands", "que hay en la feria", "proyectos"]) > 0) {
    return (typeof listarStands === "function")
      ? listarStands()
      : "Tenemos varios stands. Preguntame por uno por su nombre.";
  }

  // --- 5. Datos de la feria (horario, lugar, fecha) ---
  if (contarCoincidencias(texto, ["hora", "horario", "abre", "cierra", "cuando"]) > 0) {
    return "La feria " + cerebro.feria.nombre + " es " + cerebro.feria.horario + ".";
  }
  if (contarCoincidencias(texto, ["donde", "lugar", "ubicacion", "direccion"]) > 0) {
    return "Nos encuentras en: " + cerebro.feria.lugar + ".";
  }
  if (contarCoincidencias(texto, ["fecha", "dia", "cuando es"]) > 0) {
    return "La feria es el " + cerebro.feria.fecha + ".";
  }

  // --- Decidir cual gana: FAQ o Stand ---
  if (mejorPuntajeStand > 0 && mejorPuntajeStand >= mejorPuntajeFAQ) {
    return resumenDeStand(mejorStand);
  }
  if (mejorPuntajeFAQ > 0) {
    return mejorFAQ.respuesta;
  }

  // --- Nada coincidio ---
  return cerebro.respuesta_por_defecto;
}

/* Arma una frase bonita para describir un stand.
   Si la Fase 6 (feria.js) esta cargada, usa el resumen del
   texto largo "detalle"; si no, usa el resumen corto de siempre. */
function resumenDeStand(stand) {
  if (typeof resumenDeStandWeb === "function") {
    return resumenDeStandWeb(stand);
  }
  return "El stand de " + stand.titulo + " (" + stand.grado + "): " + stand.resumen;
}

/* Elige un elemento al azar de una lista */
function elegirAlAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}
