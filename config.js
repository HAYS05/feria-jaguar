/* ============================================================
   CONFIGURACION REAL  (este archivo NO se sube a internet)
   ------------------------------------------------------------
   >>> PEGA TU API KEY EN LA LINEA DE ABAJO, entre las comillas <<<
       La consigues gratis/paga en: https://aistudio.google.com/apikey
   ============================================================ */

const CONFIG = {
  // 1) Tu API Key (reemplaza el texto de ejemplo por tu clave real)
  GEMINI_API_KEY: "PEGA-AQUI-TU-API-KEY",

  // 2) Modelo MAS ECONOMICO (con nivel gratuito): "gemini-2.5-flash".
  //    Si quieres aun menos costo: "gemini-2.5-flash-lite".
  //    Si algun dia quieres la maxima calidad: "gemini-2.5-pro".
  GEMINI_MODELO: "gemini-2.5-flash",

  // 3) Deja true para usar Gemini. Ponlo en false para volver al modo offline.
  USAR_GEMINI: true
};
