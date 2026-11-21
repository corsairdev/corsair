# @corsair-dev/metaads

Meta Marketing API v27.0 integration for Corsair. The package uses Meta's Graph API directly; it is not the LurkAPI integration. The 133 operations below are a verified, bounded surface, not universal Marketing API coverage. Every operation validates input and output with Zod.

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
| `accounts.activitiesList` | `GET /v27.0/act_{account_id}/activities` | read | Recent account/ad-object activity (one week by default); [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/activities) |
| `accounts.assignedUsersList` / `assignUser` / `removeUser` | `GET` / `POST` / `DELETE /v27.0/act_{account_id}/assigned_users` | read / destructive | Lists users for a required business ID, grants documented tasks, or revokes the assignment; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/assigned_users) |
| `accounts.agenciesList` / `agencyRemove` | `GET` / `DELETE /v27.0/act_{account_id}/agencies` | read / destructive | Lists associated businesses or removes one by ID; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/agencies) |
| `accounts.controlsCreate` | `POST /v27.0/act_{account_id}/account_controls` | destructive | Sets documented audience/placement constraints; on propagated Graph `ApiError`s, request body/form data is omitted and provider details are reduced to safe diagnostics; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/account_controls) |
| `accounts.subscribedAppUpdate` / `subscribedAppRemove` | `POST` / `DELETE /v27.0/act_{account_id}/subscribed_apps` | write | Subscribe or unsubscribe an app; callback URLs and app-list node details are not exposed; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/subscribed_apps) |
| `accounts.trackingCreate` | `POST /v27.0/act_{account_id}/tracking` | write | Adds account tracking specs; Meta documents `tracking_specs` as a generic object with no nested field contract, so its strict input boundary is one object. On propagated Graph `ApiError`s, request body/form data is omitted and provider details are reduced to safe diagnostics. |
| `accounts.pixelsList` / `pixels.create` | `GET` / `POST /v27.0/act_{account_id}/adspixels` | read / destructive | Lists typed pixel fields or creates an account pixel; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/adspixels) |
| `pixels.get` / `pixels.update` | `GET` / `POST /v27.0/{pixel_id}` | read / destructive | Reads documented scalar fields or updates pixel data-use, matching and business-access settings; update request body/form data is omitted from propagated Graph `ApiError`s and provider details are reduced to safe diagnostics; [official object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ads-pixel) |
| `customConversions.create` | `POST /v27.0/act_{account_id}/customconversions` | destructive | Creates a typed conversion definition; it does not send Conversions API events; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/customconversions) |
| `publisherBlockLists.create` | `POST /v27.0/act_{account_id}/publisher_block_lists` | write | Creates a named block list without applying it to ad delivery; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/publisher_block_lists) |
| `accounts.impactingAdStudiesList` | `GET /v27.0/act_{account_id}/impacting_ad_studies` | read | Studies affecting an account or descendants; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/impacting_ad_studies) |
| `accounts.adRulesLibraryList` / `accounts.adRulesLibraryCreate` / `accounts.activeAdRulesList` | `GET` / `POST /v27.0/act_{account_id}/adrules_library`; `GET /v27.0/act_{account_id}/active_adrules` | read / destructive | Lists or creates rules and lists active rules for explicit IDs. New rules default to `DISABLED`; callback execution types are omitted; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/adrules_library) |
| `accounts.generatePreviews` | `GET /v27.0/act_{account_id}/generatepreviews` | read | Generates a preview from a bounded link-story creative spec and supported placement; returns expiring HTML as inert text; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/generatepreviews) |
| `accounts.broadTargetingCategoriesList` | `GET /v27.0/act_{account_id}/broadtargetingcategories` | read | Returns documented category IDs, names, parent, and audience-size bounds; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/broadtargetingcategories) |
| `accounts.smartSuggestedAdsList` / `suggestedAdsList` | `GET /v27.0/act_{account_id}/smart_suggested_ads`; `GET /v27.0/act_{account_id}/suggested_ads` | read | Lists documented Ad suggestions with a bounded set of filters; [official edges](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account) |
| `accounts.placePageSetsCreate` | `POST /v27.0/act_{account_id}/ad_place_page_sets` | destructive | Creates a place-page set for a published parent Page; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/ad_place_page_sets) |
| `accounts.reachEstimate` | `GET /v27.0/act_{account_id}/reachestimate` | read | Returns documented lower/upper user estimates; targeting is a nested, versioned Targeting spec and country count is bounded to one; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/reachestimate) |
| `labels.list` / `create` | `GET` / `POST /v27.0/act_{account_id}/adlabels` | read / write | List labels or create one by name; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/adlabels) |
| `labels.get` / `update` / `delete` | `GET` / `POST` / `DELETE /v27.0/{ad_label_id}` | read / write | Read, rename, or delete an ad label; [official object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-label) |
| `labels.adsList`, `labels.adSetsList`, `labels.campaignsList`, `labels.creativesList` | `GET /v27.0/{ad_label_id}/{ads,adsets,campaigns,adcreatives}` | read | List associated ad objects; [official label edges](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-label) |
| `campaigns.list` / `campaigns.get` | `GET /v27.0/act_{account_id}/campaigns`; `GET /v27.0/{campaign_id}` | read | Cursor list / single Graph node |
| `campaigns.adSetsList` | `GET /v27.0/{campaign_id}/adsets` | read | Lists child ad sets; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/adsets) |
| `campaigns.adsList` | `GET /v27.0/{campaign_id}/ads` | read | Lists child ads; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/ads) |
| `campaigns.copiesList` / `campaigns.copy` | `GET` / `POST /v27.0/{campaign_id}/copies` | read / destructive | Lists copies or creates a shallow copy forced to `PAUSED`; deep copies and arbitrary overrides are omitted; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/copies) |
| `campaigns.labelsAdd` | `POST /v27.0/{campaign_id}/adlabels` | write | Add/reuse up to 50 documented label IDs or names; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/adlabels) |
| `campaigns.budgetSchedulesList` / `campaigns.budgetScheduleCreate` | `GET` / `POST /v27.0/{campaign_id}/budget_schedules` | read / destructive | List high-demand periods or schedule a budget increase; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/budget_schedules) |
| `campaigns.adStudiesList` | `GET /v27.0/{campaign_id}/ad_studies` | read | Lists documented study nodes; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/ad_studies) |
| `campaigns.adRulesGovernedList` | `GET /v27.0/{campaign_id}/adrules_governed` | read | Lists governing rules with an optional evaluation filter; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/adrules_governed) |
| `highDemandPeriods.get` | `GET /v27.0/{high_demand_period_id}` | read | Reads documented budget period fields; [official object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/high-demand-period) |
| `campaigns.create` / `update` / `delete` | `POST /v27.0/act_{account_id}/campaigns`; `POST` / `DELETE /v27.0/{campaign_id}` | destructive | Create requires `special_ad_categories`; campaign changes may affect delivery or spend |
| `adSets.list` / `get` | `GET /v27.0/act_{account_id}/adsets`; `GET /v27.0/{adset_id}` | read | Cursor list / single Graph node |
| `adSets.adsList` | `GET /v27.0/{adset_id}/ads` | read | Lists ads under one ad set; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/ads) |
| `adSets.adCreativesList` | `GET /v27.0/{adset_id}/adcreatives` | read | Lists associated creatives and supports standard Graph cursor pagination; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/adcreatives) |
| `adSets.copiesList` / `adSets.copy` | `GET` / `POST /v27.0/{adset_id}/copies` | read / destructive | Lists copies or creates a copy forced to `PAUSED`; deep-copying ads is omitted; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/copies) |
| `adSets.budgetSchedulesList` / `adSets.budgetScheduleCreate` | `GET` / `POST /v27.0/{adset_id}/budget_schedules` | read / destructive | List high-demand periods or schedule a budget increase; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/budget_schedules) |
| `adSets.activitiesList` | `GET /v27.0/{adset_id}/activities` | read | Filters documented activity history by category, business, user, and time; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/activities) |
| `adSets.adStudiesList` | `GET /v27.0/{adset_id}/ad_studies` | read | Lists documented study nodes; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/ad_studies) |
| `adSets.adRulesGovernedList` | `GET /v27.0/{adset_id}/adrules_governed` | read | Lists governing rules with an optional evaluation filter; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/adrules_governed) |
| `adSets.create` / `update` / `delete` | `POST /v27.0/act_{account_id}/adsets`; `POST` / `DELETE /v27.0/{adset_id}` | destructive | Typed targeting JSON; create defaults to `PAUSED` |
| `ads.list` / `get` | `GET /v27.0/act_{account_id}/ads`; `GET /v27.0/{ad_id}` | read | Cursor list / single Graph node |
| `ads.adCreativesList` | `GET /v27.0/{ad_id}/adcreatives` | read | Lists creatives attached to an ad and supports standard Graph cursor pagination; [official edge](https://developers.facebook.com/documentation/ads-commerce/graph-api/reference/adgroup/adcreatives) |
| `ads.adStudiesList` | `GET /v27.0/{ad_id}/ad_studies` | read | Lists documented study nodes; [official edge](https://developers.facebook.com/documentation/ads-commerce/graph-api/reference/adgroup/ad_studies) |
| `ads.adRulesGovernedList` | `GET /v27.0/{ad_id}/adrules_governed` | read | Lists governing rules with an optional evaluation filter; [official edge](https://developers.facebook.com/documentation/ads-commerce/graph-api/reference/adgroup/adrules_governed) |
| `ads.previewsList` | `GET /v27.0/{ad_id}/previews` | read | Generates HTML previews for seven documented common formats; HTML is returned as inert text and is valid for 24 hours; [official edge](https://developers.facebook.com/documentation/ads-commerce/graph-api/reference/adgroup/previews) |
| `ads.copiesList` / `ads.copy` | `GET` / `POST /v27.0/{ad_id}/copies` | read / destructive | Lists copies or creates a copy forced to `PAUSED`; creative overrides are omitted, and `adSetId` may select another parent ad set; [official edge](https://developers.facebook.com/documentation/ads-commerce/graph-api/reference/adgroup/copies) |
| `ads.labelsAdd` | `POST /v27.0/{ad_id}/adlabels` | write | Add/reuse up to 50 documented label IDs or names; [official label association](https://developers.facebook.com/documentation/ads-commerce/graph-api/reference/adgroup/adlabels) |
| `ads.create` / `update` / `delete` | `POST /v27.0/act_{account_id}/ads`; `POST` / `DELETE /v27.0/{ad_id}` | destructive | Create references an existing ad set and either an existing creative ID or an inline creative with documented `object_story_spec`; optionally pass a bare `conversionDomain` for campaigns sharing data with a pixel. Create defaults to `PAUSED`; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/ads) |
| `creatives.list` / `get` | `GET /v27.0/act_{account_id}/adcreatives`; `GET /v27.0/{creative_id}` | read | Cursor list / single Graph node |
| `creatives.create` / `update` / `delete` | `POST /v27.0/act_{account_id}/adcreatives`; `POST` / `DELETE /v27.0/{creative_id}` | destructive | Create accepts an existing Page post ID or documented `object_story_spec` (`page_id` plus exactly one documented content type); includes the documented political authorization category; update is name-only |
| `creatives.labelsAdd` | `POST /v27.0/{creative_id}/adlabels` | write | Add/reuse up to 50 documented label IDs or names; [official label association](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-creative/adlabels) |
| `creatives.insightsList` | `GET /v27.0/{creative_id}/creative_insights` | read | Reads the documented aesthetics metric; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-creative/creative_insights) and [node fields](https://developers.facebook.com/docs/graph-api/reference/ad-creative-insights) |
| `creatives.previewsList` | `GET /v27.0/{creative_id}/previews` | read | Generates HTML previews for seven documented common formats; HTML is returned as inert text and is valid for 24 hours; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-creative/previews) |

Image-library routes: `images.list` is `GET /v27.0/act_{account_id}/adimages`, `images.upload` is `POST /v27.0/act_{account_id}/adimages` (Meta-documented base64 `bytes` or `copy_from`), and `images.delete` is `DELETE /v27.0/act_{account_id}/adimages` (hash required; only unused images can be deleted). `copy_from` also requires the token to read creatives from the source ad account. Uploads are non-idempotent and not retried; form data and echoed base64 values are removed from propagated core request errors. Sources: [ad-account image edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/adimages), [image object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-image).

Official references: [ad account](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account), [ad account users](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/users), [campaign edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/campaigns) and [campaign object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group), [ad-set object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign), [ad object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/adgroup), [creative object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-creative), [ad create reference](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/ads), [creative create reference](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/adcreatives).

Verified child-list edges: [campaign ad sets](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/adsets), [campaign ads](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/ads), and [ad-set ads](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/ads).

### Custom audiences

| Operation | Method and route | Risk | Official contract |
| --- | --- | --- | --- |
| `audiences.list` / `get` | `GET /v27.0/act_{account_id}/customaudiences`; `GET /v27.0/{custom_audience_id}` | read | Cursor list / single Graph node |
| `audiences.adsList` | `GET /v27.0/{custom_audience_id}/ads` | read | Lists ads associated with the audience; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience/ads) |
| `audiences.adAccountsList` | `GET /v27.0/{custom_audience_id}/adaccounts` | read | Lists recipient accounts with an optional permission filter; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience/adaccounts) |
| `audiences.create` | `POST /v27.0/act_{account_id}/customaudiences` | destructive | Creates a blank `CUSTOM` audience |
| `audiences.update` / `delete` | `POST` / `DELETE /v27.0/{custom_audience_id}` | destructive | Metadata update / permanent deletion; deletion stops ads using the audience and those ads cannot be restarted |
| `audiences.sessionsList` | `GET /v27.0/{custom_audience_id}/sessions` | read | Cursor-paginated upload-session status; optional `session_id` filter |
| `audiences.acceptTerms` | `POST /v27.0/act_{account_id}/customaudiencestos` | destructive | Accepts the documented custom-audience terms for an account/business; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/customaudiencestos) |
| `audiences.usersAdd` | `POST /v27.0/{custom_audience_id}/users` | destructive | Adds up to 10,000 single-key SHA-256 email or phone hashes; requires a caller-generated session ID, sequential batch number, and last-batch flag |
| `audiences.usersRemove` | `DELETE /v27.0/{custom_audience_id}/users` | destructive | Removes up to 10,000 single-key SHA-256 email or phone hashes using Meta's URL-encoded DELETE body |
| `audiences.usersReplace` | `POST /v27.0/{custom_audience_id}/usersreplace` | destructive | Replaces a session batch using the same bounded hashed email/phone format; request values and echoed samples are redacted |
| `audiences.adAccountsShare` / `audiences.adAccountsUnshare` | `POST` / `DELETE /v27.0/{custom_audience_id}/ad_accounts` | destructive | Grants or revokes audience access for explicitly supplied account IDs; revoking access can stop active ads; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience/ad_accounts) |

