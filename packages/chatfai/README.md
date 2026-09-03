# @corsair-dev/chatfai

ChatFAI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/chatfai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `characters.get` | `chatfai.api.characters.get` | `read` | Get a public ChatFAI character by ID (GET /v1/characters/{id}) |
| `characters.search` | `chatfai.api.characters.search` | `read` | Search public ChatFAI characters by name or keyword (GET /v1/characters/search) |
| `conversations.list` | `chatfai.api.conversations.list` | `read` | List conversations for the authenticated user (GET /v1/conversations) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/chatfai

## License

Apache-2.0
