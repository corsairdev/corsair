# @corsair-dev/hyperbrowser

Hyperbrowser plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/hyperbrowser
```

## Endpoints

| Operation | Risk | Description |
|-----------|------|-------------|
| `profiles.create` | `destructive` | Create a new persistent browser profile |
| `profiles.fork` | `destructive` | Fork an existing persistent browser profile |
| `profiles.get` | `read` | Get persistent browser profile details by ID |
| `profiles.delete` | `destructive` | Permanently delete a persistent browser profile by ID |
| `profiles.list` | `read` | List persistent browser profiles with optional pagination and name filter |
| `sessions.create` | `destructive` | Create and launch a cloud browser session (consumes compute credits) |
| `sessions.get` | `read` | Get cloud browser session details by ID |
| `sessions.stop` | `destructive` | Stop an active cloud browser session |
| `sessions.update` | `destructive` | Update live configuration of a running browser session |
| `sessions.evaluateCaptcha` | `destructive` | Run CAPTCHA evaluation and solving on an active session (consumes credits) |
| `sessions.list` | `read` | List cloud browser sessions with optional pagination and status filter |
| `sessions.getRecordingUrl` | `read` | Get the web recording replay URL for a browser session |
| `sessions.getVideoRecordingUrl` | `read` | Get the video recording URL for a browser session |
| `sessions.getDownloadsUrl` | `read` | Get the downloads archive URL for a browser session |
| `scrape.create` | `destructive` | Start an asynchronous web scrape job (consumes compute credits) |
| `scrape.get` | `read` | Get scrape job status and content data by job ID |
| `scrape.getStatus` | `read` | Get the current status of an asynchronous scrape job by job ID |
| `scrape.createBatch` | `destructive` | Start an asynchronous batch scrape job across multiple URLs (consumes compute credits) |
| `scrape.getBatch` | `read` | Get results and page data of a batch scrape job by job ID |
| `scrape.getBatchStatus` | `read` | Get the current status of an asynchronous batch scrape job by job ID |
| `crawl.create` | `destructive` | Start an asynchronous multi-page crawl job (consumes compute credits) |
| `crawl.get` | `read` | Get crawl job status and crawled pages data by job ID |
| `crawl.getStatus` | `read` | Get the current status of an asynchronous crawl job by job ID |
| `crawl.createWeb` | `destructive` | Start an asynchronous web crawl job using the Web API engine (consumes compute credits) |
| `crawl.getWeb` | `read` | Get web crawl job status and crawled page data by job ID |
| `crawl.getWebStatus` | `read` | Get the current status of an asynchronous web crawl job by job ID |
| `extract.create` | `destructive` | Start an AI structured data extraction job across URLs (consumes compute credits) |
| `extract.get` | `read` | Get the extracted structured data and status of an extract job by job ID |
| `extract.getStatus` | `read` | Get the current status of an asynchronous extract job by job ID |
| `web.fetch` | `destructive` | Fetch web page content in multiple formats using cloud browser (consumes compute credits) |
| `web.search` | `destructive` | Search the web with clean structured results (consumes compute credits) |

## Auth

Authenticate with an API key passed in the `x-api-key` header. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

- Hyperbrowser Documentation: https://docs.hyperbrowser.ai/
- Hyperbrowser API Reference: https://hyperbrowser.ai/docs
- Corsair Plugin Documentation: https://docs.corsair.dev/plugins/hyperbrowser

## License

Apache-2.0
