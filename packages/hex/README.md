# @corsair-dev/hex

Hex plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/hex
```

## Authentication

The plugin authenticates requests using a Hex Personal Access Token (`hxtp_...`) or Workspace Token (`hxtw_...`) passed via the `Authorization: Bearer <token>` HTTP header. The base API URL is `https://app.hex.tech/api`.

## Operations

Every operation validates its input and response schemas using Zod. List operations support cursor pagination (`after` and `before` cursors) or offset pagination as documented.

| Operation | Method and path | Official reference |
| --- | --- | --- |
| `admin.listAgentUsage` | `GET /v1/agent-usage` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `cells.list` | `GET /v1/cells` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `cells.create` | `POST /v1/cells` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `cells.delete` | `DELETE /v1/cells/{cellId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `cells.get` | `GET /v1/cells/{cellId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `cells.update` | `PATCH /v1/cells/{cellId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `cells.getChartImage` | `GET /v1/cells/{cellId}/image` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `cells.getOutput` | `GET /v1/cells/{cellId}/output` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `collections.list` | `GET /v1/collections` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `collections.create` | `POST /v1/collections` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `collections.get` | `GET /v1/collections/{collectionId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `collections.update` | `PATCH /v1/collections/{collectionId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `admin.listTopics` | `GET /v1/context/topics` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `admin.listCreditGrants` | `GET /v1/credit-grants` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `dataConnections.list` | `GET /v1/data-connections` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `dataConnections.create` | `POST /v1/data-connections` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `dataConnections.get` | `GET /v1/data-connections/{dataConnectionId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `dataConnections.update` | `PATCH /v1/data-connections/{dataConnectionId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `dataConnections.updateSchema` | `PATCH /v1/data-connections/{dataConnectionId}/schema` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `embedding.createPresignedUrl` | `POST /v1/embedding/createPresignedUrl/{projectId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `groups.list` | `GET /v1/groups` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `groups.create` | `POST /v1/groups` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `groups.delete` | `DELETE /v1/groups/{groupId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `groups.get` | `GET /v1/groups/{groupId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `groups.update` | `PATCH /v1/groups/{groupId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `guides.upsertDraft` | `PUT /v1/guides/draft` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `guides.deleteDraft` | `DELETE /v1/guides/draft/{orgGuideFileId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `guides.listDrafts` | `GET /v1/guides/draft/list` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `guides.publish` | `POST /v1/guides/publish` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.list` | `GET /v1/projects` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.create` | `POST /v1/projects` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.get` | `GET /v1/projects/{projectId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.update` | `PATCH /v1/projects/{projectId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.getQueriedTables` | `GET /v1/projects/{projectId}/queriedTables` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projectRuns.list` | `GET /v1/projects/{projectId}/runs` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projectRuns.run` | `POST /v1/projects/{projectId}/runs` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projectRuns.cancel` | `DELETE /v1/projects/{projectId}/runs/{runId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projectRuns.getStatus` | `GET /v1/projects/{projectId}/runs/{runId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projectRuns.getChartImage` | `GET /v1/projects/{projectId}/runs/{runId}/cells/{staticId}/image` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.editSharingCollections` | `PATCH /v1/projects/{projectId}/sharing/collections` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.editSharingGroups` | `PATCH /v1/projects/{projectId}/sharing/groups` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.editSharingUsers` | `PATCH /v1/projects/{projectId}/sharing/users` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.editSharingOrgAndPublic` | `PATCH /v1/projects/{projectId}/sharing/workspaceAndPublic` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.batchUpdateComputeProfile` | `POST /v1/projects/compute-profile/batch` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `projects.export` | `POST /v1/projects/export` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `semantic.update` | `PATCH /v1/semantic-projects/{semanticProjectId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `suggestions.list` | `GET /v1/suggestions` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `suggestions.get` | `GET /v1/suggestions/{suggestionId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `suggestions.update` | `POST /v1/suggestions/{suggestionId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `suggestions.updateChange` | `POST /v1/suggestions/{suggestionId}/changes/{changeId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `suggestions.triggerReview` | `POST /v1/suggestions/{suggestionId}/review` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `threads.list` | `GET /v1/threads` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `threads.create` | `POST /v1/threads` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `threads.get` | `GET /v1/threads/{id}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `threads.continue` | `POST /v1/threads/{id}/followup` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `threads.getMessages` | `GET /v1/threads/{threadId}/messages` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `users.list` | `GET /v1/users` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `users.deactivate` | `POST /v1/users/{userId}/deactivate` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `users.me` | `GET /v1/users/me` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |
| `suggestions.getV2` | `GET /v2/suggestions/{suggestionId}` | [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference) |

## Rate limits and error handling

Hex endpoints enforce group-specific rate limits (e.g., max 20 req/min for chart image rendering, max 3 req/min for semantic ingest, and standard API limits for workspace operations).
The plugin transparently handles `429 Too Many Requests` with retry backoff honouring the provider's `Retry-After` header. Common error statuses (400, 401, 403, 404, 422, 503) are routed through typed Corsair error handlers.

## Webhooks

Hex REST API does not provide inbound webhook subscriptions; all interactions follow request/response semantics.

## Unsupported API operation

Semantic ZIP ingestion is intentionally excluded. The [public Hex OpenAPI specification](https://static.hex.site/openapi.json) describes an ingest-from-ZIP operation but defines only a JSON request with `verbose`, `debug`, and `dryRun`; it specifies no archive field, multipart body, or separate upload contract. The plugin does not invent an upload format, so ZIP ingestion is unavailable through this plugin until Hex documents a supported upload contract.

## References

- [Hex Public API Documentation](https://learn.hex.tech/docs/api-integrations/api/overview)
- [Hex API Reference](https://learn.hex.tech/docs/api-integrations/api/reference)
- [Hex OpenAPI 3.0 Specification](https://static.hex.site/openapi.json)

## License

Apache-2.0
