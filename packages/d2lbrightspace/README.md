# @corsair-dev/d2lbrightspace

Corsair integration for the D2L Brightspace REST API.

> **Coverage status:** the D2L routing table currently lists 876 method/path pairs. This package registers 874 route wrappers and explicitly excludes two legacy browser-auth redirect routes. Forty-seven API-version, binary-output, and user-identity operations have operation-specific Zod schemas; 24 multipart/form/resumable-upload routes have transport support. Eight hundred JSON resource schemas remain generic, and three form routes with incomplete field details are pending. See [ROUTE_COVERAGE.md](./ROUTE_COVERAGE.md) before relying on an operation.

## Authentication

### OAuth 2 (default, recommended)

D2L documents OAuth 2 Authorization Code Grant for user-context access. Register the application in Brightspace Manage Extensibility as an Authorization grant app, configure the exact Corsair redirect URI, enable refresh tokens if long-lived access is needed, and request the API scopes documented by D2L. Corsair sends the saved access token as `Authorization: Bearer …` and uses D2L's documented authorization and token endpoints. The Client Credentials + JWT assertion flow is not implemented by this plugin.

Set the tenant's `brightspace_url` account field to its HTTPS origin, for example `https://school.brightspace.com`. A single-tenant integration may instead use the `baseUrl` plugin option. URLs with paths, credentials, query strings, or fragments are rejected.

Official references: [D2L OAuth 2](https://docs.valence.desire2learn.com/basic/oauth2.html), [getting started](https://docs.valence.desire2learn.com/basic/firstlist.html).

### Legacy ID-Key (`api_key`, deprecated by D2L)

D2L still documents the legacy ID-Key authentication system but marks it deprecated and recommends OAuth 2. In this plugin, Corsair's `api_key` auth type is used **only** for that separate ID-Key scheme: the base `api_key` credential stores the D2L Application Key; the account fields store `application_id`, `user_id`, `user_key`, and `brightspace_url`. Requests are signed with HMAC-SHA256 and send only D2L's `x_a`–`x_d` and `x_t` query parameters; the raw keys are never sent or logged.

The legacy user ID/key must first be obtained through D2L's browser-based ID-Key authorization sequence. Corsair's generic OAuth callback does not implement that legacy redirect/callback lifecycle, so obtain the token pair using the documented flow and configure it through Corsair's encrypted credential store. The two `/d2l/auth/api/token` and `/d2l/auth/api/cancel` actions are excluded from the operation set because they are interactive auth redirects, not ordinary resource request/response operations.

Official references: [legacy authentication](https://docs.valence.desire2learn.com/basic/legacyauth.html), [API property/auth actions](https://docs.valence.desire2learn.com/res/apiprop.html).

## Route calls and limitations

Operations are grouped by D2L product area. JSON routes accept a route envelope:

```ts
{
  pathParams: { /* names from the linked D2L route */ },
  query: { /* documented query names, when present */ },
  body: { /* JSON value when the route documents JSON parameters */ }
}
```

Path and query envelopes reject undocumented keys. Route-specific JSON composite schemas are still incomplete for most operations; generic JSON body/output validation is **not a substitute** for the linked D2L resource schema. Binary downloads, multipart/form uploads, and resumable uploads have dedicated transports and limits; routes whose form fields remain unclear are explicitly marked pending in the route ledger.

D2L uses more than one pagination convention, including `bookmark` with `PagingInfo`/`Items` and `Next` URLs in object-list pages. The route wrappers forward the provider's documented query parameters; automatic page traversal is not added. Brightspace applies token-bucket rate limits and returns `Retry-After`; the transport does not retry automatically, and the handler preserves the retry delay. Request timeout defaults to 20 seconds and can be set up to 60 seconds. Documented binary downloads are returned as `{ kind: 'binary', contentType, base64, sizeBytes }`, capped at 25 MiB, and same-origin redirects are followed without forwarding credentials cross-origin. Documented simple and resumable uploads are capped at 25 MiB and exposed through base64 file inputs; three form routes with incomplete field details remain pending.

The plugin has no inbound webhooks. Full endpoint paths, scopes, documented params, source URLs, and per-route status are recorded in [ROUTE_COVERAGE.md](./ROUTE_COVERAGE.md) and [route-inventory.json](./route-inventory.json).

Official references: [routing table](https://docs.valence.desire2learn.com/http-routingtable.html), [API calling conventions, rate limits, and paging](https://docs.valence.desire2learn.com/basic/apicall.html), [API versions](https://docs.valence.desire2learn.com/basic/version.html), [file upload protocol](https://docs.valence.desire2learn.com/basic/fileupload.html).

## Development

```bash
pnpm --dir packages/d2lbrightspace test
pnpm --dir packages/d2lbrightspace typecheck
```

The read-only live smoke test uses `D2LBRIGHTSPACE_BASE_URL` and `D2LBRIGHTSPACE_OAUTH_ACCESS_TOKEN`:

```bash
pnpm --dir packages/d2lbrightspace test:live
```
