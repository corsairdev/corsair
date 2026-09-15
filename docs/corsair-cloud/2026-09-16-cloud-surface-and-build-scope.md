# Corsair Cloud — surface map, security model, and build scope

**Date:** 2026-09-16 · **Status:** draft for review · **Owner:** Yuvraj
**Anchors this to:** PR #1739 (feat/cloud-client-wrapper) and the 2026-09-15 Dev/Yuvraj call.

This doc exists because "add `createCorsairCloud` + fix the reconnect bug" was
under-scoping. It states the mission, maps the surface, states the real security
model, and sequences the build so nothing gets dropped. Verified facts were
checked against the live VMs / code this session; everything else is design.

## 0. The mission (don't lose this)

**Corsair Cloud = a hosted runtime (one VM per org) exposing ONE stable HTTP
contract, and a family of thin clients — every language and framework — that all
speak that contract.** The headline is *reach*: build the VM + its HTTP surface
once, then call it from TypeScript, Python, Go, Swift, Rust, and any framework
(React first), because every call is just HTTP to `/<tenant>/<plugin>/call/<op>`.

Not the mission (parked — reserved in shape only, see §10): `use DB` /
knowledge-graph, vector search, external DB provisioning (Neon…).

### Two setup modes — one package, one contract

Both are a `corsair.ts`; both hit the same VM contract. Difference = where the
key lives and how you call:

| | Server-side | Client-side |
|---|---|---|
| Entry | `createCorsairCloud({ apiKey, url, signingSecret })` | `<CorsairProvider baseURL=…>` (keyless; backend proxy injects the key) |
| Secret | backend, safe | browser never sees it |
| Tool calls | `corsair.withTenant(t).notion.api.<op>(args)` | `const { api } = useCorsair(); api('notion.<op>', args)` — `useQuery`-shaped |
| Data reads | `manage.*` (+ `db` later) | `const { db } = useCorsair()` — tenant-scoped KG (reserved) |
| Tenant | caller passes / backend trusts | **resolved server-side from session — browser never trusted** |

`useCorsair()` exposes `{ api, db }`: `api()` = per-op tool calls (TanStack-query
style, not GraphQL); `db()` = the KG read surface. `db` is parked as a feature but
**reserved in the hook shape now** so the wrapper never gets reshaped later. The
**tenant-resolver** (server resolves tenant, never trust the client) must exist
the moment any client-side call ships — held even while `db` is parked.

---

## 1. How the VM actually runs (verified)

- **One bundle, many processes.** `/opt/corsair/runtime/<version>/server.mjs` is
  shared code, downloaded once per version. **Each project runs its own
  `corsair-runtime@<slug>` systemd process**, on its own port, with its own
  SQLite at `/data/projects/<slug>/corsair.db`. Caddy routes `/<slug>/…` → that
  port. Verified live: `env46a4bqur0vc`→:4001, `envk9bfuz7m738`→:4000, separate
  units.
- **Concurrency:** cross-project = real OS parallelism (separate processes);
  within one project = single Node event loop (async-concurrent, not parallel).
  Projects are isolated (separate memory + DB file). Nothing is serialized across
  projects.
- **Scaling ceiling (open):** `t4g.small` = 2 vCPU / 2 GB. N projects = N node
  processes sharing 2 GB. Needs a resting-mode / per-project memory story before
  many projects share a VM.
- **Config delivery:** Hub → VM is **SSM Run Command** (not HTTP): writes
  `/opt/corsair/<slug>/{.env,config.json}` + a Caddy route, restarts the unit,
  health-checks `/<slug>/api/corsair/ok`.

## 2. Runtime auth today (verified) — the god-key reality

- `/call` and management routes are gated by a **single bearer check** on the
  `ck_cloud_…` project key (`authenticate` in the runtime), and **`resolveTenant`
  is left unset** — so the **URL tenant is trusted**. Whoever holds the project
  key can address **any tenant on that project** and read its data.
- Cross-**project** isolation is real (different keys / VMs). Cross-**tenant**
  isolation **within a project does not exist yet**. This is the "API key + URL =
  extract anything" hole.
- **The signing secret does not fix this.** A signed request for `tenant=victim`
  is still authorized. The fix is server-side: a **tenant resolver** + **per-key
  scopes**. See §5.

## 3. The full surface — who calls whom

✅ = exists on the VM today · 🔨 = to build · (SSM) = not HTTP

