# Dancing with the SARs

An interactive story for the NASA Space Apps Challenge 2026, challenge [Dancing with the SARs](https://www.spaceappschallenge.org/2026/challenges/dancing-with-the-sars/). You take over a radar satellite, learn why water looks dark to it, and then read real radar passes yourself: a cyclone flood from Sentinel-1, and a flood season and three lakes from NISAR.

It runs in a browser, in English and Korean, and is short enough to finish in five to ten minutes.

## What it does

The visitor does the work a flood analyst does, in order: see the change, ask what else could explain it, check it against other evidence, and say what is still unknown. Wherever the data cannot settle a question, the screen says so.

| Chapter | What you do | Data |
|---|---|---|
| 1. Hidden in plain sight | Cloud closes over a flooded valley in Nepal; you sweep a radar beam across to clear it | ESA optical image, 26 Aug 2026 |
| 2. Follow the signal | Fire the radar at dry ground and at water. Label three places on two passes over Cyclone Amphan, hold other evidence against one, and drag a cut-off across the histogram | Sentinel-1 (NASA/JPL OPERA RTC-S1), 16 and 22 May 2020 |
| 2, closing stops | Find the peak of a flood season in twelve passes. Read what three lakes did in 12 days and say what could have caused it | NISAR L2 GCOV, 18 Jun to 9 Nov 2026 |
| 3. Choose the next step | Choose what to do with a flood map, work out a village's warning time, turn over five ideas, open three research files with a game in each | The team's solutions paper; three review papers |

The closing card reads the visitor's own case back: what they labelled, what they checked, the cut-off they kept, the next step they chose, and what that step still needs.

## How it answers the challenge

| The challenge asks for | Where it is |
|---|---|
| An interactive application using NISAR radar data | The two closing stops of chapter 2, measured from 14 NISAR L2 GCOV products |
| Track and visualise surface change | A floodplain filling and draining over five months (haor basin, Bangladesh); lake surfaces changing in 12 days (Siling Co, Tibet); cyclone flooding (south-western Bangladesh) |
| A time series | Twelve NISAR passes, one every 12 days, with a chart of open water per pass |
| Different polarisations | VV against VH on the Sentinel-1 map; HH against HV on the NISAR lakes, where HH moved by up to 3.9 dB and HV did not |
| Different frequencies from other sensors | Sentinel-1 C-band beside NISAR L-band |
| Hypothesise the physical drivers | Monsoon filling and autumn draining for the haor; wind, ice or a change of level for the lakes, each with what would test it |
| Ancillary data to give context | A published flood map as reference; an optical image; casualty and warning-time figures |
| Human drivers and local impact | Rice planted as the haor drains; warning time and five flood measures in chapter 3 |
| Open source | MIT licence; the data scripts are in `scripts/` |

## What we found with NISAR

Both results are measured from NISAR L-band products read from NASA's archive at the Alaska Satellite Facility. `data/nisar/README.md` has the method, the full tables and the limits.

**A flood season, haor basin, north-east Bangladesh.** In a window of 109 km by 120 km, open water was widest on 24 July 2026 at 6,086 km² and had fallen to 3,584 km² by 9 November: 2,502 km² of land came back, 41% of the peak. Water is counted where the HV echo is below −20 dB. Moving that threshold by 2 dB either way changes the size of the fall (32% to 53%) but not the date of the peak or the direction.

**Twelve days, three lakes, Tibetan Plateau.** Between 28 October and 9 November 2026 one lake brightened in HH by 1.0 dB, one darkened by 3.9 dB, and Siling Co held within 0.3 dB. In HV none moved by more than 0.1 dB. A fall of 3.9 dB is past the 3 dB that the team's own pipeline uses to flag a candidate flood, on a lake that was a lake on both dates. That is the point of the stop: a change in one channel is a lead, not a flood.

## What is not established

- The haor water areas have not been checked against a gauge, an optical image or a published flood map. Smooth wet mud can fall under the threshold.
- The haor series joins provisional products (to 16 October) and validated ones (28 October, 9 November), so a small step between those dates may come from processing.
- The causes offered for the lakes are hypotheses. Wind is called the likeliest because two lakes moved in opposite directions while HV held still; no wind record was used.
- For Cyclone Amphan, the reference flood map is itself made from Sentinel-1, so every figure there is agreement with that map, not validation. Against it, about 1 flagged place in 10 is flooded.
- There is no radar of the Nepal valley of chapter 1. The sweep there uncovers the optical image, and a label on screen says so.

## Data

| Data | Used for | From |
|---|---|---|
| NISAR L2 GCOV, L-band, HH and HV, 80 m (14 products, track 69, frames 14 and 18) | The flood season and the three lakes | NASA/JPL, via the Alaska Satellite Facility |
| OPERA RTC-S1, Sentinel-1 C-band, VV and VH (16 and 22 May 2020) | The Cyclone Amphan map and cut-off chart | NASA/JPL OPERA |
| Bangladesh Cyclone Amphan inundation dataset | Reference flood map | [Zenodo 4390084](https://zenodo.org/records/4390084) |
| Blue Marble, Eastern Hemisphere | The Earth in orbit scenes | NASA |
| Optical image of the Nepal flood, 26 Aug 2026 | Chapter 1 | European Space Agency |

The NISAR products were found through NASA Earthdata's catalogue and read from the Alaska Satellite Facility archive, both on the challenge's list of resources. Their names are in `data/nisar/products.json`.

## Use of Super Intelligence (SI)

SI tools were used. Where and how:

- **Code.** The web app (TypeScript, React, CSS) and the Python scripts in `scripts/` were written with the help of Claude (Anthropic) through Claude Code, an SI coding assistant.
- **NISAR analysis.** The same tool searched the archive for passes, chose the two study areas from what was available, and wrote and ran the scripts that produced `data/nisar/*.csv`. The numbers are computed from NASA's products by those scripts; none were generated by a model.
- **Text.** This README, `data/nisar/README.md` and the on-screen wording of the two NISAR stops (English and Korean) were drafted with it.
- **Not SI-generated.** No image, video or audio in the app was made by a generative model. The pictures are satellite data and credited photographs, the character and diagrams are drawn in code, and the music is a credited recording.

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npm run test     # story engine tests
npm run build    # type-check and build to dist/
```

The NISAR numbers and pictures can be rebuilt from NASA's archive. This needs a free [NASA Earthdata Login](https://urs.earthdata.nasa.gov) in `~/.netrc` and Python with h5py, numpy, pillow and pyproj:

```sh
python scripts/fetch_nisar_gcov.py       # reads the 80 m layers, about 67 MB per product
python scripts/build_nisar_analysis.py   # writes data/nisar/*.csv and the pictures
```

The team's wider NISAR pipeline, which catalogues the archive and flags candidate changes, is a separate repository: [nisar-analysis](https://github.com/Maha123b/nisar-analysis).

## Licence

The code is under the MIT licence: see `LICENSE`. The photographs, the music, the satellite imagery and the papers are not covered by it; each keeps the licence listed under Sources.

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

NISAR: 14 NISAR L2 GCOV products, NASA/JPL, from the Alaska Satellite Facility archive (track 69: frame 14, twelve passes from 18 June to 9 November 2026; frame 18, 28 October and 9 November 2026). Product names are in `data/nisar/products.json`. Pipeline counts: the team's [nisar-analysis](https://github.com/Maha123b/nisar-analysis) repository.

Radar analysis: OPERA RTC-S1 products from the NASA/JPL OPERA archive (Sentinel-1A, 16 May 2020, and Sentinel-1B, 22 May 2020). Reference flood map: Bangladesh Cyclone Amphan inundation dataset, [Zenodo record 4390084](https://zenodo.org/records/4390084). Method, results and limits are in `data/amphan/REPORT.md`; the maps, grid corners, histogram and threshold table behind the map viewer and the cut-off chart are in `data/amphan/maps/`, `maps_summary.json` and `tables/`.

The Texas figures (136 deaths in July 2025, 2 in July 2026), the 35 km distance, the warning-time sum and the five ideas are from the team's solutions paper, `data/Wave_of_Change_Flood_Solutions.pdf`, which lists its own sources (AP, 18 July 2026, for Texas). Its speeds are illustrative, and the screen says so.

Research files are based on:

- P. Khatiwada, P. Khatiwada, H. L. Shrestha. Multi-temporal flood mapping and dynamics in Nepal's Terai (2019–2024) using Sentinel-1 SAR and change-detection approaches. Remote Sensing Applications: Society and Environment 41, 2025. [doi:10.1016/j.rsase.2025.101860](https://doi.org/10.1016/j.rsase.2025.101860)
- D. Amitrano, G. Di Martino, A. Di Simone, P. Imperatore. Flood Detection with SAR: A Review of Techniques and Datasets. Remote Sensing 16(4), 656, 2024. [doi:10.3390/rs16040656](https://doi.org/10.3390/rs16040656)
- J. Zhao, M. Li, Y. Li, P. Matgen, M. Chini. Urban Flood Mapping Using Satellite Synthetic Aperture Radar Data: A review of characteristics, approaches, and datasets. IEEE Geoscience and Remote Sensing Magazine 13(1), 2025. [doi:10.1109/MGRS.2024.3496075](https://doi.org/10.1109/MGRS.2024.3496075)

Music: "Evening Fall (Piano)" by Kevin MacLeod ([incompetech.com](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100235)), licensed [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Changes: converted to MP3 and the silence after the last note shortened so it loops.

## For developers

### The story in detail

Chapter 1, "Hidden in plain sight", has no greeting. The title drops you into the Nepal flood of August 2026, cloud closes over the valley, and you drag a radar beam across to clear it (and back, if you like). Only then does Sara, the guide, appear. The chapter ends at the investigation desk: the two radar passes of your case side by side, and three case notes, Change, Uncertainty and Next step, still empty.

Chapter 2, "Follow the signal", has you fire the radar yourself: at dry ground, where the echo comes back, and at water, where it does not. You guess the result before you see it, can replay a shot, and can ask why water looks dark. Then the story shows the team's two radar passes over Cyclone Amphan (16 and 22 May 2020), one fading into the other, and says how often a radar flag was wrong. The map then opens three times:

1. Find the change. A divider you drag separates the two dates; three marked places, A, B and C, wait for you to label each as a new change, something already there, or unclear. You take one of them forward.
2. Check the evidence. Three sources are held against your region: the published reference flood map, which covers only the east of the strip; the other radar channel, which is the same satellite on the same passes; and a ground report or optical image, which the team does not have. You say what each shows there, then record your reading: possible flooding, existing water, or still uncertain.
3. See the gaps. Markers on the map show what it can miss: buildings, plants, the edge of the reference map, and the single moment of the pass.

Between the second and third, the team's histogram of flooded and other pixels is drawn from their counts and you drag one cut-off line across it: two figures show how many of the flagged places the reference map agrees with and how much of the flooding the line catches, and no position gets both right.

The chapter ends on NISAR, in two stops, both measured from the mission's own products.

1. Watch a flood season. Twelve passes over the haor basin of north-east Bangladesh, 18 June to 9 November 2026, play one after another. You pick the pass with the most water; only then does the chart appear, with the open water measured in every pass (6,086 km² on 24 July, 3,584 km² by 9 November) and your pick marked.
2. Read three lakes. Two passes over the lakes around Siling Co on the Tibetan Plateau, 12 days apart, sit either side of a divider, with the measured change in HH as a second view. One lake brightened, one darkened by 3.9 dB, one stayed bright, and HV did not move for any of them. You say what might have caused it: wind, ice, or a change of level. No cause is marked wrong; each answer says what would test it.

Chapter 3, "Choose the next step", opens with three next steps face up: map the change, support warnings, or plan for future floods. Choosing one shows what it still needs. Then comes warning time, with the Texas figures and the warning-time sum from the team's solutions paper: for a flood that starts 35 km upstream you find what gives a village its 15 minutes. After that come the five solution cards and the three research files (the case, the radar, the blind spots), each with a small game behind its Play button: spot the squares that changed, a 90-second run of observation problems, and a satellite pass to slide across a rising and draining flood. The closing card reads your own case back to you (the regions you labelled, the evidence you checked, your reading, your cut-off, your next step and what it still needs) and says so plainly where you skipped a part, beside five things a visitor can do.

The whole story is held to a length a judge can finish: the tests fail if chapter 1 has more than 9 lines, chapter 2 more than 24, chapter 3 more than 12, or any line more than 12 English words.

The title screen asks for a language, with English preselected; `?lang=ko` in the URL preselects Korean, and a visitor's last choice is remembered.

The cloud is drawn in the browser and the sweep uncovers the same optical image that was underneath; no radar data is shown yet, and a label on screen says so while the beam is out. Once chapter 2 has a SAR frame of the area, place it under the cloud in `src/components/CloudCover.tsx` so the sweep reveals the radar view itself.

### Moving around

Add `?scene=N` to the URL to start at that scene: 1 (the flood and the radar sweep) and 2 (the reminder) are chapter 1; 3 (firing the radar), 4 (the map and the evidence) and 5 (the cut-off chart, the gaps and NISAR) are chapter 2; 6 (choosing a next step), 7 (warning time and the solution cards) and 8 (the research files and the hand-over) are chapter 3.

Click, Space, Enter or → moves the story on, and ← or the Back button returns to the previous line. The first press finishes a line that is still typing; a line you have already read comes back whole. The bars beside the progress dots stand for the other chapters; pressing one goes to the start of that chapter. Where the story asks you to do something (drag the radar, press Fire, pick an answer) it waits for that instead. The radar handle also works from the keyboard: → moves it, Enter sends it across. Sound starts when you leave the title screen; `M` or the speaker button turns it off.

### Where things are

| To change | Edit |
|---|---|
| Dialogue and its pace, order of events, what Sara does, what the visitor does | `src/story/chapter1.ts`, `chapter2.ts`, `chapter3.ts` |
| Chapter names | `src/story/titles.ts` |
| Sara's poses, and the places she can point at | `src/components/saraPose.ts`, `src/story/anchors.ts` |
| The map's layers, numbers and wording, the three regions and their answers, where the map sits on Earth | `src/content/analysis.ts` |
| The two NISAR stops: wording, lakes, answers, pipeline counts | `src/content/nisar.ts` |
| The NISAR numbers: water area per pass, echo per lake | `scripts/build_nisar_analysis.py`, which writes `data/nisar/*.csv`; the app reads those |
| The NISAR pictures | the same script, then `public/assets/analysis/` |
| Which NISAR products are read | `data/nisar/products.json`, then `scripts/fetch_nisar_gcov.py` (needs an Earthdata login) |
| The histogram counts behind the cut-off chart | `src/content/histogram.ts` (made from `data/amphan/tables/`) |
| What the closing card says about the visitor's choices | `src/content/ui.ts` (`ending.briefing`), `src/story/caseNotes.ts` |
| The map images themselves | `scripts/build_amphan_layers.py`, then `public/assets/analysis/` |
| Buttons and other fixed interface words | `src/content/ui.ts` |
| The desk, the evidence sources and what each really shows, the gap markers, the three next steps | `src/content/investigation.ts` |
| The games in the research files | `src/content/games.ts`, `src/components/FileGames.tsx` |
| The solution cards | `src/content/solutions.ts` |
| The warning-time sum: distance, speeds, delays | `src/components/WarningWindow.tsx` |
| The closing card and its five actions | `src/content/ui.ts` (`ending`) |
| The data and sources listed on the closing card | `src/content/sources.ts` |
| The research files: spoken lines, text, figures, papers | `src/content/research.ts` |
| Typing speed and pauses at punctuation | `src/story/pacing.ts` |
| Images, photo stamps, figures, music | `src/assets.ts` and `public/assets/` |
| The synth pad, the dive sound, the typing tick and the radar ping (made in the browser, no files) | `src/audio/synth.ts` |
| Layout and colours, and each chapter's own look (end of the file) | `src/index.css` |

Every piece of text is written as `{ en: '…', ko: '…' }`. To add a line, give both; the tests fail if a Korean line is missing its Hangul or an English one contains any.

The stage is a fixed 1920×1080 canvas scaled to the window, so positions in the CSS are the same pixels as in the Canva design.

The team's source material is in `data/`: the Amphan analysis report with its JSON outputs and figures (`data/amphan/`), the NISAR product list, result tables and method note (`data/nisar/`), and the solutions paper the cards are taken from.

The map images in `public/assets/analysis/` are cut from the figures the analysis team sent on 16 November 2026 (`data/amphan/maps/`) by `scripts/build_amphan_layers.py` (needs pillow and numpy). Every figure shares the OPERA grid extent recorded in `data/amphan/maps_summary.json`, so the script crops the same window from each and the layers line up; `lonLat` in `src/content/analysis.ts` turns a position on them into latitude and longitude from the grid's four corners. The layers come from plots at about 50 m a pixel (75 m for the change maps), not from the rasters, so they blur when zoomed far in. GeoTIFFs of the same layers would fix that.

Two things the app team asked for have not arrived, and the app says so instead of filling the gap. There is no validation data independent of Sentinel-1 (`maps_summary.json` records `reference_is_independent_validation: false`), so every figure on screen is described as agreement with the reference map, and the closing card lists non-radar evidence as still needed. And the damage statistics in `data/amphan/CONTEXT_STATS.md` still have no sources, so none of them are shown.

### Placeholder art

The space background, `public/assets/bg/space.svg` (1920×1080), is a stand-in, marked `PLACEHOLDER` in `src/assets.ts`. Drop the final file next to it and update the path there.

Sara is drawn in code (`src/components/Sara.tsx`) so that she can pose, point and talk. `public/assets/character/astronaut.svg` is the earlier still drawing and is no longer shown.
