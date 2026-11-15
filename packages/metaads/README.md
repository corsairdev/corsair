# @corsair-dev/metaads

Meta Marketing API v27.0 integration for Corsair. The package uses Meta's Graph API directly; it is not the LurkAPI integration. The 41 operations below are a verified, bounded surface, not universal Marketing API coverage. Every operation validates input and output with Zod.

## Install and authenticate

```bash
pnpm add @corsair-dev/metaads
```

Store a Meta user or system-user access token as the tenant OAuth access token. Meta requires `access_token` on every Marketing API call; this adapter sends it as a query/form parameter per Meta's examples. Use `ads_read` for reads and `ads_management` for management. The token must have access to the target ad account; Meta app review/access tiers may also be required. Do not pass an app secret as the access token.

The API version is fixed to `v27.0`. Meta versions Marketing API endpoints and deprecates old versions on a rolling schedule; upgrade the plugin as Meta releases new API versions.

## Verified endpoint inventory

### Ad accounts and ad objects

| Operation | Method and route | Risk | Official contract |
| --- | --- | --- | --- |
| `accounts.list` | `GET /v27.0/me/adaccounts` | read | Cursor-paginated ad accounts |
| `accounts.get` | `GET /v27.0/act_{account_id}` | read | One account |
| `accounts.usersList` | `GET /v27.0/act_{account_id}/users` | read | App-scoped users and their default `id`, `name`, and `tasks` fields |
| `campaigns.list` / `campaigns.get` | `GET /v27.0/act_{account_id}/campaigns`; `GET /v27.0/{campaign_id}` | read | Cursor list / single Graph node |
| `campaigns.create` / `update` / `delete` | `POST /v27.0/act_{account_id}/campaigns`; `POST` / `DELETE /v27.0/{campaign_id}` | destructive | Create requires `special_ad_categories`; campaign changes may affect delivery or spend |
| `adSets.list` / `get` | `GET /v27.0/act_{account_id}/adsets`; `GET /v27.0/{adset_id}` | read | Cursor list / single Graph node |
| `adSets.create` / `update` / `delete` | `POST /v27.0/act_{account_id}/adsets`; `POST` / `DELETE /v27.0/{adset_id}` | destructive | Typed targeting JSON; create defaults to `PAUSED` |
| `ads.list` / `get` | `GET /v27.0/act_{account_id}/ads`; `GET /v27.0/{ad_id}` | read | Cursor list / single Graph node |
| `ads.create` / `update` / `delete` | `POST /v27.0/act_{account_id}/ads`; `POST` / `DELETE /v27.0/{ad_id}` | destructive | Create references an existing ad set and either an existing creative ID or an inline creative with documented `object_story_spec`; create defaults to `PAUSED` |
| `creatives.list` / `get` | `GET /v27.0/act_{account_id}/adcreatives`; `GET /v27.0/{creative_id}` | read | Cursor list / single Graph node |
| `creatives.create` / `update` / `delete` | `POST /v27.0/act_{account_id}/adcreatives`; `POST` / `DELETE /v27.0/{creative_id}` | destructive | Create accepts an existing Page post ID or documented `object_story_spec` (`page_id` plus exactly one documented content type); includes the documented political authorization category; update is name-only |

Image-library routes: `images.list` is `GET /v27.0/act_{account_id}/adimages`, `images.upload` is `POST /v27.0/act_{account_id}/adimages` (Meta-documented base64 `bytes` or `copy_from`), and `images.delete` is `DELETE /v27.0/act_{account_id}/adimages` (hash required; only unused images can be deleted). `copy_from` also requires the token to read creatives from the source ad account. Uploads are non-idempotent and not retried; form data and echoed base64 values are removed from propagated core request errors. Sources: [ad-account image edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/adimages), [image object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-image).

Official references: [ad account](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account), [ad account users](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/users), [campaign edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/campaigns) and [campaign object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group), [ad-set object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign), [ad object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/adgroup), [creative object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-creative), [ad create reference](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/ads), [creative create reference](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/adcreatives).

### Custom audiences

| Operation | Method and route | Risk | Official contract |
| --- | --- | --- | --- |
| `audiences.list` / `get` | `GET /v27.0/act_{account_id}/customaudiences`; `GET /v27.0/{custom_audience_id}` | read | Cursor list / single Graph node |
| `audiences.create` | `POST /v27.0/act_{account_id}/customaudiences` | destructive | Creates a blank `CUSTOM` audience |
| `audiences.update` / `delete` | `POST` / `DELETE /v27.0/{custom_audience_id}` | destructive | Metadata update / permanent deletion; deletion stops ads using the audience and those ads cannot be restarted |
| `audiences.sessionsList` | `GET /v27.0/{custom_audience_id}/sessions` | read | Cursor-paginated upload-session status; optional `session_id` filter |
| `audiences.usersAdd` | `POST /v27.0/{custom_audience_id}/users` | destructive | Adds up to 10,000 single-key SHA-256 email or phone hashes; requires a caller-generated session ID, sequential batch number, and last-batch flag |
| `audiences.usersRemove` | `DELETE /v27.0/{custom_audience_id}/users` | destructive | Removes up to 10,000 single-key SHA-256 email or phone hashes using Meta's URL-encoded DELETE body |

