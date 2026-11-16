"""Measures and draws the two NISAR cases from the layers fetch_nisar_gcov.py read.

Haor (Bangladesh, track 69 frame 14, twelve passes from 18 June to
9 November 2026): for each pass, the area of the window whose HV echo is
below a threshold, which is what open water looks like in cross-pol. Writes
data/nisar/haor_water_area.csv, one grey HV picture per pass and one
see-through picture of the flagged water per pass.

Tibet (track 69 frame 18, 28 October and 9 November 2026): the same two
passes the app already showed as browse images, now drawn from the measured
HH and HV, with the change in HH between them and the mean echo of each lake.
Writes data/nisar/tibet_lakes.csv and three pictures.

Pictures go to public/assets/analysis/. Needs numpy, pillow and pyproj.

    python scripts/build_nisar_analysis.py
"""
import csv
from pathlib import Path

import numpy as np
from PIL import Image
from pyproj import Transformer

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "data/nisar/cache"
DATA = ROOT / "data/nisar"
OUT = ROOT / "public/assets/analysis"

PIXEL_KM2 = 0.08 * 0.08

# ---- haor ----
# Rows and columns of the 80 m grid kept: the haor basin, 108.8 km by 120 km.
HAOR_WINDOW = (1440, 2940, 2520, 3880)
HAOR_SIZE = (816, 900)
# Open water in cross-pol. The two neighbours show how far the answer leans on the choice.
WATER_DB = -20.0
WATER_DB_RANGE = (-18.0, -22.0)
# Grey stretch of the HV pictures, in dB.
HV_STRETCH = (-32.0, -8.0)
WATER_COLOUR = (63, 224, 240, 150)

# ---- Tibet ----
# The window the app shows, in degrees: west, east, south, north.
TIBET_WINDOW = (87.71546, 89.20057, 31.76473, 32.58719)
TIBET_SIZE = (1520, 1000)
# Lakes as fractions of that window (x, y, radius as a fraction of the width).
LAKES = {"1": (0.228, 0.248, 0.024), "2": (0.657, 0.328, 0.018), "3": (0.868, 0.800, 0.039)}
HH_STRETCH = (-28.0, -2.0)
HV_STRETCH_TIBET = (-36.0, -10.0)
CHANGE_DB = 8.0


def db(power: np.ndarray) -> np.ndarray:
    with np.errstate(divide="ignore", invalid="ignore"):
        return 10 * np.log10(np.where(power > 0, power, np.nan))


def scale(values: np.ndarray, low: float, high: float) -> np.ndarray:
    return (np.nan_to_num(np.clip((values - low) / (high - low), 0, 1)) * 255).astype(np.uint8)


