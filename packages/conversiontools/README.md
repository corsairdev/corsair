# @corsair-dev/conversiontools

Conversion Tools plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/conversiontools
```

## Endpoints

The plugin exposes the documented JSON-compatible operations below. Task creation is asynchronous: it returns a `task_id`; call `tasks.get` to check status rather than having the plugin poll automatically.

| Operation | Method and path | Risk | Provider reference |
| --- | --- | --- | --- |
| `account.verify` | `GET /v1/` | read | [Full API reference §2](https://conversiontools.io/llms-full.txt) |
| `account.getInfo` | `GET /v1/auth` | read | [OpenAPI](https://api.conversiontools.io/openapi.yaml) |
| `account.getConfig` | `GET /v1/config` | read | [OpenAPI](https://api.conversiontools.io/openapi.yaml) |
| `conversions.list` | `GET /v1/conversions` | read | [API docs: connector](https://conversiontools.io/api-documentation#building-a-connector) |
| `conversions.get` | `GET /v1/conversions/{type}` | read | [OpenAPI](https://api.conversiontools.io/openapi.yaml) |
| `files.upload` | `POST /v1/files` | write | [API docs: upload](https://conversiontools.io/api-documentation#upload-file-to-server) |
| `files.getInfo` | `GET /v1/files/{file_id}/info` | read | [OpenAPI](https://api.conversiontools.io/openapi.yaml) |
| `files.createDownloadLink` | `POST /v1/files/{file_id}/download` | write | [Full API reference §§4, 7](https://conversiontools.io/llms-full.txt) |
| `files.downloadById` | `GET /v1/files/{file_id}` | read | [Full API reference](https://conversiontools.io/llms-full.txt) |
| `files.downloadFromLink` | `GET /v1/files/{download_id}/download` | read | [Full API reference](https://conversiontools.io/llms-full.txt) |
| `files.createUploadSession` | `POST /v1/upload-sessions` | write | [Full API reference §5](https://conversiontools.io/llms-full.txt) |
| `files.uploadToSession` | `PUT /v1/upload-sessions/{session_id}` | write | [Full API reference §5](https://conversiontools.io/llms-full.txt) |
| `tasks.create` | `POST /v1/tasks` | destructive | [API docs: create task](https://conversiontools.io/api-documentation#run-conversion-task) |
| `tasks.list` | `GET /v1/tasks` | read | [OpenAPI](https://api.conversiontools.io/openapi.yaml) |
| `tasks.get` | `GET /v1/tasks/{task_id}` | read | [API docs: task status](https://conversiontools.io/api-documentation#get-task-status) |
| `tasks.updateRetention` | `PATCH /v1/tasks/{task_id}/retention` | write | [OpenAPI](https://api.conversiontools.io/openapi.yaml) |
| `tasks.remove` | `POST /v1/tasks/{task_id}/delete` | destructive | [OpenAPI](https://api.conversiontools.io/openapi.yaml) |

`GET /v1/tasks` returns recent tasks and accepts the documented `status` filter. The OpenAPI document publishes no pagination parameters, but the live API pages with `page` and `limit` (default 50, at most 100) and returns a `pagination` block; `tasks.list` passes both through. `GET /v1/conversions` accepts `input`, `output`, and `ai` filters and is public. Task status values are `PENDING`, `RUNNING`, `SUCCESS`, and `ERROR`. Poll no more often than every 5–10 seconds.

Provider `file_id`, `task_id`, and `download_id` values are 32-character lowercase hexadecimal strings. The plugin validates these IDs before making requests.

`tasks.create` accepts the dynamic conversion `type` and an open `options` object. Put a `file_id` or `url` in `options` as the source, then add any documented converter-specific options. Callback URLs are intentionally not exposed because this plugin does not implement webhook support. `tasks.remove` is irreversible and only available on paid plans; `ttl_15m` retention is also paid-plan-only.

## Authentication

Auth: API key. Obtain the token from the provider profile page and send it as `Authorization: Bearer <API Token>`. The conversion catalog reads, upload-session `PUT`, and temporary-link `files.downloadFromLink` are unauthenticated as documented; `files.downloadById` and all other authenticated operations use the stored API key.

## Binary downloads

`files.downloadById` and `files.downloadFromLink` preserve raw response bytes and return them as `contentBase64`, along with `contentType`, optional `contentDisposition`, and byte `size`. The temporary `download_id` is a bearer-like secret: it is not included in event logs. `files.downloadFromLink` intentionally sends no API-key Authorization header.

Because the endpoint returns base64 inside JSON, downloads are limited to 10 MiB of raw bytes to bound memory use during reading, encoding, and JSON serialization. For larger files, create a temporary download link and have the consumer `GET https://api.conversiontools.io/v1/files/{download_id}/download` directly without an Authorization header.

File uploads and downloads use a five-minute timeout by default, matching the Conversion Tools Node client. Configure `transferTimeoutMs` when constructing the plugin to use a value from 20 seconds to 10 minutes:

```ts
conversiontools({ transferTimeoutMs: 600_000 })
```

## Webhooks

No inbound webhooks are handled by this plugin.

## References

- [Complete API reference](https://conversiontools.io/llms-full.txt)
- [OpenAPI 3 specification](https://api.conversiontools.io/openapi.yaml)
- [Human API documentation](https://conversiontools.io/api-documentation)
