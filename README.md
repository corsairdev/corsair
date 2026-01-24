# Corsair

A unified SDK for integrating with third-party services. Add Slack, Linear, GitHub, Gmail, and hundreds of other integrations with the same syntax, same types, and same four database tables.

## The Problem

Every codebase has integrations. If you look at how they're written, 90% of the code is identical whether you're connecting to Slack, GitHub, Hubspot, or some random API:

- Make an API call with proper error handling
- Handle authentication and rate limits
- Store responses in your database with custom schemas
- Map untyped API responses to your own types
- Keep that data fresh with webhooks or polling
- Write foreign keys to connect external data to your own

Each integration requires rebuilding this infrastructure from scratch. The result? Fragmented code with different patterns, error handling, and auth flows for every service.

## The Solution

Corsair provides a single interface for all your integrations. Configure once with sensible defaults:
```typescript
export const corsair = createCorsair({
  multiTenancy: true,
  database: drizzleAdapter(...),
  plugins: [
    slack({
      authType: 'api_key',
      credentials: { botToken: process.env.SLACK_BOT_TOKEN },
    }),
    linear({
      authType: 'api_key',
      credentials: { apiKey: process.env.LINEAR_API_KEY },
    }),
  ],
});
```

Use the same syntax across every integration, fully typed:
```typescript
const tenant = corsair.withTenant('tenant_123');

await tenant.slack.api.messages.post({
  channel: 'C01234567',
  text: 'Hello from Corsair!',
});

await tenant.linear.api.issues.create({
  title: 'New feature request',
  teamId: 'TEAM_ABC',
});
```

All data is automatically synced to your local database and fully typed. No manual schema mapping:
```typescript
// Strongly typed, no casting needed
const issue = await tenant.linear.db.issues.findById('ABC_123');
//    ^? LinearIssue
```

Customize anywhere you need it:
```typescript
linear({
  authType: 'api_key',
  credentials: { apiKey: process.env.LINEAR_API_KEY },
  errorHandlers: {
    RATE_LIMIT: { retryAfter: 60, maxRetries: 3 },
    DEFAULT: { logToSentry: true },
  },
  hooks: {
    issues: {
      create: {
        before: (data) => validateIssue(data),
        after: (issue) => notifyTeam(issue),
      },
    },
  },
})
```

**What you get:**

- **Consistent API** — Same patterns across every integration
- **Full type safety** — All responses are strongly typed, no manual type definitions needed
- **Local database sync** — Four tables handle all external data. Write foreign keys directly to `corsair_resources`
- **Built-in auth** — OAuth, API keys, and token refresh handled automatically
- **Data freshness** — Webhooks and polling keep your local data up to date
- **Error handling** — Rate limits, retries, and failures managed out of the box
- **Sensible defaults** — Works out of the box, customize only what you need

**When to use Corsair:**

Best for teams building products with multiple third-party integrations. If you're building deep, custom functionality with a single API, you're better off using that service's SDK directly.