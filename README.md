# 🐆 Jago — Asistente virtual de la Open House

Asistente virtual (un jaguar llamado **Jago**) para la **Open House
Saint Margaret School**. Habla en voz alta, escucha por micrófono, mueve la
boca, resume los stands y responde preguntas con **Google Gemini** (con
respaldo local si no hay internet). Todo con tecnologías **gratuitas** del
navegador, sin servidor.

## ▶️ Cómo usarlo en tu computadora
1. Doble clic en `INICIAR.bat` (abre un servidor local y el navegador).
2. O ábrelo en internet (ver más abajo: GitHub Pages).

## 🧩 Cómo está armado
| Carpeta / archivo | Qué hace |
|---|---|
| `index.html` | La página |
| `css/estilos.css` | Diseño y colores |
| `js/cerebro.js` | Cerebro local (responde sin internet) |
| `js/feria.js` | Galería de stands + resumir stand |
| `js/ia-gemini.js` | Conexión con Google Gemini |
| `js/voz.js` | Escuchar por micrófono (voz a texto) |
| `js/avatar.js` | Avatar, voz hablada y chat |
| `datos/conocimiento.json` | La información real de la feria |
| `config.js` | Configuración (API key y modelo de Gemini) |

## 🔑 Sobre la API key
La key de Gemini está en `config.js` y está **restringida por dominio** en
Google Cloud: solo funciona desde la dirección de la feria y desde
`localhost`. Para cambiarla o entender la seguridad, lee
[documentacion/GUIA-PUBLICAR.md](documentacion/GUIA-PUBLICAR.md).

## 📚 Documentación
- [Guía por equipos](documentacion/GUIA-EQUIPOS.md)
- [Guía paso a paso](documentacion/GUIA-COMPLETA-PASO-A-PASO.md)
- [Guía para publicar](documentacion/GUIA-PUBLICAR.md)
