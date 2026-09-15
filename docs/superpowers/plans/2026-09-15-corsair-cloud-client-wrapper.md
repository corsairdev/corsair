# Corsair Cloud Client Wrapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a developer use a Corsair Cloud project with the exact SDK ergonomics they already know — `createCorsair` in cloud mode, selected by a `ck_cloud_` key, routes the typed nested API to the VM over HTTP — plus generated Python/Go/Swift clients.

**Architecture:** Cloud mode is a second executor behind the same `createCorsair` factory. In-process mode builds the client via `buildCorsairClient` (DB + KEK + plugin runtime). Cloud mode builds a **JS Proxy** that mirrors the same `client[plugin].api.<...op>` shape but each leaf serializes to `POST /:tenant/:plugin/call/:op` on the VM, and a parallel `manage` namespace hits the management routes — all authed by the `ck_cloud_` bearer key. No DB/KEK/plugin-runtime execution client-side. Generated clients come from `openapi-generator-cli` off a vendored copy of the runtime contract.

**Tech Stack:** TypeScript (packages/corsair, pnpm + turbo, **biome**, tab indent), `fetch`, `openapi-generator-cli` for Python/Go/Swift.

**Spec:** `docs/superpowers/specs/2026-09-15-corsair-cloud-client-wrapper-design.md`

## Global Constraints

- **Biome formatting**: tab indent, run `pnpm lint:fix` (biome) before every commit; 2-space JSON.
- **Commands (must pass before "done")**: `pnpm typecheck`, `pnpm lint`, `pnpm test` — run the literal command, read the exit code.
- **No AI-tell**: no `ponytail:`/AI-attribution/explanatory comments; comments only for non-obvious intent. No co-author/generated-with lines in commits.
- **Minimal diffs**: touch only what the task needs; do not restructure orthogonal code.
- **Cloud key is a server credential** — never introduce a browser-direct path in this plan; browser routes through the developer's backend.
- **The runtime contract is authoritative**: `apps/cloud-runtime/openapi.yaml` (hub repo). This plan vendors a copy into the SDK repo; the TS route table must match it (Task 6).
- **Auth header on every request**: `Authorization: Bearer <ck_cloud_...>`; compare/route are the only trust — no tenant signing in v1 (deferred to scopes track).

---

## File Structure

**Part A — flagship TS client (`packages/corsair/core/cloud/`):**
- `http.ts` — fetch transport: URL join, bearer header, JSON, error-envelope → typed-error mapping.
- `client.ts` — `buildCloudClient(plugins, opts)`: the Proxy that turns `[plugin].api.<path>` into an invoke call.
- `manage.ts` — `buildCloudManagement(opts)`: connect / tenants / connectionStatus / disconnect / discovery over HTTP.
- `index.ts` — `buildCloudCorsair(config)`: assembles the single-tenant client / tenant wrapper to match `createCorsair`'s return shape.
- `contract.openapi.yaml` — vendored copy of the runtime contract (source: hub `apps/cloud-runtime/openapi.yaml`; sync by hand).
- `__tests__/` — one test file per module above + an integration test against a mock runtime.

**Modified:**
- `packages/corsair/core/index.ts` — detect `ck_cloud_` in `config.hub.projectApiKey`; delegate to `buildCloudCorsair`.
- `packages/corsair/hub/index.ts` (HubConfig input) — add optional `baseUrl` (the VM project base URL); also read `CORSAIR_CLOUD_URL`.

**Part B — generated clients (repo root `clients/`):**
- `clients/openapi-generator-config.json` — generator settings.
- `clients/{python,go,swift}/` — generated output (committed).
- `scripts/generate-clients.mjs` — regenerate from the vendored contract.
- `.github/workflows/cloud-clients.yml` — regenerate-drift check + Python/Go smoke.

---

## Task 1: Cloud HTTP transport + error mapping

**Files:**
- Create: `packages/corsair/core/cloud/http.ts`
- Test: `packages/corsair/core/cloud/__tests__/http.test.ts`

