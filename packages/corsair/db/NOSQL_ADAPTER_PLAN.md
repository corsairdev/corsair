# Adding NoSQL Database Support to Corsair

Corsair currently supports relational databases (PostgreSQL, SQLite) through Kysely. This document describes the refactoring plan to add support for NoSQL databases like MongoDB, Convex, and others.

## Why this works

Corsair's entity model already follows a document-oriented pattern. All plugin data is stored in a single `corsair_entities` table with a JSON `data` column keyed by `(account_id, entity_type, entity_id)`. This maps naturally to document databases where each entity is a document with those fields as properties — no JSONB extraction needed.

Plugins are already decoupled from the database backend. They only interact through the `PluginEntityClient<DataSchema>` interface (`ctx.db.channels.list()`, `ctx.db.rows.upsertByEntityId(...)`, etc.), which contains no Kysely types. **Zero plugin packages need changes.**

## Current architecture

```
createCorsair({ database: pgPool, plugins: [...] })
       │
       ▼
createCorsairDatabase(pgPool)          ← creates Kysely<CorsairKyselyDatabase>
       │
       ▼
CorsairDatabase = { db: Kysely<...> }  ← this type flows everywhere
       │
       ├─► core/client/index.ts         calls createKyselyEntityClient(database.db, ...)
       ├─► core/auth/key-manager.ts     calls database.db.selectFrom('corsair_integrations')...
       ├─► core/permissions/index.ts    calls database.db.selectFrom('corsair_permissions')...
       ├─► permissions/index.ts         calls database.db.updateTable('corsair_permissions')...
       ├─► core/endpoints/bind.ts       passes CorsairDatabase to permission guard
       ├─► db/orm.ts                    createBaseTableClient uses Kysely selectFrom/insertInto/...
       └─► setup/index.ts              uses db.introspection.getTables()
```

The problem: `CorsairDatabase = { db: Kysely<...> }` leaks Kysely types into 12+ files, and many of those files construct raw Kysely queries inline.

## Target architecture

```
createCorsair({ database: pgPool | mongoClient | convexClient, plugins: [...] })
       │
       ▼
createCorsairDatabase(input)           ← returns CorsairDatabaseAdapter
       │
       ▼
CorsairDatabaseAdapter (interface)     ← this type flows everywhere instead
       │
       ├─► adapter.createEntityClient(...)     replaces createKyselyEntityClient
       ├─► adapter.orm.integrations.*          replaces raw selectFrom('corsair_integrations')
       ├─► adapter.orm.accounts.*              replaces raw selectFrom('corsair_accounts')
       ├─► adapter.orm.entities.*              replaces raw selectFrom('corsair_entities')
       ├─► adapter.orm.events.*                replaces raw selectFrom('corsair_events')
       ├─► adapter.permissions.*               replaces raw permission queries
       └─► adapter.introspect()                replaces db.introspection.getTables()
```

## The adapter interface

The core abstraction is a `CorsairDatabaseAdapter` interface defined in `db/adapter.ts`. Rather than abstracting SQL query building (which would require reimplementing Kysely), we abstract at the **operation level** — the same CRUD operations that already exist as methods on the ORM clients.

```typescript
interface CorsairDatabaseAdapter {
  // Factory for plugin entity clients (the main thing plugins use)
  createEntityClient<DataSchema extends ZodTypeAny>(
    getAccountId: () => Promise<string>,
    entityTypeName: string,
    version: string,
    dataSchema: DataSchema,
  ): PluginEntityClient<DataSchema>;

  // Core table ORM (integrations, accounts, entities, events)
  readonly orm: CorsairOrm;

  // Permission table operations
  readonly permissions: PermissionOps;

  // Optional introspection for setup (NoSQL backends may skip this)
  introspect?(): Promise<{ tables: string[] }>;
}
```

## Implementation steps

### Step 1: Define the adapter interface (`db/adapter.ts`)

Create `CorsairDatabaseAdapter` — a backend-agnostic interface that all database implementations must satisfy. This interface surfaces the exact operations that the rest of Corsair needs, derived from auditing every `database.db.*` call site.

Files created:
- `db/adapter.ts`

### Step 2: Implement the Kysely adapter (`db/kysely/adapter.ts`)

Wrap all existing Kysely code into a `KyselyDatabaseAdapter` class. This is a pure refactor — the implementation delegates to the same functions that exist today (`createKyselyEntityClient`, `createBaseTableClient`, etc.).

