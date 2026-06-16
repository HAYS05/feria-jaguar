/* ============================================================
   FASE 6 - INTEGRACION CON LA WEB DE LA FERIA (resumir stand)
   ------------------------------------------------------------
   Aqui Jago se "junta" con el contenido de la feria:
   - Dibuja una GALERIA con tarjetas de cada stand.
   - Al tocar una tarjeta, Jago la RESUME en voz alta.
   - Cada stand puede enlazar a su pagina web real (campo "url").
   Todo gratis y sin internet (el resumen se hace en el navegador).
   ============================================================ */

/* ---- 1. RESUMIR: acorta un texto largo a pocas frases ----
   No usa inteligencia artificial; parte el texto en frases
   (cada punto "." es una frase) y se queda con las primeras.
   maxFrases = cuantas frases queremos conservar. */
function resumir(texto, maxFrases = 2) {
  if (!texto) return "";
  // Quitamos la marca "EJEMPLO:" si todavia esta puesta
  const limpio = texto.replace(/^EJEMPLO:\s*/i, "").trim();
  // Partimos por puntos y nos quedamos con las frases con contenido
  const frases = limpio.split(/(?<=\.)\s+/).filter(f => f.trim().length > 0);
  return frases.slice(0, maxFrases).join(" ").trim();
}

/* ---- 2. Arma el texto que Jago dice al resumir un stand ---- */
function resumenDeStandWeb(stand) {
  // Si el stand tiene "detalle" largo, lo resumimos; si no, usamos el "resumen".
  const cuerpo = stand.detalle ? resumir(stand.detalle, 2) : stand.resumen;
  return "El stand de " + stand.titulo + " (" + stand.grado + "): " + cuerpo;
}

/* ---- 3. Busca un stand por su id (ej: "robotica") ---- */
function buscarStandPorId(id) {
  if (!cerebro) return null;
  return cerebro.stands.find(s => s.id === id) || null;
}

/* ---- 4. Lista todos los stands (cuando preguntan "que stands hay") ---- */
function listarStands() {
  if (!cerebro || !cerebro.stands.length) {
    return "Todavia no tengo stands cargados.";
  }
  const titulos = cerebro.stands.map(s => s.titulo);
  return "En la feria tenemos " + cerebro.stands.length + " stands: " +
         titulos.join(", ") + ". Toca uno en la galeria o preguntame por su nombre.";
}

/* ---- 5. ¿El enlace es real o todavia es un EJEMPLO? ----
   Sirve para no mandar al visitante a una pagina inventada. */
function enlaceValido(url) {
  return !!url && /^https?:\/\//i.test(url) && !/EJEMPLO/i.test(url);
}

/* ---- 6. Cuando el visitante toca una tarjeta de stand ----
   Jago lo trata como si el visitante hubiera preguntado por el. */
function preguntarPorStand(id) {
  const stand = buscarStandPorId(id);
  if (!stand) return;

  const pregunta = "Cuentame sobre el stand de " + stand.titulo;
  agregarMensaje(pregunta, "usuario");

  const respuesta = resumenDeStandWeb(stand);
  agregarMensaje(respuesta, "jago");
  hablar(respuesta);

  // Si el stand tiene su pagina real, ofrecemos el enlace para ver mas.
  if (enlaceValido(stand.url)) {
    agregarEnlace("Ver la pagina del stand de " + stand.titulo, stand.url);
  }

  registrarInteraccion(pregunta, respuesta);
  actualizarPanelDatos();
}

/* ---- 7. Muestra un enlace clickeable dentro del chat ---- */
function agregarEnlace(texto, url) {
  const burbuja = document.createElement("div");
  burbuja.className = "mensaje jago";
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.target = "_blank";          // abre en otra pestania
  enlace.rel = "noopener";
  enlace.textContent = "🔗 " + texto;
  enlace.className = "enlace-stand";
  burbuja.appendChild(enlace);
  conversacion.appendChild(burbuja);
  conversacion.scrollTop = conversacion.scrollHeight;
}

/* ---- 8. Dibuja la GALERIA de stands en la pagina ----
   Se llama una vez que el cerebro ya cargo (desde avatar.js). */
function construirGaleriaStands() {
  const galeria = document.getElementById("galeriaStands");
  if (!galeria || !cerebro) return;

  galeria.innerHTML = "";   // por si se vuelve a dibujar

  for (const stand of cerebro.stands) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-stand";

    const titulo = document.createElement("h3");
    titulo.textContent = stand.titulo;

    const grado = document.createElement("span");
    grado.className = "tarjeta-grado";
    grado.textContent = stand.grado;

    const resumen = document.createElement("p");
    resumen.textContent = resumir(stand.detalle || stand.resumen, 1);

    const botones = document.createElement("div");
    botones.className = "tarjeta-botones";

    const btnJago = document.createElement("button");
    btnJago.textContent = "🐆 Pregúntale a Jago";
    btnJago.onclick = () => preguntarPorStand(stand.id);
    botones.appendChild(btnJago);

    // El boton "Ver pagina" solo aparece si hay un enlace real
    if (enlaceValido(stand.url)) {
      const verPagina = document.createElement("a");
      verPagina.href = stand.url;
      verPagina.target = "_blank";
      verPagina.rel = "noopener";
      verPagina.className = "tarjeta-enlace";
      verPagina.textContent = "Ver página";
      botones.appendChild(verPagina);
    }

    tarjeta.append(titulo, grado, resumen, botones);
    galeria.appendChild(tarjeta);
  }
}
