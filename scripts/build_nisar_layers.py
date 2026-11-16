"""Cuts the NISAR layers the app shows out of NASA's browse images.

The two pictures in data/nisar/browse/ are the browse images NASA/JPL
publishes with each NISAR L-band GCOV product (false colour from the HH and
HV channels, geographic grid). They are the two passes of track 69, frame 18,
one of the places the team's NISAR pipeline processed
(github.com/Maha123b/nisar-analysis). Both sit on the same grid, corner for
corner (see the .kml beside them), so one window cut from each lines up
pixel for pixel.

Missing pictures are fetched from the ASF archive; browse images need no
login. Outputs go to public/assets/analysis/. Needs pillow and numpy.

    python scripts/build_nisar_layers.py
"""
from pathlib import Path
from urllib.request import urlretrieve

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BROWSE = ROOT / "data/nisar/browse"
OUT = ROOT / "public/assets/analysis"
ARCHIVE = "https://nisar.asf.earthdatacloud.nasa.gov/BROWSE/NISAR_L2_GCOV_V1"

GRANULES = {
    "before": "NISAR_L2_PR_GCOV_034_069_A_018_2005_DHDH_M_20261028T232346_20261028T232421_P05036_N_F_J_001",
    "after": "NISAR_L2_PR_GCOV_035_069_A_018_2005_DHDH_M_20261109T232347_20261109T232422_P05036_N_F_J_001",
}

# The browse grid, from the LatLonQuad in the .kml: west, east, south, north.
QUAD = (85.87865142540437, 89.68515340500483, 31.089015613066092, 34.23235774288091)
BROWSE_SIZE = (1948, 1911)
# The window kept, in browse pixels (left, top, right, bottom): the lakes
# north-west of Siling Co, and the lake's own north shore.
WINDOW = (940, 1000, 1700, 1500)
# Written at twice the browse size, so the divider has something to show.
SIZE = (1520, 1000)

# The lakes the visitor is asked about, in browse pixels (x, y, radius).
LAKES = {"1": (1113, 1124, 18), "2": (1439, 1164, 14), "3": (1600, 1400, 30)}


def lon_lat(x: float, y: float) -> tuple[float, float]:
    west, east, south, north = QUAD
    return west + x / BROWSE_SIZE[0] * (east - west), north - y / BROWSE_SIZE[1] * (north - south)


def main() -> None:
    BROWSE.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    grey = {}
    for name, granule in GRANULES.items():
        path = BROWSE / f"{granule}_LATLON.png"
        if not path.exists():
            print("fetching", path.name)
            urlretrieve(f"{ARCHIVE}/{granule}/{path.name}", path)
        image = Image.open(path).convert("RGB")
        assert image.size == BROWSE_SIZE, image.size
        image.crop(WINDOW).resize(SIZE, Image.LANCZOS).save(OUT / f"nisar-{name}.webp", quality=86, method=6)
        grey[name] = np.asarray(image.convert("L"), dtype=float)

    left, top, right, bottom = WINDOW
    (w, s), (e, n) = lon_lat(left, bottom), lon_lat(right, top)
    mid = (s + n) / 2
    print(f"window: {w:.3f}-{e:.3f} E, {s:.3f}-{n:.3f} N")
    print(f"about {(e - w) * 111.32 * np.cos(np.radians(mid)):.0f} km wide, {(n - s) * 110.9:.0f} km tall")

    yy, xx = np.mgrid[0 : BROWSE_SIZE[1], 0 : BROWSE_SIZE[0]]
    for key, (x, y, r) in LAKES.items():
        inside = (xx - x) ** 2 + (yy - y) ** 2 <= r**2
        before, after = grey["before"][inside].mean(), grey["after"][inside].mean()
        lon, lat = lon_lat(x, y)
        u, v = (x - left) / (right - left), (y - top) / (bottom - top)
        print(
            f"lake {key}: x {u:.3f} y {v:.3f} r {r / (right - left):.3f} | {lat:.2f} N {lon:.2f} E | "
            f"browse brightness {before:.0f} -> {after:.0f} of 255"
        )


if __name__ == "__main__":
    main()
