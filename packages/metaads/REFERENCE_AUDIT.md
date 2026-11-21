# Meta Marketing API reference audit

Audit date: 2026-11-19; disposition reconciliation: 2026-11-21. Source index: [official `reference/llms.txt`](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/llms.txt). The index had 26 headings and 385 linked references. This audit covers the core ad-object families and closely related Marketing API references, not every separate product listed by the umbrella index.

## Counts and units

- **133 implemented operations** are registered with typed input/output schemas, risk metadata, and mocked request/response coverage. The operation count is from the Corsair endpoint registry.
- **159 core reference pages** were audited across the 18 headings below. At the reference-page level: 73 are fully covered, 11 are partially covered, 62 have verified documented operations or fields still pending, 2 are unverifiable, and 11 are static/type/guide entries without a standalone operation. A page may document multiple HTTP methods; page counts are not route-method counts.
- **One additional unverified route** is the Ad Set `/{adset_id}/adlabels` association operation. Its route-specific reference could not be retrieved, so it remains pending rather than inferred from the Campaign, Ad, or Creative association contracts.
- **226 adjacent index links** are outside the 159-page core ad-object table under Ads Pixel, Business, Business Role Request, Business User, Product Catalog, Product Extensions Catalog Suggestion, Integrity Appeals API, and System User headings. The Ads Pixel object reference contributes `GET /{pixel_id}` and `POST /{pixel_id}` operations to this plugin, but its nested creator/business/usage fields and other pixel edges are not complete; the other 225 linked pages are not claimed as covered.

## Core reference pages by disposition

| Official index heading | Linked references | Fully covered | Partial | Verified pending | Unverifiable | Static / guide |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ad | 12 | 8 | 0 | 4 | 0 | 0 |
| Ad Account | 79 | 23 | 10 | 39 | 1 | 6 |
| Ad Account User | 1 | 1 | 0 | 0 | 0 | 0 |
| Ad Activity | 1 | 1 | 0 | 0 | 0 | 0 |
| Ad Campaign | 11 | 9 | 0 | 2 | 0 | 0 |
| Ad Creative | 4 | 4 | 0 | 0 | 0 | 0 |
| Ad Image | 1 | 1 | 0 | 0 | 0 | 0 |
| Ad Labels | 5 | 5 | 0 | 0 | 0 | 0 |
| Ad Preview Plugin | 1 | 0 | 0 | 0 | 0 | 1 |
| Ad Previews | 1 | 0 | 0 | 0 | 0 | 1 |
| Ad Promoted Object | 1 | 0 | 0 | 0 | 0 | 1 |
| Ad Set | 20 | 10 | 0 | 9 | 1 | 0 |
| Ad Study | 7 | 3 | 0 | 4 | 0 | 0 |
| Custom Audience Targeting | 11 | 7 | 0 | 4 | 0 | 0 |
| Currencies | 1 | 0 | 0 | 0 | 0 | 1 |
| High Demand Period | 1 | 1 | 0 | 0 | 0 | 0 |
| Image Crop | 1 | 0 | 0 | 0 | 0 | 1 |
| Reach and Frequency Prediction | 1 | 0 | 1 | 0 | 0 | 0 |
| **Total** | **159** | **73** | **11** | **62** | **2** | **11** |

“Fully covered” means the documented methods selected for the scoped surface are represented; it does not imply every optional provider parameter or every neighboring product API is implemented. Ad Account `advideos` is partial: dissociation is implemented, while listing and upload remain unsupported for the exact Video-node and binary/chunked-transport reasons below. Ad Account `adrules_library` is partial: list and create are implemented, but two callback execution types are intentionally omitted because Corsair has no requested outbound-callback lifecycle. The Ad Account `reachfrequencypredictions` edge and the separate Reach and Frequency Prediction object page are partial because `pause_periods` is omitted when its item field types are not specified. “Static / guide” entries include documentation types and UI guides; Graph routes linked by the Ad Previews guide are tracked under their respective Ad Account, Ad, and Ad Creative edges.

