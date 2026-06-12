---
title: Database
description: Four tables, always-fresh integration data, tenant-scoped by default.
---

import { WindowsMigrationNote } from '/snippets/windows-shell.mdx';

Every API call and webhook that flows through Corsair is stored in your database automatically. When something changes in Slack, GitHub, or Linear, Corsair updates the same row — so your UI can read from `*.db.*` instead of hitting third-party APIs on every page load. Third-party data becomes an extension of your own DB, always fresh.

---

## Get started

Run the migration once, then pass your connection to `createCorsair({ database, ... })`. See [Quick Start](/getting-started/quick-start) for a full setup example.

<Tabs>
  <Tab title="SQLite">

Install the driver, then run the migration:

<CodeGroup>
```bash npm
npm install better-sqlite3
```
```bash yarn
yarn add better-sqlite3
```
```bash pnpm
pnpm install better-sqlite3
```
```bash bun
bun add better-sqlite3
```
</CodeGroup>
<CodeGroup>
```bash npm
npm install --save-dev @types/better-sqlite3
```
```bash yarn
yarn add --dev @types/better-sqlite3
```
```bash pnpm
pnpm install --save-dev @types/better-sqlite3
```
```bash bun
bun add --dev @types/better-sqlite3
```
</CodeGroup>

  </Tab>
  <Tab title="PostgreSQL">

Install the driver, then run the migration:

<CodeGroup>
```bash npm
npm install pg
```
```bash yarn
yarn add pg
```
```bash pnpm
pnpm install pg
```
```bash bun
bun add pg
```
</CodeGroup>
<CodeGroup>
```bash npm
npm install --save-dev @types/pg
```
```bash yarn
yarn add --dev @types/pg
```
```bash pnpm
pnpm install --save-dev @types/pg
```
```bash bun
bun add --dev @types/pg
```
</CodeGroup>

  </Tab>
</Tabs>

<Tabs>
  <Tab title="SQLite">

<AccordionGroup>
<Accordion title="View migration SQL">

```sql migration.sql
CREATE TABLE IF NOT EXISTS corsair_integrations (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    name TEXT NOT NULL,
    config TEXT NOT NULL DEFAULT '{}',
    dek TEXT NULL
);

CREATE TABLE IF NOT EXISTS corsair_accounts (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    tenant_id TEXT NOT NULL,
    integration_id TEXT NOT NULL,
    config TEXT NOT NULL DEFAULT '{}',
    dek TEXT NULL,
    FOREIGN KEY (integration_id) REFERENCES corsair_integrations(id)
);

CREATE TABLE IF NOT EXISTS corsair_entities (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    account_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    version TEXT NOT NULL,
    data TEXT NOT NULL DEFAULT '{}',
    FOREIGN KEY (account_id) REFERENCES corsair_accounts(id)
);

CREATE TABLE IF NOT EXISTS corsair_events (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    account_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    status TEXT,
    FOREIGN KEY (account_id) REFERENCES corsair_accounts(id)
);
```

</Accordion>
</AccordionGroup>

<Tabs>
  <Tab title="macOS / Linux">

```bash
sqlite3 corsair.db < migration.sql
```

  </Tab>
  <Tab title="Windows (PowerShell)">

<WindowsMigrationNote />

```powershell
Get-Content migration.sql | sqlite3 corsair.db
```

  </Tab>
</Tabs>

  </Tab>
  <Tab title="PostgreSQL">

<Tabs>
  <Tab title="SQL">

<AccordionGroup>
<Accordion title="View migration SQL">

```sql migration.sql
CREATE TABLE IF NOT EXISTS corsair_integrations (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    dek TEXT NULL
);

CREATE TABLE IF NOT EXISTS corsair_accounts (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tenant_id TEXT NOT NULL,
    integration_id TEXT NOT NULL REFERENCES corsair_integrations(id),
    config JSONB NOT NULL DEFAULT '{}',
    dek TEXT NULL
);

CREATE TABLE IF NOT EXISTS corsair_entities (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_id TEXT NOT NULL REFERENCES corsair_accounts(id),
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    version TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS corsair_events (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_id TEXT NOT NULL REFERENCES corsair_accounts(id),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    status TEXT
);
```

</Accordion>
</AccordionGroup>

<Tabs>
  <Tab title="macOS / Linux">

```bash
psql $DATABASE_URL -f migration.sql
```

  </Tab>
  <Tab title="Windows (PowerShell)">

<WindowsMigrationNote />

```powershell
psql $env:DATABASE_URL -f migration.sql
```

  </Tab>
