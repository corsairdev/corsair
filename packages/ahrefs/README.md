# @corsair-dev/ahrefs

Ahrefs plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ahrefs
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `keywordsExplorer.overview` | `ahrefs.api.keywordsExplorer.overview` | `read` | Get keyword metrics such as volume, difficulty, CPC, clicks, and traffic potential |
| `rankTracker.overview` | `ahrefs.api.rankTracker.overview` | `read` | Get Rank Tracker keyword overview data for a project and device |
| `serp.overview` | `ahrefs.api.serp.overview` | `read` | Get SERP positions for a keyword and country, including ranking page metrics |
| `siteExplorer.backlinksStats` | `ahrefs.api.siteExplorer.backlinksStats` | `read` | Get live and all-time backlink and referring-domain counts for a target |
| `siteExplorer.getDomainRating` | `ahrefs.api.siteExplorer.getDomainRating` | `read` | Get Ahrefs Domain Rating and Ahrefs Rank for a target |
| `siteExplorer.organicKeywords` | `ahrefs.api.siteExplorer.organicKeywords` | `read` | List organic keywords a target ranks for, including positions and traffic metrics |
| `siteExplorer.refdomains` | `ahrefs.api.siteExplorer.refdomains` | `read` | List referring domains linking to a target |
| `siteExplorer.topPages` | `ahrefs.api.siteExplorer.topPages` | `read` | List top organic pages for a target with traffic, keyword, and link metrics |
| `subscriptionInfo.limitsAndUsage` | `ahrefs.api.subscriptionInfo.limitsAndUsage` | `read` | Get Ahrefs subscription limits and API unit usage |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ahrefs

## License

Apache-2.0