**Interfaces:**
- Produces: `type CloudTransport = { baseUrl: string; apiKey: string; fetch?: typeof fetch }`; `async function cloudRequest<T>(t: CloudTransport, method: string, path: string, body?: unknown): Promise<T>` — joins `baseUrl`+`path`, sets `Authorization: Bearer <apiKey>` and `content-type: application/json`, parses JSON, and on a non-2xx maps the `{ error, message, reason?, providerStatus? }` envelope to the SDK's existing typed errors via `mapCloudError(status, body)`.
- Consumes: the SDK error classes in `packages/corsair/core/errors` (reuse; do not invent new ones).

- [ ] **Step 1: Read the existing error types.** Read `packages/corsair/core/errors/` to find the exported error classes and the machine codes (`not_connected`, `approval_required`, `provider_error`, `unauthorized`, `unknown_plugin`, `unknown_op`, `bad_request`, `internal_error`, …). Note the exact class names + constructor signatures for the mapping.

- [ ] **Step 2: Write the failing test.**
```ts
import { describe, it, expect, vi } from 'vitest';
import { cloudRequest, type CloudTransport } from '../http';

function transportWith(res: Response): CloudTransport {
  return { baseUrl: 'https://vm.example/proj/api/corsair', apiKey: 'ck_cloud_x', fetch: vi.fn().mockResolvedValue(res) };
}

describe('cloudRequest', () => {
  it('sends bearer auth and returns parsed data', async () => {
    const t = transportWith(new Response(JSON.stringify({ data: { ok: 1 } }), { status: 200 }));
    const out = await cloudRequest<{ data: { ok: number } }>(t, 'POST', '/default/slack/call/messages.post', { args: {} });
    expect(out).toEqual({ data: { ok: 1 } });
    const call = (t.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe('https://vm.example/proj/api/corsair/default/slack/call/messages.post');
    expect((call[1].headers as Record<string,string>).authorization).toBe('Bearer ck_cloud_x');
  });

  it('maps an error envelope to a typed error', async () => {
    const t = transportWith(new Response(JSON.stringify({ error: 'not_connected', message: 'connect slack' }), { status: 400 }));
    await expect(cloudRequest(t, 'POST', '/default/slack/call/messages.post', { args: {} })).rejects.toMatchObject({ code: 'not_connected' });
  });
});
```
(Use the repo's actual test runner — match sibling tests; the assertion on the error should check whatever field the SDK error classes expose for the machine code.)

- [ ] **Step 3: Run it, watch it fail.** `pnpm --filter corsair test http.test` → FAIL (module missing).

- [ ] **Step 4: Implement `http.ts`.** URL join that tolerates a trailing slash on `baseUrl` and a leading slash on `path`; `fetch ?? globalThis.fetch`; on non-2xx parse the envelope and throw the mapped typed error (fall back to a generic error for `internal_error`/unparseable bodies).

- [ ] **Step 5: Green + lint.** `pnpm --filter corsair test http.test` PASS; `pnpm lint:fix`.

- [ ] **Step 6: Commit.** `feat(cloud): http transport with typed error mapping`

## Task 2: Invoke proxy — `buildCloudClient`

**Files:**
- Create: `packages/corsair/core/cloud/client.ts`
- Test: `packages/corsair/core/cloud/__tests__/client.test.ts`

**Interfaces:**
- Consumes: `cloudRequest`/`CloudTransport` (Task 1); `CorsairPlugin` (`core/plugins`); the return types `CorsairSingleTenantClient<Plugins>` / `CorsairTenantClient` (`core/client`).
- Produces: `function buildCloudClient<Plugins extends readonly CorsairPlugin[]>(plugins: Plugins, opts: { transport: CloudTransport; tenantId: string }): CorsairClient<Plugins>` — a Proxy where `client[pluginId].api.<a>.<b>…(args)` POSTs to `/:tenantId/:pluginId/call/a.b…` with `{ args }` and returns `res.data`.

- [ ] **Step 1: Write the failing test.**
```ts
it('routes a nested op to the invoke path', async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { ts: '1' } }), { status: 200 }));
  const transport = { baseUrl: 'https://vm/proj/api/corsair', apiKey: 'ck_cloud_x', fetch: fetchMock };
  const client = buildCloudClient([{ id: 'slack' } as any], { transport, tenantId: 'acme' });
  const out = await (client as any).slack.api.messages.post({ channel: '#g', text: 'hi' });
  expect(out).toEqual({ ts: '1' });
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe('https://vm/proj/api/corsair/acme/slack/call/messages.post');
  expect(JSON.parse(init.body)).toEqual({ args: { channel: '#g', text: 'hi' } });
});

it('rejects a call to a plugin not in the client', async () => {
  const client = buildCloudClient([{ id: 'slack' } as any], { transport: {} as any, tenantId: 'acme' });
  expect(() => (client as any).notaplugin.api.x.y()).toThrow();
});
```

- [ ] **Step 2: Run it, watch it fail.**

- [ ] **Step 3: Implement the Proxy.** Top-level Proxy keyed by plugin id (validate against the passed `plugins` set — unknown id throws a clear error). Under a plugin, an `api` Proxy accumulates the access path; invoking the leaf joins the path with `.`, and calls `cloudRequest(transport, 'POST', \`/${tenantId}/${pluginId}/call/${dotPath}\`, { args })` → returns `res.data`. Cast the Proxy to `CorsairClient<Plugins>`. **Do not** expose `db`/`keys`/`webhooks` in cloud mode (deferred — see spec); accessing them throws a clear "not available in cloud mode (deferred)" error.

- [ ] **Step 4: Green + lint.**

- [ ] **Step 5: Commit.** `feat(cloud): typed invoke proxy`

## Task 3: Cloud management namespace

**Files:**
- Create: `packages/corsair/core/cloud/manage.ts`
- Test: `packages/corsair/core/cloud/__tests__/manage.test.ts`

**Interfaces:**
- Consumes: `cloudRequest`/`CloudTransport` (Task 1).
- Produces: `function buildCloudManagement(transport: CloudTransport)` returning an object shaped to match the in-process `manage` namespace where the routes exist:
  - `connect.createLink({ plugin, tenantId, redirectUri? })` → `POST /connect/links` → `{ url|connectUrl, state }`
  - `tenants.create({ id })` → `POST /tenants`; `tenants.list()` → `GET /tenants`; `tenants.get(id)` → `GET /tenants/:id`
  - `connectionStatus.get({ tenantId })` → `GET /connection-status?tenantId=`
  - `disconnect({ tenantId, plugin })` → `POST /disconnect`
  - `plugins.list()` → `GET /plugins`; `plugins.get(id)` → `GET /plugins/:id`
  - `discover()` → `GET /call` (op tree)

- [ ] **Step 1: Write failing tests** — one per method asserting method + URL (+ query/body). Example for connectionStatus:
```ts
it('connectionStatus.get hits the query route', async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ slack: { connected: true } }), { status: 200 }));
  const m = buildCloudManagement({ baseUrl: 'https://vm/p/api/corsair', apiKey: 'ck_cloud_x', fetch: fetchMock });
  await m.connectionStatus.get({ tenantId: 'acme' });
  expect(fetchMock.mock.calls[0][0]).toBe('https://vm/p/api/corsair/connection-status?tenantId=acme');
});
```

- [ ] **Step 2: Run, watch fail.**

- [ ] **Step 3: Implement `manage.ts`** — thin wrappers over `cloudRequest`; `tenantId` query params URL-encoded. Normalize the connect-link field to whatever the in-process `manage.connect.createLink` returns (check `core/management` for the field name — `connectUrl`) so calling code is unchanged.

- [ ] **Step 4: Green + lint.**

- [ ] **Step 5: Commit.** `feat(cloud): management namespace over http`

## Task 4: Assemble cloud client + wire into `createCorsair`

**Files:**
- Create: `packages/corsair/core/cloud/index.ts`
- Modify: `packages/corsair/core/index.ts`
- Modify: `packages/corsair/hub/index.ts` (HubConfig input — add `baseUrl?`)
- Test: `packages/corsair/core/cloud/__tests__/index.test.ts`

**Interfaces:**
- Consumes: `buildCloudClient` (T2), `buildCloudManagement` (T3).
- Produces: `function buildCloudCorsair<Plugins>(config: CorsairIntegration<Plugins>): CorsairSingleTenantClient<Plugins> | CorsairTenantWrapper<Plugins>` — matches `createCorsair`'s return shape: multiTenancy → `{ withTenant(id), manage }`; single → cloud client spread + `{ manage }`. `keys`/`permissions` throw a clear "not available in cloud mode" (deferred).

- [ ] **Step 1: Resolve the base URL + key.** Read `packages/corsair/hub/index.ts` for the HubConfig input type; add optional `baseUrl`. Cloud base URL resolution order: `config.hub.baseUrl` → `process.env.CORSAIR_CLOUD_URL`; if a `ck_cloud_` key is present but no base URL resolves, throw a clear error naming both sources.

- [ ] **Step 2: Write the failing test.**
```ts
it('createCorsair with a ck_cloud_ key returns a cloud tenant wrapper', async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { ts: '1' } }), { status: 200 }));
  const corsair = createCorsair({
    plugins: [slack()],
    multiTenancy: true,
    hub: { projectApiKey: 'ck_cloud_x', baseUrl: 'https://vm/p/api/corsair' },
    // @ts-expect-no-error: cloud mode ignores db/kek
  } as any);
  const out = await corsair.withTenant('acme').slack.api.messages.post({ channel: '#g', text: 'hi' });
  expect(out).toEqual({ ts: '1' });
});
```
(Inject the fetch through the transport — thread an optional `fetch` from hub config or a test seam so the test doesn't hit the network.)

- [ ] **Step 3: Run, watch fail.**

- [ ] **Step 4: Implement.** In `core/index.ts`, at the top of `createCorsair`, if `config.hub?.projectApiKey?.startsWith('ck_cloud_')` → `return buildCloudCorsair(config)` (before the DB/KEK setup). `buildCloudCorsair` builds the `CloudTransport`, then mirrors the multiTenancy/single-tenant assembly using `buildCloudClient` + `buildCloudManagement`. Reuse `CORSAIR_INTERNAL` tagging only if a consumer relies on it; otherwise omit.

- [ ] **Step 5: Green + typecheck.** `pnpm --filter corsair test`; `pnpm --filter corsair typecheck` — the cloud client must satisfy `CorsairClient<Plugins>` so existing typed call sites compile unchanged.

- [ ] **Step 6: Commit.** `feat(cloud): createCorsair cloud mode via ck_cloud_ key`

## Task 5: Mock runtime fixture + integration test

**Files:**
- Create: `packages/corsair/core/cloud/__tests__/mock-runtime.ts`
- Test: `packages/corsair/core/cloud/__tests__/integration.test.ts`

**Interfaces:**
- Produces: `startMockRuntime(): { url: string; close(): Promise<void>; calls: Array<{method:string;path:string;body?:unknown}> }` — an in-process HTTP server implementing the openapi routes with canned responses (200 `{data}` for invoke, `{connectUrl,state}` for connect, `201 {id}` for createTenant, etc.), rejecting requests without the bearer key with `401 {error:'unauthorized'}`.

- [ ] **Step 1: Write the failing integration test** — a full round-trip with `createCorsair({ hub: { projectApiKey:'ck_cloud_x', baseUrl: mock.url } })`: `manage.tenants.create({id:'acme'})` → `manage.connect.createLink({plugin:'slack',tenantId:'acme'})` returns a `connectUrl` → `withTenant('acme').slack.api.messages.post(...)` returns data. Assert `mock.calls` recorded the expected method+path sequence, and that a missing key yields the typed unauthorized error.

- [ ] **Step 2: Run, watch fail.**

- [ ] **Step 3: Implement the mock runtime** using node `http` (no new dep). Keep responses minimal but shaped per `openapi.yaml`.

- [ ] **Step 4: Green + lint.**

- [ ] **Step 5: Commit.** `test(cloud): mock-runtime round-trip integration`

## Task 6: Contract test — TS routes ⊆ runtime openapi

**Files:**
- Create: `packages/corsair/core/cloud/contract.openapi.yaml` (vendored copy of hub `apps/cloud-runtime/openapi.yaml`)
- Create: `packages/corsair/core/cloud/routes.ts` (single source of the route templates the manage namespace uses)
- Test: `packages/corsair/core/cloud/__tests__/contract.test.ts`

**Interfaces:**
- Produces: `export const CLOUD_ROUTES` — the exact path templates (`/connect/links`, `/tenants`, `/tenants/:id`, `/connection-status`, `/disconnect`, `/plugins`, `/plugins/:id`, `/call`, `/:tenant/:plugin/call/:op`) that Tasks 2–3 reference (refactor them to import from here).

- [ ] **Step 1: Vendor the contract.** Copy `apps/cloud-runtime/openapi.yaml` (hub) → `contract.openapi.yaml`, with a top comment: `Source of truth: corsairdev/hub apps/cloud-runtime/openapi.yaml — sync by hand on contract change.`

- [ ] **Step 2: Refactor Tasks 2–3 to use `CLOUD_ROUTES`** (no behavior change; keep their tests green).

- [ ] **Step 3: Write the contract test.** Parse `contract.openapi.yaml` (use the repo's existing YAML dep if any, else a tiny path-line extraction), normalize `:param` ↔ `{param}`, and assert every entry in `CLOUD_ROUTES` exists as a path in the contract. FAIL if the TS client references a route the runtime doesn't serve.

- [ ] **Step 4: Green + lint.**

- [ ] **Step 5: Commit.** `test(cloud): contract test binds TS routes to runtime openapi`

---

## Task 7: Generated-client tooling

**Files:**
- Create: `clients/openapi-generator-config.json`
- Create: `scripts/generate-clients.mjs`
- Modify: root `package.json` (add `"generate:clients": "node scripts/generate-clients.mjs"`)

- [ ] **Step 1: Add the generator config.** Target Python (`python`), Go (`go`), Swift (`swift5`); package names `corsair_cloud` / `corsaircloud` / `CorsairCloud`; input = `packages/corsair/core/cloud/contract.openapi.yaml`; output = `clients/{python,go,swift}`.

- [ ] **Step 2: Write `generate-clients.mjs`.** Shell out to `npx @openapitools/openapi-generator-cli generate` once per language from the config; fail on non-zero exit. No network beyond the generator's own npx fetch.

- [ ] **Step 3: Verify it runs.** `node scripts/generate-clients.mjs` produces the three dirs. Paste the tree summary (evidence).

- [ ] **Step 4: Commit.** `chore(clients): openapi-generator tooling`

## Task 8: Generate + commit Python/Go/Swift clients

**Files:**
- Create: `clients/{python,go,swift}/**` (generated)

- [ ] **Step 1: Run `pnpm generate:clients`.**

- [ ] **Step 2: Sanity-compile locally where cheap.** Python: `python -m py_compile` the package (or import). Go: `go build ./...` in `clients/go`. Swift: `swift build` if a toolchain is present, else note it as manual (ceiling — Swift CI is out of scope).

- [ ] **Step 3: Add a short `clients/README.md`** — flat ergonomics (`client.call(tenant, plugin, op, {args})`), bearer cloud key, "regenerate with `pnpm generate:clients`", and that these are server-side clients (cloud key = server credential).

- [ ] **Step 4: Commit.** `feat(clients): generated python/go/swift cloud clients`

## Task 9: Smoke tests + CI

**Files:**
- Create: `clients/python/smoke_test.py`, `clients/go/smoke_test.go`
- Create: `.github/workflows/cloud-clients.yml`

- [ ] **Step 1: Python + Go smoke tests** — call a locally-run mock server (reuse the shape from Task 5, or a tiny language-native stub) asserting a `call` round-trips with the bearer header. Keep them dependency-light.

- [ ] **Step 2: CI workflow** — on change to `contract.openapi.yaml` or `clients/**`: (a) run `pnpm generate:clients` and `git diff --exit-code clients/` to catch drift (generated output must be committed), (b) run the Python + Go smoke tests. Swift generation runs but is not smoke-tested (ceiling: Swift toolchain in CI is expensive).

- [ ] **Step 3: Verify the drift check locally** — regenerate, confirm `git diff --exit-code clients/` is clean.

- [ ] **Step 4: Commit.** `ci(clients): drift check + python/go smoke`

---

## Self-Review Notes (author)

- **Spec coverage:** server client surface (invoke, connect, tenants, status, disconnect, discovery) = Tasks 2–4; generated clients = 7–9; auth model (bearer, server-only) = Tasks 1/5; contract binding = 6. `.db` and scoped-tenant tokens are spec non-goals — not planned here.
- **Type consistency:** `buildCloudClient` returns `CorsairClient<Plugins>`; Task 4 asserts existing typed call sites compile unchanged (the whole point of "switch the key").
- **Deferred, flagged in-code:** `db`/`keys`/`permissions` throw "not available in cloud mode (deferred)" rather than silently missing.
- **Ceilings named:** Swift not smoke-tested in CI; vendored `contract.openapi.yaml` synced by hand (drift check catches TS-side drift, not hub-side edits).
