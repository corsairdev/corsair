# Corsair × Mastra demo

A real [Mastra](https://mastra.ai) app that gives an agent Slack tools through
[`@corsair-dev/mastra`](../../adapters/mastra) — managed OAuth, credentials in
your own SQLite database — and runs in Mastra's own playground UI.

## What's wired

- `src/mastra/index.ts` — a `CorsairToolProvider` (the package under test) and a
  Slack `Agent` whose tools come from it. That's the whole integration.
- `corsair.ts` — the Corsair instance the provider wraps (Slack plugin, your DB).
- `llm.ts` — the model, via Corsair's OpenAI-compatible gateway.

## Run

```bash
cp .env.example .env    # fill in your keys
pnpm install
pnpm dev                # Mastra playground → http://localhost:4111
```

Open the playground, pick **Slack Agent**, and ask *"list my Slack channels"*.
The agent calls the Corsair tool and answers with your real channels.

The demo uses an existing Slack connection for its tenant (`CORSAIR_TENANT`).
Connect one once through your Corsair app before chatting.

Uses `@corsair-dev/mastra` straight from this workspace (`workspace:*`), so
you're exercising the unpublished package, not a release.

> **Node 20 note:** `mastra dev` bundles with Babel; on Node 20 pin Babel 7
> (Mastra pulls Babel 8, which is ESM + Node 22-only). Use Node 22+, or add
> `"pnpm": { "overrides": { "@babel/core": "^7.26.0" } }` at the workspace root.
