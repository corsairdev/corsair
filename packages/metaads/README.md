# @corsair-dev/metaads

Meta Marketing API v27.0 integration for Corsair. The package uses Meta's Graph API directly; it is not the LurkAPI integration. Every operation validates input and output with Zod.

## Install and authenticate

```bash
pnpm add @corsair-dev/metaads
```

Store a Meta user or system-user access token as the tenant OAuth access token. Meta requires `access_token` on every Marketing API call. Use `ads_read` for account/report reads and `ads_management` for campaigns, ad sets, ads, creatives, and audiences. The token must have access to the target ad account; Meta app review/access tiers may also be required. Do not pass an app secret as the access token.

The API version is fixed to `v27.0`. Meta versions Marketing API endpoints and deprecates old versions on a rolling schedule; upgrade the plugin as Meta releases new API versions.

## Endpoint matrix

| Operation | Method and route | Risk | Behavior |
| --- | --- | --- | --- |
| `accounts.list` | `GET /v27.0/me/adaccounts` | read | Cursor-paginated ad accounts |
| `accounts.get` | `GET /v27.0/act_{account_id}` | read | One account |
| `campaigns.list` | `GET /v27.0/act_{account_id}/campaigns` | read | Cursor-paginated campaigns |
| `campaigns.get` | `GET /v27.0/{campaign_id}` | read | One campaign |
| `campaigns.create` | `POST /v27.0/act_{account_id}/campaigns` | destructive | Creates with `name`, `objective`, required `special_ad_categories`, and paused-by-default status; optional budget |
| `campaigns.update` | `POST /v27.0/{campaign_id}` | destructive | Name/status/budget/spend-cap changes |
| `campaigns.delete` | `DELETE /v27.0/{campaign_id}` | destructive | Deletes campaign |
| `adSets.list` | `GET /v27.0/act_{account_id}/adsets` | read | Cursor-paginated ad sets |
| `adSets.get` | `GET /v27.0/{adset_id}` | read | One ad set |
| `adSets.create` | `POST /v27.0/act_{account_id}/adsets` | destructive | Campaign, goal, billing event, targeting required; status defaults paused |
| `adSets.update` | `POST /v27.0/{adset_id}` | destructive | Name/status/budget/end-time changes |
| `adSets.delete` | `DELETE /v27.0/{adset_id}` | destructive | Deletes ad set |
| `ads.list` | `GET /v27.0/act_{account_id}/ads` | read | Cursor-paginated ads |
| `ads.get` | `GET /v27.0/{ad_id}` | read | One ad |
| `ads.create` | `POST /v27.0/act_{account_id}/ads` | destructive | Creates from an existing ad set and creative; paused by default |
| `ads.update` | `POST /v27.0/{ad_id}` | destructive | Name/status changes |
| `ads.delete` | `DELETE /v27.0/{ad_id}` | destructive | Deletes ad |
| `creatives.list` | `GET /v27.0/act_{account_id}/adcreatives` | read | Cursor-paginated creatives |
| `creatives.get` | `GET /v27.0/{creative_id}` | read | One creative |
| `creatives.create` | `POST /v27.0/act_{account_id}/adcreatives` | destructive | Creates from existing Page post |
| `creatives.update` | `POST /v27.0/{creative_id}` | destructive | Name change |
| `creatives.delete` | `DELETE /v27.0/{creative_id}` | destructive | Deletes creative |
| `audiences.list` | `GET /v27.0/act_{account_id}/customaudiences` | read | Cursor-paginated custom audiences |
| `audiences.get` | `GET /v27.0/{custom_audience_id}` | read | One custom audience |
| `audiences.create` | `POST /v27.0/act_{account_id}/customaudiences` | destructive | Creates an empty `CUSTOM` audience |
| `audiences.update` | `POST /v27.0/{custom_audience_id}` | destructive | Name/description metadata |
| `audiences.delete` | `DELETE /v27.0/{custom_audience_id}` | destructive | Permanent; ads using the audience stop and cannot be restarted |
| `insights.list` | `GET /v27.0/act_{account_id}/insights` | read | Metrics and date range; level can be account/campaign/ad set/ad; cursor-paginated |

List methods accept `fields`, `limit`, `after`, and `before` where applicable. Meta returns cursor values in `paging.cursors`; pass `after` to continue. The adapter does not follow Meta's `paging.next` URL, which may contain a credential. Meta documents up to 25 ad accounts per person and a 50,000-creative listing ceiling (pagination beyond that is unavailable). Insights fields are restricted to documented metrics in the input schema; use `datePreset` or paired `since`/`until`, not both. Insights date ranges are limited to 37 months by Meta.

