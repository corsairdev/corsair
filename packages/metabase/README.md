# @corsair-dev/metabase

Metabase plugin for Corsair covering the documented collection and collection-permissions REST API routes.

## Install and configure

```bash
pnpm add @corsair-dev/metabase
```

Configure the URL of the Metabase instance when creating the plugin. Store the API key as a Corsair tenant key:

```ts
import { metabase } from '@corsair-dev/metabase';

const plugin = metabase({ baseUrl: 'https://metabase.yourcompany.com' });
```

`baseUrl` must be an HTTPS origin without a path, query, fragment, or URL credentials. HTTP is allowed only for
`localhost`, `127.0.0.1`, or `::1` during development. The URL is plugin configuration, not an endpoint argument. The
transport uses fixed `/api/...` paths, does not follow redirects, omits cookies, and never places the API key in the
URL. Metabase API keys use `X-API-Key` and inherit permissions from the group assigned to the key.

## Implemented operations

All routes below are from Metabase's official OpenAPI reference. The REST API is unversioned; the current latest docs
are for Metabase 65, and route availability depends on the installed instance.

| Operation | Method and path | Risk | Official contract |
| --- | --- | --- | --- |
| `collections.list` | `GET /api/collection` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.create` | `POST /api/collection` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.get` | `GET /api/collection/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.update` | `PUT /api/collection/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.delete` | `DELETE /api/collection/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.tree` | `GET /api/collection/tree` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.get` | `GET /api/collection/root` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.items.list` | `GET /api/collection/root/items` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.items.metadata` | `GET /api/collection/root/items/metadata` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.candidates.list` | `GET /api/collection/root/dashboard-question-candidates` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.candidates.move` | `POST /api/collection/root/move-dashboard-question-candidates` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.trash.get` | `GET /api/collection/trash` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.items.list` | `GET /api/collection/{id}/items` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.items.metadata` | `GET /api/collection/{id}/items/metadata` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.candidates.list` | `GET /api/collection/{id}/dashboard-question-candidates` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.candidates.move` | `POST /api/collection/{id}/move-dashboard-question-candidates` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collectionPermissions.graph.get` | `GET /api/collection/graph` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collectionPermissions.graph.update` | `PUT /api/collection/graph` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |

Collection item rows are heterogeneous. Metabase's OpenAPI schema intentionally leaves their item fields open; the
plugin validates JSON-compatible object values without claiming a fixed model. The tree response is recursive, and
the docs describe `here`/`below` fields without defining their schemas, so additional JSON response keys are retained.
Collection-items responses may include `limit` and `offset`, but the documented item-list routes do not define request
parameters for them. The plugin does not invent pagination inputs.

Deleting a collection permanently removes it. Updating the collection permission graph can overwrite supplied entries;
`force=true` skips the revision check and can overwrite concurrent updates. Both operations are marked destructive.
Only 429 responses are retried by the transport (up to three retries, honoring `Retry-After`, capped at 60 seconds).
Errors preserve status/retry metadata but discard provider bodies and caller request data so names, query text, and API
keys are not echoed through rejected requests. Event logs contain no request or response fields.

## Explicit exclusions

- Webhook receiver support: not requested, so `webhooks` is empty.
- Query execution (`/api/dataset`, `/api/dataset/native`), saved-card and dashboard execution, and SQL/MBQL operations:
  query bodies and result rows are dynamic, can contain sensitive data, and can execute against databases with
  instance-specific permissions. They are not represented by this collection-only plugin surface.
- CSV/PDF/binary exports and multipart uploads: the collection API subset has no such routes. Other Metabase routes
  with binary or multipart behavior are not exposed.
- Other API families (including databases, cards, dashboards, users, permissions outside the collection graph,
  notifications, admin settings, transforms, and enterprise-only routes): excluded from this version. Metabase's
  unversioned API and installed-edition differences require route-specific contract and risk verification before
  exposing them.
- In the current OpenAPI document, many operations have no declared success-response schema. This plugin does not
  invent response shapes for those routes.

The official reference is [Metabase's REST API OpenAPI document](https://www.metabase.com/docs/latest/api.json).
Authentication setup and group permissions are documented in [API keys](https://www.metabase.com/docs/latest/people-and-groups/api-keys).

## Tests

Run the offline suite with `pnpm --dir packages/metabase test`. The live smoke test is excluded from that command and
performs one read-only collection request when `METABASE_BASE_URL` and `METABASE_API_KEY` are set:

```bash
METABASE_BASE_URL=https://metabase.yourcompany.com METABASE_API_KEY=... pnpm --dir packages/metabase test:live
```

The live test has not been run as part of this implementation.

## License

Apache-2.0
