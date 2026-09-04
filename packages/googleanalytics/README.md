# @corsair-dev/googleanalytics

GA4 Admin API, Data API, and Measurement Protocol.

## Authentication

OAuth 2 (`oauth_2`).

1. In the [Google Cloud Console](https://console.cloud.google.com/), enable
   Google Analytics Admin API and Google Analytics Data API.
2. Create a Web application OAuth client. Add the Corsair callback as a
   redirect URI.
3. Give Corsair the client ID and secret. The flow requests:
   - `https://www.googleapis.com/auth/analytics` for Data API reports
   - `https://www.googleapis.com/auth/analytics.edit` for Admin API reads
     and writes. The bare `analytics` scope is not enough for Admin calls.

Corsair refreshes the access token and retries once on 401.

`measurementProtocol.sendEvents` and `validateEvents` take an `api_secret`
from Admin, Data Streams, Measurement Protocol API secrets, plus either
`measurementId` (web) or `firebaseAppId` (app).

## Endpoints

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
| `reports`                | `run`, `runRealtime`, `runPivot`, `runFunnel`, `batchRun`, `batchRunPivot`, `checkCompatibility`, `getMetadata`                                                        |
| `reportTasks`            | `create`, `get`, `query`, `list`                                                                                                                                       |
| `reportingData`          | `listAnnotations`, `listSubpropertyEventFilters`, `listSubpropertySyncConfigs`                                                                                         |
| `measurementProtocol`    | `sendEvents`, `validateEvents`                                                                                                                                         |

## Provider quirks

- `dataStreams.listMeasurementProtocolSecrets` returns `secretValue`. It is
  a write so readonly agent mode cannot dump stream secrets.
- `properties.list` (v1alpha, deprecated) needs a `filter` like
  `accounts/{account}` or `firebaseProjects/{project}`.
- Admin API `name` / `parent` values are full resource names, e.g.
  `properties/123` or `properties/123/customDimensions/456`. A bare
  numeric ID 404s. Reports (`property`) and `properties.update` also
  accept `123`.
- Measurement Protocol needs exactly one of `measurementId` or
  `firebaseAppId`.
- `validateEvents` hits the debug collect path and does not record hits.
- Data API quotas are per property. `batchRun*` burns them fast; check
  `properties.getPropertyQuotasSnapshot`.
