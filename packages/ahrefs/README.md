# @corsair-dev/ahrefs

Ahrefs SEO metrics and backlink data through Corsair.

## Installation

```bash
pnpm install @corsair-dev/ahrefs
```

## Quick Start

```ts
import { createCorsair } from 'corsair';
import { ahrefs } from '@corsair-dev/ahrefs';

const corsair = createCorsair({
  kek: process.env.CORSAIR_KEK!,
  multiTenancy: false,
  plugins: [
    ahrefs({
      authType: 'api_key',
      key: process.env.AHREFS_API_KEY,
    }),
  ],
});

// Get domain rating
const domainRating = await corsair.ahrefs.api.siteExplorer.getDomainRating({
  target: 'example.com',
  date: '2024-01-01',
});

console.log(domainRating.domain_rating.domain_rating); // 0-100
console.log(domainRating.domain_rating.ahrefs_rank);
```

## API Endpoints

### Site Explorer

- **getDomainRating** - Get Ahrefs Domain Rating and Ahrefs Rank
- **backlinksStats** - Get backlink and referring domain counts
- **organicKeywords** - List organic keywords with positions and traffic
- **refdomains** - List referring domains
- **topPages** - List top organic pages

### Keywords Explorer

- **overview** - Get keyword metrics (volume, difficulty, CPC, etc.)

### Rank Tracker

- **overview** - Get Rank Tracker keyword data for a project

### SERP Overview

- **overview** - Get SERP positions for a keyword

### Subscription Info

- **limitsAndUsage** - Get API usage and limits

## Database

Query synced data across 7 entities:

```ts
// Domain metrics
const domains = await corsair.ahrefs.db.domainMetrics.list();

// Keywords
const keywords = await corsair.ahrefs.db.keywords.search({
  where: { volume: { gte: 1000 } },
});

// Referring domains
const refdomains = await corsair.ahrefs.db.refdomains.search({
  where: { domain_rating: { gte: 50 } },
});

// Top pages
const pages = await corsair.ahrefs.db.pages.list();

// Rank Tracker data
const rankings = await corsair.ahrefs.db.rankings.search({
  where: { project_id: { eq: 123456 } },
});

// SERP positions
const serp = await corsair.ahrefs.db.serpPositions.search({
  where: { keyword: { eq: 'seo tools' } },
});

// Subscription usage
const usage = await corsair.ahrefs.db.subscriptionUsage.findByEntityId('current');
```

## Authentication

Set up your API key:

```bash
pnpm corsair setup --plugin=ahrefs api_key=your-ahrefs-api-key
```

Or pass directly:

```ts
ahrefs({
  authType: 'api_key',
  key: 'your-ahrefs-api-key',
})
```

## Rate Limiting

Automatically handles Ahrefs rate limits with exponential backoff and retry logic.

## Documentation

Full docs at: https://docs.corsair.dev/plugins/ahrefs

## License

Apache-2.0
