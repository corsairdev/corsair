# @corsair-dev/niftyimages

NiftyImages plugin for Corsair: read images, widgets, maps and Photoshop images with their open stats, manage Data Store records, map locations and widget or Bee Plugin users, move countdown timer dates, and edit Photoshop layers.

## Install

```bash
pnpm add @corsair-dev/niftyimages
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `beePlugin.suspendUser` | `niftyimages.api.beePlugin.suspendUser` | `write` | Suspend or reinstate a Bee Plugin user |
| `beePlugin.userImages` | `niftyimages.api.beePlugin.userImages` | `read` | List the images one Bee Plugin user made over a window |
| `beePlugin.users` | `niftyimages.api.beePlugin.users` | `read` | List Bee Plugin users with their image and open counts over a window |
| `images.delete` | `niftyimages.api.images.delete` | `destructive` | Delete an image or timer by URL; emails that embed it stop showing it |
| `images.get` | `niftyimages.api.images.get` | `read` | Read one image or timer by its URL: type, opens, dates and whether it is active |
| `images.list` | `niftyimages.api.images.list` | `read` | Page through every personalized image and countdown timer in the account |
| `images.stats` | `niftyimages.api.images.stats` | `read` | Opens per image over a date range (the last 30 days by default) |
| `maps.addLocation` | `niftyimages.api.maps.addLocation` | `write` | Add a location to a map by address or coordinates, with custom properties |
| `maps.deleteLocation` | `niftyimages.api.maps.deleteLocation` | `destructive` | Remove a location from a map |
| `maps.get` | `niftyimages.api.maps.get` | `read` | Read one map: how many locations are searchable, failed or queued, plus opens and clicks |
| `maps.list` | `niftyimages.api.maps.list` | `read` | List the map images in the account with their opens |
| `maps.searchLocations` | `niftyimages.api.maps.searchLocations` | `read` | Find locations in a map by address, location id, NiftyID or latitude and longitude |
| `maps.updateLocation` | `niftyimages.api.maps.updateLocation` | `write` | Change a map location found by NiftyID or location id |
| `psd.get` | `niftyimages.api.psd.get` | `read` | Read a Photoshop image: its text variables and every layer with its type and settings |
| `psd.update` | `niftyimages.api.psd.update` | `write` | Change a Photoshop image: rename it, set variable defaults, or edit layers by name (text, colours, images, visibility) |
| `store.addRecord` | `niftyimages.api.store.addRecord` | `write` | Add a Data Store record, or update the one whose unique fields match |
| `store.deleteById` | `niftyimages.api.store.deleteById` | `destructive` | Delete a Data Store record by its id (the value of its unique field) |
| `store.deleteRecord` | `niftyimages.api.store.deleteRecord` | `destructive` | Delete the Data Store record whose unique fields match the ones given |
| `store.fields` | `niftyimages.api.store.fields` | `read` | List the Data Store fields with their types and which ones are unique |
| `timers.updateTargetDate` | `niftyimages.api.timers.updateTargetDate` | `write` | Move a countdown timer to a new target date, optionally shifted by hours, days or months |
| `widgets.images` | `niftyimages.api.widgets.images` | `read` | List the images a widget generated in a time window, with each image’s URL and own counts |
| `widgets.list` | `niftyimages.api.widgets.list` | `read` | List the account’s widgets with their names and keys, which every other widget call needs |
| `widgets.stats` | `niftyimages.api.widgets.stats` | `read` | Read per-widget view and click counts for a time window, for every widget at once |
| `widgets.suspendUser` | `niftyimages.api.widgets.suspendUser` | `write` | Suspend or reinstate a widget user |
| `widgets.userImages` | `niftyimages.api.widgets.userImages` | `read` | List the images a widget generated for one recipient |
| `widgets.userStats` | `niftyimages.api.widgets.userStats` | `read` | Read aggregated stats for one recipient of one widget |
| `widgets.users` | `niftyimages.api.widgets.users` | `read` | List the recipients one widget recorded in a time window, with their view and click counts |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/niftyimages

## License

Apache-2.0
