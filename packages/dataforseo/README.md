# @corsair-dev/dataforseo

DataForSeo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dataforseo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.userData` | `dataforseo.api.account.userData` | `read` | Get the account login, balance, and subscription expiry dates (free) |
| `ai.chatgptResponse` | `dataforseo.api.ai.chatgptResponse` | `write` | Get a ChatGPT model response to a prompt, with web sources when web search is on |
| `ai.geminiResponse` | `dataforseo.api.ai.geminiResponse` | `write` | Get a Gemini model response to a prompt |
| `ai.mentionsSearch` | `dataforseo.api.ai.mentionsSearch` | `write` | Search AI answers (ChatGPT, Google AI) that mention a domain or keyword |
| `ai.mentionsTopDomains` | `dataforseo.api.ai.mentionsTopDomains` | `write` | Rank the domains cited most in AI answers about a domain or keyword |
| `ai.perplexityResponse` | `dataforseo.api.ai.perplexityResponse` | `write` | Get a Perplexity model response to a prompt, with cited sources |
| `amazon.asin` | `dataforseo.api.amazon.asin` | `write` | Get an Amazon product page by ASIN: price, rating, details, and top reviews |
| `amazon.products` | `dataforseo.api.amazon.products` | `write` | Get live Amazon search results for a keyword |
| `appStore.infoResult` | `dataforseo.api.appStore.infoResult` | `read` | Get the results of an App Store app info task by task id |
| `appStore.infoTask` | `dataforseo.api.appStore.infoTask` | `write` | Post an App Store app info task; fetch it with appStore.infoResult |
| `appStore.reviewsResult` | `dataforseo.api.appStore.reviewsResult` | `read` | Get the results of an App Store reviews task by task id |
| `appStore.reviewsTask` | `dataforseo.api.appStore.reviewsTask` | `write` | Post an App Store reviews task; fetch it with appStore.reviewsResult |
| `appStore.searchResult` | `dataforseo.api.appStore.searchResult` | `read` | Get the results of an App Store search task by task id |
| `appStore.searchTask` | `dataforseo.api.appStore.searchTask` | `write` | Post an App Store search task; fetch it with appStore.searchResult |
| `backlinks.anchors` | `dataforseo.api.backlinks.anchors` | `write` | List anchor texts used in links to a target |
| `backlinks.bulkRanks` | `dataforseo.api.backlinks.bulkRanks` | `write` | Get the rank of up to 1000 domains, subdomains, or pages |
| `backlinks.competitors` | `dataforseo.api.backlinks.competitors` | `write` | Find domains that share backlinks with a target |
| `backlinks.list` | `dataforseo.api.backlinks.list` | `write` | List backlinks pointing to a target |
| `backlinks.referringDomains` | `dataforseo.api.backlinks.referringDomains` | `write` | List domains linking to a target with per-domain link metrics |
| `backlinks.summary` | `dataforseo.api.backlinks.summary` | `write` | Get a backlink profile summary for a domain, subdomain, or page |
| `keywords.ideas` | `dataforseo.api.keywords.ideas` | `write` | Get keyword ideas related to up to 200 seed keywords |
| `keywords.locations` | `dataforseo.api.keywords.locations` | `read` | List DataForSEO Labs locations and languages (free) |
| `keywords.searchVolume` | `dataforseo.api.keywords.searchVolume` | `write` | Get Google Ads search volume, CPC, and competition for up to 1000 keywords |
| `keywords.suggestions` | `dataforseo.api.keywords.suggestions` | `write` | Get keyword suggestions that contain a seed keyword, with search volume and difficulty |
| `serp.googleNews` | `dataforseo.api.serp.googleNews` | `write` | Get live Google News results for a keyword |
| `serp.googleOrganic` | `dataforseo.api.serp.googleOrganic` | `write` | Get the live Google organic SERP for a keyword: organic, paid, AI Overview, People Also Ask, and other result types |
| `serp.languages` | `dataforseo.api.serp.languages` | `read` | List Google SERP language codes (free) |
| `serp.locations` | `dataforseo.api.serp.locations` | `read` | List Google SERP location codes, optionally for one country (free) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dataforseo

## License

Apache-2.0
