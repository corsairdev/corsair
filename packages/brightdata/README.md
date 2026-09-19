# @corsair-dev/brightdata

Bright Data plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/brightdata
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `crawlApi` | `brightdata.api.crawlApi` | `write` | Tool to trigger an asynchronous site crawl for a dataset and list of URLs. Returns snapshot_id required by getSnapshotStatus and getSnapshotResults. |
| `filterDataset` | `brightdata.api.filterDataset` | `write` | Tool to apply custom filter criteria to a marketplace dataset (BETA). Use after selecting a dataset to generate a filtered snapshot. |
| `getAvailableCities` | `brightdata.api.getAvailableCities` | `read` | Tool to get available static network cities for a given country. Use when you need to configure static proxy endpoints after selecting a country. |
| `getAvailableCountries` | `brightdata.api.getAvailableCountries` | `read` | Tool to list available countries and their ISO 3166-1 alpha-2 codes. Use when you need to configure zones with valid country codes before provisioning proxies. |
| `getSnapshotResults` | `brightdata.api.getSnapshotResults` | `read` | Tool to retrieve the scraped data from a completed crawl job by snapshot ID. Only call after confirming the job is complete via getSnapshotStatus. |
| `getSnapshotStatus` | `brightdata.api.getSnapshotStatus` | `read` | Tool to check the processing status of a crawl job using snapshot ID. Call before attempting to download results to ensure data collection is complete. |
| `listDatasets` | `brightdata.api.listDatasets` | `read` | Tool to list all available pre-made scrapers (datasets) from Bright Data marketplace. Use when you need to browse available data sources for structured scraping. |
| `listWebUnlockerZones` | `brightdata.api.listWebUnlockerZones` | `read` | Tool to list your configured Web Unlocker zones and proxy endpoints. Use to view available zones for web scraping and bot protection bypass. |
| `serpSearch` | `brightdata.api.serpSearch` | `read` | Tool to perform SERP searches across search engines using Bright Data SERP API. Use when you need search results, trending topics, or competitive analysis data. |
| `webUnlocker` | `brightdata.api.webUnlocker` | `read` | Tool to bypass bot detection, captcha, and other anti-scraping measures to extract content from websites. Use when sites block automated access or require JavaScript rendering. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/brightdata

## License

Apache-2.0
