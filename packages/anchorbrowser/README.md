# `@corsair-dev/anchorbrowser`

Anchor Browser integration plugin for Corsair.

## Auth / credentials

This provider authenticates via the `anchor-api-key` HTTP header.

Provide the key either:

- Via plugin options:

```ts
import { createCorsair } from "corsair";
import { anchorbrowser } from "@corsair-dev/anchorbrowser";

export const corsair = createCorsair({
  integrations: [
    anchorbrowser({
      key: process.env.ANCHOR_BROWSER_API_KEY,
    }),
  ],
});
```

- Or via Corsair keys (if you’re using a shared key store): the plugin will fall back to `ctx.keys.get_api_key()` when `options.key` is not provided.

## Operations

The plugin exposes **64 operations** covering these endpoint groups:

- **sessions**: create/list/get/stop browser sessions, session actions
- **tasks**: create/get/list tasks, task actions
- **profiles**: create/update/list/get/delete profiles
- **pages**: page navigation and state
- **screenshots**: capture screenshots
- **recordings**: manage recordings

## Demo

The plugin is verified working end-to-end against the live Anchor Browser API:

- **Terminal** — tests and build both pass:

  ![anchorbrowser tests + build passing in the terminal](./scripts/terminal-passing.gif)

- **Browser** — a real session is started via the plugin client, loads an
  educational site (Wikipedia), runs a search, and opens the
  *Photosynthesis* article. Captured live (not a placeholder):

  ![anchorbrowser live search on an educational website](./scripts/browser-demo.gif)

Both GIFs show the plugin working end-to-end against the live Anchor Browser
API: the terminal GIF is the real `pnpm test` + `pnpm build` output, and the
browser GIF is a real session that loads an educational site (Wikipedia), runs
a search, and opens the *Photosynthesis* article.
- **downloads / uploads**: manage transfers
- **events**: event streams and polling helpers
- **extensions / integrations**: manage browser add-ons and external integrations
- **mouse / keyboard / os-level**: input primitives and OS-level controls
- **agent / tools**: AI-agent helper endpoints and tool execution
- **cache-sync**: optional local caching + sync helpers

## Notes / quirks

- Requests are sent to Anchor Browser’s API with the required `anchor-api-key` header.
- Errors are normalized through `error-handlers.ts` (including rate-limit handling for `429`).

