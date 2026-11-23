# @corsair-dev/moz

SEO data with Moz - read Domain Authority, Page Authority and Spam Score for sites, list backlinks, linking domains, anchor texts and top pages, find link intersects and ranking competitors, and check API quota.

## Install

```bash
pnpm add @corsair-dev/moz
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `anchorText.list` | `moz.api.anchorText.list` | `read` | List the anchor texts used to link to a target with unique root domain and page counts |
| `competitors.fetch` | `moz.api.competitors.fetch` | `read` | Start the ranking-competitors lookup for a site; answers with an async_call receipt to follow with jobs.lookup. Spends mozscape quota |
| `jobs.lookup` | `moz.api.jobs.lookup` | `read` | Read an async_call by id: pending or processing means poll again, complete carries the result or the error. Free |
| `linkingDomains.list` | `moz.api.linkingDomains.list` | `read` | List the root domains linking to a target with authority, link propensity and per-domain link counts |
| `links.intersect` | `moz.api.links.intersect` | `read` | Find sources that link to some targets but not others, a Venn diagram of link profiles (up to 6 targets) |
| `links.list` | `moz.api.links.list` | `read` | List the links pointing at a target with source and target metrics, filters, sorting and token paging |
| `locales.list` | `moz.api.locales.list` | `read` | List every locale a search engine (google, bing or yahoo) supports; costs no rows |
| `metrics.fetch` | `moz.api.metrics.fetch` | `read` | Read Domain Authority, Page Authority, Spam Score and link counts for one URL, subdomain, subfolder or domain |
| `metrics.fetchMultiple` | `moz.api.metrics.fetchMultiple` | `read` | Read the same site metrics for several targets at once, with a per-target success or error split |
| `quota.lookup` | `moz.api.quota.lookup` | `read` | Read how much API quota is used and remaining for a billing period, and whether overages are enabled |
| `topPages.list` | `moz.api.topPages.list` | `read` | List a target's top pages sorted by page authority, linking root domains or external linking pages |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moz

## License

Apache-2.0
