# @corsair-dev/plain

Corsair plugin for the [Plain GraphQL API](https://www.plain.com/docs/graphql/introduction) (EU workspace endpoint `https://core-api.uk.plain.com/graphql/v1`).

## Auth setup

API-key only (`api_key`, no webhooks).

1. Create a key in Plain → **Settings → API keys**
2. Give it the scopes you need — at minimum `thread:read`, `customer:read`, `user:read`, `tier:read` for the read paths; mutations need the matching write scopes (e.g. `customerGroup:read` is required just to list customer groups)
3. Set `PLAIN_API_KEY` in your environment, or pass the key via Corsair credentials

Credentials are sent as `Authorization: Bearer <key>`.

Missing credentials throw `AuthMissingError` (never an empty string).

## Endpoint overview

All calls are `POST` GraphQL against `/graphql/v1`. Field selection verified against the live schema (`.../graphql/v1/schema.graphql`).

| Operation | GraphQL root | Description |
|-----------|--------------|-------------|
| `customers.getById` | `customer` | Fetch a customer by Plain ID |
| `customers.getByEmail` | `customerByEmail` | Fetch a customer by email |
| `customers.list` | `customers` | Paginated customer list (`CustomersFilter`, `FULL_NAME` sort) |
| `customers.upsert` | `upsertCustomer` | Create or update a customer (exactly-one identifier) |
| `customers.delete` | `deleteCustomer` | Delete a customer |
| `threads.create` | `createThread` | Create a thread (all 8 `ThreadChannel` values) |
| `threads.getById` | `thread` | Fetch a thread by Plain ID |
| `threads.query` | `threads` | Paginated thread list (`ThreadsFilter`, `ThreadsSort`) |
| `threads.listDeprecated` | `threads` | Alias of `query` (kept for compatibility) |
| `threads.fetchIssues` | `customer → threads → links` | Flatten external thread links (`ThreadLink` interface fields) into issue records |
| `threads.sendMessage` | `replyToThread` | Reply to a thread |
| `threads.update` | `updateThreadTitle` | Update a thread title |
| `users.getById` | `user` | Fetch a workspace member (incl. `isDeleted`) |
| `users.delete` | `deleteUser` | Delete a workspace member |
| `companies.fetch` | `company` | Fetch a company by ID |
| `companies.update` | `upsertCompany` | Create or update a company |
| `tiers.fetch` | `tier` | Fetch a tier by ID |
| `tiers.list` | `tiers` | Paginated tier list |
| `customerGroups.create` | `createCustomerGroup` | Create a customer group |
| `customerGroups.list` | `customerGroups` | Paginated group list (filter: `externalIds`) |
| `customerGroups.addCustomer` | `addCustomerToCustomerGroups` | Add a customer to ≤25 groups |
| `customerGroups.removeCustomer` | `removeCustomerFromCustomerGroups` | Remove a customer from groups |
| `graphql.run` | (arbitrary) | Run any GraphQL query (`write` risk level) |

No webhooks (not part of the Plain GraphQL surface used by this plugin).

## Quirks & caveats

- **No trailing slash.** `POST .../graphql/v1/` returns HTTP 404; only the exact documented URL works (verified live). The client splits base/path so the corsair URL builder emits it verbatim.
- **Key scope gates reads.** A key without `customerGroup:read` gets HTTP 403 on `customerGroups.list` while everything else returns 200 (observed live).
- **`tiers` / `customerGroups` connections have no `totalCount`** in the Plain schema (unlike `customers` / `threads`) — list outputs mirror that.
- **`ThreadLink` is an interface**; `fetchIssues` selects only interface fields, so no inline fragments are needed.
- **Every `unknown` in `client.ts` / `operations.ts` carries a `JUSTIFY` comment**: raw GraphQL JSON is always zod-parsed before any field is read; no `as` casts in production code.

## Tests

```bash
node packages/plain/node_modules/typescript/bin/tsc --noEmit -p packages/plain/tsconfig.json
node packages/plain/node_modules/jest/bin/jest.js --config packages/plain/jest.config.cjs --rootDir packages/plain
```

5 suites, all read-only except mocks (no live mutation is ever exercised):

- `schema.test.ts` — zod input/output validation per endpoint family
- `endpoints.test.ts` — all 23 ops mocked, plus mutation-error, pagination-guard, and auth-missing paths
- `client.test.ts` — transport, Bearer header, exact `v1` path, error wrapping
- `error-handler.test.ts` — 429 / 401 / default handlers
- `api.test.ts` — **live**, runs only when `PLAIN_API_KEY` and `CORSAIR_KEK` are set (uses a throwaway local test DB; `CORSAIR_KEK` can be any 32-char string). A read the key isn't scoped for becomes a loud `[live] SKIP` naming the missing scope instead of a failure; anything else still fails.

```bash
# PowerShell
$env:PLAIN_API_KEY = "plainApiKey_..."
$env:CORSAIR_KEK = "0123456789abcdef0123456789abcdef"
node packages/plain/node_modules/jest/bin/jest.js --config packages/plain/jest.config.cjs --rootDir packages/plain api.test.ts
```

## Live demo

Working proof recording (R4): _TODO — owner to add the demo video URL in the PR's "Screenshots / Demos" section._
