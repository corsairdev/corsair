# @corsair-dev/openrouter

Corsair plugin for the [OpenRouter API](https://openrouter.ai/docs).

## Auth setup

API-key only.

1. Create a key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Set `OPENROUTER_API_KEY` in your environment, or pass the key via Corsair credentials

Credentials are sent as `Authorization: Bearer <key>`.

Missing credentials throw `AuthMissingError` (never an empty string).

## Endpoint overview

| Operation | OpenRouter path | Description |
|-----------|-----------------|-------------|
| `chatCompletions.create` | `POST /chat/completions` | Chat completions with multi-provider routing, fallbacks, tool calling, and structured output |
| `messages.create` | `POST /messages` | Anthropic Messages API — chat with system prompts and multi-part content |
| `models.list` | `GET /models` | List all models with pricing, context length, and supported parameters |
| `models.count` | `GET /models/count` | Total count of models available on OpenRouter |
| `models.listEmbeddings` | `GET /embeddings/models` | List all embedding models |
| `models.listUser` | `GET /models/user` | List models created by the authenticated user |
| `embeddings.create` | `POST /embeddings` | Generate vector embeddings |
| `modelEndpoints.list` | `GET /models/{author}/{slug}/endpoints` | Per-provider endpoints for a model (pricing, latency, throughput) |
| `providers.list` | `GET /providers` | List providers with privacy policies and data-center regions |
| `zdr.list` | `GET /endpoints/zdr` | Zero-Data Residency (ZDR) endpoint specification for the account |
| `generations.get` | `GET /generation?id={id}` | Request & usage metadata for a previous generation |
| `credits.list` | `GET /credits` | Credit balance & usage; optional Zero-Data Residency (ZDR) report filters |
| `credits.createCoinbaseCharge` | `POST /credits/coinbase` | Create a Coinbase Commerce on-chain charge to top up credits |
| `key.get` | `GET /key` | API key metadata (usage, limits, rate limits) |

No webhooks (OpenRouter's API surface is token-only; there are no signed
inbound events to subscribe to).

## Quirks & caveats

- **Streaming is off by default.** Completion and message calls send
  `stream: false` so responses are a single JSON body (not SSE events).
- **Routing happens automatically.** OpenRouter picks the provider unless you
  pass `provider.order` / `provider.ignore` or pin `models` / `route`.
- **Model availability varies by key.** Free-tier keys only reach a subset of
  providers; `models.list` returns what the key can access.
- **Chat calls cost credits.** Listing models/providers/credits/key works even
  at `$0` balance; chat, message, and embedding calls return HTTP 402 if the
  account has insufficient credits.
- **HTTP 529 (overloaded) is retried** like other 5xx errors with exponential
  backoff (up to 3 attempts).
- **Balances are `data`-wrapped.** `/credits` and `/key` return their payload
  under a `data` key (e.g. `{ data: { total_credits, total_usage } }`).

## Tests

```bash
pnpm --filter @corsair-dev/openrouter test
```

- Offline schema + mocked-client handler tests always run (no API key).
- Live client tests run only when `OPENROUTER_API_KEY` is set.

## Live demo

```bash
# PowerShell
$env:OPENROUTER_API_KEY = "sk-or-..."
pnpm --filter @corsair-dev/openrouter demo

# bash
export OPENROUTER_API_KEY=sk-or-...
pnpm --filter @corsair-dev/openrouter demo
```

The demo (when added) hits key operations against
`https://openrouter.ai/api/v1`. Chat steps need non-zero credits on the
OpenRouter account.