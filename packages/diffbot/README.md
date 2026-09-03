# @corsair-dev/diffbot

Diffbot plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/diffbot
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getAccount` | `diffbot.api.account.getAccount` | `read` | Retrieve Diffbot account details, credit balance, and plan usage |
| `bulk.createBulk` | `diffbot.api.bulk.createBulk` | `write` | Submit an asynchronous bulk extract job to process multiple URLs |
| `bulk.getBulkData` | `diffbot.api.bulk.getBulkData` | `read` | Download extracted results from a completed bulk extract job |
| `bulk.listBulkJobs` | `diffbot.api.bulk.listBulkJobs` | `read` | List all bulk extract jobs associated with the token |
| `bulk.startBulk` | `diffbot.api.bulk.startBulk` | `write` | Start a bulk extract job using query parameters |
| `bulk.stopBulkJob` | `diffbot.api.bulk.stopBulkJob` | `write` | Pause or stop an active bulk extract job |
| `crawl.getCrawlData` | `diffbot.api.crawl.getCrawlData` | `read` | Download extracted data from a completed crawl job |
| `crawl.manageCrawl` | `diffbot.api.crawl.manageCrawl` | `write` | Inspect, pause, restart, or delete crawl jobs |
| `crawl.startCrawl` | `diffbot.api.crawl.startCrawl` | `write` | Initiate a website crawl job starting from seed URLs |
| `customApi.createCustomApi` | `diffbot.api.customApi.createCustomApi` | `write` | Create or update custom API rules and selectors for URL patterns |
| `customApi.deleteCustomApi` | `diffbot.api.customApi.deleteCustomApi` | `destructive` | Delete custom API definitions for a given URL pattern |
| `customApi.listCustomApis` | `diffbot.api.customApi.listCustomApis` | `read` | List all custom API definitions configured on the account |
| `enhance.combineEntityProfiles` | `diffbot.api.enhance.combineEntityProfiles` | `read` | Combine entity profiles into a unified view with organization affiliations |
| `enhance.enhanceEntity` | `diffbot.api.enhance.enhanceEntity` | `read` | Enrich person or organization data with Knowledge Graph records |
| `enhance.getKgCoverageReportById` | `diffbot.api.enhance.getKgCoverageReportById` | `read` | Download Knowledge Graph coverage report by report ID |
| `enhance.resolveLostId` | `diffbot.api.enhance.resolveLostId` | `read` | Resolve lost or legacy identifiers to canonical Knowledge Graph entities |
| `extract.extractJob` | `diffbot.api.extract.extractJob` | `read` | Extract structured job posting data including compensation, requirements, and company info |
| `extract.extractList` | `diffbot.api.extract.extractList` | `read` | Extract structured items from list-style pages, catalogs, and news indexes |
| `extract.getAnalyze` | `diffbot.api.extract.getAnalyze` | `read` | Automatically analyze web page to determine its type and extract structured data |
| `extract.getArticle` | `diffbot.api.extract.getArticle` | `read` | Extract article title, text, author, date, and metadata from any URL |
| `extract.getDiscussion` | `diffbot.api.extract.getDiscussion` | `read` | Extract structured discussion threads, forum posts, and comments from web pages |
| `extract.getEvent` | `diffbot.api.extract.getEvent` | `read` | Extract event details including dates, venues, organizers, and descriptions |
| `extract.getImage` | `diffbot.api.extract.getImage` | `read` | Extract detailed image information including dimensions and recognition data |
| `extract.getProduct` | `diffbot.api.extract.getProduct` | `read` | Extract product price, availability, images, and specifications from any e-commerce URL |
| `extract.getVideo` | `diffbot.api.extract.getVideo` | `read` | Extract structured metadata from videos including embed HTML and durations |
| `kgBulkEnhance.createKgBulkEnhance` | `diffbot.api.kgBulkEnhance.createKgBulkEnhance` | `write` | Submit an asynchronous bulk enhance job for multiple entities |
| `kgBulkEnhance.deleteKgEnhanceBulkjob` | `diffbot.api.kgBulkEnhance.deleteKgEnhanceBulkjob` | `destructive` | Delete a Knowledge Graph bulk enhance job and its results |
| `kgBulkEnhance.downloadBulkResults` | `diffbot.api.kgBulkEnhance.downloadBulkResults` | `read` | Download bulk enhance results with filtering and custom output formats |
| `kgBulkEnhance.getBulkJobStatus` | `diffbot.api.kgBulkEnhance.getBulkJobStatus` | `read` | Poll the status and progress of a Knowledge Graph bulk enhance job |
| `kgBulkEnhance.getBulkResults` | `diffbot.api.kgBulkEnhance.getBulkResults` | `read` | Download results of a completed Knowledge Graph bulk enhance job |
| `kgBulkEnhance.getBulkSingleResult` | `diffbot.api.kgBulkEnhance.getBulkSingleResult` | `read` | Download single enriched entity result from a bulk enhance job by index |
| `kgBulkEnhance.listBulkJobsStatusForToken` | `diffbot.api.kgBulkEnhance.listBulkJobsStatusForToken` | `read` | List all Knowledge Graph bulk enhance jobs and their statuses for token |
| `kgBulkEnhance.stopKgBulkJobById` | `diffbot.api.kgBulkEnhance.stopKgBulkJobById` | `write` | Stop or pause an active Knowledge Graph bulk enhance job by ID |
| `search.search` | `diffbot.api.search.search` | `read` | Search the Diffbot Knowledge Graph using DQL (Diffbot Query Language) |
| `search.searchCrawlData` | `diffbot.api.search.searchCrawlData` | `read` | Query crawl job collections using DQL or keyword search |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/diffbot

## License

Apache-2.0
