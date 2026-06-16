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
  reconocimiento.interimResults = false; // solo el resultado final

  // Cuando entiende lo que dijiste:
  reconocimiento.onresult = function (evento) {
    const textoDicho = evento.results[0][0].transcript;
    cajaTexto.value = textoDicho;   // lo escribe en la caja
    enviarPregunta();               // y Jago responde
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

/* Inicia o detiene la escucha (se llama desde el boton del microfono) */
function escuchar() {
  if (!reconocimiento) {
    agregarMensaje("Este navegador no puede escuchar. Usa Chrome o Edge.", "jago");
    return;
  }
  if (escuchando) {
    reconocimiento.stop();   // si ya esta escuchando, lo apagamos
  } else {
    reconocimiento.start();  // si no, empezamos a escuchar
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
