# Tables from the analysis team (16 November 2026)

- `backscatter_change_histogram_counts.csv`: pixels per 0.2 dB bin of backscatter
  change (post minus pre), for VV and VH, split into the reference map's newly
  inundated pixels and all other valid pixels. This is what the app's cut-off
  chart draws (`src/content/histogram.ts`).
- `threshold_metrics_full_overlap.csv`: true and false positives, precision and
  recall at 201 cut-offs per channel, on every pixel both passes cover. The
  app uses it to anchor the histogram's tails and its tests check the chart
  against every row.

## How the app gets counts at a cut-off

The histogram stops at about −12 dB and +9 dB and leaves out the tails, so the
number of pixels below the first bin has to come from the threshold table:

| Channel | Row used (flag if change ≤) | TP | FP | Pixels below the first bin: flooded, other |
|---|---|---|---|---|
| VV | −9.34120487 dB | 2251 | 1227 | 967, 429 |
| VH | −9.42146160 dB | 2182 | 1296 | 946, 451 |

Each channel is anchored on its lowest cut-off that still lies inside the
histogram. Counts rebuilt this way were checked against all 199 rows per
channel that fall inside the histogram's range: true positives agree to
within 0.3% and false positives to within 0.4%.

All of this describes agreement with the reference map on every pixel both
passes cover. The reference map is itself made from Sentinel-1, so none of it
is independent validation.
