# @corsair-dev/heygen

Corsair plugin for [HeyGen](https://www.heygen.com) AI video generation, interactive avatars, TTS, templates, assets, streaming, and webhooks.

## Auth setup

API-key only. The client sends credentials as the `X-Api-Key` header (HeyGen’s documented auth scheme).

```ts
import { heygen } from '@corsair-dev/heygen';

// Preferred in apps: key from Corsair key context
const plugin = heygen();

// Or static key for scripts / demos
const pluginWithKey = heygen({ key: process.env.HEYGEN_API_KEY });
```

Missing keys throw `AuthMissingError` (never an empty string).

| Host | Purpose |
| --- | --- |
| `https://api.heygen.com` | JSON + multipart API (`makeHeygenRequest`, `makeHeygenMultipartRequest`) |
| `https://upload.heygen.com` | Raw binary uploads (`makeHeygenUploadRequest`) |

Get a free token: [HeyGen Settings → API](https://app.heygen.com/settings?nav=API).

## Endpoint overview

Coverage spans **70+** operations across:

| Domain | Examples |
| --- | --- |
| **Videos** | generate, template generate, WebM, translate, status, list/delete (v1 + v3) |
| **Avatars** | list (v3), groups, photo avatars, looks, talking photos, motion, upscale |
| **Voices / TTS** | Starfish TTS, previews, list v1/v2/v3, design, clone |
| **Streaming** | session lifecycle, ICE, tasks, list avatars/history |
| **Knowledge bases** | create / list / update / delete |
| **Assets & templates** | list/get templates, upload (legacy raw + v3 multipart), folders |
| **Webhooks & quota** | endpoint CRUD, event types, remaining quota, `users/me` |
| **v3 expansions** | video agents, brand kits/glossaries, avatar realtime, lipsync, hyperframes, AI clipping, proofread, video translations |

Paths marked `[B]` in source are best-effort where HeyGen’s public docs are incomplete; verify against a live account before relying on them in production.

## Error handling

- `RATE_LIMIT_ERROR` — HTTP 429 / rate-limit message; retries with `Retry-After` when present
- `AUTH_ERROR` — HTTP 401 / invalid auth; no retry
- `DEFAULT` — always last after caller overrides (custom keys cannot be shadowed)

## Provider quirks

- **Dual hosts** — JSON and multipart go to `api.heygen.com`; talking-photo / legacy asset binary uploads go to `upload.heygen.com`
- **v3 vs legacy envelopes** — v3 list responses use top-level pagination (`data`, `has_more`, `next_token`); many v1/v2 paths still use `{ error, data }`
- **Safe logging** — handlers log IDs/counts only; scripts, prompts, spoken text, and SRT content are never logged
- **Free-tier / quota** — list and `remaining_quota` calls are the cheapest way to prove auth; video generation spends credits

## Tests

```bash
# Offline schema fixtures (no API key) — required for CI
pnpm --filter @corsair-dev/heygen test

# Live smoke tests (optional)
$env:HEYGEN_API_KEY = "..."   # PowerShell
pnpm --filter @corsair-dev/heygen test
```

## Live demo (R4 Loom recording)

```bash
# PowerShell
$env:HEYGEN_API_KEY = "..."
pnpm --filter @corsair-dev/heygen demo

# bash
export HEYGEN_API_KEY=...
pnpm --filter @corsair-dev/heygen demo
```

Or: `node packages/heygen/scripts/demo.mjs`

Working proof recording (R4): https://www.loom.com/share/044e3124b94c419faff2fc838177421e