## Verified-pending references

These are verified indexed references with at least one operation or response field still pending. The table is counted in reference pages, not method/path pairs; each row names the exact missing edge, method, or node contract. It does not imply that every parameter on a partially implemented route is supported.

## Explicit method and lifecycle gaps

- **3 unsupported POST methods:** `/act_{account_id}/async_batch_requests` accepts arbitrary Graph paths and bodies and would bypass endpoint validation/approval; `/act_{account_id}/adplayables` requires a raw file upload; `/act_{account_id}/advideos` uses file/chunk upload modes and lists operation-specific Page permissions without a single safe permission contract. The latter two need multipart/streaming transport and upload-byte error redaction that Corsair's shared client does not provide.
- **1 unsupported video-list GET:** `/act_{account_id}/advideos` returns a Video node whose linked documentation says the feature was removed after v3.2; current response compatibility cannot be verified.
- **7 partially implemented Ad Account list GETs** have no usable node-field contract: `/act_{account_id}/account_controls`, `/act_{account_id}/publisher_block_lists`, `/act_{account_id}/tracking`, `/act_{account_id}/subscribed_apps`, `/act_{account_id}/customaudiencestos`, `/act_{account_id}/ad_place_page_sets`, and `/act_{account_id}/customconversions`. Their separately documented create/update/delete methods are included where request and response contracts are complete.
- **2 omitted Ad Rule execution variants:** `PING_ENDPOINT` and `NOTIFICATION` would invoke outbound callbacks without an in-scope callback lifecycle. The create method supports the other documented execution types and defaults new rules to `DISABLED`.
- **1 unverified route:** `POST /{adset_id}/adlabels`; the official index omits an Ad Set label page and the route-specific reference could not be retrieved.

