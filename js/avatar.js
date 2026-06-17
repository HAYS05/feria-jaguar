/* ============================================================
   JAGO - Asistente virtual de la Feria Tecnologica
   Maneja: cargar el cerebro, hablar en voz alta, y el chat.
   ============================================================ */

// Aqui guardaremos el "cerebro" (lo que carga desde datos/conocimiento.json)
let cerebro = null;

// Elementos de la pagina que vamos a usar
const globoMarco = document.getElementById("marcoAvatar");
const conversacion = document.getElementById("conversacion");
const cajaTexto = document.getElementById("cajaTexto");
const boca = document.getElementById("boca");

// Control del movimiento de la boca
let intervaloBoca = null;       // mueve la boca suavemente
let intervaloObjetivo = null;   // cambia cada cuanto se abre
let aperturaActual = 0.12;      // que tan abierta esta AHORA
let aperturaObjetivo = 0.12;    // hacia donde se mueve

/* ---- 1. Cargar el cerebro al abrir la pagina ---- */
fetch("datos/conocimiento.json")
  .then(respuesta => respuesta.json())
  .then(datos => {
    cerebro = datos;
    console.log("Cerebro cargado:", cerebro);
    // Mensaje de bienvenida automatico
    const bienvenida = elegirAlAzar(cerebro.avatar.saludos);
    agregarMensaje(bienvenida, "jago");
    // Mostramos cuantas personas hay registradas (panel del profesor)
    actualizarPanelDatos();
    // Fase 6: dibujamos la galeria de stands de la feria
    if (typeof construirGaleriaStands === "function") construirGaleriaStands();
    // Modo kiosco: mostramos si Gemini esta activado en esta computadora
    if (typeof actualizarEstadoGemini === "function") actualizarEstadoGemini();
  })
  .catch(error => {
    console.error("No se pudo cargar el cerebro:", error);
    agregarMensaje("No pude cargar mi informacion. Abre la pagina con INICIAR.bat (ver LEEME.txt).", "jago");
  });

/* ---- 2. Hacer que el jaguar HABLE en voz alta ---- */
function hablar(texto) {
  if (!("speechSynthesis" in window)) {
    console.warn("Este navegador no tiene voz. Usa Chrome o Edge.");
    return;
  }
  window.speechSynthesis.cancel(); // corta cualquier voz anterior

  const vozTexto = new SpeechSynthesisUtterance(texto);
  vozTexto.lang = "es-ES";   // espaniol
  vozTexto.rate = 1;         // velocidad
  vozTexto.pitch = 1.1;      // tono (un poco mas agudo, mas amistoso)

  // === Sincronizado con el SONIDO real ===
  // La boca empieza JUSTO cuando comienza el audio...
  vozTexto.onstart = empezarAHablar;
  // ...y se cierra cuando el audio termina (o si hay error).
  vozTexto.onend = pararDeHablar;
  vozTexto.onerror = pararDeHablar;

  // En cada palabra pronunciada, abrimos mas la boca (ritmo del habla real)
  vozTexto.onboundary = function () {
    aperturaObjetivo = 0.85 + Math.random() * 0.15; // bien abierta en la palabra
  };

  // Red de seguridad: si "onstart" no llega pero ya esta sonando, arrancamos
  setTimeout(() => {
    if (window.speechSynthesis.speaking && !intervaloBoca) empezarAHablar();
  }, 300);

  window.speechSynthesis.speak(vozTexto);
}

/* Empieza la animacion cuando comienza el sonido */
function empezarAHablar() {
  if (intervaloBoca) return;  // ya esta en marcha, no dupliques
  globoMarco.classList.add("hablando");
  boca.classList.add("activa");

  // Cada ~140ms elegimos un nuevo "objetivo" de apertura (ritmo del habla)
  intervaloObjetivo = setInterval(() => {
    aperturaObjetivo = 0.25 + Math.random() * 0.65;
  }, 140);

  // Cada 40ms movemos la boca SUAVEMENTE hacia ese objetivo (natural, sin saltos)
  intervaloBoca = setInterval(() => {
    aperturaActual += (aperturaObjetivo - aperturaActual) * 0.4;
    boca.style.transform = "scaleY(" + aperturaActual.toFixed(3) + ")";
  }, 40);
}

