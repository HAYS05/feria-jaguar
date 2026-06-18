/* ============================================================
   PLANTILLA DE CONFIGURACION (segura para compartir)
   ------------------------------------------------------------
   1. Haz una COPIA de este archivo y llamala  config.js
   2. En config.js pega tu API Key de Google AI Studio.
   3. NO subas config.js a internet (ya esta en .gitignore).
   ============================================================ */

const CONFIG = {
  // Tu API Key de https://aistudio.google.com/apikey
  GEMINI_API_KEY: "PEGA-AQUI-TU-API-KEY",

  // Modelo de Gemini:
  //   "gemini-2.5-flash"      -> economico, con nivel gratuito (recomendado)
  //   "gemini-2.5-flash-lite" -> el mas barato
  //   "gemini-2.5-pro"        -> el mas inteligente (mas caro)
  GEMINI_MODELO: "gemini-2.5-flash",

  // true  = Jago responde con Gemini (necesita internet y API Key)
  // false = Jago usa solo su cerebro local (offline, gratis)
  USAR_GEMINI: true,

  // Base de datos en la nube (Supabase). La anon key es publica por diseno.
  SUPABASE_URL: "PEGA-AQUI-TU-URL-DE-SUPABASE",
  SUPABASE_ANON_KEY: "PEGA-AQUI-TU-ANON-KEY"
};
