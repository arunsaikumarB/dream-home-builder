"""Regenerate transparent NJ villa/house cutouts from elevation photos."""
from pathlib import Path
from rembg import remove
from PIL import Image

root = Path('public/images/villas')
root.mkdir(parents=True, exist_ok=True)

sources = [
    ('public/images/projects/elevation/modern-elevation1.jpg', 'villa-1.png'),
    ('public/images/projects/elevation/modern-elevation3.jpg', 'villa-2.png'),
    ('public/images/projects/elevation/modern-elevation4.jpg', 'villa-3.png'),
    ('public/images/home/exterior-modern-1.webp', 'villa-4.png'),
    ('public/images/projects/elevation/modern-elevation2.jpg', 'villa-5.png'),
    ('public/images/projects/elevation/modern-elevation6.jpg', 'villa-6.png'),
    ('public/images/projects/elevation/modern-elevation7.jpg', 'villa-7.png'),
    ('public/images/projects/elevation/modern-elevation8.jpg', 'villa-8.png'),
]

for src, name in sources:
    src_path = Path(src)
    if not src_path.exists():
        print('skip missing', src)
        continue
    out = root / name
    print('processing', src_path.name, '->', out.name)
    img = Image.open(src_path).convert('RGBA')
    max_w = 1100
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, int(img.height * ratio)), Image.Resampling.LANCZOS)
    try:
        cut = remove(img, alpha_matting=True, alpha_matting_foreground_threshold=240,
                     alpha_matting_background_threshold=10, alpha_matting_erode_size=10)
    except Exception:
        cut = remove(img)
    bbox = cut.getbbox()
    if bbox:
        pad = 6
        cut = cut.crop((
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(cut.width, bbox[2] + pad),
            min(cut.height, bbox[3] + pad),
        ))
    cut.save(out, 'PNG', optimize=True)
    print('  saved', cut.size, out.stat().st_size)

print('done')