/* Detiene la animacion y cierra la boca al terminar el sonido */
function pararDeHablar() {
  clearInterval(intervaloBoca);
  clearInterval(intervaloObjetivo);
  intervaloBoca = null;
  intervaloObjetivo = null;
  globoMarco.classList.remove("hablando");
  boca.classList.remove("activa");
  aperturaActual = 0.12;
  aperturaObjetivo = 0.12;
  boca.style.transform = "scaleY(0.12)"; // cerrada
}

/* ---- 3. Mostrar un mensaje en el chat ----
   quien = "usuario" o "jago" */
function agregarMensaje(texto, quien) {
  const burbuja = document.createElement("div");
  burbuja.className = "mensaje " + quien;
  burbuja.textContent = texto;
  conversacion.appendChild(burbuja);
  // Bajar el scroll para ver el ultimo mensaje
  conversacion.scrollTop = conversacion.scrollHeight;
  return burbuja;   // lo devolvemos por si hay que actualizarlo despues
}

/* ---- 4. El usuario envia una pregunta ----
   Es "async" porque preguntarle a Gemini tarda un poquito.
   Si Gemini no esta disponible o falla, usa el cerebro local. */
async function enviarPregunta() {
  const pregunta = cajaTexto.value.trim();
  if (pregunta === "") return;

  agregarMensaje(pregunta, "usuario");   // muestra lo que escribio
  cajaTexto.value = "";                   // limpia la caja

  let respuesta = null;

  // --- Intento 1: respuesta inteligente con Gemini (Fase 7) ---
  if (typeof responderConGemini === "function" && typeof geminiDisponible === "function" && geminiDisponible()) {
    const pensando = agregarMensaje("Jago esta pensando…", "jago");
    respuesta = await responderConGemini(pregunta);
    pensando.remove();   // quitamos el "pensando..." al llegar la respuesta
  }

  // --- Respaldo: cerebro local (si no hubo Gemini o fallo) ---
  if (!respuesta) {
    respuesta = responder(pregunta);
  }

  agregarMensaje(respuesta, "jago");      // muestra la respuesta
  hablar(respuesta);                      // y la dice en voz alta

  // Guardamos la conversacion en la base de datos
  registrarInteraccion(pregunta, respuesta);
  actualizarPanelDatos();
}

/* ---- 5. Botones de ejemplo ---- */
function preguntarEjemplo(texto) {
  cajaTexto.value = texto;
  enviarPregunta();
}

/* ---- 6. Boton "Saludar" ---- */
function saludar() {
  if (!cerebro) return;
  const saludo = elegirAlAzar(cerebro.avatar.saludos);
  agregarMensaje(saludo, "jago");
  hablar(saludo);
}

/* ---- 7. SALUDO GUIADO (nombre -> hijo en SMS -> grado -> proyectos) ---- */

let regNombre = "";      // datos que vamos juntando durante el saludo
let regApellido = "";

/* Nombres bonitos (con acento) para mostrar en botones/mensajes */
const GRADO_LINDO = {
  "Sexto": "Sexto", "Septimo": "Séptimo", "Octavo": "Octavo",
  "Noveno": "Noveno", "Decimo": "Décimo", "Undecimo": "Undécimo"
};
function gradoLindo(g) { return GRADO_LINDO[g] || g; }
function limpiarEjemplo(t) { return (t || "").replace(/^EJEMPLO:\s*/i, "").trim(); }

