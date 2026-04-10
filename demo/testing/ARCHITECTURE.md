# Corsair Architecture: Data Flow

## High-Level Overview

```
                         demo/testing/                                packages/corsair/
                    (Client Application)                            (Core Library)
    
    +------------------+     +-------------------+     +----------------------------------+
    |  Next.js Client  |     |   API Routes      |     |         createCorsair()           |
    |  (React Pages)   |---->|  /api/webhook     |---->|   Plugin Binding & Permissions    |
    |                  |     |  /api/trpc/[trpc] |     |                                  |
    +------------------+     +-------------------+     +----------------------------------+
                                                                     |
                                                                     v
                                                       +----------------------------------+
                                                       |        Plugin Endpoints           |
                                                       |   github.api.issues.list(args)    |
                                                       |   slack.api.channels.get(args)    |
                                                       +----------------------------------+
                                                                     |
                                                                     v
                                                       +----------------------------------+
                                                       |     ORM / Entity Clients          |
                                                       |   ctx.db.issues.upsertByEntityId  |
                                                       +----------------------------------+
                                                                     |
                                                                     v
                                                       +----------------------------------+
                                                       |     Adapter Factory               |
                                                       |   createAdapterTransforms()       |
                                                       |   Date <-> epoch, JSON, fields    |
                                                       +----------------------------------+
                                                                     |
                                                                     v
                                                       +----------------------------------+
                                                       |   ConvexDatabaseAdapter           |
                                                       |   (or KyselyDatabaseAdapter)      |
                                                       +----------------------------------+
                                                                     |
                                                                     v
                                     +-----------------------------------------------------------+
                                     |              Convex Functions (queries/mutations)           |
                                     |   entities:upsertByEntityId, accounts:findById, etc.       |
                                     +-----------------------------------------------------------+
                                                                     |
                                                                     v
                                                       +----------------------------------+
                                                       |     Convex Cloud Database         |
                                                       |   corsair_entities                |
                                                       |   corsair_accounts                |
                                                       |   corsair_integrations            |
                                                       |   corsair_events                  |
                                                       |   corsair_permissions              |
                                                       +----------------------------------+
```

## Detailed Layer-by-Layer Flow

### Layer 1: Client Entry Points

```
demo/testing/src/
  app/
    page.tsx                    # React UI - triggers API calls
    api/
      webhook/route.ts          # POST /api/webhook - receives external webhooks
      trpc/[trpc]/route.ts      # tRPC handler - direct API calls from frontend
```

A webhook from GitHub/Slack/etc. hits `/api/webhook`. The route handler extracts
headers and body, then passes them into the Corsair core.

---

### Layer 2: Corsair Initialization

```
demo/testing/src/server/corsair.ts
  |
  |  const convexAdapter = new ConvexDatabaseAdapter({
  |    client: new ConvexHttpClient(CONVEX_URL),
  |    makeFunctionRef: makeFunctionReference,
  |  });
  |
  |  export const corsair = createCorsair({
  |    database: convexAdapter,
  |    plugins: [github(), slack(), googlesheets(), ...],
  |    kek: process.env.CORSAIR_KEK,
  |  });
  |
  +---> Returns: CorsairSingleTenantClient
          corsair.github.api.*         # Bound endpoints
          corsair.github.db.*          # Entity clients
          corsair.github.webhooks.*    # Webhook handlers
          corsair.keys.*               # Account/integration keys
          corsair.permissions.*        # Permission ops
```

---

### Layer 3: Webhook Processing

```
packages/corsair/webhooks/index.ts
  |
  |  processWebhook(corsair, headers, body, query?)
  |    |
  |    +---> For each plugin:
  |           1. plugin.pluginWebhookMatcher(rawRequest)     # Quick filter
  |           2. findMatchingWebhook(plugin.webhooks, req)   # Find handler
  |           3. matched.webhook.handler(webhookRequest)     # Execute
  |    |
  |    +---> Returns: { plugin, action, body, response }
```

---

### Layer 4: Plugin Endpoints (Action Execution)

```
packages/corsair/core/client/index.ts       # buildCorsairClient()
packages/corsair/core/endpoints/bind.ts     # bindEndpointsRecursively()

    Incoming call: corsair.github.api.issues.create({ title, body })
                                |
                                v
                   +------------------------+
                   |   Permission Guard     |
                   |   (if configured)      |
                   |   mode: require_approval|
                   |         require_key    |
                   |         read           |
                   +------------------------+
                                |
                                v
                   +------------------------+
                   |   Before Hooks         |
                   |   (plugin-defined)     |
                   +------------------------+
                                |
                                v
                   +------------------------+
                   |   Endpoint Handler     |  <-- e.g. packages/github/endpoints/issues.ts
                   |                        |
                   |   async (ctx, input) {  |
                   |     // 1. External API  |  --> calls GitHub REST API
                   |     const issue = ...   |
                   |     // 2. Save to DB    |  --> ctx.db.issues.upsertByEntityId(id, data)
                   |     // 3. Log event     |  --> logEventFromContext(ctx, ...)
                   |   }                     |
                   +------------------------+
                                |
                                v
                   +------------------------+
                   |   After Hooks          |
                   |   Error Handlers       |
                   +------------------------+
```