</Tabs>

  </Tab>
  <Tab title="Drizzle">

<AccordionGroup>
<Accordion title="View Drizzle schema">

```ts src/server/db/schema.ts
import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const corsairIntegrations = pgTable('corsair_integrations', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    name: text('name').notNull(),
    config: jsonb('config').notNull().default({}),
    dek: text('dek'),
});

export const corsairAccounts = pgTable('corsair_accounts', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    tenantId: text('tenant_id').notNull(),
    integrationId: text('integration_id').notNull().references(() => corsairIntegrations.id),
    config: jsonb('config').notNull().default({}),
    dek: text('dek'),
});

export const corsairEntities = pgTable('corsair_entities', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    accountId: text('account_id').notNull().references(() => corsairAccounts.id),
    entityId: text('entity_id').notNull(),
    entityType: text('entity_type').notNull(),
    version: text('version').notNull(),
    data: jsonb('data').notNull().default({}),
});

export const corsairEvents = pgTable('corsair_events', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    accountId: text('account_id').notNull().references(() => corsairAccounts.id),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull().default({}),
    status: text('status'),
});
```

</Accordion>
</AccordionGroup>

Then push the schema to your database:

```bash
npx drizzle-kit push
```

  </Tab>
  <Tab title="Prisma">

<AccordionGroup>
<Accordion title="View Prisma schema">

```prisma schema.prisma
model CorsairIntegration {
  id        String           @id
  createdAt DateTime         @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime         @updatedAt @map("updated_at") @db.Timestamptz
  name      String
  config    Json             @default("{}")
  dek       String?
  accounts  CorsairAccount[]

  @@map("corsair_integrations")
}

model CorsairAccount {
  id            String             @id
  createdAt     DateTime           @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime           @updatedAt @map("updated_at") @db.Timestamptz
  tenantId      String             @map("tenant_id")
  integrationId String             @map("integration_id")
  config        Json               @default("{}")
  dek           String?
  integration   CorsairIntegration @relation(fields: [integrationId], references: [id])
  entities      CorsairEntity[]
  events        CorsairEvent[]

  @@map("corsair_accounts")
}

model CorsairEntity {
  id         String         @id
  createdAt  DateTime       @default(now()) @map("created_at") @db.Timestamptz
  updatedAt  DateTime       @updatedAt @map("updated_at") @db.Timestamptz
  accountId  String         @map("account_id")
  entityId   String         @map("entity_id")
  entityType String         @map("entity_type")
  version    String
  data       Json           @default("{}")
  account    CorsairAccount @relation(fields: [accountId], references: [id])

  @@map("corsair_entities")
}

model CorsairEvent {
  id        String         @id
  createdAt DateTime       @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime       @updatedAt @map("updated_at") @db.Timestamptz
  accountId String         @map("account_id")
  eventType String         @map("event_type")
  payload   Json           @default("{}")
  status    String?
  account   CorsairAccount @relation(fields: [accountId], references: [id])

  @@map("corsair_events")
}
```

</Accordion>
</AccordionGroup>

Then run the migration:

```bash
npx prisma migrate dev
```

  </Tab>
</Tabs>

  </Tab>
</Tabs>

---

## Example: Slack

All data is scoped to tenants — `withTenant()` ensures you only read and write that tenant's rows, with no cross-contamination.

```ts
const tenant = corsair.withTenant('user_abc123');

// 1. Send a message — Corsair stores it in corsair_entities
const posted = await tenant.slack.api.messages.post({
    channel: 'C01234567',
    text: 'Hello from Corsair!',
});
const messageId = posted.ts!;

// 2. Someone edits the message in Slack — a webhook updates the same row

// 3. Your UI reads from the local DB — always up to date
const [message] = await tenant.slack.db.messages.search({
    entity_id: messageId,
});
console.log(message?.data.text);
```

Use `*.api.*` to write or force a fresh read. Use `*.db.*` for lists, search, and detail pages. Plugin-specific filters are in each plugin's database reference (e.g. [Slack](/plugins/slack/database)).

---

## Core tables

Four tables for every integration — Slack, GitHub, Linear, and the rest all share the same schema.

| Table | Purpose |
|-------|---------|
| `corsair_integrations` | One row per enabled plugin (`slack`, `github`, …) |
| `corsair_accounts` | Per-tenant connection + encrypted credentials (`tenant_id`, `integration_id`) |
| `corsair_entities` | Synced resources — messages, channels, issues, repos (`entity_id`, `entity_type`, `data`) |
| `corsair_events` | Audit log of API calls and webhooks |

