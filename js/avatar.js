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

/* ---- 7. El visitante escribe su nombre y empezamos ---- */
function comenzarConNombre() {
  const campo = document.getElementById("campoNombre");
  const nombre = campo.value.trim();
  if (nombre === "") {
    campo.focus();
    return;
  }

  iniciarVisitante(nombre);                 // lo guarda en la base de datos
  document.getElementById("registro").style.display = "none"; // oculta el formulario

  const saludo = "Mucho gusto, " + nombre + "! Preguntame lo que quieras sobre la feria.";
  agregarMensaje(saludo, "jago");
  hablar(saludo);
  actualizarPanelDatos();
}

/* ---- 8. Modo ajuste de la boca (para el Equipo 5) ----
   Muestra/oculta la boca con borde para colocarla justo sobre
   la boca del jaguar. Luego se ajustan los numeros en estilos.css
   (--boca-x, --boca-y, --boca-ancho, --boca-alto). */
function alternarAjusteBoca() {
  document.body.classList.toggle("ajustar-boca");
}
