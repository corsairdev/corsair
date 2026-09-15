# Corsair Cloud Client Wrapper — Design Spec

**Date:** 2026-09-15
**Status:** Approved for planning (brainstorm with Yuvraj)
**Related:** `docs/corsair-cloud/rest-management-contract.md`, `apps/cloud-runtime/openapi.yaml` (hub repo)

## Goal

Give developers a best-in-class way to *use* a Corsair Cloud project — the same beautiful SDK ergonomics they already know, pointed at a hosted VM by swapping one credential — plus generated clients for other languages. This is the **client slice** of the broader Corsair Cloud product.

## North-star framing (context, not this spec's scope)

Corsair Cloud = a **white-label, hosted, multi-tenant backend for agentic products** (connections + calls + data + triggers), isolated one-VM-per-org, with a public **directory/store** as the distribution surface (the Vercel "make the store, not the skill" move). It beats Composio on *category* — multi-tenant native, multiplayer, same-code local→cloud, white-label, OSS, isolation-as-security — not on tool count. This spec builds the developer-consumption layer of that vision.

## Scope

**In (v1):**
- Flagship **TS client**: the existing `createCorsair` gains a cloud mode keyed on the `ck_cloud_` credential; the typed nested API routes calls to the VM over HTTP.
- Full **server-side surface**: invoke (`tenant.<plugin>.api.<op>()`), `manage.connect.createLink`, `manage.tenants.create`, `manage.connectionStatus.get`, `manage.disconnect`, discovery, `.db`.
- **Generated clients** for Python, Go, Swift off `openapi.yaml` (flat ergonomics).

**Out (deferred, with owning track):**
- Scoped-tenant tokens + runtime `resolveTenant` enforcement → **scopes track**.
- KEK-at-rest wrapping → **security track**.
- App-datastore (`corsair.data.*`) → own spec.
- MCP-per-project (agent consumption) → own spec (mostly repackages this surface).
- Public directory/store + one-click deploy → own track.

## Verified runtime reality (the constraints this design lives within)

Grounded in `corsair@0.1.134` running on the VM:

- **One static bearer key** (`CORSAIR_PROJECT_KEY`, a `ck_...`) authenticates the *entire* runtime.
- **Tenant identity is an unauthenticated URL parameter.** The invoke route `POST /:tenant/:plugin/call/:op` trusts the path tenant verbatim (`resolveTenant` deliberately unset). Empty → `default`.
- Therefore the cloud key grants **cross-tenant + admin** access (`createTenant`/`listTenants` use the same key). The signing secret is *not* used for call-time tenant authz — only Hub delivery envelopes and connect/permission tokens.
- Tokens at rest: AES-256-GCM envelope (KEK wraps DEK) in `/data/<slug>/corsair.db` (SQLite on EBS). KEK is plaintext in the VM `.env`, derived per-project as `HMAC-SHA256(HUB_CLOUD_KEK_SECRET, projectEnvId)`. No BYO-Postgres.

**Design consequence:** the cloud key is a **server credential**. v1 never puts it in a browser.

## Auth & tenancy model (v1)

Two credentials, two audiences, made impossible to confuse:

1. **Cloud key (`ck_cloud_`)** — server-side only. Full surface incl. admin. This is what the v1 client holds.
2. **Scoped tenant token** — browser-safe, pins one tenant, minted server-side by signing with the secret. **Deferred to the scopes track** (needs runtime `resolveTenant`). The client's shape reserves room for it so browser-direct slots in later with no server-code change.

**Browser story in v1:** frontend calls route through the developer's backend (which holds the key) — exactly how the existing React connect UX already works. "Switch the key, everything works the same" holds; it just runs through the backend until tenant-scoping ships.

## The flagship TS client

### Instantiation — same factory, cloud via the key

```ts
import { createCorsair, slack, linear } from "corsair";

const corsair = createCorsair({
  apiKey: process.env.CORSAIR_CLOUD_KEY!,   // ck_cloud_...  → cloud mode
  baseUrl: process.env.CORSAIR_CLOUD_URL!,  // https://<vm-slug>.corsair.cloud/<project-slug>/api/corsair
  plugins: [slack, linear],                 // TYPES ONLY — no plugin runtime ships client-side
  multiTenancy: true,
});
```

- Cloud mode is selected by the `ck_cloud_` prefix (precedent: `ck_dev_` auto-starts a dev tunnel).
- In cloud mode `database`/`kek` are **not** accepted (they live on the VM); passing them is a config error with a clear message.
- `plugins` are consumed for **types + op-name resolution only**. The design must allow passing plugin *type refs* without pulling their runtime into the client bundle. (Open question O1.)

