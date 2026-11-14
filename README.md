# nasa-spaceapp

NASA Space Apps Challenge 2026 — [Dancing with the SARs](https://www.spaceappschallenge.org/2026/challenges/dancing-with-the-sars/)

An interactive story in which an astronaut walks you through what radar satellites saw of a flood. Chapter 1 (introduction) is built; chapters 2 and 3 are next.

## Run

```sh
npm install
npm run dev      # http://localhost:5173
npm run test     # story engine tests
npm run build    # type-check and build to dist/
```

Add `?scene=2` (or `3`) to the URL to start at that scene.

Click, Space, Enter or → moves the story on. The first press finishes a line that is still typing. Music starts on the first click or key press; `M` or the speaker button turns it off.

## Where things are

| To change | Edit |
|---|---|
| Dialogue, order of events, character name | `src/story/chapter1.ts` |
| Images, photo stamps, music | `src/assets.ts` and `public/assets/` |
| Layout and colours | `src/index.css` |

The stage is a fixed 1920×1080 canvas scaled to the window, so positions in the CSS are the same pixels as in the Canva design.

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
| Liberty, Kentucky, USA, 2010 | [Liz Roll / FEMA](https://commons.wikimedia.org/wiki/File:FEMA_-_44502_-_Liberty_Kentucky_debris.jpg) | Public domain |

Photos are resized to 1920 px wide and cropped on screen; nothing else is altered.

Music: "Evening Fall (Piano)" by Kevin MacLeod ([incompetech.com](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100235)), licensed [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Changes: converted to MP3 and the silence after the last note shortened so it loops.
