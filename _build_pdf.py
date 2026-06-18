# Convierte un .md de documentacion/ en un HTML bonito (luego Chrome lo pasa a PDF)
# Uso: python _build_pdf.py [nombre.md]   (por defecto: GUIA-COMPLETA-PASO-A-PASO.md)
import markdown, pathlib, sys

base = pathlib.Path(__file__).parent
nombre = sys.argv[1] if len(sys.argv) > 1 else "GUIA-COMPLETA-PASO-A-PASO.md"
md_path = base / "documentacion" / nombre
html_out = md_path.with_suffix(".tmp.html")

texto = md_path.read_text(encoding="utf-8")
cuerpo = markdown.markdown(
    texto,
    extensions=["tables", "fenced_code", "sane_lists", "toc"],
)

CSS = """
@page { margin: 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937;
       line-height: 1.5; font-size: 12px; }
h1 { color: #0b3a8c; font-size: 24px; border-bottom: 3px solid #e23b3b;
     padding-bottom: 6px; }
h2 { color: #0b3a8c; font-size: 17px; margin-top: 22px;
     border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; }
h3 { color: #b91c1c; font-size: 14px; margin-top: 16px; }
p, li { font-size: 12px; }
a { color: #1d4ed8; text-decoration: none; }
table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 10.5px; }
th, td { border: 1px solid #cbd5e1; padding: 5px 7px; text-align: left;
         vertical-align: top; }
th { background: #0b3a8c; color: #fff; }
tr:nth-child(even) td { background: #f1f5f9; }
code { background: #eef2f7; padding: 1px 4px; border-radius: 4px;
       font-family: Consolas, monospace; font-size: 10.5px; color: #b91c1c; }
pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;
      padding: 8px 10px; overflow: auto; }
pre code { background: none; color: #0f172a; }
blockquote { border-left: 4px solid #e23b3b; margin: 8px 0; padding: 4px 12px;
             background: #fff7f7; color: #374151; }
hr { border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }
h2, h3 { page-break-after: avoid; }
table, pre, blockquote { page-break-inside: avoid; }
"""

doc = f"""<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>{nombre}</title><style>{CSS}</style></head><body>{cuerpo}</body></html>"""

html_out.write_text(doc, encoding="utf-8")
print(str(html_out))