Single-object GET responses are Graph nodes with an `id`; list responses use `{ data, paging }`. Create responses expose the new `id` (some validation-only modes can instead return `success`), while update and delete responses expose `success`. Graph errors use an `{ error: { message, type, code, error_subcode, is_transient, ... } }` envelope; the core `ApiError` is preserved, including HTTP status and a supplied `Retry-After`. Throttle matching also recognizes Meta's documented Graph error codes (`4`, `17`, `613`, `80000`, `80003`, `80004`, `80014`); auth/permission matching recognizes `10`, `190`, `200`, and `294`. Error descriptions are not used for matching because Meta may change them.

## Safety and rate limits

Every create/update/delete is marked `destructive`. Meta's rate limits are tier- and operation-dependent: reads score one point and writes score three points against the documented account-level quota; the development-tier quota is 60 points with a 300-second decay, while Full access has a 9,000-point quota with a 300-second decay. Campaign/ad-set/ad mutations additionally have a 100 requests/second per app/account cap. Ad-set daily/lifetime budget edits are limited to four changes per hour per ad set. Custom-audience calls use a distinct quota family (including error 80003); Insights is app-level throttled (error 4, subcodes 1504022/1504039). See Meta's current access-tier and quota settings rather than assuming a universal fixed request quota. The official rate-limit guide does not promise a `Retry-After` value for every throttle; Corsair preserves a supplied header but the adapter performs no automatic retries. This avoids replaying consequential writes or retrying exhausted quotas.

Meta documents `X-Client-Idempotent-Key` for campaign, ad-set, ad, and creative creates. Those create methods accept `idempotencyKey`, validate Meta's 1–128 character format, and send the documented header. A key is scoped to the ad account, applies across those supported endpoints, and expires after seven days; only reuse it for an identical request. Updates, deletes, custom-audience creates, batches, and asynchronous requests do not support this key.

Budget amounts are integers in the ad account currency's smallest unit (such as cents for USD). Creating or enabling ads may result in actual delivery and spend after review. Campaign/ad-set budgets and account spending caps are additionally rate-limited by Meta. The reviewed operation references do not specify per-call API credit charges; any API-credit billing is unverified and is not represented as a plugin cost.

Meta requires acceptance of Custom Audience Terms of Service before audience use; this package does not accept terms on a tenant's behalf. Meta documents a maximum of 500 custom audiences. For ad sets targeting EU/EEA/associated DSA regions, Meta requires beneficiary and payer information; configure the account defaults in Meta or use another supported workflow because those fields are deliberately excluded here.

## Explicit exclusions

- Account creation, account spending-limit/funding changes, payment methods, and business-user/permission administration: financial or business-administration effects outside the bounded ad-object surface.
- Campaign/ad-set/ad batch and asynchronous job APIs, copies, previews, recommendations, reporting exports, and webhooks: separate workflows/contracts not exposed by these synchronous typed operations.
- Complex ad-set targeting beyond the typed JSON object container (including direct EU DSA beneficiary/payer inputs); complex creative specifications, image/video uploads, dynamic/asset-feed creative creation, and ad creation from inline creative specs. This plugin exposes existing creative IDs and existing Page-post creative creation only.
- Custom audience member/file uploads, removals, partner sharing, sessions, health, lookalike/saved/product audiences, and audience terms acceptance. These require additional sensitive personal-data, upload, or workflow contracts. Audience creation here makes a blank custom-audience object only.
- Insights async reports, breakdowns, filtering, attribution settings, and custom metric fields. Use synchronous documented metrics only.
- Other Meta products and APIs (Conversions API, Pixel/events, Catalog, Pages, Business Manager, Instagram Graph API) and all webhook delivery.

## Official sources

- [Marketing API overview](https://developers.facebook.com/docs/marketing-apis/)
- [Versioning](https://developers.facebook.com/docs/marketing-api/overview/versioning)
- [Authentication](https://developers.facebook.com/docs/marketing-api/get-started/authentication)
- [Authorization and permissions](https://developers.facebook.com/docs/marketing-api/get-started/authorization)
- [Rate limiting](https://developers.facebook.com/docs/marketing-api/overview/rate-limiting)
- [Idempotent requests](https://developers.facebook.com/documentation/ads-commerce/marketing-api/idempotent-requests)
- [Marketing API error codes and error envelope](https://developers.facebook.com/documentation/ads-commerce/marketing-api/error-reference)
- [Graph API cursor pagination](https://developers.facebook.com/docs/graph-api/using-graph-api#paging)
- [Ad account](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account)
- [Campaigns edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/campaigns) and [campaign object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group)
- [Ad set](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign)
- [Ad](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/adgroup)
- [Ad creative](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-creative)
- [Custom audience](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience)
- [Insights overview](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights)

## Webhooks

No webhooks are exposed.

## License

Apache-2.0
