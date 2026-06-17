from PIL import Image, ImageFilter
import numpy as np

im = Image.open('assets/mascota.jpg').convert('RGB')
arr = np.array(im).astype(int)
H, W = arr.shape[:2]

# Caja de la cola (abajo-izquierda)
x0, y0, x1, y1 = 130, 2460, 1060, 3480
sub = arr[y0:y1, x0:x1]
R, G, B = sub[:, :, 0], sub[:, :, 1], sub[:, :, 2]
bw = x1 - x0

# Clasificacion dentro de la caja
azul = (B > 120) & (B > R + 25)
xs = np.arange(bw)[None, :].repeat(y1 - y0, axis=0)      # x local
ys_ = np.arange(y1 - y0)[:, None].repeat(bw, axis=1)     # y local
# La cola es la parte NO azul, en la mitad-izquierda (deja fuera pierna/cadera)
cola_mask = (~azul) & (xs < 770)

bb_y, bb_x = np.where(cola_mask)
print('bbox cola local x[%d-%d] y[%d-%d]' % (bb_x.min(), bb_x.max(), bb_y.min(), bb_y.max()))

# --- Azul representativo del fondo (para rellenar el cuerpo) ---
azpx = sub[azul]
med_blue = np.median(azpx, axis=0).astype('uint8')
print('azul de relleno:', med_blue.tolist(), 'pixeles cola:', int(cola_mask.sum()))

# --- 1) CAPA COLA: imagen completa transparente salvo la cola ---
alpha = np.zeros((H, W), dtype='uint8')
alpha_box = np.where(cola_mask, 255, 0).astype('uint8')
alpha[y0:y1, x0:x1] = alpha_box
rgba = np.dstack([np.array(im), alpha])
cola_img = Image.fromarray(rgba, 'RGBA')
# suavizar un poco el borde del alfa
a = cola_img.split()[3].filter(ImageFilter.GaussianBlur(1.2))
cola_img.putalpha(a)
# Reducir a tamano web (900x1200; el avatar se ve a ~270px)
OUT_W = 900
OUT_H = int(H * OUT_W / W)
cola_small = cola_img.resize((OUT_W, OUT_H), Image.LANCZOS)
cola_small.save('assets/jaguar-cola.png')

# --- 2) CAPA CUERPO: foto con la cola borrada (rellena de azul) ---
body = np.array(im).copy()
bb = body[y0:y1, x0:x1]
bb[cola_mask] = med_blue
body[y0:y1, x0:x1] = bb
body_small = Image.fromarray(body, 'RGB').resize((900, int(H * 900 / W)), Image.LANCZOS)
body_small.save('assets/jaguar-cuerpo.jpg', quality=88)

# --- Pivote (base de la cola, donde se une al cuerpo) ---
ys, xss = np.where(cola_mask)
# base = donde la cola se une al cuerpo: lado derecho (x alto) y ARRIBA (y bajo)
thr = np.percentile(xss, 85)
piv_x = x0 + int(np.percentile(xss, 92))
piv_y = y0 + int(np.percentile(ys[xss > thr], 15))   # parte alta del lado derecho
print('PIVOTE global px:', piv_x, piv_y, '=> %', round(100*piv_x/W,1), round(100*piv_y/H,1))

# --- Vista previa: cuerpo + cola en reposo y girada 12 grados ---
body_im = Image.fromarray(body, 'RGB').convert('RGBA')
def compose(angle):
    base = body_im.copy()
    t = cola_img.rotate(angle, resample=Image.BICUBIC, center=(piv_x, piv_y))
    base.alpha_composite(t)
    return base
prev = compose(12)
prev.thumbnail((300, 400))
prev.convert('RGB').save('assets/_preview_cola_giro.png')
print('preview giro guardado')