| Caller → callee | Purpose | Surface |
|---|---|---|
| App backend (`createCorsairCloud`) | tool calls | `POST /:tenant/:plugin/call/:op` ✅, `GET /call` list ✅ |
| App backend | management | `/tenants` GET/POST ✅, `/connection-status` ✅, `/connect/links` ✅, `/disconnect` ✅, `/plugins` ✅, `/permissions/*` ✅ |
| App browser (`CorsairProvider`) | connect UX | connect link + OAuth handoff + status poll ✅ |
| App backend (`use DB`) | tenant-scoped data / knowledge-graph reads | ⏸ `POST /:tenant/db/*` — parked, reserved in the hook shape (§10) |
| Hub → VM | config apply | SSM ✅ |
| Hub → VM | managed token delivery | base-path signed delivery ✅ (`managed-oauth.ts`) |
| Provider → VM | webhooks | webhook delivery ✅ |
| VM → Hub | status reports, OAuth refresh, connect-link mint | `/connections/report`, `/oauth/refresh` ✅ |
| VM → provider | the actual API call | outbound ✅ |
| VM ↔ store | accounts / integrations / **entities (KG)** / events | SQLite ✅; external DB (Neon…) 🔨 |

The cloud **client** wires only a subset today (tenants/status/connect/disconnect
+ call); the rest is "deferred" in `buildCloudManageNamespace`. `use DB` is
net-new on both client and VM.

## 4. Client surface: `createCorsair` vs `createCorsairCloud` (this PR)

- **`createCorsairCloud({ apiKey, url, signingSecret? })`** — dedicated cloud
  surface. No plugin list, no kek/db, **multi-tenant by default**. Runtime is a
  dynamic proxy: `corsair.withTenant(t).<plugin>.api.<op>(args)` → HTTP call.
- **Typing without a plugin list:** autocomplete can only come from a *static*
  type, never from a runtime URL. So types come from an **augmentable interface**
  `CorsairCloudRegistry` — dynamic (`any`) until populated, then fully typed.
  Two ways to populate it:
  1. **inline generic** `createCorsairCloud<{ notion: NotionApi }>()` (stopgap, today);
  2. **generated `corsair-env.d.ts`** via the CLI (`pnpm corsair pull`) that
     declaration-merges the VM's live plugins + ops + **scopes** onto the same
     interface — humans get IntelliSense, agents run `pnpm corsair list`, no
     plugin list passed. **This is the real DX answer** (matches Dev's CLI
     direction) and is the next build after this PR.
- **`createCorsair`** stays the local/hub constructor. `multiTenancy` default
  flips to **true** next package version (override `false`). The `ck_cloud_`
  auto-detect still delegates to the cloud path for back-compat.

**Built in this PR (verified green):** `createCorsairCloud` + augmentable typing
+ exports + tests; the stale-token bug fix folded in (see §6). **Not yet:**
`multiTenancy: true` default in `createCorsair` (breaking type change — its own
careful pass), and the CLI-generated types.

## 5. Security model — the real build

Three layers, in priority order:

1. **Tenant resolver (server-side).** `createCorsairCloud` is a **backend**
   surface. The VM (or a thin middleware) must resolve the tenant from the
   caller's identity, not trust the URL segment — closes cross-tenant read. This
   is the "protected procedure" from the call.
2. **Per-key scopes** (replicate Composio). A readonly-Slack key must only reach
   read ops — enforced server-side, and reflected in the generated types (§4).
3. **Signed requests.** Accept `signingSecret` in `createCorsairCloud` (done,
   reserved) and have the VM **verify HMAC + freshness** — same secret Hub already
   signs deliveries with, one auth model. Only meaningful once the VM verifies;
   until then it is forward-compat only. **Does not replace 1 or 2.**

## 6. Stale-token bug (fixed this PR)

"Needs reconnect" was a false negative: the token was valid at Notion (verified
200), but the long-lived `/call` client cached a key-manager whose account
snapshot went stale after an out-of-band token rewrite → `AuthMissingError` →
`verified:false`. **Fix:** the account key-manager re-reads the row per
credential access (DEK stays cached, keyed to its ciphertext), so a cached client
always sees current credentials. Regression test covers it. Immediate remediation
applied live (runtime restart cleared the poisoned cache).

