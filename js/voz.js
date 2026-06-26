/* ============================================================
   SISTEMA DE VOZ - Entrada (Equipo 4)
   Permite que Jago ESCUCHE por microfono y convierta
   la voz en texto (Speech-to-Text), gratis con el navegador.
   ============================================================ */

// El navegador puede llamarlo de dos formas; tomamos la que exista
const ReconocimientoVoz = window.SpeechRecognition || window.webkitSpeechRecognition;

let reconocimiento = null;     // el "oido" de Jago
let escuchando = false;        // ¿esta escuchando ahora mismo?

// Preparamos el reconocimiento si el navegador lo soporta
if (ReconocimientoVoz) {
  reconocimiento = new ReconocimientoVoz();
  reconocimiento.lang = "es-ES";        // espaniol
  reconocimiento.continuous = false;     // escucha una frase y se detiene
  reconocimiento.interimResults = true;  // muestra el texto mientras hablas
  reconocimiento.maxAlternatives = 1;

  // Cuando entiende lo que dijiste:
  reconocimiento.onresult = function (evento) {
    // Juntamos lo escuchado; distinguimos lo "final" de lo provisional.
    let textoFinal = "";
    let textoParcial = "";
    for (let i = 0; i < evento.results.length; i++) {
      const tramo = evento.results[i][0].transcript;
      if (evento.results[i].isFinal) textoFinal += tramo;
      else textoParcial += tramo;
    }
    const provisional = (textoFinal || textoParcial).trim();
    const hayFinal = textoFinal.trim() !== "";
    const paso = (typeof pasoActual !== "undefined") ? pasoActual : "libre";

    // PASO NOMBRE: el formulario sigue visible -> lo dicho es el nombre.
    if (registroActivo()) {
      const campoNombre = document.getElementById("campoNombre");
      if (campoNombre) campoNombre.value = extraerNombre(provisional);
      if (hayFinal) ponerNombreDesdeVoz(textoFinal.trim());  // lo coloca y sigue la charla
      return;
    }

    // PASO HIJO: entendemos "si" / "no" hablado.
    if (paso === "hijo" && hayFinal) {
      const r = parsearSiNo(textoFinal);
      if (r !== null && typeof responderHijo === "function") {
        responderHijo(r);
        return;
      }
      // si no se entendio, cae al chat normal mas abajo
    }

    // PASO GRADO: entendemos el grado hablado (sexto..undecimo, o numeros).
    if (paso === "grado" && hayFinal) {
      const g = parsearGrado(textoFinal);
      if (g && typeof elegirGrado === "function") {
        elegirGrado(g);
        return;
      }
    }

    // Si no, es una pregunta normal del chat.
    cajaTexto.value = provisional;
    if (hayFinal) {
      enviarPregunta();
    }
  };

  // Cuando empieza a escuchar:
  reconocimiento.onstart = function () {
    escuchando = true;
    actualizarBotonMicro();
  };

  // Cuando termina (o hay error):
  reconocimiento.onend = function () {
    escuchando = false;
    actualizarBotonMicro();
  };

  reconocimiento.onerror = function (evento) {
    escuchando = false;
    actualizarBotonMicro();
    if (evento.error === "not-allowed") {
      agregarMensaje("Necesito permiso para usar el microfono. Acepta el aviso del navegador.", "jago");
    } else if (evento.error === "no-speech") {
      agregarMensaje("No escuche nada. Intenta de nuevo y habla cerca del microfono.", "jago");
    }
  };
}

/* ¿Seguimos en el paso de pedir el nombre? (el formulario sigue visible) */
function registroActivo() {
  const reg = document.getElementById("registro");
  const campo = document.getElementById("campoNombre");
  return !!(reg && campo && reg.style.display !== "none");
}

/* Pone cada palabra con Mayuscula inicial: "juan perez" -> "Juan Perez" */
function capitalizar(texto) {
  return texto
    .toLowerCase()
    .split(/\s+/)
    .map(p => p ? p.charAt(0).toUpperCase() + p.slice(1) : "")
    .join(" ")
    .trim();
}

