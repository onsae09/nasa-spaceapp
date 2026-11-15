# Sentinel-1 Backscatter Change and Reference Inundation

A Cyclone Amphan case study, southwestern Bangladesh

- Study event: Cyclone Amphan, May 2020
- Pre-event OPERA acquisition: 16 May 2020, Sentinel-1A
- Post-event OPERA acquisition: 22 May 2020, Sentinel-1B
- Study focus: Spatial comparison of OPERA RTC-S1 backscatter change with a Sentinel-1-derived reference inundation classification.

## Abstract

This case study examines whether changes in Sentinel-1 VV- and VH-polarized radar backscatter distinguish newly inundated pixels during Cyclone Amphan. OPERA RTC-S1 pre- and post-event observations were compared with a published reference inundation classification. The analysis includes native-resolution reference area estimation, polarization-specific backscatter statistics, pooled-pixel ROC-AUC, and deterministic spatial block holdout.

The reference classification identifies approximately 9.86 km² of newly inundated land within the valid OPERA footprint overlap (1.58% of the valid overlap, as reported by the native-resolution analysis). In spatial holdout, VH achieved an ROC-AUC of 0.883, compared with 0.860 for VV. These results indicate promising separability in this case study, but do not constitute independent validation or demonstrate operational flood-mapping accuracy.

## 1. Research question

How well do pre-/post-event changes in OPERA RTC-S1 VV and VH backscatter distinguish newly inundated pixels from other valid pixels in the available reference classification?

## 2. Study data

### OPERA RTC-S1

- Pre-event scene: 16 May 2020, Sentinel-1A, descending track 150.
- Post-event scene: 22 May 2020, Sentinel-1B, descending track 150.
- Polarizations: VV and VH.
- Pixel spacing: 30 m.
- Both scenes cover the same OPERA burst identifier and share the same raster grid.
- Backscatter was converted from linear gamma-zero values to dB using 10 × log10(linear value).

### Reference inundation classification

- Source: published Bangladesh Amphan inundation dataset hosted on Zenodo.
- Reference rasters: pre-event and post-event binary water masks.
- Newly inundated land was defined as pre-event non-water and post-event water.
- Native reference grid: approximately 10 m.
- The reference classification is itself derived from Sentinel-1 observations. It is therefore not an independent ground-truth dataset.

## 3. Methods

### Backscatter change

For each polarization, change was calculated as:

Δσ⁰ (dB) = post-event σ⁰ (dB) − pre-event σ⁰ (dB)

Negative values indicate a decrease in backscatter; positive values indicate an increase. Backscatter change is not, by itself, proof of inundation. Responses can vary with open water, flooded vegetation, surface roughness, soil moisture, land cover, and imaging geometry.

### Reference inundation area

The reference classification was analysed at its native approximately 10 m resolution. OPERA valid-data coverage was transferred to the reference grid using nearest-neighbour sampling. Pixel areas were estimated geodesically on the WGS84 ellipsoid.

### Separability

ROC-AUC was calculated using negative backscatter change (−Δσ⁰) as the flood-likeness score: larger scores correspond to larger decreases in backscatter. AUC measures ranking discrimination across possible thresholds; it is not classification accuracy at one selected threshold.

### Spatial holdout

The OPERA grid was divided into 150 × 150 pixel blocks (approximately 4.5 km × 4.5 km). Test blocks were selected using `(block_row × 37 + block_col × 17) % 5 == 0`. Thresholds were selected using training data only, by maximizing Youden's J. Performance was then evaluated on held-out blocks.

## 4. Results

### Reference inundation extent

- Valid overlap area: 625.76 km².
- Newly inundated reference area: 9.86 km².
- Newly inundated fraction: 1.58% (native-resolution analysis output).

### Backscatter separability

| Polarization | Pooled-pixel ROC-AUC | Spatial test ROC-AUC |
|---|---|---|
| VV | 0.833 | 0.860 |
| VH | 0.882 | 0.883 |

