# E2B plugin for Corsair

Manage E2B isolated sandboxes and their templates, snapshots, tags, volumes,
secrets, metrics, and events. The plugin also exposes unary sandbox envd,
filesystem, and process operations. The route and request/response schemas are
based on E2B's official [public OpenAPI specification](https://docs.e2b.dev/openapi-public.yaml).

## Install and configure

```bash
pnpm add @corsair-dev/e2b
```

Configure an E2B project API key from the [E2B console](https://console.e2b.dev/?tab=keys):

```ts
import { e2b } from '@corsair-dev/e2b';

const plugin = e2b({ key: process.env.E2B_API_KEY });
```

Platform requests use `X-API-Key`. Sandbox health checks are keyless; other
envd, filesystem, and process operations use the sandbox's `X-Access-Token` and
the required `E2b-Sandbox-Id` and `E2b-Sandbox-Port` headers. The port is
typically `49983`. Sandbox-access tokens are operation inputs, not the project
API key.

## API coverage

The plugin registers **62 request/response operations**:

| Group | Operations | Official reference |
| --- | ---: | --- |
| Sandboxes | 15 | [Sandbox API](https://docs.e2b.dev/api-reference/sandboxes/list-sandboxes-v2.md) |
| Templates | 11 | [Template API](https://docs.e2b.dev/api-reference/templates/list-templates-v2.md) |
| Tags | 7 | [Template tags](https://docs.e2b.dev/api-reference/tags/list-template-tags.md) |
| Volumes | 4 | [Volumes](https://docs.e2b.dev/api-reference/volumes/list-team-volumes.md) |
| envd | 3 | [envd health](https://docs.e2b.dev/api-reference/envd/check-the-health-of-the-service.md), [metrics](https://docs.e2b.dev/api-reference/envd/service-stats.md), [environment variables](https://docs.e2b.dev/api-reference/envd/environment-variables.md) |
| Filesystem | 8 | [Filesystem RPC reference](https://docs.e2b.dev/api-reference/filesystem/listdir.md) |
| Process | 5 | [Process RPC reference](https://docs.e2b.dev/api-reference/process/list.md) |
| Team metrics | 2 | [Public OpenAPI specification](https://docs.e2b.dev/openapi-public.yaml) |
| Secrets | 5 | [Secrets API](https://docs.e2b.dev/api-reference/secrets/list-secrets.md) |
| Events | 2 | [Events API](https://docs.e2b.dev/api-reference/events/list-events.md) |

Each operation has strict Zod input validation, an OpenAPI-derived response
schema, and a declared risk level. List operations preserve E2B's documented
pagination inputs: v2 sandboxes/templates, snapshots, and secrets use next
tokens, tag assignments use cursors, and sandbox events use offset/limit. The transport
extracts `Retry-After`; 429 retries are handled once by the plugin, while other
errors and writes are not automatically retried. Secret request values are
redacted from propagated API errors and are never included in event logs.

The four `X-Next-Token` collection-list operations return `{ items, nextToken? }`
so the cursor can be forwarded as `query.nextToken`. `templates.get` returns the
template/build data with its `nextToken`. Sandbox listing may also include
`totalRunning` from E2B's `X-Total-Running` header.

Template build upload-link responses contain a capability URL and headers;
handle them as sensitive values and do not log them. Environment-variable
results and sandbox access tokens are likewise sensitive.

## Documented exclusions

- E2B's seven webhook-management operations are omitted per Corsair's
  no-webhooks rule: create/list/get/update/delete webhooks, list deliveries,
  and get delivery statistics.
- Streaming Connect RPCs do not fit the single request/response contract and
  are omitted: `POST /filesystem.Filesystem/WatchDir`,
  `POST /process.Process/Connect`, `POST /process.Process/Start`, and
  `POST /process.Process/StreamInput`. Their unary filesystem/process
  counterparts are included.
- `GET /files` (binary download) and `POST /files` (raw file upload) are omitted
  because Corsair's JSON transport does not preserve binary bodies/responses.
- Deprecated routes with documented replacements are not duplicated:
  `GET/POST /sandboxes`, `GET /sandboxes/{sandboxID}/logs`,
  `POST /sandboxes/{sandboxID}/resume`,
  `POST /sandboxes/{sandboxID}/connect`, `GET /templates`, and
  `PATCH /templates/{templateID}`. Their current v2 equivalents are included
  where E2B documents them.

The endpoint inventory and field constraints follow the official
[OpenAPI specification](https://docs.e2b.dev/openapi-public.yaml), with
route pages linked above.
