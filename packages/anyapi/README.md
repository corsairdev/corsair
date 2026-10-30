# @corsair-dev/anyapi

AnyAPI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/anyapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getBalance` | `anyapi.api.account.getBalance` | `read` | Get the AnyAPI wallet balance in USD |
| `apis.get` | `anyapi.api.apis.get` | `read` | Get one AnyAPI endpoint by SKU: its input and output JSON Schema, price and recent latency |
| `apis.list` | `anyapi.api.apis.list` | `read` | List AnyAPI endpoints, optionally in one category, with their SKUs and prices |
| `apis.quote` | `anyapi.api.apis.quote` | `read` | Price an AnyAPI run for an exact input and validate the input, without running or charging anything |
| `apis.run` | `anyapi.api.apis.run` | `read` | Run any AnyAPI endpoint by SKU with its input (read the schema with apis.get first); returns the result, its USD cost and a resultId |
| `apis.search` | `anyapi.api.apis.search` | `read` | Search the AnyAPI catalog of 470+ data endpoints by what you need, such as linkedin company employees; returns SKUs with prices |
| `google.search` | `anyapi.api.google.search` | `read` | Search Google and get organic results (title, link, snippet), with country, language, location and time filters |
| `instagram.getProfile` | `anyapi.api.instagram.getProfile` | `read` | Get an Instagram profile by handle: bio, follower, following and post counts, verified and business flags |
| `linkedin.getCompany` | `anyapi.api.linkedin.getCompany` | `read` | Get a LinkedIn company page by URL: description, industry, website, employee and follower counts, locations |
| `linkedin.getProfile` | `anyapi.api.linkedin.getProfile` | `read` | Get a LinkedIn profile by URL: headline, about, location, followers, experience, education and skills |
| `maps.search` | `anyapi.api.maps.search` | `read` | Search Google Maps places in a location: name, address, phone, website, rating and review count |
| `reddit.search` | `anyapi.api.reddit.search` | `read` | Search Reddit posts across all subreddits, with sort and time filters |
| `requests.get` | `anyapi.api.requests.get` | `read` | Get the status and, once finished, the result of a durable AnyAPI run that answered queued or running |
| `results.get` | `anyapi.api.results.get` | `read` | Re-read and re-shape a run result for free (fields, maxItems, summary, jq) within about 15 minutes of the run |
| `twitter.search` | `anyapi.api.twitter.search` | `read` | Search X (Twitter) posts with advanced-search syntax, Latest or Top, with paging |
| `web.scrape` | `anyapi.api.web.scrape` | `read` | Scrape any web page, including ones that block bots, as clean markdown and/or HTML |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/anyapi

## License

Apache-2.0
