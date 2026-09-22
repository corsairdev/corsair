# @corsair-dev/retellai

Retell AI conversation and transcription plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/retellai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `calls.get` | `retellai.api.calls.get` | `read` | Retrieve a call with its transcript, recording, and post-call analysis. |
| `calls.list` | `retellai.api.calls.list` | `read` | List Retell calls with filters and cursor pagination. |
| `chats.get` | `retellai.api.chats.get` | `read` | Retrieve a chat with its transcript and post-chat analysis. |
| `chats.list` | `retellai.api.chats.list` | `read` | List Retell chats with filters and cursor pagination. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/retellai

## License

Apache-2.0
