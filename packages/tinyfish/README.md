# TinyFish Plugin for Corsair

This package provides a TinyFish integration for Corsair.

TinyFish is live web work behind one `X-API-Key`: intent-aware web search,
page fetch, cloud browser sessions, goal-driven web automation agents,
cited research runs, and reusable browser profiles.

## Features
- Search the web with intent, location, language, domain include/exclude
  lists, date windows, recency, academic year filters, pagination and
  thumbnails — and read back recent requests from the usage log.
- Fetch up to 10 URLs per call as markdown, HTML or JSON, with cache
  revalidation, selector scoping, link and metadata extraction.
- Start and stop cloud browser sessions, connect over CDP, and read
  session usage.
- Automate a live website against a goal: `agent.run` waits for the
  result, `agent.runAsync` and `agent.runBatch` queue runs and return
  immediately, with step screenshots, HTML artifacts and results on
  `agent.getRun`.
- Start cited deep research and poll its plan, evidence, and report.
- Manage Browser Context Profiles (cookies and local storage) that runs
  can reuse, and read the wallet balance and per-product rates.
- React to `run.completed`, `run.failed` and `run.cancelled` deliveries
  and keep the `agentRuns` entity in sync.

## Setup
You need a TinyFish account and an API key.

Supply it to the provider configuration:
```typescript
import { createCorsair } from 'corsair';
import { tinyfish } from '@corsair-dev/tinyfish';

export const corsair = createCorsair({
  // ...
  plugins: [
    tinyfish({
      key: process.env.TINYFISH_API_KEY,
    }),
  ],
});
```

## Usage

### Search the web
```typescript
const response = await corsair.tinyfish.api.search.search({
  query: 'state of browser agents',
  domain_type: 'news',
  recency_minutes: 1440,
  location: 'US',
});

console.log(response.results[0].title, response.results[0].url);
```

### Fetch a page
```typescript
const page = await corsair.tinyfish.api.fetch.fetch({
  urls: ['https://example.com'],
  format: 'markdown',
  links: true,
});

console.log(page.results.length, 'pages', page.errors.length, 'errors');
```

### Automate a website
`agent.run` waits for the terminal result; `agent.runAsync` queues the
run and returns its id right away:
```typescript
const run = await corsair.tinyfish.api.agent.run({
  url: 'https://example.com',
  goal: 'Extract the page title and first paragraph',
});

console.log(run.status, run.result);

const queued = await corsair.tinyfish.api.agent.runAsync({
  url: 'https://example.com',
  goal: 'Extract the page title',
  webhook_url: 'https://hooks.example.com/tinyfish',
});

console.log(queued.run_id);
```

### Research with citations
`research.start` returns immediately; poll `research.get` until the run
reports a terminal status and exposes its report:
```typescript
const started = await corsair.tinyfish.api.research.start({
  query: 'state of browser agents in 2026',
  mode: 'deep',
});

const report = await corsair.tinyfish.api.research.get({
  researchRunId: started.research_run_id,
});

console.log(report.status, report.deep_result?.result);
```

### Cloud browser sessions
```typescript
const session = await corsair.tinyfish.api.browser.createSession({
  url: 'https://example.com',
});

console.log(session.cdp_url); // connect Playwright or Puppeteer over CDP

await corsair.tinyfish.api.browser.terminateSession({
  sessionId: session.session_id,
});
```

### Profiles and wallet
```typescript
const profile = await corsair.tinyfish.api.profiles.create({ name: 'Work' });
const { available_balance, rates } = await corsair.tinyfish.api.wallet.get({});
```

### Webhooks
Async runs accept a `webhook_url`; point it at your Corsair HTTP handler
and use `webhookHooks` to react to deliveries:
```typescript
tinyfish({
  webhookHooks: {
    run: {
      completed: {
        after: async (ctx, result) => {
          console.log('Run finished:', result.data.run_id, result.data.status);
        },
      },
    },
  },
});
```

Deliveries are unsigned JSON, so a well-shaped payload proves nothing.
Before a run delivery is persisted, the handler confirms it against the
API: it reads `GET /v1/runs/{run_id}` with the configured key and only
proceeds when the live run exists and its status matches the event. The
stored row and the handler's response then carry the API's own snapshot,
so the delivery body only ever names the event and the run. A delivery
that disagrees, arrives when the API cannot confirm it, or lands with no
key configured is dropped and logged, never trusted.

`webhookHooks` run through the corsair binder. `before` fires for every
delivery, including ones the handler later rejects. `after` fires only
when the handler returned success, which for this plugin means the run
was confirmed against the API. With no database configured the run is
not persisted: handling still returns success or rejection, with
nothing stored.

The plugin serializes saves per run id inside one process, so a `getRun`
poll and a webhook delivery cannot interleave a stale status over a
finished run. Multiple processes sharing one database serialize only at
the database itself.

## Quirks & Constraints
- Auth is the `X-API-Key` header, not Bearer, and one key covers all four
  hosts (agent, search, fetch, browser).
- Runs are billed per step, so server errors and timeouts are **not**
  replayed. Only per-minute rate limits (429) and profile-setup
  conflicts (409 `RETRY_REQUIRED`) retry; 429s use the server's
  `Retry-After`. Neither request ran, so neither is billed.
- Search has a free tier of 12,000 requests/day and fetch 1,000 URLs/day;
  agent, research and browser usage draws from the wallet.
- `include_thumbnail` on search is the wire string `'true'`/`'false'`,
  not a boolean.
- Batch items (`agent.runBatch`) take no per-run profile fields;
  `profile_id` is a batch-level setting.
- `profiles.delete` is destructive and irreversible: it removes the
  saved cookies and storage for every domain on the profile.
- Not wrapped yet: streamed run events (SSE), monitors, vault
  connections, profile setup-sessions and per-domain deletes, and
  wallet top-up.
- Completed runs, queued acknowledgements, `getRun` polls and webhook
  deliveries are stamped into the `agentRuns` entity by run id when a
  database is configured, so one run never duplicates rows.