/* Pone botones de respuesta rapida que Jago ofrece durante la charla */
function mostrarRespuestasRapidas(opciones) {
  const cont = document.getElementById("respuestasRapidas");
  if (!cont) return;
  cont.innerHTML = "";
  for (const op of opciones) {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = op.texto;
    b.onclick = op.fn;
    cont.appendChild(b);
  }
}
function limpiarRespuestasRapidas() {
  const cont = document.getElementById("respuestasRapidas");
  if (cont) cont.innerHTML = "";
}

/* Paso 1: el visitante da su nombre y Jago TOMA la conversacion */
function pasoNombreSiguiente() {
  const n = document.getElementById("campoNombre").value.trim();
  const a = document.getElementById("campoApellido").value.trim();
  if (n === "") { document.getElementById("campoNombre").focus(); return; }
  regNombre = n;
  regApellido = a;
  iniciarVisitante(n, a);                          // lo registra en la base de datos
  document.getElementById("registro").style.display = "none";
  actualizarPanelDatos();

  // Jago pregunta (en el chat, con voz) si tiene hijo en el colegio
  const msg = "¡Mucho gusto, " + n + "! ¿Tienes un hijo o hija aquí en Saint Margaret?";
  agregarMensaje(msg, "jago");
  hablar(msg);
  mostrarRespuestasRapidas([
    { texto: "Sí", fn: () => responderHijo(true) },
    { texto: "No", fn: () => responderHijo(false) }
  ]);
}

/* Responde a "¿tienes hijo aqui?" */
function responderHijo(tieneHijo) {
  limpiarRespuestasRapidas();
  agregarMensaje(tieneHijo ? "Sí" : "No", "usuario");
  actualizarDatosVisitante({ hijoEnSMS: tieneHijo ? "Si" : "No" });

  if (tieneHijo) {
    const msg = "¡Genial! ¿En qué grado está?";
    agregarMensaje(msg, "jago");
    hablar(msg);
    const grados = (cerebro && cerebro.grados_disponibles) || [];
    mostrarRespuestasRapidas(
      grados.map(g => ({ texto: gradoLindo(g), fn: () => elegirGrado(g) }))
    );
  } else {
    const msg = "¡Bienvenido a la feria! Pregúntame lo que quieras: el horario, el lugar o los proyectos.";
    agregarMensaje(msg, "jago");
    hablar(msg);
  }
  actualizarPanelDatos();
}

/* Responde al grado elegido y Jago presenta los proyectos */
function elegirGrado(grado) {
  limpiarRespuestasRapidas();
  agregarMensaje(gradoLindo(grado), "usuario");
  actualizarDatosVisitante({ grado: grado });
  mostrarProyectosDeGrado(grado);
  actualizarPanelDatos();
}

/* Muestra (y dice) los proyectos del grado elegido */
function mostrarProyectosDeGrado(grado) {
  const lista = (cerebro.proyectos_por_grado && cerebro.proyectos_por_grado[grado]) || [];
  if (!lista.length) {
    const m = "Por ahora no tengo cargados los proyectos de " + gradoLindo(grado) +
              ", pero puedes ver todos los stands aquí abajo o preguntarme lo que quieras.";
    agregarMensaje(m, "jago");
    hablar(m);
    return;
  }
  const titulos = lista.map(p => limpiarEjemplo(p.titulo));
  const intro = "En " + gradoLindo(grado) + " puedes ver: " + titulos.join(", ") + ".";
  agregarMensaje(intro, "jago");
  hablar(intro);
  for (const p of lista) {
    agregarMensaje("• " + limpiarEjemplo(p.titulo) + ": " + limpiarEjemplo(p.resumen), "jago");
  }
  agregarMensaje("¿Quieres que te cuente más de alguno, o tienes otra pregunta?", "jago");
}

/* ---- 8. Modo ajuste de la boca (para el Equipo 5) ----
   Muestra/oculta la boca con borde para colocarla justo sobre
   la boca del jaguar. Luego se ajustan los numeros en estilos.css
   (--boca-x, --boca-y, --boca-ancho, --boca-alto). */
function alternarAjusteBoca() {
  document.body.classList.toggle("ajustar-boca");
}
