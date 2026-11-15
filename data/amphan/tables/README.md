# Tables from the analysis team (16 November 2026)

- `backscatter_change_histogram_counts.csv`: pixels per 0.2 dB bin of backscatter
  change (post minus pre), for VV and VH, split into the reference map's newly
  inundated pixels and all other valid pixels. This is what the app's cut-off
  chart draws (`src/content/histogram.ts`).
- `threshold_metrics_full_overlap.csv` has not been added here. It reached the
  app team pasted into a chat and its VH half was cut off part-way, so only the
  rows quoted below were used. Add the file when the team sends it whole.

## How the app gets counts at a cut-off

The histogram stops at about −12 dB and +9 dB and leaves out the tails, so the
number of pixels below the first bin has to come from the threshold table:

| Channel | Row used (flag if change ≤) | TP | FP | Pixels below the first bin: flooded, other |
|---|---|---|---|---|
| VV | −9.34120487 dB | 2251 | 1227 | 967, 429 |
| VH | 8.28020489 dB | 10958 | 681041 | 941, 459 |

Counts rebuilt this way were checked against other rows of the table (VV at
−5.996, −0.011 and 7.449 dB; VH at 0.400, 2.002, 4.033 and 6.191 dB). True
positives agree to within 8 pixels and false positives to within 1%.

All of this describes agreement with the reference map on every pixel both
passes cover. The reference map is itself made from Sentinel-1, so none of it
is independent validation.
