# @corsair-dev/cursor

Cursor plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cursor
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getMe` | `cursor.api.account.getMe` | `read` | Retrieve API key information including name, creation date, and owner email |
| `agents.getConversation` | `cursor.api.agents.getConversation` | `read` | Retrieve the conversation history for a specific cloud agent |
| `agents.list` | `cursor.api.agents.list` | `read` | Retrieve a paginated list of Cursor Cloud agents |
| `models.list` | `cursor.api.models.list` | `read` | Retrieve the list of available AI models in Cursor |
| `repositories.list` | `cursor.api.repositories.list` | `read` | List GitHub repositories accessible to the authenticated user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cursor

## License

Apache-2.0
