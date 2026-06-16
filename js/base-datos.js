/* ============================================================
   BASE DE DATOS de visitantes (gratis, sin servidor)
   Guarda en el navegador (localStorage) quien interactua con
   Jago, a que hora y que pregunto. Se puede descargar despues.

   ETICA (Seccion G): solo pedimos el NOMBRE. Nunca datos
   sensibles (telefono, direccion, etc.).
   ============================================================ */

const CLAVE_BD = "jago_visitantes";   // nombre de la "caja" donde guardamos

let visitanteActual = null;           // la persona que esta usando Jago ahora

/* Lee todos los visitantes guardados (devuelve una lista) */
function obtenerVisitantes() {
  const texto = localStorage.getItem(CLAVE_BD);
  return texto ? JSON.parse(texto) : [];
}

/* Guarda la lista completa en el navegador */
function guardarVisitantes(lista) {
  localStorage.setItem(CLAVE_BD, JSON.stringify(lista));
}

/* Registra a una persona nueva cuando escribe su nombre */
function iniciarVisitante(nombre) {
  visitanteActual = {
    nombre: nombre,
    inicio: new Date().toLocaleString(),
    interacciones: []
  };
  const lista = obtenerVisitantes();
  lista.push(visitanteActual);
  guardarVisitantes(lista);
}

/* Guarda cada pregunta y respuesta de la conversacion */
function registrarInteraccion(pregunta, respuesta) {
  // Si nadie puso su nombre, lo guardamos como "Anonimo"
  if (!visitanteActual) {
    iniciarVisitante("Anonimo");
  }
  visitanteActual.interacciones.push({
    hora: new Date().toLocaleTimeString(),
    pregunta: pregunta,
    respuesta: respuesta
  });

  // Volvemos a guardar (actualizamos al ultimo visitante de la lista)
  const lista = obtenerVisitantes();
  lista[lista.length - 1] = visitanteActual;
  guardarVisitantes(lista);
}

/* ----- Para el PROFESOR: ver y descargar los datos ----- */

/* Cuenta cuantas personas han interactuado */
function contarVisitantes() {
  return obtenerVisitantes().length;
}

/* Descarga todo en un archivo JSON */
function descargarJSON() {
  const datos = JSON.stringify(obtenerVisitantes(), null, 2);
  descargarArchivo(datos, "visitantes-jago.json", "application/json");
}

/* Descarga todo en un archivo CSV (se abre en Excel) */
function descargarCSV() {
  const visitantes = obtenerVisitantes();
  let csv = "Nombre,Inicio,Hora,Pregunta,Respuesta\n";
  for (const v of visitantes) {
    if (v.interacciones.length === 0) {
      csv += `"${v.nombre}","${v.inicio}","","",""\n`;
    }
    for (const i of v.interacciones) {
      csv += `"${v.nombre}","${v.inicio}","${i.hora}","${i.pregunta}","${i.respuesta}"\n`;
    }
  }
  descargarArchivo(csv, "visitantes-jago.csv", "text/csv");
}

/* Borra TODOS los datos (pide confirmacion) */
function borrarDatos() {
  if (confirm("¿Seguro que quieres borrar TODOS los registros de visitantes?")) {
    localStorage.removeItem(CLAVE_BD);
    visitanteActual = null;
    actualizarPanelDatos();
    alert("Datos borrados.");
  }
}

/* Funcion auxiliar: crea y descarga un archivo */
function descargarArchivo(contenido, nombreArchivo, tipo) {
  const blob = new Blob([contenido], { type: tipo });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

/* Actualiza el contador que ve el profesor */
function actualizarPanelDatos() {
  const contador = document.getElementById("contadorVisitantes");
  if (contador) contador.textContent = contarVisitantes();
}
