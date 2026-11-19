# @corsair-dev/litescrape

LiteScrape plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/litescrape
```

## How it is built

The 200 data operations come from Litescrape's published OpenAPI spec
(https://api.litescrape.com/api/openapi.json, fetched 2026-11-19):

- `litescrape-manifest.json` holds each operation's route, request body schema
  and response schema (identical response models merged, UI metadata dropped).
- `endpoints/operation-types.ts` and `endpoints/catalog.ts` are generated from
  the same spec: input and output types, the endpoint tree and descriptions.
- Zod schemas are built from the manifest on first use, one operation at a
  time (`endpoints/openapi-schema.ts`), so loading the plugin stays cheap.

Inputs follow the request bodies exactly (required fields, enums, limits, no
unknown keys). Every operation is sent as a JSON `POST`, the form that carries
arrays and nested objects. `timeout` (seconds, at most 90) goes in the query
string. Responses keep the documented types, but every field may be missing or
`null`, and unknown fields pass through.

Left out on purpose: the async job and batch routes (the sync routes cover the
same data), the Serper-compatible routes (`/search`, `/maps` and so on, which
duplicate Google), billing and key management (checkout, auto top-up, rotate,
ZDR), and four routes the spec marks gone (410): Amazon featured and media
reviews, TikTok keyword and top search.

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `airbnb.search` | `litescrape.api.airbnb.search` | `read` | Search Airbnb stays by destination and dates |
| `aliexpress.product` | `litescrape.api.aliexpress.product` | `read` | Get an AliExpress product's details and price (Alpha) |
| `aliexpress.search` | `litescrape.api.aliexpress.search` | `read` | Search AliExpress products with prices (Alpha) |
| `allkeyshop.product` | `litescrape.api.allkeyshop.product` | `read` | Get Allkeyshop product details, prices, and available offers |
| `allkeyshop.search` | `litescrape.api.allkeyshop.search` | `read` | Search Allkeyshop products with prices and product links |
| `amazon.autocomplete` | `litescrape.api.amazon.autocomplete` | `read` | Get Amazon search suggestions for a prefix and department (Alpha) |
| `amazon.product` | `litescrape.api.amazon.product` | `read` | Get an Amazon product page, with optional seller offers (Alpha) |
| `amazon.search` | `litescrape.api.amazon.search` | `read` | Search Amazon products (Alpha) |
| `apartments.property` | `litescrape.api.apartments.property` | `read` | Get an Apartments.com property by URL (Alpha) |
| `apartments.search` | `litescrape.api.apartments.search` | `read` | Search Apartments.com listings from a search URL (Alpha) |
| `appleAppStore.product` | `litescrape.api.appleAppStore.product` | `read` | Get an Apple App Store product page with version history and privacy labels (Alpha) |
| `appleAppStore.reviews` | `litescrape.api.appleAppStore.reviews` | `read` | Get Apple App Store reviews, newest or most helpful first (Alpha) |
| `appleAppStore.search` | `litescrape.api.appleAppStore.search` | `read` | Search the Apple App Store for apps with developer, price and rating (Alpha) |
| `appleMaps.places` | `litescrape.api.appleMaps.places` | `read` | Get Apple Maps places by MUID with address, hours and ratings |
| `appleMaps.reviews` | `litescrape.api.appleMaps.reviews` | `read` | Get Apple Maps rating summary and written reviews by MUID |
| `ashby.search` | `litescrape.api.ashby.search` | `read` | Search jobs on a company's Ashby job board |
| `baidu.search` | `litescrape.api.baidu.search` | `read` | Get Baidu search results as JSON |
| `bestbuy.product` | `litescrape.api.bestbuy.product` | `read` | Get a Best Buy product's details, price and availability (Alpha) |
| `bestbuy.search` | `litescrape.api.bestbuy.search` | `read` | Search Best Buy products with prices and availability (Alpha) |
| `bing.autocomplete` | `litescrape.api.bing.autocomplete` | `read` | Get Bing search suggestions for a partial query, with entity details when Bing shows them |
| `bing.images` | `litescrape.api.bing.images` | `read` | Search Bing Images with size, color, date and license filters |
| `bing.maps` | `litescrape.api.bing.maps` | `read` | Get Bing Maps listings by query or one place by ID |
| `bing.product` | `litescrape.api.bing.product` | `read` | Get a Bing Shopping product's details using its product token |
| `bing.search` | `litescrape.api.bing.search` | `read` | Search Bing for organic results, knowledge cards and rich modules |
| `bing.shopping` | `litescrape.api.bing.shopping` | `read` | Search Bing Shopping products |
| `bluesky.followers` | `litescrape.api.bluesky.followers` | `read` | List the public followers of a Bluesky account |
| `bluesky.posts` | `litescrape.api.bluesky.posts` | `read` | Read public posts from a Bluesky account with pagination |
| `bluesky.profile` | `litescrape.api.bluesky.profile` | `read` | Get a public Bluesky profile and follower counts |
| `booking.detail` | `litescrape.api.booking.detail` | `read` | Get property photos, facilities, policies, review summaries, guest questions, and a quote for selected dates and guests |
| `booking.rooms` | `litescrape.api.booking.rooms` | `read` | Get room types and available rate options for a property stay, including capacity, beds, facilities, prices, and cancellation terms |
| `booking.search` | `litescrape.api.booking.search` | `read` | Search accommodations by destination and stay, with locations, prices, rate terms, ratings, and room configurations |
| `brave.aiMode` | `litescrape.api.brave.aiMode` | `read` | Get Brave AI answers with citations |
| `brave.search` | `litescrape.api.brave.search` | `read` | Get Brave web search results |
| `copilot.chat` | `litescrape.api.copilot.chat` | `read` | Text completions through Microsoft Copilot (Alpha) |
| `duckduckgo.maps` | `litescrape.api.duckduckgo.maps` | `read` | Get DuckDuckGo Maps places within a bounding box |
| `duckduckgo.search` | `litescrape.api.duckduckgo.search` | `read` | Search DuckDuckGo for organic results with region and safe-search controls |
| `ebay.product` | `litescrape.api.ebay.product` | `read` | Get an eBay listing by item ID |
| `ebay.search` | `litescrape.api.ebay.search` | `read` | Search eBay listings by keyword or category |
| `ebay.seller` | `litescrape.api.ebay.seller` | `read` | Get an eBay seller's profile and listings |
| `etsy.product` | `litescrape.api.etsy.product` | `read` | Get an Etsy listing's details and price (Alpha) |
| `etsy.search` | `litescrape.api.etsy.search` | `read` | Search Etsy listings with prices (Alpha) |
| `eventbrite.search` | `litescrape.api.eventbrite.search` | `read` | Search Eventbrite events by location and keyword |
| `facebook.hashtagPosts` | `litescrape.api.facebook.hashtagPosts` | `read` | Get public Facebook posts for a hashtag (Alpha) |
| `facebook.marketplaceBrowse` | `litescrape.api.facebook.marketplaceBrowse` | `read` | Browse or search Facebook Marketplace listings by city (Alpha) |
| `facebook.pagePosts` | `litescrape.api.facebook.pagePosts` | `read` | Get recent public posts from a Facebook Page (Alpha) |
| `facebook.post` | `litescrape.api.facebook.post` | `read` | Get a public Facebook post by its URL (Alpha) |
| `facebook.reel` | `litescrape.api.facebook.reel` | `read` | Get a public Facebook reel by its URL (Alpha) |
| `facebook.searchPages` | `litescrape.api.facebook.searchPages` | `read` | Search public Facebook Pages by name (Alpha) |
| `facebook.searchProfiles` | `litescrape.api.facebook.searchProfiles` | `read` | Search public Facebook profiles by name (Alpha) |
| `farmavazquez.product` | `litescrape.api.farmavazquez.product` | `read` | Get FarmaVázquez product details, prices, and available offers |
| `farmavazquez.search` | `litescrape.api.farmavazquez.search` | `read` | Search FarmaVázquez products with prices and product links |
| `github.issues` | `litescrape.api.github.issues` | `read` | List repository issues and pull requests with their authors and labels |
| `github.releases` | `litescrape.api.github.releases` | `read` | List repository releases and downloadable assets |
| `github.repository` | `litescrape.api.github.repository` | `read` | Get repository details, stars, forks, topics, and activity dates |
| `github.search` | `litescrape.api.github.search` | `read` | Search public GitHub repositories by keywords and qualifiers |
| `github.user` | `litescrape.api.github.user` | `read` | Get a public GitHub user or organization profile |
| `glassdoor.search` | `litescrape.api.glassdoor.search` | `read` | Search Glassdoor jobs by keyword and location, with salary, seniority and remote filters |
| `google.ads` | `litescrape.api.google.ads` | `read` | Get Google text, local and shopping ads plus the rest of the results page (Alpha) |
| `google.aiMode` | `litescrape.api.google.aiMode` | `read` | Ask Google AI Mode a question and get text blocks with cited references |
| `google.aiOverview` | `litescrape.api.google.aiOverview` | `read` | Get Google's AI Overview for a query as text blocks and cited references |
| `google.autocomplete` | `litescrape.api.google.autocomplete` | `read` | Get search suggestions for a partial query |
| `google.flights` | `litescrape.api.google.flights` | `read` | Search flights with passenger fares, multiple airports, airline logos, emissions, price insights, compatible return itineraries and booking links |
| `google.gemini` | `litescrape.api.google.gemini` | `read` | Get a completed text reply from Gemini |
| `google.images` | `litescrape.api.google.images` | `read` | Search Google Images. Embedded images may use an x-raw-image:/// reference in original instead of an HTTP URL; thumbnail remains an HTTP image URL |
| `google.jobs` | `litescrape.api.google.jobs` | `read` | Search Google Jobs listings by query and location, including descriptions and application links when available |
| `google.local` | `litescrape.api.google.local` | `read` | Get Google local results with rating, reviews, category, address and place IDs |
| `google.news` | `litescrape.api.google.news` | `read` | Find recent news articles by topic, language, and country |
| `google.patents` | `litescrape.api.google.patents` | `read` | Search patent publications by query, patent office, status, and publication date |
| `google.reverseImageSearch` | `litescrape.api.google.reverseImageSearch` | `read` | Find visually similar images and pages using an image URL |
| `google.scholar` | `litescrape.api.google.scholar` | `read` | Search scholarly articles with publication details, citation counts, and full-text links |
| `google.search` | `litescrape.api.google.search` | `read` | Search Google for organic results, Knowledge Graph, related searches and the AI Overview |
| `google.shopping` | `litescrape.api.google.shopping` | `read` | Get Google Shopping products with price, merchant, rating and delivery |
| `google.shoppingMerchantUrls` | `litescrape.api.google.shoppingMerchantUrls` | `read` | Get direct merchant URLs for Google Shopping offers |
| `google.shoppingProduct` | `litescrape.api.google.shoppingProduct` | `read` | Get one Google Shopping product page with every merchant offer and specification |
| `google.trends` | `litescrape.api.google.trends` | `read` | Get currently trending searches and related news by country |
| `googleMaps.contributorReviews` | `litescrape.api.googleMaps.contributorReviews` | `read` | Get the public review history for one Google Maps contributor |
| `googleMaps.menu` | `litescrape.api.googleMaps.menu` | `read` | Get a restaurant's menu, prices, booking links, and opening hours |
| `googleMaps.photoMeta` | `litescrape.api.googleMaps.photoMeta` | `read` | Get the place, contributor and date of a Google Maps photo |
| `googleMaps.photos` | `litescrape.api.googleMaps.photos` | `read` | List a place's photos and videos, including only the ones its owner posted |
| `googleMaps.popularTimes` | `litescrape.api.googleMaps.popularTimes` | `read` | See how busy a Google Maps place is right now |
| `googleMaps.posts` | `litescrape.api.googleMaps.posts` | `read` | Read the posts published by a Google Maps business |
| `googleMaps.reviews` | `litescrape.api.googleMaps.reviews` | `read` | Get Google Maps reviews with rating, text, author, date and likes |
| `googleMaps.search` | `litescrape.api.googleMaps.search` | `read` | Get Google Maps places by query or one place by ID |
| `googlePlay.apps` | `litescrape.api.googlePlay.apps` | `read` | Search and browse Google Play apps with charts, categories and storefronts (Alpha) |
| `googlePlay.books` | `litescrape.api.googlePlay.books` | `read` | Browse Google Play ebooks and audiobooks with categories and charts (Alpha) |
| `googlePlay.games` | `litescrape.api.googlePlay.games` | `read` | Browse Google Play games by category, chart and device (Alpha) |
| `googlePlay.movies` | `litescrape.api.googlePlay.movies` | `read` | Browse Google Play movies, shows and episodes with categories and charts (Alpha) |
| `googlePlay.product` | `litescrape.api.googlePlay.product` | `read` | Get a Google Play product page with ratings, permissions, media and reviews (Alpha) |
| `googlePlay.reviews` | `litescrape.api.googlePlay.reviews` | `read` | Get Google Play reviews filtered by rating and platform (Alpha) |
| `greenhouse.job` | `litescrape.api.greenhouse.job` | `read` | Get a public Greenhouse job description, departments, published pay ranges, and application questions |
| `greenhouse.jobs` | `litescrape.api.greenhouse.jobs` | `read` | List public employer jobs and filter by title or location |
| `hackernews.item` | `litescrape.api.hackernews.item` | `read` | Get a Hacker News story, comment, job, or poll by ID |
| `hackernews.stories` | `litescrape.api.hackernews.stories` | `read` | Get ranked Hacker News stories with scores and discussion IDs |
| `hackernews.user` | `litescrape.api.hackernews.user` | `read` | Get a public Hacker News profile and recent submitted item IDs |
| `homedepot.product` | `litescrape.api.homedepot.product` | `read` | Get a Home Depot product's details, price and availability (Alpha) |
| `homedepot.search` | `litescrape.api.homedepot.search` | `read` | Search Home Depot products with prices and availability (Alpha) |
| `homes.property` | `litescrape.api.homes.property` | `read` | Get a Homes.com property by URL (Alpha) |
| `homes.search` | `litescrape.api.homes.search` | `read` | Search Homes.com listings from a search URL (Alpha) |
| `idealo.product` | `litescrape.api.idealo.product` | `read` | Get Idealo Italy product details, prices, and available offers |
| `idealo.search` | `litescrape.api.idealo.search` | `read` | Search Idealo Italy products with prices and product links |
| `ikea.product` | `litescrape.api.ikea.product` | `read` | Get an IKEA product's details, price and availability (Alpha) |
| `ikea.search` | `litescrape.api.ikea.search` | `read` | Search IKEA products with prices and availability (Alpha) |
| `indeed.search` | `litescrape.api.indeed.search` | `read` | Search Indeed jobs by keyword and location, with salary, experience and remote filters |
| `instagram.embed` | `litescrape.api.instagram.embed` | `read` | Retrieve public Instagram embed data (Alpha) |
| `instagram.post` | `litescrape.api.instagram.post` | `read` | Retrieve public Instagram post data (Alpha) |
| `instagram.posts` | `litescrape.api.instagram.posts` | `read` | Retrieve public Instagram posts data (Alpha) |
| `instagram.profile` | `litescrape.api.instagram.profile` | `read` | Retrieve public Instagram profile data (Alpha) |
| `instagram.profilePostCount` | `litescrape.api.instagram.profilePostCount` | `read` | Retrieve public Instagram profile post count data (Alpha) |
| `instagram.searchPopular` | `litescrape.api.instagram.searchPopular` | `read` | Get popular Instagram posts for a search topic (Alpha) |
| `keys.status` | `litescrape.api.keys.status` | `read` | Get LiteScrape key status, remaining calls and concurrency limit |
| `keys.usage` | `litescrape.api.keys.usage` | `read` | Get call usage for the key over the last 24 hours to 90 days |
| `kroger.product` | `litescrape.api.kroger.product` | `read` | Get a Kroger product's details, price and availability (Alpha) |
| `kroger.search` | `litescrape.api.kroger.search` | `read` | Search Kroger products with prices and availability (Alpha) |
| `levels.search` | `litescrape.api.levels.search` | `read` | Search Levels.fyi jobs by company, location, level and pay |
| `lever.jobs` | `litescrape.api.lever.jobs` | `read` | Page through an employer's public jobs, descriptions, and application links |
| `linkedin.company` | `litescrape.api.linkedin.company` | `read` | Read public company profiles with follower and employee counts, office locations, and similar companies |
| `linkedin.companyPosts` | `litescrape.api.linkedin.companyPosts` | `read` | Read recent public company posts and reposts with reaction and comment counts, authors, and media |
| `linkedin.job` | `litescrape.api.linkedin.job` | `read` | Get a public LinkedIn job description, employment details, published salary, and applicant count |
| `linkedin.jobs` | `litescrape.api.linkedin.jobs` | `read` | Search public LinkedIn job listings by keywords, location, and workplace type |
| `naturitas.product` | `litescrape.api.naturitas.product` | `read` | Get Naturitas product details, prices, pack discounts, ratings, and categories |
| `naturitas.search` | `litescrape.api.naturitas.search` | `read` | Search Naturitas products with prices, discounts, ratings, and product links |
| `naver.aiOverview` | `litescrape.api.naver.aiOverview` | `read` | Get Naver AI Briefing answers with citations |
| `naver.search` | `litescrape.api.naver.search` | `read` | Search Naver web, news, video and image results |
| `npm.package` | `litescrape.api.npm.package` | `read` | Get an npm package version and its dependencies |
| `npm.search` | `litescrape.api.npm.search` | `read` | Search npm packages by keywords and qualifiers |
| `pinterest.profile` | `litescrape.api.pinterest.profile` | `read` | Get a public Pinterest profile, biography, and follower counts |
| `producthunt.launches` | `litescrape.api.producthunt.launches` | `read` | Read today's public launches with product names, links, and taglines |
| `pypi.project` | `litescrape.api.pypi.project` | `read` | Get Python package metadata and release files from PyPI |
| `realtor.property` | `litescrape.api.realtor.property` | `read` | Get a Realtor.com property by URL (Alpha) |
| `realtor.search` | `litescrape.api.realtor.search` | `read` | Search Realtor.com listings from a search URL (Alpha) |
| `reddit.post` | `litescrape.api.reddit.post` | `read` | Get a public Reddit post and available discussion comments |
| `reddit.search` | `litescrape.api.reddit.search` | `read` | Search public Reddit posts by keywords, sort order, and time range |
| `reddit.subredditPosts` | `litescrape.api.reddit.subredditPosts` | `read` | Read public posts from a subreddit with pagination |
| `redfin.property` | `litescrape.api.redfin.property` | `read` | Get a Redfin property by listing URL |
| `redfin.search` | `litescrape.api.redfin.search` | `read` | Search Redfin homes for sale or recently sold |
| `remoteok.jobs` | `litescrape.api.remoteok.jobs` | `read` | Find remote jobs by keywords and tags |
| `shopify.products` | `litescrape.api.shopify.products` | `read` | Page through published product catalogs with variants, prices, and availability |
| `soundcloud.track` | `litescrape.api.soundcloud.track` | `read` | Read public track metadata, duration, and available engagement counts |
| `spotify.item` | `litescrape.api.spotify.item` | `read` | Read public track, album, artist, and playlist metadata and available track lists |
| `sprouts.product` | `litescrape.api.sprouts.product` | `read` | Get a Sprouts product's details, price and availability (Alpha) |
| `sprouts.search` | `litescrape.api.sprouts.search` | `read` | Search Sprouts products with prices and availability (Alpha) |
| `stackoverflow.answers` | `litescrape.api.stackoverflow.answers` | `read` | Read answers to a Stack Overflow question with pagination |
| `stackoverflow.comments` | `litescrape.api.stackoverflow.comments` | `read` | Read comments on a Stack Overflow question with pagination |
| `stackoverflow.question` | `litescrape.api.stackoverflow.question` | `read` | Get a Stack Overflow question, its text, tags, and statistics |
| `stackoverflow.search` | `litescrape.api.stackoverflow.search` | `read` | Search Stack Overflow questions by keywords and tags |
| `steam.app` | `litescrape.api.steam.app` | `read` | Get Steam app details, descriptions, publishers, and regional prices |
| `steam.search` | `litescrape.api.steam.search` | `read` | Find Steam games and software with regional pricing |
| `substack.posts` | `litescrape.api.substack.posts` | `read` | Page through public publication archives with titles, dates, and engagement counts |
| `target.product` | `litescrape.api.target.product` | `read` | Get a product sold by the US retailer Target, with its details, price and availability (Alpha) |
| `target.search` | `litescrape.api.target.search` | `read` | Search products sold by the US retailer Target, with prices and availability (Alpha) |
| `telegram.posts` | `litescrape.api.telegram.posts` | `read` | Read public channel posts with dates, text, and displayed view counts |
| `tiktok.collectionVideos` | `litescrape.api.tiktok.collectionVideos` | `read` | Page through posts saved in a public TikTok collection (Alpha) |
| `tiktok.commentReplies` | `litescrape.api.tiktok.commentReplies` | `read` | Page through replies to a TikTok comment (Alpha) |
| `tiktok.comments` | `litescrape.api.tiktok.comments` | `read` | Page through public comments on a TikTok post (Alpha) |
| `tiktok.followers` | `litescrape.api.tiktok.followers` | `read` | Page through public followers of a TikTok user (Alpha) |
| `tiktok.following` | `litescrape.api.tiktok.following` | `read` | Page through the public accounts a TikTok user follows (Alpha) |
| `tiktok.live` | `litescrape.api.tiktok.live` | `read` | Get a TikTok live room's status and metrics (Alpha) |
| `tiktok.profile` | `litescrape.api.tiktok.profile` | `read` | Get public TikTok profile fields and statistics by handle or numeric user ID (Alpha) |
| `tiktok.profileVideos` | `litescrape.api.tiktok.profileVideos` | `read` | Page through posts from a public TikTok profile by handle or numeric user ID (Alpha) |
| `tiktok.searchHashtag` | `litescrape.api.tiktok.searchHashtag` | `read` | Resolve a public hashtag and page through its posts (Alpha) |
| `tiktok.searchSuggestions` | `litescrape.api.tiktok.searchSuggestions` | `read` | Get public TikTok autocomplete suggestions in order (Alpha) |
| `tiktok.song` | `litescrape.api.tiktok.song` | `read` | Get a TikTok sound's details and usage count (Alpha) |
| `tiktok.songVideos` | `litescrape.api.tiktok.songVideos` | `read` | Page through TikTok posts that use a sound (Alpha) |
| `tiktok.transcript` | `litescrape.api.tiktok.transcript` | `read` | Get public TikTok captions with timed segments (Alpha) |
| `tiktok.trendingFeed` | `litescrape.api.tiktok.trendingFeed` | `read` | Get TikTok's trending feed (Alpha) |
| `tiktok.userLive` | `litescrape.api.tiktok.userLive` | `read` | Get a TikTok user's live status and room metadata (Alpha) |
| `tiktok.video` | `litescrape.api.tiktok.video` | `read` | Get a TikTok video or photo post with its media and metrics (Alpha) |
| `tripadvisor.place` | `litescrape.api.tripadvisor.place` | `read` | Get Tripadvisor place details by place ID |
| `tripadvisor.reviews` | `litescrape.api.tripadvisor.reviews` | `read` | Get Tripadvisor reviews sorted by recency or relevance |
| `tripadvisor.search` | `litescrape.api.tripadvisor.search` | `read` | Search Tripadvisor hotels, restaurants and attractions |
| `walmart.product` | `litescrape.api.walmart.product` | `read` | Get a Walmart product's details, price and availability (Alpha) |
| `walmart.search` | `litescrape.api.walmart.search` | `read` | Search Walmart products with prices and availability (Alpha) |
| `wayfair.product` | `litescrape.api.wayfair.product` | `read` | Get a Wayfair product's details, price and availability (Alpha) |
| `wayfair.search` | `litescrape.api.wayfair.search` | `read` | Search Wayfair products with prices and availability (Alpha) |
| `web.fetch` | `litescrape.api.web.fetch` | `read` | Render a public web page and return it as Markdown, HTML or text (Alpha) |
| `web.screenshot` | `litescrape.api.web.screenshot` | `read` | Capture a web page screenshot as a PNG download URL (Alpha) |
| `wholefoods.product` | `litescrape.api.wholefoods.product` | `read` | Get a Whole Foods product's details, price and availability (Alpha) |
| `wholefoods.search` | `litescrape.api.wholefoods.search` | `read` | Search Whole Foods products with prices and availability (Alpha) |
| `wikipedia.article` | `litescrape.api.wikipedia.article` | `read` | Get the text of a Wikipedia article in a selected language |
| `wikipedia.search` | `litescrape.api.wikipedia.search` | `read` | Search Wikipedia articles in a selected language |
| `workday.jobs` | `litescrape.api.workday.jobs` | `read` | Search an employer's Workday career board with result totals and pagination |
| `x.community` | `litescrape.api.x.community` | `read` | Get X community details, including its creator, member count and rules (Alpha) |
| `x.communityPosts` | `litescrape.api.x.communityPosts` | `read` | Get posts from an X community, including authors, engagement and media (Alpha) |
| `x.post` | `litescrape.api.x.post` | `read` | Get an X post with its text, author, engagement counts and media (Alpha) |
| `x.profile` | `litescrape.api.x.profile` | `read` | Get a public X profile, including its bio, follower counts and profile images (Alpha) |
| `x.userPosts` | `litescrape.api.x.userPosts` | `read` | Get posts from an X user (Alpha) |
| `yahoo.financeHistory` | `litescrape.api.yahoo.financeHistory` | `read` | Read daily, weekly, or monthly prices and volume for a market symbol |
| `yahoo.images` | `litescrape.api.yahoo.images` | `read` | Search Yahoo Images |
| `yahoo.search` | `litescrape.api.yahoo.search` | `read` | Get Yahoo web search results |
| `yandex.images` | `litescrape.api.yandex.images` | `read` | Search Yandex Images, including reverse image search |
| `yandex.search` | `litescrape.api.yandex.search` | `read` | Get Yandex web search results |
| `yelp.place` | `litescrape.api.yelp.place` | `read` | Get a Yelp business's details and menu |
| `yelp.reviews` | `litescrape.api.yelp.reviews` | `read` | Get Yelp reviews with rating, text, reviewer and owner replies |
| `yelp.search` | `litescrape.api.yelp.search` | `read` | Search Yelp businesses with rating, reviews, categories and filters |
| `youtube.channel` | `litescrape.api.youtube.channel` | `read` | Get a YouTube channel's profile, videos, Shorts, playlists and posts |
| `youtube.comments` | `litescrape.api.youtube.comments` | `read` | Read public YouTube video comments with pagination |
| `youtube.search` | `litescrape.api.youtube.search` | `read` | Search YouTube videos, channels, playlists and Shorts |
| `youtube.video` | `litescrape.api.youtube.video` | `read` | Get a public YouTube video title, description, channel, and view count |
| `zillow.locations` | `litescrape.api.zillow.locations` | `read` | Get Zillow region and address suggestions |
| `zillow.property` | `litescrape.api.zillow.property` | `read` | Get a Zillow property by ID or URL |
| `zillow.search` | `litescrape.api.zillow.search` | `read` | Search Zillow homes for sale, for rent or recently sold |
| `ziprecruiter.search` | `litescrape.api.ziprecruiter.search` | `read` | Search ZipRecruiter jobs in the US and Canada by keyword and location |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/litescrape

## License

Apache-2.0
