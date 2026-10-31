# @corsair-dev/qdrant

Corsair plugin for the [Qdrant](https://qdrant.tech) vector search engine, self-hosted or on Qdrant Cloud. It covers collections, aliases, payload indexes, points, the universal Query API (dense, sparse, hybrid, recommend, groups, facets) and snapshots.

## Setup

```ts
import { createCorsair } from 'corsair'
import { qdrant } from '@corsair-dev/qdrant'

export const corsair = createCorsair({
  plugins: [qdrant()],
  // ...
})
```

Each account stores its API key (or JWT) as `api_key` and its cluster URL as `base_url`. To use one cluster for every account, pass the URL instead: `qdrant({ baseUrl: 'http://localhost:6333' })`. For a server running without an API key, pass `unauthenticated: true`. Otherwise a missing key fails with `AuthMissingError`.

The URL is never taken from endpoint input, so an agent can't send the key to another server. It must not contain credentials, a query string or a fragment, and plain `http` is only accepted for localhost, private addresses and cluster-internal names (`qdrant`, `*.svc.cluster.local`). A path prefix is allowed, for clusters behind a reverse proxy.

## Endpoints

| Group | Operations |
| --- | --- |
| `collections` | `list`, `get`, `exists`, `create`, `update`, `delete` |
| `aliases` | `list`, `listForCollection`, `update` |
| `payloadIndexes` | `create`, `delete` |
| `points` | `upsert`, `get`, `delete`, `scroll`, `count`, `setPayload`, `overwritePayload`, `deletePayload`, `clearPayload`, `updateVectors`, `deleteVectors` |
| `query` | `points`, `batch`, `groups`, `facet` |
| `snapshots` | `list`, `create`, `delete` |

Inputs use the field names of the [Qdrant REST API](https://api.qdrant.tech/api-reference). Path parameters are `collectionName`, `fieldName` and `snapshotName`, and `wait`, `ordering`, `timeout` and `consistency` go in the same input object. Outputs are Qdrant's `result`, unchanged.

Notes:

- Writes default to `wait: true`, so a read straight after a write sees it. Snapshot operations always wait. The client waits up to 5 minutes, or `timeout` plus 5 seconds when one is given.
- Point-selecting operations take either `points` (IDs) or `filter`, exactly one.
- Path parameters can't be `.` or `..`, which URLs would resolve to a parent resource.
- `points.overwritePayload` rejects `key`: Qdrant ignores it and replaces the whole payload. Use `points.setPayload` with `key` to change one nested object.
- Integer point IDs above `Number.MAX_SAFE_INTEGER` can't be represented in JavaScript. A response that contains one fails with `INVALID_RESPONSE` rather than returning a rounded ID.

## Example

```ts
await corsair.qdrant.api.collections.create({
  collectionName: 'docs',
  vectors: { dense: { size: 384, distance: 'Cosine' } },
  sparse_vectors: { bm25: { modifier: 'idf' } },
})

await corsair.qdrant.api.points.upsert({
  collectionName: 'docs',
  points: [{ id: 1, vector: { dense: embedding, bm25: sparse }, payload: { lang: 'en' } }],
})

const { points } = await corsair.qdrant.api.query.points({
  collectionName: 'docs',
  prefetch: [
    { query: sparseQuery, using: 'bm25', limit: 20 },
    { query: denseQuery, using: 'dense', limit: 20 },
  ],
  query: { fusion: 'rrf' },
  filter: { must: [{ key: 'lang', match: { value: 'en' } }] },
  limit: 5,
  with_payload: true,
})
```

## Errors

Failed requests throw an `ApiError` whose message is Qdrant's own reason, e.g. `Wrong input: Vector dimension error: expected dim: 384, got 3`, with the HTTP status kept. 429s are retried by Corsair's HTTP layer using `Retry-After`. Nothing is mirrored to the local database. Each call logs a `qdrant.<group>.<operation>` event, `completed` or `failed`, recording only the collection name.

## Testing

```bash
pnpm test
docker run -p 6333:6333 -e QDRANT__SERVICE__API_KEY=test-key qdrant/qdrant
QDRANT_URL=http://localhost:6333 QDRANT_API_KEY=test-key pnpm test integration
```