Use `audiences.acceptTerms` to accept the documented custom-audience terms for an account/business before creating or uploading audiences. Upload sessions must use a unique session ID per ad account and sequential batches; Meta documents a 90-minute session window, and membership updates usually take up to 24 hours. Only `EMAIL_SHA256` and `PHONE_SHA256` are accepted here. The adapter removes request form data from propagated core errors and strips `invalid_entry_samples` from successful results because Meta may echo submitted identifiers in those samples. References: [custom audience](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience), [customer-file audiences and member workflow](https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/guides/custom-audiences), [audience users](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience/users), [upload sessions](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience/sessions), [session object fields](https://developers.facebook.com/docs/marketing-api/reference/custom-audience-session).

The read-only [audience ads edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/custom-audience/ads) lists ads associated with an audience.

### Ad studies and videos

| Operation | Method and route | Risk | Official contract |
| --- | --- | --- | --- |
| `studies.get` | `GET /v27.0/{ad_study_id}` | read | Reads documented study fields; [official object](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-study) |
| `studies.relatedAccountsList` / `studies.viewersList` | `GET /v27.0/{ad_study_id}/related_ad_accounts`; `GET /v27.0/{ad_study_id}/viewers` | read | Lists documented related ad accounts and viewers; [official edges](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-study) |
| `studies.create` | `POST /v27.0/{business_id}/ad_studies` | destructive | Creates only a bounded `SPLIT_TEST` with at least two ad-set cells, each treatment at least 10%, and total treatment at most 100%; not automatically retried |
| `studies.update` | `POST /v27.0/{ad_study_id}` | destructive | Updates only documented name, description, or end time; an end-time change can alter an experiment |
| `videos.delete` | `DELETE /v27.0/act_{account_id}/advideos?video_id={video_id}` | destructive | Dissociates one video from the account library; it does not delete the source video; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/advideos) |

