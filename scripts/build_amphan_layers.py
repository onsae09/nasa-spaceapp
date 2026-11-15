"""Cuts the map layers the app shows out of the analysis team's figures.

The figures in data/amphan/maps/ are matplotlib plots that all share the
OPERA grid extent (EPSG:32645, 636690-729450 E, 2433660-2479320 N; see
data/amphan/maps_summary.json). This script crops each plot's axes box, then
a common window around the radar strip, so that every output lines up pixel
for pixel and a position in any of them is a known easting and northing.

Outputs go to public/assets/analysis/. Needs pillow and numpy.

    python scripts/build_amphan_layers.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
MAPS = ROOT / "data/amphan/maps"
OUT = ROOT / "public/assets/analysis"

# The window kept, as fractions of the full grid (left, top, right, bottom).
# Full grid: 92.76 km x 45.66 km. Window: 641690-725450 E, 2439660-2475320 N.
WINDOW = (5000 / 92760, 4000 / 45660, 88760 / 92760, 39660 / 45660)
# Every layer is written at this size (the window is 83.76 km x 35.66 km).
SIZE = (1760, 749)

# Axes boxes in each figure, in pixels: the area inside the black frame.
BACKSCATTER_BOX = (158, 280, 1932, 1153)
REFERENCE_BOX = (158, 116, 2377, 1207)
CHANGE_BOXES = {"vv": (161, 529, 1394, 1135), "vh": (1860, 529, 3093, 1135)}


def window(path: Path, box) -> Image.Image:
    """The common window of one figure, resampled to SIZE."""
    axes = Image.open(path).convert("RGB").crop(box)
    w, h = axes.size
    l, t, r, b = WINDOW
    return axes.crop((round(l * w), round(t * h), round(r * w), round(b * h))).resize(SIZE, Image.LANCZOS)


def hull(points):
    """Convex hull (monotone chain) of (x, y) points."""
    pts = sorted(set(points))
    def half(seq):
        out = []
        for p in seq:
            while len(out) >= 2 and (out[-1][0] - out[-2][0]) * (p[1] - out[-2][1]) - (out[-1][1] - out[-2][1]) * (p[0] - out[-2][0]) <= 0:
                out.pop()
            out.append(p)
        return out
    lower, upper = half(pts), half(reversed(pts))
    return lower[:-1] + upper[:-1]


def footprint(inside: np.ndarray):
    """The outline of the area where `inside` is true, as a convex polygon."""
    points = []
    for y in range(inside.shape[0]):
        xs = np.flatnonzero(inside[y])
        if xs.size:
            points += [(int(xs[0]), y), (int(xs[-1]), y)]
    return hull(points)


def corners(poly):
    """The four extreme corners of a convex outline, as fractions of SIZE."""
    keys = [lambda p: p[0] + p[1], lambda p: -p[0] + p[1], lambda p: -p[0] - p[1], lambda p: p[0] - p[1]]
    return [[round(min(poly, key=k)[0] / SIZE[0], 4), round(min(poly, key=k)[1] / SIZE[1], 4)] for k in keys]


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    # The strip's outline, from one backscatter image: data is darker than the
    # white page and the faint grid lines around it.
    first = np.array(window(MAPS / "pre_event_VH_16May2020.png", BACKSCATTER_BOX).convert("L"))
    strip = footprint(first < 200)
    mask = Image.new("L", SIZE, 0)
    ImageDraw.Draw(mask).polygon(strip, fill=255)
    print("strip corners (fractions of the window):", corners(strip))

    for when, date in (("pre", "16May2020"), ("post", "22May2020")):
        for pol in ("VV", "VH"):
            grey = window(MAPS / f"{when}_event_{pol}_{date}.png", BACKSCATTER_BOX).convert("L")
            layer = Image.merge("LA", (grey, mask))
            layer.save(OUT / f"amphan-{when}-{pol.lower()}.webp", quality=88)

    for pol, box in CHANGE_BOXES.items():
        colour = window(MAPS / "SAR_backscatter_change_VV_VH_no_reference_overlay.png", box)
        colour.putalpha(mask)
        colour.save(OUT / f"amphan-change-{pol}.webp", quality=88)

    # The reference map: red where it marks new flooding, grey where it has
    # coverage and marks none. Written as cyan on transparent, to lay on top.
    ref = np.array(window(MAPS / "reference_new_inundation_standalone.png", REFERENCE_BOX)).astype(int)
    r, g, b = ref[..., 0], ref[..., 1], ref[..., 2]
    flooded = (r > 150) & (g < 130) & (b < 130)
    covered = flooded | ((abs(r - g) < 8) & (abs(g - b) < 8) & (r > 190) & (r < 232))
    overlay = np.zeros((SIZE[1], SIZE[0], 4), dtype=np.uint8)
    overlay[flooded] = (63, 224, 240, 255)
    Image.fromarray(overlay, "RGBA").save(OUT / "amphan-reference.png", optimize=True)
    # Rows of grid line are grey too; keep only rows and columns with real coverage.
    solid = covered & (covered.sum(1, keepdims=True) > 40) & (covered.sum(0, keepdims=True) > 40)
    print("reference coverage corners:", corners(footprint(solid)))
    print("reference flooded share of the window:", flooded.mean())


if __name__ == "__main__":
    main()