| Family | Pending references | Exact gap |
| --- | --- | --- |
| Ad | `addrafts` | `AdDraft` node fields are not defined by the linked reference, so list responses cannot be validated beyond an assumed ID. |
| Ad | `facebook_feedback` | The edge returns `AdgroupFacebookFeedback` nodes, but the linked reference does not define the node fields. |
| Ad | `leads` | Returns personal `UserLeadGenInfo` records and requires Page lead-data permissions; the plugin has no per-operation Page permission or consent model. |
| Ad | `targetingsentencelines` | The node includes nested `Targeting` parameters; no bounded nested response contract is available in this index audit. |
| Ad Account | `aaa_compatible_ad_objects`, `ad_column_sizes`, `ad_custom_derived_metrics`, `adrules_count_by_type`, `applications`, `applied_publisher_block_lists`, `campaign_attribution_options`, `dsa_recommendations`, `naming_templates`, `optimization_goals_aemv2_eligibility`, `saved_audiences`, `site_links`, `start_your_day_widgets`, `urls_for_asset_extraction`, `website_creative_assets`, `website_creative_info`, `youth_ads_advertiser` | These pages return named node types (including `AdAccountAAACompatibleAdObjects`, `AdCustomDerivedMetrics`, `AdAccountAdRulesCountByType`, `AdsNamingTemplate`, `SiteLink`, and `WebsiteCreativeInfo`) without their field schemas in the indexed references. The plugin does not accept untyped provider records as a substitute. Suggested-ad edges use the documented Ad node contract; agencies and account pixels are covered. |
| Ad Account | `adplayables` | The GET result's `PlayableContent` fields are unavailable. POST requires a file upload; Corsair's shared request transport has no safe multipart/streaming file contract, and the plugin cannot guarantee upload-byte redaction from propagated errors. |
| Ad Account | `targetingbrowse`, `targetingsearch`, `targetingsuggestions`, `targetingvalidation` | All return `AdAccountTargetingUnified` nodes without a linked node-field schema. Search/suggestions also expose large, evolving parameter catalogs; `targetingsearch` has an especially broad enum and provider-defined inputs. |
| Ad Account | `GET /act_{ad_account_id}/account_controls` | The read edge returns `AdAccountBusinessConstraints` nodes, but the linked node field contract is inaccessible. `POST` controls creation is implemented with strict documented top-level fields and redacted errors. |
| Ad Account | `adrules_library` callback execution variants | Rule list and create are implemented, but two documented execution types (`PING_ENDPOINT`, `NOTIFICATION`) are excluded because they create outbound callbacks without a requested callback lifecycle. New rules default to `DISABLED`; this is a partial-page compatibility exclusion, not an omitted route method. |
| Ad Account | `async_batch_requests` | This batch route accepts arbitrary relative Graph paths and bodies, so it could bypass per-operation Zod schemas, permissions and risk metadata. It is not exposed as a generic raw-request escape hatch. Async creative/request-set routes and their safe status/cancel operations are implemented separately. |
| Ad Account | `delivery_estimate`, `message_delivery_estimate`, `minimum_budgets` | Complex targeting/promoted-object/budget inputs and/or estimate response nodes are not fully typed in the linked pages. |
| Ad Account | `reporting`, `ads_reporting_mmm_reports`, `ads_reporting_mmm_schedulers` | Report Builder output requires `AdsReportBuilderHeader` and `AdsReportBuilderRow` contracts, which are unavailable; MMM report/scheduler output nodes are also untyped. |
| Ad Account | `deprecatedtargetingadsets` | The documented route is deprecated; no current compatible contract is asserted. |
| Ad Account | `addrafts` | `AdDraft` node fields are absent from the linked edge contract. |
| Ad Account | `GET /act_{ad_account_id}/ad_place_page_sets`; `promote_pages` | Place-page-set creation is implemented from its complete contract; list responses need the missing `AdPlacePageSet` fields. `promote_pages` returns Page nodes and requires `pages_show_list`/`pages_manage_ads`, which are outside the configured ads-only auth scope. |
| Ad Account | `GET /act_{ad_account_id}/customconversions`; `offline_conversion_data_sets`, `mcmeconversions` | Custom conversion creation is included because its Ad Account route and create response are fully contracted; list responses need the missing `CustomConversion` node fields. Offline conversion data sets and MCME routes are separate conversion/measurement surfaces, with unavailable node contracts. No Conversions API event-sending endpoint is exposed. |
| Ad Account | `connected_instagram_accounts`, `instagram_accounts` | Instagram account operations have separate Graph product/permission requirements. |
| Ad Account | `GET /act_{ad_account_id}/customaudiencestos`; `product_audiences`, `collaborative_ads_partner_businesses` | Terms acceptance is implemented with the documented `tos_id`/success contract. The read edge's `CustomAudiencesTOS` fields are unavailable; product and partner audiences have distinct catalog/data-sharing contracts. |
| Ad Account | `reachfrequencypredictions` | The account listing/create edge is implemented, but its prediction result omits the optional `pause_periods` field because the linked references do not provide item value types. The object reference is separately counted under Reach and Frequency Prediction. |
| Ad Account | `GET /act_{ad_account_id}/publisher_block_lists`; `GET /act_{ad_account_id}/tracking`; `GET /act_{ad_account_id}/subscribed_apps` | Their POST/DELETE mutations are implemented where documented. These list edges still need `PublisherBlockList`, `AdAccountTrackingData`, and `Application` node fields, respectively; the plugin does not accept those untyped records. |
| Ad Account | `proposals` | The GET edge returns `AdProposal` nodes, but the linked node field contract is inaccessible; financial subject matter alone is not the exclusion reason. |
| Campaign | `addrafts`, `video_groups` | `AdDraft` and `VideoGroup` response-node schemas are unavailable in the linked references. |
| Ad Set | `addrafts` | `AdDraft` node field schema is absent. |
| Ad Set | `budget_split_set`, `campaign_actions` | Specialized multi-budget/campaign-action workflows lack a bounded result/input contract in the linked pages. |
| Ad Set | `delivery_estimate`, `delivery_stats`, `message_delivery_estimate`, `publisher_delivery_report` | These use complex targeting/optimization parameters or specialized delivery/report result nodes not fully typed in the index references. |
| Ad Set | `targeting_insights`, `targetingsentencelines` | The response includes targeting-derived objects; the linked pages do not provide a complete stable nested node schema. |
| Ad Study | `cells`, `continuous_lift_config`, `instances`, `objectives` | The references name `AdStudyCell`, `AdStudyObjective`, and private lift/configuration nodes but do not expose their field contracts. |
| Custom Audience | `capabilities` | The capabilities response node has no linked field schema in the audited reference set. |
| Custom Audience | `health` | The edge exposes aggregated customer-value data, but `CustomAudienceHealth` fields are not documented in the linked page; privacy-sensitive values are not accepted as an untyped record. |
| Custom Audience | `shared_account_info`, `shared_account_campaign_info` | Both return named sharing nodes without field schemas; these are cross-business sharing agreement data. |

