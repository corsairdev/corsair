## About the Project

Corsair is a unified SDK for integrating with third-party service. Add Slack, Linear, GitHub, Gmail, and hundreds of other integrations — all with the same syntax, same types, and the same four database tables.

### Why Corsair

Integration management in the TypeScript ecosystem is fragmented. Each service has its own SDK with different patterns, error handling, and authentication flows. Rather than juggling dozens of different libraries, Corsair provides a single, consistent interface for all your integrations.

## Quick Start

```bash
npm install corsair
```

```ts
export const corsair = createCorsair({
	multiTenancy: true,
	database: drizzleAdapter(...),
	plugins: [
		slack({
			authType: 'api_key',
			credentials: {
				botToken: process.env.SLACK_BOT_TOKEN,
			},
      errorHandler: {
        RATE_LIMIT: { ... }
      }
		}),
		linear({
			authType: 'api_key',
			credentials: {
				apiKey: process.env.LINEAR_API_KEY,
			},
      hooks: { ... },
		}),
	],
});

// Use with tenant context
const tenant = corsair.withTenant('tenant_123');

// Send a Slack message
await tenant.slack.api.messages.post({
	channel: 'C01234567',
	text: 'Hello from Corsair!',
});

// Create a Linear issue
await tenant.linear.api.issues.get({
	title: 'New feature request',
	teamId: 'TEAM_ABC',
});

// Everything is stored locally so you can create foreign keys to external data
await tenant.linear.db.issues.findById('ABC_123');
```

## Key Features

### One SDK, Many Integrations

Learn one syntax, use it everywhere. No need to master each service's unique SDK quirks. Every integration follows the same pattern: `corsair.[integration].api.[resource].[action]()`.

Everything is then stored in your database automatically and kept up to date. Every integration follows the same pattern: `corsair.[integration].db.[resource].findById()`.

### Multi-Tenant by Default

Every operation is scoped to a tenant. Data isolation is automatic — no cross-contamination possible. Perfect for SaaS applications.

### Always Fresh Data

API responses are stored and automatically updated through webhooks. Your data is never stale, and you get automatic sync for free.

### Four Tables Forever

Add 100 integrations — still just four database tables. No schema bloat, no migration headaches.

### Fully Typed

Every API call, every response, every database query is fully typed. Your editor knows everything, and breaking changes are caught at compile time.

### Production-Ready

Built-in error handling, retry logic, rate limit management, and credential encryption. Focus on your product, not integration plumbing.

## Supported Integrations

- **Slack** — channels, messages, users, reactions, files
- **Linear** — issues, projects, comments, teams
- **GitHub** — repositories, issues, pull requests, actions
- **Gmail** — messages, threads, labels, drafts

And many more. Check the [documentation](https://corsair.dev) for the full list.

## Database Adapters

Corsair supports multiple database adapters:

- **Drizzle** — Full support for PostgreSQL, MySQL, SQLite
- **Prisma** — Works with your existing Prisma setup
- **Kysely** — Type-safe SQL query builder
- **PostgreSQL** — Direct PostgreSQL adapter

## Documentation

- [Getting Started](https://corsair.dev/getting-started/introduction)
- [Multi-Tenancy](https://corsair.dev/concepts/multi-tenancy)
- [Error Handling](https://corsair.dev/concepts/error-handling)
- [Webhooks](https://corsair.dev/concepts/webhooks)
- [Database](https://corsair.dev/concepts/database)
- [Hooks](https://corsair.dev/concepts/hooks)
