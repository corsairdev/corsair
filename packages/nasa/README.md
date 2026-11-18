# @corsair-dev/nasa

NASA plugin for Corsair: Astronomy Picture of the Day, near-Earth asteroids, space weather from DONKI, EPIC imagery, EONET natural events and the NASA Image and Video Library.

## Install

```bash
pnpm add @corsair-dev/nasa
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apod.get` | `nasa.api.apod.get` | `read` | Read one day's picture by its six-digit date code, with title, explanation, image URLs and the raw HTML page |
| `apod.list` | `nasa.api.apod.list` | `read` | List Astronomy Picture of the Day entries, newest first, or a date range in the legacy YYMMDD form; NASA serves at most 25 per page |
| `donki.cme` | `nasa.api.donki.cme` | `read` | List coronal mass ejections in a date range, with the analyses and ENLIL model runs attached to each |
| `donki.cmeAnalysis` | `nasa.api.donki.cmeAnalysis` | `read` | List standalone CME analyses, filterable by speed, half angle, catalog and the provider's most-accurate flag |
| `donki.enlilSimulation` | `nasa.api.donki.enlilSimulation` | `read` | List WSA-ENLIL model runs in a date range, with their CME inputs and the estimated arrival at each spacecraft |
| `donki.geomagneticStorm` | `nasa.api.donki.geomagneticStorm` | `read` | List geomagnetic storms in a date range, with the Kp index readings behind each one |
| `donki.highSpeedStream` | `nasa.api.donki.highSpeedStream` | `read` | List high speed solar wind streams in a date range, with the events each one is linked to |
| `donki.interplanetaryShock` | `nasa.api.donki.interplanetaryShock` | `read` | List interplanetary shocks in a date range, filterable by the observing spacecraft and the catalog |
| `donki.magnetopauseCrossing` | `nasa.api.donki.magnetopauseCrossing` | `read` | List magnetopause crossings in a date range |
| `donki.notification` | `nasa.api.donki.notification` | `read` | List space weather notifications in a date window of at most 30 days, readable as text or filtered to one event type |
| `donki.radiationBelt` | `nasa.api.donki.radiationBelt` | `read` | List radiation belt enhancements in a date range |
| `donki.solarEnergeticParticle` | `nasa.api.donki.solarEnergeticParticle` | `read` | List solar energetic particle events in a date range |
| `donki.solarFlare` | `nasa.api.donki.solarFlare` | `read` | List solar flares in a date range, with begin, peak and end times, the class and the active region |
| `eonet.categories` | `nasa.api.eonet.categories` | `read` | List the EONET categories events can be filed under |
| `eonet.event` | `nasa.api.eonet.event` | `read` | Read one EONET event with its categories, sources and the geometry of each observation |
| `eonet.events` | `nasa.api.eonet.events` | `read` | List NASA's curated natural events, such as wildfires and storms, filterable by category, source, date window, magnitude and bounding box |
| `epic.availableDates` | `nasa.api.epic.availableDates` | `read` | List every day that has EPIC imagery, oldest first |
| `epic.images` | `nasa.api.epic.images` | `read` | Read DSCOVR EPIC's full-disc imagery metadata for the most recent day or one given day, in natural or enhanced colour |
| `images.asset` | `nasa.api.images.asset` | `read` | List an asset's downloadable file URLs at every size, and the metadata.json entry among them |
| `images.metadata` | `nasa.api.images.metadata` | `read` | Return the URL of an asset's metadata.json, which holds the raw EXIF and file details |
| `images.search` | `nasa.api.images.search` | `read` | Search the NASA Image and Video Library by text, centre, keywords, media type or year window, with the total hit count and the next page |
| `neo.browse` | `nasa.api.neo.browse` | `read` | Page through the whole near-Earth asteroid catalogue, with the total page count in the response |
| `neo.feed` | `nasa.api.neo.feed` | `read` | List asteroids making close approaches in a date window of at most seven days, grouped by the day of approach |
| `neo.lookup` | `nasa.api.neo.lookup` | `read` | Read one asteroid's full record, including its orbital elements and every recorded close approach |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/nasa

## License

Apache-2.0
