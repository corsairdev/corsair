# @corsair-dev/deepseek

Corsair plugin for the [DeepSeek API](https://api-docs.deepseek.com/).

## Auth setup

API-key only.

1. Create a key at [platform.deepseek.com](https://platform.deepseek.com/) → **API Keys**
2. Set `DEEPSEEK_API_KEY` in your environment, or pass the key via Corsair credentials

Credentials are sent as `Authorization: Bearer <key>`.

Missing credentials throw `AuthMissingError` (never an empty string).

## Endpoint overview

| Operation | Operation ID | DeepSeek path | Description |
|-----------|--------------|---------------|-------------|
| `chat.createCompletion` | `DEEPSEEK_CREATE_CHAT_COMPLETION` | `POST /chat/completions` | OpenAI-compatible chat completions |
| `anthropic.createMessage` | `DEEPSEEK_CREATE_ANTHROPIC_MESSAGE` | `POST /anthropic/v1/messages` | Anthropic-compatible messages |
| `user.getBalance` | `DEEPSEEK_GET_USER_BALANCE` | `GET /user/balance` | Account balance / availability |
| `models.list` | `DEEPSEEK_LIST_MODELS` | `GET /models` | List available models |

No webhooks (not part of the DeepSeek REST surface used by this plugin).

## Quirks & caveats

- **Streaming is off by default.** Completion/message calls send `stream: false` so responses are a single JSON body (not SSE).
- **`deepseek-reasoner` ignores sampling params.** `temperature`, `top_p`, `presence_penalty`, and `frequency_penalty` are ignored by the API for reasoner models (still accepted for schema compatibility with chat models).
- **Dual API surfaces.** Chat uses OpenAI-style `/chat/completions`; Anthropic-style messages use `/anthropic/v1/messages` with snake_case fields on the wire (`max_tokens`, etc.).
- **Chat/completions require account balance.** Listing models and reading balance work with a valid key even at `$0`; chat/message calls return HTTP 402 if the account has insufficient balance.

## Tests

```bash
pnpm --filter @corsair-dev/deepseek test
```

- Offline schema tests always run (no API key).
- Live client + endpoint-handler tests run only when `DEEPSEEK_API_KEY` is set.

## Live demo

```bash
# PowerShell
$env:DEEPSEEK_API_KEY = "sk-..."
pnpm --filter @corsair-dev/deepseek demo

# bash
export DEEPSEEK_API_KEY=sk-...
pnpm --filter @corsair-dev/deepseek demo
```

Or: `node packages/deepseek/scripts/demo.mjs`

This hits all four operations against `https://api.deepseek.com` (models → balance → chat → anthropic message). Chat steps need non-zero balance on the DeepSeek account.

Working proof recording (R4): https://www.loom.com/share/a852df00d0cd4ee9a2e7c7ec0ceff94c
