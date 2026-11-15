# nasa-spaceapp

NASA Space Apps Challenge 2026 — [Dancing with the SARs](https://www.spaceappschallenge.org/2026/challenges/dancing-with-the-sars/)

An interactive story in which an astronaut walks you through what radar satellites saw of a flood. Chapters 1 (introduction) and 2 (observation) are built; chapter 3 is next.

Chapter 1 opens on a title screen, shows the Earth from orbit, dives into the Nepal flood of August 2026, and ends with cloud closing over the valley until a radar sweep clears it.

Chapter 2 first explains in four pictures how radar sees water, then shows the team's radar analysis of Cyclone Amphan (Bangladesh, May 2020). The map opens with a short guided tour and is then free to zoom, drag and switch between the VV and VH channels. After it come five solution cards to turn over and three research files to open and read.

The story is in English and Korean. The title screen asks which, with English preselected; `?lang=ko` in the URL preselects Korean, and a visitor's last choice is remembered.

The analysis in chapter 2 uses Sentinel-1 data (NASA/JPL OPERA RTC-S1), not NISAR. A NISAR case study is planned; when it is ready it can replace or join the Amphan one in `src/content/analysis.ts`.

The cloud is drawn in the browser and the sweep uncovers the same optical image that was underneath; no radar data is shown yet. Once chapter 2 has a SAR frame of the area, place it under the cloud in `src/components/CloudCover.tsx` so the sweep reveals the radar view itself.

## Run

```sh
npm install
npm run dev      # http://localhost:5173
npm run test     # story engine tests
npm run build    # type-check and build to dist/
```

Add `?scene=N` to the URL to start at that scene: 1 to 3 are chapter 1, and 4 (radar lesson and map), 5 (solution cards) and 6 (research files) are chapter 2.

Click, Space, Enter or → moves the story on. The first press finishes a line that is still typing. Sound starts when you leave the title screen; `M` or the speaker button turns it off.

## Where things are

| To change | Edit |
|---|---|
| Dialogue and its pace, order of events, camera moves, music cues, character name | `src/story/chapter1.ts`, `src/story/chapter2.ts` |
| The map's layers, numbers, wording and guided tour | `src/content/analysis.ts` |
| Buttons and other fixed interface words | `src/content/ui.ts` |
| The solution cards | `src/content/solutions.ts` |
| The research files: spoken lines, text, figures, papers | `src/content/research.ts` |
| Typing speed and pauses at punctuation | `src/story/pacing.ts` |
| Images, photo stamps, figures, music | `src/assets.ts` and `public/assets/` |
| The synth pad, the dive sound, the typing tick and the radar ping (made in the browser, no files) | `src/audio/synth.ts` |
| Layout and colours | `src/index.css` |

Every piece of text is written as `{ en: '…', ko: '…' }`. To add a line, give both; the tests fail if a Korean line is missing its Hangul or an English one contains any.

The stage is a fixed 1920×1080 canvas scaled to the window, so positions in the CSS are the same pixels as in the Canva design.

The team's source material is in `data/`: the Amphan analysis report with its JSON outputs and figures (`data/amphan/`), and the solutions paper the cards are taken from.

The map images in `public/assets/analysis/` were cut out of the analysis summary figure, so they are not georeferenced and cannot be laid over a base map yet. Exporting the VV and VH change rasters with their bounds would allow that.

### Placeholder art

Two images are stand-ins, marked `PLACEHOLDER` in `src/assets.ts`:

- `public/assets/bg/space.svg` — space background, 1920×1080
- `public/assets/character/astronaut.svg` — the astronaut, transparent, about 520×900

Drop the final file next to it and update the path in `src/assets.ts`.

## Sources

Casualty figures for the 26 August 2026 Nepal flood (1,455 dead, 5,285 missing in Nepal) are those of Nepal's National Disaster Risk Reduction and Management Authority as reported by Reuters and PTI on 5 October 2026.

| Image | Source | Licence |
|---|---|---|
| Nepal flood from orbit, 26 Aug 2026 | [European Space Agency](https://commons.wikimedia.org/wiki/File:Nepal_glacier_collapse_and_flood_(after)_(55504451912).jpg) | CC BY 4.0 |
| Sylhet, Bangladesh, 2022 | [Nayeemibnmatiur](https://commons.wikimedia.org/wiki/File:Urban_man_leaving_his_house_due_to_flash_flood_Sylhet,_Bangladesh.jpg) | CC BY-SA 4.0 |
| Angamaly, Kerala, India, 2018 | [Ranjithsiji](https://commons.wikimedia.org/wiki/File:Kerala_Flood_2018_-_Angamaly-_IMG_20180816_163946.jpg) | CC BY-SA 4.0 |
| New Orleans, USA, 2005 | [Jeremy L. Grisham / U.S. Navy](https://commons.wikimedia.org/wiki/File:Navy-FloodedNewOrleans.jpg) | Public domain |
| The Earth, Eastern Hemisphere (Blue Marble, 2002) | [NASA](https://commons.wikimedia.org/wiki/File:Earth_Eastern_Hemisphere.jpg) | Public domain |
| Liberty, Kentucky, USA, 2010 | [Liz Roll / FEMA](https://commons.wikimedia.org/wiki/File:FEMA_-_44502_-_Liberty_Kentucky_debris.jpg) | Public domain |

Photos are resized to 1920 px wide and cropped on screen; nothing else is altered.

Radar analysis: OPERA RTC-S1 products from the NASA/JPL OPERA archive (Sentinel-1A, 16 May 2020, and Sentinel-1B, 22 May 2020). Reference flood map: Bangladesh Cyclone Amphan inundation dataset, [Zenodo record 4390084](https://zenodo.org/records/4390084). Method, results and limits are in `data/amphan/REPORT.md`.

Research files are based on:

- P. Khatiwada, P. Khatiwada, H. L. Shrestha. Multi-temporal flood mapping and dynamics in Nepal's Terai (2019–2024) using Sentinel-1 SAR and change-detection approaches. Remote Sensing Applications: Society and Environment 41, 2025. [doi:10.1016/j.rsase.2025.101860](https://doi.org/10.1016/j.rsase.2025.101860)
- D. Amitrano, G. Di Martino, A. Di Simone, P. Imperatore. Flood Detection with SAR: A Review of Techniques and Datasets. Remote Sensing 16(4), 656, 2024. [doi:10.3390/rs16040656](https://doi.org/10.3390/rs16040656)
- J. Zhao, M. Li, Y. Li, P. Matgen, M. Chini. Urban Flood Mapping Using Satellite Synthetic Aperture Radar Data: A review of characteristics, approaches, and datasets. IEEE Geoscience and Remote Sensing Magazine 13(1), 2025. [doi:10.1109/MGRS.2024.3496075](https://doi.org/10.1109/MGRS.2024.3496075)

Music: "Evening Fall (Piano)" by Kevin MacLeod ([incompetech.com](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100235)), licensed [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Changes: converted to MP3 and the silence after the last note shortened so it loops.