```sql
-- corsair_entities example (a Slack message)
account_id: "acc_1"
entity_id: "1234567890.123456"
entity_type: "messages"
data: { text: "Hello!", channel: "C01234567", ts: "1234567890.123456" }
```

Schema types: [`packages/corsair/db/index.ts`](https://github.com/corsair-dev/corsair/blob/main/packages/corsair/db/index.ts).

---

## Keeping data fresh

Corsair doesn't snapshot data once and forget it. Every write path keeps the same row current:

1. **API calls** — when you call `tenant.slack.api.messages.post`, Corsair sends the request and upserts the response into `corsair_entities`.
2. **Webhooks** — when Slack notifies you that a message changed, Corsair finds the row by `entity_id` and updates it in place.
3. **Out-of-order events** — if an update arrives before you've seen the create, Corsair fetches from the API and backfills the row (see [Webhooks](/concepts/webhooks)).

You don't build a sync layer or poll for changes. Query `corsair_entities` (or `*.db.*`) and trust that Corsair is maintaining it.

---

## How to use it

### Query through Corsair

Use the typed ORM on each plugin — no raw SQL required for most reads:

```ts
const tenant = corsair.withTenant('user_abc123');

await tenant.slack.db.messages.list({ limit: 50 });
await tenant.slack.db.messages.findByEntityId('1234567890.123456');
await tenant.github.db.repositories.search({ data: { name: { contains: 'api' } } });
```

### Join to your own tables

Reference `corsair_entities.id` from your schema and treat third-party data like first-class rows in your app:

```sql
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    slack_message_id TEXT NOT NULL REFERENCES corsair_entities(id)
);
```

```ts
// Create a ticket linked to a Corsair entity
const posted = await tenant.slack.api.messages.post({ channel, text });
const [entity] = await tenant.slack.db.messages.search({ entity_id: posted.ts! });

await db.insert(supportTickets).values({
    title: 'Customer issue',
    slackMessageId: entity!.id, // corsair_entities.id
});

// Join your table to live Slack data
const rows = await db
    .select()
    .from(supportTickets)
    .innerJoin(corsairEntities, eq(supportTickets.slackMessageId, corsairEntities.id));
// rows[].corsair_entities.data.text stays fresh via webhooks
```

Because Corsair updates `corsair_entities` on every API call and webhook, foreign keys to that table always point at current data — not a stale cache you wrote once.

### When to use API vs DB

| Use | When |
|-----|------|
| `*.api.*` | Writes, deletes, or you need the latest value right now from the source |
| `*.db.*` | UI lists, search, detail pages — fast reads, no rate limits |

---

## SQLite, Postgres, and ORMs

Corsair runs on **your** database. Pass a connection to `createCorsair` — it works alongside whatever ORM you already use for your own tables.

<Tabs>
<Tab title="SQLite">

Best for local dev and small apps. Pass a `better-sqlite3` instance:

```ts
import Database from 'better-sqlite3';

export const corsair = createCorsair({
    database: new Database('corsair.db'),
    plugins: [slack()],
    kek: process.env.CORSAIR_KEK!,
});
```

</Tab>
<Tab title="PostgreSQL">

Production default. Pass a `pg` Pool:

```ts
import { Pool } from 'pg';

export const corsair = createCorsair({
    database: new Pool({ connectionString: process.env.DATABASE_URL }),
    plugins: [slack()],
    kek: process.env.CORSAIR_KEK!,
});
```

</Tab>
<Tab title="Drizzle / Prisma">

Define the four Corsair tables in your ORM schema (see migration tabs above), run your normal migrations, and pass the **underlying connection** to Corsair — not the ORM client:

```ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const corsair = createCorsair({ database: pool, ... });

// Drizzle — your app tables
export const db = drizzle(pool);

// Prisma — your app tables (same pool, not PrismaClient)
export const prisma = new PrismaClient();
```

Corsair also accepts **postgres.js** and a typed **Kysely** instance if you want to share a single query builder.

</Tab>
</Tabs>

Supported connection types: `pg` Pool, `better-sqlite3`, postgres.js `Sql`, and Kysely. Use the same database for Corsair tables and your app tables — one migration, one connection string.

---

## What's next

<CardGroup cols={2}>
  <Card title="Multi-Tenancy" href="/concepts/multi-tenancy">
    Scope credentials and data per user with `withTenant()`.
  </Card>
  <Card title="Webhooks" href="/concepts/webhooks">
    How incoming events update your rows automatically.
  </Card>
  <Card title="API" href="/concepts/api">
    Call third-party APIs with full type safety.
  </Card>
</CardGroup>
