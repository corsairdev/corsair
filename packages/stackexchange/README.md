# @corsair-dev/stackexchange

Stack Exchange API v2.3 integration for Corsair, with per-site and network method catalogs.

## Install and configure

```bash
pnpm add @corsair-dev/stackexchange
```

The API accepts an application API key or an OAuth access token in the `Authorization: Bearer …` header. The default auth type is `api_key`; choose `oauth_2` for user-context methods. Public reads can run without a key, at the lower shared-IP quota. Supply an API key through Corsair's key manager or the plugin's `key` option. The Corsair OAuth flow uses Stack Exchange's authorization-code and JSON token endpoint; the registered application must allow the redirect URI Corsair uses. To enable the complete catalog, the OAuth consent requests `read_inbox`, `write_access`, and `private_info` together. This is intentionally disclosed broad access; do not connect an account unless the user approves those capabilities. Stack Exchange does not issue refresh tokens for expiring grants, so expired connections need to be authorized again. `no_expiry` is not requested because Stack Exchange strongly discourages it. See the [API overview](https://api.stackexchange.com/docs), [authentication and scopes](https://api.stackexchange.com/docs/authentication), and [write access requirements](https://api.stackexchange.com/docs/write).

Credentials are supplied by Corsair's key manager as Bearer authorization. The input schema rejects `key`, `access_token`, and `callback` query parameters, so credentials cannot be placed in generated request URLs and JSONP is not exposed. The shared core's `ApiError` also redacts normalized `key` and `access_token` query names if a caller uses the core transport directly.

## Operations and endpoint ledger

| Corsair operation | Provider methods | HTTP | Site argument | Risk | Authentication |
| --- | --- | --- | --- | --- | --- |
| `site.read` | All entries in `SITE_READ_ROUTES` | GET | Required | Read | Public/API key; some methods require user OAuth |
| `site.write` | All entries in `SITE_WRITE_ROUTES` | POST | Required | Destructive approval | OAuth `write_access` for writes; method-specific auth otherwise |
| `network.read` | All entries in `NETWORK_READ_ROUTES` | GET; `filters/create` also accepts POST | Not accepted | Read | Public/API key; some methods require user OAuth/scopes |

`endpoints/routes.ts` is the route ledger: each method entry records its exact path template, HTTP method (from its group), per-site/network mode, authentication scope, operation risk and official method documentation URL. Route IDs match the API docs slugs. The official per-method page is authoritative for required and optional arguments, method-specific enum values, filter-selected fields and response item types. Common input parameters include `page` (1-based), `pagesize` (0–100, default 30), `fromdate`, `todate`, `min`, `max`, `order` (`asc`/`desc`), `sort` and `filter`. The API caps anonymous page numbers at 25 and `{ids}` vectors at 100. Vector values are semicolon-delimited. Site methods send `site`; network methods omit it.

Responses use the strict common wrapper from the [wrapper reference](https://api.stackexchange.com/docs/wrapper), including `items`, `has_more`, `page`, `page_size`, quota fields, and optional `backoff`. Item field shapes vary by method and selected filter, so items are represented as JSON objects and validated as JSON values rather than asserted to one false universal item type. Follow `has_more` for pagination and wait the returned `backoff` interval before repeating the same method. Do not make semantically identical requests more than once a minute. Stack Exchange reports method errors in the wrapper's `error_name`/`error_message`, commonly with HTTP 400, so the error handlers match the documented names (including `throttle_violation`) instead of assuming status alone identifies the error. API details are documented in [error handling](https://api.stackexchange.com/docs/error-handling), [paging](https://api.stackexchange.com/docs/paging), and [throttling](https://api.stackexchange.com/docs/throttle).

The input object itself is strict, route IDs are allow-listed, path parameters must exactly match route tokens, parameter names use the documented shared vocabulary, paging bounds and `order` are validated, and credential/JSONP fields are rejected. Because the provider publishes a different parameter set and sort enum for each route, this shared dispatcher does not encode every route's required arguments or route-specific enum as an individual TypeScript schema. Callers must follow the linked method page. This is a package limitation, not an API exclusion.

## Supported and excluded API methods

The route catalog contains the per-site and network REST methods listed on the v2.3 overview, including the `/me` aliases. The only omitted methods are:

- `access-tokens/{accessTokens}` and `access-tokens/{accessTokens}/invalidate`, and `apps/{accessTokens}/de-authenticate`: these place bearer credentials in a path segment. Corsair's shared transport includes request URLs in error context, so exposing credential-bearing path parameters would risk leaking tokens. Use the provider's official token-management flow outside this plugin.
- OAuth authorization, callback and access-token exchange are handled by Corsair's OAuth flow, not exposed as Stack Exchange API content operations.
- JSONP callbacks: responses are JSON and callback execution is not supported.
- Webhook receiving: the Stack Exchange API documentation does not define a webhook contract for this integration; `webhooks` is empty.

The API's dynamic `backoff` requirement is returned to the caller but is not enforced across concurrent calls by the stateless Corsair transport. Applications must coordinate waits for the same method. The API's default daily quotas (10,000 requests), per-IP 30 requests/second concurrent-request throttle, and token-specific quota behavior are provider policy and may change; see the [throttle docs](https://api.stackexchange.com/docs/throttle).

## Compression

Stack Exchange documents gzip/deflate response compression and requests clients send `Accept-Encoding`. Corsair core uses the platform `fetch` implementation and parses the response with `response.json()`; this plugin requests `gzip, deflate` and relies on standard Fetch transparent decompression. The core does not implement a separate decompressor or a fallback for non-conforming custom Fetch implementations. See the provider's [compression guidance](https://api.stackexchange.com/docs/compression).

## Testing

`pnpm --dir packages/stackexchange test` runs deterministic request/schema/error tests. `STACKEXCHANGE_API_KEY=<key> pnpm --dir packages/stackexchange test:live` runs a read-only public `/info` smoke test; it is excluded from the default test command and skips with a warning when no key is set.

## License

Apache-2.0