/* Quita frases comunes para dejar solo el nombre:
   "hola me llamo Juan" / "soy Maria" / "mi nombre es Ana" -> el nombre */
function extraerNombre(texto) {
  let t = (texto || "").trim();
  t = t.replace(/^hola[,\s]+/i, "");
  t = t.replace(/^(me llamo|mi nombre es|me dicen|yo soy|soy)\s+/i, "");
  t = t.replace(/[.,!?¿¡]/g, "").trim();
  return capitalizar(t);
}

/* Coloca el nombre dicho por voz en el campo y sigue la conversacion
   (Jago saluda por su nombre y pregunta si tiene hijo/a y el grado). */
function ponerNombreDesdeVoz(textoDicho) {
  const limpio = extraerNombre(textoDicho);
  if (!limpio) return;
  // Un solo campo "Nombre y apellido": ponemos todo lo dicho ahi.
  const campoNombre = document.getElementById("campoNombre");
  if (campoNombre) campoNombre.value = limpio;
  // Avanza el saludo guiado (saludo personalizado + pregunta por el hijo/grado)
  if (typeof pasoNombreSiguiente === "function") pasoNombreSiguiente();
}

/* Normaliza (sin acentos, minusculas). Usa la de cerebro.js si existe. */
function normalizarVoz(texto) {
  if (typeof normalizar === "function") return normalizar(texto);
  return (texto || "").toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[¿?¡!.,]/g, "").trim();
}

/* Entiende un "si" o un "no" hablado. Devuelve true / false / null (no claro). */
function parsearSiNo(texto) {
  const t = normalizarVoz(texto);
  // Negativos primero ("no tengo" contiene "tengo")
  if (/\b(no|nop|negativo|ninguno|tampoco|nada)\b/.test(t) || t.includes("no tengo") || t.includes("para nada")) {
    return false;
  }
  if (/\b(si|sip|claro|correcto|afirmativo|tengo|obvio|exacto|efectivamente|seguro)\b/.test(t)
      || t.includes("asi es") || t.includes("por supuesto") || t.includes("desde luego") || t.includes("claro que si")) {
    return true;
  }
  return null;
}

/* Entiende el grado hablado. Devuelve la clave ("Sexto".."Undecimo") o null.
   Se revisa de mayor a menor para que "undecimo" no choque con "decimo". */
function parsearGrado(texto) {
  const t = normalizarVoz(texto);
  const mapa = [
    ["Undecimo", ["undecimo", "decimo primero", "onceavo", "once", "11"]],
    ["Decimo",   ["decimo", "10"]],
    ["Noveno",   ["noveno", "9"]],
    ["Octavo",   ["octavo", "8"]],
    ["Septimo",  ["septimo", "setimo", "7"]],
    ["Sexto",    ["sexto", "6"]]
  ];
  for (const [clave, palabras] of mapa) {
    for (const p of palabras) {
      if (t.includes(p)) return clave;
    }
  }
  return null;
}

/* Inicia o detiene la escucha (se llama desde el boton del microfono) */
function escuchar() {
  if (!reconocimiento) {
    agregarMensaje("Este navegador no puede escuchar. Usa Chrome o Edge.", "jago");
    return;
  }
  if (escuchando) {
    reconocimiento.stop();   // si ya esta escuchando, lo apagamos
  } else {
    // Jago deja de hablar para no escucharse a si mismo por el microfono
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (typeof pararDeHablar === "function") pararDeHablar();
    cajaTexto.value = "";
    try {
      reconocimiento.start();  // empezamos a escuchar
    } catch (e) {
      // start() puede fallar si se toca muy rapido; reintentamos una vez
      console.warn("Reintentando microfono:", e);
      setTimeout(() => { try { reconocimiento.start(); } catch (_) {} }, 250);
    }
  }
}

/* Cambia el aspecto del boton segun si esta escuchando */
function actualizarBotonMicro() {
  const boton = document.getElementById("botonMicro");
  if (!boton) return;
  if (escuchando) {
    boton.classList.add("escuchando");
    boton.textContent = "🎤 Escuchando...";
  } else {
    boton.classList.remove("escuchando");
    boton.textContent = "🎤 Hablar";
  }
}
