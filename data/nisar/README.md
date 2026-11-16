# NISAR: the two passes shown in the app

The NISAR stop at the end of chapter 2 shows two passes of NISAR's L-band radar over the lakes around Siling Co on the Tibetan Plateau. This folder holds the pictures it is cut from and says where every figure on that screen comes from.

## The two products

Both are NISAR L2 GCOV products (collection `NISAR_L2_GCOV_V1`, concept `C3622241360-ASF`) of track 69, frame 18, ascending, as listed in NASA's Common Metadata Repository on 16 November 2026.

| | Product | Acquired (UTC) |
|---|---|---|
| Before | `NISAR_L2_PR_GCOV_034_069_A_018_2005_DHDH_M_20261028T232346_20261028T232421_P05036_N_F_J_001` | 28 Oct 2026, 23:23 |
| After | `NISAR_L2_PR_GCOV_035_069_A_018_2005_DHDH_M_20261109T232347_20261109T232422_P05036_N_F_J_001` | 9 Nov 2026, 23:23 |

Each has frequencies A and B, both with HH and HV, product version 1.0.20. The passes are 12 days apart, one repeat cycle.

## What is in `browse/`

The `_LATLON.png` browse image NASA/JPL publishes with each product, and the `.kml` that gives its corners (85.879–89.685°E, 31.089–34.232°N; both pictures share them). Browse images need no Earthdata login:

    https://nisar.asf.earthdatacloud.nasa.gov/BROWSE/NISAR_L2_GCOV_V1/<product>/<product>_LATLON.png

`scripts/build_nisar_layers.py` cuts the same window from each (87.715–89.201°E, 31.765–32.587°N, about 140 km by 91 km), writes `public/assets/analysis/nisar-before.webp` and `nisar-after.webp`, and prints where the three lakes sit and how bright each is on each date. It fetches the pictures again if they are missing.

| Lake | Where | Browse brightness, of 255 | Read as |
|---|---|---|---|
| 1 | 32.38°N 88.05°E | 75 → 88 | brighter |
| 2 | 32.32°N 88.69°E | 74 → 43 | darker |
| 3, Siling Co | 31.93°N 89.01°E | 97 → 98 | the same |

## What these pictures are not

They are browse images: 8-bit false colour made from the HH and HV channels and stretched for viewing. A brightness here is not a calibrated backscatter, and the app shows no dB figure for this place. The team's own rasters for this frame (gamma0, change in dB, candidate classes) are not in their repository, which keeps `data/` and `results/` out of git. With those GeoTIFFs the app could show the measured change instead.

The app does not say which colour is which channel, because the mapping was not confirmed against the product specification.

The causes offered on screen (wind, ice, a change of level) are hypotheses. Nothing here tests them: there is no wind or temperature record and no third pass.

## The team's pipeline

The counts on the screen are from [github.com/Maha123b/nisar-analysis](https://github.com/Maha123b/nisar-analysis) as it stood on 16 November 2026 (commit `c1bc99f`):

| On screen | Source |
|---|---|
| 20,029 products catalogued | `PROJECT_STATE.md` §3 |
| 152 places with a comparable pair, 8 chosen | `PROJECT_STATE.md` §5 (11,936 clusters, 152 eligible, 8 selected) |
| 4 verified so far | `PROJECT_STATE.md` §10: tracks/frames 069/0011, 098/0010, 112/0007 and 069/0018 |
| Echo fell by more than 3 dB, patches of 20 pixels or more | `config/settings.yaml`, `change_detection` |
| Unvalidated; "candidate flood-related change" | `README.md`, "Honest limitations" |

`EXECUTION_AUDIT.md` still lists the final batch counts as pending, so the app says "so far".

Two of the four verified frames, 069/0011 and 098/0010, lie over the open Bay of Bengal (90.6–93.5°E, 17.4–20.1°N and 87.0–89.8°E, 15.5–18.1°N). A fall in echo there is the sea surface, not a flood. The app uses 069/0018, which is land.
