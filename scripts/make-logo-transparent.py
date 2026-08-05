from PIL import Image
from pathlib import Path

src = Path(r"public/images/dhb-logo.png")
# Keep original backup once
bak = Path(r"public/images/dhb-logo-original.png")
if src.exists() and not bak.exists():
    bak.write_bytes(src.read_bytes())

img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

# Make near-white / light-gray background transparent
# Threshold tuned to keep gold/blue logo intact
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # white / near-white background
        if r >= 245 and g >= 245 and b >= 245:
            pixels[x, y] = (r, g, b, 0)
        elif r >= 230 and g >= 230 and b >= 230 and abs(r - g) < 8 and abs(g - b) < 8:
            # soft edge fade for anti-aliased white fringe
            brightness = (r + g + b) / 3
            fade = int(max(0, min(255, (255 - brightness) * 8)))
            pixels[x, y] = (r, g, b, fade)

# Tight crop to non-transparent content so navbar can be shorter
bbox = img.getbbox()
if bbox:
    # small padding so title isn't clipped
    pad = 6
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(w, bbox[2] + pad)
    bottom = min(h, bbox[3] + pad)
    img = img.crop((left, top, right, bottom))

out = Path(r"public/images/dhb-logo.png")
img.save(out, "PNG", optimize=True)
print("saved", out, "size", img.size, "bytes", out.stat().st_size)
