---
name: corsair
description: Use when adding Corsair to a TypeScript app to integrate the app with external services (GitHub, Slack, Linear, Stripe, Gmail, and hundreds more, via OAuth or API keys). Can be used with agents, UIs, webhooks, knowledge bases, etc.
---

# Corsair setup

This skill takes an app from nothing to a working integration, then covers webhooks, workflows, agent access over MCP, and production. Two rules hold throughout. Read the real docs before wiring anything (`https://docs.corsair.dev/llms.txt`). And don't stop when the server runs; you're done when a real API call returns data.

The `/api/corsair` route holds the signing secret and receives Hub's server-to-server delivery, so Corsair needs a server, not a client-only SPA. On a pure SPA (Angular, Vue, or Svelte with no backend), mount the route in a backend such as their SSR server, Express, or Hono. Backend not in JavaScript? Skip the SDK and use the [Hub REST API](https://docs.corsair.dev/hub/rest-api.md).

## Phase 1: plan before you write code

**1. Learn the model.** Fetch `https://docs.corsair.dev/llms.txt` and read the intro and Hub pages first.

**2. Scan the project.** Pre-fill what you can detect, ask only about the gaps:

| Detect | From |
| --- | --- |
| Framework | `next.config.*`, `svelte.config.*`, `nuxt.config.*`, `astro.config.*`, an Express/Hono entry, `package.json` deps |
| Already has Corsair | a `corsair` dep, an existing `/api/corsair` route, a `corsair.ts`, or `CORSAIR_*` env vars → reconfigure, don't re-scaffold |
| Package manager | the lockfile |
| Database | an existing DB handle or ORM; otherwise the fastest path is SQLite via `better-sqlite3` |

**3. Settle the two choices that shape the setup.** Talk these through, don't fire yes/no questions:

- Whose accounts? Just the app's own tools, or its end users' accounts? End users mean multi-tenant (`multiTenancy: true`). That's the common case, so lean that way if unsure.
- Which framework? That decides how the route mounts (table below).

**4. Summarize the plan and confirm it** before touching code.

Terms you'll use. A tenant is one of the app's end users. A plugin is one service. The delivery URL is where Hub sends results; it self-registers on the first request, and the dashboard's header dot turns green once that works.

## Phase 2: implement

```text
New / empty app?  ── install → corsair.ts → /api/corsair route → keys in .env
                                → start server (dot goes green) → connect an account → real API call
Adding to an app? ── detect stack → install → add route → keys → connect the services named
Already wired?    ── reconcile corsair.ts → add the new plugins/features → re-check keys
```

## Install

```bash
npm install corsair @corsair-dev/github
```