Files created:
- `db/kysely/adapter.ts`

Files modified:
- `db/kysely/database.ts` — `createCorsairDatabase` now returns `CorsairDatabaseAdapter`

### Step 3: Update `CorsairDatabase` type alias

Change `CorsairDatabase` from `{ db: Kysely<...> }` to `CorsairDatabaseAdapter`. This is the key type that flows through the entire codebase.

Files modified:
- `db/kysely/database.ts` — re-type `CorsairDatabase`

### Step 4: Refactor `core/client/index.ts`

Replace `createKyselyEntityClient(database.db, ...)` calls with `database.createEntityClient(...)`. Replace the raw Kysely queries in `createAccountIdResolver` with adapter ORM calls.

### Step 5: Refactor `core/auth/key-manager.ts`

Replace all 10+ raw `database.db.selectFrom(...)` / `database.db.updateTable(...)` calls with adapter ORM methods. The key manager reads/writes integration and account configs — these map to `adapter.orm.integrations.*` and `adapter.orm.accounts.*`.

### Step 6: Refactor `core/permissions/index.ts` and `permissions/index.ts`

Replace raw permission table queries with `adapter.permissions.*` methods.

### Step 7: Refactor `setup/index.ts`

Replace `db.introspection.getTables()` with `adapter.introspect?.()`. Replace raw insert/select queries in `ensurePluginRowsAndDeks` with adapter ORM calls.

### Step 8: Refactor `db/orm.ts`

Update `createBaseTableClient` and the specialized clients to delegate to the adapter rather than constructing Kysely queries directly. The `createPluginOrm`, `createTenantScopedOrm`, and `createPluginOrmFactory` functions use the adapter's `createEntityClient` instead of importing from `db/kysely/orm`.

### Step 9: Update `core/plugins/index.ts`

Expand `CorsairDatabaseInput` to accept NoSQL clients (MongoDB, Convex) and pre-built adapters in addition to the existing pg Pool / better-sqlite3 / Kysely options.

### Step 10: Verify everything compiles and existing tests pass

Run the build and test suite to confirm the refactor is behavior-preserving.

## Files affected (complete list)

| File | Change type |
|------|-------------|
| `db/adapter.ts` | **New** — adapter interface + permission ops type |
| `db/kysely/adapter.ts` | **New** — Kysely implementation of the adapter |
| `db/kysely/database.ts` | Modified — `CorsairDatabase` becomes `CorsairDatabaseAdapter`, `createCorsairDatabase` returns adapter |
| `db/orm.ts` | Modified — delegate to adapter instead of raw Kysely |
| `core/index.ts` | Modified — import path change |
| `core/client/index.ts` | Modified — use `adapter.createEntityClient()` |
| `core/auth/key-manager.ts` | Modified — use adapter ORM methods |
| `core/permissions/index.ts` | Modified — use `adapter.permissions.*` |
| `core/endpoints/bind.ts` | Modified — type import change |
| `core/plugins/index.ts` | Modified — expand `CorsairDatabaseInput` |
| `permissions/index.ts` | Modified — use `adapter.permissions.*` |
| `setup/index.ts` | Modified — use adapter ORM + introspection |
| `db.ts` | Modified — re-export updated types |

## How NoSQL backends map

### MongoDB

| Corsair concept | MongoDB equivalent |
|---|---|
| `corsair_entities` table | `corsair_entities` collection |
| `corsair_integrations` table | `corsair_integrations` collection |
| Row with JSON `data` column | Document with nested `data` object |
| `WHERE col = 'x'` | `{ col: "x" }` |
| `WHERE col LIKE '%x%'` | `{ col: { $regex: "x" } }` |
| `data->>'key'` (JSONB extract) | `"data.key"` (native dot-notation) |
| `(data->>'key')::numeric > 10` | `{ "data.key": { $gt: 10 } }` |

### Convex

| Corsair concept | Convex equivalent |
|---|---|
| `corsair_entities` table | Convex table with schema |
| `corsair_integrations` table | Convex table with schema |
| `WHERE col = 'x'` | `.withIndex("by_col", q => q.eq("col", "x"))` |
| JSON `data` column | Native Convex object field |
| `LIKE '%x%'` | Full-text search index or client-side filter |

Convex requires pre-defined schemas and indexes, so it needs a companion `convex/schema.ts` template that users add to their project.
