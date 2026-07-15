---
name: corsair-hub
description: Set up Corsair Hub — the self-hosted Corsair SDK (runs in the user's own app) using Hub's hosted relay for OAuth callbacks, connect pages, and approvals. Use when a user wants Corsair inside their own TypeScript app (Next.js, Express, Hono, or any Web-standard server) rather than the hosted Corsair App. Covers install, the /api/corsair route, keys, first-run self-registration, and connecting accounts.
---

# Corsair Hub setup

Wire the Corsair SDK into the user's app so it runs in their process, stores credentials in their database, and uses Hub for the surfaces that need a public URL (OAuth callbacks, connect pages, approvals). Fetch **https://docs.corsair.dev/hub/setup.md** for current snippets and follow it end to end — do not guess the API.

## When to use this

| The user wants… | Use |
| --- | --- |
| Corsair running **in their own app**, credentials in **their** database, Hub for public-URL surfaces | **This skill** — self-hosted SDK + Hub |
| A **hosted** setup where Corsair runs everything (`@corsair-dev/app`, instances/tenants via API) | the `corsair` skill (Corsair App) |
| Fully self-hosted with **no** Hub relay (they host OAuth/approval URLs themselves) | [SDK introduction](https://docs.corsair.dev/getting-started/introduction.md) |

The `/api/corsair` route holds the signing secret and receives Hub's server-to-server delivery, so this requires a **server** — not a client-only SPA. If the user is on Angular/Vue/Svelte as a pure SPA, wire the route into their backend (their SSR server, Express, Hono, etc.).

## Steps

1. **Install** `corsair` and a plugin for the service the user needs — e.g. `npm i corsair @corsair-dev/github`. Ask which integration if unclear; ids are in the [catalog](https://api.corsair.dev/md/integrations). Don't assume a plugin from the repo name.
2. **Create `corsair.ts`** — `createCorsair({ kek, database, hub: { projectApiKey, signingSecret }, plugins })`. Pass the app's own database; Corsair persists connections and synced data there. Hub stores none of it.
3. **Add the `/api/corsair` route.** The setup guide's route step covers every stack — Next.js, Express, and Hono use their named adapters; any other Web-standard runtime (SvelteKit, Remix, Astro, Nuxt, Bun, Deno, Workers) uses `managementHandler`, a `(Request) => Promise<Response>` wired to GET/POST. Backend not in JavaScript? Skip the SDK and use the Hub REST API → https://docs.corsair.dev/hub/rest-api.md
4. **Add keys to `.env`** — `CORSAIR_DEV_API_KEY`, `CORSAIR_DEV_SIGNING_SECRET`, and `CORSAIR_KEK`, copied from the project's **Keys** tab. Use `CORSAIR_PROD_*` for production. Never log or commit secrets.
5. **Start the server.** On the first request the app self-registers its delivery URL — the dashboard's **App sync** indicator turns green. That confirms setup is live. No delivery URL goes in the `hub` config; it is resolved per environment.
6. **Connect accounts.** When a tenant needs OAuth or an API key, mint a connect link in code and send the user to it (see [Connect](https://docs.corsair.dev/management/connect.md)), or use the **Sign-in link** button in the dashboard for testing. Users connect on Hub's hosted page; tokens land encrypted in the user's database.

## Reference

- Setup guide (canonical): https://docs.corsair.dev/hub/setup.md
- Framework route (all stacks, tabbed): https://docs.corsair.dev/adapters/handlers.md
- Hub REST API (non-JS backends): https://docs.corsair.dev/hub/rest-api.md
- Delivery URLs (dev self-registration, production POST): https://docs.corsair.dev/hub/delivery-urls.md
- Environments (dev vs prod keys): https://docs.corsair.dev/hub/environments.md
- Connect / OAuth links: https://docs.corsair.dev/management/connect.md
- Integrations catalog: https://api.corsair.dev/md/integrations
- Doc index: https://docs.corsair.dev/llms.txt
- Dashboard & keys: https://hub.corsair.dev/dashboard

## Safety

- Never log or expose the signing secret, KEK, tenant tokens, or plugin credentials.
- The delivery URL is derived from the app's own config, never from an inbound request header — do not "fix" it by reading request headers.
- Ask the user when the stack, plugin, tenant, or database is ambiguous — do not guess from repo metadata.
