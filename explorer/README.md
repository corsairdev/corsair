# corsair-explorer

A small standalone Express server that exposes a public, browsable catalog of
every Corsair plugin and every operation (api, webhook, db) it defines.

Deploy this behind a stable URL (e.g. `api.corsair.dev`) and point the
marketing site at it so users can explore plugins they have not installed
locally yet.

This folder is **not** a monorepo workspace package — it ships with its own
`pnpm-workspace.yaml` (empty), its own `package.json`, and its own lockfile,
so it can be containerised or moved elsewhere without dragging the rest of
the repo along. The only link back into the monorepo is the generator
script that produces `data/plugins.json`.

## How it works

1. `../scripts/build-explorer-catalog.ts` (run from the repo root) walks
   `packages/*`, imports each `@corsair-dev/*` plugin, runs
   `introspectPluginForDocs`, and writes a single JSON file at
   `explorer/data/plugins.json`.
2. The Express server in `src/server.ts` reads that JSON at startup,
   builds lookup maps, and serves it over a small REST surface. No runtime
   dependency on `corsair` itself — just a JSON blob.

To regenerate the catalog (run from the repo root):

```bash
pnpm build:explorer-catalog
```

Commit the resulting `explorer/data/plugins.json` alongside your deploy.

## Setup

One-time, from inside this folder:

```bash
cd explorer
pnpm install
```

This creates `explorer/node_modules` and `explorer/pnpm-lock.yaml`,
completely independent of the monorepo.

## Running locally

```bash
pnpm dev
# → http://localhost:4319
```

Environment variables:

| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | `4319` | Port to bind |
| `HOST` | `0.0.0.0` | Host to bind |
| `EXPLORER_CATALOG_PATH` | bundled `data/plugins.json` | Override catalog location |
| `EXPLORER_CORS_ORIGIN` | `*` | CORS allow-origin header |

## Building for production

```bash
pnpm build
pnpm start
```

## REST API

All routes return JSON. Pretty-printed by default.

| Route | Description |
|-------|-------------|
| `GET /health` | Liveness probe. |
| `GET /v1/meta` | Catalog metadata: `generatedAt`, `corsairVersion`, `catalogVersion`, `pluginCount`. |
| `GET /v1/plugins` | Summary list (no operations). |
| `GET /v1/plugins/:id` | Full plugin record. |
| `GET /v1/plugins/:id/api` | All API endpoints. |
| `GET /v1/plugins/:id/api/:shortPath` | One endpoint by short path (e.g. `messages.post`). |
| `GET /v1/plugins/:id/webhooks` | All webhooks. |
| `GET /v1/plugins/:id/webhooks/:shortPath` | One webhook by short path. |
| `GET /v1/plugins/:id/db` | All synced db entities. |
| `GET /v1/plugins/:id/db/:entity` | One entity by name. |
| `GET /v1/search?q=<query>` | Substring match across plugin ids, display names, descriptions, and endpoint short paths. |

Every response includes the `X-Catalog-Generated-At` and `X-Corsair-Version`
headers so clients can invalidate caches when the catalog is rebuilt.

## Programmatic use

```ts
import { createServer, loadCatalog } from 'corsair-explorer';

const catalog = loadCatalog();
const app = createServer({ catalog });
app.listen(4319);
```
