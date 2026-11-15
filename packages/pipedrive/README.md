# @corsair-dev/pipedrive

Pipedrive API v2 deals plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/pipedrive
```

## Authentication

Configure an API token or OAuth 2.0 access token. Pipedrive accepts API tokens in the `x-api-token` header and OAuth access tokens as Bearer authorization. OAuth reads need the `deals:read` or `deals:full` scope; writes need `deals:full`.

## Implemented operations

| Operation | Method and path | Risk / token cost | OAuth scopes | Official reference |
| --- | --- | --- | --- | --- |
| `deals.list` | `GET /api/v2/deals` | Read · 10 tokens | `deals:read` or `deals:full` | [Get all deals](https://developers.pipedrive.com/docs/api/v1/Deals#getDeals) |
| `deals.get` | `GET /api/v2/deals/{id}` | Read · 1 token | `deals:read` or `deals:full` | [Get deal](https://developers.pipedrive.com/docs/api/v1/Deals#getDeal) |
| `deals.create` | `POST /api/v2/deals` | Write · 5 tokens | `deals:full` | [Add deal](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal) |
| `deals.update` | `PATCH /api/v2/deals/{id}` | Write · 5 tokens | `deals:full` | [Update deal](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal) |
| `deals.delete` | `DELETE /api/v2/deals/{id}` | Destructive · 3 tokens | `deals:full` | [Delete deal](https://developers.pipedrive.com/docs/api/v1/Deals#deleteDeal) |

The list endpoint supports the documented filters, comma-separated array parameters, a maximum page size of 500, and opaque cursor pagination through `additional_data.next_cursor`.

Pipedrive also applies daily token budgets and per-token burst limits. The client captures `x-ratelimit-reset`; only a 429 with that documented burst reset is retried once. A 429 without a reset is not retried because daily token-budget exhaustion remains blocked until reset. See [Pipedrive rate limiting](https://pipedrive.readme.io/docs/core-api-concepts-rate-limiting).

## Scope and limitations

This contribution is an initial slice, not complete API coverage. The official references publish 213 v1 operations and 158 v2 operations. Only the five v2 deal operations above are currently implemented. Webhooks are intentionally excluded. OAuth authorization/token exchange/refresh routes are handled by Corsair's OAuth lifecycle rather than exposed as business endpoints. Other documented operations, including multipart uploads, remain unimplemented in this initial slice.

Official references: [Pipedrive API v1](https://developers.pipedrive.com/docs/api/v1/openapi.yaml), [Pipedrive API v2](https://developers.pipedrive.com/docs/api/v1/openapi-v2.yaml).

## License

Apache-2.0