### The surface (unchanged shape, remote executor)

Everything mirrors the in-process SDK; only the leaf executor changes.

| Call | Routes to |
|---|---|
| `corsair.withTenant("acme").slack.api.messages.post({...})` | `POST /acme/slack/call/messages.post` `{args}` |
| `corsair.manage.connect.createLink({ plugin, tenantId })` | `POST /connect/links` |
| `corsair.manage.connectionStatus.get({ tenantId })` | `GET /connection-status?tenantId=` |
| `corsair.manage.tenants.create({ id })` | `POST /tenants` |
| `corsair.manage.disconnect({ tenantId, plugin })` | `POST /disconnect` |
| `corsair.<plugin>.db.*` | (synced-data reads — same routes the SDK uses) |
| discovery (`listPlugins`, `getPlugin`, op tree) | `GET /plugins`, `/plugins/:id`, `GET /call` |

- All requests carry `Authorization: Bearer <ck_cloud_>`.
- The nested typed proxy (`buildCorsairClient`) is reused as-is; the change is the **remote executor** at the leaf: serialize `{args}`, POST to the invoke route, unwrap `{data}` / map the error envelope.
- Error envelope (`{ error, message, reason?, providerStatus? }`) maps to the SDK's existing typed errors (`not_connected`, `approval_required`, `provider_error`, etc.) so `catch` blocks written against local code work unchanged.

### Executor design

A new `RemoteExecutor` implementing the same internal call contract `buildCorsairClient` expects:
- `invoke(tenant, plugin, op, args)` → `POST /:tenant/:plugin/call/:op`
- management ops → the corresponding management routes (reuse the existing HTTP management client `createCorsairClient` where shapes match; extend it with the bearer key it currently lacks).

## Generated clients (Python, Go, Swift)

- Generated from `openapi.yaml` (the contract already declares clients are generated from it).
- Ergonomics are **flat by design**: `client.call(tenant, plugin, op, {args})`, `client.connect({tenantId, plugin})`, `client.createTenant({id})`. Documented as such — the beautiful nested shape is a TS-only property (compile-time plugin types).
- Auth: bearer cloud key, same as TS.
- Publishing: per-language package + a CI job that regenerates on `openapi.yaml` change. (Open question O2 — generator choice + repo layout.)

## Packaging & where code lives

- **TS cloud mode**: in `packages/corsair` core (the factory + remote executor). Keeps one client, one import.
- **Generated clients**: new per-language packages (layout TBD — O2).
- `openapi.yaml` (hub repo) is the source of truth for generated clients; the TS client is hand-mapped to the same routes and covered by a contract test that asserts the TS executor's route table matches `openapi.yaml`.

## Testing strategy

- **TS unit**: remote executor builds correct method/URL/body/headers per surface entry; error-envelope → typed-error mapping.
- **TS integration**: run the client against a mock runtime (fixture server implementing the openapi routes) — assert a call round-trips and a connect link comes back.
- **Contract test**: TS route table ⊆ `openapi.yaml` paths (fails if the runtime contract drifts).
- **Generated clients**: smoke test each against the same mock runtime.
- **Live smoke** (manual, not CI): against the running VM with a real `ck_cloud_` key — `createTenant` → `connect` → authorize → `messages.post`.

## Resolved decisions (were open questions)

- **O1 — type-only plugin imports → RESOLVED: types-only subpath export per plugin.** Each `@corsair-dev/<plugin>` exposes a types-only entry (e.g. `@corsair-dev/slack/types`) carrying the op/arg/return type surface with zero runtime. The cloud client imports those; no plugin runtime enters the client bundle. If a plugin lacks the subpath, the plan adds a generator step to emit it. (Rejected: codegen types from `GET /plugins` — loses compile-time guarantees and couples typing to a live runtime.)
- **O2 — generator + layout → RESOLVED: `openapi-generator-cli`, output under a top-level `clients/` dir.** One mature multi-language generator over three per-language toolchains. Generated packages live in `clients/{python,go,swift}/` at the SDK repo root (outside the pnpm workspace, since they aren't npm packages), each regenerated by a script + CI job on `openapi.yaml` change. (Revisit standalone repos only if release cadence demands it.)
- **O3 — discovery in the TS client → RESOLVED: expose it, thin.** Add `corsair.discover()` (`GET /call` op tree) and `corsair.manage.plugins.list()/get()` for dynamic/agent use. Compile-time types remain the primary path; discovery is the escape hatch.

## Non-goals restated

No scoped-tenant tokens, no `resolveTenant` change, no KEK-at-rest change, no app-datastore, no MCP, no directory — each is its own track. This spec ships the server-side client surface and generated clients only.