Video list and upload are not implemented: list responses point to a Video node whose linked Graph reference warns that the Video feature was removed after v3.2, and upload is a non-idempotent multipart/chunked workflow with unclear operation-specific Page permission requirements. Only the documented account-library dissociation route is included.

### Asynchronous ad creation

| Operation | Method and route | Risk | Official contract |
| --- | --- | --- | --- |
| `asyncCreatives.list` / `create` | `GET` / `POST /v27.0/act_{account_id}/asyncadcreatives` | read / write | Reads safe job status fields or creates a non-idempotent creative job; notifications are fixed to `OFF`, and creative form data is removed from errors; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/asyncadcreatives) |
| `asyncRequestSets.list` / `create` | `GET` / `POST /v27.0/act_{account_id}/asyncadrequestsets` | read / destructive | Reads request-set status or submits documented ad spec dictionaries; notifications are fixed to `OFF`, and request data is removed from errors; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/asyncadrequestsets) |
| `asyncRequestSets.get` / `update` / `cancel` | `GET` / `POST` / `DELETE /v27.0/{request_set_id}` | read / write / destructive | Reads allow-listed status fields, renames, or cancels an unprocessed set. Update and cancel return literal `true`; numeric and string IDs are accepted. Notification URI fields are not exposed. |
| `asyncRequests.listForSet` / `cancel` | `GET /v27.0/{request_set_id}/requests`; `DELETE /v27.0/{request_id}` | read / destructive | Lists only ID, parent ID and status (not request inputs or result/error bodies), or cancels one unprocessed request and returns literal `true`; numeric and string IDs are accepted; [async guide](https://developers.facebook.com/documentation/ads-commerce/marketing-api/asyncrequests) |
| `asyncRequests.listForAdSet` | `GET /v27.0/{adset_id}/asyncadrequests` | read | Cursor-paginated request statuses; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/asyncadrequests) |

