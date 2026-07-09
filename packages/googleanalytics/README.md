# @corsair-dev/googleanalytics

Google Analytics 4 (GA4) plugin for Corsair. Covers the GA4 Admin API,
the Data API (reporting), and the Measurement Protocol.

## Authentication

The plugin uses **OAuth 2.0** (`oauth_2`) against Google.

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
   and enable the **Google Analytics Admin API** and the
   **Google Analytics Data API**.
2. Configure an OAuth consent screen and create an **OAuth client ID**
   (type: Web application). Add your Corsair callback URL as an
   authorized redirect URI.
3. Supply the client ID and secret to Corsair; the OAuth flow requests
   these scopes:
   - `https://www.googleapis.com/auth/analytics` — Data API reporting
   - `https://www.googleapis.com/auth/analytics.edit` — Admin API
     (read and write; the bare `analytics` scope does not cover Admin
     API calls)

Tokens are refreshed automatically: the key builder proactively refreshes
the access token before expiry and retries once on a 401.

The **Measurement Protocol** endpoints (`measurementProtocol.sendEvents` /
`validateEvents`) additionally need an `api_secret` created under
**Admin → Data Streams → Measurement Protocol API secrets**, passed as
endpoint input together with either a `measurementId` (web streams) or a
`firebaseAppId` (app streams).

## Endpoints

Around 69 operations across these domains:

| Domain                   | Operations                                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accounts`               | `get`, `list`, `listV1Beta`, `listSummaries`, `getDataSharingSettings`, `provisionAccountTicket`                                                                       |
| `properties`             | `get`, `list`, `listFiltered`, `update`, `createRollup`, `getAttributionSettings`, `getDataRetentionSettings`, `getGoogleSignalsSettings`, `getPropertyQuotasSnapshot` |
| `dataStreams`            | `list`, `listMeasurementProtocolSecrets`, `listEventCreateRules`, `listSKAdNetworkConversionValueSchemas`                                                              |
| `customDimensions`       | `create`, `get`, `list`, `archive`                                                                                                                                     |
| `customMetrics`          | `create`, `list`                                                                                                                                                       |
| `keyEvents`              | `get`, `list`                                                                                                                                                          |
| `conversionEvents`       | `list`                                                                                                                                                                 |
| `audiences`              | `get`, `list`                                                                                                                                                          |
| `audienceExports`        | `create`, `get`, `list`, `query`                                                                                                                                       |
| `audienceLists`          | `create`, `get`, `list`, `query`                                                                                                                                       |
| `recurringAudienceLists` | `create`, `get`, `list`                                                                                                                                                |
| `calculatedMetrics`      | `list`                                                                                                                                                                 |
| `channelGroups`          | `list`                                                                                                                                                                 |
| `expandedDataSets`       | `create`, `list`                                                                                                                                                       |
| `links`                  | `listGoogleAds`, `listBigQuery`, `listFirebase`, `listAdSense`, `listDV360Advertiser`, `listDV360Proposals`, `listSearchAds360`                                        |
| `reports` (Data API)     | `run`, `runRealtime`, `runPivot`, `runFunnel`, `batchRun`, `batchRunPivot`, `checkCompatibility`, `getMetadata`                                                        |
| `reportTasks`            | `create`, `get`, `query`, `list`                                                                                                                                       |
| `reportingData`          | `listAnnotations`, `listSubpropertyEventFilters`, `listSubpropertySyncConfigs`                                                                                         |
| `measurementProtocol`    | `sendEvents`, `validateEvents`                                                                                                                                         |

## Webhooks

GA4 does not offer push webhooks; this plugin does not register any
webhook handlers.

## Provider quirks

- Admin API resource names are hierarchical
  (`properties/{propertyId}/customDimensions/{id}` etc.); endpoints take
  the numeric IDs and build the resource paths internally.
- Measurement Protocol requires exactly one stream identifier —
  `measurementId` or `firebaseAppId`; the input schema enforces this.
- `validateEvents` hits the validation endpoint and does not record data;
  use it before `sendEvents` in new pipelines.
- Data API quotas are per property; heavy `batchRun*` usage can exhaust
  them quickly (see `properties.getPropertyQuotasSnapshot`).
