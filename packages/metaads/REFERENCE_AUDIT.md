# Meta Marketing API reference audit

Audit date: 2026-11-18. Source index: [official `reference/llms.txt`](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/llms.txt). The index had 26 headings and 385 linked references. This audit covers the core ad-object families and closely related Marketing API references, not every separate product listed by the umbrella index.

## Counts and units

- **99 implemented operations** are registered with typed input/output schemas, risk metadata, and mocked request/response coverage. The operation count is from the Corsair endpoint registry.
- **159 core reference pages** were audited across the 18 headings below. At the reference-page level: 65 are fully covered, 1 is partially covered, 80 have verified documented operations still pending, 2 are unverifiable, and 11 are static/type/guide entries without a standalone operation. A page may document multiple HTTP methods; page counts are not route-method counts.
- **One additional unverified route** is the Ad Set `/{adset_id}/adlabels` association operation. Its route-specific reference could not be retrieved, so it remains pending rather than inferred from the Campaign, Ad, or Creative association contracts.
- **226 other index links** are under Ads Pixel, Business, Business Role Request, Business User, Product Catalog, Product Extensions Catalog Suggestion, Integrity Appeals API, and System User headings. These adjacent product/admin surfaces are not claimed as covered by this core-object plugin audit.

## Core reference pages by disposition

| Official index heading | Linked references | Fully covered | Partial | Verified pending | Unverifiable | Static / guide |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ad | 12 | 8 | 0 | 4 | 0 | 0 |
| Ad Account | 79 | 15 | 2 | 55 | 1 | 6 |
| Ad Account User | 1 | 1 | 0 | 0 | 0 | 0 |
| Ad Activity | 1 | 1 | 0 | 0 | 0 | 0 |
| Ad Campaign | 11 | 9 | 0 | 2 | 0 | 0 |
| Ad Creative | 4 | 4 | 0 | 0 | 0 | 0 |
| Ad Image | 1 | 1 | 0 | 0 | 0 | 0 |
| Ad Labels | 5 | 5 | 0 | 0 | 0 | 0 |
| Ad Preview Plugin | 1 | 0 | 0 | 0 | 0 | 1 |
| Ad Previews | 1 | 0 | 0 | 0 | 0 | 1 |
| Ad Promoted Object | 1 | 0 | 0 | 0 | 0 | 1 |
| Ad Set | 20 | 9 | 0 | 10 | 1 | 0 |
| Ad Study | 7 | 3 | 0 | 4 | 0 | 0 |
| Custom Audience Targeting | 11 | 7 | 0 | 4 | 0 | 0 |
| Currencies | 1 | 0 | 0 | 0 | 0 | 1 |
| High Demand Period | 1 | 1 | 0 | 0 | 0 | 0 |
| Image Crop | 1 | 0 | 0 | 0 | 0 | 1 |
| Reach and Frequency Prediction | 1 | 0 | 0 | 1 | 0 | 0 |
| **Total** | **159** | **64** | **2** | **80** | **2** | **11** |

“Fully covered” means all route methods selected for implementation from that reference page are represented; it does not imply every optional provider parameter or every related API operation is implemented. Ad Account `advideos` is partial: documented dissociation is implemented, while listing/upload are pending. Ad Account `adrules_library` is partial: the safe typed list is implemented, while rule creation is pending. “Static / guide” entries include documentation types and UI guides; Graph routes linked by the Ad Previews guide are tracked under their respective Ad Account, Ad, and Ad Creative edges.

## Verified-pending references

These routes are in the audited object families but are not exposed. Their classifications describe the specific contract or compatibility gap; they are not silently treated as covered.