An earlier second layer — evicting the cached `/call` client on token delivery —
was **dropped after review**: it's redundant with the re-read fix, and evicting a
client mid-refresh could split the single-flight store and double-spend a
rotating `refresh_token` (a new false-reconnect path). One live client per tenant
stays invariant.

Known, deferred to P5: `doUpdateConfig` captures the DEK before the write and
never revalidates it, so a DEK rotation racing a config write can diverge the
stored config from the row's `dek` column (pre-existing; needs a transactional /
optimistic-locked config write).

## 7. Provisioning + versioning — never-fail (proposal)

Break points found and the fixes:
1. **Boot race** — SSM Online ≠ cloud-init done → apply hit a missing unit.
   **Fixed** (hub `feat/cloud-ssm-wait`: `cloud-init status --wait` + unit-template
   assert + wider poll timeout).
2. **Version drift** — `DEFAULT_RUNTIME_VERSION` is a hardcoded constant; publish
   and pointer can diverge, and a bump before upload makes every apply
   `curl`-fail. **Fix:** ordered release — npm publish → S3 bundle upload → *then*
   flip a Hub version **pointer** (DB/env, not a constant); Hub does an **S3 HEAD
   pre-flight** before apply and fails fast with a clear reason.
3. **No retry** — the reconciler drives only `pending`/`applying`, so an `error`
   project stays stuck forever. **Fix:** retry `error` projects (bounded), and/or
   a redeploy that re-enqueues.

## 8. Build sequence (mission-focused)

Pillars in order: **(1) runtime never-fails → (2) one contract, many clients →
(3) enough security to ship.**

- **P0 (this PR #1739):** `createCorsairCloud` + augmentable typing + stale-token
  fix. → verify, merge, release the package, then bump VMs.
- **P1 runtime never-fail:** versioning pipeline (publish→upload→flip version
  *pointer*) + S3 HEAD pre-flight before apply + reconciler retries `error`.
  Fold in `createCorsair` mt-default-true with this package release.
- **P2 the contract:** freeze the VM HTTP surface as `openapi.yaml` /
  `contract.openApi` — the single source for both TS types and every generated
  client. Fill the cloud client's `manage` namespace to the full contract (today
  it wires a subset; the rest is "deferred").
- **P3 TS DX from the contract:** `pnpm corsair list` (agents) + `pnpm corsair
  pull` → generated `corsair-env.d.ts` merged onto `CorsairCloudRegistry` (human
  IntelliSense).
- **P4 multi-language clients (from the contract):** Swift + TS first (hackathon),
  then Python / Go / Rust. Contract-driven generator (JVM runtime).
- **P5 React wrapper:** `CorsairProvider` (exists) + `useCorsair() → { api, db }`.
  Build `api()` (useQuery-shaped tool calls) + the **tenant-resolver** seam; `db()`
  is shaped/reserved, not implemented.
- **P6 security fast-follow:** VM verifies the signing secret (HMAC + freshness) +
  per-key scopes (Composio parity); scopes flow into the generated types (P3).
- **P7 scaling:** resting-mode / per-project memory before many projects share a VM.

## 9. Known/deferred correctness

- `doUpdateConfig` captures the DEK before the write and never revalidates it, so a
  DEK rotation racing a config write can diverge the stored config from the row's
  `dek` column (pre-existing; needs a transactional / optimistic-locked write).
  Address with P6.

## 10. Parked — reserved in shape only, not built

Kept out of the near-term plan; the architecture only reserves room so we never
reshape later:

- **`use DB` / knowledge-graph:** VM `POST /:tenant/db/*`, vector/search, and the
  `db()` half of `useCorsair`. The hook exposes `db` from day one (P5) but it
  no-ops / errors until this lands. Its floor is the tenant-resolver (P5).
- **External DB provisioning:** Neon, then Supabase / Railway / Render. "Sign in
  with Neon" → user DB URL; Corsair adds its tables; tokens stay KEK-encrypted (we
  hold the KEK). Incentive = foreign-key into the user's own schema.

## Open decisions

- Version pointer home: Hub DB row vs env var (recommend DB row, per-env override).
- Signature scheme: HMAC(secret, method+path+body+ts+nonce); reuse Hub's exact
  delivery-signing so the VM verifies one way.
- Where the tenant resolver runs: on-VM vs a Hub-side middleware the client calls.
- Codegen host for the multi-language clients (JVM generator) — CI job shape.
