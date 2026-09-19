# @corsair-dev/strava

Strava plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/strava
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activities.create` | `strava.api.activities.create` | `write` | Create a manual activity |
| `activities.get` | `strava.api.activities.get` | `read` | Get details of an activity by ID |
| `activities.getStreams` | `strava.api.activities.getStreams` | `read` | Get stream data for an activity |
| `activities.getZones` | `strava.api.activities.getZones` | `read` | Get heart rate and power zones for an activity |
| `activities.list` | `strava.api.activities.list` | `read` | List the authenticated athlete's activities |
| `activities.listComments` | `strava.api.activities.listComments` | `read` | List comments on an activity |
| `activities.listKudoers` | `strava.api.activities.listKudoers` | `read` | List athletes who kudoed an activity |
| `activities.listLaps` | `strava.api.activities.listLaps` | `read` | List laps of an activity |
| `athletes.get` | `strava.api.athletes.get` | `read` | Get the authenticated athlete profile |
| `athletes.getStats` | `strava.api.athletes.getStats` | `read` | Get an athlete's activity statistics |
| `athletes.getZones` | `strava.api.athletes.getZones` | `read` | Get the authenticated athlete's heart rate and power zones |
| `athletes.update` | `strava.api.athletes.update` | `write` | Update the authenticated athlete's profile |
| `clubs.get` | `strava.api.clubs.get` | `read` | Get details of a club by ID |
| `gear.get` | `strava.api.gear.get` | `read` | Get details of a gear item by ID |
| `routes.exportGpx` | `strava.api.routes.exportGpx` | `read` | Export a route as GPX |
| `routes.exportTcx` | `strava.api.routes.exportTcx` | `read` | Export a route as TCX |
| `routes.get` | `strava.api.routes.get` | `read` | Get details of a route by ID |
| `routes.getStreams` | `strava.api.routes.getStreams` | `read` | Get stream data for a route |
| `segmentEfforts.get` | `strava.api.segmentEfforts.get` | `read` | Get details of a segment effort by ID |
| `segmentEfforts.getStreams` | `strava.api.segmentEfforts.getStreams` | `read` | Get stream data for a segment effort |
| `segments.explore` | `strava.api.segments.explore` | `read` | Find popular segments within a bounding box |
| `segments.get` | `strava.api.segments.get` | `read` | Get details of a segment by ID |
| `segments.getStreams` | `strava.api.segments.getStreams` | `read` | Get stream data for a segment |
| `segments.list` | `strava.api.segments.list` | `read` | List the authenticated athlete's starred segments |
| `segments.star` | `strava.api.segments.star` | `write` | Star or unstar a segment |
| `uploads.create` | `strava.api.uploads.create` | `write` | Upload an activity file (FIT, TCX, GPX) |
| `uploads.get` | `strava.api.uploads.get` | `read` | Get the status of an upload by ID |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/strava

## License

Apache-2.0
