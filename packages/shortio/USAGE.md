# Short.io integration

The plugin exposes 13 operations: list, get, expand, create, update, delete,
archive, and unarchive links; bulk archive, unarchive, and delete; and list
and get domains. See the [official reference](https://developers.short.io/).

Use a secret API key scoped to the relevant Short.io team or domain. A key
provided at registration takes precedence over saved tenant keys and is shared
by all tenants, so use it only when they should access the same account:

```ts
import { shortio } from '@corsair-dev/shortio';

const plugin = shortio({ key: process.env.SHORTIO_API_KEY });
// Register plugin in createCorsair({ plugins: [plugin] }).
```

For separate tenant accounts, omit the registration-level key and save each
tenant's key with `tenant.shortio.keys.set_api_key(key)` instead.

The key is sent as the `Authorization` header without a `Bearer` prefix. Link
lists require `domain_id` and accept `pageToken`; pass the returned
`nextPageToken` to fetch the next page. Domain lists use `limit` and `offset`.
Link updates accept `{ linkId, domain_id?, body? }` so the optional query value
is separate from the JSON body. Bulk operations accept at most 150 IDs.

Rate limits are propagated with numeric `Retry-After` values in milliseconds;
HTTP-date `Retry-After` values are not parsed by the shared transport. By default,
requests are not automatically replayed; a custom Corsair error handler may
override that policy. The provider documents limits including 50/s for link
creation, 20/s for updating or deleting one link, and 1/s for bulk deletion.
No inbound webhooks are implemented. Domain settings, bulk creation, lookup by
original URL, statistics, QR, targeting, permissions, and folders are outside
this initial scope. The published success responses for bulk creation and
original-URL lookup do not specify schemas.
