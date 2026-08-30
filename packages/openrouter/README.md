# @corsair-dev/openrouter

Corsair plugin for the [OpenRouter API](https://openrouter.ai/docs).

## Auth setup

API-key only.

1. Create a key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Store it in Corsair credentials, or pass it explicitly with `openrouter({ key })`

Credentials are sent as `Authorization: Bearer <key>`.

Missing credentials throw `AuthMissingError` (never an empty string).
An explicit `options.key` overrides tenant-managed credentials for every tenant.
Setting `OPENROUTER_API_KEY` alone is only used by this package's optional live
tests; application code must pass it through `options.key` or Corsair credentials.

## Endpoint overview

| Operation                | OpenRouter path                         | Description                                                                                  |
| ------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `chatCompletions.create` | `POST /chat/completions`                | Chat completions with multi-provider routing, fallbacks, tool calling, and structured output |
| `messages.create`        | `POST /messages`                        | Anthropic Messages API with image, document, tool-use, and thinking blocks                   |
| `models.list`            | `GET /models`                           | List all models with pricing, context length, and supported parameters                       |
| `models.count`           | `GET /models/count`                     | Total count of models available on OpenRouter                                                |
| `models.listEmbeddings`  | `GET /embeddings/models`                | List all embedding models                                                                    |
| `models.listUser`        | `GET /models/user`                      | List models filtered by the user's provider preferences, privacy settings, and guardrails    |
| `embeddings.create`      | `POST /embeddings`                      | Generate vector embeddings                                                                   |
| `modelEndpoints.list`    | `GET /models/{author}/{slug}/endpoints` | Per-provider endpoints for a model (pricing, latency, throughput)                            |
| `providers.list`         | `GET /providers`                        | List providers with privacy policies and data-center regions                                 |
| `zdr.list`               | `GET /endpoints/zdr`                    | Zero-Data Residency (ZDR) endpoint specification for the account                             |
| `generations.get`        | `GET /generation?id={id}`               | Request & usage metadata for a previous generation                                           |
| `credits.list`           | `GET /credits`                          | Credit balance and usage (management API key required)                                       |
| `key.get`                | `GET /key`                              | API key metadata (usage, limits, rate limits)                                                |

No webhooks (OpenRouter's API surface is token-only; there are no signed
inbound events to subscribe to).

## Quirks & caveats

- **Streaming is not exposed.** Completion and message calls always send
  `stream: false` so responses are a single JSON body, not SSE events.
- **Routing happens automatically.** OpenRouter picks the provider unless you
  pass `provider.order` / `provider.ignore` or pin `models` / `route`.
- **Model availability varies by key.** Free-tier keys only reach a subset of
  providers; `models.list` returns what the key can access.
- **Chat calls cost credits.** Listing models/providers/credits/key works even
  at `$0` balance; chat, message, and embedding calls return HTTP 402 if the
  account has insufficient credits.
- **Transient 5xx and timeout errors are retried only for read operations.**
  Paid chat, message, and embedding writes are not retried because repeating a
  completed request can double-charge the account.
- **Balances are `data`-wrapped.** `/credits` and `/key` return their payload
  under a `data` key (e.g. `{ data: { total_credits, total_usage } }`).

## Tests

```bash
pnpm --filter @corsair-dev/openrouter test
```

- Offline schema + mocked-client handler tests always run (no API key).
- Live client tests run only when `OPENROUTER_API_KEY` is set.

## Working proof

The PR's live recording exercises the integration against OpenRouter:
https://www.loom.com/share/5e7438d01bac4f76b6bcc351950b0f8b
