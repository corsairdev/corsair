# @corsair-dev/fibery

Fibery workspace HTTP API integration for Corsair.

## Install and configure

```bash
pnpm add @corsair-dev/fibery
```

Configure the workspace origin and connect an API token or OAuth access token:

```ts
import { fibery } from '@corsair-dev/fibery';

const plugin = fibery({ workspaceUrl: 'https://your-workspace.fibery.io' });
```

Static API tokens are sent as `Authorization: Token …`; OAuth access tokens use `Authorization: Bearer …`. For OAuth, register an application in the target workspace and configure its client ID, secret, and redirect URI with Corsair; Fibery's documented scopes are `openid` and `offline`, and its token endpoint uses HTTP Basic client authentication. The registered app only authorizes users in that workspace. Corsair refreshes expired OAuth access tokens through Fibery's documented token endpoint. Fibery documents a limit of 3 requests per second per token and 7 per second per workspace. The plugin does not automatically retry writes; inspect `Retry-After` when provided before retrying.

## Supported API areas

31 operations cover schema and field management, entity queries and writes, collection updates, collaborative documents, file upload/download/signed URLs, JSON-RPC views, and paginated history search. Dynamic entity fields are validated as JSON because their concrete shape is defined by each workspace's schema. Entity query pagination should follow Fibery's `fibery/id` cursor pattern; history uses `nextPage.sinceItem` and `nextPage.hasNext`.

Webhooks and webhook administration are excluded. API token list/create/delete endpoints are excluded because they manage user credentials and their response contract is not fully described. URL-based file import is excluded because Fibery fetches caller-provided URLs server-side. Formula-field creation and document-view content operations are undocumented by Fibery and are not implemented. The FAQ's capability-source command is not exposed because its response contract is not documented. Comment workflows can be composed using the documented entity, collection, and document operations.

## Official documentation

- [HTTP API overview and command envelope](https://developers.fibery.com/guides/http-api/overview.md)
- [Authentication, OAuth, and request limits](https://developers.fibery.com/guides/getting-started/authentication.md)
- [Schema](https://developers.fibery.com/guides/http-api/schema.md), [databases](https://developers.fibery.com/guides/http-api/databases.md), and [fields](https://developers.fibery.com/guides/http-api/fields.md)
- [Query entities](https://developers.fibery.com/guides/http-api/query-entities.md), [pagination](https://developers.fibery.com/guides/http-api/pagination.md), [create/update/delete](https://developers.fibery.com/guides/http-api/create-update-entities.md), [collections](https://developers.fibery.com/guides/http-api/collections.md), and [upsert](https://developers.fibery.com/guides/http-api/upsert-entities.md)
- [Rich text and comments](https://developers.fibery.com/guides/http-api/rich-text-and-comments.md), [files](https://developers.fibery.com/guides/http-api/files.md), [views](https://developers.fibery.com/guides/http-api/views.md), and [history](https://developers.fibery.com/guides/http-api/history.md)

See the [generated plugin reference](https://docs.corsair.dev/plugins/fibery) for operation schemas and call shapes.

## Tests

Run `pnpm --dir packages/fibery test`. The live, read-only schema smoke test is env-gated and requires `FIBERY_WORKSPACE_URL` and `FIBERY_API_KEY`; run it with `pnpm --dir packages/fibery test:live`.
