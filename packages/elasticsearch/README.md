# @corsair-dev/elasticsearch

Elasticsearch plugin for Corsair. Read-only access to a self-hosted (or Elastic Cloud) Elasticsearch cluster: cluster health, index inventory and metadata, search, and document lookup.

## Install

```bash
pnpm add @corsair-dev/elasticsearch
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cluster.getHealth` | `elasticsearch.api.cluster.getHealth` | `read` | Get the cluster's health status (green/yellow/red) with shard, node and pending-task counts |
| `documents.get` | `elasticsearch.api.documents.get` | `read` | Get one JSON document by index and id; a missing document returns found: false rather than an error |
| `indices.get` | `elasticsearch.api.indices.get` | `read` | Get mapping, settings and alias information for one or more indices or data streams |
| `indices.list` | `elasticsearch.api.indices.list` | `read` | List the indices (or data stream backing indices) matching a target, with health, shards, doc counts and store size |
| `search.run` | `elasticsearch.api.search.run` | `read` | Search indices, data streams or aliases with a typed subset of the Query DSL (match, match_phrase, term, terms, ids, match_all, bool) with from/size paging |

All endpoints are read-only (`riskLevel: 'read'`). `search.run` accepts a strict, typed subset of the Query DSL rather than arbitrary query JSON: `match`, `match_phrase`, `term`, `terms`, `ids`, `match_all`, and `bool` (which can nest any of these) with `from`/`size` paging capped at Elasticsearch's documented 10,000 window. Unknown query kinds and unknown body keys are rejected before the wire.

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
