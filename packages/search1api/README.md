# Search1API Plugin for Corsair

This package provides a Search1API integration for Corsair.

Search1API is live web data as one API: multi-engine web search, news,
agentic search, page crawling, screenshots, sitemaps, trending topics,
whole-site crawls, and schema-guided extraction — all behind a single
Bearer key at `api.search1api.com`.

## Features
- Search the web across 19 engines (Google, Bing, DuckDuckGo, YouTube,
  GitHub, arXiv, Reddit, Wikipedia, Baidu and more) with site filters,
  language, time window, pagination, images, and optional inline crawling
  of the top results.
- Run many searches or news queries in one request and read the per-query
  cost and error summary.
- Ask in plain language: the agentic endpoint picks engines, rewrites the
  query, infers a time window, and returns only ranked relevant results.
- Crawl a page to clean text, batch many URLs, or pull a site's URLs from
  its sitemap.
- Render any public page as a PNG, JPEG, or WebP with viewport, selector,
  and wait controls.
- Extract structured data from a page with a prompt and JSON schema.
- Start a 20-credit asynchronous whole-site crawl and poll its status
  until the packaged archive is ready.
- Get trending topics from GitHub or Hacker News, and check the account's
  remaining credit balance.
- Report a provider problem or feature request back to Search1API with
  `web.feedback`, and check service uptime with `account.health`.

## Setup
You need a Search1API account and an API key.

Supply it to the provider configuration:
```typescript
import { createCorsair } from 'corsair';
import { search1api } from '@corsair-dev/search1api';

export const corsair = createCorsair({
  // ...
  plugins: [
    search1api({
      key: process.env.SEARCH1API_API_KEY,
    }),
  ],
});
```

## Usage

### Search the web
```typescript
const response = await corsair.search1api.api.web.search({
  query: 'open source integration layer',
  search_service: 'duckduckgo',
  max_results: 10,
  time_range: 'month',
});

console.log(response.results[0].link, response.results[0].snippet);
```

### Ask in plain language
```typescript
const answer = await corsair.search1api.api.web.ask({
  query: 'what shipped in AI this week?',
});

console.log(answer.intent.search_query, answer.results.length);
```

### Crawl a page
```typescript
const page = await corsair.search1api.api.content.crawl({
  url: 'https://example.com/docs',
});

console.log(page.results.title, page.results.content.length);
```

### Screenshot a page
Screenshots come back as base64 bytes with their content type — write
them to disk or hand the data URL to a client:
```typescript
const shot = await corsair.search1api.api.content.screenshot({
  url: 'https://example.com',
  format: 'webp',
  full_page: true,
  viewport: { width: 1440, height: 900 },
});

await fs.writeFile('example.webp', Buffer.from(shot.base64, 'base64'));
```

### Crawl a whole site (async)
`deepcrawl.start` returns a task id immediately; poll `deepcrawl.status`
until it reports `completed` and exposes `zipUrl`:
```typescript
const task = await corsair.search1api.api.deepcrawl.start({
  url: 'https://example.com',
});

const status = await corsair.search1api.api.deepcrawl.status({
  taskId: task.taskId,
});

console.log(status.status, status.zipUrl);
```

### Check credits
```typescript
const { usage } = await corsair.search1api.api.account.usage({});
console.log(`${usage} credits left`);
```

## Quirks & Constraints
- **Credits per call**: search, news, crawl, sitemap, and trending cost 1
  credit; screenshots cost 2; ask costs 5; extract costs 10; deepcrawl
  costs 20. `usage` and `deepcrawl.status` are free. `crawl_results` on
  search/news bills one extra crawl per page.
- Rate-limited calls (429) and server errors (5xx) are retried with
  exponential backoff; the provider documents these failures as uncharged.
  Timeouts are **not** replayed, because it is unknown whether the request
  was received.
- `search_service` and `time_range` accept the empty string, which the API
  documents as "use the default".
- Search caps `max_results` at 50 with `page` up to 100; `crawl_results`
  accepts 0–50.
- A batched `crawl` returns only the URLs that succeeded, in no guaranteed
  order — match items back to your input by `crawlParameters.url`. Failed
  URLs are omitted and not charged.
- `/extract` is marked Beta by the provider and only reports the
  documented success shape.
- Web results are cached in the `searchResults` DB entity keyed by their
  link when a database is configured, so repeated searches refresh
  instead of duplicating rows.
