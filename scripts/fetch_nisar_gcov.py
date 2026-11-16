"""Reads the NISAR layers the app's analysis needs straight from NASA's archive.

For every product in data/nisar/products.json it opens the HDF5 file over
HTTP range requests and reads only frequency B (80 m): the HH and HV gamma0
layers and the grid they sit on. That is about 67 MB of a file of 2 to 7 GB,
so nothing is downloaded whole. Each pass is saved as
data/nisar/cache/<site>/<yyyymmdd>.npz, which git ignores.

Needs a free NASA Earthdata Login (https://urs.earthdata.nasa.gov) in
~/.netrc:

    machine urs.earthdata.nasa.gov login <user> password <password>

and h5py and numpy.

    python scripts/fetch_nisar_gcov.py
"""
import io
import json
import subprocess
import time
import urllib.request
from pathlib import Path

import h5py
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS = ROOT / "data/nisar/products.json"
CACHE = ROOT / "data/nisar/cache"
ARCHIVE = "https://nisar.asf.earthdatacloud.nasa.gov/NISAR"
GRID = "/science/LSAR/GCOV/grids/frequencyB"
IDENT = "/science/LSAR/identification"


def signed_url(collection: str, granule: str) -> str:
    """Logs in with ~/.netrc and returns the time-limited address the archive redirects to."""
    url = f"{ARCHIVE}/{collection}/{granule}/{granule}.h5"
    out = subprocess.run(
        ["curl", "-s", "-n", "-L", "-c", "/dev/null", "-b", "", "-r", "0-0", "-o", "/dev/null", "-w", "%{http_code} %{url_effective}", url],
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    code, final = out.split(" ", 1)
    if code not in ("200", "206"):
        raise RuntimeError(f"{granule}: HTTP {code}. Is the Earthdata login in ~/.netrc?")
    return final


class RangeFile(io.RawIOBase):
    """A read-only file over HTTP that fetches fixed blocks and keeps them."""

    def __init__(self, url: str, block: int = 4 << 20):
        self.url, self.block, self.pos, self.cache, self.fetched = url, block, 0, {}, 0
        request = urllib.request.Request(url, headers={"Range": "bytes=0-0"})
        with urllib.request.urlopen(request) as response:
            self.size = int(response.headers["Content-Range"].split("/")[1])

    def readable(self):
        return True

    def seekable(self):
        return True

    def tell(self):
        return self.pos

    def seek(self, offset, whence=0):
        self.pos = offset if whence == 0 else self.pos + offset if whence == 1 else self.size + offset
        return self.pos

    def _block(self, index: int) -> bytes:
        if index not in self.cache:
            start = index * self.block
            end = min(start + self.block, self.size) - 1
            request = urllib.request.Request(self.url, headers={"Range": f"bytes={start}-{end}"})
            for attempt in range(4):
                try:
                    with urllib.request.urlopen(request, timeout=120) as response:
                        self.cache[index] = response.read()
                    break
                except OSError:
                    if attempt == 3:
                        raise
            self.fetched += len(self.cache[index])
        return self.cache[index]

    def readinto(self, buffer):
        count = min(len(buffer), self.size - self.pos)
        if count <= 0:
            return 0
        done = 0
        while done < count:
            index, offset = divmod(self.pos + done, self.block)
            piece = self._block(index)[offset : offset + count - done]
            buffer[done : done + len(piece)] = piece
            done += len(piece)
        self.pos += count
        return count


def main() -> None:
    for site, products in json.loads(PRODUCTS.read_text()).items():
        (CACHE / site).mkdir(parents=True, exist_ok=True)
        for product in products:
            dest = CACHE / site / f"{product['date'].replace('-', '')}.npz"
            if dest.exists():
                continue
            began = time.time()
            remote = RangeFile(signed_url(product["collection"], product["granule"]))
            with h5py.File(remote, "r") as h5:
                grid = h5[GRID]
                np.savez_compressed(
                    dest,
                    hh=grid["HHHH"][()],
                    hv=grid["HVHV"][()],
                    x=grid["xCoordinates"][()],
                    y=grid["yCoordinates"][()],
                    epsg=int(grid["projection"][()]),
                    granule=product["granule"],
                    collection=product["collection"],
                    version=h5[f"{IDENT}/productVersion"][()],
                    start=h5[f"{IDENT}/zeroDopplerStartTime"][()],
                )
            print(f"{site} {product['date']}: {time.time() - began:.0f} s, {remote.fetched / 1e6:.0f} MB read", flush=True)


if __name__ == "__main__":
    main()
