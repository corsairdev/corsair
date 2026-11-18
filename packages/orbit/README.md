# Orbit

Search for people and enrich public profiles through the [Orbit API](https://docs.orbitsearch.com/).

Base URL: `https://api.orbitsearch.com`. Auth: `Authorization: Bearer sk_orb_...`. Keys are created in the Orbit Developer Dashboard and shown once. `search:read` starts and polls Search and Enrich. `profile:read` is required when a response embeds a profile.

| Operation | Method | Path |
| --- | --- | --- |
| `search.start` | POST | `/v3/search` |
| `search.get` | GET | `/v3/search/{search_id}` |
| `search.quotePopulation` | POST | `/v3/search/populations/quote` |
| `search.startPopulation` | POST | `/v3/search/populations` |
| `enrich.read` | GET | `/v3/enrich/{profile_id}` |
| `enrich.start` | POST | `/v3/enrich/{profile_id}` |
| `enrich.get` | GET | `/v3/enrich/requests/{request_id}` |
| `enrich.batch` | POST | `/v3/enrich` |
| `bulk.submit` | POST | `/v3/search/bulk` |
| `bulk.get` | GET | `/v3/search/bulk/{job_id}` |
| `bulk.results` | GET | `/v3/search/bulk/{job_id}/results` |
| `bulk.cancel` | POST | `/v3/search/bulk/{job_id}/cancel` |
| `faces.detect` | POST | `/v3/faces/detect` |
| `faces.index` | POST | `/v3/faces/index-search` |
| `watchers.*` | * | `/v3/watchers` |
| `webhooks.*` | * | `/v3/webhooks` |

A search needs `query`, `intent`, or `signals`. `candidate_discovery_limit` is 1 to 50 and only applies when `candidate_discovery` is true. Batch enrich accepts 1 to 20 profiles. Watcher intervals are 3600 to 2592000 seconds. Bulk jobs accept 1 to 5000 items and cannot carry a face signal.

Credits and rate limits are separate. `402` does not retry. `409` means an idempotency key was reused for different work and does not retry. `429` retries up to 3 attempts and caps `Retry-After` at 60 seconds. `500` and `503` retry once only for GET or a request that sent an idempotency key. Other statuses do not retry.

Webhook deliveries are HMAC-SHA256 over `` `${timestamp}.${rawBody}` `` using the `whsec_...` secret from webhook creation. Headers are `x-orbit-webhook-signature`, `x-orbit-webhook-timestamp`, and `x-orbit-webhook-event-id`. Timestamps older than five minutes are rejected. A repeat of the same event id returns success false so after-hooks do not run again.

Not implemented: dashboard API-key create, list, and revoke. The docs say developer keys cannot manage other keys through the public API. Deprecated v2 routes are not called.

Live smoke, from the worktree root:

```bash
ORBIT_API_KEY='sk_orb_...' pnpm --filter @corsair-dev/orbit test
```

The live test reads a missing search id and expects `404`. It does not start a billed search.