| Family | Pending references | Exact gap |
| --- | --- | --- |
| Ad | `addrafts` | `AdDraft` node fields are not defined by the linked reference, so list responses cannot be validated beyond an assumed ID. |
| Ad | `facebook_feedback` | The edge returns `AdgroupFacebookFeedback` nodes, but the linked reference does not define the node fields. |
| Ad | `leads` | Returns personal `UserLeadGenInfo` records and requires Page lead-data permissions; the plugin has no per-operation Page permission or consent model. |
| Ad | `targetingsentencelines` | The node includes nested `Targeting` parameters; no bounded nested response contract is available in this index audit. |
| Ad Account | `aaa_compatible_ad_objects`, `ad_column_sizes`, `ad_custom_derived_metrics`, `adplayables`, `adrules_count_by_type`, `agencies`, `applications`, `applied_publisher_block_lists`, `campaign_attribution_options`, `dsa_recommendations`, `naming_templates`, `optimization_goals_aemv2_eligibility`, `saved_audiences`, `site_links`, `smart_suggested_ads`, `start_your_day_widgets`, `suggested_ads`, `urls_for_asset_extraction`, `website_creative_assets`, `website_creative_info`, `youth_ads_advertiser` | These pages return named node types (including `AdAccountAAACompatibleAdObjects`, `AdCustomDerivedMetrics`, `PlayableContent`, `AdAccountAdRulesCountByType`, `AdsNamingTemplate`, `SiteLink`, and `WebsiteCreativeInfo`) without their field schemas in the indexed references. The plugin does not accept untyped provider records as a substitute. |
| Ad Account | `targetingbrowse`, `targetingsearch`, `targetingsuggestions`, `targetingvalidation` | All return `AdAccountTargetingUnified` nodes without a linked node-field schema. Search/suggestions also expose large, evolving parameter catalogs; `targetingsearch` has an especially broad enum and provider-defined inputs. |
| Ad Account | `account_controls`, `assigned_users` | These affect account controls/user access; per-operation permission and safe mutation contracts are not represented in the existing ad-object permission model. |
| Ad Account | `POST /act_{ad_account_id}/adrules_library` | The documented create schema accepts dynamic filters, evaluation/trigger specifications, schedules, and actions including pause, budget, and bid changes. The plugin exposes the read-only library edge but not an unrestricted automation writer; no bounded action allowlist and confirmation model is defined. |
| Ad Account | `async_batch_requests`, `asyncadcreatives`, `asyncadrequestsets` | Asynchronous, non-idempotent job/request-set lifecycles include nested payloads and potentially deliverable ads; the documented schemas do not establish a safe bounded adapter contract. |
| Ad Account | `delivery_estimate`, `message_delivery_estimate`, `reachestimate`, `reachfrequencypredictions`, `minimum_budgets` | Complex targeting/promoted-object/budget inputs and/or estimate response nodes are not fully typed in the linked pages. Reach-and-frequency prediction additionally has booking/forecast side effects. |
| Ad Account | `reporting`, `ads_reporting_mmm_reports`, `ads_reporting_mmm_schedulers` | Report Builder output requires `AdsReportBuilderHeader` and `AdsReportBuilderRow` contracts, which are unavailable; MMM report/scheduler output nodes are also untyped. |
| Ad Account | `deprecatedtargetingadsets` | The documented route is deprecated; no current compatible contract is asserted. |
| Ad Account | `addrafts` | `AdDraft` node fields are absent from the linked edge contract. |
| Ad Account | `ad_place_page_sets`, `promote_pages` | These are Page/placement workflows with separate Page-linked object and permission contracts. |
| Ad Account | `adspixels`, `customconversions`, `offline_conversion_data_sets`, `mcmeconversions` | Pixel/events and conversion-data routes are distinct measurement products; their data and permission contracts are outside this adapter's bounded ad-object surface. |
| Ad Account | `connected_instagram_accounts`, `instagram_accounts` | Instagram account operations have separate Graph product/permission requirements. |
| Ad Account | `customaudiencestos`, `product_audiences`, `collaborative_ads_partner_businesses` | Cross-account/partner and catalog-product audience workflows have distinct data-source, privacy, and Business asset-sharing permission models. |
| Ad Account | `publisher_block_lists`, `tracking`, `subscribed_apps` | These mutate account-wide policy/tracking or webhook subscriptions rather than an individual ad object; their security and permission contracts need separate review. |
| Ad Account | `proposals` | Billing/proposal workflow carries finance and contractual effects not represented by the plugin's ad-management model. |
| Campaign | `addrafts`, `video_groups` | `AdDraft` and `VideoGroup` response-node schemas are unavailable in the linked references. |
| Ad Set | `addrafts` | `AdDraft` node field schema is absent. |
| Ad Set | `asyncadrequests` | The page returns `AdAsyncRequest` nodes; the linked object schema and safe request-set result/cancellation contract are unavailable. |
| Ad Set | `budget_split_set`, `campaign_actions` | Specialized multi-budget/campaign-action workflows lack a bounded result/input contract in the linked pages. |
| Ad Set | `delivery_estimate`, `delivery_stats`, `message_delivery_estimate`, `publisher_delivery_report` | These use complex targeting/optimization parameters or specialized delivery/report result nodes not fully typed in the index references. |
| Ad Set | `targeting_insights`, `targetingsentencelines` | The response includes targeting-derived objects; the linked pages do not provide a complete stable nested node schema. |
| Ad Study | `cells`, `continuous_lift_config`, `instances`, `objectives` | The references name `AdStudyCell`, `AdStudyObjective`, and private lift/configuration nodes but do not expose their field contracts. |
| Custom Audience | `capabilities` | The capabilities response node has no linked field schema in the audited reference set. |
| Custom Audience | `health` | The edge exposes aggregated customer-value data, but `CustomAudienceHealth` fields are not documented in the linked page; privacy-sensitive values are not accepted as an untyped record. |
| Custom Audience | `shared_account_info`, `shared_account_campaign_info` | Both return named sharing nodes without field schemas; these are cross-business sharing agreement data. |
| Reach and Frequency Prediction | object read/create | The indexed prediction resource is a specialized forecast/booking workflow with a large versioned input/result contract not bounded here. |

