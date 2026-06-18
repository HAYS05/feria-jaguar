/* ============================================================
   CONFIGURACION DE JAGO
   ------------------------------------------------------------
   MODO KIOSCO (recomendado para la pagina publicada):
     NO escribas la key aqui. Dejala como "PEGA-AQUI-TU-API-KEY".
     En la computadora de la feria, abre la pagina, despliega el
     "Panel del profesor" y pega ahi la API key (boton "Activar
     Gemini"). Se guarda SOLO en ese navegador, nunca se sube.

   USO LOCAL (opcional, solo para probar en tu compu):
     Puedes pegar tu key abajo y se usara al abrir con INICIAR.bat.
     Pero si vas a subir el proyecto a internet, dejala vacia.
   ============================================================ */

const CONFIG = {
  // Key para uso LOCAL. Para la web publica, dejala como ejemplo
  // y usa el modo kiosco (Panel del profesor).
  GEMINI_API_KEY: "PEGA-AQUI-TU-API-KEY",

  // Modelo. Con la KEY DE PAGO conviene la maxima calidad: "gemini-2.5-pro".
  // Alternativas mas economicas: "gemini-2.5-flash" o "gemini-2.5-flash-lite".
  GEMINI_MODELO: "gemini-2.5-pro",

  // true = permitir Gemini (kiosco o local).  false = solo cerebro local.
  USAR_GEMINI: true,

  // ---- BASE DE DATOS EN LA NUBE (Supabase) ----
  // Pega aqui los datos de TU proyecto Supabase (Settings -> API).
  // Estos SI se pueden subir/publicar: la "anon key" es publica por diseno
  // y la seguridad la dan las reglas (solo permite GUARDAR, no leer).
  // Si las dejas como "PEGA-AQUI...", Jago guarda solo en el navegador.
  SUPABASE_URL: "https://hjwppjiyglbasvcuxscz.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_jpUFjXL9FOPlu6aiwaw77A_uuO7_w8Y"
};
