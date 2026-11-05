# @corsair-dev/elasticsearch

Elasticsearch plugin for Corsair. Access to a self-hosted (or Elastic Cloud) Elasticsearch cluster: cluster health, index inventory, metadata and lifecycle, document CRUD, and search.

## Install

```bash
pnpm add @corsair-dev/elasticsearch
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cluster.getHealth` | `elasticsearch.api.cluster.getHealth` | `read` | Get the cluster's health status (green/yellow/red) with shard, node and pending-task counts |
| `documents.get` | `elasticsearch.api.documents.get` | `read` | Get one JSON document by index and id; a missing document returns found: false rather than an error |
| `documents.exists` | `elasticsearch.api.documents.exists` | `read` | Check whether a document exists (HEAD): resolves to { exists: boolean } instead of throwing on 404 |
| `documents.index` | `elasticsearch.api.documents.index` | `write` | Create or replace a document by id (POST /{index}/_doc/{id}) with optional op_type, refresh and optimistic-concurrency controls |
| `documents.create` | `elasticsearch.api.documents.create` | `write` | Create a document only if no document with the id exists yet (POST /{index}/_create/{id}); a duplicate answers 409 |
| `documents.update` | `elasticsearch.api.documents.update` | `write` | Update one document with a partial doc merge or a script (exactly one), with optional upsert and retry-on-conflict |
| `documents.delete` | `elasticsearch.api.documents.delete` | `destructive` | Delete one document by id; a missing document answers 404 with result: not_found instead of an error |
| `documents.updateByQuery` | `elasticsearch.api.documents.updateByQuery` | `write` | Update every document matching a query with a script, optionally throttled, sliced and run as a background task |
| `documents.deleteByQuery` | `elasticsearch.api.documents.deleteByQuery` | `destructive` | Delete every document matching a query (the query is mandatory so the deletion set is always explicit) |
| `documents.mget` | `elasticsearch.api.documents.mget` | `read` | Fetch multiple documents in one request by ids (under the path index) or explicit { _index, _id } entries |
| `documents.getSource` | `elasticsearch.api.documents.getSource` | `read` | Get a document's _source JSON directly by index and id; a missing document is a 404 error (unlike documents.get) |
| `documents.existsSource` | `elasticsearch.api.documents.existsSource` | `read` | Check whether a stored _source exists for a document (HEAD): resolves to { exists: boolean } |
| `documents.explain` | `elasticsearch.api.documents.explain` | `read` | Explain whether and why a document matches a query: score computation and optional inline get back |
| `documents.termvectors` | `elasticsearch.api.documents.termvectors` | `read` | Get term-vector statistics (terms, positions, offsets, payloads, frequencies) for one document |
| `documents.mtermvectors` | `elasticsearch.api.documents.mtermvectors` | `read` | Get term vectors for multiple documents by ids or { _index, _id } entries in one request |
| `documents.bulk` | `elasticsearch.api.documents.bulk` | `write` | Bulk index, create, update or delete documents on one target (PUT /{index}/_bulk) from typed operations or raw NDJSON |
| `indices.get` | `elasticsearch.api.indices.get` | `read` | Get mapping, settings and alias information for one or more indices or data streams |
| `indices.list` | `elasticsearch.api.indices.list` | `read` | List the indices (or data stream backing indices) matching a target, with health, shards, doc counts and store size |
| `search.run` | `elasticsearch.api.search.run` | `read` | Search indices, data streams or aliases with a typed subset of the Query DSL (match, match_phrase, term, terms, ids, match_all, bool) with from/size paging |

Risk levels follow the operation's effect on the cluster: `read` never mutates, `write` changes documents or index/cluster state, `destructive` deletes data. Mutating calls (POST/PUT/DELETE) are never replayed on 5xx or timeout, because the change may already have been applied; 429 retries remain safe (the request was rejected before executing).

### HEAD exists convention

Operations whose REST API is a HEAD request (`documents.exists`, `documents.existsSource`) answer 200 or 404 with an empty body. The plugin resolves both to `{ exists: boolean }` instead of throwing on 404, so an agent can branch on the value directly.

`search.run`, `documents.explain`, `documents.updateByQuery`, `documents.deleteByQuery` and `documents.termvectors` accept the same strict, typed subset of the Query DSL as `search.run`: `match`, `match_phrase`, `term`, `terms`, `ids`, `match_all`, and `bool` (which can nest any of these). Unknown query kinds and unknown body keys are rejected before the wire. `documents.deleteByQuery` additionally requires a `query`, so the deletion set is always explicit.

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

Each account stores its own cluster endpoint in the `baseUrl` account field (for example `https://es.internal.example:9200`), so different tenants can target different clusters. In solo mode pass `baseUrl` (and optionally `key`) as plugin options instead.

The stored API key value is sent as the documented `Authorization: ApiKey <encoded>` header ([API key auth](https://www.elastic.co/docs/api/doc/elasticsearch/authentication)). Accepted values:

- the `encoded` string returned by Elasticsearch's Create API key API (used as-is),
- a raw `id:api_key` pair (the plugin base64-encodes it; base64 cannot contain `:`, so the two forms never collide),
- a full header value `ApiKey ...`, `Basic ...` (HTTP Basic clusters) or `Bearer ...` (Elastic Cloud tokens), which passes through verbatim.

## Webhooks

No webhooks.

## Reference

- Elasticsearch REST API reference: https://www.elastic.co/docs/api/doc/elasticsearch
- Corsair plugin docs: https://docs.corsair.dev/plugins/elasticsearch

## License

Apache-2.0
