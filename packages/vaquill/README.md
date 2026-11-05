# Vaquill Plugin for Corsair

This package provides a Vaquill integration for Corsair.

Vaquill is US primary law as an API: hybrid semantic and keyword search
across the United States Code, the Code of Federal Regulations, all 50 state
statutory codes plus DC and Puerto Rico, state administrative codes, court
rules, constitutions, agency guidance and executive actions.

## Features
- Search US primary law with jurisdiction, corpus and status filters, and
  count or browse the corpus hierarchy.
- Resolve Bluebook citations (single or batch) and extract citations from
  free text.
- Pull a section's full text, optionally as it stood on a past date, and
  read its amendment history, citing sections, defined terms, neighbouring
  sections, cross-state equivalents, and the session laws behind it.
- Search, list and batch the state session-laws registry, and poll its
  change feed.
- Watch law-change boards over webhook or email, page their change history,
  and read old-vs-new diffs.
- Read your credit balance and the live credit pricing.

## Setup
You need an active Vaquill account and an API key (`vq_key_...`).

Supply it to the provider configuration:
```typescript
import { createCorsair } from 'corsair';
import { vaquill } from '@corsair-dev/vaquill';

export const corsair = createCorsair({
  // ...
  plugins: [
    vaquill({
      key: process.env.VAQUILL_API_KEY,
    }),
  ],
});
```

## Usage

### Search US statutes
```typescript
const response = await corsair.vaquill.api.statutes.search({
  query: 'insider trading penalties',
  corpusType: ['USC'],
  limit: 10,
});

console.log(response.results[0].citation);
```

### Resolve a citation
```typescript
const response = await corsair.vaquill.api.statutes.resolve({
  citations: ['42 U.S.C. 1983'],
});

console.log(response.results[0].section?.actId);
```

### Get full text of a section
Every section id (`actId`) from a search hit or resolver result feeds
straight into the section endpoints:
```typescript
const body = await corsair.vaquill.api.statutes.sectionBody({
  act_id: 'USC_T42_C21_S1983',
  format: 'plain',
});

console.log(body.plain);
```

### Quirks & Constraints
- **United States law only.**
- `offset` + `limit` reaches 120 search results at most; a deeper query
  wants a narrower filter, not a deeper page.
- `titleNumber` is meaningless for state corpora (state titles are
  alphabetic); the API ignores it there rather than rejecting it.
- Batch endpoints (`resolve`, `sections`) de-duplicate their input while
  preserving order, so results line up with the unique ids.