Additional partial Ad Account references above expose the typed mutation where its request/response contract is complete; the remaining read edge or nested response is pending when its node schema is unavailable. The six account pages with no actionable method section are listed below rather than counted as pending operations.

## Unverifiable references and non-route entries

- **Unverifiable indexed references (2):** Ad Account `report_specs` contains no usable method/input/output contract; Ad Set `adjacent_content_delivery_report` is linked from the official index but the fetched page did not expose parseable reference markdown or a usable contract.
- **Unverifiable route (1):** `POST /{adset_id}/adlabels`. Its route-specific Ad Set reference was inaccessible. This route is not inferred from Campaign, Ad, or Creative label association schemas.
- **No actionable route (11):** Ad Account `ad_place_page_sets_async`, `asyncadcopies`, `direct_debits`, `locationclusters`, `prepay_fund`, and `tax_info` have no usable action contract; the remaining entries are the Facebook Login Ad Preview Plugin, Ad Previews guide (its Graph operations are tracked under their object edges), Ad Promoted Object type, Currencies table, and Image Crop guide.

## Other indexed product groups

The 226 adjacent links are grouped under Ads Pixel (34), Business (118), Business Role Request (3), Business User (12), Product Catalog (45), Product Extensions Catalog Suggestion (1), Integrity Appeals API (1), and System User (12). The Ads Pixel object reference has selected GET/update fields in this plugin; the remaining Pixel/event-management surfaces are not claimed. The umbrella index's Business asset administration, Catalog, integrity and system-user surfaces are also outside this bounded integration.

## Additional compatibility boundaries

- Audience member payloads are limited to single-key SHA-256 email or phone hashes. Raw identifiers, mobile advertising IDs, multi-key matching, and other data-source formats are not accepted. The replacement route uses the same bounded schema and explicit session sequence fields.
- Video library dissociation is implemented; video listing remains pending because its response references a Video node whose linked Graph API documentation warns that the Video feature was removed after v3.2. Upload remains pending because it is a multi-phase, non-idempotent upload with operation-specific Page permissions and signed-URL error-redaction concerns.
- Reach/frequency prediction create is destructive and never retried. The adapter limits supported fields to the documented typed subset, omits `pause_periods` due missing value types, enforces one-country targeting and the 65,000-character targeting limit, and leaves account-specific budget/reach minimums to Meta.
- Preview operations accept seven documented common formats, return HTML as text, and never render or execute provider HTML. The Ad Preview Plugin itself requires Facebook Login and is not exposed as a Graph operation.
- There are no live Meta credentials in this environment. Route contracts and schemas are covered with mocked tests, not live API verification.
