from PIL import Image, ImageFilter, ImageDraw
import numpy as np
import math

im = Image.open('assets/mascota.jpg').convert('RGB')
W, H = im.size
full = np.array(im).astype(int)

poly_g = [(220, 2540), (560, 2520), (700, 2630), (700, 2880),
          (560, 3100), (430, 3300), (270, 3400), (140, 3270),
          (95, 2970), (140, 2700)]
pm = Image.new('L', (W, H), 0)
ImageDraw.Draw(pm).polygon(poly_g, fill=255)
inside = np.array(pm) > 0
R, G, B = full[:, :, 0], full[:, :, 1], full[:, :, 2]
azul = (B > 120) & (B > R + 25)
cola = (~azul) & inside
med_blue = np.median(full[inside & azul], axis=0).astype('uint8')

body = np.array(im).copy(); body[cola] = med_blue
body_img = Image.fromarray(body, 'RGB')
acola = np.where(cola, 255, 0).astype('uint8')
cola_img = Image.fromarray(np.dstack([np.array(im), acola]), 'RGBA')
cola_img.putalpha(cola_img.split()[3].filter(ImageFilter.GaussianBlur(1.0)))

# Linea fija = parte ALTA de la cola (donde nace)
ty, tx = np.where(cola)
oy = int(np.percentile(ty, 6))     # y de la base
print('origen Y (base) %:', round(100 * oy / H, 1))

def skewx(img, deg, oy):
    k = math.tan(math.radians(deg))
    return img.transform(img.size, Image.AFFINE, (1, -k, k * oy, 0, 1, 0),
                         resample=Image.BICUBIC)

def stack(deg):
    base = body_img.convert('RGBA').copy()
    base.alpha_composite(skewx(cola_img, deg, oy))
    return base.crop((0, 2300, 1100, 3600)).resize((300, 380)).convert('RGB')

combo = Image.new('RGB', (610, 380), (255, 255, 255))
combo.paste(stack(-10), (0, 0)); combo.paste(stack(10), (310, 0))
combo.save('assets/_grid.png')
print('preview shear (-10 | +10) guardado')