Additional Ad Account pending edges (`ad_place_page_sets`, `adplayables`, and several rules/measurement edges above) are not generalized into object CRUD because the page lists or nested specs do not establish complete typed contracts. The six account pages with no actionable method section are listed below rather than counted as pending operations.

## Unverifiable references and non-route entries

- **Unverifiable indexed references (2):** Ad Account `report_specs` contains no usable method/input/output contract; Ad Set `adjacent_content_delivery_report` is linked from the official index but the fetched page did not expose parseable reference markdown or a usable contract.
- **Unverifiable route (1):** `POST /{adset_id}/adlabels`. Its route-specific Ad Set reference was inaccessible. This route is not inferred from Campaign, Ad, or Creative label association schemas.
- **No actionable route (11):** Ad Account `ad_place_page_sets_async`, `asyncadcopies`, `direct_debits`, `locationclusters`, `prepay_fund`, and `tax_info` have no usable action contract; the remaining entries are the Facebook Login Ad Preview Plugin, Ad Previews guide (its Graph operations are tracked under their object edges), Ad Promoted Object type, Currencies table, and Image Crop guide.

## Other indexed product groups

The remaining 226 links are grouped under Ads Pixel (34), Business (118), Business Role Request (3), Business User (12), Product Catalog (45), Product Extensions Catalog Suggestion (1), Integrity Appeals API (1), and System User (12). The umbrella Marketing API index includes these distinct Pixel/events, Business asset administration, Catalog, integrity, and system-user surfaces. They are not represented as core ad-object CRUD here; their routes are not claimed as covered.

## Additional compatibility boundaries

- Audience member payloads are limited to single-key SHA-256 email or phone hashes. Raw identifiers, mobile advertising IDs, multi-key matching, and other data-source formats are not accepted. The replacement route uses the same bounded schema and explicit session sequence fields.
- Video library dissociation is implemented; video listing remains pending because its response references a Video node whose linked Graph API documentation warns that the Video feature was removed after v3.2. Upload remains pending because it is a multi-phase, non-idempotent upload with operation-specific Page permissions and signed-URL error-redaction concerns.
- Preview operations accept seven documented common formats, return HTML as text, and never render or execute provider HTML. The Ad Preview Plugin itself requires Facebook Login and is not exposed as a Graph operation.
- There are no live Meta credentials in this environment. Route contracts and schemas are covered with mocked tests, not live API verification.
