# @corsair-dev/insightoai

Corsair plugin for [Insighto.ai](https://insighto.ai) — conversational AI assistants, contacts, campaigns, widgets, knowledge bases, telephony (Twilio/WhatsApp), and agency billing.

## Auth setup

Insighto.ai supports **dual auth**. Configure the plugin with the mode that matches your credentials:

| Mode | How credentials are sent | When to use |
| --- | --- | --- |
| `api_key` (default) | `api_key` **query parameter** (not a header) | Dashboard / API keys |
| `oauth_2` | `Authorization: Bearer <token>` | OAuth 2.0 access tokens |

```ts
import { insightoai } from '@corsair-dev/insightoai';

// API key (query param)
const apiKeyPlugin = insightoai({ authType: 'api_key' });

// OAuth 2.0 bearer token
const oauthPlugin = insightoai({ authType: 'oauth_2' });
```

Provide credentials via Corsair key context (`ctx.keys.get_api_key()` / `get_access_token()`), or pass `key` in plugin options for ad-hoc use. Missing credentials throw `AuthMissingError` — the client never sends an empty key.

Base URL: `https://api.insighto.ai`

## Endpoint overview (~65 operations, 9 domains)

| Domain | Operations |
| --- | --- |
| **Assistants, Intents & Prompts** | get/delete assistant; create/get/list intents; link intent to assistant; create/get/delete prompts |
| **AI Providers, Voices & STT** | create/get/delete providers (OpenAI, ElevenLabs, Azure Speech, Cartesia, PlayHT); list STT configs; list custom voices |
| **Contacts, Messaging & Campaigns** | get/list/upsert/bulk-delete contacts; custom fields; campaign contacts; bulk send messages; contact sync logs |
| **Forms & Data Capture** | create/delete form; bulk-delete forms; list captured submissions |
| **Tools & Function Orchestration** | tool / tool-function CRUD; invoke logs; linked tool-user updates |
| **Widgets, Channels & Conversations** | create/get/delete widgets; list widgets by assistant; list channels; list conversations |
| **Knowledge Base & Tags** | get/list datasources; list/unlink assistant datasources; create/list/delete tags; unlink tag entities |
| **Webhooks & Telephony** | webhook CRUD + logs; Twilio auth list/update/delete; WhatsApp user update/delete |
| **Agency, Users & Billing** | create agency; branding; billing plan; pricing; agent list; user profile; monthly usage aggregation |

## Provider quirks

- **API key as query param**: unlike most plugins, `api_key` is appended to the request URL, not sent as a header. This matches Insighto’s documented auth scheme.
- **DELETE with JSON body**: bulk deletes (`deleteContactsInBulk`, `deleteBulkFormsByIds`) send a JSON body on `DELETE`. The client allows bodies on all non-GET methods.
- **Permissive response schemas**: Insighto’s public OpenAPI panel does not always expose full response field schemas; outputs are validated with intentionally flexible Zod shapes and explanatory comments.

## Error handling

- `RATE_LIMIT_ERROR` — HTTP 429 / rate-limit message; retries with `Retry-After` when present
- `AUTH_ERROR` — HTTP 401 / invalid auth; no retry
- `DEFAULT` — always last after caller overrides (custom keys cannot be shadowed)

## Tests

```bash
# Offline schema fixtures (no API key) — required for CI
pnpm --filter @corsair-dev/insightoai test

# Live smoke tests (optional; list endpoints only — no fixture entity IDs)
$env:INSIGHTOAI_API_KEY = "in-..."   # PowerShell
pnpm --filter @corsair-dev/insightoai test
```

Schema fixtures cover every operation. Live smoke tests run only when `INSIGHTOAI_API_KEY` is set and only hit list routes (`/api/v1/contact`, `/api/v1/tag/list`, `/api/v1/channel/list`) so placeholder IDs never 404 a real account.

## Live demo (R4 Loom recording)

```bash
# PowerShell
$env:INSIGHTOAI_API_KEY = "in-..."
pnpm --filter @corsair-dev/insightoai demo

# bash
export INSIGHTOAI_API_KEY=in-...
pnpm --filter @corsair-dev/insightoai demo
```

Or: `node packages/insightoai/scripts/demo.mjs`

Working proof recording (R4): https://www.loom.com/share/2b0c54067e7a413bbf985be1572a425c

## Links

- API docs: https://docs.insighto.ai/api/ragify
- Package: `@corsair-dev/insightoai`
