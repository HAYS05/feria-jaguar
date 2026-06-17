from PIL import Image, ImageFilter, ImageDraw
import numpy as np

im = Image.open('assets/mascota.jpg').convert('RGB')
W, H = im.size
full = np.array(im).astype(int)

# Poligono SOLO de la cola (coords globales)
poly_g = [(220, 2540), (560, 2520), (700, 2630), (700, 2880),
          (560, 3100), (430, 3300), (270, 3400), (140, 3270),
          (95, 2970), (140, 2700)]
pm = Image.new('L', (W, H), 0)
ImageDraw.Draw(pm).polygon(poly_g, fill=255)
inside = np.array(pm) > 0

R, G, B = full[:, :, 0], full[:, :, 1], full[:, :, 2]
azul = (B > 120) & (B > R + 25)
cola = (~azul) & inside
print('pixeles cola:', int(cola.sum()))

# azul de relleno (cerca de la cola)
ys, xs = np.where(inside & azul)
med_blue = np.median(full[ys, xs], axis=0).astype('uint8')

# 1) CAPA COLA (imagen completa, transparente salvo la cola)
alpha = np.where(cola, 255, 0).astype('uint8')
rgba = np.dstack([np.array(im), alpha])
cola_img = Image.fromarray(rgba, 'RGBA')
a = cola_img.split()[3].filter(ImageFilter.GaussianBlur(1.0))
cola_img.putalpha(a)

# 2) CAPA CUERPO (cola borrada con azul)
body = np.array(im).copy()
body[cola] = med_blue
body_img = Image.fromarray(body, 'RGB')

# Pivote = base de la cola (parte alta del gancho)
ty, tx = np.where(cola)
top = ty < np.percentile(ty, 8)
piv_x = int(np.median(tx[top]))
piv_y = int(ty.min())
print('PIVOTE %:', round(100 * piv_x / W, 1), round(100 * piv_y / H, 1))

# Guardar reducidas
OUT_W = 900
OUT_H = int(H * OUT_W / W)
cola_img.resize((OUT_W, OUT_H), Image.LANCZOS).save('assets/jaguar-cola.png')
body_img.resize((OUT_W, OUT_H), Image.LANCZOS).save('assets/jaguar-cuerpo.jpg', quality=88)

# Preview: cuerpo + cola girada 14 grados, recorte amplio
prev = body_img.convert('RGBA')
t = cola_img.rotate(14, resample=Image.BICUBIC, center=(piv_x, piv_y))
prev.alpha_composite(t)
prev = prev.crop((0, 2000, 1800, 3900))
prev.thumbnail((520, 560))
prev.convert('RGB').save('assets/_grid.png')
print('preview giro guardado')
