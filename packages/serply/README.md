# @corsair-dev/serply

Serply plugin for Corsair: Google web, news, image, video, maps, jobs and Scholar search, Bing, products, eBay, Reddit reads and page fetch.

## Install

```bash
pnpm add @corsair-dev/serply
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `articles.search` | `serply.api.articles.search` | `read` | Search Google Scholar articles and store them. Each uncached call spends Serply credits. |
| `bing.search` | `serply.api.bing.search` | `read` | Search Bing. Each uncached call spends Serply credits. |
| `ebay.search` | `serply.api.ebay.search` | `read` | Search eBay listings with price, condition and seller. Each uncached call spends Serply credits. |
| `images.search` | `serply.api.images.search` | `read` | Search Google Images (up to 20 per call) and store the results. Each uncached call spends Serply credits. |
| `jobs.search` | `serply.api.jobs.search` | `read` | Search Google Jobs by title and location. Each uncached call spends Serply credits. |
| `news.search` | `serply.api.news.search` | `read` | Search Google News, optionally resolving links to the publisher URL. Each uncached call spends Serply credits. |
| `pages.fetch` | `serply.api.pages.fetch` | `read` | Fetch a web page through Serply as markdown or HTML. Each uncached call spends Serply credits. |
| `places.search` | `serply.api.places.search` | `read` | Search Google Maps places and store them. Each uncached call spends Serply credits. |
| `products.search` | `serply.api.products.search` | `read` | Search products with prices, ratings and links. Each uncached call spends Serply credits. |
| `reddit.comments` | `serply.api.reddit.comments` | `read` | Get the comment thread of a Reddit post. Each uncached call spends Serply credits. |
| `reddit.post` | `serply.api.reddit.post` | `read` | Get one Reddit post, optionally with its comments. Each uncached call spends Serply credits. |
| `reddit.subredditAbout` | `serply.api.reddit.subredditAbout` | `read` | Get a subreddit description and subscriber count. Each uncached call spends Serply credits. |
| `reddit.subredditPosts` | `serply.api.reddit.subredditPosts` | `read` | List posts in a subreddit, sorted and paged. Each uncached call spends Serply credits. |
| `reddit.userPosts` | `serply.api.reddit.userPosts` | `read` | List a Reddit user public posts and comments. Each uncached call spends Serply credits. |
| `videos.search` | `serply.api.videos.search` | `read` | Search Google Videos. Each uncached call spends Serply credits. |
| `web.search` | `serply.api.web.search` | `read` | Search Google: organic results, ads, AI overview and related questions. Each uncached call spends Serply credits. |

## Auth

Auth: a Serply API key (app.serply.io), sent as `X-Api-Key`. Each uncached call spends one credit.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/serply

## License

Apache-2.0