Custom Audience Terms must already be accepted for the relevant business. Upload sessions must use a unique session ID per ad account and sequential batches; Meta documents a 90-minute session window, and membership updates usually take up to 24 hours. Only `EMAIL_SHA256` and `PHONE_SHA256` are accepted here. The adapter removes request form data from propagated core errors and strips `invalid_entry_samples` from successful results because Meta may echo submitted identifiers in those samples. References: [custom audience](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience), [customer-file audiences and member workflow](https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/guides/custom-audiences), [audience users](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience/users), [upload sessions](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience/sessions), [session object fields](https://developers.facebook.com/docs/marketing-api/reference/custom-audience-session).

### Insights

| Operation | Method and route | Risk | Official contract |
| --- | --- | --- | --- |
| `insights.list` | `GET /v27.0/act_{account_id}/insights` | read | Synchronous, cursor-paginated report; typed metric fields, levels, date range/preset, breakdowns, action breakdowns, filters, sorting, summary, time increments, product ID limit, and attribution windows |
| `insights.createAsync` | `POST /v27.0/act_{account_id}/insights` | write | Starts a separate report job; no idempotency key is supported |
| `insights.getAsyncReport` | `GET /v27.0/{report_run_id}` | read | Poll `async_status` and `async_percent_completion`; v25+ documents failure details |
| `insights.getAsyncResults` | `GET /v27.0/{report_run_id}/insights` | read | Cursor-paginated completed report results |
| `insights.listFeatures` | `GET /v27.0/act_{account_id}/insights/feature-settings/list-features` | read | Lists documented breakdown features |
| `insights.listEnabledFeatures` | `GET /v27.0/act_{account_id}/insights/feature-settings` | read | Lists enabled features and optional effective dates |
| `insights.enableFeature` | `POST /v27.0/act_{account_id}/insights/feature-settings` | destructive | Enables one documented feature; Meta provides no disable operation |

The metric and breakdown inputs are allow-listed, not the complete evolving Meta catalog. Supported breakdowns include age, gender, country, region, publisher/platform position, selected action and asset breakdowns, hourly breakdowns, and partnership-ad creator. Meta only supports certain combinations; the provider validates combinations and field compatibility. The adapter exposes `action_attribution_windows`; it does not expose `action_report_time` or the two `use_*_attribution_setting` switches because current official guidance describes changed/ignored behavior for those settings. Async report IDs expire after 30 days. Feature enablement can take about 24 hours to affect Insights data.

Ad-set `targeting` and creative `object_story_spec` use nested JSON values because Meta versions and extends these structures. The request schemas validate documented top-level fields/content unions; nested keys are passed through as JSON and remain subject to Meta's version-specific validation. This is intentional support for documented complex targeting and creative structures, not a claim that every possible nested field is supported. Political issue/election creatives need the documented `authorization_category`; the input accepts `POLITICAL` and v27's `POLITICAL_WITH_DIGITALLY_CREATED_MEDIA`. For v27 eligible Sales ad sets, Meta can enable cross-device expansion unless `targeting.targeting_automation.individual_setting.device` is set to `0`; EU-regulated targeting also needs beneficiary and payer information or account defaults. These constraints are server-side and must be considered before creating or activating an ad set.

References: [Insights overview](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights), [account Insights fields and parameters](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/insights), [breakdowns and supported combinations](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/breakdowns), [limits and asynchronous reporting](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/best-practices), [async and batch requests](https://developers.facebook.com/documentation/ads-commerce/marketing-api/asyncrequests).

## Response, pagination, rate limits, and write safety

Graph list responses use `{ data, paging }`; pass a returned `paging.cursors.after` or `before` value to continue. The adapter never follows `paging.next`, which may carry credentials. Single-object reads are Graph nodes. Create responses validate the documented ID/success variants; updates and deletes validate `{ success }`. Insights data is extensible, and responses validate known metrics while allowing provider-documented additional result fields.

Marketing API quotas depend on access tier, business/app, account activity, and endpoint family. Meta currently documents development-tier ad-account score 60 with 300-second decay and Full-access score 9,000 with 300-second decay; reads generally score one and writes three. Campaign/ad-set/ad create/edit also have a 100 requests/second per app/account cap, plus per-object concurrent-edit limits; ad-set daily/lifetime budget edits are limited to four per hour, account spend-limit edits to ten per day, and ad creation is additionally tied to account daily spend. Custom audiences and Insights have distinct quota families. Insights async and sync calls share app/account load limits. Check provider headers and current account/app tier; this plugin does not expose usage headers or automatically retry. It preserves any supplied `Retry-After`, but Meta does not promise that header for every throttle. Sources: [Marketing API rate limits](https://developers.facebook.com/documentation/ads-commerce/marketing-api/overview/rate-limiting), [Insights limits](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/best-practices).

All writes are not automatically retried. Campaign, ad-set, ad, and creative creates accept Meta's documented `X-Client-Idempotent-Key`, validated as 1–128 letters/digits/`_`/`-`; keys are exact, case-sensitive, shared across those endpoints within an ad account, and expire after seven days. Reuse a key only with an identical request. Updates, deletes, custom-audience mutations, and async report creation do not support idempotency keys. Sources: [idempotent requests](https://developers.facebook.com/documentation/ads-commerce/marketing-api/idempotent-requests), [v27.0 changes](https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog/version27.0).

Budget values are integer amounts in the account currency's smallest unit. Creating or enabling campaigns/ad sets/ads can lead to actual delivery and spend after review; setting an ad object `ACTIVE` can resume delivery. Campaign spend caps and ad-set budgets therefore use destructive risk. The referenced API docs do not specify per-call API-credit charges; no credit cost is claimed. Meta's v27 changelog also says eligible Sales ad sets can now default to delivery on other mobile devices when targeting lacks the new explicit setting; users needing strict device-only delivery must configure the documented targeting automation explicitly. This plugin's nested targeting JSON can carry that setting. For some new creatives, Meta may also automatically enable Product showcase when it finds a high-confidence catalog match; this plugin does not expose the changelog's `degrees_of_freedom_spec` opt-out, so review that v27 behavior before creating catalog-linked creatives.

## Exclusions and remaining gaps

The following are explicitly not claimed as covered:

- **Custom audience member formats beyond hashed email/phone:** raw identifiers, mobile advertising IDs, `EXTERN_ID`, multi-key matching, limited-data-use payloads, and customer-file replacement are not exposed. They need additional consent, hashing, schema alignment, session/lifecycle, and privacy handling. The supported add/remove calls use SHA-256 hashed inputs only; upload request bodies are omitted from propagated error metadata and success samples are stripped.
- **Business permission administration:** `GET /act_{id}/users` is implemented as a read-only list of app-scoped users/tasks. The documented ad-account users edge does not support create/update/delete, and Meta's authorization docs say Limited-tier apps cannot manage ad-account user permissions through Business Manager. Other Business Manager role/permission operations have separate access and business-administration effects; they are not represented as ad-account CRUD here. Sources: [ad account users edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/users), [authorization/access tiers](https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authorization).
- **Audience sharing/health/ads edges and terms acceptance:** distinct cross-account sharing, status, or legal-consent workflows; these are not needed to list/manage audience metadata and require their own contracts and access checks. See the [custom audience edge inventory](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience).
- **Video upload/list/delete:** Meta documents URL/chunked video uploads, library listing, and asset deletion routes. The edge docs include error `283` requiring one or more Pages permissions for some video actions, but the per-operation scope requirement is not specified; the plugin currently requests only `ads_read` and `ads_management`. Video upload is also pending because potentially signed `file_url` values would be retained in core request-error metadata, and chunking/processing is a multi-step, potentially long-running workflow. The JSON shape is representable, but scope, privacy-safe secret handling, and lifecycle support need verification. Reference: [ad videos](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/advideos).
- **Async/batch ad mutation sets, copies, previews, recommendations, reach estimates, and report export:** separate workflows/contracts. Only the documented async Insights report lifecycle is implemented. The export URL is unversioned and its response format is explicitly not covered by Graph's breaking-change policy.
- **Account creation, payments/funding, account spend-limit changes, and campaign/business setup administration:** financial or business-administration side effects beyond this plugin's bounded ad-object surface.
- **Other Insights metrics/breakdowns, field filters, and attribution switches:** beyond the allow-listed parameters. The optional `filtering` syntax for the Insights feature-settings edge is not exposed because the guide names `insights_feature` but does not specify the exact filter encoding. Current official pages disagree on whether `use_unified_attribution_setting` should be set versus ignored, so that behavior remains pending verification. The deprecated/changed `action_report_time` parameter is not exposed. Provider-side combination and metric compatibility errors remain possible.
- **Complex audiences and related products:** lookalike/saved/product audiences, audience replacement, shared-audience label management, and partner sharing. Conversions API, Pixel/events, Catalog, Pages, Business Manager, Instagram Graph API, and webhook delivery are separate product surfaces. Webhooks are not exposed.

This inventory covers the documented routes above and selected adjacent v27 references checked for this PR; it is not an exhaustive listing of every Marketing API object/edge. No API credentials or live demo are available, so provider behavior has not been live-verified.

## Core official sources

- [Marketing API overview](https://developers.facebook.com/docs/marketing-apis/)
- [Versioning](https://developers.facebook.com/documentation/ads-commerce/marketing-api/overview/versioning)
- [Authentication](https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authentication)
- [Authorization, permissions, and access tiers](https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authorization)
- [Rate limiting](https://developers.facebook.com/documentation/ads-commerce/marketing-api/overview/rate-limiting)
- [Idempotent requests](https://developers.facebook.com/documentation/ads-commerce/marketing-api/idempotent-requests)
- [Error reference](https://developers.facebook.com/documentation/ads-commerce/marketing-api/error-reference)
- [Graph cursor pagination](https://developers.facebook.com/docs/graph-api/using-graph-api#paging)

## Webhooks

No webhooks are exposed.

## License

Apache-2.0