---

### Layer 5: ORM / Entity Clients

```
packages/corsair/db/orm.ts

    ctx.db.issues  =  PluginEntityClient<IssueSchema>
                        |
                        +-- findByEntityId(entityId)
                        +-- findById(id)
                        +-- findManyByEntityIds(entityIds)
                        +-- list({ limit, offset })
                        +-- search({ entity_id, data, limit })
                        +-- upsertByEntityId(entityId, data)    <-- primary write path
                        +-- deleteById(id)
                        +-- deleteByEntityId(entityId)
                        +-- count()

    The entity client is scoped by:
      - accountId  (resolved from tenant + integration)
      - entityType (e.g. "issues", "channels", "messages")
      - dataSchema (Zod schema for type-safe data validation)
```

**Core ORM tables** (used internally by Corsair):

```
    orm.integrations    # Plugin configs (github, slack, ...)
    orm.accounts        # Tenant + integration credentials
    orm.entities        # All plugin entity records
    orm.events          # Action/webhook event log
    permissions.*       # Approval queue records
```

---

### Layer 6: Adapter Factory (Type Conversions)

```
packages/corsair/db/adapter-factory.ts

    createAdapterTransforms({
      dates: 'epoch',                       # Date <-> epoch ms
      json: 'native',                       # objects stored natively
      internalFields: ['_id', '_creationTime']  # strip on output
    })
          |
          +-- transformOutput<T>(doc)       # DB row  --> Corsair type
          |     - strips _id, _creationTime
          |     - epoch number --> Date object
          |     - JSON string --> parsed object
          |
          +-- transformInput(data)          # Corsair --> DB row
          |     - Date object --> epoch number
          |     - object --> JSON string (if mode='string')
          |
          +-- dateForStorage(date)          # Single Date conversion
          +-- sanitizeValue(value)          # Recursive Date sanitization
```

**Capability matrix across adapters:**

```
                    | Dates    | JSON     | Internal Fields
    ----------------+----------+----------+------------------
    Convex          | epoch    | native   | _id, _creationTime
    Kysely/Postgres | native   | native   | (none)
    Kysely/SQLite   | iso      | string   | (none)
```

---

### Layer 7: Database Adapter

```
packages/corsair/db/convex/adapter.ts

    ConvexDatabaseAdapter implements CorsairDatabaseAdapter
      |
      |  constructor({ client, makeFunctionRef })
      |
      +-- createEntityClient()  -->  PluginEntityClient (per-plugin typed access)
      +-- orm                   -->  CorsairOrm (base table clients)
      +-- permissions           -->  CorsairPermissionOps
      |
      |  Internal: uses ConvexHttpClient to call Convex functions
      |
      |  client.query(ref('query', 'entities:findByEntityId'), { accountId, entityType, entityId })
      |  client.mutation(ref('mutation', 'entities:upsertByEntityId'), { ...data })
```

---

### Layer 8: Convex Functions (Server-Side)

```
packages/corsair/db/convex/functions/
  integrations.ts     # findById, findByName, upsertByName, create, update, ...
  accounts.ts         # findById, findByTenantAndIntegration, upsertByTenantAndIntegration, ...
  entities.ts         # findByEntityId, upsertByEntityId, listByScope, searchByEntityId, ...
  events.ts           # listByAccount, listByStatus, create, update, ...
  permissions.ts      # findByToken, findActiveForEndpoint, create, updateStatus

demo/testing/convex/  # Re-exports for Convex CLI deployment
  schema.ts           -->  export { default } from 'corsair/convex/schema'
  entities.ts         -->  export { ... } from 'corsair/convex/entities'
  accounts.ts         -->  export { ... } from 'corsair/convex/accounts'
  ...

    Each function uses Convex indexes for efficient queries:

    ctx.db.query('corsair_entities')
      .withIndex('by_account_type_entity', q =>
        q.eq('account_id', ...)
         .eq('entity_type', ...)
         .eq('entity_id', ...))
      .first()
```

---

### Layer 9: Convex Cloud Database