Several services at once: `npm install corsair @corsair-dev/slack @corsair-dev/linear`. Plugin packages are scoped `@corsair-dev/<service>`, and their ids are in the [catalog](https://api.corsair.dev/md/integrations). Ask which integration if unclear, don't assume one from the repo name.

Generate a KEK and store it somewhere safe. Lose it and every stored credential is unrecoverable.

```bash
openssl rand -base64 32
```

## Keys and environment

Corsair needs a dev API key, a signing secret, and the KEK in `.env`. The API-key prefix (`ck_dev_` or `ck_prod_`) tells the SDK which environment it's in.

Fastest path: mint a sign-in link with the project name in the query string.

```text
https://hub.corsair.dev/login?title=My%20App
```

The user opens it, signs in with Google, and a workspace and project are created for them. The keys show up on the onboarding screen; copy them into `.env`. Prefer the dashboard? Create a project at `https://hub.corsair.dev/dashboard` and copy the same keys from the Keys tab.

```bash
CORSAIR_DEV_API_KEY=ck_dev_...
CORSAIR_DEV_SIGNING_SECRET=...
CORSAIR_KEK=...
```

Production uses `CORSAIR_PROD_API_KEY` and `CORSAIR_PROD_SIGNING_SECRET`, with the same `CORSAIR_KEK`. Never log or commit secrets.

## Wire `corsair.ts`

```ts
import "dotenv/config";
import { createCorsair } from "corsair";
import { github } from "@corsair-dev/github";

export const corsair = createCorsair({
  kek: process.env.CORSAIR_KEK!,
  database: db, // the app's own DB handle; Corsair persists here, Hub stores nothing
  hub: {
    projectApiKey: (process.env.CORSAIR_PROD_API_KEY ?? process.env.CORSAIR_DEV_API_KEY)!,
    signingSecret: (process.env.CORSAIR_PROD_SIGNING_SECRET ?? process.env.CORSAIR_DEV_SIGNING_SECRET)!,
  },
  plugins: [github()],
  multiTenancy: true, // from the "whose accounts?" choice
});
```

| Field | What it is |
| --- | --- |
| `kek` | Envelope key. Wraps a per-connection DEK that encrypts each credential. |
| `database` | The app's DB handle. Corsair creates five tables (`corsair_integrations`, `corsair_accounts`, `corsair_entities`, `corsair_events`, `corsair_permissions`). |
| `hub` | `{ projectApiKey, signingSecret }` for Hub mode. |
| `plugins` | Configured plugin factories, e.g. `github({ authType: "managed" })`. |
| `multiTenancy` | `true` scopes everything per end user; `false` is for the app's own tools. |
| `permissions` | Optional approval gate. See [permissions](https://docs.corsair.dev/concepts/permissions.md). |

## Add the `/api/corsair` route

Each framework has its own adapter that wraps the shared handler. Pick the one for the stack:

| Framework | Route |
| --- | --- |
| Next.js (App Router), file `app/api/corsair/[[...path]]/route.ts` | `export const { GET, POST, OPTIONS } = toNextJsHandler(corsair, { basePath: "/api/corsair" });` |
| Express | `app.use("/api/corsair", toExpressHandler(corsair, { basePath: "/api/corsair" }));`. Mount it with no body parser. A global `express.json()` before this route re-serializes the body and breaks Hub's signature. If you have one, scope `express.raw({ type: "application/json" })` to this route and register the global parser after it, or capture `req.rawBody`. |
| Hono | `app.all("/api/corsair/*", toHonoHandler(corsair, { basePath: "/api/corsair" }));` |
| SvelteKit / Astro | `export const { GET, POST, OPTIONS } = toSvelteKitHandler(corsair, { basePath: "/api/corsair" });`. Astro uses `toAstroHandler` with the same shape. |
| Remix / React Router | `export const { loader, action } = toRemixHandler(corsair, { basePath: "/api/corsair" });` |
| Nuxt / Nitro | `export default toNuxtHandler(corsair, { basePath: "/api/corsair" });`. Mount it early, before any body parser runs. |
| Web runtimes (Bun, Deno, Workers) | `toWebHandler(corsair, { basePath: "/api/corsair" })` is a `(Request) => Promise<Response>` handler. |

Full per-stack detail: [adapters/handlers](https://docs.corsair.dev/adapters/handlers.md).

Start the server. The first request self-registers the delivery URL with Hub, and the dashboard dot turns green. That's the confirmation the wiring is live. No delivery URL goes in the config; Hub resolves it per environment.

## Connect an account

Mint a connect link server-side and send the user through it. `tenantId` comes from the session, never from user input.

```ts
const { connectUrl } = await corsair.manage.connect.createLink({
  plugin: "github",
  tenantId: session.userId,
});
// redirect the user to connectUrl
```

In React, use `createCorsairReactClient({ baseURL })` and its `useCreateConnectLink` and `useConnectionStatus` hooks. See [adapters/react](https://docs.corsair.dev/adapters/react.md). The user authorizes on Hub's hosted page, and the tokens land encrypted in the user's database.

Don't stop here. Make a real call and confirm the data comes back (below).

## Use it: API calls and stored data

```ts
// call a service
await corsair.slack.api.messages.post({ channel, text });

// read auto-persisted responses back out of the app's DB
await corsair.github.db.repositories.search({});
```

Multi-tenant apps scope every call and query through the tenant:

```ts
const tenant = corsair.withTenant("user_123");
await tenant.github.api.repositories.list({});
await tenant.github.db.repositories.search({}); // only this tenant's rows
```

If you need to see what API and DB operations are available, install the Corsair CLI and use the introspection operations:

```bash
npm install @corsair-dev/cli

npm corsair list # for api operations

npm corsair list --type=db # for db operations

npm corsair schema <endpoint> # to get input / output schema of any operation
```

## Providers: managed vs bring-your-own

`authType` is one of three values:

| `authType` | Use when | Config |
| --- | --- | --- |
| `"managed"` | Fastest. Corsair-hosted OAuth app, no provider registration | `github({ authType: "managed" })` |
| `"oauth_2"` | The user brings their own OAuth app | `linear({ authType: "oauth_2", credentials: { clientId, clientSecret } })` |
| `"api_key"` | Static API key or bot token | `slack({ authType: "api_key", credentials: { botToken } })` |

For which services support bring-your-own OAuth: [auth](https://docs.corsair.dev/concepts/auth.md) and [plugin credentials](https://docs.corsair.dev/guides/plugin-credentials.md).

## Webhooks and triggers

One endpoint handles everything. `processWebhook(corsair, headers, body, { tenantId })` identifies the integration, event, and tenant, verifies the signature, writes the DB, and runs hooks. Enable it per plugin with a secret, and react with `webhookHooks`:

```ts
github({
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  webhookHooks: {
    pullRequestOpened: {
      after: async (ctx, result) => {
        await corsair.withTenant(ctx.tenantId).slack.api.messages.post({ channel: "#eng", text: "PR opened" });
      },
    },
  },
});
```

Route a tenant with a query param on the webhook URL (`?tenantId=user_abc123`). A `before` hook can rewrite args or return `{ continue: false }` to skip. See [webhooks](https://docs.corsair.dev/guides/webhooks.md).

## Workflows

Workflows are event-driven automations built on those webhook hooks. An event fires, the `after` hook runs, and it calls any plugin API. There's no separate engine; it's plain TypeScript. For heavy or long-running work, offload from the hook to a job queue. Guides exist for [Inngest](https://docs.corsair.dev/guides/inngest.md), [Temporal](https://docs.corsair.dev/guides/temporal.md), [Trigger.dev](https://docs.corsair.dev/guides/trigger-dev.md), and [Hatchet](https://docs.corsair.dev/guides/hatchet.md).

## Expose Corsair to an AI agent (MCP)

Install `@corsair-dev/mcp`. It exposes Corsair's tools to agents with no manual schema wiring, through three tools: `list_operations`, `get_schema`, and `run_script`. For Claude Code, use a stdio server (`mcp-server.ts`):

```ts
import "dotenv/config";
import { runStdioMcpServer } from "@corsair-dev/mcp";
import { corsair } from "./corsair";

runStdioMcpServer({ corsair }).catch((err) => {
  console.error("[corsair-mcp] Fatal:", err);
  process.exit(1);
});
```

Register it in `.mcp.json`, then confirm with `/mcp`. The Vercel AI SDK, OpenAI Agents, Mastra, Cursor, and Codex have their own adapters. See [mcp-adapters](https://docs.corsair.dev/mcp-adapters/mcp-adapters.md).

## Permissions and approvals

Gate risky operations. The root config is `permissions: { timeout: "30m", onTimeout: "deny", mode: "asynchronous" }`. Per plugin, set a `mode` (`open | cautious | strict | readonly`) with per-op `overrides` like `"repositories.delete": "deny"` or `"releases.create": "require_approval"`. A `require_approval` op writes a `corsair_permissions` row with a token; approving it lets the agent retry. See [permissions](https://docs.corsair.dev/concepts/permissions.md).

## Go to production

1. Set `CORSAIR_PROD_API_KEY` (`ck_prod_`) and `CORSAIR_PROD_SIGNING_SECRET` in the deploy environment. The `corsair.ts` above prefers them when present, and the `ck_prod_` prefix flips the SDK to production.
2. Register the app's public HTTPS delivery URL in the dashboard Delivery URLs tab and activate production. Dev self-registers; prod is explicit.
3. Deploy. See [environments](https://docs.corsair.dev/hub/environments.md) and [delivery URLs](https://docs.corsair.dev/hub/delivery-urls.md).

Deploying to Vercel? Connect Vercel from the Hub dashboard to push the production keys straight into the project's environment variables instead of copying them by hand.

## Verify end to end

The job isn't done when the server runs. Confirm all three:

- the dashboard dot is green (the delivery URL self-registered);
- an account connects through a minted connect link;
- a real API call returns data.

## Safety

- Never log or expose the signing secret, KEK, tenant tokens, or plugin credentials.
- The delivery URL comes from the app's own config, never from an inbound request header. Don't try to "fix" it by reading request headers.
- `tenantId` comes from the session, never from user input.
- Ask the user when the stack, plugin, tenant, or database is ambiguous. Don't guess from repo metadata.

## Reference

- Doc index: https://docs.corsair.dev/llms.txt
- Setup guide: https://docs.corsair.dev/hub/setup.md
- Route handlers (all stacks): https://docs.corsair.dev/adapters/handlers.md
- Connect and OAuth: https://docs.corsair.dev/management/connect.md
- Environments (dev vs prod): https://docs.corsair.dev/hub/environments.md
- Integrations catalog: https://api.corsair.dev/md/integrations
- Hub REST API (non-JS backends): https://docs.corsair.dev/hub/rest-api.md
- Dashboard and keys: https://hub.corsair.dev/dashboard