### Reach and frequency forecasts

| Operation | Method and route | Risk | Official contract |
| --- | --- | --- | --- |
| `reachFrequencyPredictions.list` / `get` | `GET /v27.0/act_{account_id}/reachfrequencypredictions`; `GET /v27.0/{prediction_id}` | read | Cursor list or selected documented prediction fields; `pause_periods` is omitted because its item field types are not specified |
| `reachFrequencyPredictions.create` | `POST /v27.0/act_{account_id}/reachfrequencypredictions` | destructive | Creates a non-idempotent forecast/reservation. The adapter enforces prediction mode/budget-or-reach consistency, day-part minimum duration, the single-country targeting bound, and serialized target-spec size; account-specific thresholds remain provider enforced. [Official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/reachfrequencypredictions) |

Budget scheduling requires the provider-documented account capability and a daily-budget campaign/ad set. Meta limits each object to 50 periods, each period to at least three hours, and the total temporary budget to at most eight times the daily budget; eligible objectives and account access are provider-checked. The adapter validates integer timestamps and the three-hour minimum but cannot pre-validate the account capability or budget ceiling.

### Insights

| Operation | Method and route | Risk | Official contract |
| --- | --- | --- | --- |
| `insights.list` | `GET /v27.0/act_{account_id}/insights` | read | Synchronous, cursor-paginated report; typed metric fields, levels, date range/preset, breakdowns, action breakdowns, filters, sorting, summary, time increments, product ID limit, and attribution windows |
| `insights.listForCampaign` | `GET /v27.0/{campaign_id}/insights` | read | Synchronous, cursor-paginated campaign report; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/insights) |
| `insights.listForAdSet` | `GET /v27.0/{adset_id}/insights` | read | Synchronous, cursor-paginated ad-set report; [official edge](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/insights) |
| `insights.listForAd` | `GET /v27.0/{ad_id}/insights` | read | Synchronous, cursor-paginated ad report; [official edge](https://developers.facebook.com/documentation/ads-commerce/graph-api/reference/adgroup/insights) |
| `insights.createAsync` | `POST /v27.0/act_{account_id}/insights` | write | Starts a separate report job and accepts Meta's numeric or numeric-string `report_run_id` for follow-up; no idempotency key is supported |
| `insights.getAsyncReport` | `GET /v27.0/{report_run_id}` | read | Poll `async_status` and `async_percent_completion`; v25+ documents failure details |
| `insights.getAsyncResults` | `GET /v27.0/{report_run_id}/insights` | read | Cursor-paginated completed report results |
| `insights.listFeatures` | `GET /v27.0/act_{account_id}/insights/feature-settings/list-features` | read | Lists documented breakdown features |
| `insights.listEnabledFeatures` | `GET /v27.0/act_{account_id}/insights/feature-settings` | read | Lists enabled features and optional effective dates |
| `insights.enableFeature` | `POST /v27.0/act_{account_id}/insights/feature-settings` | destructive | Enables one documented feature; Meta provides no disable operation |

The metric and breakdown inputs are allow-listed, not the complete evolving Meta catalog. Supported breakdowns include age, gender, country, region, publisher/platform position, selected action and asset breakdowns, hourly breakdowns, and partnership-ad creator. Meta only supports certain combinations; the provider validates combinations and field compatibility. The adapter exposes `action_attribution_windows`; it does not expose `action_report_time` or the two `use_*_attribution_setting` switches because current official guidance describes changed/ignored behavior for those settings. Async report IDs expire after 30 days. Feature enablement can take about 24 hours to affect Insights data.

Ad-set `targeting` and creative `object_story_spec` use nested JSON values because Meta versions and extends these structures. The request schemas validate documented top-level fields/content unions; nested keys are passed through as JSON and remain subject to Meta's version-specific validation. This is intentional support for documented complex targeting and creative structures, not a claim that every possible nested field is supported. Political issue/election creatives need the documented `authorization_category`; the input accepts `POLITICAL` and v27's `POLITICAL_WITH_DIGITALLY_CREATED_MEDIA`. For v27 eligible Sales ad sets, Meta can enable cross-device expansion unless `targeting.targeting_automation.individual_setting.device` is set to `0`; EU-regulated targeting also needs beneficiary and payer information or account defaults. These constraints are server-side and must be considered before creating or activating an ad set.

References: [Insights overview](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights), [account Insights fields and parameters](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/insights), [breakdowns and supported combinations](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/breakdowns), [limits and asynchronous reporting](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/best-practices), [async and batch requests](https://developers.facebook.com/documentation/ads-commerce/marketing-api/asyncrequests).

The direct [campaign](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign-group/insights), [ad-set](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-campaign/insights), and [ad](https://developers.facebook.com/documentation/ads-commerce/graph-api/reference/adgroup/insights) Insights edges use the same validated request fields and response schema as account Insights.

## Response, pagination, rate limits, and write safety

Graph list responses use `{ data, paging }`; pass a returned `paging.cursors.after` or `before` value to continue and use `paging.hasNextPage` to detect whether Meta returned another page. The adapter derives this boolean from `paging.next` but never returns or follows the URL, which may carry credentials. Single-object reads are Graph nodes. Create responses validate the documented ID/success variants. Mutations documented as returning `{ success }` validate that object; `asyncRequestSets.update`, `asyncRequestSets.cancel`, and `asyncRequests.cancel` return literal `true`. Sensitive operations omit their request payload/query from `ApiError.request` and retain only safe Graph diagnostics in the propagated error body/message. Insights data is extensible, and responses validate known metrics while allowing provider-documented additional result fields.

Marketing API quotas depend on access tier, business/app, account activity, and endpoint family. Meta currently documents development-tier ad-account score 60 with 300-second decay and Full-access score 9,000 with 300-second decay; reads generally score one and writes three. Campaign/ad-set/ad create/edit also have a 100 requests/second per app/account cap, plus per-object concurrent-edit limits; ad-set daily/lifetime budget edits are limited to four per hour, account spend-limit edits to ten per day, and ad creation is additionally tied to account daily spend. Custom audiences and Insights have distinct quota families. Insights async and sync calls share app/account load limits. Check provider headers and current account/app tier; this plugin does not expose usage headers or automatically retry. It preserves `Retry-After` for HTTP 429 and the documented Graph `80003` throttle even when Meta returns HTTP 400; automatic retries remain disabled. Sources: [Marketing API rate limits](https://developers.facebook.com/documentation/ads-commerce/marketing-api/overview/rate-limiting), [Insights limits](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/best-practices).

All writes are not automatically retried. Campaign, ad-set, ad, and creative creates accept Meta's documented `X-Client-Idempotent-Key`, validated as 1–128 letters/digits/`_`/`-`; keys are exact, case-sensitive, shared across those endpoints within an ad account, and expire after seven days. Reuse a key only with an identical request. Updates, deletes, custom-audience mutations, and async report creation do not support idempotency keys. Sources: [idempotent requests](https://developers.facebook.com/documentation/ads-commerce/marketing-api/idempotent-requests), [v27.0 changes](https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog/version27.0).

Budget values are integer amounts in the account currency's smallest unit. Creating or enabling campaigns/ad sets/ads can lead to actual delivery and spend after review; setting an ad object `ACTIVE` can resume delivery. Campaign spend caps and ad-set budgets therefore use destructive risk. The referenced API docs do not specify per-call API-credit charges; no credit cost is claimed. Meta's v27 changelog also says eligible Sales ad sets can now default to delivery on other mobile devices when targeting lacks the new explicit setting; users needing strict device-only delivery must configure the documented targeting automation explicitly. This plugin's nested targeting JSON can carry that setting. For some new creatives, Meta may also automatically enable Product showcase when it finds a high-confidence catalog match; this plugin does not expose the changelog's `degrees_of_freedom_spec` opt-out, so review that v27 behavior before creating catalog-linked creatives.

## Official reference audit and remaining gaps

See the [full indexed reference audit](./REFERENCE_AUDIT.md) for all 159 core-family reference pages, the 133 implemented operations, page dispositions (73 full, 11 partial, 62 verified-pending, 2 unverifiable, and 11 static/guide), exact route gaps, and separate product groups. The audit is explicit that this plugin is not universal Marketing API coverage.

The provider routes are validated with mocked requests and responses only; no live Meta credentials are available in this environment.
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
