# @corsair-dev/worldnewsapi

World News API plugin for Corsair. Provides access to global news coverage, top headlines clustering, full article extraction, website link discovery, geolocation coordinates, website-to-RSS feeds, and news source directory lookups.

## Features

- **Top & Breaking News**: Retrieve breaking headlines clustered across sources by country and language.
- **Full Article Extraction**: Parse article web pages into structured data (title, text, images, videos, authors, sentiment, and named entities).
- **Global News Search**: Filter articles by text, author, publisher, sentiment, category, publish dates, and geographic proximity.
- **Link Discovery**: Discover all news links published on a website or news portal.
- **Geocoding for News**: Resolve location strings to latitude/longitude coordinates for radial search.
- **Website to RSS**: Transform any news website into a standard RSS 2.0 feed.
- **Production-Grade Security**: Header-based authentication (`x-api-key`), SSRF protection against private IP ranges, XXE-safe RSS parsing, and automatic rate-limit backoff.

## Auth Setup

World News API uses API key authentication. Get your API key from [World News API](https://worldnewsapi.com/).

Set your environment variable:

```bash
WORLD_NEWS_API_KEY=your_api_key_here
```

### Plugin Initialization

```ts
import { createCorsair } from 'corsair';
import { worldnewsapi } from '@corsair-dev/worldnewsapi';

const app = createCorsair({
  plugins: [
    worldnewsapi({
      // Explicit key, or automatically resolved from WORLD_NEWS_API_KEY / key manager
      key: process.env.WORLD_NEWS_API_KEY,
    }),
  ],
});
```

## Tools & Endpoints

All tools are mounted under the `news` namespace.

| Tool / Endpoint | Risk Level | Description |
| :--- | :--- | :--- |
| `news.topNews` | `read` | Retrieve top news clusters by country and language (`GET /top-news`). |
| `news.extractNews` | `read` | Extract clean article text, metadata, images, and entities from a URL (`GET /extract-news`). |
| `news.extractNewsLinks` | `read` | Extract news article URLs from a webpage or portal (`GET /extract-news-links`). |
| `news.getGeoCoordinates` | `read` | Resolve addresses/locations to geographic coordinates (`GET /geo-coordinates`). |
| `news.newsWebsiteToRssFeed` | `read` | Convert any news site or page to structured RSS 2.0 XML / items (`GET /feed.rss`). |
| `news.searchNewsSources` | `read` | Search news sources monitored by the API (`GET /search-news-sources`). |
| `news.searchNews` | `read` | Search global news articles with rich filters and pagination (`GET /search-news`). |

## Usage Examples

### 1. Retrieve Top News for a Country

```ts
const top = await app.call('worldnewsapi.news.topNews', {
  sourceCountry: 'us',
  language: 'en',
  maxNewsPerCluster: 3,
});

console.log(top.top_news);
```

### 2. Search News by Sentiment & Category

```ts
const results = await app.call('worldnewsapi.news.searchNews', {
  text: 'Artificial Intelligence',
  categories: 'technology,science',
  minSentiment: 0.2, // Positive sentiment only
  number: 10,
});

for (const article of results.news) {
  console.log(`${article.title} (${article.url})`);
}
```

### 3. Extract Full Article with Entity Analysis

```ts
const article = await app.call('worldnewsapi.news.extractNews', {
  url: 'https://www.example.com/news/article-1',
  analyze: true,
});

console.log(article.title, article.sentiment, article.entities);
```

### 4. Convert Website to RSS Feed

```ts
const feed = await app.call('worldnewsapi.news.newsWebsiteToRssFeed', {
  url: 'https://www.example.com/tech-news',
  extractNews: false,
});

console.log(`Feed Title: ${feed.title}, Items: ${feed.items.length}`);
```

## Entities & Database

Results are automatically persisted to the plugin database for caching and offline querying:
- `articles`: World news articles (`id`, `title`, `url`, `text`, `summary`, `sentiment`, `authors`, etc.)
- `extractedArticles`: Extracted article data keyed by URL
- `geoCoordinates`: Geocoded coordinates keyed by location string
- `sources`: News sources directory items

## Rate Limiting & Error Handling

- **429 Too Many Requests**: Automatically retries with exponential backoff respecting the `Retry-After` header.
- **401 Unauthorized**: Actionable logging when `WORLD_NEWS_API_KEY` is missing or invalid.
- **SSRF Protection**: Requests to local or private network ranges (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`, `169.254.0.0/16`) are blocked immediately.
- **Safe RSS Parsing**: Pure TypeScript entity decoding and XML parsing safe from entity expansion (XXE).
