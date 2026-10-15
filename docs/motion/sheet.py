# Contact sheet of stills for one scene: python3 -I sheet.py <slug> t1 t2 ...
import sys
from PIL import Image
slug, ts = sys.argv[1], sys.argv[2:]   # slug may carry a -cs suffix
d = __file__.rsplit("/", 1)[0] + "/.stills/"
ims = [Image.open(f"{d}{slug}-{float(t):.2f}.png").resize((800, 534)) for t in ts]
rows = (len(ims) + 1) // 2
W = Image.new("RGB", (1600, 534 * rows), "black")
for i, im in enumerate(ims):
    W.paste(im, ((i % 2) * 800, (i // 2) * 534))
W.save(f"{d}sheet-{slug}.png")