def haor() -> None:
    r0, r1, c0, c1 = HAOR_WINDOW
    passes = []
    for path in sorted((CACHE / "haor").glob("*.npz")):
        z = np.load(path)
        passes.append((path.stem, z["hh"][r0:r1, c0:c1], z["hv"][r0:r1, c0:c1], str(z["collection"]), z["version"].item().decode()))
    # Only ground every pass saw counts, so the areas can be compared.
    valid = np.all([np.isfinite(hh) & (hh > 0) & np.isfinite(hv) & (hv > 0) for _, hh, hv, _, _ in passes], axis=0)

    z = np.load(sorted((CACHE / "haor").glob("*.npz"))[0])
    to_wgs = Transformer.from_crs(int(z["epsg"]), 4326, always_xy=True)
    corners = [to_wgs.transform(z["x"][c], z["y"][r]) for r, c in ((r0, c0), (r0, c1 - 1), (r1 - 1, c0), (r1 - 1, c1 - 1))]
    print("haor window corners (lon, lat):", [(round(lon, 3), round(lat, 3)) for lon, lat in corners])
    print(f"haor window: {(c1 - c0) * 0.08:.1f} km by {(r1 - r0) * 0.08:.1f} km, {valid.sum() * PIXEL_KM2:.0f} km2 seen by every pass")

    rows = []
    for date, hh, hv, collection, version in passes:
        hv_db = np.where(valid, db(hv), np.nan)
        hh_db = np.where(valid, db(hh), np.nan)
        water = hv_db < WATER_DB
        rows.append(
            {
                "date": f"{date[:4]}-{date[4:6]}-{date[6:]}",
                "water_km2": round(float(water.sum() * PIXEL_KM2)),
                "water_km2_at_minus18": round(float((hv_db < WATER_DB_RANGE[0]).sum() * PIXEL_KM2)),
                "water_km2_at_minus22": round(float((hv_db < WATER_DB_RANGE[1]).sum() * PIXEL_KM2)),
                "water_median_hh_db": round(float(np.nanmedian(hh_db[water])), 1),
                "water_median_hv_db": round(float(np.nanmedian(hv_db[water])), 1),
                "collection": collection,
                "product_version": version,
            }
        )
        grey = Image.fromarray(scale(db(hv), *HV_STRETCH)).resize(HAOR_SIZE, Image.LANCZOS)
        grey.save(OUT / f"nisar-haor-{date}.webp", quality=82, method=6)
        rgba = np.zeros((*water.shape, 4), dtype=np.uint8)
        rgba[water] = WATER_COLOUR
        Image.fromarray(rgba).resize(HAOR_SIZE, Image.BILINEAR).save(OUT / f"nisar-haor-water-{date}.webp", lossless=True, method=6)

    with open(DATA / "haor_water_area.csv", "w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    for row in rows:
        print(row["date"], row["water_km2"], row["water_km2_at_minus18"], row["water_km2_at_minus22"], row["water_median_hh_db"], row["water_median_hv_db"])


def tibet() -> None:
    west, east, south, north = TIBET_WINDOW
    width, height = TIBET_SIZE
    lon = west + (np.arange(width) + 0.5) / width * (east - west)
    lat = north - (np.arange(height) + 0.5) / height * (north - south)
    lon2, lat2 = np.meshgrid(lon, lat)
    layers = {}
    for name, date in (("before", "20261028"), ("after", "20261109")):
        z = np.load(CACHE / "tibet" / f"{date}.npz")
        x, y = Transformer.from_crs(4326, int(z["epsg"]), always_xy=True).transform(lon2, lat2)
        # Nearest pixel of the product's own grid: x runs east, y runs south.
        col = np.rint((x - z["x"][0]) / (z["x"][1] - z["x"][0])).astype(int)
        row = np.rint((y - z["y"][0]) / (z["y"][1] - z["y"][0])).astype(int)
        inside = (col >= 0) & (col < z["x"].size) & (row >= 0) & (row < z["y"].size)
        hh = np.full(lon2.shape, np.nan, dtype=np.float32)
        hv = np.full(lon2.shape, np.nan, dtype=np.float32)
        hh[inside] = z["hh"][row[inside], col[inside]]
        hv[inside] = z["hv"][row[inside], col[inside]]
        layers[name] = (hh, hv)
        # Red and blue carry HH, green carries HV: magenta where HH is the stronger, green where HV is.
        hh8, hv8 = scale(db(hh), *HH_STRETCH), scale(db(hv), *HV_STRETCH_TIBET)
        Image.fromarray(np.dstack([hh8, hv8, hh8])).save(OUT / f"nisar-{name}.webp", quality=86, method=6)

    change = db(layers["after"][0]) - db(layers["before"][0])
    t = np.nan_to_num(np.clip(change / CHANGE_DB, -1, 1))
    # Blue where the echo fell, red where it rose, near black where it held.
    red = (np.clip(t, 0, 1) * 215 + 24).astype(np.uint8)
    blue = (np.clip(-t, 0, 1) * 215 + 24).astype(np.uint8)
    green = (np.abs(t) * 70 + 24).astype(np.uint8)
    rgb = np.dstack([red, green, blue])
    rgb[~np.isfinite(change)] = 0
    Image.fromarray(rgb).save(OUT / "nisar-change.webp", quality=86, method=6)

    yy, xx = np.mgrid[0:height, 0:width]
    rows = []
    for key, (u, v, r) in LAKES.items():
        circle = (xx - u * width) ** 2 + (yy - v * height) ** 2 <= (r * width) ** 2
        row = {"lake": key}
        for name in ("before", "after"):
            hh, hv = layers[name]
            # Means are taken of the power, then turned into dB.
            row[f"hh_db_{name}"] = round(float(10 * np.log10(np.nanmean(hh[circle]))), 1)
            row[f"hv_db_{name}"] = round(float(10 * np.log10(np.nanmean(hv[circle]))), 1)
        row["hh_change_db"] = round(row["hh_db_after"] - row["hh_db_before"], 1)
        row["hv_change_db"] = round(row["hv_db_after"] - row["hv_db_before"], 1)
        rows.append(row)
        print(row)
    with open(DATA / "tibet_lakes.csv", "w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    haor()
    tibet()
