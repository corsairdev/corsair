# @corsair-dev/langbase

Langbase plugin for Corsair. Manage AI pipes, semantic memories and documents, retrieve context, and manage conversation threads.

## Install

```bash
pnpm add @corsair-dev/langbase
```

## Authentication

Configure a Langbase User or Organization API key with Corsair's `api_key` auth. Requests use `Authorization: Bearer <key>`. See the [Langbase API reference](https://langbase.com/docs/api-reference) and [API key guide](https://langbase.com/docs/api-reference/api-keys).

## Operations

The plugin exposes 20 operations:

| Operation | Method and route | Risk | Official reference |
|---|---|---|---|
| `agent.run` | `POST /v1/agent/run` | destructive | [Agent Run API](https://langbase.com/docs/api-reference/agent) |
| `pipes.run` | `POST /v1/pipes/run` (`name` in body) | destructive | [Run pipe](https://langbase.com/docs/api-reference/pipe/run), [User/Org key guide](https://langbase.com/docs/guides/run-pipe-user-org-api-keys) |
| `pipes.list` | `GET /v1/pipes` | read | [List pipes](https://langbase.com/docs/api-reference/pipe/list) |
| `pipes.get` | `GET /v1/pipes/{ownerLogin}/{pipeName}` | read | [Pipe API](https://langbase.com/docs/api-reference/pipe) |
| `pipes.create` | `POST /v1/pipes` | write | [Create pipe](https://langbase.com/docs/api-reference/pipe/create) |
| `pipes.update` | `POST /v1/pipes/{pipeName}` | write | [Update pipe](https://langbase.com/docs/api-reference/pipe/update) |
| `memory.list` | `GET /v1/memory` | read | [List memories](https://langbase.com/docs/api-reference/memory/list) |
| `memory.create` | `POST /v1/memory` | write | [Create memory](https://langbase.com/docs/api-reference/memory/create) |
| `memory.delete` | `DELETE /v1/memory/{memoryName}` | destructive | [Delete memory](https://langbase.com/docs/api-reference/memory/delete) |
| `memory.retrieve` | `POST /v1/memory/retrieve` | read | [Retrieve memory](https://langbase.com/docs/api-reference/memory/retrieve) |
| `documents.list` | `GET /v1/memory/{memoryName}/documents` | read | [List documents](https://langbase.com/docs/api-reference/memory/document-list) |
| `documents.upload` | `POST /v1/memory/documents`, then `PUT {signedUrl}` | destructive | [Upload document](https://langbase.com/docs/api-reference/memory/document-upload) |
| `documents.delete` | `DELETE /v1/memory/{memoryName}/documents/{documentName}` | destructive | [Delete document](https://langbase.com/docs/api-reference/memory/document-delete) |
| `documents.retryEmbeddings` | `GET /v1/memory/{memoryName}/documents/{documentName}/embeddings/retry` | destructive | [Retry embeddings](https://langbase.com/docs/api-reference/memory/document-embeddings-retry) |
| `threads.create` | `POST /v1/threads` | destructive | [Create thread](https://langbase.com/docs/api-reference/threads/create) |
| `threads.get` | `GET /v1/threads/{threadId}` | read | [Get thread](https://langbase.com/docs/api-reference/threads/get) |
| `threads.update` | `POST /v1/threads/{threadId}` | write | [Update thread](https://langbase.com/docs/api-reference/threads/update) |
| `threads.delete` | `DELETE /v1/threads/{threadId}` | destructive | [Delete thread](https://langbase.com/docs/api-reference/threads/delete) |
| `threads.appendMessages` | `POST /v1/threads/{threadId}/messages` | destructive | [Append messages](https://langbase.com/docs/api-reference/threads/append-messages) |
| `threads.listMessages` | `GET /v1/threads/{threadId}/messages` | read | [List messages](https://langbase.com/docs/api-reference/threads/list-messages) |

`agent.run` uses the User/Organization key and the Langbase account's configured LLM keyset. It accepts JSON responses only; `stream: true` is rejected and the plugin sends `stream: false`. `mcp_servers` is not exposed because its documented options can carry authorization tokens and custom headers in tool arguments.

Pipe runs use the configured User/Organization API key and a required `name` body field to select the pipe, per Langbase's [User/Org key guide](https://langbase.com/docs/guides/run-pipe-user-org-api-keys). Runs are marked destructive because they can consume usage credits. The run operation accepts JSON mode only; `stream: true` is rejected and the plugin sends `stream: false`. Thread/message operations provide conversation context and history. Langbase's documented list routes do not expose pagination parameters.

Thread creation and message append are destructive because they persist conversation content and Langbase documents no per-message delete operation.

Rate and usage limits depend on the Langbase subscription plan; see the [official limits reference](https://langbase.com/docs/api-reference/limits). The plugin does not assume a fixed per-call credit cost.

Document uploads accept base64 file contents and a supported MIME type. The plugin obtains and uses the signed upload URL internally, never returns it, and does not forward the Langbase API key to the upload host.

## Exclusions

- Pipe deletion and single-memory GET are not exposed because the current Langbase v1 API reference does not define those routes.
- Web search is not exposed because it requires a separate Exa API key in `LB-WEB-SEARCH-KEY`; this plugin configures only the Langbase credential. See [Langbase web-search requirements](https://langbase.com/docs/api-reference/tools/web-search).
- Langbase documents no separate run-history retrieval route. Use `threads.get` and `threads.listMessages` to retrieve conversation context.
- No webhooks are included; they were not requested for this integration.

## Errors and privacy

Provider responses are validated with Zod before being returned. Rate limits retain `Retry-After` and are not retried by a second plugin-level loop. Request bodies, documents, signed URLs, and credentials are not logged.

## Reference

Corsair docs: [Langbase overview](https://docs.corsair.dev/plugins/langbase/overview) · [API reference](https://docs.corsair.dev/plugins/langbase/api)

## License

Apache-2.0
