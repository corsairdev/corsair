# @corsair-dev/litescrape

LiteScrape plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/litescrape
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `google.search` | `litescrape.api.google.search` | `read` | Search Google for organic results, Knowledge Graph, related searches and the AI Overview |
| `google.aiOverview` | `litescrape.api.google.aiOverview` | `read` | Get Google's AI Overview for a query as text blocks and cited references |
| `google.aiMode` | `litescrape.api.google.aiMode` | `read` | Ask Google AI Mode a question and get text blocks with cited references |
| `google.ads` | `litescrape.api.google.ads` | `read` | Get Google text, local and shopping ads plus the rest of the results page (Alpha) |
| `google.local` | `litescrape.api.google.local` | `read` | Get Google local results with rating, reviews, category, address and place IDs |
| `google.shopping` | `litescrape.api.google.shopping` | `read` | Get Google Shopping products with price, merchant, rating and delivery |
| `google.shoppingProduct` | `litescrape.api.google.shoppingProduct` | `read` | Get one Google Shopping product page with every merchant offer and specification |
| `googleMaps.search` | `litescrape.api.googleMaps.search` | `read` | Get Google Maps places by query or one place by ID |
| `googleMaps.reviews` | `litescrape.api.googleMaps.reviews` | `read` | Get Google Maps reviews with rating, text, author, date and likes |
| `googleMaps.contributorReviews` | `litescrape.api.googleMaps.contributorReviews` | `read` | Get the public review history for one Google Maps contributor |
| `googleMaps.popularTimes` | `litescrape.api.googleMaps.popularTimes` | `read` | See how busy a Google Maps place is right now |
| `googleMaps.posts` | `litescrape.api.googleMaps.posts` | `read` | Read the posts published by a Google Maps business |
| `googleMaps.photoMeta` | `litescrape.api.googleMaps.photoMeta` | `read` | Get the place, contributor and date of a Google Maps photo |
| `bing.search` | `litescrape.api.bing.search` | `read` | Search Bing for organic results, knowledge cards and rich modules |
| `bing.maps` | `litescrape.api.bing.maps` | `read` | Get Bing Maps listings by query or one place by ID |
| `duckduckgo.search` | `litescrape.api.duckduckgo.search` | `read` | Search DuckDuckGo for organic results with region and safe-search controls |
| `duckduckgo.maps` | `litescrape.api.duckduckgo.maps` | `read` | Get DuckDuckGo Maps places within a bounding box |
| `yelp.search` | `litescrape.api.yelp.search` | `read` | Search Yelp businesses with rating, reviews, categories and filters |
| `yelp.reviews` | `litescrape.api.yelp.reviews` | `read` | Get Yelp reviews with rating, text, reviewer and owner replies |
| `tripadvisor.search` | `litescrape.api.tripadvisor.search` | `read` | Search Tripadvisor hotels, restaurants and attractions |
| `tripadvisor.place` | `litescrape.api.tripadvisor.place` | `read` | Get Tripadvisor place details by place ID |
| `tripadvisor.reviews` | `litescrape.api.tripadvisor.reviews` | `read` | Get Tripadvisor reviews sorted by recency or relevance |
| `appleMaps.places` | `litescrape.api.appleMaps.places` | `read` | Get Apple Maps places by MUID with address, hours and ratings |
| `appleMaps.reviews` | `litescrape.api.appleMaps.reviews` | `read` | Get Apple Maps rating summary and written reviews by MUID |
| `googlePlay.apps` | `litescrape.api.googlePlay.apps` | `read` | Search and browse Google Play apps with charts, categories and storefronts (Alpha) |
| `googlePlay.games` | `litescrape.api.googlePlay.games` | `read` | Browse Google Play games by category, chart and device (Alpha) |
| `googlePlay.books` | `litescrape.api.googlePlay.books` | `read` | Browse Google Play ebooks and audiobooks with categories and charts (Alpha) |
| `googlePlay.movies` | `litescrape.api.googlePlay.movies` | `read` | Browse Google Play movies, shows and episodes with categories and charts (Alpha) |
| `googlePlay.product` | `litescrape.api.googlePlay.product` | `read` | Get a Google Play product page with ratings, permissions, media and reviews (Alpha) |
| `googlePlay.reviews` | `litescrape.api.googlePlay.reviews` | `read` | Get Google Play reviews filtered by rating and platform (Alpha) |
| `appleAppStore.search` | `litescrape.api.appleAppStore.search` | `read` | Search the Apple App Store for apps with developer, price and rating (Alpha) |
| `appleAppStore.product` | `litescrape.api.appleAppStore.product` | `read` | Get an Apple App Store product page with version history and privacy labels (Alpha) |
| `appleAppStore.reviews` | `litescrape.api.appleAppStore.reviews` | `read` | Get Apple App Store reviews, newest or most helpful first (Alpha) |
| `web.fetch` | `litescrape.api.web.fetch` | `read` | Render a public web page and return it as Markdown, HTML or text (Alpha) |
| `web.screenshot` | `litescrape.api.web.screenshot` | `read` | Capture a web page screenshot as a PNG download URL (Alpha) |
| `keys.status` | `litescrape.api.keys.status` | `read` | Get LiteScrape key status, remaining calls and concurrency limit |

## Auth

Auth: API key. Send it as `Authorization: Bearer <key>`. Corsair prompts your
tenant for credentials on first use.

## Webhooks

No webhooks. LiteScrape is request/response only and publishes no inbound event
verification spec.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/litescrape

## License

Apache-2.0
