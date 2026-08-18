# @corsair-dev/webflow

Webflow plugin for Corsair. Covers sites, CMS collections and items,
assets, pages, components, comments, form submissions, webhooks
management, and ecommerce (orders and inventory) via the Webflow Data
API v2.

## Authentication

The plugin supports two auth types:

### API key (default, `api_key`)

Generate a **site token** in Webflow under
**Site settings → Apps & integrations → API access**, or a workspace
token for multi-site access, and store it as the plugin's API key in
Corsair. The token is sent as a `Bearer` authorization header.

### OAuth 2.0 (`oauth_2`)

Register a Webflow App under
[developers.webflow.com](https://developers.webflow.com/) with your
Corsair callback URL (Webflow requires the redirect URI to be
registered). The flow requests these scopes: `authorized_user:read`,
`assets:read`, `assets:write`, `cms:read`, `cms:write`, `comments:read`,
`components:read`, `ecommerce:read`, `ecommerce:write`, `forms:read`,
`pages:read`, `pages:write`, `sites:read`, `sites:write`.

## Endpoints

52 operations across these domains:

| Domain             | Operations                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sites`            | `listSites`, `getSite`, `updateSite`, `publishSite`, `getCustomDomains`                                                                                                                                                                                                                                                                                                                                       |
| `collections`      | `listCollections`, `createCollection`, `getCollection`, `deleteCollection`                                                                                                                                                                                                                                                                                                                                    |
| `collectionItems`  | `listCollectionItems`, `getCollectionItem`, `createCollectionItem`, `createBulkCollectionItems`, `updateCollectionItem`, `updateCollectionItemLegacy`, `deleteCollectionItem`, `deleteCollectionItems`, `publishCollectionItems`, `getLiveCollectionItem`, `createLiveCollectionItem`, `updateLiveCollectionItem`, `updateLiveCollectionItems`, `unpublishLiveCollectionItem`, `unpublishLiveCollectionItems` |
| `collectionFields` | `createCollectionField`, `updateCollectionField`, `deleteCollectionField`                                                                                                                                                                                                                                                                                                                                     |
| `assets`           | `listAssets`, `uploadAsset`, `getAsset`, `deleteAsset`, `listAssetFolders`, `createAssetFolder`, `getAssetFolder`                                                                                                                                                                                                                                                                                             |
| `pages`            | `listPages`, `getPage`, `getPageDom`, `updatePageMetadata`                                                                                                                                                                                                                                                                                                                                                    |
| `components`       | `getComponentProperties`                                                                                                                                                                                                                                                                                                                                                                                      |
| `comments`         | `listCommentThreads`                                                                                                                                                                                                                                                                                                                                                                                          |
| `forms`            | `listFormSubmissions`                                                                                                                                                                                                                                                                                                                                                                                         |
| `webhooks`         | `listWebhooks`, `deleteWebhook`                                                                                                                                                                                                                                                                                                                                                                               |
| `ecommerce`        | `listOrders`, `getOrder`, `updateOrder`, `fulfillOrder`, `unfulfillOrder`, `refundOrder`, `getItemInventory`, `updateItemInventory`                                                                                                                                                                                                                                                                           |
| `token`            | `getTokenAuthorizedBy`                                                                                                                                                                                                                                                                                                                                                                                        |

Read results are cached locally for 8 entity types (sites, collections,
collection items, assets, asset folders, pages, orders, webhooks). The
collection-item cache is the staged CMS copy: live reads and live creates
do not write it, and live updates evict the staged row. Write operations
evict or update the affected cache entries, including cascade-eviction of
items when their parent collection is deleted. Site publish evicts every
cached collection item (re-list after publish) because the publish
response does not include item ids.

## Live tests

Mocked suites (`api.test.ts`, `integration.test.ts`) run in CI. Live API
checks live in `live.test.ts` and skip unless `WEBFLOW_TOKEN` is set.
Put the token in `packages/webflow/.env` (gitignored) or export it in
the shell; already-set environment variables win over the file. Then:

```sh
pnpm --filter @corsair-dev/webflow test:live
```

## Webhooks

This plugin manages Webflow webhook registrations through the
`webhooks` endpoints but does not itself consume inbound webhook events
(no event triggers are registered).

## Provider quirks

- Site tokens are scoped to a single site; workspace/OAuth tokens can
  span multiple sites. Enterprise-only operations (e.g. `updateSite`)
  return 403 on lower plans.
- Live (`/live`) collection item operations act on the published site,
  while the staged variants require a separate `publishCollectionItems`
  (or site publish) to go live.
- `uploadAsset` is two-phase: Webflow returns S3 upload instructions
  and the binary is pushed to S3 separately.
- Webflow rate-limits per token (60 requests/minute by default); 429s
  are routed through the plugin's rate-limit error handler.
