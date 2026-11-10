# @corsair-dev/zenrows

ZenRows plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zenrows
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.subscription` | `zenrows.api.account.subscription` | `read` | Read the plan behind the key: credits used and allowed, period end, per-product usage and the concurrency limit |
| `crawl.get` | `zenrows.api.crawl.get` | `read` | Read a crawl with its coverage and one page of results; poll it with the same cursor to collect new URLs |
| `crawl.getContent` | `zenrows.api.crawl.getContent` | `read` | Read one kept page of a crawl, in the crawl's output format |
| `crawl.list` | `zenrows.api.crawl.list` | `read` | List crawls, newest first, without their results |
| `crawl.start` | `zenrows.api.crawl.start` | `write` | Start a crawl from one URL: each page it opens is a billed Fetch request, and a crawl runs until its page limits stop it |
| `crawl.stop` | `zenrows.api.crawl.stop` | `write` | Stop a running crawl. Pages already being fetched finish and are billed |
| `extract.allowance` | `zenrows.api.extract.allowance` | `read` | Read how many domain preparations this account has left this month |
| `extract.domains` | `zenrows.api.extract.domains` | `read` | List the sites Extract can handle today, with their verticals |
| `extract.getDomainStatus` | `zenrows.api.extract.getDomainStatus` | `read` | Read how far a domain preparation has got: preparing, ready or failed |
| `extract.listPreparedDomains` | `zenrows.api.extract.listPreparedDomains` | `read` | List the domains this account submitted for preparation, with the monthly allowance |
| `extract.prepareDomain` | `zenrows.api.extract.prepareDomain` | `write` | Ask Zenrows to prepare a domain for Extract, which takes minutes and one slot of the monthly allowance; preparation is free and shared across accounts |
| `fetch.cssExtract` | `zenrows.api.fetch.cssExtract` | `read` | Extract named fields from a page with your own CSS or XPath selectors, such as a title, a price and every link, on any site with no preparation |
| `fetch.extract` | `zenrows.api.fetch.extract` | `read` | Turn a page into structured JSON with Extract: the site's own field names, or a canonical Real Estate schema, on a domain prepared for it |
| `fetch.jsonResponse` | `zenrows.api.fetch.jsonResponse` | `read` | Capture the page and the XHR and fetch calls it made, as a JSON envelope, from a rendered page |
| `fetch.outputs` | `zenrows.api.fetch.outputs` | `read` | Pull typed data out of a page without parsing it: emails, phone numbers, links, headings, tables, metadata and more |
| `fetch.page` | `zenrows.api.fetch.page` | `read` | Fetch one page through Zenrows: HTML by default, or Markdown and plaintext, with optional browser rendering, residential proxies, geolocation and resource blocking |
| `fetch.post` | `zenrows.api.fetch.post` | `write` | Send a POST to the target through Zenrows and return its answer. Reaches the site with the caller's body, so the site's state can change |
| `fetch.put` | `zenrows.api.fetch.put` | `write` | Send a PUT to the target through Zenrows and return its answer. Reaches the site with the caller's body, so the site's state can change |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zenrows

## License

Apache-2.0