```
packages/corsair/db/convex/schema.ts

    +---------------------------+     +---------------------------+
    | corsair_integrations      |     | corsair_accounts          |
    |---------------------------|     |---------------------------|
    | id          (string)      |<----| integration_id (string)   |
    | name        (string)      |     | tenant_id      (string)   |
    | config      (any/JSON)    |     | config         (any/JSON) |
    | dek         (string?)     |     | dek            (string?)  |
    | created_at  (float64/ms)  |     | created_at     (float64)  |
    | updated_at  (float64/ms)  |     | updated_at     (float64)  |
    +---------------------------+     +---------------------------+
              |                                    |
              |                                    |
              v                                    v
    +---------------------------+     +---------------------------+
    | corsair_entities          |     | corsair_events            |
    |---------------------------|     |---------------------------|
    | id          (string)      |     | id          (string)      |
    | account_id  (string) -----+---->| account_id  (string)      |
    | entity_id   (string)      |     | event_type  (string)      |
    | entity_type (string)      |     | payload     (any/JSON)    |
    | version     (string)      |     | status      (string?)     |
    | data        (any/JSON)    |     | created_at  (float64)     |
    | created_at  (float64)     |     | updated_at  (float64)     |
    | updated_at  (float64)     |     +---------------------------+
    +---------------------------+
                                      +---------------------------+
                                      | corsair_permissions       |
                                      |---------------------------|
                                      | id          (string)      |
                                      | token       (string)      |
                                      | plugin      (string)      |
                                      | endpoint    (string)      |
                                      | args        (string/JSON) |
                                      | tenant_id   (string)      |
                                      | status      (string)      |
                                      | expires_at  (string/ISO)  |
                                      | error       (string?)     |
                                      | created_at  (float64)     |
                                      | updated_at  (float64)     |
                                      +---------------------------+

    Indexes:
      corsair_integrations:  by_corsair_id(id), by_name(name)
      corsair_accounts:      by_corsair_id(id), by_tenant_integration(tenant_id, integration_id)
      corsair_entities:      by_corsair_id(id), by_account_type_entity(account_id, entity_type, entity_id),
                             by_account_type(account_id, entity_type)
      corsair_events:        by_corsair_id(id), by_account(account_id), by_status(status)
      corsair_permissions:   by_corsair_id(id), by_token(token),
                             by_plugin_endpoint_tenant(plugin, endpoint, tenant_id)
```

---

## Example: Complete Request Trace

**Scenario:** GitHub sends a webhook when an issue is created.

```
 1. GitHub POST /api/webhook
    demo/testing/src/app/api/webhook/route.ts
    Body: { action: "opened", issue: { id: 123, title: "Bug", ... } }

 2. processWebhook(corsair, headers, body)
    packages/corsair/webhooks/index.ts
    --> Matches github plugin via X-GitHub-Event header
    --> Finds github.webhooks.issues.opened handler

 3. Webhook handler executes
    packages/github/webhooks/issues.ts
    --> Calls: corsair.github.api.issues.get({ issueNumber: 123 })

 4. Endpoint binding wraps the call
    packages/corsair/core/endpoints/bind.ts
    --> Permission check (if configured)
    --> Injects ctx: { key: oauth_token, db: entityClients }

 5. Issue endpoint handler runs
    packages/github/endpoints/issues.ts
    --> GET https://api.github.com/repos/.../issues/123
    --> ctx.db.issues.upsertByEntityId("123", { title, body, state, ... })

 6. PluginEntityClient.upsertByEntityId()
    packages/corsair/db/orm.ts
    --> Resolves accountId (cached)
    --> Delegates to adapter

 7. Adapter factory transforms
    packages/corsair/db/adapter-factory.ts
    --> sanitizeValue(data): Date("2024-01-01") --> 1704067200000
    --> No JSON stringify needed (Convex is 'native')

 8. ConvexDatabaseAdapter sends mutation
    packages/corsair/db/convex/adapter.ts
    --> client.mutation("entities:upsertByEntityId", {
          accountId, entityType: "issues", entityId: "123",
          version: "1.0", data: { title, body, state, ... }
        })

 9. Convex function executes server-side
    packages/corsair/db/convex/functions/entities.ts
    --> ctx.db.query('corsair_entities')
          .withIndex('by_account_type_entity', ...)
          .first()
    --> Not found: ctx.db.insert('corsair_entities', { ... })

10. Convex Cloud Database
    --> Row inserted in corsair_entities table
    --> Indexed for future lookups

11. Response flows back up
    --> transformOutput: strips _id, epoch --> Date
    --> Zod schema validates data field
    --> Returns TypedEntity<IssueSchema> to plugin
    --> Webhook handler returns { status: 200 }
```

---

## File Reference (by layer)

| Layer | File | Role |
|-------|------|------|
| Client | `demo/testing/src/app/page.tsx` | React UI |
| Routes | `demo/testing/src/app/api/webhook/route.ts` | HTTP entry |
| Config | `demo/testing/src/server/corsair.ts` | Corsair instance |
| Core | `packages/corsair/core/index.ts` | `createCorsair()` |
| Webhooks | `packages/corsair/webhooks/index.ts` | `processWebhook()` |
| Binding | `packages/corsair/core/endpoints/bind.ts` | Permission + hooks |
| Client | `packages/corsair/core/client/index.ts` | `buildCorsairClient()` |
| Plugins | `packages/github/endpoints/issues.ts` | Endpoint handlers |
| ORM Types | `packages/corsair/db/orm.ts` | Entity client types |
| Adapter IF | `packages/corsair/db/adapter.ts` | `CorsairDatabaseAdapter` |
| Factory | `packages/corsair/db/adapter-factory.ts` | `createAdapterTransforms()` |
| Convex Adapter | `packages/corsair/db/convex/adapter.ts` | `ConvexDatabaseAdapter` |
| Convex Fns | `packages/corsair/db/convex/functions/*.ts` | Server-side CRUD |
| Schema | `packages/corsair/db/convex/schema.ts` | Table definitions |
| Re-exports | `demo/testing/convex/*.ts` | Convex CLI deployment |
