# @corsair-dev/googlesearchconsole

Google Search Console plugin for Corsair: search analytics, URL inspection, sites and sitemaps.

## Install

```bash
pnpm add @corsair-dev/googlesearchconsole
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `searchanalytics.query` | `googlesearchconsole.api.searchanalytics.query` | `read` | Query search traffic: clicks, impressions, CTR and position, grouped by date, query, page, country, device or another dimension |
| `sitemaps.delete` | `googlesearchconsole.api.sitemaps.delete` | `destructive` | Remove a sitemap from the property, which stops Google using it to discover pages |
| `sitemaps.get` | `googlesearchconsole.api.sitemaps.get` | `read` | Read one submitted sitemap |
| `sitemaps.list` | `googlesearchconsole.api.sitemaps.list` | `read` | List the sitemaps submitted for a property, with their errors and warnings |
| `sitemaps.submit` | `googlesearchconsole.api.sitemaps.submit` | `write` | Submit a sitemap URL, which asks Google to fetch it. Sending one already listed refreshes its status |
| `sites.add` | `googlesearchconsole.api.sites.add` | `write` | Add a property the account already controls to the API's property list. It does not verify ownership |
| `sites.delete` | `googlesearchconsole.api.sites.delete` | `destructive` | Remove a property from the account, which also drops its Search Console data. It can be added back only after being verified again |
| `sites.get` | `googlesearchconsole.api.sites.get` | `read` | Read one property and the permission level on it |
| `sites.list` | `googlesearchconsole.api.sites.list` | `read` | List the properties the credentials can reach, with the permission level on each |
| `urlInspection.inspect` | `googlesearchconsole.api.urlInspection.inspect` | `read` | Inspect one URL: whether Google indexed it, the canonical it chose, and any mobile-usability, rich-result or AMP issues |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googlesearchconsole

## License

Apache-2.0
