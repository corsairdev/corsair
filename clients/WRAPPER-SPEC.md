# Corsair Cloud client wrappers — canonical shape

Every language wrapper is a **thin idiomatic HTTP client** over the hosted
runtime's contract (`packages/corsair/core/cloud/contract.openapi.yaml`). It is
**not** generated — the `/call` surface is dynamic (ops are plugin-defined and
discovered at runtime), so a hand-written ~150-line client gives far better DX
than a generated blob. The TS `createCorsairCloud` is the reference; every other
language mirrors this shape.

## What every wrapper takes
- `apiKey` — the `ck_cloud_<slug>_<secret>` project key. Sent as
  `Authorization: Bearer <apiKey>`, and the base URL is **derived from it**:
  parse the slug (first segment after `ck_cloud_`) → `https://api.corsair.cloud/<slug>/api/corsair`.
  So the key is the only value a developer passes.
- `url` — **optional** dev/testing override for the derived URL. Reject a plain
  `http://` unless the host is loopback (the key is a bearer token).
- (optional, later) `databaseUrl` — for BYO/hosted Postgres; consumed by the
  runtime at provision, not by the client.

## The surface (mirror across languages)
- **Tool call** — `withTenant(t).<plugin>.call(op, args) → data`
  → `POST <base>/{tenant}/{plugin}/call/{op}` body `{ "args": {...} }`, returns `.data`.
- **Management** (fixed shape, from the contract):
  - `manage.tenants.list() / create(id) / get(id)`
  - `manage.connect.createLink({ plugin, tenantId, redirectUri? }) → { connectUrl, expiresAt, tenantId }`
  - `manage.connectionStatus.get({ tenantId }) → { <plugin>: "connected" | "missing_credentials" | "not_connected" }`
  - `manage.disconnect({ plugin, tenantId })`
  - `manage.plugins.list() / get(id)` and `manage.discover()` (GET `/call` → op tree) for discovery
- **Errors** — map the runtime envelope `{ error, message, reason?, providerStatus? }`
  to a typed error (`error` is the machine code: `not_connected`, `unknown_plugin`,
  `provider_error`, …).

## Zero-context wire-up (the whole story, per language)

A dev who has never seen Corsair needs one value — the **key** (from the
project's Overview) — then one call. The wrapper derives the URL from it.

**TypeScript** (flagship, `createCorsairCloud`):
```ts
import { createCorsairCloud } from "corsair";
const corsair = createCorsairCloud({ apiKey: "ck_cloud_…" });
const pages = await corsair.withTenant("acme").notion.api.pages.searchPage({});
```

**Swift** (`@corsair/CorsairCloud`):
```swift
import CorsairCloud
let corsair = CorsairCloud(apiKey: "ck_cloud_…")
let data = try await corsair.tenant("acme").call("notion", "pages.searchPage", args: [:])
```

**Python** (`corsair-cloud`):
```python
from corsair_cloud import CorsairCloud
corsair = CorsairCloud(api_key="ck_cloud_…")
pages = corsair.with_tenant("acme").call("notion", "pages.searchPage", {})
```

**curl** (the raw truth every wrapper implements — the base is what the key resolves to):
```bash
curl -X POST "https://api.corsair.cloud/<slug>/api/corsair/acme/notion/call/pages.searchPage" \
  -H "authorization: Bearer ck_cloud_…" -H "content-type: application/json" \
  -d '{"args":{}}'
# → { "data": { ...notion result... } }
```

**"What do I have access to?"** — `GET <base>/call` returns the op tree
(`{ notion: ["pages.searchPage", ...] }`); `GET <base>/plugins` returns per-plugin
auth + arg metadata. Wrappers expose these as `discover()` / `plugins.list()`.

## Browser / React (separate, secret-safe)
The `ck_cloud_` key must **never** reach the browser. React uses `CorsairProvider`
pointed at the app's **own same-origin backend proxy** (`/api/corsair/*`) that
injects the bearer server-side; the provider exposes `useCorsair() → { useApi, db }`
(`useApi(pluginOp, args)` = a `useQuery`-shaped hook over `/call`; `db` reserved).
See `clients/react` (todo).

## Build order
1. **Contract** — done + tested (`contract.openapi.yaml` + `contract.test.ts`).
2. **TS** — `createCorsairCloud` (reference). Done.
3. **Swift** — `clients/swift` (this PR).
4. **React** — `CorsairProvider` + `useCorsair` + the backend-proxy snippet.
5. **Python / Go / Rust** — same thin pattern.
