/* ============================================================
   BASE DE DATOS EN LA NUBE (Supabase) - guarda a todos los
   visitantes en UN solo lugar central, desde cualquier dispositivo.
   ------------------------------------------------------------
   Si no esta configurada (config.js), no pasa nada: Jago sigue
   guardando en el navegador (base-datos.js) como respaldo.
   La "anon key" de Supabase es PUBLICA por diseño; la seguridad
   la dan las reglas RLS (solo permite INSERTAR, no leer).
   ============================================================ */

function nubeConfigurada() {
  return typeof CONFIG !== "undefined"
      && typeof CONFIG.SUPABASE_URL === "string"
      && typeof CONFIG.SUPABASE_ANON_KEY === "string"
      && /^https?:\/\//i.test(CONFIG.SUPABASE_URL)
      && !/PEGA-AQUI/i.test(CONFIG.SUPABASE_URL)
      && CONFIG.SUPABASE_ANON_KEY.length > 20
      && !/PEGA-AQUI/i.test(CONFIG.SUPABASE_ANON_KEY);
}

/* Inserta una fila en una tabla de Supabase (via API REST, sin librerias) */
async function guardarEnNube(tabla, fila) {
  if (!nubeConfigurada()) return;
  try {
    await fetch(CONFIG.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/" + tabla, {
      method: "POST",
      headers: {
        "apikey": CONFIG.SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + CONFIG.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(fila)
    });
  } catch (e) {
    console.warn("No se pudo guardar en la nube (se guardo local):", e);
  }
}

/* Guarda a un visitante (cuando termina el saludo) */
function guardarVisitanteNube(v) {
  if (!v) return;
  guardarEnNube("visitantes", {
    nombre: v.nombre || "",
    apellido: v.apellido || "",
    hijo_sms: v.hijoEnSMS || "",
    grado: v.grado || ""
  });
}

/* Guarda una pregunta y su respuesta */
function guardarMensajeNube(nombre, apellido, pregunta, respuesta) {
  guardarEnNube("mensajes", {
    nombre: nombre || "",
    apellido: apellido || "",
    pregunta: pregunta || "",
    respuesta: respuesta || ""
  });
}
