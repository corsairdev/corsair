# @corsair-dev/keen

Keen plugin for Corsair: record events and batch events, inspect collections and their property types, run count, sum, average and the rest of Keen's analyses, and manage saved queries and cached datasets.

## Install

```bash
pnpm add @corsair-dev/keen
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `collections.get` | `keen.api.collections.get` | `read` | One collection’s property names and their inferred types |
| `collections.list` | `keen.api.collections.list` | `read` | Every event collection on the project, with its properties and types |
| `datasets.delete` | `keen.api.datasets.delete` | `destructive` | Delete a cached dataset and its computed rows; it cannot be restored |
| `datasets.get` | `keen.api.datasets.get` | `read` | One cached dataset’s definition, including how far behind its computation is |
| `datasets.list` | `keen.api.datasets.list` | `read` | Cached dataset definitions, paged by `after_name`; `next_after_name` carries the cursor |
| `datasets.result` | `keen.api.datasets.result` | `read` | A cached dataset’s computed rows, selected by the values of its `index_by` properties |
| `events.record` | `keen.api.events.record` | `write` | Record one event in a collection; Keen answers `created` and takes up to 10 seconds to make it queryable |
| `events.recordMany` | `keen.api.events.recordMany` | `write` | Record events across one or more collections in one request, with a result per event. Keen recommends batches of 5,000 or less |
| `properties.get` | `keen.api.properties.get` | `read` | The type Keen inferred for one property, such as `num` or `string` |
| `queries.multiAnalysis` | `keen.api.queries.multiAnalysis` | `read` | Run up to 10 analyses over one collection in one request, each under its own label |
| `queries.run` | `keen.api.queries.run` | `read` | Run one analysis (`count`, `sum`, `average`, `count_unique`, `percentile` and the rest) over a collection, with filters, grouping and intervals |
| `savedQueries.create` | `keen.api.savedQueries.create` | `write` | Create or replace a saved query by name, with the refresh rate that caches its result |
| `savedQueries.delete` | `keen.api.savedQueries.delete` | `destructive` | Delete a saved query and its cached result; it cannot be restored |
| `savedQueries.get` | `keen.api.savedQueries.get` | `read` | One saved query’s definition |
| `savedQueries.list` | `keen.api.savedQueries.list` | `read` | Every saved query on the project, with its definition and refresh rate |
| `savedQueries.result` | `keen.api.savedQueries.result` | `read` | The cached result of a saved query, which is what makes a dashboard load instantly |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/keen

## License

Apache-2.0
