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

  // Modelo: "gemini-2.5-flash" (economico, nivel gratuito).
  // Mas barato: "gemini-2.5-flash-lite".  Maxima calidad: "gemini-2.5-pro".
  GEMINI_MODELO: "gemini-2.5-flash",

  // true = permitir Gemini (kiosco o local).  false = solo cerebro local.
  USAR_GEMINI: true
};
