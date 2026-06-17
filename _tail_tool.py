from PIL import Image, ImageFilter, ImageDraw
import numpy as np

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

# PIVOTE = donde la cola TOCA el cuerpo (parte alta y mas a la DERECHA)
ty, tx = np.where(cola)
topband = ty < np.percentile(ty, 22)        # franja superior de la cola
piv_x = int(np.percentile(tx[topband], 96))  # lo mas a la derecha (junto a la pierna)
piv_y = int(np.median(ty[topband & (tx > np.percentile(tx[topband], 90))]))
print('PIVOTE px', piv_x, piv_y, '=> %', round(100*piv_x/W,1), round(100*piv_y/H,1))

# Capas
med_blue = np.median(full[inside & azul], axis=0).astype('uint8') \
    if (inside & azul).any() else np.array([52,101,187],'uint8')
alpha = np.where(cola, 255, 0).astype('uint8')
cola_img = Image.fromarray(np.dstack([np.array(im), alpha]), 'RGBA')
cola_img.putalpha(cola_img.split()[3].filter(ImageFilter.GaussianBlur(1.0)))
body = np.array(im).copy(); body[cola] = med_blue
body_img = Image.fromarray(body, 'RGB')

OUT_W = 900; OUT_H = int(H*OUT_W/W)
cola_img.resize((OUT_W, OUT_H), Image.LANCZOS).save('assets/jaguar-cola.png')
body_img.resize((OUT_W, OUT_H), Image.LANCZOS).save('assets/jaguar-cuerpo.jpg', quality=88)

# Preview a 8 grados (angulo realista de la animacion)
prev = body_img.convert('RGBA')
t = cola_img.rotate(8, resample=Image.BICUBIC, center=(piv_x, piv_y))
prev.alpha_composite(t)
mark = ImageDraw.Draw(prev)
mark.ellipse([piv_x-12,piv_y-12,piv_x+12,piv_y+12], outline=(0,255,0), width=4)
prev.crop((0,2300,1100,3600)).resize((420,520)).convert('RGB').save('assets/_grid.png')
print('preview giro 8 guardado')