VH showed stronger ranking discrimination than VV in both the pooled-pixel analysis and the spatial holdout.

### Spatial holdout classification metrics

| Metric | VV | VH |
|---|---|---|
| Precision | 10.36% | 10.43% |
| Recall | 72.21% | 75.21% |
| Specificity | 89.60% | 89.25% |
| F1 | 0.181 | 0.183 |

The selected thresholds produced low precision for both polarizations. This means that many pixels flagged by the threshold were not labelled newly inundated in the reference. The reference inundation class is rare, so precision must be interpreted alongside prevalence, recall, specificity, and AUC.

## 5. Interpretation

The spatial holdout results suggest that the relationship between backscatter decrease and the reference inundation class is not confined to the training pixels. VH performed better than VV in this particular analysis. However, the results do not establish that VH is universally superior for flood detection.

The difference between strong AUC and low threshold-based precision is important: a variable can rank positive cases above negative cases reasonably well while a chosen threshold still produces many false positives, especially when the positive class is rare.

## 6. Limitations

- Non-independent reference: both the OPERA observations and the reference inundation classification are Sentinel-1-derived. Their acquisition periods overlap, so this is a comparison, not independent validation.
- Different satellite platforms: the pre-event OPERA scene uses Sentinel-1A and the post-event scene uses Sentinel-1B. Cross-platform radiometric differences may affect measured change.
- Spatial dependence: block holdout reduces direct pixel-level leakage, but no spatial buffer was applied. Nearby blocks may remain spatially correlated.
- Limited geographic scope: results apply to the valid overlap between this OPERA burst and the reference dataset, not all of Bangladesh or the full cyclone-affected region.
- Threshold performance: low precision means the tested thresholds should not be presented as reliable operational flood classifiers.
- Backscatter ambiguity: radar response depends on surface conditions and land cover; a decrease is not a universal signature of flooding.

## 7. Conclusion

Within the analysed Amphan footprint, VH backscatter change provided stronger discrimination of reference-classified newly inundated pixels than VV. The VH spatial holdout ROC-AUC was 0.883. This result is promising as a case-specific finding, but low precision, the Sentinel-1-derived reference, cross-platform scene differences, and residual spatial dependence prevent claims of independent or operational validation.

## 8. Figures

Figures in this folder:

- `figures/amphan_summary.png` — all six panels: reference inundation, VV and VH backscatter change, OPERA/reference comparison, class-wise distributions, spatial holdout performance.
- `figures/amphan_spatial_holdout_auc.png` — spatial holdout performance.

Separate maps arrived on 16 November 2026 and are in `maps/`: the VV and VH backscatter of each pass, the VV and VH change without the reference overlay, and the reference inundation on its own. Their grid, corner coordinates and pixel counts are in `maps_summary.json`, and the histogram of backscatter change by reference class is in `tables/`.

The report was written against these individual figures, which have not been added to this repository:

- `../maps/amphan_native_resolution_flood.png` — reference inundation at native resolution.
- `../maps/amphan_flood_comparison.png` — reference and OPERA-grid comparison.
- `../maps/VV_backscatter_change.png` — VV backscatter change.
- `../maps/VH_backscatter_change.png` — VH backscatter change.
- `../charts/amphan_sar_distributions.png` — class-wise backscatter-change distributions.
- `../charts/amphan_spatial_holdout_auc.png` — spatial holdout performance.

## 9. Data source

Bangladesh Cyclone Amphan inundation dataset, Zenodo record 4390084: https://zenodo.org/records/4390084

OPERA RTC-S1 products were obtained from the NASA/JPL OPERA product archive. Scene identifiers and acquisition details are recorded in the original downloaded product metadata.

Reproducibility note: numerical results in this report are read directly from the JSON outputs generated by the analysis scripts (`native_resolution_summary.json`, `validation_summary.json`).
