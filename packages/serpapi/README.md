# @corsair-dev/serpapi

Serpapi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/serpapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `engines.baiduSearch` | `serpapi.api.engines.baiduSearch` | `read` | Baidu (Chinese search engine) results |
| `engines.bingMaps` | `serpapi.api.engines.bingMaps` | `read` | Bing Maps search for places and businesses |
| `engines.bingSearch` | `serpapi.api.engines.bingSearch` | `read` | Bing search engine results |
| `engines.duckDuckGoLightSearch` | `serpapi.api.engines.duckDuckGoLightSearch` | `read` | Fast, lightweight DuckDuckGo search |
| `engines.duckDuckGoMaps` | `serpapi.api.engines.duckDuckGoMaps` | `read` | DuckDuckGo Maps search for places and businesses |
| `engines.duckDuckGoSearch` | `serpapi.api.engines.duckDuckGoSearch` | `read` | DuckDuckGo search engine results |
| `engines.naverSearch` | `serpapi.api.engines.naverSearch` | `read` | Naver (South Korea's leading search engine) results |
| `engines.yahooSearch` | `serpapi.api.engines.yahooSearch` | `read` | Yahoo! search engine results |
| `engines.yahooVideos` | `serpapi.api.engines.yahooVideos` | `read` | Yahoo! Videos search results |
| `engines.yandexImagesSearch` | `serpapi.api.engines.yandexImagesSearch` | `read` | Yandex Images search results |
| `engines.yandexSearch` | `serpapi.api.engines.yandexSearch` | `read` | Yandex search engine results |
| `engines.youtubeSearch` | `serpapi.api.engines.youtubeSearch` | `read` | YouTube video search results |
| `marketplace.appleAppStoreSearch` | `serpapi.api.marketplace.appleAppStoreSearch` | `read` | Apple App Store search results |
| `marketplace.ebaySearch` | `serpapi.api.marketplace.ebaySearch` | `read` | eBay product listing search results |
| `marketplace.facebookProfile` | `serpapi.api.marketplace.facebookProfile` | `read` | Public information from a Facebook profile or page |
| `marketplace.openTableReviews` | `serpapi.api.marketplace.openTableReviews` | `read` | Customer reviews for an OpenTable restaurant |
| `marketplace.walmartProductReviews` | `serpapi.api.marketplace.walmartProductReviews` | `read` | Customer reviews for a Walmart product |
| `marketplace.walmartSearch` | `serpapi.api.marketplace.walmartSearch` | `read` | Walmart product listing search results |
| `marketplace.yelpSearch` | `serpapi.api.marketplace.yelpSearch` | `read` | Yelp business search results |
| `search.aboutThisResult` | `serpapi.api.search.aboutThisResult` | `read` | Google's "About this result" details for a URL |
| `search.eventSearch` | `serpapi.api.search.eventSearch` | `read` | Google Events search results |
| `search.financeSearch` | `serpapi.api.search.financeSearch` | `read` | Google Finance data for a company or ticker |
| `search.forumsSearch` | `serpapi.api.search.forumsSearch` | `read` | Google Forums discussion search results |
| `search.hotelsAutocomplete` | `serpapi.api.search.hotelsAutocomplete` | `read` | Autocomplete suggestions for Google Hotels destinations |
| `search.hotelSearch` | `serpapi.api.search.hotelSearch` | `read` | Google Hotels search results |
| `search.imageSearch` | `serpapi.api.search.imageSearch` | `read` | Google Images search results |
| `search.imagesLightSearch` | `serpapi.api.search.imagesLightSearch` | `read` | Fast, lightweight Google Images search |
| `search.imagesRelatedContent` | `serpapi.api.search.imagesRelatedContent` | `read` | Related content for a Google Images result |
| `search.jobsSearch` | `serpapi.api.search.jobsSearch` | `read` | Google Jobs search results |
| `search.lensSearch` | `serpapi.api.search.lensSearch` | `read` | Reverse image search via Google Lens |
| `search.lightSearch` | `serpapi.api.search.lightSearch` | `read` | Fast, lightweight Google Search results |
| `search.localServicesSearch` | `serpapi.api.search.localServicesSearch` | `read` | Google's guaranteed local service providers |
| `search.mapsPosts` | `serpapi.api.search.mapsPosts` | `read` | Posts published by a business on its Google Maps listing |
| `search.mapsSearch` | `serpapi.api.search.mapsSearch` | `read` | Google Maps search for places and businesses |
| `search.newsSearch` | `serpapi.api.search.newsSearch` | `read` | Google News article search results |
| `search.patentDetails` | `serpapi.api.search.patentDetails` | `read` | Detailed information for a specific Google Patent |
| `search.playProduct` | `serpapi.api.search.playProduct` | `read` | Details for a specific Google Play Store item |
| `search.playSearch` | `serpapi.api.search.playSearch` | `read` | Google Play Store search results |
| `search.scholarAuthor` | `serpapi.api.search.scholarAuthor` | `read` | A researcher's full Google Scholar author profile |
| `search.scholarCite` | `serpapi.api.search.scholarCite` | `read` | Formatted citations for a Google Scholar paper |
| `search.scholarSearch` | `serpapi.api.search.scholarSearch` | `read` | Google Scholar academic search results |
| `search.search` | `serpapi.api.search.search` | `read` | Real-time Google search results |
| `search.shoppingSearch` | `serpapi.api.search.shoppingSearch` | `read` | Google Shopping product listings |
| `search.trendsSearch` | `serpapi.api.search.trendsSearch` | `read` | Google Trends relative interest data |
| `search.videosLightSearch` | `serpapi.api.search.videosLightSearch` | `read` | Fast, lightweight Google Videos search |
| `utilities.domainsList` | `serpapi.api.utilities.domainsList` | `read` | The list of supported Google domains |
| `utilities.locationOptions` | `serpapi.api.utilities.locationOptions` | `read` | Valid location values for a Google search's location parameter |
| `utilities.searchArchive` | `serpapi.api.utilities.searchArchive` | `read` | Results from a previously run async search, by search id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/serpapi

## License

Apache-2.0
