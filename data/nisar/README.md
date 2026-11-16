# NISAR: what the app measured, and from what

Chapter 2 ends on two NISAR stops. Both are measured from NISAR L2 GCOV products (L-band, gamma0 backscatter on a map grid) in NASA's archive at the Alaska Satellite Facility. This folder holds the list of products, the two tables of results, and this note on what was and was not done.

## How the data was read

`products.json` names the 14 products. `scripts/fetch_nisar_gcov.py` opens each one over HTTP range requests and reads only frequency B, the 80 m grid: the HH and HV layers and their coordinates, about 67 MB of a file of 2 to 7 GB. It needs a free NASA Earthdata Login in `~/.netrc` and saves each pass under `cache/`, which git ignores (about 800 MB).

`scripts/build_nisar_analysis.py` then works entirely from that cache. It writes the two tables here and the pictures in `public/assets/analysis/`. The app reads its numbers from the tables, so running the script again updates the screens.

Backscatter is kept as linear power; dB appears only as `10·log10`. Means over an area are taken of the power and then turned into dB.

## The haor: twelve passes of one flood season

Track 69, frame 14, ascending, every 12 days from 18 June to 9 November 2026. The pass of 5 August is not in the archive. All twelve sit on the same grid (EPSG:32646), so no resampling was needed.

The window is 108.8 km by 120 km over the haor basin of north-east Bangladesh (90.63–91.72°E, 24.15–25.25°N). Only the 12,561 km² that every pass saw is counted.

A pixel is counted as open water when its HV echo is below −20 dB. HV was chosen over HH because wind roughens water and lifts HH: the median HH of the flagged water moves between −16.5 and −14.4 dB from pass to pass, while its HV stays within −24.1 to −22.7 dB.

`haor_water_area.csv`:

| Date | Open water, km² | at −18 dB | at −22 dB |
|---|---|---|---|
| 18 Jun | 5,710 | 6,963 | 4,445 |
| 30 Jun | 5,729 | 6,906 | 4,514 |
| 12 Jul | 5,911 | 7,121 | 4,576 |
| 24 Jul | 6,086 | 7,241 | 4,829 |
| 17 Aug | 5,210 | 6,742 | 3,778 |
| 29 Aug | 5,635 | 7,011 | 4,241 |
| 10 Sep | 5,392 | 6,854 | 4,074 |
| 22 Sep | 4,899 | 6,362 | 3,692 |
| 4 Oct | 4,225 | 5,524 | 3,308 |
| 16 Oct | 3,862 | 4,960 | 2,994 |
| 28 Oct | 3,619 | 4,690 | 2,519 |
| 9 Nov | 3,584 | 4,898 | 2,281 |

The peak is 24 July at all three thresholds. From peak to 9 November the area falls by 41% at −20 dB, 32% at −18 dB and 53% at −22 dB: the size of the fall depends on the threshold, its direction does not.

What this is not:

- It is not validated. No gauge, optical image or published flood map has been held against these masks.
- "Below −20 dB in HV" is a rule for open water, not a measurement of it. Smooth wet mud and bare fields can fall under the line; water under plants and wind-roughened water can rise over it.
- The ten passes to 16 October are provisional products (version 1.0.11); the last two are validated (1.0.20). The team's pipeline never compares across that line. The series here does, because the season straddles it, and a small step between 16 and 28 October could come from the processing rather than the ground. The fall from July to mid-October lies inside the provisional products alone.
- The pass of 12 July has a striped rectangle in the north-east of the window, an artefact in the product.
- That rain and rivers fill the basin and that rice is planted as it drains is general knowledge of the haor, not something measured here.

## Tibet: two passes, three lakes

Track 69, frame 18, ascending, 28 October and 9 November 2026 (both validated, version 1.0.20), one of the four frames the team's pipeline verified. The window is 87.715–89.201°E, 31.765–32.587°N, about 140 km by 91 km, resampled from the product grid (EPSG:32645) to latitude and longitude by nearest pixel.

`tibet_lakes.csv`, the mean echo inside each circle the app draws:

| Lake | Where | HH, dB | HV, dB |
|---|---|---|---|
| 1 | 32.38°N 88.05°E | −20.2 → −19.2 (+1.0) | −24.9 → −24.8 (+0.1) |
| 2 | 32.32°N 88.69°E | −18.9 → −22.8 (−3.9) | −25.4 → −25.5 (−0.1) |
| 3, Siling Co | 31.93°N 89.01°E | −17.5 → −17.8 (−0.3) | −26.8 → −26.8 (0.0) |

HH moved and HV did not. Lake 2's fall of 3.9 dB is past the 3 dB the team's pipeline uses to flag a candidate flood-related change, on a lake that is a lake on both dates.

The pictures put HH in red and blue and HV in green (stretched −28 to −2 dB and −36 to −10 dB), so magenta is where HH is the stronger. The change picture is the difference in HH, blue for a fall and orange for a rise, full colour at 8 dB.

What this is not:

- The causes offered on screen (wind, ice, a change of level) are hypotheses. There is no wind or temperature record here and no third pass. Wind is called the likeliest because the two lakes moved in opposite directions and HV held still, which is what roughness does; that is reasoning, not a test.
- Lake 1's circle takes in some shore, so its +1.0 dB is smaller than the change of the water alone.

## The team's pipeline

The counts on the Tibet screen are from [github.com/Maha123b/nisar-analysis](https://github.com/Maha123b/nisar-analysis) as it stood on 16 November 2026 (commit `c1bc99f`):

| On screen | Source |
|---|---|
| 20,029 products catalogued | `PROJECT_STATE.md` §3 |
| 152 places with a comparable pair, 8 chosen | `PROJECT_STATE.md` §5 (11,936 clusters, 152 eligible, 8 selected) |
| 4 verified so far | `PROJECT_STATE.md` §10: tracks/frames 069/0011, 098/0010, 112/0007 and 069/0018 |
| Echo fell by more than 3 dB, patches of 20 pixels or more | `config/settings.yaml`, `change_detection` |
| Unvalidated; "candidate flood-related change" | `README.md`, "Honest limitations" |

`EXECUTION_AUDIT.md` still lists the final batch counts as pending, so the app says "so far". That repository keeps its output rasters out of git, so none of its own results are shown; the measurements above were made for the app.

Two of the four verified frames, 069/0011 and 098/0010, lie over the open Bay of Bengal (90.6–93.5°E, 17.4–20.1°N and 87.0–89.8°E, 15.5–18.1°N). A fall in echo there is the sea surface, not a flood.
