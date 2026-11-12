# @corsair-dev/geocodio

Geocodio plugin for Corsair: geocode addresses one at a time or in batches of up to 10,000, reverse geocode coordinates, append Census and district data, and measure driving or straight-line distances.

## Install

```bash
pnpm add @corsair-dev/geocodio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `distance.fromOrigin` | `geocodio.api.distance.fromOrigin` | `read` | Measure driving or straight-line distance and duration from one origin to many destinations, optionally filtering and sorting by either |
| `distance.matrix` | `geocodio.api.distance.matrix` | `read` | Measure every origin against every destination, or pair each origin with one destination, in a single request |
| `geocode.batch` | `geocodio.api.geocode.batch` | `read` | Geocode up to 10,000 addresses in one request, answered in the order they were sent |
| `geocode.batchReverse` | `geocodio.api.geocode.batchReverse` | `read` | Reverse geocode up to 10,000 coordinate pairs in one request, answered in the order they were sent |
| `geocode.forward` | `geocodio.api.geocode.forward` | `read` | Turn an address into coordinates, with a confidence score, the accuracy type that says how the match was made, and the parsed components. Data appends such as timezone or congressional district come back under `fields` |
| `geocode.parse` | `geocodio.api.geocode.parse` | `read` | Split an address into its components without geocoding it, so it costs no lookup |
| `geocode.reverse` | `geocodio.api.geocode.reverse` | `read` | Turn a latitude and longitude into the nearest address, with the same confidence and components a forward lookup returns |
| `jobs.delete` | `geocodio.api.jobs.delete` | `destructive` | Delete a distance job and its stored result |
| `jobs.get` | `geocodio.api.jobs.get` | `read` | Read one distance job, whose status says whether its result is ready |
| `jobs.list` | `geocodio.api.jobs.list` | `read` | List the asynchronous distance matrix jobs on the account |
| `lists.all` | `geocodio.api.lists.all` | `read` | List the uploaded spreadsheets and their processing status |
| `lists.delete` | `geocodio.api.lists.delete` | `destructive` | Delete an uploaded spreadsheet and its results |
| `lists.get` | `geocodio.api.lists.get` | `read` | Read one spreadsheet list, whose status and download URL say when its results are ready |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/geocodio

## License

Apache-2.0
